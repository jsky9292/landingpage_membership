'use client';

import { useParams, useRouter } from 'next/navigation';

// 샘플 상세 데이터
const sampleDetails: Record<string, {
  name: string;
  category: string;
  theme: string;
  themeColor: string;
  gradientEnd: string;
  content: {
    hero: {
      badge: string;
      headline: string;
      subtext: string;
      cta: string;
      trust: string;
    };
    pain: {
      title: string;
      items: { icon: string; text: string }[];
    };
    solution: {
      title: string;
      description: string;
      features: { icon: string; title: string; desc: string }[];
    };
    benefits: {
      title: string;
      items: { number: string; label: string }[];
    };
    testimonial: {
      quote: string;
      name: string;
      role: string;
    };
    cta: {
      title: string;
      subtitle: string;
      button: string;
    };
  };
}> = {
  'marketing-edu-sample': {
    name: '마케팅 실전 부트캠프',
    category: '교육/강의',
    theme: 'indigo',
    themeColor: '#6366F1',
    gradientEnd: '#8B5CF6',
    content: {
      hero: {
        badge: '🔥 오늘 마감 | 36% 특별 할인',
        headline: '월급보다 더 버는\n마케터가 되세요',
        subtext: '현직 대기업 마케터가 알려주는 실전 퍼포먼스 마케팅.\n이론이 아닌 실무 노하우를 8주만에 마스터합니다.',
        cta: '무료 강의 미리보기',
        trust: '수강생 1,247명 | 만족도 4.9/5.0',
      },
      pain: {
        title: '이런 고민 있으신가요?',
        items: [
          { icon: '😓', text: '마케팅 배우고 싶은데 어디서 시작해야 할지 모르겠어요' },
          { icon: '💸', text: '광고비는 쓰는데 왜 성과가 안 나는지 모르겠어요' },
          { icon: '📊', text: '데이터 분석이 중요하다는데 어떻게 해야 하나요?' },
          { icon: '🎯', text: '실무에서 바로 쓸 수 있는 스킬을 배우고 싶어요' },
        ],
      },
      solution: {
        title: '8주 후, 당신은 달라집니다',
        description: '실무 프로젝트 기반의 커리큘럼으로 배우는 순간 바로 적용할 수 있습니다',
        features: [
          { icon: '📈', title: '광고 세팅부터 최적화까지', desc: 'META, Google 광고 실전 운영' },
          { icon: '🔍', title: '데이터 기반 의사결정', desc: 'GA4, 전환 추적, A/B 테스트' },
          { icon: '✍️', title: '전환되는 카피라이팅', desc: '클릭률 높이는 문구 작성법' },
          { icon: '💼', title: '포트폴리오 완성', desc: '실제 캠페인 운영 경험' },
        ],
      },
      benefits: {
        title: '수강생 성과',
        items: [
          { number: '340%', label: '평균 ROAS 개선' },
          { number: '92%', label: '취업/이직 성공률' },
          { number: '2.3배', label: '평균 연봉 상승' },
        ],
      },
      testimonial: {
        quote: '비전공자였는데 8주 과정 끝나고 바로 마케팅 에이전시에 취업했어요. 실무 중심 커리큘럼이 정말 도움됐습니다.',
        name: '김민지',
        role: '수강생 → 현 A사 퍼포먼스 마케터',
      },
      cta: {
        title: '지금 시작하면 36% 할인',
        subtitle: '선착순 30명 한정 | 오늘 자정 마감',
        button: '할인가로 신청하기',
      },
    },
  },
  'insurance-sample': {
    name: '맞춤 보험 설계',
    category: '상담/컨설팅',
    theme: 'purple',
    themeColor: '#8B5CF6',
    gradientEnd: '#A855F7',
    content: {
      hero: {
        badge: '✨ 무료 상담 | 강요 없는 진단',
        headline: '보험료는 낮추고\n보장은 높이는 방법',
        subtext: '10년차 보험 전문가가 당신의 보험을 무료로 진단해드립니다.\n필요 없는 보험은 빼고, 부족한 보장은 채워드려요.',
        cta: '무료 상담 신청하기',
        trust: '상담 고객 5,000명+ | 평균 보험료 23% 절감',
      },
      pain: {
        title: '혹시 이런 상황이신가요?',
        items: [
          { icon: '💰', text: '매달 보험료가 부담되는데, 어떤 걸 해지해야 할지 모르겠어요' },
          { icon: '📋', text: '보험이 여러 개인데 중복되는 건 없는지 궁금해요' },
          { icon: '🏥', text: '실비 보험 바뀌었다는데 나는 괜찮은 건가요?' },
          { icon: '👨‍👩‍👧', text: '가족 보험 점검이 필요한데 어디서 받아야 할지...' },
        ],
      },
      solution: {
        title: '전문가가 직접 분석해드립니다',
        description: '10년 경력 보험 전문가가 고객님의 상황에 맞는 최적의 보험 포트폴리오를 설계해드립니다',
        features: [
          { icon: '🔍', title: '현재 보험 진단', desc: '가입된 보험 중복/누락 체크' },
          { icon: '💡', title: '맞춤 설계', desc: '라이프스타일에 맞는 보장 설계' },
          { icon: '📉', title: '보험료 최적화', desc: '불필요한 특약 정리로 비용 절감' },
          { icon: '🤝', title: '사후 관리', desc: '청구 대행 및 지속 관리 서비스' },
        ],
      },
      benefits: {
        title: '상담 고객 성과',
        items: [
          { number: '23%', label: '평균 보험료 절감' },
          { number: '98%', label: '상담 만족도' },
          { number: '5,000+', label: '상담 완료 고객' },
        ],
      },
      testimonial: {
        quote: '보험 7개나 있었는데 정리하고 나니 보험료도 줄고 보장은 더 좋아졌어요. 무료인데 이렇게까지 해주시다니 감사합니다.',
        name: '박준호',
        role: '40대 직장인',
      },
      cta: {
        title: '무료 상담 신청하세요',
        subtitle: '강요 없는 상담 | 부담 없이 문의하세요',
        button: '무료 상담 신청',
      },
    },
  },
  'apartment-sample': {
    name: '아파트 분양',
    category: '부동산/분양',
    theme: 'red',
    themeColor: '#EF4444',
    gradientEnd: '#F97316',
    content: {
      hero: {
        badge: '🏠 강남 10분 | 초역세권 프리미엄',
        headline: '당신이 기다려온\n그 아파트입니다',
        subtext: '지하철 도보 3분, 초등학교 도보 5분.\n실수요자를 위한 프리미엄 아파트가 드디어 공개됩니다.',
        cta: '모델하우스 방문 예약',
        trust: '사전 예약 1,200세대 돌파',
      },
      pain: {
        title: '이런 조건 찾고 계셨죠?',
        items: [
          { icon: '🚇', text: '지하철역 가까운 역세권 아파트' },
          { icon: '🏫', text: '아이 학교 걱정 없는 학세권' },
          { icon: '🌳', text: '공원, 편의시설 도보 거리' },
          { icon: '📈', text: '투자 가치도 있는 프리미엄 단지' },
        ],
      },
      solution: {
        title: '모든 조건을 갖춘 프리미엄',
        description: '실수요자와 투자자 모두를 만족시키는 완벽한 입지',
        features: [
          { icon: '🚇', title: '트리플 역세권', desc: '3개 노선 도보 5분 이내' },
          { icon: '🏫', title: '명문 학군', desc: '초중고 도보 통학 가능' },
          { icon: '🏢', title: '프리미엄 커뮤니티', desc: '피트니스, 골프연습장, 독서실' },
          { icon: '🌳', title: '친환경 설계', desc: '대형 중앙공원 조성' },
        ],
      },
      benefits: {
        title: '분양 정보',
        items: [
          { number: '59-84㎡', label: '평형대' },
          { number: '1,847', label: '총 세대수' },
          { number: '2025.12', label: '입주 예정' },
        ],
      },
      testimonial: {
        quote: '모델하우스 보러 갔다가 바로 계약했어요. 이 가격에 이 입지는 다시 없을 것 같아서요.',
        name: '이수진',
        role: '30대 예비 입주자',
      },
      cta: {
        title: '지금 바로 상담받으세요',
        subtitle: '모델하우스 오픈 | 방문 상담 예약 접수 중',
        button: '방문 상담 예약',
      },
    },
  },
};

