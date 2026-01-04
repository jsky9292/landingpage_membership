'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

interface ScrapeResult {
  outputDir: string;
  sections: Array<{
    index: number;
    tag: string;
    selector: string;
    category: string | null;
    rect: { top: number; height: number };
    confidence: number;
  }>;
  images: Array<{
    originalUrl: string;
    localPath?: string;
    type: string;
    sectionIndex: number;
    downloaded: boolean;
  }>;
  metadata: {
    url: string;
    domain: string;
    pageTitle: string;
    totalHeight: number;
    imageStats: { total: number; downloaded: number; failed: number };
  };
  framer?: {
    isFramerSite: boolean;
    elements: Array<{ framerName?: string }>;
    animations: Array<{ type: string }>;
  };
}

export default function CreateFromUrlPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<ScrapeResult | null>(null);
  const [isPro, setIsPro] = useState(false);
  const [checkingPlan, setCheckingPlan] = useState(true);
  const [showCopyrightWarning, setShowCopyrightWarning] = useState(false);
  const [agreedToCopyright, setAgreedToCopyright] = useState(false);

  // 사용자 플랜 확인
  useEffect(() => {
    async function checkUserPlan() {
      if (status === 'loading') return;

      if (!session?.user?.email) {
        setCheckingPlan(false);
        return;
      }

      try {
        const res = await fetch('/api/users/me');
        if (res.ok) {
          const data = await res.json();
          setIsPro(data.plan === 'pro' || data.plan === 'premium' || data.role === 'admin');
        }
      } catch (err) {
        console.error('Failed to check user plan:', err);
      }
      setCheckingPlan(false);
    }

    checkUserPlan();
  }, [session, status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreedToCopyright) {
      setShowCopyrightWarning(true);
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '스크래핑에 실패했습니다.');
      }

      setResult(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateSimilar = () => {
    if (!result) return;

    // 스크래핑 결과를 기반으로 course 페이지로 이동
    const sectionCategories = result.sections
      .filter(s => s.category)
      .map(s => s.category)
      .join(', ');

    const prompt = `${result.metadata.pageTitle}\n\n참고 사이트: ${result.metadata.url}\n\n발견된 섹션: ${sectionCategories || '히어로, 특징, CTA'}`;

    router.push(`/create/course?prompt=${encodeURIComponent(prompt)}`);
  };

  // 로딩 중
  if (status === 'loading' || checkingPlan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 로그인 필요
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">로그인이 필요합니다</h1>
          <p className="text-gray-600 mb-6">URL로 만들기 기능을 사용하려면 로그인해주세요.</p>
          <Link
            href="/login"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            로그인하기
          </Link>
        </div>
      </div>
    );
  }

  // Pro 플랜 필요
  if (!isPro) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">⭐</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Pro 플랜 전용 기능</h1>
          <p className="text-gray-600 mb-6">
            URL로 만들기 기능은 Pro 플랜 이상에서만 사용할 수 있습니다.
            <br />
            Pro 플랜으로 업그레이드하면 다음 기능을 사용할 수 있어요:
          </p>
          <ul className="text-left text-gray-600 mb-6 space-y-2">
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> URL로 유사 랜딩페이지 생성
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> 무제한 페이지 생성
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> 커스텀 도메인 연결
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> 분석 대시보드
            </li>
          </ul>
          <div className="flex gap-3 justify-center">
            <Link
              href="/pricing"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              요금제 보기
            </Link>
            <Link
              href="/create/course"
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition"
            >
              무료로 만들기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🚀</span>
            <span className="font-bold text-xl">랜딩 메이커</span>
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs px-2 py-0.5 rounded-full">PRO</span>
          </Link>
          <Link
            href="/create/course"
            className="text-gray-600 hover:text-gray-900 transition"
          >
            일반 생성으로 돌아가기
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">URL로 만들기</h1>
          <p className="text-gray-600">
            마음에 드는 랜딩페이지 URL을 입력하면 유사한 구조로 새 랜딩페이지를 만들어 드려요
          </p>
        </div>

        {/* Copyright Warning Modal */}
        {showCopyrightWarning && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
              <div className="text-4xl mb-4 text-center">⚠️</div>
              <h2 className="text-xl font-bold text-center mb-4">저작권 주의사항</h2>
              <div className="text-gray-600 space-y-3 mb-6">
                <p>
                  이 기능은 참고용 레퍼런스 분석을 위한 것입니다.
                </p>
                <p>
                  <strong className="text-gray-900">다음 사항을 확인해주세요:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>디자인과 콘텐츠를 그대로 복사하는 것은 저작권 침해입니다</li>
                  <li>구조와 레이아웃만 참고하여 새로운 콘텐츠를 작성해주세요</li>
                  <li>이미지, 텍스트, 로고 등은 직접 제작하거나 권한이 있는 것만 사용하세요</li>
                </ul>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCopyrightWarning(false);
                    setAgreedToCopyright(true);
                  }}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  이해했습니다
                </button>
                <button
                  onClick={() => setShowCopyrightWarning(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        )}

        {/* URL Input Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              참고할 랜딩페이지 URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            />
          </div>

          {agreedToCopyright && (
            <div className="mb-4 flex items-center gap-2 text-green-600 text-sm">
              <span>✓</span>
              <span>저작권 주의사항에 동의했습니다</span>
            </div>
          )}

          {error && (
            <div className="mb-4 bg-red-50 text-red-600 p-4 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !url}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                분석 중... (최대 1분 소요)
              </>
            ) : (
              <>
                <span>🔍</span>
                페이지 분석하기
              </>
            )}
          </button>
        </form>

        {/* Results */}
        {result && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900 mb-2">분석 결과</h2>
              <p className="text-gray-600">{result.metadata.pageTitle}</p>
            </div>

            {/* Preview Image */}
            <div className="border-b">
              <div className="aspect-video bg-gray-100 relative">
                {result.outputDir && (
                  <Image
                    src={`${result.outputDir}/full-page.png`}
                    alt="Page preview"
                    fill
                    className="object-cover object-top"
                    unoptimized
                  />
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4 border-b">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{result.sections.length}</div>
                <div className="text-sm text-gray-600">섹션</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{result.metadata.imageStats.downloaded}</div>
                <div className="text-sm text-gray-600">이미지</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{Math.round(result.metadata.totalHeight)}px</div>
                <div className="text-sm text-gray-600">전체 높이</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {result.framer?.isFramerSite ? 'Yes' : 'No'}
                </div>
                <div className="text-sm text-gray-600">Framer 사이트</div>
              </div>
            </div>

            {/* Sections */}
            <div className="p-6 border-b">
              <h3 className="font-semibold text-gray-900 mb-3">발견된 섹션</h3>
              <div className="flex flex-wrap gap-2">
                {result.sections.map((section, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {section.category || section.tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Action */}
            <div className="p-6">
              <button
                onClick={handleGenerateSimilar}
                className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-lg font-medium hover:opacity-90 transition flex items-center justify-center gap-2"
              >
                <span>✨</span>
                이 구조로 새 랜딩페이지 만들기
              </button>
              <p className="text-center text-sm text-gray-500 mt-3">
                분석된 구조를 참고하여 새로운 콘텐츠로 랜딩페이지를 생성합니다
              </p>
            </div>
          </div>
        )}

        {/* Tips */}
        {!result && (
          <div className="bg-blue-50 rounded-2xl p-6">
            <h3 className="font-semibold text-blue-900 mb-3">💡 사용 팁</h3>
            <ul className="text-blue-800 space-y-2">
              <li>• 마음에 드는 랜딩페이지의 URL을 입력하세요</li>
              <li>• 분석 후 구조와 레이아웃을 참고하여 새 페이지를 만들 수 있어요</li>
              <li>• Framer, Webflow 등으로 만든 사이트도 분석 가능해요</li>
              <li>• 분석에는 최대 1분 정도 소요될 수 있어요</li>
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
