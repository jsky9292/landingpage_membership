'use client';

import { VideoContent, SectionStyle, ThemeType } from '@/types/page';
import { THEMES } from '@/config/themes';

interface VideoSectionProps {
  theme?: ThemeType;
  content: VideoContent;
  style?: SectionStyle;
  isEditable?: boolean;
  onEdit?: (content: VideoContent) => void;
}

// YouTube URL에서 video ID 추출
function getYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function VideoSection({ content, theme = 'toss', style }: VideoSectionProps) {
  const videoId = getYouTubeVideoId(content.videoUrl);
  const colors = THEMES[theme]?.colors || THEMES.toss.colors;

  if (!videoId) {
    return (
      <section style={{ padding: 'clamp(48px, 10vw, 64px) 20px', background: colors.backgroundAlt }}>
        <div style={{ maxWidth: '480px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: colors.textMuted, fontSize: 'clamp(13px, 3.5vw, 14px)' }}>유효한 YouTube URL을 입력해주세요</p>
        </div>
      </section>
    );
  }

  const titleSize = style?.titleFontSize || 24;
  const textSize = style?.textFontSize || 14;

  return (
    <>
      <style>{`
        .video-label-${theme} {
          font-size: clamp(12px, 3.5vw, ${textSize}px);
          font-weight: 600;
          color: ${colors.primary};
          margin-bottom: 8px;
          text-align: center;
        }
        .video-title-${theme} {
          font-size: clamp(20px, 5.5vw, ${titleSize}px);
          font-weight: bold;
          color: ${colors.text};
          margin-bottom: 24px;
          text-align: center;
          line-height: 1.4;
          word-break: keep-all;
          text-wrap: balance;
        }
        .video-caption-${theme} {
          font-size: clamp(13px, 3.5vw, ${textSize}px);
          color: ${colors.textSecondary};
          text-align: center;
          margin-top: 16px;
          line-height: 1.5;
          word-break: keep-all;
          text-wrap: balance;
        }
      `}</style>
      <section style={{ padding: 'clamp(48px, 10vw, 64px) 20px', background: colors.backgroundAlt }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          {content.label && (
            <p className={`video-label-${theme}`}>
              {content.label}
            </p>
          )}

          {content.title && (
            <h2 className={`video-title-${theme}`}>
              {content.title}
            </h2>
          )}

          {/* YouTube 임베드 */}
          <div style={{
            position: 'relative',
            paddingBottom: '56.25%', // 16:9 aspect ratio
            height: 0,
            overflow: 'hidden',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
          }}>
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?rel=0`}
              title="YouTube video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none'
              }}
            />
          </div>

          {content.caption && (
            <p className={`video-caption-${theme}`}>
              {content.caption}
            </p>
          )}
        </div>
      </section>
    </>
  );
}
