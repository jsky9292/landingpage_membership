import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = '랜딩메이커 - 2줄로 만드는 DB 수집 랜딩페이지';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
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
          background: 'linear-gradient(135deg, #3182F6 0%, #1E6DE8 50%, #0052CC 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '40px',
          }}
        >
          <div
            style={{
              fontSize: '72px',
              fontWeight: 800,
              color: '#fff',
              marginBottom: '20px',
              lineHeight: 1.2,
            }}
          >
            2줄만 입력하면
          </div>
          <div
            style={{
              fontSize: '72px',
              fontWeight: 800,
              color: '#FFE066',
              marginBottom: '40px',
              lineHeight: 1.2,
            }}
          >
            고객 DB가 쏟아집니다
          </div>
          <div
            style={{
              fontSize: '32px',
              color: 'rgba(255,255,255,0.9)',
              marginBottom: '60px',
            }}
          >
            AI가 30초만에 고퀄리티 랜딩페이지 생성
          </div>
          <div
            style={{
              fontSize: '40px',
              fontWeight: 700,
              color: '#fff',
              background: 'rgba(255,255,255,0.2)',
              padding: '16px 40px',
              borderRadius: '16px',
            }}
          >
            랜딩메이커
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
