import type { Metadata } from "next";
import { interviews } from "@/data/interviews";
import PlatformIcon from "@/components/PlatformIcon";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "访谈",
  description:
    "B站、抖音博主对周菲戈的专访与访谈——听他聊音乐、聊创作、聊巡演，从这里更懂他。",
};

export default function InterviewsPage() {
  const featured =
    interviews.find((i) => i.platform === "B站" && i.bvid) ?? null;

  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <Reveal>
        <header className="mb-12">
          <p className="kicker">INTERVIEWS</p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl text-moon">
            听他聊聊
          </h1>
          <p className="mt-4 max-w-2xl text-paper/85">
            音乐之外，他在这些专访里聊创作、聊现场、聊那些深夜里写下的歌——从这里开始认识他。
          </p>
        </header>
      </Reveal>

      {featured && (
        <Reveal delay={0.1}>
          <section className="mb-10">
            <div className="overflow-hidden rounded-2xl border border-paper-line bg-paper-surface">
              <iframe
                src={`//player.bilibili.com/player.html?bvid=${featured.bvid}&page=1&high_quality=1`}
                title={featured.title}
                allowFullScreen
                className="aspect-video w-full bg-night-deep"
              />
              <div className="p-6">
                <div className="text-sm text-moon/90">{featured.host}</div>
                <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-paper">
                  {featured.title}
                </h2>
                {featured.hook && (
                  <p className="mt-2 text-paper/85">{featured.hook}</p>
                )}
              </div>
            </div>
          </section>
        </Reveal>
      )}

      <Reveal delay={featured ? 0.15 : 0.1}>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {interviews.map((i) => (
            <li key={i.title}>
              <a
                href={i.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full cursor-pointer flex-col rounded-2xl border border-paper-line bg-paper-surface p-6 transition-all duration-300 hover:border-moon/40"
              >
                <div className="flex items-center gap-2">
                  <PlatformIcon
                    name={i.platform}
                    className="h-4 w-4 text-moon/80"
                  />
                  <span className="text-xs tracking-[0.2em] text-mist">
                    {i.platform}
                  </span>
                  {i.date && (
                    <span className="ml-auto text-xs text-mist/80">{i.date}</span>
                  )}
                </div>
                <h3 className="mt-3 font-[family-name:var(--font-display)] text-xl text-paper transition-colors duration-300 group-hover:text-moon">
                  {i.title}
                </h3>
                <p className="mt-1 text-sm text-mist">{i.host}</p>
                {i.hook && <p className="mt-3 text-sm text-paper/85">{i.hook}</p>}
                <div className="mt-auto pt-4 text-moon/70 transition-all duration-300 group-hover:translate-x-1 group-hover:text-moon">
                  观看 ↗
                </div>
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}
