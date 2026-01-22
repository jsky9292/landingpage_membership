/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from 'next/og';
import { createClient } from '@supabase/supabase-js';

export const alt = '랜딩페이지';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';
// 동적 렌더링 - 매번 새로운 OG 이미지 생성
export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Props = {
  params: Promise<{ slug: string }>;
};

// 테마별 프라이머리 색상 매핑 (config/themes.ts와 동일)
const themeColors: Record<string, string> = {
  toss: '#0064FF',
  dark: '#6366F1',
  warm: '#10B981',
  peach: '#F43F5E',
  luxury: '#F59E0B',
  slate: '#475569',
};

export default async function Image({ params }: Props) {
  const { slug } = await params;

  let title = '랜딩페이지';
  let subtitle = '';
  let primaryColor = '#0064FF';

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('OG Image: Missing Supabase credentials');
      throw new Error('Missing credentials');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: page, error } = await supabase
      .from('landing_pages')
      .select('title, sections, theme, og_image')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error) {
      console.error('OG Image Supabase error:', error.message);
    }

    if (page) {
      // 사용자가 업로드한 명함/OG 이미지가 있으면 fetch해서 직접 반환
      if (page.og_image && (page.og_image.startsWith('http://') || page.og_image.startsWith('https://'))) {
        console.log('OG Image: Fetching custom image from:', page.og_image);
        try {
          const imgRes = await fetch(page.og_image, {
            headers: {
              'Accept': 'image/*',
            },
          });

          if (imgRes.ok) {
            const imageBuffer = await imgRes.arrayBuffer();
            const contentType = imgRes.headers.get('content-type') || 'image/png';

            console.log('OG Image: Successfully fetched, content-type:', contentType, 'size:', imageBuffer.byteLength);

            // 이미지 데이터를 직접 반환
            return new Response(imageBuffer, {
              headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=300, s-maxage=300, stale-while-revalidate=60',
              },
            });
          } else {
            console.error('OG Image: Failed to fetch image, status:', imgRes.status);
          }
        } catch (imgError) {
          console.error('OG Image: Error fetching custom image:', imgError);
        }
      }

      if (page.title) {
        title = page.title;

        if (page.theme && themeColors[page.theme]) {
          primaryColor = themeColors[page.theme];
        }

        const heroSection = page.sections?.find((s: any) => s.type === 'hero');
        if (heroSection?.content?.subtext) {
          subtitle = heroSection.content.subtext.replace(/\n/g, ' ').slice(0, 40);
        } else if (heroSection?.content?.headline) {
          subtitle = heroSection.content.headline.replace(/\n/g, ' ').slice(0, 40);
        }
      }
    }
  } catch (e) {
    console.error('OG Image error:', e);
  }

  // 커스텀 이미지가 없거나 fetch 실패 시 기본 ImageResponse 생성

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
          랜딩메이커
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
