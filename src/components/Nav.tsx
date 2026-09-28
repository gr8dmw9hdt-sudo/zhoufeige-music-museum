"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "首页" },
  { href: "/music", label: "音乐" },
  { href: "/tour", label: "巡演" },
  { href: "/gallery", label: "影像馆" },
  { href: "/messages", label: "留言墙" },
  { href: "/about", label: "关于" },
  { href: "/timeline", label: "大事记" },
];

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-md border-b border-white/5 transition-colors duration-300 ${
        scrolled ? "bg-night-deep/90" : "bg-night-deep/70"
      }`}
    >
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-[family-name:var(--font-fraunces)] text-lg tracking-wide text-moon"
        >
          周菲戈 <span className="hidden text-mist/60 sm:inline">/</span>{" "}
          <span className="hidden text-sm text-paper/80 sm:inline">24:01</span>
        </Link>
        <ul className="flex gap-3 text-xs sm:gap-5 sm:text-sm">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={pathname === l.href ? "page" : undefined}
                className={
                  pathname === l.href
                    ? "cursor-pointer text-moon border-b border-moon/60 pb-0.5 transition-colors duration-300"
                    : "cursor-pointer text-paper/70 hover:text-moon transition-colors duration-300"
                }
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
