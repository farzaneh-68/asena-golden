import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const base = isProd ? "/asena-golden" : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: base,
  assetPrefix: isProd ? "/asena-golden/" : "",
  env: {
    NEXT_PUBLIC_BASE_PATH: base,
  },
};

export default nextConfig;
