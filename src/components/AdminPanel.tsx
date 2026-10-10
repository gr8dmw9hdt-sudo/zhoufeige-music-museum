"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PendingGallery, VisitStats, VisitRow } from "@/app/admin/page";

const btnBase =
  "cursor-pointer rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50";

function formatBeijing(iso: string): string {
  return new Date(iso).toLocaleString("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

// 国家代码 → 中文名（"CN" → "中国"）；不支持时回退原代码
let regionNames: Intl.DisplayNames | null = null;
function countryName(code: string): string {
  try {
    regionNames ??= new Intl.DisplayNames(["zh-CN"], { type: "region" });
    return regionNames.of(code) ?? code;
  } catch {
    return code;
  }
}

// 位置：国家 · 地区 · 城市（Cloudflare 提供的粗粒度信息，非精确地址）
function formatGeo(v: VisitRow): string {
  const parts = [
    v.country ? countryName(v.country) : "",
    v.region ?? "",
    v.city ?? "",
  ];
  return parts.filter(Boolean).join(" · ") || "位置未知";
}

export default function AdminPanel({
  gallery,
  stats,
}: {
  gallery: PendingGallery[];
  stats: VisitStats;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState("");

  async function moderate(
    table: "gallery_items",
    id: string,
    status: "approved" | "rejected",
  ) {
    setBusy(id);
    setErr("");
    try {
      const res = await fetch("/api/admin/moderate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table, id, status }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "操作失败");
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "操作失败");
      setBusy(null);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  const total = gallery.length;
  const maxVisits = Math.max(1, ...stats.daily.map((d) => d.visits));

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <header className="mb-8 flex items-end justify-between">
        <div>
          <p className="kicker">ADMIN</p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl text-moon">
            审核后台
          </h1>
          <p className="mt-2 text-sm text-mist">待审核 {total} 条</p>
        </div>
        <button
          onClick={logout}
          className="cursor-pointer rounded-full border border-moon/30 px-4 py-1.5 text-xs text-paper/70 transition-colors hover:border-moon/70 hover:text-moon"
        >
          退出
        </button>
      </header>

      {/* 访问统计 */}
      <section className="mb-8 rounded-2xl border border-paper-line bg-paper-surface p-6">
        <h2 className="text-lg text-paper/90">访问统计</h2>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-mist">总访问量</div>
            <div className="mt-1 text-2xl tabular-nums text-moon">
              {stats.total.toLocaleString("zh-CN")}
            </div>
          </div>
          <div>
            <div className="text-xs text-mist">今日</div>
            <div className="mt-1 text-2xl tabular-nums text-moon">
              {stats.today.toLocaleString("zh-CN")}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 text-xs text-mist">最近 30 天</div>
          {stats.daily.length === 0 ? (
            <p className="text-sm text-mist">暂无数据</p>
          ) : (
            <ul className="space-y-1.5">
              {stats.daily.map((d) => {
                const width = Math.max(2, (d.visits / maxVisits) * 100);
                return (
                  <li key={d.day} className="flex items-center gap-3 text-sm">
                    <span className="w-20 shrink-0 text-mist">{d.day.slice(5)}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full bg-moon/60"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                    <span className="w-12 shrink-0 text-right tabular-nums text-paper/80">
                      {d.visits}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="mt-6">
          <div className="mb-2 text-xs text-mist">
            最近访问（30 条）
            <span className="ml-2 text-mist/70">
              位置为 Cloudflare 提供的国家/城市级，非精确地址
            </span>
          </div>
          {stats.recent.length === 0 ? (
            <p className="text-sm text-mist">暂无数据</p>
          ) : (
            <ul className="space-y-1 text-sm">
              {stats.recent.map((v, i) => (
                <li
                  key={`${v.visited_at}-${i}`}
                  className="flex items-baseline justify-between gap-3"
                >
                  <span className="tabular-nums text-paper/80">
                    {formatBeijing(v.visited_at)}
                  </span>
                  <span
                    className="truncate text-xs text-mist"
                    title={v.timezone ?? undefined}
                  >
                    {formatGeo(v)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {err && <p role="alert" className="mb-4 text-sm text-vermilion">{err}</p>}

      {total === 0 && (
        <p className="rounded-xl border border-paper-line bg-paper-surface p-8 text-center text-mist">
          没有待审核的内容 🎉
        </p>
      )}

      {gallery.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg text-paper/90">影像（{gallery.length}）</h2>
          <ul className="space-y-3">
            {gallery.map((g) => (
              <li
                key={g.id}
                className="flex gap-4 rounded-xl border border-paper-line bg-paper-surface p-4"
              >
                {g.type === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={g.url}
                    alt=""
                    className="h-20 w-20 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-night-deep text-2xl">
                    🎬
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="text-sm text-moon/90">{g.nickname}</div>
                  {g.caption && (
                    <p className="mt-1 text-xs text-paper/75">{g.caption}</p>
                  )}
                  <div className="mt-2 flex gap-2">
                    <button
                      disabled={busy === g.id}
                      onClick={() => moderate("gallery_items", g.id, "approved")}
                      className={`${btnBase} bg-moon text-night-deep hover:bg-moon/90`}
                    >
                      通过 ✅
                    </button>
                    <button
                      disabled={busy === g.id}
                      onClick={() => moderate("gallery_items", g.id, "rejected")}
                      className={`${btnBase} border border-white/15 text-paper/70 hover:border-vermilion/60 hover:text-vermilion`}
                    >
                      驳回 ❌
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
