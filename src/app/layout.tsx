import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { AnimatedDotsBackground } from "@/components/AnimatedDotsBackground";
import { ScrollToHashOnResize } from "@/components/ScrollToHashOnResize";
import { SectionVisibilityProvider } from "@/context/SectionVisibilityContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Personal Portfolio",
  description:
    "Welcome to my personal portfolio website showcasing my work and experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <SectionVisibilityProvider>
          <AnimatedDotsBackground />
          <ScrollToHashOnResize />
          <div className="grid grid-cols-[140px_1fr] min-h-screen">
            <aside>
              <Navigation />
            </aside>
            <main className="pl-16">{children}</main>
          </div>
        </SectionVisibilityProvider>
      </body>
    </html>
  );
}
