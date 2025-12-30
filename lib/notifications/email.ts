// 이메일 발송 모듈 (Resend 사용)
import { Resend } from 'resend';

// 지연 초기화된 Resend 클라이언트
let resendClient: Resend | null = null;

function getResendClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

interface EmailNotificationParams {
  recipientEmail: string;
  pageName: string;
  submissionData: {
    name: string;
    phone: string;
    company?: string;
    message?: string;
  };
  submittedAt: Date;
}

interface EmailNotificationResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

// 날짜 포맷팅
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}`;
}

export async function sendEmailNotification(
  params: EmailNotificationParams
): Promise<EmailNotificationResponse> {
  const { recipientEmail, pageName, submissionData, submittedAt } = params;

  // 환경변수 체크 및 클라이언트 획득
  const resend = getResendClient();
  if (!resend) {
    console.log('[Email] RESEND_API_KEY not configured, skipping...');
    return { success: false, error: 'RESEND_API_KEY not configured' };
  }

  // 이메일 HTML 템플릿
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>새 신청 알림</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif; background-color: #f2f4f6;">
  <div style="max-width: 480px; margin: 0 auto; padding: 40px 20px;">
    <!-- 헤더 -->
    <div style="text-align: center; margin-bottom: 32px;">
      <span style="font-size: 48px;">🔔</span>
      <h1 style="font-size: 24px; font-weight: bold; color: #191f28; margin: 16px 0 8px;">
        새 신청이 들어왔어요!
      </h1>
      <p style="font-size: 14px; color: #8b95a1; margin: 0;">
        ${formatDate(submittedAt)}
      </p>
    </div>

    <!-- 메인 카드 -->
    <div style="background: white; border-radius: 16px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
      <!-- 페이지 정보 -->
      <div style="background: #e8f3ff; border-radius: 8px; padding: 12px 16px; margin-bottom: 24px;">
        <p style="font-size: 12px; color: #0064ff; margin: 0 0 4px; font-weight: 600;">
          📋 페이지
        </p>
        <p style="font-size: 16px; color: #191f28; margin: 0; font-weight: bold;">
          ${pageName}
        </p>
      </div>

      <!-- 신청자 정보 -->
      <div style="margin-bottom: 24px;">
        <h3 style="font-size: 14px; color: #8b95a1; margin: 0 0 16px; font-weight: 600;">
          신청자 정보
        </h3>

        <div style="margin-bottom: 12px;">
          <p style="font-size: 12px; color: #8b95a1; margin: 0 0 4px;">👤 이름</p>
          <p style="font-size: 16px; color: #191f28; margin: 0; font-weight: 500;">${submissionData.name}</p>
        </div>

        <div style="margin-bottom: 12px;">
          <p style="font-size: 12px; color: #8b95a1; margin: 0 0 4px;">📞 연락처</p>
          <p style="font-size: 16px; color: #191f28; margin: 0; font-weight: 500;">
            <a href="tel:${submissionData.phone}" style="color: #0064ff; text-decoration: none;">
              ${submissionData.phone}
            </a>
          </p>
        </div>

        ${submissionData.company ? `
        <div style="margin-bottom: 12px;">
          <p style="font-size: 12px; color: #8b95a1; margin: 0 0 4px;">🏢 소속</p>
          <p style="font-size: 16px; color: #191f28; margin: 0; font-weight: 500;">${submissionData.company}</p>
        </div>
        ` : ''}

        ${submissionData.message ? `
        <div style="margin-bottom: 12px;">
          <p style="font-size: 12px; color: #8b95a1; margin: 0 0 4px;">💬 문의사항</p>
          <p style="font-size: 16px; color: #191f28; margin: 0; font-weight: 500; white-space: pre-line;">${submissionData.message}</p>
        </div>
        ` : ''}
      </div>

      <!-- CTA 버튼 -->
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard"
         style="display: block; background: #0064ff; color: white; text-align: center; padding: 16px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 16px;">
        대시보드에서 확인하기
      </a>
    </div>

    <!-- 푸터 -->
    <div style="text-align: center; margin-top: 32px;">
      <p style="font-size: 12px; color: #8b95a1; margin: 0;">
        이 이메일은 랜딩AI에서 자동 발송되었습니다.
      </p>
    </div>
  </div>
</body>
</html>
  `;

  // 텍스트 버전
  const textContent = `
[랜딩AI] 새 신청이 들어왔어요!

📋 페이지: ${pageName}
⏰ 시간: ${formatDate(submittedAt)}

=== 신청자 정보 ===
👤 이름: ${submissionData.name}
📞 연락처: ${submissionData.phone}
${submissionData.company ? `🏢 소속: ${submissionData.company}` : ''}
${submissionData.message ? `💬 문의: ${submissionData.message}` : ''}

대시보드에서 확인하세요: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: '랜딩AI <noreply@landing.ai>',
      to: recipientEmail,
      subject: `[새 신청] ${pageName} - ${submissionData.name}님`,
      html: htmlContent,
      text: textContent,
    });

    if (error) {
      console.error('[Email] Resend error:', error);
      return { success: false, error: error.message };
    }

    console.log('[Email] Sent successfully:', data?.id);
    return {
      success: true,
      messageId: data?.id,
    };
  } catch (error) {
    console.error('[Email] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
