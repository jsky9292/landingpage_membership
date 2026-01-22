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
  | 'timer'
  | 'inline-cta'
  | 'inline-image'
  | 'inline-video'
  | 'divider';

export type PageStatus = 'draft' | 'published' | 'archived';

export type ThemeType = 'toss' | 'dark' | 'warm' | 'luxury' | 'peach' | 'minimal' | 'corporate' | 'ocean' | 'forest' | 'sunset' | 'grape' | 'slate' | 'midnight' | 'neon';

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
  items?: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  // 후기/인용문 스타일 (items 대신 사용)
  quote?: string;
  author?: string;
  role?: string;
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

// 타이머 콘텐츠
export interface TimerContent {
  label?: string;
  title?: string;
  endDate: string; // ISO date string
  message?: string;
  backgroundColor?: string;
  textColor?: string;
  expiredMessage?: string;
  showDays?: boolean;
  showHours?: boolean;
  showMinutes?: boolean;
  showSeconds?: boolean;
}

// 인라인 CTA 콘텐츠
export interface InlineCTAContent {
  buttonText: string;
  subtext?: string;
  subtitle?: string;
  style?: 'solid' | 'outline' | 'ghost' | 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

// 인라인 이미지 콘텐츠
export interface InlineImageContent {
  imageUrl: string;
  alt?: string;
  caption?: string;
  size?: 'small' | 'medium' | 'large' | 'full';
  alignment?: 'left' | 'center' | 'right';
}

// 인라인 비디오 콘텐츠
export interface InlineVideoContent {
  videoUrl: string;
  caption?: string;
  title?: string;
  showControls?: boolean;
}

// 구분선 콘텐츠
export interface DividerContent {
  style?: 'line' | 'space' | 'dots';
  height?: number;
  color?: string;
  spacing?: number;
  thickness?: number;
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
  sectionVideo?: string; // 섹션에 표시할 영상 URL (유튜브/인스타)
  imageKeyword?: string; // AI 이미지 생성을 위한 키워드
}

// 연락처 정보 타입
export interface ContactInfo {
  name: string;
  phone: string;
  email?: string;
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
  status: PageStatus;
  notifyKakao: boolean;
  notifyEmail: boolean;
  viewCount: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  companyName?: string; // 업체명 (개인정보 동의서에 사용)
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
