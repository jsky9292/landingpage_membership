// 샘플 랜딩페이지 데이터 (공유 모듈)
import { Section, FormField } from '@/types/page';

export interface SamplePage {
  id: string;
  category: string;
  categoryName: string;
  name: string;
  theme: string;
  themeColor: string;
  description: string;
  thumbnail: string; // Unsplash 이미지 URL
  preview: {
    headline: string;
    subtext: string;
    cta: string;
    badge: string;
  };
  // 제작 페이지에서 사용할 상세 데이터
  formData: {
    title: string;
    content: string;
  };
  // 미리 생성된 섹션 데이터 (AI 생성 없이 바로 사용)
  sections?: Section[];
  formFields?: FormField[];
}

// 카테고리 → 토픽 매핑
export const categoryToTopic: Record<string, string> = {
  education: 'course',
  consulting: 'consulting',
  service: 'service',
  product: 'product',
  event: 'event',
  realestate: 'realestate',
  franchise: 'franchise',
  interior: 'interior',
  medical: 'consulting',
  beauty: 'service',
  legal: 'consulting',
  lifestyle: 'service',
  wedding: 'service',
  pet: 'service',
  academy: 'course',
};

export const samplePages: SamplePage[] = [
  // 교육/강의
  {
    id: 'marketing-edu-sample',
    category: 'education',
    categoryName: '교육/강의',
    name: '마케팅 실전 부트캠프',
    theme: 'dark',
    themeColor: '#6366F1',
    description: '퍼포먼스 마케팅 전문가가 되는 8주 과정',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    preview: {
      headline: '월급보다 더 버는 마케터가 되세요',
      subtext: '현직 마케터가 알려주는 실전 퍼포먼스 마케팅 노하우',
      cta: '무료 강의 미리보기',
      badge: '오늘 마감 | 36% 할인',
    },
    formData: {
      title: '마케팅 실전 부트캠프',
      content: '월급보다 더 버는 마케터가 되세요. 현직 10년차 마케터가 알려주는 실전 퍼포먼스 마케팅 노하우입니다. 8주 완성 과정으로 구글/페이스북/인스타그램 광고를 마스터할 수 있습니다. 수강료 89만원, 오늘까지 36% 할인 적용됩니다.',
    },
    sections: [
      { id: 's1', type: 'hero', order: 0, content: { badge: '🔥 오늘 마감 | 36% 특별 할인', headline: '월급보다 더 버는\n마케터가 되세요', subtext: '현직 대기업 마케터가 알려주는 실전 퍼포먼스 마케팅.\n이론이 아닌 실무 노하우를 8주만에 마스터합니다.', cta: '무료 강의 미리보기' } },
      { id: 's2', type: 'pain', order: 1, content: { title: '이런 고민 있으신가요?', items: [{ icon: '😓', text: '마케팅 배우고 싶은데 어디서 시작해야 할지 모르겠어요' }, { icon: '💸', text: '광고비는 쓰는데 왜 성과가 안 나는지 모르겠어요' }, { icon: '📊', text: '데이터 분석이 중요하다는데 어떻게 해야 하나요?' }, { icon: '🎯', text: '실무에서 바로 쓸 수 있는 스킬을 배우고 싶어요' }] } },
      { id: 's3', type: 'solution', order: 2, content: { title: '8주 후, 당신은 달라집니다', headline: '실무 프로젝트 기반 커리큘럼', description: '배우는 순간 바로 적용할 수 있습니다', items: [{ icon: '📈', title: '광고 세팅부터 최적화까지', description: 'META, Google 광고 실전 운영' }, { icon: '🔍', title: '데이터 기반 의사결정', description: 'GA4, 전환 추적, A/B 테스트' }, { icon: '✍️', title: '전환되는 카피라이팅', description: '클릭률 높이는 문구 작성법' }] } },
      { id: 's4', type: 'benefits', order: 3, content: { title: '수강생 성과', items: [{ icon: '📈', title: '340%', description: '평균 ROAS 개선' }, { icon: '💼', title: '92%', description: '취업/이직 성공률' }, { icon: '💰', title: '2.3배', description: '평균 연봉 상승' }] } },
      { id: 's5', type: 'process', order: 4, content: { title: '커리큘럼', steps: [{ number: 1, title: '1-2주차: 마케팅 기초', description: '디지털 마케팅 개념, 채널별 특성 이해' }, { number: 2, title: '3-4주차: 광고 실습', description: 'META, Google 광고 세팅 및 운영' }, { number: 3, title: '5-6주차: 데이터 분석', description: 'GA4 설정, 전환 추적, 성과 분석' }, { number: 4, title: '7-8주차: 포트폴리오', description: '실제 캠페인 운영 및 포트폴리오 완성' }] } },
      { id: 's6', type: 'cta', order: 5, content: { headline: '지금 시작하면 36% 할인', subtext: '선착순 30명 한정 | 오늘 자정 마감', buttonText: '할인가로 신청하기' } },
      { id: 's7', type: 'form', order: 6, content: { title: '수강 신청', buttonText: '신청하기' } }
    ],
    formFields: [
      { id: 'name', label: '이름', type: 'text', placeholder: '이름을 입력하세요', required: true },
      { id: 'phone', label: '연락처', type: 'tel', placeholder: '010-0000-0000', required: true },
      { id: 'email', label: '이메일', type: 'email', placeholder: 'email@example.com', required: true }
    ],
  },
  {
    id: 'it-edu-sample',
    category: 'education',
    categoryName: '교육/강의',
    name: 'AI 개발자 양성과정',
    theme: 'toss',
    themeColor: '#0891B2',
    description: 'ChatGPT API를 활용한 서비스 개발',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
    preview: {
      headline: 'AI 시대, 개발자의 무기를 장착하세요',
      subtext: '비전공자도 8주만에 AI 서비스를 만들 수 있습니다',
      cta: '커리큘럼 확인하기',
      badge: '선착순 30명',
    },
    formData: {
      title: 'AI 개발자 양성과정',
      content: 'AI 시대, 개발자의 무기를 장착하세요. 비전공자도 8주만에 AI 서비스를 만들 수 있습니다. ChatGPT API, Claude API를 활용한 실전 프로젝트 3개를 완성합니다. 선착순 30명 한정, 수강료 150만원.',
    },
    sections: [
      { id: 's1', type: 'hero', order: 0, content: { badge: '🚀 선착순 30명 한정', headline: 'AI 시대,\n개발자의 무기를 장착하세요', subtext: '비전공자도 8주만에 AI 서비스를 만들 수 있습니다.\nChatGPT, Claude API를 활용한 실전 프로젝트 완성', cta: '커리큘럼 확인하기' } },
      { id: 's2', type: 'pain', order: 1, content: { title: '이런 고민 있으신가요?', items: [{ icon: '🤖', text: 'AI를 배우고 싶은데 어디서 시작해야 할지 모르겠어요' }, { icon: '💻', text: '코딩은 할 줄 아는데 AI 연동이 어려워요' }, { icon: '📚', text: '혼자 공부하니 진도가 안 나가요' }, { icon: '💼', text: 'AI 관련 취업/이직을 준비하고 있어요' }] } },
      { id: 's3', type: 'solution', order: 2, content: { title: '8주 후, AI 서비스를 만들 수 있습니다', headline: '실전 프로젝트 중심', description: '이론보다 실습, 3개의 실제 서비스를 만듭니다', items: [{ icon: '🤖', title: 'ChatGPT API 마스터', description: '프롬프트 엔지니어링부터 API 연동까지' }, { icon: '🧠', title: 'Claude API 활용', description: '긴 문서 분석, 코드 생성 등 고급 활용' }, { icon: '🚀', title: '실전 프로젝트 3개', description: '챗봇, 문서분석기, AI 서비스 완성' }] } },
      { id: 's4', type: 'benefits', order: 3, content: { title: '수강 혜택', items: [{ icon: '💻', title: '평생 수강', description: '한 번 결제로 평생 복습 가능' }, { icon: '👨‍💻', title: '1:1 코드리뷰', description: '현직 개발자의 코드 피드백' }, { icon: '🎓', title: '수료증 발급', description: '포트폴리오로 활용 가능' }] } },
      { id: 's5', type: 'process', order: 4, content: { title: '커리큘럼', steps: [{ number: 1, title: '1-2주차: AI 기초', description: 'AI 원리, Python 기초, API 개념' }, { number: 2, title: '3-4주차: ChatGPT', description: 'OpenAI API 연동, 프롬프트 설계' }, { number: 3, title: '5-6주차: Claude', description: 'Anthropic API, 고급 기능 활용' }, { number: 4, title: '7-8주차: 프로젝트', description: '실전 AI 서비스 개발 및 배포' }] } },
      { id: 's6', type: 'cta', order: 5, content: { headline: '선착순 30명 한정', subtext: '지금 신청하면 얼리버드 20% 할인', buttonText: '수강 신청하기' } },
      { id: 's7', type: 'form', order: 6, content: { title: '수강 신청', buttonText: '신청하기' } }
    ],
    formFields: [
      { id: 'name', label: '이름', type: 'text', placeholder: '이름을 입력하세요', required: true },
      { id: 'phone', label: '연락처', type: 'tel', placeholder: '010-0000-0000', required: true },
      { id: 'email', label: '이메일', type: 'email', placeholder: 'email@example.com', required: true }
    ],
  },
  {
    id: 'design-edu-sample',
    category: 'education',
    categoryName: '교육/강의',
    name: 'UI/UX 디자인 마스터',
    theme: 'peach',
    themeColor: '#EC4899',
    description: '피그마로 완성하는 실무 디자인',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
    preview: {
      headline: '취업률 94%, 디자인 실력이 증명됩니다',
      subtext: '현직 디자이너와 함께하는 포트폴리오 완성 과정',
      cta: '수강 신청하기',
      badge: '취업 연계',
    },
    formData: {
      title: 'UI/UX 디자인 마스터',
      content: '취업률 94%, 디자인 실력이 증명됩니다. 현직 카카오, 네이버 디자이너와 함께하는 포트폴리오 완성 과정입니다. 피그마 실무 스킬부터 취업용 포트폴리오까지 12주 완성. 취업 연계 프로그램 운영.',
    },
    sections: [
      { id: 's1', type: 'hero', order: 0, content: { badge: '🎨 취업률 94% | 취업 연계', headline: '취업률 94%,\n디자인 실력이 증명됩니다', subtext: '현직 카카오, 네이버 디자이너와 함께하는\n포트폴리오 완성 과정', cta: '수강 신청하기' } },
      { id: 's2', type: 'pain', order: 1, content: { title: '이런 고민 있으신가요?', items: [{ icon: '🎨', text: '디자인은 배웠는데 포트폴리오가 없어요' }, { icon: '💼', text: '취업 준비가 막막해요' }, { icon: '🖥️', text: 'Figma 실무 활용법을 모르겠어요' }, { icon: '👀', text: '내 디자인이 현업 수준인지 모르겠어요' }] } },
      { id: 's3', type: 'solution', order: 2, content: { title: '12주 후, 취업 준비 완료', headline: '실무 프로젝트 기반', description: '현직 디자이너의 실무 노하우를 전수받습니다', items: [{ icon: '🎯', title: 'Figma 마스터', description: '컴포넌트, 오토레이아웃, 프로토타입' }, { icon: '📱', title: 'UI/UX 실무', description: '모바일/웹 디자인 프로젝트' }, { icon: '💼', title: '포트폴리오 완성', description: '3개 프로젝트 완성' }] } },
      { id: 's4', type: 'benefits', order: 3, content: { title: '수강생 성과', items: [{ icon: '📈', title: '94%', description: '취업 성공률' }, { icon: '💰', title: '3,500만원', description: '평균 초봉' }, { icon: '🏢', title: '대기업 취업', description: '네카라쿠배 다수' }] } },
      { id: 's5', type: 'process', order: 4, content: { title: '커리큘럼', steps: [{ number: 1, title: '1-4주차: Figma 기초', description: '툴 사용법, 컴포넌트 시스템' }, { number: 2, title: '5-8주차: UI/UX 실무', description: '앱/웹 디자인 프로젝트' }, { number: 3, title: '9-12주차: 포트폴리오', description: '실전 프로젝트 + 취업 준비' }] } },
      { id: 's6', type: 'cta', order: 5, content: { headline: '지금 등록하면 취업 연계', subtext: '수강생 전원 포트폴리오 리뷰', buttonText: '수강 신청하기' } },
      { id: 's7', type: 'form', order: 6, content: { title: '수강 신청', buttonText: '신청하기' } }
    ],
    formFields: [
      { id: 'name', label: '이름', type: 'text', placeholder: '이름을 입력하세요', required: true },
      { id: 'phone', label: '연락처', type: 'tel', placeholder: '010-0000-0000', required: true },
      { id: 'email', label: '이메일', type: 'email', placeholder: 'email@example.com', required: true }
    ],
  },
  // 상담/컨설팅
  {
    id: 'insurance-sample',
    category: 'consulting',
    categoryName: '상담/컨설팅',
    name: '맞춤 보험 설계',
    theme: 'dark',
    themeColor: '#8B5CF6',
    description: '당신에게 꼭 맞는 보험을 찾아드립니다',
    thumbnail: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=600&fit=crop',
    preview: {
      headline: '보험료는 낮추고, 보장은 높이는 방법',
      subtext: '10년차 보험 전문가가 무료로 상담해드립니다',
      cta: '무료 상담 신청',
      badge: '무료 상담',
    },
    formData: {
      title: '맞춤 보험 설계',
      content: '보험료는 낮추고, 보장은 높이는 방법이 있습니다. 10년차 보험 전문가가 무료로 상담해드립니다. 현재 가입 보험 분석, 불필요한 보험 정리, 최적의 보험 조합 설계까지. 상담 후 가입 강요 절대 없습니다.',
    },
    sections: [
      { id: 's1', type: 'hero', order: 0, content: { badge: '✨ 무료 상담 | 강요 없는 진단', headline: '보험료는 낮추고\n보장은 높이는 방법', subtext: '10년차 보험 전문가가 당신의 보험을 무료로 진단해드립니다.\n필요 없는 보험은 빼고, 부족한 보장은 채워드려요.', cta: '무료 상담 신청하기' } },
      { id: 's2', type: 'pain', order: 1, content: { title: '혹시 이런 상황이신가요?', items: [{ icon: '💰', text: '매달 보험료가 부담되는데, 어떤 걸 해지해야 할지 모르겠어요' }, { icon: '📋', text: '보험이 여러 개인데 중복되는 건 없는지 궁금해요' }, { icon: '🏥', text: '실비 보험 바뀌었다는데 나는 괜찮은 건가요?' }, { icon: '👨‍👩‍👧', text: '가족 보험 점검이 필요한데 어디서 받아야 할지...' }] } },
      { id: 's3', type: 'solution', order: 2, content: { title: '전문가가 직접 분석해드립니다', headline: '10년 경력 전문가', description: '고객님의 상황에 맞는 최적의 보험 포트폴리오를 설계해드립니다', items: [{ icon: '🔍', title: '현재 보험 진단', description: '가입된 보험 중복/누락 체크' }, { icon: '💡', title: '맞춤 설계', description: '라이프스타일에 맞는 보장 설계' }, { icon: '📉', title: '보험료 최적화', description: '불필요한 특약 정리로 비용 절감' }] } },
      { id: 's4', type: 'benefits', order: 3, content: { title: '상담 고객 성과', items: [{ icon: '💰', title: '23%', description: '평균 보험료 절감' }, { icon: '⭐', title: '98%', description: '상담 만족도' }, { icon: '👥', title: '5,000+', description: '상담 완료 고객' }] } },
      { id: 's5', type: 'cta', order: 4, content: { headline: '무료 상담 신청하세요', subtext: '강요 없는 상담 | 부담 없이 문의하세요', buttonText: '무료 상담 신청' } },
      { id: 's6', type: 'form', order: 5, content: { title: '무료 상담 신청', buttonText: '상담 신청하기' } }
    ],
    formFields: [
      { id: 'name', label: '이름', type: 'text', placeholder: '이름을 입력하세요', required: true },
      { id: 'phone', label: '연락처', type: 'tel', placeholder: '010-0000-0000', required: true },
      { id: 'age', label: '연령대', type: 'select', required: true, options: ['20대', '30대', '40대', '50대 이상'] }
    ],
  },
  {
    id: 'tax-sample',
    category: 'consulting',
    categoryName: '상담/컨설팅',
    name: '절세 컨설팅',
    theme: 'slate',
    themeColor: '#475569',
    description: '합법적으로 세금을 줄이는 방법',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop',
    preview: {
      headline: '매년 수백만원씩 세금을 더 내고 계신가요?',
      subtext: '10년 경력 세무사가 절세 방법을 알려드립니다',
      cta: '무료 진단받기',
      badge: '세금 환급',
    },
    formData: {
      title: '절세 컨설팅',
      content: '매년 수백만원씩 세금을 더 내고 계신가요? 10년 경력 세무사가 합법적인 절세 방법을 알려드립니다. 종합소득세, 부가세, 법인세 절세 전략. 평균 환급액 320만원, 무료 세금 진단 신청하세요.',
    },
    sections: [
      { id: 's1', type: 'hero', order: 0, content: { badge: '💰 평균 환급액 320만원', headline: '매년 수백만원씩\n세금을 더 내고 계신가요?', subtext: '10년 경력 세무사가 합법적인 절세 방법을 알려드립니다.\n종합소득세, 부가세, 법인세 절세 전략까지', cta: '무료 진단받기' } },
      { id: 's2', type: 'pain', order: 1, content: { title: '이런 분들께 추천합니다', items: [{ icon: '💸', text: '세금 신고를 하고 나면 항상 돈이 부족해요' }, { icon: '📊', text: '절세 방법이 있다는데 어떻게 해야 할지 모르겠어요' }, { icon: '🏢', text: '법인 전환을 고민 중인데 세금 차이가 얼마나 날까요?' }, { icon: '🧾', text: '경비 처리를 제대로 하고 있는지 확인받고 싶어요' }] } },
      { id: 's3', type: 'solution', order: 2, content: { title: '맞춤 절세 전략을 세워드립니다', headline: '합법적 절세', description: '세법에 근거한 정당한 절세 방법만 안내합니다', items: [{ icon: '📋', title: '세금 진단', description: '현재 세금 현황 분석' }, { icon: '💡', title: '절세 플랜', description: '맞춤형 절세 전략 수립' }, { icon: '📈', title: '환급 신청', description: '경정청구로 환급 지원' }] } },
      { id: 's4', type: 'benefits', order: 3, content: { title: '상담 실적', items: [{ icon: '💰', title: '320만원', description: '평균 환급액' }, { icon: '👥', title: '3,000+', description: '상담 고객' }, { icon: '⭐', title: '97%', description: '만족도' }] } },
      { id: 's5', type: 'cta', order: 4, content: { headline: '무료 세금 진단 받아보세요', subtext: '부담 없이 현재 세금 현황을 확인해보세요', buttonText: '무료 진단 신청' } },
      { id: 's6', type: 'form', order: 5, content: { title: '무료 진단 신청', buttonText: '신청하기' } }
    ],
    formFields: [
      { id: 'name', label: '이름', type: 'text', placeholder: '이름을 입력하세요', required: true },
      { id: 'phone', label: '연락처', type: 'tel', placeholder: '010-0000-0000', required: true },
      { id: 'business', label: '사업 형태', type: 'select', required: true, options: ['개인사업자', '법인사업자', '프리랜서', '직장인'] }
    ],
  },
  {
    id: 'career-sample',
    category: 'consulting',
    categoryName: '상담/컨설팅',
    name: '이직 컨설팅',
    theme: 'warm',
    themeColor: '#10B981',
    description: '연봉 30% 인상하는 이직 전략',
    thumbnail: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&h=600&fit=crop',
    preview: {
      headline: '같은 일을 해도 연봉은 다릅니다',
      subtext: '500+명의 이직 성공을 이끈 커리어 코치와 함께',
      cta: '1:1 상담 예약',
      badge: '성공률 92%',
    },
    formData: {
      title: '이직 컨설팅',
      content: '같은 일을 해도 연봉은 다릅니다. 500명 이상의 이직 성공을 이끈 커리어 코치와 함께하세요. 이력서/포트폴리오 컨설팅, 면접 코칭, 연봉 협상 전략까지. 이직 성공률 92%, 평균 연봉 상승률 32%.',
    },
    sections: [
      { id: 's1', type: 'hero', order: 0, content: { badge: '🎯 성공률 92% | 연봉 32% 상승', headline: '같은 일을 해도\n연봉은 다릅니다', subtext: '500명 이상의 이직 성공을 이끈 커리어 코치와 함께하세요.\n이력서부터 연봉 협상까지 1:1 맞춤 코칭', cta: '1:1 상담 예약' } },
      { id: 's2', type: 'pain', order: 1, content: { title: '이직 준비, 막막하신가요?', items: [{ icon: '📝', text: '이력서를 어떻게 써야 할지 모르겠어요' }, { icon: '🎤', text: '면접에서 자꾸 떨어져요' }, { icon: '💰', text: '연봉 협상을 어떻게 해야 할지...' }, { icon: '🎯', text: '나에게 맞는 회사를 찾고 싶어요' }] } },
      { id: 's3', type: 'solution', order: 2, content: { title: '전문 커리어 코치가 함께합니다', headline: '1:1 맞춤 코칭', description: '500명 이상의 이직 성공 노하우로 코칭합니다', items: [{ icon: '📝', title: '이력서 컨설팅', description: '합격하는 이력서 작성' }, { icon: '🎤', title: '면접 코칭', description: '실전 면접 시뮬레이션' }, { icon: '💰', title: '연봉 협상', description: '최적의 연봉 협상 전략' }] } },
      { id: 's4', type: 'benefits', order: 3, content: { title: '코칭 성과', items: [{ icon: '✅', title: '92%', description: '이직 성공률' }, { icon: '📈', title: '32%', description: '평균 연봉 상승' }, { icon: '👥', title: '500+', description: '이직 성공 고객' }] } },
      { id: 's5', type: 'cta', order: 4, content: { headline: '1:1 상담으로 시작하세요', subtext: '무료 커리어 진단 30분 제공', buttonText: '상담 예약하기' } },
      { id: 's6', type: 'form', order: 5, content: { title: '상담 예약', buttonText: '예약하기' } }
    ],
    formFields: [
      { id: 'name', label: '이름', type: 'text', placeholder: '이름을 입력하세요', required: true },
      { id: 'phone', label: '연락처', type: 'tel', placeholder: '010-0000-0000', required: true },
      { id: 'job', label: '현재 직무', type: 'text', placeholder: '예: 마케팅, 개발, 디자인', required: true }
    ],
  },
  // 서비스/대행
  {
    id: 'web-dev-sample',
    category: 'service',
    categoryName: '서비스/대행',
    name: '웹사이트 제작',
    theme: 'peach',
    themeColor: '#F43F5E',
    description: '비즈니스를 위한 프리미엄 웹사이트',
    thumbnail: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop',
    preview: {
      headline: '검색 1페이지에 뜨는 홈페이지를 만들어드립니다',
      subtext: '300개+ 기업이 선택한 웹사이트 전문 제작사',
      cta: '무료 견적 받기',
      badge: '제작 사례 보기',
    },
    formData: {
      title: '웹사이트 제작',
      content: '검색 1페이지에 뜨는 홈페이지를 만들어드립니다. 300개 이상 기업이 선택한 웹사이트 전문 제작사입니다. 반응형 웹, SEO 최적화, 관리자 페이지 기본 포함. 제작비 200만원부터, 유지보수 월 5만원.',
    },
    sections: [
      { id: 's1', type: 'hero', order: 0, content: { badge: '🌐 300개+ 기업 제작 경험', headline: '검색 1페이지에 뜨는\n홈페이지를 만들어드립니다', subtext: '300개 이상 기업이 선택한 웹사이트 전문 제작사.\n반응형 웹, SEO 최적화, 관리자 페이지 기본 포함', cta: '무료 견적 받기' } },
      { id: 's2', type: 'pain', order: 1, content: { title: '이런 고민 있으신가요?', items: [{ icon: '💻', text: '홈페이지가 필요한데 어디서 만들어야 할지 모르겠어요' }, { icon: '📱', text: '모바일에서도 잘 보이는 사이트가 필요해요' }, { icon: '🔍', text: '검색에 노출되는 홈페이지를 원해요' }, { icon: '💰', text: '합리적인 가격에 품질 좋은 사이트를 원해요' }] } },
      { id: 's3', type: 'solution', order: 2, content: { title: '원스톱 웹사이트 제작', headline: '기획부터 운영까지', description: '전문가가 함께합니다', items: [{ icon: '🎨', title: '맞춤 디자인', description: '브랜드에 맞는 디자인' }, { icon: '📱', title: '반응형 제작', description: 'PC, 모바일 완벽 대응' }, { icon: '🔍', title: 'SEO 최적화', description: '검색 노출 최적화' }] } },
      { id: 's4', type: 'benefits', order: 3, content: { title: '제작 실적', items: [{ icon: '🏢', title: '300+', description: '제작 기업' }, { icon: '⭐', title: '98%', description: '고객 만족도' }, { icon: '🛡️', title: '1년', description: '무료 유지보수' }] } },
      { id: 's5', type: 'cta', order: 4, content: { headline: '무료 견적 받아보세요', subtext: '상담부터 견적까지 무료입니다', buttonText: '견적 문의하기' } },
      { id: 's6', type: 'form', order: 5, content: { title: '견적 문의', buttonText: '문의하기' } }
    ],
    formFields: [
      { id: 'name', label: '담당자명', type: 'text', placeholder: '이름을 입력하세요', required: true },
      { id: 'phone', label: '연락처', type: 'tel', placeholder: '010-0000-0000', required: true },
      { id: 'company', label: '회사명', type: 'text', placeholder: '회사명을 입력하세요', required: false }
    ],
  },
  {
    id: 'video-sample',
    category: 'service',
    categoryName: '서비스/대행',
    name: '영상 제작',
    theme: 'luxury',
    themeColor: '#F59E0B',
    description: '브랜드를 빛나게 하는 영상',
    thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=600&fit=crop',
    preview: {
      headline: '조회수 100만을 만드는 영상의 비밀',
      subtext: '기획부터 편집까지, 올인원 영상 제작 서비스',
      cta: '포트폴리오 보기',
      badge: '유튜브 전문',
    },
    formData: {
      title: '영상 제작',
      content: '조회수 100만을 만드는 영상의 비밀이 있습니다. 기획부터 촬영, 편집까지 올인원 영상 제작 서비스입니다. 유튜브, 인스타그램, 틱톡 최적화 영상 제작. 숏폼 50만원부터, 롱폼 150만원부터.',
    },
    sections: [
      { id: 's1', type: 'hero', order: 0, content: { badge: '🎬 유튜브 전문 | 조회수 100만 달성', headline: '조회수 100만을 만드는\n영상의 비밀', subtext: '기획부터 촬영, 편집까지 올인원 영상 제작 서비스.\n유튜브, 인스타그램, 틱톡 최적화 영상 제작', cta: '포트폴리오 보기' } },
      { id: 's2', type: 'pain', order: 1, content: { title: '이런 고민 있으신가요?', items: [{ icon: '🎥', text: '영상이 필요한데 어디서 만들어야 할지 모르겠어요' }, { icon: '📱', text: '숏폼 콘텐츠를 만들고 싶은데 방법을 모르겠어요' }, { icon: '💰', text: '합리적인 가격에 퀄리티 있는 영상을 원해요' }, { icon: '⏰', text: '빠른 납기가 가능한 업체를 찾고 있어요' }] } },
      { id: 's3', type: 'solution', order: 2, content: { title: '올인원 영상 제작', headline: '기획부터 편집까지', description: '브랜드에 맞는 맞춤 영상을 제작합니다', items: [{ icon: '📝', title: '기획/콘티', description: '콘셉트 기획 및 스토리보드' }, { icon: '🎬', title: '촬영', description: '전문 장비로 고퀄리티 촬영' }, { icon: '✂️', title: '편집', description: '트렌디한 편집 및 효과' }] } },
      { id: 's4', type: 'benefits', order: 3, content: { title: '제작 실적', items: [{ icon: '🎬', title: '500+', description: '영상 제작' }, { icon: '👁️', title: '100만+', description: '최고 조회수' }, { icon: '⭐', title: '98%', description: '재의뢰율' }] } },
      { id: 's5', type: 'cta', order: 4, content: { headline: '영상 제작 문의하세요', subtext: '숏폼 50만원부터, 롱폼 150만원부터', buttonText: '견적 문의하기' } },
      { id: 's6', type: 'form', order: 5, content: { title: '제작 문의', buttonText: '문의하기' } }
    ],
    formFields: [
      { id: 'name', label: '담당자명', type: 'text', placeholder: '이름을 입력하세요', required: true },
      { id: 'phone', label: '연락처', type: 'tel', placeholder: '010-0000-0000', required: true },
      { id: 'type', label: '영상 종류', type: 'select', required: true, options: ['유튜브 롱폼', '숏폼(릴스/틱톡)', '브랜드 영상', '제품 영상', '기타'] }
    ],
  },
  {
    id: 'marketing-agency-sample',
    category: 'service',
    categoryName: '서비스/대행',
    name: '마케팅 대행',
    theme: 'warm',
    themeColor: '#F97316',
    description: 'SNS 마케팅 전문 대행사',
    thumbnail: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=800&h=600&fit=crop',
    preview: {
      headline: '인스타 팔로워 0에서 10만까지',
      subtext: '100개+ 브랜드의 SNS를 성장시킨 노하우',
      cta: '성장 전략 상담',
      badge: '성공 사례',
    },
    formData: {
      title: '마케팅 대행',
      content: '인스타 팔로워 0에서 10만까지 성장시켜 드립니다. 100개 이상 브랜드의 SNS를 성장시킨 노하우로 운영합니다. 콘텐츠 기획/제작, 광고 운영, 인플루언서 협업까지. 월 관리비 100만원부터.',
    },
    sections: [
      { id: 's1', type: 'hero', order: 0, content: { badge: '📈 100개+ 브랜드 성장 경험', headline: '인스타 팔로워\n0에서 10만까지', subtext: '100개 이상 브랜드의 SNS를 성장시킨 노하우.\n콘텐츠 기획/제작, 광고 운영, 인플루언서 협업까지', cta: '성장 전략 상담' } },
      { id: 's2', type: 'pain', order: 1, content: { title: '이런 고민 있으신가요?', items: [{ icon: '📱', text: 'SNS를 해야 하는데 뭘 올려야 할지 모르겠어요' }, { icon: '👥', text: '팔로워가 안 늘어요' }, { icon: '💸', text: '광고를 해도 효과가 없어요' }, { icon: '⏰', text: 'SNS 관리할 시간이 없어요' }] } },
      { id: 's3', type: 'solution', order: 2, content: { title: '올인원 SNS 마케팅', headline: '기획부터 운영까지', description: '브랜드 성장에 집중할 수 있도록 합니다', items: [{ icon: '📝', title: '콘텐츠 기획', description: '트렌드에 맞는 콘텐츠 제작' }, { icon: '📊', title: '광고 운영', description: '타겟팅 광고 최적화' }, { icon: '🤝', title: '인플루언서', description: '협업 마케팅 진행' }] } },
      { id: 's4', type: 'benefits', order: 3, content: { title: '대행 실적', items: [{ icon: '🏢', title: '100+', description: '브랜드 대행' }, { icon: '👥', title: '10만', description: '최고 팔로워 달성' }, { icon: '📈', title: '300%', description: '평균 성장률' }] } },
      { id: 's5', type: 'cta', order: 4, content: { headline: '무료 SNS 진단받으세요', subtext: '현재 계정 분석 + 성장 전략 제안', buttonText: '무료 상담 신청' } },
      { id: 's6', type: 'form', order: 5, content: { title: '상담 신청', buttonText: '신청하기' } }
    ],
    formFields: [
      { id: 'name', label: '담당자명', type: 'text', placeholder: '이름을 입력하세요', required: true },
      { id: 'phone', label: '연락처', type: 'tel', placeholder: '010-0000-0000', required: true },
      { id: 'sns', label: 'SNS 계정', type: 'text', placeholder: '@계정명 또는 URL', required: false }
    ],
  },
  // 상품/판매
  {
    id: 'ebook-sample',
    category: 'product',
    categoryName: '상품/판매',
    name: '전자책 판매',
    theme: 'warm',
    themeColor: '#14B8A6',
    description: '노하우를 담은 전자책',
    thumbnail: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=600&fit=crop',
    preview: {
      headline: '3년의 노하우를 3시간에 얻으세요',
      subtext: '1,000명이 선택한 실전 가이드북',
      cta: '지금 구매하기',
      badge: '베스트셀러',
    },
    formData: {
      title: '전자책 판매',
      content: '3년의 노하우를 3시간에 얻으세요. 1,000명이 선택한 실전 가이드북입니다. 이론이 아닌 실전에서 검증된 방법만 담았습니다. PDF 120페이지, 가격 29,900원. 7일 환불 보장.',
    },
    sections: [
      { id: 's1', type: 'hero', order: 0, content: { badge: '📚 베스트셀러 | 1,000명 구매', headline: '3년의 노하우를\n3시간에 얻으세요', subtext: '1,000명이 선택한 실전 가이드북.\n이론이 아닌 실전에서 검증된 방법만 담았습니다.', cta: '지금 구매하기' } },
      { id: 's2', type: 'pain', order: 1, content: { title: '이런 분들께 추천합니다', items: [{ icon: '🤔', text: '어디서부터 시작해야 할지 모르겠어요' }, { icon: '⏰', text: '시행착오 없이 빠르게 배우고 싶어요' }, { icon: '💡', text: '실전에서 바로 적용할 수 있는 방법이 필요해요' }, { icon: '📚', text: '검증된 노하우를 배우고 싶어요' }] } },
      { id: 's3', type: 'solution', order: 2, content: { title: '이 책에서 배우는 것들', headline: '120페이지 실전 가이드', description: '3년간의 시행착오를 압축했습니다', items: [{ icon: '🎯', title: '핵심 원리', description: '반드시 알아야 할 기본기' }, { icon: '📋', title: '실전 템플릿', description: '바로 사용 가능한 템플릿' }, { icon: '💰', title: '수익화 전략', description: '실제 수익 사례와 방법' }] } },
      { id: 's4', type: 'benefits', order: 3, content: { title: '구매 혜택', items: [{ icon: '📱', title: 'PDF', description: '모든 기기에서 열람' }, { icon: '🔄', title: '평생 업데이트', description: '새 버전 무료 제공' }, { icon: '💬', title: '질문 답변', description: '저자 직접 답변' }] } },
      { id: 's5', type: 'cta', order: 4, content: { headline: '지금 바로 시작하세요', subtext: '29,900원 | 7일 환불 보장', buttonText: '전자책 구매하기' } },
      { id: 's6', type: 'form', order: 5, content: { title: '구매 신청', buttonText: '구매하기' } }
    ],
    formFields: [
      { id: 'name', label: '이름', type: 'text', placeholder: '이름을 입력하세요', required: true },
      { id: 'email', label: '이메일', type: 'email', placeholder: 'email@example.com', required: true },
      { id: 'phone', label: '연락처', type: 'tel', placeholder: '010-0000-0000', required: true }
    ],
  },
  {
    id: 'course-sample',
    category: 'product',
    categoryName: '상품/판매',
    name: 'VOD 강의',
    theme: 'toss',
    themeColor: '#3B82F6',
    description: '언제 어디서나 배우는 온라인 강의',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop',
    preview: {
      headline: '출퇴근 시간에 완성하는 부업',
      subtext: '하루 30분, 3개월이면 월 100만원 추가 수입',
      cta: '무료 샘플 보기',
      badge: '평생 수강',
    },
    formData: {
      title: 'VOD 강의',
      content: '출퇴근 시간에 완성하는 부업입니다. 하루 30분, 3개월이면 월 100만원 추가 수입이 가능합니다. 총 48강, 평생 수강권 제공. 정가 39만원, 런칭 기념 19만원. 무료 샘플 3강 제공.',
    },
    sections: [
      { id: 's1', type: 'hero', order: 0, content: { badge: '🎓 평생 수강권 | 런칭 50% 할인', headline: '출퇴근 시간에\n완성하는 부업', subtext: '하루 30분, 3개월이면 월 100만원 추가 수입.\n총 48강, 평생 수강권 제공', cta: '무료 샘플 보기' } },
      { id: 's2', type: 'pain', order: 1, content: { title: '이런 분들께 추천합니다', items: [{ icon: '💰', text: '부수입을 만들고 싶은데 시간이 없어요' }, { icon: '📚', text: '퇴근 후에 공부할 수 있는 강의를 찾고 있어요' }, { icon: '🎯', text: '실제로 돈 버는 방법을 배우고 싶어요' }, { icon: '⏰', text: '내 속도에 맞게 학습하고 싶어요' }] } },
      { id: 's3', type: 'solution', order: 2, content: { title: '이 강의에서 배우는 것', headline: '48강 완벽 커리큘럼', description: '기초부터 수익화까지 전 과정', items: [{ icon: '📖', title: '기초 다지기', description: '핵심 개념 완벽 이해' }, { icon: '💻', title: '실전 스킬', description: '바로 적용 가능한 기술' }, { icon: '💰', title: '수익화', description: '월 100만원 만들기' }] } },
      { id: 's4', type: 'benefits', order: 3, content: { title: '수강 혜택', items: [{ icon: '♾️', title: '평생 수강', description: '한 번 구매로 평생' }, { icon: '📱', title: '모바일 수강', description: '언제 어디서나' }, { icon: '💬', title: '질문 답변', description: '무제한 Q&A' }] } },
      { id: 's5', type: 'cta', order: 4, content: { headline: '런칭 기념 50% 할인', subtext: '정가 39만원 → 19만원 | 무료 샘플 3강 제공', buttonText: '수강 신청하기' } },
      { id: 's6', type: 'form', order: 5, content: { title: '수강 신청', buttonText: '신청하기' } }
    ],
    formFields: [
      { id: 'name', label: '이름', type: 'text', placeholder: '이름을 입력하세요', required: true },
      { id: 'email', label: '이메일', type: 'email', placeholder: 'email@example.com', required: true },
      { id: 'phone', label: '연락처', type: 'tel', placeholder: '010-0000-0000', required: true }
    ],
  },
  {
    id: 'membership-sample',
    category: 'product',
    categoryName: '상품/판매',
    name: '멤버십 커뮤니티',
    theme: 'dark',
    themeColor: '#8B5CF6',
    description: '함께 성장하는 커뮤니티',
    thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop',
    preview: {
      headline: '혼자 공부하면 한계가 있습니다',
      subtext: '500명의 동료와 함께하는 성장 커뮤니티',
      cta: '멤버십 가입하기',
      badge: '7일 무료 체험',
    },
    formData: {
      title: '멤버십 커뮤니티',
      content: '혼자 공부하면 한계가 있습니다. 500명의 동료와 함께하는 성장 커뮤니티입니다. 주간 라이브 세션, 전용 네트워킹 채널, 자료실 무제한 이용. 월 5만원, 7일 무료 체험 가능.',
    },
    sections: [
      { id: 's1', type: 'hero', order: 0, content: { badge: '👥 500명 멤버 | 7일 무료 체험', headline: '혼자 공부하면\n한계가 있습니다', subtext: '500명의 동료와 함께하는 성장 커뮤니티.\n주간 라이브 세션, 전용 네트워킹 채널, 자료실 무제한 이용', cta: '멤버십 가입하기' } },
      { id: 's2', type: 'pain', order: 1, content: { title: '이런 경험 있으신가요?', items: [{ icon: '😔', text: '혼자 공부하니 동기부여가 안 돼요' }, { icon: '🤷', text: '막히면 물어볼 곳이 없어요' }, { icon: '📚', text: '어떤 자료를 봐야 할지 모르겠어요' }, { icon: '👥', text: '같은 관심사를 가진 사람들을 만나고 싶어요' }] } },
      { id: 's3', type: 'solution', order: 2, content: { title: '멤버십 혜택', headline: '함께 성장하는 커뮤니티', description: '혼자가 아닌 함께 성장합니다', items: [{ icon: '🎥', title: '주간 라이브', description: '매주 전문가 라이브 세션' }, { icon: '💬', title: '네트워킹', description: '멤버 전용 채널' }, { icon: '📁', title: '자료실', description: '엄선된 자료 무제한' }] } },
      { id: 's4', type: 'benefits', order: 3, content: { title: '멤버 현황', items: [{ icon: '👥', title: '500+', description: '활동 멤버' }, { icon: '🎥', title: '100+', description: '라이브 아카이브' }, { icon: '⭐', title: '95%', description: '재가입률' }] } },
      { id: 's5', type: 'cta', order: 4, content: { headline: '7일 무료 체험 시작하세요', subtext: '월 5만원 | 언제든 취소 가능', buttonText: '무료 체험 시작' } },
      { id: 's6', type: 'form', order: 5, content: { title: '멤버십 가입', buttonText: '가입하기' } }
    ],
    formFields: [
      { id: 'name', label: '이름', type: 'text', placeholder: '이름을 입력하세요', required: true },
      { id: 'email', label: '이메일', type: 'email', placeholder: 'email@example.com', required: true },
      { id: 'phone', label: '연락처', type: 'tel', placeholder: '010-0000-0000', required: true }
    ],
  },
  // 이벤트/모집
  {
    id: 'seminar-sample',
    category: 'event',
    categoryName: '이벤트/모집',
    name: '무료 세미나',
    theme: 'yellow',
    themeColor: '#EAB308',
    description: '업계 전문가와 함께하는 세미나',
    thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
    preview: {
      headline: '2026년 트렌드를 먼저 알려드립니다',
      subtext: '업계 TOP 10 전문가가 모였습니다',
      cta: '세미나 신청하기',
      badge: '무료 참가',
    },
    formData: {
      title: '무료 세미나',
      content: '2026년 트렌드를 먼저 알려드립니다. 업계 TOP 10 전문가가 모였습니다. 일시: 1월 15일 오후 2시, 장소: 강남 코엑스. 무료 참가, 선착순 200명 한정. 참가자 전원 자료집 증정.',
    },
    sections: [
      { id: 's1', type: 'hero', order: 0, content: { badge: '🎤 무료 참가 | 선착순 200명', headline: '2026년 트렌드를\n먼저 알려드립니다', subtext: '업계 TOP 10 전문가가 한 자리에 모였습니다.\n참가자 전원 자료집 증정', cta: '세미나 신청하기' } },
      { id: 's2', type: 'pain', order: 1, content: { title: '이런 분들께 추천합니다', items: [{ icon: '📈', text: '업계 트렌드를 빠르게 파악하고 싶으신 분' }, { icon: '🤝', text: '현장에서 네트워킹 기회를 원하시는 분' }, { icon: '💡', text: '전문가의 인사이트를 얻고 싶으신 분' }, { icon: '📚', text: '최신 정보와 자료가 필요하신 분' }] } },
      { id: 's3', type: 'solution', order: 2, content: { title: '세미나 프로그램', headline: '4시간 집중 세션', description: '10명의 전문가가 2026년 트렌드를 분석합니다', items: [{ icon: '🎯', title: '키노트 발표', description: '업계 리더의 트렌드 전망' }, { icon: '💬', title: '패널 토론', description: '전문가 Q&A 세션' }, { icon: '🤝', title: '네트워킹', description: '참가자 교류 시간' }] } },
      { id: 's4', type: 'benefits', order: 3, content: { title: '참가 혜택', items: [{ icon: '📖', title: '자료집', description: '50페이지 트렌드 리포트' }, { icon: '🎥', title: '녹화본', description: '세미나 영상 제공' }, { icon: '💬', title: '커뮤니티', description: '참가자 네트워크' }] } },
      { id: 's5', type: 'cta', order: 4, content: { headline: '무료 세미나 참가 신청', subtext: '1월 15일(수) 오후 2시 | 강남 코엑스', buttonText: '참가 신청하기' } },
      { id: 's6', type: 'form', order: 5, content: { title: '참가 신청', buttonText: '신청하기' } }
    ],
    formFields: [
      { id: 'name', label: '이름', type: 'text', placeholder: '이름을 입력하세요', required: true },
      { id: 'phone', label: '연락처', type: 'tel', placeholder: '010-0000-0000', required: true },
      { id: 'email', label: '이메일', type: 'email', placeholder: 'email@example.com', required: true }
    ],
  },
  {
    id: 'workshop-sample',
    category: 'event',
    categoryName: '이벤트/모집',
    name: '원데이 클래스',
    theme: 'lime',
    themeColor: '#84CC16',
    description: '하루만에 배우는 실전 스킬',
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
    preview: {
      headline: '토요일 하루, 인생이 바뀝니다',
      subtext: '소수 정예 10명, 밀착 코칭',
      cta: '클래스 신청',
      badge: '소수 정예',
    },
    formData: {
      title: '원데이 클래스',
      content: '토요일 하루, 인생이 바뀝니다. 소수 정예 10명, 밀착 코칭으로 진행됩니다. 일시: 매주 토요일 10시-18시, 장소: 홍대입구역 도보 3분. 수강료 15만원, 점심 제공.',
    },
    sections: [
      { id: 's1', type: 'hero', order: 0, content: { badge: '👥 소수 정예 10명 | 밀착 코칭', headline: '토요일 하루,\n인생이 바뀝니다', subtext: '소수 정예 10명, 강사 1:1 밀착 코칭.\n하루 만에 핵심 스킬을 완전히 익힙니다.', cta: '클래스 신청하기' } },
      { id: 's2', type: 'pain', order: 1, content: { title: '이런 분들께 딱 맞습니다', items: [{ icon: '⏰', text: '시간이 없어서 긴 강의를 듣기 어려운 분' }, { icon: '📚', text: '온라인 강의로는 뭔가 부족한 분' }, { icon: '👨‍🏫', text: '직접 피드백 받으면서 배우고 싶은 분' }, { icon: '🎯', text: '하루 만에 실력을 끌어올리고 싶은 분' }] } },
      { id: 's3', type: 'solution', order: 2, content: { title: '클래스 커리큘럼', headline: '8시간 집중 코스', description: '이론 + 실습 + 피드백의 완벽한 조합', items: [{ icon: '📖', title: '오전 세션', description: '핵심 이론 및 시연' }, { icon: '💻', title: '오후 실습', description: '개인 프로젝트 진행' }, { icon: '📝', title: '1:1 피드백', description: '강사 직접 코칭' }] } },
      { id: 's4', type: 'benefits', order: 3, content: { title: '수강 혜택', items: [{ icon: '🍽️', title: '점심 제공', description: '맛있는 식사 포함' }, { icon: '📁', title: '자료 제공', description: '실습 자료 전체 제공' }, { icon: '💬', title: 'AS 지원', description: '수강 후 질문 답변' }] } },
      { id: 's5', type: 'cta', order: 4, content: { headline: '이번 주 토요일 클래스', subtext: '15만원 | 10시-18시 | 홍대입구역 도보 3분', buttonText: '클래스 신청하기' } },
      { id: 's6', type: 'form', order: 5, content: { title: '클래스 신청', buttonText: '신청하기' } }
    ],
    formFields: [
      { id: 'name', label: '이름', type: 'text', placeholder: '이름을 입력하세요', required: true },
      { id: 'phone', label: '연락처', type: 'tel', placeholder: '010-0000-0000', required: true },
      { id: 'date', label: '희망 일정', type: 'select', required: true, options: ['이번 주 토요일', '다음 주 토요일', '그 다음 주 토요일'] }
    ],
  },
  {
    id: 'study-sample',
    category: 'event',
    categoryName: '이벤트/모집',
    name: '스터디 모집',
    theme: 'sky',
    themeColor: '#0EA5E9',
    description: '함께 공부하는 스터디 그룹',
    thumbnail: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop',
    preview: {
      headline: '혼자 하면 작심삼일, 함께하면 끝까지',
      subtext: '8주 완주율 94%의 스터디 시스템',
      cta: '스터디 참여하기',
      badge: '새로운 기수',
    },
    formData: {
      title: '스터디 모집',
      content: '혼자 하면 작심삼일, 함께하면 끝까지 갑니다. 8주 완주율 94%의 스터디 시스템입니다. 매주 온라인 모임, 과제 피드백, 완주자 인증서 발급. 참가비 5만원(보증금 포함).',
    },
    sections: [
      { id: 's1', type: 'hero', order: 0, content: { badge: '📚 8주 완주율 94% | 새로운 기수 모집', headline: '혼자 하면 작심삼일\n함께하면 끝까지', subtext: '8주 완주율 94%의 검증된 스터디 시스템.\n매주 온라인 모임, 과제 피드백, 완주자 인증서 발급', cta: '스터디 참여하기' } },
      { id: 's2', type: 'pain', order: 1, content: { title: '혼자 공부하다 보면...', items: [{ icon: '😴', text: '시작할 때만 의욕적이고 금방 포기하게 돼요' }, { icon: '🤷', text: '막히면 물어볼 사람이 없어요' }, { icon: '📅', text: '혼자서는 규칙적으로 공부하기 어려워요' }, { icon: '💬', text: '같이 공부할 동료가 있으면 좋겠어요' }] } },
      { id: 's3', type: 'solution', order: 2, content: { title: '스터디 시스템', headline: '8주 완주 프로그램', description: '체계적인 시스템으로 끝까지 함께합니다', items: [{ icon: '📅', title: '주간 모임', description: '매주 온라인 정기 모임' }, { icon: '📝', title: '과제 피드백', description: '리더의 1:1 피드백' }, { icon: '👥', title: '스터디 메이트', description: '함께 성장하는 동료' }] } },
      { id: 's4', type: 'benefits', order: 3, content: { title: '참가 혜택', items: [{ icon: '📜', title: '인증서', description: '완주자 인증서 발급' }, { icon: '💰', title: '보증금 환급', description: '완주 시 전액 환급' }, { icon: '📁', title: '자료 제공', description: '학습 자료 무료 제공' }] } },
      { id: 's5', type: 'cta', order: 4, content: { headline: '새로운 기수 모집 중', subtext: '참가비 5만원 (완주 시 전액 환급)', buttonText: '스터디 참여하기' } },
      { id: 's6', type: 'form', order: 5, content: { title: '스터디 참여 신청', buttonText: '신청하기' } }
    ],
    formFields: [
      { id: 'name', label: '이름', type: 'text', placeholder: '이름을 입력하세요', required: true },
      { id: 'phone', label: '연락처', type: 'tel', placeholder: '010-0000-0000', required: true },
      { id: 'goal', label: '학습 목표', type: 'text', placeholder: '이번 스터디에서 이루고 싶은 목표', required: false }
    ],
  },
  // 부동산/분양
  {
    id: 'apartment-sample',
    category: 'realestate',
    categoryName: '부동산/분양',
    name: '아파트 분양',
    theme: 'red',
    themeColor: '#EF4444',
    description: '프리미엄 아파트 분양 안내',
    thumbnail: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
    preview: {
      headline: '강남 10분, 초역세권 프리미엄',
      subtext: '2024년 가장 주목받는 분양 단지',
      cta: '모델하우스 예약',
      badge: '특별 할인',
    },
    formData: {
      title: '아파트 분양',
      content: '강남 10분, 초역세권 프리미엄 아파트입니다. 지하철 도보 3분, 초등학교 도보 5분의 완벽한 입지. 59타입 5억대, 84타입 7억대. 계약금 10%, 중도금 무이자. 모델하우스 방문 예약 받습니다.',
    },
    sections: [
      { id: 's1', type: 'hero', order: 0, content: { badge: '🏠 특별 분양 | 중도금 무이자', headline: '강남 10분\n초역세권 프리미엄', subtext: '지하철 도보 3분, 초등학교 도보 5분.\n완벽한 입지의 프리미엄 아파트', cta: '모델하우스 예약' } },
      { id: 's2', type: 'pain', order: 1, content: { title: '내 집 마련 고민 중이신가요?', items: [{ icon: '🚇', text: '출퇴근 편한 역세권 아파트를 찾고 계신가요?' }, { icon: '🏫', text: '아이 교육을 위한 학군이 중요하신가요?' }, { icon: '💰', text: '중도금 부담을 줄이고 싶으신가요?' }, { icon: '📈', text: '미래 가치가 높은 입지를 원하시나요?' }] } },
      { id: 's3', type: 'solution', order: 2, content: { title: '프리미엄 입지', headline: '완벽한 생활 인프라', description: '모든 것이 가까운 곳', items: [{ icon: '🚇', title: '초역세권', description: '지하철 도보 3분' }, { icon: '🏫', title: '명문 학군', description: '초등학교 도보 5분' }, { icon: '🏪', title: '생활 편의', description: '대형마트, 병원 인접' }] } },
      { id: 's4', type: 'benefits', order: 3, content: { title: '분양 정보', items: [{ icon: '🏠', title: '59타입', description: '5억대~' }, { icon: '🏠', title: '84타입', description: '7억대~' }, { icon: '💳', title: '중도금', description: '무이자 지원' }] } },
      { id: 's5', type: 'cta', order: 4, content: { headline: '모델하우스 방문 예약', subtext: '계약금 10% | 중도금 무이자', buttonText: '방문 예약하기' } },
      { id: 's6', type: 'form', order: 5, content: { title: '방문 예약', buttonText: '예약하기' } }
    ],
    formFields: [
      { id: 'name', label: '이름', type: 'text', placeholder: '이름을 입력하세요', required: true },
      { id: 'phone', label: '연락처', type: 'tel', placeholder: '010-0000-0000', required: true },
      { id: 'type', label: '관심 타입', type: 'select', required: true, options: ['59타입 (5억대)', '84타입 (7억대)', '미정'] }
    ],
  },
  {
    id: 'officetel-sample',
    category: 'realestate',
    categoryName: '부동산/분양',
    name: '오피스텔 분양',
    theme: 'zinc',
    themeColor: '#71717A',
    description: '수익형 오피스텔 투자',
    thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
    preview: {
      headline: '월세 수익 보장, 안정적인 투자처',
      subtext: '역세권 프리미엄 오피스텔 분양',
      cta: '투자 상담 신청',
      badge: '임대수익률 7%',
    },
    formData: {
      title: '오피스텔 분양',
      content: '월세 수익 보장, 안정적인 투자처입니다. 역세권 프리미엄 오피스텔 분양합니다. 임대수익률 7% 보장, 2년 확정 임대 계약. 분양가 2억 5천만원, 계약금 1천만원. 투자 상담 신청하세요.',
    },
    sections: [
      { id: 's1', type: 'hero', order: 0, content: { badge: '💰 임대수익률 7% 보장', headline: '월세 수익 보장\n안정적인 투자처', subtext: '역세권 프리미엄 오피스텔 분양.\n2년 확정 임대 계약으로 안정적인 수익 보장', cta: '투자 상담 신청' } },
      { id: 's2', type: 'pain', order: 1, content: { title: '투자 고민 중이신가요?', items: [{ icon: '💰', text: '예금 금리가 너무 낮아서 답답하신가요?' }, { icon: '📉', text: '주식은 불안해서 안정적인 투자처를 찾으시나요?' }, { icon: '🏠', text: '부동산 투자를 시작하고 싶으신가요?' }, { icon: '💵', text: '매달 고정 수입이 필요하신가요?' }] } },
      { id: 's3', type: 'solution', order: 2, content: { title: '안정적인 수익 구조', headline: '역세권 프리미엄', description: '검증된 입지와 수익 보장', items: [{ icon: '🚇', title: '역세권 입지', description: '지하철 도보 2분' }, { icon: '📈', title: '수익률 7%', description: '임대수익률 보장' }, { icon: '📋', title: '확정 임대', description: '2년 임대 계약 체결' }] } },
      { id: 's4', type: 'benefits', order: 3, content: { title: '분양 조건', items: [{ icon: '🏢', title: '분양가', description: '2억 5천만원' }, { icon: '💳', title: '계약금', description: '1천만원' }, { icon: '💵', title: '월 수익', description: '약 145만원' }] } },
      { id: 's5', type: 'cta', order: 4, content: { headline: '투자 상담 신청하세요', subtext: '상담만 받아도 투자 가이드북 증정', buttonText: '투자 상담 신청' } },
      { id: 's6', type: 'form', order: 5, content: { title: '투자 상담 신청', buttonText: '신청하기' } }
    ],
    formFields: [
      { id: 'name', label: '이름', type: 'text', placeholder: '이름을 입력하세요', required: true },
      { id: 'phone', label: '연락처', type: 'tel', placeholder: '010-0000-0000', required: true },
      { id: 'budget', label: '투자 예산', type: 'select', required: true, options: ['2억 이하', '2~3억', '3~5억', '5억 이상'] }
    ],
  },
  // 프랜차이즈/창업
  {
    id: 'chicken-franchise-sample',
    category: 'franchise',
    categoryName: '프랜차이즈/창업',
    name: '치킨 프랜차이즈',
    theme: 'luxury',
    themeColor: '#EA580C',
    description: '전국 500호점 돌파 치킨 브랜드',
    thumbnail: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=800&h=600&fit=crop',
    preview: {
      headline: '월 순수익 1,200만원, 가능합니다',
      subtext: '본사 직영 물류, 마케팅 100% 지원',
      cta: '창업 상담 신청',
      badge: '가맹비 50% 할인',
    },
    formData: {
      title: '치킨 프랜차이즈',
      content: '전국 500호점 돌파한 검증된 치킨 브랜드입니다. 가맹비 1천만원(50% 할인 중), 인테리어 3천만원, 총 창업비용 5천만원으로 시작 가능합니다. 본사에서 물류를 직접 운영하여 원가를 낮추고, 배달앱과 SNS 마케팅을 100% 지원합니다. 월 평균 매출 4천만원, 순수익 1,200만원을 달성하고 있습니다.',
    },
    sections: [
      { id: 's1', type: 'hero', order: 0, content: { badge: '🍗 가맹비 50% 할인 | 선착순 마감', headline: '월 순수익 1,200만원\n가능합니다', subtext: '전국 500호점 돌파한 검증된 치킨 브랜드.\n본사 직영 물류, 마케팅 100% 지원으로 초보 창업도 OK.', cta: '창업 상담 신청하기' } },
      { id: 's2', type: 'pain', order: 1, content: { title: '창업 고민 중이신가요?', items: [{ icon: '💰', text: '초기 투자금이 부담되는데...' }, { icon: '📍', text: '좋은 상권을 어떻게 찾아야 할지 모르겠어요' }, { icon: '👨‍🍳', text: '요리 경험이 없어도 가능한가요?' }, { icon: '📉', text: '폐점률이 높다던데 괜찮을까요?' }] } },
      { id: 's3', type: 'solution', order: 2, content: { title: '본사가 함께합니다', headline: '체계적인 지원 시스템', description: '창업부터 운영까지 함께합니다', items: [{ icon: '📍', title: '상권 분석', description: '빅데이터 기반 입지 선정' }, { icon: '🚛', title: '직영 물류', description: '본사 직접 배송으로 원가 절감' }, { icon: '📱', title: '마케팅 지원', description: '배달앱, SNS 마케팅 100% 지원' }] } },
      { id: 's4', type: 'benefits', order: 3, content: { title: '가맹점 성과', items: [{ icon: '💰', title: '1,200만원', description: '월 평균 순수익' }, { icon: '📉', title: '3%', description: '폐점률 (업계 최저)' }, { icon: '⏱️', title: '8개월', description: '평균 손익분기점' }] } },
      { id: 's5', type: 'process', order: 4, content: { title: '창업 절차', steps: [{ number: 1, title: '상담 신청', description: '무료 창업 상담' }, { number: 2, title: '상권 분석', description: '입지 선정 및 분석' }, { number: 3, title: '계약 및 교육', description: '2주 집중 교육' }, { number: 4, title: '오픈 지원', description: '오픈 마케팅 지원' }] } },
      { id: 's6', type: 'cta', order: 5, content: { headline: '지금 가맹비 50% 할인 중', subtext: '선착순 10개 지역 한정 | 상담만 받아도 혜택', buttonText: '창업 상담 신청' } },
      { id: 's7', type: 'form', order: 6, content: { title: '창업 상담 신청', buttonText: '상담 신청하기' } }
    ],
    formFields: [
      { id: 'name', label: '이름', type: 'text', placeholder: '이름을 입력하세요', required: true },
      { id: 'phone', label: '연락처', type: 'tel', placeholder: '010-0000-0000', required: true },
      { id: 'region', label: '희망 창업 지역', type: 'text', placeholder: '예: 서울 강남구', required: true }
    ],
  },
  {
    id: 'cafe-franchise-sample',
    category: 'franchise',
    categoryName: '프랜차이즈/창업',
    name: '카페 프랜차이즈',
    theme: 'amber',
    themeColor: '#D97706',
    description: '2030이 가장 좋아하는 디저트 카페',
    thumbnail: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop',
    preview: {
      headline: '하루 매출 200만원, 비결이 있습니다',
      subtext: '인스타 핫플 브랜드, 본사 인테리어 지원',
      cta: '가맹 문의하기',
      badge: '성공 사례 공개',
    },
    formData: {
      title: '카페 프랜차이즈',
      content: '2030이 가장 좋아하는 디저트 카페 프랜차이즈입니다. 하루 매출 200만원의 비결은 인스타 바이럴 마케팅입니다. 총 창업비용 8천만원(가맹비 1천만원, 인테리어 5천만원, 장비 2천만원). 본사에서 인테리어 디자인과 SNS 마케팅을 지원합니다.',
    },
    sections: [
      { id: 's1', type: 'hero', order: 0, content: { badge: '☕ 인스타 핫플 브랜드 | 성공 사례 공개', headline: '하루 매출 200만원\n비결이 있습니다', subtext: '2030이 가장 좋아하는 디저트 카페.\n인스타 바이럴로 자연스러운 집객 효과', cta: '가맹 문의하기' } },
      { id: 's2', type: 'pain', order: 1, content: { title: '카페 창업 고민 중이신가요?', items: [{ icon: '📸', text: 'SNS에서 핫한 브랜드를 찾고 계신가요?' }, { icon: '🎨', text: '인테리어 비용이 부담되시나요?' }, { icon: '👥', text: '젊은 고객층을 타겟하고 싶으신가요?' }, { icon: '📱', text: '마케팅을 어떻게 해야 할지 모르시겠나요?' }] } },
      { id: 's3', type: 'solution', order: 2, content: { title: '본사 지원 시스템', headline: '인스타 바이럴 마케팅', description: 'SNS 마케팅은 본사가 책임집니다', items: [{ icon: '🎨', title: '인테리어 지원', description: '트렌디한 공간 디자인' }, { icon: '📱', title: 'SNS 마케팅', description: '인스타그램 콘텐츠 제공' }, { icon: '📦', title: '물류 지원', description: '원두/재료 직접 공급' }] } },
      { id: 's4', type: 'benefits', order: 3, content: { title: '창업 비용', items: [{ icon: '💰', title: '가맹비', description: '1천만원' }, { icon: '🏠', title: '인테리어', description: '5천만원' }, { icon: '⚙️', title: '장비', description: '2천만원' }] } },
      { id: 's5', type: 'cta', order: 4, content: { headline: '성공 사례를 확인하세요', subtext: '총 창업비용 8천만원 | 본사 마케팅 지원', buttonText: '가맹 문의하기' } },
      { id: 's6', type: 'form', order: 5, content: { title: '가맹 문의', buttonText: '문의하기' } }
    ],
    formFields: [
      { id: 'name', label: '이름', type: 'text', placeholder: '이름을 입력하세요', required: true },
      { id: 'phone', label: '연락처', type: 'tel', placeholder: '010-0000-0000', required: true },
      { id: 'region', label: '희망 창업 지역', type: 'text', placeholder: '예: 서울 홍대', required: true }
    ],
  },
  {
    id: 'gym-franchise-sample',
    category: 'franchise',
    categoryName: '프랜차이즈/창업',
    name: '피트니스 창업',
    theme: 'red',
    themeColor: '#DC2626',
    description: '무인 24시 피트니스 창업',
    thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop',
    preview: {
      headline: '인건비 0원, 월 순수익 800만원',
      subtext: '무인 시스템으로 운영 부담 최소화',
      cta: '창업 설명회 신청',
      badge: '무인 운영',
    },
    formData: {
      title: '피트니스 창업',
      content: '365일 24시간 운영되는 무인 피트니스 센터입니다. 총 창업비용 1억원(가맹비 1천만원, 인테리어 4천만원, 운동기구 5천만원)으로 시작 가능합니다. QR코드 무인 출입 시스템과 CCTV 원격 모니터링으로 인건비 0원 운영이 가능하며, 월 회원 200명 기준 순수익 800만원을 달성하고 있습니다.',
    },
    sections: [
      { id: 's1', type: 'hero', order: 0, content: { badge: '🏋️ 무인 운영 | 인건비 0원', headline: '인건비 0원\n월 순수익 800만원', subtext: '365일 24시간 운영되는 무인 피트니스.\nQR코드 출입, CCTV 원격 모니터링으로 운영 부담 최소화', cta: '창업 설명회 신청' } },
      { id: 's2', type: 'pain', order: 1, content: { title: '피트니스 창업 고민 중이신가요?', items: [{ icon: '👥', text: '직원 관리가 부담되시나요?' }, { icon: '💰', text: '인건비 부담이 걱정되시나요?' }, { icon: '⏰', text: '24시간 운영하고 싶은데 가능할까요?' }, { icon: '📈', text: '안정적인 월 수익을 원하시나요?' }] } },
      { id: 's3', type: 'solution', order: 2, content: { title: '무인 운영 시스템', headline: '스마트 피트니스', description: '기술로 해결하는 운영 부담', items: [{ icon: '📱', title: 'QR 출입', description: '무인 출입 시스템' }, { icon: '📹', title: 'CCTV 모니터링', description: '원격 관제 시스템' }, { icon: '💳', title: '자동 결제', description: '앱 기반 결제 시스템' }] } },
      { id: 's4', type: 'benefits', order: 3, content: { title: '수익 구조', items: [{ icon: '👥', title: '회원 200명', description: '손익분기점' }, { icon: '💰', title: '800만원', description: '월 순수익' }, { icon: '📈', title: '10개월', description: '투자금 회수' }] } },
      { id: 's5', type: 'process', order: 4, content: { title: '창업 절차', steps: [{ number: 1, title: '상담 신청', description: '무료 창업 상담' }, { number: 2, title: '입지 분석', description: '상권 및 입지 분석' }, { number: 3, title: '계약 및 공사', description: '인테리어 및 기구 설치' }, { number: 4, title: '오픈', description: '오픈 마케팅 지원' }] } },
      { id: 's6', type: 'cta', order: 5, content: { headline: '창업 설명회 참가하세요', subtext: '총 창업비용 1억원 | 무인 운영 시스템 완비', buttonText: '설명회 신청하기' } },
      { id: 's7', type: 'form', order: 6, content: { title: '설명회 신청', buttonText: '신청하기' } }
    ],
    formFields: [
      { id: 'name', label: '이름', type: 'text', placeholder: '이름을 입력하세요', required: true },
      { id: 'phone', label: '연락처', type: 'tel', placeholder: '010-0000-0000', required: true },
      { id: 'region', label: '희망 창업 지역', type: 'text', placeholder: '예: 서울 강남구', required: true }
    ],
  },
  {
    id: 'restaurant-franchise-sample',
    category: 'franchise',
    categoryName: '프랜차이즈/창업',
    name: '음식점 프랜차이즈',
    theme: 'rose',
    themeColor: '#E11D48',
    description: '배달 전문 한식 프랜차이즈',
    thumbnail: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop',
    preview: {
      headline: '배달앱 리뷰 4.9점, 비결을 공개합니다',
      subtext: '주방 경험 없어도 OK, 본사 레시피 100% 제공',
      cta: '가맹 상담 신청',
      badge: '초보 창업 OK',
    },
    formData: {
      title: '음식점 프랜차이즈',
      content: '배달앱 리뷰 4.9점의 배달 전문 한식 프랜차이즈입니다. 주방 경험 없어도 본사 레시피 100% 제공으로 누구나 창업 가능합니다. 총 창업비용 6천만원(가맹비 800만원, 인테리어 3천만원, 주방설비 2,200만원). 본사 물류 시스템으로 원가 절감.',
    },
    sections: [
      { id: 's1', type: 'hero', order: 0, content: { badge: '🍚 배달앱 리뷰 4.9점 | 초보 창업 OK', headline: '배달앱 리뷰 4.9점\n비결을 공개합니다', subtext: '주방 경험 없어도 OK! 본사 레시피 100% 제공.\n배달 전문 한식으로 높은 수익 달성', cta: '가맹 상담 신청' } },
      { id: 's2', type: 'pain', order: 1, content: { title: '음식점 창업 고민 중이신가요?', items: [{ icon: '👨‍🍳', text: '요리 경험이 없어서 걱정되시나요?' }, { icon: '📱', text: '배달앱에서 좋은 리뷰 받기 어렵지 않나요?' }, { icon: '💰', text: '초기 비용이 부담되시나요?' }, { icon: '📦', text: '식자재 원가 관리가 어렵지 않을까요?' }] } },
      { id: 's3', type: 'solution', order: 2, content: { title: '본사 지원 시스템', headline: '레시피 100% 제공', description: '초보자도 성공하는 시스템', items: [{ icon: '📋', title: '레시피 제공', description: '검증된 레시피 100% 제공' }, { icon: '📦', title: '물류 시스템', description: '본사 직접 식자재 공급' }, { icon: '📱', title: '마케팅 지원', description: '배달앱 최적화 지원' }] } },
      { id: 's4', type: 'benefits', order: 3, content: { title: '창업 비용', items: [{ icon: '💰', title: '가맹비', description: '800만원' }, { icon: '🏠', title: '인테리어', description: '3천만원' }, { icon: '🍳', title: '주방설비', description: '2,200만원' }] } },
      { id: 's5', type: 'cta', order: 4, content: { headline: '가맹 상담 신청하세요', subtext: '총 창업비용 6천만원 | 초보 창업 가능', buttonText: '가맹 상담 신청' } },
      { id: 's6', type: 'form', order: 5, content: { title: '가맹 상담', buttonText: '신청하기' } }
    ],
    formFields: [
      { id: 'name', label: '이름', type: 'text', placeholder: '이름을 입력하세요', required: true },
      { id: 'phone', label: '연락처', type: 'tel', placeholder: '010-0000-0000', required: true },
      { id: 'region', label: '희망 창업 지역', type: 'text', placeholder: '예: 경기 수원시', required: true }
    ],
  },
  // 인테리어/시공
  {
    id: 'home-interior-sample',
    category: 'interior',
    categoryName: '인테리어/시공',
    name: '주거 인테리어',
    theme: 'stone',
    themeColor: '#78716C',
    description: '감각적인 주거 공간 인테리어',
    thumbnail: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&h=600&fit=crop',
    preview: {
      headline: '당신의 공간을 호텔처럼',
      subtext: '1,000세대 시공 경험, 5년 AS 보장',
      cta: '무료 상담 받기',
      badge: '시공 사례',
    },
    formData: {
      title: '주거 인테리어',
      content: '30평대 아파트 전체 인테리어 전문 업체입니다. 평당 180만원(총 5,400만원 예상)으로 거실, 주방, 욕실, 방 3개를 모두 새롭게 리모델링합니다. 계약 전 3D 설계 시뮬레이션을 무료로 제공하여 완공 후 모습을 미리 확인할 수 있습니다. 지난 10년간 1,000세대 이상 시공 경험이 있으며, 하자 보증 5년을 제공합니다.',
    },
    sections: [
      { id: 's1', type: 'hero', order: 0, content: { badge: '🏠 1,000세대 시공 | 5년 AS 보장', headline: '당신의 공간을\n호텔처럼', subtext: '10년간 1,000세대 이상 시공 경험.\n계약 전 3D 설계 시뮬레이션 무료 제공', cta: '무료 상담 받기' } },
      { id: 's2', type: 'pain', order: 1, content: { title: '인테리어 고민 중이신가요?', items: [{ icon: '💰', text: '인테리어 비용이 얼마나 들지 걱정되시나요?' }, { icon: '🎨', text: '완성 후 모습이 마음에 들지 않을까 불안하신가요?' }, { icon: '🔧', text: '하자가 발생하면 어떻게 하나요?' }, { icon: '📅', text: '공사 기간이 길어질까 걱정되시나요?' }] } },
      { id: 's3', type: 'solution', order: 2, content: { title: '차별화된 서비스', headline: '3D 설계 시뮬레이션', description: '완공 전 미리 확인하세요', items: [{ icon: '🖥️', title: '3D 설계', description: '실제 완공 모습 미리 확인' }, { icon: '👷', title: '전문 시공', description: '10년 경력 장인 시공' }, { icon: '🛡️', title: '5년 AS', description: '하자 보증 5년' }] } },
      { id: 's4', type: 'benefits', order: 3, content: { title: '시공 실적', items: [{ icon: '🏠', title: '1,000+', description: '시공 세대' }, { icon: '⭐', title: '98%', description: '고객 만족도' }, { icon: '📅', title: '4주', description: '평균 공사 기간' }] } },
      { id: 's5', type: 'cta', order: 4, content: { headline: '무료 상담 신청하세요', subtext: '평당 180만원 | 3D 설계 무료', buttonText: '무료 상담 신청' } },
      { id: 's6', type: 'form', order: 5, content: { title: '상담 신청', buttonText: '신청하기' } }
    ],
    formFields: [
      { id: 'name', label: '이름', type: 'text', placeholder: '이름을 입력하세요', required: true },
      { id: 'phone', label: '연락처', type: 'tel', placeholder: '010-0000-0000', required: true },
      { id: 'size', label: '평수', type: 'select', required: true, options: ['20평대', '30평대', '40평대', '50평대 이상'] }
    ],
  },
  {
    id: 'office-interior-sample',
    category: 'interior',
    categoryName: '인테리어/시공',
    name: '사무실 인테리어',
    theme: 'slate',
    themeColor: '#475569',
    description: '생산성을 높이는 오피스 공간',
    thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
    preview: {
      headline: '직원 만족도 200% 높이는 사무실',
      subtext: '스타트업부터 대기업까지 300개+ 시공',
      cta: '견적 문의하기',
      badge: '포트폴리오',
    },
    formData: {
      title: '사무실 인테리어',
      content: '기업 사무실/오피스 인테리어 전문입니다. 평당 150만원(50평 기준 7,500만원)으로 업무 효율을 높이는 공간 설계를 제공합니다. 파티션, OA 바닥, 천장 타일, 조명, 에어컨 설비를 포함하며, 회사 CI를 반영한 맞춤 디자인을 진행합니다. 지난 10년간 300개 기업 시공 경험이 있습니다.',
    },
    sections: [
      { id: 's1', type: 'hero', order: 0, content: { badge: '🏢 300개+ 기업 시공 | 업무 효율 UP', headline: '직원 만족도 200%\n높이는 사무실', subtext: '스타트업부터 대기업까지 300개+ 기업 시공 경험.\n회사 CI를 반영한 맞춤 디자인', cta: '견적 문의하기' } },
      { id: 's2', type: 'pain', order: 1, content: { title: '사무실 환경 고민 중이신가요?', items: [{ icon: '😓', text: '직원들이 집중하기 어려운 환경인가요?' }, { icon: '🏢', text: '회사 이미지에 맞는 공간이 필요하신가요?' }, { icon: '📐', text: '공간 활용이 비효율적이신가요?' }, { icon: '💼', text: '회의실, 휴게실 등이 부족하신가요?' }] } },
      { id: 's3', type: 'solution', order: 2, content: { title: '업무 효율을 높이는 설계', headline: 'CI 반영 맞춤 디자인', description: '회사의 정체성을 공간에 담습니다', items: [{ icon: '🎨', title: 'CI 반영', description: '회사 브랜드 맞춤 디자인' }, { icon: '📐', title: '공간 최적화', description: '동선 분석 기반 배치' }, { icon: '💡', title: '조명 설계', description: '업무 효율 높이는 조명' }] } },
      { id: 's4', type: 'benefits', order: 3, content: { title: '시공 포함 내역', items: [{ icon: '🧱', title: '파티션', description: '유리/석고 파티션' }, { icon: '💡', title: '조명/전기', description: 'LED 조명, 콘센트' }, { icon: '❄️', title: '냉난방', description: '에어컨 설비 포함' }] } },
      { id: 's5', type: 'cta', order: 4, content: { headline: '견적 문의하세요', subtext: '평당 150만원 | 300개+ 기업 시공 경험', buttonText: '견적 문의하기' } },
      { id: 's6', type: 'form', order: 5, content: { title: '견적 문의', buttonText: '문의하기' } }
    ],
    formFields: [
      { id: 'name', label: '담당자명', type: 'text', placeholder: '이름을 입력하세요', required: true },
      { id: 'phone', label: '연락처', type: 'tel', placeholder: '010-0000-0000', required: true },
      { id: 'company', label: '회사명', type: 'text', placeholder: '회사명을 입력하세요', required: true },
      { id: 'size', label: '평수', type: 'select', required: true, options: ['30평 이하', '30~50평', '50~100평', '100평 이상'] }
    ],
  },
  {
    id: 'store-interior-sample',
    category: 'interior',
    categoryName: '인테리어/시공',
    name: '상가 인테리어',
    theme: 'neutral',
    themeColor: '#525252',
    description: '매출을 올리는 상가 디자인',
    thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
    preview: {
      headline: '인테리어 바꾸니 매출이 2배',
      subtext: '고객 동선 분석 기반 공간 설계',
      cta: '무료 컨설팅',
      badge: '매출 보장',
    },
    formData: {
      title: '상가 인테리어',
      content: '의류/잡화/화장품 매장 인테리어 전문입니다. 평당 180만원(15평 기준 2,700만원)으로 매출 상승을 위한 VMD(Visual Merchandising) 설계를 제공합니다. 상품이 돋보이는 조명 연출, 동선을 고려한 진열대 배치, 고객 체류 시간을 늘리는 공간 구성을 적용합니다.',
    },
    sections: [
      { id: 's1', type: 'hero', order: 0, content: { badge: '🏪 매출 2배 UP | VMD 설계', headline: '인테리어 바꾸니\n매출이 2배', subtext: '고객 동선 분석 기반 공간 설계.\nVMD(Visual Merchandising) 전문 업체', cta: '무료 컨설팅' } },
      { id: 's2', type: 'pain', order: 1, content: { title: '매장 운영 고민 중이신가요?', items: [{ icon: '💰', text: '매출이 정체되어 있으신가요?' }, { icon: '👥', text: '고객이 오래 머물지 않나요?' }, { icon: '🛍️', text: '상품이 잘 안 보인다는 피드백이 있나요?' }, { icon: '✨', text: '경쟁 매장보다 분위기가 떨어지나요?' }] } },
      { id: 's3', type: 'solution', order: 2, content: { title: '매출을 올리는 공간 설계', headline: 'VMD 전문 설계', description: '상품이 돋보이는 공간을 만듭니다', items: [{ icon: '💡', title: '조명 연출', description: '상품이 돋보이는 조명' }, { icon: '🚶', title: '동선 설계', description: '체류 시간 늘리는 배치' }, { icon: '🎨', title: '진열 설계', description: '구매 욕구 높이는 VMD' }] } },
      { id: 's4', type: 'benefits', order: 3, content: { title: '시공 효과', items: [{ icon: '📈', title: '2배', description: '평균 매출 상승' }, { icon: '⏰', title: '40%', description: '체류 시간 증가' }, { icon: '🛒', title: '35%', description: '객단가 상승' }] } },
      { id: 's5', type: 'cta', order: 4, content: { headline: '무료 컨설팅 받으세요', subtext: '평당 180만원 | 매출 상승 보장', buttonText: '무료 컨설팅 신청' } },
      { id: 's6', type: 'form', order: 5, content: { title: '컨설팅 신청', buttonText: '신청하기' } }
    ],
    formFields: [
      { id: 'name', label: '대표자명', type: 'text', placeholder: '이름을 입력하세요', required: true },
      { id: 'phone', label: '연락처', type: 'tel', placeholder: '010-0000-0000', required: true },
      { id: 'business', label: '업종', type: 'select', required: true, options: ['의류', '화장품', '잡화', '식품', '기타'] }
    ],
  },
  {
    id: 'kitchen-interior-sample',
    category: 'interior',
    categoryName: '인테리어/시공',
    name: '주방 리모델링',
    theme: 'zinc',
    themeColor: '#71717A',
    description: '요리가 즐거워지는 주방',
    thumbnail: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
    preview: {
      headline: '20년 된 주방, 새집처럼 바꿔드립니다',
      subtext: '싱크대+가전+시공 올인원 패키지',
      cta: '리모델링 상담',
      badge: '패키지 할인',
    },
    formData: {
      title: '주방 리모델링',
      content: '주방 전면 리모델링 전문입니다. 싱크대+가전 올인원 패키지를 800만원부터 제공합니다. 한샘, 에넥스 등 국내 1등 브랜드 싱크대에 인덕션, 후드, 빌트인 오븐을 포함한 가전 패키지를 30% 할인된 가격으로 제공합니다. 5일 내 완공합니다.',
    },
    sections: [
      { id: 's1', type: 'hero', order: 0, content: { badge: '🍳 올인원 패키지 | 30% 할인', headline: '20년 된 주방\n새집처럼 바꿔드립니다', subtext: '싱크대+가전 올인원 패키지 800만원부터.\n한샘, 에넥스 등 1등 브랜드 30% 할인', cta: '리모델링 상담' } },
      { id: 's2', type: 'pain', order: 1, content: { title: '주방 리모델링 고민 중이신가요?', items: [{ icon: '🔧', text: '싱크대가 낡아서 바꾸고 싶으신가요?' }, { icon: '💰', text: '싱크대, 가전을 따로 구매하면 비쌀 것 같으신가요?' }, { icon: '📅', text: '공사 기간이 길어질까 걱정되시나요?' }, { icon: '🏠', text: '요리하기 불편한 구조인가요?' }] } },
      { id: 's3', type: 'solution', order: 2, content: { title: '올인원 패키지', headline: '싱크대+가전 한 번에', description: '따로 사면 비싸고, 함께 사면 저렴해요', items: [{ icon: '🚰', title: '프리미엄 싱크대', description: '한샘/에넥스 1등 브랜드' }, { icon: '🍳', title: '빌트인 가전', description: '인덕션, 후드, 오븐' }, { icon: '⏰', title: '빠른 시공', description: '5일 내 완공' }] } },
      { id: 's4', type: 'benefits', order: 3, content: { title: '패키지 혜택', items: [{ icon: '💰', title: '30% 할인', description: '가전 패키지 할인' }, { icon: '🛡️', title: '3년 AS', description: '무상 AS 보장' }, { icon: '🎁', title: '사은품', description: '주방용품 세트 증정' }] } },
      { id: 's5', type: 'cta', order: 4, content: { headline: '리모델링 상담 받으세요', subtext: '800만원부터 | 5일 내 완공', buttonText: '상담 신청하기' } },
      { id: 's6', type: 'form', order: 5, content: { title: '상담 신청', buttonText: '신청하기' } }
    ],
    formFields: [
      { id: 'name', label: '이름', type: 'text', placeholder: '이름을 입력하세요', required: true },
      { id: 'phone', label: '연락처', type: 'tel', placeholder: '010-0000-0000', required: true },
      { id: 'size', label: '주방 크기', type: 'select', required: true, options: ['4평 이하', '4~6평', '6평 이상'] }
    ],
  },
  // 의료/건강
  {
    id: 'dental-sample',
    category: 'medical',
    categoryName: '의료/건강',
    name: '치과 임플란트',
    theme: 'toss',
    themeColor: '#0EA5E9',
    description: '임플란트 전문 치과',
    thumbnail: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&h=600&fit=crop',
    preview: {
      headline: '임플란트, 아프지 않게 해드립니다',
      subtext: '무통 시술, 10년 보증, 분할 결제 가능',
      cta: '무료 상담 예약',
      badge: '첫 방문 50% 할인',
    },
    formData: {
      title: '치과 임플란트',
      content: '임플란트 전문 치과입니다. 무통 시술로 아프지 않게, 10년 보증으로 안심하게 진료합니다. 임플란트 1개 80만원부터, 최대 36개월 무이자 할부 가능. 첫 방문 시 CT촬영 및 상담 50% 할인.',
    },
    sections: [
      { id: 's1', type: 'hero', order: 0, content: { badge: '🦷 첫 방문 50% 할인 | 무통 시술', headline: '임플란트\n아프지 않게 해드립니다', subtext: '무통 시술, 10년 보증, 최대 36개월 무이자.\n20년 경력 전문의가 직접 시술합니다.', cta: '무료 상담 예약' } },
      { id: 's2', type: 'pain', order: 1, content: { title: '임플란트 고민 중이신가요?', items: [{ icon: '😰', text: '임플란트 시술이 아플까봐 걱정되세요?' }, { icon: '💰', text: '비용이 부담되어 망설이고 계신가요?' }, { icon: '🔄', text: '재시술이 필요할까봐 불안하신가요?' }, { icon: '⏰', text: '시술 시간이 오래 걸릴까 걱정이신가요?' }] } },
      { id: 's3', type: 'solution', order: 2, content: { title: '걱정 없이 시술 받으세요', headline: '무통 임플란트 전문', description: '20년 경력 전문의가 책임집니다', items: [{ icon: '💉', title: '무통 시술', description: '수면/무통 마취로 편안하게' }, { icon: '🛡️', title: '10년 보증', description: '무상 A/S 보증' }, { icon: '💳', title: '36개월 무이자', description: '부담 없는 분할 결제' }, { icon: '🏥', title: '최신 장비', description: '3D CT, 네비게이션 수술' }] } },
      { id: 's4', type: 'benefits', order: 3, content: { title: '시술 안내', items: [{ icon: '🦷', title: '80만원~', description: '임플란트 1개' }, { icon: '⏱️', title: '당일 완료', description: '원데이 임플란트' }, { icon: '👨‍⚕️', title: '20년 경력', description: '전문의 직접 시술' }] } },
      { id: 's5', type: 'process', order: 4, content: { title: '시술 과정', steps: [{ number: 1, title: '정밀 진단', description: '3D CT 촬영 및 구강 상태 분석' }, { number: 2, title: '맞춤 설계', description: '디지털 시뮬레이션으로 최적의 식립 위치 결정' }, { number: 3, title: '무통 시술', description: '수면/무통 마취 하에 임플란트 식립' }, { number: 4, title: '보철 완성', description: '자연치아 같은 보철물 제작 및 장착' }] } },
      { id: 's6', type: 'philosophy', order: 5, content: { title: '환자 후기', quote: '임플란트가 이렇게 안 아플 줄 몰랐어요. 수면 마취로 잠깐 잤다 일어났더니 끝나 있었습니다. 10년 보증도 있어서 안심이 되고, 무이자 할부로 부담도 없었어요.', author: '김OO 님 (50대)', role: '앞니 임플란트 2개 시술' } },
      { id: 's7', type: 'cta', order: 6, content: { headline: '무료 상담 예약하세요', subtext: '첫 방문 CT + 상담 50% 할인', buttonText: '상담 예약하기' } },
      { id: 's8', type: 'form', order: 7, content: { title: '상담 예약', buttonText: '예약하기' } }
    ],
    formFields: [
      { id: 'name', label: '이름', type: 'text', placeholder: '이름을 입력하세요', required: true },
      { id: 'phone', label: '연락처', type: 'tel', placeholder: '010-0000-0000', required: true },
      { id: 'concern', label: '상담 내용', type: 'select', required: true, options: ['임플란트', '치아교정', '충치치료', '스케일링', '기타'] }
    ],
  },
  {
    id: 'derma-sample',
    category: 'medical',
    categoryName: '의료/건강',
    name: '피부과 시술',
    theme: 'peach',
    themeColor: '#F472B6',
    description: '피부과 레이저 시술',
    thumbnail: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&h=600&fit=crop',
    preview: {
      headline: '피부 고민, 전문의에게 맡기세요',
      subtext: '여드름, 기미, 주름 전문 피부과',
      cta: '시술 상담 예약',
      badge: '신규 고객 30% 할인',
    },
    formData: {
      title: '피부과 시술',
      content: '여드름, 기미, 주름 전문 피부과입니다. 최신 레이저 장비로 안전하고 효과적인 시술을 제공합니다. 피부과 전문의 1:1 맞춤 상담 후 시술 진행. 신규 고객 첫 시술 30% 할인.',
    },
    sections: [
      { id: 's1', type: 'hero', order: 0, content: { badge: '✨ 신규 고객 30% 할인', headline: '피부 고민\n전문의에게 맡기세요', subtext: '여드름, 기미, 주름 전문 피부과.\n최신 레이저 장비로 안전하고 효과적인 시술', cta: '시술 상담 예약' } },
      { id: 's2', type: 'pain', order: 1, content: { title: '피부 고민 있으신가요?', items: [{ icon: '😔', text: '여드름 자국이 사라지지 않나요?' }, { icon: '🌞', text: '기미, 잡티가 늘어나고 있나요?' }, { icon: '😟', text: '주름이 깊어지는 게 느껴지나요?' }, { icon: '💆', text: '모공이 넓어 고민이신가요?' }] } },
      { id: 's3', type: 'solution', order: 2, content: { title: '전문의 1:1 맞춤 시술', headline: '최신 레이저 장비', description: '피부 타입에 맞는 맞춤 시술', items: [{ icon: '🔬', title: '정밀 진단', description: '피부 분석기로 상태 체크' }, { icon: '💎', title: '맞춤 시술', description: '1:1 맞춤 치료 계획' }, { icon: '🛡️', title: '사후 관리', description: '시술 후 케어 프로그램' }, { icon: '👩‍⚕️', title: '전문의 직접 시술', description: '10년 경력 피부과 전문의' }] } },
      { id: 's4', type: 'benefits', order: 3, content: { title: '시술 프로그램', items: [{ icon: '✨', title: '레이저 토닝', description: '기미, 잡티 개선' }, { icon: '💧', title: '물광 주사', description: '피부 보습, 탄력' }, { icon: '🔄', title: '리프팅', description: '주름, 처짐 개선' }] } },
      { id: 's5', type: 'process', order: 4, content: { title: '시술 과정', steps: [{ number: 1, title: '피부 진단', description: '피부 분석기로 정밀 측정' }, { number: 2, title: '상담', description: '전문의와 1:1 맞춤 상담' }, { number: 3, title: '시술', description: '최신 장비로 안전하게 시술' }, { number: 4, title: '관리', description: '시술 후 진정 케어' }] } },
      { id: 's6', type: 'philosophy', order: 5, content: { title: '고객 후기', quote: '기미가 너무 심해서 스트레스였는데, 레이저 토닝 3회 만에 확실히 옅어졌어요. 원장님이 직접 시술해주시고 꼼꼼하게 관리해주셔서 만족합니다.', author: '이OO 님 (30대)', role: '레이저 토닝 5회 시술' } },
      { id: 's7', type: 'cta', order: 6, content: { headline: '무료 피부 상담 받으세요', subtext: '신규 고객 첫 시술 30% 할인', buttonText: '상담 예약하기' } },
      { id: 's8', type: 'form', order: 7, content: { title: '상담 예약', buttonText: '예약하기' } }
    ],
    formFields: [
      { id: 'name', label: '이름', type: 'text', placeholder: '이름을 입력하세요', required: true },
      { id: 'phone', label: '연락처', type: 'tel', placeholder: '010-0000-0000', required: true },
      { id: 'concern', label: '고민 부위', type: 'select', required: true, options: ['여드름/흉터', '기미/잡티', '주름/탄력', '모공/피지', '기타'] }
    ],
  },
  {
    id: 'oriental-sample',
    category: 'medical',
    categoryName: '의료/건강',
    name: '한의원 다이어트',
    theme: 'warm',
    themeColor: '#10B981',
    description: '한방 다이어트 프로그램',
    thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop',
    preview: {
      headline: '요요 없는 건강한 다이어트',
      subtext: '한방 체질 분석으로 맞춤 다이어트',
      cta: '체질 진단 예약',
      badge: '무료 체질 진단',
    },
    formData: {
      title: '한의원 다이어트',
      content: '요요 없는 건강한 다이어트. 한방 체질 분석으로 나에게 맞는 다이어트 방법을 찾아드립니다. 한약, 침 치료, 식단 관리를 병행한 프로그램. 2개월 평균 8kg 감량.',
    },
    sections: [
      { id: 's1', type: 'hero', order: 0, content: { badge: '🌿 무료 체질 진단 | 2개월 8kg', headline: '요요 없는\n건강한 다이어트', subtext: '한방 체질 분석으로 맞춤 다이어트.\n한약, 침 치료, 식단 관리 통합 프로그램', cta: '체질 진단 예약' } },
      { id: 's2', type: 'pain', order: 1, content: { title: '다이어트 고민 있으신가요?', items: [{ icon: '🔄', text: '다이어트 할 때마다 요요가 오나요?' }, { icon: '😫', text: '굶어도 살이 안 빠지나요?' }, { icon: '💊', text: '다이어트 약 부작용이 걱정되시나요?' }, { icon: '🍽️', text: '뭘 먹어야 할지 모르겠나요?' }] } },
      { id: 's3', type: 'solution', order: 2, content: { title: '체질에 맞는 맞춤 다이어트', headline: '한방 통합 프로그램', description: '체질 분석 → 맞춤 처방 → 건강한 감량', items: [{ icon: '🔍', title: '체질 분석', description: '8체질 정밀 진단' }, { icon: '🌿', title: '한약 처방', description: '맞춤 한약 처방' }, { icon: '🍽️', title: '식단 관리', description: '체질별 식단 가이드' }] } },
      { id: 's4', type: 'benefits', order: 3, content: { title: '프로그램 성과', items: [{ icon: '⚖️', title: '8kg', description: '2개월 평균 감량' }, { icon: '👥', title: '2,000+', description: '다이어트 성공 고객' }, { icon: '📉', title: '15%', description: '요요 발생률' }] } },
      { id: 's5', type: 'process', order: 4, content: { title: '다이어트 과정', steps: [{ number: 1, title: '체질 진단', description: '8체질 분석 및 체성분 측정' }, { number: 2, title: '맞춤 처방', description: '체질별 한약 및 식단 처방' }, { number: 3, title: '집중 관리', description: '침 치료, 부항, 관리 프로그램' }, { number: 4, title: '유지 관리', description: '요요 방지 생활습관 코칭' }] } },
      { id: 's6', type: 'philosophy', order: 5, content: { title: '다이어트 후기', quote: '30대 되면서 갑자기 살이 쪄서 고민이었는데, 체질 맞춤 한약 먹고 2개월 만에 10kg 빠졌어요. 굶지 않고 건강하게 빠져서 요요도 없네요.', author: '박OO 님 (30대 여성)', role: '2개월 10kg 감량 성공' } },
      { id: 's7', type: 'cta', order: 6, content: { headline: '무료 체질 진단 받으세요', subtext: '상담만 받아도 체질별 식단표 증정', buttonText: '체질 진단 예약' } },
      { id: 's8', type: 'form', order: 7, content: { title: '체질 진단 예약', buttonText: '예약하기' } }
    ],
    formFields: [
      { id: 'name', label: '이름', type: 'text', placeholder: '이름을 입력하세요', required: true },
      { id: 'phone', label: '연락처', type: 'tel', placeholder: '010-0000-0000', required: true },
      { id: 'goal', label: '목표 감량', type: 'select', required: true, options: ['5kg 이하', '5~10kg', '10~15kg', '15kg 이상'] }
    ],
  },
  // 보험 세부 샘플
  {
    id: 'car-insurance-sample',
    category: 'consulting',
    categoryName: '상담/컨설팅',
    name: '자동차보험 비교',
    theme: 'toss',
    themeColor: '#3B82F6',
    description: '자동차보험료 비교 견적',
    thumbnail: 'https://images.unsplash.com/photo-1449965408869-ebd3fee56da3?w=800&h=600&fit=crop',
    preview: {
      headline: '자동차보험료, 30초만에 비교하세요',
      subtext: '11개 보험사 한번에 비교, 최저가 찾기',
      cta: '보험료 비교하기',
      badge: '최대 35% 절약',
    },
    formData: {
      title: '자동차보험 비교',
      content: '자동차보험료, 30초만에 비교하세요. 11개 보험사 한번에 비교해서 최저가를 찾아드립니다. 온라인 가입 시 최대 35% 할인. 무료 비교 견적 받아보세요.',
    },
    sections: [
      { id: 's1', type: 'hero', order: 0, content: { badge: '🚗 최대 35% 절약 | 11개사 비교', headline: '자동차보험료\n30초만에 비교하세요', subtext: '11개 보험사 한번에 비교.\n온라인 가입 시 최대 35% 할인 적용', cta: '보험료 비교하기' } },
      { id: 's2', type: 'pain', order: 1, content: { title: '자동차보험 갱신 시기인가요?', items: [{ icon: '💰', text: '작년보다 보험료가 올랐나요?' }, { icon: '🔍', text: '어떤 보험사가 저렴한지 모르겠나요?' }, { icon: '⏰', text: '보험사마다 비교하기 번거로우신가요?' }, { icon: '📋', text: '내게 맞는 특약이 뭔지 모르겠나요?' }] } },
      { id: 's3', type: 'solution', order: 2, content: { title: '한번에 비교하세요', headline: '11개 보험사 비교', description: '30초 만에 최저가 찾기', items: [{ icon: '🔄', title: '실시간 비교', description: '11개 보험사 동시 비교' }, { icon: '💰', title: '최저가 보장', description: '최대 35% 절약' }, { icon: '📱', title: '간편 가입', description: '온라인으로 바로 가입' }] } },
      { id: 's4', type: 'benefits', order: 3, content: { title: '비교 서비스 혜택', items: [{ icon: '🏢', title: '11개사', description: '주요 보험사 전체' }, { icon: '⏱️', title: '30초', description: '비교 소요 시간' }, { icon: '💵', title: '35%', description: '평균 절약률' }] } },
      { id: 's5', type: 'process', order: 4, content: { title: '비교 절차', steps: [{ number: 1, title: '정보 입력', description: '차량 정보, 운전자 정보 입력' }, { number: 2, title: '실시간 비교', description: '11개 보험사 보험료 비교' }, { number: 3, title: '최저가 확인', description: '가장 저렴한 보험사 안내' }, { number: 4, title: '간편 가입', description: '원하는 보험사로 바로 가입' }] } },
      { id: 's6', type: 'philosophy', order: 5, content: { title: '고객 후기', quote: '매년 갱신할 때마다 그냥 같은 곳에서 했는데, 여기서 비교하니까 연 30만원이나 저렴한 곳이 있었어요. 비교 안 했으면 큰 손해 볼 뻔했네요.', author: '최OO 님 (40대)', role: '연간 30만원 절약' } },
      { id: 's7', type: 'cta', order: 6, content: { headline: '무료 비교 견적 받으세요', subtext: '비교만 해도 커피 쿠폰 증정', buttonText: '보험료 비교하기' } },
      { id: 's8', type: 'form', order: 7, content: { title: '보험료 비교', buttonText: '비교하기' } }
    ],
    formFields: [
      { id: 'name', label: '이름', type: 'text', placeholder: '이름을 입력하세요', required: true },
      { id: 'phone', label: '연락처', type: 'tel', placeholder: '010-0000-0000', required: true },
      { id: 'car', label: '차량 정보', type: 'text', placeholder: '예: 2020년식 소나타', required: true }
    ],
  },
  {
    id: 'life-insurance-sample',
    category: 'consulting',
    categoryName: '상담/컨설팅',
    name: '종신보험 상담',
    theme: 'dark',
    themeColor: '#6366F1',
    description: '가족을 위한 종신보험',
    thumbnail: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop',
    preview: {
      headline: '사랑하는 가족을 위한 준비',
      subtext: '종신보험 전문 설계사가 맞춤 설계',
      cta: '무료 상담 신청',
      badge: '맞춤 설계',
    },
    formData: {
      title: '종신보험 상담',
      content: '사랑하는 가족을 위한 준비, 종신보험. 전문 설계사가 가족 상황에 맞는 보장을 설계해드립니다. 월 보험료 5만원부터. 무료 상담 후 가입 여부 결정하세요.',
    },
    sections: [
      { id: 's1', type: 'hero', order: 0, content: { badge: '👨‍👩‍👧‍👦 가족 맞춤 설계 | 무료 상담', headline: '사랑하는 가족을\n위한 준비', subtext: '종신보험 전문 설계사가 가족 상황에 맞는\n최적의 보장을 설계해드립니다.', cta: '무료 상담 신청' } },
      { id: 's2', type: 'pain', order: 1, content: { title: '이런 고민 있으신가요?', items: [{ icon: '👨‍👩‍👧', text: '가장으로서 가족 보장이 걱정되시나요?' }, { icon: '💰', text: '적정 보장 금액이 얼마인지 모르겠나요?' }, { icon: '📋', text: '이미 가입한 보험과 중복되진 않을까요?' }, { icon: '🔍', text: '어떤 상품이 좋은지 비교가 어려우신가요?' }] } },
      { id: 's3', type: 'solution', order: 2, content: { title: '전문 설계사가 함께합니다', headline: '맞춤 보장 설계', description: '가족 상황을 분석해 최적의 보장을 제안합니다', items: [{ icon: '📊', title: '가족 분석', description: '가족 구성, 소득, 부채 분석' }, { icon: '🎯', title: '맞춤 설계', description: '필요 보장 금액 산출' }, { icon: '💼', title: '상품 비교', description: '여러 보험사 상품 비교' }] } },
      { id: 's4', type: 'benefits', order: 3, content: { title: '상담 혜택', items: [{ icon: '📋', title: '보장 분석', description: '기존 보험 무료 분석' }, { icon: '💰', title: '5만원~', description: '월 보험료' }, { icon: '🎁', title: '사은품', description: '상담 시 커피쿠폰' }] } },
      { id: 's5', type: 'process', order: 4, content: { title: '상담 과정', steps: [{ number: 1, title: '상담 신청', description: '온라인으로 간편 신청' }, { number: 2, title: '가족 분석', description: '가족 구성 및 재정 상황 분석' }, { number: 3, title: '보장 설계', description: '최적의 보장 금액 산출' }, { number: 4, title: '상품 비교', description: '여러 보험사 상품 비교 제안' }] } },
      { id: 's6', type: 'philosophy', order: 5, content: { title: '고객 후기', quote: '아이 둘 아빠로서 종신보험 필요성은 알았는데 어디서 어떻게 해야 할지 몰랐어요. 상담받고 나니 딱 맞는 보장을 합리적인 가격에 준비할 수 있었습니다.', author: '김OO 님 (40대 가장)', role: '종신보험 가입 완료' } },
      { id: 's7', type: 'cta', order: 6, content: { headline: '무료 상담 신청하세요', subtext: '부담 없이 상담만 받아보세요', buttonText: '상담 신청하기' } },
      { id: 's8', type: 'form', order: 7, content: { title: '상담 신청', buttonText: '신청하기' } }
    ],
    formFields: [
      { id: 'name', label: '이름', type: 'text', placeholder: '이름을 입력하세요', required: true },
      { id: 'phone', label: '연락처', type: 'tel', placeholder: '010-0000-0000', required: true },
      { id: 'age', label: '연령대', type: 'select', required: true, options: ['30대', '40대', '50대', '60대 이상'] }
    ],
  },
  {
    id: 'health-insurance-sample',
    category: 'consulting',
    categoryName: '상담/컨설팅',
    name: '실비보험 리모델링',
    theme: 'warm',
    themeColor: '#10B981',
    description: '실손보험 갱신/전환 상담',
    thumbnail: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop',
    preview: {
      headline: '실비보험, 그대로 두면 손해입니다',
      subtext: '4세대 실비로 갱신해야 보험료 절감',
      cta: '실비 진단받기',
      badge: '보험료 절감',
    },
    formData: {
      title: '실비보험 리모델링',
      content: '실비보험, 그대로 두면 손해입니다. 4세대 실비로 전환하면 보험료를 절감할 수 있습니다. 현재 가입된 실비 분석 후 최적의 전환 방법을 안내해드립니다. 무료 진단 신청하세요.',
    },
    sections: [
      { id: 's1', type: 'hero', order: 0, content: { badge: '💊 실비 진단 무료 | 보험료 절감', headline: '실비보험\n그대로 두면 손해입니다', subtext: '4세대 실비로 전환하면 보험료 절감 가능.\n현재 실비 분석 후 최적의 방법을 안내드립니다.', cta: '실비 진단받기' } },
      { id: 's2', type: 'pain', order: 1, content: { title: '실비보험 고민 있으신가요?', items: [{ icon: '📈', text: '실비 보험료가 계속 오르고 있나요?' }, { icon: '🔄', text: '갱신할 때마다 보험료가 부담되나요?' }, { icon: '❓', text: '4세대 실비 전환이 유리한지 모르겠나요?' }, { icon: '📋', text: '중복 가입된 특약은 없는지 궁금하신가요?' }] } },
      { id: 's3', type: 'solution', order: 2, content: { title: '실비 전문가가 진단합니다', headline: '맞춤 리모델링', description: '현재 상황에 맞는 최적의 방법 제안', items: [{ icon: '🔍', title: '실비 분석', description: '현재 보장/보험료 분석' }, { icon: '💡', title: '전환 진단', description: '4세대 전환 유불리 판단' }, { icon: '💰', title: '절감 설계', description: '보험료 절감 방안 제안' }] } },
      { id: 's4', type: 'benefits', order: 3, content: { title: '진단 결과', items: [{ icon: '💵', title: '평균 23%', description: '보험료 절감' }, { icon: '👥', title: '3,000+', description: '진단 완료 고객' }, { icon: '⏱️', title: '10분', description: '진단 소요 시간' }] } },
      { id: 's5', type: 'process', order: 4, content: { title: '진단 과정', steps: [{ number: 1, title: '진단 신청', description: '온라인으로 간편 신청' }, { number: 2, title: '실비 분석', description: '현재 보장 내용 분석' }, { number: 3, title: '전환 진단', description: '4세대 전환 유불리 판단' }, { number: 4, title: '결과 안내', description: '최적의 방법 제안' }] } },
      { id: 's6', type: 'philosophy', order: 5, content: { title: '고객 후기', quote: '2세대 실비라 갱신될 때마다 보험료가 올라 고민이었는데, 4세대로 전환하니까 보장은 그대로인데 보험료가 월 3만원이나 줄었어요.', author: '이OO 님 (50대)', role: '월 3만원 절감' } },
      { id: 's7', type: 'cta', order: 6, content: { headline: '무료 실비 진단받으세요', subtext: '진단만 받아도 보험 체크리스트 증정', buttonText: '실비 진단받기' } },
      { id: 's8', type: 'form', order: 7, content: { title: '실비 진단 신청', buttonText: '신청하기' } }
    ],
    formFields: [
      { id: 'name', label: '이름', type: 'text', placeholder: '이름을 입력하세요', required: true },
      { id: 'phone', label: '연락처', type: 'tel', placeholder: '010-0000-0000', required: true },
      { id: 'type', label: '실비 종류', type: 'select', required: true, options: ['1세대 (2009년 이전)', '2세대 (2009~2017)', '3세대 (2017~2021)', '4세대 (2021년 이후)', '모름'] }
    ],
  },
  {
    id: 'child-insurance-sample',
    category: 'consulting',
    categoryName: '상담/컨설팅',
    name: '어린이보험 가입',
    theme: 'peach',
    themeColor: '#F472B6',
    description: '태아/어린이 보험 전문',
    thumbnail: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=600&fit=crop',
    preview: {
      headline: '아이의 평생 건강, 지금 준비하세요',
      subtext: '태아부터 가입 가능한 어린이보험',
      cta: '보험 상담받기',
      badge: '태아 가입 가능',
    },
    formData: {
      title: '어린이보험 가입',
      content: '아이의 평생 건강, 지금 준비하세요. 태아 때 가입하면 선천 질환도 보장받을 수 있습니다. 100세 만기 어린이보험으로 평생 보장. 전문 설계사가 맞춤 설계해드립니다.',
    },
    sections: [
      { id: 's1', type: 'hero', order: 0, content: { badge: '👶 태아 가입 가능 | 100세 보장', headline: '아이의 평생 건강\n지금 준비하세요', subtext: '태아 때 가입하면 선천 질환도 보장.\n100세 만기로 평생 보장받는 어린이보험', cta: '보험 상담받기' } },
      { id: 's2', type: 'pain', order: 1, content: { title: '아이 보험 고민 중이신가요?', items: [{ icon: '🤰', text: '태아보험은 언제 가입해야 하나요?' }, { icon: '👶', text: '어떤 보장이 꼭 필요한지 모르겠어요' }, { icon: '💰', text: '적정 보험료가 얼마인지 궁금해요' }, { icon: '📋', text: '여러 보험사 비교가 어려워요' }] } },
      { id: 's3', type: 'solution', order: 2, content: { title: '전문 설계사가 도와드립니다', headline: '맞춤 어린이보험', description: '아이에게 꼭 필요한 보장만 설계', items: [{ icon: '🛡️', title: '질병 보장', description: '암, 뇌, 심장 질환 보장' }, { icon: '🏥', title: '입원/수술', description: '입원비, 수술비 보장' }, { icon: '📅', title: '100세 만기', description: '평생 보장 가능' }] } },
      { id: 's4', type: 'benefits', order: 3, content: { title: '가입 안내', items: [{ icon: '🤰', title: '16주~', description: '태아 가입 시기' }, { icon: '💰', title: '3만원~', description: '월 보험료' }, { icon: '📋', title: '5개사', description: '보험사 비교 설계' }] } },
      { id: 's5', type: 'process', order: 4, content: { title: '가입 과정', steps: [{ number: 1, title: '상담 신청', description: '온라인/전화 상담 신청' }, { number: 2, title: '맞춤 설계', description: '아이 상황에 맞는 보장 설계' }, { number: 3, title: '상품 비교', description: '5개 보험사 상품 비교' }, { number: 4, title: '가입 완료', description: '최적의 상품으로 가입' }] } },
      { id: 's6', type: 'philosophy', order: 5, content: { title: '부모님 후기', quote: '임신 중에 태아보험 가입했는데, 아이가 태어나서 황달 치료받을 때 보험금 받았어요. 미리 가입해두길 정말 잘했다고 생각해요.', author: '정OO 님 (30대 엄마)', role: '태아보험 가입 후 보험금 수령' } },
      { id: 's7', type: 'cta', order: 6, content: { headline: '무료 보험 상담받으세요', subtext: '상담만 받아도 육아용품 증정', buttonText: '보험 상담받기' } },
      { id: 's8', type: 'form', order: 7, content: { title: '보험 상담 신청', buttonText: '신청하기' } }
    ],
    formFields: [
      { id: 'name', label: '이름', type: 'text', placeholder: '이름을 입력하세요', required: true },
      { id: 'phone', label: '연락처', type: 'tel', placeholder: '010-0000-0000', required: true },
      { id: 'child', label: '자녀 상태', type: 'select', required: true, options: ['임신 중 (태아)', '0~3세', '4~7세', '8~12세', '13세 이상'] }
    ],
  },
  {
    id: 'insurance-recruit-sample',
    category: 'consulting',
    categoryName: '상담/컨설팅',
    name: '보험설계사 모집',
    theme: 'luxury',
    themeColor: '#F59E0B',
    description: '보험설계사 리쿠르팅',
    thumbnail: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=800&h=600&fit=crop',
    preview: {
      headline: '월 1,000만원 설계사의 비결',
      subtext: '업계 최고 수수료, 체계적인 교육 지원',
      cta: '입사 상담 신청',
      badge: '경력/신입 환영',
    },
    formData: {
      title: '보험설계사 모집',
      content: '월 1,000만원 버는 설계사의 비결이 있습니다. 업계 최고 수준 수수료율과 체계적인 교육 시스템으로 성공을 지원합니다. 경력/신입 모두 환영. 입사 상담 신청하세요.',
    },
    sections: [
      { id: 's1', type: 'hero', order: 0, content: { badge: '💼 경력/신입 환영 | 최고 수수료', headline: '월 1,000만원\n설계사의 비결', subtext: '업계 최고 수준 수수료율.\n체계적인 교육 시스템으로 성공을 지원합니다.', cta: '입사 상담 신청' } },
      { id: 's2', type: 'pain', order: 1, content: { title: '이직/전직 고민 중이신가요?', items: [{ icon: '💰', text: '현재 수수료율에 만족하지 못하시나요?' }, { icon: '📚', text: '체계적인 교육이 부족하다고 느끼시나요?' }, { icon: '👥', text: '영업 지원이 부족하다고 느끼시나요?' }, { icon: '🎯', text: '더 좋은 환경에서 일하고 싶으신가요?' }] } },
      { id: 's3', type: 'solution', order: 2, content: { title: '성공을 위한 최적의 환경', headline: '업계 최고 대우', description: '설계사님의 성공이 우리의 성공입니다', items: [{ icon: '💵', title: '최고 수수료', description: '업계 최고 수준 수수료율' }, { icon: '📚', title: '체계적 교육', description: '신입/경력 맞춤 교육' }, { icon: '🤝', title: '영업 지원', description: 'DB 제공, 마케팅 지원' }] } },
      { id: 's4', type: 'benefits', order: 3, content: { title: '입사 혜택', items: [{ icon: '💰', title: '정착지원금', description: '최대 500만원' }, { icon: '📊', title: '인센티브', description: '실적별 추가 보상' }, { icon: '🎁', title: '복리후생', description: '각종 지원금 제공' }] } },
      { id: 's5', type: 'process', order: 4, content: { title: '입사 절차', steps: [{ number: 1, title: '상담 신청', description: '온라인 상담 신청' }, { number: 2, title: '면담', description: '지점장 1:1 면담' }, { number: 3, title: '입사 결정', description: '조건 협의 후 결정' }, { number: 4, title: '교육', description: '신입/경력 맞춤 교육' }] } },
      { id: 's6', type: 'philosophy', order: 5, content: { title: '설계사 후기', quote: '타사에서 5년 일했는데, 이직하고 수입이 2배가 됐어요. 수수료율도 높지만 체계적인 DB 지원이 진짜 달라요. 교육도 실전 위주라 바로 영업에 적용할 수 있었습니다.', author: '김OO 설계사 (40대)', role: '보험업계 경력 8년 / 입사 3년차' } },
      { id: 's7', type: 'cta', order: 6, content: { headline: '입사 상담 신청하세요', subtext: '부담 없이 조건만 확인해보세요', buttonText: '입사 상담 신청' } },
      { id: 's8', type: 'form', order: 7, content: { title: '입사 상담 신청', buttonText: '신청하기' } }
    ],
    formFields: [
      { id: 'name', label: '이름', type: 'text', placeholder: '이름을 입력하세요', required: true },
      { id: 'phone', label: '연락처', type: 'tel', placeholder: '010-0000-0000', required: true },
      { id: 'career', label: '경력', type: 'select', required: true, options: ['신입 (타업종 경력)', '보험 경력 1년 미만', '보험 경력 1~3년', '보험 경력 3년 이상'] }
    ],
  },
  // 뷰티/미용
  {
    id: 'hairsalon-sample',
    category: 'beauty',
    categoryName: '뷰티/미용',
    name: '헤어살롱',
    theme: 'peach',
    themeColor: '#EC4899',
    description: '프리미엄 헤어 서비스',
    thumbnail: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop',
    preview: {
      headline: '당신만의 스타일을 찾아드립니다',
      subtext: '10년 경력 디자이너의 1:1 맞춤 시술',
      cta: '예약하기',
      badge: '첫 방문 20% 할인',
    },
    formData: {
      title: '헤어살롱',
      content: '당신만의 스타일을 찾아드립니다. 10년 경력 원장 디자이너가 1:1로 상담하고 시술합니다. 커트 3만원, 펌/염색 8만원부터. 첫 방문 고객 20% 할인.',
    },
    sections: [
      { id: 's1', type: 'hero', order: 0, content: { badge: '💇 첫 방문 20% 할인 | 원장 시술', headline: '당신만의 스타일을\n찾아드립니다', subtext: '10년 경력 원장 디자이너의 1:1 맞춤 시술.\n트렌디한 스타일부터 자연스러운 스타일까지', cta: '예약하기' } },
      { id: 's2', type: 'pain', order: 1, content: { title: '헤어 고민 있으신가요?', items: [{ icon: '💇', text: '어떤 스타일이 어울릴지 모르겠어요' }, { icon: '😟', text: '펌/염색 후 머릿결 손상이 걱정돼요' }, { icon: '🔄', text: '스타일 유지가 어려워요' }, { icon: '💰', text: '가격 대비 만족스러운 곳을 찾고 있어요' }] } },
      { id: 's3', type: 'solution', order: 2, content: { title: '원장 디자이너가 직접', headline: '1:1 맞춤 상담', description: '얼굴형, 두상, 라이프스타일 분석 후 제안', items: [{ icon: '👤', title: '맞춤 상담', description: '얼굴형/두상 분석' }, { icon: '💎', title: '프리미엄 제품', description: '두피/모발 케어 제품' }, { icon: '🔧', title: '사후 관리', description: '스타일링 팁 제공' }] } },
      { id: 's4', type: 'benefits', order: 3, content: { title: '시술 가격', items: [{ icon: '✂️', title: '커트', description: '3만원~' }, { icon: '🌀', title: '펌', description: '8만원~' }, { icon: '🎨', title: '염색', description: '8만원~' }] } },
      { id: 's5', type: 'process', order: 4, content: { title: '시술 과정', steps: [{ number: 1, title: '상담', description: '얼굴형, 두상, 라이프스타일 파악' }, { number: 2, title: '스타일 제안', description: '맞춤 스타일 시뮬레이션' }, { number: 3, title: '시술', description: '프리미엄 제품으로 꼼꼼하게' }, { number: 4, title: '스타일링', description: '홈케어 & 스타일링 팁 전달' }] } },
      { id: 's6', type: 'philosophy', order: 5, content: { title: '고객 후기', quote: '항상 원하는 스타일이 안 나왔는데, 여기서는 상담 때 보여준 그대로 나왔어요. 원장님이 얼굴형 분석해서 제안해주신 스타일이 정말 잘 어울려서 지인들한테 칭찬 많이 받았습니다.', author: '이OO 님 (30대)', role: '커트 + 염색 시술' } },
      { id: 's7', type: 'cta', order: 6, content: { headline: '지금 예약하세요', subtext: '첫 방문 고객 20% 할인', buttonText: '예약하기' } },
      { id: 's8', type: 'form', order: 7, content: { title: '예약 신청', buttonText: '예약하기' } }
    ],
    formFields: [
      { id: 'name', label: '이름', type: 'text', placeholder: '이름을 입력하세요', required: true },
      { id: 'phone', label: '연락처', type: 'tel', placeholder: '010-0000-0000', required: true },
      { id: 'service', label: '시술 종류', type: 'select', required: true, options: ['커트', '펌', '염색', '클리닉', '기타'] }
    ],
  },
  {
    id: 'nailshop-sample',
    category: 'beauty',
    categoryName: '뷰티/미용',
    name: '네일샵',
    theme: 'peach',
    themeColor: '#F472B6',
    description: '트렌디한 네일아트',
    thumbnail: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&h=600&fit=crop',
    preview: {
      headline: '손끝까지 아름답게',
      subtext: '젤네일, 네일아트 전문샵',
      cta: '예약하기',
      badge: '신규 30% 할인',
    },
    formData: {
      title: '네일샵',
      content: '손끝까지 아름답게. 트렌디한 네일아트 전문샵입니다. 젤네일 4만원, 네일아트 6만원부터. 신규 고객 30% 할인. 1:1 예약제로 운영합니다.',
    },
    sections: [
      { id: 's1', type: 'hero', order: 0, content: { badge: '💅 신규 30% 할인 | 1:1 예약제', headline: '손끝까지\n아름답게', subtext: '트렌디한 네일아트 전문샵.\n젤네일부터 프리미엄 아트까지', cta: '예약하기' } },
      { id: 's2', type: 'pain', order: 1, content: { title: '네일 고민 있으신가요?', items: [{ icon: '💅', text: '오래 유지되는 네일을 원하시나요?' }, { icon: '🎨', text: '트렌디한 디자인을 원하시나요?' }, { icon: '🛡️', text: '손톱 손상이 걱정되시나요?' }, { icon: '⏰', text: '대기 없이 편하게 받고 싶으신가요?' }] } },
      { id: 's3', type: 'solution', order: 2, content: { title: '프리미엄 네일 서비스', headline: '1:1 예약제 운영', description: '대기 없이 편안하게', items: [{ icon: '💎', title: '프리미엄 젤', description: '4주 이상 유지' }, { icon: '🎨', title: '트렌드 아트', description: '매달 신규 디자인' }, { icon: '🛡️', title: '손톱 케어', description: '손상 최소화 시술' }] } },
      { id: 's4', type: 'benefits', order: 3, content: { title: '시술 가격', items: [{ icon: '✨', title: '젤네일', description: '4만원~' }, { icon: '🎨', title: '네일아트', description: '6만원~' }, { icon: '💆', title: '손케어', description: '2만원~' }] } },
      { id: 's5', type: 'process', order: 4, content: { title: '시술 과정', steps: [{ number: 1, title: '상담', description: '원하는 디자인 & 컬러 상담' }, { number: 2, title: '손톱 정리', description: '큐티클 & 모양 정리' }, { number: 3, title: '젤 도포', description: '베이스-컬러-탑 3단계' }, { number: 4, title: '마무리', description: '오일 케어 & 유지법 안내' }] } },
      { id: 's6', type: 'philosophy', order: 5, content: { title: '고객 후기', quote: '다른 곳에서는 일주일도 안 돼서 들떴는데, 여기는 한 달 넘게 깔끔하게 유지돼요. 트렌디한 디자인도 많고, 예약제라 기다리지 않아서 좋아요. 단골 되었어요!', author: '박OO 님 (20대)', role: '젤네일 + 네일아트' } },
      { id: 's7', type: 'cta', order: 6, content: { headline: '지금 예약하세요', subtext: '신규 고객 30% 할인', buttonText: '예약하기' } },
      { id: 's8', type: 'form', order: 7, content: { title: '예약 신청', buttonText: '예약하기' } }
    ],
    formFields: [
      { id: 'name', label: '이름', type: 'text', placeholder: '이름을 입력하세요', required: true },
      { id: 'phone', label: '연락처', type: 'tel', placeholder: '010-0000-0000', required: true },
      { id: 'service', label: '시술 종류', type: 'select', required: true, options: ['젤네일', '네일아트', '손케어', '발케어', '기타'] }
    ],
  },
  // 법률/전문서비스
  {
    id: 'lawyer-sample',
    category: 'legal',
    categoryName: '법률/전문',
    name: '법률상담',
    theme: 'slate',
    themeColor: '#475569',
    description: '무료 법률 상담',
    thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=600&fit=crop',
    preview: {
      headline: '법률 문제, 혼자 고민하지 마세요',
      subtext: '변호사 무료 상담으로 해결 방법 찾기',
      cta: '무료 상담 신청',
      badge: '초기 상담 무료',
    },
    formData: {
      title: '법률상담',
      content: '법률 문제, 혼자 고민하지 마세요. 경험 많은 변호사가 무료로 상담해드립니다. 이혼, 상속, 부동산, 형사 사건 등 전 분야 상담 가능. 비밀 보장, 부담 없이 문의하세요.',
    },
    sections: [
      { id: 's1', type: 'hero', order: 0, content: { badge: '⚖️ 초기 상담 무료 | 비밀 보장', headline: '법률 문제\n혼자 고민하지 마세요', subtext: '경험 많은 변호사가 무료로 상담해드립니다.\n이혼, 상속, 부동산, 형사 전 분야 상담 가능', cta: '무료 상담 신청' } },
      { id: 's2', type: 'pain', order: 1, content: { title: '이런 고민 있으신가요?', items: [{ icon: '💔', text: '이혼, 양육권 문제로 고민 중이신가요?' }, { icon: '🏠', text: '부동산 분쟁으로 어려움을 겪고 계신가요?' }, { icon: '📜', text: '상속, 유산 문제가 복잡하신가요?' }, { icon: '⚠️', text: '형사 사건으로 법적 조언이 필요하신가요?' }] } },
      { id: 's3', type: 'solution', order: 2, content: { title: '전문 변호사가 도와드립니다', headline: '전 분야 법률 상담', description: '20년 경력 변호사 팀이 함께합니다', items: [{ icon: '💔', title: '가사/이혼', description: '이혼, 양육권, 재산분할' }, { icon: '🏠', title: '부동산', description: '매매, 임대차, 분쟁' }, { icon: '📋', title: '민사/형사', description: '소송, 고소, 합의' }] } },
      { id: 's4', type: 'benefits', order: 3, content: { title: '상담 안내', items: [{ icon: '💰', title: '무료', description: '초기 상담 비용' }, { icon: '🔒', title: '비밀 보장', description: '철저한 비밀 유지' }, { icon: '⏱️', title: '30분', description: '상담 소요 시간' }] } },
      { id: 's5', type: 'process', order: 4, content: { title: '상담 절차', steps: [{ number: 1, title: '상담 신청', description: '온라인 또는 전화 접수' }, { number: 2, title: '무료 상담', description: '변호사와 30분 상담' }, { number: 3, title: '방향 제시', description: '해결 방안 및 예상 비용 안내' }, { number: 4, title: '사건 진행', description: '수임 시 전담 변호사 배정' }] } },
      { id: 's6', type: 'philosophy', order: 5, content: { title: '의뢰인 후기', quote: '이혼 문제로 막막했는데, 무료 상담에서 모든 궁금증이 해소됐어요. 양육권, 재산분할 방향을 명확하게 알려주셔서 결정하는 데 큰 도움이 됐습니다. 비밀 보장도 철저하고 신뢰가 갔어요.', author: '김OO 님 (40대)', role: '이혼/재산분할 상담' } },
      { id: 's7', type: 'cta', order: 6, content: { headline: '무료 법률 상담 받으세요', subtext: '부담 없이 문의하세요', buttonText: '무료 상담 신청' } },
      { id: 's8', type: 'form', order: 7, content: { title: '상담 신청', buttonText: '신청하기' } }
    ],
    formFields: [
      { id: 'name', label: '이름', type: 'text', placeholder: '이름을 입력하세요', required: true },
      { id: 'phone', label: '연락처', type: 'tel', placeholder: '010-0000-0000', required: true },
      { id: 'type', label: '상담 분야', type: 'select', required: true, options: ['이혼/가사', '부동산', '상속', '형사', '민사', '기타'] }
    ],
  },
  // 생활서비스
  {
    id: 'moving-sample',
    category: 'lifestyle',
    categoryName: '생활서비스',
    name: '이사 서비스',
    theme: 'toss',
    themeColor: '#3B82F6',
    description: '원룸부터 가정집까지',
    thumbnail: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&h=600&fit=crop',
    preview: {
      headline: '이사, 믿고 맡기세요',
      subtext: '포장이사 전문, 파손 시 100% 보상',
      cta: '무료 견적받기',
      badge: '견적 비교',
    },
    formData: {
      title: '이사 서비스',
      content: '이사, 믿고 맡기세요. 원룸부터 가정집까지 포장이사 전문입니다. 파손 시 100% 보상, 친절한 서비스. 무료 방문 견적으로 정확한 비용을 확인하세요.',
    },
    sections: [
      { id: 's1', type: 'hero', order: 0, content: { badge: '📦 파손 100% 보상 | 무료 견적', headline: '이사\n믿고 맡기세요', subtext: '원룸부터 가정집까지 포장이사 전문.\n파손 시 100% 보상, 친절한 서비스 보장', cta: '무료 견적받기' } },
      { id: 's2', type: 'pain', order: 1, content: { title: '이사 준비 중이신가요?', items: [{ icon: '💰', text: '이사 비용이 얼마나 들지 궁금하신가요?' }, { icon: '📦', text: '짐 파손이 걱정되시나요?' }, { icon: '😓', text: '믿을 수 있는 업체를 찾고 계신가요?' }, { icon: '🧹', text: '이사 후 청소까지 한번에 하고 싶으신가요?' }] } },
      { id: 's3', type: 'solution', order: 2, content: { title: '안심 이사 서비스', headline: '포장이사 전문', description: '소중한 짐을 안전하게', items: [{ icon: '📦', title: '꼼꼼 포장', description: '전문 포장 기술' }, { icon: '🛡️', title: '파손 보상', description: '100% 보상 보장' }, { icon: '🧹', title: '청소 서비스', description: '입주 청소 옵션' }] } },
      { id: 's4', type: 'benefits', order: 3, content: { title: '서비스 안내', items: [{ icon: '🏠', title: '원룸', description: '30만원~' }, { icon: '🏢', title: '투룸', description: '50만원~' }, { icon: '🏘️', title: '가정집', description: '80만원~' }] } },
      { id: 's5', type: 'process', order: 4, content: { title: '이사 진행 과정', steps: [{ number: 1, title: '견적 신청', description: '온라인/전화로 무료 견적' }, { number: 2, title: '방문 확인', description: '짐 양 확인 및 정확한 견적' }, { number: 3, title: '포장 이사', description: '전문 포장 후 안전 운송' }, { number: 4, title: '정리 완료', description: '배치 완료 후 포장재 수거' }] } },
      { id: 's6', type: 'philosophy', order: 5, content: { title: '고객 후기', quote: '다른 업체는 견적보다 추가 비용이 많았는데, 여기는 견적 그대로였어요. 포장도 꼼꼼하게 해주시고, 파손 하나 없이 깔끔하게 이사 끝났습니다. 다음에도 여기로 할 거예요.', author: '최OO 님 (30대)', role: '투룸 → 쓰리룸 이사' } },
      { id: 's7', type: 'cta', order: 6, content: { headline: '무료 견적받으세요', subtext: '방문 견적 무료 | 비교 후 결정', buttonText: '무료 견적받기' } },
      { id: 's8', type: 'form', order: 7, content: { title: '견적 신청', buttonText: '신청하기' } }
    ],
    formFields: [
      { id: 'name', label: '이름', type: 'text', placeholder: '이름을 입력하세요', required: true },
      { id: 'phone', label: '연락처', type: 'tel', placeholder: '010-0000-0000', required: true },
      { id: 'type', label: '이사 종류', type: 'select', required: true, options: ['원룸', '투룸', '쓰리룸', '가정집', '사무실'] }
    ],
  },
  {
    id: 'cleaning-sample',
    category: 'lifestyle',
    categoryName: '생활서비스',
    name: '입주청소',
    theme: 'warm',
    themeColor: '#10B981',
    description: '새집처럼 깨끗하게',
    thumbnail: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop',
    preview: {
      headline: '입주 전 새집처럼 깨끗하게',
      subtext: '전문 청소팀의 꼼꼼한 입주청소',
      cta: '견적 문의하기',
      badge: '당일 예약 가능',
    },
    formData: {
      title: '입주청소',
      content: '입주 전 새집처럼 깨끗하게. 전문 청소팀이 구석구석 꼼꼼하게 청소합니다. 원룸 15만원, 투룸 20만원부터. 당일 예약 가능, 만족 보장.',
    },
    sections: [
      { id: 's1', type: 'hero', order: 0, content: { badge: '🧹 당일 예약 가능 | 만족 보장', headline: '입주 전\n새집처럼 깨끗하게', subtext: '전문 청소팀이 구석구석 꼼꼼하게.\n욕실, 주방, 창틀까지 완벽 청소', cta: '견적 문의하기' } },
      { id: 's2', type: 'pain', order: 1, content: { title: '입주청소 필요하신가요?', items: [{ icon: '🏠', text: '새 집인데 먼지가 많나요?' }, { icon: '🛁', text: '이전 세입자 흔적이 남아있나요?' }, { icon: '⏰', text: '직접 청소할 시간이 없으신가요?' }, { icon: '✨', text: '완벽하게 깨끗한 상태로 시작하고 싶으신가요?' }] } },
      { id: 's3', type: 'solution', order: 2, content: { title: '전문 청소 서비스', headline: '구석구석 꼼꼼하게', description: '10년 경력 전문 청소팀', items: [{ icon: '🛁', title: '욕실 청소', description: '곰팡이, 물때 제거' }, { icon: '🍳', title: '주방 청소', description: '기름때, 후드 청소' }, { icon: '🪟', title: '창문/샷시', description: '창틀, 방충망 청소' }] } },
      { id: 's4', type: 'benefits', order: 3, content: { title: '청소 비용', items: [{ icon: '🏠', title: '원룸', description: '15만원~' }, { icon: '🏢', title: '투룸', description: '20만원~' }, { icon: '🏘️', title: '쓰리룸+', description: '30만원~' }] } },
      { id: 's5', type: 'process', order: 4, content: { title: '청소 과정', steps: [{ number: 1, title: '견적 확인', description: '평수 및 상태 파악' }, { number: 2, title: '욕실/주방', description: '물때, 기름때 집중 제거' }, { number: 3, title: '창문/바닥', description: '창틀, 샷시, 바닥 청소' }, { number: 4, title: '마무리', description: '구석구석 최종 점검' }] } },
      { id: 's6', type: 'philosophy', order: 5, content: { title: '고객 후기', quote: '입주 전 청소 맡겼는데, 새 집처럼 깨끗해졌어요. 특히 욕실 곰팡이랑 주방 후드가 완전 새것 같아졌습니다. 꼼꼼하게 해주셔서 기분 좋게 입주했어요.', author: '정OO 님 (30대)', role: '25평 아파트 입주청소' } },
      { id: 's7', type: 'cta', order: 6, content: { headline: '견적 문의하세요', subtext: '당일 예약 가능 | 만족 보장', buttonText: '견적 문의하기' } },
      { id: 's8', type: 'form', order: 7, content: { title: '견적 문의', buttonText: '문의하기' } }
    ],
    formFields: [
      { id: 'name', label: '이름', type: 'text', placeholder: '이름을 입력하세요', required: true },
      { id: 'phone', label: '연락처', type: 'tel', placeholder: '010-0000-0000', required: true },
      { id: 'size', label: '평수', type: 'select', required: true, options: ['10평 이하', '10~20평', '20~30평', '30평 이상'] }
    ],
  },
  // 웨딩/사진
  {
    id: 'wedding-sample',
    category: 'wedding',
    categoryName: '웨딩/사진',
    name: '웨딩플래너',
    theme: 'peach',
    themeColor: '#F472B6',
    description: '맞춤 웨딩 플래닝',
    thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop',
    preview: {
      headline: '꿈꾸던 결혼식을 현실로',
      subtext: '500쌍 이상 진행한 웨딩 전문가',
      cta: '무료 상담 예약',
      badge: '맞춤 플래닝',
    },
    formData: {
      title: '웨딩플래너',
      content: '꿈꾸던 결혼식을 현실로 만들어드립니다. 500쌍 이상 진행한 웨딩 전문가가 함께합니다. 웨딩홀, 스드메, 허니문까지 원스톱 서비스. 무료 상담으로 시작하세요.',
    },
    sections: [
      { id: 's1', type: 'hero', order: 0, content: { badge: '💒 500쌍 진행 | 맞춤 플래닝', headline: '꿈꾸던 결혼식을\n현실로', subtext: '500쌍 이상 진행한 웨딩 전문가.\n웨딩홀, 스드메, 허니문까지 원스톱 서비스', cta: '무료 상담 예약' } },
      { id: 's2', type: 'pain', order: 1, content: { title: '결혼 준비 중이신가요?', items: [{ icon: '💒', text: '어떤 웨딩홀이 좋을지 모르겠어요' }, { icon: '👗', text: '스드메 업체가 너무 많아서 선택이 어려워요' }, { icon: '💰', text: '예산 내에서 최선의 선택을 하고 싶어요' }, { icon: '⏰', text: '결혼 준비할 시간이 부족해요' }] } },
      { id: 's3', type: 'solution', order: 2, content: { title: '웨딩 전문가가 함께합니다', headline: '원스톱 서비스', description: '처음부터 끝까지 함께합니다', items: [{ icon: '💒', title: '웨딩홀', description: '예산에 맞는 홀 추천' }, { icon: '👗', title: '스드메', description: '스튜디오/드레스/메이크업' }, { icon: '✈️', title: '허니문', description: '신혼여행 계획' }] } },
      { id: 's4', type: 'benefits', order: 3, content: { title: '서비스 실적', items: [{ icon: '💑', title: '500+', description: '진행 커플' }, { icon: '⭐', title: '98%', description: '만족도' }, { icon: '💰', title: '평균 15%', description: '비용 절감' }] } },
      { id: 's5', type: 'process', order: 4, content: { title: '웨딩 준비 과정', steps: [{ number: 1, title: '상담', description: '예산 및 컨셉 상담' }, { number: 2, title: '플래닝', description: '맞춤 웨딩 계획 수립' }, { number: 3, title: '업체 선정', description: '웨딩홀/스드메 투어 및 계약' }, { number: 4, title: '리허설', description: '본식 전 최종 점검' }] } },
      { id: 's6', type: 'philosophy', order: 5, content: { title: '신혼부부 후기', quote: '결혼 준비가 막막했는데, 플래너님이 처음부터 끝까지 꼼꼼하게 챙겨주셨어요. 예산도 절약하고, 원하던 컨셉으로 완벽한 결혼식을 할 수 있었습니다. 정말 감사해요!', author: '김OO, 이OO 커플', role: '2024년 10월 결혼' } },
      { id: 's7', type: 'cta', order: 6, content: { headline: '무료 상담 받으세요', subtext: '상담만 받아도 웨딩 체크리스트 증정', buttonText: '무료 상담 예약' } },
      { id: 's8', type: 'form', order: 7, content: { title: '상담 예약', buttonText: '예약하기' } }
    ],
    formFields: [
      { id: 'name', label: '이름', type: 'text', placeholder: '이름을 입력하세요', required: true },
      { id: 'phone', label: '연락처', type: 'tel', placeholder: '010-0000-0000', required: true },
      { id: 'date', label: '예상 결혼 시기', type: 'select', required: true, options: ['3개월 이내', '6개월 이내', '1년 이내', '1년 이후', '미정'] }
    ],
  },
  // 반려동물
  {
    id: 'pet-hospital-sample',
    category: 'pet',
    categoryName: '반려동물',
    name: '동물병원',
    theme: 'warm',
    themeColor: '#10B981',
    description: '24시 응급 동물병원',
    thumbnail: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&h=600&fit=crop',
    preview: {
      headline: '반려동물 건강, 24시간 지켜드립니다',
      subtext: '야간/응급 진료 가능한 동물병원',
      cta: '진료 예약하기',
      badge: '24시 응급',
    },
    formData: {
      title: '동물병원',
      content: '반려동물 건강, 24시간 지켜드립니다. 야간/응급 진료 가능한 동물병원입니다. 내과, 외과, 피부과, 영상의학과 전문의 진료. 건강검진 10만원부터.',
    },
    sections: [
      { id: 's1', type: 'hero', order: 0, content: { badge: '🏥 24시 응급 | 전문의 진료', headline: '반려동물 건강\n24시간 지켜드립니다', subtext: '야간/응급 진료 가능한 동물병원.\n내과, 외과, 피부과 전문의 상주', cta: '진료 예약하기' } },
      { id: 's2', type: 'pain', order: 1, content: { title: '반려동물 건강 걱정되시나요?', items: [{ icon: '🌙', text: '밤에 아프면 어디로 가야 할지 걱정되시나요?' }, { icon: '🔍', text: '정확한 진단을 받고 싶으신가요?' }, { icon: '💊', text: '치료 비용이 걱정되시나요?' }, { icon: '🏥', text: '전문적인 치료가 필요하신가요?' }] } },
      { id: 's3', type: 'solution', order: 2, content: { title: '전문 수의사가 함께합니다', headline: '24시간 진료', description: '언제든 아이를 맡겨주세요', items: [{ icon: '🩺', title: '전문 진료', description: '내과/외과/피부과 전문' }, { icon: '🔬', title: '정밀 검사', description: 'CT, MRI, 초음파' }, { icon: '🌙', title: '24시 응급', description: '야간/휴일 진료 가능' }] } },
      { id: 's4', type: 'benefits', order: 3, content: { title: '진료 안내', items: [{ icon: '💉', title: '예방접종', description: '5만원~' }, { icon: '🔍', title: '건강검진', description: '10만원~' }, { icon: '🏥', title: '응급진료', description: '24시간 가능' }] } },
      { id: 's5', type: 'process', order: 4, content: { title: '진료 과정', steps: [{ number: 1, title: '접수', description: '전화/방문 예약' }, { number: 2, title: '진찰', description: '전문의 1:1 진료' }, { number: 3, title: '검사', description: '필요시 정밀 검사' }, { number: 4, title: '치료', description: '맞춤 치료 및 처방' }] } },
      { id: 's6', type: 'philosophy', order: 5, content: { title: '보호자 후기', quote: '새벽에 강아지가 갑자기 아팠는데, 24시라서 바로 진료받을 수 있었어요. 선생님들이 정말 친절하시고, 아이도 잘 케어해주셔서 안심이 됐습니다. 정기 검진도 여기서 계속 할 거예요.', author: '박OO 님 (보호자)', role: '골든리트리버 / 5살' } },
      { id: 's7', type: 'cta', order: 6, content: { headline: '진료 예약하세요', subtext: '24시간 응급 진료 가능', buttonText: '진료 예약하기' } },
      { id: 's8', type: 'form', order: 7, content: { title: '진료 예약', buttonText: '예약하기' } }
    ],
    formFields: [
      { id: 'name', label: '보호자 이름', type: 'text', placeholder: '이름을 입력하세요', required: true },
      { id: 'phone', label: '연락처', type: 'tel', placeholder: '010-0000-0000', required: true },
      { id: 'pet', label: '반려동물', type: 'select', required: true, options: ['강아지', '고양이', '기타'] }
    ],
  },
  // 학원/교육
  {
    id: 'piano-academy-sample',
    category: 'academy',
    categoryName: '학원/교육',
    name: '피아노학원',
    theme: 'dark',
    themeColor: '#6366F1',
    description: '성인/어린이 피아노 레슨',
    thumbnail: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800&h=600&fit=crop',
    preview: {
      headline: '3개월이면 내가 좋아하는 곡을 연주할 수 있어요',
      subtext: '1:1 맞춤 레슨, 성인반/어린이반 운영',
      cta: '무료 체험 신청',
      badge: '무료 체험',
    },
    formData: {
      title: '피아노학원',
      content: '3개월이면 내가 좋아하는 곡을 연주할 수 있습니다. 1:1 맞춤 레슨으로 빠른 실력 향상. 성인반/어린이반 운영. 월 수강료 20만원, 무료 체험 레슨 제공.',
    },
    sections: [
      { id: 's1', type: 'hero', order: 0, content: { badge: '🎹 무료 체험 레슨 | 1:1 맞춤', headline: '3개월이면\n좋아하는 곡을 연주해요', subtext: '1:1 맞춤 레슨으로 빠른 실력 향상.\n성인반/어린이반 운영', cta: '무료 체험 신청' } },
      { id: 's2', type: 'pain', order: 1, content: { title: '피아노 배우고 싶으신가요?', items: [{ icon: '🎹', text: '피아노를 배워보고 싶었는데 기회가 없었나요?' }, { icon: '⏰', text: '바빠서 시간 맞추기 어려우신가요?' }, { icon: '📚', text: '악보를 몰라서 걱정되시나요?' }, { icon: '🎵', text: '좋아하는 곡을 직접 연주하고 싶으신가요?' }] } },
      { id: 's3', type: 'solution', order: 2, content: { title: '맞춤 레슨 프로그램', headline: '1:1 개인 레슨', description: '수준과 목표에 맞춘 커리큘럼', items: [{ icon: '👤', title: '1:1 레슨', description: '개인별 맞춤 지도' }, { icon: '🎵', title: '곡 선택', description: '원하는 곡으로 연습' }, { icon: '⏰', title: '유연한 시간', description: '스케줄 조율 가능' }] } },
      { id: 's4', type: 'benefits', order: 3, content: { title: '수강 안내', items: [{ icon: '👶', title: '어린이반', description: '월 15만원~' }, { icon: '👨', title: '성인반', description: '월 20만원~' }, { icon: '🎁', title: '체험 레슨', description: '무료' }] } },
      { id: 's5', type: 'process', order: 4, content: { title: '레슨 과정', steps: [{ number: 1, title: '상담', description: '목표 및 수준 파악' }, { number: 2, title: '기초', description: '자세/손 모양/악보 익히기' }, { number: 3, title: '연습', description: '원하는 곡 선정 및 연습' }, { number: 4, title: '연주', description: '완곡 후 발표회 참여' }] } },
      { id: 's6', type: 'philosophy', order: 5, content: { title: '수강생 후기', quote: '40대에 처음 피아노를 배웠는데, 3개월 만에 좋아하는 발라드 곡을 칠 수 있게 됐어요. 선생님이 제 속도에 맞춰 차근차근 알려주셔서 부담 없이 배울 수 있었습니다.', author: '이OO 님 (40대)', role: '성인 취미반 / 6개월 수강' } },
      { id: 's7', type: 'cta', order: 6, content: { headline: '무료 체험 레슨 신청하세요', subtext: '부담 없이 체험 후 결정하세요', buttonText: '무료 체험 신청' } },
      { id: 's8', type: 'form', order: 7, content: { title: '체험 레슨 신청', buttonText: '신청하기' } }
    ],
    formFields: [
      { id: 'name', label: '이름', type: 'text', placeholder: '이름을 입력하세요', required: true },
      { id: 'phone', label: '연락처', type: 'tel', placeholder: '010-0000-0000', required: true },
      { id: 'type', label: '대상', type: 'select', required: true, options: ['어린이 (7세 이하)', '초등학생', '중고등학생', '성인'] }
    ],
  },
  {
    id: 'english-academy-sample',
    category: 'academy',
    categoryName: '학원/교육',
    name: '영어학원',
    theme: 'toss',
    themeColor: '#0EA5E9',
    description: '원어민 1:1 영어회화',
    thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop',
    preview: {
      headline: '3개월이면 영어로 대화할 수 있어요',
      subtext: '원어민 1:1 회화, 성인/어린이 맞춤 수업',
      cta: '레벨테스트 신청',
      badge: '무료 레벨테스트',
    },
    formData: {
      title: '영어학원',
      content: '3개월이면 영어로 대화할 수 있습니다. 원어민 강사 1:1 회화 수업으로 빠른 실력 향상. 성인반/어린이반 맞춤 커리큘럼. 무료 레벨테스트 후 맞춤 수업 제안.',
    },
    sections: [
      { id: 's1', type: 'hero', order: 0, content: { badge: '🌍 무료 레벨테스트 | 원어민 1:1', headline: '3개월이면\n영어로 대화해요', subtext: '원어민 강사 1:1 회화 수업.\n성인반/어린이반 맞춤 커리큘럼', cta: '레벨테스트 신청' } },
      { id: 's2', type: 'pain', order: 1, content: { title: '영어 고민 있으신가요?', items: [{ icon: '🗣️', text: '외국인 앞에서 말이 안 나오나요?' }, { icon: '📚', text: '문법은 아는데 회화가 안 되나요?' }, { icon: '👂', text: '영어가 잘 안 들리나요?' }, { icon: '💼', text: '업무에 영어가 필요한데 자신이 없나요?' }] } },
      { id: 's3', type: 'solution', order: 2, content: { title: '원어민 1:1 회화', headline: '말하기 중심 수업', description: '실전 회화 능력 향상에 집중', items: [{ icon: '🌍', title: '원어민 강사', description: '미국/영국 출신 강사' }, { icon: '💬', title: '회화 중심', description: '실전 대화 연습' }, { icon: '📊', title: '레벨별 수업', description: '수준 맞춤 커리큘럼' }] } },
      { id: 's4', type: 'benefits', order: 3, content: { title: '수강 안내', items: [{ icon: '👶', title: '어린이반', description: '월 25만원~' }, { icon: '👨', title: '성인반', description: '월 30만원~' }, { icon: '🎁', title: '레벨테스트', description: '무료' }] } },
      { id: 's5', type: 'process', order: 4, content: { title: '수강 과정', steps: [{ number: 1, title: '레벨테스트', description: '현재 수준 정확히 파악' }, { number: 2, title: '커리큘럼', description: '맞춤 학습 계획 수립' }, { number: 3, title: '1:1 수업', description: '원어민 강사와 회화 집중' }, { number: 4, title: '피드백', description: '월간 리포트 & 상담' }] } },
      { id: 's6', type: 'philosophy', order: 5, content: { title: '수강생 후기', quote: '회사에서 영어 발표를 해야 하는데 너무 막막했어요. 3개월 수강 후 자신감이 생겨서 무사히 발표도 마쳤습니다. 원어민 선생님과 매일 대화하니까 귀도 트이고, 말도 자연스러워졌어요.', author: '김OO 님 (30대)', role: '성인 비즈니스반 / 4개월 수강' } },
      { id: 's7', type: 'cta', order: 6, content: { headline: '무료 레벨테스트 받으세요', subtext: '테스트 후 맞춤 커리큘럼 제안', buttonText: '레벨테스트 신청' } },
      { id: 's8', type: 'form', order: 7, content: { title: '레벨테스트 신청', buttonText: '신청하기' } }
    ],
    formFields: [
      { id: 'name', label: '이름', type: 'text', placeholder: '이름을 입력하세요', required: true },
      { id: 'phone', label: '연락처', type: 'tel', placeholder: '010-0000-0000', required: true },
      { id: 'level', label: '현재 수준', type: 'select', required: true, options: ['왕초보', '기초', '중급', '고급'] }
    ],
  },
];

// 샘플 ID로 샘플 찾기
export function getSampleById(id: string): SamplePage | undefined {
  return samplePages.find(sample => sample.id === id);
}

// 카테고리별 샘플 필터
export function getSamplesByCategory(category: string): SamplePage[] {
  if (category === 'all') return samplePages;
  return samplePages.filter(sample => sample.category === category);
}
