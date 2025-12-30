'use client';

import { CTAContent, ThemeType } from '@/types/page';
import { THEMES } from '@/config/themes';

interface CTASectionProps {
  content: CTAContent;
  theme?: ThemeType;
  isEditable?: boolean;
  onEdit?: (content: CTAContent) => void;
  onCTAClick?: () => void;
}

export function CTASection({ content, theme = 'toss', onCTAClick }: CTASectionProps) {
  const themeConfig = THEMES[theme];
  const colors = themeConfig.colors;

  return (
    <>
      <style>{`
        .cta-headline {
          font-size: clamp(22px, 6vw, 28px);
          font-weight: bold;
          color: #fff;
          margin-bottom: 16px;
          line-height: 1.4;
          word-break: keep-all;
          text-wrap: balance;
        }
        .cta-subtext {
          font-size: clamp(14px, 3.8vw, 16px);
          color: rgba(255,255,255,0.9);
          margin-bottom: 32px;
          line-height: 1.7;
          white-space: pre-line;
          word-break: keep-all;
          text-wrap: balance;
        }
        .cta-button {
          width: 100%;
          padding: 16px 24px;
          font-size: clamp(15px, 4vw, 18px);
          font-weight: 600;
          color: ${colors.primary};
          background: #fff;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .cta-button:hover {
          transform: scale(1.02);
        }
      `}</style>
      <section style={{ padding: 'clamp(48px, 10vw, 64px) 20px', background: colors.primary }}>
        <div style={{ maxWidth: '480px', margin: '0 auto', textAlign: 'center' }}>
          <h2 className="cta-headline">
            {content.headline}
          </h2>

          <p className="cta-subtext">
            {content.subtext}
          </p>

          <button className="cta-button" onClick={onCTAClick}>
            {content.buttonText}
          </button>
        </div>
      </section>
    </>
  );
}
