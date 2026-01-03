'use client';

import { Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function SignUpForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="text-4xl">🚀</span>
            <span className="text-2xl font-bold text-gray-900">랜딩AI</span>
          </Link>
          <p className="text-gray-600 mt-2">AI로 랜딩페이지를 자동 생성하세요</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-2">회원가입</h1>
          <p className="text-gray-500 text-sm mb-6">소셜 계정으로 간편하게 시작하세요</p>

          <div className="space-y-3">
            <button
              onClick={() => signIn('kakao', { callbackUrl })}
              className="w-full py-3.5 bg-[#FEE500] hover:bg-[#FDD835] text-gray-900 font-semibold rounded-xl transition-colors flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3C6.48 3 2 6.58 2 11c0 2.83 1.87 5.31 4.68 6.71l-1.19 4.46c-.08.3.27.53.52.35L10.34 19c.55.07 1.1.1 1.66.1 5.52 0 10-3.58 10-8s-4.48-8-10-8z"/>
              </svg>
              카카오로 시작하기
            </button>

            <button
              onClick={() => signIn('google', { callbackUrl })}
              className="w-full py-3.5 bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-colors flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google로 시작하기
            </button>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
            <p className="text-sm font-semibold text-indigo-900 mb-2">🎁 가입 혜택</p>
            <ul className="text-sm text-indigo-700 space-y-1">
              <li>✓ 무료 랜딩페이지 1개 제작</li>
              <li>✓ AI 자동 콘텐츠 생성</li>
              <li>✓ 신청자 관리 대시보드</li>
            </ul>
          </div>

          <p className="text-xs text-gray-400 text-center mt-6">
            가입 시 <Link href="/terms" className="underline">이용약관</Link> 및{' '}
            <Link href="/privacy" className="underline">개인정보처리방침</Link>에 동의합니다
          </p>
        </div>

        <p className="text-center text-gray-600 text-sm mt-6">
          이미 계정이 있으신가요?{' '}
          <Link href="/login" className="text-indigo-600 hover:underline font-medium">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    }>
      <SignUpForm />
    </Suspense>
  );
}
