/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from 'next/og';
import { createClient } from '@supabase/supabase-js';

export const alt = '랜딩페이지';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

type Props = {
  params: Promise<{ slug: string }>;
};

// 테마별 프라이머리 색상 매핑 (config/themes.ts와 동일)
const themeColors: Record<string, string> = {
  toss: '#0064FF',     // 토스 블루
  dark: '#6366F1',     // 인디고
  warm: '#10B981',     // 에메랄드
  peach: '#F43F5E',    // 로즈
  luxury: '#F59E0B',   // 앰버
  slate: '#475569',    // 슬레이트
};

export default async function Image({ params }: Props) {
  const { slug } = await params;

  let title = '랜딩페이지';
  let subtitle = '';
  let primaryColor = '#0064FF'; // 기본값: 토스 블루

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: page } = await supabase
      .from('landing_pages')
      .select('title, sections, theme')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (page?.title) {
      title = page.title;

      // 테마 색상 적용
      if (page.theme && themeColors[page.theme]) {
        primaryColor = themeColors[page.theme];
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const heroSection = page.sections?.find((s: any) => s.type === 'hero');
      if (heroSection?.content?.subtext) {
        subtitle = heroSection.content.subtext.replace(/\n/g, ' ').slice(0, 80);
      }
    }
  } catch (e) {
    // 에러 시 기본값 사용
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F8FAFC',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '8px',
            background: primaryColor,
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 80px',
            maxWidth: '1000px',
          }}
        >
          <div
            style={{
              fontSize: 56,
              fontWeight: 'bold',
              color: '#191F28',
              textAlign: 'center',
              lineHeight: 1.3,
              marginBottom: subtitle ? 24 : 0,
            }}
          >
            {title.length > 30 ? title.slice(0, 30) + '...' : title}
          </div>

          {subtitle && (
            <div
              style={{
                fontSize: 26,
                color: '#4E5968',
                textAlign: 'center',
                lineHeight: 1.5,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            alignItems: 'center',
            color: '#8B95A1',
            fontSize: 18,
          }}
        >
          랜딩AI
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
