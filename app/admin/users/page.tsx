'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface UserStats {
  id: string;
  email: string;
  name: string | null;
  role: 'user' | 'admin';
  createdAt: string;
  lastLoginAt: string | null;
  totalPages: number;
  publishedPages: number;
  totalViews: number;
  totalSubmissions: number;
  newSubmissions: number;
  conversionRate: number;
}

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
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <StatsCard icon="👥" label="전체 사용자" value={stats.totalUsers} suffix="명" />
        <StatsCard icon="📄" label="전체 페이지" value={stats.totalPages} suffix="개" />
        <StatsCard icon="👁️" label="총 조회수" value={stats.totalViews.toLocaleString()} suffix="" />
        <StatsCard icon="📬" label="총 신청" value={stats.totalSubmissions} suffix="건" />
        <StatsCard icon="🔔" label="새 신청" value={stats.newSubmissions} suffix="건" highlight />
        <StatsCard icon="📈" label="평균 전환율" value={stats.conversionRate.toFixed(1)} suffix="%" />
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

      {/* 사용자 목록 테이블 */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        {/* 테이블 헤더 */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 text-sm font-medium text-[#4E5968]">
          <div className="col-span-3">사용자</div>
          <div className="col-span-1 text-center">역할</div>
          <div className="col-span-2 text-center">페이지</div>
          <div className="col-span-2 text-center">신청</div>
          <div className="col-span-2 text-center">조회수</div>
          <div className="col-span-2 text-center">가입일</div>
        </div>

        {/* 사용자 목록 */}
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <UserRow key={user.id} user={user} />
          ))
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
  highlight = false,
}: {
  icon: string;
  label: string;
  value: string | number;
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
      <p className={`text-xs mt-2 ${highlight ? 'text-white/80' : 'text-[#4E5968]'}`}>
        {label}
      </p>
      <p className="text-xl font-bold mt-1">
        {value}
        {suffix && <span className="text-sm font-normal ml-1">{suffix}</span>}
      </p>
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

  return (
    <Link
      href={`/admin/users/${user.id}`}
      className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer items-center"
    >
      {/* 사용자 정보 */}
      <div className="col-span-3">
        <p className="font-medium text-[#191F28]">{user.name || '이름 없음'}</p>
        <p className="text-sm text-[#4E5968]">{user.email}</p>
      </div>

      {/* 역할 */}
      <div className="col-span-1 text-center">
        {user.role === 'admin' ? (
          <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
            관리자
          </span>
        ) : (
          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
            일반
          </span>
        )}
      </div>

      {/* 페이지 수 */}
      <div className="col-span-2 text-center">
        <p className="font-medium text-[#191F28]">{user.totalPages}개</p>
        <p className="text-xs text-[#4E5968]">게시 {user.publishedPages}개</p>
      </div>

      {/* 신청 수 */}
      <div className="col-span-2 text-center">
        <p className="font-medium text-[#191F28]">{user.totalSubmissions}건</p>
        {user.newSubmissions > 0 && (
          <p className="text-xs text-red-500">새 신청 {user.newSubmissions}건</p>
        )}
      </div>

      {/* 조회수 */}
      <div className="col-span-2 text-center">
        <p className="font-medium text-[#191F28]">{user.totalViews.toLocaleString()}</p>
        <p className="text-xs text-[#4E5968]">전환율 {user.conversionRate}%</p>
      </div>

      {/* 가입일 */}
      <div className="col-span-2 text-center text-sm text-[#4E5968]">
        {formatDate(user.createdAt)}
      </div>
    </Link>
  );
}
