'use client';

import { PainContent, ThemeType, SectionStyle } from '@/types/page';
import { THEMES } from '@/config/themes';

interface PainSectionProps {
  content: PainContent;
  theme?: ThemeType;
  style?: SectionStyle;
  isEditable?: boolean;
  onEdit?: (content: PainContent) => void;
}

export function PainSection({ content, theme = 'toss', style }: PainSectionProps) {
  const themeConfig = THEMES[theme];
  const colors = themeConfig.colors;
  const titleSize = style?.titleFontSize || 28;
  const textSize = style?.textFontSize || 16;

  return (
    <>
      <style>{`
        .pain-title {
          font-size: ${titleSize}px;
          font-weight: bold;
          color: ${colors.text};
          margin-bottom: 32px;
          line-height: 1.4;
          word-break: keep-all;
          text-wrap: balance;
        }
        .pain-item-text {
          font-size: ${textSize}px;
          color: ${colors.textSecondary};
          line-height: 1.7;
          word-break: keep-all;
          text-wrap: balance;
        }
      `}</style>
      <section style={{
        padding: 'clamp(48px, 10vw, 64px) 20px',
        background: colors.cardBackground || colors.background
      }}>
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          {content.label && (
            <p style={{
              fontSize: 'clamp(12px, 3.5vw, 14px)',
              fontWeight: '600',
              color: colors.primary,
              marginBottom: '8px'
            }}>
              {content.label}
            </p>
          )}

          <h2 className="pain-title">
            {content.title}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {content.items?.map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'clamp(12px, 3vw, 16px)',
                padding: 'clamp(18px, 5vw, 24px)',
                background: colors.backgroundAlt,
                borderRadius: '20px',
                borderLeft: `4px solid ${colors.primary}`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              }}>
                {item.icon ? (
                  <span style={{ fontSize: 'clamp(26px, 7vw, 32px)', flexShrink: 0 }}>{item.icon}</span>
                ) : null}
                <p className="pain-item-text">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
