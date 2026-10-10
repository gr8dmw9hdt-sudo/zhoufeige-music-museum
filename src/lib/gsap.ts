import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// 全站缓动对齐 globals.css 的 --ease-out（cubic-bezier(0.23,1,0.32,1) = power4.out）
export const EASE_OUT = "power4.out";
// 无限循环用（对应 framer-motion 的 easeInOut）
export const EASE_IN_OUT = "sine.inOut";
export const DURATION = 0.6;

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export { gsap, ScrollTrigger, useGSAP };
