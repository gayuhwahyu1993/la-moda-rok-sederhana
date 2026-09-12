import React from 'react';
import { 
  ArrowLeft, 
  Printer, 
  FileText, 
  Ruler, 
  Image as ImageIcon, 
  FileCheck, 
  Calculator,
  Sliders,
  ListOrdered
} from 'lucide-react';
import { PrintWorksheet } from './PrintWorksheet';
import { LanguageSelector } from './LanguageSelector';
import { 
  ClientInfo, 
  BodyMeasurement, 
  PatternCalculationItem, 
  PatternModuleInfo, 
  WorksheetPrintOptions 
} from '../types/pattern';
import { useLanguage } from '../i18n';

interface WorksheetPreviewViewProps {
  moduleInfo: PatternModuleInfo;
  clientInfo: ClientInfo;
  measurements: BodyMeasurement[];
  calculations: PatternCalculationItem[];
  measurementsMap: Record<string, number>;
  patternImage?: string | null;
  dressmakingBackPatternImage?: string | null;
  dressmakingFrontPatternImage?: string | null;
  dressmakingSideDartImage?: string | null;
  patternDescription?: string | null;
  frontPatternDescription?: string | null;
  backPatternDescription?: string | null;
  circleSkirtModel?: 'full' | 'half';
  panelCount?: number;
  printOptions: WorksheetPrintOptions;
  onChangePrintOptions: (options: WorksheetPrintOptions) => void;
  onClose: () => void;
  onPrint: () => void;
}

