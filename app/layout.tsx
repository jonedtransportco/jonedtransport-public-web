import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JONED Transport Co. | Moving freight, advancing your business",
  description: "Reliable ground transportation across Mexico, the United States, and Canada, with protected enterprise access through Microsoft Entra ID.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "JONED Transport Co. | Moving freight, advancing your business",
    description: "Reliable ground transportation with protected enterprise access through Microsoft Entra ID.",
    type: "website",
    images: [{ url: "/og-v2.png", width: 1730, height: 909, alt: "JONED Transport & Logistics — Moving freight, advancing your business" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "JONED Transport Co. | Moving freight, advancing your business",
    description: "Reliable ground transportation with protected enterprise access through Microsoft Entra ID.",
    images: ["/og-v2.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}
