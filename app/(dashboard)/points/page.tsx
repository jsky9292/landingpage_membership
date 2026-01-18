'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// 포인트 상품 목록
const pointProducts = [
  {
    id: 'point_5000',
    points: 5000,
    price: 5000,
    bonus: 0,
    label: '5,000P',
    priceLabel: '5,000원',
    popular: false,
  },
  {
    id: 'point_10000',
    points: 10000,
    price: 10000,
    bonus: 500,
    label: '10,000P',
    priceLabel: '10,000원',
    bonusLabel: '+500P 보너스',
    popular: false,
  },
  {
    id: 'point_30000',
    points: 30000,
    price: 30000,
    bonus: 2000,
    label: '30,000P',
    priceLabel: '30,000원',
    bonusLabel: '+2,000P 보너스',
    popular: true,
  },
  {
    id: 'point_50000',
    points: 50000,
    price: 50000,
    bonus: 5000,
    label: '50,000P',
    priceLabel: '50,000원',
    bonusLabel: '+5,000P 보너스',
    popular: false,
  },
  {
    id: 'point_100000',
    points: 100000,
    price: 100000,
    bonus: 15000,
    label: '100,000P',
    priceLabel: '100,000원',
    bonusLabel: '+15,000P 보너스',
    popular: false,
  },
];

// 포인트 사용 안내
const pointUsage = [
  { action: '랜딩페이지 생성', points: 1000, description: 'AI가 자동으로 콘텐츠를 생성합니다' },
  { action: '이미지 생성', points: 100, description: 'AI 이미지 1장 생성' },
  { action: '페이지 게시', points: 500, description: '생성한 페이지를 온라인에 게시' },
  { action: '썸네일 생성', points: 200, description: '마케팅용 썸네일 이미지' },
  { action: '카드뉴스 생성', points: 500, description: '5장 기준 카드뉴스 세트' },
];

interface PointHistory {
  id: string;
  type: 'charge' | 'use' | 'bonus' | 'referral';
  amount: number;
  description: string;
  balance: number;
  created_at: string;
}

