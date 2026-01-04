import type { Metadata } from 'next';
import './globals.css';
import { SessionProvider } from '@/components/providers/SessionProvider';

export const metadata: Metadata = {
  title: '랜딩AI - AI로 랜딩페이지 자동 생성',
  description: '프롬프트만 입력하면 마케팅 카피라이팅부터 디자인까지 AI가 자동으로 생성해드려요',
  keywords: ['랜딩페이지', 'AI', '마케팅', '카피라이팅', '자동화'],
  openGraph: {
    title: '랜딩AI - AI로 랜딩페이지 자동 생성',
    description: '프롬프트만 입력하면 마케팅 카피라이팅부터 디자인까지 AI가 자동으로 생성해드려요',
    type: 'website',
    locale: 'ko_KR',
    siteName: '랜딩AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: '랜딩AI - AI로 랜딩페이지 자동 생성',
    description: '프롬프트만 입력하면 마케팅 카피라이팅부터 디자인까지 AI가 자동으로 생성해드려요',
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
