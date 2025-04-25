/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  // Cloudflare Pages specific configuration
  experimental: {
    runtime: 'edge',
    serverComponents: true,
  },
  // Ensure compatibility with Cloudflare Pages
  swcMinify: true,
  // Disable image optimization which can cause issues on Cloudflare
  images: {
    unoptimized: true,
  }
};

export default nextConfig;
