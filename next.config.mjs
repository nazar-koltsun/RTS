/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/factoring',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
