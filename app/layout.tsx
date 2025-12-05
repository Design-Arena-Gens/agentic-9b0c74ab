import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sora-2 Video Generation AI",
  description: "Advanced AI-powered video generation platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-black text-white">
        {children}
      </body>
    </html>
  );
}
