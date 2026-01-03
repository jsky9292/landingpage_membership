'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loadTossPayments, TossPaymentsWidgets } from '@tosspayments/tosspayments-sdk';

const TOSS_CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq';

// 플랜 정보
const plans = [
  {
    id: 'single',
    name: '단건 구매',
    price: 99000,
    priceLabel: '₩99,000',
    period: '',
    description: '1개 페이지 평생 이용',
    features: [
      '랜딩페이지 1개',
      'AI 콘텐츠 생성',
      '모든 템플릿',
      'DB 수집 폼',
      '워터마크 제거',
      '평생 이용',
    ],
    limitations: [],
    popular: false,
    buttonText: '구매하기',
    buttonDisabled: false,
    isSubscription: false,
  },
  {
    id: 'starter',
    name: '스타터',
    price: 19900,
    priceLabel: '₩19,900',
    period: '/월',
    description: '월 1개 페이지 구독',
    features: [
      '매월 랜딩페이지 1개',
      'AI 콘텐츠 생성',
      '모든 템플릿',
      'DB 수집 폼',
      '카카오 알림',
      '이메일 알림',
      '대시보드',
    ],
    limitations: [],
    popular: false,
    buttonText: '시작하기',
    buttonDisabled: false,
    isSubscription: true,
  },
  {
    id: 'pro',
    name: '프로',
    price: 49500,
    priceLabel: '₩49,500',
    period: '/월',
    description: '월 3개 페이지 (17% 할인)',
    features: [
      '매월 랜딩페이지 3개',
      'AI 콘텐츠 생성 무제한',
      '모든 프리미엄 테마',
      'A/B 테스트',
      '분석 리포트',
      '이메일 + 카카오 알림',
      '우선 지원',
    ],
    limitations: [],
    popular: true,
    buttonText: '프로 시작',
    buttonDisabled: false,
    isSubscription: true,
  },
  {
    id: 'unlimited',
    name: '무제한',
    price: 99000,
    priceLabel: '₩99,000',
    period: '/월',
    description: '페이지 무제한 생성',
    features: [
      '랜딩페이지 무제한',
      'AI 콘텐츠 생성 무제한',
      '모든 프리미엄 테마',
      '화이트라벨',
      'API 연동',
      '전담 매니저',
      '맞춤 도메인',
    ],
    limitations: [],
    popular: false,
    buttonText: '시작하기',
    buttonDisabled: false,
    isSubscription: true,
  },
  {
    id: 'agency',
    name: '대행사/제휴',
    price: 0,
    priceLabel: '별도 문의',
    period: '',
    description: '맞춤 견적 제공',
    features: [
      '대량 할인',
      '맞춤 기능 개발',
      '전용 서버',
      'SLA 보장',
      '교육 지원',
    ],
    limitations: [],
    popular: false,
    buttonText: '문의하기',
    buttonDisabled: false,
    isAgency: true,
    isSubscription: false,
  },
];

