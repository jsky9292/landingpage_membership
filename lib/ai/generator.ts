import { TopicType, Section, FormField, ThemeType } from '@/types/page';
import { GeneratedPage } from '@/types/page';
import { generateWithGemini } from './gemini';
import { generateWithClaude } from './claude';
import { createAnalysisPrompt, createCopywritingPrompt } from './prompts/copywrite';
import { toneStyles } from '@/lib/config/emojis';

type AIProvider = 'gemini' | 'claude';

interface GenerateOptions {
  provider?: AIProvider;
  fallback?: boolean;
  tone?: string;
  emojis?: Record<string, string>;
  ctaButtonText?: string;
  geminiApiKey?: string;
  claudeApiKey?: string;
}

// AI가 반환하는 원시 응답 타입
interface AIRawResponse {
  title: string;
  sections: Section[];
  theme?: ThemeType;
  formFields?: FormField[];
}

// JSON 응답 파싱 (마크다운 코드블록 제거)
function parseJSONResponse(response: string): unknown {
  let cleaned = response.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3);
  }
  cleaned = cleaned.trim();
  return JSON.parse(cleaned);
}

// AI로 콘텐츠 생성
async function generateContent(
  prompt: string,
  provider: AIProvider,
  apiKey?: string
): Promise<string> {
  if (provider === 'gemini') {
    return generateWithGemini(prompt, apiKey);
  } else {
    return generateWithClaude(prompt, apiKey);
  }
}

// 톤앤매너 스타일 가져오기
function getToneStyle(toneId: string) {
  return toneStyles[toneId as keyof typeof toneStyles] || toneStyles.professional;
}

// 랜딩페이지 생성 메인 함수
export async function generateLandingPage(
  topic: TopicType,
  userPrompt: string,
  options: GenerateOptions = {}
): Promise<GeneratedPage> {
  const { provider = 'gemini', fallback = true, tone = 'professional', emojis, ctaButtonText, geminiApiKey, claudeApiKey } = options;
  const toneStyle = getToneStyle(tone);

  async function tryGenerate(currentProvider: AIProvider): Promise<GeneratedPage> {
    const apiKey = currentProvider === 'gemini' ? geminiApiKey : claudeApiKey;
    try {
      // 1단계: 분석
      console.log(`[${currentProvider}] Starting analysis...`);
      const analysisPrompt = createAnalysisPrompt(topic, userPrompt);
      const analysisResponse = await generateContent(analysisPrompt, currentProvider, apiKey);
      const analysis = parseJSONResponse(analysisResponse);
      console.log(`[${currentProvider}] Analysis complete`);

      // 2단계: 카피라이팅 (톤앤매너와 이모지 정보 포함)
      console.log(`[${currentProvider}] Starting copywriting with tone: ${tone}...`);
      
      // 이모지 사용 안내 추가
      const emojiGuide = emojis ? `
## 사용 가능한 커스텀 이모지 이미지
다음 이모지 이미지를 섹션에 활용하세요 (이미지 경로로 사용):
- 고민/문제 표현: ${emojis.question}, ${emojis.confused}, ${emojis.cryMan}
- 해결/긍정 표현: ${emojis.smileMan}, ${emojis.heartMan}, ${emojis.exclaim}
- 기타: ${emojis.angryMan}, ${emojis.smirk}

섹션의 특성에 맞게 적절한 이모지 이미지를 선택하여 emojiImage 필드에 경로를 넣어주세요.
` : '';

      const toneGuide = `
## 톤앤매너
- 스타일: ${toneStyle.name} (${toneStyle.description})
- 메인 컬러: ${toneStyle.colors.primary}
- 보조 컬러: ${toneStyle.colors.secondary}
- 배경 컬러: ${toneStyle.colors.background}
- 강조 컬러: ${toneStyle.colors.accent}
- 모서리 둥글기: ${toneStyle.borderRadius}

이 톤앤매너에 맞게 문체와 표현을 조절해주세요:
- 전문가: 신뢰감 있고 권위적인 표현
- 친근한: 따뜻하고 대화하듯 편안한 표현
- 프리미엄: 고급스럽고 세련된 표현
- 활기찬: 밝고 에너지 넘치는 표현
- 미니멀: 간결하고 핵심적인 표현
`;

      // CTA 버튼 문구 가이드 추가
      const ctaGuide = ctaButtonText ? `
## CTA 버튼 문구 지정
사용자가 지정한 CTA 버튼 문구입니다. 반드시 이 문구를 사용해주세요:
- hero 섹션의 cta: "${ctaButtonText}"
- cta 섹션의 buttonText: "${ctaButtonText}"
- form 섹션의 buttonText: "${ctaButtonText}"
` : '';

      const copywritingPrompt = createCopywritingPrompt(
        topic,
        userPrompt,
        JSON.stringify(analysis, null, 2)
      ) + toneGuide + emojiGuide + ctaGuide;

      const copywritingResponse = await generateContent(copywritingPrompt, currentProvider, apiKey);
      const result = parseJSONResponse(copywritingResponse) as AIRawResponse;
      console.log(`[${currentProvider}] Copywriting complete`);

      return {
        content: {
          sections: result.sections || [],
          metadata: {
            description: result.title,
          },
        },
        theme: result.theme || 'toss',
        formFields: result.formFields || [],
        title: result.title || '새 랜딩페이지',
        toneStyle: toneStyle,
      };
    } catch (error) {
      console.error(`[${currentProvider}] Generation failed:`, error);
      throw error;
    }
  }

  try {
    return await tryGenerate(provider);
  } catch (error) {
    if (fallback && provider === 'gemini') {
      console.log('Falling back to Claude...');
      return await tryGenerate('claude');
    }
    throw error;
  }
}

// 특정 섹션만 재생성
export async function regenerateSection(
  topic: TopicType,
  userPrompt: string,
  sectionType: string,
  currentContent: string,
  provider: AIProvider = 'gemini'
): Promise<unknown> {
  const prompt = `당신은 10년차 마케팅 카피라이터입니다.

## 요청
${sectionType} 섹션의 카피를 다시 작성해주세요.

## 컨텍스트
- 주제: ${topic}
- 원본 내용: ${userPrompt}
- 현재 카피: ${currentContent}

## 요구사항
- 더 임팩트 있게
- 더 구체적인 숫자와 혜택으로
- 모바일에서 읽기 좋은 짧은 문장으로

기존과 같은 JSON 구조로 출력하세요.`;

  const response = await generateContent(prompt, provider);
  return parseJSONResponse(response);
}
