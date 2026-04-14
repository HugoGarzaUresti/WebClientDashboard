import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import { ThemeProvider } from "@/providers/theme-provider";
import { Poppins, Roboto_Mono } from "next/font/google";

import "./globals.css";

export const metadata: Metadata = {
  title: "ClientDocs Portal",
  description: "Secure client document portal",
};

type RootLayoutProps = {
  children: ReactNode;
};

const fontSans = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

const fontMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
});

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="system-theme-init" strategy="beforeInteractive">
          {`
            (function () {
              var storedTheme = localStorage.getItem("clientdocs-theme");
              var theme =
                storedTheme === "light" || storedTheme === "dark"
                  ? storedTheme
                  : window.matchMedia("(prefers-color-scheme: dark)").matches
                    ? "dark"
                    : "light";
              var root = document.documentElement;
              root.classList.toggle("dark", theme === "dark");
              root.classList.toggle("light", theme === "light");
              root.style.colorScheme = theme;
            })();
          `}
        </Script>
      </head>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
