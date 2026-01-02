'use client';

import { useParams, useRouter } from 'next/navigation';

// 카테고리 → 토픽 매핑
const categoryToTopic: Record<string, string> = {
  '교육/강의': 'course',
  '상담/컨설팅': 'consulting',
  '서비스/대행': 'service',
  '상품/판매': 'product',
  '이벤트/모집': 'event',
  '부동산/분양': 'realestate',
  '프랜차이즈/창업': 'franchise',
  '인테리어/시공': 'interior',
};

// 샘플 상세 데이터
const sampleDetails: Record<string, {
  name: string;
  category: string;
  theme: string;
  themeColor: string;
  gradientEnd: string;
  content: {
    hero: {
      badge: string;
      headline: string;
      subtext: string;
      cta: string;
      trust: string;
    };
    pain: {
      title: string;
      items: { icon: string; text: string }[];
    };
    solution: {
      title: string;
      description: string;
      features: { icon: string; title: string; desc: string }[];
    };
    benefits: {
      title: string;
      items: { number: string; label: string }[];
    };
    testimonial: {
      quote: string;
      name: string;
      role: string;
    };
    cta: {
      title: string;
      subtitle: string;
      button: string;
    };
  };
}> = {
  'marketing-edu-sample': {
    name: '마케팅 실전 부트캠프',
    category: '교육/강의',
    theme: 'indigo',
    themeColor: '#6366F1',
    gradientEnd: '#8B5CF6',
    content: {
      hero: {
        badge: '🔥 오늘 마감 | 36% 특별 할인',
        headline: '월급보다 더 버는\n마케터가 되세요',
        subtext: '현직 대기업 마케터가 알려주는 실전 퍼포먼스 마케팅.\n이론이 아닌 실무 노하우를 8주만에 마스터합니다.',
        cta: '무료 강의 미리보기',
        trust: '수강생 1,247명 | 만족도 4.9/5.0',
      },
      pain: {
        title: '이런 고민 있으신가요?',
        items: [
          { icon: '😓', text: '마케팅 배우고 싶은데 어디서 시작해야 할지 모르겠어요' },
          { icon: '💸', text: '광고비는 쓰는데 왜 성과가 안 나는지 모르겠어요' },
          { icon: '📊', text: '데이터 분석이 중요하다는데 어떻게 해야 하나요?' },
          { icon: '🎯', text: '실무에서 바로 쓸 수 있는 스킬을 배우고 싶어요' },
        ],
      },
      solution: {
        title: '8주 후, 당신은 달라집니다',
        description: '실무 프로젝트 기반의 커리큘럼으로 배우는 순간 바로 적용할 수 있습니다',
        features: [
          { icon: '📈', title: '광고 세팅부터 최적화까지', desc: 'META, Google 광고 실전 운영' },
          { icon: '🔍', title: '데이터 기반 의사결정', desc: 'GA4, 전환 추적, A/B 테스트' },
          { icon: '✍️', title: '전환되는 카피라이팅', desc: '클릭률 높이는 문구 작성법' },
          { icon: '💼', title: '포트폴리오 완성', desc: '실제 캠페인 운영 경험' },
        ],
      },
      benefits: {
        title: '수강생 성과',
        items: [
          { number: '340%', label: '평균 ROAS 개선' },
          { number: '92%', label: '취업/이직 성공률' },
          { number: '2.3배', label: '평균 연봉 상승' },
        ],
      },
      testimonial: {
        quote: '비전공자였는데 8주 과정 끝나고 바로 마케팅 에이전시에 취업했어요. 실무 중심 커리큘럼이 정말 도움됐습니다.',
        name: '김민지',
        role: '수강생 → 현 A사 퍼포먼스 마케터',
      },
      cta: {
        title: '지금 시작하면 36% 할인',
        subtitle: '선착순 30명 한정 | 오늘 자정 마감',
        button: '할인가로 신청하기',
      },
    },
  },
  'insurance-sample': {
    name: '맞춤 보험 설계',
    category: '상담/컨설팅',
    theme: 'purple',
    themeColor: '#8B5CF6',
    gradientEnd: '#A855F7',
    content: {
      hero: {
        badge: '✨ 무료 상담 | 강요 없는 진단',
        headline: '보험료는 낮추고\n보장은 높이는 방법',
        subtext: '10년차 보험 전문가가 당신의 보험을 무료로 진단해드립니다.\n필요 없는 보험은 빼고, 부족한 보장은 채워드려요.',
        cta: '무료 상담 신청하기',
        trust: '상담 고객 5,000명+ | 평균 보험료 23% 절감',
      },
      pain: {
        title: '혹시 이런 상황이신가요?',
        items: [
          { icon: '💰', text: '매달 보험료가 부담되는데, 어떤 걸 해지해야 할지 모르겠어요' },
          { icon: '📋', text: '보험이 여러 개인데 중복되는 건 없는지 궁금해요' },
          { icon: '🏥', text: '실비 보험 바뀌었다는데 나는 괜찮은 건가요?' },
          { icon: '👨‍👩‍👧', text: '가족 보험 점검이 필요한데 어디서 받아야 할지...' },
        ],
      },
      solution: {
        title: '전문가가 직접 분석해드립니다',
        description: '10년 경력 보험 전문가가 고객님의 상황에 맞는 최적의 보험 포트폴리오를 설계해드립니다',
        features: [
          { icon: '🔍', title: '현재 보험 진단', desc: '가입된 보험 중복/누락 체크' },
          { icon: '💡', title: '맞춤 설계', desc: '라이프스타일에 맞는 보장 설계' },
          { icon: '📉', title: '보험료 최적화', desc: '불필요한 특약 정리로 비용 절감' },
          { icon: '🤝', title: '사후 관리', desc: '청구 대행 및 지속 관리 서비스' },
        ],
      },
      benefits: {
        title: '상담 고객 성과',
        items: [
          { number: '23%', label: '평균 보험료 절감' },
          { number: '98%', label: '상담 만족도' },
          { number: '5,000+', label: '상담 완료 고객' },
        ],
      },
      testimonial: {
        quote: '보험 7개나 있었는데 정리하고 나니 보험료도 줄고 보장은 더 좋아졌어요. 무료인데 이렇게까지 해주시다니 감사합니다.',
        name: '박준호',
        role: '40대 직장인',
      },
      cta: {
        title: '무료 상담 신청하세요',
        subtitle: '강요 없는 상담 | 부담 없이 문의하세요',
        button: '무료 상담 신청',
      },
    },
  },
  'apartment-sample': {
    name: '아파트 분양',
    category: '부동산/분양',
    theme: 'red',
    themeColor: '#EF4444',
    gradientEnd: '#F97316',
    content: {
      hero: {
        badge: '🏠 강남 10분 | 초역세권 프리미엄',
        headline: '당신이 기다려온\n그 아파트입니다',
        subtext: '지하철 도보 3분, 초등학교 도보 5분.\n실수요자를 위한 프리미엄 아파트가 드디어 공개됩니다.',
        cta: '모델하우스 방문 예약',
        trust: '사전 예약 1,200세대 돌파',
      },
      pain: {
        title: '이런 조건 찾고 계셨죠?',
        items: [
          { icon: '🚇', text: '지하철역 가까운 역세권 아파트' },
          { icon: '🏫', text: '아이 학교 걱정 없는 학세권' },
          { icon: '🌳', text: '공원, 편의시설 도보 거리' },
          { icon: '📈', text: '투자 가치도 있는 프리미엄 단지' },
        ],
      },
      solution: {
        title: '모든 조건을 갖춘 프리미엄',
        description: '실수요자와 투자자 모두를 만족시키는 완벽한 입지',
        features: [
          { icon: '🚇', title: '트리플 역세권', desc: '3개 노선 도보 5분 이내' },
          { icon: '🏫', title: '명문 학군', desc: '초중고 도보 통학 가능' },
          { icon: '🏢', title: '프리미엄 커뮤니티', desc: '피트니스, 골프연습장, 독서실' },
          { icon: '🌳', title: '친환경 설계', desc: '대형 중앙공원 조성' },
        ],
      },
      benefits: {
        title: '분양 정보',
        items: [
          { number: '59-84㎡', label: '평형대' },
          { number: '1,847', label: '총 세대수' },
          { number: '2025.12', label: '입주 예정' },
        ],
      },
      testimonial: {
        quote: '모델하우스 보러 갔다가 바로 계약했어요. 이 가격에 이 입지는 다시 없을 것 같아서요.',
        name: '이수진',
        role: '30대 예비 입주자',
      },
      cta: {
        title: '지금 바로 상담받으세요',
        subtitle: '모델하우스 오픈 | 방문 상담 예약 접수 중',
        button: '방문 상담 예약',
      },
    },
  },
  // 프랜차이즈 샘플
  'chicken-franchise-sample': {
    name: '치킨 프랜차이즈',
    category: '프랜차이즈/창업',
    theme: 'orange',
    themeColor: '#EA580C',
    gradientEnd: '#F97316',
    content: {
      hero: {
        badge: '🍗 가맹비 50% 할인 | 선착순 마감',
        headline: '월 순수익 1,200만원\n가능합니다',
        subtext: '전국 500호점 돌파한 검증된 치킨 브랜드.\n본사 직영 물류, 마케팅 100% 지원으로 초보 창업도 OK.',
        cta: '창업 상담 신청하기',
        trust: '전국 500호점 | 폐점률 3% 미만',
      },
      pain: {
        title: '창업 고민 중이신가요?',
        items: [
          { icon: '💰', text: '초기 투자금이 부담되는데...' },
          { icon: '📍', text: '좋은 상권을 어떻게 찾아야 할지 모르겠어요' },
          { icon: '👨‍🍳', text: '요리 경험이 없어도 가능한가요?' },
          { icon: '📉', text: '폐점률이 높다던데 괜찮을까요?' },
        ],
      },
      solution: {
        title: '본사가 함께합니다',
        description: '창업부터 운영까지 본사의 체계적인 지원 시스템',
        features: [
          { icon: '📍', title: '상권 분석', desc: '빅데이터 기반 입지 선정' },
          { icon: '🚛', title: '직영 물류', desc: '본사 직접 배송으로 원가 절감' },
          { icon: '📱', title: '마케팅 지원', desc: '배달앱, SNS 마케팅 100% 지원' },
          { icon: '👨‍🏫', title: '교육 프로그램', desc: '2주 집중 교육으로 누구나 가능' },
        ],
      },
      benefits: {
        title: '가맹점 성과',
        items: [
          { number: '1,200만원', label: '월 평균 순수익' },
          { number: '3%', label: '폐점률 (업계 최저)' },
          { number: '8개월', label: '평균 손익분기점' },
        ],
      },
      testimonial: {
        quote: '퇴직 후 창업했는데, 본사 지원 덕분에 6개월 만에 안정 궤도에 올랐습니다. 이제 월 1,500만원 벌어요.',
        name: '박성진',
        role: '강남점 점주 (창업 2년차)',
      },
      cta: {
        title: '지금 가맹비 50% 할인 중',
        subtitle: '선착순 10개 지역 한정 | 상담만 받아도 혜택',
        button: '창업 상담 신청',
      },
    },
  },
  'cafe-franchise-sample': {
    name: '카페 프랜차이즈',
    category: '프랜차이즈/창업',
    theme: 'amber',
    themeColor: '#D97706',
    gradientEnd: '#F59E0B',
    content: {
      hero: {
        badge: '☕ 2030이 가장 좋아하는 디저트 카페',
        headline: '하루 매출 200만원\n비결이 있습니다',
        subtext: '인스타그램 팔로워 50만 돌파 핫플 브랜드.\n본사 인테리어 지원으로 감각적인 매장 완성.',
        cta: '가맹 문의하기',
        trust: '전국 200호점 | 인스타 팔로워 50만',
      },
      pain: {
        title: '카페 창업 막막하시죠?',
        items: [
          { icon: '☕', text: '커피 만들 줄 몰라도 되나요?' },
          { icon: '🏪', text: '인테리어 비용이 너무 많이 들 것 같아요' },
          { icon: '🎯', text: '요즘 카페가 너무 많은데 경쟁력이 있을까요?' },
          { icon: '📱', text: 'SNS 마케팅을 어떻게 해야 할지 모르겠어요' },
        ],
      },
      solution: {
        title: '브랜드 파워가 다릅니다',
        description: '이미 검증된 브랜드로 시작하세요',
        features: [
          { icon: '🎨', title: '시그니처 인테리어', desc: '본사 디자인팀 무료 설계' },
          { icon: '📸', title: 'SNS 바이럴', desc: '인스타그램 마케팅 본사 지원' },
          { icon: '🍰', title: '트렌디한 메뉴', desc: '시즌 신메뉴 지속 개발' },
          { icon: '👩‍🏫', title: '바리스타 교육', desc: '3주 전문 교육 프로그램' },
        ],
      },
      benefits: {
        title: '가맹점 현황',
        items: [
          { number: '200만원', label: '일 평균 매출' },
          { number: '42%', label: '영업이익률' },
          { number: '200+', label: '전국 가맹점' },
        ],
      },
      testimonial: {
        quote: '인스타에서 핫한 브랜드라 오픈 첫날부터 대기줄이 생겼어요. 마케팅 걱정 없이 장사만 하면 됩니다.',
        name: '김소연',
        role: '홍대점 점주',
      },
      cta: {
        title: '가맹 상담 신청하세요',
        subtitle: '창업 설명회 매주 토요일 진행 중',
        button: '가맹 문의하기',
      },
    },
  },
  'gym-franchise-sample': {
    name: '피트니스 창업',
    category: '프랜차이즈/창업',
    theme: 'red',
    themeColor: '#DC2626',
    gradientEnd: '#EF4444',
    content: {
      hero: {
        badge: '💪 무인 24시 | 인건비 0원',
        headline: '인건비 0원\n월 순수익 800만원',
        subtext: '무인 시스템으로 운영 부담 최소화.\n퇴근 후에도 자동으로 돌아가는 수익 시스템.',
        cta: '창업 설명회 신청',
        trust: '전국 150호점 | 무인 운영 시스템',
      },
      pain: {
        title: '직장 다니면서 창업 고민 중?',
        items: [
          { icon: '⏰', text: '본업이 있어서 매장에 상주하기 어려워요' },
          { icon: '👥', text: '직원 관리가 너무 힘들 것 같아요' },
          { icon: '💸', text: '인건비 부담 없이 운영하고 싶어요' },
          { icon: '🏃', text: '헬스장 창업은 경험이 필요하지 않나요?' },
        ],
      },
      solution: {
        title: '무인 시스템이 해결합니다',
        description: '스마트 기술로 24시간 자동 운영',
        features: [
          { icon: '🔐', title: '무인 출입', desc: '앱 기반 QR 출입 시스템' },
          { icon: '📹', title: 'CCTV 모니터링', desc: '24시간 실시간 원격 관리' },
          { icon: '💳', title: '자동 결제', desc: '앱 결제 및 자동 갱신' },
          { icon: '🛠️', title: '원격 관리', desc: '본사 통합 관리 시스템' },
        ],
      },
      benefits: {
        title: '가맹점 성과',
        items: [
          { number: '800만원', label: '월 평균 순수익' },
          { number: '0원', label: '인건비' },
          { number: '150+', label: '전국 가맹점' },
        ],
      },
      testimonial: {
        quote: '회사 다니면서 부업으로 시작했는데, 이제 본업 수입보다 많아요. 진짜 손 안 대도 돌아갑니다.',
        name: '이준혁',
        role: '직장인 점주',
      },
      cta: {
        title: '무인 헬스장 창업 설명회',
        subtitle: '매주 수요일 저녁 7시 | 온라인 참여 가능',
        button: '설명회 신청하기',
      },
    },
  },
  'restaurant-franchise-sample': {
    name: '음식점 프랜차이즈',
    category: '프랜차이즈/창업',
    theme: 'rose',
    themeColor: '#E11D48',
    gradientEnd: '#F43F5E',
    content: {
      hero: {
        badge: '🍚 배달앱 리뷰 4.9점 | 초보 창업 OK',
        headline: '배달앱 리뷰 4.9점\n비결을 공개합니다',
        subtext: '주방 경험 없어도 OK. 본사 레시피 100% 제공.\n배달 전문으로 소자본 창업 가능.',
        cta: '가맹 상담 신청',
        trust: '배달앱 리뷰 4.9점 | 월 주문 5,000건+',
      },
      pain: {
        title: '요식업 창업 고민 중?',
        items: [
          { icon: '👨‍🍳', text: '요리 경험이 전혀 없는데 가능할까요?' },
          { icon: '🏪', text: '홀 운영 없이 배달만으로 가능한가요?' },
          { icon: '📦', text: '식재료 관리가 어려울 것 같아요' },
          { icon: '⭐', text: '리뷰 관리는 어떻게 해야 하나요?' },
        ],
      },
      solution: {
        title: '본사 시스템으로 해결',
        description: '레시피부터 리뷰 관리까지 올인원 지원',
        features: [
          { icon: '📋', title: '표준 레시피', desc: '누구나 같은 맛 재현' },
          { icon: '🚛', title: '식재료 공급', desc: '본사 직접 배송' },
          { icon: '⭐', title: '리뷰 관리', desc: '본사 리뷰 응대 지원' },
          { icon: '📱', title: '배달앱 최적화', desc: '상위 노출 마케팅' },
        ],
      },
      benefits: {
        title: '가맹점 현황',
        items: [
          { number: '4.9점', label: '배달앱 평점' },
          { number: '5,000건', label: '월 평균 주문' },
          { number: '35%', label: '순수익률' },
        ],
      },
      testimonial: {
        quote: '요리 1도 못했는데 본사 레시피대로만 하니까 리뷰가 미쳐요. 배달만으로 월 2천 벌어요.',
        name: '최민수',
        role: '송파점 점주',
      },
      cta: {
        title: '소자본 창업 상담',
        subtitle: '창업 비용 3천만원대 가능 | 상담 무료',
        button: '가맹 상담 신청',
      },
    },
  },
  // 인테리어 샘플
  'home-interior-sample': {
    name: '주거 인테리어',
    category: '인테리어/시공',
    theme: 'stone',
    themeColor: '#78716C',
    gradientEnd: '#A8A29E',
    content: {
      hero: {
        badge: '🏠 1,000세대 시공 경험 | 5년 AS 보장',
        headline: '당신의 공간을\n호텔처럼',
        subtext: '트렌디한 디자인과 실용성을 모두 잡은 인테리어.\n1,000세대 시공 경험의 전문가가 함께합니다.',
        cta: '무료 상담 받기',
        trust: '시공 1,000세대+ | 만족도 98%',
      },
      pain: {
        title: '인테리어 고민 중이신가요?',
        items: [
          { icon: '💰', text: '견적이 천차만별이라 어디가 맞는지 모르겠어요' },
          { icon: '🎨', text: '원하는 스타일을 어떻게 표현해야 할지...' },
          { icon: '🔨', text: '시공 중 하자가 생기면 어쩌죠?' },
          { icon: '📅', text: '일정대로 완공될지 걱정돼요' },
        ],
      },
      solution: {
        title: '원스톱 인테리어 서비스',
        description: '상담부터 AS까지 책임지는 토탈 서비스',
        features: [
          { icon: '🏠', title: '무료 방문 상담', desc: '현장 측정 및 상담' },
          { icon: '🎨', title: '3D 디자인', desc: '시공 전 미리 확인' },
          { icon: '👷', title: '직영 시공', desc: '하청 없는 책임 시공' },
          { icon: '🛡️', title: '5년 AS', desc: '시공 후 무상 AS 보장' },
        ],
      },
      benefits: {
        title: '시공 실적',
        items: [
          { number: '1,000+', label: '시공 세대' },
          { number: '98%', label: '고객 만족도' },
          { number: '5년', label: 'AS 보장' },
        ],
      },
      testimonial: {
        quote: '3D로 미리 보여주셔서 결과물이 정확히 예상대로 나왔어요. 하자도 없고 AS도 빠르게 해주세요.',
        name: '정수진',
        role: '30평대 아파트 시공',
      },
      cta: {
        title: '무료 상담 신청하세요',
        subtitle: '방문 상담 무료 | 3D 디자인 무료 제공',
        button: '무료 상담 신청',
      },
    },
  },
  'office-interior-sample': {
    name: '사무실 인테리어',
    category: '인테리어/시공',
    theme: 'slate',
    themeColor: '#475569',
    gradientEnd: '#64748B',
    content: {
      hero: {
        badge: '🏢 스타트업부터 대기업까지 | 300개+ 시공',
        headline: '직원 만족도 200%\n높이는 사무실',
        subtext: '업무 효율을 높이는 스마트 오피스 설계.\n스타트업부터 대기업까지 300개+ 시공 경험.',
        cta: '견적 문의하기',
        trust: '기업 시공 300개+ | 리뉴얼 전문',
      },
      pain: {
        title: '사무실 환경 개선이 필요하신가요?',
        items: [
          { icon: '👥', text: '직원들이 사무실 환경에 불만이 많아요' },
          { icon: '💼', text: '회사 이미지에 맞는 인테리어가 필요해요' },
          { icon: '⚡', text: '업무 효율을 높이는 공간 설계가 필요해요' },
          { icon: '📅', text: '영업 중에도 시공이 가능한가요?' },
        ],
      },
      solution: {
        title: '비즈니스 맞춤 솔루션',
        description: '기업 문화와 업무 특성을 반영한 공간 설계',
        features: [
          { icon: '📐', title: '공간 컨설팅', desc: '업무 효율 중심 레이아웃' },
          { icon: '🎨', title: 'CI 반영 디자인', desc: '브랜드 아이덴티티 적용' },
          { icon: '🌙', title: '야간/주말 시공', desc: '영업 방해 최소화' },
          { icon: '🔌', title: 'IT 인프라', desc: '네트워크, 전원 최적화' },
        ],
      },
      benefits: {
        title: '시공 성과',
        items: [
          { number: '300+', label: '기업 시공' },
          { number: '40%', label: '업무 효율 개선' },
          { number: '2주', label: '평균 시공 기간' },
        ],
      },
      testimonial: {
        quote: '사무실 리뉴얼 후 직원들 출근 만족도가 확 올랐어요. 야간 시공으로 업무 차질도 없었습니다.',
        name: '이대표',
        role: 'IT 스타트업 대표',
      },
      cta: {
        title: '무료 견적 받아보세요',
        subtitle: '방문 상담 무료 | 주말 상담 가능',
        button: '견적 문의하기',
      },
    },
  },
  'store-interior-sample': {
    name: '상가 인테리어',
    category: '인테리어/시공',
    theme: 'neutral',
    themeColor: '#525252',
    gradientEnd: '#737373',
    content: {
      hero: {
        badge: '🏪 매출 2배 상승 사례 | 고객 동선 분석',
        headline: '인테리어 바꾸니\n매출이 2배',
        subtext: '고객 동선 분석 기반 공간 설계.\n매출을 올리는 상가 인테리어 전문.',
        cta: '무료 컨설팅',
        trust: '상가 시공 500개+ | 매출 증가 보장',
      },
      pain: {
        title: '가게 매출이 고민이신가요?',
        items: [
          { icon: '👀', text: '손님들이 매장 앞을 그냥 지나가요' },
          { icon: '🚶', text: '들어와도 구매 없이 나가는 경우가 많아요' },
          { icon: '📸', text: '인스타에 올릴 만한 매장이 아니에요' },
          { icon: '💰', text: '인테리어 비용 대비 효과가 있을까요?' },
        ],
      },
      solution: {
        title: '매출을 올리는 인테리어',
        description: '고객 행동 분석 기반 전략적 공간 설계',
        features: [
          { icon: '🚶', title: '동선 최적화', desc: '고객 체류 시간 증가' },
          { icon: '👁️', title: '파사드 디자인', desc: '눈에 띄는 외관 연출' },
          { icon: '📸', title: 'SNS 맛집 연출', desc: '사진 찍고 싶은 공간' },
          { icon: '💡', title: '조명 설계', desc: '상품이 돋보이는 조명' },
        ],
      },
      benefits: {
        title: '시공 효과',
        items: [
          { number: '2배', label: '평균 매출 증가' },
          { number: '500+', label: '상가 시공' },
          { number: '35%', label: '체류 시간 증가' },
        ],
      },
      testimonial: {
        quote: '리뉴얼 후 매출이 진짜 2배 됐어요. 동선 분석해서 상품 배치 바꾼 게 제일 효과 있었어요.',
        name: '김사장',
        role: '의류 매장 대표',
      },
      cta: {
        title: '매출 상승 컨설팅',
        subtitle: '무료 매장 분석 | 시공 후 효과 보장',
        button: '무료 컨설팅 신청',
      },
    },
  },
  'kitchen-interior-sample': {
    name: '주방 리모델링',
    category: '인테리어/시공',
    theme: 'zinc',
    themeColor: '#71717A',
    gradientEnd: '#A1A1AA',
    content: {
      hero: {
        badge: '🍳 싱크대+가전+시공 올인원 | 패키지 할인',
        headline: '20년 된 주방\n새집처럼 바꿔드립니다',
        subtext: '싱크대부터 가전, 시공까지 올인원 패키지.\n요리가 즐거워지는 주방을 만들어드립니다.',
        cta: '리모델링 상담',
        trust: '주방 시공 2,000건+ | 패키지 할인',
      },
      pain: {
        title: '주방 리모델링 고민 중?',
        items: [
          { icon: '🚰', text: '싱크대가 낡아서 불편해요' },
          { icon: '📦', text: '수납공간이 부족해요' },
          { icon: '🔥', text: '가스레인지를 인덕션으로 바꾸고 싶어요' },
          { icon: '💰', text: '각각 따로 하면 비용이 많이 들 것 같아요' },
        ],
      },
      solution: {
        title: '올인원 패키지로 해결',
        description: '싱크대+가전+시공 한 번에, 할인된 가격으로',
        features: [
          { icon: '🚿', title: '프리미엄 싱크대', desc: '국내 1등 브랜드 제품' },
          { icon: '🔌', title: '빌트인 가전', desc: '인덕션, 후드, 식기세척기' },
          { icon: '📐', title: '맞춤 설계', desc: '주방 크기별 최적 레이아웃' },
          { icon: '⚡', title: '빠른 시공', desc: '5일 완공 시스템' },
        ],
      },
      benefits: {
        title: '패키지 혜택',
        items: [
          { number: '30%', label: '패키지 할인' },
          { number: '5일', label: '시공 기간' },
          { number: '2,000+', label: '시공 실적' },
        ],
      },
      testimonial: {
        quote: '따로따로 하면 1,500만원인데 패키지로 1,000만원에 했어요. 5일 만에 완공되니 불편함도 없었어요.',
        name: '박주부',
        role: '30평대 아파트',
      },
      cta: {
        title: '주방 리모델링 상담',
        subtitle: '무료 방문 상담 | 패키지 할인 진행 중',
        button: '리모델링 상담 신청',
      },
    },
  },
};

