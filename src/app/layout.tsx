import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ParticlesBackground } from "@/components/ui/ParticlesBackground";
import { ThemeProvider } from "@/lib/themeContext";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
  title: "CSI_SRMCEM X D'CODERS | Technical Club",
  description: "Official website of CSI_SRMCEM X D'CODERS at SRMCEM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="electric-cyber" className="overflow-x-hidden">
      <body className={inter.className + " overflow-x-hidden max-w-[100vw]"}>
        <ThemeProvider>
          <ParticlesBackground />
          <Navbar />
          <main className="pt-16 min-h-screen w-full overflow-x-hidden">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
