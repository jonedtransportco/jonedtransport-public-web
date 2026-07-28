import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JONED Transport Co. | Operación y crecimiento con estructura",
  description: "Sitio principal de JONED Transport Co. para marca, servicios, reclutamiento y acceso al portal.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "JONED Transport Co. | Operación y crecimiento con estructura",
    description: "Marca, servicios, owner operators y acceso al portal en una sola experiencia pública.",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "JONED Portal — Operación en movimiento" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "JONED Transport Co. | Operación y crecimiento con estructura",
    description: "Marca, servicios, owner operators y acceso al portal en una sola experiencia pública.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}
