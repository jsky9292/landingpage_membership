import { NextRequest, NextResponse } from 'next/server';
import { generateLandingPage } from '@/lib/ai/generator';
import { TopicType } from '@/types/page';
import { getGeminiApiKey, getClaudeApiKey } from '@/lib/user/get-api-key';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, prompt, tone, emojis, ctaButtonText, userApiKey } = body as {
      topic: TopicType;
      prompt: string;
      tone?: string;
      emojis?: Record<string, string>;
      ctaButtonText?: string;
      userApiKey?: string;
    };

    // 유효성 검사
    if (!topic || !prompt) {
      return NextResponse.json(
        { error: '주제와 프롬프트를 입력해주세요.' },
        { status: 400 }
      );
    }

    if (prompt.length < 10) {
      return NextResponse.json(
        { error: '프롬프트는 최소 10자 이상이어야 합니다.' },
        { status: 400 }
      );
    }

    // 사용자 API 키 가져오기 (없으면 시스템 키 사용)
    const geminiApiKey = await getGeminiApiKey();
    const claudeApiKey = await getClaudeApiKey();

    // AI 생성
    const result = await generateLandingPage(topic, prompt, {
      provider: 'gemini',
      fallback: true,
      tone: tone || 'professional',
      emojis: emojis,
      ctaButtonText: ctaButtonText,
      geminiApiKey,
      claudeApiKey,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('AI Generation Error:', error);
    return NextResponse.json(
      {
        error: 'AI 생성 중 오류가 발생했습니다. 다시 시도해주세요.',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
