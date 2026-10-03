import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages（next-on-pages）不支持 next/image 优化器，直接输出原图
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
