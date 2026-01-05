'use client';

import { useState } from 'react';
import { FormContent, FormField, ThemeType, SectionStyle } from '@/types/page';
import { THEMES } from '@/config/themes';

interface FormSectionProps {
  content: FormContent;
  formFields: FormField[];
  theme?: ThemeType;
  style?: SectionStyle;
  isEditable?: boolean;
  onEdit?: (content: FormContent) => void;
  onSubmit?: (data: Record<string, string>) => void;
  isSubmitting?: boolean;
}

export function FormSection({ content, formFields, theme = 'toss', style, onSubmit, isSubmitting }: FormSectionProps) {
  const themeConfig = THEMES[theme] || THEMES.toss;
  const colors = themeConfig.colors;
  const titleSize = style?.titleFontSize || 24;
  const textSize = style?.textFontSize || 14;

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    formFields.forEach((field) => {
      if (field.required && !formData[field.id]?.trim()) {
        newErrors[field.id] = `${field.label}을(를) 입력해주세요.`;
      }
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSubmit?.(formData);
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
