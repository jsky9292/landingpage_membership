// 개인정보 동의 관련 설정
// {companyName}은 각 랜딩페이지에서 업체명으로 치환됩니다.

export interface ConsentItem {
  id: string;
  label: string;
  required: boolean;
  content: string;
}

export interface ConsentConfig {
  companyName: string;
  items: ConsentItem[];
}

// 기본 동의 항목
export const DEFAULT_CONSENT_ITEMS: ConsentItem[] = [
  {
    id: 'privacy',
    label: '개인정보 수집 및 이용 동의',
    required: true,
    content: `[개인정보 수집 및 이용 동의]

1. 수집하는 개인정보 항목
- 필수항목: 이름, 연락처(휴대폰번호)
- 선택항목: 이메일, 문의내용

2. 개인정보의 수집 및 이용목적
- 상담 및 문의에 대한 답변
- 서비스 제공 및 계약 이행
- 고객 관리 및 마케팅에 활용

3. 개인정보의 보유 및 이용기간
- 수집일로부터 3년간 보유 후 즉시 파기
- 단, 관련 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관

4. 동의 거부권 및 불이익
- 귀하는 개인정보 수집 및 이용에 동의하지 않을 권리가 있습니다.
- 다만, 필수 항목에 대한 동의를 거부할 경우 상담 서비스 이용이 제한될 수 있습니다.`,
  },
  {
    id: 'thirdParty',
    label: '개인정보 제3자 제공 동의',
    required: false,
    content: `[개인정보 제3자 제공 동의]

1. 개인정보를 제공받는 자
- {companyName} 및 관련 제휴사

2. 제공하는 개인정보 항목
- 이름, 연락처(휴대폰번호), 이메일, 문의내용

3. 제공받는 자의 이용목적
- 상담 서비스 제공
- 서비스 품질 향상을 위한 분석

4. 제공받는 자의 보유 및 이용기간
- 제공 동의일로부터 1년간 보유 후 파기

5. 동의 거부권 및 불이익
- 귀하는 개인정보 제3자 제공에 동의하지 않을 권리가 있습니다.
- 동의를 거부하더라도 기본 서비스 이용에는 제한이 없습니다.`,
  },
  {
    id: 'marketing',
    label: '마케팅 정보 수신 동의',
    required: false,
    content: `[마케팅 정보 수신 동의]

1. 마케팅 정보 수신 목적
- 신규 서비스 및 이벤트 안내
- 맞춤형 서비스 제공을 위한 정보 제공
- 프로모션 및 할인 혜택 안내

2. 마케팅 정보 수신 방법
- SMS, 카카오톡, 이메일 등

3. 마케팅 정보 수신 동의 기간
- 동의일로부터 회원 탈퇴 시 또는 동의 철회 시까지

4. 동의 거부권 및 불이익
- 귀하는 마케팅 정보 수신에 동의하지 않을 권리가 있습니다.
- 동의를 거부하더라도 기본 서비스 이용에는 제한이 없습니다.
- 동의 후에도 언제든지 수신 거부를 요청할 수 있습니다.`,
  },
];

// 업체명을 대체하여 동의 내용 생성
export function getConsentContent(content: string, companyName: string): string {
  return content.replace(/{companyName}/g, companyName || '본 업체');
}

// 기본 동의 설정
export const DEFAULT_CONSENT_CONFIG: ConsentConfig = {
  companyName: '',
  items: DEFAULT_CONSENT_ITEMS,
};
