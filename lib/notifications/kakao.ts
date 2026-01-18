// 카카오 알림톡 발송 모듈
// 실제 운영 시 카카오 비즈메시지 API 연동 필요

interface KakaoAlimtalkParams {
  recipientPhone: string;
  pageName: string;
  submissionData: {
    name: string;
    phone: string;
    company?: string;
    message?: string;
  };
  submittedAt: Date;
}

interface KakaoAlimtalkResponse {
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
  return `${year}.${month}.${day} ${hours}:${minutes}`;
}

// 전화번호 포맷팅 (하이픈 제거)
function formatPhoneForKakao(phone: string): string {
  return phone.replace(/\D/g, '');
}

export async function sendKakaoAlimtalk(
  params: KakaoAlimtalkParams
): Promise<KakaoAlimtalkResponse> {
  const { recipientPhone, pageName, submissionData, submittedAt } = params;

  // 환경변수 체크
  const apiKey = process.env.KAKAO_ALIMTALK_API_KEY;
  const senderKey = process.env.KAKAO_ALIMTALK_SENDER_KEY;

  if (!apiKey || !senderKey) {
    console.log('[Kakao Alimtalk] API keys not configured, skipping...');
    return { success: false, error: 'API keys not configured' };
  }

  // 메시지 템플릿
  const message = `[랜딩메이커] 새 신청이 들어왔어요!

📋 ${pageName}

👤 이름: ${submissionData.name}
📞 연락처: ${submissionData.phone}
${submissionData.company ? `🏢 소속: ${submissionData.company}` : ''}
${submissionData.message ? `💬 문의: ${submissionData.message}` : ''}

⏰ ${formatDate(submittedAt)}

지금 바로 확인하세요!`;

  try {
    // 실제 카카오 알림톡 API 호출
    // const response = await fetch('https://api-alimtalk.kakao.com/v2/send', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${apiKey}`,
    //   },
    //   body: JSON.stringify({
    //     senderKey,
    //     templateCode: 'NEW_SUBMISSION',
    //     recipientNo: formatPhoneForKakao(recipientPhone),
    //     templateParameter: {
    //       pageName,
    //       name: submissionData.name,
    //       phone: submissionData.phone,
    //       company: submissionData.company || '-',
    //       message: submissionData.message || '-',
    //       time: formatDate(submittedAt),
    //     },
    //   }),
    // });
    //
    // const result = await response.json();
    // return {
    //   success: response.ok,
    //   messageId: result.messageId,
    //   error: result.error,
    // };

    // 개발 환경에서는 콘솔 로그만 출력
    console.log('[Kakao Alimtalk] Would send message to:', formatPhoneForKakao(recipientPhone));
    console.log('[Kakao Alimtalk] Message:', message);

    return {
      success: true,
      messageId: `kakao_${Date.now()}`,
    };
  } catch (error) {
    console.error('[Kakao Alimtalk] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// 알림톡 템플릿 등록 가이드
export const ALIMTALK_TEMPLATE_GUIDE = `
=== 카카오 알림톡 템플릿 등록 가이드 ===

1. 카카오 비즈니스 채널 생성
   - https://business.kakao.com/ 에서 채널 생성

2. 알림톡 발신 프로필 신청
   - 사업자 인증 필요

3. 템플릿 등록 (아래 내용으로)

   [템플릿명] NEW_SUBMISSION

   [템플릿 내용]
   [랜딩메이커] 새 신청이 들어왔어요!

   📋 #{pageName}

   👤 이름: #{name}
   📞 연락처: #{phone}
   🏢 소속: #{company}
   💬 문의: #{message}

   ⏰ #{time}

   지금 바로 확인하세요!

4. 환경변수 설정
   KAKAO_ALIMTALK_API_KEY=발급받은 API Key
   KAKAO_ALIMTALK_SENDER_KEY=발신 프로필 키
`;
