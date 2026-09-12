import React from 'react';
import { useLanguage } from '../i18n';

interface LanguageSelectorProps {
  className?: string;
  isCompact?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  className = '',
  isCompact = false,
}) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      id="language-selector-control"
      className={`inline-flex items-center bg-[#E8DED8] ${isCompact ? 'p-0.5 gap-0.5' : 'p-0.5'} rounded-lg border border-[#DFD4CD] shadow-2xs shrink-0 ${className}`}
      role="group"
      aria-label="Pilih bahasa aplikasi / Choose application language"
    >
      <button
        type="button"
        id="btn-lang-id"
        onClick={() => setLanguage('id')}
        aria-pressed={language === 'id'}
        aria-label="Bahasa Indonesia"
        title="Bahasa Indonesia"
        className={`flex items-center gap-1 ${
          isCompact
            ? 'px-1.5 sm:px-2 py-0.5 md:py-1 text-[11px] md:text-xs'
            : 'px-2.5 py-1 text-xs'
        } font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8F2635] ${
          language === 'id'
            ? 'bg-[#8F2635] text-[#FCFAF7] shadow-xs border border-[#8F2635]'
            : 'text-[#6B5E57] hover:text-[#332C29] hover:bg-[#F3E7E7]'
        }`}
      >
        <span className={isCompact ? 'text-[11px] sm:text-xs leading-none' : 'text-sm leading-none'} role="img" aria-label="Bendera Indonesia">
          🇮🇩
        </span>
        <span>Indonesia</span>
      </button>

      <button
        type="button"
        id="btn-lang-en"
        onClick={() => setLanguage('en')}
        aria-pressed={language === 'en'}
        aria-label="English language"
        title="English language"
        className={`flex items-center gap-1 ${
          isCompact
            ? 'px-1.5 sm:px-2 py-0.5 md:py-1 text-[11px] md:text-xs'
            : 'px-2.5 py-1 text-xs'
        } font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8F2635] ${
          language === 'en'
            ? 'bg-[#8F2635] text-[#FCFAF7] shadow-xs border border-[#8F2635]'
            : 'text-[#6B5E57] hover:text-[#332C29] hover:bg-[#F3E7E7]'
        }`}
      >
        <span className={isCompact ? 'text-[11px] sm:text-xs leading-none' : 'text-sm leading-none'} role="img" aria-label="United Kingdom Flag">
          🇬🇧
        </span>
        <span>English</span>
      </button>
    </div>
  );
};

