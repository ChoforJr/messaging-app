import type { Metadata } from "next";
import type { ReactNode } from "react";
import App from "../App Components/App";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gather — conversations that bring you closer",
  description: "A thoughtful place for your messages, people, and communities.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <App>{children}</App>
      </body>
    </html>
  );
}
