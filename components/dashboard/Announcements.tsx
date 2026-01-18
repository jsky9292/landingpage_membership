'use client';

import { useState } from 'react';
import Link from 'next/link';

export interface Announcement {
  id: string;
  type: 'important' | 'info' | 'update';
  title: string;
  content: string;
  date: string;
  link?: string;
}

interface AnnouncementsProps {
  announcements: Announcement[];
  maxDisplay?: number;
  showMoreLink?: string;
}

export default function Announcements({
  announcements,
  maxDisplay = 3,
  showMoreLink
}: AnnouncementsProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'important':
        return {
          bg: 'bg-gradient-to-r from-pink-500 to-rose-500',
          badge: 'bg-yellow-400 text-yellow-900',
          icon: '⚠️'
        };
      case 'update':
        return {
          bg: 'bg-gradient-to-r from-blue-500 to-cyan-500',
          badge: 'bg-blue-100 text-blue-700',
          icon: '🔄'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-gray-400 to-gray-500',
          badge: 'bg-gray-100 text-gray-700',
          icon: 'ℹ️'
        };
    }
  };

  const displayedAnnouncements = announcements.slice(0, maxDisplay);

  if (announcements.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl overflow-hidden">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <span className="text-lg">📢</span>
          <span className="font-medium">공지사항</span>
          <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
            {announcements.length}개
          </span>
        </div>
        {showMoreLink && (
          <Link
            href={showMoreLink}
            className="text-white/80 hover:text-white text-sm"
          >
            전체보기 →
          </Link>
        )}
      </div>

      {/* 공지 목록 */}
      <div className="bg-white border border-t-0 border-gray-200 divide-y divide-gray-100">
        {displayedAnnouncements.map((announcement) => {
          const styles = getTypeStyles(announcement.type);
          const isExpanded = expanded === announcement.id;

          return (
            <div
              key={announcement.id}
              className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => setExpanded(isExpanded ? null : announcement.id)}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg flex-shrink-0">{styles.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {announcement.type === 'important' && (
                      <span className="px-2 py-0.5 text-xs font-bold bg-red-100 text-red-600 rounded">
                        중요
                      </span>
                    )}
                    <h4 className="font-medium text-gray-800 truncate">
                      {announcement.title}
                    </h4>
                  </div>

                  <p className={`text-sm text-gray-500 ${isExpanded ? '' : 'line-clamp-2'}`}>
                    {announcement.content}
                  </p>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-400">
                      📅 {announcement.date}
                    </span>
                    {announcement.link && (
                      <Link
                        href={announcement.link}
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs text-pink-500 hover:underline"
                      >
                        자세히 보기 →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
