"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "首页" },
  { href: "/radio", label: "耳畔" },
  { href: "/music", label: "音乐" },
  { href: "/tour", label: "巡演" },
  { href: "/gallery", label: "影像馆" },
  { href: "/interviews", label: "访谈" },
  { href: "/about", label: "关于" },
  { href: "/timeline", label: "大事记" },
];

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 恢复用户上次的折叠选择
  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem("nav_collapsed") === "1");
    } catch {
      /* 忽略隐私模式下的存储异常 */
    }
  }, []);

  function toggleCollapse() {
    setCollapsed((c) => {
      const next = !c;
      try {
        localStorage.setItem("nav_collapsed", next ? "1" : "0");
      } catch {
        /* 忽略 */
      }
      return next;
    });
  }

  return (
    <header
      className={`sticky top-0 z-40 border-b border-paper-line backdrop-blur-md transition-colors duration-300 ${
        scrolled ? "bg-night-deep/90" : "bg-night-deep/70"
      }`}
    >
      {collapsed ? (
        /* 折叠后的精简标题条 */
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <button
            type="button"
            onClick={toggleCollapse}
            aria-expanded={false}
            aria-label="展开导航"
            className="flex cursor-pointer items-baseline gap-3 text-left"
          >
            <span className="font-[family-name:var(--font-display)] text-lg text-moon">
              周菲戈
            </span>
            <span className="text-xs tracking-[0.3em] text-mist/80">24:01</span>
          </button>
          <button
            type="button"
            onClick={toggleCollapse}
            aria-expanded={false}
            className="cursor-pointer rounded-full border border-moon/30 px-3 py-1 text-xs text-paper/70 transition-colors hover:border-moon/70 hover:text-moon"
          >
            展开 ▾
          </button>
        </nav>
      ) : (
        <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <Link
            href="/"
            className="font-[family-name:var(--font-display)] text-lg tracking-wide text-moon"
          >
            周菲戈 <span className="hidden text-mist/80 sm:inline">/</span>{" "}
            <span className="hidden text-sm text-paper/80 sm:inline">24:01</span>
          </Link>
          <div className="flex items-center gap-3 sm:gap-4">
            <ul className="flex gap-3 text-xs sm:gap-5 sm:text-sm">
              {links.map((l) => {
                // 子页面（如 /radio/jinye-de-wange）也点亮所属栏目
                const active =
                  pathname === l.href ||
                  (l.href !== "/" && pathname.startsWith(`${l.href}/`));
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      aria-current={active ? "page" : undefined}
                      className={
                        active
                          ? "cursor-pointer text-moon border-b border-moon/60 pb-0.5 transition-colors duration-300"
                          : "cursor-pointer text-paper/70 hover:text-moon transition-colors duration-300"
                      }
                    >
                      {l.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <button
              type="button"
              onClick={toggleCollapse}
              aria-expanded={true}
              aria-label="收起导航"
              title="收起导航"
              className="shrink-0 cursor-pointer rounded-full border border-white/10 px-2 py-1 text-xs leading-none text-mist transition-colors hover:border-moon/40 hover:text-moon sm:px-3"
            >
              <span className="sm:hidden">▴</span>
              <span className="hidden sm:inline">收起 ▴</span>
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
