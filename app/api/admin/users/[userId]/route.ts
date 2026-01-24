/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { supabaseAdmin } from '@/lib/db/supabase';

// 특정 회원의 상세 정보 및 랜딩페이지 목록 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { userId } = await params;

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
      .select('id, email, name, avatar_url, role, plan, plan_expires_at, created_at')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 회원의 랜딩페이지 목록 조회
    const { data: pages, error: pagesError } = await supabaseAdmin
      .from('landing_pages')
      .select('id, title, slug, status, view_count, created_at, updated_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (pagesError) {
      console.error('Pages query error:', pagesError);
    }

    // 각 페이지의 신청 수 조회
    const pageIds = (pages || []).map((p: any) => p.id);
    let submissionCountMap = new Map();

    if (pageIds.length > 0) {
      const { data: submissions } = await supabaseAdmin
        .from('submissions')
        .select('page_id')
        .in('page_id', pageIds);

      (submissions || []).forEach((s: any) => {
        submissionCountMap.set(s.page_id, (submissionCountMap.get(s.page_id) || 0) + 1);
      });
    }

    // 응답 데이터 가공
    const pagesWithStats = (pages || []).map((page: any) => ({
      id: page.id,
      title: page.title,
      slug: page.slug,
      status: page.status,
      viewCount: page.view_count || 0,
      submissionCount: submissionCountMap.get(page.id) || 0,
      createdAt: page.created_at,
      updatedAt: page.updated_at,
    }));

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name || '이름 없음',
        avatarUrl: user.avatar_url,
        role: user.role,
        plan: user.plan,
        planExpiresAt: user.plan_expires_at,
        createdAt: user.created_at,
      },
      pages: pagesWithStats,
      stats: {
        totalPages: pagesWithStats.length,
        totalViews: pagesWithStats.reduce((sum: number, p: any) => sum + p.viewCount, 0),
        totalSubmissions: pagesWithStats.reduce((sum: number, p: any) => sum + p.submissionCount, 0),
      },
    });
  } catch (error) {
    console.error('Admin user detail API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
