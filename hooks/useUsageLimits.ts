'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface UsageLimits {
  pagesCreated: number;
  maxPages: number;
  imagesGenerated: number;
  maxImagesPerDay: number;
  plan: 'free' | 'starter' | 'pro';
}

interface UsageState {
  limits: UsageLimits;
  canCreatePage: boolean;
  canGenerateImage: boolean;
  isLoading: boolean;
  incrementPages: () => void;
  incrementImages: () => void;
  resetDailyLimits: () => void;
}

const DEFAULT_LIMITS: Record<string, { maxPages: number; maxImagesPerDay: number }> = {
  free: { maxPages: 999, maxImagesPerDay: 999 },
  starter: { maxPages: 3, maxImagesPerDay: 30 },
  pro: { maxPages: 10, maxImagesPerDay: 100 },
};

function getStorageKey(userId: string | undefined): string {
  return `usage_${userId || 'anonymous'}`;
}

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

export function useUsageLimits(): UsageState {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [limits, setLimits] = useState<UsageLimits>({
    pagesCreated: 0,
    maxPages: 1,
    imagesGenerated: 0,
    maxImagesPerDay: 3,
    plan: 'free',
  });

  const userId = (session?.user as any)?.id;

  // 사용량 로드
  useEffect(() => {
    const loadUsage = () => {
      try {
        const stored = localStorage.getItem(getStorageKey(userId));
        if (stored) {
          const data = JSON.parse(stored);

          // 날짜가 바뀌면 일일 제한 리셋
          if (data.date !== getToday()) {
            data.imagesGenerated = 0;
            data.date = getToday();
            localStorage.setItem(getStorageKey(userId), JSON.stringify(data));
          }

          const planLimits = DEFAULT_LIMITS[data.plan || 'free'];
          setLimits({
            pagesCreated: data.pagesCreated || 0,
            maxPages: planLimits.maxPages,
            imagesGenerated: data.imagesGenerated || 0,
            maxImagesPerDay: planLimits.maxImagesPerDay,
            plan: data.plan || 'free',
          });
        }
      } catch (e) {
        console.error('Failed to load usage:', e);
      }
      setIsLoading(false);
    };

    // 로그인 상태 확인 후 로드
    if (status !== 'loading') {
      loadUsage();
    }
  }, [userId, status]);

  // 페이지 생성 횟수 증가
  const incrementPages = useCallback(() => {
    setLimits((prev) => {
      const newLimits = { ...prev, pagesCreated: prev.pagesCreated + 1 };
      const stored = localStorage.getItem(getStorageKey(userId)) || '{}';
      const data = JSON.parse(stored);
      data.pagesCreated = newLimits.pagesCreated;
      data.date = getToday();
      localStorage.setItem(getStorageKey(userId), JSON.stringify(data));
      return newLimits;
    });
  }, [userId]);

  // 이미지 생성 횟수 증가
  const incrementImages = useCallback(() => {
    setLimits((prev) => {
      const newLimits = { ...prev, imagesGenerated: prev.imagesGenerated + 1 };
      const stored = localStorage.getItem(getStorageKey(userId)) || '{}';
      const data = JSON.parse(stored);
      data.imagesGenerated = newLimits.imagesGenerated;
      data.date = getToday();
      localStorage.setItem(getStorageKey(userId), JSON.stringify(data));
      return newLimits;
    });
  }, [userId]);

  // 일일 제한 리셋
  const resetDailyLimits = useCallback(() => {
    setLimits((prev) => {
      const newLimits = { ...prev, imagesGenerated: 0 };
      const stored = localStorage.getItem(getStorageKey(userId)) || '{}';
      const data = JSON.parse(stored);
      data.imagesGenerated = 0;
      data.date = getToday();
      localStorage.setItem(getStorageKey(userId), JSON.stringify(data));
      return newLimits;
    });
  }, [userId]);

  return {
    limits,
    canCreatePage: limits.pagesCreated < limits.maxPages,
    canGenerateImage: limits.imagesGenerated < limits.maxImagesPerDay,
    isLoading,
    incrementPages,
    incrementImages,
    resetDailyLimits,
  };
}

// 로그인 필요 여부 확인 훅
export function useRequireAuth() {
  const { data: session, status } = useSession();
  const { canCreatePage } = useUsageLimits();

  return {
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    needsLogin: !session && !canCreatePage,
    needsUpgrade: session && !canCreatePage,
    session,
  };
}
