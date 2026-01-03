'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface UserStats {
  id: string;
  email: string;
  name: string | null;
  role: 'user' | 'admin';
  plan: string;
  createdAt: string;
  lastLoginAt: string | null;
  totalPages: number;
  publishedPages: number;
  totalViews: number;
  totalSubmissions: number;
  newSubmissions: number;
  conversionRate: number;
}

const PLANS: Record<string, { name: string; color: string }> = {
  free: { name: '무료', color: 'bg-gray-100 text-gray-600' },
  single: { name: '단건', color: 'bg-blue-100 text-blue-700' },
  starter: { name: '스타터', color: 'bg-green-100 text-green-700' },
  pro: { name: '프로', color: 'bg-[#E8F3FF] text-[#0064FF]' },
  unlimited: { name: '무제한', color: 'bg-purple-100 text-purple-700' },
  agency: { name: '대행사', color: 'bg-yellow-100 text-yellow-700' },
};

interface AdminStats {
  totalUsers: number;
  totalPages: number;
  totalSubmissions: number;
  newSubmissions: number;
  totalViews: number;
  conversionRate: number;
}

export default function AdminUsersPage() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalPages: 0,
    totalSubmissions: 0,
    newSubmissions: 0,
    totalViews: 0,
    conversionRate: 0,
  });
  const [users, setUsers] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'totalPages' | 'totalSubmissions'>('createdAt');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/users');
      if (!res.ok) {
        if (res.status === 403) {
          setError('관리자 권한이 필요합니다.');
        } else {
          setError('데이터를 불러오는데 실패했습니다.');
        }
        return;
      }
      const data = await res.json();
      setStats(data.stats);
      setUsers(data.users);
    } catch (err) {
      setError('서버 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users
    .filter(user =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'totalPages':
          return b.totalPages - a.totalPages;
        case 'totalSubmissions':
          return b.totalSubmissions - a.totalSubmissions;
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

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
          <div className="text-4xl mb-4">🚫</div>
          <p className="text-red-500 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-bold text-[#191F28]">사용자 관리 👥</h1>
        <p className="text-[#4E5968] mt-1">플랫폼 사용자 현황을 확인하고 관리하세요.</p>
      </div>

      {/* 전체 통계 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard icon="👥" label="전체 사용자" value={stats.totalUsers} suffix="명" />
        <StatsCard icon="📄" label="전체 페이지" value={stats.totalPages} suffix="개" />
        <StatsCard icon="📬" label="총 신청" value={stats.totalSubmissions} suffix="건" subValue={`새 ${stats.newSubmissions}건`} />
        <StatsCard icon="📈" label="전환율" value={stats.conversionRate.toFixed(1)} suffix="%" subValue={`조회 ${stats.totalViews.toLocaleString()}회`} />
      </div>

      {/* 검색 및 정렬 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="이메일 또는 이름으로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0064FF]/20 focus:border-[#0064FF]"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'createdAt' | 'totalPages' | 'totalSubmissions')}
          className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0064FF]/20 focus:border-[#0064FF] bg-white"
        >
          <option value="createdAt">가입일순</option>
          <option value="totalPages">페이지 수</option>
          <option value="totalSubmissions">신청 수</option>
        </select>
      </div>

      {/* 사용자 목록 */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-[#191F28]">회원 목록</h2>
          <p className="text-sm text-[#4E5968]">{filteredUsers.length}명의 사용자</p>
        </div>

        {/* 사용자 카드 목록 */}
        {filteredUsers.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {filteredUsers.map((user) => (
              <UserRow key={user.id} user={user} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <span className="text-4xl mb-4 block">👥</span>
            <p className="text-[#4E5968]">
              {searchTerm ? '검색 결과가 없습니다.' : '등록된 사용자가 없습니다.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatsCard({
  icon,
  label,
  value,
  suffix,
  subValue,
}: {
  icon: string;
  label: string;
  value: string | number;
  suffix: string;
  subValue?: string;
}) {
  return (
    <div className="rounded-2xl p-5 bg-white border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-xs mt-3 text-[#4E5968]">{label}</p>
      <p className="text-2xl font-bold mt-1 text-[#191F28]">
        {value}
        {suffix && <span className="text-sm font-normal ml-1">{suffix}</span>}
      </p>
      {subValue && (
        <p className="text-xs mt-1 text-[#0064FF]">{subValue}</p>
      )}
    </div>
  );
}

function UserRow({ user }: { user: UserStats }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const planInfo = PLANS[user.plan] || PLANS.free;

  return (
    <Link
      href={`/admin/users/${user.id}`}
      className="block px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <div className="flex items-center justify-between">
        {/* 사용자 정보 */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#E8F3FF] flex items-center justify-center text-[#0064FF] font-medium">
            {(user.name || user.email)[0].toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium text-[#191F28]">{user.name || '이름 없음'}</p>
              {user.role === 'admin' && (
                <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">
                  관리자
                </span>
              )}
              <span className={`text-xs px-2 py-0.5 rounded-full ${planInfo.color}`}>
                {planInfo.name}
              </span>
            </div>
            <p className="text-sm text-[#4E5968]">{user.email}</p>
          </div>
        </div>

        {/* 통계 */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          <div className="text-center">
            <p className="font-medium text-[#191F28]">{user.totalPages}</p>
            <p className="text-xs text-[#4E5968]">페이지</p>
          </div>
          <div className="text-center">
            <p className="font-medium text-[#191F28]">{user.totalSubmissions}</p>
            <p className="text-xs text-[#4E5968]">신청</p>
          </div>
          <div className="text-center">
            <p className="font-medium text-[#191F28]">{user.totalViews.toLocaleString()}</p>
            <p className="text-xs text-[#4E5968]">조회</p>
          </div>
          <div className="text-center min-w-[80px]">
            <p className="text-sm text-[#4E5968]">{formatDate(user.createdAt)}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
