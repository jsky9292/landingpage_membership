import { Metadata } from 'next';
import { createServerClient } from '@/lib/supabase/client';

type Props = {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  // 기본 메타데이터
  let title = '랜딩페이지';
  let description = '랜딩AI로 만든 랜딩페이지';

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
        description = heroSection.content.subtext.replace(/\\n/g, ' ').slice(0, 150);
      } else if (heroSection?.content?.headline) {
        description = heroSection.content.headline.replace(/\\n/g, ' ').slice(0, 150);
      }
    }
  } catch (e) {
    console.error('Metadata generation error:', e);
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'ko_KR',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default function PublicPageLayout({ children }: Props) {
  return <>{children}</>;
}
