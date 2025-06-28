import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Druk e-Portal - Digital Residency",
  description: "Governance for the Borderless World - Apply for digital residency",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
