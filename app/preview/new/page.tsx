'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { SectionRenderer } from '@/components/sections/SectionRenderer';
import { SectionEditor } from '@/components/builder/SectionEditor';
import { AddSectionPanel } from '@/components/builder/AddSectionPanel';
import { ThemeSelector } from '@/components/builder/ThemeSelector';
import { Section, FormField, SectionContent, SectionStyle, ThemeType } from '@/types/page';
import html2canvas from 'html2canvas';

interface GeneratedData {
  topic: string;
  prompt: string;
  title: string;
  sections: Section[];
  formFields: FormField[];
  theme: string;
}

export default function PreviewNewPage() {
  const router = useRouter();
  const [data, setData] = useState<GeneratedData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployedUrl, setDeployedUrl] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [showAddSection, setShowAddSection] = useState(false);
  const [showThemePanel, setShowThemePanel] = useState(false);
  const [insertAfterOrder, setInsertAfterOrder] = useState<number>(999);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('generatedPage');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const sections = parsed.sections || parsed.content?.sections || [];
        const formFields = parsed.formFields || [];

        setData({
          topic: parsed.topic,
          prompt: parsed.prompt,
          title: parsed.title || '새 랜딩페이지',
          sections: sections.map((s: any, i: number) => ({
            ...s,
            id: s.id || `section-${i}`,
            order: s.order ?? i,
          })),
          formFields,
          theme: parsed.theme || 'toss',
        });
      } catch (e) {
        console.error('Failed to parse generated page:', e);
      }
    }
    setIsLoading(false);
  }, []);

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

  // 배포하기
  const handleDeploy = async () => {
    if (!data) return;

    setIsDeploying(true);
    try {
      // 고유 슬러그 생성
      const slug = `page-${Date.now().toString(36)}`;

      // 페이지 데이터 저장 (localStorage에 임시 저장, 실제로는 DB에 저장)
      const deployedPages = JSON.parse(localStorage.getItem('deployedPages') || '{}');
      deployedPages[slug] = {
        ...data,
        slug,
        publishedAt: new Date().toISOString(),
      };
      localStorage.setItem('deployedPages', JSON.stringify(deployedPages));

      const url = `${window.location.origin}/p/${slug}`;
      setDeployedUrl(url);
    } catch (error) {
      console.error('Deploy failed:', error);
      alert('배포에 실패했습니다');
    } finally {
      setIsDeploying(false);
    }
  };

  // URL 복사
  const handleCopyUrl = () => {
    if (deployedUrl) {
      navigator.clipboard.writeText(deployedUrl);
      alert('URL이 복사되었습니다!');
    }
  };

  // 섹션 편집
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
    const newData = { ...data, sections: newSections };
    setData(newData);
    localStorage.setItem('generatedPage', JSON.stringify(newData));
  };

  const handleSectionStyleChange = (sectionId: string, style: SectionStyle) => {
    if (!data) return;
    const newSections = data.sections.map((s) =>
      s.id === sectionId ? { ...s, style } : s
    );
    const newData = { ...data, sections: newSections };
    setData(newData);
    localStorage.setItem('generatedPage', JSON.stringify(newData));
  };

  const handleAddSection = (newSection: Section) => {
    if (!data) return;
    // insertAfterOrder 위치에 섹션 삽입
    const sectionWithOrder = {
      ...newSection,
      order: insertAfterOrder + 0.5,
    };
    const newSections = [...data.sections, sectionWithOrder]
      .sort((a, b) => a.order - b.order)
      .map((s, i) => ({ ...s, order: i }));
    const newData = { ...data, sections: newSections };
    setData(newData);
    localStorage.setItem('generatedPage', JSON.stringify(newData));
    setEditingSection(newSection.id);
    setShowAddSection(false);
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

    // 순서 교환
    const temp = sortedSections[currentIndex].order;
    sortedSections[currentIndex].order = sortedSections[targetIndex].order;
    sortedSections[targetIndex].order = temp;

    const newSections = sortedSections
      .sort((a, b) => a.order - b.order)
      .map((s, i) => ({ ...s, order: i }));
    const newData = { ...data, sections: newSections };
    setData(newData);
    localStorage.setItem('generatedPage', JSON.stringify(newData));
  };

  const handleDeleteSection = (sectionId: string) => {
    if (!data) return;
    if (!confirm('이 섹션을 삭제하시겠습니까?')) return;

    const newSections = data.sections
      .filter((s) => s.id !== sectionId)
      .map((s, i) => ({ ...s, order: i }));
    const newData = { ...data, sections: newSections };
    setData(newData);
    localStorage.setItem('generatedPage', JSON.stringify(newData));
    setEditingSection(null);
  };

  const handleThemeChange = (theme: ThemeType) => {
    if (!data) return;
    const newData = { ...data, theme };
    setData(newData);
    localStorage.setItem('generatedPage', JSON.stringify(newData));
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
          <p style={{ color: '#4E5968' }}>불러오는 중...</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!data || !data.sections || data.sections.length === 0) {
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
            생성된 페이지가 없어요
          </h1>
          <p style={{ color: '#4E5968', marginBottom: '24px' }}>
            먼저 랜딩페이지를 생성해주세요
          </p>
          <button
            onClick={() => router.push('/')}
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
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F2F4F6' }}>
      {/* 배포 완료 모달 */}
      {deployedUrl && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '20px',
            padding: '32px',
            maxWidth: '480px',
            width: '90%',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: '#191F28' }}>
              배포 완료!
            </h2>
            <p style={{ color: '#4E5968', marginBottom: '24px' }}>
              랜딩페이지가 성공적으로 배포되었습니다
            </p>

            <div style={{
              background: '#F2F4F6',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px',
              wordBreak: 'break-all'
            }}>
              <p style={{ fontSize: '14px', color: '#4E5968', marginBottom: '8px' }}>페이지 URL</p>
              <p style={{ fontSize: '16px', fontWeight: '600', color: '#0064FF' }}>{deployedUrl}</p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleCopyUrl}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: '12px',
                  border: '1px solid #E5E8EB',
                  background: '#fff',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                URL 복사
              </button>
              <button
                onClick={() => window.open(deployedUrl, '_blank')}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: '12px',
                  border: 'none',
                  background: '#0064FF',
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                페이지 보기
              </button>
            </div>

            <button
              onClick={() => setDeployedUrl(null)}
              style={{
                marginTop: '16px',
                background: 'none',
                border: 'none',
                color: '#8B95A1',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              닫기
            </button>
          </div>
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
            onClick={() => router.push('/')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#4E5968'
            }}
          >
            ← 뒤로
          </button>
          <span style={{ color: '#E5E8EB' }}>|</span>
          <span style={{ fontWeight: '600', color: '#191F28' }}>{data.title}</span>
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
            {isDownloading ? '다운로드 중...' : '📥 이미지 저장'}
          </button>
          <button
            onClick={() => router.push('/')}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: '1px solid #E5E8EB',
              background: '#fff',
              color: '#4E5968',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            다시 생성
          </button>
          <button
            onClick={handleDeploy}
            disabled={isDeploying}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              background: isDeploying ? '#B0C4DE' : '#0064FF',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: isDeploying ? 'not-allowed' : 'pointer'
            }}
          >
            {isDeploying ? '배포 중...' : '배포하기 🚀'}
          </button>
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
