import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/calcbox",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
