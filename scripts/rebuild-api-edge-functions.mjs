#!/usr/bin/env node
// Fixes a bug in the deprecated @vercel/next toolchain (bundled with Vercel
// CLI) where `vercel build` collapses the 4 API route edge functions
// (/api/admin/login|logout|moderate, /api/gallery) into a single handler: one
// route's .func directory is written for real and the other three are symlinked
// to it, so every /api/* route runs the same code (all returning "尚未接入数据库").
//
// The correct, distinct handler code exists in .next/server/ — only the
// write-out into .vercel/output/functions is broken. This script reconstructs
// each of the 4 API functions directly from .next/server/, byte-for-byte the
// way @vercel/next's getNextjsEdgeFunctionSource() would have produced it, and
// replaces the collapsed symlinks with real directories.
//
// Run after `vercel build`, before `next-on-pages`.

import {
  readFile,
  writeFile,
  readdir,
  rm,
  mkdir,
  lstat,
} from "node:fs/promises";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join, dirname } from "node:path";

const require = createRequire(import.meta.url);
const ROOT = process.cwd();
const NEXT_DIR = join(ROOT, ".next");
const SERVER_DIR = join(NEXT_DIR, "server");
const FUNCTIONS_DIR = join(ROOT, ".vercel", "output", "functions");

const SOURCE_MAP_COMMENT_REGEX =
  /^\s*?\/[/*][@#]\s+?sourceMappingURL=data:(((?:application|text)\/json)(?:;charset=([^;,]+?)?)?)?(?:;(base64))?,(.*?)$/gm;

function isValidSourceMapData(encoding, data) {
  if (encoding !== "base64") return false;
  data = data.replace(/\s/g, "").replace(/\*\//g, "");
  return /^[a-zA-Z0-9+=/]+$/.test(data);
}

function removeInlinedSourceMap(source) {
  for (const m of source.matchAll(SOURCE_MAP_COMMENT_REGEX)) {
    if (!isValidSourceMapData(m[4], m[5])) continue;
    source = source.replace(m[0], "");
  }
  return source;
}

// The `get-nextjs-edge-function` runtime loader is embedded in @vercel/next as
// a minified single-quoted string. Extract and unescape it so we can emit the
// identical wrapper @vercel/next would have produced.
function extractEdgeFunctionLoader() {
  const src = readFileSync(require.resolve("@vercel/next"), "utf8");
  const marker = "dist/___get-nextjs-edge-function.js";
  const modIdx = src.indexOf(marker);
  if (modIdx === -1) {
    throw new Error("Could not locate get-nextjs-edge-function module in @vercel/next");
  }
  const exportIdx = src.indexOf("module2.exports = '", modIdx);
  if (exportIdx === -1) {
    throw new Error("Could not locate loader export in @vercel/next");
  }
  const start = exportIdx + "module2.exports = '".length;
  let i = start;
  while (i < src.length) {
    const ch = src[i];
    if (ch === "\\") {
      i += 2;
      continue;
    }
    if (ch === "'") break;
    i += 1;
  }
  const raw = src.slice(start, i);
  // Unescape a JS single-quoted string literal.
  let out = "";
  for (let j = 0; j < raw.length; j++) {
    if (raw[j] !== "\\") {
      out += raw[j];
      continue;
    }
    const c = raw[++j];
    switch (c) {
      case "n": out += "\n"; break;
      case "r": out += "\r"; break;
      case "t": out += "\t"; break;
      case "b": out += "\b"; break;
      case "f": out += "\f"; break;
      case "v": out += "\v"; break;
      case "0": out += "\0"; break;
      default: out += c; break; // \\ \' \" etc.
    }
  }
  return out;
}

async function buildWrappedSource(files, params, loader) {
  const chunks = ["globalThis._ENTRIES = {};"];
  for (const filePath of files) {
    // middleware-manifest `files` are relative to `.next`, not `.next/server`.
    const fullFilePath = join(NEXT_DIR, filePath);
    const content = await readFile(fullFilePath, "utf8");
    chunks.push("\n/**/;");
    chunks.push(removeInlinedSourceMap(content));
  }
  const chunksSource = chunks.join("");

  const pageMatchCode = `(function () {
    const module = { exports: {}, loaded: false };
    const fn = (function(module,exports) {${loader}
});
    fn(module, module.exports);
    return module.exports;
  })`;

  // Mirror the sourcemapped`...` template literal in @vercel/next exactly.
  return (
    "\n  \n  " +
    chunksSource +
    ";\n  export default " +
    pageMatchCode +
    ".call({}).default(\n    " +
    JSON.stringify(params) +
    "\n  )"
  );
}

