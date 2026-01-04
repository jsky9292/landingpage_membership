import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Force new build ID to invalidate cache
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
};

export default nextConfig;
// rebuild 1767548900
// force deploy Mon, Jan  5, 2026  3:00:48 AM
