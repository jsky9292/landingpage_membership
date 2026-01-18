import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

// Rate limiting (simple in-memory)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  return response;
}

export default withAuth(
  function middleware(req) {
    // Rate limiting for API
    if (req.nextUrl.pathname.startsWith('/api')) {
      const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
      const now = Date.now();
      const record = rateLimitStore.get(ip);

      if (record && now < record.resetTime && record.count >= 200) {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
      }

      if (!record || now > record.resetTime) {
        rateLimitStore.set(ip, { count: 1, resetTime: now + 60000 });
      } else {
        record.count++;
      }
    }

    const response = NextResponse.next();
    return addSecurityHeaders(response);
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        // Protected routes
        if (
          path.startsWith('/create') ||
          path.startsWith('/dashboard') ||
          path.startsWith('/pages') ||
          path.startsWith('/settings') ||
          path.startsWith('/admin') ||
          path.startsWith('/preview') ||
          path.startsWith('/submissions')
        ) {
          return !!token;
        }

        return true;
      },
    },
    pages: {
      signIn: '/login',
    },
  }
);

export const config = {
  matcher: [
    '/create/:path*',
    '/dashboard/:path*',
    '/pages/:path*',
    '/settings/:path*',
    '/admin/:path*',
    '/preview/:path*',
    '/submissions/:path*',
  ],
};
