'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

// 카테고리 데이터 - 아이콘 없이 텍스트 중심
const categories = [
  { id: 'education', name: '교육/강의', desc: '온라인 강의, 코칭, 멘토링' },
  { id: 'consulting', name: '상담/컨설팅', desc: '보험, 재무, 법률 상담' },
  { id: 'service', name: '서비스/대행', desc: '디자인, 마케팅, 개발' },
  { id: 'product', name: '상품/판매', desc: '이커머스, 구독 서비스' },
  { id: 'event', name: '이벤트/모집', desc: '세미나, 워크샵, 스터디' },
  { id: 'realestate', name: '부동산/분양', desc: '아파트, 오피스텔, 상가' },
];

// 성공 사례
const successCases = [
  { category: '교육', title: '온라인 코딩 부트캠프', result: '+340%', metric: '수강신청', detail: '월 247건 달성', period: '2주' },
  { category: '보험', title: '보험 설계사 K님', result: '+500%', metric: '상담신청', detail: '월 89건 달성', period: '1개월' },
  { category: '디자인', title: '프리랜서 디자이너', result: '+800%', metric: '견적문의', detail: '월 45건 달성', period: '1개월' },
  { category: '부동산', title: 'A 분양대행사', result: '+1,200%', metric: '방문예약', detail: '월 320건 달성', period: '4주' },
];

// 후기 - 6개로 확장
const testimonials = [
  { name: '김영희', role: '온라인 강의 크리에이터', content: '2줄만 입력했는데 30초만에 페이지가 완성됐어요. 첫 주에 87건 DB 확보했습니다.', initial: '김' },
  { name: '박준호', role: '보험 설계사', content: '지인 영업만 하다가 이제는 모르는 분들이 먼저 상담 신청해요. 매달 90건씩 들어옵니다.', initial: '박' },
  { name: '이수진', role: '프리랜서 마케터', content: '클라이언트한테 랜딩페이지도 제안하니까 단가가 올랐어요. 업종별로 다 대응 가능해요.', initial: '이' },
  { name: '최민수', role: '부동산 컨설턴트', content: '기존 대행사 비용의 1/10로 더 좋은 성과 내고 있어요. 이번 달만 방문예약 156건입니다.', initial: '최' },
  { name: '정다은', role: '필라테스 원장', content: '인스타 광고에 연결했더니 체험 신청이 3배로 늘었어요. 이제 없으면 안 되는 도구예요.', initial: '정' },
  { name: '한상우', role: '세무사', content: '블로그 유입을 랜딩페이지로 받으니까 상담 전환율이 확 올랐어요. 강력 추천합니다.', initial: '한' },
];

