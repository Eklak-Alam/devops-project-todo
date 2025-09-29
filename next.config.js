/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,  // This ignores ESLint errors during build
  },
}

module.exports = nextConfig