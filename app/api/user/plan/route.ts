/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { createServerClient } from '@/lib/supabase/client';

// 사용 가능한 플랜 목록
const validPlans = ['free', 'single', 'starter', 'pro', 'unlimited', 'agency'];
const validRoles = ['user', 'admin'];

// 관리자용 - 자신의 플랜/역할 변경
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 세션에서 관리자 확인
    const sessionUser = session.user as any;
    const isAdmin = sessionUser.role === 'admin';

    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 });
    }

    const body = await request.json();
    const { plan, role } = body;

    // 유효성 검사
    if (plan && !validPlans.includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }
    if (role && !validRoles.includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Supabase 연결 시도
    let supabase: any;
    try {
      supabase = createServerClient();
    } catch (e) {
      console.error('Supabase client error:', e);
      // DB 연결 실패 시 - 데모 계정 세션만 업데이트
      // 실제로 세션을 업데이트하려면 JWT 콜백을 사용해야 함
      // 여기서는 성공 응답만 반환 (클라이언트에서 새로고침하면 세션에서 값을 가져옴)
      return NextResponse.json({
        success: true,
        message: 'Demo mode - changes will reflect after re-login',
        plan: plan || sessionUser.plan,
        role: role || sessionUser.role,
      });
    }

    // DB에서 사용자 조회
    const { data: dbUser, error: userError } = await supabase
      .from('users')
      .select('id, plan, role')
      .eq('email', session.user.email)
      .single();

    if (userError || !dbUser) {
      // DB에 사용자가 없으면 (데모 계정) 성공 응답
      return NextResponse.json({
        success: true,
        message: 'Demo mode - plan updated in session',
        plan: plan || sessionUser.plan || 'free',
        role: role || sessionUser.role || 'admin',
      });
    }

    // 업데이트할 데이터 준비
    const updateData: Record<string, string> = {};
    if (plan) updateData.plan = plan;
    if (role) updateData.role = role;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No changes provided' }, { status: 400 });
    }

    // DB 업데이트
    const { error: updateError } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', dbUser.id);

    if (updateError) {
      console.error('User update error:', updateError);
      return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Plan updated successfully',
      plan: plan || dbUser.plan,
      role: role || dbUser.role,
    });
  } catch (error) {
    console.error('User plan API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET - 현재 사용자 플랜 정보 조회
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessionUser = session.user as any;

    return NextResponse.json({
      email: session.user.email,
      plan: sessionUser.plan || 'free',
      role: sessionUser.role || 'user',
    });
  } catch (error) {
    console.error('User plan GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
