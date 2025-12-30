import { NextRequest, NextResponse } from 'next/server';
import { sendKakaoAlimtalk } from '@/lib/notifications/kakao';
import { sendEmailNotification } from '@/lib/notifications/email';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { data, pageId } = body;

    // 유효성 검사
    if (!data || !data.name || !data.phone) {
      return NextResponse.json(
        { error: '필수 정보를 입력해주세요.' },
        { status: 400 }
      );
    }

    // TODO: Supabase에서 페이지 정보 조회
    // const { data: page, error } = await supabaseAdmin
    //   .from('pages')
    //   .select('*, user:profiles(*)')
    //   .eq('slug', slug)
    //   .single();

    // 임시 페이지 정보
    const page = {
      id: pageId || 'demo',
      title: '데모 페이지',
      user: {
        email: 'test@example.com',
        phone: '010-1234-5678',
        kakao_linked: true,
        notify_kakao: true,
        notify_email: true,
      },
    };

    // TODO: Supabase에 신청 데이터 저장
    // const { data: submission, error: submitError } = await supabaseAdmin
    //   .from('submissions')
    //   .insert({
    //     page_id: page.id,
    //     data,
    //     status: 'new',
    //     ip_address: request.ip,
    //     user_agent: request.headers.get('user-agent'),
    //   })
    //   .select()
    //   .single();

    const submission = {
      id: `sub_${Date.now()}`,
      page_id: page.id,
      data,
      created_at: new Date().toISOString(),
    };

    console.log('[Submission] New submission received:', {
      pageId: page.id,
      submissionId: submission.id,
      name: data.name,
      phone: data.phone,
    });

    // 알림 발송 (비동기로 처리)
    const notificationPromises: Promise<any>[] = [];

    // 카카오 알림톡 발송
    if (page.user.notify_kakao && page.user.kakao_linked) {
      notificationPromises.push(
        sendKakaoAlimtalk({
          recipientPhone: page.user.phone,
          pageName: page.title,
          submissionData: {
            name: data.name,
            phone: data.phone,
            company: data.company,
            message: data.message,
          },
          submittedAt: new Date(),
        }).catch((err) => {
          console.error('[Kakao Alimtalk] Failed to send:', err);
        })
      );
    }

    // 이메일 알림 발송
    if (page.user.notify_email && page.user.email) {
      notificationPromises.push(
        sendEmailNotification({
          recipientEmail: page.user.email,
          pageName: page.title,
          submissionData: {
            name: data.name,
            phone: data.phone,
            company: data.company,
            message: data.message,
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
