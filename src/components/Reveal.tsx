"use client";

import { useRef, type ReactNode } from "react";
import {
  gsap,
  useGSAP,
  EASE_OUT,
  DURATION,
  prefersReducedMotion,
} from "@/lib/gsap";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
};

export default function Reveal({
  children,
  delay = 0,
  className,
  y = 16,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return; // 内容保持可见（不施加 from 初始态）
      gsap.from(ref.current, {
        opacity: 0,
        y,
        duration: DURATION,
        ease: EASE_OUT,
        delay,
        clearProps: "transform",
        scrollTrigger: {
          trigger: ref.current,
          start: "top bottom-=64",
          once: true,
        },
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
