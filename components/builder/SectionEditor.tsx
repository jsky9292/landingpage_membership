'use client';

import { useState, useEffect } from 'react';
import { Section, SectionContent, SectionStyle, SectionType, VideoContent, HeroContent, PainContent, SolutionContent, BenefitsContent, ProcessContent, PhilosophyContent, CTAContent, FormContent, FormField, ContactInfo, ImageContent, CalendarContent, TimerContent, InlineCTAContent, InlineImageContent, InlineVideoContent, DividerContent } from '@/types/page';

// 카테고리별 추천 이모지 (대폭 확장)
const EMOJI_CATEGORIES = {
  pain: [
    '😰', '😩', '😤', '😢', '😫', '🤯', '😵', '💸', '⏰', '🔥',
    '❌', '⚠️', '💢', '😓', '🥺', '😞', '😔', '🤦', '😣', '😖',
    '😱', '😨', '🙁', '☹️', '😟', '😕', '🫤', '😮‍💨', '😪', '😴',
    '🤔', '🤨', '😬', '🫠', '💔', '🚫', '⛔', '🆘', '❗', '‼️'
  ],
  benefits: [
    '✨', '🎯', '💎', '🏆', '⭐', '💪', '🚀', '💰', '🎁', '✅',
    '👍', '💡', '🔥', '❤️', '🌟', '📈', '🎉', '👏', '💯', '🙌',
    '🥇', '🏅', '🎖️', '👑', '💵', '💴', '💶', '💷', '🤑', '💲',
    '📊', '📉', '🎊', '🎀', '🎈', '🌈', '☀️', '🌞', '⚡', '💫'
  ],
  solution: [
    '💡', '🔑', '🎯', '✅', '🛡️', '⚡', '🔧', '📊', '🎓', '💼',
    '🏅', '🌈', '✨', '🚀', '💪', '🎁', '❤️', '🌟', '👑', '🎊',
    '🔓', '🗝️', '🔐', '✔️', '☑️', '🆗', '🆙', '📝', '📋', '📌',
    '🧭', '🎪', '🏹', '🎳', '🎰', '🧩', '🔮', '💊', '🩹', '🩺'
  ],
  philosophy: [
    '💝', '🤝', '💫', '🌱', '❤️', '🎯', '✨', '🔥', '💎', '🏆',
    '🌟', '💪', '🙏', '👨‍👩‍👧‍👦', '🏠', '💼', '📈', '🎓', '🛡️', '⏰',
    '🌍', '🌎', '🌏', '🕊️', '☮️', '💕', '💖', '💗', '💓', '💞',
    '🫶', '🤲', '👐', '🙆', '💒', '⛪', '🏛️', '🎭', '🎨', '📚'
  ],
  general: [
    '😊', '👍', '❤️', '✅', '⭐', '🎯', '💡', '🔥', '✨', '💪',
    '🚀', '💎', '🏆', '🎁', '💰', '📞', '📧', '🏠', '💼', '📱',
    '🖥️', '💻', '⌨️', '🖱️', '📲', '☎️', '📩', '📨', '📬', '📭',
    '🗓️', '📆', '🗒️', '📝', '✏️', '🖊️', '🖋️', '📍', '📎', '🔗'
  ],
  insurance: [
    '🛡️', '💰', '🏥', '👨‍👩‍👧‍👦', '🏠', '🚗', '✈️', '💼', '📋', '✅',
    '❤️', '🤝', '💪', '📈', '🎯', '💡', '⭐', '🔒', '💎', '🎁',
    '🏦', '💵', '💴', '💶', '💳', '🧾', '📑', '📃', '📄', '🗂️',
    '🏨', '🏢', '🏪', '🚑', '🚒', '🚔', '🛡️', '⚕️', '💊', '🩺'
  ],
  money: [
    '💰', '💵', '💴', '💶', '💷', '💳', '💲', '🤑', '💸', '🏦',
    '🏧', '💹', '📈', '📉', '📊', '🧾', '💎', '👛', '👝', '🎰',
    '🪙', '💱', '🏠', '🚗', '✈️', '🛳️', '🏝️', '🏖️', '⛱️', '🎢'
  ],
  people: [
    '👨', '👩', '👧', '👦', '👶', '👴', '👵', '🧑', '👱', '👨‍🦰',
    '👩‍🦰', '👨‍🦱', '👩‍🦱', '👨‍🦳', '👩‍🦳', '👨‍🦲', '👩‍🦲', '🧔', '👨‍💼', '👩‍💼',
    '👨‍⚕️', '👩‍⚕️', '👨‍🎓', '👩‍🎓', '👨‍🏫', '👩‍🏫', '👨‍🔧', '👩‍🔧', '👨‍🍳', '👩‍🍳',
    '👨‍👩‍👧', '👨‍👩‍👦', '👨‍👩‍👧‍👦', '👪', '🧑‍🤝‍🧑', '👫', '👬', '👭', '💑', '👨‍❤️‍👨'
  ],
  objects: [
    '📱', '💻', '🖥️', '⌨️', '🖱️', '🖨️', '📷', '📸', '📹', '🎥',
    '📺', '📻', '🎙️', '🎚️', '🎛️', '⏱️', '⏲️', '⏰', '🕰️', '⌛',
    '📡', '🔋', '🔌', '💡', '🔦', '🕯️', '🧯', '🛢️', '💸', '💵',
    '📦', '📫', '📪', '📬', '📭', '📮', '🗳️', '✉️', '📧', '📨'
  ],
  nature: [
    '🌸', '🌺', '🌻', '🌼', '🌷', '🌹', '🥀', '💐', '🌾', '🌿',
    '☘️', '🍀', '🍁', '🍂', '🍃', '🌲', '🌳', '🌴', '🌵', '🌱',
    '🌈', '☀️', '🌤️', '⛅', '🌥️', '☁️', '🌦️', '🌧️', '⛈️', '🌩️',
    '🌊', '💧', '💦', '☔', '❄️', '⛄', '🔥', '✨', '⭐', '🌟'
  ],
};

