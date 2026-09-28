"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "登录失败");
      router.refresh();
    } catch (err2) {
      setErr(err2 instanceof Error ? err2.message : "登录失败");
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm px-6 py-24">
      <p className="text-sm tracking-[0.3em] text-mist">ADMIN</p>
      <h1 className="mt-3 font-[family-name:var(--font-fraunces)] text-4xl text-moon">
        审核后台
      </h1>
      <form
        onSubmit={submit}
        className="mt-8 rounded-2xl border border-moon/10 bg-white/[0.02] p-6"
      >
        <label className="block text-sm">
          <span className="text-mist">管理密码</span>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            className="mt-1 w-full rounded-md border border-white/10 bg-night-deep px-3 py-2 text-paper placeholder:text-mist/50 focus:border-moon/50 focus:outline-none"
          />
        </label>
        <div className="mt-4 flex items-center gap-4">
          <button
            type="submit"
            disabled={busy}
            className="cursor-pointer rounded-full bg-moon px-6 py-2.5 text-sm font-medium text-night-deep transition-all duration-300 hover:-translate-y-0.5 hover:bg-moon/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? "验证中…" : "进入"}
          </button>
          {err && <span className="text-sm text-vermilion">{err}</span>}
        </div>
      </form>
    </div>
  );
}
