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

    // 세션에서 데모 계정 정보 확인
    const sessionUser = session.user as any;
    const sessionRole = sessionUser.role;
    const sessionId = sessionUser.id;
    const sessionPlan = sessionUser.plan;

    const supabase = createServerClient() as any;

    // 현재 사용자 조회 (DB 또는 세션에서)
    let userId = sessionId;
    let isAdmin = sessionRole === 'admin';
    let userPlan = sessionPlan || 'free';

    // DB에서 사용자 조회 시도 (실제 사용자인 경우)
    const { data: dbUser } = await supabase
      .from('users')
      .select('id, role, plan')
      .eq('email', session.user.email)
      .single();

    if (dbUser) {
      userId = dbUser.id;
      isAdmin = dbUser.role === 'admin' || isAdmin;
      userPlan = dbUser.plan || userPlan;
    }

    // 데모 계정이고 DB에 없는 경우 빈 데이터 반환
    if (!dbUser && sessionId) {
      // 데모 계정용 빈 대시보드 반환
      const planLimits: Record<string, { pages: number; name: string }> = {
        free: { pages: 1, name: '무료' },
        single: { pages: 1, name: '단건 구매' },
        starter: { pages: 1, name: '스타터' },
        pro: { pages: 3, name: '프로' },
        unlimited: { pages: -1, name: '무제한' },
        agency: { pages: -1, name: '대행사' },
      };
      const planInfo = planLimits[userPlan] || planLimits.free;

      return NextResponse.json({
        stats: {
          totalPages: 0,
          totalSubmissions: 0,
          newSubmissions: 0,
          conversionRate: 0,
        },
        pages: [],
        isAdmin,
        plan: {
          id: userPlan,
          name: planInfo.name,
          pageLimit: planInfo.pages,
          pagesRemaining: planInfo.pages,
        },
      });
    }

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 플랜별 페이지 제한
    const planLimits: Record<string, { pages: number; name: string }> = {
      free: { pages: 1, name: '무료' },
      single: { pages: 1, name: '단건 구매' },
      starter: { pages: 1, name: '스타터' },
      pro: { pages: 3, name: '프로' },
      unlimited: { pages: -1, name: '무제한' },
      agency: { pages: -1, name: '대행사' },
    };
    const planInfo = planLimits[userPlan] || planLimits.free;

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
      pagesQuery = pagesQuery.eq('user_id', userId);
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
      plan: {
        id: userPlan,
        name: planInfo.name,
        pageLimit: planInfo.pages,
        pagesRemaining: planInfo.pages === -1 ? -1 : Math.max(0, planInfo.pages - totalPages),
      },
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
