'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { SubmissionStatus, getStatusLabel, getStatusColor } from '@/types/submission';

interface Submission {
  id: string;
  page_id: string;
  page_title: string;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  status: SubmissionStatus;
  memo?: string;
  created_at: string;
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | 'all'>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch('/api/submissions');
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data.submissions || []);
      }
    } catch (err) {
      console.error('Failed to fetch submissions:', err);
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: '4px solid #3182F6', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#6B7684' }}>로딩중...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
      {/* 헤더 */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#191F28', margin: 0 }}>고객 신청 관리</h1>
        <p style={{ fontSize: 14, color: '#6B7684', marginTop: 4 }}>
          모든 랜딩페이지의 고객 신청을 한 곳에서 관리하세요
        </p>
      </div>

      {/* 통계 카드 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 24 }}>
        <StatCard label="전체" value={statusCounts.all} color="#191F28" bg="#F2F4F6" />
        <StatCard label="새 신청" value={statusCounts.new} color="#3182F6" bg="#E8F3FF" />
        <StatCard label="연락함" value={statusCounts.contacted} color="#FF9F43" bg="#FFF4E6" />
        <StatCard label="완료" value={statusCounts.done} color="#20C997" bg="#E6FCF5" />
        <StatCard label="취소" value={statusCounts.canceled} color="#FF6B6B" bg="#FFF0F0" />
      </div>

      {/* 필터 버튼 */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {(['all', 'new', 'contacted', 'done', 'canceled'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            style={{
              padding: '10px 16px',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              border: 'none',
              cursor: 'pointer',
              background: statusFilter === status
                ? status === 'all' ? '#191F28' : getStatusBg(status)
                : '#F2F4F6',
              color: statusFilter === status
                ? status === 'all' ? '#fff' : getStatusTextColor(status)
                : '#6B7684',
            }}
          >
            {status === 'all' ? '전체' : getStatusLabel(status as SubmissionStatus)}
            <span style={{ marginLeft: 4, opacity: 0.7 }}>({statusCounts[status]})</span>
          </button>
        ))}
      </div>

      {/* 신청 목록 */}
      <div style={{ background: '#fff', border: '1px solid #E5E8EB', borderRadius: 16, overflow: 'hidden' }}>
        {/* 테이블 헤더 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1.5fr 1.5fr 1.5fr 1.5fr 1fr',
          gap: 16,
          padding: '14px 20px',
          background: '#F8F9FA',
          borderBottom: '1px solid #E5E8EB',
          fontSize: 13,
          fontWeight: 600,
          color: '#6B7684',
        }}>
          <div>페이지 / 신청자</div>
          <div>연락처</div>
          <div>이메일</div>
          <div>상태</div>
          <div>신청일시</div>
          <div>관리</div>
        </div>

        {/* 신청 목록 */}
        {filteredSubmissions.length > 0 ? (
          filteredSubmissions.map((submission) => (
            <div
              key={submission.id}
              onClick={() => setSelectedSubmission(submission)}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1.5fr 1.5fr 1.5fr 1.5fr 1fr',
                gap: 16,
                padding: '16px 20px',
                borderBottom: '1px solid #F2F4F6',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <div>
                <div style={{ fontSize: 12, color: '#3182F6', marginBottom: 2 }}>
                  {submission.page_title || '알 수 없는 페이지'}
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#191F28' }}>{submission.name}</div>
              </div>
              <div>
                <a
                  href={`tel:${submission.phone}`}
                  onClick={(e) => e.stopPropagation()}
                  style={{ color: '#3182F6', textDecoration: 'none', fontSize: 14 }}
                >
                  {submission.phone}
                </a>
              </div>
              <div style={{ fontSize: 14, color: '#6B7684', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {submission.email || '-'}
              </div>
              <div>
                <select
                  value={submission.status}
                  onChange={(e) => {
                    e.stopPropagation();
                    updateSubmissionStatus(submission.id, e.target.value as SubmissionStatus);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    fontSize: 13,
                    padding: '6px 10px',
                    borderRadius: 20,
                    border: 'none',
                    cursor: 'pointer',
                    background: getStatusBg(submission.status),
                    color: getStatusTextColor(submission.status),
                    fontWeight: 500,
                  }}
                >
                  <option value="new">🆕 새 신청</option>
                  <option value="contacted">📞 연락함</option>
                  <option value="done">✅ 완료</option>
                  <option value="canceled">❌ 취소</option>
                </select>
              </div>
              <div style={{ fontSize: 13, color: '#8B95A1' }}>
                {formatDate(submission.created_at)}
              </div>
              <div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSubmission(submission);
                  }}
                  style={{
                    padding: '6px 12px',
                    background: '#E8F3FF',
                    color: '#3182F6',
                    border: 'none',
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  상세
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: '64px 20px', textAlign: 'center' }}>
            <span style={{ fontSize: 48, display: 'block', marginBottom: 16 }}>📭</span>
            <p style={{ color: '#6B7684', fontSize: 15 }}>
              {statusFilter === 'all'
                ? '아직 신청이 없어요'
                : `${getStatusLabel(statusFilter as SubmissionStatus)} 상태의 신청이 없어요`}
            </p>
          </div>
        )}
      </div>

      {/* 상세 모달 */}
      {selectedSubmission && (
        <SubmissionDetailModal
          submission={selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
          onStatusChange={(status) => updateSubmissionStatus(selectedSubmission.id, status)}
          onMemoChange={(memo) => updateSubmissionMemo(selectedSubmission.id, memo)}
          formatDate={formatDate}
        />
      )}

      {/* 모바일 반응형 */}
      <style>{`
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns: repeat(5"] { grid-template-columns: repeat(2, 1fr) !important; }
          div[style*="gridTemplateColumns: 2fr"] { display: none !important; }
        }
      `}</style>
    </div>
  );
}

function StatCard({ label, value, color, bg }: { label: string; value: number; color: string; bg: string }) {
  return (
    <div style={{ background: bg, borderRadius: 12, padding: '16px 14px', textAlign: 'center' }}>
      <p style={{ fontSize: 12, color: '#6B7684', margin: '0 0 4px' }}>{label}</p>
      <p style={{ fontSize: 24, fontWeight: 700, color, margin: 0 }}>{value}</p>
    </div>
  );
}

function getStatusBg(status: SubmissionStatus): string {
  const colors: Record<SubmissionStatus, string> = {
    new: '#E8F3FF',
    contacted: '#FFF4E6',
    done: '#E6FCF5',
    canceled: '#FFF0F0',
  };
  return colors[status] || '#F2F4F6';
}

function getStatusTextColor(status: SubmissionStatus): string {
  const colors: Record<SubmissionStatus, string> = {
    new: '#3182F6',
    contacted: '#FF9F43',
    done: '#20C997',
    canceled: '#FF6B6B',
  };
  return colors[status] || '#6B7684';
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
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: 16,
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 20,
        maxWidth: 480,
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
      }}>
        {/* 헤더 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid #E5E8EB',
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#191F28', margin: 0 }}>신청 상세</h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: 24, color: '#8B95A1', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        {/* 내용 */}
        <div style={{ padding: 24 }}>
          {/* 페이지 정보 */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 12, color: '#8B95A1', marginBottom: 4 }}>신청 페이지</p>
            <Link
              href={`/pages/${submission.page_id}`}
              style={{ fontSize: 14, color: '#3182F6', textDecoration: 'none' }}
            >
              {submission.page_title || '알 수 없는 페이지'} →
            </Link>
          </div>

          {/* 신청자 정보 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div>
              <p style={{ fontSize: 12, color: '#8B95A1', marginBottom: 4 }}>이름</p>
              <p style={{ fontSize: 15, fontWeight: 600, color: '#191F28', margin: 0 }}>{submission.name}</p>
            </div>
            <div>
              <p style={{ fontSize: 12, color: '#8B95A1', marginBottom: 4 }}>연락처</p>
              <a href={`tel:${submission.phone}`} style={{ fontSize: 15, fontWeight: 600, color: '#3182F6', textDecoration: 'none' }}>
                {submission.phone}
              </a>
            </div>
          </div>

          {submission.email && (
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 12, color: '#8B95A1', marginBottom: 4 }}>이메일</p>
              <a href={`mailto:${submission.email}`} style={{ fontSize: 14, color: '#3182F6', textDecoration: 'none' }}>
                {submission.email}
              </a>
            </div>
          )}

          {submission.message && (
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 12, color: '#8B95A1', marginBottom: 4 }}>문의사항</p>
              <p style={{
                fontSize: 14,
                color: '#191F28',
                background: '#F8F9FA',
                padding: 12,
                borderRadius: 8,
                margin: 0,
                whiteSpace: 'pre-line',
                lineHeight: 1.6,
              }}>
                {submission.message}
              </p>
            </div>
          )}

          {/* 상태 변경 */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 12, color: '#8B95A1', marginBottom: 8 }}>상태</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {(['new', 'contacted', 'done', 'canceled'] as SubmissionStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => onStatusChange(status)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 500,
                    border: 'none',
                    cursor: 'pointer',
                    background: submission.status === status ? getStatusBg(status) : '#F2F4F6',
                    color: submission.status === status ? getStatusTextColor(status) : '#6B7684',
                  }}
                >
                  {getStatusLabel(status)}
                </button>
              ))}
            </div>
          </div>

          {/* 메모 */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 12, color: '#8B95A1', marginBottom: 8 }}>메모</p>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              onBlur={() => onMemoChange(memo)}
              placeholder="내부 메모를 작성하세요..."
              style={{
                width: '100%',
                padding: 12,
                border: '1px solid #E5E8EB',
                borderRadius: 8,
                fontSize: 14,
                resize: 'none',
                outline: 'none',
                boxSizing: 'border-box',
              }}
              rows={3}
            />
          </div>

          {/* 신청일시 */}
          <p style={{ fontSize: 13, color: '#8B95A1', margin: 0 }}>
            📅 신청일시: {formatDate(submission.created_at)}
          </p>
        </div>

        {/* 푸터 */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 8,
          padding: '16px 24px',
          borderTop: '1px solid #E5E8EB',
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              background: '#F2F4F6',
              color: '#6B7684',
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            닫기
          </button>
          <a
            href={`tel:${submission.phone}`}
            style={{
              padding: '10px 20px',
              background: '#3182F6',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            📞 전화하기
          </a>
        </div>
      </div>
    </div>
  );
}
