'use client';

import { BenefitsContent, ThemeType, SectionStyle } from '@/types/page';
import { THEMES } from '@/config/themes';

interface BenefitsSectionProps {
  content: BenefitsContent;
  theme?: ThemeType;
  style?: SectionStyle;
  isEditable?: boolean;
  onEdit?: (content: BenefitsContent) => void;
}

export function BenefitsSection({ content, theme = 'toss', style }: BenefitsSectionProps) {
  const themeConfig = THEMES[theme];
  const colors = themeConfig.colors;
  const titleSize = style?.titleFontSize || 28;
  const textSize = style?.textFontSize || 16;

  return (
    <>
      <style>{`
        .benefits-title {
          font-size: ${titleSize}px;
          font-weight: bold;
          color: ${colors.text};
          margin-bottom: 32px;
          line-height: 1.4;
          word-break: keep-all;
          text-wrap: balance;
        }
        .benefit-item-title {
          font-weight: 600;
          color: ${colors.text};
          font-size: ${textSize}px;
          margin-bottom: 4px;
          word-break: keep-all;
          text-wrap: balance;
        }
        .benefit-item-desc {
          font-size: ${Math.round(textSize * 0.875)}px;
          color: ${colors.textSecondary};
          line-height: 1.6;
          word-break: keep-all;
          text-wrap: balance;
        }
      `}</style>
      <section style={{
        padding: 'clamp(48px, 10vw, 64px) 20px',
        background: colors.backgroundAlt
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

          <h2 className="benefits-title">
            {content.title}
          </h2>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {content.items?.map((item, index) => (
              <div key={index} style={{
                background: colors.cardBackground || '#fff',
                borderRadius: '20px',
                padding: 'clamp(18px, 5vw, 24px)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'clamp(14px, 4vw, 18px)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                border: `1px solid ${colors.border}`,
              }}>
                <div style={{
                  width: 'clamp(48px, 13vw, 56px)',
                  height: 'clamp(48px, 13vw, 56px)',
                  flexShrink: 0,
                  background: `${colors.primary}10`,
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {item.icon ? (
                    <span style={{ fontSize: 'clamp(24px, 7vw, 32px)' }}>{item.icon}</span>
                  ) : (
                    <span style={{
                      fontSize: 'clamp(20px, 5vw, 26px)',
                      color: colors.primary,
                      fontWeight: 'bold'
                    }}>✓</span>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 className="benefit-item-title">
                    {item.title}
                  </h4>
                  <p className="benefit-item-desc">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
