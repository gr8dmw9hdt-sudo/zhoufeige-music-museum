import { NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase";

const MAX_SIZE = 50 * 1024 * 1024; // 50MB

export async function POST(req: Request) {
  const supabase = getAdminSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "尚未接入数据库" }, { status: 503 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "无效的请求" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "请选择要上传的图片或视频" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "文件超过 50MB" }, { status: 400 });
  }

  const nickname = String(formData.get("nickname") ?? "").trim().slice(0, 20) || "匿名";
  const captionRaw = String(formData.get("caption") ?? "").trim().slice(0, 100);
  const caption = captionRaw || null;
  const type = file.type.startsWith("video/") ? "video" : "image";
  const ext = file.name.split(".").pop() || "bin";
  const path = `${crypto.randomUUID()}.${ext}`;

  const bytes = await file.arrayBuffer();
  const { error: upErr } = await supabase.storage
    .from("gallery")
    .upload(path, bytes, { contentType: file.type || "application/octet-stream" });
  if (upErr) {
    return NextResponse.json({ error: upErr.message }, { status: 500 });
  }

  const { error: insErr } = await supabase.from("gallery_items").insert({
    nickname,
    type,
    storage_path: path,
    caption,
    status: "pending",
  });
  if (insErr) {
    return NextResponse.json({ error: insErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
