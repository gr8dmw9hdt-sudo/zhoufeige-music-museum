import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "关于周菲戈",
  description:
    "2002年生于浙江江山的00后创作歌手，从《Simon》的51:0到首张全创作专辑《24:01》。",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <header className="mb-14">
        <p className="text-sm tracking-[0.3em] text-mist">ABOUT</p>
        <h1 className="mt-3 font-[family-name:var(--font-fraunces)] text-5xl text-moon">关于周菲戈</h1>
      </header>

      <div className="space-y-8 text-paper/80">
        <p>
          <span className="text-moon">周菲戈</span>
          ，2002年7月17日生于浙江江山，毕业于浙江艺术职业学院，中国内地流行乐男歌手。
        </p>
        <p>
          名字里的&ldquo;菲戈&rdquo;，来自父亲崇拜的葡萄牙球星
          Figo——只是这个孩子后来没走上球场，而是拿起了话筒。
        </p>
        <p>
          12岁那年，他由人民音乐出版社发行了专辑《江山飞歌》，登上央视少儿频道《音乐快递》，
          被称作&ldquo;最美好声音小歌手&rdquo;。那是故事的起点。
        </p>
        <p>
          2022年，他顶着爆炸头站上《中国好声音》的舞台，一首《Simon》拿下
          <span className="text-moon"> 51:0 </span>
          的导师对战全票，成为那一年华语乐坛最被记住的新声。此后他又在《声生不息·宝岛季》、
          2025年《亚洲新声》（亚军）中持续证明现场。
        </p>
        <p>
          但他更想做的，是写自己的歌。2023年写下第一首demo，2024年交出全创作EP《顿悟》，
          2026年发行几乎一手包办的首张全长专辑《24:01》——
          <em className="text-moon/90">
            把傍晚、子夜、凌晨三点那些纷飞的心事，全部收进旋律。
          </em>
        </p>
        <p>他擅长流行、民谣，新歌里也藏着国风与武侠的骨相。</p>
      </div>

      <dl className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/5 bg-white/5 sm:grid-cols-4">
        {[
          ["出生地", "浙江江山"],
          ["生", "2002.07.17"],
          ["毕业", "浙江艺术职业学院"],
          ["风格", "流行 / 民谣 / CityPop"],
        ].map(([k, v]) => (
          <div key={k} className="bg-night-deep p-5 text-center">
            <dt className="text-xs text-mist">{k}</dt>
            <dd className="mt-1 text-sm text-paper">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
