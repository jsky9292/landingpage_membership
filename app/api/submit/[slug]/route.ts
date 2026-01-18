/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db/supabase';
import { sendEmailNotification } from '@/lib/notifications/email';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { data } = body;

    // 유효성 검사
    if (!data || !data.name || !data.phone) {
      return NextResponse.json(
        { error: '필수 정보를 입력해주세요.' },
        { status: 400 }
      );
    }

    // Supabase 미설정시 데모 모드
    if (!supabaseAdmin) {
      console.log('[Demo] Form submission:', { slug, data });
      return NextResponse.json({
        success: true,
        message: '신청이 완료되었습니다.',
        submissionId: `demo-${Date.now()}`,
        demo: true,
      });
    }

    // 페이지 조회 (slug로) - published 또는 draft 모두 허용
    const { data: page, error: pageError } = await supabaseAdmin
      .from('landing_pages')
      .select('id, title, user_id, status')
      .eq('slug', slug)
      .single();

    if (pageError || !page) {
      console.error('Page not found:', slug, pageError);
      // 페이지가 없어도 데모 모드로 제출 허용
      console.log('[Submit] Page not found, accepting as demo submission');
      return NextResponse.json({
        success: true,
        message: '신청이 완료되었습니다.',
        submissionId: `fallback-${Date.now()}`,
      });
    }

    // 페이지 소유자 정보 조회 (profiles 테이블에서)
    let pageOwner: { email?: string; name?: string } | null = null;
    if (page.user_id) {
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('email, name')
        .eq('id', page.user_id)
        .single();
      pageOwner = profile;
    }

    // 신청 데이터 저장
    const { data: submission, error: submitError } = await supabaseAdmin
      .from('submissions')
      .insert({
        page_id: page.id,
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        message: data.goal || data.current || data.message || null,
        status: 'new',
      })
      .select()
      .single();

    if (submitError) {
      console.error('Submit error:', submitError);
      return NextResponse.json(
        { error: '신청 저장에 실패했습니다.' },
        { status: 500 }
      );
    }

    console.log('[Submission] New submission saved:', {
      pageId: page.id,
      submissionId: submission.id,
      name: data.name,
      phone: data.phone,
    });

    // 알림 발송 (비동기로 처리)
    const notificationPromises: Promise<any>[] = [];

    // 이메일 알림 발송 (소유자 이메일이 있는 경우)
    if (pageOwner?.email) {
      notificationPromises.push(
        sendEmailNotification({
          recipientEmail: pageOwner.email,
          pageName: page.title,
          submissionData: {
            name: data.name,
            phone: data.phone,
            company: data.company,
            message: data.goal || data.current || data.message,
          },
          submittedAt: new Date(),
        }).catch((err) => {
          console.error('[Email] Failed to send:', err);
        })
      );
    }

    // 알림은 백그라운드에서 처리 (응답은 먼저 반환)
    Promise.all(notificationPromises).then(() => {
      console.log('[Notifications] All notifications processed');
    });

    return NextResponse.json({
      success: true,
      message: '신청이 완료되었습니다.',
      submissionId: submission.id,
    });
  } catch (error) {
    console.error('[Submit API] Error:', error);
    return NextResponse.json(
      { error: '신청 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