interface SectionEditorProps {
  section: Section | null;
  onContentChange: (content: SectionContent) => void;
  onStyleChange: (style: SectionStyle) => void;
  onClose: () => void;
  onAddSection?: (type: SectionType, position: 'before' | 'after') => void;
  onDeleteSection?: () => void;
}

export function SectionEditor({
  section,
  onContentChange,
  onStyleChange,
  onClose,
  onAddSection,
  onDeleteSection,
}: SectionEditorProps) {
  const [localContent, setLocalContent] = useState<SectionContent | null>(null);
  const [localStyle, setLocalStyle] = useState<SectionStyle>({
    titleFontSize: 28,
    textFontSize: 16,
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState<{ index: number; category: keyof typeof EMOJI_CATEGORIES } | null>(null);
  const [showMediaInput, setShowMediaInput] = useState(false);
  const [currentSectionId, setCurrentSectionId] = useState<string | null>(null);

  // 섹션 ID가 변경될 때만 localContent를 리셋 (내용 변경 시에는 리셋 안함)
  useEffect(() => {
    if (section && section.id !== currentSectionId) {
      setLocalContent(section.content);
      setLocalStyle(section.style || { titleFontSize: 28, textFontSize: 16 });
      setCurrentSectionId(section.id);
    }
  }, [section, currentSectionId]);

  if (!section || !localContent) {
    return (
      <div style={{
        padding: '24px',
        textAlign: 'center',
        color: '#8B95A1'
      }}>
        <p>편집할 섹션을 선택하세요</p>
      </div>
    );
  }

  const handleContentUpdate = (updates: Record<string, any>) => {
    const newContent = { ...localContent, ...updates } as SectionContent;
    setLocalContent(newContent);
    onContentChange(newContent);
  };

  const handleStyleUpdate = (updates: Partial<SectionStyle>) => {
    const newStyle = { ...localStyle, ...updates };
    setLocalStyle(newStyle);
    onStyleChange(newStyle);
  };

  const sectionLabels: Record<string, string> = {
    hero: '히어로 섹션',
    pain: '고객 고민',
    solution: '해결책',
    benefits: '혜택',
    process: '진행 방식',
    philosophy: '철학',
    video: '동영상',
    image: '이미지',
    calendar: '예약',
    cta: 'CTA',
    form: '신청폼',
    timer: '⏱️ 카운트다운 타이머',
    'inline-cta': '🔘 중간 CTA 버튼',
    'inline-image': '🖼️ 중간 이미지',
    'inline-video': '📹 중간 영상',
    divider: '➖ 구분선',
  };

  // 텍스트 필드 렌더러
  const renderTextField = (
    label: string,
    value: string,
    onChange: (value: string) => void,
    multiline = false
  ) => (
    <div style={{ marginBottom: '16px' }}>
      <label style={{
        display: 'block',
        fontSize: '13px',
        fontWeight: '600',
        color: '#333D4B',
        marginBottom: '6px'
      }}>
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #E5E8EB',
            borderRadius: '8px',
            fontSize: '14px',
            minHeight: '100px',
            resize: 'vertical',
            fontFamily: 'inherit',
            boxSizing: 'border-box'
          }}
        />
      ) : (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #E5E8EB',
            borderRadius: '8px',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
        />
      )}
    </div>
  );

  // 폰트 크기 슬라이더
  const renderFontSizeSlider = (
    label: string,
    value: number,
    onChange: (value: number) => void,
    min = 12,
    max = 48
  ) => (
    <div style={{ marginBottom: '16px' }}>
      <label style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '13px',
        fontWeight: '600',
        color: '#333D4B',
        marginBottom: '6px'
      }}>
        <span>{label}</span>
        <span style={{ color: '#0064FF' }}>{value}px</span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: '100%',
          accentColor: '#0064FF'
        }}
      />
    </div>
  );

  // 이모지 피커 렌더러
  const renderEmojiPicker = (
    currentEmoji: string,
    onSelect: (emoji: string) => void,
    index: number,
    category: keyof typeof EMOJI_CATEGORIES = 'general'
  ) => (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setShowEmojiPicker(showEmojiPicker?.index === index ? null : { index, category })}
        style={{
          width: '60px',
          height: '60px',
          fontSize: '32px',
          border: '2px solid #E5E8EB',
          borderRadius: '12px',
          background: '#fff',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s',
        }}
      >
        {currentEmoji || '➕'}
      </button>
      {showEmojiPicker?.index === index && (
        <div style={{
          position: 'absolute',
          top: '65px',
          left: 0,
          zIndex: 100,
          background: '#fff',
          border: '1px solid #E5E8EB',
          borderRadius: '12px',
          padding: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          width: '300px',
          maxHeight: '250px',
          overflowY: 'auto',
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {EMOJI_CATEGORIES[category].map((emoji, i) => (
              <button
                key={i}
                onClick={() => {
                  onSelect(emoji);
                  setShowEmojiPicker(null);
                }}
                style={{
                  width: '40px',
                  height: '40px',
                  fontSize: '24px',
                  border: 'none',
                  background: currentEmoji === emoji ? '#E8F3FF' : 'transparent',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // 미디어 (이미지/유튜브) 입력 필드
  const renderMediaField = (
    label: string,
    imageUrl: string | undefined,
    videoUrl: string | undefined,
    onImageChange: (url: string) => void,
    onVideoChange: (url: string) => void
  ) => (
    <div style={{
      marginBottom: '16px',
      padding: '12px',
      background: '#F0F9FF',
      borderRadius: '10px',
      border: '1px dashed #0064FF'
    }}>
      <label style={{
        display: 'block',
        fontSize: '13px',
        fontWeight: '600',
        color: '#0064FF',
        marginBottom: '10px'
      }}>
        🖼️ {label}
      </label>
      <div style={{ marginBottom: '10px' }}>
        <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>
          이미지 URL
        </label>
        <input
          type="text"
          value={imageUrl || ''}
          onChange={(e) => onImageChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          style={{
            width: '100%',
            padding: '8px 10px',
            border: '1px solid #E5E8EB',
            borderRadius: '6px',
            fontSize: '13px',
            boxSizing: 'border-box'
          }}
        />
      </div>
      <div>
        <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>
          유튜브/인스타 URL
        </label>
        <input
          type="text"
          value={videoUrl || ''}
          onChange={(e) => onVideoChange(e.target.value)}
          placeholder="https://youtube.com/watch?v=... 또는 인스타 릴스 URL"
          style={{
            width: '100%',
            padding: '8px 10px',
            border: '1px solid #E5E8EB',
            borderRadius: '6px',
            fontSize: '13px',
            boxSizing: 'border-box'
          }}
        />
      </div>
      {(imageUrl || videoUrl) && (
        <div style={{ marginTop: '10px', fontSize: '12px', color: '#22C55E' }}>
          ✅ 미디어가 설정되었습니다
        </div>
      )}
    </div>
  );

  // 섹션 타입별 편집 UI
  const renderSectionEditor = () => {
    switch (section.type) {
      case 'hero':
        const heroContent = localContent as HeroContent;
        return (
          <>
            {renderTextField('배지', heroContent.badge || '', (v) => handleContentUpdate({ badge: v }))}
            {renderTextField('헤드라인', heroContent.headline, (v) => handleContentUpdate({ headline: v }))}
            {renderTextField('서브텍스트', heroContent.subtext, (v) => handleContentUpdate({ subtext: v }), true)}
            {renderTextField('CTA 버튼', heroContent.cta, (v) => handleContentUpdate({ cta: v }))}
          </>
        );

      case 'pain':
        const painContent = localContent as PainContent;
        return (
          <>
            {renderTextField('라벨', painContent.label || '', (v) => handleContentUpdate({ label: v }))}
            {renderTextField('제목', painContent.title, (v) => handleContentUpdate({ title: v }))}

            {/* 섹션 미디어 삽입 */}
            {renderMediaField(
              '섹션에 이미지/영상 추가',
              (section as any).sectionImage,
              (section as any).sectionVideo,
              (url) => handleContentUpdate({ sectionImage: url }),
              (url) => handleContentUpdate({ sectionVideo: url })
            )}

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: '#333D4B',
                marginBottom: '10px'
              }}>
                고민 항목
              </label>
              {painContent.items?.map((item, index) => (
                <div key={index} style={{
                  display: 'flex',
                  gap: '10px',
                  marginBottom: '12px',
                  alignItems: 'flex-start',
                  background: '#F8FAFC',
                  padding: '12px',
                  borderRadius: '10px'
                }}>
                  {renderEmojiPicker(
                    item.icon,
                    (emoji) => {
                      const newItems = [...(painContent.items || [])];
                      newItems[index] = { ...newItems[index], icon: emoji };
                      handleContentUpdate({ items: newItems });
                    },
                    index,
                    'pain'
                  )}
                  <textarea
                    value={item.text}
                    onChange={(e) => {
                      const newItems = [...(painContent.items || [])];
                      newItems[index] = { ...newItems[index], text: e.target.value };
                      handleContentUpdate({ items: newItems });
                    }}
                    placeholder="고민 내용을 입력하세요"
                    style={{
                      flex: 1,
                      padding: '10px 12px',
                      border: '1px solid #E5E8EB',
                      borderRadius: '8px',
                      minHeight: '60px',
                      resize: 'vertical',
                      fontSize: '14px',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
              ))}
            </div>
          </>
        );

      case 'solution':
        const solutionContent = localContent as SolutionContent;
        return (
          <>
            {renderTextField('라벨', solutionContent.label || '', (v) => handleContentUpdate({ label: v }))}
            {renderTextField('제목', solutionContent.title, (v) => handleContentUpdate({ title: v }))}
            {renderTextField('헤드라인', solutionContent.headline, (v) => handleContentUpdate({ headline: v }))}
            {renderTextField('설명', solutionContent.description, (v) => handleContentUpdate({ description: v }), true)}
          </>
        );

      case 'benefits':
        const benefitsContent = localContent as BenefitsContent;
        return (
          <>
            {renderTextField('라벨', benefitsContent.label || '', (v) => handleContentUpdate({ label: v }))}
            {renderTextField('제목', benefitsContent.title, (v) => handleContentUpdate({ title: v }))}

            {/* 섹션 미디어 삽입 */}
            {renderMediaField(
              '섹션에 이미지/영상 추가',
              (section as any).sectionImage,
              (section as any).sectionVideo,
              (url) => handleContentUpdate({ sectionImage: url }),
              (url) => handleContentUpdate({ sectionVideo: url })
            )}

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: '#333D4B',
                marginBottom: '10px'
              }}>
                혜택 항목
              </label>
              {benefitsContent.items?.map((item, index) => (
                <div key={index} style={{
                  background: '#F8FAFC',
                  borderRadius: '10px',
                  padding: '14px',
                  marginBottom: '12px'
                }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '10px' }}>
                    {renderEmojiPicker(
                      item.icon,
                      (emoji) => {
                        const newItems = [...(benefitsContent.items || [])];
                        newItems[index] = { ...newItems[index], icon: emoji };
                        handleContentUpdate({ items: newItems });
                      },
                      100 + index,
                      'benefits'
                    )}
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const newItems = [...(benefitsContent.items || [])];
                        newItems[index] = { ...newItems[index], title: e.target.value };
                        handleContentUpdate({ items: newItems });
                      }}
                      placeholder="혜택 제목"
                      style={{
                        flex: 1,
                        padding: '12px',
                        border: '1px solid #E5E8EB',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <textarea
                    value={item.description}
                    onChange={(e) => {
                      const newItems = [...(benefitsContent.items || [])];
                      newItems[index] = { ...newItems[index], description: e.target.value };
                      handleContentUpdate({ items: newItems });
                    }}
                    placeholder="혜택 설명을 입력하세요"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #E5E8EB',
                      borderRadius: '8px',
                      fontSize: '14px',
                      minHeight: '70px',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              ))}
            </div>
          </>
        );

      case 'process':
        const processContent = localContent as ProcessContent;
        return (
          <>
            {renderTextField('라벨', processContent.label || '', (v) => handleContentUpdate({ label: v }))}
            {renderTextField('제목', processContent.title, (v) => handleContentUpdate({ title: v }))}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#333D4B', marginBottom: '10px' }}>
                진행 단계
              </label>
              {processContent.steps?.map((step, index) => (
                <div key={index} style={{ background: '#F8FAFC', borderRadius: '10px', padding: '14px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#0064FF', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '16px' }}>
                      {step.number || index + 1}
                    </div>
                    <input type="text" value={step.title} onChange={(e) => { const newSteps = [...(processContent.steps || [])]; newSteps[index] = { ...newSteps[index], title: e.target.value }; handleContentUpdate({ steps: newSteps }); }} placeholder="단계 제목" style={{ flex: 1, padding: '10px 12px', border: '1px solid #E5E8EB', borderRadius: '8px', fontSize: '14px', fontWeight: '600', boxSizing: 'border-box' }} />
                  </div>
                  <textarea value={step.description} onChange={(e) => { const newSteps = [...(processContent.steps || [])]; newSteps[index] = { ...newSteps[index], description: e.target.value }; handleContentUpdate({ steps: newSteps }); }} placeholder="단계 설명" style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E8EB', borderRadius: '8px', fontSize: '14px', minHeight: '60px', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                </div>
              ))}
            </div>
          </>
        );

      case 'philosophy':
        const philosophyContent = localContent as PhilosophyContent;
        return (
          <>
            {renderTextField('라벨', philosophyContent.label || '', (v) => handleContentUpdate({ label: v }))}
            {renderTextField('제목', philosophyContent.title, (v) => handleContentUpdate({ title: v }))}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#333D4B', marginBottom: '10px' }}>
                철학 항목
              </label>
              {philosophyContent.items?.map((item, index) => (
                <div key={index} style={{ background: '#F8FAFC', borderRadius: '10px', padding: '14px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '10px' }}>
                    {renderEmojiPicker(item.icon, (emoji) => { const newItems = [...(philosophyContent.items || [])]; newItems[index] = { ...newItems[index], icon: emoji }; handleContentUpdate({ items: newItems }); }, 200 + index, 'philosophy')}
                    <input type="text" value={item.title} onChange={(e) => { const newItems = [...(philosophyContent.items || [])]; newItems[index] = { ...newItems[index], title: e.target.value }; handleContentUpdate({ items: newItems }); }} placeholder="철학 제목" style={{ flex: 1, padding: '12px', border: '1px solid #E5E8EB', borderRadius: '8px', fontSize: '14px', fontWeight: '600', boxSizing: 'border-box' }} />
                  </div>
                  <textarea value={item.description} onChange={(e) => { const newItems = [...(philosophyContent.items || [])]; newItems[index] = { ...newItems[index], description: e.target.value }; handleContentUpdate({ items: newItems }); }} placeholder="철학 설명" style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E8EB', borderRadius: '8px', fontSize: '14px', minHeight: '60px', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                </div>
              ))}
            </div>
          </>
        );

      case 'image':
        const imageContent = localContent as ImageContent;
        return (
          <>
            {renderTextField('라벨', imageContent.label || '', (v) => handleContentUpdate({ label: v }))}
            {renderTextField('제목', imageContent.title || '', (v) => handleContentUpdate({ title: v }))}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#333D4B', marginBottom: '6px' }}>이미지 URL</label>
              <input type="url" value={imageContent.imageUrl || ''} onChange={(e) => handleContentUpdate({ imageUrl: e.target.value })} placeholder="https://example.com/image.jpg" style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E8EB', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>
            {imageContent.imageUrl && (
              <div style={{ marginBottom: '16px', textAlign: 'center' }}>
                <img src={imageContent.imageUrl} alt="미리보기" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', border: '1px solid #E5E8EB' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
            )}
            {renderTextField('대체 텍스트', imageContent.alt || '', (v) => handleContentUpdate({ alt: v }))}
            {renderTextField('캡션', imageContent.caption || '', (v) => handleContentUpdate({ caption: v }))}
          </>
        );

      case 'calendar':
        const calendarContent = localContent as CalendarContent;
        return (
          <>
            {renderTextField('라벨', calendarContent.label || '', (v) => handleContentUpdate({ label: v }))}
            {renderTextField('제목', calendarContent.title, (v) => handleContentUpdate({ title: v }))}
            {renderTextField('부제목', calendarContent.subtitle || '', (v) => handleContentUpdate({ subtitle: v }))}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#333D4B', marginBottom: '6px' }}>예약 가능 요일</label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {['월', '화', '수', '목', '금', '토', '일'].map((day) => (
                  <button key={day} onClick={() => { const currentDays = calendarContent.availableDays || []; const newDays = currentDays.includes(day) ? currentDays.filter(d => d !== day) : [...currentDays, day]; handleContentUpdate({ availableDays: newDays }); }} style={{ padding: '8px 12px', borderRadius: '6px', border: calendarContent.availableDays?.includes(day) ? '2px solid #0064FF' : '1px solid #E5E8EB', background: calendarContent.availableDays?.includes(day) ? '#E8F3FF' : '#fff', color: calendarContent.availableDays?.includes(day) ? '#0064FF' : '#333D4B', fontSize: '14px', fontWeight: calendarContent.availableDays?.includes(day) ? '600' : '400', cursor: 'pointer' }}>{day}</button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#333D4B', marginBottom: '6px' }}>예약 가능 시간</label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map((time) => (
                  <button key={time} onClick={() => { const currentTimes = calendarContent.availableTimes || []; const newTimes = currentTimes.includes(time) ? currentTimes.filter(t => t !== time) : [...currentTimes, time]; handleContentUpdate({ availableTimes: newTimes }); }} style={{ padding: '6px 10px', borderRadius: '6px', border: calendarContent.availableTimes?.includes(time) ? '2px solid #0064FF' : '1px solid #E5E8EB', background: calendarContent.availableTimes?.includes(time) ? '#E8F3FF' : '#fff', color: calendarContent.availableTimes?.includes(time) ? '#0064FF' : '#333D4B', fontSize: '13px', fontWeight: calendarContent.availableTimes?.includes(time) ? '600' : '400', cursor: 'pointer' }}>{time}</button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#333D4B', marginBottom: '6px' }}>상담 시간 (분)</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[15, 30, 45, 60].map((dur) => (
                  <button key={dur} onClick={() => handleContentUpdate({ duration: dur })} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: calendarContent.duration === dur ? '2px solid #0064FF' : '1px solid #E5E8EB', background: calendarContent.duration === dur ? '#E8F3FF' : '#fff', fontSize: '14px', fontWeight: calendarContent.duration === dur ? '600' : '400', cursor: 'pointer' }}>{dur}분</button>
                ))}
              </div>
            </div>
            {renderTextField('안내 문구', calendarContent.note || '', (v) => handleContentUpdate({ note: v }))}
          </>
        );

      case 'video':
        const videoContent = localContent as VideoContent;
        return (
          <>
            {renderTextField('라벨', videoContent.label || '', (v) => handleContentUpdate({ label: v }))}
            {renderTextField('제목', videoContent.title || '', (v) => handleContentUpdate({ title: v }))}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: '#333D4B',
                marginBottom: '6px'
              }}>
                유튜브 URL
              </label>
              <input
                type="url"
                value={videoContent.videoUrl || ''}
                onChange={(e) => handleContentUpdate({ videoUrl: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=..."
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #E5E8EB',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
              <p style={{ fontSize: '12px', color: '#8B95A1', marginTop: '4px' }}>
                YouTube 동영상 URL을 붙여넣으세요
              </p>
            </div>
            {renderTextField('캡션', videoContent.caption || '', (v) => handleContentUpdate({ caption: v }))}
          </>
        );

      case 'cta':
        const ctaContent = localContent as CTAContent;
        return (
          <>
            {renderTextField('헤드라인', ctaContent.headline, (v) => handleContentUpdate({ headline: v }))}
            {renderTextField('서브텍스트', ctaContent.subtext, (v) => handleContentUpdate({ subtext: v }), true)}
            {renderTextField('버튼 텍스트', ctaContent.buttonText, (v) => handleContentUpdate({ buttonText: v }))}
          </>
        );

      case 'form':
        const formContent = localContent as FormContent;
        return (
          <>
            {renderTextField('제목', formContent.title, (v) => handleContentUpdate({ title: v }))}
            {renderTextField('부제목', formContent.subtitle || '', (v) => handleContentUpdate({ subtitle: v }))}
            {renderTextField('안내 문구', formContent.note || '', (v) => handleContentUpdate({ note: v }))}
            {renderTextField('버튼 텍스트', formContent.buttonText, (v) => handleContentUpdate({ buttonText: v }))}
          </>
        );

      case 'timer':
        const timerContent = localContent as TimerContent;
        return (
          <>
            {renderTextField('타이머 제목', timerContent.title || '', (v) => handleContentUpdate({ title: v }))}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: '#333D4B',
                marginBottom: '6px'
              }}>
                종료 날짜/시간
              </label>
              <input
                type="datetime-local"
                value={timerContent.endDate ? new Date(timerContent.endDate).toISOString().slice(0, 16) : ''}
                onChange={(e) => handleContentUpdate({ endDate: new Date(e.target.value).toISOString() })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #E5E8EB',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: '#333D4B',
                marginBottom: '6px'
              }}>
                배경색
              </label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="color"
                  value={timerContent.backgroundColor || '#FF6B6B'}
                  onChange={(e) => handleContentUpdate({ backgroundColor: e.target.value })}
                  style={{
                    width: '50px',
                    height: '40px',
                    border: '1px solid #E5E8EB',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                />
                <input
                  type="text"
                  value={timerContent.backgroundColor || '#FF6B6B'}
                  onChange={(e) => handleContentUpdate({ backgroundColor: e.target.value })}
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    border: '1px solid #E5E8EB',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: '#333D4B',
                marginBottom: '6px'
              }}>
                텍스트 색상
              </label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="color"
                  value={timerContent.textColor || '#FFFFFF'}
                  onChange={(e) => handleContentUpdate({ textColor: e.target.value })}
                  style={{
                    width: '50px',
                    height: '40px',
                    border: '1px solid #E5E8EB',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                />
                <input
                  type="text"
                  value={timerContent.textColor || '#FFFFFF'}
                  onChange={(e) => handleContentUpdate({ textColor: e.target.value })}
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    border: '1px solid #E5E8EB',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
            {renderTextField('종료 후 메시지', timerContent.expiredMessage || '', (v) => handleContentUpdate({ expiredMessage: v }))}
          </>
        );

      case 'inline-cta':
        const inlineCTAContent = localContent as InlineCTAContent;
        return (
          <>
            {renderTextField('버튼 텍스트', inlineCTAContent.buttonText || '', (v) => handleContentUpdate({ buttonText: v }))}
            {renderTextField('부가 텍스트', inlineCTAContent.subtitle || '', (v) => handleContentUpdate({ subtitle: v }))}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: '#333D4B',
                marginBottom: '6px'
              }}>
                버튼 스타일
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {(['primary', 'secondary', 'outline'] as const).map((style) => (
                  <button
                    key={style}
                    onClick={() => handleContentUpdate({ style })}
                    style={{
                      flex: 1,
                      padding: '10px',
                      border: inlineCTAContent.style === style ? '2px solid #0064FF' : '1px solid #E5E8EB',
                      borderRadius: '8px',
                      background: inlineCTAContent.style === style ? '#E8F3FF' : '#fff',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: inlineCTAContent.style === style ? '600' : '400'
                    }}
                  >
                    {style === 'primary' ? '강조' : style === 'secondary' ? '보조' : '외곽선'}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: '#333D4B',
                marginBottom: '6px'
              }}>
                버튼 크기
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {(['small', 'medium', 'large'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => handleContentUpdate({ size })}
                    style={{
                      flex: 1,
                      padding: '10px',
                      border: inlineCTAContent.size === size ? '2px solid #0064FF' : '1px solid #E5E8EB',
                      borderRadius: '8px',
                      background: inlineCTAContent.size === size ? '#E8F3FF' : '#fff',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: inlineCTAContent.size === size ? '600' : '400'
                    }}
                  >
                    {size === 'small' ? '작게' : size === 'medium' ? '중간' : '크게'}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={inlineCTAContent.fullWidth || false}
                  onChange={(e) => handleContentUpdate({ fullWidth: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: '#0064FF' }}
                />
                <span style={{ fontSize: '14px', color: '#333D4B' }}>전체 너비로 표시</span>
              </label>
            </div>
          </>
        );

      case 'inline-image':
        const inlineImageContent = localContent as InlineImageContent;
        return (
          <>
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: '#333D4B',
                marginBottom: '6px'
              }}>
                이미지 URL
              </label>
              <input
                type="url"
                value={inlineImageContent.imageUrl || ''}
                onChange={(e) => handleContentUpdate({ imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #E5E8EB',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            {inlineImageContent.imageUrl && (
              <div style={{ marginBottom: '16px', textAlign: 'center' }}>
                <img
                  src={inlineImageContent.imageUrl}
                  alt="미리보기"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '200px',
                    borderRadius: '8px',
                    border: '1px solid #E5E8EB'
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
            {renderTextField('대체 텍스트 (Alt)', inlineImageContent.alt || '', (v) => handleContentUpdate({ alt: v }))}
            {renderTextField('캡션', inlineImageContent.caption || '', (v) => handleContentUpdate({ caption: v }))}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: '#333D4B',
                marginBottom: '6px'
              }}>
                이미지 크기
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {(['small', 'medium', 'large', 'full'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => handleContentUpdate({ size })}
                    style={{
                      flex: 1,
                      padding: '10px',
                      border: inlineImageContent.size === size ? '2px solid #0064FF' : '1px solid #E5E8EB',
                      borderRadius: '8px',
                      background: inlineImageContent.size === size ? '#E8F3FF' : '#fff',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: inlineImageContent.size === size ? '600' : '400'
                    }}
                  >
                    {size === 'small' ? '작게' : size === 'medium' ? '중간' : size === 'large' ? '크게' : '전체'}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: '#333D4B',
                marginBottom: '6px'
              }}>
                정렬
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {(['left', 'center', 'right'] as const).map((align) => (
                  <button
                    key={align}
                    onClick={() => handleContentUpdate({ alignment: align })}
                    style={{
                      flex: 1,
                      padding: '10px',
                      border: inlineImageContent.alignment === align ? '2px solid #0064FF' : '1px solid #E5E8EB',
                      borderRadius: '8px',
                      background: inlineImageContent.alignment === align ? '#E8F3FF' : '#fff',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: inlineImageContent.alignment === align ? '600' : '400'
                    }}
                  >
                    {align === 'left' ? '왼쪽' : align === 'center' ? '가운데' : '오른쪽'}
                  </button>
                ))}
              </div>
            </div>
          </>
        );

      case 'inline-video':
        const inlineVideoContent = localContent as InlineVideoContent;
        return (
          <>
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: '#333D4B',
                marginBottom: '6px'
              }}>
                유튜브 URL
              </label>
              <input
                type="url"
                value={inlineVideoContent.videoUrl || ''}
                onChange={(e) => handleContentUpdate({ videoUrl: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=..."
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #E5E8EB',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
              <p style={{ fontSize: '12px', color: '#8B95A1', marginTop: '4px' }}>
                YouTube 동영상 URL을 붙여넣으세요 (예: youtube.com/watch?v=...)
              </p>
            </div>
            {renderTextField('제목', inlineVideoContent.title || '', (v) => handleContentUpdate({ title: v }))}
            {renderTextField('캡션', inlineVideoContent.caption || '', (v) => handleContentUpdate({ caption: v }))}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={inlineVideoContent.showControls !== false}
                  onChange={(e) => handleContentUpdate({ showControls: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: '#0064FF' }}
                />
                <span style={{ fontSize: '14px', color: '#333D4B' }}>컨트롤 표시</span>
              </label>
            </div>
          </>
        );

      case 'divider':
        const dividerContent = localContent as DividerContent;
        return (
          <>
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: '#333D4B',
                marginBottom: '6px'
              }}>
                구분선 스타일
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {(['line', 'dots', 'space'] as const).map((style) => (
                  <button
                    key={style}
                    onClick={() => handleContentUpdate({ style })}
                    style={{
                      flex: 1,
                      padding: '10px',
                      border: dividerContent.style === style ? '2px solid #0064FF' : '1px solid #E5E8EB',
                      borderRadius: '8px',
                      background: dividerContent.style === style ? '#E8F3FF' : '#fff',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: dividerContent.style === style ? '600' : '400'
                    }}
                  >
                    {style === 'line' ? '실선' : style === 'dots' ? '점선' : '여백'}
                  </button>
                ))}
              </div>
            </div>
            {dividerContent.style !== 'space' && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#333D4B',
                  marginBottom: '6px'
                }}>
                  구분선 색상
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={dividerContent.color || '#E5E8EB'}
                    onChange={(e) => handleContentUpdate({ color: e.target.value })}
                    style={{
                      width: '50px',
                      height: '40px',
                      border: '1px solid #E5E8EB',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  />
                  <input
                    type="text"
                    value={dividerContent.color || '#E5E8EB'}
                    onChange={(e) => handleContentUpdate({ color: e.target.value })}
                    style={{
                      flex: 1,
                      padding: '10px 12px',
                      border: '1px solid #E5E8EB',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
            )}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '13px',
                fontWeight: '600',
                color: '#333D4B',
                marginBottom: '6px'
              }}>
                <span>여백 (px)</span>
                <span style={{ color: '#0064FF' }}>{dividerContent.spacing || 40}px</span>
              </label>
              <input
                type="range"
                min={10}
                max={100}
                value={dividerContent.spacing || 40}
                onChange={(e) => handleContentUpdate({ spacing: Number(e.target.value) })}
                style={{
                  width: '100%',
                  accentColor: '#0064FF'
                }}
              />
            </div>
          </>
        );

      default:
        return (
          <p style={{ color: '#8B95A1', textAlign: 'center', padding: '20px' }}>
            이 섹션은 아직 편집을 지원하지 않습니다
          </p>
        );
    }
  };

  return (
    <div style={{
      background: '#fff',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* 헤더 */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #E5E8EB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: '700',
          color: '#191F28',
          margin: 0
        }}>
          {sectionLabels[section.type] || section.type} 편집
        </h3>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            color: '#8B95A1'
          }}
        >
          ×
        </button>
      </div>

      {/* 편집 영역 */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px'
      }}>
        {/* 스타일 옵션 */}
        <div style={{
          background: '#F8FAFC',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '20px'
        }}>
          <h4 style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#333D4B',
            marginBottom: '12px',
            marginTop: 0
          }}>
            📐 스타일 설정
          </h4>
          {renderFontSizeSlider('제목 크기', localStyle.titleFontSize || 28, (v) => handleStyleUpdate({ titleFontSize: v }), 18, 48)}
          {renderFontSizeSlider('본문 크기', localStyle.textFontSize || 16, (v) => handleStyleUpdate({ textFontSize: v }), 12, 24)}
        </div>

        {/* 콘텐츠 편집 */}
        <div style={{
          background: '#F8FAFC',
          borderRadius: '12px',
          padding: '16px'
        }}>
          <h4 style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#333D4B',
            marginBottom: '12px',
            marginTop: 0
          }}>
            ✏️ 콘텐츠 편집
          </h4>
          {renderSectionEditor()}
        </div>
      </div>

      {/* 하단 액션 */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid #E5E8EB',
        display: 'flex',
        gap: '8px'
      }}>
        {onDeleteSection && (
          <button
            onClick={onDeleteSection}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border: '1px solid #F04452',
              background: '#fff',
              color: '#F04452',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            삭제
          </button>
        )}
        <div style={{ flex: 1 }} />
        <button
          onClick={onClose}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            background: '#0064FF',
            color: '#fff',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          완료
        </button>
      </div>
    </div>
  );
}
