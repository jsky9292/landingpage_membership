import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 디버깅용 엔드포인트: og_image가 DB에 저장되어 있는지 확인
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Missing Supabase credentials' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: page, error } = await supabase
      .from('landing_pages')
      .select('id, slug, title, status, og_image, created_at, updated_at')
      .eq('slug', slug)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    // og_image URL이 있으면 접근 가능한지 테스트
    let imageAccessible = false;
    let imageStatus = null;
    let imageContentType = null;

    if (page.og_image) {
      try {
        const res = await fetch(page.og_image, { method: 'HEAD' });
        imageAccessible = res.ok;
        imageStatus = res.status;
        imageContentType = res.headers.get('content-type');
      } catch (e) {
        imageAccessible = false;
        imageStatus = 'fetch_error';
      }
    }

    return NextResponse.json({
      page: {
        id: page.id,
        slug: page.slug,
        title: page.title,
        status: page.status,
        og_image: page.og_image,
        created_at: page.created_at,
        updated_at: page.updated_at,
      },
      imageCheck: {
        hasOgImage: !!page.og_image,
        accessible: imageAccessible,
        status: imageStatus,
        contentType: imageContentType,
      },
    });
  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
