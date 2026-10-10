import { NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase";

export const runtime = "edge";

const MAX_PATH_LEN = 200;

// 上传流程已改为「浏览器直传 Supabase（TUS）」，本接口只负责把元信息写入审核队列。
// 因此这里只接收轻量 JSON，不再接收文件本体（绕过 Cloudflare 的 100MB 请求体上限）。
export async function POST(req: Request) {
  const supabase = getAdminSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "尚未接入数据库" }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "无效的请求" }, { status: 400 });
  }

  const { storage_path, type, nickname, caption } = (body ?? {}) as {
    storage_path?: string;
    type?: string;
    nickname?: string;
    caption?: string;
  };

  if (
    !storage_path ||
    typeof storage_path !== "string" ||
    storage_path.length > MAX_PATH_LEN ||
    storage_path.includes("/")
  ) {
    return NextResponse.json({ error: "缺少文件信息" }, { status: 400 });
  }
  if (type !== "image") {
    return NextResponse.json({ error: "影像馆暂仅支持图片投稿" }, { status: 400 });
  }

  const nick = String(nickname ?? "").trim().slice(0, 20) || "匿名";
  const capRaw = String(caption ?? "").trim().slice(0, 100);
  const cap = capRaw || null;

  const { error: insErr } = await supabase.from("gallery_items").insert({
    nickname: nick,
    type,
    storage_path,
    caption: cap,
    status: "pending",
  });
  if (insErr) {
    return NextResponse.json({ error: insErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
