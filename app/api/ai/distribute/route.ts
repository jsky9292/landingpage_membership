import { NextRequest, NextResponse } from 'next/server';
import { generateWithGemini } from '@/lib/ai/gemini';

export async function POST(request: NextRequest) {
  try {
    const { text, questions } = await request.json();

    if (!text || !questions || !Array.isArray(questions)) {
      return NextResponse.json(
        { error: '텍스트와 질문 목록이 필요합니다' },
        { status: 400 }
      );
    }

    const prompt = `당신은 텍스트를 분석하여 질문에 맞게 정보를 분배하는 AI입니다.

사용자가 입력한 텍스트:
"""
${text}
"""

아래 질문들에 대한 답변을 텍스트에서 추출해주세요.
텍스트에 해당 정보가 없으면 빈 문자열("")로 남겨두세요.
각 답변은 간결하게 핵심만 작성하세요.

질문 목록:
${questions.map((q: string, i: number) => `${i + 1}. ${q}`).join('\n')}

반드시 아래 JSON 형식으로만 응답해주세요:
{
  "answers": ["질문1에 대한 답", "질문2에 대한 답", ...]
}`;

    const response = await generateWithGemini(prompt);

    // JSON 파싱 시도
    let parsed;
    try {
      // JSON 블록 추출
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('JSON not found');
      }
    } catch {
      console.error('JSON parse error:', response);
      return NextResponse.json(
        { error: 'AI 응답 파싱 실패' },
        { status: 500 }
      );
    }

    // answers 배열이 questions 개수와 맞는지 확인
    const answers = parsed.answers || [];
    while (answers.length < questions.length) {
      answers.push('');
    }

    return NextResponse.json({
      success: true,
      answers: answers.slice(0, questions.length),
    });

  } catch (error) {
    console.error('Distribute API error:', error);
    return NextResponse.json(
      { error: 'AI 분배 처리 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
