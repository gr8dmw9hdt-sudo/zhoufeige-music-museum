import type { Metadata, Viewport } from "next";
import "./globals.css";
import "@fontsource-variable/bodoni-moda";
import Nav from "@/components/Nav";
import JsonLd from "@/components/JsonLd";
import BackgroundMusic from "@/components/BackgroundMusic";
import EntranceIntro from "@/components/EntranceIntro";
import VisitorCounter from "@/components/VisitorCounter";
import { AudioProvider } from "@/components/AudioProvider";
import { SITE_URL } from "@/lib/site";
import { socialLinks, artistLinks } from "@/data/music";

const description =
  "00后创作歌手周菲戈的深夜音乐馆。从《Simon》的 51:0，到首张全创作专辑《24:01》，把深夜里纷飞的心事写进旋律。24:01，推门进来听歌。";

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
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "周菲戈 · 24:01 深夜音乐馆",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "周菲戈 · 24:01 深夜音乐馆",
    description,
    images: ["/og-image.png"],
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
      <body className="min-h-full flex flex-col">
        <JsonLd data={personJsonLd} />
        <AudioProvider>
          <Nav />
          <main className="relative z-10 flex-1">{children}</main>
          <footer className="relative z-10 border-t border-paper-line py-8 text-center text-xs text-mist/80">
            <p>深夜音乐馆 · 图片与音乐版权归原方及周菲戈工作室所有</p>
            <p className="mt-1 max-w-[52ch] mx-auto leading-relaxed">
              本站不设账号。访问统计只记录访问次数、时间与国家/城市级的大致位置（由
              Cloudflare 提供，不含 IP），不收集个人身份信息。
            </p>
            <p className="mt-1">Built with 深夜月光 · 24:01</p>
            <p className="mt-3">
              <VisitorCounter />
            </p>
          </footer>
          <BackgroundMusic />
          <EntranceIntro />
        </AudioProvider>
      </body>
    </html>
  );
}
