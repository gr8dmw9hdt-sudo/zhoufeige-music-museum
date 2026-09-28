import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl flex-col items-center justify-center px-6 text-center">
      <p className="text-sm tracking-[0.4em] text-mist">404</p>
      <h1 className="moon-glow mt-4 font-[family-name:var(--font-fraunces)] text-5xl text-moon sm:text-6xl">
        你走进了没有歌的凌晨
      </h1>
      <p className="mt-6 max-w-md text-paper/70">
        这个页面不存在，或者那首歌还没被写出来。回到音乐馆吧，那里总有一盏灯亮着。
      </p>
      <Link
        href="/"
        className="mt-10 cursor-pointer rounded-full bg-moon px-8 py-3 text-sm font-medium text-night-deep transition-all duration-300 hover:-translate-y-0.5 hover:bg-moon/90 hover:shadow-[0_10px_28px_rgba(232,200,122,0.35)]"
      >
        返回首页
      </Link>
    </div>
  );
}
