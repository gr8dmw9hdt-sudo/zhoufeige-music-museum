"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { gsap, EASE_OUT, prefersReducedMotion } from "@/lib/gsap";
import EarCover from "@/components/EarCover";
import { latestIssue } from "@/data/ears";

// 入站文案：逐句浮现，每句 1.5–2s
const LINES = [
  "雾从夜里长出来，薄薄地，盖住了路的尽头。",
  "24:01，月亮被云滤成一层水光，落进窗里，像一封还没写完的信。",
  "有人在暗处试音 —— 弦音湿漉漉的，还没调准，就先漏出两声心事。",
  "你推门进来，风替你抖落了肩上的夜。",
  "这里不点灯，灯都藏进歌里了。",
  "找个位置坐下吧。天亮以前，音乐馆不打烊；天亮以后，这些歌会替你记得，今晚有人来过。",
];

const FIRST_AT = 0.3; // 首句起点（秒）
const LINE_AT = 1.6; // 句间距（秒）
const LINE_IN = 0.9; // 单句淡入时长
const HOLD = 1.6; // 末句读完后停留
const COVER_IN = 1.4; // 「耳畔」封面淡入时长（稍长一些，收尾更柔）
const LEAVE = 0.6; // 整层淡出时长

/**
 * 中央流沙：一片聚在画面中段的沙，自上而下流动，像沙丘塌下来的流沙。
 *
 * 做法要点：
 * 1. 几千颗细沙共用一套「流场」——同一条正弦主波 + 次级波纹，所以整片沙是一起
 *    画 S 形往下淌的（成片），而不是各飘各的；
 * 2. 沙粒横向按三角分布向中线聚拢，中间厚两边薄；
 * 3. 每帧先用 destination-out 淡出上一帧再叠加本帧 → 长出细长的丝状拖尾，
 *    这是「流沙」的关键质感；用 destination-out 而不是盖深色，才不会压暗背后的月光。
 */
function startSand(canvas: HTMLCanvasElement): () => void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  const COLORS = [
    [246, 224, 168], // 满月高光
    [232, 200, 122], // 主金
    [206, 178, 124], // 暗金
    [138, 147, 184], // 雾蓝
  ];
  const BAND = 0.25; // 沙带半宽（屏宽比例）→ 主体落在中央 25%–75%
  const FADE = 0.13; // 每帧残留量：越小拖尾越长、越像流沙

  const rand = (a: number, b: number) => a + Math.random() * (b - a);

  type Grain = {
    base: number; // 横向基准位（屏宽比例）
    y: number; // 当前 y（px）
    speed: number; // 下落速度（px/s）
    size: number; // 粒径（px）
    alpha: number;
    depth: number; // 0–1：越近越大越快越亮，叠出前后层次
    color: number[];
  };

  let grains: Grain[] = [];
  let W = 0;
  let H = 0;

  function build() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

    // 沙粒数随屏宽伸缩，手机端也不掉帧
    const total = Math.round(Math.min(2600, Math.max(900, W * 1.8)));
    grains = Array.from({ length: total }, () => {
      // 三角分布：中间厚、两边薄
      const tri = (Math.random() + Math.random() - 1) * BAND;
      const base = 0.5 + tri;
      const core = 1 - Math.min(1, Math.abs(tri) / BAND); // 中心权重
      const strata = 0.55 + 0.45 * Math.sin(base * 120); // 层理：一道道的沙纹
      const depth = Math.random();
      return {
        base,
        y: rand(-H * 0.15, H),
        speed: rand(150, 320) * (0.7 + depth * 0.5),
        size: 0.6 + depth * 1.6,
        alpha: (0.02 + 0.1 * core) * strata * (0.5 + depth * 0.7),
        depth,
        color: COLORS[Math.floor(rand(0, COLORS.length))],
      };
    });
  }

  let t = 0;
  let last = performance.now();
  let raf = 0;

  function frame(now: number) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    t += dt;

    // 淡出上一帧 → 长拖尾（不压暗背后的月光）
    ctx!.globalCompositeOperation = "destination-out";
    ctx!.fillStyle = `rgba(0, 0, 0, ${FADE})`;
    ctx!.fillRect(0, 0, W, H);

    ctx!.globalCompositeOperation = "lighter";

    // 整片沙缓慢左右游走，像沙丘受风
    const sway = Math.sin(t * 0.32) * 0.62 + Math.sin(t * 0.13 + 1.7) * 0.38;

    for (const g of grains) {
      g.y += g.speed * dt;
      if (g.y > H * 1.08) {
        g.y -= H * 1.2;
        g.base = 0.5 + (Math.random() + Math.random() - 1) * BAND; // 回顶时重掷，避免整片像刚体
      }

      // 共用流场：主波让整片沙一起弯曲，次级波纹叠出细沙的纹路
      const x =
        g.base * W +
        Math.sin(g.y * 0.0021 + t * 0.34 + sway) * W * 0.07 * (0.6 + g.depth * 0.4) +
        Math.sin(g.y * 0.0064 - t * 0.52) * W * 0.026;

      // 顶部淡入（像从天而降）、底部淡出
      const fadeIn = Math.min(1, Math.max(0, g.y / (H * 0.16)));
      const fadeOut = 1 - Math.min(1, Math.max(0, (g.y - H * 0.78) / (H * 0.22)));
      const a = g.alpha * fadeIn * fadeOut;
      if (a <= 0.002) continue;

      ctx!.fillStyle = `rgba(${g.color[0]}, ${g.color[1]}, ${g.color[2]}, ${a.toFixed(3)})`;
      ctx!.fillRect(x, g.y, g.size, g.size);
    }

    raf = requestAnimationFrame(frame);
  }

  build();
  raf = requestAnimationFrame(frame);
  window.addEventListener("resize", build);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", build);
  };
}

