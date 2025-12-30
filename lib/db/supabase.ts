import { createClient } from '@supabase/supabase-js';

// 브라우저용 클라이언트 (anon key)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 서버용 클라이언트 (service role key - 서버 사이드에서만 사용)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Database types (Supabase에서 생성된 타입과 연동)
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          phone: string | null;
          avatar_url: string | null;
          kakao_linked: boolean;
          kakao_id: string | null;
          kakao_phone: string | null;
          plan: 'free' | 'starter' | 'pro' | 'enterprise';
          plan_expires_at: string | null;
          notify_kakao: boolean;
          notify_email: boolean;
          notify_sms: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      pages: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          slug: string;
          topic: string;
          prompt: string | null;
          content: Record<string, unknown>;
          theme: string;
          custom_css: string | null;
          form_fields: Record<string, unknown>[];
          status: 'draft' | 'published' | 'archived';
          notify_kakao: boolean;
          notify_email: boolean;
          view_count: number;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['pages']['Row'], 'id' | 'created_at' | 'updated_at' | 'view_count'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
          view_count?: number;
        };
        Update: Partial<Database['public']['Tables']['pages']['Insert']>;
      };
      submissions: {
        Row: {
          id: string;
          page_id: string;
          data: Record<string, unknown>;
          status: 'new' | 'contacted' | 'done' | 'canceled';
          memo: string | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['submissions']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['submissions']['Insert']>;
      };
    };
  };
};
