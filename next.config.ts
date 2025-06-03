import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://ik.imagekit.io/bloggr/**')],
  },
};

export default nextConfig;
