'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export interface NavItem {
  name: string;
  href: string;
  icon: string;
  badge?: string | number;
  badgeColor?: 'red' | 'green' | 'blue' | 'yellow';
  isNew?: boolean;
  children?: NavItem[];
}

export interface SidebarConfig {
  logo?: {
    text: string;
    subText?: string;
    href?: string;
  };
  user?: {
    name: string;
    points?: number;
    avatar?: string;
  };
  navItems: NavItem[];
  bottomItems?: NavItem[];
}

interface DashboardSidebarProps {
  config: SidebarConfig;
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

export default function DashboardSidebar({
  config,
  collapsed = false,
  onCollapse
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (name: string) => {
    setExpandedItems(prev =>
      prev.includes(name)
        ? prev.filter(item => item !== name)
        : [...prev, name]
    );
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  const getBadgeStyle = (color?: string) => {
    switch (color) {
      case 'red': return 'bg-red-100 text-red-600';
      case 'green': return 'bg-green-100 text-green-600';
      case 'blue': return 'bg-blue-100 text-blue-600';
      case 'yellow': return 'bg-yellow-100 text-yellow-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <aside
      className={`
        fixed left-0 top-0 h-full bg-white border-r border-gray-200
        transition-all duration-300 z-40
        ${collapsed ? 'w-[70px]' : 'w-[260px]'}
      `}
    >
      {/* 로고 영역 */}
      {config.logo && (
        <div className="p-4 border-b border-gray-100">
          <Link href={config.logo.href || '/dashboard'} className="flex items-center gap-2">
            {!collapsed && (
              <>
                <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                  {config.logo.text}
                </span>
                {config.logo.subText && (
                  <span className="text-xs text-gray-400">{config.logo.subText}</span>
                )}
              </>
            )}
            {collapsed && (
              <span className="text-xl font-bold text-pink-500 mx-auto">
                {config.logo.text.charAt(0)}
              </span>
            )}
          </Link>
        </div>
      )}

      {/* 사용자 정보 */}
      {config.user && !collapsed && (
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold">
              {config.user.avatar || config.user.name.charAt(0)}
            </div>
            <div>
              <p className="font-medium text-gray-800 text-sm">{config.user.name}</p>
              {config.user.points !== undefined && (
                <p className="text-xs text-pink-500 font-semibold">
                  포인트: {config.user.points.toLocaleString()}P
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 네비게이션 */}
      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {config.navItems.map((item) => (
            <li key={item.name}>
              {item.children ? (
                // 하위 메뉴가 있는 경우
                <div>
                  <button
                    onClick={() => toggleExpand(item.name)}
                    className={`
                      w-full flex items-center justify-between px-3 py-2.5 rounded-lg
                      transition-all duration-200 group
                      ${expandedItems.includes(item.name)
                        ? 'bg-pink-50 text-pink-600'
                        : 'text-gray-600 hover:bg-gray-50'}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{item.icon}</span>
                      {!collapsed && <span className="text-sm font-medium">{item.name}</span>}
                    </div>
                    {!collapsed && (
                      <span className={`text-xs transition-transform ${expandedItems.includes(item.name) ? 'rotate-180' : ''}`}>
                        ▼
                      </span>
                    )}
                  </button>

                  {/* 하위 메뉴 */}
                  {!collapsed && expandedItems.includes(item.name) && (
                    <ul className="mt-1 ml-4 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.name}>
                          <Link
                            href={child.href}
                            className={`
                              flex items-center gap-2 px-3 py-2 rounded-lg text-sm
                              ${isActive(child.href)
                                ? 'bg-pink-100 text-pink-600 font-medium'
                                : 'text-gray-500 hover:bg-gray-50'}
                            `}
                          >
                            <span>{child.icon}</span>
                            <span>{child.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                // 단일 메뉴
                <Link
                  href={item.href}
                  className={`
                    flex items-center justify-between px-3 py-2.5 rounded-lg
                    transition-all duration-200
                    ${isActive(item.href)
                      ? 'bg-pink-100 text-pink-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{item.icon}</span>
                    {!collapsed && <span className="text-sm">{item.name}</span>}
                  </div>

                  {!collapsed && (
                    <div className="flex items-center gap-2">
                      {item.isNew && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-green-500 text-white rounded">
                          NEW
                        </span>
                      )}
                      {item.badge && (
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getBadgeStyle(item.badgeColor)}`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* 하단 메뉴 */}
      {config.bottomItems && (
        <div className="p-3 border-t border-gray-100">
          <ul className="space-y-1">
            {config.bottomItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg
                    transition-all duration-200
                    ${isActive(item.href)
                      ? 'bg-pink-100 text-pink-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'}
                  `}
                >
                  <span className="text-lg">{item.icon}</span>
                  {!collapsed && <span className="text-sm">{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 접기/펼치기 버튼 */}
      <button
        onClick={() => onCollapse?.(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50"
      >
        <span className={`text-xs text-gray-400 transition-transform ${collapsed ? 'rotate-180' : ''}`}>
          ◀
        </span>
      </button>
    </aside>
  );
}
