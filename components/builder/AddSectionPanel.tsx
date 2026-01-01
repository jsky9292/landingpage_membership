'use client';

import { useState } from 'react';
import { SectionType, Section, TimerContent, InlineCTAContent, InlineImageContent, InlineVideoContent, DividerContent, HeroContent, PainContent, SolutionContent, BenefitsContent, ProcessContent, PhilosophyContent, CTAContent, FormContent, VideoContent, CalendarContent } from '@/types/page';

interface AddSectionPanelProps {
  onAddSection: (section: Section) => void;
  onClose: () => void;
  insertAfterOrder?: number;
}

interface SectionOption {
  type: SectionType;
  label: string;
  icon: string;
  description: string;
  category: 'main' | 'utility' | 'media';
}

const sectionOptions: SectionOption[] = [
  // 메인 섹션
  { type: 'hero', label: '히어로', icon: '🎯', description: '첫 인상을 결정하는 메인 헤드라인', category: 'main' },
  { type: 'pain', label: '고객 고민', icon: '😰', description: '고객이 겪는 문제점 나열', category: 'main' },
  { type: 'solution', label: '해결책', icon: '💡', description: '문제 해결 방법 제시', category: 'main' },
  { type: 'benefits', label: '혜택', icon: '✨', description: '제품/서비스의 장점 나열', category: 'main' },
  { type: 'process', label: '진행 방식', icon: '📋', description: '단계별 프로세스 안내', category: 'main' },
  { type: 'philosophy', label: '철학', icon: '💝', description: '브랜드 가치와 철학', category: 'main' },
  { type: 'cta', label: 'CTA', icon: '🔥', description: '행동 유도 버튼 섹션', category: 'main' },
  { type: 'form', label: '신청폼', icon: '📝', description: '고객 정보 수집 폼', category: 'main' },
  { type: 'calendar', label: '예약', icon: '📅', description: '일정 예약 캘린더', category: 'main' },

  // 유틸리티 섹션
  { type: 'timer', label: '카운트다운', icon: '⏰', description: '마감 시간까지 남은 시간 표시', category: 'utility' },
  { type: 'inline-cta', label: '중간 CTA', icon: '🔘', description: '본문 중간에 삽입하는 행동유도 버튼', category: 'utility' },
  { type: 'divider', label: '구분선', icon: '➖', description: '섹션 사이 구분선 또는 여백', category: 'utility' },

  // 미디어 섹션
  { type: 'video', label: '동영상', icon: '🎬', description: '유튜브 영상 삽입', category: 'media' },
  { type: 'inline-video', label: '중간 영상', icon: '📹', description: '본문 중간에 삽입하는 영상', category: 'media' },
  { type: 'inline-image', label: '중간 이미지', icon: '🖼️', description: '본문 중간에 삽입하는 이미지', category: 'media' },
];

const categoryLabels = {
  main: '📌 주요 섹션',
  utility: '🔧 유틸리티',
  media: '🎥 미디어',
};

function getDefaultContent(type: SectionType): any {
  switch (type) {
    case 'hero':
      return { headline: '메인 헤드라인', subtext: '서브 텍스트를 입력하세요', cta: '지금 시작하기' } as HeroContent;
    case 'pain':
      return { title: '이런 고민 있으신가요?', items: [{ icon: '😰', text: '고민 1' }] } as PainContent;
    case 'solution':
      return { title: '해결책', headline: '해결책 헤드라인', description: '설명을 입력하세요' } as SolutionContent;
    case 'benefits':
      return { title: '혜택', items: [{ icon: '✨', title: '혜택 1', description: '혜택 설명' }] } as BenefitsContent;
    case 'process':
      return { title: '진행 방식', steps: [{ number: 1, title: '1단계', description: '설명' }] } as ProcessContent;
    case 'philosophy':
      return { title: '우리의 철학', items: [{ icon: '💝', title: '가치', description: '설명' }] } as PhilosophyContent;
    case 'cta':
      return { headline: '지금 바로 시작하세요', subtext: '특별 혜택을 놓치지 마세요', buttonText: '신청하기' } as CTAContent;
    case 'form':
      return { title: '신청하기', buttonText: '제출하기' } as FormContent;
    case 'video':
      return { videoUrl: '' } as VideoContent;
    case 'calendar':
      return { title: '예약하기', availableDays: ['월', '화', '수', '목', '금'], availableTimes: ['10:00', '14:00'], duration: 60 } as CalendarContent;
    case 'timer':
      return {
        title: '특별 할인 종료까지',
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        backgroundColor: '#FF6B6B',
        textColor: '#FFFFFF',
        showDays: true,
        showHours: true,
        showMinutes: true,
        showSeconds: true,
        expiredMessage: '이벤트가 종료되었습니다',
      } as TimerContent;
    case 'inline-cta':
      return {
        buttonText: '지금 신청하기',
        subtitle: '지금 신청하시면 특별 혜택!',
        style: 'primary',
        size: 'large',
        fullWidth: false,
      } as InlineCTAContent;
    case 'inline-image':
      return {
        imageUrl: '',
        alt: '',
        caption: '',
        size: 'large',
        alignment: 'center',
      } as InlineImageContent;
    case 'inline-video':
      return {
        videoUrl: '',
        title: '',
        caption: '',
        showControls: true,
      } as InlineVideoContent;
    case 'divider':
      return {
        style: 'line',
        color: '#E5E8EB',
        spacing: 40,
      } as DividerContent;
    default:
      return {};
  }
}

export function AddSectionPanel({ onAddSection, onClose, insertAfterOrder = 999 }: AddSectionPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<'main' | 'utility' | 'media'>('main');

  const handleSelectSection = (type: SectionType) => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      type,
      content: getDefaultContent(type),
      order: insertAfterOrder + 0.5,
    };
    onAddSection(newSection);
    onClose();
  };

  const filteredSections = sectionOptions.filter(s => s.category === selectedCategory);

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#fff',
    }}>
      {/* 헤더 */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #E5E8EB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: '700',
          color: '#191F28',
          margin: 0,
        }}>
          ➕ 섹션 추가
        </h3>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            color: '#8B95A1',
          }}
        >
          ×
        </button>
      </div>

      {/* 카테고리 탭 */}
      <div style={{
        display: 'flex',
        padding: '12px 16px',
        gap: '8px',
        borderBottom: '1px solid #E5E8EB',
      }}>
        {(Object.keys(categoryLabels) as Array<'main' | 'utility' | 'media'>).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              background: selectedCategory === cat ? '#0064FF' : '#F2F4F6',
              color: selectedCategory === cat ? '#fff' : '#4E5968',
              fontSize: '13px',
              fontWeight: selectedCategory === cat ? '600' : '400',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {categoryLabels[cat]}
          </button>
        ))}
      </div>

      {/* 섹션 목록 */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredSections.map((section) => (
            <button
              key={section.type}
              onClick={() => handleSelectSection(section.type)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px',
                background: '#F8FAFC',
                border: '1px solid #E5E8EB',
                borderRadius: '12px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#0064FF';
                e.currentTarget.style.background = '#F0F7FF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E5E8EB';
                e.currentTarget.style.background = '#F8FAFC';
              }}
            >
              <span style={{ fontSize: '28px' }}>{section.icon}</span>
              <div>
                <p style={{
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#191F28',
                  margin: 0,
                  marginBottom: '4px',
                }}>
                  {section.label}
                </p>
                <p style={{
                  fontSize: '13px',
                  color: '#6B7280',
                  margin: 0,
                }}>
                  {section.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
