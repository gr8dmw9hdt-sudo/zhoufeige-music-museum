import type { Metadata } from "next";
import GalleryUpload from "@/components/GalleryUpload";
import { getAdminSupabase, storageUrl } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "影像馆",
  description:
    "周菲戈影像馆：上传你拍下的现场照片与视频片段，审核通过后与大家一起收藏。",
};

// 内容随投稿实时变化，按请求动态渲染
export const runtime = "edge";
export const dynamic = "force-dynamic";

type GalleryItem = {
  id: string;
  nickname: string;
  type: "image" | "video";
  storage_path: string;
  caption: string | null;
  status: string;
  created_at: string;
};

function fmtDate(s: string) {
  const d = new Date(s);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export default async function GalleryPage() {
  const supabase = getAdminSupabase();
  const items: GalleryItem[] = supabase
    ? (
        await supabase
          .from("gallery_items")
          .select("*")
          .eq("status", "approved")
          .order("created_at", { ascending: false })
      ).data ?? []
    : [];

  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <header className="mb-10">
        <p className="text-sm tracking-[0.3em] text-mist">GALLERY</p>
        <h1 className="mt-3 font-[family-name:var(--font-fraunces)] text-5xl text-moon">
          影像馆
        </h1>
        <p className="mt-4 max-w-2xl text-paper/70">
          把你看过的现场、拍下的照片、剪好的片段传上来，和大家一起收藏深夜里关于他的影像。审核通过后会展示在下方。
        </p>
      </header>

      <section className="mb-14">
        <GalleryUpload />
      </section>

      {supabase && (
        <section>
          {items.length === 0 ? (
            <p className="text-mist">还没有通过审核的影像，来投第一份吧。</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((it) => (
                <figure
                  key={it.id}
                  className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]"
                >
                  {it.type === "video" ? (
                    <video
                      src={storageUrl(it.storage_path)}
                      controls
                      className="aspect-video w-full bg-night-deep object-cover"
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={storageUrl(it.storage_path)}
                      alt={it.caption ?? it.nickname}
                      loading="lazy"
                      className="aspect-video w-full object-cover"
                    />
                  )}
                  <figcaption className="p-4">
                    <div className="text-sm text-paper/90">{it.nickname}</div>
                    {it.caption && (
                      <div className="mt-1 text-xs text-paper/50">
                        {it.caption}
                      </div>
                    )}
                    <div className="mt-2 text-xs text-mist/60">
                      {fmtDate(it.created_at)}
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
