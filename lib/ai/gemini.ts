import { GoogleGenerativeAI } from '@google/generative-ai';

// 기본 API 키 (환경변수) 또는 사용자 제공 키 사용
function getGenAI(apiKey?: string): GoogleGenerativeAI {
  const key = apiKey || process.env.GOOGLE_AI_API_KEY || '';
  return new GoogleGenerativeAI(key);
}

const genAI = getGenAI();

export async function generateWithGemini(prompt: string, apiKey?: string): Promise<string> {
  const ai = apiKey ? getGenAI(apiKey) : genAI;
  const model = ai.getGenerativeModel({
    model: 'gemini-2.5-pro',
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 8192,
      responseMimeType: 'application/json',
    },
  });

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
  });

  return result.response.text();
}

export async function generateWithGeminiStream(prompt: string, apiKey?: string) {
  const ai = apiKey ? getGenAI(apiKey) : genAI;
  const model = ai.getGenerativeModel({
    model: 'gemini-2.5-pro',
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 8192,
    },
  });

  const result = await model.generateContentStream({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
  });

  return result.stream;
}

// 이미지 생성 모델 타입
export type ImageModel =
  | 'gemini-2.5-flash-image'      // 기본 (빠름, $0.039/이미지)
  | 'gemini-3-pro-image-preview'  // 고급 (느림, 고품질)
  | 'imagen-4.0-fast-generate-001'    // Imagen Fast ($0.02/이미지)
  | 'imagen-4.0-generate-001'         // Imagen Standard ($0.04/이미지)
  | 'imagen-4.0-ultra-generate-001';  // Imagen Ultra ($0.06/이미지)

export type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9' | '2:3' | '3:2';
export type ImageSize = '1K' | '2K' | '4K';

export interface ImageGenerationConfig {
  model?: ImageModel;
  aspectRatio?: AspectRatio;
  imageSize?: ImageSize;
  numberOfImages?: number;  // 1-4 (Imagen only)
}

export interface GeneratedImage {
  base64Data: string;
  mimeType: string;
}

// Gemini 네이티브 이미지 생성 (gemini-2.5-flash-image, gemini-3-pro-image-preview)
export async function generateImageWithGemini(
  prompt: string,
  config: ImageGenerationConfig = {},
  apiKey?: string
): Promise<GeneratedImage> {
  const ai = apiKey ? getGenAI(apiKey) : genAI;
  const modelName = config.model || 'gemini-2.5-flash-image';

  // Gemini 네이티브 이미지 모델인지 확인
  const isGeminiNative = modelName.startsWith('gemini-');

  if (isGeminiNative) {
    // Gemini 네이티브 이미지 생성 (responseModalities 사용)
    const model = ai.getGenerativeModel({
      model: modelName,
      generationConfig: {
        // @ts-ignore - responseModalities is supported in newer versions
        responseModalities: ['IMAGE', 'TEXT'],
      },
    });

    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [{ text: prompt }]
      }],
    });

    const response = result.response;
    const parts = response.candidates?.[0]?.content?.parts || [];

    for (const part of parts) {
      // @ts-ignore - inlineData exists on image parts
      if (part.inlineData) {
        return {
          // @ts-ignore
          base64Data: part.inlineData.data,
          // @ts-ignore
          mimeType: part.inlineData.mimeType || 'image/png',
        };
      }
    }

    throw new Error('No image generated in response');
  } else {
    // Imagen API 사용 (REST API 직접 호출)
    return generateImageWithImagen(prompt, config, apiKey);
  }
}

// Imagen 4 API를 통한 이미지 생성
async function generateImageWithImagen(
  prompt: string,
  config: ImageGenerationConfig = {},
  apiKey?: string
): Promise<GeneratedImage> {
  const key = apiKey || process.env.GOOGLE_AI_API_KEY || '';
  const modelName = config.model || 'imagen-4.0-generate-001';

  const requestBody = {
    instances: [{ prompt }],
    parameters: {
      sampleCount: config.numberOfImages || 1,
      aspectRatio: config.aspectRatio || '1:1',
      ...(config.imageSize && { imageSize: config.imageSize }),
    },
  };

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:predict`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': key,
      },
      body: JSON.stringify(requestBody),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Imagen API error: ${error}`);
  }

  const data = await response.json();
  const predictions = data.predictions || [];

  if (predictions.length === 0) {
    throw new Error('No image generated');
  }

  return {
    base64Data: predictions[0].bytesBase64Encoded,
    mimeType: predictions[0].mimeType || 'image/png',
  };
}

// 랜딩페이지 섹션용 이미지 생성 프롬프트 생성
export function createLandingImagePrompt(
  sectionType: string,
  context: string,
  style: 'professional' | 'minimal' | 'vibrant' | 'luxury' = 'professional'
): string {
  const styleGuide = {
    professional: 'Clean, modern, professional business style. Soft lighting, neutral colors with blue accents.',
    minimal: 'Minimalist, lots of white space, simple geometric shapes, pastel colors.',
    vibrant: 'Bold, colorful, energetic, dynamic composition, bright lighting.',
    luxury: 'Elegant, sophisticated, dark theme with gold accents, premium feel.',
  };

  const sectionGuide: Record<string, string> = {
    hero: 'Hero banner image for landing page header. Wide format, impactful, attention-grabbing.',
    benefits: 'Icon or illustration representing benefits and features. Clear symbolism.',
    process: 'Step-by-step visual or infographic style. Sequential, easy to understand.',
    solution: 'Problem-solving imagery. Before/after or transformation concept.',
    philosophy: 'Abstract or conceptual image representing values and principles.',
    cta: 'Call-to-action supporting image. Urgent, motivating, action-oriented.',
  };

  return `Create a high-quality marketing image for a landing page.

Section Type: ${sectionType}
${sectionGuide[sectionType] || 'General marketing image.'}

Context: ${context}

Style: ${styleGuide[style]}

Requirements:
- No text or words in the image (text will be added separately)
- High resolution, suitable for web
- Clean, uncluttered composition
- Professional quality suitable for commercial use
- Modern, 2024-2025 design trends`;
}
