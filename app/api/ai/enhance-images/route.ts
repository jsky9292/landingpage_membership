import { NextRequest, NextResponse } from 'next/server';
import { searchImages } from '@/lib/images/unsplash';
import { Section } from '@/types/page';

// AI 생성 결과에 이미지 자동 추가
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sections, topic } = body as {
      sections: Section[];
      topic: string;
    };

    if (!sections || !Array.isArray(sections)) {
      return NextResponse.json(
        { error: '섹션 데이터가 필요합니다.' },
        { status: 400 }
      );
    }

    // 각 섹션에 이미지 추가 (imageKeyword가 있는 경우)
    const enhancedSections = await Promise.all(
      sections.map(async (section) => {
        // 이미 이미지가 있거나 키워드가 없으면 스킵
        if (section.sectionImage || !section.imageKeyword) {
          return section;
        }

        // 특정 섹션 타입에만 이미지 추가 (hero, solution, cta)
        const imageSections = ['hero', 'solution', 'cta', 'philosophy'];
        if (!imageSections.includes(section.type)) {
          return section;
        }

        try {
          // 이미지 검색
          const images = await searchImages(section.imageKeyword, 1, 'landscape');

          if (images.length > 0) {
            return {
              ...section,
              sectionImage: images[0].url,
            };
          }
        } catch (error) {
          console.error(`Failed to fetch image for section ${section.id}:`, error);
        }

        return section;
      })
    );

    return NextResponse.json({
      success: true,
      sections: enhancedSections,
    });
  } catch (error) {
    console.error('Image enhancement error:', error);
    return NextResponse.json(
      { error: '이미지 추가 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
