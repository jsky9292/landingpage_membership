'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Payment {
  id: string;
  user_email: string;
  payment_key: string;
  order_id: string;
  amount: number;
  plan: string;
  billing_cycle: string;
  status: string;
  card_company?: string;
  card_number?: string;
  receipt_url?: string;
  created_at: string;
}

interface PaymentStats {
  totalRevenue: number;
  monthlyRevenue: number;
  totalTransactions: number;
  completedTransactions: number;
}

const PLAN_LABELS: Record<string, { name: string; color: string; bg: string }> = {
  starter: { name: 'Starter', color: 'text-blue-600', bg: 'bg-blue-100' },
  pro: { name: 'Pro', color: 'text-purple-600', bg: 'bg-purple-100' },
  unlimited: { name: 'Unlimited', color: 'text-orange-600', bg: 'bg-orange-100' },
  agency: { name: 'Agency', color: 'text-red-600', bg: 'bg-red-100' },
};

const STATUS_LABELS: Record<string, { name: string; color: string; bg: string }> = {
  completed: { name: '완료', color: 'text-green-600', bg: 'bg-green-100' },
  pending: { name: '대기중', color: 'text-yellow-600', bg: 'bg-yellow-100' },
  cancelled: { name: '취소', color: 'text-gray-600', bg: 'bg-gray-100' },
  refunded: { name: '환불', color: 'text-red-600', bg: 'bg-red-100' },
};

export default function PaymentsManagementPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<PaymentStats>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalTransactions: 0,
    completedTransactions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (planFilter !== 'all') params.set('plan', planFilter);
      if (statusFilter !== 'all') params.set('status', statusFilter);

      const res = await fetch(`/api/admin/payments?${params.toString()}`);
      if (!res.ok) {
        if (res.status === 403) {
          throw new Error('관리자 권한이 필요합니다.');
        }
        throw new Error('데이터를 불러오는데 실패했습니다.');
      }
      const data = await res.json();
      setPayments(data.payments || []);
      setStats(data.stats || {
        totalRevenue: 0,
        monthlyRevenue: 0,
        totalTransactions: 0,
        completedTransactions: 0,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [planFilter, statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPayments();
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(amount);
  };

  if (loading && payments.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-[#4E5968]">로딩중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-red-500">{error}</p>
          <Link
            href="/admin/dashboard"
            className="mt-4 inline-block text-[#0064FF] hover:underline"
          >
            대시보드로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-bold text-[#191F28]">결제 내역</h1>
        <p className="text-[#4E5968] mt-1">
          전체 {stats.totalTransactions}건의 결제 내역
        </p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <p className="text-sm text-[#4E5968] mb-1">총 매출</p>
          <p className="text-2xl font-bold text-[#191F28]">
            {formatAmount(stats.totalRevenue)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <p className="text-sm text-[#4E5968] mb-1">이번달 매출</p>
          <p className="text-2xl font-bold text-green-600">
            {formatAmount(stats.monthlyRevenue)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <p className="text-sm text-[#4E5968] mb-1">전체 거래</p>
          <p className="text-2xl font-bold text-[#191F28]">
            {stats.totalTransactions}건
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <p className="text-sm text-[#4E5968] mb-1">완료된 거래</p>
          <p className="text-2xl font-bold text-blue-600">
            {stats.completedTransactions}건
          </p>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="이메일로 검색..."
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0064FF]/20 focus:border-[#0064FF]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#0064FF] text-white rounded-lg hover:bg-[#0050CC] transition-colors"
          >
            검색
          </button>
        </form>

        <select
          value={planFilter}
          onChange={(e) => setPlanFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0064FF]/20"
        >
          <option value="all">모든 플랜</option>
          <option value="starter">Starter</option>
          <option value="pro">Pro</option>
          <option value="unlimited">Unlimited</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0064FF]/20"
        >
          <option value="all">모든 상태</option>
          <option value="completed">완료</option>
          <option value="pending">대기중</option>
          <option value="cancelled">취소</option>
          <option value="refunded">환불</option>
        </select>
      </div>

      {/* 결제 목록 */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        {/* 테이블 헤더 */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 text-sm font-medium text-[#4E5968]">
          <div className="col-span-3">이메일</div>
          <div className="col-span-2">플랜</div>
          <div className="col-span-2">결제금액</div>
          <div className="col-span-2">결제수단</div>
          <div className="col-span-1">상태</div>
          <div className="col-span-2">결제일</div>
        </div>

        {/* 테이블 바디 */}
        {payments.length > 0 ? (
          payments.map((payment) => (
            <div
              key={payment.id}
              className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 items-center"
            >
              <div className="col-span-3 text-[#191F28] truncate text-sm">
                {payment.user_email}
              </div>
              <div className="col-span-2">
                <span className={`text-sm px-3 py-1 rounded-full ${
                  PLAN_LABELS[payment.plan]?.bg || 'bg-gray-100'
                } ${PLAN_LABELS[payment.plan]?.color || 'text-gray-600'}`}>
                  {PLAN_LABELS[payment.plan]?.name || payment.plan}
                </span>
                <span className="text-xs text-gray-400 ml-2">
                  {payment.billing_cycle === 'yearly' ? '연간' : '월간'}
                </span>
              </div>
              <div className="col-span-2 font-medium text-[#191F28]">
                {formatAmount(payment.amount)}
              </div>
              <div className="col-span-2 text-sm text-[#4E5968]">
                {payment.card_company && payment.card_number ? (
                  <span>{payment.card_company} {payment.card_number}</span>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </div>
              <div className="col-span-1">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  STATUS_LABELS[payment.status]?.bg || 'bg-gray-100'
                } ${STATUS_LABELS[payment.status]?.color || 'text-gray-600'}`}>
                  {STATUS_LABELS[payment.status]?.name || payment.status}
                </span>
              </div>
              <div className="col-span-2 text-sm text-[#4E5968]">
                {new Date(payment.created_at).toLocaleString('ko-KR')}
                {payment.receipt_url && (
                  <a
                    href={payment.receipt_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-[#0064FF] hover:underline"
                  >
                    영수증
                  </a>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16">
            <span className="text-4xl mb-4 block">💳</span>
            <p className="text-[#4E5968]">
              {search ? '검색 결과가 없어요' : '아직 결제 내역이 없어요'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
