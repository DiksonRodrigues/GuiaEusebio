import type { Metadata } from "next";
import { cityConfig } from "@/config/city";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics/GoogleAnalytics";
import CookieConsent from "@/components/CookieConsent/CookieConsent";

export const metadata: Metadata = {
  title: `${cityConfig.appTitle} - Seu Guia de Negócios Locais`,
  description: cityConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <Navbar />
        <main>{children}</main>

        <Footer />

        <CookieConsent />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
