import Anthropic from '@anthropic-ai/sdk';

// 기본 클라이언트 (환경변수 사용)
const defaultClient = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// API 키로 클라이언트 생성
function getClient(apiKey?: string): Anthropic {
  if (apiKey) {
    return new Anthropic({ apiKey });
  }
  return defaultClient;
}

export async function generateWithClaude(prompt: string, apiKey?: string): Promise<string> {
  const client = getClient(apiKey);
  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 8192,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const textBlock = message.content.find((block) => block.type === 'text');
  return textBlock?.type === 'text' ? textBlock.text : '';
}
