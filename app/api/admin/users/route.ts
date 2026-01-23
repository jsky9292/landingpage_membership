/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { supabaseAdmin } from '@/lib/db/supabase';

// 회원 목록 조회 (관리자 전용)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    // 현재 사용자가 관리자인지 확인 (profiles 테이블 사용)
    const { data: currentUser } = await supabaseAdmin
      .from('profiles')
      .select('id, role')
      .eq('email', session.user.email)
      .single();

    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 });
    }

    // 검색 파라미터
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || 'all';
    const plan = searchParams.get('plan') || 'all';

    // 회원 목록 조회 (profiles 테이블 사용)
    let query = supabaseAdmin
      .from('profiles')
      .select('id, email, name, avatar_url, role, plan, plan_expires_at, created_at, updated_at')
      .order('created_at', { ascending: false });

    // 역할 필터
    if (role !== 'all') {
      query = query.eq('role', role);
    }

    // 플랜 필터
    if (plan !== 'all') {
      query = query.eq('plan', plan);
    }

    // 검색 필터 (이름 또는 이메일) - SQL Injection 방지
    if (search) {
      // 특수문자 이스케이프
      const sanitizedSearch = search.replace(/[%_\\]/g, '\\$&').replace(/['\";]/g, '');
      if (sanitizedSearch.length > 0 && sanitizedSearch.length <= 100) {
        query = query.or(`name.ilike.%${sanitizedSearch}%,email.ilike.%${sanitizedSearch}%`);
      }
    }

    const { data: users, error } = await query;

    if (error) {
      console.error('Users query error:', error);
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }

    // 각 사용자의 페이지 수 조회
    const userIds = (users || []).map((u: any) => u.id);
    let pageCountMap = new Map();

    if (userIds.length > 0) {
      const { data: pageCounts } = await supabaseAdmin
        .from('landing_pages')
        .select('user_id')
        .in('user_id', userIds);

      // 페이지 수 집계
      (pageCounts || []).forEach((p: any) => {
        pageCountMap.set(p.user_id, (pageCountMap.get(p.user_id) || 0) + 1);
      });
    }

    // 응답 데이터 가공
    const usersWithStats = (users || []).map((user: any) => ({
      id: user.id,
      email: user.email,
      name: user.name || '이름 없음',
      avatarUrl: user.avatar_url,
      role: user.role || 'user',
      plan: user.plan || 'free',
      planExpiresAt: user.plan_expires_at,
      pageCount: pageCountMap.get(user.id) || 0,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    }));

    // 전체 통계 (필터 적용 전 전체 데이터 기준)
    const { data: allUsers } = await supabaseAdmin
      .from('profiles')
      .select('role, plan');

    const planStats = {
      free: 0,
      starter: 0,
      pro: 0,
      unlimited: 0,
      agency: 0,
    };

    (allUsers || []).forEach((u: any) => {
      const userPlan = u.plan || 'free';
      if (userPlan in planStats) {
        planStats[userPlan as keyof typeof planStats]++;
      }
    });

    const stats = {
      totalUsers: (allUsers || []).length,
      adminCount: (allUsers || []).filter((u: any) => u.role === 'admin').length,
      userCount: (allUsers || []).filter((u: any) => u.role === 'user' || !u.role).length,
      planStats,
    };

    return NextResponse.json({
      users: usersWithStats,
      stats,
    });
  } catch (error) {
    console.error('Admin users API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 회원 역할/플랜 변경 (관리자 전용)
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    // 현재 사용자가 관리자인지 확인
    const { data: currentUser } = await supabaseAdmin
      .from('profiles')
      .select('id, role')
      .eq('email', session.user.email)
      .single();

    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 });
    }

    const body = await request.json();
    const { userId, role, plan } = body;

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    // 자기 자신의 역할은 변경 불가
    if (userId === currentUser.id && role) {
      return NextResponse.json({ error: 'Cannot change own role' }, { status: 400 });
    }

    // 업데이트할 데이터 구성
    const updateData: Record<string, any> = {};

    if (role) {
      if (!['user', 'admin'].includes(role)) {
        return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
      }
      updateData.role = role;
    }

    if (plan) {
      if (!['free', 'starter', 'pro', 'unlimited', 'agency'].includes(plan)) {
        return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
      }
      updateData.plan = plan;

      // 무료가 아닌 플랜으로 변경 시 만료일 설정 (30일)
      if (plan !== 'free') {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);
        updateData.plan_expires_at = expiresAt.toISOString();
        updateData.plan_started_at = new Date().toISOString();
      } else {
        // 무료로 변경 시 만료일 제거
        updateData.plan_expires_at = null;
        updateData.plan_started_at = null;
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No update data provided' }, { status: 400 });
    }

    // profiles 테이블 업데이트
    const { data: updatedUser, error } = await supabaseAdmin
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('User update error:', error);
      return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error('Admin users PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
