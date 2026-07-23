import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  experimental: {
    serverActions: {
      // El bucket "evidence" acepta hasta 8 MB; el default de Next.js
      // para Server Actions es 1 MB y rechazaba cualquier foto de celular real.
      bodySizeLimit: "9mb",
    },
  },
};

export default nextConfig;
