/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY,
  }
}

module.exports = nextConfig
