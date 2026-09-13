import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StickyBanner from '@/components/StickyBanner';
import AgeGate from '@/components/AgeGate';
import ExitIntentPopup from '@/components/ExitIntentPopup';
import site from '@/config/site.json';
import Script from 'next/script';

export const metadata: Metadata = {
  title: { default: site.siteName, template: `%s | ${site.siteName}` },
  description: site.description,
  openGraph: { siteName: site.siteName, type: 'website' },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && (
          <Script defer data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN} src="https://plausible.io/js/script.js" strategy="afterInteractive" />
        )}
      </head>
      <body className="min-h-screen flex flex-col">
        <AgeGate />
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">{children}</main>
        <Footer />
        <StickyBanner />
        <ExitIntentPopup />
        <div className="h-16" />
      </body>
    </html>
  );
}
