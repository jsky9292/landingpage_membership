export type UserRole = 'user' | 'admin';
export type PageStatus = 'draft' | 'published' | 'archived';
export type SubmissionStatus = 'new' | 'contacted' | 'converted' | 'rejected';

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          avatar_url: string | null;
          role: UserRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          updated_at?: string;
        };
      };
      landing_pages: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          slug: string;
          topic: string;
          content: LandingPageContent;
          status: PageStatus;
          view_count: number;
          created_at: string;
          updated_at: string;
          published_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          slug: string;
          topic: string;
          content: LandingPageContent;
          status?: PageStatus;
          view_count?: number;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
        Update: {
          title?: string;
          slug?: string;
          topic?: string;
          content?: LandingPageContent;
          status?: PageStatus;
          view_count?: number;
          updated_at?: string;
          published_at?: string | null;
        };
      };
      submissions: {
        Row: {
          id: string;
          page_id: string;
          name: string;
          phone: string;
          email: string | null;
          message: string | null;
          status: SubmissionStatus;
          memo: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          page_id: string;
          name: string;
          phone: string;
          email?: string | null;
          message?: string | null;
          status?: SubmissionStatus;
          memo?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          phone?: string;
          email?: string | null;
          message?: string | null;
          status?: SubmissionStatus;
          memo?: string | null;
          updated_at?: string;
        };
      };
    };
  };
}

// 랜딩페이지 콘텐츠 구조
export interface LandingPageContent {
  hero: {
    headline: string;
    subheadline: string;
    cta: string;
  };
  problem: {
    title: string;
    items: string[];
  };
  solution: {
    title: string;
    items: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
  benefits: {
    title: string;
    items: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
  testimonials: {
    title: string;
    items: Array<{
      name: string;
      role: string;
      content: string;
      rating: number;
    }>;
  };
  faq: {
    title: string;
    items: Array<{
      question: string;
      answer: string;
    }>;
  };
  cta: {
    title: string;
    description: string;
    buttonText: string;
  };
  form: {
    title: string;
    description: string;
    fields: Array<{
      name: string;
      label: string;
      type: string;
      required: boolean;
      placeholder?: string;
    }>;
    submitText: string;
  };
  theme?: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

// 대시보드 통계 타입
export interface DashboardStats {
  totalPages: number;
  totalSubmissions: number;
  newSubmissions: number;
  conversionRate: number;
}

// 페이지 목록 아이템 타입
export interface PageListItem {
  id: string;
  title: string;
  slug: string;
  status: PageStatus;
  viewCount: number;
  submissionCount: number;
  newSubmissionCount: number;
  createdAt: string;
  userName?: string; // 관리자용
}
