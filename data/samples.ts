// 샘플 랜딩페이지 데이터 (공유 모듈)

export interface SamplePage {
  id: string;
  category: string;
  categoryName: string;
  name: string;
  theme: string;
  themeColor: string;
  description: string;
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
};

export const samplePages: SamplePage[] = [
  // 교육/강의
  {
    id: 'marketing-edu-sample',
    category: 'education',
    categoryName: '교육/강의',
    name: '마케팅 실전 부트캠프',
    theme: 'indigo',
    themeColor: '#6366F1',
    description: '퍼포먼스 마케팅 전문가가 되는 8주 과정',
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
  },
  {
    id: 'it-edu-sample',
    category: 'education',
    categoryName: '교육/강의',
    name: 'AI 개발자 양성과정',
    theme: 'cyan',
    themeColor: '#0891B2',
    description: 'ChatGPT API를 활용한 서비스 개발',
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
  },
  {
    id: 'design-edu-sample',
    category: 'education',
    categoryName: '교육/강의',
    name: 'UI/UX 디자인 마스터',
    theme: 'pink',
    themeColor: '#EC4899',
    description: '피그마로 완성하는 실무 디자인',
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
  },
  // 상담/컨설팅
  {
    id: 'insurance-sample',
    category: 'consulting',
    categoryName: '상담/컨설팅',
    name: '맞춤 보험 설계',
    theme: 'purple',
    themeColor: '#8B5CF6',
    description: '당신에게 꼭 맞는 보험을 찾아드립니다',
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
  },
  {
    id: 'tax-sample',
    category: 'consulting',
    categoryName: '상담/컨설팅',
    name: '절세 컨설팅',
    theme: 'slate',
    themeColor: '#475569',
    description: '합법적으로 세금을 줄이는 방법',
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
  },
  {
    id: 'career-sample',
    category: 'consulting',
    categoryName: '상담/컨설팅',
    name: '이직 컨설팅',
    theme: 'emerald',
    themeColor: '#10B981',
    description: '연봉 30% 인상하는 이직 전략',
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
  },
  // 서비스/대행
  {
    id: 'web-dev-sample',
    category: 'service',
    categoryName: '서비스/대행',
    name: '웹사이트 제작',
    theme: 'rose',
    themeColor: '#F43F5E',
    description: '비즈니스를 위한 프리미엄 웹사이트',
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
  },
  {
    id: 'video-sample',
    category: 'service',
    categoryName: '서비스/대행',
    name: '영상 제작',
    theme: 'amber',
    themeColor: '#F59E0B',
    description: '브랜드를 빛나게 하는 영상',
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
  },
  {
    id: 'marketing-agency-sample',
    category: 'service',
    categoryName: '서비스/대행',
    name: '마케팅 대행',
    theme: 'orange',
    themeColor: '#F97316',
    description: 'SNS 마케팅 전문 대행사',
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
  },
  // 상품/판매
  {
    id: 'ebook-sample',
    category: 'product',
    categoryName: '상품/판매',
    name: '전자책 판매',
    theme: 'teal',
    themeColor: '#14B8A6',
    description: '노하우를 담은 전자책',
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
  },
  {
    id: 'course-sample',
    category: 'product',
    categoryName: '상품/판매',
    name: 'VOD 강의',
    theme: 'blue',
    themeColor: '#3B82F6',
    description: '언제 어디서나 배우는 온라인 강의',
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
  },
  {
    id: 'membership-sample',
    category: 'product',
    categoryName: '상품/판매',
    name: '멤버십 커뮤니티',
    theme: 'violet',
    themeColor: '#8B5CF6',
    description: '함께 성장하는 커뮤니티',
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
  },
  {
    id: 'workshop-sample',
    category: 'event',
    categoryName: '이벤트/모집',
    name: '원데이 클래스',
    theme: 'lime',
    themeColor: '#84CC16',
    description: '하루만에 배우는 실전 스킬',
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
  },
  {
    id: 'study-sample',
    category: 'event',
    categoryName: '이벤트/모집',
    name: '스터디 모집',
    theme: 'sky',
    themeColor: '#0EA5E9',
    description: '함께 공부하는 스터디 그룹',
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
  },
  {
    id: 'officetel-sample',
    category: 'realestate',
    categoryName: '부동산/분양',
    name: '오피스텔 분양',
    theme: 'zinc',
    themeColor: '#71717A',
    description: '수익형 오피스텔 투자',
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
  },
  // 프랜차이즈/창업
  {
    id: 'chicken-franchise-sample',
    category: 'franchise',
    categoryName: '프랜차이즈/창업',
    name: '치킨 프랜차이즈',
    theme: 'orange',
    themeColor: '#EA580C',
    description: '전국 500호점 돌파 치킨 브랜드',
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
  },
  {
    id: 'cafe-franchise-sample',
    category: 'franchise',
    categoryName: '프랜차이즈/창업',
    name: '카페 프랜차이즈',
    theme: 'amber',
    themeColor: '#D97706',
    description: '2030이 가장 좋아하는 디저트 카페',
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
  },
  {
    id: 'gym-franchise-sample',
    category: 'franchise',
    categoryName: '프랜차이즈/창업',
    name: '피트니스 창업',
    theme: 'red',
    themeColor: '#DC2626',
    description: '무인 24시 피트니스 창업',
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
  },
  {
    id: 'restaurant-franchise-sample',
    category: 'franchise',
    categoryName: '프랜차이즈/창업',
    name: '음식점 프랜차이즈',
    theme: 'rose',
    themeColor: '#E11D48',
    description: '배달 전문 한식 프랜차이즈',
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
  },
  {
    id: 'office-interior-sample',
    category: 'interior',
    categoryName: '인테리어/시공',
    name: '사무실 인테리어',
    theme: 'slate',
    themeColor: '#475569',
    description: '생산성을 높이는 오피스 공간',
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
  },
  {
    id: 'store-interior-sample',
    category: 'interior',
    categoryName: '인테리어/시공',
    name: '상가 인테리어',
    theme: 'neutral',
    themeColor: '#525252',
    description: '매출을 올리는 상가 디자인',
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
  },
  {
    id: 'kitchen-interior-sample',
    category: 'interior',
    categoryName: '인테리어/시공',
    name: '주방 리모델링',
    theme: 'zinc',
    themeColor: '#71717A',
    description: '요리가 즐거워지는 주방',
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
