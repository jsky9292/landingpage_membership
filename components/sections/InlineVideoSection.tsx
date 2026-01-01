'use client';

import { InlineVideoContent, ThemeType, SectionStyle } from '@/types/page';
import { THEMES } from '@/config/themes';

interface InlineVideoSectionProps {
  content: InlineVideoContent;
  theme?: ThemeType;
  style?: SectionStyle;
  isEditable?: boolean;
  onEdit?: (content: InlineVideoContent) => void;
}

function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

export function InlineVideoSection({ content, theme = 'toss', style }: InlineVideoSectionProps) {
  const colors = THEMES[theme]?.colors || THEMES.toss.colors;
  const videoId = getYouTubeVideoId(content.videoUrl);

  if (!videoId) {
    return (
      <div
        style={{
          padding: '48px 24px',
          textAlign: 'center',
          color: colors.textMuted,
          background: colors.background,
        }}
      >
        유효한 YouTube URL을 입력해주세요
      </div>
    );
  }

  const showControls = content.showControls !== false;

  return (
    <div
      style={{
        padding: '24px',
        background: colors.background,
      }}
    >
      {content.title && (
        <h3
          style={{
            fontSize: '20px',
            fontWeight: '700',
            color: colors.text,
            textAlign: 'center',
            marginBottom: '16px',
            marginTop: 0,
          }}
        >
          {content.title}
        </h3>
      )}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '800px',
          margin: '0 auto',
          paddingBottom: '56.25%', // 16:9 aspect ratio
          height: 0,
          overflow: 'hidden',
          borderRadius: '12px',
        }}
      >
        <iframe
          src={`https://www.youtube.com/embed/${videoId}${showControls ? '' : '?controls=0'}`}
          title={content.title || 'YouTube video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none',
          }}
        />
      </div>
      {content.caption && (
        <p
          style={{
            marginTop: '12px',
            fontSize: '14px',
            color: colors.textMuted,
            textAlign: 'center',
          }}
        >
          {content.caption}
        </p>
      )}
    </div>
  );
}
