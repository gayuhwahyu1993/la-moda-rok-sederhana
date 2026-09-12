import React from 'react';
import { ArrowRight, Compass, Ruler, Calculator } from 'lucide-react';
import { useLanguage } from '../i18n';

export interface WorksheetIntroBannerProps {
  activeCalculatorId?: string;
}

export const WorksheetIntroBanner: React.FC<WorksheetIntroBannerProps> = ({ activeCalculatorId }) => {
  const { t } = useLanguage();
  const isPilotRokSederhana = !activeCalculatorId || activeCalculatorId === 'rok' || activeCalculatorId === 'rok-sederhana';

  return (
    <div className="bg-[#E8DED8]/60 border border-[#DFD4CD] rounded-2xl p-4 sm:p-5 mb-8 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Left Intro Text */}
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#8F2635]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8F2635]">
              {t.workflowPrinciple}
            </span>
          </div>
          <h2 className="font-serif text-lg sm:text-xl font-bold text-[#332C29] leading-tight">
            {t.bannerTitle}
          </h2>
          <p 
            className="text-xs text-[#6B5E57] leading-relaxed"
            dangerouslySetInnerHTML={{ __html: t.bannerDescription }}
          />
        </div>

        {/* Visual Step-by-Step Flow Badges */}
        {isPilotRokSederhana ? (
          /* PILOT: Fluid and Responsive Workflow Diagram for Pola Rok Dasar — Sistem Sederhana */
          <div 
            id="workflow-diagram-container"
            className="w-full lg:w-auto max-w-full flex items-center justify-between lg:justify-start gap-[clamp(3px,0.7vw,8px)] bg-[#FCFAF7]/90 p-[clamp(5px,0.9vw,10px)] rounded-xl border border-[#DFD4CD] shadow-2xs overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {/* Step 1: Nomor Ukuran */}
            <div 
              id="workflow-step-1"
              className="flex-1 lg:flex-initial min-w-0 flex items-center justify-center lg:justify-start gap-[clamp(2px,0.5vw,6px)] px-[clamp(5px,0.85vw,10px)] py-[clamp(3px,0.55vw,6px)] rounded-lg bg-[#FCFAF7] border border-[#DFD4CD] transition-all"
            >
              <span className="w-[clamp(13px,1.2vw,16px)] h-[clamp(13px,1.2vw,16px)] rounded-full bg-[#332C29] text-[#FCFAF7] flex items-center justify-center text-[clamp(7.5px,0.8vw,10px)] font-bold shrink-0">
                1
              </span>
              <span className="font-semibold text-[#332C29] text-[clamp(8px,0.85vw,10.5px)] whitespace-nowrap truncate leading-none">
                {t.stepMeasurementNo}
              </span>
            </div>

            {/* Arrow 1 */}
            <ArrowRight className="text-[#C9B49F] shrink-0 w-[clamp(8px,1vw,13px)] h-[clamp(8px,1vw,13px)]" />

            {/* Step 2: Ukuran Tubuh */}
            <div 
              id="workflow-step-2"
              className="flex-1 lg:flex-initial min-w-0 flex items-center justify-center lg:justify-start gap-[clamp(2px,0.5vw,6px)] px-[clamp(5px,0.85vw,10px)] py-[clamp(3px,0.55vw,6px)] rounded-lg bg-[#FCFAF7] border border-[#DFD4CD] transition-all"
            >
              <Ruler className="text-[#A85C68] shrink-0 w-[clamp(10px,1.1vw,13px)] h-[clamp(10px,1.1vw,13px)]" />
              <span className="font-semibold text-[#332C29] text-[clamp(8px,0.85vw,10.5px)] whitespace-nowrap truncate leading-none">
                {t.stepBodyMeasurement}
              </span>
            </div>

            {/* Arrow 2 */}
            <ArrowRight className="text-[#C9B49F] shrink-0 w-[clamp(8px,1vw,13px)] h-[clamp(8px,1vw,13px)]" />

            {/* Step 3: Formula Pola */}
            <div 
              id="workflow-step-3"
              className="flex-1 lg:flex-initial min-w-0 flex items-center justify-center lg:justify-start gap-[clamp(2px,0.5vw,6px)] px-[clamp(5px,0.85vw,10px)] py-[clamp(3px,0.55vw,6px)] rounded-lg bg-[#FCFAF7] border border-[#DFD4CD] transition-all"
            >
              <Calculator className="text-[#A85C68] shrink-0 w-[clamp(10px,1.1vw,13px)] h-[clamp(10px,1.1vw,13px)]" />
              <span className="font-semibold text-[#332C29] text-[clamp(8px,0.85vw,10.5px)] whitespace-nowrap truncate leading-none">
                {t.stepPatternFormula}
              </span>
            </div>

            {/* Arrow 3 */}
            <ArrowRight className="text-[#C9B49F] shrink-0 w-[clamp(8px,1vw,13px)] h-[clamp(8px,1vw,13px)]" />

            {/* Step 4: Titik Pola */}
            <div 
              id="workflow-step-4"
              className="flex-1 lg:flex-initial min-w-0 flex items-center justify-center lg:justify-start gap-[clamp(2px,0.5vw,6px)] px-[clamp(5px,0.85vw,10px)] py-[clamp(3px,0.55vw,6px)] rounded-lg bg-[#8F2635] text-[#FCFAF7] font-mono font-bold transition-all"
            >
              <Compass className="text-[#C9B49F] shrink-0 w-[clamp(10px,1.1vw,13px)] h-[clamp(10px,1.1vw,13px)]" />
              <span className="text-[clamp(8px,0.85vw,10.5px)] whitespace-nowrap truncate leading-none">
                {t.stepPatternPoints}
              </span>
            </div>
          </div>
        ) : (
          /* Standard / Legacy Badges (Preserved for non-pilot calculators) */
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap bg-[#FCFAF7]/90 p-2.5 rounded-xl border border-[#DFD4CD] shadow-2xs text-xs">
            {/* Step 1 */}
            <div className="flex items-center gap-1.5 pl-2 pr-2.5 py-1 -ml-px mt-0 rounded-lg bg-[#FCFAF7] border border-[#DFD4CD]">
              <span className="w-4 h-4 rounded-full bg-[#332C29] text-[#FCFAF7] flex items-center justify-center text-[10px] font-bold">
                1
              </span>
              <span className="font-semibold text-[#332C29] text-[10px]">{t.stepMeasurementNo}</span>
            </div>

            <ArrowRight size={13} className="text-[#C9B49F] shrink-0" />

            {/* Step 2 */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FCFAF7] border border-[#DFD4CD]">
              <Ruler size={13} className="text-[#A85C68]" />
              <span className="font-semibold text-[#332C29] text-[10px]">{t.stepBodyMeasurement}</span>
            </div>

            <ArrowRight size={13} className="text-[#C9B49F] shrink-0" />

            {/* Step 3 */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FCFAF7] border border-[#DFD4CD]">
              <Calculator size={13} className="text-[#A85C68]" />
              <span className="font-semibold text-[#332C29] text-[10px]">{t.stepPatternFormula}</span>
            </div>

            <ArrowRight size={13} className="text-[#C9B49F] shrink-0" />

            {/* Step 4 */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#8F2635] text-[#FCFAF7] font-mono font-bold">
              <Compass size={13} className="text-[#C9B49F]" />
              <span className="text-[10px]">{t.stepPatternPoints}</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
