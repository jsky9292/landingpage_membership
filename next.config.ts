import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Force new build ID to invalidate cache
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
};

export default nextConfig;
// force rebuild 1767548003
