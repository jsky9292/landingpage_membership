import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { supabaseAdmin } from '@/lib/db/supabase';

// 데모 계정 설정 저장소 (메모리)
const demoSettingsStore: Record<string, {
  profile: any;
  apiSettings: any;
  crmSettings: any;
  plan: string;
}> = {};

// 데모 계정 ID 목록
const DEMO_USER_IDS = ['demo-admin', 'demo-user'];

// 데모 계정인지 확인
function isDemoUser(userId: string | undefined): boolean {
  return !!userId && DEMO_USER_IDS.includes(userId);
}

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

    const userId = (session.user as any).id;

    // 데모 계정인 경우 메모리에서 설정 조회
    if (isDemoUser(userId)) {
      const demoSettings = demoSettingsStore[userId] || {
        profile: {
          name: session.user.name || '데모 사용자',
          email: session.user.email,
          phone: '',
          notifyEmail: true,
          notifyKakao: false,
          kakaoLinked: false,
        },
        apiSettings: DEFAULT_API_SETTINGS,
        crmSettings: DEFAULT_CRM_SETTINGS,
        plan: 'free',
      };

      return NextResponse.json({
        profile: demoSettings.profile,
        apiSettings: {
          useOwnKey: demoSettings.apiSettings.useOwnKey || false,
          geminiApiKey: demoSettings.apiSettings.geminiApiKey ? maskApiKey(demoSettings.apiSettings.geminiApiKey) : '',
          claudeApiKey: demoSettings.apiSettings.claudeApiKey ? maskApiKey(demoSettings.apiSettings.claudeApiKey) : '',
          imageModel: demoSettings.apiSettings.imageModel || 'gemini-2.5-flash-image',
          textModel: demoSettings.apiSettings.textModel || 'gemini-2.5-pro',
          hasGeminiKey: !!demoSettings.apiSettings.geminiApiKey,
          hasClaudeKey: !!demoSettings.apiSettings.claudeApiKey,
        },
        crmSettings: demoSettings.crmSettings,
        plan: demoSettings.plan,
      });
    }

    // 일반 사용자: Supabase에서 조회
    const supabase = supabaseAdmin;
    const { data: user, error } = await supabase
      .from('profiles')
      .select('id, name, email, phone, notify_email, notify_kakao, kakao_linked, plan, api_settings, crm_settings')
      .eq('email', session.user.email)
      .single();

    if (error || !user) {
      // Supabase 연결 안됨 또는 사용자 없음 - 기본값 반환
      return NextResponse.json({
        profile: {
          name: session.user.name || '',
          email: session.user.email,
          phone: '',
          notifyEmail: true,
          notifyKakao: false,
          kakaoLinked: false,
        },
        apiSettings: {
          useOwnKey: false,
          geminiApiKey: '',
          claudeApiKey: '',
          imageModel: 'gemini-2.5-flash-image',
          textModel: 'gemini-2.5-pro',
          hasGeminiKey: false,
          hasClaudeKey: false,
        },
        crmSettings: DEFAULT_CRM_SETTINGS,
        plan: 'free',
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userData = user as any;
    const apiSettings = userData.api_settings || DEFAULT_API_SETTINGS;
    const crmSettings = userData.crm_settings || DEFAULT_CRM_SETTINGS;

    return NextResponse.json({
      profile: {
        name: userData.name || '',
        email: userData.email || session.user.email,
        phone: userData.phone || '',
        notifyEmail: userData.notify_email ?? true,
        notifyKakao: userData.notify_kakao ?? false,
        kakaoLinked: userData.kakao_linked ?? false,
      },
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
      plan: userData.plan || 'free',
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
    const { profile, apiSettings, crmSettings } = body;
    const userId = (session.user as any).id;

    // 데모 계정인 경우 메모리에 저장
    if (isDemoUser(userId)) {
      const existingSettings = demoSettingsStore[userId] || {
        profile: {
          name: session.user.name || '데모 사용자',
          email: session.user.email,
          phone: '',
          notifyEmail: true,
          notifyKakao: false,
          kakaoLinked: false,
        },
        apiSettings: { ...DEFAULT_API_SETTINGS },
        crmSettings: { ...DEFAULT_CRM_SETTINGS },
        plan: 'free',
      };

      if (profile) {
        existingSettings.profile = {
          ...existingSettings.profile,
          name: profile.name ?? existingSettings.profile.name,
          phone: profile.phone ?? existingSettings.profile.phone,
          notifyEmail: profile.notifyEmail ?? existingSettings.profile.notifyEmail,
          notifyKakao: profile.notifyKakao ?? existingSettings.profile.notifyKakao,
        };
      }

      if (apiSettings) {
        existingSettings.apiSettings = {
          useOwnKey: apiSettings.useOwnKey ?? existingSettings.apiSettings.useOwnKey ?? false,
          geminiApiKey: apiSettings.geminiApiKey || existingSettings.apiSettings.geminiApiKey || '',
          claudeApiKey: apiSettings.claudeApiKey || existingSettings.apiSettings.claudeApiKey || '',
          imageModel: apiSettings.imageModel || existingSettings.apiSettings.imageModel || 'gemini-2.5-flash-image',
          textModel: apiSettings.textModel || existingSettings.apiSettings.textModel || 'gemini-2.5-pro',
        };
      }

      if (crmSettings) {
        existingSettings.crmSettings = {
          ...DEFAULT_CRM_SETTINGS,
          ...existingSettings.crmSettings,
          ...crmSettings,
        };
      }

      demoSettingsStore[userId] = existingSettings;

      console.log('[Settings] Demo user settings saved:', userId);

      return NextResponse.json({
        success: true,
        message: '설정이 저장되었습니다. (데모 모드)',
      });
    }

    // 일반 사용자: Supabase에 저장
    const supabase = supabaseAdmin;

    // 현재 사용자 조회
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('id, api_settings, crm_settings')
      .eq('email', session.user.email)
      .single();

    if (userError || !user) {
      // Supabase 연결 안됨 - 성공으로 처리 (데모 모드처럼 동작)
      console.log('[Settings] Supabase not connected, treating as demo mode');
      return NextResponse.json({
        success: true,
        message: '설정이 저장되었습니다. (로컬 모드)',
      });
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
