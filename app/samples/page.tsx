'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// 샘플 랜딩페이지 데이터
const samplePages = [
  // 교육/강의 - 인디고 테마
  {
    id: 'marketing-edu-sample',
    category: 'education',
    categoryName: '교육/강의',
    name: '마케팅 실전 부트캠프',
    theme: 'indigo',
    themeColor: '#6366F1',
    description: '퍼포먼스 마케팅 전문가가 되는 8주 과정',
    preview: {
      headline: '월급보다 더 버는 마케터가 되세요',
      subtext: '현직 마케터가 알려주는 실전 퍼포먼스 마케팅 노하우',
      cta: '무료 강의 미리보기',
      badge: '오늘 마감 | 36% 할인',
    },
  },
  {
    id: 'it-edu-sample',
    category: 'education',
    categoryName: '교육/강의',
    name: 'AI 개발자 양성과정',
    theme: 'cyan',
    themeColor: '#0891B2',
    description: 'ChatGPT API를 활용한 서비스 개발',
    preview: {
      headline: 'AI 시대, 개발자의 무기를 장착하세요',
      subtext: '비전공자도 8주만에 AI 서비스를 만들 수 있습니다',
      cta: '커리큘럼 확인하기',
      badge: '선착순 30명',
    },
  },
  {
    id: 'design-edu-sample',
    category: 'education',
    categoryName: '교육/강의',
    name: 'UI/UX 디자인 마스터',
    theme: 'pink',
    themeColor: '#EC4899',
    description: '피그마로 완성하는 실무 디자인',
    preview: {
      headline: '취업률 94%, 디자인 실력이 증명됩니다',
      subtext: '현직 디자이너와 함께하는 포트폴리오 완성 과정',
      cta: '수강 신청하기',
      badge: '취업 연계',
    },
  },
  // 보험/컨설팅 - 퍼플 테마
  {
    id: 'insurance-sample',
    category: 'consulting',
    categoryName: '상담/컨설팅',
    name: '맞춤 보험 설계',
    theme: 'purple',
    themeColor: '#8B5CF6',
    description: '당신에게 꼭 맞는 보험을 찾아드립니다',
    preview: {
      headline: '보험료는 낮추고, 보장은 높이는 방법',
      subtext: '10년차 보험 전문가가 무료로 상담해드립니다',
      cta: '무료 상담 신청',
      badge: '무료 상담',
    },
  },
  {
    id: 'tax-sample',
    category: 'consulting',
    categoryName: '상담/컨설팅',
    name: '절세 컨설팅',
    theme: 'slate',
    themeColor: '#475569',
    description: '합법적으로 세금을 줄이는 방법',
    preview: {
      headline: '매년 수백만원씩 세금을 더 내고 계신가요?',
      subtext: '10년 경력 세무사가 절세 방법을 알려드립니다',
      cta: '무료 진단받기',
      badge: '세금 환급',
    },
  },
  {
    id: 'career-sample',
    category: 'consulting',
    categoryName: '상담/컨설팅',
    name: '이직 컨설팅',
    theme: 'emerald',
    themeColor: '#10B981',
    description: '연봉 30% 인상하는 이직 전략',
    preview: {
      headline: '같은 일을 해도 연봉은 다릅니다',
      subtext: '500+명의 이직 성공을 이끈 커리어 코치와 함께',
      cta: '1:1 상담 예약',
      badge: '성공률 92%',
    },
  },
  // 서비스/대행 - 로즈 테마
  {
    id: 'web-dev-sample',
    category: 'service',
    categoryName: '서비스/대행',
    name: '웹사이트 제작',
    theme: 'rose',
    themeColor: '#F43F5E',
    description: '비즈니스를 위한 프리미엄 웹사이트',
    preview: {
      headline: '검색 1페이지에 뜨는 홈페이지를 만들어드립니다',
      subtext: '300개+ 기업이 선택한 웹사이트 전문 제작사',
      cta: '무료 견적 받기',
      badge: '제작 사례 보기',
    },
  },
  {
    id: 'video-sample',
    category: 'service',
    categoryName: '서비스/대행',
    name: '영상 제작',
    theme: 'amber',
    themeColor: '#F59E0B',
    description: '브랜드를 빛나게 하는 영상',
    preview: {
      headline: '조회수 100만을 만드는 영상의 비밀',
      subtext: '기획부터 편집까지, 올인원 영상 제작 서비스',
      cta: '포트폴리오 보기',
      badge: '유튜브 전문',
    },
  },
  {
    id: 'marketing-agency-sample',
    category: 'service',
    categoryName: '서비스/대행',
    name: '마케팅 대행',
    theme: 'orange',
    themeColor: '#F97316',
    description: 'SNS 마케팅 전문 대행사',
    preview: {
      headline: '인스타 팔로워 0에서 10만까지',
      subtext: '100개+ 브랜드의 SNS를 성장시킨 노하우',
      cta: '성장 전략 상담',
      badge: '성공 사례',
    },
  },
  // 상품/판매 - 그린 테마
  {
    id: 'ebook-sample',
    category: 'product',
    categoryName: '상품/판매',
    name: '전자책 판매',
    theme: 'teal',
    themeColor: '#14B8A6',
    description: '노하우를 담은 전자책',
    preview: {
      headline: '3년의 노하우를 3시간에 얻으세요',
      subtext: '1,000명이 선택한 실전 가이드북',
      cta: '지금 구매하기',
      badge: '베스트셀러',
    },
  },
  {
    id: 'course-sample',
    category: 'product',
    categoryName: '상품/판매',
    name: 'VOD 강의',
    theme: 'blue',
    themeColor: '#3B82F6',
    description: '언제 어디서나 배우는 온라인 강의',
    preview: {
      headline: '출퇴근 시간에 완성하는 부업',
      subtext: '하루 30분, 3개월이면 월 100만원 추가 수입',
      cta: '무료 샘플 보기',
      badge: '평생 수강',
    },
  },
  {
    id: 'membership-sample',
    category: 'product',
    categoryName: '상품/판매',
    name: '멤버십 커뮤니티',
    theme: 'violet',
    themeColor: '#8B5CF6',
    description: '함께 성장하는 커뮤니티',
    preview: {
      headline: '혼자 공부하면 한계가 있습니다',
      subtext: '500명의 동료와 함께하는 성장 커뮤니티',
      cta: '멤버십 가입하기',
      badge: '7일 무료 체험',
    },
  },
  // 이벤트/모집 - 앰버 테마
  {
    id: 'seminar-sample',
    category: 'event',
    categoryName: '이벤트/모집',
    name: '무료 세미나',
    theme: 'yellow',
    themeColor: '#EAB308',
    description: '업계 전문가와 함께하는 세미나',
    preview: {
      headline: '2024년 트렌드를 먼저 알려드립니다',
      subtext: '업계 TOP 10 전문가가 모였습니다',
      cta: '세미나 신청하기',
      badge: '무료 참가',
    },
  },
  {
    id: 'workshop-sample',
    category: 'event',
    categoryName: '이벤트/모집',
    name: '원데이 클래스',
    theme: 'lime',
    themeColor: '#84CC16',
    description: '하루만에 배우는 실전 스킬',
    preview: {
      headline: '토요일 하루, 인생이 바뀝니다',
      subtext: '소수 정예 10명, 밀착 코칭',
      cta: '클래스 신청',
      badge: '소수 정예',
    },
  },
  {
    id: 'study-sample',
    category: 'event',
    categoryName: '이벤트/모집',
    name: '스터디 모집',
    theme: 'sky',
    themeColor: '#0EA5E9',
    description: '함께 공부하는 스터디 그룹',
    preview: {
      headline: '혼자 하면 작심삼일, 함께하면 끝까지',
      subtext: '8주 완주율 94%의 스터디 시스템',
      cta: '스터디 참여하기',
      badge: '새로운 기수',
    },
  },
  // 부동산/분양 - 레드 테마
  {
    id: 'apartment-sample',
    category: 'realestate',
    categoryName: '부동산/분양',
    name: '아파트 분양',
    theme: 'red',
    themeColor: '#EF4444',
    description: '프리미엄 아파트 분양 안내',
    preview: {
      headline: '강남 10분, 초역세권 프리미엄',
      subtext: '2024년 가장 주목받는 분양 단지',
      cta: '모델하우스 예약',
      badge: '특별 할인',
    },
  },
  {
    id: 'officetel-sample',
    category: 'realestate',
    categoryName: '부동산/분양',
    name: '오피스텔 분양',
    theme: 'zinc',
    themeColor: '#71717A',
    description: '수익형 오피스텔 투자',
    preview: {
      headline: '월세 수익 보장, 안정적인 투자처',
      subtext: '역세권 프리미엄 오피스텔 분양',
      cta: '투자 상담 신청',
      badge: '임대수익률 7%',
    },
  },
  {
    id: 'interior-sample',
    category: 'realestate',
    categoryName: '부동산/분양',
    name: '인테리어',
    theme: 'stone',
    themeColor: '#78716C',
    description: '감각적인 인테리어 디자인',
    preview: {
      headline: '당신의 공간을 호텔처럼',
      subtext: '1,000세대 시공 경험, 5년 AS 보장',
      cta: '무료 상담 받기',
      badge: '시공 사례',
    },
  },
];

