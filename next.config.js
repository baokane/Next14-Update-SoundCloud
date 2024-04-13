/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // output: 'standalone',
  modularizeImports: {
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',

        // dung localhost bình thường
        hostname: 'localhost',
        port: '8000',

        // dùng docker
        // hostname: 'host.docker.internal',
        // port: '8001',
        pathname: '/images/**',
      },
    ],
  },
};

module.exports = nextConfig;
