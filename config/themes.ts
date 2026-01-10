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
  cardText?: string; // 카드 내부 텍스트 색상
  cardTextSecondary?: string; // 카드 내부 보조 텍스트 색상
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
  neon: {
    id: 'neon',
    name: '네온 사이버',
    description: '강렬하고 미래적인 네온 테마',
    colors: {
      primary: '#00F5FF',
      primaryLight: '#0D1B2A',
      background: '#0A0E17',
      backgroundAlt: '#141B2D',
      text: '#FFFFFF',
      textSecondary: '#B8C5D6',
      textMuted: '#6B7A8F',
      border: '#2D3A4F',
      success: '#00FF88',
      error: '#FF3366',
      gradient: 'linear-gradient(135deg, #0A0E17 0%, #1A1F35 50%, #0D1B2A 100%)',
      cardBackground: '#141B2D',
      cardText: '#FFFFFF',
      cardTextSecondary: '#B8C5D6',
    },
  },
  ocean: {
    id: 'ocean',
    name: '오션 블루',
    description: '시원하고 청량한 바다 테마',
    colors: {
      primary: '#0891B2',
      primaryLight: '#ECFEFF',
      background: '#F0FDFF',
      backgroundAlt: '#CFFAFE',
      text: '#164E63',
      textSecondary: '#0E7490',
      textMuted: '#67A1AF',
      border: '#A5F3FC',
      success: '#059669',
      error: '#DC2626',
      gradient: 'linear-gradient(180deg, #ECFEFF 0%, #CFFAFE 50%, #A5F3FC 100%)',
    },
  },
  sunset: {
    id: 'sunset',
    name: '선셋 그라데이션',
    description: '따뜻한 노을빛 그라데이션 테마',
    colors: {
      primary: '#F97316',
      primaryLight: '#FFF7ED',
      background: '#FFFBF5',
      backgroundAlt: '#FED7AA',
      text: '#7C2D12',
      textSecondary: '#C2410C',
      textMuted: '#EA580C',
      border: '#FDBA74',
      success: '#16A34A',
      error: '#DC2626',
      gradient: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 30%, #FED7AA 70%, #FDBA74 100%)',
    },
  },
  forest: {
    id: 'forest',
    name: '포레스트',
    description: '자연스럽고 편안한 숲 테마',
    colors: {
      primary: '#15803D',
      primaryLight: '#F0FDF4',
      background: '#FAFFF7',
      backgroundAlt: '#DCFCE7',
      text: '#14532D',
      textSecondary: '#166534',
      textMuted: '#4ADE80',
      border: '#BBF7D0',
      success: '#16A34A',
      error: '#DC2626',
      gradient: 'linear-gradient(180deg, #F0FDF4 0%, #DCFCE7 50%, #BBF7D0 100%)',
    },
  },
  minimal: {
    id: 'minimal',
    name: '미니멀 화이트',
    description: '깔끔하고 모던한 미니멀 테마',
    colors: {
      primary: '#18181B',
      primaryLight: '#F4F4F5',
      background: '#FFFFFF',
      backgroundAlt: '#FAFAFA',
      text: '#09090B',
      textSecondary: '#3F3F46',
      textMuted: '#A1A1AA',
      border: '#E4E4E7',
      success: '#22C55E',
      error: '#EF4444',
    },
  },
  corporate: {
    id: 'corporate',
    name: '코퍼레이트',
    description: '전문적이고 신뢰감 있는 비즈니스 테마',
    colors: {
      primary: '#1E40AF',
      primaryLight: '#EFF6FF',
      background: '#FFFFFF',
      backgroundAlt: '#F8FAFC',
      text: '#1E293B',
      textSecondary: '#334155',
      textMuted: '#64748B',
      border: '#CBD5E1',
      success: '#059669',
      error: '#DC2626',
    },
  },
  grape: {
    id: 'grape',
    name: '그레이프',
    description: '고급스럽고 세련된 퍼플 테마',
    colors: {
      primary: '#7C3AED',
      primaryLight: '#F5F3FF',
      background: '#FAFAFE',
      backgroundAlt: '#EDE9FE',
      text: '#4C1D95',
      textSecondary: '#6D28D9',
      textMuted: '#A78BFA',
      border: '#DDD6FE',
      success: '#10B981',
      error: '#EF4444',
      gradient: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 50%, #DDD6FE 100%)',
    },
  },
  midnight: {
    id: 'midnight',
    name: '미드나잇',
    description: '깊고 차분한 다크 블루 테마',
    colors: {
      primary: '#3B82F6',
      primaryLight: '#1E3A5F',
      background: '#0F172A',
      backgroundAlt: '#1E293B',
      text: '#F1F5F9',
      textSecondary: '#CBD5E1',
      textMuted: '#64748B',
      border: '#334155',
      success: '#22C55E',
      error: '#EF4444',
      cardText: '#F1F5F9',
      cardTextSecondary: '#CBD5E1',
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
      cardText: '#191F28',
      cardTextSecondary: '#4E5968',
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
      cardText: '#191F28',
      cardTextSecondary: '#4E5968',
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
