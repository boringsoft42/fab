&ldquo;use client&rdquo;;

import { Inter } from &ldquo;next/font/google&rdquo;;
import &ldquo;./globals.css&rdquo;;
import 'leaflet/dist/leaflet.css';
import { QueryProvider } from &ldquo;@/lib/providers/QueryProvider&rdquo;;
import { MockAuthProvider } from &ldquo;@/context/mock-auth-context&rdquo;;
import { ThemeProvider } from &ldquo;@/context/theme-context&rdquo;;
import dynamic from &ldquo;next/dynamic&rdquo;;

const APP_NAME = &ldquo;POSITIVE-NEXT&rdquo;;
const APP_DESCRIPTION = &ldquo;Your Mind's Best Friend&rdquo;;

const inter = Inter({ subsets: [&ldquo;latin&rdquo;] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang=&ldquo;es&rdquo; suppressHydrationWarning>
      <head>
        <title>{APP_NAME}</title>
        <meta name=&ldquo;description&rdquo; content={APP_DESCRIPTION} />
        <link
          rel=&ldquo;stylesheet&rdquo;
          href=&ldquo;https://unpkg.com/leaflet@1.9.4/dist/leaflet.css&rdquo;
          integrity=&ldquo;sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=&rdquo;
          crossOrigin=&ldquo;&rdquo;
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider defaultTheme=&ldquo;system&rdquo; storageKey=&ldquo;app-theme&rdquo;>
          <QueryProvider>
            <MockAuthProvider>{children}</MockAuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
