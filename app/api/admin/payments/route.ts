/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { supabaseAdmin } from '@/lib/db/supabase';

// 결제 내역 조회 (관리자 전용)
export async function GET(request: NextRequest) {
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

    // 검색 파라미터
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const plan = searchParams.get('plan') || 'all';
    const status = searchParams.get('status') || 'all';

    // 결제 내역 조회
    let query = supabaseAdmin
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false });

    // 플랜 필터
    if (plan !== 'all') {
      query = query.eq('plan', plan);
    }

    // 상태 필터
    if (status !== 'all') {
      query = query.eq('status', status);
    }

    // 검색 필터 (이메일)
    if (search) {
      const sanitizedSearch = search.replace(/[%_\\]/g, '\\$&').replace(/['\";]/g, '');
      if (sanitizedSearch.length > 0 && sanitizedSearch.length <= 100) {
        query = query.ilike('user_email', `%${sanitizedSearch}%`);
      }
    }

    const { data: payments, error } = await query;

    if (error) {
      console.error('Payments query error:', error);
      return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
    }

    // 통계 계산
    const { data: allPayments } = await supabaseAdmin
      .from('payments')
      .select('amount, plan, status, created_at');

    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const stats = {
      totalRevenue: (allPayments || [])
        .filter((p: any) => p.status === 'completed')
        .reduce((sum: number, p: any) => sum + (p.amount || 0), 0),
      monthlyRevenue: (allPayments || [])
        .filter((p: any) => p.status === 'completed' && new Date(p.created_at) >= thisMonth)
        .reduce((sum: number, p: any) => sum + (p.amount || 0), 0),
      totalTransactions: (allPayments || []).length,
      completedTransactions: (allPayments || []).filter((p: any) => p.status === 'completed').length,
    };

    return NextResponse.json({
      payments: payments || [],
      stats,
    });
  } catch (error) {
    console.error('Admin payments API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
