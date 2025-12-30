'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';


const ebooks = [
  {
    id: 'course',
    category: '강의/클래스',
    title: '수강생이 먼저 찾아오는\n강의 모집 글쓰기',
    subtitle: '월 500만원 강의 수익을 만든 17가지 문장 공식',
    color: '#FF6B35',
    topics: ['첫 문장에서 스크롤을 멈추게 하는 법', '수강료가 비싸도 결제하게 만드는 가치 전달법', '마감 임박 없이도 신청을 부르는 긴급성 만들기', '마케팅 교육 모집 글쓰기 공식']
  },
  {
    id: 'consultation',
    category: '상담/컨설팅',
    title: '상담 문의가 쏟아지는\n전문가 포지셔닝 글쓰기',
    subtitle: '경력 3년차도 10년차처럼 보이게 만드는 법',
    color: '#7C3AED',
    topics: ['신뢰를 주는 자기소개 공식', '상담료를 높여도 거부감 없는 가격 제시법', '후기 없이도 전문성을 증명하는 방법']
  },
  {
    id: 'product',
    category: '상품 판매',
    title: '설명 안 해도 팔리는\n상품 소개 글쓰기',
    subtitle: '스펙 나열 대신 욕구를 자극하는 12가지 기술',
    color: '#059669',
    topics: ['기능이 아닌 변화를 파는 법', '가격 저항을 없애는 앵커링 기법', '장바구니에서 결제까지 이어지는 CTA 작성법']
  },
  {
    id: 'study',
    category: '스터디/모임',
    title: '찐 멤버만 모이는\n커뮤니티 모집 글쓰기',
    subtitle: '숫자만 채우는 모집에서 벗어나는 법',
    color: '#2563EB',
    topics: ['이상적인 멤버를 정의하고 끌어당기는 법', '참여율 높은 모임의 규칙 설계법', '무임승차를 막는 참가비 책정 전략']
  },
  {
    id: 'insurance',
    category: '보험/DB모집',
    title: '고객이 먼저 신청하는\n보험 DB모집 랜딩페이지',
    subtitle: '보험상품 홍보로 실시간 고객DB를 확보하는 방법',
    color: '#DC2626',
    topics: ['보험 혜택을 고객 관점으로 전달하는 법', '신뢰감 있는 상담 신청 유도 문구', '타겟 고객이 반응하는 혜택 구성법']
  },
];
export default function HomePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [selectedEbook, setSelectedEbook] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showConsultModal, setShowConsultModal] = useState(false);

  // 로그인 체크 후 페이지 생성으로 이동
  const handleCreateClick = () => {
    if (status === 'authenticated') {
      router.push('/create/free');
    } else {
      router.push('/create/free');
    }
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleDownload = async () => {
    if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim()) return;
    setIsSubmitting(true);

    // 리드 저장 (실제로는 DB에 저장 + 이메일 발송 API 호출)
    const leads = JSON.parse(localStorage.getItem('leads') || '[]');
    leads.push({
      ...formData,
      ebookId: selectedEbook,
      source: 'ebook_download',
      createdAt: new Date().toISOString()
    });
    localStorage.setItem('leads', JSON.stringify(leads));

    // 실제로는 여기서 이메일 발송 API 호출
    // await fetch('/api/send-ebook', { method: 'POST', body: JSON.stringify({ ...formData, ebookId: selectedEbook }) });

    setTimeout(() => {
      setSubmitted(true);
      setIsSubmitting(false);
    }, 1000);
  };

  const handleConsult = async () => {
    if (!formData.name.trim() || !formData.phone.trim()) return;
    setIsSubmitting(true);

    const leads = JSON.parse(localStorage.getItem('leads') || '[]');
    leads.push({
      ...formData,
      source: 'consultation',
      createdAt: new Date().toISOString()
    });
    localStorage.setItem('leads', JSON.stringify(leads));

    setTimeout(() => {
      setShowConsultModal(false);
      setSubmitted(true);
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA' }}>
      {/* 다운로드 모달 - 이름, 전화번호, 이메일 수집 */}
      {selectedEbook && !submitted && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '420px',
            width: '100%'
          }}>
            <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '8px', color: '#191919' }}>
              무료 가이드 받기
            </h3>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px', lineHeight: 1.5 }}>
              {ebooks.find(e => e.id === selectedEbook)?.title?.replace('\n', ' ')}<br/>
              <span style={{ color: '#FF6B35' }}>이메일로 PDF를 바로 보내드려요</span>
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="이름"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontSize: '15px',
                  border: '1px solid #E0E0E0',
                  borderRadius: '8px',
                  boxSizing: 'border-box'
                }}
              />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
                placeholder="연락처 (010-0000-0000)"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontSize: '15px',
                  border: '1px solid #E0E0E0',
                  borderRadius: '8px',
                  boxSizing: 'border-box'
                }}
              />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="이메일 (PDF 받을 주소)"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontSize: '15px',
                  border: '1px solid #E0E0E0',
                  borderRadius: '8px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <button
              onClick={handleDownload}
              disabled={!formData.name.trim() || !formData.phone.trim() || !formData.email.trim() || isSubmitting}
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '16px',
                fontWeight: '600',
                background: (formData.name.trim() && formData.phone.trim() && formData.email.trim()) ? '#191919' : '#E0E0E0',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: (formData.name.trim() && formData.phone.trim() && formData.email.trim()) ? 'pointer' : 'not-allowed',
                marginTop: '16px'
              }}
            >
              {isSubmitting ? '전송 중...' : '무료 가이드 받기'}
            </button>
            <p style={{ fontSize: '12px', color: '#999', textAlign: 'center', marginTop: '12px' }}>
              정보는 가이드 발송 목적으로만 사용됩니다
            </p>
            <button
              onClick={() => { setSelectedEbook(null); setFormData({ name: '', phone: '', email: '' }); }}
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                color: '#999',
                fontSize: '14px',
                cursor: 'pointer',
                marginTop: '8px'
              }}
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* 전송 완료 모달 - 업셀 유도 */}
      {submitted && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '440px',
            width: '100%',
            textAlign: 'center'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: '#E8F5E9',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '28px',
              color: '#4CAF50'
            }}>✓</div>
            <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '8px', color: '#191919' }}>
              가이드를 보내드렸어요!
            </h3>
            <p style={{ fontSize: '15px', color: '#666', marginBottom: '24px', lineHeight: 1.6 }}>
              이메일({formData.email})을 확인해주세요.<br/>
              <span style={{ color: '#191919', fontWeight: '500' }}>스팸함도 꼭 확인해주세요!</span>
            </p>

            {/* 업셀 제안 */}
            <div style={{
              background: '#FFF8E1',
              border: '1px solid #FFE082',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '24px',
              textAlign: 'left'
            }}>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#F57C00', marginBottom: '8px' }}>
                잠깐! 이런 분들께는...
              </p>
              <p style={{ fontSize: '14px', color: '#5D4037', lineHeight: 1.6, marginBottom: '12px' }}>
                "가이드만으로는 부족할 것 같아요"<br/>
                "직접 피드백 받으면서 만들고 싶어요"
              </p>
              <p style={{ fontSize: '13px', color: '#8D6E63' }}>
                → <strong>1:1 랜딩페이지 제작 상담</strong>을 도와드려요
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowConsultModal(true)}
                style={{
                  flex: 1,
                  padding: '14px',
                  fontSize: '15px',
                  fontWeight: '600',
                  background: '#FF6B35',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                상담 신청하기
              </button>
              <button
                onClick={() => router.push('/p/demo')}
                style={{
                  flex: 1,
                  padding: '14px',
                  fontSize: '15px',
                  fontWeight: '600',
                  background: '#fff',
                  color: '#191919',
                  border: '1px solid #E0E0E0',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                샘플 먼저 보기
              </button>
            </div>
            <button
              onClick={() => { setSubmitted(false); setSelectedEbook(null); setFormData({ name: '', phone: '', email: '' }); }}
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                color: '#999',
                fontSize: '14px',
                cursor: 'pointer',
                marginTop: '16px'
              }}
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* 상담 신청 모달 */}
      {showConsultModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 110,
          padding: '20px'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '440px',
            width: '100%'
          }}>
            <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '8px', color: '#191919' }}>
              1:1 제작 상담 신청
            </h3>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px', lineHeight: 1.5 }}>
              24시간 내에 전화로 연락드려요.<br/>
              어떤 랜딩페이지가 필요하신지 편하게 말씀해주세요.
            </p>

            {/* 가격 안내 */}
            <div style={{
              background: '#F5F5F5',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', color: '#666' }}>랜딩페이지 1개 제작</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#191919' }}>99,000원</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', color: '#666' }}>제작 + 카피 컨설팅</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#FF6B35' }}>199,000원</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="이름"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontSize: '15px',
                  border: '1px solid #E0E0E0',
                  borderRadius: '8px',
                  boxSizing: 'border-box'
                }}
              />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
                placeholder="연락처"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontSize: '15px',
                  border: '1px solid #E0E0E0',
                  borderRadius: '8px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <button
              onClick={handleConsult}
              disabled={!formData.name.trim() || !formData.phone.trim() || isSubmitting}
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '16px',
                fontWeight: '600',
                background: (formData.name.trim() && formData.phone.trim()) ? '#FF6B35' : '#E0E0E0',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: (formData.name.trim() && formData.phone.trim()) ? 'pointer' : 'not-allowed'
              }}
            >
              {isSubmitting ? '신청 중...' : '상담 신청하기'}
            </button>
            <button
              onClick={() => setShowConsultModal(false)}
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                color: '#999',
                fontSize: '14px',
                cursor: 'pointer',
                marginTop: '12px'
              }}
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* 헤더 */}
      <header style={{
        padding: '16px 24px',
        background: '#fff',
        borderBottom: '1px solid #EFEFEF'
      }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '18px', fontWeight: '700', color: '#191919' }}>랜딩메이커</span>
          <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <a href="/p/demo" style={{ color: '#666', fontSize: '14px' }}>샘플 보기</a>
            <button
              onClick={handleCreateClick}
              style={{
                padding: '8px 16px',
                background: '#191919',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              무료로 만들기
            </button>
          </nav>
        </div>
      </header>

      {/* 히어로 */}
      <section style={{
        padding: '80px 24px',
        background: '#fff'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{
            fontSize: '15px',
            color: '#666',
            marginBottom: '16px'
          }}>
            글 하나로 매출이 달라집니다
          </p>
          <h1 style={{
            fontSize: '42px',
            fontWeight: '700',
            color: '#191919',
            lineHeight: 1.35,
            marginBottom: '20px',
            letterSpacing: '-1px'
          }}>
            고객이 먼저 연락하게 만드는<br/>
            <span style={{ color: '#FF6B35' }}>모객 글쓰기</span> 무료 가이드
          </h1>
          <p style={{
            fontSize: '17px',
            color: '#666',
            lineHeight: 1.7,
            marginBottom: '40px'
          }}>
            "왜 아무도 신청을 안 하지?"<br/>
            문제는 상품이 아니라 <strong>글</strong>이었습니다.
          </p>

          {/* 데모 CTA */}
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => router.push('/p/demo')}
              style={{
                padding: '16px 32px',
                fontSize: '16px',
                fontWeight: '600',
                background: '#191919',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              샘플 랜딩페이지 보기
            </button>
            <button
              onClick={handleCreateClick}
              style={{
                padding: '16px 32px',
                fontSize: '16px',
                fontWeight: '600',
                background: '#fff',
                color: '#191919',
                border: '2px solid #191919',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              직접 만들어보기
            </button>
          </div>
        </div>
      </section>

      {/* 문제 제기 */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#191919',
            marginBottom: '40px',
            textAlign: 'center',
            lineHeight: 1.4
          }}>
            혹시 이런 경험 있으신가요?
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              '인스타에 올려도 문의가 1건도 없다',
              '가격이 비싸서 안 팔리는 것 같다',
              '후기도 있는데 왜 신청이 없을까',
              '광고비만 쓰고 전환이 안 된다',
              '어떻게 써야 할지 모르겠다',
            ].map((text, i) => (
              <div key={i} style={{
                padding: '20px 24px',
                background: '#fff',
                borderRadius: '12px',
                fontSize: '16px',
                color: '#333',
                border: '1px solid #EFEFEF'
              }}>
                {text}
              </div>
            ))}
          </div>

          <p style={{
            textAlign: 'center',
            marginTop: '40px',
            fontSize: '18px',
            color: '#191919',
            fontWeight: '600'
          }}>
            전부 <span style={{ color: '#FF6B35' }}>글쓰기</span>로 해결됩니다.
          </p>
        </div>
      </section>

      {/* ebook 섹션 */}
      <section style={{ padding: '80px 24px', background: '#fff' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#191919',
            marginBottom: '12px',
            textAlign: 'center'
          }}>
            분야별 모객 글쓰기 가이드
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#666',
            marginBottom: '48px',
            textAlign: 'center'
          }}>
            각 분야에 맞는 글쓰기 공식을 무료로 받아보세요
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px'
          }}>
            {ebooks.map((ebook) => (
              <div
                key={ebook.id}
                style={{
                  background: '#FAFAFA',
                  borderRadius: '16px',
                  padding: '28px',
                  border: '1px solid #EFEFEF'
                }}
              >
                <span style={{
                  display: 'inline-block',
                  padding: '4px 10px',
                  background: ebook.color,
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: '600',
                  borderRadius: '4px',
                  marginBottom: '16px'
                }}>
                  {ebook.category}
                </span>

                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#191919',
                  marginBottom: '8px',
                  whiteSpace: 'pre-line',
                  lineHeight: 1.4
                }}>
                  {ebook.title}
                </h3>

                <p style={{
                  fontSize: '14px',
                  color: '#666',
                  marginBottom: '20px'
                }}>
                  {ebook.subtitle}
                </p>

                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: '0 0 24px 0'
                }}>
                  {ebook.topics.map((topic, i) => (
                    <li key={i} style={{
                      fontSize: '13px',
                      color: '#555',
                      marginBottom: '8px',
                      paddingLeft: '16px',
                      position: 'relative'
                    }}>
                      <span style={{
                        position: 'absolute',
                        left: 0,
                        color: ebook.color
                      }}>✓</span>
                      {topic}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setSelectedEbook(ebook.id)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '14px',
                    fontWeight: '600',
                    background: '#191919',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  무료 가이드 받기
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 도구 소개 */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#191919',
            marginBottom: '16px'
          }}>
            글을 알았다면, 이제 페이지로 만드세요
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#666',
            marginBottom: '40px',
            lineHeight: 1.7
          }}>
            가이드에서 배운 공식을 그대로 적용해서<br/>
            AI가 랜딩페이지를 자동으로 만들어드립니다.
          </p>

          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            marginBottom: '40px'
          }}>
            {['2줄 입력', 'AI 자동 생성', '바로 배포'].map((step, i) => (
              <div key={i} style={{
                padding: '16px 24px',
                background: '#fff',
                borderRadius: '8px',
                border: '1px solid #EFEFEF'
              }}>
                <span style={{
                  display: 'block',
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#FF6B35',
                  marginBottom: '8px'
                }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span style={{ fontSize: '14px', color: '#333' }}>{step}</span>
              </div>
            ))}
          </div>

          <button
            onClick={handleCreateClick}
            style={{
              padding: '16px 48px',
              fontSize: '16px',
              fontWeight: '600',
              background: '#FF6B35',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            무료로 만들어보기
          </button>
        </div>
      </section>

      {/* 가격 옵션 */}
      <section style={{ padding: '80px 24px', background: '#fff' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#191919',
            marginBottom: '12px',
            textAlign: 'center'
          }}>
            나에게 맞는 방법을 선택하세요
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#666',
            marginBottom: '48px',
            textAlign: 'center'
          }}>
            직접 만들어도 되고, 맡기셔도 됩니다
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px'
          }}>
            {/* 셀프 제작 */}
            <div style={{
              background: '#FAFAFA',
              borderRadius: '16px',
              padding: '28px',
              border: '1px solid #EFEFEF'
            }}>
              <span style={{
                display: 'inline-block',
                padding: '4px 10px',
                background: '#E0E0E0',
                color: '#666',
                fontSize: '12px',
                fontWeight: '600',
                borderRadius: '4px',
                marginBottom: '16px'
              }}>
                셀프
              </span>
              <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#191919', marginBottom: '4px' }}>
                99,000원
              </h3>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
                랜딩페이지 1개
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, marginBottom: '24px' }}>
                {['AI 자동 카피 생성', '모바일 최적화', '신청 폼 포함', '즉시 배포 가능'].map((item, i) => (
                  <li key={i} style={{ fontSize: '14px', color: '#333', marginBottom: '8px', paddingLeft: '16px', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 0, color: '#4CAF50' }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={handleCreateClick}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  background: '#fff',
                  color: '#191919',
                  border: '1px solid #191919',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                직접 만들기
              </button>
            </div>

            {/* 제작 대행 - 추천 */}
            <div style={{
              background: '#191919',
              borderRadius: '16px',
              padding: '28px',
              position: 'relative'
            }}>
              <span style={{
                position: 'absolute',
                top: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '4px 12px',
                background: '#FF6B35',
                color: '#fff',
                fontSize: '12px',
                fontWeight: '600',
                borderRadius: '20px'
              }}>
                추천
              </span>
              <span style={{
                display: 'inline-block',
                padding: '4px 10px',
                background: 'rgba(255,255,255,0.2)',
                color: '#fff',
                fontSize: '12px',
                fontWeight: '600',
                borderRadius: '4px',
                marginBottom: '16px'
              }}>
                대행
              </span>
              <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>
                199,000원
              </h3>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '20px' }}>
                랜딩페이지 1개 + 1회 수정
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, marginBottom: '24px' }}>
                {['전문가가 직접 제작', '모객 카피 최적화', '1회 무료 수정', '48시간 내 완성'].map((item, i) => (
                  <li key={i} style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', marginBottom: '8px', paddingLeft: '16px', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 0, color: '#FF6B35' }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setShowConsultModal(true)}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  background: '#FF6B35',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                상담 신청하기
              </button>
            </div>

            {/* 프리미엄 대행 */}
            <div style={{
              background: '#FAFAFA',
              borderRadius: '16px',
              padding: '28px',
              border: '1px solid #EFEFEF'
            }}>
              <span style={{
                display: 'inline-block',
                padding: '4px 10px',
                background: '#7C3AED',
                color: '#fff',
                fontSize: '12px',
                fontWeight: '600',
                borderRadius: '4px',
                marginBottom: '16px'
              }}>
                프리미엄
              </span>
              <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#191919', marginBottom: '4px' }}>
                399,000원
              </h3>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
                제작 + 카피 컨설팅
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, marginBottom: '24px' }}>
                {['대행 서비스 전체 포함', '1:1 카피 컨설팅 30분', '3회 무료 수정', 'A/B 테스트 제안'].map((item, i) => (
                  <li key={i} style={{ fontSize: '14px', color: '#333', marginBottom: '8px', paddingLeft: '16px', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 0, color: '#7C3AED' }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setShowConsultModal(true)}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  background: '#7C3AED',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                상담 신청하기
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer style={{
        padding: '32px 24px',
        background: '#fff',
        borderTop: '1px solid #EFEFEF',
        textAlign: 'center'
      }}>
        <p style={{ fontSize: '13px', color: '#999' }}>
          © 2024 랜딩메이커. 글 하나로 매출을 만드세요.
        </p>
      </footer>
    </div>
  );
}
