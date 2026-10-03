import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const session = req.cookies.get("admin_session")?.value;
  if (!session || session !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "无效的请求" }, { status: 400 });
  }

  const { table, id, status } = body as {
    table?: unknown;
    id?: unknown;
    status?: unknown;
  };
  if (
    (table !== "messages" && table !== "gallery_items") ||
    typeof id !== "string" ||
    (status !== "approved" && status !== "rejected")
  ) {
    return NextResponse.json({ error: "参数错误" }, { status: 400 });
  }

  const supabase = getAdminSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "尚未接入数据库" }, { status: 503 });
  }

  const { error } = await supabase.from(table).update({ status }).eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
