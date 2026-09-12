import React from 'react';
import { Ruler, HelpCircle, Layers, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { BodyMeasurement } from '../types/pattern';
import { useLanguage } from '../i18n';

interface BodyMeasurementSectionProps {
  measurements: BodyMeasurement[];
  onMeasurementChange: (fieldKey: string, value: number) => void;
  activeMeasurementNumber: number | null;
  onHoverMeasurement: (number: number | null) => void;
  calculatorId?: string;
  isGuideOpen?: boolean;
  onToggleGuide?: () => void;
  hasGuideImage?: boolean;
}

export const BodyMeasurementSection: React.FC<BodyMeasurementSectionProps> = ({
  measurements,
  onMeasurementChange,
  activeMeasurementNumber,
  onHoverMeasurement,
  calculatorId,
  isGuideOpen = false,
  onToggleGuide,
  hasGuideImage = false,
}) => {
  const { t } = useLanguage();
  const isPajama = calculatorId?.includes('piyama') || calculatorId?.includes('celana');

  // Separate primary and additional measurements if group metadata exists
  const primaryMeasurements = measurements.filter((m) => m.group !== 'additional');
  const additionalMeasurements = measurements.filter((m) => m.group === 'additional');
  const hasAdditional = additionalMeasurements.length > 0;
  const isMultiColumn = !isGuideOpen && measurements.length > 5;

  // Helper to arrange measurements for two columns when guide is closed
  const renderMeasurementGrid = (items: BodyMeasurement[]) => {
    if (!isMultiColumn) {
      return (
        <div className="flex flex-col space-y-1.5">
          {items.map(renderMeasurementCard)}
        </div>
      );
    }

    const half = Math.ceil(items.length / 2);
    const leftColItems = items.slice(0, half);
    const rightColItems = items.slice(half);

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
        <div className="flex flex-col space-y-1.5">
          {leftColItems.map(renderMeasurementCard)}
        </div>
        <div className="flex flex-col space-y-1.5">
          {rightColItems.map(renderMeasurementCard)}
        </div>
      </div>
    );
  };

  const renderMeasurementCard = (item: BodyMeasurement) => {
    const isActive = activeMeasurementNumber === item.number;
    const transItem = t.measurements[item.fieldKey as keyof typeof t.measurements];
    const displayName = transItem?.name || item.name;

    return (
      <div
        key={item.id}
        id={`measurement-row-${item.number}`}
        onMouseEnter={() => onHoverMeasurement(item.number)}
        onMouseLeave={() => onHoverMeasurement(null)}
        className={`group flex items-center justify-between rounded-lg border transition-all duration-150 ${
          isGuideOpen
            ? 'p-1.5 xs:p-2 sm:px-2.5 sm:py-2'
            : 'p-2 sm:px-2.5 sm:py-2'
        } ${
          isActive
            ? 'bg-[#E8DED8]/60 border-[#A85C68] shadow-xs ring-1 ring-[#A85C68]/30'
            : 'bg-[#FCFAF7] hover:bg-[#E8DED8]/40 border-[#E8DED8]'
        }`}
      >
        {/* Left: Number + Measurement Name */}
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 pr-1 flex-1">
          {/* Number Badge matching measurement guide */}
          <div
            className={`rounded-md flex items-center justify-center font-sans font-bold shrink-0 transition-all duration-150 ${
              isGuideOpen
                ? 'w-5 h-5 sm:w-6 sm:h-6 text-[10px] sm:text-xs'
                : 'w-5.5 h-5.5 sm:w-6 sm:h-6 text-[11px] sm:text-xs'
            } ${
              isActive
                ? 'bg-[#8F2635] text-[#FCFAF7] shadow-xs scale-105'
                : 'bg-[#E8DED8] text-[#332C29] group-hover:bg-[#DFD4CD]'
            }`}
            title={`${item.number} ${t.numberOnIllustrationTitle}`}
          >
            {item.number}
          </div>

          <div className="min-w-0 flex-1">
            <label
              htmlFor={`input-${item.fieldKey}`}
              className={`block font-medium leading-tight cursor-pointer transition-colors ${
                isGuideOpen
                  ? 'text-[11px] xs:text-xs sm:text-[12.5px] line-clamp-2'
                  : 'text-xs sm:text-[12.5px]'
              } ${
                isActive ? 'text-[#8F2635] font-semibold' : 'text-[#332C29]'
              }`}
            >
              {displayName}
            </label>
            {item.helperNote && (
              <p className="text-[10px] text-[#8F2635] italic font-medium mt-0.5 leading-tight">
                {t.controlMeasurementHelper || item.helperNote}
              </p>
            )}
          </div>
        </div>

        {/* Right: [ Input Field ] cm */}
        <div className="flex items-center gap-1 shrink-0 ml-1">
          <div className="relative">
            <input
              id={`input-${item.fieldKey}`}
              type="number"
              step="0.5"
              min="0"
              max="300"
              value={item.value || ''}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                onMeasurementChange(item.fieldKey, isNaN(val) ? 0 : val);
              }}
              onFocus={() => onHoverMeasurement(item.number)}
              onBlur={() => onHoverMeasurement(null)}
              placeholder="0"
              className={`text-right font-mono font-semibold rounded-md border transition-all outline-none ${
                isGuideOpen
                  ? 'w-11 xs:w-12 sm:w-14 px-1 xs:px-1.5 py-0.5 text-xs sm:text-[13px]'
                  : 'w-13 sm:w-14 px-1.5 py-0.5 text-xs sm:text-[13px]'
              } ${
                isActive
                  ? 'bg-white border-[#8F2635] text-[#332C29] shadow-xs ring-2 ring-[#8F2635]/20'
                  : 'bg-[#FCFAF7] border-[#DFD4CD] text-[#332C29] focus:border-[#8F2635] focus:ring-2 focus:ring-[#8F2635]/20'
              }`}
            />
          </div>
          <span className="text-[10px] sm:text-[11px] font-medium text-[#6B5E57] select-none w-3 sm:w-3.5 text-left">
            {item.unit}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div 
      id="section-daftar-ukuran"
      className="bg-[#FCFAF7] rounded-2xl border border-[#E8DED8] shadow-sm overflow-hidden h-full flex flex-col transition-all"
    >
      {/* Section Header */}
      <div className="px-3.5 sm:px-5 py-3 bg-[#E8DED8]/40 border-b border-[#E8DED8] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6.5 h-6.5 rounded-lg bg-[#E8DED8] text-[#8F2635] flex items-center justify-center font-medium shadow-xs shrink-0">
            <Ruler size={14} />
          </div>
          <div className="min-w-0">
            <h2 className="font-serif text-sm sm:text-lg font-bold text-[#332C29] tracking-wide truncate">
              {t.measurementsTitle}
            </h2>
            <p className="text-[11px] sm:text-[11.5px] text-[#6B5E57] truncate hidden xs:block">
              {t.measurementsSubtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10.5px] font-semibold text-[#6B5E57] uppercase tracking-wider bg-[#E8DED8] px-2 py-0.5 rounded-md hidden sm:inline">
            {measurements.length} {t.measurementsCountSuffix}
          </span>

          {/* Toggle Guide Button in Header */}
          {hasGuideImage && onToggleGuide && (
            <button
              type="button"
              id="toggle-guide-header-btn"
              onClick={onToggleGuide}
              aria-expanded={isGuideOpen}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                isGuideOpen
                  ? 'bg-[#8F2635] text-white border-[#8F2635] shadow-xs'
                  : 'bg-[#FCFAF7] hover:bg-[#E8DED8] text-[#332C29] border-[#DFD4CD]'
              }`}
              title={isGuideOpen ? t.hideMeasurementGuide : t.showMeasurementGuide}
            >
              <Ruler size={13} className={isGuideOpen ? 'text-white' : 'text-[#8F2635]'} />
              <span className="hidden sm:inline">
                {t.measurementGuideTitle}
              </span>
              <span className="sm:hidden">
                {isGuideOpen ? t.hideMeasurementGuide : t.showMeasurementGuide}
              </span>
              {isGuideOpen ? (
                <ChevronUp size={13} className={isGuideOpen ? 'text-white' : 'text-[#8F2635]'} />
              ) : (
                <ChevronDown size={13} className="text-[#8F2635]" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Measurement List - Responsive Grid */}
      <div className="p-2.5 sm:p-4 space-y-3 flex-1 overflow-y-auto">
        {/* Pajama Principle Note Banner */}
        {isPajama && t.pajamaMeasurementPrinciple && (
          <div className="p-2.5 sm:p-3 rounded-xl bg-[#E8DED8]/50 border border-[#A85C68]/30 flex items-start gap-2">
            <Info size={15} className="text-[#8F2635] shrink-0 mt-0.5" />
            <p className="text-[11.5px] sm:text-xs text-[#5C4D44] font-medium leading-relaxed">
              {t.pajamaMeasurementPrinciple}
            </p>
          </div>
        )}

        {/* Section 1: Ukuran Utama (or all if not grouped) */}
        <div>
          {hasAdditional && (
            <div className="flex items-center gap-2 mb-2 pb-1 border-b border-[#E8DED8]">
              <span className="text-[11px] sm:text-xs font-bold text-[#332C29] tracking-wide uppercase">
                {t.primaryMeasurementsTitle || 'Ukuran Utama'}
              </span>
              <span className="text-[10.5px] text-[#8C7D76]">
                ({primaryMeasurements.length})
              </span>
            </div>
          )}

          {renderMeasurementGrid(primaryMeasurements)}
        </div>

        {/* Section 2: Ukuran Tambahan (if present) */}
        {hasAdditional && (
          <div className="pt-1.5 border-t border-[#E8DED8]/70">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2 pb-1 border-b border-[#E8DED8]">
              <div className="flex items-center gap-1.5">
                <Layers size={12} className="text-[#8F2635]" />
                <span className="text-[11px] sm:text-xs font-bold text-[#332C29] tracking-wide uppercase">
                  {t.additionalMeasurementsTitle || 'Ukuran Tambahan'}
                </span>
                <span className="text-[10.5px] text-[#8C7D76]">
                  ({additionalMeasurements.length})
                </span>
              </div>
              <span className="text-[10.5px] text-[#8C7D76] italic">
                {t.additionalMeasurementsSubtitle || 'Digunakan untuk pembahasan selanjutnya'}
              </span>
            </div>

            {/* Render all additional measurements stacked in one vertical column */}
            <div className={isMultiColumn ? 'grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2' : ''}>
              <div className="flex flex-col space-y-1.5">
                {additionalMeasurements.map(renderMeasurementCard)}
              </div>
            </div>
          </div>
        )}

        {/* Measurement Taking Note */}
        <div className="pt-1 px-1 text-xs text-[#7A6B63] leading-relaxed">
          <p className="text-[11px] text-[#7A6B63] italic">
            {t.measurementNote}
          </p>
        </div>
      </div>

      {/* Helpful Hint Footer with toggle option */}
      <div className="px-3.5 sm:px-5 py-2.5 bg-[#E8DED8]/40 border-t border-[#E8DED8] flex items-center justify-between text-xs text-[#6B5E57]">
        <span className="flex items-center gap-1.5 text-[11px] sm:text-[11.5px] truncate mr-2">
          <HelpCircle size={13} className="text-[#8C7D76] shrink-0" />
          <span className="truncate">{t.measurementHint}</span>
        </span>
        
        {hasGuideImage && !isGuideOpen && onToggleGuide ? (
          <button
            type="button"
            id="toggle-guide-footer-btn"
            onClick={onToggleGuide}
            className="flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-[#8F2635] hover:underline cursor-pointer shrink-0"
          >
            <Ruler size={12} />
            <span>{t.showMeasurementGuide}</span>
            <ChevronDown size={12} />
          </button>
        ) : (
          <span className="font-mono text-[11px] text-[#8C7D76] hidden sm:inline shrink-0">
            {t.unitLabel}
          </span>
        )}
      </div>
    </div>
  );
};
