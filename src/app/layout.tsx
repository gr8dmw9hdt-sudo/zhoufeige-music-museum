import type { Metadata, Viewport } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import JsonLd from "@/components/JsonLd";
import { SITE_URL } from "@/lib/site";
import { socialLinks, artistLinks } from "@/data/music";

const description =
  "00后创作歌手周菲戈的非官方粉丝站。从《Simon》的 51:0，到首张全创作专辑《24:01》，把深夜里纷飞的心事写进旋律。";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "周菲戈 · 24:01 深夜音乐馆",
    template: "%s · 24:01 深夜音乐馆",
  },
  description,
  keywords: [
    "周菲戈",
    "24:01",
    "深夜音乐馆",
    "创作歌手",
    "中国好声音",
    "Simon",
    "飞鸽",
    "顿悟",
  ],
  openGraph: {
    title: "周菲戈 · 24:01 深夜音乐馆",
    description,
    url: "/",
    siteName: "24:01 深夜音乐馆",
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "周菲戈 · 24:01 深夜音乐馆",
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  themeColor: "#070912",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "周菲戈",
  alternateName: "Zhou Fei Ge",
  birthDate: "2002-07-17",
  birthPlace: "浙江江山",
  description: "中国内地流行乐男歌手、创作人，代表作《飞鸽》《半空》《24:01》。",
  sameAs: [
    ...socialLinks.map((s) => s.href),
    ...artistLinks.map((a) => a.href),
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="grain min-h-full flex flex-col">
        <JsonLd data={personJsonLd} />
        <Nav />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-white/5 py-8 text-center text-xs text-mist/60">
          <p>非官方粉丝站 · 图片与音乐版权归原方及周菲戈工作室所有</p>
          <p className="mt-1">Built with 深夜月光 · 24:01</p>
        </footer>
      </body>
    </html>
  );
}
