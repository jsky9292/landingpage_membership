'use client';

import Link from 'next/link';

export type TaskStatus = 'waiting' | 'pending' | 'processing' | 'completed' | 'failed';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt?: string;
  type?: string;
  link?: string;
}

interface RecentTasksProps {
  tasks: Task[];
  maxDisplay?: number;
  showMoreLink?: string;
  emptyMessage?: string;
}

export default function RecentTasks({
  tasks,
  maxDisplay = 5,
  showMoreLink,
  emptyMessage = '최근 작업이 없습니다.'
}: RecentTasksProps) {
  const getStatusStyles = (status: TaskStatus) => {
    switch (status) {
      case 'waiting':
        return { bg: 'bg-gray-100', text: 'text-gray-600', label: '대기' };
      case 'pending':
        return { bg: 'bg-blue-100', text: 'text-blue-600', label: '대기중' };
      case 'processing':
        return { bg: 'bg-yellow-100', text: 'text-yellow-700', label: '처리중' };
      case 'completed':
        return { bg: 'bg-green-100', text: 'text-green-600', label: '완료' };
      case 'failed':
        return { bg: 'bg-red-100', text: 'text-red-600', label: '실패' };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const displayedTasks = tasks.slice(0, maxDisplay);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* 헤더 */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-bold text-gray-800">최근 작업</h3>
        {showMoreLink && tasks.length > 0 && (
          <Link
            href={showMoreLink}
            className="text-sm text-pink-500 hover:underline"
          >
            전체보기 →
          </Link>
        )}
      </div>

      {/* 작업 목록 */}
      {tasks.length === 0 ? (
        <div className="px-5 py-12 text-center">
          <span className="text-4xl mb-3 block">📋</span>
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          {displayedTasks.map((task) => {
            const statusStyle = getStatusStyles(task.status);

            return (
              <div
                key={task.id}
                className="px-5 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
                        {statusStyle.label}
                      </span>
                      {task.type && (
                        <span className="text-xs text-gray-400">
                          {task.type}
                        </span>
                      )}
                    </div>
                    <h4 className="font-medium text-gray-800 truncate">
                      {task.title}
                    </h4>
                    {task.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                        {task.description}
                      </p>
                    )}
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-gray-400">
                      {formatDate(task.createdAt)}
                    </p>
                    {task.link && (
                      <Link
                        href={task.link}
                        className="text-xs text-pink-500 hover:underline mt-1 inline-block"
                      >
                        상세보기
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
