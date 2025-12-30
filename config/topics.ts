// 8가지 주제 설정

import { TopicType, SectionType, FormField } from '@/types/page';

export interface TopicConfig {
  id: TopicType;
  name: string;
  icon: string;
  description: string;
  guide: string;
  examplePrompt: string;
  defaultSections: SectionType[];
  defaultFormFields: FormField[];
}

export const TOPICS: Record<TopicType, TopicConfig> = {
  course: {
    id: 'course',
    name: '강의 모집',
    icon: '📚',
    description: '온라인/오프라인 강의 수강생을 모집하세요',
    guide: `다음 정보를 포함해주세요:
- 어떤 강의인가요? (주제, 커리큘럼)
- 누구를 위한 강의인가요? (타겟 대상)
- 강사는 누구인가요? (경력, 자격)
- 수강 후 무엇이 달라지나요? (기대 효과)
- 수강료와 일정은 어떻게 되나요?`,
    examplePrompt: `보험설계사 대상 DB 마케팅 강의 모집합니다.

대상: 보험설계사 3-5년차
내용: 고객 DB를 활용한 마케팅 전략, AI 도구 활용법
강사: 전천우 대표 (10년차 보험영업 전문가)
일정: 매주 토요일 오전 10시, 총 8주 과정
수강료: 월 19만원

혼자서 DB 마케팅이 어려웠던 분들, 함께 성장하실 분들 모집합니다.`,
    defaultSections: ['hero', 'pain', 'solution', 'benefits', 'process', 'philosophy', 'cta', 'form'],
    defaultFormFields: [
      { id: 'name', label: '이름', type: 'text', placeholder: '실명을 입력해주세요', required: true },
      { id: 'phone', label: '연락처', type: 'tel', placeholder: '010-0000-0000', required: true },
      { id: 'company', label: '소속', type: 'text', placeholder: '회사/소속명', required: false },
      { id: 'message', label: '문의사항', type: 'textarea', placeholder: '궁금한 점이 있으시면 남겨주세요', required: false },
    ],
  },
  study: {
    id: 'study',
    name: '스터디 모집',
    icon: '👥',
    description: '함께 공부할 스터디원을 모집하세요',
    guide: `다음 정보를 포함해주세요:
- 어떤 스터디인가요? (주제, 목표)
- 누구를 위한 스터디인가요? (타겟 대상)
- 진행 방식은 어떻게 되나요? (온라인/오프라인, 빈도)
- 참여하면 무엇을 얻나요? (혜택)
- 비용이나 기간은 어떻게 되나요?`,
    examplePrompt: `DB 마케팅 실행 스터디 모집합니다.

대상: 보험설계사 중 DB 마케팅에 관심있는 분
내용: 매달 DB 마케팅 미션 실행, 결과 공유, 피드백
진행: 오프라인 월 1회, 줌 월 2회
혜택: 15개 AI 자동화 툴 무료 제공
비용: 월 19만원 (언제든 취소 가능)

혼자 하면 안 되는데, 뭘 해야 할지 모르는 분들 환영합니다.`,
    defaultSections: ['hero', 'pain', 'solution', 'benefits', 'process', 'philosophy', 'cta', 'form'],
    defaultFormFields: [
      { id: 'name', label: '이름', type: 'text', placeholder: '실명을 입력해주세요', required: true },
      { id: 'phone', label: '연락처', type: 'tel', placeholder: '010-0000-0000', required: true },
      { id: 'company', label: '소속', type: 'text', placeholder: '회사/소속명', required: false },
      { id: 'message', label: '참여 동기', type: 'textarea', placeholder: '스터디에 참여하고 싶은 이유를 알려주세요', required: false },
    ],
  },
  product: {
    id: 'product',
    name: '상품 판매',
    icon: '🛒',
    description: '상품이나 서비스를 판매하세요',
    guide: `다음 정보를 포함해주세요:
- 어떤 상품/서비스인가요? (특징, 구성)
- 누구에게 필요한가요? (타겟 고객)
- 왜 이 상품을 선택해야 하나요? (차별점)
- 가격과 구성은 어떻게 되나요?
- 구매 혜택이나 보장은 있나요?`,
    examplePrompt: `AI 마케팅 자동화 툴킷 판매합니다.

상품: 15개 AI 자동화 도구 패키지
대상: 1인 사업자, 소상공인, 프리랜서
특징: 코딩 없이 바로 사용 가능, 평생 업데이트 제공
가격: 정가 50만원 → 오픈 특가 29만원
보장: 7일 무조건 환불 보장`,
    defaultSections: ['hero', 'pain', 'solution', 'benefits', 'cta', 'form'],
    defaultFormFields: [
      { id: 'name', label: '이름', type: 'text', placeholder: '실명을 입력해주세요', required: true },
      { id: 'phone', label: '연락처', type: 'tel', placeholder: '010-0000-0000', required: true },
      { id: 'email', label: '이메일', type: 'email', placeholder: 'example@email.com', required: true },
    ],
  },
  consultation: {
    id: 'consultation',
    name: '상담 예약',
    icon: '📞',
    description: '상담 예약을 받으세요',
    guide: `다음 정보를 포함해주세요:
- 어떤 상담인가요? (주제, 분야)
- 누구를 위한 상담인가요? (대상)
- 상담으로 무엇을 해결할 수 있나요?
- 상담 방식과 소요 시간은?
- 비용이 있나요?`,
    examplePrompt: `무료 보험 리모델링 상담 예약받습니다.

상담 내용: 현재 보험 분석, 최적의 보험 설계 제안
대상: 보험료 절감하고 싶은 분, 보장 확대하고 싶은 분
방식: 전화 상담 20분 또는 대면 상담 40분
비용: 무료 (강제 가입 절대 없음)

10년차 전문가가 객관적으로 분석해드립니다.`,
    defaultSections: ['hero', 'pain', 'solution', 'benefits', 'cta', 'form'],
    defaultFormFields: [
      { id: 'name', label: '이름', type: 'text', placeholder: '실명을 입력해주세요', required: true },
      { id: 'phone', label: '연락처', type: 'tel', placeholder: '010-0000-0000', required: true },
      { id: 'preferredTime', label: '희망 시간', type: 'text', placeholder: '예: 평일 오후 2-5시', required: false },
      { id: 'message', label: '상담 내용', type: 'textarea', placeholder: '상담받고 싶은 내용을 간단히 적어주세요', required: false },
    ],
  },
  event: {
    id: 'event',
    name: '이벤트/프로모션',
    icon: '🎉',
    description: '이벤트나 프로모션 참여를 유도하세요',
    guide: `다음 정보를 포함해주세요:
- 어떤 이벤트/프로모션인가요?
- 참여하면 무엇을 받나요? (혜택)
- 참여 조건이 있나요?
- 기간은 언제까지인가요?
- 당첨자 발표나 결과는 어떻게 되나요?`,
    examplePrompt: `오픈 기념 100명 한정 이벤트!

이벤트: 신규 가입자 100명에게 AI 툴킷 무료 증정
혜택: 30만원 상당의 AI 마케팅 툴 15종 무료
조건: 이벤트 페이지에서 신청만 하면 끝
기간: 선착순 100명 마감 시 종료
발표: 신청 즉시 이메일로 전달`,
    defaultSections: ['hero', 'benefits', 'cta', 'form'],
    defaultFormFields: [
      { id: 'name', label: '이름', type: 'text', placeholder: '실명을 입력해주세요', required: true },
      { id: 'phone', label: '연락처', type: 'tel', placeholder: '010-0000-0000', required: true },
      { id: 'email', label: '이메일', type: 'email', placeholder: 'example@email.com', required: true },
    ],
  },
  job: {
    id: 'job',
    name: '채용 공고',
    icon: '💼',
    description: '인재를 채용하세요',
    guide: `다음 정보를 포함해주세요:
- 어떤 포지션인가요? (직무, 역할)
- 어떤 회사인가요? (회사 소개)
- 어떤 분을 찾나요? (자격 요건)
- 어떤 혜택이 있나요? (복지, 급여)
- 지원 방법과 절차는?`,
    examplePrompt: `AI 마케팅 스타트업에서 마케터를 모집합니다.

포지션: 콘텐츠 마케터 (정규직)
회사: AI 마케팅 솔루션 스타트업 (Series A)
자격: 마케팅 경력 2년 이상, SNS 마케팅 경험자
복지: 유연근무, 점심 제공, 교육비 지원
급여: 4000-5500만원 (협의)`,
    defaultSections: ['hero', 'solution', 'benefits', 'process', 'cta', 'form'],
    defaultFormFields: [
      { id: 'name', label: '이름', type: 'text', placeholder: '실명을 입력해주세요', required: true },
      { id: 'phone', label: '연락처', type: 'tel', placeholder: '010-0000-0000', required: true },
      { id: 'email', label: '이메일', type: 'email', placeholder: 'example@email.com', required: true },
      { id: 'portfolio', label: '포트폴리오 링크', type: 'text', placeholder: 'https://...', required: false },
    ],
  },
  realestate: {
    id: 'realestate',
    name: '부동산 분양',
    icon: '🏠',
    description: '부동산 분양 상담을 받으세요',
    guide: `다음 정보를 포함해주세요:
- 어떤 매물인가요? (위치, 유형)
- 어떤 특징이 있나요? (교통, 환경, 시설)
- 분양가와 조건은?
- 입주 일정은?
- 상담 방법은?`,
    examplePrompt: `강남역 5분거리 신축 오피스텔 분양

위치: 서울 강남구 역삼동, 강남역 도보 5분
유형: 1-2룸 오피스텔 (전용 23-42㎡)
특징: 역세권, 풀옵션, 코워킹스페이스 제공
분양가: 3.5억 ~ 6억 (중도금 무이자)
입주: 2025년 12월 예정`,
    defaultSections: ['hero', 'benefits', 'process', 'cta', 'form'],
    defaultFormFields: [
      { id: 'name', label: '이름', type: 'text', placeholder: '실명을 입력해주세요', required: true },
      { id: 'phone', label: '연락처', type: 'tel', placeholder: '010-0000-0000', required: true },
      { id: 'preferredTime', label: '상담 희망 시간', type: 'text', placeholder: '예: 평일 오후', required: false },
    ],
  },
  free: {
    id: 'free',
    name: '자유 주제',
    icon: '✨',
    description: '원하는 주제로 자유롭게 만드세요',
    guide: `다음 정보를 포함해주세요:
- 무엇을 홍보하고 싶나요?
- 누구를 대상으로 하나요?
- 어떤 행동을 유도하고 싶나요? (신청, 구매, 문의 등)
- 강조하고 싶은 혜택이나 특징은?
- 긴급성이나 한정 조건이 있나요?`,
    examplePrompt: `자유롭게 입력해주세요.

예시: 개인 브랜딩 코칭, 동네 맛집 홍보, 취미 모임 모집,
크라우드펀딩 홍보, 앱 출시 안내 등 무엇이든 가능합니다.`,
    defaultSections: ['hero', 'pain', 'solution', 'benefits', 'cta', 'form'],
    defaultFormFields: [
      { id: 'name', label: '이름', type: 'text', placeholder: '실명을 입력해주세요', required: true },
      { id: 'phone', label: '연락처', type: 'tel', placeholder: '010-0000-0000', required: true },
      { id: 'message', label: '문의사항', type: 'textarea', placeholder: '문의사항을 남겨주세요', required: false },
    ],
  },
};

// 주제 목록 (순서대로)
export const TOPIC_LIST = Object.values(TOPICS);
