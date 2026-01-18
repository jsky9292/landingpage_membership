/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { supabaseAdmin } from '@/lib/db/supabase';

// 특정 페이지 상세 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: pageId } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Supabase 미설정시 데모 데이터
    if (!supabaseAdmin) {
      if (pageId.startsWith('demo-')) {
        return NextResponse.json({
          page: {
            id: pageId,
            title: pageId === 'demo-page-1' ? '다이어트 프로그램 상담' : '무료 상담 신청',
            slug: pageId === 'demo-page-1' ? 'diet-program' : 'free-consultation',
            topic: 'health',
            prompt: '다이어트 관련 랜딩페이지',
            status: pageId === 'demo-page-1' ? 'published' : 'draft',
            theme: 'toss',
            sections: [],
            formFields: [{ name: 'name', label: '이름', type: 'text', required: true }, { name: 'phone', label: '연락처', type: 'tel', required: true }],
            contactInfo: {},
            viewCount: pageId === 'demo-page-1' ? 245 : 89,
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date().toISOString(),
          },
        });
      }
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    
    // 현재 사용자 조회
    const { data: user } = await supabaseAdmin
      .from('profiles')
      .select('id, role')
      .eq('email', session.user.email)
      .single();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 페이지 조회
    const { data: page, error: pageError } = await supabaseAdmin
      .from('landing_pages')
      .select('*')
      .eq('id', pageId)
      .single();

    if (pageError || !page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // 권한 확인 (본인 페이지 또는 관리자)
    if (page.user_id !== user.id && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({
      page: {
        id: page.id,
        title: page.title,
        slug: page.slug,
        topic: page.topic,
        prompt: page.prompt,
        status: page.status,
        theme: page.theme || 'toss',
        sections: page.sections || [],
        formFields: page.form_fields || [],
        contactInfo: page.contact_info || {},
        viewCount: page.view_count || 0,
        createdAt: page.created_at,
        updatedAt: page.updated_at,
      },
    });
  } catch (error) {
    console.error('Page GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 페이지 업데이트
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: pageId } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, sections, formFields, theme, status, contactInfo } = body;

    // Supabase 미설정시 데모 모드
    if (!supabaseAdmin) {
      return NextResponse.json({
        success: true,
        page: { id: pageId, title, status, theme, sections, formFields, contactInfo, updatedAt: new Date().toISOString() },
        demo: true,
      });
    }

    // 현재 사용자 조회
    const { data: user } = await supabaseAdmin
      .from('profiles')
      .select('id, role')
      .eq('email', session.user.email)
      .single();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 페이지 조회
    const { data: page } = await supabaseAdmin
      .from('landing_pages')
      .select('id, user_id')
      .eq('id', pageId)
      .single();

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // 권한 확인 (본인 페이지 또는 관리자)
    if (page.user_id !== user.id && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 업데이트할 데이터 구성
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (title !== undefined) updateData.title = title;
    if (sections !== undefined) updateData.sections = sections;
    if (formFields !== undefined) updateData.form_fields = formFields;
    if (theme !== undefined) updateData.theme = theme;
    if (status !== undefined) updateData.status = status;
    if (contactInfo !== undefined) updateData.contact_info = contactInfo;

    // 업데이트
    const { data: updated, error: updateError } = await supabaseAdmin
      .from('landing_pages')
      .update(updateData)
      .eq('id', pageId)
      .select()
      .single();

    if (updateError) {
      console.error('Page update error:', updateError);
      return NextResponse.json({ error: 'Failed to update page' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      page: {
        id: updated.id,
        title: updated.title,
        slug: updated.slug,
        status: updated.status,
        theme: updated.theme,
        sections: updated.sections,
        formFields: updated.form_fields,
        contactInfo: updated.contact_info || {},
        updatedAt: updated.updated_at,
      },
    });
  } catch (error) {
    console.error('Page PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 페이지 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: pageId } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Supabase 미설정시 데모 모드
    if (!supabaseAdmin) {
      return NextResponse.json({ success: true, demo: true });
    }

    // 현재 사용자 조회
    const { data: user } = await supabaseAdmin
      .from('profiles')
      .select('id, role')
      .eq('email', session.user.email)
      .single();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 페이지 조회
    const { data: page } = await supabaseAdmin
      .from('landing_pages')
      .select('id, user_id')
      .eq('id', pageId)
      .single();

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // 권한 확인 (본인 페이지 또는 관리자)
    if (page.user_id !== user.id && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 삭제
    const { error: deleteError } = await supabaseAdmin
      .from('landing_pages')
      .delete()
      .eq('id', pageId);

    if (deleteError) {
      console.error('Page delete error:', deleteError);
      return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Page DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
