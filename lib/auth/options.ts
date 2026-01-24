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

// 추천인 코드 생성 (8자리 영문숫자)
function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// 초기 지급 포인트
const INITIAL_POINTS = 1000;

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
    async jwt({ token, user, account, trigger }) {
      // 최초 로그인 시 사용자 정보 저장
      if (user) {
        token.id = user.id;
        token.provider = account?.provider;
        // 관리자 이메일 확인하여 role 저장
        token.role = isAdminEmail(user.email) ? 'admin' : 'user';
      }

      // 세션 업데이트 시 DB에서 role 다시 확인
      if (trigger === 'update' || !token.role) {
        const supabase = createServerClient() as any;
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('email', token.email)
          .single();
        if (profile) {
          token.role = profile.role;
        }
      }

      return token;
    },
    async session({ session, token }) {
      // 세션에 사용자 ID와 role 추가
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).provider = token.provider;
        (session.user as any).role = token.role || 'user';
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

      // Supabase에 사용자 정보 저장/업데이트 (users + profiles 양쪽)
      try {
        const supabase = createServerClient() as any;

        // 기존 사용자 확인
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id, referral_code, points')
          .eq('email', user.email)
          .single();

        // 관리자 이메일 확인
        const role = isAdminEmail(user.email) ? 'admin' : 'user';

        // 새 사용자인 경우 추천 코드와 초기 포인트 설정
        const isNewUser = !existingProfile;
        const referralCode = existingProfile?.referral_code || generateReferralCode();

        const userData: Record<string, unknown> = {
          email: user.email,
          name: user.name || user.email?.split('@')[0],
          avatar_url: user.image,
          role: role,
          plan: role === 'admin' ? 'agency' : 'free',
        };

        // 새 사용자인 경우 추가 필드 설정
        if (isNewUser) {
          userData.referral_code = referralCode;
          userData.points = INITIAL_POINTS;
          userData.referral_count = 0;
          userData[`${account?.provider}_linked`] = true;
        }

        // users 테이블에 저장
        const { error: usersError } = await supabase
          .from('users')
          .upsert(userData, {
            onConflict: 'email',
            ignoreDuplicates: false,
          });

        if (usersError) {
          console.error('[Auth] Failed to upsert to users:', usersError);
        }

        // profiles 테이블에도 저장 (API 호환성)
        const { error: profilesError } = await supabase
          .from('profiles')
          .upsert(userData, {
            onConflict: 'email',
            ignoreDuplicates: false,
          });

        if (profilesError) {
          console.error('[Auth] Failed to upsert to profiles:', profilesError);
        }

        // 새 사용자인 경우 포인트 히스토리 기록
        if (isNewUser) {
          await supabase
            .from('point_history')
            .insert({
              user_id: existingProfile?.id,
              type: 'bonus',
              amount: INITIAL_POINTS,
              balance: INITIAL_POINTS,
              description: `가입 축하 포인트 ${INITIAL_POINTS}P`,
              metadata: { type: 'signup', provider: account?.provider },
            });
        }

        console.log('[Auth] User synced to Supabase, role:', role, 'isNew:', isNewUser);
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
