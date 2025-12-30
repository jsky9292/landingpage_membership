// 신청 데이터 관련 타입 정의

export type SubmissionStatus = 'new' | 'contacted' | 'done' | 'canceled';

export interface SubmissionData {
  name: string;
  phone: string;
  company?: string;
  message?: string;
  [key: string]: string | undefined; // 동적 필드 지원
}

export interface Submission {
  id: string;
  pageId: string;
  data: SubmissionData;
  status: SubmissionStatus;
  memo?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubmissionWithPage extends Submission {
  page: {
    id: string;
    title: string;
    slug: string;
  };
}

// 신청 상태 라벨
export const SUBMISSION_STATUS_LABELS: Record<SubmissionStatus, string> = {
  new: '새 신청',
  contacted: '연락함',
  done: '완료',
  canceled: '취소',
};

// 신청 상태 아이콘
export const SUBMISSION_STATUS_ICONS: Record<SubmissionStatus, string> = {
  new: '🆕',
  contacted: '📞',
  done: '✅',
  canceled: '❌',
};

// 신청 상태 색상 (Tailwind)
export const SUBMISSION_STATUS_COLORS: Record<SubmissionStatus, string> = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-yellow-100 text-yellow-800',
  done: 'bg-green-100 text-green-800',
  canceled: 'bg-gray-100 text-gray-800',
};

// 헬퍼 함수: 상태 라벨 가져오기
export function getStatusLabel(status: SubmissionStatus): string {
  return `${SUBMISSION_STATUS_ICONS[status]} ${SUBMISSION_STATUS_LABELS[status]}`;
}

// 헬퍼 함수: 상태 색상 가져오기
export function getStatusColor(status: SubmissionStatus): string {
  return SUBMISSION_STATUS_COLORS[status];
}
