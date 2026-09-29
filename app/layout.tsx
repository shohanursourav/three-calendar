import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';
import { SITE } from '@/lib/config';
import { Analytics } from '@vercel/analytics/next';

/**
 * Bengali-first typography:
 *   Hind Siliguri  → body text (Bengali + Latin)
 *   Noto Serif Bengali → display headings
 *   Inter          → Latin UI when the language is switched to English
 */
const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&family=Noto+Serif+Bengali:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — বাংলাদেশের ক্যালেন্ডার | Gregorian • Bengali • Hijri`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description.bn,
  keywords: [
    'বাংলা ক্যালেন্ডার',
    'বাংলাদেশি ক্যালেন্ডার',
    'বঙ্গাব্দ',
    'হিজরি ক্যালেন্ডার',
    'সরকারি ছুটি ২০২৬',
    'Bangla calendar',
    'Bangladesh holiday calendar',
    'Hijri calendar 2026',
    'public holidays Bangladesh',
  ],
  authors: [{ name: 'Shohanur Sourav', url: 'https://shohanursourav.com' }],
  creator: 'Shohanur Sourav',
  applicationName: SITE.name,
  category: 'calendar',
  openGraph: {
    type: 'website',
    title: `${SITE.name} — বাংলাদেশের ক্যালেন্ডার`,
    description: SITE.description.bn,
    url: SITE.url,
    siteName: SITE.name,
    locale: 'bn_BD',
    alternateLocale: ['en_US'],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} — বাংলাদেশের ক্যালেন্ডার`,
    description: SITE.description.bn,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f7f4' },
    { media: '(prefers-color-scheme: dark)', color: '#071410' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" data-lang="bn" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={FONT_HREF} />
      </head>
      <body className="min-h-screen antialiased">
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
