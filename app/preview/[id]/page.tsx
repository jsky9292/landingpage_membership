'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { SectionRenderer } from '@/components/sections/SectionRenderer';
import { SectionEditor } from '@/components/builder/SectionEditor';
import { AddSectionPanel } from '@/components/builder/AddSectionPanel';
import { ThemeSelector } from '@/components/builder/ThemeSelector';
import { Section, FormField, SectionContent, SectionStyle, ThemeType } from '@/types/page';
import html2canvas from 'html2canvas';

interface ContactInfo {
  phoneNumber?: string;
  email?: string;
  kakaoId?: string;
}

interface PageData {
  id: string;
  topic: string;
  prompt: string;
  title: string;
  slug: string;
  status: 'draft' | 'published';
  sections: Section[];
  formFields: FormField[];
  theme: string;
  contactInfo?: ContactInfo;
}

export default function PreviewEditPage() {
  const router = useRouter();
  const params = useParams();
  const pageId = params.id as string;

  const [data, setData] = useState<PageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [showAddSection, setShowAddSection] = useState(false);
  const [showThemePanel, setShowThemePanel] = useState(false);
  const [showContactSettings, setShowContactSettings] = useState(false);
  const [insertAfterOrder, setInsertAfterOrder] = useState<number>(999);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // 페이지 데이터 로드
  useEffect(() => {
    const fetchPage = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/pages/${pageId}`);

        if (!res.ok) {
          if (res.status === 404) {
            setError('페이지를 찾을 수 없습니다.');
          } else if (res.status === 403) {
            setError('접근 권한이 없습니다.');
          } else if (res.status === 401) {
            router.push(`/login?callbackUrl=/preview/${pageId}`);
            return;
          } else {
            setError('페이지를 불러오는데 실패했습니다.');
          }
          return;
        }

        const result = await res.json();
        const page = result.page;

        setData({
          id: page.id,
          topic: page.topic || '',
          prompt: page.prompt || '',
          title: page.title || '랜딩페이지',
          slug: page.slug,
          status: page.status,
          sections: (page.sections || []).map((s: Section, i: number) => ({
            ...s,
            id: s.id || `section-${i}`,
            order: s.order ?? i,
          })),
          formFields: page.formFields || [],
          theme: page.theme || 'toss',
          contactInfo: page.contactInfo || {},
        });
      } catch (err) {
        console.error('Fetch page error:', err);
        setError('서버 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    if (pageId) {
      fetchPage();
    }
  }, [pageId, router]);

  // 저장 함수
  const handleSave = async () => {
    if (!data) return;

    setIsSaving(true);
    setSaveMessage(null);

    try {
      const res = await fetch(`/api/pages/${pageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          sections: data.sections,
          formFields: data.formFields,
          theme: data.theme,
          contactInfo: data.contactInfo || {},
        }),
      });

      if (res.ok) {
        setSaveMessage('저장되었습니다!');
        setHasUnsavedChanges(false);
        setTimeout(() => setSaveMessage(null), 2000);
      } else {
        setSaveMessage('저장에 실패했습니다.');
        setTimeout(() => setSaveMessage(null), 3000);
      }
    } catch (err) {
      console.error('Save error:', err);
      setSaveMessage('저장 중 오류가 발생했습니다.');
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  // 배포/게시 함수
  const handlePublish = async () => {
    if (!data) return;

    setIsSaving(true);
    try {
      const res = await fetch(`/api/pages/${pageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          sections: data.sections,
          formFields: data.formFields,
          theme: data.theme,
          contactInfo: data.contactInfo || {},
          status: 'published',
        }),
      });

      if (res.ok) {
        setData({ ...data, status: 'published' });
        setSaveMessage('게시되었습니다!');
        setHasUnsavedChanges(false);
        setTimeout(() => setSaveMessage(null), 2000);
      } else {
        setSaveMessage('게시에 실패했습니다.');
        setTimeout(() => setSaveMessage(null), 3000);
      }
    } catch (err) {
      console.error('Publish error:', err);
      setSaveMessage('게시 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  // 이미지 다운로드
  const handleDownloadImage = async () => {
    if (!previewRef.current) return;

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        scrollY: -window.scrollY,
        windowHeight: previewRef.current.scrollHeight,
      });

      const link = document.createElement('a');
      link.download = `${data?.title || 'landing-page'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Download failed:', error);
      alert('이미지 다운로드에 실패했습니다');
    } finally {
      setIsDownloading(false);
    }
  };

  // 섹션 편집 핸들러들
  const handleSectionSelect = (sectionId: string | null) => {
    setEditingSection(sectionId);
    if (sectionId && !isEditing) {
      setIsEditing(true);
    }
  };

  const handleSectionContentChange = (sectionId: string, content: SectionContent) => {
    if (!data) return;
    const newSections = data.sections.map((s) =>
      s.id === sectionId ? { ...s, content } : s
    );
    setData({ ...data, sections: newSections });
    setHasUnsavedChanges(true);
  };

  const handleSectionStyleChange = (sectionId: string, style: SectionStyle) => {
    if (!data) return;
    const newSections = data.sections.map((s) =>
      s.id === sectionId ? { ...s, style } : s
    );
    setData({ ...data, sections: newSections });
    setHasUnsavedChanges(true);
  };

  const handleAddSection = (newSection: Section) => {
    if (!data) return;
    const sectionWithOrder = {
      ...newSection,
      order: insertAfterOrder + 0.5,
    };
    const newSections = [...data.sections, sectionWithOrder]
      .sort((a, b) => a.order - b.order)
      .map((s, i) => ({ ...s, order: i }));
    setData({ ...data, sections: newSections });
    setEditingSection(newSection.id);
    setShowAddSection(false);
    setHasUnsavedChanges(true);
  };

  const handleAddSectionAt = (order: number) => {
    setInsertAfterOrder(order);
    setShowAddSection(true);
    setEditingSection(null);
  };

  const handleMoveSection = (sectionId: string, direction: 'up' | 'down') => {
    if (!data) return;
    const sortedSections = [...data.sections].sort((a, b) => a.order - b.order);
    const currentIndex = sortedSections.findIndex((s) => s.id === sectionId);

    if (currentIndex === -1) return;
    if (direction === 'up' && currentIndex === 0) return;
    if (direction === 'down' && currentIndex === sortedSections.length - 1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    const temp = sortedSections[currentIndex].order;
    sortedSections[currentIndex].order = sortedSections[targetIndex].order;
    sortedSections[targetIndex].order = temp;

    const newSections = sortedSections
      .sort((a, b) => a.order - b.order)
      .map((s, i) => ({ ...s, order: i }));
    setData({ ...data, sections: newSections });
    setHasUnsavedChanges(true);
  };

  const handleDeleteSection = (sectionId: string) => {
    if (!data) return;
    if (!confirm('이 섹션을 삭제하시겠습니까?')) return;

    const newSections = data.sections
      .filter((s) => s.id !== sectionId)
      .map((s, i) => ({ ...s, order: i }));
    setData({ ...data, sections: newSections });
    setEditingSection(null);
    setHasUnsavedChanges(true);
  };

  const handleReorderSections = (reorderedSections: Section[]) => {
    if (!data) return;
    setData({ ...data, sections: reorderedSections });
    setHasUnsavedChanges(true);
  };

  const handleThemeChange = (theme: ThemeType) => {
    if (!data) return;
    setData({ ...data, theme });
    setHasUnsavedChanges(true);
  };

  const getSelectedSection = (): Section | null => {
    if (!data || !editingSection) return null;
    return data.sections.find((s) => s.id === editingSection) || null;
  };

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#F8FAFC'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #E5E8EB',
            borderTopColor: '#0064FF',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ color: '#4E5968' }}>페이지 불러오는 중...</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#F8FAFC'
      }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ fontSize: '48px', marginBottom: '16px' }}>😢</p>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: '#191F28' }}>
            {error || '페이지를 불러올 수 없습니다'}
          </h1>
          <p style={{ color: '#4E5968', marginBottom: '24px' }}>
            페이지가 삭제되었거나 접근 권한이 없습니다.
          </p>
          <button
            onClick={() => router.push('/pages')}
            style={{
              background: '#0064FF',
              color: '#fff',
              padding: '14px 28px',
              borderRadius: '12px',
              border: 'none',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            페이지 목록으로
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F2F4F6' }}>
      {/* 저장 알림 */}
      {saveMessage && (
        <div style={{
          position: 'fixed',
          top: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: saveMessage.includes('실패') || saveMessage.includes('오류') ? '#FEE2E2' : '#D1FAE5',
          color: saveMessage.includes('실패') || saveMessage.includes('오류') ? '#DC2626' : '#059669',
          padding: '12px 24px',
          borderRadius: '12px',
          fontWeight: '600',
          zIndex: 200,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          {saveMessage}
        </div>
      )}

      {/* 상단 툴바 */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        background: '#fff',
        borderBottom: '1px solid #E5E8EB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => {
              if (hasUnsavedChanges && !confirm('저장되지 않은 변경사항이 있습니다. 나가시겠습니까?')) {
                return;
              }
              router.push('/pages');
            }}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#4E5968'
            }}
          >
            ← 목록으로
          </button>
          <span style={{ color: '#E5E8EB' }}>|</span>
          <span style={{ fontWeight: '600', color: '#191F28' }}>{data.title}</span>
          {data.status === 'published' ? (
            <span style={{
              fontSize: '12px',
              padding: '4px 8px',
              background: '#D1FAE5',
              color: '#059669',
              borderRadius: '4px',
              fontWeight: '600'
            }}>
              게시중
            </span>
          ) : (
            <span style={{
              fontSize: '12px',
              padding: '4px 8px',
              background: '#FEF3C7',
              color: '#D97706',
              borderRadius: '4px',
              fontWeight: '600'
            }}>
              임시저장
            </span>
          )}
          {hasUnsavedChanges && (
            <span style={{
              fontSize: '12px',
              color: '#EF4444',
              fontWeight: '600'
            }}>
              (저장되지 않음)
            </span>
          )}
        </div>

        {/* 뷰 모드 토글 */}
        <div style={{
          display: 'flex',
          background: '#F2F4F6',
          borderRadius: '8px',
          padding: '4px'
        }}>
          <button
            onClick={() => setViewMode('mobile')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              background: viewMode === 'mobile' ? '#fff' : 'transparent',
              color: viewMode === 'mobile' ? '#0064FF' : '#4E5968',
              fontWeight: viewMode === 'mobile' ? '600' : '400',
              cursor: 'pointer',
              boxShadow: viewMode === 'mobile' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            📱 모바일
          </button>
          <button
            onClick={() => setViewMode('desktop')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              background: viewMode === 'desktop' ? '#fff' : 'transparent',
              color: viewMode === 'desktop' ? '#0064FF' : '#4E5968',
              fontWeight: viewMode === 'desktop' ? '600' : '400',
              cursor: 'pointer',
              boxShadow: viewMode === 'desktop' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            🖥️ 데스크톱
          </button>
        </div>

        {/* 액션 버튼 */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => {
              setIsEditing(!isEditing);
              if (isEditing) setEditingSection(null);
            }}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: isEditing ? 'none' : '1px solid #E5E8EB',
              background: isEditing ? '#191F28' : '#fff',
              color: isEditing ? '#fff' : '#4E5968',
              fontSize: '14px',
              fontWeight: isEditing ? '600' : '400',
              cursor: 'pointer'
            }}
          >
            {isEditing ? '✏️ 편집 중' : '✏️ 편집하기'}
          </button>
          <button
            onClick={handleDownloadImage}
            disabled={isDownloading}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: '1px solid #E5E8EB',
              background: '#fff',
              color: '#4E5968',
              fontSize: '14px',
              cursor: isDownloading ? 'not-allowed' : 'pointer',
              opacity: isDownloading ? 0.7 : 1
            }}
          >
            {isDownloading ? '다운로드 중...' : '📥 이미지'}
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !hasUnsavedChanges}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: '1px solid #E5E8EB',
              background: hasUnsavedChanges ? '#fff' : '#F3F4F6',
              color: hasUnsavedChanges ? '#4E5968' : '#9CA3AF',
              fontSize: '14px',
              cursor: isSaving || !hasUnsavedChanges ? 'not-allowed' : 'pointer'
            }}
          >
            {isSaving ? '저장 중...' : '💾 저장'}
          </button>
          {data.status === 'published' ? (
            <a
              href={`/p/${data.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                background: '#0064FF',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '600',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              🔗 페이지 보기
            </a>
          ) : (
            <button
              onClick={handlePublish}
              disabled={isSaving}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                background: isSaving ? '#B0C4DE' : '#0064FF',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '600',
                cursor: isSaving ? 'not-allowed' : 'pointer'
              }}
            >
              {isSaving ? '게시 중...' : '게시하기 🚀'}
            </button>
          )}
        </div>
      </div>

      {/* 프리뷰 영역 */}
      <div style={{
        paddingTop: '80px',
        paddingBottom: '40px',
        display: 'flex',
        justifyContent: 'center',
        gap: '24px',
        paddingRight: isEditing ? '360px' : '0',
        transition: 'padding-right 0.3s ease'
      }}>
        <div
          ref={previewRef}
          style={{
            width: viewMode === 'mobile' ? '390px' : '100%',
            maxWidth: viewMode === 'desktop' ? '1200px' : '390px',
            background: '#fff',
            borderRadius: viewMode === 'mobile' ? '24px' : '0',
            boxShadow: viewMode === 'mobile' ? '0 8px 32px rgba(0,0,0,0.12)' : 'none',
            overflow: 'hidden',
            transition: 'all 0.3s ease'
          }}
        >
          <SectionRenderer
            sections={data.sections}
            formFields={data.formFields}
            theme={(data.theme as ThemeType) || 'toss'}
            isEditable={isEditing}
            editingSection={editingSection}
            onSectionSelect={handleSectionSelect}
            onSectionEdit={(sectionId, content) => handleSectionContentChange(sectionId, content)}
            onSectionStyleEdit={(sectionId, style) => handleSectionStyleChange(sectionId, style)}
            onAddSectionAt={handleAddSectionAt}
            onMoveSection={handleMoveSection}
            onDeleteSection={handleDeleteSection}
            onReorderSections={handleReorderSections}
            onFormSubmit={(formData) => {
              console.log('Form submitted:', formData);
              alert('미리보기에서는 폼 제출이 작동하지 않습니다');
            }}
          />
        </div>
      </div>

      {/* 편집 패널 */}
      {isEditing && (
        <div style={{
          position: 'fixed',
          top: '60px',
          right: 0,
          width: '360px',
          height: 'calc(100vh - 60px)',
          background: '#fff',
          borderLeft: '1px solid #E5E8EB',
          boxShadow: '-4px 0 20px rgba(0,0,0,0.05)',
          zIndex: 90,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* 패널 상단 탭 */}
          {!showAddSection && !editingSection && (
            <div style={{
              display: 'flex',
              borderBottom: '1px solid #E5E8EB',
              background: '#F8FAFC',
            }}>
              <button
                onClick={() => setShowThemePanel(false)}
                style={{
                  flex: 1,
                  padding: '14px',
                  border: 'none',
                  background: !showThemePanel ? '#fff' : 'transparent',
                  color: !showThemePanel ? '#0064FF' : '#6B7280',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  borderBottom: !showThemePanel ? '2px solid #0064FF' : '2px solid transparent',
                }}
              >
                📝 섹션 편집
              </button>
              <button
                onClick={() => setShowThemePanel(true)}
                style={{
                  flex: 1,
                  padding: '14px',
                  border: 'none',
                  background: showThemePanel ? '#fff' : 'transparent',
                  color: showThemePanel ? '#0064FF' : '#6B7280',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  borderBottom: showThemePanel ? '2px solid #0064FF' : '2px solid transparent',
                }}
              >
                🎨 톤앤매너
              </button>
            </div>
          )}

          {/* 패널 콘텐츠 */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            {showAddSection ? (
              <AddSectionPanel
                onAddSection={handleAddSection}
                onClose={() => setShowAddSection(false)}
                insertAfterOrder={insertAfterOrder}
              />
            ) : editingSection ? (
              <SectionEditor
                section={getSelectedSection()}
                onContentChange={(content) => {
                  if (editingSection) {
                    handleSectionContentChange(editingSection, content);
                  }
                }}
                onStyleChange={(style) => {
                  if (editingSection) {
                    handleSectionStyleChange(editingSection, style);
                  }
                }}
                onClose={() => setEditingSection(null)}
                onDeleteSection={() => handleDeleteSection(editingSection)}
              />
            ) : showThemePanel ? (
              <ThemeSelector
                currentTheme={(data?.theme as ThemeType) || 'toss'}
                onThemeChange={handleThemeChange}
              />
            ) : (
              <div style={{
                padding: '32px 24px',
                textAlign: 'center',
                color: '#8B95A1'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>👆</div>
                <p style={{ fontSize: '16px', fontWeight: '600', color: '#191F28', marginBottom: '8px' }}>
                  섹션을 선택하세요
                </p>
                <p style={{ fontSize: '14px', marginBottom: '24px' }}>
                  왼쪽 미리보기에서 편집할 섹션을 클릭하면<br/>
                  여기서 내용을 수정할 수 있어요
                </p>
                <button
                  onClick={() => setShowAddSection(true)}
                  style={{
                    padding: '14px 28px',
                    borderRadius: '12px',
                    border: 'none',
                    background: '#0064FF',
                    color: '#fff',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  ➕ 새 섹션 추가
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