export const WorksheetPreviewView: React.FC<WorksheetPreviewViewProps> = ({
  moduleInfo,
  clientInfo,
  measurements,
  calculations,
  measurementsMap,
  patternImage,
  dressmakingBackPatternImage,
  dressmakingFrontPatternImage,
  dressmakingSideDartImage,
  patternDescription,
  frontPatternDescription,
  backPatternDescription,
  circleSkirtModel,
  panelCount,
  printOptions,
  onChangePrintOptions,
  onClose,
  onPrint,
}) => {
  const { t } = useLanguage();

  const toggleOption = (key: keyof WorksheetPrintOptions) => {
    onChangePrintOptions({
      ...printOptions,
      [key]: !printOptions[key],
    });
  };

  return (
    <div className="min-h-screen bg-[#F3E7E7] flex flex-col text-[#332C29] font-sans pb-16">
      {/* 1. TOP STICKY PREVIEW TOOLBAR */}
      <div className="sticky top-0 z-40 bg-[#FCFAF7]/95 backdrop-blur-sm border-b border-[#E8DED8] shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          
          {/* Back Action */}
          <button
            type="button"
            onClick={onClose}
            id="btn-back-to-calculator"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-[#E8DED8] bg-[#FCFAF7] hover:bg-[#E8DED8] text-[#332C29] text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            <ArrowLeft size={15} />
            <span>{t.backToCalculator}</span>
          </button>

          {/* Center Indicator */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#8F2635]" />
            <h2 className="font-serif text-base sm:text-lg font-bold text-[#332C29] flex items-center gap-2">
              <span>{t.previewViewTitle}</span>
              <span className="hidden sm:inline-block text-[11px] font-sans font-medium px-2 py-0.5 rounded-md bg-[#E8DED8] text-[#6B5E57] border border-[#DFD4CD]">
                {t.a4PaperPreviewBadge}
              </span>
            </h2>
          </div>

          {/* Right Actions: Language Selector + Direct Print Button */}
          <div className="flex items-center gap-3">
            <LanguageSelector />
            
            <button
              type="button"
              onClick={onPrint}
              id="btn-print-from-preview"
              className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-[#8F2635] hover:bg-[#7A1F2D] active:bg-[#681925] text-[#FCFAF7] text-xs font-bold transition-all shadow-xs cursor-pointer"
              title={t.printHeaderTitle}
            >
              <Printer size={14} className="text-[#C9B49F]" />
              <span>{t.printWorksheetBtn}</span>
            </button>
          </div>

        </div>
      </div>

      {/* 2. PREVIEW CANVAS AREA */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-5 flex-1 flex flex-col items-center">
        
        {/* Interactive Print Options Filter Bar */}
        <div className="w-full max-w-[210mm] bg-[#FCFAF7] border border-[#E8DED8] rounded-xl p-3.5 mb-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-[#E8DED8]">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6B5E57]">
              <Sliders size={14} className="text-[#8F2635]" />
              <span>{t.printOptionsTitle}</span>
            </div>
            <span className="text-[11px] text-[#8C7D76]">
              {t.printOptionsSubtitle}
            </span>
          </div>

          {/* Interactive Toggle Checkboxes */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-2.5">
            {/* 1. Data Pengukuran */}
            <label className="flex items-center gap-2 text-xs font-medium text-[#332C29] p-1.5 rounded-lg hover:bg-[#E8DED8]/40 transition-colors cursor-pointer select-none">
              <input
                type="checkbox"
                checked={printOptions.includeMeasurements}
                onChange={() => toggleOption('includeMeasurements')}
                className="w-4 h-4 rounded text-[#8F2635] accent-[#8F2635] cursor-pointer"
              />
              <span className="flex items-center gap-1 min-w-0">
                <Ruler size={13} className="text-[#8F2635] shrink-0" />
                <span className="truncate">{t.optMeasurements}</span>
              </span>
            </label>

            {/* 2. Hasil Ukuran Pola */}
            <label className="flex items-center gap-2 text-xs font-medium text-[#332C29] p-1.5 rounded-lg hover:bg-[#E8DED8]/40 transition-colors cursor-pointer select-none">
              <input
                type="checkbox"
                checked={printOptions.includeCalculations}
                onChange={() => toggleOption('includeCalculations')}
                className="w-4 h-4 rounded text-[#8F2635] accent-[#8F2635] cursor-pointer"
              />
              <span className="flex items-center gap-1 min-w-0">
                <ListOrdered size={13} className="text-[#8F2635] shrink-0" />
                <span className="truncate">{t.optCalculations}</span>
              </span>
            </label>

            {/* 3. Gambar Pola */}
            <label className="flex items-center gap-2 text-xs font-medium text-[#332C29] p-1.5 rounded-lg hover:bg-[#E8DED8]/40 transition-colors cursor-pointer select-none">
              <input
                type="checkbox"
                checked={printOptions.includePatternImage}
                onChange={() => toggleOption('includePatternImage')}
                className="w-4 h-4 rounded text-[#8F2635] accent-[#8F2635] cursor-pointer"
              />
              <span className="flex items-center gap-1 min-w-0">
                <ImageIcon size={13} className="text-[#8F2635] shrink-0" />
                <span className="truncate">{t.optPatternImage}</span>
              </span>
            </label>

            {/* 4A. Pola Depan */}
            <label className="flex items-center gap-2 text-xs font-medium text-[#332C29] p-1.5 rounded-lg hover:bg-[#E8DED8]/40 transition-colors cursor-pointer select-none">
              <input
                type="checkbox"
                checked={printOptions.includeFrontPatternDescription}
                onChange={() => toggleOption('includeFrontPatternDescription')}
                className="w-4 h-4 rounded text-[#8F2635] accent-[#8F2635] cursor-pointer"
              />
              <span className="flex items-center gap-1 min-w-0">
                <FileCheck size={13} className="text-[#8F2635] shrink-0" />
                <span className="truncate">{t.optFrontPatternDescription}</span>
              </span>
            </label>

            {/* 4B. Pola Belakang */}
            <label className="flex items-center gap-2 text-xs font-medium text-[#332C29] p-1.5 rounded-lg hover:bg-[#E8DED8]/40 transition-colors cursor-pointer select-none">
              <input
                type="checkbox"
                checked={printOptions.includeBackPatternDescription}
                onChange={() => toggleOption('includeBackPatternDescription')}
                className="w-4 h-4 rounded text-[#332C29] accent-[#332C29] cursor-pointer"
              />
              <span className="flex items-center gap-1 min-w-0">
                <FileCheck size={13} className="text-[#332C29] shrink-0" />
                <span className="truncate">{t.optBackPatternDescription}</span>
              </span>
            </label>

            {/* 5. Perhitungan Rumus */}
            <label className="flex items-center gap-2 text-xs font-medium text-[#332C29] p-1.5 rounded-lg hover:bg-[#E8DED8]/40 transition-colors cursor-pointer select-none">
              <input
                type="checkbox"
                checked={printOptions.includeFormulaCalculations}
                onChange={() => toggleOption('includeFormulaCalculations')}
                className="w-4 h-4 rounded text-[#8F2635] accent-[#8F2635] cursor-pointer"
              />
              <span className="flex items-center gap-1 min-w-0">
                <Calculator size={13} className="text-[#8F2635] shrink-0" />
                <span className="truncate">{t.optFormulaCalculations}</span>
              </span>
            </label>
          </div>
        </div>

        {/* Subtle Preview Notice Bar */}
        <div className="w-full max-w-[210mm] flex items-center justify-between text-xs text-[#6B5E57] mb-2 px-1">
          <span className="flex items-center gap-1.5 font-medium">
            <FileText size={14} className="text-[#8F2635]" />
            {t.paperStandardNote}
          </span>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#8C7D76]">
            {t.printFormatBadge}
          </span>
        </div>

        {/* 3. REALISTIC A4 SHEET CANVAS */}
        <div className="w-full max-w-[210mm] bg-[#FCFAF7] rounded-sm shadow-[0_10px_30px_-5px_rgba(51,44,41,0.15),0_0_0_1px_rgba(51,44,41,0.06)] p-6 sm:p-8 lg:p-10 mb-8 transition-all">
          <PrintWorksheet
            moduleInfo={moduleInfo}
            clientInfo={clientInfo}
            measurements={measurements}
            calculations={calculations}
            measurementsMap={measurementsMap}
            patternImage={patternImage}
            dressmakingBackPatternImage={dressmakingBackPatternImage}
            dressmakingFrontPatternImage={dressmakingFrontPatternImage}
            dressmakingSideDartImage={dressmakingSideDartImage}
            patternDescription={patternDescription}
            frontPatternDescription={frontPatternDescription}
            backPatternDescription={backPatternDescription}
            circleSkirtModel={circleSkirtModel}
            panelCount={panelCount}
            printOptions={printOptions}
            isPreview={true}
          />
        </div>

        {/* 4. BOTTOM ACTION ROW */}
        <div className="w-full max-w-[210mm] flex items-center justify-between gap-4 py-2 border-t border-[#E8DED8] text-xs">
          <button
            type="button"
            onClick={onClose}
            className="text-[#6B5E57] hover:text-[#332C29] font-semibold flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft size={13} />
            {t.backToCalculator}
          </button>

          <button
            type="button"
            onClick={onPrint}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#8F2635] hover:bg-[#7A1F2D] text-[#FCFAF7] text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Printer size={14} className="text-[#C9B49F]" />
            <span>{t.printWorksheetBottomBtn}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
