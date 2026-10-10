import { cookies } from "next/headers";
import { getAdminSupabase, storageUrl } from "@/lib/supabase";
import AdminLogin from "@/components/AdminLogin";
import AdminPanel from "@/components/AdminPanel";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export type PendingGallery = {
  id: string;
  nickname: string;
  type: string;
  caption: string | null;
  url: string;
  created_at: string;
};

// 最近访问：精确时间戳 + Cloudflare 给出的粗粒度位置（可能为 null：老数据 / 拿不到）
export type VisitRow = {
  visited_at: string;
  country: string | null;
  region: string | null;
  city: string | null;
  timezone: string | null;
};

export type VisitStats = {
  total: number;
  today: number;
  daily: { day: string; visits: number }[];
  recent: VisitRow[];
};

// 北京时间的 YYYY-MM-DD（Cloudflare edge 运行时支持 Intl timeZone）
function beijingToday(): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

type GalleryRow = {
  id: string;
  nickname: string;
  type: string;
  caption: string | null;
  storage_path: string;
  created_at: string;
};

export default async function AdminPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;
  const isAuthed = !!session && session === process.env.ADMIN_PASSWORD;
  if (!isAuthed) {
    return <AdminLogin />;
  }

  const supabase = getAdminSupabase();
  const galRes = supabase
    ? await supabase
        .from("gallery_items")
        .select("id,nickname,type,caption,storage_path,created_at")
        .eq("status", "pending")
        .order("created_at", { ascending: false })
    : null;

  const gallery = ((galRes?.data ?? []) as GalleryRow[]).map((g) => ({
    id: g.id,
    nickname: g.nickname,
    type: g.type,
    caption: g.caption,
    url: storageUrl(g.storage_path),
    created_at: g.created_at,
  }));

  let stats: VisitStats = { total: 0, today: 0, daily: [], recent: [] };
  if (supabase) {
    const [totalRes, dailyRes, recentRes] = await Promise.all([
      supabase.rpc("get_site_visit_total"),
      supabase
        .from("site_daily_visits")
        .select("day,visits")
        .order("day", { ascending: false })
        .limit(30),
      supabase
        .from("site_visits")
        .select("visited_at,country,region,city,timezone")
        .order("visited_at", { ascending: false })
        .limit(30),
    ]);
    const total = Number(totalRes.data ?? 0);
    const daily = (dailyRes.data ?? []) as { day: string; visits: number }[];
    const recent = ((recentRes.data ?? []) as VisitRow[]).map((r) => ({
      visited_at: r.visited_at,
      country: r.country ?? null,
      region: r.region ?? null,
      city: r.city ?? null,
      timezone: r.timezone ?? null,
    }));
    const todayStr = beijingToday();
    stats = {
      total,
      today: daily.find((d) => d.day === todayStr)?.visits ?? 0,
      daily,
      recent,
    };
  }

  return <AdminPanel gallery={gallery} stats={stats} />;
}
