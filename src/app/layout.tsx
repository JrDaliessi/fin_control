import type { Metadata } from "next";
import type { Viewport } from "next";
import { AccountSessionProvider } from "@/features/accounts/presentation/providers/AccountSessionProvider";
import { TransactionSessionProvider } from "@/features/transactions/presentation/providers/TransactionSessionProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Controle Financeiro IA",
  description: "Copiloto financeiro pessoal com IA.",
  applicationName: "Controle Financeiro IA",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Finanças IA"
  },
  icons: {
    apple: "/icon.svg",
    icon: "/icon.svg"
  },
  manifest: "/manifest.webmanifest"
};

export const viewport: Viewport = {
  themeColor: "#0f766e",
  width: "device-width",
  initialScale: 1
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <body>
        <AccountSessionProvider>
          <TransactionSessionProvider>{children}</TransactionSessionProvider>
        </AccountSessionProvider>
      </body>
    </html>
  );
}
