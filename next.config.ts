import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export", //means app will build as a static site
  distDir: "out",
  images: {
    unoptimized: true, //to avoid image optimization; feature of static site
  },
  basePath: "",
  assetPrefix: "./",
  trailingSlash: true,
};

export default nextConfig;
