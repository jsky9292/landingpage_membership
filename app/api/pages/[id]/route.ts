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

    const supabase = supabaseAdmin;

    // 현재 사용자 조회
    const { data: user } = await supabase
      .from('profiles')
      .select('id, role')
      .eq('email', session.user.email)
      .single();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 페이지 조회
    const { data: page, error: pageError } = await supabase
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
    const { title, sections, formFields, theme, status } = body;

    const supabase = supabaseAdmin;

    // 현재 사용자 조회
    const { data: user } = await supabase
      .from('profiles')
      .select('id, role')
      .eq('email', session.user.email)
      .single();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 페이지 조회
    const { data: page } = await supabase
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

    // 업데이트
    const { data: updated, error: updateError } = await supabase
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

    const supabase = supabaseAdmin;

    // 현재 사용자 조회
    const { data: user } = await supabase
      .from('profiles')
      .select('id, role')
      .eq('email', session.user.email)
      .single();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 페이지 조회
    const { data: page } = await supabase
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
    const { error: deleteError } = await supabase
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
