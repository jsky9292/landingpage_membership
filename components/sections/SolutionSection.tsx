'use client';

import { SolutionContent, ThemeType } from '@/types/page';
import { THEMES } from '@/config/themes';

interface SolutionSectionProps {
  content: SolutionContent;
  theme?: ThemeType;
  isEditable?: boolean;
  onEdit?: (content: SolutionContent) => void;
}

export function SolutionSection({ content, theme = 'toss' }: SolutionSectionProps) {
  const themeConfig = THEMES[theme];
  const colors = themeConfig.colors;

  // 다크 계열 테마인지 확인
  const isDark = theme === 'dark' || theme === 'luxury';

  return (
    <>
      <style>{`
        .solution-title {
          font-size: clamp(22px, 6vw, 28px);
          font-weight: bold;
          color: #fff;
          margin-bottom: 24px;
          line-height: 1.4;
          word-break: keep-all;
          text-wrap: balance;
        }
        .solution-headline {
          font-size: clamp(17px, 5vw, 20px);
          font-weight: bold;
          color: #fff;
          margin-bottom: 12px;
          word-break: keep-all;
          text-wrap: balance;
        }
        .solution-desc {
          font-size: clamp(14px, 3.8vw, 16px);
          color: rgba(255,255,255,0.9);
          line-height: 1.7;
          white-space: pre-line;
          word-break: keep-all;
          text-wrap: balance;
        }
        .solution-item-title {
          font-weight: 600;
          color: #fff;
          margin-bottom: 4px;
          font-size: clamp(14px, 4vw, 16px);
          word-break: keep-all;
          text-wrap: balance;
        }
        .solution-item-desc {
          font-size: clamp(13px, 3.5vw, 14px);
          color: rgba(255,255,255,0.7);
          line-height: 1.6;
          word-break: keep-all;
          text-wrap: balance;
        }
      `}</style>
      <section style={{
        padding: 'clamp(48px, 10vw, 64px) 20px',
        background: isDark ? colors.backgroundAlt : colors.text
      }}>
        <div style={{ maxWidth: '480px', margin: '0 auto', textAlign: 'center' }}>
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

          <h2 className="solution-title">
            {content.title}
          </h2>

          <div style={{
            background: colors.primary,
            borderRadius: '24px',
            padding: 'clamp(24px, 6vw, 32px)',
            marginBottom: '32px',
            boxShadow: `0 8px 24px ${colors.primary}40`,
          }}>
            <h3 className="solution-headline">
              {content.headline}
            </h3>
            <p className="solution-desc">
              {content.description}
            </p>
          </div>

          {content.items && content.items.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {content.items.map((item, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'clamp(14px, 4vw, 18px)',
                  padding: 'clamp(18px, 5vw, 24px)',
                  background: isDark ? '#2A2A2A' : '#2A3142',
                  borderRadius: '20px',
                  textAlign: 'left'
                }}>
                  <span style={{ fontSize: 'clamp(20px, 5vw, 24px)', flexShrink: 0 }}>{item.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 className="solution-item-title">{item.title}</h4>
                    <p className="solution-item-desc">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
