'use client';

import { ThemeType } from '@/types/page';

interface ThemeSelectorProps {
  currentTheme: ThemeType;
  onThemeChange: (theme: ThemeType) => void;
}

interface ThemeOption {
  id: ThemeType;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
}

const themeOptions: ThemeOption[] = [
  {
    id: 'toss',
    name: '토스 블루',
    description: '깔끔하고 신뢰감 있는 파란색',
    colors: {
      primary: '#0064FF',
      secondary: '#E8F3FF',
      accent: '#3182F6',
      background: '#FFFFFF',
    },
  },
  {
    id: 'dark',
    name: '다크 모드',
    description: '세련된 어두운 테마',
    colors: {
      primary: '#6366F1',
      secondary: '#1E1B4B',
      accent: '#818CF8',
      background: '#0F0F23',
    },
  },
  {
    id: 'warm',
    name: '웜 오렌지',
    description: '따뜻하고 활기찬 느낌',
    colors: {
      primary: '#F97316',
      secondary: '#FFF7ED',
      accent: '#FB923C',
      background: '#FFFFFF',
    },
  },
  {
    id: 'luxury',
    name: '럭셔리 골드',
    description: '고급스럽고 프리미엄한 느낌',
    colors: {
      primary: '#D4AF37',
      secondary: '#1C1C1C',
      accent: '#FFD700',
      background: '#0A0A0A',
    },
  },
  {
    id: 'peach',
    name: '피치 핑크',
    description: '부드럽고 친근한 느낌',
    colors: {
      primary: '#EC4899',
      secondary: '#FCE7F3',
      accent: '#F472B6',
      background: '#FFFFFF',
    },
  },
];

export function ThemeSelector({ currentTheme, onThemeChange }: ThemeSelectorProps) {
  return (
    <div style={{
      padding: '20px',
      height: '100%',
      overflowY: 'auto',
    }}>
      <h3 style={{
        fontSize: '16px',
        fontWeight: '700',
        color: '#191F28',
        marginBottom: '8px',
        marginTop: 0,
      }}>
        🎨 톤앤매너 선택
      </h3>
      <p style={{
        fontSize: '13px',
        color: '#6B7280',
        marginBottom: '20px',
      }}>
        전체 페이지의 색상 테마를 변경합니다
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {themeOptions.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onThemeChange(theme.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '14px 16px',
              background: currentTheme === theme.id ? '#F0F7FF' : '#F8FAFC',
              border: currentTheme === theme.id ? '2px solid #0064FF' : '2px solid transparent',
              borderRadius: '12px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease',
            }}
          >
            {/* 색상 프리뷰 */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
            }}>
              <div style={{
                display: 'flex',
                gap: '2px',
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '6px 0 0 0',
                  background: theme.colors.primary,
                }} />
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '0 6px 0 0',
                  background: theme.colors.accent,
                }} />
              </div>
              <div style={{
                display: 'flex',
                gap: '2px',
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '0 0 0 6px',
                  background: theme.colors.secondary,
                  border: theme.colors.secondary === '#FFFFFF' ? '1px solid #E5E8EB' : 'none',
                }} />
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '0 0 6px 0',
                  background: theme.colors.background,
                  border: theme.colors.background === '#FFFFFF' ? '1px solid #E5E8EB' : 'none',
                }} />
              </div>
            </div>

            {/* 테마 정보 */}
            <div style={{ flex: 1 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '4px',
              }}>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#191F28',
                }}>
                  {theme.name}
                </span>
                {currentTheme === theme.id && (
                  <span style={{
                    fontSize: '11px',
                    padding: '2px 8px',
                    background: '#0064FF',
                    color: '#fff',
                    borderRadius: '10px',
                    fontWeight: '600',
                  }}>
                    적용중
                  </span>
                )}
              </div>
              <p style={{
                fontSize: '12px',
                color: '#6B7280',
                margin: 0,
              }}>
                {theme.description}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* 현재 테마 미리보기 */}
      <div style={{
        marginTop: '24px',
        padding: '16px',
        background: '#F8FAFC',
        borderRadius: '12px',
      }}>
        <p style={{
          fontSize: '13px',
          fontWeight: '600',
          color: '#333D4B',
          marginBottom: '12px',
          marginTop: 0,
        }}>
          미리보기
        </p>
        {(() => {
          const theme = themeOptions.find(t => t.id === currentTheme) || themeOptions[0];
          return (
            <div style={{
              background: theme.colors.background,
              borderRadius: '8px',
              padding: '16px',
              border: theme.colors.background === '#FFFFFF' ? '1px solid #E5E8EB' : 'none',
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: '700',
                color: theme.colors.primary,
                marginBottom: '8px',
              }}>
                샘플 헤드라인
              </div>
              <div style={{
                fontSize: '12px',
                color: theme.id === 'dark' || theme.id === 'luxury' ? '#A0AEC0' : '#4E5968',
                marginBottom: '12px',
              }}>
                이것은 서브 텍스트 예시입니다
              </div>
              <button style={{
                padding: '8px 16px',
                background: theme.colors.primary,
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600',
              }}>
                버튼 예시
              </button>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
