/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { supabaseAdmin } from '@/lib/db/supabase';

// 특정 페이지의 신청 목록 조회
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

    // 페이지 소유권 확인
    const { data: page } = await supabase
      .from('landing_pages')
      .select('id, user_id, title, slug, status, view_count')
      .eq('id', pageId)
      .single();

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // 권한 확인 (본인 페이지 또는 관리자)
    if ((page as any).user_id !== (user as any).id && (user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 신청 목록 조회
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = supabase
      .from('submissions')
      .select('*')
      .eq('page_id', pageId)
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: submissions, error } = await query;

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
    }

    return NextResponse.json({
      page: {
        id: (page as any).id,
        title: (page as any).title,
        slug: (page as any).slug,
        status: (page as any).status,
        view_count: (page as any).view_count || 0,
      },
      submissions: submissions || [],
    });
  } catch (error) {
    console.error('Submissions API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
