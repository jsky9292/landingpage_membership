'use client';

import { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function SignUpForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const refCode = searchParams.get('ref') || '';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    name: '',
    referralCode: refCode,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (formData.password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.');
      return;
    }

    setLoading(true);

    try {
      // 회원가입 API 호출
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          referralCode: formData.referralCode,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || '회원가입에 실패했습니다.');
        return;
      }

      // 회원가입 성공 후 자동 로그인
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.ok) {
        router.push(callbackUrl);
      } else {
        // 로그인 실패시 로그인 페이지로
        router.push('/login?message=signup_success');
      }
    } catch {
      setError('서버 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fff',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* 헤더 */}
      <header style={{
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid #F3F4F6',
      }}>
        <button
          onClick={() => router.back()}
          style={{
            background: 'none',
            border: 'none',
            padding: '8px',
            cursor: 'pointer',
            fontSize: '20px',
          }}
        >
          ←
        </button>
      </header>

      {/* 메인 */}
      <main style={{
        flex: 1,
        padding: '40px 24px',
        maxWidth: '440px',
        margin: '0 auto',
        width: '100%',
      }}>
        {/* 타이틀 */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '26px',
            fontWeight: '700',
            color: '#191919',
            lineHeight: 1.4,
            marginBottom: '12px',
          }}>
            {showEmailForm ? '이메일로 가입하기' : '3초만에 시작하기'}
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#6B7280',
            lineHeight: 1.6,
          }}>
            {showEmailForm
              ? '이메일과 비밀번호를 입력해주세요'
              : '소셜 계정으로 간편하게 가입하세요'}
          </p>
        </div>

        {!showEmailForm ? (
          <>
            {/* 소셜 로그인 버튼 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={() => signIn('kakao', { callbackUrl })}
                style={{
                  width: '100%',
                  padding: '18px 24px',
                  background: '#FEE500',
                  color: '#191919',
                  border: 'none',
                  borderRadius: '16px',
                  fontSize: '17px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#191919">
                  <path d="M12 3C6.48 3 2 6.58 2 11c0 2.83 1.87 5.31 4.68 6.71l-1.19 4.46c-.08.3.27.53.52.35L10.34 19c.55.07 1.1.1 1.66.1 5.52 0 10-3.58 10-8s-4.48-8-10-8z"/>
                </svg>
                카카오로 계속하기
              </button>

              <button
                onClick={() => signIn('google', { callbackUrl })}
                style={{
                  width: '100%',
                  padding: '18px 24px',
                  background: '#fff',
                  color: '#374151',
                  border: '1px solid #E5E7EB',
                  borderRadius: '16px',
                  fontSize: '17px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google로 계속하기
              </button>

              <button
                onClick={() => setShowEmailForm(true)}
                style={{
                  width: '100%',
                  padding: '18px 24px',
                  background: '#F8FAFC',
                  color: '#374151',
                  border: '1px solid #E5E7EB',
                  borderRadius: '16px',
                  fontSize: '17px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                }}
              >
                이메일로 가입하기
              </button>
            </div>

            {/* 혜택 카드 */}
            <div style={{
              marginTop: '32px',
              padding: '20px',
              background: '#F8FAFC',
              borderRadius: '16px',
            }}>
              <p style={{
                fontSize: '15px',
                fontWeight: '600',
                color: '#191919',
                marginBottom: '12px',
              }}>
                가입 즉시 제공
              </p>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}>
                {[
                  '무료 랜딩페이지 1개',
                  'AI 콘텐츠 자동 생성',
                  '신청자 관리 대시보드',
                  '1,000P 가입 포인트',
                ].map((item, i) => (
                  <li key={i} style={{
                    fontSize: '14px',
                    color: '#374151',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <span style={{ color: '#3182F6' }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          /* 이메일 가입 폼 */
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {error && (
              <div style={{
                padding: '12px 16px',
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: '12px',
                color: '#DC2626',
                fontSize: '14px',
              }}>
                {error}
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                이름 (선택)
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="홍길동"
                style={{
                  width: '100%',
                  padding: '16px',
                  border: '1px solid #E5E7EB',
                  borderRadius: '12px',
                  fontSize: '16px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                이메일 *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="example@email.com"
                style={{
                  width: '100%',
                  padding: '16px',
                  border: '1px solid #E5E7EB',
                  borderRadius: '12px',
                  fontSize: '16px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                비밀번호 * (6자 이상)
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '16px',
                  border: '1px solid #E5E7EB',
                  borderRadius: '12px',
                  fontSize: '16px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                비밀번호 확인 *
              </label>
              <input
                type="password"
                required
                value={formData.passwordConfirm}
                onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '16px',
                  border: '1px solid #E5E7EB',
                  borderRadius: '12px',
                  fontSize: '16px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                추천인 코드 (선택)
              </label>
              <input
                type="text"
                value={formData.referralCode}
                onChange={(e) => setFormData({ ...formData, referralCode: e.target.value.toUpperCase() })}
                placeholder="ABCD1234"
                maxLength={8}
                style={{
                  width: '100%',
                  padding: '16px',
                  border: '1px solid #E5E7EB',
                  borderRadius: '12px',
                  fontSize: '16px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  textTransform: 'uppercase',
                }}
              />
              <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>
                추천인 코드 입력시 1,000P 추가 지급
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '18px 24px',
                background: loading ? '#9CA3AF' : '#3182F6',
                color: '#fff',
                border: 'none',
                borderRadius: '16px',
                fontSize: '17px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '8px',
              }}
            >
              {loading ? '가입 중...' : '회원가입'}
            </button>

            <button
              type="button"
              onClick={() => setShowEmailForm(false)}
              style={{
                width: '100%',
                padding: '14px 24px',
                background: 'transparent',
                color: '#6B7280',
                border: 'none',
                fontSize: '15px',
                cursor: 'pointer',
              }}
            >
              ← 다른 방법으로 가입
            </button>
          </form>
        )}

        {/* 약관 */}
        <p style={{
          marginTop: '24px',
          fontSize: '13px',
          color: '#9CA3AF',
          textAlign: 'center',
          lineHeight: 1.6,
        }}>
          가입 시 <Link href="/terms" style={{ color: '#6B7280', textDecoration: 'underline' }}>이용약관</Link> 및{' '}
          <Link href="/privacy" style={{ color: '#6B7280', textDecoration: 'underline' }}>개인정보처리방침</Link>에 동의합니다
        </p>
      </main>

      {/* 하단 로그인 링크 */}
      <footer style={{
        padding: '20px 24px',
        borderTop: '1px solid #F3F4F6',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: '15px', color: '#6B7280' }}>
          이미 계정이 있으신가요?{' '}
          <Link href="/login" style={{ color: '#3182F6', fontWeight: '600', textDecoration: 'none' }}>
            로그인
          </Link>
        </p>
      </footer>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fff',
      }}>
        <p style={{ color: '#6B7280' }}>로딩 중...</p>
      </div>
    }>
      <SignUpForm />
    </Suspense>
  );
}
