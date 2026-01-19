import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const isValidUrl = supabaseUrl && supabaseUrl.length > 10 && !supabaseUrl.includes('your-project');
const isValidAnonKey = supabaseAnonKey && supabaseAnonKey.length > 10;
const isValidServiceKey = serviceRoleKey && serviceRoleKey.length > 10;

// 클라이언트용 Supabase 인스턴스
export const supabase: SupabaseClient<Database> | null = isValidUrl && isValidAnonKey
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : null;

// 서버용 Supabase 인스턴스 (Service Role)
export function createServerClient(): SupabaseClient<Database> | null {
  if (!isValidUrl || !isValidServiceKey) {
    return null;
  }
  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
