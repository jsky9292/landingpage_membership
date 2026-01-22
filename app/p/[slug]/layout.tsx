import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers';

type Props = {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
};

// 동적 메타데이터 생성 - OG 이미지 직접 설정
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  // 호스트 URL 가져오기
  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3000';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  let title = '랜딩페이지';
  let description = '';
  let ogImageUrl = `${baseUrl}/api/og/${slug}`; // 기본: API 라우트로 생성된 이미지

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: page } = await supabase
        .from('landing_pages')
        .select('title, sections, og_image')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (page) {
        title = page.title || '랜딩페이지';

        // 사용자가 업로드한 OG 이미지가 있으면 직접 사용
        if (page.og_image && (page.og_image.startsWith('http://') || page.og_image.startsWith('https://'))) {
          ogImageUrl = page.og_image;
        }

        // Hero 섹션에서 description 추출
        const heroSection = page.sections?.find((s: { type: string }) => s.type === 'hero');
        if (heroSection?.content?.subtext) {
          description = heroSection.content.subtext.replace(/\n/g, ' ').slice(0, 160);
        }
      }
    }
  } catch (e) {
    console.error('Metadata generation error:', e);
  }

  return {
    title,
    description: description || title + ' - 랜딩메이커',
    openGraph: {
      title,
      description: description || title + ' - 랜딩메이커',
      type: 'website',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: description || title + ' - 랜딩메이커',
      images: [ogImageUrl],
    },
  };
}

export default function PublicPageLayout({ children }: Props) {
  return <>{children}</>;
}
