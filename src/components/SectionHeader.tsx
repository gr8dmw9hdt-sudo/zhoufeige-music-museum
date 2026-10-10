import type { ReactNode } from "react";

// 统一各页/首页的区块眉题：月光圆点 + 英文 kicker + 可选标题与描述。
// 修复此前 header 间距（mb-16/14/12/10）不一致的问题，让全站节奏一致。
export default function SectionHeader({
  kicker,
  title,
  desc,
  align = "left",
  className,
}: {
  kicker: string;
  title?: ReactNode;
  desc?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  const center = align === "center";
  return (
    <div className={`${center ? "text-center" : ""} ${className ?? ""}`}>
      <p className="kicker">{kicker}</p>
      {title && (
        <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-paper">
          {title}
        </h2>
      )}
      {desc && (
        <p
          className={`mt-4 text-paper/85 ${
            center ? "mx-auto" : ""
          } max-w-2xl`}
        >
          {desc}
        </p>
      )}
    </div>
  );
}
