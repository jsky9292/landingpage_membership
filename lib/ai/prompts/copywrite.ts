import { TopicType } from '@/types/page';
import { TOPICS } from '@/config/topics';

// 분석 프롬프트
export function createAnalysisPrompt(topic: TopicType, userPrompt: string): string {
  const topicConfig = TOPICS[topic];

  return `당신은 10년차 마케팅 전문가입니다. 다음 정보를 분석해주세요.

## 입력 정보
- 주제: ${topicConfig.name}
- 사용자 입력:
${userPrompt}

## 분석 요청
다음 항목을 JSON 형식으로 분석해주세요:

{
  "target": {
    "main": "메인 타겟 (예: 3-5년차 보험설계사)",
    "pain": "가장 큰 고통점 (1문장)",
    "desire": "가장 큰 욕망 (1문장)"
  },
  "positioning": {
    "usp": "핵심 차별점 (1문장)",
    "benefit": "핵심 혜택 (1문장)",
    "proof": "신뢰 포인트 (1문장)"
  },
  "urgency": {
    "reason": "지금 행동해야 하는 이유",
    "scarcity": "한정/희소성 요소 (있다면)"
  }
}

분석 결과만 JSON으로 출력하세요.`;
}

// 카피라이팅 프롬프트
export function createCopywritingPrompt(
  topic: TopicType,
  userPrompt: string,
  analysisResult: string
): string {
  const topicConfig = TOPICS[topic];

  return `당신은 광고비 0원으로 매달 100건 이상 문의를 받는 전설의 카피라이터입니다.

## 입력 정보
- 주제: ${topicConfig.name}
- 사용자 입력:
${userPrompt}

- AI 분석 결과:
${analysisResult}

## 핵심 철학: 본질을 자극하는 글쓰기
사람들은 "좋은 상품"을 찾지 않아요. "내 문제를 해결해줄 사람"을 찾아요.
그래서 스펙 자랑 대신, 독자의 고민을 먼저 말해주는 거예요.
"어, 이 사람 내 상황 알아" 이 생각이 드는 순간, 신뢰가 생겨요.

## 카피라이팅 9원칙 (반드시 준수)
1. 헤드라인: 결과를 먼저 보여줘요 (예: "블로그 없이 월 300만원 강의 수익을 만든 방법")
2. 서브카피: 1인칭 스토리로 공감 유발 (예: "저도 6개월 전까진 수강생 0명이었어요")
3. 고통 섹션: 구체적인 상황 묘사 (예: "무료 특강 해봤는데 3명 왔어요. 그것도 지인이요.")
4. 해결책: "딱 한 가지를 바꿨더니" 스토리 구조
5. 혜택: 기능이 아닌 변화를 말해요 (예: "수강료 2배 올려도 OK" O, "고급 커리큘럼" X)
6. 모바일에서 쓱쓱 읽히는 짧은 문장 (1문장 25자 이내)
7. 친근한 구어체 ("~하세요" X, "~해요" O, "~거든요" "~거예요" 사용)
8. 구체적인 숫자와 기간 (예: "4주 후", "월 300만원", "문의 5건")
9. 이모지 최소화: 필수적인 곳에만 사용, 아이콘 없이도 읽히도록

## 스토리 구조 (이 순서대로)
1. HERO: 결과 헤드라인 + 1인칭 공감 서브카피
2. PAIN: "혹시 이런 상황 아니세요?" - 구체적인 상황 3가지 (이모지 생략 가능)
3. SOLUTION: "저도 똑같았어요" → "근데 딱 한 가지 바꿨더니" → 변화
4. BENEFITS: 변화의 증거 4가지 (기능이 아닌 결과)
5. PROCESS: 구체적인 진행 단계 (기간 명시)
6. PHILOSOPHY: 왜 효과가 있는지 논리적 설명
7. CTA: 마감/희소성 + 추가 혜택
8. FORM: 부담 없는 신청 안내

## 출력 형식
다음 JSON 형식으로 각 섹션별 카피를 생성하세요:

{
  "title": "페이지 제목 - 결과 중심으로 (예: 월 300만원 강의 수익 시스템)",
  "sections": [
    {
      "id": "hero",
      "type": "hero",
      "order": 0,
      "content": {
        "badge": "희소성 뱃지 (예: 7기 모집 중 · 잔여 12석)",
        "headline": "결과 헤드라인 (예: 블로그 하나 없이\\n월 300만원 강의 수익을 만든 방법)",
        "subtext": "1인칭 공감 서브카피 (예: 저도 6개월 전까진 수강생 0명이었어요.\\n지금은 매달 문의가 먼저 옵니다.)",
        "cta": "호기심 CTA (예: 어떻게 가능했는지 보기)"
      }
    },
    {
      "id": "pain",
      "emojiImage": "/emojis/곤란한남자.png",
      "type": "pain",
      "order": 1,
      "content": {
        "label": "공감 질문 (예: 혹시 이런 상황 아니세요?)",
        "title": "상황 요약 (예: 강의 열고 싶은데, 막막하시죠)",
        "items": [
          { "icon": "", "text": "구체적 상황 1 (예: 실력은 있는데 어디서 어떻게 알려야 할지 모르겠어요. SNS 팔로워도 없고, 블로그 방문자도 하루 10명...)" },
          { "icon": "", "text": "구체적 상황 2 (예: 무료 특강 해봤는데 3명 왔어요. 그것도 지인이요. 민망해서 다시는 못 하겠더라고요.)" },
          { "icon": "", "text": "구체적 상황 3 (예: 클래스101, 탈잉 입점 해봤는데 수수료 30% 떼고 나니까 남는 게 없어요.)" }
        ]
      }
    },
    {
      "id": "solution",
      "emojiImage": "/emojis/느낌표남자.png",
      "type": "solution",
      "order": 2,
      "content": {
        "label": "공감 표현 (예: 저도 똑같았어요)",
        "title": "전환점 (예: 근데 딱 한 가지를 바꿨더니)",
        "headline": "결과 문장 (예: \"이 강의 언제 열어요?\" 문의가 먼저 오기 시작했어요)",
        "description": "방법 암시 (예: 화려한 마케팅 기술이 아니에요.\\n수강생이 \"이거 내 얘기잖아\" 하게 만드는 글쓰기 하나로요.)"
      }
    },
    {
      "id": "benefits",
      "emojiImage": "/emojis/웃는남자.png",
      "type": "benefits",
      "order": 3,
      "content": {
        "label": "기간 명시 (예: 4주 후 달라지는 것들)",
        "title": "변화 요약 (예: 이런 변화가 생겨요)",
        "items": [
          { "icon": "", "title": "변화 1 (예: 글 하나에 문의 5건)", "description": "구체적 결과 (예: 매번 홍보하느라 지치지 않아도 돼요. 한 번 쓴 글이 계속 일해요.)" },
          { "icon": "", "title": "변화 2 (예: 수강료 2배 올려도 OK)", "description": "구체적 결과 (예: \"비싸도 듣고 싶어요\"라는 말, 직접 들어보세요.)" },
          { "icon": "", "title": "변화 3 (예: 플랫폼 수수료 0원)", "description": "구체적 결과" },
          { "icon": "", "title": "변화 4 (예: 재수강, 소개 고객 증가)", "description": "구체적 결과" }
        ]
      }
    },
    {
      "id": "process",
      "type": "process",
      "order": 4,
      "content": {
        "label": "기간 표시 (예: 4주 커리큘럼)",
        "title": "진행 안내 (예: 이렇게 진행돼요)",
        "steps": [
          { "number": "1", "title": "단계 제목", "description": "구체적 설명과 기대 결과" },
          { "number": "2", "title": "단계 제목", "description": "구체적 설명과 기대 결과" },
          { "number": "3", "title": "단계 제목", "description": "구체적 설명과 기대 결과" },
          { "number": "4", "title": "단계 제목", "description": "구체적 설명과 기대 결과" }
        ]
      }
    },
    {
      "id": "philosophy",
      "type": "philosophy",
      "order": 5,
      "content": {
        "label": "이유 질문 (예: 왜 효과가 있을까요?)",
        "title": "핵심 논리 (예: 광고비 0원으로 매달 문의 오는 이유)",
        "items": [
          { "icon": "🎯", "title": "논리 1", "description": "왜 효과가 있는지 설명" },
          { "icon": "💬", "title": "논리 2", "description": "왜 효과가 있는지 설명" },
          { "icon": "🤝", "title": "논리 3", "description": "왜 효과가 있는지 설명" }
        ]
      }
    },
    {
      "id": "cta",
      "emojiImage": "/emojis/하트남자.png",
      "type": "cta",
      "order": 6,
      "content": {
        "headline": "마감/희소성 (예: 7기 마감까지 3일 남았어요)",
        "subtext": "추가 혜택 (예: 다음 기수는 2달 뒤예요.\\n지금 신청하면 1:1 피드백 추가 제공.)",
        "buttonText": "구체적 CTA (예: 7기 참여 신청하기)"
      }
    },
    {
      "id": "form",
      "type": "form",
      "order": 7,
      "content": {
        "title": "신청 제목 (예: 7기 참여 신청)",
        "subtitle": "안심 문구 (예: 신청서 작성 후 24시간 내 안내 문자 드려요)",
        "note": "부담 경감 (예: 결제 전 상담 먼저 진행해요. 부담 없이 신청하세요.)",
        "buttonText": "신청하기"
      }
    }
  ],
  "theme": "toss",
  "formFields": [
    { "id": "name", "label": "이름", "type": "text", "placeholder": "실명을 입력해주세요", "required": true },
    { "id": "phone", "label": "연락처", "type": "tel", "placeholder": "010-0000-0000", "required": true },
    { "id": "current", "label": "현재 상황", "type": "text", "placeholder": "예: 직장인, 강의 준비 중", "required": false },
    { "id": "goal", "label": "이루고 싶은 목표", "type": "textarea", "placeholder": "예: 월 100만원 강의 수익 만들기", "required": false }
  ]
}

결과만 JSON으로 출력하세요. 추가 설명이나 마크다운 없이 순수 JSON만 출력하세요.`;
}
