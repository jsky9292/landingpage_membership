/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { createServerClient } from '@/lib/supabase/client';

// 관리자용 - 전체 사용자 목록 및 통계 조회
export async function GET() {
  try {
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

    // 전체 사용자 목록 조회
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, name, role, plan, created_at, last_login_at')
      .order('created_at', { ascending: false });

    if (usersError) {
      console.error('Users fetch error:', usersError);
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }

    // 각 사용자별 페이지 수와 신청 수 조회
    const userIds = users?.map((u: any) => u.id) || [];

    // 사용자별 페이지 통계
    const { data: pageStats } = await supabase
      .from('landing_pages')
      .select('user_id, id, status, view_count')
      .in('user_id', userIds);

    // 전체 신청 통계 (페이지별)
    const pageIds = pageStats?.map((p: any) => p.id) || [];
    const { data: submissions } = await supabase
      .from('submissions')
      .select('id, page_id, status, created_at')
      .in('page_id', pageIds);

    // 통계 계산
    const userStatsMap = new Map();

    // 페이지 통계 집계
    pageStats?.forEach((page: any) => {
      if (!userStatsMap.has(page.user_id)) {
        userStatsMap.set(page.user_id, {
          totalPages: 0,
          publishedPages: 0,
          totalViews: 0,
          totalSubmissions: 0,
          newSubmissions: 0,
        });
      }
      const stats = userStatsMap.get(page.user_id);
      stats.totalPages++;
      if (page.status === 'published') stats.publishedPages++;
      stats.totalViews += page.view_count || 0;
    });

    // 신청 통계 집계
    const pageToUserMap = new Map();
    pageStats?.forEach((p: any) => pageToUserMap.set(p.id, p.user_id));

    submissions?.forEach((sub: any) => {
      const userId = pageToUserMap.get(sub.page_id);
      if (userId && userStatsMap.has(userId)) {
        const stats = userStatsMap.get(userId);
        stats.totalSubmissions++;
        if (sub.status === 'new') stats.newSubmissions++;
      }
    });

    // 사용자 데이터에 통계 추가
    const usersWithStats = users?.map((user: any) => {
      const stats = userStatsMap.get(user.id) || {
        totalPages: 0,
        publishedPages: 0,
        totalViews: 0,
        totalSubmissions: 0,
        newSubmissions: 0,
      };

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        plan: user.plan || 'free',
        createdAt: user.created_at,
        lastLoginAt: user.last_login_at,
        ...stats,
        conversionRate: stats.totalViews > 0
          ? Math.round((stats.totalSubmissions / stats.totalViews) * 1000) / 10
          : 0,
      };
    }) || [];

    // 전체 통계
    const totalUsers = users?.length || 0;
    const totalPages = pageStats?.length || 0;
    const totalSubmissions = submissions?.length || 0;
    const newSubmissions = submissions?.filter((s: any) => s.status === 'new').length || 0;
    const totalViews = pageStats?.reduce((sum: number, p: any) => sum + (p.view_count || 0), 0) || 0;

    return NextResponse.json({
      stats: {
        totalUsers,
        totalPages,
        totalSubmissions,
        newSubmissions,
        totalViews,
        conversionRate: totalViews > 0 ? Math.round((totalSubmissions / totalViews) * 1000) / 10 : 0,
      },
      users: usersWithStats,
    });
  } catch (error) {
    console.error('Admin users API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
