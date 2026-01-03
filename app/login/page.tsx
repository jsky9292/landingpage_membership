'use client';

import { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDemoLogin, setShowDemoLogin] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await signIn('demo-login', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError('이메일 또는 비밀번호가 일치하지 않습니다.');
      setIsLoading(false);
    } else {
      router.push(callbackUrl);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fff',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* 토스 스타일 헤더 */}
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

      {/* 메인 콘텐츠 */}
      <main style={{
        flex: 1,
        padding: '40px 24px',
        maxWidth: '440px',
        margin: '0 auto',
        width: '100%',
      }}>
        {/* 타이틀 */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '26px',
            fontWeight: '700',
            color: '#191919',
            lineHeight: 1.4,
            marginBottom: '12px',
          }}>
            로그인
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#6B7280',
            lineHeight: 1.6,
          }}>
            계정에 로그인하고 랜딩페이지를 관리하세요
          </p>
        </div>

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
            카카오로 로그인
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
            Google로 로그인
          </button>
        </div>

        {/* 데모 로그인 토글 */}
        <div style={{ marginTop: '32px' }}>
          <button
            onClick={() => setShowDemoLogin(!showDemoLogin)}
            style={{
              width: '100%',
              padding: '14px',
              background: 'transparent',
              color: '#6B7280',
              border: 'none',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {showDemoLogin ? '접기' : '🧪 테스트 계정으로 로그인'}
          </button>

          {showDemoLogin && (
            <form onSubmit={handleSubmit} style={{
              marginTop: '16px',
              padding: '20px',
              background: '#F8FAFC',
              borderRadius: '16px',
            }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px',
                }}>
                  이메일
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@demo.com"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px',
                    fontSize: '16px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px',
                }}>
                  비밀번호
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="admin123"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px',
                    fontSize: '16px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  required
                />
              </div>

              {error && (
                <p style={{
                  color: '#EF4444',
                  fontSize: '14px',
                  marginBottom: '16px',
                }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: '#191919',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.6 : 1,
                }}
              >
                {isLoading ? '로그인 중...' : '로그인'}
              </button>

              <div style={{
                marginTop: '16px',
                padding: '12px',
                background: '#EFF6FF',
                borderRadius: '8px',
              }}>
                <p style={{ fontSize: '13px', color: '#3B82F6', margin: 0 }}>
                  <strong>관리자:</strong> admin@demo.com / admin123<br/>
                  <strong>일반:</strong> user@demo.com / user123
                </p>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* 하단 회원가입 링크 */}
      <footer style={{
        padding: '20px 24px',
        borderTop: '1px solid #F3F4F6',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: '15px', color: '#6B7280' }}>
          아직 계정이 없으신가요?{' '}
          <Link href="/signup" style={{ color: '#3182F6', fontWeight: '600', textDecoration: 'none' }}>
            회원가입
          </Link>
        </p>
      </footer>
    </div>
  );
}

export default function LoginPage() {
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
      <LoginForm />
    </Suspense>
  );
}
