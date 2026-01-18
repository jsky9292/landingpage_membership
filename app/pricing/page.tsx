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
    id: 'starter',
    name: '스타터',
    originalPrice: 59800,
    monthlyPrice: 29900,
    yearlyPrice: 299000, // 연 299,000원 (월 24,917원 상당, 약 17% 추가 할인)
    priceLabel: '₩29,900',
    yearlyPriceLabel: '₩299,000',
    originalPriceLabel: '₩59,800',
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
    originalPrice: 139800,
    monthlyPrice: 69900,
    yearlyPrice: 699000, // 연 699,000원 (월 58,250원 상당, 약 17% 추가 할인)
    priceLabel: '₩69,900',
    yearlyPriceLabel: '₩699,000',
    originalPriceLabel: '₩139,800',
    period: '/월',
    description: '월 3개 페이지',
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
    originalPrice: 198000,
    monthlyPrice: 99000,
    yearlyPrice: 990000, // 연 990,000원 (월 82,500원 상당, 약 17% 추가 할인)
    priceLabel: '₩99,000',
    yearlyPriceLabel: '₩990,000',
    originalPriceLabel: '₩198,000',
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
    originalPrice: 0,
    monthlyPrice: 0,
    yearlyPrice: 0,
    priceLabel: '별도 문의',
    yearlyPriceLabel: '별도 문의',
    originalPriceLabel: '',
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
  const { data: session } = useSession();
  const router = useRouter();
  const [currentPlan] = useState<string>('free');
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [widgets, setWidgets] = useState<TossPaymentsWidgets | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

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
          const paymentAmount = billingPeriod === 'yearly'
            ? selectedPlan.yearlyPrice
            : selectedPlan.monthlyPrice;

          await widgets.setAmount({
            currency: 'KRW',
            value: paymentAmount,
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
  }, [showPayment, widgets, selectedPlan, billingPeriod]);

  const handleSelectPlan = async (plan: typeof plans[0]) => {
    if (plan.buttonDisabled) return;

    // 대행사 문의는 별도 처리
    if ((plan as { isAgency?: boolean }).isAgency) {
      window.open('https://pf.kakao.com/_xnxnxn', '_blank');
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
      const orderId = `plan_${selectedPlan.id}_${billingPeriod}_${Date.now()}`;
      const paymentAmount = billingPeriod === 'yearly'
        ? selectedPlan.yearlyPrice
        : selectedPlan.monthlyPrice;
      const periodLabel = billingPeriod === 'yearly' ? '연간' : '월간';

      await widgets.requestPayment({
        orderId,
        orderName: `랜딩메이커 ${selectedPlan.name} 플랜 (${periodLabel})`,
        customerEmail: session.user.email,
        customerName: session.user.name || '사용자',
        successUrl: `${window.location.origin}/pricing/success?plan=${selectedPlan.id}&period=${billingPeriod}`,
        failUrl: `${window.location.origin}/pricing/fail`,
      });
    } catch (error: unknown) {
      console.error('Payment error:', error);
      const errorMessage = error instanceof Error ? error.message : '결제 중 오류가 발생했습니다.';
      alert(errorMessage);
    } finally {
      setIsLoading(null);
    }
  };

  const getDisplayPrice = (plan: typeof plans[0]) => {
    if (plan.isAgency) return plan.priceLabel;
    return billingPeriod === 'yearly' ? plan.yearlyPriceLabel : plan.priceLabel;
  };

  const getPeriodLabel = (plan: typeof plans[0]) => {
    if (plan.isAgency) return '';
    return billingPeriod === 'yearly' ? '/년' : '/월';
  };

  if (showPayment && selectedPlan) {
    const paymentAmount = billingPeriod === 'yearly'
      ? selectedPlan.yearlyPrice
      : selectedPlan.monthlyPrice;
    const displayAmount = billingPeriod === 'yearly'
      ? selectedPlan.yearlyPriceLabel
      : selectedPlan.priceLabel;
    const periodLabel = billingPeriod === 'yearly' ? '연간' : '월간';

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
              {periodLabel} {displayAmount} · 언제든 해지 가능
            </p>

            <div className="border-t border-b border-gray-100 py-4 mb-6">
              <div className="flex justify-between text-lg">
                <span className="text-gray-600">결제 금액</span>
                <span className="font-bold text-gray-900">{displayAmount}</span>
              </div>
              {billingPeriod === 'yearly' && (
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-500">월 환산</span>
                  <span className="text-green-600">
                    월 ₩{Math.round(paymentAmount / 12).toLocaleString()} (약 17% 추가 할인)
                  </span>
                </div>
              )}
            </div>

            {/* 토스페이먼츠 위젯 */}
            <div id="payment-method" className="mb-4"></div>
            <div id="agreement" className="mb-6"></div>

            <button
              onClick={handlePayment}
              disabled={isLoading === selectedPlan.id}
              className="w-full py-4 bg-[#3182F6] hover:bg-[#1E6DE8] disabled:bg-gray-400 text-white font-semibold rounded-xl transition-colors"
            >
              {isLoading === selectedPlan.id ? '처리 중...' : `${displayAmount} 결제하기`}
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
            🚀 랜딩메이커
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
        <div className="inline-block bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold mb-6 animate-pulse">
          🎉 런칭 기념 50% 할인 중!
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          심플한 가격, 강력한 기능
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          비즈니스 규모에 맞는 플랜을 선택하세요.<br />
          언제든 업그레이드하거나 해지할 수 있습니다.
        </p>

        {/* 월간/연간 토글 */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <span
            className={`text-sm font-medium cursor-pointer ${billingPeriod === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}
            onClick={() => setBillingPeriod('monthly')}
          >
            월간 결제
          </span>
          <button
            onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
            className={`relative w-14 h-7 rounded-full transition-colors flex-shrink-0 ${
              billingPeriod === 'yearly' ? 'bg-[#3182F6]' : 'bg-gray-300'
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                billingPeriod === 'yearly' ? 'translate-x-7' : 'translate-x-0'
              }`}
            />
          </button>
          <span
            className={`text-sm font-medium cursor-pointer ${billingPeriod === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}
            onClick={() => setBillingPeriod('yearly')}
          >
            연간 결제
          </span>
          {billingPeriod === 'yearly' && (
            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
              추가 17% 할인
            </span>
          )}
        </div>
      </section>

      {/* 플랜 카드 */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.filter(p => !p.isAgency).map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-lg overflow-hidden ${
                plan.popular ? 'ring-2 ring-[#3182F6]' : ''
              }`}
            >
              {/* 50% 할인 뱃지 */}
              <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                50% OFF
              </div>

              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-[#3182F6] text-white text-center py-1 text-sm font-medium">
                  가장 인기
                </div>
              )}

              <div className={`p-8 ${plan.popular ? 'pt-12' : ''}`}>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>

                <div className="mb-6">
                  {/* 원래 가격 (취소선) */}
                  {plan.originalPriceLabel && (
                    <div className="text-gray-400 line-through text-lg mb-1">
                      {billingPeriod === 'yearly'
                        ? `₩${(plan.originalPrice * 12).toLocaleString()}`
                        : plan.originalPriceLabel
                      }
                    </div>
                  )}
                  {/* 할인된 가격 */}
                  <span className="text-4xl font-bold text-gray-900">{getDisplayPrice(plan)}</span>
                  <span className="text-gray-600">{getPeriodLabel(plan)}</span>

                  {/* 연간 결제 시 월 환산 금액 */}
                  {billingPeriod === 'yearly' && plan.yearlyPrice > 0 && (
                    <div className="text-sm text-green-600 mt-1">
                      월 ₩{Math.round(plan.yearlyPrice / 12).toLocaleString()} 상당
                    </div>
                  )}
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

        {/* 대행사/제휴 카드 */}
        <div className="mt-8">
          {plans.filter(p => p.isAgency).map((plan) => (
            <div
              key={plan.id}
              className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl shadow-lg p-8 text-white"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-300 mb-4">{plan.description}</p>
                  <div className="flex flex-wrap gap-3">
                    {plan.features.map((feature, idx) => (
                      <span key={idx} className="bg-white/10 px-3 py-1 rounded-full text-sm">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => handleSelectPlan(plan)}
                  className="bg-white text-gray-900 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap"
                >
                  {plan.buttonText}
                </button>
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
            <h3 className="font-semibold text-gray-900 mb-2">50% 할인은 언제까지인가요?</h3>
            <p className="text-gray-600">런칭 기념 특별 할인으로, 별도 공지 전까지 계속 적용됩니다. 지금 가입하시면 할인가로 계속 이용하실 수 있습니다.</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow">
            <h3 className="font-semibold text-gray-900 mb-2">해지는 어떻게 하나요?</h3>
            <p className="text-gray-600">설정 페이지에서 언제든 해지할 수 있습니다. 해지해도 결제 기간이 끝날 때까지 서비스를 이용할 수 있습니다.</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow">
            <h3 className="font-semibold text-gray-900 mb-2">해지 후에도 이용할 수 있나요?</h3>
            <p className="text-gray-600">월 결제 해지 시 잔여 기간까지는 정상적으로 이용 가능하며, 익월부터 서비스 이용이 제한됩니다.</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow">
            <h3 className="font-semibold text-gray-900 mb-2">연간 결제의 장점은 무엇인가요?</h3>
            <p className="text-gray-600">연간 결제 시 50% 할인에 추가로 약 17% 할인이 적용되어 더욱 저렴하게 이용할 수 있습니다. 또한 1년간 가격 인상 없이 서비스를 이용할 수 있습니다.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
