'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';

const navigation = [
  { name: '대시보드', href: '/admin/dashboard', icon: '📊' },
  { name: '내 페이지', href: '/admin/pages', icon: '📄' },
  { name: '회원관리', href: '/admin/users', icon: '👥' },
  { name: '설정', href: '/admin/settings', icon: '⚙️' },
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
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center gap-2">
                <span className="text-2xl">🚀</span>
                <span className="text-xl font-bold text-[#191F28]">랜딩AI</span>
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
                    <span className="mr-2">{item.icon}</span>
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* 새 페이지 만들기 버튼 */}
            <div className="flex items-center">
              <Link
                href="/create/free"
                className="bg-[#0064FF] hover:bg-[#0050CC] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                + 새 페이지 만들기
              </Link>
            </div>
          </div>
        </div>

        {/* 네비게이션 - 모바일 */}
        <nav className="md:hidden border-t border-gray-200 bg-white">
          <div className="flex justify-around py-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex flex-col items-center px-4 py-2 text-xs font-medium transition-colors',
                    isActive
                      ? 'text-[#0064FF]'
                      : 'text-[#4E5968]'
                  )}
                >
                  <span className="text-xl mb-1">{item.icon}</span>
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