// 기본 템플릿 (상세 데이터가 없는 경우)
const defaultTemplate = {
  name: '샘플 랜딩페이지',
  category: '샘플',
  theme: 'indigo',
  themeColor: '#6366F1',
  gradientEnd: '#8B5CF6',
  content: {
    hero: {
      badge: '✨ 특별 프로모션',
      headline: '당신의 성공을\n함께 만들어갑니다',
      subtext: '전문가와 함께하는 맞춤형 서비스로\n원하는 목표를 달성하세요.',
      cta: '무료 상담 받기',
      trust: '고객 만족도 98%',
    },
    pain: {
      title: '이런 고민 있으신가요?',
      items: [
        { icon: '😓', text: '어디서 시작해야 할지 모르겠어요' },
        { icon: '💸', text: '비용 대비 효과가 궁금해요' },
        { icon: '📊', text: '전문가의 도움이 필요해요' },
        { icon: '🎯', text: '확실한 결과를 원해요' },
      ],
    },
    solution: {
      title: '해결책을 드립니다',
      description: '검증된 방법론으로 확실한 결과를 만들어드립니다',
      features: [
        { icon: '✅', title: '맞춤 전략', desc: '상황에 맞는 최적의 방법' },
        { icon: '📈', title: '성과 보장', desc: '데이터 기반 결과 분석' },
        { icon: '🤝', title: '1:1 관리', desc: '전담 매니저 배정' },
        { icon: '💡', title: '지속 지원', desc: '사후 관리 서비스' },
      ],
    },
    benefits: {
      title: '성과',
      items: [
        { number: '500+', label: '고객' },
        { number: '98%', label: '만족도' },
        { number: '3배', label: '성과 향상' },
      ],
    },
    testimonial: {
      quote: '정말 만족스러운 서비스였습니다. 기대 이상의 결과를 얻었어요.',
      name: '김OO',
      role: '고객',
    },
    cta: {
      title: '지금 시작하세요',
      subtitle: '무료 상담으로 시작해보세요',
      button: '무료 상담 신청',
    },
  },
};

