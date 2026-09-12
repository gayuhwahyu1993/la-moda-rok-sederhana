import React from 'react';
import { BookOpen, Sparkles, Award } from 'lucide-react';
import { useLanguage } from '../i18n';

export const WorksheetFooter: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="mt-12 bg-[#FCFAF7] border-t border-[#E8DED8] pt-8 pb-12 text-[#6B5E57]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 3-Column Educational Notes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-8 border-b border-[#E8DED8]">
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#332C29] font-serif font-bold text-sm">
              <BookOpen size={16} className="text-[#8F2635]" />
              <h4>{t.learningStandardTitle}</h4>
            </div>
            <p className="text-xs leading-relaxed text-[#6B5E57]">
              {t.learningStandardDesc}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#332C29] font-serif font-bold text-sm">
              <Sparkles size={16} className="text-[#8F2635]" />
              <h4>{t.classInstructionsTitle}</h4>
            </div>
            <p className="text-xs leading-relaxed text-[#6B5E57]">
              {t.classInstructionsDesc}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#332C29] font-serif font-bold text-sm">
              <Award size={16} className="text-[#8F2635]" />
              <h4>{t.exportDocTitle}</h4>
            </div>
            <p className="text-xs leading-relaxed text-[#6B5E57]">
              {t.exportDocDesc}
            </p>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8C7D76]">
          <p>© {new Date().getFullYear()} {t.copyrightNotice}</p>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>{t.fashionEngineeringTag}</span>
            <span>•</span>
            <span>{t.digitalWorksheetVersion}</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
