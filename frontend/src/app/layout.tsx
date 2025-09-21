import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Baddie Reseller AI Manifested by HustleNHeal",
  description: "AI-powered product generator for digital entrepreneurs and resellers. Start your $1 trial today!",
  keywords: "reseller, AI, product generator, baddie, entrepreneur, automation",
  openGraph: {
    title: "Baddie Reseller AI Manifested by HustleNHeal",
    description: "AI-powered product generator for digital entrepreneurs and resellers",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="font-sans antialiased bg-gradient-to-br from-pink-50 to-purple-50 min-h-screen"
      >
        {children}
      </body>
    </html>
  );
}
