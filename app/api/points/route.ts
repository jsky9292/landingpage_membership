import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { supabaseAdmin } from '@/lib/db/supabase';

// 데모 포인트 히스토리
const demoHistory = [
  {
    id: 'ph-1',
    type: 'charge' as const,
    amount: 10500,
    balance: 10500,
    description: '10,000P 충전 (+500P 보너스)',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: 'ph-2',
    type: 'use' as const,
    amount: -1000,
    balance: 9500,
    description: '랜딩페이지 생성',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: 'ph-3',
    type: 'use' as const,
    amount: -100,
    balance: 9400,
    description: 'AI 이미지 생성',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: 'ph-4',
    type: 'referral' as const,
    amount: 1000,
    balance: 10400,
    description: '추천인 보너스 (김철수님 가입)',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const userId = (session.user as any).id;

    // Supabase 미설정시 데모 데이터 반환
    if (!supabaseAdmin) {
      return NextResponse.json({
        points: 10400,
        history: demoHistory,
      });
    }

    // 사용자 포인트 조회
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('points')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('User fetch error:', userError);
      return NextResponse.json({
        points: 0,
        history: [],
      });
    }

    // 포인트 히스토리 조회
    const { data: history, error: historyError } = await supabaseAdmin
      .from('point_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (historyError) {
      console.error('History fetch error:', historyError);
    }

    return NextResponse.json({
      points: user?.points || 0,
      history: history || [],
    });
  } catch (error) {
    console.error('Points API error:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
