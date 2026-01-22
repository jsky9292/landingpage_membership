import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0F172A',
          position: 'relative',
        }}
      >
        {/* 배경 그라데이션 원 */}
        <div
          style={{
            position: 'absolute',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)',
            top: '-100px',
            right: '-100px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)',
            bottom: '-50px',
            left: '-50px',
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '60px',
            zIndex: 1,
          }}
        >
          {/* 로고 */}
          <div
            style={{
              fontSize: '28px',
              fontWeight: 600,
              color: '#6366F1',
              marginBottom: '40px',
              letterSpacing: '-0.5px',
            }}
          >
            랜딩메이커
          </div>

          {/* 메인 타이틀 */}
          <div
            style={{
              fontSize: '64px',
              fontWeight: 700,
              color: '#F8FAFC',
              marginBottom: '16px',
              lineHeight: 1.2,
              letterSpacing: '-2px',
            }}
          >
            2줄만 입력하면
          </div>
          <div
            style={{
              fontSize: '64px',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A855F7 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              marginBottom: '32px',
              lineHeight: 1.2,
              letterSpacing: '-2px',
            }}
          >
            고객 DB가 쏟아집니다
          </div>

          {/* 서브 텍스트 */}
          <div
            style={{
              fontSize: '24px',
              color: '#94A3B8',
              letterSpacing: '-0.5px',
            }}
          >
            AI가 30초만에 랜딩페이지 자동 생성
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
