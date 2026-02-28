import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PublishOS",
  description: "Built with PublishOS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="w-full h-auto overflow-x-hidden overflow-y-auto"
      style={{ position: "static" }}
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-full min-h-screen overflow-x-hidden overflow-y-auto`}
        style={{ position: "static", height: "auto" }}
      >
        <main className="min-h-screen">
          {children}
        </main>
      
      </body>
    </html>
  );
}
