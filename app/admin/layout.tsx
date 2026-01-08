'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';

const navigation = [
  { name: '대시보드', href: '/admin/dashboard' },
  { name: '사용자 관리', href: '/admin/users' },
  { name: '전체 페이지', href: '/admin/pages' },
  { name: 'URL 만들기', href: '/admin/create-url' },
  { name: '설정', href: '/admin/settings' },
];

export default function AdminLayout({
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
              <Link href="/admin/dashboard" className="flex items-center gap-2">
                <span className="text-xl font-bold text-[#0064FF]">랜딩AI</span>
                <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded-full font-medium">관리자</span>
              </Link>
              <Link
                href="/dashboard"
                className="text-xs text-[#6B7280] hover:text-[#0064FF] transition-colors hidden sm:block"
              >
                ← 내 대시보드
              </Link>
            </div>

            {/* 네비게이션 - 데스크톱 */}
            <nav className="hidden md:flex items-center gap-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href ||
                  (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
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

            {/* 홈으로 버튼 */}
            <div className="flex items-center">
              <Link
                href="/"
                className="text-[#4E5968] hover:text-[#191F28] text-sm font-medium transition-colors"
              >
                홈으로
              </Link>
            </div>
          </div>
        </div>

        {/* 네비게이션 - 모바일 */}
        <nav className="md:hidden border-t border-gray-200 bg-white overflow-x-auto">
          <div className="flex py-2 px-2 gap-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap rounded-lg',
                    isActive
                      ? 'bg-[#E8F3FF] text-[#0064FF]'
                      : 'text-[#4E5968]'
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
