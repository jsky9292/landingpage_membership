/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { createServerClient } from '@/lib/supabase/client';

// 회원 목록 조회 (관리자 전용)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

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

    // 검색 파라미터
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || 'all';

    // 회원 목록 조회
    let query = supabase
      .from('users')
      .select('id, email, name, avatar_url, role, created_at, updated_at')
      .order('created_at', { ascending: false });

    // 역할 필터
    if (role !== 'all') {
      query = query.eq('role', role);
    }

    // 검색 필터 (이름 또는 이메일) - SQL Injection 방지
    if (search) {
      // 특수문자 이스케이프
      const sanitizedSearch = search.replace(/[%_\]/g, '\$&').replace(/['";]/g, '');
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
    const { data: pageCounts } = await supabase
      .from('landing_pages')
      .select('user_id')
      .in('user_id', userIds);

    // 페이지 수 집계
    const pageCountMap = new Map();
    (pageCounts || []).forEach((p: any) => {
      pageCountMap.set(p.user_id, (pageCountMap.get(p.user_id) || 0) + 1);
    });

    // 응답 데이터 가공
    const usersWithStats = (users || []).map((user: any) => ({
      id: user.id,
      email: user.email,
      name: user.name || '이름 없음',
      avatarUrl: user.avatar_url,
      role: user.role,
      pageCount: pageCountMap.get(user.id) || 0,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    }));

    // 통계
    const stats = {
      totalUsers: usersWithStats.length,
      adminCount: usersWithStats.filter((u: any) => u.role === 'admin').length,
      userCount: usersWithStats.filter((u: any) => u.role === 'user').length,
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

// 회원 역할 변경 (관리자 전용)
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

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

    const body = await request.json();
    const { userId, role } = body;

    if (!userId || !role) {
      return NextResponse.json({ error: 'userId and role are required' }, { status: 400 });
    }

    if (!['user', 'admin'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // 자기 자신의 역할은 변경 불가
    if (userId === currentUser.id) {
      return NextResponse.json({ error: 'Cannot change own role' }, { status: 400 });
    }

    // 역할 업데이트
    const { data: updatedUser, error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Role update error:', error);
      return NextResponse.json({ error: 'Failed to update role' }, { status: 500 });
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
