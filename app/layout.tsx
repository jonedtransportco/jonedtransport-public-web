import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Portal JONED | Operación en movimiento",
  description: "La experiencia empresarial de JONED Transport Co. para conectar personas, flota y decisiones.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "JONED Portal | Operación en movimiento",
    description: "Personas, flota y decisiones en una sola experiencia.",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "JONED Portal — Operación en movimiento" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "JONED Portal | Operación en movimiento",
    description: "Personas, flota y decisiones en una sola experiencia.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}
