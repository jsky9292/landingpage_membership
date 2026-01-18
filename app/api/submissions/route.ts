import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { supabaseAdmin } from '@/lib/db/supabase';

// 데모 신청 데이터
const demoSubmissions = [
  {
    id: 'sub-1',
    page_id: 'demo-page-1',
    page_title: '마케팅 실전 부트캠프',
    name: '김철수',
    phone: '010-1234-5678',
    email: 'kim@example.com',
    message: '상담 받고 싶습니다.',
    status: 'new' as const,
    memo: '',
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'sub-2',
    page_id: 'demo-page-1',
    page_title: '마케팅 실전 부트캠프',
    name: '이영희',
    phone: '010-2345-6789',
    email: 'lee@example.com',
    message: '강의 일정이 궁금합니다.',
    status: 'contacted' as const,
    memo: '6월 개강 안내함',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: 'sub-3',
    page_id: 'demo-page-2',
    page_title: '보험 무료 상담',
    name: '박민수',
    phone: '010-3456-7890',
    email: 'park@example.com',
    message: '보험 리모델링 상담 원합니다.',
    status: 'done' as const,
    memo: '상담 완료, 계약 진행 중',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: 'sub-4',
    page_id: 'demo-page-2',
    page_title: '보험 무료 상담',
    name: '정수진',
    phone: '010-4567-8901',
    email: 'jung@example.com',
    message: '',
    status: 'new' as const,
    memo: '',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: 'sub-5',
    page_id: 'demo-page-3',
    page_title: '아파트 분양 상담',
    name: '최동훈',
    phone: '010-5678-9012',
    email: 'choi@example.com',
    message: '모델하우스 방문 예약하고 싶어요.',
    status: 'contacted' as const,
    memo: '3/15 오후 2시 방문 예약',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: 'sub-6',
    page_id: 'demo-page-3',
    page_title: '아파트 분양 상담',
    name: '강민지',
    phone: '010-6789-0123',
    email: '',
    message: '59타입 문의드립니다.',
    status: 'canceled' as const,
    memo: '연락 안됨',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const userId = (session.user as any).id;

    // Supabase 미설정시 데모 데이터 반환
    if (!supabaseAdmin) {
      return NextResponse.json({
        submissions: demoSubmissions,
        total: demoSubmissions.length,
      });
    }

    // 사용자의 페이지 ID 목록 조회
    const { data: userPages } = await supabaseAdmin
      .from('landing_pages')
      .select('id, title')
      .eq('user_id', userId);

    if (!userPages || userPages.length === 0) {
      return NextResponse.json({
        submissions: [],
        total: 0,
      });
    }

    const pageIds = userPages.map(p => p.id);
    const pageTitles = Object.fromEntries(userPages.map(p => [p.id, p.title]));

    // 해당 페이지들의 모든 신청 조회
    const { data: submissions, error } = await supabaseAdmin
      .from('submissions')
      .select('*')
      .in('page_id', pageIds)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Submissions fetch error:', error);
      return NextResponse.json({ error: '신청 목록을 불러오는데 실패했습니다.' }, { status: 500 });
    }

    // 페이지 제목 추가
    const submissionsWithPageTitle = (submissions || []).map(sub => ({
      ...sub,
      page_title: pageTitles[sub.page_id] || '알 수 없는 페이지',
    }));

    return NextResponse.json({
      submissions: submissionsWithPageTitle,
      total: submissionsWithPageTitle.length,
    });
  } catch (error) {
    console.error('Submissions API error:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
