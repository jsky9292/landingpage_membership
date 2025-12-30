/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { createServerClient } from '@/lib/supabase/client';

// 관리자용 - 특정 사용자 상세 정보 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServerClient() as any;

    // 현재 사용자가 관리자인지 확인
    const { data: currentUser } = await supabase
      .from('users')
      .select('id, role')
      .eq('email', session.user.email)
      .single();

    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 });
    }

    // 대상 사용자 조회
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 사용자의 페이지 목록 조회
    const { data: pages } = await supabase
      .from('landing_pages')
      .select('id, title, slug, status, view_count, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    // 각 페이지별 신청 수 조회
    const pageIds = pages?.map((p: any) => p.id) || [];
    const { data: submissions } = await supabase
      .from('submissions')
      .select('id, page_id, status, created_at')
      .in('page_id', pageIds)
      .order('created_at', { ascending: false });

    // 페이지별 신청 통계
    const submissionsByPage = new Map();
    submissions?.forEach((s: any) => {
      if (!submissionsByPage.has(s.page_id)) {
        submissionsByPage.set(s.page_id, { total: 0, new: 0 });
      }
      const stats = submissionsByPage.get(s.page_id);
      stats.total++;
      if (s.status === 'new') stats.new++;
    });

    // 페이지에 신청 통계 추가
    const pagesWithStats = pages?.map((page: any) => ({
      id: page.id,
      title: page.title,
      slug: page.slug,
      status: page.status,
      viewCount: page.view_count || 0,
      createdAt: page.created_at,
      submissionCount: submissionsByPage.get(page.id)?.total || 0,
      newSubmissionCount: submissionsByPage.get(page.id)?.new || 0,
    })) || [];

    // 통계 계산
    const totalPages = pagesWithStats.length;
    const publishedPages = pagesWithStats.filter((p: any) => p.status === 'published').length;
    const totalViews = pagesWithStats.reduce((sum: number, p: any) => sum + p.viewCount, 0);
    const totalSubmissions = submissions?.length || 0;
    const newSubmissions = submissions?.filter((s: any) => s.status === 'new').length || 0;

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.created_at,
        lastLoginAt: user.last_login_at,
      },
      stats: {
        totalPages,
        publishedPages,
        totalViews,
        totalSubmissions,
        newSubmissions,
        conversionRate: totalViews > 0 ? Math.round((totalSubmissions / totalViews) * 1000) / 10 : 0,
      },
      pages: pagesWithStats,
      recentSubmissions: submissions?.slice(0, 10).map((s: any) => ({
        id: s.id,
        pageId: s.page_id,
        status: s.status,
        createdAt: s.created_at,
      })) || [],
    });
  } catch (error) {
    console.error('Admin user detail API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 관리자용 - 사용자 역할 변경
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { role } = body;

    if (!role || !['user', 'admin'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    const supabase = createServerClient() as any;

    // 현재 사용자가 관리자인지 확인
    const { data: currentUser } = await supabase
      .from('users')
      .select('id, role')
      .eq('email', session.user.email)
      .single();

    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 });
    }

    // 자기 자신의 역할은 변경 불가
    if (currentUser.id === userId) {
      return NextResponse.json({ error: 'Cannot change own role' }, { status: 400 });
    }

    // 역할 업데이트
    const { data: updated, error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }

    return NextResponse.json({ user: updated });
  } catch (error) {
    console.error('Admin user update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
