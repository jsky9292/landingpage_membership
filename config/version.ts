// 버전 관리 설정

export interface VersionInfo {
  version: string;
  buildDate: string;
  releaseDate: string;
  description: string;
}

export interface ChangelogEntry {
  version: string;
  date: string;
  changes: string[];
}

// 현재 버전 정보
export const VERSION_INFO: VersionInfo = {
  version: '1.0.0',
  buildDate: '2025-01-24',
  releaseDate: '2025-01-24',
  description: '랜딩페이지 빌더 정식 출시',
};

// 변경 이력
export const CHANGELOG: ChangelogEntry[] = [
  {
    version: '1.0.0',
    date: '2025-01-24',
    changes: [
      '정식 출시',
      '48개 샘플 템플릿 추가 (법률/전문 서비스 포함)',
      '샘플 바로 사용하기 기능',
      'AI 랜딩페이지 자동 생성',
      '다양한 테마 지원 (14종)',
      '실시간 미리보기',
      '폼 제출 및 알림 기능',
      '관리자 대시보드',
      '결제 시스템 연동',
      'OG 이미지 자동 생성',
    ],
  },
];

// 헬퍼 함수
export function getCurrentVersion(): string {
  return VERSION_INFO.version;
}

export function getVersionWithBuild(): string {
  return `v${VERSION_INFO.version}`;
}

export function getLatestChangelog(): ChangelogEntry | undefined {
  return CHANGELOG[0];
}
