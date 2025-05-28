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
  description:
    "Data Scientist & Full Stack Developer | Building the future of web applications",
  metadataBase: new URL("https://wwww.zakraicik.me"),
  openGraph: {
    title: "Zak Raicik",
    description:
      "Data Scientist & Full Stack Developer | Building the future of web applications",
    url: "https://zakraicik.me",
    siteName: "Zak Raicik",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Data Scientist & Full Stack Developer | Building the future of web applications",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zak Raicik",
    description:
      "Data Scientist & Full Stack Developer | Building the future of web applications",
    images: ["/og-image.png"],
    creator: "@zakraicik",
  },
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

          {/* Mobile Layout: Full height with nav/footer spacing */}
          <div className="md:hidden h-screen flex flex-col">
            {/* Navigation area - allocated space */}
            <div className="flex-shrink-0 h-16 flex items-center justify-center relative z-50">
              <Navigation />
            </div>

            {/* Main content area - takes remaining space exactly */}
            <main className="flex-1 overflow-y-auto relative">{children}</main>

            {/* Footer area - smaller allocated space */}
            <div className="flex-shrink-0 h-16 flex items-center justify-center relative z-50">
              <Footer />
            </div>
          </div>

          {/* Desktop Layout: Fixed grid layout with proper height */}
          <div className="hidden md:block h-screen">
            <Navigation />
            <div className="grid grid-cols-[140px_1fr] min-h-screen">
              <aside></aside>
              <main className="pl-16 flex flex-col justify-center min-h-screen">
                {children}
              </main>
            </div>
            <Footer />
          </div>
        </SectionVisibilityProvider>
      </body>
    </html>
  );
}
