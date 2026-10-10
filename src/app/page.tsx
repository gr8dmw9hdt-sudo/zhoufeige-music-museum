"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, type MouseEvent } from "react";
import MoonParticles from "@/components/MoonParticles";
import PlatformIcon from "@/components/PlatformIcon";
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
import TimeStage from "@/components/TimeStage";
import { useBackgroundMusic } from "@/components/AudioProvider";
import { gsap, useGSAP, EASE_OUT, prefersReducedMotion } from "@/lib/gsap";
import { socialLinks, compilations, tourDates } from "@/data/music";
import { interviews } from "@/data/interviews";

const photos = [
  { src: "/images/photo-1.jpg", width: 1280, height: 2093 },
  { src: "/images/photo-2.jpg", width: 1280, height: 2093 },
  { src: "/images/photo-3.jpg", width: 1280, height: 2093 },
  { src: "/images/photo-4.jpg", width: 1280, height: 2093 },
  { src: "/images/photo-5.jpg", width: 1280, height: 2093 },
  { src: "/images/photo-6.jpg", width: 1280, height: 2093 },
];

const facts = [
  ["好声音", "51:0 全票"],
  ["出生", "2002 · 浙江江山"],
  ["代表作", "《24:01》"],
  ["亚洲新声", "2025 亚军"],
];

