import type { EarsIssue } from "@/data/ears";

// 入站动画收尾时停在的这一屏：本期「耳畔」封面。
// 纯展示组件，淡入由 EntranceIntro 的 GSAP 时间轴控制（外面套一层带 ref 的容器）。
// 固定数组而非随机数：保证 SSR/客户端渲染一致，不会 hydration 不匹配。
const TICKS = 23; // 调频刻度格数
const WAVE = [0.3, 0.55, 0.85, 0.45, 1, 0.6, 0.35, 0.8, 0.5, 0.95, 0.4, 0.7, 0.3];

export default function EarCover({
  issue,
  onEnter,
  onRead,
}: {
  issue: EarsIssue;
  onEnter: () => void;
  onRead: () => void;
}) {
  const vol = String(issue.number).padStart(2, "0");

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center text-center">
      <p className="kicker">耳畔 · IN YOUR EAR</p>

      {/* 调频刻度：中间那格是「当前频率」 */}
      <div className="mt-7 flex items-center gap-1.5 opacity-70" aria-hidden>
        {Array.from({ length: TICKS }, (_, i) => {
          const center = Math.abs(i - (TICKS - 1) / 2);
          const h = center === 0 ? 20 : center < 3 ? 12 : 7;
          return (
            <span
              key={i}
              className={`w-px ${center === 0 ? "bg-moon" : "bg-mist/50"}`}
              style={{ height: `${h}px` }}
            />
          );
        })}
      </div>
      <p className="mt-3 text-sm tracking-[0.28em] text-mist">
        {issue.station} · VOL.{vol}
      </p>

      {/* 本期歌曲 */}
      <h2 className="moon-glow mt-8 font-[family-name:var(--font-display)] text-6xl font-light leading-none tracking-[-0.02em] text-moon sm:text-7xl">
        {issue.title}
      </h2>
      <p className="mt-4 text-base tracking-[0.2em] text-paper/75">
        {issue.song.artist}
      </p>

      {/* ON AIR + 波形 */}
      <div className="mt-8 flex items-center gap-4" aria-hidden>
        <span className="flex items-center gap-1.5">
          <span className="ear-air h-1.5 w-1.5 rounded-full bg-vermilion" />
          <span className="text-[0.75rem] tracking-[0.28em] text-vermilion">
            ON AIR
          </span>
        </span>
        <span className="ear-wave flex h-5 items-center gap-[3px]">
          {WAVE.map((v, i) => (
            <span key={i} style={{ height: `${v * 100}%`, animationDelay: `${i * 0.09}s` }} />
          ))}
        </span>
      </div>

      {issue.epigraph && (
        <p className="mt-8 max-w-[34ch] text-[17px] leading-[2] text-paper/85">
          {issue.epigraph}
        </p>
      )}

      <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
        <button
          type="button"
          onClick={onEnter}
          className="w-full cursor-pointer rounded-full bg-moon px-8 py-3 text-base font-medium text-night-deep transition-all duration-300 hover:-translate-y-0.5 hover:bg-moon/90 sm:w-auto"
        >
          进入音乐馆 →
        </button>
        <button
          type="button"
          onClick={onRead}
          className="w-full cursor-pointer rounded-full border border-paper-line px-8 py-3 text-base text-paper/85 transition-colors duration-300 hover:border-moon/50 hover:text-moon sm:w-auto"
        >
          阅读本期耳畔 →
        </button>
      </div>
    </div>
  );
}
