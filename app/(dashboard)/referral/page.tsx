'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Script from 'next/script';

declare global {
  interface Window {
    Kakao: any;
  }
}

interface ReferralData {
  referralCode: string;
  referralCount: number;
  totalEarned: number;
  referrals: Array<{ name: string; joinedAt: string; bonus: number }>;
}

export default function ReferralPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [kakaoReady, setKakaoReady] = useState(false);

  // Kakao SDK 초기화
  const initKakao = () => {
    if (typeof window !== 'undefined' && window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY || '');
      setKakaoReady(true);
    } else if (window.Kakao?.isInitialized()) {
      setKakaoReady(true);
    }
  };

  useEffect(() => {
    if (session) {
      fetchReferralData();
    }
  }, [session]);

  const fetchReferralData = async () => {
    try {
      const res = await fetch('/api/referral');
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (err) {
      console.error('Failed to fetch referral data:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLink = typeof window !== 'undefined'
    ? `${window.location.origin}/signup?ref=${data?.referralCode || ''}`
    : '';

  // 카카오톡 공유
  const shareToKakao = () => {
    if (!window.Kakao || !window.Kakao.isInitialized()) {
      alert('카카오톡 공유 기능을 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: '랜딩메이커 - 2줄로 랜딩페이지 완성!',
        description: '내 추천 코드로 가입하면 너와 나 모두 1,000P 받아요!',
        imageUrl: 'https://landingpage-membership3.vercel.app/opengraph-image',
        link: {
          mobileWebUrl: shareLink,
          webUrl: shareLink,
        },
      },
      buttons: [
        {
          title: '가입하고 1,000P 받기',
          link: {
            mobileWebUrl: shareLink,
            webUrl: shareLink,
          },
        },
      ],
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!session) {
    return (
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>1000P</div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#191F28', marginBottom: 8 }}>로그인이 필요합니다</h2>
        <p style={{ fontSize: 14, color: '#6B7684', marginBottom: 24 }}>친구 초대는 로그인 후 이용 가능합니다.</p>
        <Link href="/login?callbackUrl=/referral" style={{
          display: 'inline-block',
          padding: '14px 32px',
          background: '#3182F6',
          color: '#fff',
          borderRadius: 12,
          fontSize: 15,
          fontWeight: 600,
          textDecoration: 'none',
        }}>
          로그인하기
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <div style={{ width: 32, height: 32, border: '3px solid #3182F6', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>
      {/* 헤더 배너 */}
      <div style={{
        background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
        borderRadius: 20,
        padding: '32px 24px',
        color: '#fff',
        marginBottom: 32,
        textAlign: 'center',
      }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>친구 초대하고 1,000P 받기</h1>
        <p style={{ fontSize: 15, opacity: 0.9, marginBottom: 0 }}>
          친구가 내 코드로 가입하면, 나와 친구 모두 1,000P 지급
        </p>
      </div>

      {/* 통계 카드 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        <div style={{
          background: '#fff',
          border: '1px solid #E5E8EB',
          borderRadius: 16,
          padding: 20,
          textAlign: 'center',
        }}>
          <p style={{ fontSize: 13, color: '#6B7684', marginBottom: 8 }}>초대한 친구</p>
          <p style={{ fontSize: 28, fontWeight: 700, color: '#191F28', margin: 0 }}>
            {data?.referralCount || 0}<span style={{ fontSize: 14, fontWeight: 400 }}>명</span>
          </p>
        </div>
        <div style={{
          background: '#fff',
          border: '1px solid #E5E8EB',
          borderRadius: 16,
          padding: 20,
          textAlign: 'center',
        }}>
          <p style={{ fontSize: 13, color: '#6B7684', marginBottom: 8 }}>받은 포인트</p>
          <p style={{ fontSize: 28, fontWeight: 700, color: '#3182F6', margin: 0 }}>
            {(data?.totalEarned || 0).toLocaleString()}<span style={{ fontSize: 14, fontWeight: 400 }}>P</span>
          </p>
        </div>
        <div style={{
          background: '#fff',
          border: '1px solid #E5E8EB',
          borderRadius: 16,
          padding: 20,
          textAlign: 'center',
        }}>
          <p style={{ fontSize: 13, color: '#6B7684', marginBottom: 8 }}>초대 1명당</p>
          <p style={{ fontSize: 28, fontWeight: 700, color: '#20C997', margin: 0 }}>
            1,000<span style={{ fontSize: 14, fontWeight: 400 }}>P</span>
          </p>
        </div>
      </div>

      {/* 추천 코드 섹션 */}
      <div style={{
        background: '#fff',
        border: '1px solid #E5E8EB',
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
      }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#191F28', marginBottom: 16 }}>내 추천 코드</h2>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 16,
        }}>
          <div style={{
            flex: 1,
            background: '#F8F9FA',
            borderRadius: 12,
            padding: '16px 20px',
            fontSize: 24,
            fontWeight: 700,
            color: '#191F28',
            letterSpacing: 4,
            textAlign: 'center',
          }}>
            {data?.referralCode || '--------'}
          </div>
          <button
            onClick={() => copyToClipboard(data?.referralCode || '')}
            style={{
              padding: '16px 24px',
              background: copied ? '#20C997' : '#3182F6',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            {copied ? '복사됨' : '코드 복사'}
          </button>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <input
            type="text"
            readOnly
            value={shareLink}
            style={{
              flex: 1,
              background: '#F8F9FA',
              border: '1px solid #E5E8EB',
              borderRadius: 12,
              padding: '14px 16px',
              fontSize: 14,
              color: '#6B7684',
            }}
          />
          <button
            onClick={() => copyToClipboard(shareLink)}
            style={{
              padding: '14px 24px',
              background: '#F2F4F6',
              color: '#4E5968',
              border: 'none',
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            링크 복사
          </button>
        </div>
      </div>

      {/* 카카오톡 공유 버튼 */}
      <div style={{ marginBottom: 32 }}>
        <button
          onClick={shareToKakao}
          disabled={!kakaoReady}
          style={{
            width: '100%',
            padding: '16px 24px',
            background: '#FEE500',
            color: '#191919',
            border: 'none',
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 700,
            cursor: kakaoReady ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            opacity: kakaoReady ? 1 : 0.6,
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 5.813 2 10.5c0 2.923 1.892 5.486 4.74 6.982-.21.787-.758 2.85-.868 3.29-.134.546.2.54.422.393.173-.116 2.752-1.873 3.868-2.631.6.089 1.22.136 1.838.136 5.523 0 10-3.813 10-8.5S17.523 2 12 2z" fill="#191919"/>
          </svg>
          카카오톡으로 공유하기
        </button>
      </div>

      {/* Kakao SDK */}
      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.5.0/kakao.min.js"
        integrity="sha384-kYPsUbBPlktXsY6/oNHSUDZoTX6+YI51f63jCPEIPFP09ttByAdxd2mEjKuhdqn4"
        crossOrigin="anonymous"
        onLoad={initKakao}
      />

      {/* 초대 내역 */}
      <div style={{
        background: '#fff',
        border: '1px solid #E5E8EB',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 32,
      }}>
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #F2F4F6',
        }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#191F28', margin: 0 }}>초대 내역</h2>
        </div>

        {(data?.referrals?.length || 0) > 0 ? (
          data?.referrals.map((referral, i) => (
            <div
              key={i}
              style={{
                padding: '16px 20px',
                borderBottom: i < (data?.referrals?.length || 0) - 1 ? '1px solid #F2F4F6' : 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <p style={{ fontSize: 15, fontWeight: 500, color: '#191F28', marginBottom: 2 }}>{referral.name}</p>
                <p style={{ fontSize: 13, color: '#8B95A1', margin: 0 }}>{formatDate(referral.joinedAt)}</p>
              </div>
              <span style={{ fontSize: 15, fontWeight: 600, color: '#3182F6' }}>
                +{referral.bonus.toLocaleString()}P
              </span>
            </div>
          ))
        ) : (
          <div style={{ padding: '48px 20px', textAlign: 'center' }}>
            <p style={{ color: '#8B95A1', marginBottom: 0 }}>아직 초대한 친구가 없습니다</p>
          </div>
        )}
      </div>

      {/* 안내사항 */}
      <div style={{
        padding: 16,
        background: '#F8F9FA',
        borderRadius: 12,
        fontSize: 13,
        color: '#6B7684',
        lineHeight: 1.6,
      }}>
        <p style={{ fontWeight: 600, color: '#4E5968', marginBottom: 8 }}>안내사항</p>
        <ul style={{ margin: 0, paddingLeft: 16 }}>
          <li>추천 코드로 친구가 가입하면 나와 친구 모두 1,000P를 받습니다.</li>
          <li>포인트는 회원가입 완료 즉시 자동 지급됩니다.</li>
          <li>지급된 포인트는 랜딩페이지 생성, 이미지 생성 등에 사용할 수 있습니다.</li>
          <li>부정한 방법으로 포인트를 획득한 경우 회수될 수 있습니다.</li>
        </ul>
      </div>
    </div>
  );
}
