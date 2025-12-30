'use client';

import { useState } from 'react';
import { SectionRenderer } from '@/components/sections/SectionRenderer';
import { FloatingCTA } from '@/components/landing/FloatingCTA';
import { Section } from '@/types/page';

interface PublishedLandingPageProps {
  page: {
    id: string;
    title: string;
    slug: string;
    content: {
      sections: Section[];
    };
    theme: string;
    formFields: any[];
    notifyKakao: boolean;
    notifyEmail: boolean;
  };
}

export function PublishedLandingPage({ page }: PublishedLandingPageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const scrollToForm = () => {
    const formSection = document.getElementById('form-section');
    formSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFormSubmit = async (data: Record<string, string>) => {
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/submit/${page.slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data,
          pageId: page.id,
        }),
      });

      if (!response.ok) {
        throw new Error('제출 중 오류가 발생했습니다.');
      }

      setIsSubmitted(true);
    } catch (error) {
      alert('제출 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 제출 완료 화면
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-5">
        <div className="text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-2xl font-bold text-[#191F28] mb-4">
            신청이 완료되었어요!
          </h1>
          <p className="text-[#4E5968] mb-8">
            빠른 시간 내에 연락드리겠습니다.
            <br />
            감사합니다!
          </p>
          <button
            onClick={() => window.location.reload()}
            className="text-[#0064FF] font-semibold hover:underline"
          >
            처음으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 페이지 렌더링 */}
      <SectionRenderer
        sections={page.content.sections}
        formFields={page.formFields}
        onFormSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />

      {/* 플로팅 CTA */}
      <FloatingCTA
        buttonText={
          (page.content.sections.find((s) => s.type === 'hero')?.content as any)?.cta ||
          '신청하기'
        }
        onClick={scrollToForm}
      />
    </div>
  );
}
