// 테마 설정

import { ThemeType } from '@/types/page';

export interface ThemeColors {
  primary: string;
  primaryLight: string;
  background: string;
  backgroundAlt: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  success: string;
  error: string;
  gradient?: string; // 그라데이션 배경
  cardBackground?: string; // 카드 배경색
}

export interface ThemeConfig {
  id: ThemeType;
  name: string;
  description: string;
  colors: ThemeColors;
}

export const THEMES: Record<ThemeType, ThemeConfig> = {
  toss: {
    id: 'toss',
    name: '토스 스타일',
    description: '깔끔하고 신뢰감 있는 파란색 테마',
    colors: {
      primary: '#0064FF',
      primaryLight: '#E8F3FF',
      background: '#FFFFFF',
      backgroundAlt: '#F2F4F6',
      text: '#191F28',
      textSecondary: '#333D4B',
      textMuted: '#8B95A1',
      border: '#D1D6DB',
      success: '#00C853',
      error: '#F04452',
    },
  },
  dark: {
    id: 'dark',
    name: '다크 프리미엄',
    description: '고급스럽고 세련된 다크 테마',
    colors: {
      primary: '#6366F1',
      primaryLight: '#312E81',
      background: '#0F0F0F',
      backgroundAlt: '#1A1A1A',
      text: '#FFFFFF',
      textSecondary: '#E5E5E5',
      textMuted: '#A3A3A3',
      border: '#404040',
      success: '#22C55E',
      error: '#EF4444',
    },
  },
  warm: {
    id: 'warm',
    name: '웜 감성',
    description: '따뜻하고 친근한 오렌지 테마',
    colors: {
      primary: '#F97316',
      primaryLight: '#FFF7ED',
      background: '#FFFBF5',
      backgroundAlt: '#FEF3E2',
      text: '#1C1917',
      textSecondary: '#44403C',
      textMuted: '#78716C',
      border: '#E7E5E4',
      success: '#16A34A',
      error: '#DC2626',
    },
  },
  luxury: {
    id: 'luxury',
    name: '럭셔리',
    description: '격조 있는 골드 & 블랙 테마',
    colors: {
      primary: '#D4AF37',
      primaryLight: '#FDF6E3',
      background: '#0A0A0A',
      backgroundAlt: '#171717',
      text: '#FAFAFA',
      textSecondary: '#D4D4D4',
      textMuted: '#737373',
      border: '#404040',
      success: '#84CC16',
      error: '#DC2626',
    },
  },
  peach: {
    id: 'peach',
    name: '피치 그라데이션',
    description: '따뜻한 복숭아빛 그라데이션 테마',
    colors: {
      primary: '#FF6B35',
      primaryLight: '#FFF3ED',
      background: '#FFFFFF',
      backgroundAlt: '#FFF8F5',
      text: '#1C1917',
      textSecondary: '#44403C',
      textMuted: '#78716C',
      border: '#FED7C3',
      success: '#16A34A',
      error: '#DC2626',
      gradient: 'linear-gradient(180deg, #FFE5D4 0%, #FFCDB2 30%, #FFB69E 60%, #FFF8F5 100%)',
      cardBackground: '#FFFFFF',
    },
  },
};

// 테마 목록
export const THEME_LIST = Object.values(THEMES);

// CSS 변수 생성 함수
export function generateThemeCSS(theme: ThemeConfig): string {
  const { colors } = theme;
  return `
    --color-primary: ${colors.primary};
    --color-primary-light: ${colors.primaryLight};
    --color-background: ${colors.background};
    --color-background-alt: ${colors.backgroundAlt};
    --color-text: ${colors.text};
    --color-text-secondary: ${colors.textSecondary};
    --color-text-muted: ${colors.textMuted};
    --color-border: ${colors.border};
    --color-success: ${colors.success};
    --color-error: ${colors.error};
    --color-gradient: ${colors.gradient || 'none'};
    --color-card-background: ${colors.cardBackground || colors.background};
  `;
}
