'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { SectionRenderer } from '@/components/sections/SectionRenderer';
import { Section, FormField, SectionType, ThemeType } from '@/types/page';
import { THEMES } from '@/config/themes';

interface PageData {
  title: string;
  sections: Section[];
  formFields: FormField[];
  theme: string;
}

// 데모 페이지 데이터 - 설득력 있는 스토리텔링 카피
const DEMO_PAGE: PageData = {
  title: '월 300만원 강의 수익 시스템',
  sections: [
    {
      id: 'hero',
      type: 'hero' as SectionType,
      order: 0,
      content: {
        badge: '7기 모집 중 · 잔여 12석',
        headline: '블로그 하나 없이\n월 300만원 강의 수익을 만든 방법',
        subtext: '저도 6개월 전까진 수강생 0명이었어요.\n지금은 매달 문의가 먼저 옵니다.',
        cta: '어떻게 가능했는지 보기',
      },
    },
    {
      id: 'pain',
      type: 'pain' as SectionType,
      order: 1,
      content: {
        label: '혹시 이런 상황 아니세요?',
        title: '강의 열고 싶은데, 막막하시죠',
        items: [
          { icon: '', text: '실력은 있는데 어디서 어떻게 알려야 할지 모르겠어요. SNS 팔로워도 없고, 블로그 방문자도 하루 10명...' },
          { icon: '', text: '무료 특강 해봤는데 3명 왔어요. 그것도 지인이요. 민망해서 다시는 못 하겠더라고요.' },
          { icon: '', text: '클래스101, 탈잉 입점 해봤는데 수수료 30% 떼고 나니까 남는 게 없어요. 내 강의인데 내 수강생도 아니고.' },
        ],
      },
    },
    {
      id: 'solution',
      type: 'solution' as SectionType,
      order: 2,
      content: {
        label: '저도 똑같았어요',
        title: '근데 딱 한 가지를 바꿨더니',
        headline: '"이 강의 언제 열어요?" 문의가 먼저 오기 시작했어요',
        description: '화려한 마케팅 기술이 아니에요.\n수강생이 "이거 내 얘기잖아" 하게 만드는 글쓰기 하나로요.',
      },
    },
    {
      id: 'benefits',
      type: 'benefits' as SectionType,
      order: 3,
      content: {
        label: '4주 후 달라지는 것들',
        title: '이런 변화가 생겨요',
        items: [
          { icon: '', title: '글 하나에 문의 5건', description: '매번 홍보하느라 지치지 않아도 돼요. 한 번 쓴 글이 계속 일해요.' },
          { icon: '', title: '수강료 2배 올려도 OK', description: '"비싸도 듣고 싶어요"라는 말, 직접 들어보세요.' },
          { icon: '', title: '플랫폼 수수료 0원', description: '내 채널에서 내 수강생 만들어요. 수익 100% 내 것.' },
          { icon: '', title: '재수강, 소개 고객 증가', description: '만족한 수강생이 다음 수강생을 데려와요.' },
        ],
      },
    },
    {
      id: 'process',
      type: 'process' as SectionType,
      order: 4,
      content: {
        label: '4주 커리큘럼',
        title: '이렇게 진행돼요',
        steps: [
          { number: 1, title: '타겟 재정의', description: '"누구나"가 아닌 "딱 이 사람"을 찾아요. 여기서 90%가 결정돼요.' },
          { number: 2, title: '후킹 문장 만들기', description: '스크롤 멈추게 하는 첫 문장. 공식이 있어요.' },
          { number: 3, title: '스토리 설계', description: '"내 얘기잖아" 공감부터 "이거 들어야겠다" 결심까지.' },
          { number: 4, title: '랜딩페이지 완성', description: '글 하나로 신청까지 받는 페이지 만들어요.' },
        ],
      },
    },
    {
      id: 'philosophy',
      type: 'philosophy' as SectionType,
      order: 5,
      content: {
        label: '왜 효과가 있을까요?',
        title: '광고비 0원으로 매달 문의 오는 이유',
        items: [
          { icon: '🎯', title: '타겟의 언어로 말하기', description: '사람들은 "좋은 강의"를 찾지 않아요. "내 문제를 해결해줄 사람"을 찾아요.' },
          { icon: '💬', title: '공감이 먼저', description: '실력 자랑 대신, 수강생의 고민을 먼저 말해주는 거예요.' },
          { icon: '🤝', title: '신뢰 구축', description: '"어, 이 사람 내 상황 알아" 이 생각이 드는 순간, 신뢰가 생겨요.' },
        ],
      },
    },
    {
      id: 'video',
      type: 'video' as SectionType,
      order: 6,
      content: {
        label: '수강생 인터뷰',
        title: '실제로 변화를 경험한 분들 이야기',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        caption: '4주 만에 첫 수강생을 모집한 이야기를 들어보세요',
      },
    },
    {
      id: 'calendar',
      type: 'calendar' as SectionType,
      order: 7,
      content: {
        label: '1:1 무료 상담',
        title: '편한 시간에 상담 예약하세요',
        subtitle: '30분 동안 궁금한 점을 모두 답해드려요',
        availableDays: ['월', '화', '수', '목', '금'],
        availableTimes: ['10:00', '11:00', '14:00', '15:00', '16:00', '17:00'],
        duration: 30,
        note: '주말/공휴일 제외',
      },
    },
    {
      id: 'cta',
      type: 'cta' as SectionType,
      order: 8,
      content: {
        headline: '7기 마감까지 3일 남았어요',
        subtext: '다음 기수는 2달 뒤예요.\n지금 신청하면 1:1 피드백 추가 제공.',
        buttonText: '7기 참여 신청하기',
      },
    },
    {
      id: 'form',
      type: 'form' as SectionType,
      order: 9,
      content: {
        title: '7기 참여 신청',
        subtitle: '신청서 작성 후 24시간 내 안내 문자 드려요',
        note: '결제 전 상담 먼저 진행해요. 부담 없이 신청하세요.',
        buttonText: '신청하기',
      },
    },
  ],
  formFields: [
    { id: 'name', label: '이름', type: 'text', placeholder: '실명을 입력해주세요', required: true },
    { id: 'phone', label: '연락처', type: 'tel', placeholder: '010-0000-0000', required: true },
    { id: 'current', label: '현재 상황', type: 'text', placeholder: '예: 직장인, 강의 준비 중', required: false },
    { id: 'goal', label: '이루고 싶은 목표', type: 'textarea', placeholder: '예: 월 100만원 강의 수익 만들기', required: false },
  ],
  theme: 'toss',
};

