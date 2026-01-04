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
    name: '토스 블루',
    description: '깔끔하고 신뢰감 있는 토스 블루 테마',
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
    name: '에메랄드',
    description: '상쾌하고 자연스러운 에메랄드 테마',
    colors: {
      primary: '#10B981',
      primaryLight: '#ECFDF5',
      background: '#F0FDF9',
      backgroundAlt: '#D1FAE5',
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
    name: '앰버',
    description: '따뜻하고 고급스러운 앰버 테마',
    colors: {
      primary: '#F59E0B',
      primaryLight: '#FFFBEB',
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
    name: '로즈',
    description: '세련되고 감각적인 로즈 테마',
    colors: {
      primary: '#F43F5E',
      primaryLight: '#FFF1F2',
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
  slate: {
    id: 'slate',
    name: '슬레이트',
    description: '차분하고 전문적인 그레이 테마',
    colors: {
      primary: '#475569',
      primaryLight: '#F1F5F9',
      background: '#FFFFFF',
      backgroundAlt: '#F8FAFC',
      text: '#0F172A',
      textSecondary: '#334155',
      textMuted: '#64748B',
      border: '#CBD5E1',
      success: '#16A34A',
      error: '#DC2626',
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
