/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
