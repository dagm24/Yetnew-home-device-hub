import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeLanguageProvider } from "@/context/theme-language-context";
import { AuthProvider } from "@/context/auth-context";
import { DeviceProvider } from "@/context/device-context";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Yetnew - Family Device Management | የቤተሰብ መሳሪያ አስተዳደር",
  description:
    "Manage and organize all electrical devices and tools in your household with your family | በቤተሰብዎ ውስጥ ያሉትን ሁሉንም የኤሌክትሪክ መሳሪያዎች እና መሳሪያዎች ያስተዳድሩ እና ያደራጁ",
  generator: "",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/apple-touch-icon.svg",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ThemeLanguageProvider>
            <AuthProvider>
              <DeviceProvider>
                {children}
                <Toaster />
              </DeviceProvider>
            </AuthProvider>
          </ThemeLanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
