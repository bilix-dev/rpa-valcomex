/** @type {import('next').NextConfig} */
const { version } = require("./package.json");

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
  env: {
    version,
  },
  //output: "standalone",
};

module.exports = nextConfig;
