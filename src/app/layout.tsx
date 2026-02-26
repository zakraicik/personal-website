import type { Metadata } from "next";
import "./globals.css";
import { DesktopNavigation } from "@/components/DesktopNavigation";
import { MobileNavigation } from "@/components/MobileNavigation";
import { AnimatedDotsBackground } from "@/components/AnimatedDotsBackground";
import { SectionVisibilityProvider } from "@/context/SectionVisibilityContext";
import { NavigationProvider } from "@/components/NavigationProvider";
import { Footer } from "@/components/sections/Footer";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Zak Raicik - Data Scientist, Builder, Storyteller, Creator",
  description:
    "Data scientist with passion for learning and practical experience across the full development stack.",
  openGraph: {
    title: "Zak Raicik - Data Scientist, Builder, Storyteller, Creator",
    description:
      "Data scientist with passion for learning and practical experience across the full development stack.",
    images: ["/og-image.png"],
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
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </head>
      <body className="antialiased">
        <SectionVisibilityProvider>
          <NavigationProvider>
            {/* Background layer */}
            <div className="fixed inset-0 z-0">
              <AnimatedDotsBackground />
            </div>

            {/* Mobile Navigation - positioned by layout */}
            <div className="fixed top-4 left-4 md:hidden z-[100]">
              <MobileNavigation />
            </div>

            {/* Main content container */}
            <div className="relative h-screen-safe overflow-hidden z-10 md:grid md:grid-cols-[14rem_1fr] ios-fixed-wrapper">
              {/* Desktop Navigation - reserved column */}
              <div className="hidden md:flex items-center justify-start pl-8">
                <DesktopNavigation />
              </div>

              <div className="relative h-full w-full">
                <div className="absolute inset-0">{children}</div>
              </div>
            </div>

            {/* Footer */}
            <div className="fixed bottom-6 left-0 right-0 z-50">
              <Footer />
            </div>
          </NavigationProvider>
        </SectionVisibilityProvider>
      </body>
    </html>
  );
}
