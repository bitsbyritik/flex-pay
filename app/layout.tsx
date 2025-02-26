import type { Metadata } from "next";
import "./globals.css";
import SolanaWalletProvider from "@/components/SolanaWalletProvider";
import { Inter, Manrope } from "next/font/google";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/Navbar";

const heading = Manrope({
  subsets: ["latin"],
  variable: "--font-heading",
});

const base = Inter({
  subsets: ["latin"],
  variable: "--font-base",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background text-foreground antialiased font-heading relative",
          heading.variable,
          base.variable,
        )}
      >
        <SolanaWalletProvider>
          <Navbar />
          {children}
        </SolanaWalletProvider>
      </body>
    </html>
  );
}
