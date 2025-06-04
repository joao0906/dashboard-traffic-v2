import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SupabaseAuthProvider from "@/components/auth/SupabaseAuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tráfego Dashboard - Gerencie suas campanhas de marketing digital",
  description: "Dashboard completo para gerenciamento de campanhas de tráfego pago no Facebook Ads, Google Ads, TikTok Ads e Google Analytics 4",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SupabaseAuthProvider>
          {children}
        </SupabaseAuthProvider>
      </body>
    </html>
  );
} 