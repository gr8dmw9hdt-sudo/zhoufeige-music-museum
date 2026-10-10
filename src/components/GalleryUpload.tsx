"use client";

import { useState } from "react";

const MAX_SIZE = 50 * 1024 * 1024; // 50MB（仅图片；Supabase 免费版空间有限）
const BUCKET = "gallery";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function fmtSize(bytes: number) {
  if (bytes >= 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`;
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${bytes} B`;
}

/**
 * 浏览器直传 Supabase Storage（TUS 可断点续传）。
 * 文件不经过 Cloudflare 边缘函数，因此可突破其 100MB 请求体上限。
 */
function uploadWithTus(
  file: File,
  objectName: string,
  contentType: string,
  onProgress: (pct: number) => void,
): Promise<void> {
  return import("tus-js-client").then(
    (tus) =>
      new Promise<void>((resolve, reject) => {
        const upload = new tus.Upload(file, {
          endpoint: `${SUPABASE_URL}/storage/v1/upload/resumable`,
          retryDelays: [0, 3000, 5000, 10000, 20000],
          headers: {
            authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            "x-upsert": "false",
          },
          uploadDataDuringCreation: true,
          removeFingerprintOnSuccess: true,
          metadata: {
            bucketName: BUCKET,
            objectName,
            contentType,
            cacheControl: "3600",
          },
          chunkSize: 6 * 1024 * 1024, // Supabase 要求固定 6MB
          onError: (error) => reject(error),
          onProgress: (bytesUploaded, bytesTotal) => {
            if (bytesTotal > 0) {
              onProgress(Math.round((bytesUploaded / bytesTotal) * 100));
            }
          },
          onSuccess: () => resolve(),
        });
        upload.start();
      }),
  );
}

export default function GalleryUpload() {
  const [nickname, setNickname] = useState("");
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  function pickFile(f: File | null) {
    setError("");
    setDone(false);
    setProgress(0);
    if (f && f.size > MAX_SIZE) {
      setFile(null);
      setError("图片超过 50MB，请压缩后再上传");
      return;
    }
    setFile(f);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setDone(false);
    if (!file) {
      setError("请先选择要上传的图片或视频");
      return;
    }
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      setError("上传服务未就绪，请稍后再试");
      return;
    }

    setUploading(true);
    setProgress(0);
    try {
      const type = "image";
      const ext = file.name.split(".").pop() || "bin";
      const path = `${crypto.randomUUID()}.${ext}`;
      const contentType = file.type || "application/octet-stream";

      // 1) 直传 Supabase（TUS 断点续传）
      await uploadWithTus(file, path, contentType, setProgress);

      // 2) 只把元信息写入审核队列（轻量 JSON，不传文件）
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storage_path: path,
          type,
          nickname: nickname.trim(),
          caption: caption.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "提交失败，请稍后再试");

      setDone(true);
      setNickname("");
      setCaption("");
      setFile(null);
      setProgress(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "上传失败，请稍后再试");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-paper-line bg-paper-surface p-6"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="text-mist">昵称</span>
          <input
            type="text"
            value={nickname}
            maxLength={20}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="匿名"
            className="mt-1 w-full rounded-md border border-white/10 bg-night-deep px-3 py-2 text-paper placeholder:text-mist/50 focus:border-moon/50"
          />
        </label>
        <label className="block text-sm">
          <span className="text-mist">图片（≤50MB，可断点续传）</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
            className="mt-1 w-full text-sm text-paper/70 file:mr-3 file:rounded-md file:border file:border-moon/30 file:bg-moon/10 file:px-3 file:py-2 file:text-sm file:text-moon hover:file:bg-moon/20"
          />
          {file && !uploading && (
            <span className="mt-1 block text-xs text-mist/80">{fmtSize(file.size)}</span>
          )}
        </label>
      </div>

      <label className="mt-4 block text-sm">
        <span className="text-mist">说明（可选）</span>
        <input
          type="text"
          value={caption}
          maxLength={100}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="这张图 / 这段视频想说点什么"
          className="mt-1 w-full rounded-md border border-white/10 bg-night-deep px-3 py-2 text-paper placeholder:text-mist/50 focus:border-moon/50"
        />
      </label>

      {uploading && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-mist">
            <span>{progress < 100 ? "上传中…（断点续传中，请勿关闭页面）" : "处理中…"}</span>
            <span>{progress}%</span>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-moon transition-[width] duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-5 flex items-center gap-4">
        <button
          type="submit"
          disabled={uploading}
          className="cursor-pointer rounded-full bg-moon px-6 py-2.5 text-sm font-medium text-night-deep transition-all duration-300 hover:-translate-y-0.5 hover:bg-moon/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {uploading ? "上传中…" : "上传投稿"}
        </button>
        {done && (
          <span role="status" className="text-sm text-moon">已提交，审核通过后展示 ↗</span>
        )}
        {error && <span role="alert" className="text-sm text-vermilion">{error}</span>}
      </div>
    </form>
  );
}
