// 페이지 관련 타입 정의

export type TopicType =
  | 'course'        // 강의 모집
  | 'study'         // 스터디 모집
  | 'product'       // 상품 판매
  | 'consultation'  // 상담 예약
  | 'event'         // 이벤트/프로모션
  | 'job'           // 채용 공고
  | 'realestate'    // 부동산 분양
  | 'free';         // 자유 주제

export type SectionType =
  | 'hero'
  | 'pain'
  | 'solution'
  | 'benefits'
  | 'process'
  | 'philosophy'
  | 'video'
  | 'image'
  | 'calendar'
  | 'cta'
  | 'form'
  | 'timer'        // 카운트다운 타이머
  | 'inline-cta'   // 중간 CTA 버튼
  | 'inline-image' // 중간 이미지
  | 'inline-video' // 중간 유튜브 영상
  | 'divider';     // 구분선

export type PageStatus = 'draft' | 'published' | 'archived';

export type ThemeType = 'toss' | 'dark' | 'warm' | 'luxury' | 'peach';

// 섹션 콘텐츠 타입
export interface HeroContent {
  badge?: string;
  headline: string;
  subtext: string;
  cta: string;
}

export interface PainContent {
  label?: string;
  title: string;
  items: Array<{
    icon: string;
    text: string;
  }>;
}

export interface SolutionContent {
  label?: string;
  title: string;
  headline: string;
  description: string;
  items?: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

export interface BenefitsContent {
  label?: string;
  title: string;
  items: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

export interface ProcessContent {
  label?: string;
  title: string;
  steps: Array<{
    number: number;
    title: string;
    description: string;
  }>;
}

export interface PhilosophyContent {
  label?: string;
  title: string;
  items: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

export interface CTAContent {
  headline: string;
  subtext: string;
  buttonText: string;
}

export interface FormContent {
  title: string;
  subtitle?: string;
  note?: string;
  buttonText: string;
}

export interface VideoContent {
  label?: string;
  title?: string;
  videoUrl: string; // YouTube URL
  caption?: string;
}

export interface ImageContent {
  label?: string;
  title?: string;
  imageUrl: string; // 이미지 URL
  alt?: string;
  caption?: string;
}

// 스타일 옵션 (폰트 크기 등)
export interface SectionStyle {
  titleFontSize?: number; // px 단위
  textFontSize?: number;
  padding?: number;
}

export interface CalendarContent {
  label?: string;
  title: string;
  subtitle?: string;
  availableDays: string[]; // ['월', '화', '수', '목', '금']
  availableTimes: string[]; // ['10:00', '11:00', '14:00', '15:00']
  duration: number; // 분 단위 (30, 60, 90)
  note?: string;
}

// 카운트다운 타이머 콘텐츠
export interface TimerContent {
  title: string; // 예: "36% 런칭 할인 종료까지"
  endDate: string; // ISO 날짜 문자열
  backgroundColor?: string; // 배경색
  textColor?: string; // 텍스트 색상
  showDays?: boolean;
  showHours?: boolean;
  showMinutes?: boolean;
  showSeconds?: boolean;
  expiredMessage?: string; // 타이머 종료 후 메시지
}

// 중간 CTA 버튼 콘텐츠
export interface InlineCTAContent {
  buttonText: string;
  subtitle?: string; // 버튼 위 또는 아래 텍스트
  style?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

// 중간 이미지 콘텐츠
export interface InlineImageContent {
  imageUrl: string;
  alt?: string;
  caption?: string;
  size?: 'small' | 'medium' | 'large' | 'full';
  alignment?: 'left' | 'center' | 'right';
}

// 중간 유튜브 영상 콘텐츠
export interface InlineVideoContent {
  videoUrl: string; // YouTube URL
  title?: string;
  caption?: string;
  autoplay?: boolean;
  showControls?: boolean;
}

// 구분선 콘텐츠
export interface DividerContent {
  style?: 'line' | 'dots' | 'space';
  color?: string;
  thickness?: number;
  spacing?: number; // 상하 여백
}

export type SectionContent =
  | HeroContent
  | PainContent
  | SolutionContent
  | BenefitsContent
  | ProcessContent
  | PhilosophyContent
  | VideoContent
  | ImageContent
  | CalendarContent
  | CTAContent
  | FormContent
  | TimerContent
  | InlineCTAContent
  | InlineImageContent
  | InlineVideoContent
  | DividerContent;

export interface Section {
  id: string;
  type: SectionType;
  content: SectionContent;
  order: number;
  style?: SectionStyle; // 스타일 옵션
  emojiImage?: string; // 섹션에 표시할 이모지 이미지 URL
  sectionImage?: string; // 섹션에 표시할 일반 이미지 URL
}

// 폼 필드 타입
export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'tel' | 'email' | 'textarea' | 'select';
  placeholder?: string;
  required: boolean;
  options?: string[]; // select 타입일 때
}

// 페이지 전체 콘텐츠
export interface PageContent {
  sections: Section[];
  metadata?: {
    description?: string;
    keywords?: string[];
  };
}

// 연락처 정보
export interface ContactInfo {
  phoneNumber?: string;
  email?: string;
  kakaoId?: string;
  instagramId?: string;
  address?: string;
  businessName?: string;
  businessOwner?: string;
}

// CRM 설정 - 폼 제출 후 처리
export interface CRMSettings {
  // 제출 후 리다이렉트 설정
  redirectType?: 'none' | 'url' | 'kakao' | 'thankyou';
  redirectUrl?: string; // 커스텀 URL
  kakaoChannelUrl?: string; // 카카오톡 채널 URL

  // 고객에게 자동 발송
  autoSendEnabled?: boolean;
  autoSendType?: 'ebook' | 'link' | 'message';
  autoSendContent?: string; // 이북 다운로드 링크 또는 메시지
  autoSendTitle?: string; // 발송 제목

  // 알림톡 설정
  notifyKakaoEnabled?: boolean;
  notifyKakaoPhone?: string; // 알림 받을 휴대폰 번호
  notifyKakaoTemplate?: string; // 알림톡 템플릿 ID

  // 감사 페이지 설정
  thankYouTitle?: string;
  thankYouMessage?: string;
  thankYouButtonText?: string;
  thankYouButtonUrl?: string;
}

// 페이지 타입
export interface Page {
  id: string;
  userId: string;
  title: string;
  slug: string;
  topic: TopicType;
  prompt?: string;
  content: PageContent;
  theme: ThemeType;
  formFields: FormField[];
  contactInfo?: ContactInfo;
  crmSettings?: CRMSettings;
  status: PageStatus;
  notifyKakao: boolean;
  notifyEmail: boolean;
  viewCount: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// 페이지 생성 요청
export interface CreatePageRequest {
  title: string;
  topic: TopicType;
  prompt: string;
}


// 톤앤매너 스타일 타입
export interface ToneStyle {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  borderRadius: string;
}

// AI 생성 결과
export interface GeneratedPage {
  content: PageContent;
  theme: ThemeType;
  formFields: FormField[];
  title: string;
  toneStyle?: ToneStyle;
}
