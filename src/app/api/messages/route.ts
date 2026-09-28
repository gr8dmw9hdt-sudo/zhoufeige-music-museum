import { NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const supabase = getAdminSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "尚未接入数据库" }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "无效的请求" }, { status: 400 });
  }

  const raw = body as { nickname?: unknown; content?: unknown };
  const nickname = String(raw.nickname ?? "").trim().slice(0, 20) || "匿名";
  const content = String(raw.content ?? "").trim().slice(0, 500);
  if (!content) {
    return NextResponse.json({ error: "留言内容不能为空" }, { status: 400 });
  }

  // service_role 绕过 RLS，status 由这里强制为 pending，审核后才公开
  const { error } = await supabase
    .from("messages")
    .insert({ nickname, content, status: "pending" });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
