"use client";

import { useRef } from "react";
import {
  gsap,
  useGSAP,
  EASE_OUT,
  DURATION,
  prefersReducedMotion,
} from "@/lib/gsap";
import { milestones } from "@/data/music";

export default function TimelinePage() {
  const listRef = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(".timeline-item", {
        opacity: 0,
        y: 16,
        duration: DURATION,
        ease: EASE_OUT,
        stagger: 0.1,
        clearProps: "transform", // 防止残留恒等 transform 让圆点脱离时间线
        scrollTrigger: {
          trigger: listRef.current,
          start: "top bottom-=40",
          once: true,
        },
      });
    },
    { scope: listRef },
  );

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <header className="mb-16">
        <p className="kicker">JOURNEY</p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl text-moon">他走过的路</h1>
      </header>

      <ol ref={listRef} className="timeline-line pl-8">
        {milestones.map((m) => (
          <li key={m.year} className="timeline-item mb-12 last:mb-0">
            <span className="absolute -left-[7px] mt-1.5 h-3 w-3 rounded-full bg-moon shadow-[0_0_0_3px_rgba(232,200,122,0.15)]" />
            <div className="font-[family-name:var(--font-display)] text-sm text-mist">
              {m.year}
            </div>
            <h2 className="mt-1 text-xl text-paper">{m.title}</h2>
            <p className="mt-2 text-paper/85">{m.desc}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
