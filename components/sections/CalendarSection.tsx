'use client';

import { useState } from 'react';
import { CalendarContent, SectionStyle, ThemeType } from '@/types/page';
import { THEMES } from '@/config/themes';

interface CalendarSectionProps {
  theme?: ThemeType;
  content: CalendarContent;
  style?: SectionStyle;
  isEditable?: boolean;
  onEdit?: (content: CalendarContent) => void;
  onBooking?: (booking: { date: string; time: string; name: string; phone: string }) => void;
}

export function CalendarSection({ content, theme = 'toss', style, onBooking }: CalendarSectionProps) {
  const colors = THEMES[theme]?.colors || THEMES.toss.colors;
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [step, setStep] = useState<'date' | 'time' | 'info' | 'done'>('date');
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const titleSize = style?.titleFontSize || 28;
  const textSize = style?.textFontSize || 16;

  // 현재 월의 날짜들 생성
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: (Date | null)[] = [];

    // 첫째 날 이전 빈 칸
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    // 해당 월의 날짜들
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const days = getDaysInMonth(currentMonth);

  const isAvailable = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return false;

    const dayName = dayNames[date.getDay()];
    return content.availableDays.includes(dayName);
  };

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const formatDisplayDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}월 ${date.getDate()}일 (${dayNames[date.getDay()]})`;
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(formatDate(date));
    setStep('time');
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep('info');
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !formData.name || !formData.phone) return;

    setIsSubmitting(true);

    // 예약 데이터 저장
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const booking = {
      id: `booking-${Date.now()}`,
      date: selectedDate,
      time: selectedTime,
      duration: content.duration,
      name: formData.name,
      phone: formData.phone,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));

    onBooking?.(booking);

    setTimeout(() => {
      setStep('done');
      setIsSubmitting(false);
    }, 1000);
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  return (
    <>
      <style>{`
        .calendar-label-${theme} {
          font-size: clamp(12px, 3.5vw, 14px);
          font-weight: 600;
          color: ${colors.primary};
          margin-bottom: 8px;
          text-align: center;
        }
        .calendar-title-${theme} {
          font-size: clamp(22px, 6vw, ${titleSize}px);
          font-weight: bold;
          color: ${colors.text};
          text-align: center;
          margin-bottom: 8px;
          word-break: keep-all;
          text-wrap: balance;
        }
        .calendar-subtitle-${theme} {
          font-size: clamp(14px, 3.8vw, ${textSize}px);
          color: ${colors.textSecondary};
          text-align: center;
          margin-bottom: 32px;
          word-break: keep-all;
          text-wrap: balance;
        }
      `}</style>
      <section id="calendar-section" style={{ padding: 'clamp(48px, 10vw, 64px) 20px', background: colors.background }}>
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          {content.label && (
            <p className={`calendar-label-${theme}`}>
              {content.label}
            </p>
          )}

          <h2 className={`calendar-title-${theme}`}>
            {content.title}
          </h2>

          {content.subtitle && (
            <p className={`calendar-subtitle-${theme}`}>
              {content.subtitle}
            </p>
          )}

        {/* 단계 표시 */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '24px'
        }}>
          {['날짜', '시간', '정보', '완료'].map((s, i) => {
            const stepNames = ['date', 'time', 'info', 'done'];
            const currentIndex = stepNames.indexOf(step);
            const isActive = i <= currentIndex;
            return (
              <div key={s} style={{
                width: '60px',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: isActive ? colors.primary : colors.border,
                  color: isActive ? '#fff' : colors.textMuted,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: '600',
                  margin: '0 auto 4px'
                }}>
                  {i + 1}
                </div>
                <span style={{
                  fontSize: '12px',
                  color: isActive ? colors.text : colors.textMuted
                }}>
                  {s}
                </span>
              </div>
            );
          })}
        </div>

        {/* 날짜 선택 */}
        {step === 'date' && (
          <div style={{
            background: colors.backgroundAlt,
            borderRadius: '16px',
            padding: '20px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <button onClick={prevMonth} style={{
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                padding: '8px',
                color: colors.text
              }}>
                ←
              </button>
              <span style={{ fontWeight: '600', color: colors.text }}>
                {currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월
              </span>
              <button onClick={nextMonth} style={{
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                padding: '8px',
                color: colors.text
              }}>
                →
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '4px',
              marginBottom: '8px'
            }}>
              {dayNames.map(day => (
                <div key={day} style={{
                  textAlign: 'center',
                  fontSize: '12px',
                  color: colors.textMuted,
                  padding: '8px 0'
                }}>
                  {day}
                </div>
              ))}
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '4px'
            }}>
              {days.map((date, i) => {
                const available = isAvailable(date);
                return (
                  <button
                    key={i}
                    onClick={() => date && available && handleDateSelect(date)}
                    disabled={!available}
                    style={{
                      padding: '10px 0',
                      border: 'none',
                      borderRadius: '8px',
                      background: date && available ? colors.background : 'transparent',
                      color: date ? (available ? colors.text : colors.border) : 'transparent',
                      cursor: available ? 'pointer' : 'default',
                      fontWeight: available ? '500' : '400',
                      fontSize: '14px'
                    }}
                  >
                    {date?.getDate() || ''}
                  </button>
                );
              })}
            </div>

            {content.note && (
              <p style={{
                fontSize: '13px',
                color: colors.textMuted,
                textAlign: 'center',
                marginTop: '16px'
              }}>
                {content.note}
              </p>
            )}
          </div>
        )}

        {/* 시간 선택 */}
        {step === 'time' && selectedDate && (
          <div style={{
            background: colors.backgroundAlt,
            borderRadius: '16px',
            padding: '20px'
          }}>
            <button onClick={() => setStep('date')} style={{
              background: 'none',
              border: 'none',
              color: colors.primary,
              fontSize: '14px',
              cursor: 'pointer',
              marginBottom: '16px'
            }}>
              ← 날짜 다시 선택
            </button>

            <p style={{
              fontSize: '16px',
              fontWeight: '600',
              color: colors.text,
              marginBottom: '16px'
            }}>
              {formatDisplayDate(selectedDate)}
            </p>

            <p style={{
              fontSize: '14px',
              color: colors.textSecondary,
              marginBottom: '16px'
            }}>
              상담 시간을 선택해주세요 ({content.duration}분)
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px'
            }}>
              {content.availableTimes.map(time => (
                <button
                  key={time}
                  onClick={() => handleTimeSelect(time)}
                  style={{
                    padding: '12px',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '8px',
                    background: colors.background,
                    color: colors.text,
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 정보 입력 */}
        {step === 'info' && selectedDate && selectedTime && (
          <div style={{
            background: colors.backgroundAlt,
            borderRadius: '16px',
            padding: '20px'
          }}>
            <button onClick={() => setStep('time')} style={{
              background: 'none',
              border: 'none',
              color: colors.primary,
              fontSize: '14px',
              cursor: 'pointer',
              marginBottom: '16px'
            }}>
              ← 시간 다시 선택
            </button>

            <div style={{
              background: colors.primaryLight,
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '20px'
            }}>
              <p style={{ fontSize: '14px', color: colors.primary, marginBottom: '4px' }}>
                선택하신 일정
              </p>
              <p style={{ fontSize: '16px', fontWeight: '600', color: colors.text }}>
                {formatDisplayDate(selectedDate)} {selectedTime}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', color: colors.textSecondary, display: 'block', marginBottom: '6px' }}>
                  이름 <span style={{ color: colors.error }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="실명을 입력해주세요"
                  style={{
                    width: '100%',
                    padding: '14px',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '8px',
                    fontSize: '15px',
                    boxSizing: 'border-box',
                    background: colors.background,
                    color: colors.text
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', color: colors.textSecondary, display: 'block', marginBottom: '6px' }}>
                  연락처 <span style={{ color: colors.error }}>*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
                  placeholder="010-0000-0000"
                  style={{
                    width: '100%',
                    padding: '14px',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '8px',
                    fontSize: '15px',
                    boxSizing: 'border-box',
                    background: colors.background,
                    color: colors.text
                  }}
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!formData.name || !formData.phone || isSubmitting}
              style={{
                width: '100%',
                padding: '16px',
                marginTop: '20px',
                border: 'none',
                borderRadius: '12px',
                background: (formData.name && formData.phone) ? colors.primary : colors.border,
                color: '#fff',
                fontSize: '16px',
                fontWeight: '600',
                cursor: (formData.name && formData.phone) ? 'pointer' : 'not-allowed'
              }}
            >
              {isSubmitting ? '예약 중...' : '예약 완료하기'}
            </button>
          </div>
        )}

        {/* 완료 */}
        {step === 'done' && (
          <div style={{
            background: colors.backgroundAlt,
            borderRadius: '16px',
            padding: 'clamp(24px, 6vw, 32px) 20px',
            textAlign: 'center'
          }}>
            <div style={{
              width: 'clamp(56px, 14vw, 64px)',
              height: 'clamp(56px, 14vw, 64px)',
              background: '#E8F5E9',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: 'clamp(24px, 6vw, 28px)',
              color: colors.success
            }}>
              ✓
            </div>
            <h3 style={{
              fontSize: 'clamp(18px, 5vw, 20px)',
              fontWeight: '700',
              color: colors.text,
              marginBottom: '8px'
            }}>
              예약이 완료되었습니다!
            </h3>
            <p style={{
              fontSize: 'clamp(14px, 3.8vw, 15px)',
              color: colors.textSecondary,
              marginBottom: '16px',
              lineHeight: 1.6
            }}>
              {formData.name}님, 예약해주셔서 감사합니다.<br/>
              확인 문자를 보내드릴게요.
            </p>
            <div style={{
              background: colors.background,
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '20px'
            }}>
              <p style={{ fontSize: '14px', color: colors.textMuted, marginBottom: '4px' }}>예약 일시</p>
              <p style={{ fontSize: '16px', fontWeight: '600', color: colors.text }}>
                {selectedDate && formatDisplayDate(selectedDate)} {selectedTime}
              </p>
            </div>
            <button
              onClick={() => {
                setStep('date');
                setSelectedDate(null);
                setSelectedTime(null);
                setFormData({ name: '', phone: '' });
              }}
              style={{
                background: 'none',
                border: `1px solid ${colors.border}`,
                borderRadius: '8px',
                padding: '12px 24px',
                color: colors.textSecondary,
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              다른 일정 예약하기
            </button>
          </div>
        )}
      </div>
    </section>
    </>
  );
}
