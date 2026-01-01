'use client';

import { HeroContent, ThemeType, SectionStyle } from '@/types/page';
import { THEMES } from '@/config/themes';

interface HeroSectionProps {
  content: HeroContent;
  theme?: ThemeType;
  style?: SectionStyle;
  isEditable?: boolean;
  onEdit?: (content: HeroContent) => void;
  onCTAClick?: () => void;
}

export function HeroSection({ content, theme = 'toss', style, isEditable, onEdit, onCTAClick }: HeroSectionProps) {
  const themeConfig = THEMES[theme];
  const colors = themeConfig.colors;
  const titleSize = style?.titleFontSize || 36;
  const textSize = style?.textFontSize || 18;

  // peach 테마일 때 그라데이션 배경 사용
  const backgroundStyle = colors.gradient
    ? { background: colors.gradient }
    : { background: `linear-gradient(to bottom, ${colors.primaryLight}, ${colors.background})` };

  return (
    <>
      <style>{`
        .hero-headline {
          font-size: ${titleSize}px;
          font-weight: bold;
          color: ${colors.text};
          line-height: 1.35;
          margin-bottom: 16px;
          word-break: keep-all;
          overflow-wrap: break-word;
          text-wrap: balance;
        }
        .hero-subtext {
          font-size: ${textSize}px;
          color: ${colors.textSecondary};
          margin-bottom: 32px;
          line-height: 1.7;
          white-space: pre-line;
          word-break: keep-all;
          text-wrap: balance;
        }
        .hero-cta {
          width: 100%;
          padding: 16px 24px;
          font-size: clamp(15px, 4vw, 18px);
          font-weight: 600;
          color: #fff;
          background: ${colors.primary};
          border: none;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 12px ${colors.primary}40;
        }
        .hero-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px ${colors.primary}50;
        }
      `}</style>
      <section style={{
        ...backgroundStyle,
        padding: 'clamp(48px, 10vw, 80px) 20px',
      }}>
        <div style={{ maxWidth: '480px', margin: '0 auto', textAlign: 'center' }}>
          {content.badge && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '10px 20px',
              background: colors.primary,
              color: '#fff',
              fontSize: 'clamp(12px, 3.5vw, 14px)',
              fontWeight: '600',
              borderRadius: '24px',
              marginBottom: '28px',
              boxShadow: `0 2px 8px ${colors.primary}30`,
            }}>
              {content.badge}
            </div>
          )}

          <h1 className="hero-headline">
            {content.headline}
          </h1>

          <p className="hero-subtext">
            {content.subtext}
          </p>

          <button className="hero-cta" onClick={onCTAClick}>
            {content.cta}
          </button>
        </div>
      </section>
    </>
  );
}
