import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db/supabase';

// 메모리 저장소 (Supabase 연결 안됐을 때 사용)
const newsletterEmails: string[] = [];

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: '유효한 이메일을 입력해주세요.' },
        { status: 400 }
      );
    }

    // Supabase에 저장 시도
    try {
      const { error } = await supabaseAdmin
        .from('newsletter_subscribers')
        .insert({ email, subscribed_at: new Date().toISOString() });

      if (error) {
        // 중복 이메일
        if (error.code === '23505') {
          return NextResponse.json(
            { success: true, message: '이미 구독 중인 이메일입니다.' }
          );
        }
        throw error;
      }
    } catch {
      // Supabase 연결 안됨 - 메모리에 저장
      if (!newsletterEmails.includes(email)) {
        newsletterEmails.push(email);
      }
      console.log('[Newsletter] Saved to memory:', email);
    }

    return NextResponse.json({
      success: true,
      message: '구독 신청이 완료되었습니다!',
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: '구독 신청 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // 구독자 수 반환 (간단한 통계용)
  try {
    const { count } = await supabaseAdmin
      .from('newsletter_subscribers')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({ count: count || newsletterEmails.length });
  } catch {
    return NextResponse.json({ count: newsletterEmails.length });
  }
}
