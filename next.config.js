/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
    ],
  },
  // Exclude liquid-glass-studio-main from build
  webpack: (config) => {
    config.module.rules.push({
      test: /liquid-glass-studio-main/,
      use: 'ignore-loader',
    });
    return config;
  },
};

module.exports = nextConfig;
