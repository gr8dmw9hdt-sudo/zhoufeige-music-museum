import { NextRequest, NextResponse } from "next/server";
import { getOptionalRequestContext } from "@cloudflare/next-on-pages";
import { getAdminSupabase } from "@/lib/supabase";

export const runtime = "edge";

const VISIT_COOKIE = "fg_visited";
// 去重窗口：同一访客 180 天内只计一次（近似「独立访客」）
const COOKIE_MAX_AGE = 60 * 60 * 24 * 180;

type VisitorGeo = {
  country: string | null;
  region: string | null;
  city: string | null;
  timezone: string | null;
};

// Cloudflare 在边缘提供访客的粗粒度位置（国家 + 地区/城市，不含 IP）。
// 本地开发 / 非 Cloudflare 环境下拿不到，返回全 null。
function visitorGeo(): VisitorGeo {
  const cf = getOptionalRequestContext()?.cf;
  // "XX" = 未知国家，"T1" = Tor 出口节点，都视为没拿到
  const clean = (v: unknown) => {
    const s = typeof v === "string" ? v.trim() : "";
    return !s || s === "XX" || s === "T1" ? null : s.slice(0, 64);
  };
  return {
    country: clean(cf?.country),
    region: clean(cf?.region),
    city: clean(cf?.city),
    timezone: clean(cf?.timezone),
  };
}

// 前台访客计数器：返回当前总访问量；新访客自增并种 cookie，老访客只读。
export async function POST(req: NextRequest) {
  const supabase = getAdminSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "尚未接入数据库" }, { status: 503 });
  }

  const visited = req.cookies.get(VISIT_COOKIE)?.value === "1";

  let count = 0;
  if (visited) {
    const { data, error } = await supabase.rpc("get_site_visit_total");
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    count = Number(data ?? 0);
  } else {
    // 记录新访客的精确到达时间 + 大致位置（供后台「最近访问」查看）
    const { error: logErr } = await supabase
      .from("site_visits")
      .insert(visitorGeo());
    if (logErr) {
      // 兜底：位置列还没建时（迁移未执行）退回只写时间戳，别让访客计数器挂掉
      const { error: fallbackErr } = await supabase
        .from("site_visits")
        .insert({});
      if (fallbackErr) {
        return NextResponse.json({ error: fallbackErr.message }, { status: 500 });
      }
    }

    const { data, error } = await supabase.rpc("increment_site_visit");
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    count = Number(data ?? 0);
  }

  const res = NextResponse.json({ count });
  if (!visited) {
    res.cookies.set(VISIT_COOKIE, "1", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });
  }
  return res;
}
