'use client';

import { PhilosophyContent, SectionStyle, ThemeType } from '@/types/page';
import { THEMES } from '@/config/themes';

interface PhilosophySectionProps {
  theme?: ThemeType;
  style?: SectionStyle;
  content: PhilosophyContent;
  isEditable?: boolean;
  onEdit?: (content: PhilosophyContent) => void;
}

export function PhilosophySection({ content, theme = 'toss', style }: PhilosophySectionProps) {
  const themeConfig = THEMES[theme] || THEMES.toss;
  const colors = themeConfig.colors;
  const titleSize = style?.titleFontSize || 28;
  const textSize = style?.textFontSize || 16;

  return (
    <>
      <style>{`
        .philosophy-title {
          font-size: ${titleSize}px;
          font-weight: bold;
          color: ${colors.text};
          margin-bottom: 32px;
          line-height: 1.4;
          word-break: keep-all;
          text-wrap: balance;
        }
        .philosophy-item-title {
          font-weight: 600;
          color: ${colors.text};
          font-size: ${textSize}px;
          word-break: keep-all;
          text-wrap: balance;
        }
        .philosophy-item-desc {
          font-size: ${Math.round(textSize * 0.875)}px;
          color: ${colors.textSecondary};
          line-height: 1.6;
          word-break: keep-all;
          text-wrap: balance;
        }
      `}</style>
      <section style={{ padding: 'clamp(48px, 10vw, 64px) 20px', background: colors.backgroundAlt }}>
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          {content.label && (
            <p style={{ fontSize: 'clamp(12px, 3.5vw, 14px)', fontWeight: '600', color: colors.primary, marginBottom: '8px' }}>
              {content.label}
            </p>
          )}

          <h2 className="philosophy-title">
            {content.title}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {content.items?.map((item, index) => (
              <div key={index} style={{
                background: colors.cardBackground || colors.background,
                borderRadius: '16px',
                padding: 'clamp(16px, 4vw, 20px)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(10px, 3vw, 12px)', marginBottom: '8px' }}>
                  <span style={{ fontSize: 'clamp(20px, 5vw, 24px)' }}>{item.icon}</span>
                  <h4 className="philosophy-item-title">{item.title}</h4>
                </div>
                <p className="philosophy-item-desc" style={{ paddingLeft: 'clamp(30px, 8vw, 36px)' }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
