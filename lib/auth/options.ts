import { AuthOptions } from 'next-auth';
import KakaoProvider from 'next-auth/providers/kakao';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { createServerClient } from '@/lib/supabase/client';

// 데모 계정 (개발/테스트용)
const DEMO_USERS = [
  {
    id: 'demo-admin',
    email: 'admin@demo.com',
    password: 'admin123',
    name: '관리자',
    role: 'admin',
  },
  {
    id: 'demo-user',
    email: 'user@demo.com',
    password: 'user123',
    name: '테스트 사용자',
    role: 'user',
  },
];

export const authOptions: AuthOptions = {
  providers: [
    // 데모 계정 로그인 (개발/테스트용)
    CredentialsProvider({
      id: 'demo-login',
      name: '데모 계정',
      credentials: {
        email: { label: '이메일', type: 'email', placeholder: 'admin@demo.com' },
        password: { label: '비밀번호', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = DEMO_USERS.find(
          (u) => u.email === credentials.email && u.password === credentials.password
        );

        if (user) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        }

        return null;
      },
    }),
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

        // 데모 계정인 경우 role 설정
        const demoUser = DEMO_USERS.find(u => u.email === user.email);
        const role = demoUser?.role || 'user';

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
          console.log('[Auth] User synced to Supabase');
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
