import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.pravatar.cc' },
    ],
  },
  async rewrites() {
    return [
      { source: '/login', destination: '/login.html' },
      { source: '/register', destination: '/register.html' },
      { source: '/transactions', destination: '/transaction.html' },
    ];
  },
};

export default nextConfig;
