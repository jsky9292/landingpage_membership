import { AuthOptions } from 'next-auth';
import KakaoProvider from 'next-auth/providers/kakao';
import GoogleProvider from 'next-auth/providers/google';
import { createServerClient } from '@/lib/supabase/client';

// 관리자 이메일 목록
const ADMIN_EMAILS = [
  'jsky9292@gmail.com',
];

// 이메일이 관리자인지 확인
function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

export const authOptions: AuthOptions = {
  providers: [
    // 카카오 로그인
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
    // 구글 로그인
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // 최초 로그인 시 사용자 정보 저장
      if (user) {
        token.id = user.id;
        token.provider = account?.provider;
      }
      return token;
    },
    async session({ session, token }) {
      // 세션에 사용자 ID 추가
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).provider = token.provider;
      }
      return session;
    },
    async signIn({ user, account }) {
      console.log('[Auth] User signed in:', {
        id: user.id,
        email: user.email,
        name: user.name,
        provider: account?.provider,
      });

      // Supabase에 사용자 정보 저장/업데이트
      try {
        const supabase = createServerClient() as any;

        // 관리자 이메일 확인
        const role = isAdminEmail(user.email) ? 'admin' : 'user';

        const { error } = await supabase
          .from('users')
          .upsert({
            email: user.email,
            name: user.name || user.email?.split('@')[0],
            avatar_url: user.image,
            role: role,
          }, {
            onConflict: 'email',
            ignoreDuplicates: false,
          });

        if (error) {
          console.error('[Auth] Failed to upsert user:', error);
        } else {
          console.log('[Auth] User synced to Supabase, role:', role);
        }
      } catch (err) {
        console.error('[Auth] Supabase sync error:', err);
      }

      return true;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30일
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};
