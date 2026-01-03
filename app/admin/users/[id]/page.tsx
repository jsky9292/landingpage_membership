'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface UserDetail {
  id: string;
  email: string;
  name: string | null;
  role: 'user' | 'admin';
  plan: string;
  planExpiresAt: string | null;
  createdAt: string;
  lastLoginAt: string | null;
}

const PLANS = [
  { id: 'free', name: '무료', color: 'bg-gray-100 text-gray-600' },
  { id: 'starter', name: '스타터', color: 'bg-green-100 text-green-700' },
  { id: 'pro', name: '프로', color: 'bg-[#E8F3FF] text-[#0064FF]' },
  { id: 'unlimited', name: '무제한', color: 'bg-purple-100 text-purple-700' },
  { id: 'agency', name: '대행사', color: 'bg-yellow-100 text-yellow-700' },
] as const;

interface PageStats {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published';
  viewCount: number;
  createdAt: string;
  submissionCount: number;
  newSubmissionCount: number;
}

interface UserStats {
  totalPages: number;
  publishedPages: number;
  totalViews: number;
  totalSubmissions: number;
  newSubmissions: number;
  conversionRate: number;
}

export default function AdminUserDetailPage() {
  const params = useParams();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [pages, setPages] = useState<PageStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingRole, setUpdatingRole] = useState(false);
  const [updatingPlan, setUpdatingPlan] = useState(false);
  const [updatingExpiry, setUpdatingExpiry] = useState(false);
  const [expiryDate, setExpiryDate] = useState<string>('');

  useEffect(() => {
    fetchUserDetail();
  }, [params.id]);

  const fetchUserDetail = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/users/${params.id}`);
      if (!res.ok) {
        if (res.status === 403) {
          setError('관리자 권한이 필요합니다.');
        } else if (res.status === 404) {
          setError('사용자를 찾을 수 없습니다.');
        } else {
          setError('데이터를 불러오는데 실패했습니다.');
        }
        return;
      }
      const data = await res.json();
      setUser(data.user);
      setStats(data.stats);
      setPages(data.pages);
      // 만료일 설정
      if (data.user.planExpiresAt) {
        setExpiryDate(data.user.planExpiresAt.split('T')[0]);
      }
    } catch (err) {
      setError('서버 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (newRole: 'user' | 'admin') => {
    if (!user || user.role === newRole) return;

    const confirmed = confirm(
      newRole === 'admin'
        ? '이 사용자에게 관리자 권한을 부여하시겠습니까?'
        : '이 사용자의 관리자 권한을 제거하시겠습니까?'
    );

    if (!confirmed) return;

    try {
      setUpdatingRole(true);
      const res = await fetch(`/api/admin/users/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) {
        alert('역할 변경에 실패했습니다.');
        return;
      }

      setUser({ ...user, role: newRole });
    } catch (err) {
      console.error(err);
      alert('서버 오류가 발생했습니다.');
    } finally {
      setUpdatingRole(false);
    }
  };

  const handlePlanChange = async (newPlan: string) => {
    if (!user || user.plan === newPlan) return;

    const planName = PLANS.find(p => p.id === newPlan)?.name || newPlan;
    const confirmed = confirm(`이 사용자의 플랜을 "${planName}"(으)로 변경하시겠습니까?`);

    if (!confirmed) return;

    try {
      setUpdatingPlan(true);
      const res = await fetch(`/api/admin/users/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: newPlan }),
      });

      if (!res.ok) {
        alert('플랜 변경에 실패했습니다.');
        return;
      }

      setUser({ ...user, plan: newPlan });
      alert(`플랜이 "${planName}"(으)로 변경되었습니다.`);
    } catch (err) {
      console.error(err);
      alert('서버 오류가 발생했습니다.');
    } finally {
      setUpdatingPlan(false);
    }
  };

  // 플랜 만료일 변경
  const handleExpiryChange = async () => {
    if (!user) return;

    try {
      setUpdatingExpiry(true);
      const res = await fetch(`/api/admin/users/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planExpiresAt: expiryDate ? new Date(expiryDate).toISOString() : null
        }),
      });

      if (!res.ok) {
        alert('만료일 변경에 실패했습니다.');
        return;
      }

      setUser({ ...user, planExpiresAt: expiryDate ? new Date(expiryDate).toISOString() : null });
      alert(expiryDate ? `만료일이 ${expiryDate}로 설정되었습니다.` : '만료일이 해제되었습니다.');
    } catch (err) {
      console.error(err);
      alert('서버 오류가 발생했습니다.');
    } finally {
      setUpdatingExpiry(false);
    }
  };

  // 빠른 만료일 설정 (1개월, 3개월, 6개월, 1년)
  const setQuickExpiry = (months: number) => {
    const date = new Date();
    date.setMonth(date.getMonth() + months);
    setExpiryDate(date.toISOString().split('T')[0]);
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

  if (error || !user || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-4xl mb-4">🚫</div>
          <p className="text-red-500 font-medium">{error}</p>
          <Link
            href="/admin/users"
            className="mt-4 inline-block text-[#0064FF] hover:underline"
          >
            ← 사용자 목록으로
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 뒤로가기 + 헤더 */}
      <div>
        <Link
          href="/admin/users"
          className="text-sm text-[#4E5968] hover:text-[#0064FF] mb-2 inline-block"
        >
          ← 사용자 목록으로
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-[#191F28]">
                {user.name || '이름 없음'}
              </h1>
              {user.role === 'admin' ? (
                <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                  관리자
                </span>
              ) : (
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                  일반 사용자
                </span>
              )}
              <span className={`text-xs px-2 py-1 rounded-full ${
                PLANS.find(p => p.id === user.plan)?.color || 'bg-gray-100 text-gray-600'
              }`}>
                {PLANS.find(p => p.id === user.plan)?.name || '무료'}
              </span>
            </div>
            <p className="text-[#4E5968] mt-1">{user.email}</p>
            <p className="text-sm text-[#8B95A1] mt-1">
              가입일: {formatDate(user.createdAt)}
              {user.lastLoginAt && ` | 마지막 로그인: ${formatDate(user.lastLoginAt)}`}
            </p>
          </div>

          {/* 역할 변경 버튼 */}
          <div className="flex gap-2">
            <button
              onClick={() => handleRoleChange(user.role === 'admin' ? 'user' : 'admin')}
              disabled={updatingRole}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                user.role === 'admin'
                  ? 'bg-gray-100 text-[#4E5968] hover:bg-gray-200'
                  : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
              } disabled:opacity-50`}
            >
              {updatingRole
                ? '처리중...'
                : user.role === 'admin'
                ? '관리자 해제'
                : '관리자 지정'}
            </button>
          </div>
        </div>
      </div>

      {/* 플랜 변경 섹션 */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-[#191F28] mb-4">플랜 관리</h2>

        {/* 플랜 선택 */}
        <div className="mb-6">
          <p className="text-sm text-[#4E5968] mb-3">플랜 선택</p>
          <div className="flex flex-wrap gap-2">
            {PLANS.map((plan) => (
              <button
                key={plan.id}
                onClick={() => handlePlanChange(plan.id)}
                disabled={updatingPlan || user.plan === plan.id}
                className={`px-4 py-2 text-sm rounded-lg transition-all ${
                  user.plan === plan.id
                    ? `${plan.color} ring-2 ring-offset-2 ring-[#0064FF]`
                    : 'bg-gray-100 text-[#4E5968] hover:bg-gray-200'
                } disabled:opacity-50`}
              >
                {plan.name}
                {user.plan === plan.id && ' ✓'}
              </button>
            ))}
          </div>
        </div>

        {/* 만료일 설정 */}
        <div className="border-t border-gray-100 pt-6">
          <p className="text-sm text-[#4E5968] mb-3">플랜 만료일</p>

          {/* 현재 만료일 표시 */}
          {user.planExpiresAt && (
            <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⏰ 현재 만료일: <strong>{formatDate(user.planExpiresAt)}</strong>
                {new Date(user.planExpiresAt) < new Date() && (
                  <span className="text-red-600 ml-2">(만료됨)</span>
                )}
              </p>
            </div>
          )}

          {/* 빠른 설정 버튼 */}
          <div className="flex flex-wrap gap-2 mb-3">
            <button
              onClick={() => setQuickExpiry(1)}
              className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              +1개월
            </button>
            <button
              onClick={() => setQuickExpiry(3)}
              className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              +3개월
            </button>
            <button
              onClick={() => setQuickExpiry(6)}
              className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              +6개월
            </button>
            <button
              onClick={() => setQuickExpiry(12)}
              className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              +1년
            </button>
            <button
              onClick={() => setExpiryDate('')}
              className="px-3 py-1.5 text-xs bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
            >
              만료일 해제
            </button>
          </div>

          {/* 날짜 직접 선택 */}
          <div className="flex gap-2">
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0064FF]"
            />
            <button
              onClick={handleExpiryChange}
              disabled={updatingExpiry}
              className="px-4 py-2 bg-[#0064FF] hover:bg-[#0050CC] text-white text-sm rounded-lg transition-colors disabled:opacity-50"
            >
              {updatingExpiry ? '저장중...' : '저장'}
            </button>
          </div>
        </div>

        <p className="text-xs text-[#8B95A1] mt-4">
          * 플랜/만료일을 변경하면 해당 사용자의 기능 제한이 즉시 적용됩니다.
        </p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatsCard icon="📄" label="전체 페이지" value={stats.totalPages} suffix="개" />
        <StatsCard icon="✅" label="게시중" value={stats.publishedPages} suffix="개" />
        <StatsCard icon="👁️" label="총 조회수" value={stats.totalViews.toLocaleString()} suffix="" />
        <StatsCard icon="📬" label="총 신청" value={stats.totalSubmissions} suffix="건" />
        <StatsCard icon="📈" label="전환율" value={stats.conversionRate.toFixed(1)} suffix="%" />
      </div>

      {/* 페이지 목록 */}
      <div>
        <h2 className="text-lg font-bold text-[#191F28] mb-4">랜딩페이지 목록</h2>

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          {/* 테이블 헤더 */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 text-sm font-medium text-[#4E5968]">
            <div className="col-span-4">페이지</div>
            <div className="col-span-2 text-center">상태</div>
            <div className="col-span-2 text-center">조회수</div>
            <div className="col-span-2 text-center">신청</div>
            <div className="col-span-2 text-center">생성일</div>
          </div>

          {/* 페이지 목록 */}
          {pages.length > 0 ? (
            pages.map((page) => (
              <div
                key={page.id}
                className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 items-center"
              >
                {/* 페이지 제목 */}
                <div className="col-span-4">
                  <p className="font-medium text-[#191F28]">{page.title}</p>
                  {page.status === 'published' && (
                    <a
                      href={`/p/${page.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#0064FF] hover:underline"
                    >
                      /p/{page.slug}
                    </a>
                  )}
                </div>

                {/* 상태 */}
                <div className="col-span-2 text-center">
                  {page.status === 'published' ? (
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                      게시중
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                      임시저장
                    </span>
                  )}
                </div>

                {/* 조회수 */}
                <div className="col-span-2 text-center font-medium text-[#191F28]">
                  {page.viewCount.toLocaleString()}
                </div>

                {/* 신청 수 */}
                <div className="col-span-2 text-center">
                  <p className="font-medium text-[#191F28]">{page.submissionCount}건</p>
                  {page.newSubmissionCount > 0 && (
                    <p className="text-xs text-red-500">새 {page.newSubmissionCount}건</p>
                  )}
                </div>

                {/* 생성일 */}
                <div className="col-span-2 text-center text-sm text-[#4E5968]">
                  {formatDate(page.createdAt).split(' ')[0]}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <span className="text-4xl mb-4 block">📄</span>
              <p className="text-[#4E5968]">생성된 페이지가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatsCard({
  icon,
  label,
  value,
  suffix,
}: {
  icon: string;
  label: string;
  value: string | number;
  suffix: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4">
      <span className="text-xl">{icon}</span>
      <p className="text-xs mt-2 text-[#4E5968]">{label}</p>
      <p className="text-xl font-bold mt-1">
        {value}
        {suffix && <span className="text-sm font-normal ml-1">{suffix}</span>}
      </p>
    </div>
  );
}
