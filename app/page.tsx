'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

// 카테고리별 샘플들
const categories = [
  {
    id: 'education',
    name: '교육/강의',
    icon: '🎓',
    color: '#6366F1',
    samples: [
      { id: 'marketing-edu', name: '마케팅 교육', desc: 'SNS 마케팅, 퍼포먼스 마케팅, 브랜딩 강의', emoji: '📈' },
      { id: 'it-edu', name: 'IT/개발 교육', desc: '코딩, 데이터분석, AI 활용 강의', emoji: '💻' },
      { id: 'ai-edu', name: 'AI 활용 교육', desc: 'ChatGPT, 미드저니, 업무 자동화 강의', emoji: '🤖' },
      { id: 'design-edu', name: '디자인 교육', desc: '포토샵, 피그마, UI/UX 강의', emoji: '🎨' },
      { id: 'language-edu', name: '외국어 교육', desc: '영어, 중국어, 일본어 회화 강의', emoji: '🌍' },
      { id: 'finance-edu', name: '재테크 교육', desc: '주식, 부동산, 가상화폐 투자 강의', emoji: '💰' },
    ]
  },
  {
    id: 'consulting',
    name: '상담/컨설팅',
    icon: '💼',
    color: '#8B5CF6',
    samples: [
      { id: 'insurance', name: '보험 상담', desc: '생명보험, 손해보험 무료 상담', emoji: '🛡️' },
      { id: 'insurance-car', name: '자동차보험', desc: '다이렉트 자동차보험 비교견적', emoji: '🚗' },
      { id: 'insurance-health', name: '건강보험', desc: '실비, 암보험, 건강검진 상담', emoji: '❤️' },
      { id: 'tax-consult', name: '세무 상담', desc: '종합소득세, 부가세, 절세 상담', emoji: '📋' },
      { id: 'legal-consult', name: '법률 상담', desc: '계약서, 분쟁, 소송 상담', emoji: '⚖️' },
      { id: 'career-consult', name: '커리어 상담', desc: '이직, 면접, 포트폴리오 컨설팅', emoji: '🎯' },
    ]
  },
  {
    id: 'service',
    name: '서비스/대행',
    icon: '🛠️',
    color: '#EC4899',
    samples: [
      { id: 'web-dev', name: '웹사이트 제작', desc: '홈페이지, 쇼핑몰, 랜딩페이지 제작', emoji: '🌐' },
      { id: 'design-service', name: '디자인 대행', desc: '로고, 명함, 상세페이지 제작', emoji: '✨' },
      { id: 'video-service', name: '영상 제작', desc: '홍보영상, 유튜브, 쇼츠 제작', emoji: '🎬' },
      { id: 'marketing-service', name: '마케팅 대행', desc: 'SNS 운영, 광고 대행', emoji: '📣' },
      { id: 'writing-service', name: '글쓰기 대행', desc: '보도자료, 블로그, 카피라이팅', emoji: '✍️' },
      { id: 'photo-service', name: '사진 촬영', desc: '제품, 프로필, 인테리어 촬영', emoji: '📷' },
    ]
  },
  {
    id: 'product',
    name: '상품/판매',
    icon: '🛒',
    color: '#10B981',
    samples: [
      { id: 'digital-product', name: '디지털 상품', desc: '전자책, 템플릿, 프리셋 판매', emoji: '📱' },
      { id: 'online-course', name: '온라인 강의', desc: 'VOD 강의, 클래스 판매', emoji: '🎥' },
      { id: 'subscription', name: '구독 서비스', desc: '멤버십, 뉴스레터, 커뮤니티', emoji: '🔄' },
      { id: 'handmade', name: '핸드메이드', desc: '수제 상품, 공예품 판매', emoji: '🎁' },
      { id: 'food-product', name: '식품 판매', desc: '건강식품, 반찬, 베이커리', emoji: '🍽️' },
      { id: 'beauty-product', name: '뷰티 상품', desc: '화장품, 스킨케어, 헤어케어', emoji: '💄' },
    ]
  },
  {
    id: 'event',
    name: '이벤트/모집',
    icon: '🎉',
    color: '#F59E0B',
    samples: [
      { id: 'seminar', name: '세미나/웨비나', desc: '온오프라인 세미나 참가 모집', emoji: '🎤' },
      { id: 'workshop', name: '워크숍', desc: '원데이클래스, 체험 프로그램', emoji: '🔧' },
      { id: 'study-group', name: '스터디 모집', desc: '독서, 어학, 자격증 스터디', emoji: '📚' },
      { id: 'community', name: '커뮤니티 모집', desc: '동호회, 네트워킹 모임', emoji: '👥' },
      { id: 'early-bird', name: '얼리버드 모집', desc: '신제품, 서비스 사전 예약', emoji: '🐦' },
      { id: 'waitlist', name: '대기자 모집', desc: '출시 전 관심고객 확보', emoji: '⏰' },
    ]
  },
  {
    id: 'realestate',
    name: '부동산/분양',
    icon: '🏠',
    color: '#EF4444',
    samples: [
      { id: 'apartment', name: '아파트 분양', desc: '신축 아파트 분양 홍보', emoji: '🏢' },
      { id: 'officetel', name: '오피스텔 분양', desc: '수익형 오피스텔 분양', emoji: '🏨' },
      { id: 'store', name: '상가 분양', desc: '상업시설, 상가 분양', emoji: '🏪' },
      { id: 'land', name: '토지 매매', desc: '전원주택 부지, 농지 매매', emoji: '🌳' },
      { id: 'interior', name: '인테리어', desc: '리모델링, 인테리어 상담', emoji: '🛋️' },
      { id: 'moving', name: '이사 서비스', desc: '포장이사, 원룸이사', emoji: '🚚' },
    ]
  },
];

