"use client";

import { useEffect, useState } from "react";

type Stage = "dusk" | "midnight" | "dawn";

const STAGES: { key: Stage; time: string; label: string }[] = [
  { key: "dusk", time: "20:00", label: "傍晚" },
  { key: "midnight", time: "00:00", label: "子夜" },
  { key: "dawn", time: "03:00", label: "破晓前" },
];

// 时间锚点：随滚动高亮「傍晚 → 子夜 → 破晓前」三段叙事，
// 每段配一枚对应月相（新月 / 满月 / 残月）。
// 用 IntersectionObserver 监听带 data-time-stage 的 section，不写死像素，天然响应式。
export default function TimeStage() {
  const [active, setActive] = useState<Stage>("dusk");

  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>("[data-time-stage]"),
    );
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const stage = entry.target.getAttribute("data-time-stage") as Stage;
            if (stage) setActive(stage);
          }
        }
      },
      // 视口正中一条窄带：某 section 进入中间就点亮对应时间
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-5 rounded-full border border-paper-line bg-night-deep/60 px-5 py-2 text-xs backdrop-blur-sm"
    >
      {STAGES.map((s) => {
        const on = active === s.key;
        return (
          <span
            key={s.key}
            className={`flex items-center gap-2 transition-opacity duration-500 ${
              on ? "opacity-100" : "opacity-45"
            }`}
          >
            <span className="moon-phase" data-phase={s.key} data-on={on} />
            <span
              className={
                on
                  ? "text-moon-light transition-colors duration-500"
                  : "text-mist/70 transition-colors duration-500"
              }
            >
              <span className="tabular-nums">{s.time}</span> {s.label}
            </span>
          </span>
        );
      })}
    </div>
  );
}
