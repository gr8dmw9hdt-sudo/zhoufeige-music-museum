"use client";

import { useBackgroundMusic } from "@/components/AudioProvider";

// 「耳畔」收听按钮：切的就是深夜音乐馆全站那首背景音乐（本期歌曲《今夜的挽歌》）。
// 与右下角悬浮按钮共用 AudioProvider 状态，两边始终同步。
export default function ListenButton({ title }: { title: string }) {
  const { playing, toggle } = useBackgroundMusic();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={playing}
      aria-label={playing ? `暂停《${title}》` : `播放《${title}》`}
      className={`inline-flex cursor-pointer items-center gap-2.5 rounded-full border px-5 py-2.5 text-sm transition-colors duration-300 ${
        playing
          ? "border-moon/60 bg-moon/10 text-moon"
          : "border-paper-line text-paper/85 hover:border-moon/50 hover:text-moon"
      }`}
    >
      <span className="flex h-4 w-2.5 items-center justify-center">
        {playing ? (
          <svg viewBox="0 0 10 16" className="h-4 w-2.5 fill-current" aria-hidden>
            <rect x="0" y="0" width="3.5" height="16" rx="1" />
            <rect x="6.5" y="0" width="3.5" height="16" rx="1" />
          </svg>
        ) : (
          <svg viewBox="0 0 14 16" className="h-4 w-3.5 fill-current" aria-hidden>
            <path d="M0 0.8a1 1 0 0 1 1.53-.85l11.2 7.2a1 1 0 0 1 0 1.7L1.53 16.05A1 1 0 0 1 0 15.2Z" />
          </svg>
        )}
      </span>
      {playing ? "正在播放" : "听这首"}
      <span className="text-mist">·</span>
      <span className="font-[family-name:var(--font-display)]">{title}</span>
    </button>
  );
}
