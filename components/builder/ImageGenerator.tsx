'use client';

import { useState, useEffect } from 'react';

interface ImageGeneratorProps {
  sectionType?: string;
  context?: string;
  onImageGenerated: (imageUrl: string) => void;
  onClose?: () => void;
}

interface APISettings {
  useOwnKey: boolean;
  geminiApiKey: string;
  imageModel: string;
}

const STYLE_OPTIONS = [
  { id: 'professional', name: '프로페셔널', description: '깔끔하고 전문적인 비즈니스 스타일' },
  { id: 'minimal', name: '미니멀', description: '심플하고 여백이 많은 스타일' },
  { id: 'vibrant', name: '생동감', description: '밝고 에너지 넘치는 스타일' },
  { id: 'luxury', name: '럭셔리', description: '고급스럽고 세련된 스타일' },
] as const;

const ASPECT_RATIOS = [
  { id: '16:9', name: '와이드 (16:9)', description: '히어로 배너용' },
  { id: '1:1', name: '정사각형 (1:1)', description: '아이콘, 프로필용' },
  { id: '4:3', name: '표준 (4:3)', description: '일반 콘텐츠용' },
  { id: '9:16', name: '세로 (9:16)', description: '모바일, 스토리용' },
] as const;

export function ImageGenerator({
  sectionType = 'hero',
  context = '',
  onImageGenerated,
  onClose,
}: ImageGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState<string>('professional');
  const [aspectRatio, setAspectRatio] = useState<string>('16:9');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiSettings, setApiSettings] = useState<APISettings | null>(null);

  // API 설정 로드
  useEffect(() => {
    const saved = localStorage.getItem('apiSettings');
    if (saved) {
      try {
        setApiSettings(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load API settings:', e);
      }
    }
  }, []);

  // 섹션 타입에 따른 기본 프롬프트 설정
  useEffect(() => {
    const defaultPrompts: Record<string, string> = {
      hero: '랜딩페이지 히어로 섹션용 임팩트 있는 마케팅 이미지',
      benefits: '혜택과 장점을 표현하는 아이콘 또는 일러스트',
      process: '단계별 프로세스를 표현하는 인포그래픽 스타일 이미지',
      solution: '문제 해결을 표현하는 변화와 성장의 이미지',
      philosophy: '브랜드 가치와 철학을 표현하는 추상적인 이미지',
      cta: '행동을 유도하는 동기부여 이미지',
    };

    if (!prompt && sectionType) {
      setPrompt(defaultPrompts[sectionType] || '');
    }
  }, [sectionType, prompt]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('이미지 설명을 입력해주세요.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const response = await fetch('/api/ai/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          sectionType,
          context,
          style,
          aspectRatio,
          model: apiSettings?.imageModel || 'gemini-2.5-flash-image',
          apiKey: apiSettings?.useOwnKey ? apiSettings.geminiApiKey : undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedImage(data.image.dataUrl);
      } else {
        setError(data.error || '이미지 생성에 실패했습니다.');
      }
    } catch (err) {
      console.error('Image generation error:', err);
      setError('이미지 생성 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseImage = () => {
    if (generatedImage) {
      onImageGenerated(generatedImage);
      onClose?.();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '20px',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflow: 'auto',
      }}>
        {/* 헤더 */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #E5E8EB',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#191F28' }}>
              AI 이미지 생성
            </h2>
            <p style={{ fontSize: '14px', color: '#4E5968', marginTop: '4px' }}>
              Gemini AI로 랜딩페이지용 이미지를 생성하세요
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#8B95A1',
            }}
          >
            ×
          </button>
        </div>

        {/* 본문 */}
        <div style={{ padding: '20px' }}>
          {/* 프롬프트 입력 */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#333D4B',
              marginBottom: '8px',
            }}>
              이미지 설명
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="원하는 이미지를 자세히 설명해주세요..."
              rows={3}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #E5E8EB',
                borderRadius: '8px',
                fontSize: '14px',
                resize: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* 스타일 선택 */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#333D4B',
              marginBottom: '8px',
            }}>
              스타일
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {STYLE_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setStyle(option.id)}
                  style={{
                    padding: '12px',
                    border: `2px solid ${style === option.id ? '#0064FF' : '#E5E8EB'}`,
                    borderRadius: '8px',
                    background: style === option.id ? '#E8F3FF' : '#fff',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#191F28' }}>
                    {option.name}
                  </p>
                  <p style={{ fontSize: '12px', color: '#4E5968', marginTop: '2px' }}>
                    {option.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* 비율 선택 */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#333D4B',
              marginBottom: '8px',
            }}>
              비율
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {ASPECT_RATIOS.map((ratio) => (
                <button
                  key={ratio.id}
                  onClick={() => setAspectRatio(ratio.id)}
                  style={{
                    padding: '8px 16px',
                    border: `2px solid ${aspectRatio === ratio.id ? '#0064FF' : '#E5E8EB'}`,
                    borderRadius: '20px',
                    background: aspectRatio === ratio.id ? '#E8F3FF' : '#fff',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: aspectRatio === ratio.id ? '600' : '400',
                    color: aspectRatio === ratio.id ? '#0064FF' : '#4E5968',
                  }}
                >
                  {ratio.name}
                </button>
              ))}
            </div>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div style={{
              padding: '12px',
              background: '#FEE2E2',
              borderRadius: '8px',
              marginBottom: '20px',
            }}>
              <p style={{ fontSize: '14px', color: '#DC2626' }}>{error}</p>
            </div>
          )}

          {/* 생성된 이미지 미리보기 */}
          {generatedImage && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#333D4B',
                marginBottom: '8px',
              }}>
                생성된 이미지
              </label>
              <div style={{
                border: '1px solid #E5E8EB',
                borderRadius: '8px',
                overflow: 'hidden',
              }}>
                <img
                  src={generatedImage}
                  alt="Generated"
                  style={{ width: '100%', display: 'block' }}
                />
              </div>
            </div>
          )}

          {/* API 정보 */}
          <div style={{
            padding: '12px',
            background: '#F8FAFC',
            borderRadius: '8px',
            marginBottom: '20px',
          }}>
            <p style={{ fontSize: '12px', color: '#8B95A1' }}>
              {apiSettings?.useOwnKey
                ? `✓ 내 API 키 사용 중 (${apiSettings.imageModel})`
                : '무료 버전 (일일 3회 제한)'}
            </p>
          </div>
        </div>

        {/* 푸터 */}
        <div style={{
          padding: '20px',
          borderTop: '1px solid #E5E8EB',
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end',
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '12px 24px',
              border: '1px solid #E5E8EB',
              borderRadius: '8px',
              background: '#fff',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              color: '#4E5968',
            }}
          >
            취소
          </button>
          {generatedImage ? (
            <button
              onClick={handleUseImage}
              style={{
                padding: '12px 24px',
                border: 'none',
                borderRadius: '8px',
                background: '#22C55E',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                color: '#fff',
              }}
            >
              이 이미지 사용
            </button>
          ) : null}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            style={{
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              background: isGenerating ? '#8B95A1' : '#0064FF',
              cursor: isGenerating ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {isGenerating ? (
              <>
                <span style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }} />
                생성 중...
              </>
            ) : generatedImage ? (
              '다시 생성'
            ) : (
              '이미지 생성'
            )}
          </button>
        </div>

        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}
