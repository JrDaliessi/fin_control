import type { Metadata } from "next";
import type { Viewport } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import { ThemeProvider } from "@/shared/theme/ThemeProvider";
import "./globals.css";

const geist = Geist({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-geist-sans"
});

export const metadata: Metadata = {
  title: "FinControl",
  description: "Seu copiloto financeiro pessoal.",
  applicationName: "FinControl",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FinControl"
  },
  icons: {
    apple: "/apple-touch-icon.png",
    icon: "/icon.svg"
  },
  manifest: "/manifest.webmanifest"
};

export const viewport: Viewport = {
  themeColor: [
    { color: "#0f766e", media: "(prefers-color-scheme: light)" },
    { color: "#0b1220", media: "(prefers-color-scheme: dark)" }
  ],
  width: "device-width",
  initialScale: 1
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html className={geist.variable} lang="pt-BR" suppressHydrationWarning>
      <body>
        <Script src="/theme-init.js" strategy="beforeInteractive" />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
