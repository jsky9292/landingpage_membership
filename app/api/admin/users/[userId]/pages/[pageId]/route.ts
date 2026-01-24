/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { supabaseAdmin } from '@/lib/db/supabase';

// 특정 랜딩페이지의 상세 정보 및 신청 목록 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string; pageId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { userId, pageId } = await params;

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    // 관리자 확인
    const { data: currentUser } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('email', session.user.email)
      .single();

    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 });
    }

    // 회원 정보 조회
    const { data: user, error: userError } = await supabaseAdmin
      .from('profiles')
      .select('id, email, name')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 랜딩페이지 정보 조회
    const { data: page, error: pageError } = await supabaseAdmin
      .from('landing_pages')
      .select('id, title, slug, status, view_count, created_at, updated_at, user_id')
      .eq('id', pageId)
      .eq('user_id', userId)
      .single();

    if (pageError || !page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // 신청 목록 조회
    const { data: submissions, error: submissionsError } = await supabaseAdmin
      .from('submissions')
      .select('id, name, phone, email, data, created_at, status')
      .eq('page_id', pageId)
      .order('created_at', { ascending: false });

    if (submissionsError) {
      console.error('Submissions query error:', submissionsError);
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name || '이름 없음',
      },
      page: {
        id: page.id,
        title: page.title,
        slug: page.slug,
        status: page.status,
        viewCount: page.view_count || 0,
        createdAt: page.created_at,
        updatedAt: page.updated_at,
      },
      submissions: (submissions || []).map((s: any) => ({
        id: s.id,
        name: s.name || '이름 없음',
        phone: s.phone,
        email: s.email,
        data: s.data,
        status: s.status || 'new',
        createdAt: s.created_at,
      })),
      stats: {
        totalSubmissions: (submissions || []).length,
        newCount: (submissions || []).filter((s: any) => !s.status || s.status === 'new').length,
        viewCount: page.view_count || 0,
      },
    });
  } catch (error) {
    console.error('Admin page detail API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
