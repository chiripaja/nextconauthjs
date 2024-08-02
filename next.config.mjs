/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        apiurl: 'http://192.168.250.10:4500',
      },
      images:{
        remotePatterns:[
          {
            protocol:'https',
            hostname:'tailus.io'
          }
        ]
      }
};

export default nextConfig;
