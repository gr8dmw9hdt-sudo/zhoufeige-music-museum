import type { Metadata } from "next";
import Link from "next/link";
import { earsByNewest, latestIssue } from "@/data/ears";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "耳畔",
  description:
    "【耳畔 · IN YOUR EAR】深夜音乐馆的文字版音乐电台，每周一期，介绍周菲戈的原创作品与翻唱现场，附收听方式。",
};

const vol = (n: number) => `VOL.${String(n).padStart(2, "0")}`;

export default function RadioPage() {
  const rest = earsByNewest.slice(1);

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <Reveal>
        <header className="mb-14">
          <p className="kicker">耳畔 · IN YOUR EAR</p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl text-moon">
            深夜电台
          </h1>
          <p className="mt-4 max-w-2xl text-paper/85">
            一张唱片，一段深夜。每周一期，把菲戈的原创作品和翻唱现场，连同听歌时的心事一起念给你听——文末附收听方式，边听边读。
          </p>
        </header>
      </Reveal>

      {/* 最新一期 */}
      <Reveal delay={0.1}>
        <Link
          href={`/radio/${latestIssue.slug}`}
          className="group block cursor-pointer rounded-2xl border border-moon/30 bg-paper-surface p-8 transition-all duration-300 hover:border-moon/60"
        >
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="ear-air h-1.5 w-1.5 rounded-full bg-vermilion" />
              <span className="text-[0.65rem] tracking-[0.28em] text-vermilion">
                ON AIR
              </span>
            </span>
            <span className="text-xs tracking-[0.24em] text-mist">
              {vol(latestIssue.number)} · 最新一期
            </span>
            <span className="ml-auto text-xs tabular-nums text-mist/80">
              {latestIssue.date}
            </span>
          </div>

          <h2 className="mt-6 font-[family-name:var(--font-display)] text-4xl text-paper transition-colors duration-300 group-hover:text-moon">
            {latestIssue.title}
          </h2>
          <p className="mt-2 text-sm tracking-[0.18em] text-mist">
            {latestIssue.station} · {latestIssue.song.artist}
          </p>
          {latestIssue.epigraph && (
            <p className="mt-5 text-paper/85">{latestIssue.epigraph}</p>
          )}
          <p className="mt-3 line-clamp-3 text-sm leading-[1.9] text-paper/70">
            {latestIssue.lead[0]}
          </p>

          <div className="mt-6 text-sm text-moon/80 transition-all duration-300 group-hover:translate-x-1 group-hover:text-moon">
            阅读本期 →
          </div>
        </Link>
      </Reveal>

      {/* 往期 */}
      {rest.length > 0 && (
        <Reveal delay={0.15}>
          <section className="mt-16">
            <p className="kicker mb-6">往期 / ARCHIVE</p>
            <ul className="divide-y divide-white/5">
              {rest.map((issue) => (
                <li key={issue.slug}>
                  <Link
                    href={`/radio/${issue.slug}`}
                    className="group flex flex-wrap items-baseline gap-x-4 gap-y-1 py-4"
                  >
                    <span className="w-16 font-[family-name:var(--font-display)] text-mist">
                      {vol(issue.number)}
                    </span>
                    <span className="text-lg text-paper transition-colors duration-300 group-hover:text-moon">
                      {issue.title}
                    </span>
                    <span className="text-sm text-mist">
                      {issue.song.artist}
                    </span>
                    <span className="ml-auto text-xs tabular-nums text-mist/80">
                      {issue.date}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>
      )}

      {rest.length === 0 && (
        <p className="mt-16 text-sm text-mist">
          第一期才刚刚开始——下一期在路上，改天再来听。
        </p>
      )}
    </div>
  );
}
