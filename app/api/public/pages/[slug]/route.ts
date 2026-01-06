/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/client';

// 항상 동적으로 렌더링 (캐시 비활성화)
export const dynamic = 'force-dynamic';

// 공개 페이지 조회 (slug로)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const supabase = createServerClient() as any;

    // 페이지 조회
    const { data: page, error: pageError } = await supabase
      .from('landing_pages')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (pageError || !page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // 조회수 증가
    await supabase
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
