'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingCTAProps {
  buttonText: string;
  onClick: () => void;
  phoneNumber?: string;
  showPhoneButton?: boolean;
}

export function FloatingCTA({ buttonText, onClick, phoneNumber, showPhoneButton = true }: FloatingCTAProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const formSection = document.getElementById('form-section');
      const formTop = formSection?.getBoundingClientRect().top || Infinity;

      // 스크롤이 400px 이상이고 폼 섹션이 화면에 들어오지 않았을 때 표시
      setIsVisible(scrollY > 400 && formTop > window.innerHeight);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 초기 상태 체크

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePhoneCall = () => {
    if (phoneNumber) {
      window.location.href = `tel:${phoneNumber.replace(/-/g, '')}`;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            padding: '12px 16px',
            paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
            background: '#fff',
            borderTop: '1px solid #E5E8EB',
            boxShadow: '0 -4px 20px rgba(0,0,0,0.08)'
          }}
        >
          <div style={{
            maxWidth: '480px',
            margin: '0 auto',
            display: 'flex',
            gap: '10px'
          }}>
            {/* 전화 버튼 */}
            {showPhoneButton && phoneNumber && (
              <button
                onClick={handlePhoneCall}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '14px 20px',
                  background: '#fff',
                  border: '2px solid #0064FF',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#0064FF',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                전화
              </button>
            )}

            {/* 상담 신청 버튼 */}
            <button
              onClick={onClick}
              style={{
                flex: showPhoneButton && phoneNumber ? 1.5 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '14px 20px',
                background: '#0064FF',
                border: 'none',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: '600',
                color: '#fff',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              {buttonText || '상담 신청'}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
