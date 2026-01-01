'use client';

import { InlineImageContent, ThemeType, SectionStyle } from '@/types/page';
import { THEMES } from '@/config/themes';

interface InlineImageSectionProps {
  content: InlineImageContent;
  theme?: ThemeType;
  style?: SectionStyle;
  isEditable?: boolean;
  onEdit?: (content: InlineImageContent) => void;
}

export function InlineImageSection({ content, theme = 'toss', style }: InlineImageSectionProps) {
  const colors = THEMES[theme]?.colors || THEMES.toss.colors;

  const getSizeStyles = () => {
    switch (content.size) {
      case 'small':
        return { maxWidth: '300px' };
      case 'medium':
        return { maxWidth: '500px' };
      case 'large':
        return { maxWidth: '800px' };
      default:
        return { maxWidth: '100%' };
    }
  };

  const getAlignStyles = (): React.CSSProperties => {
    switch (content.alignment) {
      case 'left':
        return { justifyContent: 'flex-start' };
      case 'right':
        return { justifyContent: 'flex-end' };
      default:
        return { justifyContent: 'center' };
    }
  };

  if (!content.imageUrl) {
    return (
      <div
        style={{
          padding: '48px 24px',
          textAlign: 'center',
          color: colors.textMuted,
          background: colors.background,
        }}
      >
        이미지 URL을 입력해주세요
      </div>
    );
  }

  return (
    <div
      style={{
        padding: '24px',
        display: 'flex',
        background: colors.background,
        ...getAlignStyles(),
      }}
    >
      <figure
        style={{
          margin: 0,
          ...getSizeStyles(),
        }}
      >
        <img
          src={content.imageUrl}
          alt={content.alt || ''}
          style={{
            width: '100%',
            height: 'auto',
            borderRadius: '12px',
            display: 'block',
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" fill="%23f3f4f6"><rect width="100%" height="100%"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%239ca3af">이미지를 불러올 수 없습니다</text></svg>';
          }}
        />
        {content.caption && (
          <figcaption
            style={{
              marginTop: '12px',
              fontSize: '14px',
              color: colors.textMuted,
              textAlign: 'center',
            }}
          >
            {content.caption}
          </figcaption>
        )}
      </figure>
    </div>
  );
}