export default function HomePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const handleCreateClick = (categoryId?: string) => {
    router.push(categoryId ? `/create/${categoryId}` : '/create/free');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .animate { animation: fadeUp 0.7s ease-out forwards; }
        .card-hover { transition: all 0.2s ease; }
        .card-hover:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.08); }
        @media (max-width: 768px) {
          .hero-title { font-size: 32px !important; line-height: 1.3 !important; }
          .grid-3 { grid-template-columns: repeat(2, 1fr) !important; }
          .grid-2 { grid-template-columns: 1fr !important; }
          .flex-row { flex-direction: column !important; }
          .hide-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
          .testimonial-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* 헤더 */}
      <header style={{
        padding: '0 20px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '1100px',
        margin: '0 auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="8" fill="#3182F6"/>
            {/* 문서 모양 */}
            <rect x="8" y="6" width="12" height="16" rx="2" fill="white"/>
            {/* 문서 내 라인들 */}
            <rect x="10" y="9" width="8" height="1.5" rx="0.75" fill="#3182F6" opacity="0.5"/>
            <rect x="10" y="12" width="6" height="1.5" rx="0.75" fill="#3182F6" opacity="0.5"/>
            <rect x="10" y="15" width="7" height="1.5" rx="0.75" fill="#3182F6" opacity="0.5"/>
            {/* 아래 화살표 (Landing) */}
            <path d="M14 18L14 21M14 21L12 19M14 21L16 19" stroke="#3182F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ fontSize: '17px', fontWeight: '700', color: '#191F28' }}>랜딩메이커</span>
        </div>

        <nav className="hide-mobile" style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <a href="#cases" style={{ color: '#4E5968', fontSize: '15px', textDecoration: 'none' }}>성공사례</a>
          <a href="#reviews" style={{ color: '#4E5968', fontSize: '15px', textDecoration: 'none' }}>후기</a>
          <a href="#pricing" style={{ color: '#4E5968', fontSize: '15px', textDecoration: 'none' }}>가격</a>
          {status === 'authenticated' ? (
            <>
              <a href="/dashboard" style={{ color: '#4E5968', fontSize: '15px', textDecoration: 'none' }}>대시보드</a>
              <button
                onClick={() => signOut()}
                style={{
                  padding: '10px 18px',
                  background: '#F2F4F6',
                  color: '#4E5968',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <a href="/login" style={{ color: '#4E5968', fontSize: '15px', textDecoration: 'none' }}>로그인</a>
              <a
                href="/signup"
                style={{
                  padding: '10px 18px',
                  background: '#F2F4F6',
                  color: '#4E5968',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  textDecoration: 'none',
                }}
              >
                회원가입
              </a>
            </>
          )}
          <button
            onClick={() => handleCreateClick()}
            style={{
              padding: '10px 18px',
              background: '#191F28',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            시작하기
          </button>
        </nav>

        <button
          className="show-mobile"
          onClick={() => handleCreateClick()}
          style={{
            display: 'none',
            padding: '8px 14px',
            background: '#191F28',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          시작하기
        </button>
      </header>

      {/* 히어로 */}
      <section style={{ padding: '80px 20px 100px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <p className="animate" style={{
          fontSize: '15px',
          color: '#3182F6',
          fontWeight: '600',
          marginBottom: '16px',
        }}>
          10,000개 이상의 페이지가 만들어졌어요
        </p>

        <h1 className="hero-title animate" style={{
          fontSize: '48px',
          fontWeight: '700',
          color: '#191F28',
          lineHeight: 1.25,
          marginBottom: '20px',
          letterSpacing: '-0.5px',
        }}>
          2줄 입력하면<br/>
          고객 DB가 쌓여요
        </h1>

        <p className="animate" style={{
          fontSize: '17px',
          color: '#6B7684',
          lineHeight: 1.6,
          marginBottom: '40px',
        }}>
          상품명과 타겟만 입력하세요.<br/>
          AI가 30초 만에 고전환 랜딩페이지를 만들어드립니다.
        </p>

        <div className="animate flex-row" style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={() => handleCreateClick()}
            style={{
              padding: '16px 28px',
              fontSize: '16px',
              fontWeight: '600',
              background: '#3182F6',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
            }}
          >
            무료로 시작하기
          </button>
          <button
            onClick={() => router.push('/p/demo')}
            style={{
              padding: '16px 28px',
              fontSize: '16px',
              fontWeight: '600',
              background: '#F2F4F6',
              color: '#4E5968',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
            }}
          >
            데모 보기
          </button>
        </div>
      </section>

      {/* 핵심 지표 */}
      <section style={{ padding: '60px 20px', background: '#F9FAFB' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', justifyContent: 'space-around', textAlign: 'center', flexWrap: 'wrap', gap: '40px' }}>
          {[
            { value: '10,847', label: '생성된 페이지' },
            { value: '12.4%', label: '평균 전환율' },
            { value: '4.9', label: '고객 만족도' },
          ].map((stat, i) => (
            <div key={i}>
              <div style={{ fontSize: '36px', fontWeight: '700', color: '#191F28', marginBottom: '8px' }}>{stat.value}</div>
              <div style={{ fontSize: '14px', color: '#8B95A1' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 작동 방식 - 숫자만 사용 */}
      <section style={{ padding: '100px 20px', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#191F28', marginBottom: '12px' }}>
            이렇게 간단해요
          </h2>
          <p style={{ fontSize: '16px', color: '#6B7684' }}>3단계면 충분합니다</p>
        </div>

        <div style={{ display: 'flex', gap: '40px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { num: '1', title: '정보 입력', desc: '상품명과 타겟 고객만\n입력하세요' },
            { num: '2', title: 'AI 생성', desc: '30초 후 랜딩페이지가\n완성됩니다' },
            { num: '3', title: 'DB 수집', desc: '신청이 들어오면\n알림을 받으세요' },
          ].map((item, i) => (
            <div key={i} style={{ flex: '1 1 240px', maxWidth: '260px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: '#F2F4F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: '700',
                color: '#3182F6',
                marginBottom: '20px',
              }}>
                {item.num}
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#191F28', marginBottom: '8px' }}>{item.title}</h3>
              <p style={{ fontSize: '15px', color: '#6B7684', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 업종 - 텍스트 중심 */}
      <section style={{ padding: '100px 20px', background: '#F9FAFB' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#191F28', marginBottom: '12px' }}>
              어떤 업종이든 가능해요
            </h2>
            <p style={{ fontSize: '16px', color: '#6B7684' }}>36개 업종별 맞춤 템플릿</p>
          </div>

          <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCreateClick(cat.id)}
                onMouseEnter={() => setHoveredCategory(cat.id)}
                onMouseLeave={() => setHoveredCategory(null)}
                className="card-hover"
                style={{
                  padding: '24px 20px',
                  background: '#fff',
                  border: hoveredCategory === cat.id ? '1px solid #3182F6' : '1px solid #E5E8EB',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#191F28', marginBottom: '6px' }}>
                  {cat.name}
                </div>
                <div style={{ fontSize: '13px', color: '#8B95A1' }}>
                  {cat.desc}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 성공 사례 */}
      <section id="cases" style={{ padding: '100px 20px', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#191F28', marginBottom: '12px' }}>
            실제 성과
          </h2>
          <p style={{ fontSize: '16px', color: '#6B7684' }}>사용자들의 실제 결과입니다</p>
        </div>

        <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {successCases.map((item, i) => (
            <div key={i} className="card-hover" style={{
              padding: '28px',
              background: '#F9FAFB',
              borderRadius: '16px',
            }}>
              <div style={{ fontSize: '13px', color: '#3182F6', fontWeight: '600', marginBottom: '8px' }}>{item.category}</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#191F28', marginBottom: '16px' }}>{item.title}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '32px', fontWeight: '700', color: '#3182F6' }}>{item.result}</span>
                <span style={{ fontSize: '15px', color: '#6B7684' }}>{item.metric}</span>
              </div>
              <div style={{ fontSize: '14px', color: '#8B95A1' }}>{item.detail} · {item.period}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 후기 - 6개 */}
      <section id="reviews" style={{ padding: '100px 20px', background: '#F9FAFB' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#191F28', marginBottom: '12px' }}>
              고객 후기
            </h2>
            <p style={{ fontSize: '16px', color: '#6B7684' }}>실제 사용자들의 이야기</p>
          </div>

          <div className="testimonial-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {testimonials.map((t, i) => (
              <div key={i} className="card-hover" style={{
                padding: '24px',
                background: '#fff',
                borderRadius: '16px',
                border: '1px solid #E5E8EB',
              }}>
                <p style={{ fontSize: '15px', color: '#4E5968', lineHeight: 1.7, marginBottom: '20px' }}>
                  "{t.content}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: '#F2F4F6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '15px',
                    fontWeight: '600',
                    color: '#6B7684',
                  }}>
                    {t.initial}
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#191F28' }}>{t.name}</div>
                    <div style={{ fontSize: '13px', color: '#8B95A1' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 가격 */}
      <section id="pricing" style={{ padding: '100px 20px', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <p style={{ fontSize: '14px', color: '#F04452', fontWeight: '600', marginBottom: '12px' }}>런칭 특가 50%</p>
          <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#191F28' }}>
            합리적인 가격
          </h2>
        </div>

        <div className="flex-row" style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          {/* 스타터 */}
          <div className="card-hover" style={{
            flex: '1 1 260px',
            maxWidth: '280px',
            padding: '32px',
            background: '#fff',
            borderRadius: '20px',
            border: '1px solid #E5E8EB',
          }}>
            <div style={{ fontSize: '15px', fontWeight: '600', color: '#6B7684', marginBottom: '16px' }}>스타터</div>
            <div style={{ marginBottom: '24px' }}>
              <span style={{ fontSize: '14px', color: '#AEB5BC', textDecoration: 'line-through' }}>59,800원</span>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#191F28' }}>
                29,900<span style={{ fontSize: '14px', fontWeight: '500', color: '#8B95A1' }}>/월</span>
              </div>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px' }}>
              {['월 1개 페이지', 'AI 콘텐츠 생성', '카톡/이메일 알림', 'DB 대시보드'].map((f, i) => (
                <li key={i} style={{ fontSize: '14px', color: '#4E5968', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 8L7 11L12 5" stroke="#3182F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {f}
                </li>
              ))}
            </ul>
            <button onClick={() => router.push('/pricing')} style={{
              width: '100%',
              padding: '14px',
              fontSize: '15px',
              fontWeight: '600',
              background: '#F2F4F6',
              color: '#4E5968',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
            }}>
              시작하기
            </button>
          </div>

          {/* 프로 */}
          <div className="card-hover" style={{
            flex: '1 1 260px',
            maxWidth: '280px',
            padding: '32px',
            background: '#3182F6',
            borderRadius: '20px',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute',
              top: '-12px',
              left: '50%',
              transform: 'translateX(-50%)',
              padding: '6px 14px',
              background: '#191F28',
              borderRadius: '100px',
              fontSize: '12px',
              fontWeight: '600',
              color: '#fff',
            }}>
              인기
            </div>
            <div style={{ fontSize: '15px', fontWeight: '600', color: 'rgba(255,255,255,0.8)', marginBottom: '16px' }}>프로</div>
            <div style={{ marginBottom: '24px' }}>
              <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', textDecoration: 'line-through' }}>139,800원</span>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#fff' }}>
                69,900<span style={{ fontSize: '14px', fontWeight: '500', color: 'rgba(255,255,255,0.7)' }}>/월</span>
              </div>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px' }}>
              {['월 3개 페이지', 'A/B 테스트', '분석 리포트', '우선 지원'].map((f, i) => (
                <li key={i} style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 8L7 11L12 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {f}
                </li>
              ))}
            </ul>
            <button onClick={() => router.push('/pricing')} style={{
              width: '100%',
              padding: '14px',
              fontSize: '15px',
              fontWeight: '600',
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
            flex: '1 1 260px',
            maxWidth: '280px',
            padding: '32px',
            background: '#fff',
            borderRadius: '20px',
            border: '1px solid #E5E8EB',
          }}>
            <div style={{ fontSize: '15px', fontWeight: '600', color: '#6B7684', marginBottom: '16px' }}>무제한</div>
            <div style={{ marginBottom: '24px' }}>
              <span style={{ fontSize: '14px', color: '#AEB5BC', textDecoration: 'line-through' }}>198,000원</span>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#191F28' }}>
                99,000<span style={{ fontSize: '14px', fontWeight: '500', color: '#8B95A1' }}>/월</span>
              </div>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px' }}>
              {['무제한 페이지', '화이트라벨', 'API 연동', '전담 매니저'].map((f, i) => (
                <li key={i} style={{ fontSize: '14px', color: '#4E5968', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 8L7 11L12 5" stroke="#3182F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {f}
                </li>
              ))}
            </ul>
            <button onClick={() => router.push('/pricing')} style={{
              width: '100%',
              padding: '14px',
              fontSize: '15px',
              fontWeight: '600',
              background: '#F2F4F6',
              color: '#4E5968',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
            }}>
              시작하기
            </button>
          </div>
        </div>

        {/* 대행사/제휴 */}
        <div style={{
          marginTop: '24px',
          padding: '28px 32px',
          background: 'linear-gradient(135deg, #191F28 0%, #3B4654 100%)',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
        }}>
          <div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>
              대행사 / 제휴 문의
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
              대량 할인, 맞춤 기능 개발, 전용 서버, SLA 보장
            </div>
          </div>
          <button
            onClick={() => window.open('https://pf.kakao.com/_xnxnxn', '_blank')}
            style={{
              padding: '12px 24px',
              fontSize: '15px',
              fontWeight: '600',
              background: '#fff',
              color: '#191F28',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            문의하기
          </button>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '100px 20px', background: '#191F28', textAlign: 'center' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#fff', marginBottom: '12px' }}>
          지금 바로 시작하세요
        </h2>
        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', marginBottom: '32px' }}>
          카드 등록 없이 무료로 체험
        </p>
        <button
          onClick={() => handleCreateClick()}
          style={{
            padding: '16px 32px',
            fontSize: '16px',
            fontWeight: '600',
            background: '#3182F6',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
          }}
        >
          무료로 시작하기
        </button>
      </section>

      {/* 푸터 */}
      <footer style={{ padding: '40px 20px', background: '#F9FAFB' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ fontSize: '15px', fontWeight: '600', color: '#6B7684' }}>랜딩메이커</div>
          <div style={{ display: 'flex', gap: '24px' }}>
            <a href="#pricing" style={{ color: '#8B95A1', fontSize: '14px', textDecoration: 'none' }}>가격</a>
            <a href="#cases" style={{ color: '#8B95A1', fontSize: '14px', textDecoration: 'none' }}>성공사례</a>
            <a href="/p/demo" style={{ color: '#8B95A1', fontSize: '14px', textDecoration: 'none' }}>데모</a>
          </div>
          <div style={{ fontSize: '13px', color: '#AEB5BC' }}>© 2026 랜딩메이커</div>
        </div>
      </footer>
    </div>
  );
}
