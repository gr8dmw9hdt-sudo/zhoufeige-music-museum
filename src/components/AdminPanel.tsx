"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PendingGallery, PendingMessage } from "@/app/admin/page";

const btnBase =
  "cursor-pointer rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50";

export default function AdminPanel({
  messages,
  gallery,
}: {
  messages: PendingMessage[];
  gallery: PendingGallery[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState("");

  async function moderate(
    table: "messages" | "gallery_items",
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

  const total = messages.length + gallery.length;

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <header className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-sm tracking-[0.3em] text-mist">ADMIN</p>
          <h1 className="mt-2 font-[family-name:var(--font-fraunces)] text-4xl text-moon">
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

      {err && <p className="mb-4 text-sm text-vermilion">{err}</p>}

      {total === 0 && (
        <p className="rounded-xl border border-white/5 bg-white/[0.02] p-8 text-center text-mist">
          没有待审核的内容 🎉
        </p>
      )}

      {messages.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-lg text-paper/90">留言（{messages.length}）</h2>
          <ul className="space-y-3">
            {messages.map((m) => (
              <li
                key={m.id}
                className="rounded-xl border border-white/5 bg-white/[0.02] p-4"
              >
                <div className="text-sm text-moon/90">{m.nickname}</div>
                <p className="mt-2 whitespace-pre-wrap text-paper/85">{m.content}</p>
                <div className="mt-3 flex gap-2">
                  <button
                    disabled={busy === m.id}
                    onClick={() => moderate("messages", m.id, "approved")}
                    className={`${btnBase} bg-moon text-night-deep hover:bg-moon/90`}
                  >
                    通过 ✅
                  </button>
                  <button
                    disabled={busy === m.id}
                    onClick={() => moderate("messages", m.id, "rejected")}
                    className={`${btnBase} border border-white/15 text-paper/70 hover:border-vermilion/60 hover:text-vermilion`}
                  >
                    驳回 ❌
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {gallery.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg text-paper/90">影像（{gallery.length}）</h2>
          <ul className="space-y-3">
            {gallery.map((g) => (
              <li
                key={g.id}
                className="flex gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4"
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
                    <p className="mt-1 text-xs text-paper/60">{g.caption}</p>
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
