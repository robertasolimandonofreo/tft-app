/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Disable problematic features in development
  ...(process.env.NODE_ENV === 'development' && {
    experimental: {
      optimizeCss: false,
    },
  }),

  // Disable service worker in development
  ...(process.env.NODE_ENV === 'development' && {
    generateBuildId: () => 'development',
  }),

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/:path*',
      },
    ]
  },

  // Disable problematic optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

module.exports = nextConfig