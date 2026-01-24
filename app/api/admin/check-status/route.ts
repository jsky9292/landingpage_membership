import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { supabaseAdmin } from '@/lib/db/supabase';

// 관리자 이메일 목록
const ADMIN_EMAILS = ['jsky9292@gmail.com'];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not logged in', session: null }, { status: 401 });
    }

    const email = session.user.email;
    const shouldBeAdmin = ADMIN_EMAILS.includes(email.toLowerCase());

    if (!supabaseAdmin) {
      return NextResponse.json({
        error: 'Database not configured',
        email,
        shouldBeAdmin,
      }, { status: 500 });
    }

    // 현재 DB의 프로필 조회
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('id, email, name, role')
      .eq('email', email)
      .single();

    if (error) {
      return NextResponse.json({
        error: 'Profile not found',
        email,
        shouldBeAdmin,
        dbError: error.message,
      }, { status: 404 });
    }

    const currentRole = profile?.role;
    const isAdmin = currentRole === 'admin';

    // 관리자여야 하는데 아닌 경우 수정
    if (shouldBeAdmin && !isAdmin) {
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({ role: 'admin', plan: 'agency' })
        .eq('email', email);

      if (updateError) {
        return NextResponse.json({
          email,
          shouldBeAdmin,
          currentRole,
          isAdmin,
          fixAttempted: true,
          fixError: updateError.message,
        });
      }

      return NextResponse.json({
        email,
        shouldBeAdmin,
        currentRole,
        isAdmin,
        fixed: true,
        newRole: 'admin',
        message: 'Admin role has been fixed! Please refresh the dashboard.',
      });
    }

    return NextResponse.json({
      email,
      shouldBeAdmin,
      currentRole,
      isAdmin,
      status: isAdmin ? 'OK - You are admin' : 'Not admin',
    });
  } catch (error) {
    console.error('Check status error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
