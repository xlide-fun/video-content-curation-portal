/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: '**.redgifs.com' },
      { protocol: 'https', hostname: '**.eporner.com' },
      { protocol: 'https', hostname: 'thumbs.redgifs.com' },
      { protocol: 'https', hostname: 'static-cdn.eporner.com' }
    ]
  },
  trailingSlash: true
};

export default nextConfig;