export default function PointsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [currentPoints, setCurrentPoints] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<typeof pointProducts[0] | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<PointHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (session) {
      fetchPointData();
    }
  }, [session]);

  const fetchPointData = async () => {
    try {
      const res = await fetch('/api/points');
      if (res.ok) {
        const data = await res.json();
        setCurrentPoints(data.points || 0);
        setHistory(data.history || []);
      }
    } catch (err) {
      console.error('Failed to fetch points:', err);
    }
  };

  const handleCharge = async () => {
    if (!selectedProduct || !session) return;
    setLoading(true);

    try {
      const res = await fetch('/api/points/charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct.id,
          points: selectedProduct.points + selectedProduct.bonus,
          price: selectedProduct.price,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.paymentUrl) {
          // 결제 페이지로 이동
          window.location.href = data.paymentUrl;
        } else {
          // 데모 모드: 즉시 충전
          setCurrentPoints(prev => prev + selectedProduct.points + selectedProduct.bonus);
          setSelectedProduct(null);
          alert(`${(selectedProduct.points + selectedProduct.bonus).toLocaleString()}P가 충전되었습니다.`);
          fetchPointData();
        }
      } else {
        const error = await res.json();
        alert(error.message || '충전에 실패했습니다.');
      }
    } catch (err) {
      console.error('Charge error:', err);
      alert('충전 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!session) {
    return (
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>P</div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#191F28', marginBottom: 8 }}>로그인이 필요합니다</h2>
        <p style={{ fontSize: 14, color: '#6B7684', marginBottom: 24 }}>포인트 충전은 로그인 후 이용 가능합니다.</p>
        <Link href="/login?callbackUrl=/points" style={{
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

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>
      {/* 현재 포인트 */}
      <div style={{
        background: 'linear-gradient(135deg, #3182F6 0%, #6366F1 100%)',
        borderRadius: 20,
        padding: '32px 24px',
        color: '#fff',
        marginBottom: 32,
      }}>
        <p style={{ fontSize: 14, opacity: 0.9, marginBottom: 8 }}>내 포인트</p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontSize: 42, fontWeight: 700 }}>{currentPoints.toLocaleString()}</span>
          <span style={{ fontSize: 20, fontWeight: 500 }}>P</span>
        </div>
        <p style={{ fontSize: 13, opacity: 0.8, marginTop: 12 }}>
          포인트는 랜딩페이지 생성, 이미지 생성 등에 사용됩니다
        </p>
      </div>

      {/* 포인트 충전 */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#191F28', marginBottom: 16 }}>포인트 충전</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
          {pointProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              style={{
                padding: '20px 16px',
                background: selectedProduct?.id === product.id ? '#E8F3FF' : '#fff',
                border: selectedProduct?.id === product.id ? '2px solid #3182F6' : '1px solid #E5E8EB',
                borderRadius: 12,
                cursor: 'pointer',
                textAlign: 'center',
                position: 'relative',
                transition: 'all 0.2s',
              }}
            >
              {product.popular && (
                <span style={{
                  position: 'absolute',
                  top: -8,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#FF6B6B',
                  color: '#fff',
                  fontSize: 10,
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: 10,
                }}>
                  인기
                </span>
              )}
              <p style={{ fontSize: 18, fontWeight: 700, color: '#191F28', marginBottom: 4 }}>
                {product.label}
              </p>
              <p style={{ fontSize: 14, color: '#6B7684', marginBottom: 4 }}>
                {product.priceLabel}
              </p>
              {product.bonus > 0 && (
                <p style={{ fontSize: 12, color: '#3182F6', fontWeight: 500 }}>
                  {product.bonusLabel}
                </p>
              )}
            </button>
          ))}
        </div>

        {selectedProduct && (
          <div style={{
            marginTop: 20,
            padding: 20,
            background: '#F8F9FA',
            borderRadius: 12,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ color: '#6B7684' }}>선택 상품</span>
              <span style={{ fontWeight: 600, color: '#191F28' }}>{selectedProduct.label}</span>
            </div>
            {selectedProduct.bonus > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ color: '#6B7684' }}>보너스</span>
                <span style={{ fontWeight: 600, color: '#3182F6' }}>+{selectedProduct.bonus.toLocaleString()}P</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, paddingTop: 12, borderTop: '1px solid #E5E8EB' }}>
              <span style={{ fontWeight: 600, color: '#191F28' }}>총 충전 포인트</span>
              <span style={{ fontWeight: 700, color: '#191F28', fontSize: 18 }}>
                {(selectedProduct.points + selectedProduct.bonus).toLocaleString()}P
              </span>
            </div>
            <button
              onClick={handleCharge}
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                background: loading ? '#9CA3AF' : '#3182F6',
                color: '#fff',
                border: 'none',
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? '처리 중...' : `${selectedProduct.priceLabel} 결제하기`}
            </button>
          </div>
        )}
      </div>

      {/* 포인트 사용 안내 */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#191F28', marginBottom: 16 }}>포인트 사용 안내</h2>
        <div style={{ background: '#fff', border: '1px solid #E5E8EB', borderRadius: 16, overflow: 'hidden' }}>
          {pointUsage.map((item, i) => (
            <div
              key={i}
              style={{
                padding: '16px 20px',
                borderBottom: i < pointUsage.length - 1 ? '1px solid #F2F4F6' : 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <p style={{ fontSize: 15, fontWeight: 600, color: '#191F28', marginBottom: 2 }}>{item.action}</p>
                <p style={{ fontSize: 13, color: '#8B95A1' }}>{item.description}</p>
              </div>
              <span style={{
                fontSize: 15,
                fontWeight: 600,
                color: '#3182F6',
                whiteSpace: 'nowrap',
              }}>
                {item.points.toLocaleString()}P
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 포인트 이력 */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#191F28', margin: 0 }}>포인트 이력</h2>
          <button
            onClick={() => setShowHistory(!showHistory)}
            style={{
              background: 'none',
              border: 'none',
              color: '#3182F6',
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            {showHistory ? '접기' : '펼치기'}
          </button>
        </div>

        {showHistory && (
          <div style={{ background: '#fff', border: '1px solid #E5E8EB', borderRadius: 16, overflow: 'hidden' }}>
            {history.length > 0 ? (
              history.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid #F2F4F6',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <p style={{ fontSize: 14, color: '#191F28', marginBottom: 2 }}>{item.description}</p>
                    <p style={{ fontSize: 12, color: '#8B95A1' }}>{formatDate(item.created_at)}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: item.amount > 0 ? '#3182F6' : '#FF6B6B',
                    }}>
                      {item.amount > 0 ? '+' : ''}{item.amount.toLocaleString()}P
                    </p>
                    <p style={{ fontSize: 12, color: '#8B95A1' }}>잔액 {item.balance.toLocaleString()}P</p>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '48px 20px', textAlign: 'center' }}>
                <p style={{ color: '#8B95A1' }}>아직 포인트 이력이 없습니다</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 안내 문구 */}
      <div style={{
        marginTop: 32,
        padding: 16,
        background: '#FEF3C7',
        borderRadius: 12,
        fontSize: 13,
        color: '#92400E',
        lineHeight: 1.6,
      }}>
        <p style={{ fontWeight: 600, marginBottom: 4 }}>안내사항</p>
        <ul style={{ margin: 0, paddingLeft: 16 }}>
          <li>충전된 포인트는 환불되지 않습니다.</li>
          <li>포인트 유효기간은 충전일로부터 1년입니다.</li>
          <li>추천인 코드로 가입 시 1,000P 보너스가 지급됩니다.</li>
        </ul>
      </div>
    </div>
  );
}
