import type { Metadata } from 'next';
import Script from 'next/script';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import ToastContainer from '@/components/Toast';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'CalcBox - 暮らしに役立つ無料計算ツール集',
    template: '%s | CalcBox',
  },
  description: 'BMI計算、消費税計算、ローン計算、通貨換算、マークダウンプレビューなど、暮らしに役立つ無料の計算ツール61種類以上を集めました。',
  metadataBase: new URL('https://yuhi-sa.github.io/calcbox'),
  openGraph: {
    type: 'website',
    title: 'CalcBox - 暮らしに役立つ無料計算ツール集',
    description: '日常のちょっとした計算を、サッと解決。暮らしに役立つ無料計算ツール集。',
    siteName: 'CalcBox',
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary',
    title: 'CalcBox - 暮らしに役立つ無料計算ツール集',
    description: '日常のちょっとした計算を、サッと解決。暮らしに役立つ無料計算ツール集。',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        {/* Google Analytics (GA4) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-LN6QP6VVM3"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-LN6QP6VVM3');
          `}
        </Script>
        {/* Google AdSense */}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9558545098866170"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
          {children}
        </main>
        <Footer />
        <ToastContainer />
      </body>
    </html>
  );
}
