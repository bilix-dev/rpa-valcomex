/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/auth",
        destination: "/auth/login",
        permanent: true,
      },
      {
        source: "/",
        destination: "/auth/login",
        permanent: true,
      },
    ];
  },
  //output: "standalone",
};

module.exports = nextConfig;
