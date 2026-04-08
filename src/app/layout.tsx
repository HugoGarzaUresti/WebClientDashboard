import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/providers/theme-provider";
import { Inter, Source_Serif_4, JetBrains_Mono } from "next/font/google";

import "./globals.css";

export const metadata: Metadata = {
  title: "ClientDocs Portal",
  description: "Secure client document portal",
};

type RootLayoutProps = {
  children: ReactNode;
};

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
