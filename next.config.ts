import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.aceternity.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http", // 👈 use "http" here since your local backend is not using SSL
        hostname: "127.0.0.1",
        port: "8000", // 👈 specify the port if not 80 or 443
        pathname: "/media/**", // 👈 match the path where your images are served
      },
      {
        protocol: "https",
        hostname: "static.coinpaprika.com",
        port: "",
        pathname: "/**", // 👈 match all image paths
      },
      {
        protocol: "http",
        hostname: "nexatrade-backend.onrender.com",
        port: "",
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;