async function pathExists(p) {
  try {
    await lstat(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const manifest = JSON.parse(
    await readFile(join(SERVER_DIR, "middleware-manifest.json"), "utf8")
  );
  const appPathRoutes = JSON.parse(
    await readFile(join(NEXT_DIR, "app-path-routes-manifest.json"), "utf8")
  );
  const routesManifest = JSON.parse(
    await readFile(join(NEXT_DIR, "routes-manifest.json"), "utf8")
  );

  const loader = extractEdgeFunctionLoader();

  // Reference .vc-config.json from a page edge function that built correctly.
  const refConfig = JSON.parse(
    await readFile(join(FUNCTIONS_DIR, "gallery.func", ".vc-config.json"), "utf8")
  );

  const functions = manifest.functions ?? {};
  let fixed = 0;

  for (const [rawRoute, fn] of Object.entries(functions)) {
    // Only the API routes are affected; the page edge functions build fine.
    if (!rawRoute.startsWith("/api/")) continue;

    const shortPath = (appPathRoutes[rawRoute] || "").replace(/^\//, "");
    if (!shortPath) {
      console.error(`[rebuild-api-edge-functions] missing app-path mapping for ${rawRoute}`);
      continue;
    }

    const params = {
      name: fn.name, // raw name e.g. "app/api/admin/login/route"
      staticRoutes: routesManifest.staticRoutes,
      dynamicRoutes: (routesManifest.dynamicRoutes ?? []).filter(
        (r) => !("isMiddleware" in r)
      ),
      nextConfig: {
        basePath: routesManifest.basePath,
        i18n: routesManifest.i18n,
      },
    };

    const indexJs = await buildWrappedSource(fn.files, params, loader);

    // .vercel/output/functions/api/admin/login.func
    const targetDir = join(
      FUNCTIONS_DIR,
      ...shortPath.split("/").map((seg, idx, arr) =>
        idx === arr.length - 1 ? seg + ".func" : seg
      )
    );

    // Remove any existing dir or symlink at the target.
    await rm(targetDir, { recursive: true, force: true });
    await mkdir(dirname(targetDir), { recursive: true });
    await mkdir(targetDir, { recursive: true });

    const config = {
      ...refConfig,
      name: shortPath,
      environment: fn.env ?? refConfig.environment,
    };

    await writeFile(join(targetDir, "index.js"), indexJs, "utf8");
    await writeFile(
      join(targetDir, ".vc-config.json"),
      JSON.stringify(config, null, 2) + "\n",
      "utf8"
    );

    console.log(
      `[rebuild-api-edge-functions] wrote ${shortPath} (${rawRoute})`
    );
    fixed++;
  }

  // Drop the pointless *.rsc.func symlinks for API routes — they are page-only
  // artifacts and the collapsed build points them at the wrong handler.
  const apiRoot = join(FUNCTIONS_DIR, "api");
  async function removeRscSymlinks(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const p = join(dir, entry.name);
      if (entry.isDirectory()) await removeRscSymlinks(p);
      else if (entry.isSymbolicLink() && entry.name.endsWith(".rsc.func")) {
        await rm(p, { force: true });
        console.log(`[rebuild-api-edge-functions] removed ${p}`);
      }
    }
  }
  await removeRscSymlinks(apiRoot);

  if (fixed === 0) {
    console.error("[rebuild-api-edge-functions] no API functions found — is .next built?");
    process.exit(1);
  }
  console.log(`[rebuild-api-edge-functions] fixed ${fixed} API edge functions`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
