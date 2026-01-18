'use client';

import { useState, useRef, ChangeEvent } from 'react';

interface ImageUploaderProps {
  currentImage?: string;
  onImageChange: (imageUrl: string) => void;
  aspectRatio?: 'landscape' | 'portrait' | 'square';
  label?: string;
  placeholder?: string;
}

export default function ImageUploader({
  currentImage,
  onImageChange,
  aspectRatio = 'landscape',
  label = '이미지',
  placeholder = '이미지를 업로드하거나 URL을 입력하세요'
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(currentImage || '');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectRatioClass = {
    landscape: 'aspect-video',
    portrait: 'aspect-[3/4]',
    square: 'aspect-square',
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 크기 체크 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      setError('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    // 이미지 타입 체크
    if (!file.type.startsWith('image/')) {
      setError('이미지 파일만 업로드 가능합니다.');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      // 로컬 미리보기 (실제 업로드 대신)
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setImageUrl(dataUrl);
        onImageChange(dataUrl);
        setIsUploading(false);
      };
      reader.onerror = () => {
        setError('파일 읽기 실패');
        setIsUploading(false);
      };
      reader.readAsDataURL(file);

      // TODO: 실제 서버 업로드 구현
      // const formData = new FormData();
      // formData.append('file', file);
      // const res = await fetch('/api/upload', { method: 'POST', body: formData });
      // const data = await res.json();
      // setImageUrl(data.url);
      // onImageChange(data.url);
    } catch (err) {
      setError('업로드 중 오류가 발생했습니다.');
      setIsUploading(false);
    }
  };

  const handleUrlSubmit = () => {
    if (imageUrl.trim()) {
      // URL 유효성 검사
      if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://') && !imageUrl.startsWith('data:')) {
        setError('올바른 URL을 입력해주세요.');
        return;
      }
      onImageChange(imageUrl);
      setShowUrlInput(false);
      setError('');
    }
  };

  const handleRemoveImage = () => {
    setImageUrl('');
    onImageChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      {/* 이미지 미리보기 */}
      {imageUrl ? (
        <div className="relative group">
          <div className={`relative ${aspectRatioClass[aspectRatio]} bg-gray-100 rounded-xl overflow-hidden`}>
            <img
              src={imageUrl}
              alt="미리보기"
              className="w-full h-full object-cover"
              onError={() => setError('이미지를 불러올 수 없습니다.')}
            />
            {/* 오버레이 버튼 */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-white text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-100"
              >
                변경
              </button>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className={`relative ${aspectRatioClass[aspectRatio]} border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors`}>
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            <div className="text-4xl mb-3">📷</div>
            <p className="text-sm text-gray-500 text-center mb-3">{placeholder}</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-pink-500 text-white rounded-lg text-sm font-medium hover:bg-pink-600"
              >
                파일 선택
              </button>
              <button
                type="button"
                onClick={() => setShowUrlInput(true)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300"
              >
                URL 입력
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 파일 input (숨김) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* URL 입력 모달 */}
      {showUrlInput && (
        <div className="flex gap-2">
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <button
            type="button"
            onClick={handleUrlSubmit}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg text-sm font-medium hover:bg-pink-600"
          >
            확인
          </button>
          <button
            type="button"
            onClick={() => setShowUrlInput(false)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300"
          >
            취소
          </button>
        </div>
      )}

      {/* 업로드 중 */}
      {isUploading && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="w-4 h-4 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
          <span>업로드 중...</span>
        </div>
      )}

      {/* 에러 메시지 */}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}

// 이미지 검색 컴포넌트
export function ImageSearcher({
  onSelect,
  defaultKeyword = ''
}: {
  onSelect: (imageUrl: string) => void;
  defaultKeyword?: string;
}) {
  const [keyword, setKeyword] = useState(defaultKeyword);
  const [images, setImages] = useState<Array<{ id: string; url: string; thumbUrl: string; alt: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!keyword.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/images/search?query=${encodeURIComponent(keyword)}&count=6`);
      const data = await res.json();

      if (data.success) {
        setImages(data.images);
      } else {
        setError(data.error || '검색 실패');
      }
    } catch (err) {
      setError('검색 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* 검색 입력 */}
      <div className="flex gap-2">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="이미지 검색어 입력 (영문 추천)"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={loading}
          className="px-4 py-2 bg-pink-500 text-white rounded-lg text-sm font-medium hover:bg-pink-600 disabled:opacity-50"
        >
          {loading ? '검색 중...' : '검색'}
        </button>
      </div>

      {/* 에러 */}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* 검색 결과 */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {images.map((image) => (
            <button
              key={image.id}
              type="button"
              onClick={() => onSelect(image.url)}
              className="aspect-video rounded-lg overflow-hidden hover:ring-2 hover:ring-pink-500 transition-all"
            >
              <img
                src={image.thumbUrl}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