// 기본 템플릿 (상세 데이터가 없는 경우)
const defaultTemplate = {
  name: '샘플 랜딩페이지',
  category: '샘플',
  theme: 'indigo',
  themeColor: '#6366F1',
  gradientEnd: '#8B5CF6',
  content: {
    hero: {
      badge: '✨ 특별 프로모션',
      headline: '당신의 성공을\n함께 만들어갑니다',
      subtext: '전문가와 함께하는 맞춤형 서비스로\n원하는 목표를 달성하세요.',
      cta: '무료 상담 받기',
      trust: '고객 만족도 98%',
    },
    pain: {
      title: '이런 고민 있으신가요?',
      items: [
        { icon: '😓', text: '어디서 시작해야 할지 모르겠어요' },
        { icon: '💸', text: '비용 대비 효과가 궁금해요' },
        { icon: '📊', text: '전문가의 도움이 필요해요' },
        { icon: '🎯', text: '확실한 결과를 원해요' },
      ],
    },
    solution: {
      title: '해결책을 드립니다',
      description: '검증된 방법론으로 확실한 결과를 만들어드립니다',
      features: [
        { icon: '✅', title: '맞춤 전략', desc: '상황에 맞는 최적의 방법' },
        { icon: '📈', title: '성과 보장', desc: '데이터 기반 결과 분석' },
        { icon: '🤝', title: '1:1 관리', desc: '전담 매니저 배정' },
        { icon: '💡', title: '지속 지원', desc: '사후 관리 서비스' },
      ],
    },
    benefits: {
      title: '성과',
      items: [
        { number: '500+', label: '고객' },
        { number: '98%', label: '만족도' },
        { number: '3배', label: '성과 향상' },
      ],
    },
    testimonial: {
      quote: '정말 만족스러운 서비스였습니다. 기대 이상의 결과를 얻었어요.',
      name: '김OO',
      role: '고객',
    },
    cta: {
      title: '지금 시작하세요',
      subtitle: '무료 상담으로 시작해보세요',
      button: '무료 상담 신청',
    },
  },
};

