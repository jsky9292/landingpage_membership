/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { supabaseAdmin } from '@/lib/db/supabase';

// 신청 상태 업데이트
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: submissionId } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { status, memo } = body;

    const supabase = supabaseAdmin;

    // 현재 사용자 조회
    const { data: user } = await supabase
      .from('profiles')
      .select('id, role')
      .eq('email', session.user.email)
      .single();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 신청 데이터 조회
    const { data: submission } = await supabase
      .from('submissions')
      .select('id, page_id')
      .eq('id', submissionId)
      .single();

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    // 페이지 소유권 확인
    const { data: page } = await supabase
      .from('landing_pages')
      .select('user_id')
      .eq('id', submission.page_id)
      .single();

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // 권한 확인
    if (page.user_id !== user.id && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 업데이트
    const updateData: Record<string, string> = {};
    if (status) updateData.status = status;
    if (memo !== undefined) updateData.memo = memo;

    const { data: updated, error } = await supabase
      .from('submissions')
      .update(updateData)
      .eq('id', submissionId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Failed to update submission' }, { status: 500 });
    }

    return NextResponse.json({ submission: updated });
  } catch (error) {
    console.error('Update submission error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
