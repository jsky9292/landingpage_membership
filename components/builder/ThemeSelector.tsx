'use client';

import { useState } from 'react';
import { ThemeType } from '@/types/page';

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

interface PresetTheme {
  id: ThemeType;
  name: string;
  colors: [string, string]; // [primary, secondary]
}

const presetThemes: PresetTheme[] = [
  { id: 'toss', name: '시안', colors: ['#0891B2', '#06B6D4'] },
  { id: 'dark', name: '인디고', colors: ['#6366F1', '#8B5CF6'] },
  { id: 'warm', name: '에메랄드', colors: ['#10B981', '#34D399'] },
  { id: 'peach', name: '로즈', colors: ['#F43F5E', '#FB7185'] },
  { id: 'luxury', name: '앰버', colors: ['#F59E0B', '#FBBF24'] },
  { id: 'slate', name: '슬레이트', colors: ['#475569', '#64748B'] },
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
  const [borderRadius, setBorderRadius] = useState(12);

  const handleColorChange = (key: keyof CustomColors, value: string) => {
    const newColors = { ...colors, [key]: value };
    setColors(newColors);
    onCustomColorsChange?.(newColors);
  };

  return (
    <div style={{
      padding: '20px',
      height: '100%',
      overflowY: 'auto',
    }}>
      {/* 프리셋 테마 섹션 */}
      <h3 style={{
        fontSize: '14px',
        fontWeight: '600',
        color: '#191F28',
        marginBottom: '16px',
        marginTop: 0,
      }}>
        프리셋 테마
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
        marginBottom: '32px',
      }}>
        {presetThemes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onThemeChange(theme.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              padding: '16px 8px',
              background: currentTheme === theme.id ? '#F0F7FF' : '#F8FAFC',
              border: currentTheme === theme.id ? '2px solid #0064FF' : '2px solid #E5E8EB',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {/* 색상 원 2개 */}
            <div style={{ display: 'flex', gap: '4px' }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: theme.colors[0],
              }} />
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: theme.colors[1],
              }} />
            </div>
            <span style={{
              fontSize: '12px',
              fontWeight: currentTheme === theme.id ? '600' : '500',
              color: currentTheme === theme.id ? '#0064FF' : '#4E5968',
            }}>
              {theme.name}
            </span>
          </button>
        ))}
      </div>

      {/* 커스텀 컬러 섹션 */}
      <h3 style={{
        fontSize: '14px',
        fontWeight: '600',
        color: '#191F28',
        marginBottom: '16px',
      }}>
        커스텀 컬러
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
        {/* 주요 색상 */}
        <ColorInput
          label="주요 색상"
          value={colors.primary}
          onChange={(v) => handleColorChange('primary', v)}
        />

        {/* 보조 색상 */}
        <ColorInput
          label="보조 색상"
          value={colors.secondary}
          onChange={(v) => handleColorChange('secondary', v)}
        />

        {/* 강조 색상 */}
        <ColorInput
          label="강조 색상"
          value={colors.accent}
          onChange={(v) => handleColorChange('accent', v)}
        />

        {/* 배경 색상 */}
        <ColorInput
          label="배경 색상"
          value={colors.background}
          onChange={(v) => handleColorChange('background', v)}
        />

        {/* 텍스트 색상 */}
        <ColorInput
          label="텍스트 색상"
          value={colors.text}
          onChange={(v) => handleColorChange('text', v)}
        />
      </div>

      {/* 스타일 섹션 */}
      <h3 style={{
        fontSize: '14px',
        fontWeight: '600',
        color: '#191F28',
        marginBottom: '16px',
      }}>
        스타일
      </h3>

      <div style={{ marginBottom: '24px' }}>
        <label style={{
          display: 'block',
          fontSize: '13px',
          color: '#6B7280',
          marginBottom: '8px',
        }}>
          모서리 라운딩
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <input
            type="range"
            min="0"
            max="24"
            value={borderRadius}
            onChange={(e) => setBorderRadius(Number(e.target.value))}
            style={{
              flex: 1,
              height: '4px',
              background: '#E5E8EB',
              borderRadius: '2px',
              appearance: 'none',
              cursor: 'pointer',
            }}
          />
          <span style={{
            fontSize: '14px',
            fontWeight: '500',
            color: '#191F28',
            minWidth: '40px',
          }}>
            {borderRadius}px
          </span>
        </div>
      </div>

      {/* 미리보기 */}
      <div style={{
        padding: '20px',
        background: colors.background,
        borderRadius: `${borderRadius}px`,
        border: '1px solid #E5E8EB',
      }}>
        <p style={{
          fontSize: '13px',
          fontWeight: '600',
          color: '#6B7280',
          marginBottom: '12px',
          marginTop: 0,
        }}>
          미리보기
        </p>
        <div style={{
          padding: '16px',
          background: '#fff',
          borderRadius: `${borderRadius}px`,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}>
          <div style={{
            fontSize: '16px',
            fontWeight: '700',
            color: colors.primary,
            marginBottom: '8px',
          }}>
            샘플 헤드라인
          </div>
          <div style={{
            fontSize: '13px',
            color: colors.text,
            marginBottom: '16px',
            opacity: 0.7,
          }}>
            이것은 서브 텍스트 예시입니다
          </div>
          <button style={{
            padding: '10px 20px',
            background: colors.primary,
            color: '#fff',
            border: 'none',
            borderRadius: `${borderRadius}px`,
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
          }}>
            버튼 예시
          </button>
        </div>
      </div>
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
        {/* 컬러 프리뷰 박스 */}
        <div style={{
          width: '48px',
          height: '48px',
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

        {/* 헥스 코드 입력 */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          style={{
            flex: 1,
            padding: '12px',
            border: '1px solid #E5E8EB',
            borderRadius: '8px',
            fontSize: '14px',
            fontFamily: 'monospace',
            background: '#fff',
            color: '#191F28',
          }}
        />
      </div>
    </div>
  );
}
