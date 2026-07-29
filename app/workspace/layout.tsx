import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Workspace | JONED Enterprise Platform",
  description: "Role-protected Joned Transpor Co enterprise workspace.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return children;
}
