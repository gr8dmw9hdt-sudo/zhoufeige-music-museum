"use client";

import { useRef } from "react";
import {
  gsap,
  useGSAP,
  EASE_IN_OUT,
  prefersReducedMotion,
} from "@/lib/gsap";

type Particle = {
  left: string;
  top: string;
  size: number;
  duration: number;
  delay: number;
};

// 硬编码配置，保证 SSR 与客户端渲染一致，避免 hydration 警告
const PARTICLES: Particle[] = [
  { left: "6%", top: "18%", size: 5, duration: 14, delay: 0 },
  { left: "14%", top: "62%", size: 4, duration: 18, delay: 2 },
  { left: "22%", top: "30%", size: 6, duration: 16, delay: 4 },
  { left: "31%", top: "74%", size: 3, duration: 20, delay: 1 },
  { left: "40%", top: "12%", size: 5, duration: 15, delay: 5 },
  { left: "48%", top: "55%", size: 4, duration: 19, delay: 3 },
  { left: "56%", top: "24%", size: 6, duration: 17, delay: 6 },
  { left: "63%", top: "68%", size: 3, duration: 21, delay: 0 },
  { left: "71%", top: "16%", size: 5, duration: 15, delay: 2 },
  { left: "78%", top: "48%", size: 4, duration: 18, delay: 7 },
  { left: "85%", top: "28%", size: 6, duration: 16, delay: 4 },
  { left: "91%", top: "60%", size: 3, duration: 20, delay: 1 },
  { left: "12%", top: "40%", size: 3, duration: 22, delay: 8 },
  { left: "67%", top: "82%", size: 4, duration: 17, delay: 5 },
  { left: "36%", top: "86%", size: 5, duration: 19, delay: 3 },
];

export default function MoonParticles() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const els = gsap.utils.toArray<HTMLElement>(".moon-particle", ref.current);
      if (prefersReducedMotion()) {
        gsap.set(els, { opacity: 0.35 });
        return;
      }
      els.forEach((el, i) => {
        const p = PARTICLES[i];
        gsap.to(el, {
          y: -40,
          x: 8,
          opacity: 0.4,
          duration: p.duration / 2, // yoyo 后整周期仍 = p.duration
          delay: p.delay,
          repeat: -1,
          yoyo: true,
          ease: EASE_IN_OUT,
        });
      });
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="moon-particle absolute rounded-full"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            background:
              "radial-gradient(circle, rgba(232,200,122,0.9), rgba(232,200,122,0) 70%)",
            boxShadow: "0 0 6px rgba(232,200,122,0.35)",
            opacity: 0.15,
          }}
        />
      ))}
    </div>
  );
}
