/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { createServerClient } from '@/lib/supabase/client';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServerClient() as any;

    // Supabase가 설정되지 않은 경우 데모 응답
    if (!supabase) {
      return NextResponse.json({
        stats: { totalPages: 0, totalSubmissions: 0, newSubmissions: 0, conversionRate: 0 },
        pages: [],
        isAdmin: false,
      });
    }

    const userEmail = session.user.email;

    // profiles 테이블에서 사용자 조회 (email 기반)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, role')
      .eq('email', userEmail)
      .single();

    if (profileError || !profile) {
      console.error('Profile fetch error:', profileError);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isAdmin = (profile as any).role === 'admin';
    const userId = (profile as any).id;

    // 페이지 목록 조회 (관리자는 전체, 일반 유저는 본인 것만)
    let pagesQuery = supabase
      .from('landing_pages')
      .select('id, title, slug, status, view_count, created_at, user_id')
      .order('created_at', { ascending: false });

    if (!isAdmin) {
      pagesQuery = pagesQuery.eq('user_id', userId);
    }

    const { data: pages, error: pagesError } = await pagesQuery;

    if (pagesError) {
      console.error('Pages error:', pagesError);
      return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
    }

    // 관리자인 경우 사용자 정보 별도 조회 (profiles 테이블 사용)
    let usersMap = new Map();
    if (isAdmin && pages && pages.length > 0) {
      const userIds = [...new Set((pages as any[]).map((p: any) => p.user_id))];
      const { data: usersData } = await supabase
        .from('profiles')
        .select('id, name, email')
        .in('id', userIds);

      (usersData || []).forEach((u: any) => {
        usersMap.set(u.id, { name: u.name, email: u.email });
      });
    }

    // 신청 데이터 조회
    const pageIds = (pages as any[])?.map((p: any) => p.id) || [];
    let submissions: any[] = [];

    if (pageIds.length > 0) {
      const { data: subs } = await supabase
        .from('submissions')
        .select('id, page_id, status, created_at')
        .in('page_id', pageIds);
      submissions = subs || [];
    }

    // 통계 계산
    const submissionsByPage = new Map();
    submissions.forEach((s: any) => {
      if (!submissionsByPage.has(s.page_id)) {
        submissionsByPage.set(s.page_id, { total: 0, new: 0 });
      }
      const stats = submissionsByPage.get(s.page_id);
      stats.total++;
      if (s.status === 'new') stats.new++;
    });

    // 페이지 목록에 신청 통계 추가
    const pagesWithStats = (pages as any[])?.map((page: any) => {
      const userData = usersMap.get(page.user_id);
      return {
        id: page.id,
        title: page.title,
        slug: page.slug,
        status: page.status,
        viewCount: page.view_count,
        createdAt: page.created_at,
        submissionCount: submissionsByPage.get(page.id)?.total || 0,
        newSubmissionCount: submissionsByPage.get(page.id)?.new || 0,
        userName: isAdmin ? (userData?.name || userData?.email) : undefined,
      };
    }) || [];

    // 전체 통계
    const totalPages = pagesWithStats.length;
    const totalSubmissions = submissions.length;
    const newSubmissions = submissions.filter((s: any) => s.status === 'new').length;
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
