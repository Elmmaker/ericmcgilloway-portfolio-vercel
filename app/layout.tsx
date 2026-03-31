import type { Metadata, Viewport } from "next";
import { Playfair_Display, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ClientShell from "./components/ClientShell";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["300", "400"],
});

export const metadata: Metadata = {
  title: "Eric McGilloway",
  description:
    "Senior Motion Graphics Designer — 15+ years shaping the visual language of broadcast television.",
  openGraph: {
    title: "Eric McGilloway",
    description:
      "Senior Motion Graphics Designer — 15+ years shaping the visual language of broadcast television.",
    url: "https://ericmcgilloway.com",
    siteName: "Eric McGilloway",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eric McGilloway",
    description:
      "Senior Motion Graphics Designer — 15+ years shaping the visual language of broadcast television.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen antialiased">
        <div className="grain" />
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
