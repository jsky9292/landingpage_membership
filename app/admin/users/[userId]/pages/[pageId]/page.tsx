'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';

interface UserInfo {
  id: string;
  email: string;
  name: string;
}

interface PageInfo {
  id: string;
  title: string;
  slug: string;
  status: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

interface Submission {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  data?: Record<string, any>;
  status: string;
  createdAt: string;
}

interface Stats {
  totalSubmissions: number;
  newCount: number;
  viewCount: number;
}

const STATUS_LABELS: Record<string, { name: string; color: string; bg: string }> = {
  new: { name: '신규', color: 'text-blue-600', bg: 'bg-blue-100' },
  contacted: { name: '연락완료', color: 'text-green-600', bg: 'bg-green-100' },
  converted: { name: '전환', color: 'text-purple-600', bg: 'bg-purple-100' },
  rejected: { name: '거절', color: 'text-red-600', bg: 'bg-red-100' },
};

export default function PageSubmissionsPage({
  params
}: {
  params: Promise<{ userId: string; pageId: string }>
}) {
  const { userId, pageId } = use(params);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [page, setPage] = useState<PageInfo | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [stats, setStats] = useState<Stats>({ totalSubmissions: 0, newCount: 0, viewCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    const fetchPageDetail = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/users/${userId}/pages/${pageId}`);
        if (!res.ok) {
          if (res.status === 403) throw new Error('관리자 권한이 필요합니다.');
          if (res.status === 404) throw new Error('페이지를 찾을 수 없습니다.');
          throw new Error('데이터를 불러오는데 실패했습니다.');
        }
        const data = await res.json();
        setUser(data.user);
        setPage(data.page);
        setSubmissions(data.submissions || []);
        setStats(data.stats || { totalSubmissions: 0, newCount: 0, viewCount: 0 });
      } catch (err) {
        setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPageDetail();
  }, [userId, pageId]);

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

  if (error || !page) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-red-500">{error || '페이지를 찾을 수 없습니다.'}</p>
          <Link href={`/admin/users/${userId}`} className="mt-4 inline-block text-[#0064FF] hover:underline">
            ← 회원 상세로
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 뒤로가기 */}
      <div className="flex items-center gap-2 text-sm text-[#4E5968]">
        <Link href="/admin/users" className="hover:text-[#0064FF]">회원 목록</Link>
        <span>→</span>
        <Link href={`/admin/users/${userId}`} className="hover:text-[#0064FF]">{user?.name}</Link>
        <span>→</span>
        <span className="text-[#191F28]">{page.title}</span>
      </div>

      {/* 페이지 정보 카드 */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#191F28]">{page.title}</h1>
            <p className="text-[#4E5968] mt-1">/{page.slug}</p>
            <p className="text-sm text-[#8B95A1] mt-2">
              회원: {user?.name} ({user?.email})
            </p>
          </div>
          <a
            href={`/p/${page.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#0064FF] text-white rounded-lg hover:bg-[#0050CC] transition-colors"
          >
            페이지 보기 →
          </a>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-sm text-[#4E5968]">총 조회수</p>
          <p className="text-2xl font-bold text-[#191F28]">{stats.viewCount.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-sm text-[#4E5968]">총 신청</p>
          <p className="text-2xl font-bold text-[#0064FF]">{stats.totalSubmissions}건</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-sm text-[#4E5968]">신규 신청</p>
          <p className="text-2xl font-bold text-blue-600">{stats.newCount}건</p>
        </div>
      </div>

      {/* 신청 목록 */}
      <div>
        <h2 className="text-lg font-bold text-[#191F28] mb-4">신청 목록 ({submissions.length}건)</h2>

        {submissions.length > 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            {/* 테이블 헤더 */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 text-sm font-medium text-[#4E5968]">
              <div className="col-span-2">이름</div>
              <div className="col-span-3">연락처</div>
              <div className="col-span-3">이메일</div>
              <div className="col-span-2">상태</div>
              <div className="col-span-2">신청일</div>
            </div>

            {/* 테이블 바디 */}
            {submissions.map((submission) => (
              <div
                key={submission.id}
                onClick={() => setSelectedSubmission(submission)}
                className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 hover:bg-blue-50 items-center cursor-pointer transition-colors"
              >
                <div className="col-span-2 font-medium text-[#191F28]">
                  {submission.name}
                </div>
                <div className="col-span-3 text-[#4E5968]">
                  {submission.phone || '-'}
                </div>
                <div className="col-span-3 text-[#4E5968] truncate">
                  {submission.email || '-'}
                </div>
                <div className="col-span-2">
                  <span className={`text-sm px-3 py-1 rounded-full ${
                    STATUS_LABELS[submission.status]?.bg || 'bg-blue-100'
                  } ${STATUS_LABELS[submission.status]?.color || 'text-blue-600'}`}>
                    {STATUS_LABELS[submission.status]?.name || '신규'}
                  </span>
                </div>
                <div className="col-span-2 text-sm text-[#4E5968]">
                  {new Date(submission.createdAt).toLocaleDateString('ko-KR')}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center">
            <span className="text-4xl mb-4 block">📋</span>
            <p className="text-[#4E5968]">아직 신청이 없습니다.</p>
          </div>
        )}
      </div>

      {/* 신청 상세 모달 */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#191F28]">신청 상세</h3>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="text-[#4E5968] hover:text-[#191F28]"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-[#4E5968]">이름</p>
                  <p className="font-medium text-[#191F28]">{selectedSubmission.name}</p>
                </div>
                {selectedSubmission.phone && (
                  <div>
                    <p className="text-sm text-[#4E5968]">연락처</p>
                    <p className="font-medium text-[#191F28]">{selectedSubmission.phone}</p>
                  </div>
                )}
                {selectedSubmission.email && (
                  <div>
                    <p className="text-sm text-[#4E5968]">이메일</p>
                    <p className="font-medium text-[#191F28]">{selectedSubmission.email}</p>
                  </div>
                )}
                {selectedSubmission.data && Object.keys(selectedSubmission.data).length > 0 && (
                  <div>
                    <p className="text-sm text-[#4E5968] mb-2">추가 정보</p>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      {Object.entries(selectedSubmission.data).map(([key, value]) => (
                        <div key={key}>
                          <p className="text-xs text-[#8B95A1]">{key}</p>
                          <p className="text-sm text-[#191F28]">{String(value)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <p className="text-sm text-[#4E5968]">신청일시</p>
                  <p className="font-medium text-[#191F28]">
                    {new Date(selectedSubmission.createdAt).toLocaleString('ko-KR')}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedSubmission(null)}
                className="w-full mt-6 px-4 py-3 bg-gray-100 text-[#4E5968] rounded-lg hover:bg-gray-200 transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
