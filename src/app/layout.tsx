import type { Metadata } from "next";
import type { ReactNode } from "react";
import { cookies } from "next/headers";
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

type ThemePreference = "system" | "light" | "dark";

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

export default async function RootLayout({ children }: RootLayoutProps) {
  const cookieStore = await cookies();
  const storedTheme = cookieStore.get("clientdocs-theme")?.value;
  const initialTheme: ThemePreference =
    storedTheme === "light" || storedTheme === "dark" ? storedTheme : "system";

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={initialTheme === "system" ? undefined : initialTheme}
      style={
        initialTheme === "system"
          ? undefined
          : { colorScheme: initialTheme }
      }
    >
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased`}
      >
        <ThemeProvider initialTheme={initialTheme}>{children}</ThemeProvider>
      </body>
    </html>
  );
}
