import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { createServerClient } from '@/lib/supabase/client';

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ hasApiKey: false });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createServerClient() as any;

    if (!supabase) {
      return NextResponse.json({ hasApiKey: false });
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('api_settings')
      .eq('email', session.user.email)
      .single();

    if (error || !profile) {
      return NextResponse.json({ hasApiKey: false });
    }

    const apiSettings = profile.api_settings;
    const hasApiKey = apiSettings?.useOwnKey && apiSettings?.geminiApiKey;

    return NextResponse.json({ hasApiKey: !!hasApiKey });
  } catch (error) {
    console.error('Error checking API key:', error);
    return NextResponse.json({ hasApiKey: false });
  }
}
