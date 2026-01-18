'use client';

import { useState } from 'react';
import { FormContent, FormField, ThemeType } from '@/types/page';
import { THEMES } from '@/config/themes';
import { DEFAULT_CONSENT_ITEMS, getConsentContent, ConsentItem } from '@/config/consent';

interface FormSectionProps {
  content: FormContent;
  formFields: FormField[];
  theme?: ThemeType;
  isEditable?: boolean;
  onEdit?: (content: FormContent) => void;
  onSubmit?: (data: Record<string, string>) => void;
  isSubmitting?: boolean;
  companyName?: string;
  consentItems?: ConsentItem[];
}

export function FormSection({
  content,
  formFields,
  theme = 'toss',
  onSubmit,
  isSubmitting,
  companyName = '',
  consentItems = DEFAULT_CONSENT_ITEMS,
}: FormSectionProps) {
  const themeConfig = THEMES[theme];
  const colors = themeConfig.colors;

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [consents, setConsents] = useState<Record<string, boolean>>({});
  const [expandedConsent, setExpandedConsent] = useState<string | null>(null);

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleConsentChange = (consentId: string, checked: boolean) => {
    setConsents((prev) => ({ ...prev, [consentId]: checked }));
    if (errors[`consent_${consentId}`]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`consent_${consentId}`];
        return newErrors;
      });
    }
  };

  const handleAllConsentsChange = (checked: boolean) => {
    const newConsents: Record<string, boolean> = {};
    consentItems.forEach((item) => {
      newConsents[item.id] = checked;
    });
    setConsents(newConsents);
    // Clear all consent errors
    setErrors((prev) => {
      const newErrors = { ...prev };
      consentItems.forEach((item) => {
        delete newErrors[`consent_${item.id}`];
      });
      return newErrors;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    // Validate form fields
    formFields.forEach((field) => {
      if (field.required && !formData[field.id]?.trim()) {
        newErrors[field.id] = `${field.label}을(를) 입력해주세요.`;
      }
    });

    // Validate required consents
    consentItems.forEach((item) => {
      if (item.required && !consents[item.id]) {
        newErrors[`consent_${item.id}`] = `${item.label}에 동의해주세요.`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Include consent data in submission
    const submissionData = {
      ...formData,
      _consents: JSON.stringify(consents),
    };
    onSubmit?.(submissionData);
  };

  const inputStyle = {
    width: '100%',
    padding: '16px',
    fontSize: '16px',
    border: `2px solid ${colors.border}`,
    borderRadius: '12px',
    outline: 'none',
    boxSizing: 'border-box' as const,
    marginTop: '8px'
  };

  return (
    <>
      <style>{`
        .form-title {
          font-size: clamp(22px, 6vw, 28px);
          font-weight: bold;
          color: ${colors.text};
          text-align: center;
          margin-bottom: 8px;
          word-break: keep-all;
          text-wrap: balance;
        }
        .form-subtitle {
          font-size: clamp(14px, 3.8vw, 16px);
          color: ${colors.textSecondary};
          text-align: center;
          margin-bottom: 32px;
          word-break: keep-all;
          text-wrap: balance;
        }
        .form-button {
          width: 100%;
          padding: 16px 24px;
          font-size: clamp(15px, 4vw, 18px);
          font-weight: 600;
          color: #fff;
          background: ${colors.primary};
          border: none;
          border-radius: 14px;
          cursor: pointer;
          margin-top: 24px;
          transition: background 0.2s;
        }
        .form-button:hover:not(:disabled) {
          filter: brightness(0.9);
        }
        .form-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
      <section id="form-section" style={{ padding: 'clamp(48px, 10vw, 64px) 20px', background: colors.cardBackground || colors.background }}>
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          <h2 className="form-title">
            {content.title}
          </h2>

          {content.subtitle && (
            <p className="form-subtitle">
              {content.subtitle}
            </p>
          )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {formFields.map((field) => (
              <div key={field.id}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#333D4B' }}>
                  {field.label}
                  {field.required && <span style={{ color: '#F04452', marginLeft: '4px' }}>*</span>}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    placeholder={field.placeholder}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    disabled={isSubmitting}
                    style={{ ...inputStyle, minHeight: '120px', resize: 'vertical', fontFamily: 'inherit' }}
                  />
                ) : (
                  <input
                    type={field.type === 'tel' ? 'tel' : field.type === 'email' ? 'email' : 'text'}
                    placeholder={field.placeholder}
                    value={formData[field.id] || ''}
                    onChange={(e) => {
                      let value = e.target.value;
                      if (field.type === 'tel') value = formatPhoneNumber(value);
                      handleInputChange(field.id, value);
                    }}
                    disabled={isSubmitting}
                    style={inputStyle}
                  />
                )}
                {errors[field.id] && (
                  <p style={{ color: '#F04452', fontSize: '13px', marginTop: '4px' }}>{errors[field.id]}</p>
                )}
              </div>
            ))}
          </div>

          {/* 동의 항목 섹션 */}
          {consentItems.length > 0 && (
            <div style={{ marginTop: '24px', borderTop: `1px solid ${colors.border}`, paddingTop: '20px' }}>
              {/* 전체 동의 */}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 16px',
                  background: colors.cardBackground === colors.background ? '#F8F9FA' : colors.cardBackground,
                  borderRadius: '10px',
                  cursor: 'pointer',
                  marginBottom: '12px',
                }}
              >
                <input
                  type="checkbox"
                  checked={consentItems.every((item) => consents[item.id])}
                  onChange={(e) => handleAllConsentsChange(e.target.checked)}
                  disabled={isSubmitting}
                  style={{ width: '20px', height: '20px', accentColor: colors.primary }}
                />
                <span style={{ fontWeight: '600', fontSize: '15px', color: colors.text }}>
                  전체 동의하기
                </span>
              </label>

              {/* 개별 동의 항목 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {consentItems.map((item) => (
                  <div key={item.id}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 0',
                      }}
                    >
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          cursor: 'pointer',
                          flex: 1,
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={consents[item.id] || false}
                          onChange={(e) => handleConsentChange(item.id, e.target.checked)}
                          disabled={isSubmitting}
                          style={{ width: '18px', height: '18px', accentColor: colors.primary }}
                        />
                        <span style={{ fontSize: '14px', color: colors.text }}>
                          {item.required && <span style={{ color: '#F04452' }}>[필수] </span>}
                          {!item.required && <span style={{ color: '#8B95A1' }}>[선택] </span>}
                          {item.label}
                        </span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setExpandedConsent(expandedConsent === item.id ? null : item.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#8B95A1',
                          fontSize: '13px',
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          padding: '4px 8px',
                        }}
                      >
                        {expandedConsent === item.id ? '접기' : '내용보기'}
                      </button>
                    </div>

                    {/* 펼쳐진 동의 내용 */}
                    {expandedConsent === item.id && (
                      <div
                        style={{
                          background: '#F8F9FA',
                          borderRadius: '8px',
                          padding: '16px',
                          marginTop: '4px',
                          marginBottom: '8px',
                          maxHeight: '200px',
                          overflowY: 'auto',
                        }}
                      >
                        <pre
                          style={{
                            fontSize: '12px',
                            color: '#4E5968',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                            margin: 0,
                            fontFamily: 'inherit',
                            lineHeight: '1.6',
                          }}
                        >
                          {getConsentContent(item.content, companyName)}
                        </pre>
                      </div>
                    )}

                    {/* 동의 에러 메시지 */}
                    {errors[`consent_${item.id}`] && (
                      <p style={{ color: '#F04452', fontSize: '12px', marginTop: '4px', marginLeft: '28px' }}>
                        {errors[`consent_${item.id}`]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {content.note && (
            <p style={{ fontSize: '14px', color: '#8B95A1', textAlign: 'center', marginTop: '16px' }}>
              {content.note}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="form-button"
          >
            {isSubmitting ? '제출 중...' : content.buttonText}
          </button>
        </form>
      </div>
    </section>
  </>
  );
}
