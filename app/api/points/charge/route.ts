import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { supabaseAdmin } from '@/lib/db/supabase';

// 포인트 상품 정의
const pointProducts: Record<string, { points: number; bonus: number; price: number }> = {
  point_5000: { points: 5000, bonus: 0, price: 5000 },
  point_10000: { points: 10000, bonus: 500, price: 10000 },
  point_30000: { points: 30000, bonus: 2000, price: 30000 },
  point_50000: { points: 50000, bonus: 5000, price: 50000 },
  point_100000: { points: 100000, bonus: 15000, price: 100000 },
};

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await request.json();
    const { productId, points, price } = body;

    // 상품 검증
    const product = pointProducts[productId];
    if (!product) {
      return NextResponse.json({ error: '유효하지 않은 상품입니다.' }, { status: 400 });
    }

    // 가격 검증
    if (product.price !== price) {
      return NextResponse.json({ error: '가격이 일치하지 않습니다.' }, { status: 400 });
    }

    const totalPoints = product.points + product.bonus;

    // Supabase 미설정시 데모 모드 (즉시 충전 성공)
    if (!supabaseAdmin) {
      return NextResponse.json({
        success: true,
        points: totalPoints,
        message: `${totalPoints.toLocaleString()}P가 충전되었습니다.`,
        demo: true,
      });
    }

    // 실제 결제 시스템 연동 시:
    // 여기에 TossPayments 또는 다른 결제 게이트웨이 연동 코드 추가
    // const paymentUrl = await createPaymentSession(userId, productId, price);
    // return NextResponse.json({ paymentUrl });

    // 현재는 데모 모드로 즉시 충전 처리
    // 트랜잭션으로 포인트 충전

    // 1. 현재 포인트 조회
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('points')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('User fetch error:', userError);
      return NextResponse.json({ error: '사용자 정보를 불러올 수 없습니다.' }, { status: 500 });
    }

    const currentPoints = user?.points || 0;
    const newBalance = currentPoints + totalPoints;

    // 2. 포인트 업데이트
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({ points: newBalance })
      .eq('id', userId);

    if (updateError) {
      console.error('Points update error:', updateError);
      return NextResponse.json({ error: '포인트 충전에 실패했습니다.' }, { status: 500 });
    }

    // 3. 히스토리 기록
    const { error: historyError } = await supabaseAdmin
      .from('point_history')
      .insert({
        user_id: userId,
        type: 'charge',
        amount: totalPoints,
        balance: newBalance,
        description: product.bonus > 0
          ? `${product.points.toLocaleString()}P 충전 (+${product.bonus.toLocaleString()}P 보너스)`
          : `${product.points.toLocaleString()}P 충전`,
        metadata: {
          product_id: productId,
          price: price,
          points: product.points,
          bonus: product.bonus,
        },
      });

    if (historyError) {
      console.error('History insert error:', historyError);
      // 히스토리 기록 실패해도 충전은 성공으로 처리
    }

    return NextResponse.json({
      success: true,
      points: newBalance,
      charged: totalPoints,
      message: `${totalPoints.toLocaleString()}P가 충전되었습니다.`,
    });
  } catch (error) {
    console.error('Charge API error:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