// 성공 사례 데이터
const successCases = [
  {
    id: 1,
    category: '교육',
    title: '온라인 코딩 부트캠프',
    result: '신청 DB 340% 증가',
    revenue: '월 수강신청 247건 확보',
    period: '런칭 2주 만에',
    image: '💻',
    color: '#6366F1',
  },
  {
    id: 2,
    category: '보험',
    title: '보험 설계사 김OO님',
    result: '상담 DB 5배 증가',
    revenue: '월 상담신청 89건 확보',
    period: '페이지 오픈 후',
    image: '🛡️',
    color: '#8B5CF6',
  },
  {
    id: 3,
    category: '서비스',
    title: '프리랜서 디자이너',
    result: '견적 문의 800% 증가',
    revenue: '월 프로젝트 문의 45건',
    period: '1개월 만에',
    image: '🎨',
    color: '#EC4899',
  },
  {
    id: 4,
    category: '부동산',
    title: 'A 분양대행사',
    result: '방문예약 DB 12배',
    revenue: '월 상담예약 320건 확보',
    period: '캠페인 4주 만에',
    image: '🏢',
    color: '#EF4444',
  },
];

// 블로그 글 데이터
const blogPosts = [
  {
    id: 1,
    category: '마케팅 전략',
    title: '랜딩페이지 DB 수집률 300% 올리는 7가지 원칙',
    excerpt: '같은 광고비로 3배 더 많은 고객 DB를 확보하는 검증된 방법을 공개합니다.',
    readTime: '8분',
    date: '2026.01.15',
    views: '2.3만',
    tag: '인기',
  },
  {
    id: 2,
    category: '성공 사례',
    title: '월 DB 0건에서 247건: 코딩 강사 이OO님의 성공기',
    excerpt: '2줄만 입력하고 만든 랜딩페이지로 매월 247건의 수강신청 DB를 확보한 비결.',
    readTime: '12분',
    date: '2026.01.12',
    views: '1.8만',
    tag: '추천',
  },
  {
    id: 3,
    category: '실전 가이드',
    title: '보험 설계사를 위한 DB 수집 랜딩페이지 완벽 가이드',
    excerpt: '보험 업계에서 검증된 상담신청 DB 확보 전략을 단계별로 설명합니다.',
    readTime: '15분',
    date: '2026.01.10',
    views: '1.2만',
    tag: '가이드',
  },
  {
    id: 4,
    category: 'A/B 테스트',
    title: 'CTA 버튼 문구만 바꿨는데 DB 수집률 47% 상승',
    excerpt: '실제 A/B 테스트로 증명된 신청폼 최적화 방법을 공유합니다.',
    readTime: '6분',
    date: '2026.01.08',
    views: '9,800',
    tag: '데이터',
  },
  {
    id: 5,
    category: '업종별 팁',
    title: '부동산 분양 랜딩페이지, 방문예약 DB 10배 늘리기',
    excerpt: '분양대행사 10곳의 성공 사례에서 도출한 핵심 요소 5가지.',
    readTime: '10분',
    date: '2026.01.05',
    views: '7,500',
    tag: '부동산',
  },
  {
    id: 6,
    category: '트렌드',
    title: '2026년 고전환율 랜딩페이지 디자인 트렌드',
    excerpt: '올해 가장 높은 DB 수집률을 기록한 랜딩페이지들의 공통점.',
    readTime: '7분',
    date: '2026.01.03',
    views: '1.5만',
    tag: '트렌드',
  },
];

// 고객 후기
const testimonials = [
  {
    name: '김영희',
    role: '온라인 강의 크리에이터',
    content: '2줄만 입력했는데 진짜 30초만에 페이지가 나왔어요. 런칭 첫 주에 수강신청 DB 87건 확보!',
    avatar: '👩‍💼',
    rating: 5,
  },
  {
    name: '박준호',
    role: '보험 설계사',
    content: '지인 영업만 하다가 랜딩페이지 만들고 나서 모르는 분들이 먼저 상담 신청해요. 매달 DB 90건씩 들어옵니다.',
    avatar: '👨‍💼',
    rating: 5,
  },
  {
    name: '이수진',
    role: '프리랜서 마케터',
    content: '클라이언트한테 랜딩페이지도 제안하니까 단가가 올랐어요. 2줄만 바꾸면 업종별로 다 대응 가능!',
    avatar: '👩‍🎨',
    rating: 5,
  },
  {
    name: '정민수',
    role: '스타트업 대표',
    content: '개발자 없이 MVP 랜딩 만들어서 시장 테스트했어요. 2주만에 사전예약 DB 500건 달성.',
    avatar: '👨‍💻',
    rating: 5,
  },
];

