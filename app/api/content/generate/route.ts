import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { supabaseAdmin } from '@/lib/db/supabase';
import { v4 as uuidv4 } from 'uuid';

// 콘텐츠 타입별 설정
const contentConfig = {
  thumbnail: {
    points: 200,
    count: 1,
    aspectRatio: '16:9',
    description: '썸네일 이미지',
  },
  cardnews: {
    points: 500,
    count: 5,
    aspectRatio: '1:1',
    description: '카드뉴스 세트',
  },
  video: {
    points: 1000,
    count: 6,
    aspectRatio: '9:16',
    description: '영상 스토리보드',
  },
};

// 스타일별 비율
const styleRatios: Record<string, string> = {
  youtube: '16:9',
  instagram_post: '1:1',
  instagram_story: '9:16',
  blog: '16:9',
};

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await request.json();
    const { type, topic, style } = body;

    // 콘텐츠 타입 검증
    if (!contentConfig[type as keyof typeof contentConfig]) {
      return NextResponse.json({ error: '유효하지 않은 콘텐츠 유형입니다.' }, { status: 400 });
    }

    if (!topic?.trim()) {
      return NextResponse.json({ error: '주제를 입력해주세요.' }, { status: 400 });
    }

    const config = contentConfig[type as keyof typeof contentConfig];
    const aspectRatio = type === 'thumbnail' ? (styleRatios[style] || '16:9') : config.aspectRatio;

    // Supabase 미설정시 데모 모드
    if (!supabaseAdmin) {
      // 데모 이미지 생성 (플레이스홀더)
      const demoImages = Array(config.count).fill(null).map((_, i) =>
        `https://placehold.co/800x${aspectRatio === '16:9' ? 450 : aspectRatio === '1:1' ? 800 : 1400}/3182F6/FFFFFF?text=${encodeURIComponent(`${type.toUpperCase()}+${i + 1}`)}`
      );

      return NextResponse.json({
        success: true,
        result: {
          id: `demo-${Date.now()}`,
          type,
          images: demoImages,
          createdAt: new Date().toISOString(),
        },
        remainingPoints: 10400 - config.points,
        demo: true,
      });
    }

    // 포인트 확인
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('points')
      .eq('id', userId)
      .single();

    if (userError) {
      return NextResponse.json({ error: '사용자 정보를 불러올 수 없습니다.' }, { status: 500 });
    }

    const currentPoints = user?.points || 0;
    if (currentPoints < config.points) {
      return NextResponse.json({
        error: `포인트가 부족합니다. 필요: ${config.points}P, 보유: ${currentPoints}P`,
      }, { status: 400 });
    }

    // AI 이미지 생성
    const generatedImages: string[] = [];

    for (let i = 0; i < config.count; i++) {
      const prompt = generatePrompt(type, topic, i, config.count);

      try {
        const imageRes = await fetch(new URL('/api/ai/image', request.url).toString(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt,
            aspectRatio,
            imageSize: '1K',
          }),
        });

        if (imageRes.ok) {
          const imageData = await imageRes.json();
          if (imageData.success && imageData.image?.dataUrl) {
            generatedImages.push(imageData.image.dataUrl);
          }
        }
      } catch (imgError) {
        console.error(`Image generation ${i + 1} error:`, imgError);
        // 생성 실패시 플레이스홀더 추가
        generatedImages.push(
          `https://placehold.co/800x450/E5E8EB/6B7684?text=Generation+Failed`
        );
      }
    }

    // 포인트 차감
    const newBalance = currentPoints - config.points;
    await supabaseAdmin
      .from('users')
      .update({ points: newBalance })
      .eq('id', userId);

    // 포인트 히스토리 기록
    await supabaseAdmin
      .from('point_history')
      .insert({
        user_id: userId,
        type: 'use',
        amount: -config.points,
        balance: newBalance,
        description: `${config.description} 생성`,
        metadata: { content_type: type, topic },
      });

    const resultId = uuidv4();

    return NextResponse.json({
      success: true,
      result: {
        id: resultId,
        type,
        images: generatedImages.length > 0 ? generatedImages : [
          `https://placehold.co/800x450/E5E8EB/6B7684?text=No+Images+Generated`
        ],
        createdAt: new Date().toISOString(),
      },
      remainingPoints: newBalance,
    });
  } catch (error) {
    console.error('Content generation error:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

function generatePrompt(type: string, topic: string, index: number, total: number): string {
  const baseStyle = 'professional, high quality, modern design, clean composition';

  if (type === 'thumbnail') {
    return `Create a YouTube thumbnail image for: "${topic}".
Style: eye-catching, bold text overlay space, vibrant colors, ${baseStyle}.
Make it attention-grabbing and click-worthy.`;
  }

  if (type === 'cardnews') {
    const slideDescriptions = [
      'Title slide with main headline and eye-catching visual',
      'Problem or pain point illustration',
      'Solution or key insight visualization',
      'Supporting data or example',
      'Call to action or conclusion slide',
    ];
    return `Create slide ${index + 1}/${total} of a card news series about: "${topic}".
This slide should show: ${slideDescriptions[index]}.
Style: ${baseStyle}, suitable for Instagram, text space included, cohesive with other slides.`;
  }

  if (type === 'video') {
    const sceneDescriptions = [
      'Opening hook scene - grab attention immediately',
      'Problem presentation - show the issue clearly',
      'Solution introduction - present the answer',
      'Demonstration or example - show it in action',
      'Benefits or results - highlight the value',
      'Closing CTA - strong call to action',
    ];
    return `Create storyboard frame ${index + 1}/${total} for a short-form video about: "${topic}".
Scene: ${sceneDescriptions[index]}.
Style: ${baseStyle}, vertical format (9:16), suitable for TikTok/Reels/Shorts.`;
  }

  return `Create a marketing image about: "${topic}". Style: ${baseStyle}.`;
}
