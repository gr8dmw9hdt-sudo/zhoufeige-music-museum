import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "大事记",
  description:
    "从12岁的《江山飞歌》到《亚洲新声》亚军，周菲戈走过的路。",
};

export default function TimelineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
