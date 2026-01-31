import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  // 必须把 Prisma 的二进制文件包含进去，否则打包后无法操作数据库
  serverExternalPackages: ['prisma', '@prisma/client'],
};

export default nextConfig;