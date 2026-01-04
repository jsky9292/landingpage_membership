/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { createServerClient } from '@/lib/supabase/client';

// 페이지 생성 (배포)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, topic, prompt, sections, formFields, theme, slug } = body;

    // 유효성 검사
    if (!title || !sections) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      );
    }

    const supabase = createServerClient() as any;

    // 현재 사용자 조회
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 고유 슬러그 생성 (전달받은 것 또는 새로 생성)
    const pageSlug = slug || `page-${Date.now().toString(36)}`;

    // 페이지 생성
    const { data: newPage, error: createError } = await supabase
      .from('landing_pages')
      .insert({
        user_id: user.id,
        title,
        slug: pageSlug,
        topic: topic || 'free',
        prompt: prompt || '',
        sections,
        form_fields: formFields || [],
        theme: theme || 'toss',
        status: 'published',
        view_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (createError) {
      console.error('Page create error:', createError);
      return NextResponse.json(
        { error: 'Failed to create page', details: createError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      page: {
        id: newPage.id,
        slug: newPage.slug,
        title: newPage.title,
        status: newPage.status,
      },
    });
  } catch (error) {
    console.error('Page POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 사용자의 페이지 목록 조회
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServerClient() as any;

    // 현재 사용자 조회
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 사용자의 페이지 목록
    const { data: pages, error: pagesError } = await supabase
      .from('landing_pages')
      .select('id, title, slug, status, view_count, created_at, updated_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (pagesError) {
      console.error('Pages fetch error:', pagesError);
      return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
    }

    return NextResponse.json({ pages: pages || [] });
  } catch (error) {
    console.error('Pages GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
