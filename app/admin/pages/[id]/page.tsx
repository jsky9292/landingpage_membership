'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { SubmissionStatus, getStatusLabel, getStatusColor } from '@/types/submission';

interface Submission {
  id: string;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  status: SubmissionStatus;
  memo?: string;
  created_at: string;
}

interface PageDetail {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published';
  view_count: number;
}

export default function AdminPageManagementPage() {
  const params = useParams();
  const [page, setPage] = useState<PageDetail | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | 'all'>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPageData();
  }, [params.id]);

  const fetchPageData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/pages/${params.id}/submissions`);

      if (!res.ok) {
        if (res.status === 404) {
          setError('페이지를 찾을 수 없습니다.');
        } else if (res.status === 403) {
          setError('접근 권한이 없습니다.');
        } else {
          setError('데이터를 불러오는데 실패했습니다.');
        }
        return;
      }

      const data = await res.json();
      setPage(data.page);
      setSubmissions(data.submissions || []);
    } catch (err) {
      setError('서버 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubmissions = submissions.filter((sub) => {
    if (statusFilter === 'all') return true;
    return sub.status === statusFilter;
  });

  const statusCounts = {
    all: submissions.length,
    new: submissions.filter((s) => s.status === 'new').length,
    contacted: submissions.filter((s) => s.status === 'contacted').length,
    done: submissions.filter((s) => s.status === 'done').length,
    canceled: submissions.filter((s) => s.status === 'canceled').length,
  };

  const updateSubmissionStatus = async (id: string, newStatus: SubmissionStatus) => {
    try {
      const res = await fetch(`/api/submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setSubmissions((prev) =>
          prev.map((sub) => (sub.id === id ? { ...sub, status: newStatus } : sub))
        );
        if (selectedSubmission?.id === id) {
          setSelectedSubmission({ ...selectedSubmission, status: newStatus });
        }
      }
    } catch (err) {
      console.error('Status update error:', err);
    }
  };

  const updateSubmissionMemo = async (id: string, memo: string) => {
    try {
      const res = await fetch(`/api/submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memo }),
      });

      if (res.ok) {
        setSubmissions((prev) =>
          prev.map((sub) => (sub.id === id ? { ...sub, memo } : sub))
        );
        if (selectedSubmission?.id === id) {
          setSelectedSubmission({ ...selectedSubmission, memo });
        }
      }
    } catch (err) {
      console.error('Memo update error:', err);
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
          <div className="w-8 h-8 border-2 border-[#0064FF] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#4E5968]">로딩중...</p>
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-4xl mb-4">&#128683;</div>
          <p className="text-red-500 font-medium">{error}</p>
          <Link
            href="/admin/pages"
            className="mt-4 inline-block text-[#0064FF] hover:underline"
          >
            &#8592; 페이지 목록으로
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
          href="/admin/pages"
          className="text-sm text-[#4E5968] hover:text-[#0064FF] mb-2 inline-block"
        >
          &#8592; 페이지 목록으로
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-[#191F28]">{page.title}</h1>
              {page.status === 'published' ? (
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                  게시중
                </span>
              ) : (
                <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                  임시저장
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm text-[#4E5968]">
              <span>조회 {(page.view_count || 0).toLocaleString()}</span>
              <span>신청 {submissions.length}건</span>
              {page.status === 'published' && (
                <a
                  href={`/p/${page.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0064FF] hover:underline"
                >
                  페이지 보기
                </a>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                // CSV 다운로드
                const csv = [
                  ['이름', '연락처', '이메일', '메시지', '상태', '메모', '신청일시'],
                  ...submissions.map((s) => [
                    s.name,
                    s.phone,
                    s.email || '',
                    s.message || '',
                    getStatusLabel(s.status),
                    s.memo || '',
                    formatDate(s.created_at),
                  ]),
                ]
                  .map((row) => row.map((cell) => `"${cell}"`).join(','))
                  .join('\n');

                const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${page.title}_신청목록.csv`;
                link.click();
                URL.revokeObjectURL(url);
              }}
              className="px-4 py-2 text-sm text-[#4E5968] bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              CSV 다운로드
            </button>
            <Link
              href={`/preview/${page.id}`}
              className="px-4 py-2 text-sm text-[#0064FF] bg-[#E8F3FF] rounded-lg hover:bg-[#D4E9FF] transition-colors font-medium"
            >
              페이지 편집
            </Link>
          </div>
        </div>
      </div>

      {/* 상태 필터 */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'new', 'contacted', 'done', 'canceled'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === status
                ? status === 'all'
                  ? 'bg-[#191F28] text-white'
                  : `${getStatusColor(status as SubmissionStatus)} bg-opacity-100`
                : 'bg-gray-100 text-[#4E5968] hover:bg-gray-200'
            }`}
          >
            {status === 'all' ? '전체' : getStatusLabel(status as SubmissionStatus)}
            <span className="ml-1 opacity-70">({statusCounts[status]})</span>
          </button>
        ))}
      </div>

      {/* 신청 목록 */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        {/* 테이블 헤더 */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 text-sm font-medium text-[#4E5968]">
          <div className="col-span-2">이름</div>
          <div className="col-span-2">연락처</div>
          <div className="col-span-2">이메일</div>
          <div className="col-span-2">상태</div>
          <div className="col-span-2">신청일시</div>
          <div className="col-span-2">관리</div>
        </div>

        {/* 테이블 바디 */}
        {filteredSubmissions.length > 0 ? (
          filteredSubmissions.map((submission) => (
            <SubmissionRow
              key={submission.id}
              submission={submission}
              onStatusChange={(status) => updateSubmissionStatus(submission.id, status)}
              onSelect={() => setSelectedSubmission(submission)}
              formatDate={formatDate}
            />
          ))
        ) : (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">&#128237;</div>
            <p className="text-[#4E5968]">
              {statusFilter === 'all'
                ? '아직 신청이 없어요'
                : `${getStatusLabel(statusFilter as SubmissionStatus)} 상태의 신청이 없어요`}
            </p>
          </div>
        )}
      </div>

      {/* 신청 상세 모달 */}
      {selectedSubmission && (
        <SubmissionDetailModal
          submission={selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
          onStatusChange={(status) => updateSubmissionStatus(selectedSubmission.id, status)}
          onMemoChange={(memo) => updateSubmissionMemo(selectedSubmission.id, memo)}
          formatDate={formatDate}
        />
      )}
    </div>
  );
}

function SubmissionRow({
  submission,
  onStatusChange,
  onSelect,
  formatDate,
}: {
  submission: Submission;
  onStatusChange: (status: SubmissionStatus) => void;
  onSelect: () => void;
  formatDate: (date: string) => string;
}) {
  return (
    <div
      className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer items-center"
      onClick={onSelect}
    >
      <div className="col-span-2">
        <p className="font-medium text-[#191F28]">{submission.name}</p>
      </div>
      <div className="col-span-2">
        <a
          href={`tel:${submission.phone}`}
          onClick={(e) => e.stopPropagation()}
          className="text-[#0064FF] hover:underline"
        >
          {submission.phone}
        </a>
      </div>
      <div className="col-span-2 text-[#4E5968] truncate">
        {submission.email || '-'}
      </div>
      <div className="col-span-2">
        <select
          value={submission.status}
          onChange={(e) => {
            e.stopPropagation();
            onStatusChange(e.target.value as SubmissionStatus);
          }}
          className={`text-sm px-3 py-1 rounded-full border-0 cursor-pointer ${getStatusColor(
            submission.status
          )}`}
        >
          <option value="new">새 신청</option>
          <option value="contacted">연락함</option>
          <option value="done">완료</option>
          <option value="canceled">취소</option>
        </select>
      </div>
      <div className="col-span-2 text-sm text-[#4E5968]">
        {formatDate(submission.created_at)}
      </div>
      <div className="col-span-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className="text-sm text-[#0064FF] hover:underline"
        >
          상세보기
        </button>
      </div>
    </div>
  );
}

function SubmissionDetailModal({
  submission,
  onClose,
  onStatusChange,
  onMemoChange,
  formatDate,
}: {
  submission: Submission;
  onClose: () => void;
  onStatusChange: (status: SubmissionStatus) => void;
  onMemoChange: (memo: string) => void;
  formatDate: (date: string) => string;
}) {
  const [memo, setMemo] = useState(submission.memo || '');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#191F28]">신청 상세</h2>
          <button
            onClick={onClose}
            className="text-[#4E5968] hover:text-[#191F28] text-2xl"
          >
            &#10005;
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="p-6 space-y-6">
          {/* 신청자 정보 */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[#4E5968]">신청자 정보</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-[#8B95A1] mb-1">이름</p>
                <p className="font-medium text-[#191F28]">{submission.name}</p>
              </div>
              <div>
                <p className="text-xs text-[#8B95A1] mb-1">연락처</p>
                <a
                  href={`tel:${submission.phone}`}
                  className="font-medium text-[#0064FF] hover:underline"
                >
                  {submission.phone}
                </a>
              </div>
              {submission.email && (
                <div className="col-span-2">
                  <p className="text-xs text-[#8B95A1] mb-1">이메일</p>
                  <a
                    href={`mailto:${submission.email}`}
                    className="font-medium text-[#0064FF] hover:underline"
                  >
                    {submission.email}
                  </a>
                </div>
              )}
              {submission.message && (
                <div className="col-span-2">
                  <p className="text-xs text-[#8B95A1] mb-1">문의사항</p>
                  <p className="text-[#191F28] whitespace-pre-line bg-gray-50 p-3 rounded-lg">
                    {submission.message}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 상태 변경 */}
          <div>
            <h3 className="text-sm font-medium text-[#4E5968] mb-2">상태</h3>
            <div className="flex gap-2 flex-wrap">
              {(['new', 'contacted', 'done', 'canceled'] as SubmissionStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => onStatusChange(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    submission.status === status
                      ? getStatusColor(status)
                      : 'bg-gray-100 text-[#4E5968] hover:bg-gray-200'
                  }`}
                >
                  {getStatusLabel(status)}
                </button>
              ))}
            </div>
          </div>

          {/* 메모 */}
          <div>
            <h3 className="text-sm font-medium text-[#4E5968] mb-2">메모</h3>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              onBlur={() => onMemoChange(memo)}
              placeholder="내부 메모를 작성하세요..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0064FF]/20 focus:border-[#0064FF] resize-none"
              rows={3}
            />
          </div>

          {/* 신청일시 */}
          <div className="text-sm text-[#8B95A1]">
            신청일시: {formatDate(submission.created_at)}
          </div>
        </div>

        {/* 푸터 */}
        <div className="flex justify-end gap-2 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 text-[#4E5968] hover:bg-gray-100 rounded-lg transition-colors"
          >
            닫기
          </button>
          <a
            href={`tel:${submission.phone}`}
            className="px-6 py-2 bg-[#0064FF] hover:bg-[#0050CC] text-white rounded-lg transition-colors font-medium"
          >
            전화하기
          </a>
        </div>
      </div>
    </div>
  );
}
