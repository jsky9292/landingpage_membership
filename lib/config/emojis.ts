// 커스텀 이모지 이미지 설정
export const customEmojis = {
  confused: '/emojis/곤란한남자.png',
  exclaim: '/emojis/느낌표남자.png',
  question: '/emojis/물음표남자.png',
  question2: '/emojis/물음표남자2.png',
  questionWoman: '/emojis/물음표여자.png',
  smirk: '/emojis/비웃는남자.png',
  cryMan: '/emojis/우는남자.png',
  cryWoman: '/emojis/우는여자.png',
  smileMan: '/emojis/웃는남자.png',
  smileMan2: '/emojis/웃는남자2.png',
  smileMan3: '/emojis/웃는남자3.png',
  smileWoman: '/emojis/웃는여자.png',
  smileWoman2: '/emojis/웃는여자2.png',
  heartMan: '/emojis/하트남자.png',
  heartMan2: '/emojis/하트남자2.png',
  heartWoman: '/emojis/하트여자.png',
  angryMan: '/emojis/화난남자.png',
  angryWoman: '/emojis/화난여자.png',
};

// 섹션별 추천 이모지
export const sectionEmojis = {
  pain: ['question', 'confused', 'cryMan', 'cryWoman', 'angryMan'],
  solution: ['exclaim', 'smileMan', 'smileWoman', 'heartMan'],
  benefits: ['heartMan', 'heartWoman', 'smileMan2', 'smileMan3'],
  cta: ['heartMan2', 'heartWoman', 'smileWoman2'],
};

// 톤앤매너 설정
export const toneStyles = {
  professional: {
    id: 'professional',
    name: '전문가',
    description: '신뢰감 있고 전문적인 톤',
    colors: { primary: '#0064FF', secondary: '#191F28', accent: '#E8F3FF', background: '#FFFFFF' },
    borderRadius: '12px',
  },
  friendly: {
    id: 'friendly',
    name: '친근한',
    description: '따뜻하고 친근한 톤',
    colors: { primary: '#FF6B35', secondary: '#2D3748', accent: '#FFF5F0', background: '#FFFAF7' },
    borderRadius: '16px',
  },
  luxury: {
    id: 'luxury',
    name: '프리미엄',
    description: '고급스럽고 세련된 톤',
    colors: { primary: '#1A1A1A', secondary: '#4A4A4A', accent: '#F5F5F5', background: '#FFFFFF' },
    borderRadius: '4px',
  },
  energetic: {
    id: 'energetic',
    name: '활기찬',
    description: '밝고 에너지 넘치는 톤',
    colors: { primary: '#7C3AED', secondary: '#1F2937', accent: '#EDE9FE', background: '#FAFAFA' },
    borderRadius: '20px',
  },
  minimal: {
    id: 'minimal',
    name: '미니멀',
    description: '깔끔하고 심플한 톤',
    colors: { primary: '#111827', secondary: '#6B7280', accent: '#F3F4F6', background: '#FFFFFF' },
    borderRadius: '8px',
  },
};

export type ToneStyleId = keyof typeof toneStyles;
