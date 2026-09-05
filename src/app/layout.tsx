import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { NotificationProvider } from "@/components/notifications/NotificationProvider";
import { CompareProvider } from "@/context/CompareContext";
import { CompareBar } from "@/components/listings/CompareBar";
import { FloatingCallButton } from "@/components/FloatingCallButton";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { KeyboardShortcuts } from "@/components/KeyboardShortcuts";
import { PWACleanup } from "@/components/PWAInstallPrompt";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { CsrfProvider } from "@/context/CsrfContext";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { jsonLdString } from "@/lib/seo/json-ld";
import "./globals.css";

// Organization JSON-LD Schema for rich search results
function OrganizationJsonLd({ nonce }: { nonce?: string }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Axleyard',
    url: 'https://axleyard.com',
    logo: 'https://axleyard.com/images/axlonai-logo.png',
    description: 'The AI-powered marketplace for trucks, trailers, and heavy equipment. Home of AXLON, the AI assistant — smart search, voice agents, lead management, and instant listings.',
    foundingDate: '2024',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      telephone: '+1-469-421-3536',
      email: 'sales@axlon.ai',
      availableLanguage: 'English',
    },
    sameAs: [
      'https://instagram.com/axlonai',
      'https://facebook.com/axlonai',
      'https://twitter.com/axlonai',
      'https://linkedin.com/company/axlonai',
    ],
  };

  return (
    <script
      nonce={nonce}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdString(schema) }}
    />
  );
}

// WebSite JSON-LD Schema with SearchAction for sitelinks search box
function WebsiteJsonLd({ nonce }: { nonce?: string }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Axleyard',
    url: 'https://axleyard.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://axleyard.com/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      nonce={nonce}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdString(schema) }}
    />
  );
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const gunship = localFont({
  src: [
    { path: "../../public/fonts/gunship.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/gunshipbold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-gunship",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Axleyard — Trucks, Trailers & Heavy Equipment Marketplace",
    template: "%s | Axleyard",
  },
  description: "Browse thousands of trucks, trailers, and heavy equipment. Ask AXLON, our AI assistant — smart search, instant listings, voice agents, and lead management for dealers.",
  keywords: ["trucks", "trailers", "heavy equipment", "marketplace", "semi trucks", "commercial vehicles", "Peterbilt", "Freightliner", "Kenworth", "Volvo", "buy trucks", "sell trucks", "AI tools", "dealer management", "lowboy trailers"],
  authors: [{ name: "Axleyard" }],
  creator: "Axleyard",
  publisher: "Axleyard",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://axleyard.com"),
  openGraph: {
    title: "Axleyard — Trucks, Trailers & Heavy Equipment Marketplace",
    description: "Browse thousands of trucks, trailers, and heavy equipment. Ask AXLON, our AI assistant — smart search, instant listings, voice agents, and lead management for dealers.",
    type: "website",
    siteName: "Axleyard",
    locale: "en_US",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Axleyard — Trucks, Trailers & Heavy Equipment Marketplace" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Axleyard — Trucks, Trailers & Heavy Equipment Marketplace",
    description: "Browse thousands of trucks, trailers, and heavy equipment. Ask AXLON, our AI assistant.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Axleyard",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerList = await headers();
  const nonce = headerList.get('x-nonce') ?? undefined;
  // axlon.ai serves the standalone AXLON page via a middleware rewrite, so the
  // browser path stays "/" — pathname-based visibility in the floating widgets
  // would wrongly show marketplace UI there. Gate them on host instead.
  const host = headerList.get('host')?.toLowerCase().split(':')[0] ?? '';
  const isAxlonHost = host === 'axlon.ai' || host === 'www.axlon.ai';

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <OrganizationJsonLd nonce={nonce} />
        <WebsiteJsonLd nonce={nonce} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${gunship.variable} antialiased min-h-screen`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <CsrfProvider>
            <NotificationProvider>
              <CompareProvider>
                  {children}
                  {!isAxlonHost && <MobileBottomNav />}
                  {!isAxlonHost && <CompareBar />}
                  {!isAxlonHost && <FloatingCallButton />}
                  <KeyboardShortcuts />
                  <PWACleanup />
                  <div aria-live="polite" aria-atomic="true">
                    <Toaster position="top-right" richColors closeButton />
                  </div>
              </CompareProvider>
            </NotificationProvider>
            </CsrfProvider>
          </QueryProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
