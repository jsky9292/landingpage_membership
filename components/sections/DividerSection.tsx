'use client';

import { DividerContent, ThemeType, SectionStyle } from '@/types/page';

interface DividerSectionProps {
  content: DividerContent;
  theme?: ThemeType;
  style?: SectionStyle;
  isEditable?: boolean;
  onEdit?: (content: DividerContent) => void;
}

export function DividerSection({ content, theme = 'toss', isEditable, onEdit }: DividerSectionProps) {
  const spacing = content.spacing || 40;
  const color = content.color || '#E5E8EB';
  const dividerStyle = content.style || 'line';

  const renderDivider = () => {
    switch (dividerStyle) {
      case 'dots':
        return (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: color,
                }}
              />
            ))}
          </div>
        );
      case 'space':
        return null;
      default:
        return (
          <hr
            style={{
              border: 'none',
              borderTop: `${content.thickness || 1}px solid ${color}`,
              margin: 0,
              width: '100%',
              maxWidth: '200px',
            }}
          />
        );
    }
  };

  return (
    <div
      style={{
        padding: `${spacing}px 24px`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {renderDivider()}
    </div>
  );
}
