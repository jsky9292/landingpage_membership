import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { scrapeWebsite } from '@/lib/scrape';
import { createServerClient } from '@/lib/supabase/client';

// Pro 사용자만 사용 가능한 스크래핑 API
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    // 사용자 플랜 확인
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createServerClient() as any;
    const { data: user } = await supabase
      .from('users')
      .select('id, plan, role')
      .eq('email', session.user.email)
      .single();

    if (!user) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // Pro 또는 Admin만 사용 가능
    const isPro = user.plan === 'pro' || user.plan === 'premium' || user.role === 'admin';
    if (!isPro) {
      return NextResponse.json(
        { error: 'Pro 플랜 이상에서만 사용 가능한 기능입니다.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { url } = body as { url: string };

    // URL 유효성 검사
    if (!url) {
      return NextResponse.json(
        { error: 'URL을 입력해주세요.' },
        { status: 400 }
      );
    }

    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: '올바른 URL 형식이 아닙니다.' },
        { status: 400 }
      );
    }

    // 스크래핑 실행
    console.log(`[Scrape API] Starting scrape for: ${url}`);
    const result = await scrapeWebsite({ url });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || '스크래핑 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    // 결과 반환 (outputDir을 상대 경로로 변환)
    const publicDir = process.cwd() + '/public';
    const relativePath = result.outputDir.replace(publicDir, '').replace(/\\/g, '/');

    return NextResponse.json({
      success: true,
      data: {
        outputDir: relativePath,
        sections: result.sections,
        images: result.images.filter(img => img.downloaded),
        fonts: result.fonts,
        videos: result.videos,
        framer: result.framer,
        metadata: result.metadata,
      },
    });
  } catch (error) {
    console.error('Scrape API Error:', error);
    return NextResponse.json(
      {
        error: '스크래핑 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
