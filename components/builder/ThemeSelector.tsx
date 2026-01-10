'use client';

import { useState } from 'react';
import { ThemeType } from '@/types/page';
import { THEMES } from '@/config/themes';

export interface CustomColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

interface ThemeSelectorProps {
  currentTheme: ThemeType;
  customColors?: CustomColors;
  onThemeChange: (theme: ThemeType) => void;
  onCustomColorsChange?: (colors: CustomColors) => void;
}

interface ThemeCategory {
  name: string;
  themes: ThemeType[];
}

const themeCategories: ThemeCategory[] = [
  {
    name: '라이트',
    themes: ['toss', 'minimal', 'corporate', 'ocean', 'forest', 'sunset', 'grape', 'peach', 'warm', 'slate'],
  },
  {
    name: '다크',
    themes: ['dark', 'midnight', 'neon', 'luxury'],
  },
];

const defaultCustomColors: CustomColors = {
  primary: '#0891B2',
  secondary: '#2563EB',
  accent: '#06B6D4',
  background: '#F8FAFC',
  text: '#0F172A',
};

export function ThemeSelector({
  currentTheme,
  customColors = defaultCustomColors,
  onThemeChange,
  onCustomColorsChange
}: ThemeSelectorProps) {
  const [colors, setColors] = useState<CustomColors>(customColors);
  const [activeCategory, setActiveCategory] = useState<'light' | 'dark'>('light');

  const handleColorChange = (key: keyof CustomColors, value: string) => {
    const newColors = { ...colors, [key]: value };
    setColors(newColors);
    onCustomColorsChange?.(newColors);
  };

  const displayThemes = activeCategory === 'light'
    ? themeCategories[0].themes
    : themeCategories[1].themes;

  return (
    <div style={{
      padding: '20px',
      height: '100%',
      overflowY: 'auto',
    }}>
      {/* 카테고리 탭 */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '20px',
        background: '#F3F4F6',
        padding: '4px',
        borderRadius: '10px',
      }}>
        <button
          onClick={() => setActiveCategory('light')}
          style={{
            flex: 1,
            padding: '10px 16px',
            fontSize: '13px',
            fontWeight: '600',
            background: activeCategory === 'light' ? '#fff' : 'transparent',
            color: activeCategory === 'light' ? '#191F28' : '#6B7280',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: activeCategory === 'light' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          ☀️ 라이트
        </button>
        <button
          onClick={() => setActiveCategory('dark')}
          style={{
            flex: 1,
            padding: '10px 16px',
            fontSize: '13px',
            fontWeight: '600',
            background: activeCategory === 'dark' ? '#fff' : 'transparent',
            color: activeCategory === 'dark' ? '#191F28' : '#6B7280',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: activeCategory === 'dark' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          🌙 다크
        </button>
      </div>

      {/* 테마 그리드 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px',
        marginBottom: '24px',
      }}>
        {displayThemes.map((themeId) => {
          const theme = THEMES[themeId];
          if (!theme) return null;

          const isSelected = currentTheme === themeId;
          const isDarkTheme = ['dark', 'midnight', 'neon', 'luxury'].includes(themeId);

          return (
            <button
              key={themeId}
              onClick={() => onThemeChange(themeId)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                padding: '0',
                background: 'transparent',
                border: isSelected ? '2px solid #0064FF' : '2px solid #E5E8EB',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                overflow: 'hidden',
                transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                boxShadow: isSelected ? '0 4px 12px rgba(0, 100, 255, 0.2)' : '0 2px 4px rgba(0,0,0,0.05)',
              }}
            >
              {/* 미니 프리뷰 */}
              <div style={{
                padding: '12px',
                background: theme.colors.gradient || theme.colors.background,
                minHeight: '80px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}>
                {/* 헤드라인 프리뷰 */}
                <div style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  color: theme.colors.text,
                  lineHeight: 1.3,
                }}>
                  샘플 헤드라인
                </div>
                {/* 서브텍스트 프리뷰 */}
                <div style={{
                  fontSize: '9px',
                  color: theme.colors.textSecondary,
                  lineHeight: 1.4,
                }}>
                  서브 텍스트 예시입니다
                </div>
                {/* 버튼 프리뷰 */}
                <div style={{
                  marginTop: 'auto',
                  padding: '6px 10px',
                  background: theme.colors.primary,
                  color: isDarkTheme && themeId !== 'neon' ? '#000' : '#fff',
                  borderRadius: '6px',
                  fontSize: '9px',
                  fontWeight: '600',
                  textAlign: 'center',
                  alignSelf: 'flex-start',
                }}>
                  신청하기
                </div>
              </div>

              {/* 테마 정보 */}
              <div style={{
                padding: '10px 12px',
                background: isSelected ? '#F0F7FF' : '#FAFAFA',
                borderTop: '1px solid #E5E8EB',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <div>
                    <div style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: isSelected ? '#0064FF' : '#191F28',
                      marginBottom: '2px',
                    }}>
                      {theme.name}
                    </div>
                    <div style={{
                      fontSize: '10px',
                      color: '#8B95A1',
                    }}>
                      {theme.description.slice(0, 15)}...
                    </div>
                  </div>
                  {/* 컬러 팔레트 */}
                  <div style={{
                    display: 'flex',
                    gap: '3px',
                  }}>
                    <div style={{
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      background: theme.colors.primary,
                      border: '1px solid rgba(0,0,0,0.1)',
                    }} />
                    <div style={{
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      background: theme.colors.background,
                      border: '1px solid rgba(0,0,0,0.1)',
                    }} />
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* 현재 선택된 테마 정보 */}
      {THEMES[currentTheme] && (
        <div style={{
          padding: '16px',
          background: 'linear-gradient(135deg, #F0F7FF 0%, #E8F3FF 100%)',
          borderRadius: '12px',
          marginBottom: '24px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '8px',
          }}>
            <span style={{ fontSize: '16px' }}>✓</span>
            <span style={{
              fontSize: '14px',
              fontWeight: '700',
              color: '#0064FF',
            }}>
              {THEMES[currentTheme].name}
            </span>
          </div>
          <p style={{
            fontSize: '12px',
            color: '#4E5968',
            margin: 0,
            lineHeight: 1.5,
          }}>
            {THEMES[currentTheme].description}
          </p>
        </div>
      )}

      {/* 커스텀 컬러 섹션 */}
      <details style={{ marginBottom: '16px' }}>
        <summary style={{
          fontSize: '14px',
          fontWeight: '600',
          color: '#191F28',
          cursor: 'pointer',
          padding: '12px 0',
          borderTop: '1px solid #E5E8EB',
        }}>
          🎨 커스텀 컬러 (고급)
        </summary>

        <div style={{
          paddingTop: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}>
          <ColorInput
            label="주요 색상"
            value={colors.primary}
            onChange={(v) => handleColorChange('primary', v)}
          />
          <ColorInput
            label="보조 색상"
            value={colors.secondary}
            onChange={(v) => handleColorChange('secondary', v)}
          />
          <ColorInput
            label="배경 색상"
            value={colors.background}
            onChange={(v) => handleColorChange('background', v)}
          />
          <ColorInput
            label="텍스트 색상"
            value={colors.text}
            onChange={(v) => handleColorChange('text', v)}
          />
        </div>
      </details>
    </div>
  );
}

// 컬러 입력 컴포넌트
function ColorInput({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label style={{
        display: 'block',
        fontSize: '13px',
        color: '#6B7280',
        marginBottom: '8px',
      }}>
        {label}
      </label>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: '#F8FAFC',
        borderRadius: '8px',
        padding: '4px',
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          background: value,
          border: '1px solid #E5E8EB',
          flexShrink: 0,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: 0,
              cursor: 'pointer',
            }}
          />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          style={{
            flex: 1,
            padding: '10px',
            border: '1px solid #E5E8EB',
            borderRadius: '8px',
            fontSize: '13px',
            fontFamily: 'monospace',
            background: '#fff',
            color: '#191F28',
          }}
        />
      </div>
    </div>
  );
}
