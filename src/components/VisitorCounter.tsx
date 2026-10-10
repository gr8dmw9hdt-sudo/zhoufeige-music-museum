"use client";

import { useEffect, useState } from "react";

// 前台访客计数器：挂载时向 /api/visit 请求一次，展示累计访问量。
export default function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/visit", { method: "POST" });
        const data = await res.json();
        if (!cancelled && typeof data.count === "number") {
          setCount(data.count);
        }
      } catch {
        // 统计失败静默忽略，不影响页面
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <span className="text-mist/70">
      本站已接待{" "}
      <span className="tabular-nums text-moon/80">
        {count === null ? "…" : count.toLocaleString("zh-CN")}
      </span>{" "}
      位访客
    </span>
  );
}
