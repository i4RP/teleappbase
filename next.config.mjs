/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  // Cloudflare Pages specific configuration
  experimental: {
    isrMemoryCacheSize: 0, // Disable ISR cache for Cloudflare
  },
  // Ensure compatibility with Cloudflare Pages
  swcMinify: true,
  // Disable image optimization which can cause issues on Cloudflare
  images: {
    unoptimized: true,
  }
};

export default nextConfig;
