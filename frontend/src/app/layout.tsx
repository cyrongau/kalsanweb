import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import ConditionalLayout from "@/components/ConditionalLayout";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kalsan Auto Parts",
  description: "B2B and B2C e-commerce platform for auto spare parts.",
};

import { NotificationProvider } from "@/components/providers/NotificationProvider";
import { AdminProvider } from "@/components/providers/AdminProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { QuoteProvider } from "@/components/providers/QuoteProvider";
import { DynamicFavicon } from "@/components/DynamicFavicon";
import { DebugConfig } from "@/components/DebugConfig";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased min-h-screen bg-background text-foreground transition-colors duration-300`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <AdminProvider>
              <DebugConfig />
              <DynamicFavicon />
              <NotificationProvider>
                <QuoteProvider>
                  <ConditionalLayout>
                    {children}
                  </ConditionalLayout>
                </QuoteProvider>
              </NotificationProvider>
            </AdminProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
