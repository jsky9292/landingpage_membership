/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db/supabase';

// 항상 동적으로 렌더링 (캐시 비활성화)
export const dynamic = 'force-dynamic';

// 데모 페이지 데이터
const demoPages: Record<string, any> = {
  'demo-page': {
    id: 'demo-page-1',
    title: '다이어트 프로그램 상담',
    slug: 'demo-page',
    sections: [
      {
        type: 'hero',
        content: {
          headline: '3개월 만에 -10kg 감량 성공!',
          subheadline: '전문 트레이너와 함께하는 1:1 맞춤 다이어트 프로그램',
          cta: '무료 상담 신청하기',
        },
      },
      {
        type: 'form',
        content: {
          title: '무료 상담 신청',
          buttonText: '신청하기',
        },
      },
    ],
    form_fields: [
      { name: 'name', label: '이름', type: 'text', required: true },
      { name: 'phone', label: '연락처', type: 'tel', required: true },
    ],
    theme: 'toss',
    contact_info: {},
  },
};

// 공개 페이지 조회 (slug로)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Supabase 미설정시 데모 모드
    if (!supabaseAdmin) {
      const demoPage = demoPages[slug] || demoPages['demo-page'];
      if (slug.startsWith('demo')) {
        return NextResponse.json({
          page: {
            id: demoPage.id,
            title: demoPage.title,
            slug: slug,
            sections: demoPage.sections,
            formFields: demoPage.form_fields,
            theme: demoPage.theme,
            contactInfo: demoPage.contact_info,
          },
          demo: true,
        });
      }
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // 페이지 조회
    const { data: page, error: pageError } = await supabaseAdmin
      .from('landing_pages')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (pageError || !page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // 조회수 증가
    await supabaseAdmin
      .from('landing_pages')
      .update({ view_count: (page.view_count || 0) + 1 })
      .eq('id', page.id);

    const response = NextResponse.json({
      page: {
        id: page.id,
        title: page.title,
        slug: page.slug,
        sections: page.sections || [],
        formFields: page.form_fields || [],
        theme: page.theme || 'toss',
        contactInfo: page.contact_info || {},
      },
    });
    
    // 캐시 비활성화 - 항상 최신 데이터 반환
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    
    return response;
  } catch (error) {
    console.error('Public page GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
