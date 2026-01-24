'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';

interface UserDetail {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: string;
  plan: string;
  planExpiresAt?: string;
  createdAt: string;
}

interface LandingPage {
  id: string;
  title: string;
  slug: string;
  status: string;
  viewCount: number;
  submissionCount: number;
  createdAt: string;
  updatedAt: string;
}

interface Stats {
  totalPages: number;
  totalViews: number;
  totalSubmissions: number;
}

const PLAN_LABELS: Record<string, string> = {
  free: '무료',
  starter: 'Starter',
  pro: 'Pro',
  unlimited: 'Unlimited',
  agency: 'Agency',
};

const STATUS_LABELS: Record<string, { name: string; color: string; bg: string }> = {
  draft: { name: '임시저장', color: 'text-gray-600', bg: 'bg-gray-100' },
  published: { name: '게시중', color: 'text-green-600', bg: 'bg-green-100' },
  archived: { name: '보관됨', color: 'text-orange-600', bg: 'bg-orange-100' },
};

export default function UserDetailPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = use(params);
  const [user, setUser] = useState<UserDetail | null>(null);
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [stats, setStats] = useState<Stats>({ totalPages: 0, totalViews: 0, totalSubmissions: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/users/${userId}`);
        if (!res.ok) {
          if (res.status === 403) throw new Error('관리자 권한이 필요합니다.');
          if (res.status === 404) throw new Error('회원을 찾을 수 없습니다.');
          throw new Error('데이터를 불러오는데 실패했습니다.');
        }
        const data = await res.json();
        setUser(data.user);
        setPages(data.pages || []);
        setStats(data.stats || { totalPages: 0, totalViews: 0, totalSubmissions: 0 });
      } catch (err) {
        setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetail();
  }, [userId]);

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

  if (error || !user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-red-500">{error || '회원을 찾을 수 없습니다.'}</p>
          <Link href="/admin/users" className="mt-4 inline-block text-[#0064FF] hover:underline">
            ← 회원 목록으로
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 뒤로가기 */}
      <Link href="/admin/users" className="inline-flex items-center text-[#4E5968] hover:text-[#0064FF]">
        ← 회원 목록으로
      </Link>

      {/* 회원 정보 카드 */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl">👤</span>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[#191F28]">{user.name}</h1>
            <p className="text-[#4E5968]">{user.email}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className={`text-sm px-3 py-1 rounded-full ${
                user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-[#4E5968]'
              }`}>
                {user.role === 'admin' ? '관리자' : '일반회원'}
              </span>
              <span className="text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                {PLAN_LABELS[user.plan] || user.plan}
              </span>
            </div>
            <p className="text-sm text-[#8B95A1] mt-2">
              가입일: {new Date(user.createdAt).toLocaleDateString('ko-KR')}
            </p>
          </div>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-sm text-[#4E5968]">총 랜딩페이지</p>
          <p className="text-2xl font-bold text-[#191F28]">{stats.totalPages}개</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-sm text-[#4E5968]">총 조회수</p>
          <p className="text-2xl font-bold text-[#191F28]">{stats.totalViews.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-sm text-[#4E5968]">총 신청수</p>
          <p className="text-2xl font-bold text-[#0064FF]">{stats.totalSubmissions}건</p>
        </div>
      </div>

      {/* 랜딩페이지 목록 */}
      <div>
        <h2 className="text-lg font-bold text-[#191F28] mb-4">랜딩페이지 목록</h2>

        {pages.length > 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            {/* 테이블 헤더 */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 text-sm font-medium text-[#4E5968]">
              <div className="col-span-4">페이지 제목</div>
              <div className="col-span-2">상태</div>
              <div className="col-span-2">조회수</div>
              <div className="col-span-2">신청수</div>
              <div className="col-span-2">생성일</div>
            </div>

            {/* 테이블 바디 */}
            {pages.map((page) => (
              <Link
                key={page.id}
                href={`/admin/users/${userId}/pages/${page.id}`}
                className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 hover:bg-blue-50 items-center cursor-pointer transition-colors"
              >
                <div className="col-span-4">
                  <p className="font-medium text-[#191F28] truncate">{page.title}</p>
                  <p className="text-xs text-[#8B95A1]">/{page.slug}</p>
                </div>
                <div className="col-span-2">
                  <span className={`text-sm px-3 py-1 rounded-full ${
                    STATUS_LABELS[page.status]?.bg || 'bg-gray-100'
                  } ${STATUS_LABELS[page.status]?.color || 'text-gray-600'}`}>
                    {STATUS_LABELS[page.status]?.name || page.status}
                  </span>
                </div>
                <div className="col-span-2 text-[#4E5968]">
                  {page.viewCount.toLocaleString()}
                </div>
                <div className="col-span-2 text-[#0064FF] font-medium">
                  {page.submissionCount}건
                </div>
                <div className="col-span-2 text-sm text-[#4E5968]">
                  {new Date(page.createdAt).toLocaleDateString('ko-KR')}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center">
            <span className="text-4xl mb-4 block">📄</span>
            <p className="text-[#4E5968]">생성된 랜딩페이지가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
