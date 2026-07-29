import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Joned Transpor Co | Moving freight, advancing your business",
  description: "Reliable ground transportation across Mexico, the United States, and Canada, with protected enterprise access through Microsoft Entra ID.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "Joned Transpor Co | Moving freight, advancing your business",
    description: "Reliable ground transportation with protected enterprise access through Microsoft Entra ID.",
    type: "website",
    images: [{ url: "/og-v3.png", width: 1731, height: 909, alt: "Joned Transpor Co - Moving freight and growing your business" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Joned Transpor Co | Moving freight, advancing your business",
    description: "Reliable ground transportation with protected enterprise access through Microsoft Entra ID.",
    images: ["/og-v3.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}
