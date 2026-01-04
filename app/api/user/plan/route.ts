/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { supabaseAdmin } from '@/lib/db/supabase';

const validPlans = ['free', 'starter', 'pro', 'unlimited', 'agency'];

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessionUser = session.user as any;
    const isAdmin = sessionUser.role === 'admin';

    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 });
    }

    const body = await request.json();
    const { plan } = body;

    if (plan && !validPlans.includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const { data: profile, error: userError } = await supabaseAdmin
      .from('profiles')
      .select('id, plan')
      .eq('email', session.user.email)
      .single();

    if (userError || !profile) {
      return NextResponse.json({
        success: true,
        message: 'Demo mode - plan updated',
        plan: plan || 'free',
      });
    }

    if (plan) {
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({ plan })
        .eq('id', profile.id);

      if (updateError) {
        console.error('Plan update error:', updateError);
        return NextResponse.json({ error: 'Failed to update plan' }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: true,
      plan: plan || profile.plan,
    });
  } catch (error) {
    console.error('User plan API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessionUser = session.user as any;

    return NextResponse.json({
      email: session.user.email,
      plan: sessionUser.plan || 'free',
      role: sessionUser.role || 'user',
    });
  } catch (error) {
    console.error('User plan GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
