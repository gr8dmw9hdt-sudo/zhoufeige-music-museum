import {
  siBilibili,
  siXiaohongshu,
  siSinaweibo,
  siNeteasecloudmusic,
  siApplemusic,
} from "simple-icons";

// 抖音（Douyin）官方 logo 路径，viewBox 0 0 1024 1024（simple-icons 无此图标）
const DOUYIN_PATH =
  "M937.386667 423.850667a387.84 387.84 0 0 1-232.874667-77.824v352.341333C704.512 878.250667 565.930667 1024 394.922667 1024S85.333333 878.250667 85.333333 698.368c0-179.882667 138.581333-325.632 309.589334-325.632 17.066667 0 33.706667 1.450667 49.92 4.266667v186.624a131.754667 131.754667 0 0 0-48.64-9.216c-76.288 0-138.154667 65.024-138.154667 145.322666 0 80.213333 61.866667 145.322667 138.24 145.322667 76.202667 0 138.069333-65.109333 138.069333-145.322667V0h172.714667c0 134.485333 103.68 243.541333 231.594667 243.541333v180.309334h-1.28";

// QQ音乐官方 logo 近似：音符图标（Material Icons "music_note"，simple-icons 无 QQ音乐 品牌图标）
const QQ_MUSIC_PATH =
  "M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z";

type IconDef = { viewBox: string; path: string };

const ICONS = {
  微博: { viewBox: "0 0 24 24", path: siSinaweibo.path },
  B站: { viewBox: "0 0 24 24", path: siBilibili.path },
  抖音: { viewBox: "0 0 1024 1024", path: DOUYIN_PATH },
  小红书: { viewBox: "0 0 24 24", path: siXiaohongshu.path },
  "QQ音乐": { viewBox: "0 0 24 24", path: QQ_MUSIC_PATH },
  "网易云音乐": { viewBox: "0 0 24 24", path: siNeteasecloudmusic.path },
  "Apple Music": { viewBox: "0 0 24 24", path: siApplemusic.path },
} satisfies Record<string, IconDef>;

export type PlatformName = keyof typeof ICONS;

export default function PlatformIcon({
  name,
  className,
}: {
  name: PlatformName;
  className?: string;
}) {
  const icon = ICONS[name];
  if (!icon) return null;
  return (
    <svg
      viewBox={icon.viewBox}
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d={icon.path} />
    </svg>
  );
}
