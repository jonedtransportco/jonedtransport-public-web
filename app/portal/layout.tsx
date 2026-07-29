import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Sign in | JONED Enterprise Platform",
  description: "Protected access for authorized Joned Transpor Co employees and external users through Microsoft Entra ID.",
  openGraph: {
    title: "Sign in | JONED Enterprise Platform",
    description: "Protected enterprise access through Microsoft Entra ID.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Sign in | JONED Enterprise Platform",
    description: "Protected enterprise access through Microsoft Entra ID.",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function PortalLayout({ children }: { children: ReactNode }) {
  return children;
}
