import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["picsum.photos"], // 允许加载图片的域名
    formats: ["image/avif", "image/webp"],
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
  // 输出配置
  output: "standalone", // 优化Docker部署
};

export default nextConfig;
