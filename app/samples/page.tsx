'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { samplePages, categoryToTopic } from '@/data/samples';

// 카테고리 필터
const categories = [
  { id: 'all', name: '전체', icon: '🏠', color: '#6366F1' },
  { id: 'education', name: '교육/강의', icon: '🎓', color: '#6366F1' },
  { id: 'consulting', name: '상담/컨설팅', icon: '💼', color: '#8B5CF6' },
  { id: 'service', name: '서비스/대행', icon: '🛠️', color: '#EC4899' },
  { id: 'product', name: '상품/판매', icon: '🛒', color: '#10B981' },
  { id: 'event', name: '이벤트/모집', icon: '🎉', color: '#F59E0B' },
  { id: 'realestate', name: '부동산/분양', icon: '🏢', color: '#EF4444' },
  { id: 'franchise', name: '프랜차이즈/창업', icon: '🍗', color: '#EA580C' },
  { id: 'interior', name: '인테리어/시공', icon: '🏠', color: '#78716C' },
];

export default function SamplesPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredSample, setHoveredSample] = useState<string | null>(null);

  const filteredSamples = selectedCategory === 'all'
    ? samplePages
    : samplePages.filter(s => s.category === selectedCategory);

  // 샘플로 만들기 클릭 - 로그인 확인 후 샘플 ID를 URL 파라미터로 전달
  const handleUseSample = (sample: typeof samplePages[0]) => {
    const topic = categoryToTopic[sample.category] || 'free';
    const targetUrl = `/create/${topic}?sample=${sample.id}`;

    if (!session) {
      // 로그인 안 됨 - 로그인 페이지로 이동 (콜백 URL 포함)
      router.push(`/login?callbackUrl=${encodeURIComponent(targetUrl)}`);
      return;
    }

    router.push(targetUrl);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB' }}>
      {/* 헤더 */}
      <header style={{
        padding: '16px 24px',
        background: '#fff',
        borderBottom: '1px solid #EFEFEF',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a href="/" style={{ fontSize: '20px', fontWeight: '800', color: '#191919', textDecoration: 'none' }}>
              랜딩메이커 <span style={{ fontSize: '10px', color: '#6366F1', marginLeft: '4px' }}>v2.3</span>
            </a>
            <span style={{ color: '#E5E7EB' }}>|</span>
            <span style={{ fontSize: '16px', fontWeight: '600', color: '#6B7280' }}>샘플 갤러리</span>
          </div>
          <button
            onClick={() => router.push('/create/free')}
            style={{
              padding: '10px 24px',
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            무료로 만들기
          </button>
        </div>
      </header>

      {/* 히어로 */}
      <section style={{
        padding: '60px 24px 40px',
        background: 'linear-gradient(180deg, #fff 0%, #F9FAFB 100%)',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: '36px',
          fontWeight: '800',
          color: '#191919',
          marginBottom: '12px',
        }}>
          업종별 랜딩페이지 샘플
        </h1>
        <p style={{
          fontSize: '16px',
          color: '#6B7280',
          marginBottom: '40px',
        }}>
          다양한 업종과 테마의 랜딩페이지를 미리 확인하고 마음에 드는 스타일로 시작하세요
        </p>

        {/* 카테고리 필터 */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          flexWrap: 'wrap',
        }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: '600',
                background: selectedCategory === cat.id ? cat.color : '#fff',
                color: selectedCategory === cat.id ? '#fff' : '#374151',
                border: `2px solid ${selectedCategory === cat.id ? cat.color : '#E5E7EB'}`,
                borderRadius: '24px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* 샘플 그리드 */}
      <section style={{ padding: '40px 24px 80px' }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
            gap: '32px',
          }}>
            {filteredSamples.map((sample) => (
              <div
                key={sample.id}
                onMouseEnter={() => setHoveredSample(sample.id)}
                onMouseLeave={() => setHoveredSample(null)}
                style={{
                  background: '#fff',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: hoveredSample === sample.id
                    ? '0 20px 40px rgba(0,0,0,0.15)'
                    : '0 4px 20px rgba(0,0,0,0.08)',
                  transform: hoveredSample === sample.id ? 'translateY(-8px)' : 'translateY(0)',
                  transition: 'all 0.3s ease',
                }}
              >
                {/* 미리보기 영역 */}
                <div style={{
                  background: `linear-gradient(135deg, ${sample.themeColor} 0%, ${adjustColor(sample.themeColor, 30)} 100%)`,
                  padding: '32px 24px',
                  position: 'relative',
                  height: '260px',
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                  {/* 배지 */}
                  <div style={{
                    display: 'inline-block',
                    padding: '5px 12px',
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: '20px',
                    marginBottom: '16px',
                    alignSelf: 'flex-start',
                  }}>
                    <span style={{ color: '#fff', fontSize: '12px', fontWeight: '600' }}>
                      {sample.preview.badge}
                    </span>
                  </div>

                  {/* 헤드라인 */}
                  <h2 style={{
                    fontSize: '22px',
                    fontWeight: '800',
                    color: '#fff',
                    lineHeight: 1.35,
                    marginBottom: '10px',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical' as const,
                  }}>
                    {sample.preview.headline}
                  </h2>

                  {/* 서브텍스트 */}
                  <p style={{
                    fontSize: '14px',
                    color: 'rgba(255,255,255,0.9)',
                    lineHeight: 1.5,
                    marginBottom: '16px',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical' as const,
                    flex: 1,
                  }}>
                    {sample.preview.subtext}
                  </p>

                  {/* CTA 버튼 */}
                  <button style={{
                    padding: '10px 24px',
                    background: '#fff',
                    color: sample.themeColor,
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    alignSelf: 'flex-start',
                    marginTop: 'auto',
                  }}>
                    {sample.preview.cta}
                  </button>

                  {/* 테마 색상 표시 */}
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: sample.themeColor,
                    }} />
                  </div>
                </div>

                {/* 정보 영역 */}
                <div style={{ padding: '24px' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <span style={{
                      fontSize: '12px',
                      color: sample.themeColor,
                      fontWeight: '600',
                    }}>
                      {sample.categoryName}
                    </span>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#191919',
                      margin: '4px 0 8px',
                    }}>
                      {sample.name}
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      color: '#6B7280',
                      margin: 0,
                    }}>
                      {sample.description}
                    </p>
                  </div>
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                  }}>
                    <button
                      onClick={() => router.push(`/samples/${sample.id}`)}
                      style={{
                        padding: '10px 20px',
                        background: '#F3F4F6',
                        color: '#374151',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      미리보기
                    </button>
                    <button
                      onClick={() => handleUseSample(sample)}
                      style={{
                        padding: '10px 20px',
                        background: `linear-gradient(135deg, ${sample.themeColor} 0%, ${adjustColor(sample.themeColor, -20)} 100%)`,
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        boxShadow: `0 4px 12px ${sample.themeColor}40`,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      이 샘플로 시작
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '60px 24px',
        background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
        textAlign: 'center',
      }}>
        <h2 style={{
          fontSize: '28px',
          fontWeight: '800',
          color: '#fff',
          marginBottom: '12px',
        }}>
          마음에 드는 스타일을 찾으셨나요?
        </h2>
        <p style={{
          fontSize: '16px',
          color: 'rgba(255,255,255,0.9)',
          marginBottom: '24px',
        }}>
          지금 바로 나만의 랜딩페이지를 만들어보세요
        </p>
        <button
          onClick={() => router.push('/create/free')}
          style={{
            padding: '16px 48px',
            background: '#fff',
            color: '#6366F1',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer',
          }}
        >
          7일 무료로 시작하기
        </button>
      </section>

      {/* 푸터 */}
      <footer style={{
        padding: '40px 24px',
        background: '#191919',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
          © 2026 랜딩메이커. AI로 더 쉽게 만드는 랜딩페이지.
        </p>
      </footer>
    </div>
  );
}

// 색상 밝기 조절 헬퍼 함수
function adjustColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return '#' + (
    0x1000000 +
    (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)
  ).toString(16).slice(1);
}
