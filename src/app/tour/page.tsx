import type { Metadata } from "next";
import { tourDates } from "@/data/music";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "巡演",
  description:
    "「原来你也睡不着」周菲戈 2026《24:01》巡回演唱会：上海、成都、北京、广州、深圳等站。",
};

const eventsJsonLd = {
  "@context": "https://schema.org",
  "@graph": tourDates
    .filter((t) => !t.date.includes("待"))
    .map((t) => ({
      "@type": "MusicEvent",
      name: `「原来你也睡不着」周菲戈《24:01》巡回演唱会 · ${t.city}站`,
      startDate: t.date,
      location: {
        "@type": "Place",
        name: t.venue,
        address: {
          "@type": "PostalAddress",
          addressLocality: t.city,
          addressCountry: "CN",
        },
      },
      performer: { "@type": "Person", name: "周菲戈" },
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
    })),
};

export default function TourPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <JsonLd data={eventsJsonLd} />

      <header className="mb-12">
        <p className="text-sm tracking-[0.3em] text-mist">TOUR</p>
        <h1 className="mt-3 font-[family-name:var(--font-fraunces)] text-5xl text-moon">
          「原来你也睡不着」
        </h1>
        <p className="mt-3 max-w-2xl text-paper/70">
          2026《24:01》巡回演唱会——深夜音乐馆亮着灯，等你来听现场。
        </p>
      </header>

      <p className="mb-8 text-sm text-paper/50">
        * 场次、票价与场馆以官方渠道公布为准，购票请关注
        <a
          href="https://weibo.com/n/周菲戈"
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer text-moon/80 transition-colors duration-300 hover:text-moon"
        >
          官方微博 @周菲戈
        </a>
        。
      </p>

      <ol className="space-y-4">
        {tourDates.map((t) => (
          <li
            key={t.city}
            className="flex flex-wrap items-baseline gap-x-6 gap-y-2 rounded-2xl border border-moon/10 bg-white/[0.02] p-6 transition-colors duration-300 hover:border-moon/30"
          >
            <div className="w-40 shrink-0">
              <div className="font-[family-name:var(--font-fraunces)] text-2xl text-paper">
                {t.city}
              </div>
              {t.note && <div className="mt-1 text-xs text-moon/80">{t.note}</div>}
            </div>
            <div className="min-w-[16rem] flex-1">
              <div className="text-paper/90">{t.venue}</div>
              <div className="mt-1 text-sm text-mist">{t.date}</div>
            </div>
            {t.ticket && <div className="text-sm text-paper/70">{t.ticket}</div>}
          </li>
        ))}
      </ol>
    </div>
  );
}