// 카테고리 필터
const categories = [
  { id: 'all', name: '전체', icon: '🏠', color: '#6366F1' },
  { id: 'education', name: '교육/강의', icon: '🎓', color: '#6366F1' },
  { id: 'consulting', name: '상담/컨설팅', icon: '💼', color: '#8B5CF6' },
  { id: 'service', name: '서비스/대행', icon: '🛠️', color: '#EC4899' },
  { id: 'product', name: '상품/판매', icon: '🛒', color: '#10B981' },
  { id: 'event', name: '이벤트/모집', icon: '🎉', color: '#F59E0B' },
  { id: 'realestate', name: '부동산/분양', icon: '🏠', color: '#EF4444' },
];

export default function SamplesPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredSample, setHoveredSample] = useState<string | null>(null);

  const filteredSamples = selectedCategory === 'all'
    ? samplePages
    : samplePages.filter(s => s.category === selectedCategory);

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB' }}>
      {/* 헤더 */}
      <header style={{
        padding: '16px 24px',
        background: '#fff',
        borderBottom: '1px solid #EFEFEF',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a href="/" style={{ fontSize: '20px', fontWeight: '800', color: '#191919', textDecoration: 'none' }}>
              랜딩메이커
            </a>
            <span style={{ color: '#E5E7EB' }}>|</span>
            <span style={{ fontSize: '16px', fontWeight: '600', color: '#6B7280' }}>샘플 갤러리</span>
          </div>
          <button
            onClick={() => router.push('/create/free')}
            style={{
              padding: '10px 24px',
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            무료로 만들기
          </button>
        </div>
      </header>

      {/* 히어로 */}
      <section style={{
        padding: '60px 24px 40px',
        background: 'linear-gradient(180deg, #fff 0%, #F9FAFB 100%)',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: '36px',
          fontWeight: '800',
          color: '#191919',
          marginBottom: '12px',
        }}>
          업종별 랜딩페이지 샘플
        </h1>
        <p style={{
          fontSize: '16px',
          color: '#6B7280',
          marginBottom: '40px',
        }}>
          다양한 업종과 테마의 랜딩페이지를 미리 확인하고 마음에 드는 스타일로 시작하세요
        </p>

        {/* 카테고리 필터 */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          flexWrap: 'wrap',
        }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: '600',
                background: selectedCategory === cat.id ? cat.color : '#fff',
                color: selectedCategory === cat.id ? '#fff' : '#374151',
                border: `2px solid ${selectedCategory === cat.id ? cat.color : '#E5E7EB'}`,
                borderRadius: '24px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* 샘플 그리드 */}
      <section style={{ padding: '40px 24px 80px' }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
            gap: '32px',
          }}>
            {filteredSamples.map((sample) => (
              <div
                key={sample.id}
                onMouseEnter={() => setHoveredSample(sample.id)}
                onMouseLeave={() => setHoveredSample(null)}
                style={{
                  background: '#fff',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: hoveredSample === sample.id
                    ? '0 20px 40px rgba(0,0,0,0.15)'
                    : '0 4px 20px rgba(0,0,0,0.08)',
                  transform: hoveredSample === sample.id ? 'translateY(-8px)' : 'translateY(0)',
                  transition: 'all 0.3s ease',
                }}
              >
                {/* 미리보기 영역 */}
                <div style={{
                  background: `linear-gradient(135deg, ${sample.themeColor} 0%, ${adjustColor(sample.themeColor, 30)} 100%)`,
                  padding: '40px 32px',
                  position: 'relative',
                  minHeight: '280px',
                }}>
                  {/* 배지 */}
                  <div style={{
                    display: 'inline-block',
                    padding: '6px 14px',
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: '20px',
                    marginBottom: '20px',
                  }}>
                    <span style={{ color: '#fff', fontSize: '13px', fontWeight: '600' }}>
                      {sample.preview.badge}
                    </span>
                  </div>

                  {/* 헤드라인 */}
                  <h2 style={{
                    fontSize: '28px',
                    fontWeight: '800',
                    color: '#fff',
                    lineHeight: 1.3,
                    marginBottom: '12px',
                  }}>
                    {sample.preview.headline}
                  </h2>

                  {/* 서브텍스트 */}
                  <p style={{
                    fontSize: '15px',
                    color: 'rgba(255,255,255,0.9)',
                    lineHeight: 1.6,
                    marginBottom: '24px',
                  }}>
                    {sample.preview.subtext}
                  </p>

                  {/* CTA 버튼 */}
                  <button style={{
                    padding: '14px 32px',
                    background: '#fff',
                    color: sample.themeColor,
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '15px',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}>
                    {sample.preview.cta}
                  </button>

                  {/* 테마 색상 표시 */}
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: sample.themeColor,
                    }} />
                  </div>
                </div>

                {/* 정보 영역 */}
                <div style={{ padding: '24px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                  }}>
                    <div>
                      <span style={{
                        fontSize: '12px',
                        color: sample.themeColor,
                        fontWeight: '600',
                      }}>
                        {sample.categoryName}
                      </span>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        color: '#191919',
                        margin: '4px 0 0',
                      }}>
                        {sample.name}
                      </h3>
                    </div>
                    <div style={{
                      display: 'flex',
                      gap: '8px',
                    }}>
                      <button
                        onClick={() => router.push(`/samples/${sample.id}`)}
                        style={{
                          padding: '10px 20px',
                          background: '#F3F4F6',
                          color: '#374151',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        미리보기
                      </button>
                      <button
                        onClick={() => router.push(`/create/${sample.id}`)}
                        style={{
                          padding: '10px 20px',
                          background: sample.themeColor,
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        이 스타일로 만들기
                      </button>
                    </div>
                  </div>
                  <p style={{
                    fontSize: '14px',
                    color: '#6B7280',
                    margin: 0,
                  }}>
                    {sample.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '60px 24px',
        background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
        textAlign: 'center',
      }}>
        <h2 style={{
          fontSize: '28px',
          fontWeight: '800',
          color: '#fff',
          marginBottom: '12px',
        }}>
          마음에 드는 스타일을 찾으셨나요?
        </h2>
        <p style={{
          fontSize: '16px',
          color: 'rgba(255,255,255,0.9)',
          marginBottom: '24px',
        }}>
          지금 바로 나만의 랜딩페이지를 만들어보세요
        </p>
        <button
          onClick={() => router.push('/create/free')}
          style={{
            padding: '16px 48px',
            background: '#fff',
            color: '#6366F1',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer',
          }}
        >
          7일 무료로 시작하기
        </button>
      </section>

      {/* 푸터 */}
      <footer style={{
        padding: '40px 24px',
        background: '#191919',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
          © 2024 랜딩메이커. AI로 더 쉽게 만드는 랜딩페이지.
        </p>
      </footer>
    </div>
  );
}

// 색상 밝기 조절 헬퍼 함수
function adjustColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return '#' + (
    0x1000000 +
    (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)
  ).toString(16).slice(1);
}
