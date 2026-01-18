import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { supabaseAdmin } from '@/lib/db/supabase';

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
        referralCode: 'DEMO1234',
        referralCount: 3,
        totalEarned: 3000,
        referrals: [
          { name: '김*수', joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), bonus: 1000 },
          { name: '이*희', joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(), bonus: 1000 },
          { name: '박*준', joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), bonus: 1000 },
        ],
      });
    }

    // 사용자 추천 정보 조회
    const { data: user, error: userError } = await supabaseAdmin
      .from('profiles')
      .select('referral_code, referral_count')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('User fetch error:', userError);
      return NextResponse.json({ error: '사용자 정보를 불러올 수 없습니다.' }, { status: 500 });
    }

    // 추천한 사용자 목록 조회
    const { data: referrals } = await supabaseAdmin
      .from('profiles')
      .select('name, created_at')
      .eq('referred_by', userId)
      .order('created_at', { ascending: false })
      .limit(20);

    // 이름 마스킹 처리
    const maskedReferrals = (referrals || []).map(r => ({
      name: r.name ? `${r.name.charAt(0)}*${r.name.slice(-1)}` : '익명',
      joinedAt: r.created_at,
      bonus: 1000,
    }));

    // 총 추천 포인트 계산
    const totalEarned = (user?.referral_count || 0) * 1000;

    return NextResponse.json({
      referralCode: user?.referral_code || '',
      referralCount: user?.referral_count || 0,
      totalEarned,
      referrals: maskedReferrals,
    });
  } catch (error) {
    console.error('Referral API error:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
