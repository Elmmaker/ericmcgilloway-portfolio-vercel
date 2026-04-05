import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent the site from being embedded in iframes (clickjacking)
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  // Stop browsers from guessing content types
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // Send only origin (no path) when navigating to external sites
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // Disable browser features this site doesn't use
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  // Content Security Policy
  // - script-src: Next.js requires unsafe-inline for hydration scripts
  // - style-src: Framer Motion uses inline styles
  // - frame-src: Framerate.tv for video embeds
  // - connect-src: Formspree for the contact form
  // - font/img/media: self-hosted only
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self'",
      "img-src 'self' data: blob:",
      "media-src 'self'",
      "frame-src https://framerate.tv",
      "connect-src 'self' https://formspree.io",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self' https://formspree.io",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
