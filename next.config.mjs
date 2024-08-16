/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    apiurl: 'http://192.168.250.10:4500',
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
