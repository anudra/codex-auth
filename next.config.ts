import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
     domains: [
      'lh3.googleusercontent.com', // for Google avatars
      'i.ibb.co',                  // for your custom avatars
    ],// allow Google avatars
  }
};

export default nextConfig;
