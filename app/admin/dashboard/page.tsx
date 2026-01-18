'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface PageStats {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published';
  viewCount: number;
  submissionCount: number;
  newSubmissionCount: number;
  createdAt: string;
  userName?: string;
}

interface DashboardStats {
  totalPages: number;
  totalSubmissions: number;
  newSubmissions: number;
  conversionRate: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPages: 0,
    totalSubmissions: 0,
    newSubmissions: 0,
    conversionRate: 0,
  });
  const [pages, setPages] = useState<PageStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true);
        const res = await fetch('/api/dashboard');
        if (!res.ok) {
          throw new Error('데이터를 불러오는데 실패했습니다.');
        }
        const data = await res.json();
        setStats(data.stats);
        setPages(data.pages || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

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

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 환영 메시지 */}
      <div>
        <h1 className="text-2xl font-bold text-[#191F28]">안녕하세요! 👋</h1>
        <p className="text-[#4E5968] mt-1">오늘도 새로운 고객을 만나보세요.</p>
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
              href="/admin/pages"
              className="bg-[#0064FF] hover:bg-[#0050CC] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              확인하기
            </Link>
          </div>
        </div>
      )}

      {/* 내 페이지 목록 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#191F28]">내 페이지</h2>
          <Link
            href="/admin/pages"
            className="text-sm text-[#0064FF] hover:underline"
          >
            전체 보기 →
          </Link>
        </div>

        <div className="grid gap-4">
          {pages.map((page) => (
            <PageCard key={page.id} page={page} />
          ))}
        </div>
      </div>

      {/* 빈 상태 - 페이지가 없을 때 */}
      {pages.length === 0 && (
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
            <span>📅 {page.createdAt}</span>
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
            href={`/admin/pages/${page.id}`}
            className="px-3 py-2 text-sm bg-[#E8F3FF] text-[#0064FF] rounded-lg hover:bg-[#D4E9FF] transition-colors font-medium"
          >
            관리하기
          </Link>
        </div>
      </div>
    </div>
  );
}
