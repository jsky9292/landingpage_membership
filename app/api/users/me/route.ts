import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { supabaseAdmin } from '@/lib/db/supabase';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 세션에서 role 확인
    const sessionRole = (session.user as any)?.role;

    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('id, email, name, plan, created_at')
      .eq('email', session.user.email)
      .single();

    if (error || !profile) {
      // 프로필이 없으면 세션 정보 반환
      return NextResponse.json({
        id: (session.user as any)?.id || 'session-user',
        email: session.user.email,
        name: session.user.name,
        plan: 'free',
        role: sessionRole || 'user',
      });
    }

    return NextResponse.json({
      ...profile,
      role: sessionRole || 'user',
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
