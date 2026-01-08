/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { supabaseAdmin } from '@/lib/db/supabase';

// 페이지 생성 (배포)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, topic, prompt, sections, formFields, theme, slug, contactInfo } = body;

    // 유효성 검사
    if (!title || !sections) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      );
    }

    const userEmail = session.user.email;

    // profiles 테이블에서 사용자 조회
    let { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', userEmail)
      .single();

    // 없으면 profiles에 생성
    if (!profile) {
      const { data: newProfile, error: createError } = await supabaseAdmin
        .from('profiles')
        .insert({
          email: userEmail,
          name: session.user.name || null,
          avatar_url: session.user.image || null,
          plan: 'free',
        })
        .select('id')
        .single();

      if (createError || !newProfile) {
        console.error('Profile create error:', createError);
        return NextResponse.json({
          error: 'Failed to create user',
          details: createError?.message || JSON.stringify(createError),
        }, { status: 500 });
      }
      profile = newProfile;
    }

    // 고유 슬러그 생성
    const pageSlug = slug || `page-${Date.now().toString(36)}`;

    // 페이지 생성
    const { data: newPage, error: pageError } = await supabaseAdmin
      .from('landing_pages')
      .insert({
        user_id: profile.id,
        title,
        slug: pageSlug,
        topic: topic || 'free',
        prompt: prompt || '',
        sections,
        form_fields: formFields || [],
        theme: theme || 'toss',
        contact_info: contactInfo || {},
        status: 'published',
        view_count: 0,
      })
      .select()
      .single();

    if (pageError) {
      console.error('Page create error:', pageError);
      return NextResponse.json(
        { error: 'Failed to create page', details: pageError.message },
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

    const userEmail = session.user.email;

    // profiles에서 사용자 조회
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', userEmail)
      .single();

    if (!profile) {
      return NextResponse.json({ pages: [] });
    }

    // 사용자의 페이지 목록
    const { data: pages, error: pagesError } = await supabaseAdmin
      .from('landing_pages')
      .select('id, title, slug, status, view_count, created_at, updated_at')
      .eq('user_id', profile.id)
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
