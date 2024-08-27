/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    apiws:'ws://192.168.13.174:4500',
    apiurl: 'http://192.168.13.174:4500',
    AUTH_SECRET:'J8Jt9JPwxJGObxxbFXda/ncOyYi9RigtqTZts5NS/Aw='
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tailus.io'
      }
    ]
  }
};

export default nextConfig;
