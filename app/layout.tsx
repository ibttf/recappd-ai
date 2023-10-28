import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Recappd",
  description: "Your favorite news, recappd.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
