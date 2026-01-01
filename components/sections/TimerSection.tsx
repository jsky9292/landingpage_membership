'use client';

import { useState, useEffect } from 'react';
import { TimerContent, ThemeType, SectionStyle } from '@/types/page';
import { THEMES } from '@/config/themes';

interface TimerSectionProps {
  content: TimerContent;
  theme?: ThemeType;
  style?: SectionStyle;
  isEditable?: boolean;
  onEdit?: (content: TimerContent) => void;
}

export function TimerSection({ content, theme = 'toss', style }: TimerSectionProps) {
  const colors = THEMES[theme]?.colors || THEMES.toss.colors;
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!content.endDate) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
      }

      const endTime = new Date(content.endDate).getTime();
      const now = new Date().getTime();
      const difference = endTime - now;

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
        expired: false,
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [content.endDate]);

  // 테마에 맞는 기본 배경색 설정
  const backgroundColor = content.backgroundColor || colors.primary;
  const textColor = content.textColor || '#FFFFFF';

  if (timeLeft.expired && content.expiredMessage) {
    return (
      <div
        style={{
          background: backgroundColor,
          padding: '16px 24px',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            color: textColor,
            fontSize: '18px',
            fontWeight: '600',
            margin: 0,
          }}
        >
          {content.expiredMessage}
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: backgroundColor,
        padding: '16px 24px',
        textAlign: 'center',
      }}
    >
      {content.title && (
        <p
          style={{
            color: textColor,
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '12px',
            marginTop: 0,
          }}
        >
          {content.title}
        </p>
      )}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        {(content.showDays !== false) && (
          <TimeBlock value={timeLeft.days} label="일" textColor={textColor} />
        )}
        {(content.showHours !== false) && (
          <TimeBlock value={timeLeft.hours} label="시간" textColor={textColor} />
        )}
        {(content.showMinutes !== false) && (
          <TimeBlock value={timeLeft.minutes} label="분" textColor={textColor} />
        )}
        {(content.showSeconds !== false) && (
          <TimeBlock value={timeLeft.seconds} label="초" textColor={textColor} />
        )}
      </div>
    </div>
  );
}

function TimeBlock({ value, label, textColor }: { value: number; label: string; textColor: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'rgba(0,0,0,0.2)',
        borderRadius: '8px',
        padding: '12px 16px',
        minWidth: '60px',
      }}
    >
      <span
        style={{
          fontSize: '28px',
          fontWeight: '700',
          color: textColor,
          fontFamily: 'monospace',
        }}
      >
        {String(value).padStart(2, '0')}
      </span>
      <span
        style={{
          fontSize: '12px',
          color: textColor,
          opacity: 0.8,
        }}
      >
        {label}
      </span>
    </div>
  );
}
