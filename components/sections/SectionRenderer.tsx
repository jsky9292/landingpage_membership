'use client';

import { Section, SectionType, SectionContent, FormField, SectionStyle, ThemeType } from '@/types/page';
import { HeroSection } from './HeroSection';
import { PainSection } from './PainSection';
import { SolutionSection } from './SolutionSection';
import { BenefitsSection } from './BenefitsSection';
import { ProcessSection } from './ProcessSection';
import { PhilosophySection } from './PhilosophySection';
import { VideoSection } from './VideoSection';
import { CalendarSection } from './CalendarSection';
import { CTASection } from './CTASection';
import { FormSection } from './FormSection';

interface SectionRendererProps {
  sections: Section[];
  formFields: FormField[];
  theme?: ThemeType;
  isEditable?: boolean;
  onSectionEdit?: (sectionId: string, content: SectionContent) => void;
  onSectionStyleEdit?: (sectionId: string, style: SectionStyle) => void;
  onFormSubmit?: (data: Record<string, string>) => void;
  isSubmitting?: boolean;
  editingSection?: string | null;
  onSectionSelect?: (sectionId: string | null) => void;
  companyName?: string;
  onAddSectionAt?: (index: number, type: SectionType) => void;
  onMoveSection?: (sectionId: string, direction: 'up' | 'down') => void;
  onDeleteSection?: (sectionId: string) => void;
  onReorderSections?: (sections: Section[]) => void;
}

// YouTube URL에서 비디오 ID 추출
function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// Instagram URL에서 릴스/포스트 ID 추출
function getInstagramId(url: string): string | null {
  if (!url) return null;
  const regExp = /instagram.com\/(p|reel|reels)\/([^/?#&]+)/;
  const match = url.match(regExp);
  return match ? match[2] : null;
}

// 이모지/섹션 이미지/영상 컴포넌트
function SectionMediaDisplay({ emojiImage, sectionImage, sectionVideo }: { emojiImage?: string; sectionImage?: string; sectionVideo?: string }) {
  if (!emojiImage && !sectionImage && !sectionVideo) return null;

  const youtubeId = sectionVideo ? getYouTubeVideoId(sectionVideo) : null;
  const instagramId = sectionVideo ? getInstagramId(sectionVideo) : null;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '16px',
      padding: '24px 20px',
    }}>
      {emojiImage && (
        <img
          src={emojiImage}
          alt="emoji"
          style={{
            width: '80px',
            height: '80px',
            objectFit: 'contain',
          }}
        />
      )}
      {sectionImage && (
        <img
          src={sectionImage}
          alt="section"
          style={{
            maxWidth: '100%',
            maxHeight: '300px',
            borderRadius: '12px',
            objectFit: 'cover',
          }}
        />
      )}
      {youtubeId && (
        <div style={{
          width: '100%',
          maxWidth: '560px',
          aspectRatio: '16/9',
          borderRadius: '12px',
          overflow: 'hidden',
        }}>
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title="YouTube video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ borderRadius: '12px' }}
          />
        </div>
      )}
      {instagramId && !youtubeId && (
        <div style={{
          width: '100%',
          maxWidth: '400px',
          borderRadius: '12px',
          overflow: 'hidden',
        }}>
          <iframe
            src={`https://www.instagram.com/p/${instagramId}/embed`}
            width="100%"
            height="480"
            frameBorder="0"
            scrolling="no"
            allowTransparency={true}
            style={{ borderRadius: '12px' }}
          />
        </div>
      )}
    </div>
  );
}

