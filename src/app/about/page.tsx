import type { Metadata } from "next";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "关于周菲戈",
  description:
    "2002年生于浙江江山的00后创作歌手，从《Simon》的51:0到首张全创作专辑《24:01》。",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <Reveal>
        <header className="mb-14">
          <p className="kicker">ABOUT</p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl text-moon">关于周菲戈</h1>
        </header>
      </Reveal>

      <Reveal delay={0.1}>
      <div className="space-y-8 text-paper/90">
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
      </Reveal>

      <Reveal delay={0.15}>
      <dl className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-paper-line bg-paper-surface sm:grid-cols-4">
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
      </Reveal>

      {/* 声明：非官方 + 版权归属 + 联系方式。不显眼，但版权方找过来时要能一眼看到 */}
      <Reveal delay={0.2}>
        <section className="mt-14 rounded-xl border border-paper-line bg-paper-surface p-6">
          <p className="kicker mb-3">声明 / NOTICE</p>
          <ul className="space-y-2 text-xs leading-relaxed text-mist">
            <li>本站为非官方网站，由粉丝个人建立与维护，与周菲戈本人及其工作室无隶属关系。</li>
            <li>
              站内图片、音乐与歌词版权归原作者及版权方所有；音乐仅提供副歌 30 秒片段试听，
              不提供完整音源下载。
            </li>
            <li>
              本站不作任何商业用途（无广告、无带货、无收费）。如涉侵权，请邮件告知
              <a
                href="mailto:xuchengshicity@icloud.com"
                className="cursor-pointer text-moon/80 underline decoration-moon/30 underline-offset-2 transition-colors duration-300 hover:text-moon"
              >
                xuchengshicity@icloud.com
              </a>
              ，我们会立即删除。
            </li>
          </ul>
        </section>
      </Reveal>
    </div>
  );
}
