/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { supabaseAdmin } from '@/lib/db/supabase';

// 관리자용 - 전체 페이지 목록 조회
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 세션에서 role 확인
    const sessionRole = (session.user as any).role;
    let isAdmin = sessionRole === 'admin';

    // Supabase 미설정시 데모 모드
    if (!supabaseAdmin) {
      if (isAdmin) {
        return NextResponse.json({
          stats: { totalPages: 2, publishedPages: 1, totalSubmissions: 15, newSubmissions: 3 },
          pages: [
            { id: 'demo-1', title: '다이어트 프로그램', slug: 'diet', topic: 'health', status: 'published', viewCount: 245, submissionCount: 12, newSubmissionCount: 2, createdAt: new Date().toISOString(), owner: { email: 'user@demo.com', name: '데모 사용자' } },
            { id: 'demo-2', title: '무료 상담', slug: 'consult', topic: 'consulting', status: 'draft', viewCount: 89, submissionCount: 3, newSubmissionCount: 1, createdAt: new Date().toISOString(), owner: { email: 'user@demo.com', name: '데모 사용자' } },
          ],
          demo: true,
        });
      }
      return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 });
    }

    // DB에서 관리자 확인 (세션에서 확인 안 된 경우)
    if (!isAdmin) {
      const { data: currentUser } = await supabaseAdmin
        .from('profiles')
        .select('id, role')
        .eq('email', session.user.email)
        .single();

      isAdmin = currentUser?.role === 'admin';
    }

    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 });
    }

    // 전체 페이지 목록 조회
    const { data: pages, error: pagesError } = await supabaseAdmin
      .from('landing_pages')
      .select(`
        id,
        title,
        slug,
        topic,
        status,
        view_count,
        user_id,
        created_at,
        updated_at
      `)
      .order('created_at', { ascending: false });

    if (pagesError) {
      console.error('Pages fetch error:', pagesError);
      return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
    }

    // 페이지별 신청 통계 조회
    const pageIds = pages?.map((p: any) => p.id) || [];

    let submissions: any[] = [];
    if (pageIds.length > 0) {
      const { data: subs } = await supabaseAdmin
        .from('submissions')
        .select('id, page_id, status')
        .in('page_id', pageIds);
      submissions = subs || [];
    }

    // 페이지 소유자 정보 조회
    const userIds = [...new Set(pages?.map((p: any) => p.user_id) || [])];
    let users: any[] = [];
    if (userIds.length > 0) {
      const { data: usersData } = await supabaseAdmin
        .from('profiles')
        .select('id, email, name')
        .in('id', userIds);
      users = usersData || [];
    }

    const userMap = new Map(users.map((u: any) => [u.id, u]));

    // 신청 통계 집계
    const submissionsByPage = new Map<string, { total: number; new: number }>();
    submissions.forEach((s: any) => {
      if (!submissionsByPage.has(s.page_id)) {
        submissionsByPage.set(s.page_id, { total: 0, new: 0 });
      }
      const stats = submissionsByPage.get(s.page_id)!;
      stats.total++;
      if (s.status === 'new') stats.new++;
    });

    // 페이지 데이터에 통계 추가
    const pagesWithStats = pages?.map((page: any) => {
      const owner = userMap.get(page.user_id);
      const stats = submissionsByPage.get(page.id) || { total: 0, new: 0 };

      return {
        id: page.id,
        title: page.title,
        slug: page.slug,
        topic: page.topic || 'free',
        status: page.status,
        viewCount: page.view_count || 0,
        submissionCount: stats.total,
        newSubmissionCount: stats.new,
        createdAt: page.created_at,
        updatedAt: page.updated_at,
        owner: owner ? {
          id: owner.id,
          email: owner.email,
          name: owner.name,
        } : null,
      };
    }) || [];

    // 전체 통계
    const totalPages = pagesWithStats.length;
    const publishedPages = pagesWithStats.filter((p: any) => p.status === 'published').length;
    const totalSubmissions = submissions.length;
    const newSubmissions = submissions.filter((s: any) => s.status === 'new').length;

    return NextResponse.json({
      stats: {
        totalPages,
        publishedPages,
        totalSubmissions,
        newSubmissions,
      },
      pages: pagesWithStats,
    });
  } catch (error) {
    console.error('Admin pages API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
