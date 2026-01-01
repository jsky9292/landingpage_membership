'use client';

import { useState, useRef } from 'react';
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
import { TimerSection } from './TimerSection';
import { InlineCTASection } from './InlineCTASection';
import { InlineImageSection } from './InlineImageSection';
import { InlineVideoSection } from './InlineVideoSection';
import { DividerSection } from './DividerSection';

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
  onAddSectionAt?: (order: number) => void;
  onMoveSection?: (sectionId: string, direction: 'up' | 'down') => void;
  onDeleteSection?: (sectionId: string) => void;
  onReorderSections?: (sections: Section[]) => void;
}

const sectionLabels: Record<string, string> = {
  hero: '히어로', pain: '고객 고민', solution: '해결책', benefits: '혜택',
  process: '진행 방식', philosophy: '철학', video: '동영상', image: '이미지',
  calendar: '예약', cta: 'CTA', form: '신청폼',
  timer: '타이머', 'inline-cta': '중간 CTA', 'inline-image': '중간 이미지',
  'inline-video': '중간 영상', divider: '구분선',
};

const sectionIcons: Record<string, string> = {
  hero: '🎯', pain: '😰', solution: '💡', benefits: '✨',
  process: '📋', philosophy: '💝', video: '🎬', image: '🖼️',
  calendar: '📅', cta: '🔥', form: '📝',
  timer: '⏰', 'inline-cta': '🔘', 'inline-image': '🖼️',
  'inline-video': '📹', divider: '➖',
};

function SectionImageDisplay({ emojiImage, sectionImage }: { emojiImage?: string; sectionImage?: string }) {
  if (!emojiImage && !sectionImage) return null;

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '16px',
      padding: '24px 20px',
    }}>
      {emojiImage && (
        <img src={emojiImage} alt="emoji" style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
      )}
      {sectionImage && (
        <img src={sectionImage} alt="section" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '12px', objectFit: 'cover' }} />
      )}
    </div>
  );
}

// 섹션 사이 추가 버튼
function AddSectionButton({ onClick, isFirst }: { onClick: () => void; isFirst?: boolean }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        position: 'relative',
        height: isHovered ? '48px' : '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'height 0.2s ease',
        margin: isFirst ? '0 0 0 0' : '0',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        opacity: isHovered ? 1 : 0,
        transition: 'opacity 0.2s ease',
        zIndex: 10,
      }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            background: '#0064FF',
            color: '#fff',
            border: 'none',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,100,255,0.3)',
            whiteSpace: 'nowrap',
          }}
        >
          ➕ 섹션 추가
        </button>
      </div>
    </div>
  );
}

