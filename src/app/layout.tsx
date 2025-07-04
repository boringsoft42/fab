"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/lib/providers/QueryProvider";
import { MockAuthProvider } from "@/context/mock-auth-context";
import { ThemeProvider } from "@/context/theme-context";
import dynamic from "next/dynamic";

const APP_NAME = "POSITIVE-NEXT";
const APP_DESCRIPTION = "Your Mind's Best Friend";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <title>{APP_NAME}</title>
        <meta name="description" content={APP_DESCRIPTION} />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="system" storageKey="app-theme">
          <QueryProvider>
            <MockAuthProvider>{children}</MockAuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
