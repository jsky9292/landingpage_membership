'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

interface PageStats {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published';
  viewCount: number;
  submissionCount: number;
  newSubmissionCount: number;
  createdAt: string;
}

interface DashboardStats {
  totalPages: number;
  totalSubmissions: number;
  newSubmissions: number;
  conversionRate: number;
}

interface PlanInfo {
  id: string;
  name: string;
  pageLimit: number;
  pagesRemaining: number;
}

// 사용 가능한 플랜 목록
const availablePlans = [
  { id: 'free', name: '무료', pages: 1 },
  { id: 'starter', name: '스타터', pages: 1 },
  { id: 'pro', name: '프로', pages: 3 },
  { id: 'unlimited', name: '무제한', pages: -1 },
  { id: 'agency', name: '대행사', pages: -1 },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPages: 0,
    totalSubmissions: 0,
    newSubmissions: 0,
    conversionRate: 0,
  });
  const [pages, setPages] = useState<PageStats[]>([]);
  const [plan, setPlan] = useState<PlanInfo>({
    id: 'free',
    name: '무료',
    pageLimit: 1,
    pagesRemaining: 1,
  });
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPlanDropdown, setShowPlanDropdown] = useState(false);
  const [changingPlan, setChangingPlan] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowPlanDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/dashboard');

      if (!res.ok) {
        console.error('Failed to fetch dashboard data');
        return;
      }

      const data = await res.json();
      setStats(data.stats);
      setPages(data.pages || []);
      if (data.plan) {
        setPlan(data.plan);
      }
      if (data.isAdmin !== undefined) {
        setIsAdmin(data.isAdmin);
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  // 관리자용 플랜 변경 함수
  const handlePlanChange = async (newPlanId: string) => {
    if (changingPlan) return;

    try {
      setChangingPlan(true);
      const res = await fetch('/api/user/plan', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: newPlanId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.error || '플랜 변경에 실패했습니다.');
        return;
      }

      // 성공 시 대시보드 새로고침
      await fetchDashboardData();
      setShowPlanDropdown(false);
      alert('플랜이 변경되었습니다.');
    } catch (error) {
      console.error('Plan change error:', error);
      alert('플랜 변경 중 오류가 발생했습니다.');
    } finally {
      setChangingPlan(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-[#4E5968]">로딩중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 환영 메시지 + 플랜 정보 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#191F28]">내 대시보드 📊</h1>
          <p className="text-[#4E5968] mt-1">오늘도 새로운 고객을 만나보세요.</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl px-6 py-4">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-sm text-[#4E5968]">
                현재 플랜 {isAdmin && <span className="text-[#0064FF]">(관리자)</span>}
              </p>
              <p className="text-lg font-bold text-[#191F28]">
                {plan.name}
                <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
                  plan.id === 'free' ? 'bg-gray-100 text-gray-600' :
                  plan.id === 'pro' ? 'bg-[#E8F3FF] text-[#0064FF]' :
                  plan.id === 'unlimited' ? 'bg-purple-100 text-purple-600' :
                  'bg-green-100 text-green-600'
                }`}>
                  {plan.pageLimit === -1 ? '무제한' : `${stats.totalPages}/${plan.pageLimit}개`}
                </span>
              </p>
            </div>

            {/* 관리자: 플랜 변경 드롭다운 */}
            {isAdmin ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowPlanDropdown(!showPlanDropdown)}
                  className="text-sm bg-[#0064FF] hover:bg-[#0050CC] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                  disabled={changingPlan}
                >
                  {changingPlan ? '변경 중...' : '플랜 변경'}
                  <span className="text-xs">▼</span>
                </button>

                {showPlanDropdown && (
                  <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 min-w-[160px]">
                    {availablePlans.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handlePlanChange(p.id)}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl transition-colors ${
                          plan.id === p.id ? 'bg-[#E8F3FF] text-[#0064FF] font-medium' : 'text-[#191F28]'
                        }`}
                      >
                        {p.name}
                        <span className="text-xs text-[#4E5968] ml-2">
                          ({p.pages === -1 ? '무제한' : `${p.pages}개`})
                        </span>
                        {plan.id === p.id && <span className="ml-2">✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : plan.id === 'free' ? (
              <Link
                href="/pricing"
                className="text-sm bg-[#0064FF] hover:bg-[#0050CC] text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                업그레이드
              </Link>
            ) : null}
          </div>

          {/* 관리자 바로가기 */}
          {isAdmin && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Link
                href="/admin"
                className="text-sm text-[#0064FF] hover:underline flex items-center gap-2"
              >
                👑 관리자 대시보드로 이동 →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          icon="📄"
          label="내 페이지"
          value={stats.totalPages.toString()}
          suffix="개"
        />
        <StatsCard
          icon="📬"
          label="총 신청"
          value={stats.totalSubmissions.toString()}
          suffix="건"
        />
        <StatsCard
          icon="🔔"
          label="새 신청"
          value={stats.newSubmissions.toString()}
          suffix="건"
          highlight
        />
        <StatsCard
          icon="📈"
          label="전환율"
          value={stats.conversionRate.toFixed(1)}
          suffix="%"
        />
      </div>

      {/* 새 신청 알림 */}
      {stats.newSubmissions > 0 && (
        <div className="bg-[#E8F3FF] border border-[#0064FF]/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🔔</span>
              <div>
                <p className="font-bold text-[#191F28]">
                  새로운 신청이 {stats.newSubmissions}건 있어요!
                </p>
                <p className="text-sm text-[#4E5968]">
                  지금 바로 확인하고 연락해보세요.
                </p>
              </div>
            </div>
            <Link
              href="/pages"
              className="bg-[#0064FF] hover:bg-[#0050CC] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              확인하기
            </Link>
          </div>
        </div>
      )}

      {/* 내 페이지 목록 */}
      {pages.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#191F28]">내 페이지</h2>
            <Link
              href="/pages"
              className="text-sm text-[#0064FF] hover:underline"
            >
              전체 보기 →
            </Link>
          </div>

          <div className="grid gap-4">
            {pages.slice(0, 5).map((page) => (
              <PageCard key={page.id} page={page} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <span className="text-6xl mb-4 block">🚀</span>
          <h3 className="text-xl font-bold text-[#191F28] mb-2">
            첫 랜딩페이지를 만들어보세요!
          </h3>
          <p className="text-[#4E5968] mb-6">
            AI가 프롬프트 하나로 완벽한 마케팅 카피를 만들어드려요.
          </p>
          <Link
            href="/create/free"
            className="inline-block bg-[#0064FF] hover:bg-[#0050CC] text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            + 새 페이지 만들기
          </Link>
        </div>
      )}
    </div>
  );
}

// 통계 카드 컴포넌트
function StatsCard({
  icon,
  label,
  value,
  suffix,
  highlight = false,
}: {
  icon: string;
  label: string;
  value: string;
  suffix: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-5 ${
        highlight
          ? 'bg-[#0064FF] text-white'
          : 'bg-white border border-gray-200'
      }`}
    >
      <span className="text-2xl">{icon}</span>
      <p
        className={`text-sm mt-2 ${
          highlight ? 'text-white/80' : 'text-[#4E5968]'
        }`}
      >
        {label}
      </p>
      <p className="text-2xl font-bold mt-1">
        {value}
        <span className="text-base font-normal ml-1">{suffix}</span>
      </p>
    </div>
  );
}

// 페이지 카드 컴포넌트
function PageCard({ page }: { page: PageStats }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-bold text-[#191F28]">{page.title}</h3>
            {page.status === 'published' ? (
              <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                게시중
              </span>
            ) : (
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                임시저장
              </span>
            )}
            {page.newSubmissionCount > 0 && (
              <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded-full font-medium">
                새 신청 {page.newSubmissionCount}건
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-[#4E5968]">
            <span>👁️ {page.viewCount.toLocaleString()}</span>
            <span>📬 {page.submissionCount}건</span>
            <span>📅 {formatDate(page.createdAt)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {page.status === 'published' && (
            <a
              href={`/p/${page.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 text-sm text-[#4E5968] hover:bg-gray-100 rounded-lg transition-colors"
            >
              미리보기
            </a>
          )}
          <Link
            href={`/pages/${page.id}`}
            className="px-3 py-2 text-sm bg-[#E8F3FF] text-[#0064FF] rounded-lg hover:bg-[#D4E9FF] transition-colors font-medium"
          >
            관리하기
          </Link>
        </div>
      </div>
    </div>
  );
}
