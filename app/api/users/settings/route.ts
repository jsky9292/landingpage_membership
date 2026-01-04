import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { createServerClient } from '@/lib/supabase/client';

// 사용자 API 설정 조회
export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createServerClient() as any;
    const { data: user, error } = await supabase
      .from('users')
      .select('id, api_settings')
      .eq('email', session.user.email)
      .single();

    if (error || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // API 설정이 없으면 기본값 반환
    const apiSettings = user.api_settings || {
      useOwnKey: false,
      geminiApiKey: '',
      claudeApiKey: '',
      imageModel: 'gemini-2.5-flash-image',
      textModel: 'gemini-2.5-pro',
    };

    // API 키는 마스킹해서 반환 (보안)
    return NextResponse.json({
      useOwnKey: apiSettings.useOwnKey,
      geminiApiKey: apiSettings.geminiApiKey ? maskApiKey(apiSettings.geminiApiKey) : '',
      claudeApiKey: apiSettings.claudeApiKey ? maskApiKey(apiSettings.claudeApiKey) : '',
      imageModel: apiSettings.imageModel,
      textModel: apiSettings.textModel,
      hasGeminiKey: !!apiSettings.geminiApiKey,
      hasClaudeKey: !!apiSettings.claudeApiKey,
    });
  } catch (error) {
    console.error('Get user settings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 사용자 API 설정 저장
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { useOwnKey, geminiApiKey, claudeApiKey, imageModel, textModel } = body;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createServerClient() as any;

    // 현재 사용자 조회
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, api_settings')
      .eq('email', session.user.email)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 기존 설정과 병합 (빈 문자열이 아닌 경우에만 업데이트)
    const existingSettings = user.api_settings || {};
    const newSettings = {
      useOwnKey: useOwnKey ?? existingSettings.useOwnKey ?? false,
      geminiApiKey: geminiApiKey || existingSettings.geminiApiKey || '',
      claudeApiKey: claudeApiKey || existingSettings.claudeApiKey || '',
      imageModel: imageModel || existingSettings.imageModel || 'gemini-2.5-flash-image',
      textModel: textModel || existingSettings.textModel || 'gemini-2.5-pro',
    };

    // API 설정 업데이트
    const { error: updateError } = await supabase
      .from('users')
      .update({ api_settings: newSettings })
      .eq('id', user.id);

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'API 설정이 저장되었습니다.',
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
