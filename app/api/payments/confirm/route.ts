import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { supabaseAdmin } from '@/lib/db/supabase';

const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY!;

// 플랜별 정보
const PLANS = {
  starter: {
    price: 29000,
    maxPages: 3,
    name: 'Starter',
  },
  pro: {
    price: 59000,
    maxPages: 10,
    name: 'Pro',
  },
};

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const { paymentKey, orderId, amount } = await req.json();

    // 토스페이먼츠 결제 승인 요청
    const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(TOSS_SECRET_KEY + ':').toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount,
      }),
    });

    const paymentResult = await response.json();

    if (!response.ok) {
      console.error('[Payment] Toss confirm error:', paymentResult);
      return NextResponse.json({
        error: paymentResult.message || '결제 승인에 실패했습니다.'
      }, { status: 400 });
    }

    // orderId에서 플랜 정보 추출 (형식: plan_starter_timestamp)
    const planType = orderId.split('_')[1] as keyof typeof PLANS;
    const plan = PLANS[planType];

    if (!plan) {
      return NextResponse.json({ error: '유효하지 않은 플랜입니다.' }, { status: 400 });
    }

    // 금액 검증
    if (amount !== plan.price) {
      return NextResponse.json({ error: '결제 금액이 일치하지 않습니다.' }, { status: 400 });
    }

    // 플랜 만료일 계산 (30일 후)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Supabase 미설정시 결제 성공만 반환
    if (!supabaseAdmin) {
      console.log('[Payment Demo] Plan update skipped (no Supabase)');
      return NextResponse.json({
        success: true,
        plan: planType,
        expiresAt: expiresAt.toISOString(),
        demo: true,
      });
    }

    // Supabase에 결제 정보 및 플랜 업데이트
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        plan: planType,
        plan_expires_at: expiresAt.toISOString(),
      })
      .eq('email', session.user.email);

    if (updateError) {
      console.error('[Payment] Supabase update error:', updateError);
      // 결제는 성공했으므로 로그만 남기고 성공 반환
    }

    // 결제 내역 저장 (payments 테이블이 있다면)
    try {
      await supabaseAdmin.from('payments').insert({
        user_email: session.user.email,
        payment_key: paymentKey,
        order_id: orderId,
        amount: amount,
        plan: planType,
        status: 'completed',
      });
    } catch (e) {
      // payments 테이블이 없을 수 있음
      console.log('[Payment] Payment history not saved (table may not exist)');
    }

    return NextResponse.json({
      success: true,
      plan: planType,
      expiresAt: expiresAt.toISOString(),
    });

  } catch (error) {
    console.error('[Payment] Error:', error);
    return NextResponse.json({ error: '결제 처리 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
