'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

// 카테고리 데이터 - 36개 업종
const categories = [
  { id: 'education', name: '온라인 강의', desc: '인강, 클래스, 코스' },
  { id: 'coaching', name: '코칭/멘토링', desc: '라이프코칭, 비즈니스코칭' },
  { id: 'tutoring', name: '과외/학원', desc: '입시, 어학, 자격증' },
  { id: 'bootcamp', name: '부트캠프', desc: 'IT, 코딩, 취업연계' },
  { id: 'seminar', name: '세미나/강연', desc: '특강, 웨비나, 컨퍼런스' },
  { id: 'certificate', name: '자격증/시험', desc: '자격증 취득, 시험 대비' },
  { id: 'insurance', name: '보험 상담', desc: '생명보험, 손해보험' },
  { id: 'finance', name: '재무 상담', desc: '재테크, 투자, 자산관리' },
  { id: 'legal', name: '법률 상담', desc: '변호사, 법무사' },
  { id: 'tax', name: '세무/회계', desc: '세무사, 회계사' },
  { id: 'career', name: '커리어 상담', desc: '이직, 취업, 진로' },
  { id: 'psychology', name: '심리 상담', desc: '심리치료, 상담' },
  { id: 'design', name: '디자인', desc: 'UI/UX, 그래픽, 영상' },
  { id: 'marketing', name: '마케팅', desc: '광고, 브랜딩, SNS' },
  { id: 'development', name: '개발', desc: '웹, 앱, 솔루션' },
  { id: 'photography', name: '사진/영상', desc: '촬영, 편집, 제작' },
  { id: 'translation', name: '번역/통역', desc: '문서, 영상, 동시통역' },
  { id: 'writing', name: '글쓰기/카피', desc: '콘텐츠, 카피라이팅' },
  { id: 'fitness', name: '피트니스', desc: 'PT, 필라테스, 요가' },
  { id: 'diet', name: '다이어트', desc: '식단, 체중관리' },
  { id: 'beauty', name: '뷰티/미용', desc: '피부, 네일, 헤어' },
  { id: 'medical', name: '의료/병원', desc: '전문 진료, 검진' },
  { id: 'dental', name: '치과', desc: '임플란트, 교정, 심미' },
  { id: 'oriental', name: '한의원', desc: '한방치료, 다이어트' },
  { id: 'realestate', name: '부동산', desc: '아파트, 오피스텔' },
  { id: 'interior', name: '인테리어', desc: '리모델링, 시공' },
  { id: 'loan', name: '대출/금융', desc: '주담대, 사업자대출' },
  { id: 'investment', name: '투자/재테크', desc: '주식, 부동산 투자' },
  { id: 'wedding', name: '웨딩/결혼', desc: '웨딩플래너, 스튜디오' },
  { id: 'pet', name: '반려동물', desc: '펫시터, 병원, 용품' },
  { id: 'travel', name: '여행/숙박', desc: '투어, 펜션, 호텔' },
  { id: 'food', name: '식품/요식업', desc: '배달, 밀키트, 카페' },
  { id: 'ecommerce', name: '이커머스', desc: '쇼핑몰, 구독서비스' },
  { id: 'startup', name: '스타트업', desc: '서비스 론칭, 채용' },
  { id: 'nonprofit', name: '비영리/단체', desc: '후원, 회원모집' },
  { id: 'other', name: '기타', desc: '맞춤형 랜딩페이지' },
];


