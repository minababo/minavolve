import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope, Space_Grotesk } from "next/font/google";

import { siteConfig } from "@/lib/site";

import "./globals.css";

const bodyFont = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

const headingFont = Space_Grotesk({
  variable: "--font-heading-face",
  subsets: ["latin"],
});

const monoFont = IBM_Plex_Mono({
  variable: "--font-mono-face",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  applicationName: siteConfig.name,
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Minavolve",
    "Agile sprint board",
    "AI assistant",
    "Next.js App Router",
    "project management",
  ],
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bodyFont.variable} ${headingFont.variable} ${monoFont.variable} h-full`}
    >
      <body className="flex min-h-dvh flex-col bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
