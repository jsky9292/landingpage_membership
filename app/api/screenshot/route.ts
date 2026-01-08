import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { supabaseAdmin } from '@/lib/db/supabase';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Login required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { url } = body as { url: string };

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

    console.log(`[Screenshot API] Taking screenshot of: ${url}`);

    const isVercel = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;

    const browser = await puppeteer.launch({
      args: isVercel ? chromium.args : ['--no-sandbox'],
      defaultViewport: { width: 1280, height: 800 },
      executablePath: isVercel
        ? await chromium.executablePath()
        : process.platform === 'win32'
          ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
          : '/usr/bin/google-chrome',
      headless: true,
    });

    try {
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

      // Take screenshot as buffer
      const screenshotBuffer = await page.screenshot({
        type: 'jpeg',
        quality: 80,
      });

      await browser.close();

      // Upload to Supabase Storage
      const filename = `screenshots/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;

      const { data, error } = await supabaseAdmin.storage
        .from('thumbnails')
        .upload(filename, screenshotBuffer, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (error) {
        console.error('Supabase upload error:', error);
        // Fallback to base64 if storage fails
        const base64 = Buffer.from(screenshotBuffer).toString('base64');
        return NextResponse.json({
          success: true,
          thumbnail: `data:image/jpeg;base64,${base64}`,
        });
      }

      // Get public URL
      const { data: urlData } = supabaseAdmin.storage
        .from('thumbnails')
        .getPublicUrl(data.path);

      return NextResponse.json({
        success: true,
        thumbnail: urlData.publicUrl,
      });
    } catch (error) {
      await browser.close();
      throw error;
    }
  } catch (error) {
    console.error('Screenshot API Error:', error);
    return NextResponse.json(
      {
        error: 'Screenshot failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
