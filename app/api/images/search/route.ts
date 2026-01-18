import { NextRequest, NextResponse } from 'next/server';
import { searchImages, getImageKeywordsForTopic } from '@/lib/images/unsplash';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const topic = searchParams.get('topic') || '';
    const count = parseInt(searchParams.get('count') || '5');
    const orientation = (searchParams.get('orientation') || 'landscape') as 'landscape' | 'portrait' | 'squarish';

    if (!query && !topic) {
      return NextResponse.json(
        { error: '검색어 또는 주제를 입력해주세요.' },
        { status: 400 }
      );
    }

    // 주제 기반으로 키워드 생성하거나 직접 쿼리 사용
    let searchQuery = query;
    if (!query && topic) {
      const keywords = getImageKeywordsForTopic(topic);
      searchQuery = keywords[0] || 'professional';
    }

    const images = await searchImages(searchQuery, count, orientation);

    return NextResponse.json({
      success: true,
      images,
      query: searchQuery,
    });
  } catch (error) {
    console.error('Image search error:', error);
    return NextResponse.json(
      { error: '이미지 검색 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