export default function EntranceIntro() {
  const router = useRouter();
  const [visible, setVisible] = useState(true);
  const [atCover, setAtCover] = useState(false); // 是否已停在「耳畔」封面屏
  const rootRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  // 三个出口（跳过 / 进主页 / 读本期）都在 effect 里定义，用 ref 交给 JSX 调用
  const actRef = useRef<{ skip: () => void; enter: () => void; read: () => void }>({
    skip: () => {},
    enter: () => {},
    read: () => {},
  });

  useEffect(() => {
    // 每次进入/刷新都完整播一遍（不做「本会话只看一次」的记档）；
    // 只有系统层面要求减少动效时才整段跳过，直接进站（耳畔经导航可达）
    if (prefersReducedMotion()) {
      setVisible(false);
      return;
    }

    const root = rootRef.current;
    const scene = sceneRef.current;
    const cover = coverRef.current;
    const canvas = canvasRef.current;
    const content = contentRef.current;
    if (!root || !scene || !cover || !canvas || !content) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden"; // 播放期间锁滚动

    const stopSand = startSand(canvas);
    const lines = root.querySelectorAll<HTMLElement>(".intro-line");
    let done = false;
    let tl: gsap.core.Timeline;

    // 文案与封面同屏（封面从第一帧就在版内，只是还没显影），若总高超出视口（手机竖屏）
    // 就整体等比缩小。开局就量一次，中途不再改尺寸——所以整段动画没有位移跳动
    function fitContent() {
      const el = contentRef.current;
      const host = rootRef.current;
      if (!el || !host) return;
      const avail = host.clientHeight - 48;
      const h = el.scrollHeight;
      const k = h > avail ? Math.max(0.62, avail / h) : 1;
      gsap.to(el, { scale: k, duration: 0.5, ease: EASE_OUT });
    }

    const onResize = () => fitContent();
    window.addEventListener("resize", onResize);

    // 封面登场：不加位移抖动，用「上浮 + 从水光里聚拢」的方式淡入，收尾更顺
    const coverIn = (dur: number) =>
      gsap.fromTo(
        cover,
        { opacity: 0, y: 22, filter: "blur(6px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: dur, ease: EASE_OUT },
      );

    // 离场：解滚动锁、整层淡出（可选跳转到某页）
    function leave(href?: string) {
      if (done) return;
      done = true;
      tl.kill();
      document.body.style.overflow = prevOverflow;
      gsap.to(root, {
        opacity: 0,
        duration: LEAVE,
        ease: EASE_OUT,
        onComplete: () => {
          setVisible(false);
          if (href) router.push(href);
        },
      });
    }

    // 停在「耳畔」封面：跳过剩余动画，直接落到封面屏（之后等访客点击）
    function showCover() {
      if (done) return;
      tl.kill();
      gsap.set(scene, { opacity: 0.45, scale: 1 });
      // 提前跳过来时，六句还没依次浮现，直接补到「已浮现」状态，文案照旧留在屏上
      lines.forEach((el) => gsap.set(el, { opacity: 1, y: 0, filter: "blur(0px)" }));
      setAtCover(true); // 文案本来就在左栏，这一步只是让右栏的封面显影，没有任何位移
      coverIn(0.9);
      gsap.delayedCall(2.1, fitContent);
    }
    actRef.current = {
      skip: showCover,
      enter: () => leave(),
      read: () => leave(`/radio/${latestIssue.slug}`),
    };

    // 入场编排：流沙先起 → 月光随第二句展开 → 六句逐一浮现 → 右栏淡出「耳畔」封面
    gsap.set(scene, { scale: 0.88 });
    const afterLines = FIRST_AT + (LINES.length - 1) * LINE_AT + LINE_IN + HOLD;

    tl = gsap.timeline({ defaults: { ease: EASE_OUT } });

    // 首帧就把整体缩放到合适尺寸：之后布局不再变化，动画全程只做「显影」
    tl.call(fitContent, undefined, 0.05);

    tl.to(scene, { opacity: 0.45, scale: 1, duration: 2.4 }, FIRST_AT + LINE_AT * 0.6);

    lines.forEach((el, i) => {
      tl.fromTo(
        el,
        { opacity: 0, y: 16, filter: "blur(10px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: LINE_IN },
        FIRST_AT + i * LINE_AT,
      );
    });

    // 六句不撤场（一直在左栏）：本期「耳畔」封面在右栏淡入，与末句的余韵叠一会儿
    tl.call(() => setAtCover(true), undefined, afterLines + 0.25);
    tl.add(coverIn(COVER_IN), afterLines + 0.35);
    tl.call(fitContent, undefined, afterLines + 0.35 + COVER_IN + 1);

    return () => {
      tl.kill();
      stopSand();
      window.removeEventListener("resize", onResize);
      document.body.style.overflow = prevOverflow;
    };
  }, [router]);

  if (!visible) return null;

  return (
    <div
      ref={rootRef}
      className="intro-veil fixed inset-0 z-[100] flex items-center justify-center overflow-hidden px-6 backdrop-blur-2xl"
    >
      {/* 月光图（CSS 手绘）：文字背后的柔光画面 */}
      <div
        ref={sceneRef}
        aria-hidden
        style={{ opacity: 0 }} /* SSR 即隐藏，避免首帧闪出月盘 */
        className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center"
      >
        <div className="intro-moon h-[46vmin] w-[46vmin]" />
        <div
          className="intro-cloud intro-cloud--a"
          style={{ top: "36%", left: "-10%", width: "120%", height: "15%" }}
        />
        <div
          className="intro-cloud intro-cloud--b"
          style={{ top: "52%", left: "-6%", width: "112%", height: "10%", opacity: 0.8 }}
        />
      </div>

      {/* 中央流沙 */}
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2] h-full w-full"
      />

      {/* 入站文案 + 本期「耳畔」封面：文案从第一帧就落在左栏（不居中、不滑动），
          封面收尾时在右栏淡入——动画全程布局不变，所以过渡是顺的 */}
      <div
        ref={contentRef}
        className="relative z-10 flex w-full max-w-5xl flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-14"
      >
        <div className="flex w-full flex-col items-center gap-4 text-center text-[17px] leading-[2] text-paper/85 sm:gap-5 sm:text-lg lg:w-[46%] lg:items-start lg:text-left">
          {LINES.map((line) => (
            <p key={line} className="intro-line">
              {line}
            </p>
          ))}
        </div>

        {/* 本期「耳畔」封面：始终挂在右栏占位（invisible 不占焦点、不参与空格键），
            动画收尾时才显影并停在这一屏——因此布局自始至终没有变化 */}
        <div
          ref={coverRef}
          style={{ opacity: 0 }}
          className={`w-full lg:w-[54%] ${atCover ? "" : "invisible"}`}
        >
          <EarCover
            issue={latestIssue}
            onEnter={() => actRef.current.enter()}
            onRead={() => actRef.current.read()}
          />
        </div>
      </div>

      {!atCover && (
        <button
          type="button"
          onClick={() => actRef.current.skip()}
          aria-label="跳过开场动画"
          className="absolute bottom-6 right-6 z-10 cursor-pointer rounded-full border border-paper-line px-4 py-1.5 text-xs text-mist transition-colors duration-300 hover:border-moon/50 hover:text-moon"
        >
          跳过 →
        </button>
      )}
    </div>
  );
}
