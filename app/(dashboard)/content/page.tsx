'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

type ContentType = 'thumbnail' | 'cardnews' | 'video';

interface GenerationResult {
  id: string;
  type: ContentType;
  images: string[];
  createdAt: string;
}

const contentTypes = [
  {
    id: 'thumbnail' as ContentType,
    name: '썸네일',
    description: '유튜브, 블로그 등 마케팅용 썸네일',
    points: 200,
    icon: 'T',
  },
  {
    id: 'cardnews' as ContentType,
    name: '카드뉴스',
    description: 'SNS용 카드뉴스 5장 세트',
    points: 500,
    icon: 'C',
  },
  {
    id: 'video' as ContentType,
    name: '영상 스토리보드',
    description: '숏폼 영상용 스토리보드',
    points: 1000,
    icon: 'V',
  },
];

const thumbnailStyles = [
  { id: 'youtube', name: '유튜브 썸네일', ratio: '16:9' },
  { id: 'instagram_post', name: '인스타그램 정사각형', ratio: '1:1' },
  { id: 'instagram_story', name: '인스타그램 스토리', ratio: '9:16' },
  { id: 'blog', name: '블로그 대표이미지', ratio: '16:9' },
];

export default function ContentPage() {
  const { data: session } = useSession();
  const [selectedType, setSelectedType] = useState<ContentType>('thumbnail');
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState('youtube');
  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState<GenerationResult[]>([]);
  const [currentPoints, setCurrentPoints] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (session) {
      fetchPoints();
    }
  }, [session]);

  const fetchPoints = async () => {
    try {
      const res = await fetch('/api/points');
      if (res.ok) {
        const data = await res.json();
        setCurrentPoints(data.points || 0);
      }
    } catch (err) {
      console.error('Failed to fetch points:', err);
    }
  };

  const selectedContent = contentTypes.find(c => c.id === selectedType);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('주제를 입력해주세요.');
      return;
    }

    if (currentPoints < (selectedContent?.points || 0)) {
      setError('포인트가 부족합니다. 충전 후 이용해주세요.');
      return;
    }

    setGenerating(true);
    setError('');

    try {
      const res = await fetch('/api/content/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedType,
          topic,
          style,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setResults(prev => [data.result, ...prev]);
        setCurrentPoints(data.remainingPoints);
        setTopic('');
      } else {
        setError(data.error || '생성에 실패했습니다.');
      }
    } catch (err) {
      console.error('Generation error:', err);
      setError('서버 오류가 발생했습니다.');
    } finally {
      setGenerating(false);
    }
  };

  if (!session) {
    return (
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>AI</div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#191F28', marginBottom: 8 }}>로그인이 필요합니다</h2>
        <p style={{ fontSize: 14, color: '#6B7684', marginBottom: 24 }}>콘텐츠 생성은 로그인 후 이용 가능합니다.</p>
        <Link href="/login?callbackUrl=/content" style={{
          display: 'inline-block',
          padding: '14px 32px',
          background: '#3182F6',
          color: '#fff',
          borderRadius: 12,
          fontSize: 15,
          fontWeight: 600,
          textDecoration: 'none',
        }}>
          로그인하기
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 24px' }}>
      {/* 헤더 */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#191F28', marginBottom: 8 }}>AI 콘텐츠 생성</h1>
        <p style={{ fontSize: 14, color: '#6B7684' }}>썸네일, 카드뉴스, 영상 스토리보드를 AI로 자동 생성합니다</p>
      </div>

      {/* 포인트 표시 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 20px',
        background: '#F8F9FA',
        borderRadius: 12,
        marginBottom: 24,
      }}>
        <span style={{ fontSize: 14, color: '#6B7684' }}>보유 포인트</span>
        <div>
          <span style={{ fontSize: 20, fontWeight: 700, color: '#3182F6' }}>{currentPoints.toLocaleString()}P</span>
          <Link href="/points" style={{ marginLeft: 12, fontSize: 13, color: '#6B7684' }}>충전하기</Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* 왼쪽: 생성 옵션 */}
        <div>
          {/* 콘텐츠 타입 선택 */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#191F28', marginBottom: 12 }}>콘텐츠 유형</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {contentTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '16px',
                    background: selectedType === type.id ? '#E8F3FF' : '#fff',
                    border: selectedType === type.id ? '2px solid #3182F6' : '1px solid #E5E8EB',
                    borderRadius: 12,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{
                    width: 40,
                    height: 40,
                    background: selectedType === type.id ? '#3182F6' : '#F2F4F6',
                    color: selectedType === type.id ? '#fff' : '#6B7684',
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                    fontWeight: 700,
                  }}>
                    {type.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 15, fontWeight: 600, color: '#191F28', marginBottom: 2 }}>{type.name}</p>
                    <p style={{ fontSize: 13, color: '#6B7684', margin: 0 }}>{type.description}</p>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#3182F6' }}>{type.points}P</span>
                </button>
              ))}
            </div>
          </div>

          {/* 스타일 선택 (썸네일) */}
          {selectedType === 'thumbnail' && (
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#191F28', marginBottom: 12 }}>스타일</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                {thumbnailStyles.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStyle(s.id)}
                    style={{
                      padding: '12px 16px',
                      background: style === s.id ? '#E8F3FF' : '#fff',
                      border: style === s.id ? '2px solid #3182F6' : '1px solid #E5E8EB',
                      borderRadius: 10,
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <p style={{ fontSize: 14, fontWeight: 500, color: '#191F28', marginBottom: 2 }}>{s.name}</p>
                    <p style={{ fontSize: 12, color: '#8B95A1', margin: 0 }}>{s.ratio}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 주제 입력 */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#191F28', marginBottom: 12 }}>주제</h3>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={
                selectedType === 'thumbnail'
                  ? '예: 월급 200만원으로 1억 모으는 현실적인 방법'
                  : selectedType === 'cardnews'
                  ? '예: 초보자를 위한 주식 투자 5단계 가이드'
                  : '예: 30초 만에 설명하는 비트코인 작동 원리'
              }
              style={{
                width: '100%',
                height: 100,
                padding: 16,
                border: '1px solid #E5E8EB',
                borderRadius: 12,
                fontSize: 15,
                resize: 'none',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div style={{
              padding: '12px 16px',
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: 10,
              color: '#DC2626',
              fontSize: 14,
              marginBottom: 16,
            }}>
              {error}
            </div>
          )}

          {/* 생성 버튼 */}
          <button
            onClick={handleGenerate}
            disabled={generating || !topic.trim()}
            style={{
              width: '100%',
              padding: '16px',
              background: generating || !topic.trim() ? '#9CA3AF' : '#3182F6',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 600,
              cursor: generating || !topic.trim() ? 'not-allowed' : 'pointer',
            }}
          >
            {generating ? '생성 중...' : `${selectedContent?.name} 생성하기 (${selectedContent?.points}P)`}
          </button>
        </div>

        {/* 오른쪽: 결과 */}
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#191F28', marginBottom: 12 }}>생성 결과</h3>

          {generating && (
            <div style={{
              padding: '48px 20px',
              background: '#F8F9FA',
              borderRadius: 16,
              textAlign: 'center',
              marginBottom: 16,
            }}>
              <div style={{
                width: 40,
                height: 40,
                border: '3px solid #3182F6',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 16px',
              }} />
              <p style={{ color: '#6B7684', marginBottom: 0 }}>AI가 콘텐츠를 생성하고 있습니다...</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {results.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {results.map((result) => (
                <div
                  key={result.id}
                  style={{
                    background: '#fff',
                    border: '1px solid #E5E8EB',
                    borderRadius: 16,
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #F2F4F6' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 10px',
                      background: '#E8F3FF',
                      color: '#3182F6',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 500,
                    }}>
                      {contentTypes.find(c => c.id === result.type)?.name}
                    </span>
                    <span style={{ fontSize: 12, color: '#8B95A1', marginLeft: 8 }}>
                      {new Date(result.createdAt).toLocaleString('ko-KR')}
                    </span>
                  </div>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: result.type === 'cardnews' ? 'repeat(5, 1fr)' : '1fr',
                    gap: 2,
                  }}>
                    {result.images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`Generated ${i + 1}`}
                        style={{
                          width: '100%',
                          height: result.type === 'cardnews' ? 80 : 200,
                          objectFit: 'cover',
                          cursor: 'pointer',
                        }}
                        onClick={() => window.open(img, '_blank')}
                      />
                    ))}
                  </div>
                  <div style={{ padding: '12px 16px', display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => {
                        result.images.forEach((img, i) => {
                          const a = document.createElement('a');
                          a.href = img;
                          a.download = `${result.type}_${result.id}_${i + 1}.png`;
                          a.click();
                        });
                      }}
                      style={{
                        flex: 1,
                        padding: '10px',
                        background: '#3182F6',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        fontSize: 14,
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}
                    >
                      다운로드
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : !generating && (
            <div style={{
              padding: '60px 20px',
              background: '#F8F9FA',
              borderRadius: 16,
              textAlign: 'center',
            }}>
              <p style={{ fontSize: 40, marginBottom: 12 }}>AI</p>
              <p style={{ color: '#6B7684', marginBottom: 0 }}>
                주제를 입력하고 생성 버튼을 클릭하세요
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
