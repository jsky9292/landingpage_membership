/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db/supabase';

// 알림톡 발송 함수 (추후 실제 API 연동)
async function sendKakaoAlimtalk(phone: string, templateId: string, variables: Record<string, string>) {
  // TODO: 실제 카카오톡 알림톡 API 연동
  // 카카오 비즈니스 API 또는 솔라피 등의 서비스 연동 필요
  console.log('[알림톡] 발송 예정:', { phone, templateId, variables });
  return { success: true };
}

// 자동 발송 처리 함수
async function handleAutoSend(
  submission: any,
  crmSettings: any,
  pageTitle: string
) {
  if (!crmSettings?.autoSendEnabled) return;

  const { autoSendType, autoSendContent, autoSendTitle } = crmSettings;

  if (autoSendType === 'ebook' && autoSendContent) {
    // 이북 다운로드 링크 발송
    await sendKakaoAlimtalk(submission.phone, 'EBOOK_SEND', {
      name: submission.name,
      title: autoSendTitle || pageTitle,
      link: autoSendContent,
    });
  } else if (autoSendType === 'link' && autoSendContent) {
    // 링크 발송
    await sendKakaoAlimtalk(submission.phone, 'LINK_SEND', {
      name: submission.name,
      title: autoSendTitle || pageTitle,
      link: autoSendContent,
    });
  } else if (autoSendType === 'message' && autoSendContent) {
    // 메시지 발송
    await sendKakaoAlimtalk(submission.phone, 'MESSAGE_SEND', {
      name: submission.name,
      message: autoSendContent,
    });
  }
}

// 사용자에게 신청 알림 발송
async function sendOwnerNotification(
  ownerPhone: string,
  submission: any,
  pageTitle: string,
  templateId?: string
) {
  await sendKakaoAlimtalk(ownerPhone, templateId || 'NEW_SUBMISSION', {
    pageTitle,
    customerName: submission.name,
    customerPhone: submission.phone,
    message: submission.message || '(메시지 없음)',
  });
}

// 랜딩페이지 폼 제출 (공개 API)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pageId, name, phone, email, message, ...customFields } = body;

    if (!pageId || !name || !phone) {
      return NextResponse.json(
        { error: '필수 정보를 입력해주세요.' },
        { status: 400 }
      );
    }

    // Supabase 미설정시 데모 모드
    if (!supabaseAdmin) {
      console.log('[Demo] Form submission:', { pageId, name, phone });
      return NextResponse.json({
        success: true,
        message: '신청이 완료되었습니다!',
        submissionId: `demo-${Date.now()}`,
        redirect: {
          type: 'thankyou',
          thankYou: {
            title: '신청이 완료되었습니다!',
            message: '빠른 시일 내에 연락드리겠습니다.',
          },
        },
        demo: true,
      });
    }

    // 페이지 및 CRM 설정 조회
    const { data: page, error: pageError } = await supabaseAdmin
      .from('landing_pages')
      .select('id, title, status, user_id, crm_settings')
      .eq('id', pageId)
      .eq('status', 'published')
      .single();

    if (pageError || !page) {
      return NextResponse.json(
        { error: '페이지를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 신청 데이터 저장
    const { data: submission, error: submitError } = await supabaseAdmin
      .from('submissions')
      .insert({
        page_id: pageId,
        name,
        phone,
        email: email || null,
        message: message || null,
        custom_data: Object.keys(customFields).length > 0 ? customFields : null,
        status: 'new',
      })
      .select()
      .single();

    if (submitError) {
      console.error('Submit error:', submitError);
      return NextResponse.json(
        { error: '신청 처리 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    const crmSettings = page.crm_settings || {};

    // 고객에게 자동 발송 처리
    try {
      await handleAutoSend(submission, crmSettings, page.title);
    } catch (err) {
      console.error('Auto send error:', err);
      // 자동 발송 실패해도 신청은 성공으로 처리
    }

    // 페이지 소유자에게 알림톡 발송
    if (crmSettings.notifyKakaoEnabled && crmSettings.notifyKakaoPhone) {
      try {
        await sendOwnerNotification(
          crmSettings.notifyKakaoPhone,
          submission,
          page.title,
          crmSettings.notifyKakaoTemplate
        );
      } catch (err) {
        console.error('Owner notification error:', err);
        // 알림 발송 실패해도 신청은 성공으로 처리
      }
    }

    // CRM 설정에 따른 리다이렉트 정보 반환
    const redirectInfo: any = {
      type: crmSettings.redirectType || 'thankyou',
    };

    switch (crmSettings.redirectType) {
      case 'url':
        redirectInfo.url = crmSettings.redirectUrl;
        break;
      case 'kakao':
        redirectInfo.url = crmSettings.kakaoChannelUrl;
        break;
      case 'thankyou':
      default:
        redirectInfo.thankYou = {
          title: crmSettings.thankYouTitle || '신청이 완료되었습니다!',
          message: crmSettings.thankYouMessage || '빠른 시일 내에 연락드리겠습니다.',
          buttonText: crmSettings.thankYouButtonText,
          buttonUrl: crmSettings.thankYouButtonUrl,
        };
        break;
    }

    return NextResponse.json({
      success: true,
      message: '신청이 완료되었습니다!',
      submissionId: submission.id,
      redirect: redirectInfo,
      // 고객에게 자동 발송된 경우 알림
      autoSent: crmSettings.autoSendEnabled
        ? {
            type: crmSettings.autoSendType,
            title: crmSettings.autoSendTitle,
          }
        : null,
    });
  } catch (error) {
    console.error('Form submit error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
