import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // 인증된 사용자는 그대로 진행
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // /create 경로는 로그인 필수
        if (req.nextUrl.pathname.startsWith('/create')) {
          return !!token;
        }
        // /dashboard, /pages, /settings는 로그인 필수
        if (req.nextUrl.pathname.startsWith('/dashboard') ||
            req.nextUrl.pathname.startsWith('/pages') ||
            req.nextUrl.pathname.startsWith('/settings')) {
          return !!token;
        }
        // /admin은 로그인 필수 (role 체크는 페이지에서)
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return !!token;
        }
        // 그 외는 허용
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
  ],
};