// 숫자 카운트업 애니메이션 컴포넌트
function CountUp({ end, suffix = '', duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTime: number;
          const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            // easeOutQuart 이징
            const easeProgress = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(easeProgress * end));
            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(end);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// 성공 사례
const successCases = [
  { category: '교육', title: '온라인 코딩 부트캠프', result: '+340%', metric: '수강신청', detail: '월 247건 달성', period: '2주' },
  { category: '보험', title: '보험 설계사 K님', result: '+500%', metric: '상담신청', detail: '월 89건 달성', period: '1개월' },
  { category: '디자인', title: '프리랜서 디자이너', result: '+800%', metric: '견적문의', detail: '월 45건 달성', period: '1개월' },
  { category: '부동산', title: 'A 분양대행사', result: '+1,200%', metric: '방문예약', detail: '월 320건 달성', period: '4주' },
];

// 후기
const testimonials = [
  { name: '김영희', role: '온라인 강의 크리에이터', content: '2줄만 입력했는데 30초만에 페이지가 완성됐어요. 첫 주에 87건 DB 확보했습니다.', initial: '김' },
  { name: '박준호', role: '보험 설계사', content: '지인 영업만 하다가 이제는 모르는 분들이 먼저 상담 신청해요. 매달 90건씩 들어옵니다.', initial: '박' },
  { name: '이수진', role: '프리랜서 마케터', content: '클라이언트한테 랜딩페이지도 제안하니까 단가가 올랐어요. 업종별로 다 대응 가능해요.', initial: '이' },
  { name: '최민수', role: '부동산 컨설턴트', content: '기존 대행사 비용의 1/10로 더 좋은 성과 내고 있어요. 이번 달만 방문예약 156건입니다.', initial: '최' },
  { name: '정다은', role: '필라테스 원장', content: '인스타 광고에 연결했더니 체험 신청이 3배로 늘었어요. 이제 없으면 안 되는 도구예요.', initial: '정' },
  { name: '한상우', role: '세무사', content: '블로그 유입을 랜딩페이지로 받으니까 상담 전환율이 확 올랐어요. 강력 추천합니다.', initial: '한' },
];

// 기능 소개
const features = [
  { icon: 'M13 10V3L4 14h7v7l9-11h-7z', title: '30초 만에 완성', desc: '상품명과 타겟만 입력하면 AI가 고전환 랜딩페이지를 자동 생성합니다.' },
  { icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', title: '클릭 부르는 썸네일', desc: '유튜브, 인스타, 블로그용 썸네일을 AI가 자동으로 만들어드립니다.' },
  { icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', title: '후킹 카피 자동 생성', desc: 'AI가 업종별 최적화된 카피라이팅을 작성합니다. 경험에서 나오는 글처럼.' },
  { icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', title: 'DB 자동 수집', desc: '신청이 들어오면 카톡/이메일로 즉시 알림. 대시보드에서 한눈에 관리.' },
  { icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01', title: '카드뉴스 자동 제작', desc: 'SNS용 카드뉴스 5장 세트를 한 번에 생성. 바이럴 콘텐츠도 OK.' },
  { icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z', title: '영상 스토리보드', desc: '숏폼 영상용 스토리보드를 자동 생성. 릴스, 틱톡, 유튜브 쇼츠 대응.' },
];

export default function HomePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const handleCreateClick = (categoryId?: string) => {
    router.push(categoryId ? `/create/${categoryId}` : '/create/free');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f6f7f8', fontFamily: "'Noto Sans KR', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700;900&display=swap');
        .hero-gradient { background: linear-gradient(135deg, #3182F6 0%, #1E6FE8 50%, #0D5DD9 100%); }
        .card-hover { transition: all 0.3s ease; }
        .card-hover:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(49, 130, 246, 0.15); }
        @media (max-width: 1024px) {
          .nav-hide { display: none !important; }
          .grid-cols-4 { grid-template-columns: repeat(2, 1fr) !important; }
          .grid-cols-3 { grid-template-columns: repeat(2, 1fr) !important; }
          .grid-cols-2 { grid-template-columns: 1fr !important; }
          .flex-col-mobile { flex-direction: column !important; }
        }
        @media (max-width: 640px) {
          .hero-title { font-size: 32px !important; }
          .grid-cols-4 { grid-template-columns: 1fr !important; }
          .grid-cols-3 { grid-template-columns: 1fr !important; }
          .stat-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      {/* Header */}
      <header style={{
        background: '#fff',
        borderBottom: '1px solid #e5e7eb',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'rgba(49, 130, 246, 0.1)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3182F6" strokeWidth="2">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#111418', margin: 0 }}>랜딩메이커</h1>
              <p style={{ fontSize: '11px', color: '#6b7280', margin: '-2px 0 0' }}>AI 랜딩페이지 빌더</p>
            </div>
          </div>

          <nav className="nav-hide" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <a href="#features" style={{ fontSize: '14px', fontWeight: 500, color: '#4b5563', textDecoration: 'none' }}>기능</a>
            <a href="#cases" style={{ fontSize: '14px', fontWeight: 500, color: '#4b5563', textDecoration: 'none' }}>성공사례</a>
            <a href="#pricing" style={{ fontSize: '14px', fontWeight: 500, color: '#4b5563', textDecoration: 'none' }}>가격</a>
            <a href="/samples" style={{ fontSize: '14px', fontWeight: 500, color: '#4b5563', textDecoration: 'none' }}>샘플</a>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {status === 'authenticated' ? (
              <>
                <Link href="/dashboard" className="nav-hide" style={{ fontSize: '14px', fontWeight: 500, color: '#4b5563', textDecoration: 'none' }}>대시보드</Link>
                <button
                  onClick={() => signOut()}
                  className="nav-hide"
                  style={{ padding: '8px 16px', background: 'none', color: '#6b7280', border: 'none', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}
                >
                  로그아웃
                </button>
              </>
            ) : (
              <Link href="/login" className="nav-hide" style={{ fontSize: '14px', fontWeight: 500, color: '#4b5563', textDecoration: 'none' }}>로그인</Link>
            )}
            <button
              onClick={() => handleCreateClick()}
              style={{
                padding: '10px 20px',
                background: '#3182F6',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(49, 130, 246, 0.25)',
              }}
            >
              시작하기
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-gradient" style={{ padding: '80px 24px 100px', color: '#fff' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)',
            padding: '8px 16px',
            borderRadius: '100px',
            fontSize: '14px',
            fontWeight: 500,
            marginBottom: '24px',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#FBBF24" stroke="none">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            10,000개 이상의 랜딩페이지가 만들어졌습니다
          </div>

          <h2 className="hero-title" style={{
            fontSize: '52px',
            fontWeight: 900,
            lineHeight: 1.2,
            letterSpacing: '-1px',
            marginBottom: '24px',
          }}>
            랜딩페이지,<br/>누구보다 쉽게
          </h2>

          <p style={{
            fontSize: '18px',
            color: 'rgba(255,255,255,0.9)',
            lineHeight: 1.7,
            marginBottom: '40px',
            maxWidth: '600px',
            margin: '0 auto 40px',
          }}>
            상품명과 타겟만 입력하세요. 30초 만에 AI가<br/>
            클릭을 부르는 랜딩페이지와 썸네일을 자동으로 만들어드립니다.
          </p>

          <div className="flex-col-mobile" style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button
              onClick={() => handleCreateClick()}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '18px 32px',
                background: '#fff',
                color: '#3182F6',
                border: 'none',
                borderRadius: '12px',
                fontSize: '17px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 8v8m-4-4h8"/>
              </svg>
              무료로 시작하기
            </button>
            <button
              onClick={() => router.push('/samples')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '18px 32px',
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(10px)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: '12px',
                fontSize: '17px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
              샘플 보기
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: '48px 24px', background: '#fff', borderBottom: '1px solid #e5e7eb' }}>
        <div className="stat-grid" style={{
          maxWidth: '1000px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '32px',
          textAlign: 'center',
        }}>
          <div>
            <p style={{ fontSize: '36px', fontWeight: 900, color: '#3182F6', margin: '0 0 4px' }}>
              <CountUp end={10847} />
            </p>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>생성된 페이지</p>
          </div>
          <div>
            <p style={{ fontSize: '36px', fontWeight: 900, color: '#3182F6', margin: '0 0 4px' }}>
              <CountUp end={12} suffix=".4%" duration={1500} />
            </p>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>평균 전환율</p>
          </div>
          <div>
            <p style={{ fontSize: '36px', fontWeight: 900, color: '#3182F6', margin: '0 0 4px' }}>
              <CountUp end={30} suffix="초" duration={1000} />
            </p>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>평균 제작 시간</p>
          </div>
          <div>
            <p style={{ fontSize: '36px', fontWeight: 900, color: '#3182F6', margin: '0 0 4px' }}>
              <CountUp end={4} suffix=".9" duration={1500} />
            </p>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>고객 만족도</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: '100px 24px', background: '#fff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h3 style={{ fontSize: '36px', fontWeight: 900, color: '#111418', marginBottom: '16px' }}>
              왜 랜딩메이커인가?
            </h3>
            <p style={{ fontSize: '18px', color: '#6b7280' }}>
              랜딩페이지 제작의 모든 과정을 AI가 해결합니다
            </p>
          </div>

          <div className="grid-cols-3" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '32px',
          }}>
            {features.map((feature, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '24px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  background: 'rgba(49, 130, 246, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3182F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={feature.icon}/>
                  </svg>
                </div>
                <h4 style={{ fontSize: '20px', fontWeight: 700, color: '#111418', marginBottom: '12px' }}>{feature.title}</h4>
                <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: 1.7 }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section style={{ padding: '100px 24px', background: '#f6f7f8' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h3 style={{ fontSize: '36px', fontWeight: 900, color: '#111418', marginBottom: '16px' }}>
              어떤 업종이든 가능합니다
            </h3>
            <p style={{ fontSize: '18px', color: '#6b7280' }}>36개 업종별 맞춤 템플릿과 카피라이팅</p>
          </div>

          <div className="grid-cols-4" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px',
          }}>
            {(showAllCategories ? categories : categories.slice(0, 12)).map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCreateClick(cat.id)}
                onMouseEnter={() => setHoveredCategory(cat.id)}
                onMouseLeave={() => setHoveredCategory(null)}
                className="card-hover"
                style={{
                  padding: '20px 16px',
                  background: '#fff',
                  border: hoveredCategory === cat.id ? '2px solid #3182F6' : '1px solid #e5e7eb',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#111418', marginBottom: '4px' }}>
                  {cat.name}
                </div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>{cat.desc}</div>
              </button>
            ))}
          </div>

          {!showAllCategories && (
            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <button
                onClick={() => setShowAllCategories(true)}
                style={{
                  padding: '14px 32px',
                  background: '#fff',
                  color: '#3182F6',
                  border: '2px solid #3182F6',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                전체 {categories.length}개 업종 보기
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Success Cases */}
      <section id="cases" style={{ padding: '100px 24px', background: '#fff' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h3 style={{ fontSize: '36px', fontWeight: 900, color: '#111418', marginBottom: '16px' }}>실제 성과</h3>
            <p style={{ fontSize: '18px', color: '#6b7280' }}>사용자들이 거둔 실제 결과입니다</p>
          </div>

          <div className="grid-cols-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            {successCases.map((item, i) => (
              <div key={i} className="card-hover" style={{
                padding: '32px',
                background: '#f6f7f8',
                borderRadius: '20px',
                border: '1px solid #e5e7eb',
              }}>
                <div style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  background: 'rgba(49, 130, 246, 0.1)',
                  color: '#3182F6',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                  marginBottom: '12px',
                }}>{item.category}</div>
                <div style={{ fontSize: '18px', fontWeight: 600, color: '#111418', marginBottom: '16px' }}>{item.title}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '40px', fontWeight: 900, color: '#3182F6' }}>{item.result}</span>
                  <span style={{ fontSize: '16px', color: '#6b7280' }}>{item.metric}</span>
                </div>
                <div style={{ fontSize: '14px', color: '#9ca3af' }}>{item.detail} / {item.period}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '100px 24px', background: '#f6f7f8' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h3 style={{ fontSize: '36px', fontWeight: 900, color: '#111418', marginBottom: '16px' }}>고객 후기</h3>
            <p style={{ fontSize: '18px', color: '#6b7280' }}>실제 사용자들의 이야기</p>
          </div>

          <div className="grid-cols-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {testimonials.map((t, i) => (
              <div key={i} className="card-hover" style={{
                padding: '28px',
                background: '#fff',
                borderRadius: '16px',
                border: '1px solid #e5e7eb',
              }}>
                <p style={{ fontSize: '15px', color: '#4b5563', lineHeight: 1.8, marginBottom: '24px' }}>
                  "{t.content}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: '#f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#6b7280',
                  }}>
                    {t.initial}
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: '#111418' }}>{t.name}</div>
                    <div style={{ fontSize: '13px', color: '#9ca3af' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: '100px 24px', background: '#fff' }}>
        <div style={{ maxWidth: '950px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{
              display: 'inline-block',
              padding: '6px 14px',
              background: '#FEF2F2',
              color: '#DC2626',
              borderRadius: '100px',
              fontSize: '14px',
              fontWeight: 600,
              marginBottom: '16px',
            }}>
              런칭 특가 50% 할인
            </div>
            <h3 style={{ fontSize: '36px', fontWeight: 900, color: '#111418' }}>합리적인 가격</h3>
          </div>

          <div className="flex-col-mobile" style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            {/* 스타터 */}
            <div className="card-hover" style={{
              flex: '1',
              maxWidth: '300px',
              padding: '36px',
              background: '#fff',
              borderRadius: '24px',
              border: '1px solid #e5e7eb',
            }}>
              <div style={{ fontSize: '16px', fontWeight: 600, color: '#6b7280', marginBottom: '16px' }}>스타터</div>
              <div style={{ marginBottom: '28px' }}>
                <span style={{ fontSize: '14px', color: '#9ca3af', textDecoration: 'line-through' }}>59,800원</span>
                <div style={{ fontSize: '36px', fontWeight: 900, color: '#111418' }}>
                  29,900<span style={{ fontSize: '14px', fontWeight: 500, color: '#9ca3af' }}>/월</span>
                </div>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px' }}>
                {['월 1개 페이지', 'AI 콘텐츠 생성', '카톡/이메일 알림', 'DB 대시보드'].map((f, i) => (
                  <li key={i} style={{ fontSize: '15px', color: '#4b5563', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3182F6" strokeWidth="2.5"><path d="M5 12l5 5L20 7"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => router.push('/pricing')} style={{
                width: '100%',
                padding: '16px',
                fontSize: '16px',
                fontWeight: 600,
                background: '#f3f4f6',
                color: '#4b5563',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
              }}>
                시작하기
              </button>
            </div>

            {/* 프로 */}
            <div className="card-hover" style={{
              flex: '1',
              maxWidth: '300px',
              padding: '36px',
              background: '#3182F6',
              borderRadius: '24px',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute',
                top: '-14px',
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '8px 18px',
                background: '#111418',
                borderRadius: '100px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#fff',
              }}>
                인기
              </div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: '16px' }}>프로</div>
              <div style={{ marginBottom: '28px' }}>
                <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', textDecoration: 'line-through' }}>139,800원</span>
                <div style={{ fontSize: '36px', fontWeight: 900, color: '#fff' }}>
                  69,900<span style={{ fontSize: '14px', fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>/월</span>
                </div>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px' }}>
                {['월 3개 페이지', 'A/B 테스트', '분석 리포트', '우선 지원'].map((f, i) => (
                  <li key={i} style={{ fontSize: '15px', color: 'rgba(255,255,255,0.9)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M5 12l5 5L20 7"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => router.push('/pricing')} style={{
                width: '100%',
                padding: '16px',
                fontSize: '16px',
                fontWeight: 600,
                background: '#fff',
                color: '#3182F6',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
              }}>
                프로 시작
              </button>
            </div>

            {/* 무제한 */}
            <div className="card-hover" style={{
              flex: '1',
              maxWidth: '300px',
              padding: '36px',
              background: '#fff',
              borderRadius: '24px',
              border: '1px solid #e5e7eb',
            }}>
              <div style={{ fontSize: '16px', fontWeight: 600, color: '#6b7280', marginBottom: '16px' }}>무제한</div>
              <div style={{ marginBottom: '28px' }}>
                <span style={{ fontSize: '14px', color: '#9ca3af', textDecoration: 'line-through' }}>198,000원</span>
                <div style={{ fontSize: '36px', fontWeight: 900, color: '#111418' }}>
                  99,000<span style={{ fontSize: '14px', fontWeight: 500, color: '#9ca3af' }}>/월</span>
                </div>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px' }}>
                {['무제한 페이지', '화이트라벨', 'API 연동', '전담 매니저'].map((f, i) => (
                  <li key={i} style={{ fontSize: '15px', color: '#4b5563', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3182F6" strokeWidth="2.5"><path d="M5 12l5 5L20 7"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => router.push('/pricing')} style={{
                width: '100%',
                padding: '16px',
                fontSize: '16px',
                fontWeight: 600,
                background: '#f3f4f6',
                color: '#4b5563',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
              }}>
                시작하기
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div className="hero-gradient" style={{
            borderRadius: '32px',
            padding: '64px 40px',
            textAlign: 'center',
            color: '#fff',
          }}>
            <h3 style={{ fontSize: '36px', fontWeight: 900, marginBottom: '16px' }}>지금 바로 시작하세요</h3>
            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.85)', marginBottom: '40px' }}>
              카드 등록 없이 무료로 체험하세요.<br/>
              첫 페이지는 영원히 무료입니다.
            </p>
            <div className="flex-col-mobile" style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button
                onClick={() => handleCreateClick()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '18px 32px',
                  background: '#fff',
                  color: '#3182F6',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '17px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
                무료로 시작하기
              </button>
              <button
                onClick={() => router.push('/samples')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '18px 32px',
                  background: 'rgba(255,255,255,0.15)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.25)',
                  borderRadius: '12px',
                  fontSize: '17px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                샘플 보기
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#111418', color: '#9ca3af', padding: '64px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="grid-cols-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px', marginBottom: '48px' }}>
            <div>
              <h5 style={{ color: '#fff', fontWeight: 700, marginBottom: '20px' }}>제품</h5>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '12px' }}><a href="#features" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '14px' }}>기능 소개</a></li>
                <li style={{ marginBottom: '12px' }}><a href="#pricing" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '14px' }}>요금제</a></li>
                <li style={{ marginBottom: '12px' }}><a href="/samples" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '14px' }}>샘플</a></li>
              </ul>
            </div>
            <div>
              <h5 style={{ color: '#fff', fontWeight: 700, marginBottom: '20px' }}>회사</h5>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '12px' }}><a href="#" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '14px' }}>소개</a></li>
                <li style={{ marginBottom: '12px' }}><a href="#" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '14px' }}>채용</a></li>
                <li style={{ marginBottom: '12px' }}><a href="#" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '14px' }}>블로그</a></li>
              </ul>
            </div>
            <div>
              <h5 style={{ color: '#fff', fontWeight: 700, marginBottom: '20px' }}>지원</h5>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '12px' }}><a href="#" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '14px' }}>도움말</a></li>
                <li style={{ marginBottom: '12px' }}><a href="#" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '14px' }}>문의하기</a></li>
                <li style={{ marginBottom: '12px' }}><a href="/referral" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '14px' }}>친구 초대</a></li>
              </ul>
            </div>
            <div>
              <h5 style={{ color: '#fff', fontWeight: 700, marginBottom: '20px' }}>법적 고지</h5>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '12px' }}><a href="/terms" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '14px' }}>이용약관</a></li>
                <li style={{ marginBottom: '12px' }}><a href="/privacy" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '14px' }}>개인정보처리방침</a></li>
              </ul>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #374151', paddingTop: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: 'rgba(49, 130, 246, 0.2)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3182F6" strokeWidth="2">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span style={{ color: '#fff', fontWeight: 700 }}>랜딩메이커</span>
            </div>
            <p style={{ fontSize: '14px' }}>2026 랜딩메이커. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
