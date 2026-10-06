import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  allowedDevOrigins: ["127.0.0.1", "192.168.1.194"],
};

export default nextConfig;
