'use client';

import { useParams, useRouter } from 'next/navigation';
import { getSampleById, categoryToTopic } from '@/data/samples';
import { SectionRenderer } from '@/components/sections/SectionRenderer';
import { ThemeType } from '@/types/page';

export default function SamplePreviewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const sample = getSampleById(id);

  if (!sample) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#F8FAFC',
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '48px', marginBottom: '16px' }}>😢</p>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: '#191F28' }}>
            샘플을 찾을 수 없습니다
          </h1>
          <button
            onClick={() => router.push('/samples')}
            style={{
              marginTop: '24px',
              padding: '14px 28px',
              background: '#0064FF',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            샘플 목록으로
          </button>
        </div>
      </div>
    );
  }

  const { themeColor } = sample;
  const topic = categoryToTopic[sample.category] || 'free';

  // sections가 있으면 SectionRenderer로 실제 랜딩페이지 모습을 보여줌
  const hasSections = sample.sections && sample.sections.length > 0;

  return (
    <div style={{ minHeight: '100vh', background: '#F2F4F6' }}>
      {/* 플로팅 네비게이션 */}
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        right: '20px',
        zIndex: 100,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <button
          onClick={() => router.back()}
          style={{
            padding: '10px 20px',
            background: 'rgba(255,255,255,0.95)',
            color: '#374151',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          ← 목록으로
        </button>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => router.push(`/create/${topic}?sample=${id}`)}
            style={{
              padding: '12px 24px',
              background: '#fff',
              color: themeColor,
              border: `2px solid ${themeColor}`,
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            내 정보로 수정하기
          </button>
          {hasSections && (
            <button
              onClick={() => router.push(`/create/${topic}?sample=${id}&direct=true`)}
              style={{
                padding: '12px 24px',
                background: themeColor,
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              }}
            >
              바로 사용하기 →
            </button>
          )}
        </div>
      </div>

      {/* 샘플 정보 배너 */}
      <div style={{
        background: `linear-gradient(135deg, ${themeColor} 0%, ${themeColor}CC 100%)`,
        padding: '80px 24px 24px',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-block',
          padding: '6px 16px',
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '20px',
          marginBottom: '12px',
        }}>
          <span style={{ color: '#fff', fontSize: '13px', fontWeight: '600' }}>
            {sample.categoryName}
          </span>
        </div>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '800',
          color: '#fff',
          marginBottom: '8px',
        }}>
          {sample.name}
        </h1>
        <p style={{
          fontSize: '15px',
          color: 'rgba(255,255,255,0.9)',
        }}>
          {sample.description}
        </p>
      </div>

      {/* 미리보기 영역 */}
      <div style={{
        padding: '24px',
        display: 'flex',
        justifyContent: 'center',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '430px',
          background: '#fff',
          borderRadius: '24px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          overflow: 'hidden',
        }}>
          {hasSections ? (
            // sections가 있으면 SectionRenderer로 실제 랜딩페이지 모습 표시
            <SectionRenderer
              sections={sample.sections!}
              formFields={sample.formFields || [
                { id: 'name', label: '이름', type: 'text', placeholder: '이름을 입력하세요', required: true },
                { id: 'phone', label: '연락처', type: 'tel', placeholder: '010-0000-0000', required: true },
              ]}
              theme={(sample.theme as ThemeType) || 'toss'}
              isEditable={false}
              onFormSubmit={(data) => {
                alert('샘플 미리보기에서는 폼 제출이 작동하지 않습니다');
              }}
            />
          ) : (
            // sections가 없으면 preview 데이터로 간단한 미리보기 표시
            <FallbackPreview sample={sample} />
          )}
        </div>
      </div>

      {/* 하단 CTA */}
      <div style={{
        padding: '24px',
        background: '#fff',
        borderTop: '1px solid #E5E8EB',
        position: 'sticky',
        bottom: 0,
        textAlign: 'center',
      }}>
        <p style={{
          fontSize: '14px',
          color: '#6B7280',
          marginBottom: '16px',
        }}>
          이 스타일이 마음에 드시나요?
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={() => router.push(`/create/${topic}?sample=${id}`)}
            style={{
              padding: '14px 32px',
              background: '#fff',
              color: themeColor,
              border: `2px solid ${themeColor}`,
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            내 정보로 수정
          </button>
          {hasSections && (
            <button
              onClick={() => router.push(`/create/${topic}?sample=${id}&direct=true`)}
              style={{
                padding: '14px 32px',
                background: themeColor,
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              바로 사용하기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// sections가 없는 샘플을 위한 Fallback 미리보기
function FallbackPreview({ sample }: { sample: ReturnType<typeof getSampleById> }) {
  if (!sample) return null;

  const { themeColor, preview } = sample;
  const gradientEnd = themeColor + 'CC';

  return (
    <div>
      {/* 히어로 */}
      <section style={{
        background: `linear-gradient(135deg, ${themeColor} 0%, ${gradientEnd} 100%)`,
        padding: '60px 24px 48px',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-block',
          padding: '6px 16px',
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '20px',
          marginBottom: '16px',
        }}>
          <span style={{ color: '#fff', fontSize: '12px', fontWeight: '600' }}>
            {preview.badge}
          </span>
        </div>

        <h1 style={{
          fontSize: '28px',
          fontWeight: '800',
          color: '#fff',
          lineHeight: 1.3,
          marginBottom: '12px',
          whiteSpace: 'pre-line',
        }}>
          {preview.headline}
        </h1>

        <p style={{
          fontSize: '15px',
          color: 'rgba(255,255,255,0.9)',
          lineHeight: 1.6,
          marginBottom: '24px',
        }}>
          {preview.subtext}
        </p>

        <button style={{
          padding: '14px 36px',
          background: '#fff',
          color: themeColor,
          border: 'none',
          borderRadius: '10px',
          fontSize: '15px',
          fontWeight: '700',
          cursor: 'pointer',
        }}>
          {preview.cta}
        </button>
      </section>

      {/* 간단한 폼 미리보기 */}
      <section style={{
        padding: '40px 24px',
        background: '#F9FAFB',
      }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: '700',
          color: '#191F28',
          textAlign: 'center',
          marginBottom: '24px',
        }}>
          상담 신청
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            type="text"
            placeholder="이름"
            disabled
            style={{
              padding: '14px 16px',
              border: '1px solid #E5E8EB',
              borderRadius: '10px',
              fontSize: '15px',
              background: '#fff',
            }}
          />
          <input
            type="tel"
            placeholder="연락처"
            disabled
            style={{
              padding: '14px 16px',
              border: '1px solid #E5E8EB',
              borderRadius: '10px',
              fontSize: '15px',
              background: '#fff',
            }}
          />
          <button
            disabled
            style={{
              padding: '16px',
              background: themeColor,
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'not-allowed',
              opacity: 0.8,
            }}
          >
            신청하기
          </button>
        </div>
      </section>

      {/* 안내 메시지 */}
      <div style={{
        padding: '24px',
        textAlign: 'center',
        background: '#FEF3C7',
      }}>
        <p style={{
          fontSize: '14px',
          color: '#92400E',
          margin: 0,
        }}>
          💡 이 샘플은 간략 미리보기입니다.<br/>
          "내 정보로 수정하기"를 클릭하면 AI가 전체 랜딩페이지를 생성합니다.
        </p>
      </div>
    </div>
  );
}
