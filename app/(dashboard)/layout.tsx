'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { cn } from '@/lib/utils/cn';
import { getVersionWithBuild } from '@/config/version';

const navigation = [
  { name: '대시보드', href: '/dashboard' },
  { name: '내 페이지', href: '/pages' },
  { name: '고객 관리', href: '/submissions' },
  { name: '설정', href: '/settings' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2" title="홈으로 이동">
                <span className="text-xl font-bold text-[#0064FF]">랜딩메이커</span>
              </Link>
              <Link
                href="/"
                className="text-xs text-[#6B7280] hover:text-[#0064FF] transition-colors hidden sm:block"
              >
                ← 홈으로
              </Link>
            </div>

            {/* 네비게이션 - 데스크톱 */}
            <nav className="hidden md:flex items-center gap-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href ||
                  (item.href !== '/dashboard' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-[#E8F3FF] text-[#0064FF]'
                        : 'text-[#4E5968] hover:bg-gray-100'
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* 새 페이지 만들기 버튼 + 로그아웃 */}
            <div className="flex items-center gap-3">
              <Link
                href="/create/free"
                className="bg-[#0064FF] hover:bg-[#0050CC] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                새 페이지 만들기
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="hidden md:block text-[#4E5968] hover:text-[#191F28] text-sm font-medium transition-colors"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>

        {/* 네비게이션 - 모바일 */}
        <nav className="md:hidden border-t border-gray-200 bg-white">
          <div className="flex justify-around py-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== '/dashboard' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'px-4 py-2 text-xs font-medium transition-colors',
                    isActive
                      ? 'text-[#0064FF]'
                      : 'text-[#4E5968]'
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="px-4 py-2 text-xs font-medium text-[#4E5968] transition-colors"
            >
              로그아웃
            </button>
          </div>
        </nav>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* 푸터 */}
      <footer className="border-t border-gray-200 bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <p>&copy; 2025 랜딩메이커. All rights reserved.</p>
            <p>{getVersionWithBuild()}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
