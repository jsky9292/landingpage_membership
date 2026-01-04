/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from 'next/og';
import { createServerClient } from '@/lib/supabase/client';

export const runtime = 'edge';
export const alt = '랜딩페이지';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  const slug = params.slug;

  // DB에서 페이지 정보 가져오기
  let title = '랜딩페이지';
  let subtitle = '';

  try {
    const supabase = createServerClient() as any;
    const { data: page } = await supabase
      .from('landing_pages')
      .select('title, sections')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (page) {
      title = page.title || '랜딩페이지';
      // hero 섹션에서 subtext 가져오기
      const heroSection = page.sections?.find((s: any) => s.type === 'hero');
      if (heroSection?.content?.subtext) {
        subtitle = heroSection.content.subtext.replace(/\\n/g, ' ').slice(0, 80);
      }
    }
  } catch (e) {
    console.error('OG image error:', e);
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
        {/* 상단 악센트 바 */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '8px',
            background: '#0064FF',
          }}
        />

        {/* 메인 컨텐츠 */}
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
          {/* 제목 */}
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
            {title.length > 35 ? title.slice(0, 35) + '...' : title}
          </div>

          {/* 부제목 */}
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

        {/* 하단 브랜딩 */}
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
