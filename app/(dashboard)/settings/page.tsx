'use client';

import { useState, useEffect } from 'react';

interface UserSettings {
  name: string;
  email: string;
  phone: string;
  notifyEmail: boolean;
  notifyKakao: boolean;
  kakaoLinked: boolean;
}

interface CRMSettings {
  redirectType: 'none' | 'url' | 'kakao' | 'thankyou';
  redirectUrl: string;
  kakaoChannelUrl: string;
  autoSendEnabled: boolean;
  autoSendType: 'ebook' | 'link' | 'message';
  autoSendContent: string;
  autoSendTitle: string;
  notifyKakaoEnabled: boolean;
  notifyKakaoPhone: string;
  thankYouTitle: string;
  thankYouMessage: string;
  thankYouButtonText: string;
  thankYouButtonUrl: string;
}

interface APISettings {
  useOwnKey: boolean;
  geminiApiKey: string;
  imageModel: 'gemini-2.5-flash-image' | 'gemini-3-pro-image-preview' | 'imagen-4.0-fast-generate-001' | 'imagen-4.0-generate-001' | 'imagen-4.0-ultra-generate-001';
  textModel: 'gemini-2.5-pro' | 'gemini-2.0-flash';
}

const IMAGE_MODELS = [
  { id: 'gemini-2.5-flash-image', name: 'Gemini 2.5 Flash Image', price: '$0.039/이미지', tier: 'free' },
  { id: 'gemini-3-pro-image-preview', name: 'Gemini 3 Pro Image (Preview)', price: 'Premium', tier: 'paid' },
  { id: 'imagen-4.0-fast-generate-001', name: 'Imagen 4 Fast', price: '$0.02/이미지', tier: 'paid' },
  { id: 'imagen-4.0-generate-001', name: 'Imagen 4 Standard', price: '$0.04/이미지', tier: 'paid' },
  { id: 'imagen-4.0-ultra-generate-001', name: 'Imagen 4 Ultra', price: '$0.06/이미지', tier: 'paid' },
] as const;

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>({
    name: '홍길동',
    email: 'user@example.com',
    phone: '010-1234-5678',
    notifyEmail: true,
    notifyKakao: true,
    kakaoLinked: false,
  });

  const [apiSettings, setApiSettings] = useState<APISettings>({
    useOwnKey: false,
    geminiApiKey: '',
    imageModel: 'gemini-2.5-flash-image',
    textModel: 'gemini-2.5-pro',
  });

  const [crmSettings, setCrmSettings] = useState<CRMSettings>({
    redirectType: 'thankyou',
    redirectUrl: '',
    kakaoChannelUrl: '',
    autoSendEnabled: false,
    autoSendType: 'ebook',
    autoSendContent: '',
    autoSendTitle: '',
    notifyKakaoEnabled: false,
    notifyKakaoPhone: '',
    thankYouTitle: '신청이 완료되었습니다!',
    thankYouMessage: '빠른 시일 내에 연락드리겠습니다.',
    thankYouButtonText: '',
    thankYouButtonUrl: '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [keyTestResult, setKeyTestResult] = useState<'success' | 'error' | null>(null);

  // localStorage에서 설정 불러오기
  useEffect(() => {
    const savedApiSettings = localStorage.getItem('apiSettings');
    if (savedApiSettings) {
      try {
        setApiSettings(JSON.parse(savedApiSettings));
      } catch (e) {
        console.error('Failed to load API settings:', e);
      }
    }

    const savedCrmSettings = localStorage.getItem('crmSettings');
    if (savedCrmSettings) {
      try {
        setCrmSettings({ ...crmSettings, ...JSON.parse(savedCrmSettings) });
      } catch (e) {
        console.error('Failed to load CRM settings:', e);
      }
    }
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    // API 설정 localStorage에 저장
    localStorage.setItem('apiSettings', JSON.stringify(apiSettings));
    // CRM 설정 localStorage에 저장
    localStorage.setItem('crmSettings', JSON.stringify(crmSettings));
    // TODO: 나머지 설정 API 호출
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert('저장되었습니다!');
  };

  const testApiKey = async () => {
    if (!apiSettings.geminiApiKey) {
      alert('API 키를 입력해주세요.');
      return;
    }

    setIsTestingKey(true);
    setKeyTestResult(null);

    try {
      const response = await fetch('/api/ai/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'A simple blue square for testing',
          model: 'gemini-2.5-flash-image',
          apiKey: apiSettings.geminiApiKey,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setKeyTestResult('success');
      } else {
        setKeyTestResult('error');
      }
    } catch {
      setKeyTestResult('error');
    } finally {
      setIsTestingKey(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#191F28]">설정</h1>
        <p className="text-[#4E5968] mt-1">계정 및 알림 설정을 관리하세요.</p>
      </div>

      {/* 프로필 설정 */}
      <section className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-[#191F28] mb-6">프로필</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#4E5968] mb-2">
              이름
            </label>
            <input
              type="text"
              value={settings.name}
              onChange={(e) => setSettings({ ...settings, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0064FF]/20 focus:border-[#0064FF]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#4E5968] mb-2">
              이메일
            </label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0064FF]/20 focus:border-[#0064FF]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#4E5968] mb-2">
              연락처
            </label>
            <input
              type="tel"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              placeholder="010-0000-0000"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0064FF]/20 focus:border-[#0064FF]"
            />
          </div>
        </div>
      </section>

      {/* 알림 설정 */}
      <section className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-[#191F28] mb-2">알림 설정</h2>
        <p className="text-sm text-[#4E5968] mb-6">
          새 신청이 들어오면 알림을 받을 방법을 선택하세요.
        </p>

        <div className="space-y-4">
          {/* 이메일 알림 */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📧</span>
              <div>
                <p className="font-medium text-[#191F28]">이메일 알림</p>
                <p className="text-sm text-[#4E5968]">{settings.email}</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifyEmail}
                onChange={(e) =>
                  setSettings({ ...settings, notifyEmail: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#0064FF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0064FF]"></div>
            </label>
          </div>

          {/* 카카오 알림톡 */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💬</span>
              <div>
                <p className="font-medium text-[#191F28]">카카오 알림톡</p>
                {settings.kakaoLinked ? (
                  <p className="text-sm text-green-600">연동됨</p>
                ) : (
                  <p className="text-sm text-[#4E5968]">카카오 계정 연동 필요</p>
                )}
              </div>
            </div>
            {settings.kakaoLinked ? (
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifyKakao}
                  onChange={(e) =>
                    setSettings({ ...settings, notifyKakao: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#0064FF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0064FF]"></div>
              </label>
            ) : (
              <button
                onClick={() => {
                  // TODO: 카카오 OAuth 연동
                  alert('카카오 계정 연동 기능 준비 중');
                }}
                className="px-4 py-2 bg-[#FEE500] text-[#3C1E1E] rounded-lg text-sm font-medium hover:bg-[#FDD835] transition-colors"
              >
                카카오 연동하기
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 p-4 bg-[#E8F3FF] rounded-xl">
          <p className="text-sm text-[#0064FF]">
            💡 알림톡은 고객 신청 시 실시간으로 알림을 받을 수 있어요.
            <br />
            카카오 계정을 연동하면 더 빠르게 고객에게 연락할 수 있습니다!
          </p>
        </div>
      </section>

      {/* CRM 설정 */}
      <section className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-[#191F28] mb-2">CRM 설정</h2>
        <p className="text-sm text-[#4E5968] mb-6">
          고객 신청 후 처리 방법을 설정하세요.
        </p>

        {/* 신청 후 이동 설정 */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-[#4E5968] mb-3">신청 완료 후 이동</h3>
          <div className="space-y-3">
            <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
              <input
                type="radio"
                name="redirectType"
                value="thankyou"
                checked={crmSettings.redirectType === 'thankyou'}
                onChange={() => setCrmSettings({ ...crmSettings, redirectType: 'thankyou' })}
                className="mt-1"
              />
              <div className="flex-1">
                <p className="font-medium text-[#191F28]">감사 페이지 표시</p>
                <p className="text-sm text-[#4E5968]">신청 완료 메시지를 보여줍니다</p>
              </div>
            </label>
            <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
              <input
                type="radio"
                name="redirectType"
                value="kakao"
                checked={crmSettings.redirectType === 'kakao'}
                onChange={() => setCrmSettings({ ...crmSettings, redirectType: 'kakao' })}
                className="mt-1"
              />
              <div className="flex-1">
                <p className="font-medium text-[#191F28]">카카오톡 채널로 이동</p>
                <p className="text-sm text-[#4E5968]">1:1 채팅으로 바로 연결됩니다</p>
                {crmSettings.redirectType === 'kakao' && (
                  <input
                    type="url"
                    value={crmSettings.kakaoChannelUrl}
                    onChange={(e) => setCrmSettings({ ...crmSettings, kakaoChannelUrl: e.target.value })}
                    placeholder="https://pf.kakao.com/..."
                    className="mt-2 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0064FF]/20"
                  />
                )}
              </div>
            </label>
            <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
              <input
                type="radio"
                name="redirectType"
                value="url"
                checked={crmSettings.redirectType === 'url'}
                onChange={() => setCrmSettings({ ...crmSettings, redirectType: 'url' })}
                className="mt-1"
              />
              <div className="flex-1">
                <p className="font-medium text-[#191F28]">커스텀 URL로 이동</p>
                <p className="text-sm text-[#4E5968]">원하는 페이지로 이동시킵니다</p>
                {crmSettings.redirectType === 'url' && (
                  <input
                    type="url"
                    value={crmSettings.redirectUrl}
                    onChange={(e) => setCrmSettings({ ...crmSettings, redirectUrl: e.target.value })}
                    placeholder="https://example.com/thank-you"
                    className="mt-2 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0064FF]/20"
                  />
                )}
              </div>
            </label>
          </div>
        </div>

        {/* 감사 페이지 설정 */}
        {crmSettings.redirectType === 'thankyou' && (
          <div className="mb-6 p-4 bg-gray-50 rounded-xl space-y-4">
            <h4 className="font-medium text-[#191F28]">감사 페이지 설정</h4>
            <div>
              <label className="block text-sm text-[#4E5968] mb-1">제목</label>
              <input
                type="text"
                value={crmSettings.thankYouTitle}
                onChange={(e) => setCrmSettings({ ...crmSettings, thankYouTitle: e.target.value })}
                placeholder="신청이 완료되었습니다!"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0064FF]/20"
              />
            </div>
            <div>
              <label className="block text-sm text-[#4E5968] mb-1">메시지</label>
              <textarea
                value={crmSettings.thankYouMessage}
                onChange={(e) => setCrmSettings({ ...crmSettings, thankYouMessage: e.target.value })}
                placeholder="빠른 시일 내에 연락드리겠습니다."
                rows={2}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0064FF]/20 resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#4E5968] mb-1">버튼 텍스트 (선택)</label>
                <input
                  type="text"
                  value={crmSettings.thankYouButtonText}
                  onChange={(e) => setCrmSettings({ ...crmSettings, thankYouButtonText: e.target.value })}
                  placeholder="카카오톡 문의하기"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0064FF]/20"
                />
              </div>
              <div>
                <label className="block text-sm text-[#4E5968] mb-1">버튼 링크 (선택)</label>
                <input
                  type="url"
                  value={crmSettings.thankYouButtonUrl}
                  onChange={(e) => setCrmSettings({ ...crmSettings, thankYouButtonUrl: e.target.value })}
                  placeholder="https://pf.kakao.com/..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0064FF]/20"
                />
              </div>
            </div>
          </div>
        )}

        {/* 자동 발송 설정 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-medium text-[#4E5968]">고객에게 자동 발송</h3>
              <p className="text-xs text-[#8B95A1]">신청 시 이북, 링크, 메시지를 자동 발송합니다</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={crmSettings.autoSendEnabled}
                onChange={(e) => setCrmSettings({ ...crmSettings, autoSendEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#0064FF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0064FF]"></div>
            </label>
          </div>

          {crmSettings.autoSendEnabled && (
            <div className="p-4 bg-gray-50 rounded-xl space-y-4">
              <div>
                <label className="block text-sm text-[#4E5968] mb-2">발송 유형</label>
                <div className="flex gap-2">
                  {[
                    { id: 'ebook', label: '📚 이북', desc: 'PDF/이북 다운로드 링크' },
                    { id: 'link', label: '🔗 링크', desc: '웹페이지 링크' },
                    { id: 'message', label: '💬 메시지', desc: '텍스트 메시지' },
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setCrmSettings({ ...crmSettings, autoSendType: type.id as CRMSettings['autoSendType'] })}
                      className={`flex-1 p-3 rounded-lg text-left transition-all ${
                        crmSettings.autoSendType === type.id
                          ? 'bg-[#E8F3FF] border-2 border-[#0064FF]'
                          : 'bg-white border border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-medium text-sm">{type.label}</p>
                      <p className="text-xs text-[#8B95A1]">{type.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-[#4E5968] mb-1">발송 제목</label>
                <input
                  type="text"
                  value={crmSettings.autoSendTitle}
                  onChange={(e) => setCrmSettings({ ...crmSettings, autoSendTitle: e.target.value })}
                  placeholder="무료 이북을 보내드립니다"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0064FF]/20"
                />
              </div>
              <div>
                <label className="block text-sm text-[#4E5968] mb-1">
                  {crmSettings.autoSendType === 'message' ? '메시지 내용' : '링크 URL'}
                </label>
                {crmSettings.autoSendType === 'message' ? (
                  <textarea
                    value={crmSettings.autoSendContent}
                    onChange={(e) => setCrmSettings({ ...crmSettings, autoSendContent: e.target.value })}
                    placeholder="안녕하세요! 신청해주셔서 감사합니다..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0064FF]/20 resize-none"
                  />
                ) : (
                  <input
                    type="url"
                    value={crmSettings.autoSendContent}
                    onChange={(e) => setCrmSettings({ ...crmSettings, autoSendContent: e.target.value })}
                    placeholder="https://example.com/ebook.pdf"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0064FF]/20"
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {/* 알림톡 설정 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-medium text-[#4E5968]">신청 알림톡 받기</h3>
              <p className="text-xs text-[#8B95A1]">새 신청이 들어오면 알림톡을 받습니다</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={crmSettings.notifyKakaoEnabled}
                onChange={(e) => setCrmSettings({ ...crmSettings, notifyKakaoEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#0064FF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0064FF]"></div>
            </label>
          </div>

          {crmSettings.notifyKakaoEnabled && (
            <div className="p-4 bg-gray-50 rounded-xl">
              <label className="block text-sm text-[#4E5968] mb-1">알림 받을 휴대폰 번호</label>
              <input
                type="tel"
                value={crmSettings.notifyKakaoPhone}
                onChange={(e) => setCrmSettings({ ...crmSettings, notifyKakaoPhone: e.target.value })}
                placeholder="010-0000-0000"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0064FF]/20"
              />
              <p className="text-xs text-[#8B95A1] mt-2">
                * 카카오 알림톡 발송을 위해 휴대폰 번호가 필요합니다
              </p>
            </div>
          )}
        </div>

        <div className="mt-4 p-4 bg-[#FFF8E1] rounded-xl">
          <p className="text-sm text-[#F59E0B]">
            💡 <strong>알림톡 연동 안내</strong>
            <br />
            알림톡 발송을 위해서는 카카오 비즈니스 채널 등록이 필요합니다.
            <br />
            문의사항은 고객센터로 연락주세요.
          </p>
        </div>
      </section>

      {/* API 설정 */}
      <section className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-[#191F28] mb-2">AI API 설정</h2>
        <p className="text-sm text-[#4E5968] mb-6">
          이미지 생성 및 카피라이팅에 사용할 AI 모델을 설정하세요.
        </p>

        {/* 무료/유료 선택 */}
        <div className="mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setApiSettings({ ...apiSettings, useOwnKey: false })}
              className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                !apiSettings.useOwnKey
                  ? 'border-[#0064FF] bg-[#E8F3FF]'
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300'
              }`}
            >
              <div className="text-left">
                <p className="font-bold text-[#191F28]">무료 버전</p>
                <p className="text-sm text-[#4E5968] mt-1">
                  기본 제공 API 사용<br />
                  일일 3회 이미지 생성
                </p>
                <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  Free
                </span>
              </div>
            </button>
            <button
              onClick={() => setApiSettings({ ...apiSettings, useOwnKey: true })}
              className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                apiSettings.useOwnKey
                  ? 'border-[#0064FF] bg-[#E8F3FF]'
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300'
              }`}
            >
              <div className="text-left">
                <p className="font-bold text-[#191F28]">유료 버전 (내 API 키)</p>
                <p className="text-sm text-[#4E5968] mt-1">
                  본인 API 키로 무제한 사용<br />
                  모든 프리미엄 모델 지원
                </p>
                <span className="inline-block mt-2 px-2 py-1 bg-[#0064FF] text-white text-xs rounded-full">
                  Premium
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* 유료 버전 선택 시 API 키 입력 */}
        {apiSettings.useOwnKey && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-xl mb-6">
            <div>
              <label className="block text-sm font-medium text-[#4E5968] mb-2">
                Google AI API 키
              </label>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={apiSettings.geminiApiKey}
                  onChange={(e) => setApiSettings({ ...apiSettings, geminiApiKey: e.target.value })}
                  placeholder="AIza..."
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0064FF]/20 focus:border-[#0064FF]"
                />
                <button
                  onClick={testApiKey}
                  disabled={isTestingKey}
                  className="px-4 py-3 bg-[#0064FF] text-white rounded-xl hover:bg-[#0050CC] disabled:opacity-50 whitespace-nowrap"
                >
                  {isTestingKey ? '테스트 중...' : '테스트'}
                </button>
              </div>
              {keyTestResult === 'success' && (
                <p className="text-sm text-green-600 mt-2">✓ API 키가 유효합니다!</p>
              )}
              {keyTestResult === 'error' && (
                <p className="text-sm text-red-600 mt-2">✗ API 키가 유효하지 않습니다.</p>
              )}
              <p className="text-xs text-[#8B95A1] mt-2">
                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0064FF] hover:underline"
                >
                  Google AI Studio
                </a>
                에서 API 키를 발급받으세요.
              </p>
            </div>
          </div>
        )}

        {/* 이미지 생성 모델 선택 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#4E5968] mb-3">
            이미지 생성 모델
          </label>
          <div className="space-y-2">
            {IMAGE_MODELS.map((model) => {
              const isDisabled = !apiSettings.useOwnKey && model.tier === 'paid';
              return (
                <label
                  key={model.id}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    apiSettings.imageModel === model.id
                      ? 'border-[#0064FF] bg-[#E8F3FF]'
                      : isDisabled
                      ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="imageModel"
                      value={model.id}
                      checked={apiSettings.imageModel === model.id}
                      disabled={isDisabled}
                      onChange={(e) =>
                        setApiSettings({ ...apiSettings, imageModel: e.target.value as APISettings['imageModel'] })
                      }
                      className="w-4 h-4 text-[#0064FF]"
                    />
                    <div>
                      <p className="font-medium text-[#191F28] text-sm">{model.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#8B95A1]">{model.price}</span>
                    {model.tier === 'paid' && (
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                        Premium
                      </span>
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        <div className="p-4 bg-[#FFF8E1] rounded-xl">
          <p className="text-sm text-[#F59E0B]">
            💡 <strong>모델 추천</strong>
            <br />
            • <strong>Gemini 2.5 Flash Image</strong>: 빠르고 저렴 (일반 용도 추천)
            <br />
            • <strong>Imagen 4 Ultra</strong>: 최고 품질, 2K 해상도 지원
          </p>
        </div>
      </section>

      {/* 요금제 */}
      <section className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-[#191F28] mb-2">요금제</h2>
        <p className="text-sm text-[#4E5968] mb-6">현재 이용 중인 요금제입니다.</p>

        <div className="p-4 bg-gradient-to-r from-[#0064FF] to-[#0050CC] rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">현재 요금제</p>
              <p className="text-2xl font-bold mt-1">Free</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-80">페이지</p>
              <p className="text-lg font-bold">1 / 1개</p>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <PlanCard
            name="스타터"
            price="19,900"
            features={['월 1개 페이지', '카톡 알림', '이메일 알림', '대시보드']}
            recommended
          />
          <PlanCard
            name="프로"
            price="49,500"
            features={['월 3개 페이지', 'A/B 테스트', '분석 리포트', '우선 지원']}
          />
        </div>
      </section>

      {/* 저장 버튼 */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-3 bg-[#0064FF] hover:bg-[#0050CC] text-white rounded-xl font-medium transition-colors disabled:opacity-50"
        >
          {isSaving ? '저장 중...' : '변경사항 저장'}
        </button>
      </div>
    </div>
  );
}

function PlanCard({
  name,
  price,
  features,
  recommended = false,
}: {
  name: string;
  price: string;
  features: string[];
  recommended?: boolean;
}) {
  return (
    <div
      className={`p-4 rounded-xl border ${
        recommended
          ? 'border-[#0064FF] bg-[#E8F3FF]'
          : 'border-gray-200 bg-gray-50'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <p className="font-bold text-[#191F28]">{name}</p>
        {recommended && (
          <span className="text-xs px-2 py-1 bg-[#0064FF] text-white rounded-full">
            추천
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-[#191F28] mb-3">
        ₩{price}
        <span className="text-sm font-normal text-[#4E5968]">/월</span>
      </p>
      <ul className="space-y-1 mb-4">
        {features.map((feature, i) => (
          <li key={i} className="text-sm text-[#4E5968]">
            ✓ {feature}
          </li>
        ))}
      </ul>
      <button
        className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
          recommended
            ? 'bg-[#0064FF] hover:bg-[#0050CC] text-white'
            : 'bg-white hover:bg-gray-100 text-[#191F28] border border-gray-200'
        }`}
      >
        업그레이드
      </button>
    </div>
  );
}
