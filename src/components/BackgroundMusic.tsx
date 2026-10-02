"use client";

import { motion, useReducedMotion } from "framer-motion";
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
  const reduce = useReducedMotion();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={playing ? "暂停背景音乐" : "播放背景音乐"}
      title={playing ? "暂停背景音乐" : "播放背景音乐"}
      className={`fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full border backdrop-blur-md transition-colors duration-300 ${
        playing
          ? "border-moon/60 bg-moon/15 text-moon"
          : "border-white/10 bg-night-deep/70 text-paper/60 hover:text-moon"
      }`}
    >
      <motion.span
        animate={!reduce && playing ? { scale: [1, 1.12, 1] } : undefined}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        className="flex"
      >
        {playing ? <PauseIcon /> : <MusicIcon />}
      </motion.span>
      {playing && !reduce && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full border border-moon/40 opacity-60"
          style={{ animation: "moon-ring 1.8s ease-out infinite" }}
        />
      )}
    </button>
  );
}
