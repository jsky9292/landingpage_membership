import { getServerSession } from 'next-auth';
import { createServerClient } from '@/lib/supabase/client';

interface UserApiSettings {
  useOwnKey: boolean;
  geminiApiKey: string;
  claudeApiKey: string;
  imageModel: string;
  textModel: string;
}

/**
 * 현재 로그인한 사용자의 API 설정을 가져옵니다.
 * 서버 사이드에서만 사용해야 합니다.
 */
export async function getUserApiSettings(): Promise<UserApiSettings | null> {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createServerClient() as any;
    const { data: user, error } = await supabase
      .from('users')
      .select('api_settings')
      .eq('email', session.user.email)
      .single();

    if (error || !user) {
      return null;
    }

    return user.api_settings || null;
  } catch (error) {
    console.error('Failed to get user API settings:', error);
    return null;
  }
}

/**
 * AI 생성에 사용할 Gemini API 키를 가져옵니다.
 * 사용자 키가 있으면 사용자 키를, 없으면 시스템 키를 반환합니다.
 */
export async function getGeminiApiKey(): Promise<string> {
  const settings = await getUserApiSettings();

  if (settings?.useOwnKey && settings?.geminiApiKey) {
    return settings.geminiApiKey;
  }

  return process.env.GOOGLE_AI_API_KEY || '';
}

/**
 * AI 생성에 사용할 Claude API 키를 가져옵니다.
 * 사용자 키가 있으면 사용자 키를, 없으면 시스템 키를 반환합니다.
 */
export async function getClaudeApiKey(): Promise<string> {
  const settings = await getUserApiSettings();

  if (settings?.useOwnKey && settings?.claudeApiKey) {
    return settings.claudeApiKey;
  }

  return process.env.ANTHROPIC_API_KEY || '';
}
