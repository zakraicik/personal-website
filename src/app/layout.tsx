import type { Metadata, Viewport } from "next";
import "./globals.css";
import { DesktopNavigation } from "@/components/DesktopNavigation";
import { MobileNavigation } from "@/components/MobileNavigation";
import { AnimatedDotsBackground } from "@/components/AnimatedDotsBackground";
import { SectionVisibilityProvider } from "@/context/SectionVisibilityContext";
import { NavigationProvider } from "@/components/NavigationProvider";
import { Footer } from "@/components/sections/Footer";
import { SkipLink } from "@/components/SkipLink";

const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (vercelHost ? `https://${vercelHost}` : "http://localhost:3000");
const title = "Zak Raicik | Machine Learning Leader & Builder";
const description = "Machine learning leader and hands-on builder with experience across insurance, finance, and AI security. Relentlessly curious, from research to production.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl), title, description,
  openGraph: { title, description, type: "website" },
  twitter: { card: "summary_large_image", title, description, images: ["/opengraph-image"] },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#141418" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SectionVisibilityProvider><NavigationProvider>
          <SkipLink />
          <AnimatedDotsBackground />
          <div className="site-shell">
            <DesktopNavigation /><MobileNavigation />
            <main id="main-content" className="main-content" tabIndex={-1}>{children}</main>
            <Footer />
          </div>
        </NavigationProvider></SectionVisibilityProvider>
      </body>
    </html>
  );
}
