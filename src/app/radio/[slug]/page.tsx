import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getIssue } from "@/data/ears";
import JsonLd from "@/components/JsonLd";
import ListenButton from "@/components/ListenButton";
import Reveal from "@/components/Reveal";

/**
 * 单期页按请求渲染：内容虽来自静态数据，但刻意不做 generateStaticParams 预渲染。
 * 原因：Cloudflare 部署走 `vercel build`，而 Windows 上的 @vercel/next 生成 lambda 时
 * 用 path.join 造出反斜杠键 `radio\[slug]`，预渲染路由却用 posix 键 `/radio/[slug]` 去查，
 * 必然查不到并报 "Unable to find lambda for route: /radio/jinye-de-wange"。
 * 做成动态路由后该分支不再执行；边缘函数按 slug 查表，未登记的 slug 交给 notFound()。
 */
export const runtime = "edge";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const issue = getIssue(slug);
  if (!issue) return { title: "耳畔" };
  const vol = String(issue.number).padStart(2, "0");
  return {
    title: `${issue.title}｜耳畔 VOL.${vol}`,
    description: issue.epigraph ?? issue.lead[0],
    openGraph: {
      title: `${issue.title}｜耳畔 VOL.${vol}`,
      description: issue.epigraph ?? issue.lead[0],
      type: "article",
      publishedTime: issue.date,
    },
  };
}

export default async function EarIssuePage({ params }: PageProps) {
  const { slug } = await params;
  const issue = getIssue(slug);
  if (!issue) notFound();

  const vol = String(issue.number).padStart(2, "0");

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${issue.title}｜耳畔 VOL.${vol}`,
    datePublished: issue.date,
    inLanguage: "zh-CN",
    author: { "@type": "Organization", name: "24:01 深夜音乐馆" },
    about: {
      "@type": "MusicRecording",
      name: issue.song.title,
      byArtist: { "@type": "Person", name: issue.song.artist },
    },
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <JsonLd data={articleJsonLd} />

      <Reveal>
        <header>
          <p className="kicker">
            耳畔 · VOL.{vol} · {issue.station}
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl text-moon">
            {issue.title}
          </h1>
          <p className="mt-4 text-sm tracking-[0.18em] text-mist">
            {issue.song.artist} · {issue.date}
          </p>
        </header>
      </Reveal>

      {/* 收听方式：切的就是全站背景音乐（本期这首） */}
      <Reveal delay={0.1}>
        <section className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3 rounded-2xl border border-paper-line bg-paper-surface p-6">
          <ListenButton title={issue.song.title} />
          <span className="text-xs text-mist">
            点开即听本站的副歌 30 秒片段（与右下角唱片同一首），完整版请到官方平台
          </span>
          <div className="ml-auto flex flex-wrap gap-4 text-sm">
            {issue.song.link && (
              <a
                href={issue.song.link}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer text-moon/80 transition-colors duration-300 hover:text-moon"
              >
                网易云 ↗
              </a>
            )}
            {issue.albumLink && (
              <a
                href={issue.albumLink}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer text-moon/80 transition-colors duration-300 hover:text-moon"
              >
                专辑《24:01》↗
              </a>
            )}
          </div>
        </section>
      </Reveal>

      {/* 导语 */}
      <Reveal delay={0.15}>
        <div className="mt-12 space-y-4">
          {issue.lead.map((p) => (
            <p key={p} className="leading-[2] text-paper/90">
              {p}
            </p>
          ))}
        </div>
        <div className="rule my-12" />
      </Reveal>

      {/* 制作名单（唱片内页式两栏） */}
      {issue.credits && issue.credits.length > 0 && (
        <Reveal>
          <section>
            <p className="kicker mb-5">制作 / CREDITS</p>
            <dl className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
              {issue.credits.map((c) => (
                <div
                  key={c.role}
                  className="flex items-baseline gap-3 border-b border-paper-line py-1.5"
                >
                  <dt className="w-20 shrink-0 text-xs text-mist">{c.role}</dt>
                  <dd className="text-sm text-paper/85">{c.name}</dd>
                </div>
              ))}
            </dl>
          </section>
        </Reveal>
      )}

      {/* 歌词 */}
      {issue.lyrics && issue.lyrics.length > 0 && (
        <Reveal>
          <section className="mt-14">
            <p className="kicker mb-5">歌词 / LYRICS</p>
            <div className="space-y-6 border-l border-paper-line pl-6">
              {issue.lyrics.map((stanza, i) => (
                <p key={i} className="text-[15px] leading-[2.1] text-paper/80">
                  {stanza.map((line, j) => (
                    <span key={`${j}-${line}`} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              ))}
            </div>
          </section>
        </Reveal>
      )}

      {/* 正文 */}
      <Reveal>
        <article className="mt-16">
          <div className="rule mb-12" />
          {issue.blocks.map((b, i) => {
            if (b.type === "h") {
              return (
                <h2
                  key={i}
                  className="mb-5 mt-12 font-[family-name:var(--font-display)] text-2xl text-moon"
                >
                  {b.text}
                </h2>
              );
            }
            if (b.type === "q") {
              return (
                <p
                  key={i}
                  className="moon-glow my-10 text-center font-[family-name:var(--font-display)] text-2xl leading-relaxed text-moon sm:text-3xl"
                >
                  {b.text}
                </p>
              );
            }
            return (
              <p key={i} className="mb-6 leading-[2] text-paper/90">
                {b.text}
              </p>
            );
          })}
        </article>
      </Reveal>

      {/* 收播语：全文最后一段，字号放大、提亮，宽屏排成一行方便一眼读清 */}
      {issue.signoff && (
        <Reveal>
          <p className="moon-glow mt-14 text-center text-lg leading-[2] text-paper sm:text-xl">
            {issue.signoff}
          </p>
        </Reveal>
      )}

      <div className="mt-16 flex flex-wrap items-center gap-6 border-t border-paper-line pt-8 text-sm">
        <Link
          href="/radio"
          className="cursor-pointer text-moon/80 transition-colors duration-300 hover:text-moon"
        >
          ← 回到耳畔
        </Link>
        <Link
          href="/music"
          className="cursor-pointer text-moon/80 transition-colors duration-300 hover:text-moon"
        >
          全部音乐 →
        </Link>
      </div>
    </div>
  );
}
