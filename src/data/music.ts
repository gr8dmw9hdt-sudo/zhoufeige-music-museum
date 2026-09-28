// 周菲戈作品数据（来源：QQ音乐 / 网易云 / 抖音百科 / Apple Music Essentials）

const ne = (id: number) => `https://music.163.com/song?id=${id}`;
const qq = (mid: string) => `https://y.qq.com/n/ryqq/songDetail/${mid}`;

export type Track = {
  title: string;
  year: number;
  from: string; // 所属专辑/节目
  tag: "原创" | "综艺Live" | "OST" | "EP";
  note?: string;
  link?: string; // 单曲播放页
};

export type Album = {
  title: string;
  year: number;
  type: string;
  desc: string;
  tracks: { title: string; link: string }[];
  link?: string; // 音乐平台专辑页
};

export type MusicPlatform = "QQ音乐" | "网易云音乐" | "Apple Music";

export const artistLinks: { name: MusicPlatform; href: string }[] = [
  { name: "QQ音乐", href: "https://y.qq.com/n/ryqq/singer/004JKckS14vKm8" },
  { name: "网易云音乐", href: "https://music.163.com/#/artist?id=53755180" },
  { name: "Apple Music", href: "https://music.apple.com/cn/artist/周菲戈/1635846036" },
];

export type SocialPlatform = "微博" | "B站" | "抖音" | "小红书";

export const socialLinks: { name: SocialPlatform; handle: string; href: string }[] = [
  { name: "微博", handle: "@周菲戈（歌手·音乐人）", href: "https://weibo.com/n/周菲戈" },
  { name: "B站", handle: "浙艺没有菲戈", href: "https://space.bilibili.com/513613827" },
  { name: "抖音", handle: "周菲戈（成都巡演版）", href: "https://v.douyin.com/iUKEdDYS/" },
  { name: "小红书", handle: "周菲戈（发新专 巡演版）", href: "https://www.xiaohongshu.com/search_result?keyword=" + encodeURIComponent("周菲戈（发新专 巡演版）") },
];

export const albums: Album[] = [
  {
    title: "24:01",
    year: 2026,
    type: "首张全长创作专辑",
    desc: "2026年6月17日发行、索尼音乐出品。几乎全创作的深夜专辑，把傍晚到破晓前那些纷飞的心事写进旋律——含「月球三部曲」（被月光晒伤的人、吴刚伐桂、月食发生时）与国风电子的《大开杀戒》。",
    tracks: [
      { title: "大开杀戒", link: ne(3368730446) },
      { title: "魔王的歌谣", link: ne(3388595254) },
      { title: "被月光晒伤的人", link: ne(3375686383) },
      { title: "吴刚伐桂", link: ne(3381869932) },
      { title: "月食发生时", link: ne(3392256318) },
      { title: "神经病爱情", link: ne(3392256320) },
      { title: "今夜的挽歌", link: ne(3392256321) },
      { title: "无忧", link: ne(3392257145) },
      { title: "早餐", link: ne(3392256322) },
      { title: "怕黑", link: ne(3392257146) },
    ],
    link: "https://y.qq.com/n/ryqq/albumDetail/004a4J3F4I6jUB",
  },
  {
    title: "顿悟",
    year: 2024,
    type: "全创作 EP",
    desc: "作曲由周菲戈独立完成，融合流行、CityPop、Funk。从2023年4月写下第一首demo开始，一年间开出五朵小花。",
    tracks: [
      { title: "没有人听的歌", link: ne(2146682372) },
      { title: "猴子偷桃", link: ne(2153772173) },
      { title: "内伤", link: ne(2156116758) },
      { title: "双黄蛋", link: ne(2158585565) },
      { title: "溜走了", link: ne(2161485338) },
    ],
    link: "https://y.qq.com/n/ryqq/albumDetail/002kHWDL4UA3mP",
  },
  {
    title: "Just Like The Way You Are",
    year: 2023,
    type: "21岁生日单曲",
    desc: "21岁生日当天发行，成为歌手后的第一份生日礼物，复古温暖的爵士流行。",
    tracks: [{ title: "Just Like The Way You Are", link: ne(2064802606) }],
    link: "https://music.163.com/album?id=169829540",
  },
  {
    title: "飞鸽",
    year: 2022,
    type: "首支个人单曲",
    desc: "2022年10月28日发行的第一首个人单曲，从舞台翻唱走向原创的起点。",
    tracks: [{ title: "飞鸽", link: ne(2013102376) }],
    link: "https://y.qq.com/n/ryqq/albumDetail/003tp6mL48DjbE",
  },
  {
    title: "二十分的爱",
    year: 2024,
    type: "复古 Jazz POP 单曲",
    desc: "周菲戈作曲、姜郎山作词，Bruno Mars 式的复古爵士流行。",
    tracks: [{ title: "二十分的爱", link: ne(2653447664) }],
    link: "https://music.163.com/album?id=255932071",
  },
];

