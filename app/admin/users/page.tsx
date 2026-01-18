'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: 'user' | 'admin';
  pageCount: number;
  createdAt: string;
}

interface UserStats {
  totalUsers: number;
  adminCount: number;
  userCount: number;
}

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    adminCount: 0,
    userCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'admin'>('all');
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (roleFilter !== 'all') params.set('role', roleFilter);

      const res = await fetch(`/api/admin/users?${params.toString()}`);
      if (!res.ok) {
        if (res.status === 403) {
          throw new Error('관리자 권한이 필요합니다.');
        }
        throw new Error('데이터를 불러오는데 실패했습니다.');
      }
      const data = await res.json();
      setUsers(data.users || []);
      setStats(data.stats || { totalUsers: 0, adminCount: 0, userCount: 0 });
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleRoleChange = async (userId: string, newRole: 'user' | 'admin') => {
    if (!confirm(`이 사용자의 권한을 ${newRole === 'admin' ? '관리자' : '일반 회원'}로 변경하시겠습니까?`)) {
      return;
    }

    setUpdatingUserId(userId);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '권한 변경에 실패했습니다.');
      }

      // 성공 시 목록 새로고침
      fetchUsers();
      alert('권한이 변경되었습니다.');
    } catch (err) {
      alert(err instanceof Error ? err.message : '권한 변경에 실패했습니다.');
    } finally {
      setUpdatingUserId(null);
    }
  };

  if (loading && users.length === 0) {
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
        <h1 className="text-2xl font-bold text-[#191F28]">회원 관리</h1>
        <p className="text-[#4E5968] mt-1">
          총 {stats.totalUsers}명의 회원이 있어요. (관리자 {stats.adminCount}명, 일반회원 {stats.userCount}명)
        </p>
      </div>

      {/* 검색 및 필터 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="이름 또는 이메일로 검색..."
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0064FF]/20 focus:border-[#0064FF]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#0064FF] text-white rounded-lg hover:bg-[#0050CC] transition-colors"
          >
            검색
          </button>
        </form>

        <div className="flex gap-2">
          {(['all', 'user', 'admin'] as const).map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                roleFilter === role
                  ? 'bg-[#0064FF] text-white'
                  : 'bg-gray-100 text-[#4E5968] hover:bg-gray-200'
              }`}
            >
              {role === 'all' ? '전체' : role === 'admin' ? '관리자' : '일반회원'}
            </button>
          ))}
        </div>
      </div>

      {/* 회원 목록 */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        {/* 테이블 헤더 */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 text-sm font-medium text-[#4E5968]">
          <div className="col-span-3">회원 정보</div>
          <div className="col-span-3">이메일</div>
          <div className="col-span-2">권한</div>
          <div className="col-span-2">페이지 수</div>
          <div className="col-span-2">가입일</div>
        </div>

        {/* 테이블 바디 */}
        {users.length > 0 ? (
          users.map((user) => (
            <div
              key={user.id}
              className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 items-center"
            >
              <div className="col-span-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg">👤</span>
                  )}
                </div>
                <div>
                  <p className="font-medium text-[#191F28]">{user.name}</p>
                </div>
              </div>
              <div className="col-span-3 text-[#4E5968] truncate">
                {user.email}
              </div>
              <div className="col-span-2">
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value as 'user' | 'admin')}
                  disabled={updatingUserId === user.id}
                  className={`text-sm px-3 py-1 rounded-full border-0 cursor-pointer ${
                    user.role === 'admin'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-gray-100 text-[#4E5968]'
                  } ${updatingUserId === user.id ? 'opacity-50' : ''}`}
                >
                  <option value="user">일반회원</option>
                  <option value="admin">관리자</option>
                </select>
              </div>
              <div className="col-span-2 text-[#4E5968]">
                {user.pageCount}개
              </div>
              <div className="col-span-2 text-sm text-[#4E5968]">
                {new Date(user.createdAt).toLocaleDateString('ko-KR')}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16">
            <span className="text-4xl mb-4 block">👥</span>
            <p className="text-[#4E5968]">
              {search ? '검색 결과가 없어요' : '아직 회원이 없어요'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
