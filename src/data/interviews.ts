// 访谈数据：B站 / 抖音博主对周菲戈的专访。
//   - B站：填 bvid（视频 BV 号）即可在访谈页内嵌播放，同时填 link 作为外链兜底。
//   - 抖音：无官方内嵌，只填 link，页面会以外链卡片展示。
//   - thumb：可选封面图 URL；不填则用品牌占位卡。

export type Interview = {
  platform: "B站" | "抖音";
  title: string;
  host: string; // 博主 / UP主
  date?: string; // "2026-06"
  hook?: string; // 一句话看点
  link: string; // 视频链接
  bvid?: string; // B站可选，用于内嵌播放
  thumb?: string; // 可选封面
};

export const interviews: Interview[] = [
  {
    platform: "B站",
    title: "周菲戈：把《24:01》聊透了｜1小时完整解读全创作专辑",
    host: "飞楼FlowMe",
    date: "2026-07",
    hook: "从专辑概念、创作幕后到巡演现场，飞楼FlowMe 用一小时把《24:01》聊透。",
    link: "https://www.bilibili.com/video/BV17JNY6TETY/",
    bvid: "BV17JNY6TETY",
  },
  {
    platform: "抖音",
    title: "还记得那个曾经封神的《Simon》舞台吗？",
    host: "提米 · 抖音博主",
    date: "2026",
    hook: "提米带你重温那场让周菲戈一战封神的《Simon》——51:0 全票出圈。",
    link: "https://v.douyin.com/ejtDozWuu3I/",
  },
];
