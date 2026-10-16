import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Static export for GitHub Pages
  output: "export",
  // Use repo name as base path when deploying to GitHub Pages
  basePath: isGithubPages ? "/portfolio-website" : "",
  // Required for static export (no server-side image optimization)
  images: {
    unoptimized: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
