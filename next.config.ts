import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/gangnam-realty-demo',
  images: {
    unoptimized: true,
  },
}

export default nextConfig
