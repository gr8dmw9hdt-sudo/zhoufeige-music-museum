import type { Metadata } from "next";
import MessageForm from "@/components/MessageForm";
import { getAdminSupabase } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "留言墙",
  description:
    "写给周菲戈的话：把深夜里想说的，留在这面墙上。审核通过后上墙。",
};

// 内容随留言实时变化，按请求动态渲染
export const runtime = "edge";
export const dynamic = "force-dynamic";

type Message = {
  id: string;
  nickname: string;
  content: string;
  status: string;
  created_at: string;
};

function fmtDate(s: string) {
  const d = new Date(s);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export default async function MessagesPage() {
  const supabase = getAdminSupabase();
  const items: Message[] = supabase
    ? (
        await supabase
          .from("messages")
          .select("*")
          .eq("status", "approved")
          .order("created_at", { ascending: false })
      ).data ?? []
    : [];

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <header className="mb-10">
        <p className="text-sm tracking-[0.3em] text-mist">MESSAGE WALL</p>
        <h1 className="mt-3 font-[family-name:var(--font-fraunces)] text-5xl text-moon">
          留言墙
        </h1>
        <p className="mt-4 text-paper/70">
          深夜里，把想对菲戈说的话写下来。审核通过后，就会亮在这面墙上。
        </p>
      </header>

      <section className="mb-14">
        <MessageForm />
      </section>

      {supabase && (
        <section>
          {items.length === 0 ? (
            <p className="text-mist">墙上还空着，来做第一个留言的人吧。</p>
          ) : (
            <ul className="space-y-4">
              {items.map((m) => (
                <li
                  key={m.id}
                  className="rounded-2xl border border-white/5 bg-white/[0.02] p-6"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-sm text-moon/90">{m.nickname}</span>
                    <span className="text-xs text-mist/60">
                      {fmtDate(m.created_at)}
                    </span>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-paper/85">
                    {m.content}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
