import React from 'react';
import { useLanguage } from '../i18n';
import { PatternModuleInfo } from '../types/pattern';

export interface ModuleHeaderConfig {
  studioName?: string;
  appTitle?: string;
  moduleTitle?: string;
  systemSubtitle?: string;
}

interface ApplicationHeaderProps {
  moduleInfo?: PatternModuleInfo;
  studioName?: string;
  appTitle?: string;
  moduleTitle?: string;
  systemSubtitle?: string;
}

export const ApplicationHeader: React.FC<ApplicationHeaderProps> = ({
  moduleInfo,
  studioName,
  appTitle,
  moduleTitle,
  systemSubtitle,
}) => {
  const { t } = useLanguage();

  const moduleId = moduleInfo?.id || 'basic-skirt';
  const localizedModule = t.modules?.[moduleId];

  const displayStudioName = studioName || moduleInfo?.studioName || t.studioName;
  const displayAppTitle = appTitle || moduleInfo?.appTitle || t.patternCalculator || t.appTitle;
  const displayModuleTitle = moduleTitle || localizedModule?.title || moduleInfo?.moduleTitle || t.moduleTitle;
  const displaySystemSubtitle = systemSubtitle || localizedModule?.subtitle || moduleInfo?.systemSubtitle || t.systemSubtitle;

  return (
    <header 
      id="application-header" 
      className="bg-transparent pt-2 pb-4 border-b border-[#E8DED8]"
    >
      <div className="space-y-1.5">
        {/* BRAND */}
        <div>
          <p className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.22em] text-[#8C7D76] uppercase">
            {displayStudioName}
          </p>
        </div>

        {/* PATTERN MODULE TITLE & SUBTITLE */}
        <div className="pt-0.5">
          <h1 className="font-serif text-[32px] font-bold text-[#332C29] tracking-tight leading-tight">
            {displayModuleTitle}
          </h1>
          <p className="font-serif not-italic text-[28px] leading-[34px] text-[#A85C68] font-bold tracking-normal mt-1">
            {displaySystemSubtitle}
          </p>
        </div>
      </div>
    </header>
  );
};
