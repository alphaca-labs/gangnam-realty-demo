import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/gangnam-realty-demo",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
