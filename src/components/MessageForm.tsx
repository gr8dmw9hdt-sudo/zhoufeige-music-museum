"use client";

import { useState } from "react";

const MAX_LEN = 500;

export default function MessageForm() {
  const [nickname, setNickname] = useState("");
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setDone(false);
    const text = content.trim();
    if (!text) {
      setError("想说点什么吧");
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: nickname.trim(), content: text }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "提交失败，请稍后再试");

      setDone(true);
      setNickname("");
      setContent("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "提交失败，请稍后再试");
    } finally {
      setSending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-moon/10 bg-white/[0.02] p-6"
    >
      <label className="block text-sm">
        <span className="text-mist">昵称</span>
        <input
          type="text"
          value={nickname}
          maxLength={20}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="匿名"
          className="mt-1 w-full rounded-md border border-white/10 bg-night-deep px-3 py-2 text-paper placeholder:text-mist/50 focus:border-moon/50 focus:outline-none"
        />
      </label>

      <label className="mt-4 block text-sm">
        <span className="text-mist">想对菲戈说的话</span>
        <textarea
          value={content}
          maxLength={MAX_LEN}
          rows={4}
          onChange={(e) => setContent(e.target.value)}
          placeholder="深夜里，把想说的写在这里……"
          className="mt-1 w-full resize-y rounded-md border border-white/10 bg-night-deep px-3 py-2 text-paper placeholder:text-mist/50 focus:border-moon/50 focus:outline-none"
        />
        <span className="mt-1 block text-right text-xs text-mist/60">
          {content.length} / {MAX_LEN}
        </span>
      </label>

      <div className="mt-4 flex items-center gap-4">
        <button
          type="submit"
          disabled={sending}
          className="cursor-pointer rounded-full bg-moon px-6 py-2.5 text-sm font-medium text-night-deep transition-all duration-300 hover:-translate-y-0.5 hover:bg-moon/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {sending ? "提交中…" : "贴上去"}
        </button>
        {done && (
          <span className="text-sm text-moon">已提交，审核通过后上墙 ↗</span>
        )}
        {error && <span className="text-sm text-vermilion">{error}</span>}
      </div>
    </form>
  );
}
