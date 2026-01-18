import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db/supabase';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// 추천인 코드 생성 (8자리 영문숫자)
function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// 초기 지급 포인트
const INITIAL_POINTS = 1000;
const REFERRAL_BONUS = 1000;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, referralCode } = body;

    // 유효성 검사
    if (!email || !password) {
      return NextResponse.json(
        { error: '이메일과 비밀번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: '비밀번호는 6자 이상이어야 합니다.' },
        { status: 400 }
      );
    }

    // 이메일 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '올바른 이메일 형식이 아닙니다.' },
        { status: 400 }
      );
    }

    // Supabase 미설정시 데모 모드
    if (!supabaseAdmin) {
      // 데모 모드에서는 성공 응답만 반환
      return NextResponse.json({
        success: true,
        message: '회원가입이 완료되었습니다. (데모 모드)',
        user: {
          id: `demo-${Date.now()}`,
          email,
          name: name || email.split('@')[0],
          points: INITIAL_POINTS,
          referralCode: generateReferralCode(),
        },
      });
    }

    // 이메일 중복 확인
    const { data: existingUser } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: '이미 가입된 이메일입니다.' },
        { status: 409 }
      );
    }

    // 비밀번호 해시
    const passwordHash = await bcrypt.hash(password, 12);

    // 사용자 ID 생성
    const userId = uuidv4();
    const userReferralCode = generateReferralCode();

    // 추천인 확인 및 보상 처리
    let referredById: string | null = null;
    let bonusPoints = 0;

    if (referralCode) {
      const { data: referrer } = await supabaseAdmin
        .from('profiles')
        .select('id, points, referral_count')
        .eq('referral_code', referralCode.toUpperCase())
        .single();

      if (referrer) {
        referredById = referrer.id;
        bonusPoints = REFERRAL_BONUS;

        const newReferrerPoints = (referrer.points || 0) + REFERRAL_BONUS;

        // 추천인에게 보너스 포인트 지급
        await supabaseAdmin
          .from('profiles')
          .update({
            points: newReferrerPoints,
            referral_count: (referrer.referral_count || 0) + 1,
          })
          .eq('id', referrer.id);

        // 추천인 포인트 히스토리 기록
        await supabaseAdmin
          .from('point_history')
          .insert({
            user_id: referrer.id,
            type: 'referral',
            amount: REFERRAL_BONUS,
            balance: newReferrerPoints,
            description: `추천인 보너스 (${name || email.split('@')[0]}님 가입)`,
            metadata: { referred_user_email: email },
          });
      }
    }

    // 새 사용자 생성
    const { data: newUser, error: createError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: userId,
        email,
        name: name || email.split('@')[0],
        password_hash: passwordHash,
        plan: 'free',
        role: 'user',
        points: INITIAL_POINTS + bonusPoints,
        referral_code: userReferralCode,
        referred_by: referredById,
        referral_count: 0,
        kakao_linked: false,
        google_linked: false,
        notify_kakao: true,
        notify_email: true,
        notify_sms: false,
        email_verified: false,
      })
      .select()
      .single();

    if (createError) {
      console.error('Signup error:', createError);
      return NextResponse.json(
        { error: '회원가입 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    // 신규 가입 포인트 히스토리 기록
    const totalInitialPoints = INITIAL_POINTS + bonusPoints;
    await supabaseAdmin
      .from('point_history')
      .insert({
        user_id: userId,
        type: 'bonus',
        amount: totalInitialPoints,
        balance: totalInitialPoints,
        description: bonusPoints > 0
          ? `가입 축하 포인트 ${INITIAL_POINTS}P + 추천인 보너스 ${bonusPoints}P`
          : `가입 축하 포인트 ${INITIAL_POINTS}P`,
        metadata: { type: 'signup', referred_by: referredById },
      });

    return NextResponse.json({
      success: true,
      message: bonusPoints > 0
        ? `회원가입이 완료되었습니다! 추천인 보너스 ${bonusPoints}P가 지급되었습니다.`
        : '회원가입이 완료되었습니다!',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        points: newUser.points,
        referralCode: newUser.referral_code,
      },
    });
  } catch (error) {
    console.error('Signup API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
