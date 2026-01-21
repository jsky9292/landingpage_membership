import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';

type Props = {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
};

// 동적 메타데이터 생성
// 주의: opengraph-image.tsx가 OG 이미지를 처리하므로 여기서는 images를 설정하지 않음
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  let title = '랜딩페이지';
  let description = '';

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: page } = await supabase
        .from('landing_pages')
        .select('title, sections')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (page) {
        title = page.title || '랜딩페이지';

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

  // 기본 메타데이터만 설정 (og:image는 opengraph-image.tsx에서 처리)
  return {
    title,
    description: description || title + ' - 랜딩메이커',
    openGraph: {
      title,
      description: description || title + ' - 랜딩메이커',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: description || title + ' - 랜딩메이커',
    },
  };
}

export default function PublicPageLayout({ children }: Props) {
  return <>{children}</>;
}
