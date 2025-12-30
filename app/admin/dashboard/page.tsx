'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface UserStats {
  id: string;
  email: string;
  name: string | null;
  totalPages: number;
  publishedPages: number;
  totalSubmissions: number;
  newSubmissions: number;
  createdAt: string;
}

interface AdminStats {
  totalUsers: number;
  totalPages: number;
  totalSubmissions: number;
  newSubmissions: number;
  totalViews: number;
  conversionRate: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalPages: 0,
    totalSubmissions: 0,
    newSubmissions: 0,
    totalViews: 0,
    conversionRate: 0,
  });
  const [recentUsers, setRecentUsers] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/users');

      if (res.status === 403) {
        setIsAdmin(false);
        return;
      }

      if (!res.ok) {
        console.error('Failed to fetch admin data');
        return;
      }

      const data = await res.json();
      setIsAdmin(true);
      setStats(data.stats);
      setRecentUsers(data.users.slice(0, 5)); // 최근 5명만
    } catch (error) {
      console.error('Dashboard fetch error:', error);
    } finally {
      setLoading(false);
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

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-6xl mb-4">🔐</div>
          <h3 className="text-xl font-bold text-[#191F28] mb-2">
            관리자 권한이 필요합니다
          </h3>
          <p className="text-[#4E5968] mb-6">
            이 페이지는 관리자만 접근할 수 있습니다.
          </p>
          <Link
            href="/dashboard"
            className="inline-block bg-[#0064FF] hover:bg-[#0050CC] text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            내 대시보드로 이동
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 환영 메시지 */}
      <div>
        <h1 className="text-2xl font-bold text-[#191F28]">관리자 대시보드 🛠️</h1>
        <p className="text-[#4E5968] mt-1">플랫폼 전체 현황을 한눈에 확인하세요.</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <StatsCard
          icon="👥"
          label="전체 사용자"
          value={stats.totalUsers.toString()}
          suffix="명"
        />
        <StatsCard
          icon="📄"
          label="전체 페이지"
          value={stats.totalPages.toString()}
          suffix="개"
        />
        <StatsCard
          icon="👁️"
          label="총 조회수"
          value={stats.totalViews.toLocaleString()}
          suffix=""
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
          label="평균 전환율"
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
                  전체 플랫폼에서 처리되지 않은 신청입니다.
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

      {/* 빠른 액션 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickActionCard
          icon="👥"
          title="사용자 관리"
          description="전체 사용자 목록 보기"
          href="/admin/users"
        />
        <QuickActionCard
          icon="📄"
          title="페이지 관리"
          description="전체 페이지 목록 보기"
          href="/admin/pages"
        />
        <QuickActionCard
          icon="➕"
          title="새 페이지 만들기"
          description="랜딩페이지 생성"
          href="/create/free"
        />
        <QuickActionCard
          icon="⚙️"
          title="설정"
          description="플랫폼 설정 관리"
          href="/admin/settings"
        />
      </div>

      {/* 최근 가입 사용자 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#191F28]">최근 가입 사용자</h2>
          <Link
            href="/admin/users"
            className="text-sm text-[#0064FF] hover:underline"
          >
            전체 보기 →
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          {recentUsers.length > 0 ? (
            recentUsers.map((user) => (
              <UserRow key={user.id} user={user} />
            ))
          ) : (
            <div className="text-center py-16">
              <span className="text-4xl mb-4 block">👥</span>
              <p className="text-[#4E5968]">등록된 사용자가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
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
      className={`rounded-2xl p-4 ${
        highlight
          ? 'bg-[#0064FF] text-white'
          : 'bg-white border border-gray-200'
      }`}
    >
      <span className="text-xl">{icon}</span>
      <p
        className={`text-xs mt-2 ${
          highlight ? 'text-white/80' : 'text-[#4E5968]'
        }`}
      >
        {label}
      </p>
      <p className="text-xl font-bold mt-1">
        {value}
        <span className="text-sm font-normal ml-1">{suffix}</span>
      </p>
    </div>
  );
}

// 빠른 액션 카드 컴포넌트
function QuickActionCard({
  icon,
  title,
  description,
  href,
}: {
  icon: string;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md hover:border-[#0064FF]/30 transition-all"
    >
      <span className="text-3xl">{icon}</span>
      <h3 className="font-bold text-[#191F28] mt-3">{title}</h3>
      <p className="text-sm text-[#4E5968] mt-1">{description}</p>
    </Link>
  );
}

// 사용자 행 컴포넌트
function UserRow({ user }: { user: UserStats }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <Link
      href={`/admin/users/${user.id}`}
      className="flex items-center justify-between px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-[#E8F3FF] rounded-full flex items-center justify-center text-lg">
          👤
        </div>
        <div>
          <p className="font-medium text-[#191F28]">{user.name || '이름 없음'}</p>
          <p className="text-sm text-[#4E5968]">{user.email}</p>
        </div>
      </div>
      <div className="flex items-center gap-6 text-sm">
        <div className="text-center">
          <p className="font-medium text-[#191F28]">{user.totalPages}</p>
          <p className="text-xs text-[#4E5968]">페이지</p>
        </div>
        <div className="text-center">
          <p className="font-medium text-[#191F28]">{user.totalSubmissions}</p>
          <p className="text-xs text-[#4E5968]">신청</p>
        </div>
        <div className="text-[#4E5968]">
          {formatDate(user.createdAt)}
        </div>
      </div>
    </Link>
  );
}
