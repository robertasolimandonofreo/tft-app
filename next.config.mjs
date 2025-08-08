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

  devIndicators: {
    buildActivity: false,
    buildActivityPosition: 'bottom-right',
  },

  experimental: {
    turbo: false,
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Fix for missing modules in development
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      }
    }
    return config
  },
}

module.exports = nextConfig