import type { Metadata } from "next";
import { Space_Grotesk, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sujin K | Frontend Engineer",
  description:
    "I build fast, polished interfaces that make complex systems feel simple.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${spaceGrotesk.variable} ${geistMono.variable} antialiased bg-black text-foreground`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
