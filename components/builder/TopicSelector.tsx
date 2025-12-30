'use client';

import { TopicType } from '@/types/page';
import { TOPIC_LIST, TopicConfig } from '@/config/topics';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils/cn';

interface TopicSelectorProps {
  selectedTopic?: TopicType;
  onSelect: (topic: TopicType) => void;
}

function TopicCard({
  topic,
  isSelected,
  onClick,
}: {
  topic: TopicConfig;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <Card
      hover
      padding="md"
      onClick={onClick}
      className={cn(
        'flex flex-col items-center text-center cursor-pointer',
        isSelected && 'ring-2 ring-[#0064FF] border-[#0064FF] bg-[#E8F3FF]'
      )}
    >
      <span className="text-4xl mb-3">{topic.icon}</span>
      <h3 className="text-lg font-bold text-[#191F28] mb-1">{topic.name}</h3>
      <p className="text-sm text-[#8B95A1] line-clamp-2">{topic.description}</p>
    </Card>
  );
}

export function TopicSelector({ selectedTopic, onSelect }: TopicSelectorProps) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#191F28] mb-3">
          어떤 페이지를 만들까요?
        </h1>
        <p className="text-lg text-[#4E5968]">
          주제를 선택하면 AI가 최적화된 랜딩페이지를 만들어드려요
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {TOPIC_LIST.map((topic) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            isSelected={selectedTopic === topic.id}
            onClick={() => onSelect(topic.id)}
          />
        ))}
      </div>
    </div>
  );
}
