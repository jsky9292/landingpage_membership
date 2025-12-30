import { NextRequest, NextResponse } from 'next/server';
import {
  generateImageWithGemini,
  createLandingImagePrompt,
  ImageModel,
  AspectRatio,
  ImageSize,
} from '@/lib/ai/gemini';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      prompt,
      sectionType,
      context,
      style = 'professional',
      model = 'gemini-2.5-flash-image',
      aspectRatio = '16:9',
      imageSize = '1K',
      apiKey,
    } = body;

    // 프롬프트 생성 (직접 제공되지 않은 경우)
    const imagePrompt = prompt || createLandingImagePrompt(
      sectionType || 'hero',
      context || '랜딩페이지용 마케팅 이미지',
      style
    );

    console.log('Generating image with:', {
      model,
      aspectRatio,
      imageSize,
      prompt: imagePrompt.substring(0, 100) + '...',
    });

    const result = await generateImageWithGemini(
      imagePrompt,
      {
        model: model as ImageModel,
        aspectRatio: aspectRatio as AspectRatio,
        imageSize: imageSize as ImageSize,
      },
      apiKey // 사용자 제공 API 키
    );

    return NextResponse.json({
      success: true,
      image: {
        data: result.base64Data,
        mimeType: result.mimeType,
        dataUrl: `data:${result.mimeType};base64,${result.base64Data}`,
      },
    });
  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate image',
      },
      { status: 500 }
    );
  }
}
