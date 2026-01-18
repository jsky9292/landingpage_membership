import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { scrapeWebsite } from '@/lib/scrape';
import { supabaseAdmin } from '@/lib/db/supabase';

// Pro only scraping API
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Login required' },
        { status: 401 }
      );
    }

    // Check admin role from session first
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sessionRole = (session.user as any)?.role;
    let isPro = sessionRole === 'admin';

    // If not admin, check plan from DB (if Supabase is configured)
    if (!isPro && supabaseAdmin) {
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('id, plan')
        .eq('email', session.user.email)
        .single();

      if (profile) {
        isPro = profile.plan === 'pro' || profile.plan === 'premium' || profile.plan === 'starter';
      }
    }

    // Demo mode - allow admin from session
    if (!supabaseAdmin && !isPro) {
      return NextResponse.json(
        { error: 'Pro plan required' },
        { status: 403 }
      );
    }

    // Only Pro or Admin allowed
    if (!isPro && supabaseAdmin) {
      return NextResponse.json(
        { error: 'Pro plan required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { url } = body as { url: string };

    // URL validation
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Execute scraping
    console.log(`[Scrape API] Starting scrape for: ${url}`);
    const result = await scrapeWebsite({ url });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Scraping failed' },
        { status: 500 }
      );
    }

    // Return result (convert outputDir to relative path)
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
        error: 'Scraping failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