export default function SamplePreviewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const sample = sampleDetails[id] || defaultTemplate;
  const { themeColor, gradientEnd, content } = sample;

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      {/* 플로팅 네비게이션 */}
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        right: '20px',
        zIndex: 100,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <button
          onClick={() => router.back()}
          style={{
            padding: '10px 20px',
            background: 'rgba(255,255,255,0.95)',
            color: '#374151',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          ← 목록으로
        </button>
        <button
          onClick={() => router.push(`/create/${categoryToTopic[sample.category] || 'free'}`)}
          style={{
            padding: '12px 24px',
            background: themeColor,
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          }}
        >
          이 스타일로 만들기
        </button>
      </div>

      {/* 히어로 섹션 */}
      <section style={{
        background: `linear-gradient(135deg, ${themeColor} 0%, ${gradientEnd} 100%)`,
        padding: '120px 24px 80px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-block',
            padding: '8px 20px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '24px',
            marginBottom: '24px',
          }}>
            <span style={{ color: '#fff', fontSize: '14px', fontWeight: '600' }}>
              {content.hero.badge}
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(36px, 8vw, 56px)',
            fontWeight: '800',
            color: '#fff',
            lineHeight: 1.2,
            marginBottom: '20px',
            whiteSpace: 'pre-line',
          }}>
            {content.hero.headline}
          </h1>

          <p style={{
            fontSize: '18px',
            color: 'rgba(255,255,255,0.9)',
            lineHeight: 1.7,
            marginBottom: '32px',
            whiteSpace: 'pre-line',
          }}>
            {content.hero.subtext}
          </p>

          <button style={{
            padding: '18px 48px',
            background: '#fff',
            color: themeColor,
            border: 'none',
            borderRadius: '12px',
            fontSize: '17px',
            fontWeight: '700',
            cursor: 'pointer',
            marginBottom: '16px',
          }}>
            {content.hero.cta}
          </button>

          <p style={{
            fontSize: '14px',
            color: 'rgba(255,255,255,0.8)',
          }}>
            {content.hero.trust}
          </p>
        </div>
      </section>

      {/* 문제 섹션 */}
      <section style={{
        padding: '80px 24px',
        background: '#F9FAFB',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '800',
            color: '#191919',
            textAlign: 'center',
            marginBottom: '40px',
          }}>
            {content.pain.title}
          </h2>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}>
            {content.pain.items.map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '20px 24px',
                background: '#fff',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}>
                <span style={{ fontSize: '28px' }}>{item.icon}</span>
                <span style={{ fontSize: '16px', color: '#374151' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 솔루션 섹션 */}
      <section style={{
        padding: '80px 24px',
        background: '#fff',
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: '800',
              color: '#191919',
              marginBottom: '12px',
            }}>
              {content.solution.title}
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#6B7280',
            }}>
              {content.solution.description}
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '24px',
          }}>
            {content.solution.features.map((feature, i) => (
              <div key={i} style={{
                padding: '32px 24px',
                background: '#F9FAFB',
                borderRadius: '16px',
                textAlign: 'center',
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: `${themeColor}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  fontSize: '28px',
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#191919',
                  marginBottom: '8px',
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6B7280',
                  margin: 0,
                }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 성과 섹션 */}
      <section style={{
        padding: '60px 24px',
        background: `linear-gradient(135deg, ${themeColor}10 0%, ${gradientEnd}10 100%)`,
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '800',
            color: '#191919',
            textAlign: 'center',
            marginBottom: '40px',
          }}>
            {content.benefits.title}
          </h2>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '48px',
            flexWrap: 'wrap',
          }}>
            {content.benefits.items.map((item, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '40px',
                  fontWeight: '800',
                  color: themeColor,
                  marginBottom: '4px',
                }}>
                  {item.number}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#6B7280',
                }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 후기 섹션 */}
      <section style={{
        padding: '80px 24px',
        background: '#fff',
      }}>
        <div style={{
          maxWidth: '700px',
          margin: '0 auto',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '24px',
          }}>
            💬
          </div>
          <p style={{
            fontSize: '20px',
            color: '#374151',
            lineHeight: 1.7,
            marginBottom: '24px',
            fontStyle: 'italic',
          }}>
            "{content.testimonial.quote}"
          </p>
          <div>
            <div style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#191919',
            }}>
              {content.testimonial.name}
            </div>
            <div style={{
              fontSize: '14px',
              color: '#6B7280',
            }}>
              {content.testimonial.role}
            </div>
          </div>
        </div>
      </section>

      {/* 최종 CTA */}
      <section style={{
        padding: '80px 24px',
        background: `linear-gradient(135deg, ${themeColor} 0%, ${gradientEnd} 100%)`,
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '800',
            color: '#fff',
            marginBottom: '12px',
          }}>
            {content.cta.title}
          </h2>
          <p style={{
            fontSize: '16px',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '32px',
          }}>
            {content.cta.subtitle}
          </p>
          <button style={{
            padding: '18px 56px',
            background: '#fff',
            color: themeColor,
            border: 'none',
            borderRadius: '12px',
            fontSize: '17px',
            fontWeight: '700',
            cursor: 'pointer',
          }}>
            {content.cta.button}
          </button>
        </div>
      </section>

      {/* 푸터 */}
      <footer style={{
        padding: '40px 24px',
        background: '#191919',
        textAlign: 'center',
      }}>
        <p style={{
          fontSize: '14px',
          color: 'rgba(255,255,255,0.5)',
          marginBottom: '16px',
        }}>
          이 페이지는 랜딩메이커로 제작된 샘플입니다
        </p>
        <button
          onClick={() => router.push(`/create/${categoryToTopic[sample.category] || 'free'}`)}
          style={{
            padding: '12px 32px',
            background: themeColor,
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          이 스타일로 내 페이지 만들기
        </button>
      </footer>
    </div>
  );
}
