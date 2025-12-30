'use client';

import Link from 'next/link';
import { useState } from 'react';

interface Page {
  id: string;
  title: string;
  slug: string;
  topic: string;
  status: 'draft' | 'published';
  viewCount: number;
  submissionCount: number;
  newSubmissionCount: number;
  createdAt: string;
  updatedAt: string;
}

// 임시 데이터
const mockPages: Page[] = [
  {
    id: '1',
    title: 'DB 자동화 멤버십',
    slug: 'demo',
    topic: 'course',
    status: 'published',
    viewCount: 1234,
    submissionCount: 89,
    newSubmissionCount: 5,
    createdAt: '2025-01-20',
    updatedAt: '2025-01-24',
  },
  {
    id: '2',
    title: '스터디 모집 페이지',
    slug: 'study-2025',
    topic: 'study',
    status: 'published',
    viewCount: 567,
    submissionCount: 34,
    newSubmissionCount: 2,
    createdAt: '2025-01-18',
    updatedAt: '2025-01-22',
  },
  {
    id: '3',
    title: '프리랜서 상담 예약',
    slug: 'freelancer',
    topic: 'consultation',
    status: 'draft',
    viewCount: 0,
    submissionCount: 0,
    newSubmissionCount: 0,
    createdAt: '2025-01-15',
    updatedAt: '2025-01-15',
  },
];

const topicLabels: Record<string, string> = {
  course: '강의 모집',
  study: '스터디 모집',
  product: '상품 판매',
  consultation: '상담 예약',
  event: '이벤트',
  job: '채용 공고',
  realestate: '부동산 분양',
  free: '자유 주제',
};

export default function PagesListPage() {
  const [pages] = useState<Page[]>(mockPages);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

  const filteredPages = pages.filter((page) => {
    if (filter === 'all') return true;
    return page.status === filter;
  });

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#191F28]">내 페이지</h1>
          <p className="text-[#4E5968] mt-1">
            총 {pages.length}개의 페이지가 있어요.
          </p>
        </div>
        <Link
          href="/"
          className="bg-[#0064FF] hover:bg-[#0050CC] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + 새 페이지 만들기
        </Link>
      </div>

      {/* 필터 탭 */}
      <div className="flex gap-2 border-b border-gray-200 pb-4">
        <FilterTab
          active={filter === 'all'}
          onClick={() => setFilter('all')}
          label="전체"
          count={pages.length}
        />
        <FilterTab
          active={filter === 'published'}
          onClick={() => setFilter('published')}
          label="게시중"
          count={pages.filter((p) => p.status === 'published').length}
        />
        <FilterTab
          active={filter === 'draft'}
          onClick={() => setFilter('draft')}
          label="임시저장"
          count={pages.filter((p) => p.status === 'draft').length}
        />
      </div>

      {/* 페이지 목록 */}
      <div className="grid gap-4">
        {filteredPages.map((page) => (
          <PageRow key={page.id} page={page} />
        ))}
      </div>

      {/* 빈 상태 */}
      {filteredPages.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <span className="text-5xl mb-4 block">📄</span>
          <h3 className="text-lg font-bold text-[#191F28] mb-2">
            {filter === 'all'
              ? '아직 페이지가 없어요'
              : filter === 'published'
              ? '게시중인 페이지가 없어요'
              : '임시저장된 페이지가 없어요'}
          </h3>
          <p className="text-[#4E5968] mb-6">
            새 랜딩페이지를 만들어보세요!
          </p>
          <Link
            href="/"
            className="inline-block bg-[#0064FF] hover:bg-[#0050CC] text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            + 새 페이지 만들기
          </Link>
        </div>
      )}
    </div>
  );
}

function FilterTab({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? 'bg-[#0064FF] text-white'
          : 'bg-gray-100 text-[#4E5968] hover:bg-gray-200'
      }`}
    >
      {label} <span className="ml-1 opacity-70">({count})</span>
    </button>
  );
}

function PageRow({ page }: { page: Page }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        {/* 페이지 정보 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Link
              href={`/pages/${page.id}`}
              className="font-bold text-[#191F28] hover:text-[#0064FF] transition-colors truncate"
            >
              {page.title}
            </Link>
            <span className="text-xs px-2 py-1 bg-gray-100 text-[#4E5968] rounded-full">
              {topicLabels[page.topic] || page.topic}
            </span>
            {page.status === 'published' ? (
              <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                게시중
              </span>
            ) : (
              <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                임시저장
              </span>
            )}
            {page.newSubmissionCount > 0 && (
              <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded-full font-bold animate-pulse">
                🔔 새 신청 {page.newSubmissionCount}건
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-[#4E5968]">
            <span>👁️ 조회 {page.viewCount.toLocaleString()}</span>
            <span>📬 신청 {page.submissionCount}건</span>
            <span>📅 {page.updatedAt} 수정</span>
          </div>

          {page.status === 'published' && (
            <div className="mt-2">
              <a
                href={`/p/${page.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#0064FF] hover:underline"
              >
                🔗 {typeof window !== 'undefined' ? window.location.origin : ''}/p/{page.slug}
              </a>
            </div>
          )}
        </div>

        {/* 액션 버튼 */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            href={`/pages/${page.id}`}
            className="px-4 py-2 text-sm bg-[#E8F3FF] text-[#0064FF] rounded-lg hover:bg-[#D4E9FF] transition-colors font-medium"
          >
            신청 관리
          </Link>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-[#4E5968] hover:bg-gray-100 rounded-lg transition-colors"
            >
              ⋮
            </button>
            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
                  <Link
                    href={`/preview/${page.id}`}
                    className="block px-4 py-3 text-sm text-[#191F28] hover:bg-gray-50"
                  >
                    ✏️ 편집하기
                  </Link>
                  {page.status === 'published' && (
                    <a
                      href={`/p/${page.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-3 text-sm text-[#191F28] hover:bg-gray-50"
                    >
                      👁️ 미리보기
                    </a>
                  )}
                  <button className="block w-full text-left px-4 py-3 text-sm text-[#191F28] hover:bg-gray-50">
                    📋 복제하기
                  </button>
                  <button className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50">
                    🗑️ 삭제하기
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