export default function PricingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentPlan, setCurrentPlan] = useState<string>('free');
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [widgets, setWidgets] = useState<TossPaymentsWidgets | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  // 토스페이먼츠 위젯 초기화
  useEffect(() => {
    async function initToss() {
      try {
        const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY);
        const customerKey = session?.user?.email || `guest_${Date.now()}`;
        const paymentWidgets = tossPayments.widgets({ customerKey });
        setWidgets(paymentWidgets);
      } catch (error) {
        console.error('Toss Payments init error:', error);
      }
    }
    initToss();
  }, [session]);

  // 결제 위젯 렌더링
  useEffect(() => {
    if (showPayment && widgets && selectedPlan) {
      const renderWidgets = async () => {
        try {
          await widgets.setAmount({
            currency: 'KRW',
            value: selectedPlan.price,
          });

          await Promise.all([
            widgets.renderPaymentMethods({
              selector: '#payment-method',
              variantKey: 'DEFAULT',
            }),
            widgets.renderAgreement({
              selector: '#agreement',
              variantKey: 'AGREEMENT',
            }),
          ]);
        } catch (error) {
          console.error('Widget render error:', error);
        }
      };
      renderWidgets();
    }
  }, [showPayment, widgets, selectedPlan]);

  const handleSelectPlan = async (plan: typeof plans[0]) => {
    if (plan.buttonDisabled) return;

    // 대행사 문의는 별도 처리
    if ((plan as any).isAgency) {
      window.open('https://pf.kakao.com/_xnxnxn', '_blank'); // 카카오톡 채널 링크 (예시)
      return;
    }

    if (!session) {
      router.push(`/login?callbackUrl=/pricing`);
      return;
    }

    setSelectedPlan(plan);
    setShowPayment(true);
  };

  const handlePayment = async () => {
    if (!widgets || !selectedPlan || !session?.user?.email) return;

    setIsLoading(selectedPlan.id);

    try {
      const orderId = `plan_${selectedPlan.id}_${Date.now()}`;

      await widgets.requestPayment({
        orderId,
        orderName: `랜딩AI ${selectedPlan.name} 플랜 (월간)`,
        customerEmail: session.user.email,
        customerName: session.user.name || '사용자',
        successUrl: `${window.location.origin}/pricing/success?plan=${selectedPlan.id}`,
        failUrl: `${window.location.origin}/pricing/fail`,
      });
    } catch (error: any) {
      console.error('Payment error:', error);
      alert(error.message || '결제 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(null);
    }
  };

  if (showPayment && selectedPlan) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-lg mx-auto">
          <button
            onClick={() => setShowPayment(false)}
            className="mb-6 text-gray-600 hover:text-gray-900 flex items-center gap-2"
          >
            ← 플랜 선택으로 돌아가기
          </button>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {selectedPlan.name} 플랜 결제
            </h2>
            <p className="text-gray-600 mb-6">
              월 {selectedPlan.priceLabel} · 언제든 해지 가능
            </p>

            <div className="border-t border-b border-gray-100 py-4 mb-6">
              <div className="flex justify-between text-lg">
                <span className="text-gray-600">결제 금액</span>
                <span className="font-bold text-gray-900">{selectedPlan.priceLabel}</span>
              </div>
            </div>

            {/* 토스페이먼츠 위젯 */}
            <div id="payment-method" className="mb-4"></div>
            <div id="agreement" className="mb-6"></div>

            <button
              onClick={handlePayment}
              disabled={isLoading === selectedPlan.id}
              className="w-full py-4 bg-[#3182F6] hover:bg-[#1E6DE8] disabled:bg-gray-400 text-white font-semibold rounded-xl transition-colors"
            >
              {isLoading === selectedPlan.id ? '처리 중...' : `${selectedPlan.priceLabel} 결제하기`}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* 헤더 */}
      <header className="py-6 px-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            🚀 랜딩AI
          </Link>
          {session ? (
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              대시보드 →
            </Link>
          ) : (
            <Link href="/login" className="text-[#3182F6] hover:text-[#1E6DE8] font-medium">
              로그인
            </Link>
          )}
        </div>
      </header>

      {/* 히어로 */}
      <section className="text-center py-16 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          심플한 가격, 강력한 기능
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          비즈니스 규모에 맞는 플랜을 선택하세요.<br />
          언제든 업그레이드하거나 해지할 수 있습니다.
        </p>
      </section>

      {/* 플랜 카드 */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-lg overflow-hidden ${
                plan.popular ? 'ring-2 ring-[#3182F6]' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-[#3182F6] text-white text-center py-1 text-sm font-medium">
                  가장 인기
                </div>
              )}

              <div className={`p-8 ${plan.popular ? 'pt-12' : ''}`}>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">{plan.priceLabel}</span>
                  {plan.period && <span className="text-gray-600">{plan.period}</span>}
                </div>

                <button
                  onClick={() => handleSelectPlan(plan)}
                  disabled={plan.buttonDisabled || currentPlan === plan.id}
                  className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-[#3182F6] hover:bg-[#1E6DE8] text-white'
                      : plan.buttonDisabled
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  {currentPlan === plan.id ? '현재 플랜' : plan.buttonText}
                </button>

                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                  {plan.limitations.map((limitation, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-400">
                      <span className="mt-0.5">−</span>
                      <span>{limitation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">자주 묻는 질문</h2>
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-6 shadow">
            <h3 className="font-semibold text-gray-900 mb-2">결제 후 바로 이용할 수 있나요?</h3>
            <p className="text-gray-600">네, 결제 완료 즉시 플랜이 업그레이드되어 모든 기능을 이용할 수 있습니다.</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow">
            <h3 className="font-semibold text-gray-900 mb-2">해지는 어떻게 하나요?</h3>
            <p className="text-gray-600">설정 페이지에서 언제든 해지할 수 있습니다. 해지해도 결제 기간이 끝날 때까지 서비스를 이용할 수 있습니다.</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow">
            <h3 className="font-semibold text-gray-900 mb-2">환불 정책이 어떻게 되나요?</h3>
            <p className="text-gray-600">결제 후 7일 이내에는 전액 환불이 가능합니다. 설정 페이지에서 환불을 요청할 수 있습니다.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
