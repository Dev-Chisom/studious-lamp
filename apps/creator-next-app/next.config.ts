import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["images.pexels.com", "ui-avatars.com", "i.pravatar.cc", "picsum.photos"],
  },
  async redirects() {
    return [
      {
        source: "/creators/:username",
        destination: "/@:username",
        permanent: true,
      },
      {
        source: "/creators/@:username",
        destination: "/@:username",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