export function SectionRenderer({
  sections,
  formFields,
  theme = 'toss',
  isEditable,
  onSectionEdit,
  onSectionStyleEdit,
  onFormSubmit,
  isSubmitting,
  editingSection,
  onSectionSelect,
  companyName,
}: SectionRendererProps) {
  const scrollToForm = () => {
    const formSection = document.getElementById('form-section');
    formSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEdit = (sectionId: string) => (content: SectionContent) => {
    onSectionEdit?.(sectionId, content);
  };

  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  const sectionLabels: Record<string, string> = {
    hero: '히어로', pain: '고객 고민', solution: '해결책', benefits: '혜택',
    process: '진행 방식', philosophy: '철학', video: '동영상', image: '이미지',
    calendar: '예약', cta: 'CTA', form: '신청폼',
  };

  const renderSection = (section: Section) => {
    const editHandler = handleEdit(section.id);
    const mediaDisplay = <SectionMediaDisplay emojiImage={section.emojiImage} sectionImage={section.sectionImage} sectionVideo={section.sectionVideo} />;

    switch (section.type as SectionType) {
      case 'hero':
        return (<><HeroSection content={section.content as any} style={section.style} theme={theme} isEditable={isEditable} onEdit={editHandler} onCTAClick={scrollToForm} />{mediaDisplay}</>);
      case 'pain':
        return (<>{mediaDisplay}<PainSection content={section.content as any} style={section.style} theme={theme} isEditable={isEditable} onEdit={editHandler} /></>);
      case 'solution':
        return (<>{mediaDisplay}<SolutionSection content={section.content as any} style={section.style} theme={theme} isEditable={isEditable} onEdit={editHandler} /></>);
      case 'benefits':
        return (<>{mediaDisplay}<BenefitsSection content={section.content as any} style={section.style} theme={theme} isEditable={isEditable} onEdit={editHandler} /></>);
      case 'process':
        return (<>{mediaDisplay}<ProcessSection content={section.content as any} style={section.style} theme={theme} isEditable={isEditable} onEdit={editHandler} /></>);
      case 'philosophy':
        return (<>{mediaDisplay}<PhilosophySection content={section.content as any} style={section.style} theme={theme} isEditable={isEditable} onEdit={editHandler} /></>);
      case 'video':
        return (<>{mediaDisplay}<VideoSection content={section.content as any} style={section.style} theme={theme} isEditable={isEditable} onEdit={editHandler} /></>);
      case 'calendar':
        return (<>{mediaDisplay}<CalendarSection content={section.content as any} style={section.style} theme={theme} isEditable={isEditable} onEdit={editHandler} /></>);
      case 'cta':
        return (<>{mediaDisplay}<CTASection content={section.content as any} style={section.style} theme={theme} isEditable={isEditable} onEdit={editHandler} onCTAClick={scrollToForm} /></>);
      case 'form':
        return (<FormSection content={section.content as any} formFields={formFields} theme={theme} isEditable={isEditable} onEdit={editHandler} onSubmit={onFormSubmit} isSubmitting={isSubmitting} companyName={companyName} />);
      default:
        return null;
    }
  };

  return (
    <>
      <style>{`
        .section-wrapper { position: relative; }
        .section-wrapper.editable:hover { outline: 2px solid #0064FF; outline-offset: -2px; }
        .section-wrapper.editing { outline: 2px solid #0064FF; outline-offset: -2px; }
        .section-edit-badge { position: absolute; top: 8px; right: 8px; background: #0064FF; color: #fff; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; z-index: 10; cursor: pointer; opacity: 0; transition: opacity 0.2s; }
        .section-wrapper.editable:hover .section-edit-badge { opacity: 1; }
        .section-wrapper.editing .section-edit-badge { opacity: 1; background: #191F28; }
      `}</style>
      <div>
        {sortedSections.map((section) => (
          <div key={section.id} className={`section-wrapper ${isEditable ? 'editable' : ''} ${editingSection === section.id ? 'editing' : ''}`} onClick={() => isEditable && onSectionSelect?.(section.id)}>
            {isEditable && (<div className="section-edit-badge">{editingSection === section.id ? '편집 중' : `${sectionLabels[section.type] || section.type} 편집`}</div>)}
            {renderSection(section)}
          </div>
        ))}
      </div>
    </>
  );
}
