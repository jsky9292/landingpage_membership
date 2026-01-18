'use client';

import { useState, ReactNode } from 'react';
import DashboardSidebar, { SidebarConfig } from './DashboardSidebar';

interface DashboardLayoutProps {
  sidebarConfig: SidebarConfig;
  children: ReactNode;
}

export default function DashboardLayout({
  sidebarConfig,
  children
}: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar
        config={sidebarConfig}
        collapsed={sidebarCollapsed}
        onCollapse={setSidebarCollapsed}
      />

      {/* 메인 콘텐츠 */}
      <main
        className={`
          transition-all duration-300
          ${sidebarCollapsed ? 'ml-[70px]' : 'ml-[260px]'}
        `}
      >
        <div className="p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

// 대시보드 헤더 컴포넌트
export function DashboardHeader({
  title,
  subtitle,
  userName,
  actions
}: {
  title: string;
  subtitle?: string;
  userName?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          {subtitle && (
            <p className="text-gray-500 mt-1">
              {userName ? `${userName}님, ${subtitle}` : subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

// 대시보드 섹션 컴포넌트
export function DashboardSection({
  title,
  subtitle,
  action,
  children
}: {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="mb-6">
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          <div>
            {title && <h2 className="text-lg font-bold text-gray-800">{title}</h2>}
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

// 대시보드 그리드 컴포넌트
export function DashboardGrid({
  children,
  cols = 2
}: {
  children: ReactNode;
  cols?: 1 | 2 | 3 | 4;
}) {
  const colsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={`grid gap-6 ${colsClass[cols]}`}>
      {children}
    </div>
  );
}
