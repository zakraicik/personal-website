import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep production checks from replacing files used by the live local preview.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  poweredByHeader: false,
  devIndicators: false,
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
        // Next's statically rendered pages require inline hydration scripts.
        // Keep static rendering; a nonce-based script policy would require dynamic rendering.
        { key: "Content-Security-Policy", value: [
          "default-src 'self'",
          `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}`,
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: blob:",
          "font-src 'self'",
          `connect-src 'self'${process.env.NODE_ENV === "development" ? " ws: wss:" : ""}`,
          "object-src 'none'",
          "base-uri 'self'",
          "frame-ancestors 'none'",
          "form-action 'self'",
        ].join("; ") },
      ],
    }];
  },
};

export default nextConfig;