export default function SamplePreviewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const sample = sampleDetails[id] || defaultTemplate;
  const { themeColor, gradientEnd, content } = sample;

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      {/* 플로팅 네비게이션 */}
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        right: '20px',
        zIndex: 100,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <button
          onClick={() => router.back()}
          style={{
            padding: '10px 20px',
            background: 'rgba(255,255,255,0.95)',
            color: '#374151',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          ← 목록으로
        </button>
        <button
          onClick={() => router.push(`/create/${id}`)}
          style={{
            padding: '12px 24px',
            background: themeColor,
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          }}
        >
          이 스타일로 만들기
        </button>
      </div>

      {/* 히어로 섹션 */}
      <section style={{
        background: `linear-gradient(135deg, ${themeColor} 0%, ${gradientEnd} 100%)`,
        padding: '120px 24px 80px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-block',
            padding: '8px 20px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '24px',
            marginBottom: '24px',
          }}>
            <span style={{ color: '#fff', fontSize: '14px', fontWeight: '600' }}>
              {content.hero.badge}
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(36px, 8vw, 56px)',
            fontWeight: '800',
            color: '#fff',
            lineHeight: 1.2,
            marginBottom: '20px',
            whiteSpace: 'pre-line',
          }}>
            {content.hero.headline}
          </h1>

          <p style={{
            fontSize: '18px',
            color: 'rgba(255,255,255,0.9)',
            lineHeight: 1.7,
            marginBottom: '32px',
            whiteSpace: 'pre-line',
          }}>
            {content.hero.subtext}
          </p>

          <button style={{
            padding: '18px 48px',
            background: '#fff',
            color: themeColor,
            border: 'none',
            borderRadius: '12px',
            fontSize: '17px',
            fontWeight: '700',
            cursor: 'pointer',
            marginBottom: '16px',
          }}>
            {content.hero.cta}
          </button>

          <p style={{
            fontSize: '14px',
            color: 'rgba(255,255,255,0.8)',
          }}>
            {content.hero.trust}
          </p>
        </div>
      </section>

      {/* 문제 섹션 */}
      <section style={{
        padding: '80px 24px',
        background: '#F9FAFB',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '800',
            color: '#191919',
            textAlign: 'center',
            marginBottom: '40px',
          }}>
            {content.pain.title}
          </h2>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}>
            {content.pain.items.map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '20px 24px',
                background: '#fff',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}>
                <span style={{ fontSize: '28px' }}>{item.icon}</span>
                <span style={{ fontSize: '16px', color: '#374151' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 솔루션 섹션 */}
      <section style={{
        padding: '80px 24px',
        background: '#fff',
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: '800',
              color: '#191919',
              marginBottom: '12px',
            }}>
              {content.solution.title}
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#6B7280',
            }}>
              {content.solution.description}
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '24px',
          }}>
            {content.solution.features.map((feature, i) => (
              <div key={i} style={{
                padding: '32px 24px',
                background: '#F9FAFB',
                borderRadius: '16px',
                textAlign: 'center',
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: `${themeColor}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  fontSize: '28px',
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#191919',
                  marginBottom: '8px',
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6B7280',
                  margin: 0,
                }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 성과 섹션 */}
      <section style={{
        padding: '60px 24px',
        background: `linear-gradient(135deg, ${themeColor}10 0%, ${gradientEnd}10 100%)`,
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '800',
            color: '#191919',
            textAlign: 'center',
            marginBottom: '40px',
          }}>
            {content.benefits.title}
          </h2>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '48px',
            flexWrap: 'wrap',
          }}>
            {content.benefits.items.map((item, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '40px',
                  fontWeight: '800',
                  color: themeColor,
                  marginBottom: '4px',
                }}>
                  {item.number}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#6B7280',
                }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 후기 섹션 */}
      <section style={{
        padding: '80px 24px',
        background: '#fff',
      }}>
        <div style={{
          maxWidth: '700px',
          margin: '0 auto',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '24px',
          }}>
            💬
          </div>
          <p style={{
            fontSize: '20px',
            color: '#374151',
            lineHeight: 1.7,
            marginBottom: '24px',
            fontStyle: 'italic',
          }}>
            "{content.testimonial.quote}"
          </p>
          <div>
            <div style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#191919',
            }}>
              {content.testimonial.name}
            </div>
            <div style={{
              fontSize: '14px',
              color: '#6B7280',
            }}>
              {content.testimonial.role}
            </div>
          </div>
        </div>
      </section>

      {/* 최종 CTA */}
      <section style={{
        padding: '80px 24px',
        background: `linear-gradient(135deg, ${themeColor} 0%, ${gradientEnd} 100%)`,
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '800',
            color: '#fff',
            marginBottom: '12px',
          }}>
            {content.cta.title}
          </h2>
          <p style={{
            fontSize: '16px',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '32px',
          }}>
            {content.cta.subtitle}
          </p>
          <button style={{
            padding: '18px 56px',
            background: '#fff',
            color: themeColor,
            border: 'none',
            borderRadius: '12px',
            fontSize: '17px',
            fontWeight: '700',
            cursor: 'pointer',
          }}>
            {content.cta.button}
          </button>
        </div>
      </section>

      {/* 푸터 */}
      <footer style={{
        padding: '40px 24px',
        background: '#191919',
        textAlign: 'center',
      }}>
        <p style={{
          fontSize: '14px',
          color: 'rgba(255,255,255,0.5)',
          marginBottom: '16px',
        }}>
          이 페이지는 랜딩메이커로 제작된 샘플입니다
        </p>
        <button
          onClick={() => router.push(`/create/${id}`)}
          style={{
            padding: '12px 32px',
            background: themeColor,
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          이 스타일로 내 페이지 만들기
        </button>
      </footer>
    </div>
  );
}
