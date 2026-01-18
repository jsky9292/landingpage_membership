'use client';

import { ReactNode } from 'react';

// 포인트/통계 카드 (이미지의 상단 4개 카드)
export interface StatCardProps {
  icon?: ReactNode;
  label: string;
  value: string | number;
  suffix?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  highlight?: boolean;
  color?: 'default' | 'pink' | 'blue' | 'green' | 'purple';
}

export function StatCard({
  icon,
  label,
  value,
  suffix,
  trend,
  trendValue,
  highlight = false,
  color = 'default'
}: StatCardProps) {
  const getColorStyles = () => {
    if (highlight) {
      return 'bg-gradient-to-r from-pink-500 to-purple-500 text-white';
    }
    switch (color) {
      case 'pink': return 'bg-pink-50 border-pink-200';
      case 'blue': return 'bg-blue-50 border-blue-200';
      case 'green': return 'bg-green-50 border-green-200';
      case 'purple': return 'bg-purple-50 border-purple-200';
      default: return 'bg-white border-gray-200';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '⏱️';
    }
  };

  return (
    <div className={`rounded-2xl border p-5 ${getColorStyles()}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-sm ${highlight ? 'text-white/80' : 'text-gray-500'}`}>
            {label}
          </p>
          <p className={`text-2xl font-bold mt-2 ${highlight ? 'text-white' : 'text-gray-800'}`}>
            {typeof value === 'number' ? value.toLocaleString() : value}
            {suffix && <span className="text-base font-normal ml-1">{suffix}</span>}
          </p>
          {trendValue && (
            <p className={`text-xs mt-1 ${highlight ? 'text-white/70' : 'text-gray-400'}`}>
              {trendValue}
            </p>
          )}
        </div>
        {icon && (
          <div className={`text-2xl ${highlight ? 'opacity-80' : ''}`}>
            {icon}
          </div>
        )}
        {trend && !icon && (
          <div className="text-xl">
            {getTrendIcon()}
          </div>
        )}
      </div>
    </div>
  );
}

// 4개 통계 카드 그리드 (이미지의 대시보드 상단)
export interface DashboardStatsGridProps {
  stats: StatCardProps[];
}

export function DashboardStatsGrid({ stats }: DashboardStatsGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}

// 작업 현황 (이미지의 중간 섹션)
export interface WorkStatusProps {
  waiting: number;
  pending: number;
  processing: number;
  completed: number;
  failed: number;
}

export function WorkStatusCards({ waiting, pending, processing, completed, failed }: WorkStatusProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">작업 현황</h3>
      <div className="grid grid-cols-5 gap-2">
        <StatusColumn label="대기" value={waiting} color="gray" />
        <StatusColumn label="대기중" value={pending} color="blue" />
        <StatusColumn label="처리중" value={processing} color="yellow" />
        <StatusColumn label="완료" value={completed} color="green" />
        <StatusColumn label="실패" value={failed} color="red" />
      </div>
    </div>
  );
}

function StatusColumn({
  label,
  value,
  color
}: {
  label: string;
  value: number;
  color: 'gray' | 'blue' | 'yellow' | 'green' | 'red';
}) {
  const colorStyles = {
    gray: 'bg-gray-50 text-gray-600',
    blue: 'bg-blue-50 text-blue-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600'
  };

  return (
    <div className={`text-center p-4 rounded-xl ${colorStyles[color]}`}>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}

// 포인트 잔액 카드 (이미지의 왼쪽 상단)
export function PointBalanceCard({
  points,
  label = '포인트 잔액',
  onCharge
}: {
  points: number;
  label?: string;
  onCharge?: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-3xl font-bold text-pink-500 mt-1">
            {points.toLocaleString()}
            <span className="text-lg">P</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-3xl">💰</span>
          {onCharge && (
            <button
              onClick={onCharge}
              className="px-3 py-1.5 bg-pink-500 text-white text-sm rounded-lg hover:bg-pink-600 transition-colors"
            >
              충전
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
