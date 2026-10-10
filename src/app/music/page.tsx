import type { Metadata } from "next";
import { albums, artistLinks, compilations, tracks } from "@/data/music";
import PlatformIcon from "@/components/PlatformIcon";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "音乐",
  description:
    "周菲戈作品：首张全长专辑《24:01》、全创作EP《顿悟》，以及好声音、亚洲新声的现场。",
};

const albumsJsonLd = {
  "@context": "https://schema.org",
  "@graph": albums.map((a) => ({
    "@type": "MusicAlbum",
    name: a.title,
    byArtist: { "@type": "Person", name: "周菲戈" },
    datePublished: String(a.year),
    numTracks: a.tracks.length,
    description: a.desc,
  })),
};

const tagColor: Record<string, string> = {
  原创: "text-moon border-moon/40",
  综艺Live: "text-vermilion border-vermilion/40",
  OST: "text-mist border-mist/40",
  EP: "text-paper/80 border-paper/20",
};

// 带 B站 视频的现场曲目（音乐页内嵌播放）
const liveVideos = compilations.flatMap((c) => c.tracks).filter((t) => t.bvid);

export default function MusicPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <JsonLd data={albumsJsonLd} />
      <Reveal>
        <header className="mb-16">
          <p className="kicker">DISCOGRAPHY</p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl text-moon">音乐</h1>
          <p className="mt-4 max-w-2xl text-paper/85">
            从好声音舞台的《Simon》，到深夜里写自己的《24:01》——点击曲目跳转正版音乐平台，精选现场可在页内直接观看。
          </p>
        </header>
      </Reveal>

      {/* 现场视频（置顶） */}
      <Reveal delay={0.1}>
        <section className="mb-16">
          <p className="kicker mb-6">现场视频 / LIVE</p>
          <div className="grid grid-cols-1 gap-4">
            {liveVideos.map((v) => (
              <figure
                key={v.bvid}
                className="overflow-hidden rounded-2xl border border-paper-line bg-paper-surface"
              >
                <iframe
                  src={`//player.bilibili.com/player.html?bvid=${v.bvid}&page=1&high_quality=1`}
                  title={`周菲戈《${v.title}》`}
                  allowFullScreen
                  className="aspect-video w-full bg-night-deep"
                />
                <figcaption className="flex flex-wrap items-baseline gap-x-3 gap-y-1 p-6">
                  <span className="font-[family-name:var(--font-display)] text-xl text-paper">
                    {v.title}
                  </span>
                  {v.note && (
                    <span className="text-sm text-mist">{v.note}</span>
                  )}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      </Reveal>

      {/* 在平台收听 */}
      <Reveal delay={0.15}>
      <section className="mb-16">
        <p className="kicker mb-4">
          在平台收听 / LISTEN ON
        </p>
        <div className="flex flex-wrap gap-3">
          {artistLinks.map((p) => (
            <a
              key={p.name}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-moon/30 px-6 py-2.5 text-sm text-paper/80 transition-all duration-300 hover:border-moon/70 hover:text-moon"
            >
              <PlatformIcon name={p.name} className="h-4 w-4 text-moon/70" />
              {p.name}
            </a>
          ))}
        </div>
      </section>
      </Reveal>

      {/* 节目现场合辑（入坑入口） */}
      <Reveal delay={0.2}>
        <section className="mb-16">
          <p className="kicker mb-6">节目现场 / ON STAGE</p>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {compilations.map((c) => (
              <article
                key={c.title}
                className="group rounded-2xl border border-paper-line bg-paper-surface p-8 transition-all duration-300 hover:border-moon/40"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <h2 className="font-[family-name:var(--font-display)] text-2xl text-paper">
                    {c.title}
                  </h2>
                  <span className="shrink-0 text-sm text-mist">{c.year}</span>
                </div>
                <span className="mt-3 inline-block rounded-full border border-vermilion/40 px-3 py-0.5 text-xs text-vermilion">
                  {c.subtitle}
                </span>
                <p className="mt-3 text-paper/85">{c.desc}</p>
                <ul className="mt-5 space-y-2">
                  {c.tracks.map((t) => (
                    <li
                      key={t.title}
                      className="flex flex-wrap items-baseline gap-x-3 gap-y-1"
                    >
                      {t.link ? (
                        <a
                          href={t.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cursor-pointer text-paper transition-colors duration-300 hover:text-moon"
                        >
                          {t.title} <span className="text-mist">↗</span>
                        </a>
                      ) : (
                        <span className="text-paper">{t.title}</span>
                      )}
                      {t.note && (
                        <span className="w-full text-xs text-paper/75 sm:w-auto">
                          {t.note}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      </Reveal>

      {/* 专辑 */}
      <Reveal delay={0.25}>
      <section className="space-y-10">
        {albums.map((a) => (
          <article
            key={a.title}
            className="rounded-2xl border border-paper-line bg-paper-surface p-8 transition-all duration-300 hover:border-moon/40"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-paper">
                {a.link ? (
                  <a
                    href={a.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer transition-colors duration-300 hover:text-moon"
                  >
                    {a.title} <span className="text-mist">↗</span>
                  </a>
                ) : (
                  a.title
                )}
              </h2>
              <span className="ml-auto text-right text-sm font-light text-mist">
                {a.year} · {a.type}
              </span>
            </div>
            <p className="mt-3 text-paper/85">{a.desc}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {a.tracks.map((t) => (
                <li key={t.title}>
                  <a
                    href={t.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block cursor-pointer rounded-md border border-moon/20 px-3 py-1 text-xs text-moon/90 transition-colors duration-300 hover:border-moon/40 hover:bg-moon/10 hover:text-moon"
                  >
                    {t.title}
                  </a>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>
      </Reveal>

      {/* 曲目表 */}
      <Reveal delay={0.3}>
      <section className="mt-20">
        <div className="rule mb-10" />
        <h2 className="mb-6 text-xl text-paper/90">精选曲目</h2>
        <ul className="divide-y divide-white/5">
          {tracks.map((t) => (
            <li
              key={t.title + t.year}
              className="flex flex-wrap items-baseline gap-x-4 py-4"
            >
              <span className="w-14 font-[family-name:var(--font-display)] text-mist">
                {t.year}
              </span>
              {t.link ? (
                <a
                  href={t.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer text-lg text-paper transition-colors duration-300 hover:text-moon"
                >
                  {t.title}
                </a>
              ) : (
                <span className="text-lg text-paper">{t.title}</span>
              )}
              <span
                className={`rounded-md border px-2 py-0.5 text-xs ${tagColor[t.tag]}`}
              >
                {t.tag}
              </span>
              <span className="w-full text-sm text-mist sm:w-auto sm:flex-1">
                {t.from}
              </span>
              {t.note && (
                <span className="w-full text-xs text-paper/75">{t.note}</span>
              )}
            </li>
          ))}
        </ul>
      </section>
      </Reveal>
    </div>
  );
}
