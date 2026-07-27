import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sujin.tech"),
  title: "Sujin K",
  description:
    "I build fast, polished interfaces that make complex systems feel simple.",
  openGraph: {
    title: "Sujin K",
    description:
      "I build fast, polished interfaces that make complex systems feel simple.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sujin K",
    description:
      "I build fast, polished interfaces that make complex systems feel simple.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${geistMono.variable}`}>
      <body className="antialiased bg-black text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
