'use client';

import { ProcessContent, ThemeType, SectionStyle } from '@/types/page';
import { THEMES } from '@/config/themes';

interface ProcessSectionProps {
  content: ProcessContent;
  theme?: ThemeType;
  style?: SectionStyle;
  isEditable?: boolean;
  onEdit?: (content: ProcessContent) => void;
}

// 스텝별 아이콘 (참조 이미지 스타일)
const stepIcons = ['%', '🔗', '💰', '📊', '✓'];

export function ProcessSection({ content, theme = 'toss', style }: ProcessSectionProps) {
  const themeConfig = THEMES[theme];
  const colors = themeConfig.colors;
  const titleSize = style?.titleFontSize || 28;
  const textSize = style?.textFontSize || 16;

  return (
    <>
      <style>{`
        .process-title {
          font-size: ${titleSize}px;
          font-weight: bold;
          color: ${colors.text};
          margin-bottom: 12px;
          line-height: 1.4;
          word-break: keep-all;
          text-wrap: balance;
        }
        .process-subtitle {
          font-size: ${textSize}px;
          color: ${colors.textSecondary};
          margin-bottom: 32px;
          line-height: 1.6;
          word-break: keep-all;
          text-wrap: balance;
        }
        .process-step-title {
          font-weight: 600;
          color: ${colors.text};
          margin-bottom: 4px;
          font-size: ${textSize}px;
          word-break: keep-all;
          text-wrap: balance;
        }
        .process-step-title span {
          color: ${colors.primary};
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .process-step-desc {
          font-size: clamp(13px, 3.5vw, 14px);
          color: ${colors.textSecondary};
          line-height: 1.6;
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

          <h2 className="process-title">
            {content.title}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {content.steps?.map((step, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'clamp(14px, 4vw, 18px)',
                padding: 'clamp(18px, 5vw, 24px)',
                background: '#FFFFFF',
                borderRadius: '20px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                border: `1px solid ${colors.border}`,
              }}>
                {/* 숫자 배지 */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    background: `${colors.primary}15`,
                    color: colors.primary,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '600',
                    fontSize: '12px',
                  }}>
                    {step.number}
                  </div>
                </div>

                {/* 내용 */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 className="process-step-title">
                    <span>{step.title.split(' ')[0]}</span>
                    {step.title.includes(' ') && ' ' + step.title.split(' ').slice(1).join(' ')}
                  </h4>
                  <p className="process-step-desc">{step.description}</p>
                </div>

                {/* 아이콘 */}
                <div style={{
                  width: '44px',
                  height: '44px',
                  background: `${colors.primary}10`,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <span style={{ fontSize: '20px' }}>
                    {stepIcons[index % stepIcons.length]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