export default function PublicPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [data, setData] = useState<PageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // 데모 페이지 처리
    if (slug === 'demo') {
      setData(DEMO_PAGE);
      setIsLoading(false);
      return;
    }

    // DB에서 페이지 데이터 가져오기
    const fetchPage = async () => {
      try {
        const response = await fetch(`/api/public/pages/${slug}`);
        const result = await response.json();

        if (response.ok && result.page) {
          setData({
            title: result.page.title,
            sections: result.page.sections || [],
            formFields: result.page.formFields || [],
            theme: result.page.theme || 'toss',
          });
        }
      } catch (error) {
        console.error('Failed to fetch page:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPage();
  }, [slug]);

  const handleFormSubmit = async (formData: Record<string, string>) => {
    setIsSubmitting(true);
    try {
      // DB에 신청 데이터 저장
      const response = await fetch(`/api/submit/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: formData }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '제출에 실패했습니다.');
      }

      setSubmitted(true);
    } catch (error) {
      console.error('Submit failed:', error);
      alert(error instanceof Error ? error.message : '제출에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fff'
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

  if (!data) {
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
            페이지를 찾을 수 없어요
          </h1>
          <p style={{ color: '#4E5968', marginBottom: '24px' }}>
            존재하지 않거나 삭제된 페이지입니다
          </p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to bottom, #E8F3FF, #FFFFFF)'
      }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>🎉</div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '12px', color: '#191F28' }}>
            신청이 완료되었습니다!
          </h1>
          <p style={{ color: '#4E5968', marginBottom: '32px', lineHeight: 1.6 }}>
            빠른 시일 내에 연락드리겠습니다.<br/>
            감사합니다!
          </p>
          <button
            onClick={() => setSubmitted(false)}
            style={{
              padding: '14px 28px',
              fontSize: '16px',
              fontWeight: '600',
              color: '#0064FF',
              background: '#fff',
              border: '2px solid #0064FF',
              borderRadius: '12px',
              cursor: 'pointer'
            }}
          >
            페이지로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const themeKey = (data.theme || 'toss') as ThemeType;
  const themeConfig = THEMES[themeKey] || THEMES.toss;
  const themeColors = themeConfig.colors;

  return (
    <div style={{ minHeight: '100vh', background: themeColors.background }}>
      <SectionRenderer
        sections={data.sections}
        formFields={data.formFields}
        theme={themeKey}
        isEditable={false}
        onFormSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />

      {/* 플로팅 CTA 버튼 */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 50
      }}>
        <button
          onClick={() => {
            const formSection = document.getElementById('form-section');
            formSection?.scrollIntoView({ behavior: 'smooth' });
          }}
          style={{
            padding: '16px 32px',
            fontSize: '16px',
            fontWeight: '600',
            color: '#fff',
            background: themeColors.primary,
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            boxShadow: `0 4px 20px ${themeColors.primary}66`,
          }}
        >
          지금 신청하기
        </button>
      </div>

      {/* 푸터 */}
      <footer style={{
        padding: '24px',
        textAlign: 'center',
        borderTop: '1px solid #E5E8EB',
        marginTop: '40px',
        paddingBottom: '80px'
      }}>
        <p style={{ fontSize: '12px', color: '#8B95A1' }}>
          Powered by 랜딩AI
        </p>
      </footer>
    </div>
  );
}
