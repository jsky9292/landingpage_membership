'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface UserDetail {
  id: string;
  email: string;
  name: string | null;
  role: 'user' | 'admin';
  createdAt: string;
  lastLoginAt: string | null;
}

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
