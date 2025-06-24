import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
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

export default nextConfig;
