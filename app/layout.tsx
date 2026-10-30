import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";
import { ServiceWorker } from "@/components/service-worker";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "OpenGraph Preview – Free OG Preview & Open Graph Checker",
    template: "%s | OpenGraph Preview",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: "OpenGraph Preview – Free OG Preview & Open Graph Checker",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: [{ url: "/og-cover.png", width: 1200, height: 630, alt: "OpenGraph Preview — inspect, preview and fix social sharing metadata" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenGraph Preview – Free OG Preview & Open Graph Checker",
    description: SITE_DESCRIPTION,
    images: ["/og-cover.png"],
  },
  icons: { icon: "/icons/icon.svg", apple: "/icons/apple-touch-icon.png" },
  manifest: "/manifest.webmanifest",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f8fa",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <ServiceWorker />
      </body>
    </html>
  );
}
