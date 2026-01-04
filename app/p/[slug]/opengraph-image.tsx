/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from 'next/og';

export const alt = '랜딩페이지';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  const title = '랜딩페이지';
  const subtitle = '지금 바로 확인해보세요';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F8FAFC',
          fontFamily: 'sans-serif',
        }}
      >
        {/* 상단 악센트 바 */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '8px',
            background: '#0064FF',
          }}
        />

        {/* 메인 컨텐츠 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 80px',
            maxWidth: '1000px',
          }}
        >
          {/* 제목 */}
          <div
            style={{
              fontSize: 56,
              fontWeight: 'bold',
              color: '#191F28',
              textAlign: 'center',
              lineHeight: 1.3,
              marginBottom: subtitle ? 24 : 0,
            }}
          >
            {title.length > 35 ? title.slice(0, 35) + '...' : title}
          </div>

          {/* 부제목 */}
          {subtitle && (
            <div
              style={{
                fontSize: 26,
                color: '#4E5968',
                textAlign: 'center',
                lineHeight: 1.5,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>

        {/* 하단 브랜딩 */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            alignItems: 'center',
            color: '#8B95A1',
            fontSize: 18,
          }}
        >
          랜딩AI
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
