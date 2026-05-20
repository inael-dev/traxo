import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/photos/**",
      },
      {
        protocol: "https",
        hostname: "static.exercisedb.dev",
        pathname: "/media/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
