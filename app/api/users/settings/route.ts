import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { supabaseAdmin } from '@/lib/db/supabase';

// 기본 CRM 설정
const DEFAULT_CRM_SETTINGS = {
  redirectType: 'thankyou',
  redirectUrl: '',
  kakaoChannelUrl: '',
  autoSendEnabled: false,
  autoSendType: 'ebook',
  autoSendContent: '',
  autoSendTitle: '',
  notifyKakaoEnabled: false,
  notifyKakaoPhone: '',
  thankYouTitle: '신청이 완료되었습니다!',
  thankYouMessage: '빠른 시일 내에 연락드리겠습니다.',
  thankYouButtonText: '',
  thankYouButtonUrl: '',
};

// 기본 API 설정
const DEFAULT_API_SETTINGS = {
  useOwnKey: false,
  geminiApiKey: '',
  claudeApiKey: '',
  imageModel: 'gemini-2.5-flash-image',
  textModel: 'gemini-2.5-pro',
};

// 사용자 설정 조회
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = supabaseAdmin;
    const { data: user, error } = await supabase
      .from('profiles')
      .select('id, api_settings, crm_settings')
      .eq('email', session.user.email)
      .single();

    if (error || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const apiSettings = (user as any).api_settings || DEFAULT_API_SETTINGS;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const crmSettings = (user as any).crm_settings || DEFAULT_CRM_SETTINGS;

    return NextResponse.json({
      apiSettings: {
        useOwnKey: apiSettings.useOwnKey,
        geminiApiKey: apiSettings.geminiApiKey ? maskApiKey(apiSettings.geminiApiKey) : '',
        claudeApiKey: apiSettings.claudeApiKey ? maskApiKey(apiSettings.claudeApiKey) : '',
        imageModel: apiSettings.imageModel,
        textModel: apiSettings.textModel,
        hasGeminiKey: !!apiSettings.geminiApiKey,
        hasClaudeKey: !!apiSettings.claudeApiKey,
      },
      crmSettings,
    });
  } catch (error) {
    console.error('Get user settings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 사용자 설정 저장
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { apiSettings, crmSettings } = body;

    const supabase = supabaseAdmin;

    // 현재 사용자 조회
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('id, api_settings, crm_settings')
      .eq('email', session.user.email)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {};

    // API 설정 업데이트
    if (apiSettings) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const existingApiSettings = (user as any).api_settings || {};
      updateData.api_settings = {
        useOwnKey: apiSettings.useOwnKey ?? existingApiSettings.useOwnKey ?? false,
        geminiApiKey: apiSettings.geminiApiKey || existingApiSettings.geminiApiKey || '',
        claudeApiKey: apiSettings.claudeApiKey || existingApiSettings.claudeApiKey || '',
        imageModel: apiSettings.imageModel || existingApiSettings.imageModel || 'gemini-2.5-flash-image',
        textModel: apiSettings.textModel || existingApiSettings.textModel || 'gemini-2.5-pro',
      };
    }

    // CRM 설정 업데이트
    if (crmSettings) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const existingCrmSettings = (user as any).crm_settings || {};
      updateData.crm_settings = {
        ...DEFAULT_CRM_SETTINGS,
        ...existingCrmSettings,
        ...crmSettings,
      };
    }

    // 설정 업데이트
    if (Object.keys(updateData).length > 0) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (updateError) {
        console.error('Update error:', updateError);
        return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: true,
      message: '설정이 저장되었습니다.',
    });
  } catch (error) {
    console.error('Save user settings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// API 키 마스킹 함수
function maskApiKey(key: string): string {
  if (!key || key.length < 8) return '****';
  return key.substring(0, 4) + '****' + key.substring(key.length - 4);
}
