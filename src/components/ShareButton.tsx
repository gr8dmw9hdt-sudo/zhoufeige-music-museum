"use client";

import { useEffect, useRef, useState } from "react";
import { SITE_URL } from "@/lib/site";

const SHARE_TITLE = "周菲戈 · 24:01 深夜音乐馆";
const SHARE_TEXT = "深夜里的一间音乐馆，天亮以前不打烊。";

function ShareIcon() {
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
      <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" />
      <path d="M16 6l-4-4-4 4" />
      <path d="M12 2v13" />
    </svg>
  );
}

// 兜底复制：clipboard API 在非安全上下文/旧浏览器不可用时的老办法
function legacyCopy(text: string): boolean {
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

/**
 * 右下角悬浮分享（放在背景音乐按钮上方，同一套外观）。
 * 触屏设备优先调起系统分享面板（微信/微博/复制…由系统给），
 * 桌面端直接复制当前页链接——比拉起一个空荡荡的系统分享浮层更实用。
 */
export default function ShareButton() {
  const [hint, setHint] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  function flash(msg: string) {
    setHint(msg);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setHint(""), 2400);
  }

  async function onShare() {
    const url = window.location.href || SITE_URL;
    const data = { title: SHARE_TITLE, text: SHARE_TEXT, url };
    const touch = window.matchMedia?.("(pointer: coarse)").matches;

    if (touch && navigator.share) {
      try {
        await navigator.share(data);
        return;
      } catch (err) {
        // 用户自己取消不算失败，也不用再复制一遍
        if ((err as DOMException)?.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      flash("链接已复制");
    } catch {
      flash(legacyCopy(url) ? "链接已复制" : url);
    }
  }

  return (
    <div className="fixed bottom-20 right-5 z-50">
      {hint && (
        <span
          role="status"
          aria-live="polite"
          className="absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-full border border-paper-line bg-night-deep/90 px-3 py-1 text-xs text-moon backdrop-blur-md"
        >
          {hint}
        </span>
      )}
      <button
        type="button"
        onClick={onShare}
        aria-label="分享本站"
        title="分享本站"
        className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-night-deep/70 text-paper/60 backdrop-blur-md transition-colors duration-300 hover:border-moon/40 hover:text-moon"
      >
        <ShareIcon />
      </button>
    </div>
  );
}
