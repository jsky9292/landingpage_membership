'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';

interface Step {
  id: string;
  label: string;
  status: 'pending' | 'loading' | 'done';
}

const GENERATION_STEPS: Step[] = [
  { id: 'analyze', label: '타겟 고객 분석 중...', status: 'pending' },
  { id: 'pain', label: '페인포인트 추출 중...', status: 'pending' },
  { id: 'copy', label: '마케팅 카피 생성 중...', status: 'pending' },
  { id: 'design', label: '고급 디자인 적용 중...', status: 'pending' },
  { id: 'form', label: '신청폼 생성 중...', status: 'pending' },
];

interface GeneratingLoaderProps {
  isGenerating: boolean;
  onComplete?: () => void;
}

export function GeneratingLoader({ isGenerating, onComplete }: GeneratingLoaderProps) {
  const [steps, setSteps] = useState<Step[]>(GENERATION_STEPS);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isGenerating) return;

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < GENERATION_STEPS.length) {
        setSteps((prev) =>
          prev.map((step, idx) => {
            if (idx < currentStep) return { ...step, status: 'done' };
            if (idx === currentStep) return { ...step, status: 'loading' };
            return { ...step, status: 'pending' };
          })
        );
        setProgress((currentStep + 1) * 20);
        currentStep++;
      } else {
        clearInterval(interval);
        setSteps((prev) => prev.map((step) => ({ ...step, status: 'done' })));
        setProgress(100);
        onComplete?.();
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [isGenerating, onComplete]);

  return (
    <div className="w-full max-w-md mx-auto text-center">
      {/* 아이콘 */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
        className="w-20 h-20 mx-auto mb-6 flex items-center justify-center"
      >
        <span className="text-5xl">✨</span>
      </motion.div>

      {/* 타이틀 */}
      <h2 className="text-2xl font-bold text-[#191F28] mb-2">
        AI가 만들고 있어요
      </h2>
      <p className="text-[#4E5968] mb-8">약 10초 정도 걸려요</p>

      {/* 프로그레스 바 */}
      <div className="w-full h-2 bg-[#E5E8EB] rounded-full mb-8 overflow-hidden">
        <motion.div
          className="h-full bg-[#0064FF] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* 단계 */}
      <div className="space-y-3 text-left">
        {steps.map((step) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            {step.status === 'done' ? (
              <div className="w-6 h-6 rounded-full bg-[#00C853] flex items-center justify-center">
                <Check size={14} className="text-white" />
              </div>
            ) : step.status === 'loading' ? (
              <Loader2 size={24} className="text-[#0064FF] animate-spin" />
            ) : (
              <div className="w-6 h-6 rounded-full border-2 border-[#D1D6DB]" />
            )}
            <span
              className={
                step.status === 'done'
                  ? 'text-[#00C853] font-medium'
                  : step.status === 'loading'
                  ? 'text-[#0064FF] font-medium'
                  : 'text-[#8B95A1]'
              }
            >
              {step.status === 'done'
                ? step.label.replace('중...', '완료')
                : step.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