export const tracks: Track[] = [
  // 综艺出圈
  { title: "Simon", year: 2022, from: "2022中国好声音 第8期", tag: "综艺Live", note: "51:0 全票胜出，透亮高音一战成名", link: ne(1983714138) },
  { title: "拆穿", year: 2022, from: "2022中国好声音 第12期", tag: "综艺Live", link: ne(1987550202) },
  { title: "独上C楼", year: 2022, from: "2022中国好声音", tag: "综艺Live", note: "充满戏剧张力的改编现场", link: ne(2729405154) },
  // 原创
  { title: "飞鸽", year: 2022, from: "个人单曲", tag: "原创", link: ne(2013102376) },
  { title: "半空", year: 2023, from: "个人单曲", tag: "原创", link: ne(2023233146) },
  { title: "神经病爱情", year: 2026, from: "《24:01》", tag: "原创", note: "律动 + 管乐元素", link: ne(3392256320) },
  { title: "今夜的挽歌", year: 2026, from: "《24:01》", tag: "原创", link: ne(3392256321) },
  // OST
  { title: "时间如何带走悲伤", year: 2024, from: "《骄阳似我》影视原声带", tag: "OST", link: qq("00482Jmq1nuLVQ") },
  // 亚新声
  { title: "B级鲨鱼 (Live)", year: 2025, from: "亚洲新声 第2期", tag: "综艺Live", link: ne(2710103490) },
  { title: "二十分的爱 (Live)", year: 2025, from: "亚洲新声 第4期", tag: "综艺Live", link: ne(2714786486) },
  { title: "飞鱼 (Live)", year: 2025, from: "亚洲新声 第10期", tag: "综艺Live", note: "《亚洲新声》亚军之路", link: ne(2729402934) },
];

export type TourDate = {
  city: string;
  date: string; // "2026-07-17" 或 "待定"
  venue: string;
  ticket?: string; // 票价摘要
  note?: string;   // 生日场 / 收官站
  link?: string;   // 购票/详情页（暂以官方渠道为准）
};

// 2026「原来你也睡不着」《24:01》巡回演唱会（场次/票价以官方为准）
export const tourDates: TourDate[] = [
  { city: "上海", date: "2026-07-17", venue: "回响之地 Music Park", ticket: "¥237 / 337 / 417 / 617", note: "生日场 · 首站 · 嘉宾 林志炫" },
  { city: "深圳", date: "2026-07-25", venue: "SoFun Live（光明区）", ticket: "¥237 / 417" },
  { city: "长沙", date: "2026-08-01", venue: "达丰空间（锦秀店）", ticket: "¥237 / 417" },
  { city: "成都", date: "2026-08-08", venue: "MAO Livehouse 成都", ticket: "¥237 / 417", note: "嘉宾 王泓昊" },
  { city: "青岛", date: "2026-08-29", venue: "来舞演艺中心", ticket: "¥237 / 417", note: "嘉宾 斯丹曼簇" },
  { city: "杭州", date: "2026-09-12", venue: "CH8-LIVEHOUSE（杭州小河店）", ticket: "¥237 / 417", note: "嘉宾 可楼" },
  { city: "北京", date: "2026-09-26", venue: "蛙厂 RMMF · 北京798店", ticket: "¥237 / 417", note: "嘉宾 杨润泽" },
  { city: "广州", date: "2026-10-17", venue: "CH8蛙厂演艺中心（大学城店）", ticket: "普票317 / VIP417 / SVIP617", note: "收官站 · 全坐席" },
];

export const milestones = [
  { year: 2014, title: "《江山飞歌》", desc: "12岁，人民音乐出版社发行同名专辑，登上央视少儿频道《音乐快递》，获\"最美好声音小歌手\"。" },
  { year: 2022, title: "《中国好声音》出圈", desc: "廖昌永、李克勤双导师转身，加入廖昌永战队；导师对战 51:0 全票胜出，《Simon》成为年度记忆。" },
  { year: 2023, title: "从翻唱走向原创", desc: "加盟《声生不息·宝岛季》，与魏如萱、艾薇合作；连发六张个人专辑，写出《飞鸽》《半空》。" },
  { year: 2024, title: "全创作 EP《顿悟》", desc: "作曲独立完成，融合 CityPop、Funk，制作名单出现陈牧荻、严若晨。" },
  { year: 2025, title: "《亚洲新声》亚军", desc: "国际舞台再出发，《B级鲨鱼》《二十分的爱》展现现场驾驭力。" },
  { year: 2026, title: "首张全长专辑《24:01》", desc: "几乎全创作的深夜专辑，从\"被看见的好声音\"走向\"写自己故事的歌手\"。" },
];
