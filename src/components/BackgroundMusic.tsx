"use client";

import { useRef } from "react";
import {
  gsap,
  useGSAP,
  EASE_IN_OUT,
  prefersReducedMotion,
} from "@/lib/gsap";
import { useBackgroundMusic } from "@/components/AudioProvider";

function MusicIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <rect x="6" y="4" width="4" height="16" rx="1" />
      <rect x="14" y="4" width="4" height="16" rx="1" />
    </svg>
  );
}

export default function BackgroundMusic() {
  const { playing, toggle } = useBackgroundMusic();
  const iconRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (!playing || prefersReducedMotion()) return;
      gsap.fromTo(
        iconRef.current,
        { scale: 1 },
        {
          scale: 1.12,
          duration: 0.8, // framer 1.6s 整周期 = 0.8 前进 + 0.8 yoyo
          repeat: -1,
          yoyo: true,
          ease: EASE_IN_OUT,
        },
      );
    },
    { dependencies: [playing], revertOnUpdate: true },
  );

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={playing ? "暂停背景音乐" : "播放背景音乐"}
      title={
        playing
          ? "暂停（今夜的挽歌 · 副歌片段）"
          : "播放《今夜的挽歌》副歌 30 秒片段"
      }
      className={`fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full border backdrop-blur-md transition-colors duration-300 ${
        playing
          ? "border-moon/60 bg-moon/15 text-moon"
          : "border-white/10 bg-night-deep/70 text-paper/60 hover:text-moon"
      }`}
    >
      <span ref={iconRef} className="flex">
        {playing ? <PauseIcon /> : <MusicIcon />}
      </span>
      {playing && (
        <span
          aria-hidden
          className="moon-ring pointer-events-none absolute inset-0 rounded-full border border-moon/40 opacity-60"
        />
      )}
    </button>
  );
}
