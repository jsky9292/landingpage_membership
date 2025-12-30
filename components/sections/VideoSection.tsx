'use client';

import { VideoContent } from '@/types/page';

interface VideoSectionProps {
  theme?: string;
  content: VideoContent;
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

export function VideoSection({ content }: VideoSectionProps) {
  const videoId = getYouTubeVideoId(content.videoUrl);

  if (!videoId) {
    return (
      <section style={{ padding: 'clamp(48px, 10vw, 64px) 20px', background: '#F8FAFC' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: '#8B95A1', fontSize: 'clamp(13px, 3.5vw, 14px)' }}>유효한 YouTube URL을 입력해주세요</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <style>{`
        .video-label {
          font-size: clamp(12px, 3.5vw, 14px);
          font-weight: 600;
          color: #0064FF;
          margin-bottom: 8px;
          text-align: center;
        }
        .video-title {
          font-size: clamp(20px, 5.5vw, 24px);
          font-weight: bold;
          color: #191F28;
          margin-bottom: 24px;
          text-align: center;
          line-height: 1.4;
          word-break: keep-all;
          text-wrap: balance;
        }
        .video-caption {
          font-size: clamp(13px, 3.5vw, 14px);
          color: #4E5968;
          text-align: center;
          margin-top: 16px;
          line-height: 1.5;
          word-break: keep-all;
          text-wrap: balance;
        }
      `}</style>
      <section style={{ padding: 'clamp(48px, 10vw, 64px) 20px', background: '#F8FAFC' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          {content.label && (
            <p className="video-label">
              {content.label}
            </p>
          )}

          {content.title && (
            <h2 className="video-title">
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
            <p className="video-caption">
              {content.caption}
            </p>
          )}
        </div>
      </section>
    </>
  );
}