// 섹션 컨트롤 바
function SectionControls({
  section,
  isEditing,
  onEdit,
  onMoveUp,
  onMoveDown,
  onDelete,
  isFirst,
  isLast,
}: {
  section: Section;
  isEditing: boolean;
  onEdit: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete?: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  return (
    <div
      className="section-controls"
      style={{
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 12px',
        background: isEditing ? '#191F28' : 'rgba(0,100,255,0.95)',
        color: '#fff',
        fontSize: '13px',
        fontWeight: '600',
        zIndex: 20,
        opacity: 0,
        transition: 'opacity 0.2s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>{sectionIcons[section.type] || '📄'}</span>
        <span>{sectionLabels[section.type] || section.type}</span>
      </div>
      <div style={{ display: 'flex', gap: '4px' }}>
        {!isFirst && onMoveUp && (
          <button
            onClick={(e) => { e.stopPropagation(); onMoveUp(); }}
            style={controlButtonStyle}
            title="위로 이동"
          >
            ↑
          </button>
        )}
        {!isLast && onMoveDown && (
          <button
            onClick={(e) => { e.stopPropagation(); onMoveDown(); }}
            style={controlButtonStyle}
            title="아래로 이동"
          >
            ↓
          </button>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          style={{ ...controlButtonStyle, background: isEditing ? '#0064FF' : 'rgba(255,255,255,0.2)' }}
        >
          ✏️ 편집
        </button>
        {onDelete && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            style={{ ...controlButtonStyle, background: 'rgba(255,100,100,0.8)' }}
            title="삭제"
          >
            🗑️
          </button>
        )}
      </div>
    </div>
  );
}

const controlButtonStyle: React.CSSProperties = {
  padding: '4px 10px',
  background: 'rgba(255,255,255,0.2)',
  border: 'none',
  borderRadius: '4px',
  color: '#fff',
  fontSize: '12px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
};

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
  onAddSectionAt,
  onMoveSection,
  onDeleteSection,
  onReorderSections,
}: SectionRendererProps) {
  const [draggedSection, setDraggedSection] = useState<string | null>(null);
  const [dragOverSection, setDragOverSection] = useState<string | null>(null);
  const dragCounter = useRef(0);

  const scrollToForm = () => {
    const formSection = document.getElementById('form-section');
    formSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEdit = (sectionId: string) => (content: SectionContent) => {
    onSectionEdit?.(sectionId, content);
  };

  // 드래그 앤 드롭 핸들러
  const handleDragStart = (e: React.DragEvent, sectionId: string) => {
    setDraggedSection(sectionId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', sectionId);
    // 드래그 이미지 투명도
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5';
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedSection(null);
    setDragOverSection(null);
    dragCounter.current = 0;
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
  };

  const handleDragEnter = (e: React.DragEvent, sectionId: string) => {
    e.preventDefault();
    dragCounter.current++;
    if (sectionId !== draggedSection) {
      setDragOverSection(sectionId);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragOverSection(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetSectionId: string) => {
    e.preventDefault();
    setDragOverSection(null);
    dragCounter.current = 0;

    if (!draggedSection || draggedSection === targetSectionId) return;

    const sortedList = [...sections].sort((a, b) => a.order - b.order);
    const draggedIndex = sortedList.findIndex(s => s.id === draggedSection);
    const targetIndex = sortedList.findIndex(s => s.id === targetSectionId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    // 순서 재배열
    const newSections = [...sortedList];
    const [removed] = newSections.splice(draggedIndex, 1);
    newSections.splice(targetIndex, 0, removed);

    // order 값 업데이트
    const reorderedSections = newSections.map((s, i) => ({ ...s, order: i }));
    onReorderSections?.(reorderedSections);

    setDraggedSection(null);
  };

  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  const renderSection = (section: Section) => {
    const editHandler = handleEdit(section.id);
    const imageDisplay = <SectionImageDisplay emojiImage={section.emojiImage} sectionImage={section.sectionImage} />;
    const sectionStyle = section.style;

    switch (section.type as SectionType) {
      case 'hero':
        return (<><HeroSection content={section.content as any} theme={theme} style={sectionStyle} isEditable={isEditable} onEdit={editHandler} onCTAClick={scrollToForm} />{imageDisplay}</>);
      case 'pain':
        return (<>{imageDisplay}<PainSection content={section.content as any} theme={theme} style={sectionStyle} isEditable={isEditable} onEdit={editHandler} /></>);
      case 'solution':
        return (<>{imageDisplay}<SolutionSection content={section.content as any} theme={theme} style={sectionStyle} isEditable={isEditable} onEdit={editHandler} /></>);
      case 'benefits':
        return (<>{imageDisplay}<BenefitsSection content={section.content as any} theme={theme} style={sectionStyle} isEditable={isEditable} onEdit={editHandler} /></>);
      case 'process':
        return (<>{imageDisplay}<ProcessSection content={section.content as any} theme={theme} style={sectionStyle} isEditable={isEditable} onEdit={editHandler} /></>);
      case 'philosophy':
        return (<>{imageDisplay}<PhilosophySection content={section.content as any} theme={theme} style={sectionStyle} isEditable={isEditable} onEdit={editHandler} /></>);
      case 'video':
        return (<>{imageDisplay}<VideoSection content={section.content as any} theme={theme} style={sectionStyle} isEditable={isEditable} onEdit={editHandler} /></>);
      case 'calendar':
        return (<>{imageDisplay}<CalendarSection content={section.content as any} theme={theme} style={sectionStyle} isEditable={isEditable} onEdit={editHandler} /></>);
      case 'cta':
        return (<>{imageDisplay}<CTASection content={section.content as any} theme={theme} style={sectionStyle} isEditable={isEditable} onEdit={editHandler} onCTAClick={scrollToForm} /></>);
      case 'form':
        return (<FormSection content={section.content as any} formFields={formFields} theme={theme} style={sectionStyle} isEditable={isEditable} onEdit={editHandler} onSubmit={onFormSubmit} isSubmitting={isSubmitting} />);
      case 'timer':
        return (<TimerSection content={section.content as any} theme={theme} style={sectionStyle} isEditable={isEditable} onEdit={editHandler} />);
      case 'inline-cta':
        return (<InlineCTASection content={section.content as any} theme={theme} style={sectionStyle} isEditable={isEditable} onEdit={editHandler} onCTAClick={scrollToForm} />);
      case 'inline-image':
        return (<InlineImageSection content={section.content as any} theme={theme} style={sectionStyle} isEditable={isEditable} onEdit={editHandler} />);
      case 'inline-video':
        return (<InlineVideoSection content={section.content as any} theme={theme} style={sectionStyle} isEditable={isEditable} onEdit={editHandler} />);
      case 'divider':
        return (<DividerSection content={section.content as any} theme={theme} style={sectionStyle} isEditable={isEditable} onEdit={editHandler} />);
      default:
        return null;
    }
  };

  return (
    <>
      <style>{`
        .section-wrapper { position: relative; transition: all 0.2s ease; }
        .section-wrapper.editable { cursor: grab; }
        .section-wrapper.editable:active { cursor: grabbing; }
        .section-wrapper.editable:hover { background: rgba(0,100,255,0.03); }
        .section-wrapper.editable:hover .section-controls { opacity: 1; }
        .section-wrapper.editing {
          background: rgba(0,100,255,0.08);
          outline: 3px solid #0064FF;
          outline-offset: -3px;
        }
        .section-wrapper.editing .section-controls { opacity: 1; }
        .section-wrapper.editing::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border: 3px solid #0064FF;
          pointer-events: none;
          z-index: 15;
          animation: pulse-border 1.5s ease-in-out infinite;
        }
        .section-wrapper.drag-over {
          background: rgba(0,100,255,0.15);
          outline: 3px dashed #0064FF;
          outline-offset: -3px;
        }
        .section-wrapper.drag-over::after {
          content: '여기에 놓기';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: #0064FF;
          color: #fff;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          z-index: 100;
          pointer-events: none;
        }
        @keyframes pulse-border {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
      <div>
        {/* 맨 위에 섹션 추가 버튼 */}
        {isEditable && onAddSectionAt && (
          <AddSectionButton onClick={() => onAddSectionAt(-1)} isFirst />
        )}

        {sortedSections.map((section, index) => (
          <div key={section.id}>
            <div
              className={`section-wrapper ${isEditable ? 'editable' : ''} ${editingSection === section.id ? 'editing' : ''} ${dragOverSection === section.id ? 'drag-over' : ''}`}
              onClick={() => isEditable && onSectionSelect?.(section.id)}
              draggable={isEditable}
              onDragStart={(e) => isEditable && handleDragStart(e, section.id)}
              onDragEnd={handleDragEnd}
              onDragEnter={(e) => isEditable && handleDragEnter(e, section.id)}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={(e) => isEditable && handleDrop(e, section.id)}
            >
              {isEditable && (
                <SectionControls
                  section={section}
                  isEditing={editingSection === section.id}
                  onEdit={() => onSectionSelect?.(section.id)}
                  onMoveUp={onMoveSection ? () => onMoveSection(section.id, 'up') : undefined}
                  onMoveDown={onMoveSection ? () => onMoveSection(section.id, 'down') : undefined}
                  onDelete={onDeleteSection ? () => onDeleteSection(section.id) : undefined}
                  isFirst={index === 0}
                  isLast={index === sortedSections.length - 1}
                />
              )}
              {renderSection(section)}
            </div>

            {/* 각 섹션 아래에 추가 버튼 */}
            {isEditable && onAddSectionAt && (
              <AddSectionButton onClick={() => onAddSectionAt(section.order)} />
            )}
          </div>
        ))}
      </div>
    </>
  );
}
