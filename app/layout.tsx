import type { Metadata } from 'next';
import './globals.css';
import { SessionProvider } from '@/components/providers/SessionProvider';

export const metadata: Metadata = {
  title: '랜딩메이커 - 2줄로 DB 수집 랜딩페이지',
  description: '2줄 입력하면 30초만에 랜딩페이지 완성',
  keywords: ['랜딩페이지', 'AI', '마케팅', 'DB수집', '자동화'],
  metadataBase: new URL('https://landingpage-membership3.vercel.app'),
  openGraph: {
    title: '랜딩메이커 - 2줄로 DB 수집 랜딩페이지',
    description: '2줄 입력하면 30초만에 랜딩페이지 완성',
    type: 'website',
    locale: 'ko_KR',
    siteName: '랜딩메이커',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: '랜딩메이커',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '랜딩메이커 - 2줄로 DB 수집 랜딩페이지',
    description: '2줄 입력하면 30초만에 랜딩페이지 완성',
    images: ['/opengraph-image'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta property="og:title" content="랜딩메이커 - 2줄로 DB 수집 랜딩페이지" />
        <meta property="og:description" content="2줄 입력하면 30초만에 랜딩페이지 완성" />
        <meta property="og:image" content="https://landingpage-membership3.vercel.app/opengraph-image" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="ko_KR" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://landingpage-membership3.vercel.app/opengraph-image" />
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body className="font-pretendard antialiased bg-white text-[#191F28]">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
