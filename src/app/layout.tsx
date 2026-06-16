import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { AppProviders } from "@/components/providers/AppProviders";
import { InstallAppBanner } from "@/components/pwa/InstallAppBanner";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Diario.com — Lecturas y Cine",
  description:
    "Diario digital personal para registrar lecturas de libros y visionados de películas.",
  applicationName: "Diario.com",
  appleWebApp: {
    capable: true,
    title: "Diario.com",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#1a2f4b",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${playfair.variable} ${inter.variable} h-full`}>
      <body className="min-h-full font-sans antialiased">
        <AppProviders>{children}</AppProviders>
        <InstallAppBanner />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
