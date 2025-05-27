import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { AnimatedDotsBackground } from "@/components/AnimatedDotsBackground";
import { SectionVisibilityProvider } from "@/context/SectionVisibilityContext";
import { Footer } from "@/components/sections/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zak Raicik",
  description: "A resume website for Zak Raicik",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} antialiased overflow-x-hidden`}>
        <SectionVisibilityProvider>
          <AnimatedDotsBackground />

          <Navigation />
          <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] min-h-screen">
            <aside className="hidden md:block"></aside>
            <main className="md:pl-16">{children}</main>
          </div>
        </SectionVisibilityProvider>
        <Footer />
      </body>
    </html>
  );
}
