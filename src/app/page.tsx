"use client";

import Link from "next/link";
import Image from "next/image";
import type { MouseEvent } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import MoonParticles from "@/components/MoonParticles";
import PlatformIcon from "@/components/PlatformIcon";
import { useBackgroundMusic } from "@/components/AudioProvider";
import { socialLinks } from "@/data/music";

const sections = [
  {
    href: "/music",
    en: "MUSIC",
    label: "音乐",
    desc: "从《Simon》到《24:01》，点击收听正版曲目",
  },
  {
    href: "/tour",
    en: "TOUR",
    label: "巡演",
    desc: "2026「原来你也睡不着」巡回演唱会",
  },
  {
    href: "/timeline",
    en: "JOURNEY",
    label: "大事记",
    desc: "2014 → 2026，他走过的路",
  },
  {
    href: "/about",
    en: "ABOUT",
    label: "关于",
    desc: "00后创作歌手周菲戈",
  },
  {
    href: "/gallery",
    en: "GALLERY",
    label: "影像馆",
    desc: "上传图片 / 视频，收藏关于他的现场",
  },
  {
    href: "/messages",
    en: "MESSAGE",
    label: "留言墙",
    desc: "写下想对菲戈说的话",
  },
];

const photos = [
  { src: "/images/photo-1.jpg", width: 1280, height: 2093 },
  { src: "/images/photo-2.jpg", width: 1280, height: 2093 },
  { src: "/images/photo-3.jpg", width: 1280, height: 2093 },
  { src: "/images/photo-4.jpg", width: 1280, height: 2093 },
  { src: "/images/photo-5.jpg", width: 1280, height: 2093 },
  { src: "/images/photo-6.jpg", width: 1280, height: 2093 },
  { src: "/images/photo-7.jpg", width: 1280, height: 2093 },
  { src: "/images/photo-8.jpg", width: 1280, height: 2093 },
  { src: "/images/photo-9.jpg", width: 1280, height: 2093 },
  { src: "/images/photo-10.jpg", width: 1280, height: 2093 },
];

export default function Home() {
  const reduce = useReducedMotion();
  const { playing, toggle } = useBackgroundMusic();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 15, mass: 0.5 });
  const sy = useSpring(my, { stiffness: 50, damping: 15, mass: 0.5 });
  const tx = useTransform(sx, [-0.5, 0.5], [-14, 14]);
  const ty = useTransform(sy, [-0.5, 0.5], [-10, 10]);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    mx.set(e.clientX / window.innerWidth - 0.5);
    my.set(e.clientY / window.innerHeight - 0.5);
  }

  return (
    <div onMouseMove={handleMouseMove} className="relative">
      {/* 关注他 */}
      <section className="mx-auto max-w-3xl px-6 pb-8 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full"
        >
          <p className="mb-4 text-center text-sm tracking-[0.3em] text-mist/70">
            关注他 / FIND HIM
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {socialLinks.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group cursor-pointer rounded-xl border border-white/5 bg-white/[0.02] p-5 text-left transition-all duration-300 hover:border-moon/40 hover:bg-white/[0.05]"
              >
                <div className="mb-3 flex items-center gap-2">
                  <PlatformIcon
                    name={s.name}
                    className="h-6 w-6 text-moon/80 transition-colors duration-300 group-hover:text-moon"
                  />
                  <span className="text-xs tracking-[0.2em] text-mist">
                    {s.name}
                  </span>
                </div>
                <div className="mt-2 text-paper/90 transition-colors duration-300 group-hover:text-moon">
                  {s.handle}
                </div>
                <div className="mt-3 text-xs text-paper/40">↗ 前往关注</div>
              </a>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 首屏 Hero */}
      <section className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden px-6 text-center">
        {/* 月光光晕（点击播放 / 暂停背景音乐） */}
        <div className="absolute left-1/2 top-1/3 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2">
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? "暂停背景音乐" : "播放背景音乐"}
            title={playing ? "点击暂停" : "点击播放《今夜的挽歌》"}
            className="moon-conic block h-full w-full cursor-pointer rounded-full border-0 p-0"
            style={{ animationPlayState: playing ? "running" : "paused" }}
          />
        </div>

        {/* 飘动的月光粒子 */}
        <MoonParticles />

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 text-sm tracking-[0.4em] text-mist"
        >
          ZHOU FEI GE · 周菲戈
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.15 }}
          style={reduce ? undefined : { x: tx, y: ty }}
          className="moon-glow font-light font-[family-name:var(--font-fraunces)] text-[22vw] leading-none tracking-[-0.04em] text-moon sm:text-[clamp(8rem,18vw,16rem)]"
        >
          24:01
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-8 max-w-[60ch] text-lg leading-[1.8] text-paper/80"
        >
          有人在凌晨三点写歌，有人在天亮前听懂。
          <br />
          <span className="text-mist">
            00后创作歌手 · 从《Simon》的51:0，到首张全创作专辑《24:01》。
          </span>
        </motion.p>

        {/* 底部时间刻度 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-10 flex gap-8 text-xs text-mist/60"
        >
          <span>20:00 傍晚</span>
          <span>00:00 子夜</span>
          <span className="text-moon/80">03:00 破晓前</span>
        </motion.div>
      </section>

      {/* 深夜音乐馆导览 */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <p className="mb-8 text-center text-sm tracking-[0.3em] text-mist/70">
          深夜音乐馆导览 / EXPLORE
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((s) => (
            <motion.div
              key={s.href}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Link
                href={s.href}
                className="group flex h-full cursor-pointer flex-col rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-moon/40 hover:bg-white/[0.05]"
              >
                <div className="text-xs tracking-[0.2em] text-mist">{s.en}</div>
                <h2 className="mt-3 font-[family-name:var(--font-fraunces)] text-2xl text-paper transition-colors duration-300 group-hover:text-moon">
                  {s.label}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-paper/60">
                  {s.desc}
                </p>
                <div className="mt-auto pt-4 text-moon/70 transition-colors duration-300 group-hover:text-moon">
                  →
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 影像 */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <p className="mb-8 text-center text-sm tracking-[0.3em] text-mist/70">
          影像 / PHOTOS
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {photos.map((p, i) => (
            <a
              key={p.src}
              href={p.src}
              target="_blank"
              rel="noopener noreferrer"
              className="group block overflow-hidden rounded-xl border border-white/5 bg-white/[0.02]"
            >
              <Image
                src={p.src}
                alt={`周菲戈 · 照片 ${i + 1}`}
                width={p.width}
                height={p.height}
                className="h-auto w-full transition-transform duration-500 group-hover:scale-105"
              />
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
