"use client";

import { useState } from "react";

const MAX_SIZE = 50 * 1024 * 1024; // 50MB

export default function GalleryUpload() {
  const [nickname, setNickname] = useState("");
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  function pickFile(f: File | null) {
    setError("");
    setDone(false);
    if (f && f.size > MAX_SIZE) {
      setFile(null);
      setError("文件超过 50MB，请压缩后再上传");
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

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("nickname", nickname.trim());
      fd.append("caption", caption.trim());

      const res = await fetch("/api/gallery", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "上传失败，请稍后再试");

      setDone(true);
      setNickname("");
      setCaption("");
      setFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "上传失败，请稍后再试");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-moon/10 bg-white/[0.02] p-6"
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
            className="mt-1 w-full rounded-md border border-white/10 bg-night-deep px-3 py-2 text-paper placeholder:text-mist/50 focus:border-moon/50 focus:outline-none"
          />
        </label>
        <label className="block text-sm">
          <span className="text-mist">图片 / 视频（≤50MB）</span>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
            className="mt-1 w-full text-sm text-paper/70 file:mr-3 file:rounded-md file:border file:border-moon/30 file:bg-moon/10 file:px-3 file:py-2 file:text-sm file:text-moon hover:file:bg-moon/20"
          />
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
          className="mt-1 w-full rounded-md border border-white/10 bg-night-deep px-3 py-2 text-paper placeholder:text-mist/50 focus:border-moon/50 focus:outline-none"
        />
      </label>

      <div className="mt-5 flex items-center gap-4">
        <button
          type="submit"
          disabled={uploading}
          className="cursor-pointer rounded-full bg-moon px-6 py-2.5 text-sm font-medium text-night-deep transition-all duration-300 hover:-translate-y-0.5 hover:bg-moon/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {uploading ? "上传中…" : "上传投稿"}
        </button>
        {done && (
          <span className="text-sm text-moon">已提交，审核通过后展示 ↗</span>
        )}
        {error && <span className="text-sm text-vermilion">{error}</span>}
      </div>
    </form>
  );
}
