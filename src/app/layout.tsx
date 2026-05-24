import type { Metadata } from "next";
import { cityConfig } from "@/config/city";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
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

        <footer className="main-footer">
          <div className="container">
            <p>&copy; {new Date().getFullYear()} Guia Local. Todos os direitos reservados.</p>
          </div>
        </footer>

        <CookieConsent />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