export default function Home() {
  const { playing, toggle } = useBackgroundMusic();
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const xToRef = useRef<((v: number) => void) | null>(null);
  const yToRef = useRef<((v: number) => void) | null>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const title = titleRef.current;
      if (title) {
        xToRef.current = gsap.quickTo(title, "x", {
          duration: 0.6,
          ease: "power3.out",
        });
        yToRef.current = gsap.quickTo(title, "y", {
          duration: 0.6,
          ease: "power3.out",
        });
        // 入场：immediateRender:true 必须，否则靠后位置的 .from 会先闪一下再入场
        gsap
          .timeline({ defaults: { ease: EASE_OUT, immediateRender: true } })
          .from(".hero-kicker", { opacity: 0, y: 12, duration: 0.8 })
          .from(title, { opacity: 0, scale: 0.96, duration: 1.1 }, 0.15)
          .from(".hero-intro", { opacity: 0, duration: 1 }, 0.6)
          .from(".click-here", { opacity: 0, y: 8, duration: 0.9 }, 1.6);
      }
    },
    { scope: heroRef },
  );

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (!xToRef.current || !yToRef.current) return; // reduced-motion 下为空，自然 no-op
    const nx = e.clientX / window.innerWidth - 0.5;
    const ny = e.clientY / window.innerHeight - 0.5;
    xToRef.current(nx * 28); // [-0.5,0.5] → [-14,14]
    yToRef.current(ny * 20); // [-0.5,0.5] → [-10,10]
  }

  return (
    <div onMouseMove={handleMouseMove} className="relative">
      {/* 首屏 Hero：旋转光盘 + 播放歌曲 */}
      <section ref={heroRef} className="relative flex min-h-[calc(100svh-4rem)] flex-col items-center justify-center overflow-hidden px-6 text-center">
        {/* 月光光盘（点击播放 / 暂停背景音乐） */}
            <div className="absolute left-1/2 top-1/3 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2">
              <button
                type="button"
                onClick={toggle}
                aria-label={playing ? "暂停背景音乐" : "播放背景音乐"}
                title={playing ? "点击暂停" : "点击播放《今夜的挽歌》"}
                className="vinyl-disc block h-full w-full cursor-pointer rounded-full border-0 p-0"
                style={{ animationPlayState: playing ? "running" : "paused" }}
              />

              {/* CLICK HERE 提示：手机在光盘右上侧，箭头指向光盘 */}
              <div className="click-here pointer-events-none absolute -top-4 right-1 flex -translate-x-1/2 flex-col items-center gap-0.5 sm:hidden">
                <span className="whitespace-nowrap text-xs font-semibold tracking-[0.22em] text-moon/80">
                  CLICK HERE&nbsp;!
                </span>
                <span className="text-lg leading-none text-moon/60">↙</span>
              </div>

              {/* CLICK HERE 提示：桌面在光盘右侧，箭头指向光盘 */}
              <div className="click-here pointer-events-none absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-full items-center gap-1.5 pl-2 sm:flex">
                <span className="text-lg leading-none text-moon/60">←</span>
                <span className="whitespace-nowrap text-sm font-semibold tracking-[0.22em] text-moon/80">
                  CLICK HERE&nbsp;!
                </span>
              </div>
            </div>

            {/* 飘动的月光粒子 */}
            <MoonParticles />

            <p className="hero-kicker mb-6 text-sm tracking-[0.18em] text-mist">
              ZHOU FEI GE · 周菲戈
            </p>

            <h1
              ref={titleRef}
              className="moon-glow font-light font-[family-name:var(--font-display)] text-[22vw] leading-none tracking-[-0.04em] text-moon sm:text-[clamp(8rem,18vw,16rem)]"
            >
              24:01
            </h1>

            <p className="hero-intro mt-8 max-w-[60ch] text-lg leading-[1.8] text-paper/80">
              有人在凌晨三点写歌，有人在天亮前听懂。
              <br />
              <span className="text-mist">
                00后创作歌手 · 从《Simon》的51:0，到首张全创作专辑《24:01》。
              </span>
            </p>

      </section>

      {/* 入坑现场 */}
      <section data-time-stage="dusk" className="mx-auto max-w-4xl px-6 py-20">
        <Reveal>
          <SectionHeader
            kicker="入坑现场 / ON STAGE"
            title="两个舞台，见证他如何被看见"
            desc="从《中国好声音》的 51:0 出圈，到《亚洲新声》的亚军之路——点击曲目跳转正版平台收听。"
          />
          <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {compilations.map((c) => (
              <article
                key={c.title}
                className="group flex h-full flex-col rounded-2xl border border-paper-line bg-paper-surface p-8 transition-all duration-300 hover:border-moon/40"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-[family-name:var(--font-display)] text-2xl text-paper">
                    {c.title}
                  </h3>
                  <span className="shrink-0 text-sm text-mist">{c.year}</span>
                </div>
                <span className="mt-3 inline-block self-start rounded-full border border-vermilion/40 px-3 py-0.5 text-xs text-vermilion">
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
                <div className="mt-auto pt-6">
                  <Link
                    href="/music"
                    className="cursor-pointer text-sm text-moon/70 transition-colors duration-300 hover:text-moon"
                  >
                    听全部音乐 →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </Reveal>
      </section>

      {/* 上哪追 */}
      <section className="mx-auto max-w-4xl px-6 pb-24 pt-20">
        <Reveal>
          <SectionHeader
            kicker="上哪追 / FOLLOW"
            title="去这些地方，继续听他"
            desc="新歌、巡演、日常——在这里第一时间找到他。"
          />
          <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {socialLinks.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex cursor-pointer items-center gap-3 rounded-xl border border-paper-line bg-paper-surface p-5 transition-all duration-300 hover:border-moon/40 hover:bg-paper-surface"
              >
                <PlatformIcon
                  name={s.name}
                  className="h-6 w-6 shrink-0 text-moon/80 transition-colors duration-300 group-hover:text-moon"
                />
                <div className="min-w-0">
                  <div className="text-xs tracking-[0.2em] text-mist">{s.name}</div>
                  <div className="mt-1 truncate text-paper/90 transition-colors duration-300 group-hover:text-moon">
                    {s.handle}
                  </div>
                </div>
                <div className="ml-auto text-xs text-paper/70">↗</div>
              </a>
            ))}
          </div>
        </Reveal>
      </section>

      {/* 他是谁 */}
      <section data-time-stage="midnight" className="mx-auto max-w-3xl px-6 py-20">
        <Reveal>
          <SectionHeader
            kicker="他是谁 / WHO"
            title="00后创作歌手，从好声音舞台走进深夜录音棚"
            desc="2022年，他一首《Simon》拿下导师对战 51:0 全票出圈；2026年，他交出几乎一手包办的首张全创作专辑《24:01》——把傍晚到破晓前那些纷飞的心事，全部收进旋律。"
          />
          <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-paper-line bg-paper-surface sm:grid-cols-4">
            {facts.map(([k, v]) => (
              <div key={k} className="bg-night-deep p-5 text-center">
                <dt className="text-xs text-mist">{k}</dt>
                <dd className="mt-1 text-sm text-paper">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-10 text-center">
            <Link
              href="/about"
              className="inline-flex cursor-pointer items-center gap-1 text-sm text-moon/80 transition-colors duration-300 hover:text-moon"
            >
              更多关于他 →
            </Link>
          </div>
        </Reveal>
      </section>

      {/* 听他聊聊 */}
      <section className="mx-auto max-w-4xl px-6 py-20">
        <Reveal>
          <SectionHeader
            kicker="听他聊聊 / INTERVIEWS"
            title="专访里，听他讲自己的故事"
            desc="B站、抖音的博主们和他聊创作、聊现场、聊那些深夜里写下的歌。"
          />
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {interviews.slice(0, 3).map((i) => (
              <a
                key={i.title}
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
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/interviews"
              className="inline-flex cursor-pointer items-center gap-1 text-sm text-moon/80 transition-colors duration-300 hover:text-moon"
            >
              全部访谈 →
            </Link>
          </div>
        </Reveal>
      </section>

      {/* 去看现场 */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <Reveal>
          <SectionHeader
            kicker="去看现场 / TOUR"
            title="「原来你也睡不着」巡回演唱会"
            desc="2026《24:01》巡回演唱会正在路上——到现场，听他把深夜里写的歌唱给你。"
          />
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {tourDates.slice(0, 2).map((t) => (
              <div
                key={t.city}
                className="flex items-baseline justify-between gap-4 rounded-2xl border border-paper-line bg-paper-surface p-6 transition-colors duration-300 hover:border-moon/30"
              >
                <div className="min-w-0">
                  <div className="font-[family-name:var(--font-display)] text-2xl text-paper">
                    {t.city}
                  </div>
                  {t.note && <div className="mt-1 text-xs text-moon/80">{t.note}</div>}
                </div>
                <div className="text-right">
                  <div className="text-sm text-paper/90">{t.venue}</div>
                  <div className="mt-1 text-sm text-mist">{t.date}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/tour"
              className="inline-flex cursor-pointer items-center gap-1 text-sm text-moon/80 transition-colors duration-300 hover:text-moon"
            >
              全部场次 →
            </Link>
          </div>
        </Reveal>
      </section>

      {/* 影像 */}
      <section data-time-stage="dawn" className="mx-auto max-w-6xl px-6 py-20">
        <Reveal>
          <SectionHeader align="center" kicker="影像 / PHOTOS" title="他的一些瞬间" />
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {photos.map((p, i) => (
              <a
                key={p.src}
                href={p.src}
                target="_blank"
                rel="noopener noreferrer"
                className="group block overflow-hidden rounded-xl border border-paper-line bg-paper-surface"
              >
                <Image
                  src={p.src}
                  alt={`周菲戈 · 照片 ${i + 1}`}
                  width={p.width}
                  height={p.height}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  className="h-auto w-full transition-transform duration-500 group-hover:scale-105"
                />
              </a>
            ))}
          </div>
        </Reveal>
      </section>

      <TimeStage />
    </div>
  );
}
