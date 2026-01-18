// Unsplash API Integration for Landing Page Images

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || '';

export interface UnsplashImage {
  id: string;
  url: string;
  thumbUrl: string;
  alt: string;
  author: string;
  authorUrl: string;
}

// 키워드로 이미지 검색
export async function searchImages(
  query: string,
  count: number = 5,
  orientation: 'landscape' | 'portrait' | 'squarish' = 'landscape'
): Promise<UnsplashImage[]> {
  // API 키가 없으면 Pexels 무료 이미지 대체
  if (!UNSPLASH_ACCESS_KEY) {
    return getFallbackImages(query, count);
  }

  try {
    const params = new URLSearchParams({
      query,
      per_page: count.toString(),
      orientation,
    });

    const response = await fetch(
      `https://api.unsplash.com/search/photos?${params}`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) {
      console.error('Unsplash API error:', response.status);
      return getFallbackImages(query, count);
    }

    const data = await response.json();

    return data.results.map((photo: any) => ({
      id: photo.id,
      url: photo.urls.regular,
      thumbUrl: photo.urls.thumb,
      alt: photo.alt_description || query,
      author: photo.user.name,
      authorUrl: photo.user.links.html,
    }));
  } catch (error) {
    console.error('Unsplash search error:', error);
    return getFallbackImages(query, count);
  }
}

// 주제별 추천 이미지 카테고리
const topicImageKeywords: Record<string, string[]> = {
  // 교육/강의
  education: ['online learning', 'classroom', 'student study', 'laptop education'],
  course: ['online course', 'video conference', 'teaching', 'webinar'],
  coaching: ['mentor coaching', 'business meeting', 'consultation', 'professional advice'],

  // 비즈니스
  business: ['business professional', 'office meeting', 'corporate', 'success'],
  startup: ['startup team', 'entrepreneur', 'innovation', 'creative office'],
  consulting: ['business consulting', 'strategy meeting', 'professional service'],

  // 건강/웰빙
  health: ['healthy lifestyle', 'wellness', 'fitness', 'meditation'],
  fitness: ['gym workout', 'exercise', 'personal training', 'healthy body'],
  diet: ['healthy food', 'nutrition', 'meal prep', 'fresh vegetables'],

  // 뷰티/패션
  beauty: ['beauty cosmetics', 'skincare', 'makeup', 'beauty salon'],
  fashion: ['fashion style', 'clothing', 'wardrobe', 'outfit'],

  // 부동산/인테리어
  realestate: ['real estate', 'house exterior', 'apartment building', 'property'],
  interior: ['interior design', 'modern living room', 'home decor', 'furniture'],

  // 음식/요리
  food: ['delicious food', 'restaurant dish', 'cooking', 'gourmet meal'],
  restaurant: ['restaurant interior', 'dining', 'chef cooking', 'cafe'],

  // 기술/IT
  tech: ['technology', 'software development', 'coding', 'digital innovation'],
  app: ['mobile app', 'smartphone', 'user interface', 'digital product'],

  // 마케팅/광고
  marketing: ['digital marketing', 'social media', 'advertising', 'brand strategy'],

  // 이벤트/행사
  event: ['conference event', 'seminar', 'networking', 'celebration'],
  wedding: ['wedding ceremony', 'bride groom', 'wedding decoration'],

  // 기본
  default: ['professional', 'modern office', 'success', 'teamwork'],
};

// 주제에 맞는 이미지 키워드 추출
export function getImageKeywordsForTopic(topic: string, userPrompt?: string): string[] {
  const keywords: string[] = [];

  // 주제별 기본 키워드
  const topicLower = topic.toLowerCase();
  for (const [key, values] of Object.entries(topicImageKeywords)) {
    if (topicLower.includes(key)) {
      keywords.push(...values);
      break;
    }
  }

  // 키워드가 없으면 기본값
  if (keywords.length === 0) {
    keywords.push(...topicImageKeywords.default);
  }

  // 사용자 프롬프트에서 추가 키워드 추출
  if (userPrompt) {
    const promptKeywords = extractKeywordsFromPrompt(userPrompt);
    keywords.push(...promptKeywords);
  }

  return [...new Set(keywords)]; // 중복 제거
}

// 프롬프트에서 이미지 관련 키워드 추출
function extractKeywordsFromPrompt(prompt: string): string[] {
  const keywords: string[] = [];

  // 한국어 키워드 → 영어 변환 매핑
  const koreanToEnglish: Record<string, string> = {
    '강의': 'online course',
    '코칭': 'coaching session',
    '상담': 'consultation',
    '교육': 'education training',
    '다이어트': 'weight loss fitness',
    '운동': 'exercise workout',
    '요가': 'yoga meditation',
    '필라테스': 'pilates fitness',
    '영어': 'english learning',
    '프로그래밍': 'coding programming',
    '마케팅': 'digital marketing',
    '창업': 'startup business',
    '부업': 'side business',
    '투자': 'investment finance',
    '부동산': 'real estate property',
    '인테리어': 'interior design',
    '요리': 'cooking food',
    '베이킹': 'baking pastry',
    '사진': 'photography camera',
    '디자인': 'graphic design',
    '뷰티': 'beauty makeup',
    '패션': 'fashion style',
  };

  for (const [korean, english] of Object.entries(koreanToEnglish)) {
    if (prompt.includes(korean)) {
      keywords.push(english);
    }
  }

  return keywords;
}

// Unsplash API 없을 때 대체 이미지 (Picsum 사용)
function getFallbackImages(query: string, count: number): UnsplashImage[] {
  // 쿼리 기반 시드 생성 (일관된 이미지를 위해)
  const seed = query.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return Array.from({ length: count }, (_, i) => ({
    id: `fallback-${seed}-${i}`,
    url: `https://picsum.photos/seed/${seed + i}/1200/800`,
    thumbUrl: `https://picsum.photos/seed/${seed + i}/400/300`,
    alt: query,
    author: 'Lorem Picsum',
    authorUrl: 'https://picsum.photos',
  }));
}

// 섹션별 추천 이미지 타입
export const sectionImageTypes: Record<string, {
  orientation: 'landscape' | 'portrait' | 'squarish';
  style: string;
}> = {
  hero: { orientation: 'landscape', style: 'impactful, professional' },
  features: { orientation: 'squarish', style: 'icon-like, clean' },
  benefits: { orientation: 'squarish', style: 'positive, lifestyle' },
  testimonials: { orientation: 'squarish', style: 'people, portraits' },
  cta: { orientation: 'landscape', style: 'motivational, action' },
  about: { orientation: 'portrait', style: 'professional, trustworthy' },
};

// 섹션에 맞는 이미지 검색
export async function getImagesForSection(
  sectionType: string,
  topic: string,
  count: number = 3
): Promise<UnsplashImage[]> {
  const sectionConfig = sectionImageTypes[sectionType] || {
    orientation: 'landscape' as const,
    style: 'professional'
  };

  const keywords = getImageKeywordsForTopic(topic);
  const query = `${keywords[0]} ${sectionConfig.style}`;

  return searchImages(query, count, sectionConfig.orientation);
}
