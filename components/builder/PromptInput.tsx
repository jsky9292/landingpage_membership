'use client';

import { useState } from 'react';
import { TopicType } from '@/types/page';
import { TOPICS } from '@/config/topics';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface PromptInputProps {
  topic: TopicType;
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
}

export function PromptInput({ topic, onSubmit, isLoading }: PromptInputProps) {
  const [prompt, setPrompt] = useState('');
  const [showExample, setShowExample] = useState(false);
  const topicConfig = TOPICS[topic];

  const handleSubmit = () => {
    if (prompt.trim()) {
      onSubmit(prompt.trim());
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#E8F3FF] rounded-full mb-4">
          <span className="text-2xl">{topicConfig.icon}</span>
          <span className="text-[#0064FF] font-semibold">{topicConfig.name}</span>
        </div>
        <h1 className="text-2xl font-bold text-[#191F28] mb-2">
          상세 내용을 알려주세요
        </h1>
        <p className="text-[#4E5968]">
          자세히 적을수록 더 좋은 랜딩페이지가 만들어져요
        </p>
      </div>

      {/* 가이드 */}
      <Card variant="ghost" padding="md" className="mb-4">
        <div className="flex items-start gap-2">
          <span className="text-lg">💡</span>
          <div>
            <p className="text-sm font-medium text-[#333D4B] mb-2">
              이런 내용을 포함하면 좋아요
            </p>
            <p className="text-sm text-[#4E5968] whitespace-pre-line">
              {topicConfig.guide}
            </p>
          </div>
        </div>
      </Card>

      {/* 프롬프트 입력 */}
      <div className="mb-4">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="여기에 상세 내용을 입력해주세요..."
          className="min-h-[200px] text-base"
          disabled={isLoading}
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-[#8B95A1]">
            {prompt.length}자
          </span>
          <button
            type="button"
            onClick={() => setShowExample(!showExample)}
            className="flex items-center gap-1 text-sm text-[#0064FF] hover:underline"
          >
            예시 보기
            {showExample ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* 예시 */}
      {showExample && (
        <Card variant="outline" padding="md" className="mb-4">
          <p className="text-sm font-medium text-[#333D4B] mb-2">예시</p>
          <p className="text-sm text-[#4E5968] whitespace-pre-line">
            {topicConfig.examplePrompt}
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-3"
            onClick={() => setPrompt(topicConfig.examplePrompt)}
          >
            이 예시 사용하기
          </Button>
        </Card>
      )}

      {/* 생성 버튼 */}
      <Button
        fullWidth
        size="lg"
        onClick={handleSubmit}
        isLoading={isLoading}
        disabled={!prompt.trim() || isLoading}
        leftIcon={<Sparkles size={20} />}
      >
        {isLoading ? 'AI가 만들고 있어요...' : 'AI로 랜딩페이지 생성하기'}
      </Button>
    </div>
  );
}
