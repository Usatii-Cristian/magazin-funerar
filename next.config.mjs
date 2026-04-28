/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
  experimental: {
    optimizePackageImports: ["@prisma/client"],
  },
  async headers() {
    return [
      {
        source: "/uploads/(.*)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/(.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.webp|.*\\.avif|.*\\.svg|.*\\.ico)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
