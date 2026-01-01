'use client';

import { InlineCTAContent, ThemeType, SectionStyle } from '@/types/page';
import { THEMES } from '@/config/themes';

interface InlineCTASectionProps {
  content: InlineCTAContent;
  theme?: ThemeType;
  style?: SectionStyle;
  isEditable?: boolean;
  onEdit?: (content: InlineCTAContent) => void;
  onCTAClick?: () => void;
}

export function InlineCTASection({ content, theme = 'toss', style, onCTAClick }: InlineCTASectionProps) {
  const colors = THEMES[theme]?.colors || THEMES.toss.colors;
  const buttonStyle = content.style || 'primary';
  const buttonSize = content.size || 'medium';

  const getSizeStyles = () => {
    switch (buttonSize) {
      case 'small':
        return { padding: '12px 24px', fontSize: '14px' };
      case 'large':
        return { padding: '20px 48px', fontSize: '18px' };
      default:
        return { padding: '16px 36px', fontSize: '16px' };
    }
  };

  const getButtonStyles = () => {
    const sizeStyles = getSizeStyles();
    const baseStyles = {
      ...sizeStyles,
      fontWeight: '700',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      width: content.fullWidth ? '100%' : 'auto',
    };

    switch (buttonStyle) {
      case 'secondary':
        return {
          ...baseStyles,
          background: colors.primaryLight,
          color: colors.primary,
          border: 'none',
        };
      case 'outline':
        return {
          ...baseStyles,
          background: 'transparent',
          color: colors.primary,
          border: `2px solid ${colors.primary}`,
        };
      default:
        return {
          ...baseStyles,
          background: colors.primary,
          color: '#fff',
          border: 'none',
        };
    }
  };

  return (
    <div
      style={{
        padding: '32px 24px',
        textAlign: 'center',
        background: colors.background,
      }}
    >
      {content.subtitle && (
        <p
          style={{
            fontSize: '14px',
            color: colors.textMuted,
            marginBottom: '12px',
            marginTop: 0,
          }}
        >
          {content.subtitle}
        </p>
      )}
      <button
        onClick={onCTAClick}
        style={getButtonStyles() as React.CSSProperties}
      >
        {content.buttonText || '신청하기'}
      </button>
    </div>
  );
}
