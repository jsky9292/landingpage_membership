'use client';

import { InlineCTAContent, ThemeType, SectionStyle } from '@/types/page';

interface InlineCTASectionProps {
  content: InlineCTAContent;
  theme?: ThemeType;
  style?: SectionStyle;
  isEditable?: boolean;
  onEdit?: (content: InlineCTAContent) => void;
  onCTAClick?: () => void;
}

const themeColors: Record<string, { primary: string; secondary: string }> = {
  toss: { primary: '#0064FF', secondary: '#E8F3FF' },
  dark: { primary: '#6366F1', secondary: '#1E1B4B' },
  warm: { primary: '#F97316', secondary: '#FFF7ED' },
  luxury: { primary: '#D4AF37', secondary: '#1C1C1C' },
  peach: { primary: '#EC4899', secondary: '#FCE7F3' },
};

export function InlineCTASection({ content, theme = 'toss', isEditable, onEdit, onCTAClick }: InlineCTASectionProps) {
  const colors = themeColors[theme] || themeColors.toss;
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
          background: colors.secondary,
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
      }}
    >
      {content.subtitle && (
        <p
          style={{
            fontSize: '14px',
            color: '#6B7280',
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
