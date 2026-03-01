import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
});
const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com", // or storage.googleapis.com if using that
      },
      new URL("https://staging.media.freebites.org/**"),
      new URL("https://media.freebites.org/**"),
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: { and: [/\.(js|ts|jsx|tsx)$/] }, // Ensure this rule only applies to imports within JS/TS files
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default withMDX(nextConfig);
