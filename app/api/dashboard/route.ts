/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { createServerClient } from '@/lib/supabase/client';

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServerClient() as any;

    // 현재 사용자 조회
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, role')
      .eq('email', session.user.email)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isAdmin = (user as any).role === 'admin';

    // 페이지 목록 조회 (관리자는 전체, 일반 유저는 본인 것만)
    let pagesQuery = supabase
      .from('landing_pages')
      .select(`
        id,
        title,
        slug,
        status,
        view_count,
        created_at,
        user_id,
        users!inner(name, email)
      `)
      .order('created_at', { ascending: false });

    if (!isAdmin) {
      pagesQuery = pagesQuery.eq('user_id', (user as any).id);
    }

    const { data: pages, error: pagesError } = await pagesQuery;

    if (pagesError) {
      console.error('Pages error:', pagesError);
      return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
    }

    // 신청 데이터 조회
    const pageIds = (pages as any[])?.map((p: any) => p.id) || [];

    const { data: submissions } = await supabase
      .from('submissions')
      .select('id, page_id, status, created_at')
      .in('page_id', pageIds);

    // 통계 계산
    const submissionsByPage = new Map();
    (submissions as any[])?.forEach((s: any) => {
      if (!submissionsByPage.has(s.page_id)) {
        submissionsByPage.set(s.page_id, { total: 0, new: 0 });
      }
      const stats = submissionsByPage.get(s.page_id);
      stats.total++;
      if (s.status === 'new') stats.new++;
    });

    // 페이지 목록에 신청 통계 추가
    const pagesWithStats = (pages as any[])?.map((page: any) => ({
      id: page.id,
      title: page.title,
      slug: page.slug,
      status: page.status,
      viewCount: page.view_count,
      createdAt: page.created_at,
      submissionCount: submissionsByPage.get(page.id)?.total || 0,
      newSubmissionCount: submissionsByPage.get(page.id)?.new || 0,
      userName: isAdmin ? page.users?.name || page.users?.email : undefined,
    })) || [];

    // 전체 통계
    const totalPages = pagesWithStats.length;
    const totalSubmissions = (submissions as any[])?.length || 0;
    const newSubmissions = (submissions as any[])?.filter((s: any) => s.status === 'new').length || 0;
    const totalViews = (pages as any[])?.reduce((sum: number, p: any) => sum + (p.view_count || 0), 0) || 0;
    const conversionRate = totalViews > 0 ? Math.round((totalSubmissions / totalViews) * 1000) / 10 : 0;

    return NextResponse.json({
      stats: {
        totalPages,
        totalSubmissions,
        newSubmissions,
        conversionRate,
      },
      pages: pagesWithStats,
      isAdmin,
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
