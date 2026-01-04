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
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        {/* 메인 카드 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'white',
            borderRadius: '24px',
            padding: '60px 80px',
            maxWidth: '1000px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}
        >
          {/* 제목 */}
          <div
            style={{
              fontSize: 52,
              fontWeight: 'bold',
              color: '#191F28',
              textAlign: 'center',
              lineHeight: 1.3,
              marginBottom: subtitle ? 20 : 0,
            }}
          >
            {title.length > 40 ? title.slice(0, 40) + '...' : title}
          </div>

          {/* 부제목 */}
          {subtitle && (
            <div
              style={{
                fontSize: 24,
                color: '#6B7280',
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
            display: 'flex',
            alignItems: 'center',
            marginTop: 40,
            color: 'white',
            fontSize: 20,
            opacity: 0.9,
          }}
        >
          Powered by 랜딩AI
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
