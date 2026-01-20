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
  ogImage?: string | null; // 명함/홍보용 OG 이미지
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
  const [showShareSettings, setShowShareSettings] = useState(false); // 공유 설정 패널
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
          ogImage: page.ogImage || null, // 명함/홍보용 OG 이미지
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
          ogImage: data.ogImage || null, // 명함/홍보용 OG 이미지
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
          ogImage: data.ogImage || null, // 명함/홍보용 OG 이미지
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

    // sectionImage와 sectionVideo는 content에서 추출하여 section 레벨로 이동
    const contentAny = content as any;
    const sectionImage = contentAny.sectionImage;
    const sectionVideo = contentAny.sectionVideo;

    // content에서 sectionImage, sectionVideo 제거 (section 레벨에 저장되므로)
    const cleanContent = { ...content };
    delete (cleanContent as any).sectionImage;
    delete (cleanContent as any).sectionVideo;

    const newSections = data.sections.map((s) =>
      s.id === sectionId
        ? {
            ...s,
            content: cleanContent,
            // sectionImage/sectionVideo가 있으면 section 레벨에 저장
            ...(sectionImage !== undefined && { sectionImage }),
            ...(sectionVideo !== undefined && { sectionVideo }),
          }
        : s
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

  // OG 이미지 (명함/홍보 이미지) 변경 핸들러
  const handleOgImageChange = (imageUrl: string) => {
    if (!data) return;
    setData({ ...data, ogImage: imageUrl || null });
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
                onClick={() => { setShowThemePanel(false); setShowShareSettings(false); }}
                style={{
                  flex: 1,
                  padding: '14px',
                  border: 'none',
                  background: !showThemePanel && !showShareSettings ? '#fff' : 'transparent',
                  color: !showThemePanel && !showShareSettings ? '#0064FF' : '#6B7280',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  borderBottom: !showThemePanel && !showShareSettings ? '2px solid #0064FF' : '2px solid transparent',
                }}
              >
                📝 섹션
              </button>
              <button
                onClick={() => { setShowThemePanel(true); setShowShareSettings(false); }}
                style={{
                  flex: 1,
                  padding: '14px',
                  border: 'none',
                  background: showThemePanel && !showShareSettings ? '#fff' : 'transparent',
                  color: showThemePanel && !showShareSettings ? '#0064FF' : '#6B7280',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  borderBottom: showThemePanel && !showShareSettings ? '2px solid #0064FF' : '2px solid transparent',
                }}
              >
                🎨 테마
              </button>
              <button
                onClick={() => { setShowThemePanel(false); setShowShareSettings(true); }}
                style={{
                  flex: 1,
                  padding: '14px',
                  border: 'none',
                  background: showShareSettings ? '#fff' : 'transparent',
                  color: showShareSettings ? '#0064FF' : '#6B7280',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  borderBottom: showShareSettings ? '2px solid #0064FF' : '2px solid transparent',
                }}
              >
                🔗 공유
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
            ) : showShareSettings ? (
              <ShareSettingsPanel
                ogImage={data?.ogImage || ''}
                onOgImageChange={handleOgImageChange}
                pageSlug={data?.slug || ''}
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

// 공유 설정 패널 컴포넌트
function ShareSettingsPanel({
  ogImage,
  onOgImageChange,
  pageSlug,
}: {
  ogImage: string;
  onOgImageChange: (url: string) => void;
  pageSlug: string;
}) {
  const [imageUrl, setImageUrl] = useState(ogImage);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
  const [isRotating, setIsRotating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 이미지 회전 함수 (Canvas 사용)
  const rotateImage = async (degrees: number) => {
    if (!imageUrl || isRotating) return;

    setIsRotating(true);
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('이미지 로드 실패'));
        img.src = imageUrl;
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas 컨텍스트 생성 실패');

      // 90도 회전 시 가로/세로 크기 교환
      const isVerticalRotation = degrees === 90 || degrees === 270;
      canvas.width = isVerticalRotation ? img.height : img.width;
      canvas.height = isVerticalRotation ? img.width : img.height;

      // Canvas 중심으로 회전
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((degrees * Math.PI) / 180);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);

      // Blob으로 변환 후 업로드
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => {
          if (b) resolve(b);
          else reject(new Error('이미지 변환 실패'));
        }, 'image/png', 0.95);
      });

      const formData = new FormData();
      formData.append('file', blob, 'rotated-image.png');

      const res = await fetch('/api/upload/og-image', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || '업로드 실패');

      setImageUrl(result.url);
      onOgImageChange(result.url);
      setRotation(0); // 회전 적용 후 리셋
    } catch (err) {
      console.error('Rotation error:', err);
      setError(err instanceof Error ? err.message : '회전 실패');
    } finally {
      setIsRotating(false);
    }
  };

  const handleRotateLeft = () => rotateImage(270);
  const handleRotateRight = () => rotateImage(90);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 크기 체크 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      setError('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    // 이미지 타입 체크
    if (!file.type.startsWith('image/')) {
      setError('이미지 파일만 업로드 가능합니다.');
      return;
    }

    setError('');
    setUploading(true);

    try {
      // Supabase Storage에 업로드
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload/og-image', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || '업로드 실패');
      }

      // 공개 URL 설정
      setImageUrl(result.url);
      onOgImageChange(result.url);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : '업로드 실패');
    } finally {
      setUploading(false);
    }
  };

  const handleUrlSubmit = () => {
    if (imageUrl.trim()) {
      if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://') && !imageUrl.startsWith('data:')) {
        setError('올바른 URL을 입력해주세요.');
        return;
      }
      onOgImageChange(imageUrl);
      setShowUrlInput(false);
      setError('');
    }
  };

  const handleRemoveImage = () => {
    setImageUrl('');
    onOgImageChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div style={{ padding: '24px', overflowY: 'auto', height: '100%' }}>
      <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#191F28', marginBottom: '8px' }}>
        🔗 공유 설정
      </h3>
      <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '24px' }}>
        카카오톡, 문자 등으로 링크를 공유할 때<br/>
        미리보기에 표시될 명함/홍보 이미지를 설정하세요.
      </p>

      {/* 이미지 미리보기 */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
          명함/홍보 이미지
        </label>

        {imageUrl ? (
          <div style={{ position: 'relative' }}>
            <div style={{
              aspectRatio: '1200/630',
              backgroundColor: '#F3F4F6',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid #E5E7EB',
            }}>
              <img
                src={imageUrl}
                alt="OG 이미지 미리보기"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={() => setError('이미지를 불러올 수 없습니다.')}
              />
            </div>

            {/* 회전 버튼 */}
            <div style={{
              display: 'flex',
              gap: '8px',
              marginTop: '12px',
              justifyContent: 'center',
            }}>
              <button
                type="button"
                onClick={handleRotateLeft}
                disabled={isRotating}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                  background: isRotating ? '#F3F4F6' : '#fff',
                  color: isRotating ? '#9CA3AF' : '#374151',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: isRotating ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                ↺ 왼쪽 회전
              </button>
              <button
                type="button"
                onClick={handleRotateRight}
                disabled={isRotating}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                  background: isRotating ? '#F3F4F6' : '#fff',
                  color: isRotating ? '#9CA3AF' : '#374151',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: isRotating ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                ↻ 오른쪽 회전
              </button>
            </div>

            {isRotating && (
              <div style={{
                textAlign: 'center',
                fontSize: '12px',
                color: '#6B7280',
                marginTop: '8px',
              }}>
                회전 중...
              </div>
            )}

            {/* 변경/삭제 버튼 */}
            <div style={{
              display: 'flex',
              gap: '8px',
              marginTop: '12px',
            }}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                  background: '#fff',
                  color: '#374151',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                변경
              </button>
              <button
                type="button"
                onClick={handleRemoveImage}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#FEE2E2',
                  color: '#DC2626',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                삭제
              </button>
            </div>
          </div>
        ) : (
          <div style={{
            aspectRatio: '1200/630',
            border: '2px dashed #D1D5DB',
            borderRadius: '12px',
            backgroundColor: '#F9FAFB',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            cursor: 'pointer',
          }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🖼️</div>
            <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '16px', textAlign: 'center' }}>
              명함이나 홍보용 이미지를 업로드하세요<br/>
              <span style={{ fontSize: '12px', color: '#9CA3AF' }}>권장 크기: 1200 x 630px</span>
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: uploading ? '#9CA3AF' : '#0064FF',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: uploading ? 'not-allowed' : 'pointer',
                }}
              >
                {uploading ? '업로드 중...' : '파일 선택'}
              </button>
              <button
                type="button"
                onClick={() => setShowUrlInput(true)}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                  background: '#fff',
                  color: '#374151',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                URL 입력
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 파일 input (숨김) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* URL 입력 */}
      {showUrlInput && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            style={{
              flex: 1,
              padding: '10px 12px',
              border: '1px solid #D1D5DB',
              borderRadius: '8px',
              fontSize: '13px',
            }}
          />
          <button
            type="button"
            onClick={handleUrlSubmit}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border: 'none',
              background: '#0064FF',
              color: '#fff',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            확인
          </button>
          <button
            type="button"
            onClick={() => { setShowUrlInput(false); setImageUrl(ogImage); }}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              background: '#fff',
              color: '#374151',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            취소
          </button>
        </div>
      )}

      {/* 에러 메시지 */}
      {error && (
        <p style={{ fontSize: '13px', color: '#DC2626', marginBottom: '16px' }}>{error}</p>
      )}

      {/* 안내 */}
      <div style={{
        padding: '16px',
        backgroundColor: '#F0F9FF',
        borderRadius: '12px',
        marginTop: '24px',
      }}>
        <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#0369A1', marginBottom: '8px' }}>
          💡 활용 팁
        </h4>
        <ul style={{ fontSize: '13px', color: '#0C4A6E', margin: 0, paddingLeft: '16px', lineHeight: '1.6' }}>
          <li>명함 이미지를 넣으면 전문적인 인상을 줄 수 있어요</li>
          <li>홍보용 배너 이미지를 사용하면 클릭률이 높아져요</li>
          <li>카카오톡, 문자, SNS 공유 시 이 이미지가 표시돼요</li>
        </ul>
      </div>

      {/* 미리보기 예시 */}
      {imageUrl && (
        <div style={{ marginTop: '24px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
            📱 카카오톡 공유 미리보기
          </h4>
          <div style={{
            padding: '12px',
            backgroundColor: '#F3F4F6',
            borderRadius: '12px',
          }}>
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
            }}>
              <div style={{ aspectRatio: '1200/630', overflow: 'hidden' }}>
                <img
                  src={imageUrl}
                  alt="미리보기"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '12px' }}>
                <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>landingmaker.kr</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
