import { cookies } from "next/headers";
import { getAdminSupabase, storageUrl } from "@/lib/supabase";
import AdminLogin from "@/components/AdminLogin";
import AdminPanel from "@/components/AdminPanel";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export type PendingMessage = {
  id: string;
  nickname: string;
  content: string;
  created_at: string;
};

export type PendingGallery = {
  id: string;
  nickname: string;
  type: string;
  caption: string | null;
  url: string;
  created_at: string;
};

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
  const msgRes = supabase
    ? await supabase
        .from("messages")
        .select("id,nickname,content,created_at")
        .eq("status", "pending")
        .order("created_at", { ascending: false })
    : null;
  const galRes = supabase
    ? await supabase
        .from("gallery_items")
        .select("id,nickname,type,caption,storage_path,created_at")
        .eq("status", "pending")
        .order("created_at", { ascending: false })
    : null;

  const messages = (msgRes?.data ?? []) as PendingMessage[];
  const gallery = ((galRes?.data ?? []) as GalleryRow[]).map((g) => ({
    id: g.id,
    nickname: g.nickname,
    type: g.type,
    caption: g.caption,
    url: storageUrl(g.storage_path),
    created_at: g.created_at,
  }));

  return <AdminPanel messages={messages} gallery={gallery} />;
}
