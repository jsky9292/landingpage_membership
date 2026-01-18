import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { supabaseAdmin } from '@/lib/db/supabase';

// 서비스별 포인트 비용
const serviceCosts: Record<string, { points: number; description: string }> = {
  landing_page: { points: 1000, description: '랜딩페이지 생성' },
  image_generation: { points: 100, description: 'AI 이미지 생성' },
  page_publish: { points: 500, description: '페이지 게시' },
  thumbnail: { points: 200, description: '썸네일 생성' },
  card_news: { points: 500, description: '카드뉴스 생성' },
  video: { points: 1000, description: '영상 생성' },
};

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await request.json();
    const { serviceType, customPoints, customDescription } = body;

    // 서비스 또는 커스텀 포인트 검증
    let pointsToUse: number;
    let description: string;

    if (serviceType && serviceCosts[serviceType]) {
      pointsToUse = serviceCosts[serviceType].points;
      description = serviceCosts[serviceType].description;
    } else if (customPoints && customDescription) {
      pointsToUse = customPoints;
      description = customDescription;
    } else {
      return NextResponse.json({ error: '유효하지 않은 서비스입니다.' }, { status: 400 });
    }

    // Supabase 미설정시 데모 모드
    if (!supabaseAdmin) {
      return NextResponse.json({
        success: true,
        used: pointsToUse,
        remaining: 10400 - pointsToUse,
        message: `${pointsToUse.toLocaleString()}P가 사용되었습니다.`,
        demo: true,
      });
    }

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

    // 포인트 부족 확인
    if (currentPoints < pointsToUse) {
      return NextResponse.json({
        error: '포인트가 부족합니다.',
        required: pointsToUse,
        current: currentPoints,
        shortage: pointsToUse - currentPoints,
      }, { status: 400 });
    }

    const newBalance = currentPoints - pointsToUse;

    // 2. 포인트 차감
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({ points: newBalance })
      .eq('id', userId);

    if (updateError) {
      console.error('Points update error:', updateError);
      return NextResponse.json({ error: '포인트 사용에 실패했습니다.' }, { status: 500 });
    }

    // 3. 히스토리 기록
    const { error: historyError } = await supabaseAdmin
      .from('point_history')
      .insert({
        user_id: userId,
        type: 'use',
        amount: -pointsToUse,
        balance: newBalance,
        description: description,
        metadata: {
          service_type: serviceType || 'custom',
        },
      });

    if (historyError) {
      console.error('History insert error:', historyError);
    }

    return NextResponse.json({
      success: true,
      used: pointsToUse,
      remaining: newBalance,
      message: `${pointsToUse.toLocaleString()}P가 사용되었습니다.`,
    });
  } catch (error) {
    console.error('Use points API error:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 포인트 잔액 확인 (사용 전 체크용)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { searchParams } = new URL(request.url);
    const serviceType = searchParams.get('service');

    // 서비스 비용 조회
    const serviceCost = serviceType && serviceCosts[serviceType]
      ? serviceCosts[serviceType].points
      : 0;

    // Supabase 미설정시 데모 데이터
    if (!supabaseAdmin) {
      return NextResponse.json({
        points: 10400,
        serviceCost,
        canUse: 10400 >= serviceCost,
      });
    }

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('points')
      .eq('id', userId)
      .single();

    if (error) {
      return NextResponse.json({ error: '사용자 정보를 불러올 수 없습니다.' }, { status: 500 });
    }

    const points = user?.points || 0;

    return NextResponse.json({
      points,
      serviceCost,
      canUse: points >= serviceCost,
    });
  } catch (error) {
    console.error('Check points API error:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
