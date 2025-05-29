import { Inter } from "next/font/google";
import "./globals.css";
import { DesktopNavigation } from "@/components/DesktopNavigation";
import { MobileNavigation } from "@/components/MobileNavigation";
import { AnimatedDotsBackground } from "@/components/AnimatedDotsBackground";
import { SectionVisibilityProvider } from "@/context/SectionVisibilityContext";
import { NavigationProvider } from "@/components/NavigationProvider";
import { Footer } from "@/components/sections/Footer";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={`${inter.className} antialiased`}>
        <SectionVisibilityProvider>
          <NavigationProvider>
            {/* Background layer */}
            <div className="fixed inset-0 z-0">
              <AnimatedDotsBackground />
            </div>

            {/* Desktop Navigation - positioned by layout */}
            <div className="fixed left-8 top-1/2 -translate-y-1/2 hidden md:block z-50">
              <DesktopNavigation />
            </div>

            {/* Mobile Navigation - positioned by layout */}
            <div className="fixed top-4 left-4 md:hidden z-[100]">
              <MobileNavigation />
            </div>

            {/* Main content container */}
            <div className="relative h-screen-safe overflow-hidden z-10">
              <div className="absolute inset-0">{children}</div>
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