// 핵심 가치 제안
const valueProps = [
  {
    icon: '✏️',
    title: '2줄만 입력',
    desc: '상품명, 타겟만 적으세요',
  },
  {
    icon: '⚡',
    title: '30초 완성',
    desc: 'AI가 자동으로 생성',
  },
  {
    icon: '📥',
    title: 'DB 자동 수집',
    desc: '신청폼 자동 연동',
  },
  {
    icon: '📱',
    title: '카톡 알림',
    desc: '실시간 DB 알림',
  },
];

export default function HomePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredSample, setHoveredSample] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatStep, setChatStep] = useState(0);
  const [chatName, setChatName] = useState('');
  const [chatCompany, setChatCompany] = useState('');
  const [chatContact, setChatContact] = useState('');

  const handleCreateClick = (sampleId?: string) => {
    if (sampleId) {
      router.push(`/create/${sampleId}`);
    } else {
      router.push('/create/free');
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('구독 신청이 완료되었습니다! 매주 유용한 마케팅 팁을 보내드릴게요.');
    setEmail('');
  };

  const handleChatSubmit = () => {
    if (chatStep === 0 && chatName) {
      setChatStep(1);
    } else if (chatStep === 1 && chatCompany) {
      setChatStep(2);
    } else if (chatStep === 2 && chatContact) {
      setChatStep(3);
      // TODO: 실제 DB 저장 및 알림 발송
    }
  };

  const resetChat = () => {
    setChatStep(0);
    setChatName('');
    setChatCompany('');
    setChatContact('');
    setIsChatOpen(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA' }}>
      {/* 모바일 반응형 스타일 */}
      <style>{`
        @media (max-width: 768px) {
          .hero-headline { font-size: 32px !important; }
          .hero-subtext { font-size: 16px !important; }
          .hero-buttons { flex-direction: column !important; }
          .hero-button { width: 100% !important; padding: 16px 24px !important; }
          .nav-links { display: none !important; }
          .mobile-menu { display: block !important; }
          .stats-grid { flex-direction: column !important; gap: 24px !important; }
          .pricing-grid { grid-template-columns: 1fr !important; }
          .pricing-card-featured { transform: none !important; }
          .pain-grid { grid-template-columns: 1fr !important; }
          .value-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .footer-grid { grid-template-columns: 1fr !important; text-align: center !important; }
          .template-grid { grid-template-columns: 1fr !important; }
          .blog-grid { grid-template-columns: 1fr !important; }
          .category-tabs { overflow-x: auto !important; justify-content: flex-start !important; padding-bottom: 8px !important; }
          .category-tab { flex-shrink: 0 !important; }
          .section-title { font-size: 24px !important; }
          .testimonial-grid { grid-template-columns: 1fr !important; }
          .success-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* 상단 띠배너 */}
      <div style={{
        background: 'linear-gradient(90deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)',
        padding: '10px 16px',
        textAlign: 'center',
      }}>
        <span style={{ color: '#fff', fontSize: '13px', fontWeight: '600' }}>
          🎁 지금 시작하면 <strong>7일 무료</strong> + DB 수집 가이드북 무료 증정
        </span>
      </div>

      {/* 헤더 */}
      <header style={{
        padding: '12px 16px',
        background: '#fff',
        borderBottom: '1px solid #EFEFEF',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '18px', fontWeight: '800', color: '#191919' }}>
            랜딩메이커
          </span>
          <nav className="nav-links" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <a href="/samples" style={{ color: '#666', fontSize: '14px', textDecoration: 'none' }}>샘플</a>
            <a href="#cases" style={{ color: '#666', fontSize: '14px', textDecoration: 'none' }}>성공사례</a>
            <a href="/pricing" style={{ color: '#666', fontSize: '14px', textDecoration: 'none' }}>가격</a>
            {status === 'authenticated' ? (
              <a href="/dashboard" style={{ color: '#666', fontSize: '14px', textDecoration: 'none' }}>내 페이지</a>
            ) : (
              <>
                <a href="/login" style={{ color: '#666', fontSize: '14px', textDecoration: 'none' }}>로그인</a>
                <a href="/signup" style={{ color: '#6366F1', fontSize: '14px', textDecoration: 'none', fontWeight: '600' }}>회원가입</a>
              </>
            )}
            <button
              onClick={() => handleCreateClick()}
              style={{
                padding: '10px 20px',
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
          </nav>
        </div>
      </header>

      {/* 히어로 섹션 - 핵심 컨셉 강조 */}
      <section style={{
        padding: '60px 16px 40px',
        background: 'linear-gradient(180deg, #fff 0%, #F8FAFF 100%)',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* 소셜 프루프 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '20px',
            flexWrap: 'wrap',
          }}>
            <div style={{ display: 'flex' }}>
              {['👩‍💼', '👨‍💼', '👩‍🎨', '👨‍💻'].map((avatar, i) => (
                <div key={i} style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: '#EEF2FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: i > 0 ? '-8px' : 0,
                  border: '2px solid #fff',
                  fontSize: '14px',
                }}>
                  {avatar}
                </div>
              ))}
            </div>
            <span style={{ fontSize: '13px', color: '#6B7280' }}>
              <strong style={{ color: '#191919' }}>10,847명</strong> 사용 중
            </span>
            <span style={{ color: '#FBBF24', fontSize: '12px' }}>★★★★★ 4.9</span>
          </div>

          <h1 className="hero-headline" style={{
            fontSize: 'clamp(28px, 7vw, 48px)',
            fontWeight: '800',
            color: '#191919',
            lineHeight: 1.2,
            marginBottom: '16px',
            letterSpacing: '-0.5px',
          }}>
            2줄만 입력하면<br/>
            <span style={{
              background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              고객 DB가 쏟아집니다
            </span>
          </h1>

          <p className="hero-subtext" style={{
            fontSize: '17px',
            color: '#374151',
            lineHeight: 1.6,
            marginBottom: '12px',
          }}>
            <strong>상품명 + 타겟</strong>만 적으면 끝.
          </p>
          <p style={{
            fontSize: '15px',
            color: '#6B7280',
            lineHeight: 1.6,
            marginBottom: '32px',
          }}>
            AI가 30초만에 DB 수집용 고퀄리티 랜딩페이지를 만들어드립니다.<br/>
            신청이 들어오면 카카오톡으로 바로 알림!
          </p>

          {/* 핵심 가치 아이콘 */}
          <div className="value-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px',
            marginBottom: '32px',
            maxWidth: '500px',
            margin: '0 auto 32px',
          }}>
            {valueProps.map((item, i) => (
              <div key={i} style={{
                padding: '16px 8px',
                background: '#fff',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>{item.icon}</div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#191919', marginBottom: '2px' }}>{item.title}</div>
                <div style={{ fontSize: '11px', color: '#6B7280' }}>{item.desc}</div>
              </div>
            ))}
          </div>

          <div className="hero-buttons" style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            marginBottom: '16px',
          }}>
            <button
              className="hero-button"
              onClick={() => handleCreateClick()}
              style={{
                padding: '16px 40px',
                fontSize: '16px',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
              }}
            >
              지금 바로 만들기
            </button>
            <button
              className="hero-button"
              onClick={() => router.push('/samples')}
              style={{
                padding: '16px 32px',
                fontSize: '16px',
                fontWeight: '600',
                background: '#fff',
                color: '#374151',
                border: '2px solid #E5E7EB',
                borderRadius: '12px',
                cursor: 'pointer',
              }}
            >
              샘플 보기
            </button>
          </div>

          <p style={{ fontSize: '12px', color: '#9CA3AF' }}>
            카드 등록 없이 7일 무료 • 30초면 첫 페이지 완성
          </p>
        </div>
      </section>

      {/* 작동 방식 - 3단계 */}
      <section style={{
        padding: '60px 16px',
        background: '#fff',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 className="section-title" style={{
            fontSize: '28px',
            fontWeight: '800',
            color: '#191919',
            textAlign: 'center',
            marginBottom: '40px',
          }}>
            이렇게 간단합니다
          </h2>

          <div style={{
            display: 'flex',
            gap: '24px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}>
            {[
              { step: '1', icon: '✏️', title: '2줄 입력', desc: '"직장인 퇴근 후 부업 코딩 강의"\n이렇게만 적으세요' },
              { step: '2', icon: '🤖', title: 'AI 생성', desc: '30초 후 고퀄리티\n랜딩페이지 완성' },
              { step: '3', icon: '📥', title: 'DB 수집', desc: '신청이 들어오면\n카톡으로 알림' },
            ].map((item, i) => (
              <div key={i} style={{
                flex: '1 1 250px',
                maxWidth: '280px',
                padding: '32px 24px',
                background: '#F9FAFB',
                borderRadius: '16px',
                textAlign: 'center',
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: '#6366F1',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}>
                  {item.step}
                </div>
                <div style={{ fontSize: '40px', marginBottom: '16px' }}>{item.icon}</div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#191919', marginBottom: '8px' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '14px', color: '#6B7280', whiteSpace: 'pre-line', lineHeight: 1.5 }}>
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 성공 사례 */}
      <section id="cases" style={{
        padding: '60px 16px',
        background: '#F9FAFB',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{
              display: 'inline-block',
              padding: '6px 14px',
              background: '#FEF3C7',
              borderRadius: '20px',
              marginBottom: '12px',
            }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#D97706' }}>
                📈 실제 DB 수집 성과
              </span>
            </div>
            <h2 className="section-title" style={{
              fontSize: '28px',
              fontWeight: '800',
              color: '#191919',
            }}>
              2줄로 만든 페이지가<br/>이런 성과를 냈습니다
            </h2>
          </div>

          <div className="success-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
          }}>
            {successCases.map((caseItem) => (
              <div key={caseItem.id} style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '16px',
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: `${caseItem.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                  }}>
                    {caseItem.image}
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: caseItem.color, fontWeight: '600' }}>
                      {caseItem.category}
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#191919' }}>
                      {caseItem.title}
                    </div>
                  </div>
                </div>
                <div style={{
                  fontSize: '24px',
                  fontWeight: '800',
                  color: caseItem.color,
                  marginBottom: '6px',
                }}>
                  {caseItem.result}
                </div>
                <div style={{ fontSize: '14px', color: '#374151', marginBottom: '4px' }}>
                  {caseItem.revenue}
                </div>
                <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
                  {caseItem.period}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 고객 후기 */}
      <section style={{
        padding: '60px 16px',
        background: '#fff',
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 className="section-title" style={{
            fontSize: '24px',
            fontWeight: '800',
            color: '#191919',
            textAlign: 'center',
            marginBottom: '32px',
          }}>
            실제 사용자 후기
          </h2>

          <div className="testimonial-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
          }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{
                background: '#F9FAFB',
                borderRadius: '12px',
                padding: '20px',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '12px',
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: '#EEF2FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                  }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', color: '#191919', fontSize: '14px' }}>{t.name}</div>
                    <div style={{ fontSize: '12px', color: '#6B7280' }}>{t.role}</div>
                  </div>
                </div>
                <div style={{ color: '#FBBF24', fontSize: '12px', marginBottom: '8px' }}>
                  {'★'.repeat(t.rating)}
                </div>
                <p style={{ fontSize: '14px', color: '#374151', lineHeight: 1.5, margin: 0 }}>
                  "{t.content}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 템플릿 섹션 */}
      <section style={{ padding: '60px 16px', background: '#F9FAFB' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 className="section-title" style={{
              fontSize: '24px',
              fontWeight: '800',
              color: '#191919',
              marginBottom: '8px',
            }}>
              36개 업종별 맞춤 템플릿
            </h2>
            <p style={{ fontSize: '14px', color: '#6B7280' }}>
              2줄만 바꾸면 어떤 업종이든 바로 적용
            </p>
          </div>

          {/* 카테고리 탭 */}
          <div className="category-tabs" style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '32px',
            flexWrap: 'nowrap',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
          }}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className="category-tab"
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                style={{
                  padding: '10px 18px',
                  fontSize: '13px',
                  fontWeight: '600',
                  background: selectedCategory === cat.id ? cat.color : '#fff',
                  color: selectedCategory === cat.id ? '#fff' : '#374151',
                  border: `2px solid ${selectedCategory === cat.id ? cat.color : '#E5E7EB'}`,
                  borderRadius: '24px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
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

          {/* 샘플 그리드 */}
          <div className="template-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px',
          }}>
            {(selectedCategory
              ? categories.filter(c => c.id === selectedCategory)
              : categories
            ).flatMap(cat =>
              cat.samples.slice(0, selectedCategory ? 6 : 2).map(sample => (
                <div
                  key={sample.id}
                  onClick={() => handleCreateClick(sample.id)}
                  onMouseEnter={() => setHoveredSample(sample.id)}
                  onMouseLeave={() => setHoveredSample(null)}
                  style={{
                    background: '#fff',
                    borderRadius: '12px',
                    padding: '20px',
                    cursor: 'pointer',
                    border: `2px solid ${hoveredSample === sample.id ? cat.color : '#F3F4F6'}`,
                    transition: 'all 0.2s',
                    transform: hoveredSample === sample.id ? 'translateY(-2px)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '10px',
                      background: `${cat.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '22px',
                    }}>
                      {sample.emoji}
                    </div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: '700', color: '#191919' }}>{sample.name}</div>
                      <div style={{ fontSize: '11px', color: cat.color, fontWeight: '500' }}>{cat.name}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 12px', lineHeight: 1.4 }}>
                    {sample.desc}
                  </p>
                  <span style={{ fontSize: '12px', color: cat.color, fontWeight: '600' }}>
                    이 템플릿으로 만들기 →
                  </span>
                </div>
              ))
            )}
          </div>

          {!selectedCategory && (
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <button
                onClick={() => router.push('/samples')}
                style={{
                  padding: '12px 28px',
                  fontSize: '14px',
                  fontWeight: '600',
                  background: '#fff',
                  color: '#374151',
                  border: '2px solid #E5E7EB',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                전체 샘플 보기 →
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 블로그 섹션 */}
      <section id="blog" style={{ padding: '60px 16px', background: '#fff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 className="section-title" style={{
              fontSize: '24px',
              fontWeight: '800',
              color: '#191919',
              marginBottom: '8px',
            }}>
              DB 수집 노하우
            </h2>
            <p style={{ fontSize: '14px', color: '#6B7280' }}>
              10,000개 랜딩페이지 데이터에서 얻은 인사이트
            </p>
          </div>

          <div className="blog-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '20px',
          }}>
            {blogPosts.slice(0, 3).map((post) => (
              <article key={post.id} style={{
                background: '#F9FAFB',
                borderRadius: '12px',
                padding: '20px',
                cursor: 'pointer',
              }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <span style={{
                    padding: '4px 8px',
                    background: '#E0E7FF',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '600',
                    color: '#4F46E5',
                  }}>
                    {post.category}
                  </span>
                  {post.tag === '인기' && (
                    <span style={{
                      padding: '4px 8px',
                      background: '#FEE2E2',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '600',
                      color: '#DC2626',
                    }}>
                      🔥 인기
                    </span>
                  )}
                </div>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#191919',
                  lineHeight: 1.4,
                  marginBottom: '8px',
                }}>
                  {post.title}
                </h3>
                <p style={{
                  fontSize: '13px',
                  color: '#6B7280',
                  lineHeight: 1.5,
                  marginBottom: '12px',
                }}>
                  {post.excerpt}
                </p>
                <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#9CA3AF' }}>
                  <span>📅 {post.date}</span>
                  <span>👁️ {post.views}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 뉴스레터 */}
      <section style={{
        padding: '48px 16px',
        background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
      }}>
        <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>📬</div>
          <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#191919', marginBottom: '8px' }}>
            매주 DB 수집 팁 받기
          </h3>
          <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '20px' }}>
            매주 화요일, 전환율 높이는 팁을 보내드려요
          </p>
          <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일 주소"
              required
              style={{
                flex: 1,
                padding: '14px 16px',
                fontSize: '14px',
                border: '2px solid #E5E7EB',
                borderRadius: '8px',
                outline: 'none',
              }}
            />
            <button type="submit" style={{
              padding: '14px 24px',
              fontSize: '14px',
              fontWeight: '600',
              background: '#6366F1',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}>
              구독
            </button>
          </form>
          <p style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '8px' }}>
            3,200명 구독 중 • 스팸 없음
          </p>
        </div>
      </section>

      {/* 가격 */}
      <section id="pricing" style={{ padding: '60px 16px', background: '#fff' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 className="section-title" style={{
              fontSize: '24px',
              fontWeight: '800',
              color: '#191919',
              marginBottom: '8px',
            }}>
              외주 100만원 vs 여기 9,900원
            </h2>
            <p style={{ fontSize: '14px', color: '#6B7280' }}>
              7일 무료 체험 후 결정하세요
            </p>
          </div>

          <div className="pricing-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
          }}>
            {/* 무료 */}
            <div style={{
              background: '#F9FAFB',
              borderRadius: '16px',
              padding: '24px',
              border: '2px solid #E5E7EB',
            }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#6B7280', marginBottom: '6px' }}>무료 체험</div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#191919', marginBottom: '4px' }}>0원</div>
              <p style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '16px' }}>7일간 전체 기능</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px', fontSize: '13px' }}>
                {['AI 카피 생성', '모든 템플릿', 'DB 수집 폼', '워터마크 포함'].map((item, i) => (
                  <li key={i} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px', color: '#374151' }}>
                    <span style={{ color: '#10B981' }}>✓</span>{item}
                  </li>
                ))}
              </ul>
              <button onClick={() => handleCreateClick()} style={{
                width: '100%',
                padding: '12px',
                fontSize: '14px',
                fontWeight: '600',
                background: '#fff',
                color: '#374151',
                border: '2px solid #E5E7EB',
                borderRadius: '8px',
                cursor: 'pointer',
              }}>
                무료 시작
              </button>
            </div>

            {/* 베이직 */}
            <div style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '24px',
              border: '2px solid #E5E7EB',
            }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#6B7280', marginBottom: '6px' }}>베이직</div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#191919', marginBottom: '4px' }}>
                9,900원<span style={{ fontSize: '13px', fontWeight: '500', color: '#9CA3AF' }}>/월</span>
              </div>
              <p style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '16px' }}>1개 페이지</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px', fontSize: '13px' }}>
                {['무료 전체 기능', '워터마크 제거', '커스텀 도메인', '카톡 알림'].map((item, i) => (
                  <li key={i} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px', color: '#374151' }}>
                    <span style={{ color: '#10B981' }}>✓</span>{item}
                  </li>
                ))}
              </ul>
              <button onClick={() => handleCreateClick()} style={{
                width: '100%',
                padding: '12px',
                fontSize: '14px',
                fontWeight: '600',
                background: '#191919',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}>
                시작하기
              </button>
            </div>

            {/* 프로 */}
            <div className="pricing-card-featured" style={{
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              borderRadius: '16px',
              padding: '24px',
              color: '#fff',
              position: 'relative',
              transform: 'scale(1.02)',
              boxShadow: '0 12px 32px rgba(99, 102, 241, 0.3)',
            }}>
              <div style={{
                position: 'absolute',
                top: '-10px',
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '4px 12px',
                background: '#FBBF24',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: '700',
                color: '#191919',
              }}>
                🔥 인기
              </div>
              <div style={{ fontSize: '13px', fontWeight: '600', opacity: 0.9, marginBottom: '6px' }}>프로 (3개월)</div>
              <div style={{ fontSize: '28px', fontWeight: '800', marginBottom: '4px' }}>
                49,900원<span style={{ fontSize: '13px', fontWeight: '500', opacity: 0.8 }}>/3개월</span>
              </div>
              <p style={{ fontSize: '12px', opacity: 0.8, marginBottom: '16px' }}>월 16,633원 (25% 할인)</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px', fontSize: '13px' }}>
                {['베이직 전체', '3개 페이지', 'A/B 테스트', '분석 리포트', '우선 지원'].map((item, i) => (
                  <li key={i} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>✓</span>{item}
                  </li>
                ))}
              </ul>
              <button onClick={() => handleCreateClick()} style={{
                width: '100%',
                padding: '12px',
                fontSize: '14px',
                fontWeight: '600',
                background: '#fff',
                color: '#6366F1',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}>
                프로 시작
              </button>
            </div>

            {/* 비즈니스 */}
            <div style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '24px',
              border: '2px solid #E5E7EB',
            }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#6B7280', marginBottom: '6px' }}>비즈니스/제휴</div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#191919', marginBottom: '4px' }}>별도 협의</div>
              <p style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '16px' }}>무제한 or 맞춤</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px', fontSize: '13px' }}>
                {['무제한 페이지', '화이트라벨', 'API 연동', '전담 매니저'].map((item, i) => (
                  <li key={i} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px', color: '#374151' }}>
                    <span style={{ color: '#8B5CF6' }}>✓</span>{item}
                  </li>
                ))}
              </ul>
              <button onClick={() => setIsChatOpen(true)} style={{
                width: '100%',
                padding: '12px',
                fontSize: '14px',
                fontWeight: '600',
                background: '#F3F4F6',
                color: '#374151',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}>
                💬 문의하기
              </button>
            </div>
          </div>

          <div style={{
            marginTop: '24px',
            textAlign: 'center',
            padding: '16px',
            background: '#F9FAFB',
            borderRadius: '8px',
          }}>
            <span style={{ fontSize: '13px', color: '#6B7280' }}>
              🛡️ <strong>7일 환불 보장</strong> - 불만족시 전액 환불
            </span>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '60px 16px', background: '#F9FAFB' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 className="section-title" style={{
            fontSize: '24px',
            fontWeight: '800',
            color: '#191919',
            textAlign: 'center',
            marginBottom: '32px',
          }}>
            자주 묻는 질문
          </h2>

          {[
            { q: '정말 2줄만 입력하면 되나요?', a: '네, 상품명과 타겟(예: "직장인 퇴근 후 부업 코딩 강의")만 입력하면 AI가 전체 페이지를 자동 생성합니다.' },
            { q: 'DB 수집은 어떻게 되나요?', a: '방문자가 신청폼을 작성하면 자동으로 저장되고, 카카오톡으로 즉시 알림을 받을 수 있습니다.' },
            { q: '무료 체험 후 자동 결제되나요?', a: '아니요, 카드 등록 없이 시작하므로 자동 결제되지 않습니다.' },
            { q: '수정은 몇 번까지 가능한가요?', a: '구독 기간 내 무제한 수정 가능합니다.' },
          ].map((faq, i) => (
            <div key={i} style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '12px',
            }}>
              <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#191919', marginBottom: '8px' }}>
                Q. {faq.q}
              </h3>
              <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: 1.5, margin: 0 }}>
                A. {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 최종 CTA */}
      <section style={{
        padding: '60px 16px',
        background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(24px, 5vw, 32px)',
            fontWeight: '800',
            color: '#fff',
            marginBottom: '12px',
            lineHeight: 1.3,
          }}>
            2줄 입력하고<br/>고객 DB 받으세요
          </h2>
          <p style={{
            fontSize: '15px',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '24px',
          }}>
            30초면 첫 페이지 완성 • 바로 DB 수집 시작
          </p>
          <button
            onClick={() => handleCreateClick()}
            style={{
              padding: '16px 48px',
              fontSize: '16px',
              fontWeight: '700',
              background: '#fff',
              color: '#6366F1',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
            }}
          >
            지금 무료로 만들기
          </button>
        </div>
      </section>

      {/* 푸터 */}
      <footer style={{ padding: '48px 16px 32px', background: '#191919' }}>
        <div className="footer-grid" style={{
          maxWidth: '1000px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '32px',
          marginBottom: '32px',
        }}>
          <div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#fff', marginBottom: '12px' }}>랜딩메이커</div>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
              2줄로 만드는<br/>DB 수집 랜딩페이지
            </p>
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff', marginBottom: '12px' }}>서비스</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {['템플릿', '가격', '샘플'].map((item, i) => (
                <a key={i} href="#" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>{item}</a>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff', marginBottom: '12px' }}>리소스</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {['블로그', '가이드', '도움말'].map((item, i) => (
                <a key={i} href="#" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>{item}</a>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff', marginBottom: '12px' }}>문의</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>support@landingmaker.kr</span>
              <button
                onClick={() => setIsChatOpen(true)}
                style={{
                  padding: '8px 16px',
                  background: '#FEE500',
                  color: '#191919',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  width: 'fit-content',
                }}
              >
                💬 카톡 문의
              </button>
            </div>
          </div>
        </div>
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '20px',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
            © 2026 랜딩메이커. All rights reserved.
          </p>
        </div>
      </footer>

      {/* 챗봇 위젯 */}
      {isChatOpen && (
        <div style={{
          position: 'fixed',
          bottom: '100px',
          right: '20px',
          width: '340px',
          maxWidth: 'calc(100vw - 40px)',
          background: '#fff',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          zIndex: 1000,
          overflow: 'hidden',
        }}>
          {/* 챗봇 헤더 */}
          <div style={{
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
            padding: '16px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div style={{ color: '#fff' }}>
              <div style={{ fontWeight: '700', fontSize: '15px' }}>💬 비즈니스 문의</div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>보통 1시간 내 답변</div>
            </div>
            <button
              onClick={resetChat}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: '#fff',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              ✕
            </button>
          </div>

          {/* 챗봇 본문 */}
          <div style={{ padding: '20px' }}>
            {chatStep === 0 && (
              <>
                <div style={{
                  background: '#F3F4F6',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  marginBottom: '16px',
                  fontSize: '14px',
                  color: '#374151',
                }}>
                  안녕하세요! 👋<br/>
                  비즈니스/제휴 문의 담당자입니다.<br/>
                  성함을 알려주세요.
                </div>
                <input
                  type="text"
                  value={chatName}
                  onChange={(e) => setChatName(e.target.value)}
                  placeholder="성함 입력"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '14px',
                    marginBottom: '12px',
                  }}
                />
                <button
                  onClick={handleChatSubmit}
                  disabled={!chatName}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: chatName ? '#6366F1' : '#E5E7EB',
                    color: chatName ? '#fff' : '#9CA3AF',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: chatName ? 'pointer' : 'not-allowed',
                  }}
                >
                  다음
                </button>
              </>
            )}

            {chatStep === 1 && (
              <>
                <div style={{
                  background: '#F3F4F6',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  marginBottom: '16px',
                  fontSize: '14px',
                  color: '#374151',
                }}>
                  반갑습니다, {chatName}님! 😊<br/>
                  회사명 또는 서비스명을 알려주세요.
                </div>
                <input
                  type="text"
                  value={chatCompany}
                  onChange={(e) => setChatCompany(e.target.value)}
                  placeholder="회사명/서비스명"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '14px',
                    marginBottom: '12px',
                  }}
                />
                <button
                  onClick={handleChatSubmit}
                  disabled={!chatCompany}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: chatCompany ? '#6366F1' : '#E5E7EB',
                    color: chatCompany ? '#fff' : '#9CA3AF',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: chatCompany ? 'pointer' : 'not-allowed',
                  }}
                >
                  다음
                </button>
              </>
            )}

            {chatStep === 2 && (
              <>
                <div style={{
                  background: '#F3F4F6',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  marginBottom: '16px',
                  fontSize: '14px',
                  color: '#374151',
                }}>
                  마지막으로 연락받으실<br/>
                  전화번호 또는 이메일을 알려주세요.
                </div>
                <input
                  type="text"
                  value={chatContact}
                  onChange={(e) => setChatContact(e.target.value)}
                  placeholder="연락처 (전화번호 또는 이메일)"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '14px',
                    marginBottom: '12px',
                  }}
                />
                <button
                  onClick={handleChatSubmit}
                  disabled={!chatContact}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: chatContact ? '#6366F1' : '#E5E7EB',
                    color: chatContact ? '#fff' : '#9CA3AF',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: chatContact ? 'pointer' : 'not-allowed',
                  }}
                >
                  문의 접수하기
                </button>
              </>
            )}

            {chatStep === 3 && (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#191919', marginBottom: '8px' }}>
                  문의가 접수되었습니다!
                </div>
                <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '16px' }}>
                  영업일 기준 1일 이내<br/>담당자가 연락드리겠습니다.
                </div>
                <button
                  onClick={resetChat}
                  style={{
                    padding: '10px 24px',
                    background: '#F3F4F6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    cursor: 'pointer',
                  }}
                >
                  닫기
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 챗봇 플로팅 버튼 */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
          color: '#fff',
          border: 'none',
          boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)',
          cursor: 'pointer',
          fontSize: '24px',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isChatOpen ? '✕' : '💬'}
      </button>
    </div>
  );
}
