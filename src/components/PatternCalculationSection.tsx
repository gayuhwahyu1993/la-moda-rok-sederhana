import React, { useState } from 'react';
import { Calculator, BookOpen, Info } from 'lucide-react';
import { PatternCalculationItem } from '../types/pattern';
import { FRONT_PATTERN_CALCULATIONS, BACK_PATTERN_CALCULATIONS, formatDraftingPrecision } from '../data/patternData';
import { useLanguage } from '../i18n';

interface PatternCalculationSectionProps {
  calculations?: PatternCalculationItem[];
  measurementsMap: Record<string, number>;
  activeCalculationId: string | null;
  onSelectCalculation: (id: string | null) => void;
  calculatorId?: string;
  circleSkirtModel?: 'full' | 'half';
  kulotAcMethod?: 'tinggi-duduk' | 'tinggi-panggul-range';
  onChangeKulotAcMethod?: (method: 'tinggi-duduk' | 'tinggi-panggul-range') => void;
  jarakQR?: number | '';
  onChangeJarakQR?: (val: number | '') => void;
}

export const PatternCalculationSection: React.FC<PatternCalculationSectionProps> = ({
  calculations,
  measurementsMap,
  activeCalculationId,
  onSelectCalculation,
  calculatorId,
  circleSkirtModel = 'full',
  kulotAcMethod = 'tinggi-duduk',
  onChangeKulotAcMethod,
  jarakQR,
  onChangeJarakQR,
}) => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'all' | 'front' | 'back'>('all');
  const [localJarakQR, setLocalJarakQR] = useState<number | ''>('');
  const effectiveJarakQR = jarakQR !== undefined ? jarakQR : localJarakQR;

  const handleJarakQRChange = (valStr: string) => {
    if (valStr === '') {
      if (onChangeJarakQR) onChangeJarakQR('');
      setLocalJarakQR('');
    } else {
      const num = parseFloat(valStr);
      if (!isNaN(num)) {
        if (onChangeJarakQR) onChangeJarakQR(num);
        setLocalJarakQR(num);
      } else {
        if (onChangeJarakQR) onChangeJarakQR('');
        setLocalJarakQR('');
      }
    }
  };

  const isRokLingkaran = calculatorId === 'rok-lingkaran' || calculatorId === 'lingkaran';
  const isTieredSkirt = calculatorId === 'pola-rok-kerut-bertingkat' || calculatorId === 'rok-kerut-bertingkat' || calculatorId === 'rok-kerut' || calculatorId === 'tiered-skirt';
  const isPolaLengan = calculatorId === 'pola-lengan' || calculatorId === 'lengan' || calculatorId === 'basic-sleeve' || calculatorId?.includes('lengan') || calculatorId?.includes('sleeve');
  const isPolaCelana = calculatorId === 'pola-celana-piyama' || calculatorId === 'celana-piyama' || calculatorId === 'celana' || calculatorId === 'pajama-pants' || calculatorId?.includes('celana') || calculatorId?.includes('piyama');
  const isRokPiasGodet = calculatorId === 'rok-pias-godet' || calculatorId === 'pias-godet' || calculatorId === 'rok-pias' || calculatorId === 'pias' || calculatorId === 'godet';
  const isRokLipitSearah = calculatorId === 'rok-lipit-searah' || calculatorId === 'rok-lipit' || calculatorId === 'lipit-searah' || calculatorId === 'lipit' || calculatorId?.includes('lipit');
  const isKulot = calculatorId === 'pola-kulot' || calculatorId === 'kulot' || calculatorId === 'culottes' || calculatorId === 'culotte-pants';
  const isBadanIndonesia = calculatorId === 'badan-indonesia' || 
    calculatorId === 'basic-bodice-indonesia' || 
    (Boolean(calculatorId?.includes('indonesia')) && Boolean(calculatorId?.includes('badan')));

  const isRokSederhana = calculatorId === 'rok' || calculatorId === 'rok-sederhana';

  const isBackFirst = calculatorId === 'badan-dressmaking' || 
    calculatorId === 'basic-bodice-dressmaking' || 
    (calculatorId?.includes('dressmaking') && calculatorId?.includes('badan'));

  const frontList = calculations !== undefined 
    ? calculations.filter((c) => c.patternSide === 'front')
    : FRONT_PATTERN_CALCULATIONS;

  const backList = calculations !== undefined 
    ? calculations.filter((c) => c.patternSide === 'back')
    : BACK_PATTERN_CALCULATIONS;

  const piasList = (calculations || []).filter((c) => c.id.startsWith('pias-') || c.patternSide !== 'back');
  const godetList = (calculations || []).filter((c) => c.id.startsWith('godet-') || c.patternSide === 'back');

  const hasCalculations = (isRokLingkaran || isTieredSkirt || isPolaLengan || isPolaCelana || isRokPiasGodet || isRokLipitSearah || isKulot) ? (calculations && calculations.length > 0) : (frontList.length > 0 || backList.length > 0);

  // Render a clean, non-cluttered list of calculated drafting values with point label, formula, and live numerical result
  const renderCalculationRow = (item: PatternCalculationItem) => {
    const isActive = activeCalculationId === item.id;
    const isFront = item.patternSide === 'front';

    // Check if this is Kulot A-C calculation in range mode
    const isKulotAcRange = isKulot && (item.id === 'kulot-ac-front' || item.id === 'kulot-ac-back') && kulotAcMethod === 'tinggi-panggul-range';

    // 1. Determine point / construction label
    const pointLabel = item.points;

    const isBadanIndonesiaST = isBadanIndonesia && (item.id === 'calc-id-front-st' || item.pointIdentifier === 'S-T');

    // 2. Determine calculated numerical value dynamically
    let rawVal = 0;
    if (isBadanIndonesiaST) {
      const qrOffset = typeof effectiveJarakQR === 'number' && !isNaN(effectiveJarakQR) ? effectiveJarakQR : 0;
      rawVal = Math.max(0, ((measurementsMap.lebarMuka ?? 33) / 2) - qrOffset);
    } else if (item.calculate) {
      rawVal = item.calculate(measurementsMap);
    } else if (item.fixedValue !== undefined) {
      rawVal = item.fixedValue;
    }

    const isCalculated = typeof rawVal === 'number' && !isNaN(rawVal);
    const formatted = isCalculated ? formatDraftingPrecision(rawVal) : '0';
    const resultNumber = language === 'en' ? formatted : formatted.replace('.', ',');

    // Color conventions: 🔴 Pola Depan = Red (#8F2635), 🔵 Pola Belakang = Blue (#1D4ED8 / #1E40AF)
    const accentText = isFront ? 'text-[#8F2635]' : 'text-[#1D4ED8]';
    const pointBadgeClass = isFront 
      ? 'bg-[#F3E7E7] text-[#8F2635] border border-[#E8DED8]' 
      : 'bg-[#DBEAFE] text-[#1E40AF] border border-[#BFDBFE]';
    const activeClass = isFront
      ? 'bg-[#FDF2F2] border-[#8F2635] shadow-xs ring-1 ring-[#8F2635]/30'
      : 'bg-[#EFF6FF] border-[#2563EB] shadow-xs ring-1 ring-[#2563EB]/30';
    const hoverClass = isFront
      ? 'hover:bg-[#FDF4F4] hover:border-[#D5C7BF]'
      : 'hover:bg-[#F0F5FF] hover:border-[#93C5FD]';

    const tpVal = measurementsMap.tinggiPanggul ?? 18;
    const tpLower = tpVal + 7;
    const tpUpper = tpVal + 8;
    const rangeDisplay = language === 'en'
      ? `${tpLower} cm up to ${tpUpper} cm`
      : `${tpLower} cm sampai dengan ${tpUpper} cm`;

    return (
      <div
        key={item.id}
        id={`calc-row-${item.id}`}
        onClick={() => onSelectCalculation(isActive ? null : item.id)}
        className={`${isRokSederhana 
          ? 'px-[clamp(0.2rem,0.12rem+0.25vw,0.75rem)] py-[clamp(0.15rem,0.1rem+0.2vw,0.5rem)] rounded-lg' 
          : 'px-3 py-2.5 sm:px-3.5 sm:py-2.5 rounded-xl'} border transition-all duration-150 cursor-pointer ${
          isActive
            ? activeClass
            : `bg-white ${hoverClass} border-[#E8DED8]`
        }`}
      >
        <div className={`flex items-center justify-between ${isRokSederhana ? 'gap-[clamp(0.12rem,0.08rem+0.15vw,0.5rem)]' : 'gap-3 flex-wrap'}`}>
          {/* Drafting Point / Reference Label Only */}
          <div className="flex items-center min-w-0">
            <span
              className={`font-mono font-bold ${isRokSederhana 
                ? 'text-[clamp(0.5rem,0.42rem+0.25vw,0.75rem)] px-[clamp(0.18rem,0.12rem+0.2vw,0.5rem)] py-[0.05rem]' 
                : 'text-xs sm:text-sm px-2.5 py-0.5'} rounded-md ${pointBadgeClass} shrink-0 whitespace-nowrap leading-tight`}
              style={{ whiteSpace: 'nowrap' }}
            >
              {pointLabel}
            </span>
          </div>

          {/* Small manual input for Jarak Q–R (Pola Dasar Badan Sistem Indonesia ONLY) */}
          {isBadanIndonesiaST && (
            <div
              className="flex items-center gap-1.5 bg-[#FAF6F3] px-2.5 py-1 rounded-lg border border-[#E8DED8]"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              <label
                htmlFor="input-jarak-qr"
                className="text-[11px] sm:text-xs font-medium text-[#6B5E57] whitespace-nowrap cursor-pointer"
              >
                {language === 'en' ? 'Q–R dist:' : 'Jarak Q–R:'}
              </label>
              <input
                id="input-jarak-qr"
                type="number"
                step="0.1"
                min="0"
                max="30"
                placeholder="0"
                value={effectiveJarakQR !== '' ? effectiveJarakQR : ''}
                onChange={(e) => handleJarakQRChange(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="w-12 sm:w-14 px-1.5 py-0.5 text-xs font-mono font-bold text-center bg-white text-[#332C29] border border-[#D5C7BF] rounded-md focus:outline-hidden focus:ring-1 focus:ring-[#8F2635] focus:border-[#8F2635]"
              />
              <span className="text-[10px] sm:text-[11px] font-mono text-[#8C7D76]">cm</span>
            </div>
          )}

          {/* Numerical Result Only */}
          {isKulotAcRange ? (
            <div className="flex flex-col items-end shrink-0">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs sm:text-sm text-[#8C7D76] font-mono font-medium">=</span>
                <span className={`font-mono font-bold text-xs sm:text-sm ${accentText}`}>
                  {rangeDisplay}
                </span>
              </div>
              <span className="text-[10px] text-[#8C7D76] italic mt-0.5">
                {language === 'en' ? '* Select within range per ease requirement' : '* Tentukan sendiri angka di antara rentang sesuai kelonggaran'}
              </span>
            </div>
          ) : (
            <div className={`flex items-baseline ${isRokSederhana ? 'gap-[clamp(0.08rem,0.06rem+0.1vw,0.25rem)]' : 'gap-1.5'} shrink-0`}>
              <span className={`${isRokSederhana ? 'text-[clamp(0.5rem,0.42rem+0.25vw,0.75rem)]' : 'text-xs sm:text-sm'} text-[#8C7D76] font-mono font-medium leading-none`}>=</span>
              <span
                className={`font-mono font-bold ${isRokSederhana ? 'text-[clamp(0.5625rem,0.46rem+0.3vw,0.8125rem)]' : 'text-xs sm:text-sm'} tabular-nums ${accentText} leading-none`}
              >
                {resultNumber}
              </span>
              <span className={`${isRokSederhana ? 'text-[clamp(0.44rem,0.38rem+0.2vw,0.6875rem)]' : 'text-[11px] sm:text-xs'} font-medium text-[#6B5E57] leading-none`}>cm</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      id="section-hasil-perhitungan"
      className="bg-[#FCFAF7] rounded-2xl border border-[#E8DED8] shadow-sm overflow-hidden h-full flex flex-col transition-all"
    >
      {/* Section Header Bar */}
      <div className={`${isRokSederhana ? 'px-[clamp(0.4rem,0.25rem+0.55vw,1.25rem)] py-[clamp(0.35rem,0.25rem+0.45vw,1rem)]' : 'px-5 py-4'} bg-[#E8DED8]/40 border-b border-[#E8DED8] flex items-center justify-between gap-1.5 sm:gap-2`}>
        <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
          <div className={`${isRokSederhana ? 'w-[clamp(1.25rem,1rem+0.75vw,2rem)] h-[clamp(1.25rem,1rem+0.75vw,2rem)]' : 'w-8 h-8'} rounded-lg bg-[#E8DED8] text-[#8F2635] flex items-center justify-center font-medium shadow-xs shrink-0`}>
            <Calculator className={`shrink-0 ${isRokSederhana ? 'size-[clamp(0.6875rem,0.56rem+0.4vw,1rem)]' : 'size-3.5 sm:size-4'}`} />
          </div>
          <div className="min-w-0">
            <h2 className={`font-serif ${isRokSederhana ? 'text-[clamp(0.6875rem,0.52rem+0.55vw,1.25rem)]' : 'text-xl'} font-bold text-[#332C29] tracking-wide leading-tight truncate`}>
              {t.calculationsTitle}
            </h2>
            <p className={`${isRokSederhana ? 'hidden sm:block' : ''} text-xs text-[#6B5E57] truncate`}>
              {t.calculationsSubtitle}
            </p>
          </div>
        </div>

        {/* Educational Formulas Link Button */}
        <button
          type="button"
          onClick={() => {
            const elem = document.getElementById('section-penjelasan-rumus');
            if (elem) {
              elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
          className={`${isRokSederhana ? 'text-[clamp(0.5625rem,0.46rem+0.32vw,0.75rem)] px-[clamp(0.25rem,0.18rem+0.35vw,0.75rem)] py-[clamp(0.18rem,0.12rem+0.25vw,0.375rem)]' : 'text-xs px-3 py-1.5'} font-semibold rounded-lg border text-[#8F2635] bg-white hover:bg-[#E8DED8] border-[#DFD4CD] transition-all flex items-center gap-1 sm:gap-1.5 cursor-pointer shadow-2xs shrink-0`}
          title={t.formulaToggleTitle}
        >
          <BookOpen className={`shrink-0 ${isRokSederhana ? 'size-[clamp(0.5625rem,0.46rem+0.3vw,0.875rem)]' : 'size-3 sm:size-3.5'}`} />
          <span className={isRokSederhana ? 'hidden sm:inline' : ''}>{t.learnFormulas}</span>
          {isRokSederhana && <span className="sm:hidden">{language === 'en' ? 'Formulas' : 'Rumus'}</span>}
        </button>
      </div>

      {/* Quick Filter Tabs for Multi-piece systems OR Model indicator for Rok Lingkaran / Pola Lengan */}
      {isRokLingkaran ? (
        <div className="px-5 py-2.5 bg-[#F3E7E7]/40 border-b border-[#E8DED8] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${circleSkirtModel === 'full' ? 'bg-[#8F2635]' : 'bg-[#1D4ED8]'}`} />
            <span className="font-serif font-bold text-xs sm:text-sm text-[#332C29]">
              {circleSkirtModel === 'full'
                ? (language === 'en' ? 'Full Circle Skirt (360°)' : 'Rok Lingkaran Penuh (360°)')
                : (language === 'en' ? 'Half Circle Skirt (180°)' : 'Rok Setengah Lingkaran (180°)')}
            </span>
          </div>
          <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${
            circleSkirtModel === 'full'
              ? 'bg-[#F3E7E7] text-[#8F2635] border-[#E8DED8]'
              : 'bg-blue-50 text-[#1D4ED8] border-blue-200'
          }`}>
            {calculations?.length || 2} {t.measuringPointsSuffix}
          </span>
        </div>
      ) : isPolaLengan ? (
        <div className="px-5 py-2.5 bg-[#F3E7E7]/40 border-b border-[#E8DED8] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8F2635]" />
            <span className="font-serif font-bold text-xs sm:text-sm text-[#332C29] uppercase">
              {language === 'en' ? 'Basic Sleeve Pattern' : 'Rumus Pola Lengan'}
            </span>
          </div>
          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded border bg-[#F3E7E7] text-[#8F2635] border-[#E8DED8]">
            {calculations?.length || 5} {t.measuringPointsSuffix}
          </span>
        </div>
      ) : isPolaCelana ? (
        <div className="px-5 py-2.5 bg-[#F3E7E7]/40 border-b border-[#E8DED8] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8F2635]" />
            <span className="font-serif font-bold text-xs sm:text-sm text-[#332C29] uppercase">
              {language === 'en' ? 'Basic Pajama Pants Pattern' : 'Rumus Pola Celana Piyama'}
            </span>
          </div>
          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded border bg-[#F3E7E7] text-[#8F2635] border-[#E8DED8]">
            {calculations?.length || 9} {t.measuringPointsSuffix}
          </span>
        </div>
      ) : (
        <div className={`${isRokSederhana ? 'px-[clamp(0.35rem,0.22rem+0.45vw,1.25rem)] py-[clamp(0.25rem,0.18rem+0.3vw,0.625rem)]' : 'px-5 py-2.5'} bg-[#F3E7E7]/40 border-b border-[#E8DED8] flex items-center justify-between gap-1 sm:gap-2`}>
          <div className="flex items-center gap-1 sm:gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`${isRokSederhana ? 'px-[clamp(0.25rem,0.18rem+0.35vw,0.75rem)] py-[clamp(0.15rem,0.1rem+0.2vw,0.25rem)] text-[clamp(0.5625rem,0.46rem+0.32vw,0.75rem)]' : 'px-3 py-1 text-xs'} rounded-md font-medium transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-[#332C29] text-[#FCFAF7] shadow-xs'
                  : 'text-[#6B5E57] hover:text-[#332C29] hover:bg-[#E8DED8]/60'
              }`}
            >
              {isRokSederhana ? (
                <>
                  <span>{language === 'en' ? 'All' : 'Semua'}</span>
                  <span className="hidden sm:inline"> {language === 'en' ? '(Front & Back)' : '(Depan & Belakang)'}</span>
                </>
              ) : (
                isBackFirst
                  ? (language === 'en' ? 'All (Back & Front)' : 'Semua (Belakang & Depan)')
                  : (language === 'en' ? 'All (Front & Back)' : 'Semua (Depan & Belakang)')
              )}
            </button>

            {isBackFirst ? (
              <>
                <button
                  type="button"
                  onClick={() => setActiveTab('back')}
                  className="px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer"
                >
                  {t.polaBelakang}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('front')}
                  className="px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer"
                >
                  {t.polaDepan}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setActiveTab('front')}
                  className={`${isRokSederhana ? 'px-[clamp(0.25rem,0.18rem+0.35vw,0.75rem)] py-[clamp(0.15rem,0.1rem+0.2vw,0.25rem)] text-[clamp(0.5625rem,0.46rem+0.32vw,0.75rem)]' : 'px-3 py-1 text-xs'} rounded-md font-medium transition-all cursor-pointer ${
                    activeTab === 'front'
                      ? 'bg-[#8F2635] text-white shadow-xs'
                      : 'text-[#6B5E57] hover:text-[#332C29] hover:bg-[#E8DED8]/60'
                  }`}
                >
                  {isRokSederhana ? (
                    <>
                      <span className="hidden sm:inline">{t.polaDepan}</span>
                      <span className="sm:hidden">{language === 'en' ? 'Front' : 'Muka'}</span>
                    </>
                  ) : t.polaDepan}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('back')}
                  className={`${isRokSederhana ? 'px-[clamp(0.25rem,0.18rem+0.35vw,0.75rem)] py-[clamp(0.15rem,0.1rem+0.2vw,0.25rem)] text-[clamp(0.5625rem,0.46rem+0.32vw,0.75rem)]' : 'px-3 py-1 text-xs'} rounded-md font-medium transition-all cursor-pointer ${
                    activeTab === 'back'
                      ? 'bg-[#1D4ED8] text-white shadow-xs'
                      : 'text-[#6B5E57] hover:text-[#1D4ED8] hover:bg-[#EFF6FF]'
                  }`}
                >
                  {isRokSederhana ? (
                    <>
                      <span className="hidden sm:inline">{t.polaBelakang}</span>
                      <span className="sm:hidden">{language === 'en' ? 'Back' : 'Blkg'}</span>
                    </>
                  ) : t.polaBelakang}
                </button>
              </>
            )}
          </div>

          <span className={`text-[11px] font-mono text-[#8C7D76] ${isRokSederhana ? 'hidden md:inline' : 'hidden sm:inline'}`}>
            {hasCalculations ? `${activeTab === 'all' ? frontList.length + backList.length : (activeTab === 'front' ? frontList.length : backList.length)} ${t.measuringPointsSuffix}` : '0 titik'}
          </span>
        </div>
      )}

      {/* Main Calculation Content Area */}
      <div className={`${isRokSederhana ? 'p-[clamp(0.35rem,0.25rem+0.45vw,1.25rem)] space-y-[clamp(0.35rem,0.22rem+0.4vw,1rem)]' : 'p-5 space-y-5'} flex-1 overflow-y-auto`}>
        {!hasCalculations ? (
          <div className="py-12 px-4 text-center space-y-3 bg-white/60 rounded-xl border border-dashed border-[#D5C7BF]">
            <div className="w-10 h-10 mx-auto rounded-full bg-[#E8DED8] text-[#8F2635] flex items-center justify-center">
              <Calculator size={20} />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <p className="font-serif font-bold text-sm text-[#332C29]">
                {language === 'en' ? 'Calculation Formulas Ready for Setup' : 'Formula Perhitungan Siap Dikonfigurasi'}
              </p>
              <p className="text-xs text-[#6B5E57] leading-relaxed">
                {language === 'en' 
                  ? 'The calculation formula set for this drafting system is ready. Formulas will appear here once defined.'
                  : 'Set formula perhitungan untuk sistem konstruksi ini telah disiapkan dan akan tampil di sini setelah rumus dikonfigurasi.'}
              </p>
            </div>
          </div>
        ) : isTieredSkirt ? (
          /* POLA ROK KERUT BERTINGKAT UNIFIED CALCULATION LIST */
          <div className="space-y-2.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#E8DED8]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8F2635]" />
                <h3 className="font-serif font-bold text-sm sm:text-base text-[#332C29] tracking-wide uppercase">
                  {language === 'en' ? 'Tiered Skirt Pattern Calculations' : 'Rumus Pola Rok Kerut Bertingkat'}
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#8C7D76] uppercase">
                {calculations?.length || 6} {t.measuringPointsSuffix}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {(calculations || []).map(renderCalculationRow)}
            </div>
          </div>
        ) : isRokLingkaran ? (
          /* ROK LINGKARAN & SETENGAH LINGKARAN DEDICATED CALCULATION LIST */
          <div className="space-y-2.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#E8DED8]">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${circleSkirtModel === 'full' ? 'bg-[#8F2635]' : 'bg-[#1D4ED8]'}`} />
                <h3 className={`font-serif font-bold text-sm sm:text-base tracking-wide uppercase ${
                  circleSkirtModel === 'full' ? 'text-[#8F2635]' : 'text-[#1D4ED8]'
                }`}>
                  {circleSkirtModel === 'full'
                    ? (language === 'en' ? 'Full Circle Skirt Points' : 'Titik Pola Rok Lingkaran Penuh')
                    : (language === 'en' ? 'Half Circle Skirt Points' : 'Titik Pola Rok Setengah Lingkaran')}
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#8C7D76] uppercase">
                {circleSkirtModel === 'full' ? '360°' : '180°'}
              </span>
            </div>

            {/* Clean Result List: 3 concise lines with aligned equals signs */}
            {(() => {
              const isFull = circleSkirtModel === 'full';
              const lp = measurementsMap.lingkarPinggang ?? 67;
              const pr = measurementsMap.panjangRok ?? 50;

              const rawRadius = isFull ? (lp / 6) - 0.5 : (lp / 3) - 1;
              const formatVal = (val: number | undefined) => {
                if (val === undefined || isNaN(val)) return '0';
                const formatted = formatDraftingPrecision(val);
                return language === 'en' ? formatted : formatted.replace('.', ',');
              };

              const radiusFormatted = `${formatVal(rawRadius)} cm`;
              const lengthFormatted = `${formatVal(pr)} cm`;

              const accentText = isFull ? 'text-[#8F2635]' : 'text-[#1D4ED8]';
              const activeClass = isFull
                ? 'bg-[#FDF2F2] border-[#8F2635] shadow-xs ring-1 ring-[#8F2635]/30'
                : 'bg-[#EFF6FF] border-[#2563EB] shadow-xs ring-1 ring-[#2563EB]/30';
              const hoverClass = isFull
                ? 'hover:bg-[#FDF4F4] hover:border-[#D5C7BF]'
                : 'hover:bg-[#F0F5FF] hover:border-[#93C5FD]';

              const circleSkirtRows = [
                {
                  id: isFull ? 'full-radius-r' : 'half-radius-r',
                  label: 'RADIUS (R)',
                  value: radiusFormatted,
                },
                {
                  id: isFull ? 'full-radius-points' : 'half-radius-points',
                  label: isFull ? 'A–B = A–C = A–F = R' : 'A–B = A–D = A–C = R',
                  value: radiusFormatted,
                },
                {
                  id: isFull ? 'full-panjang-rok' : 'half-panjang-rok',
                  label: isFull ? 'B–D = F–G = C–E' : "B–B' = C–C' = D–D'",
                  value: lengthFormatted,
                },
              ];

              return (
                <div className="grid grid-cols-1 gap-2">
                  {circleSkirtRows.map((row) => {
                    const isActive = activeCalculationId === row.id;
                    return (
                      <div
                        key={row.id}
                        id={`calc-row-${row.id}`}
                        onClick={() => onSelectCalculation(isActive ? null : row.id)}
                        className={`px-3.5 py-2.5 sm:px-4 sm:py-2.5 rounded-xl border transition-all duration-150 cursor-pointer ${
                          isActive
                            ? activeClass
                            : `bg-white ${hoverClass} border-[#E8DED8]`
                        }`}
                      >
                        <div className="flex items-center">
                          <span className="font-mono font-bold text-xs sm:text-sm text-[#332C29] w-[160px] sm:w-[190px] shrink-0 whitespace-nowrap">
                            {row.label}
                          </span>
                          <span className="font-mono text-[#8C7D76] font-medium text-xs sm:text-sm select-none shrink-0 mr-2.5 sm:mr-3">
                            =
                          </span>
                          <span className={`font-mono font-bold text-xs sm:text-sm tabular-nums whitespace-nowrap ${accentText}`}>
                            {row.value}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        ) : isPolaLengan ? (
          /* POLA DASAR LENGAN UNIFIED CALCULATION LIST */
          <div className="space-y-2.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#E8DED8]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8F2635]" />
                <h3 className="font-serif font-bold text-sm sm:text-base text-[#332C29] tracking-wide uppercase">
                  {language === 'en' ? 'Basic Sleeve Pattern' : 'Rumus Pola Lengan'}
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#8C7D76] uppercase">
                {calculations?.length || 5} {t.measuringPointsSuffix}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {(calculations || []).map(renderCalculationRow)}
            </div>
          </div>
        ) : isPolaCelana ? (
          /* POLA DASAR CELANA PIYAMA UNIFIED CALCULATION LIST */
          <div className="space-y-2.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#E8DED8]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8F2635]" />
                <h3 className="font-serif font-bold text-sm sm:text-base text-[#332C29] tracking-wide uppercase">
                  {language === 'en' ? 'Basic Pajama Pants Pattern' : 'Rumus Pola Celana Piyama'}
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#8C7D76] uppercase">
                {calculations?.length || 9} {t.measuringPointsSuffix}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {(calculations || []).map(renderCalculationRow)}
            </div>
          </div>
        ) : isRokPiasGodet ? (
          /* POLA ROK PIAS & GODET DEDICATED CALCULATION LIST */
          <div className="space-y-4">
            {/* 1. POLA ROK PIAS (1 HELAI PIAS) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-[#E8DED8]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8F2635]" />
                  <h3 className="font-serif font-bold text-sm sm:text-base text-[#332C29] tracking-wide uppercase">
                    {language === 'en' ? 'Gored Skirt Pattern (1 Panel)' : 'Pola Rok Pias (1 Helai Pias)'}
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-[#8C7D76] uppercase">
                  {piasList.length} {t.measuringPointsSuffix}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-1.5">
                {piasList.map(renderCalculationRow)}
              </div>
            </div>

            {/* 2. POLA GODET */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between pb-1.5 border-b border-[#E8DED8]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1D4ED8]" />
                  <h3 className="font-serif font-bold text-sm sm:text-base text-[#1E3A8A] tracking-wide uppercase">
                    {language === 'en' ? 'Godet Insert Pattern' : 'Pola Sisipan Godet'}
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-[#8C7D76] uppercase">
                  {godetList.length} {t.measuringPointsSuffix}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-1.5">
                {godetList.map(renderCalculationRow)}
              </div>
            </div>
          </div>
        ) : isRokLipitSearah ? (
          /* POLA ROK LIPIT SEARAH DEDICATED CALCULATION LIST */
          <div className="space-y-3.5">
            {/* 1. Header with Live Badge */}
            <div className="flex items-center justify-between pb-1.5 border-b border-[#E8DED8]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8F2635]" />
                <h3 className="font-serif font-bold text-sm sm:text-base text-[#332C29] tracking-wide uppercase">
                  {language === 'en' ? 'One-Way Pleated Skirt Construction' : 'Konstruksi Pola Rok Lipit Searah'}
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#8F2635] bg-[#F3E7E7] px-2.5 py-0.5 rounded-full border border-[#E8DED8]">
                4 {t.measuringPointsSuffix}
              </span>
            </div>

            {/* 2. Key Highlights for One-Way Pleated Skirt */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Jarak Lipit Card */}
              {(() => {
                const jarakItem = (calculations || []).find((c) => c.id === 'lipit-jarak-summary');
                const rawJarak = jarakItem?.calculate ? jarakItem.calculate(measurementsMap) : (measurementsMap.lingkarPinggang ?? 67) / (measurementsMap.jumlahLipit ?? 12);
                const formattedJarak = formatDraftingPrecision(rawJarak);
                const displayJarak = language === 'en' ? formattedJarak : formattedJarak.replace('.', ',');
                return (
                  <div className="bg-[#FAF6F3] rounded-xl p-3 border border-[#E8DED8] space-y-1">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#8F2635]">
                      {language === 'en' ? 'Pleat Width' : 'Jarak Lipit'}
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="font-mono font-bold text-base sm:text-lg text-[#332C29]">
                        {displayJarak}
                      </span>
                      <span className="text-xs text-[#6B5E57] font-medium">cm</span>
                    </div>
                    <p className="text-[10px] text-[#8C7D76] leading-tight">
                      {language === 'en' ? 'Waist ÷ Pleat Count' : 'Lingkar Pinggang ÷ Jumlah Lipit'}
                    </p>
                  </div>
                );
              })()}

              {/* Dalam Lipit Card */}
              {(() => {
                const dalamItem = (calculations || []).find((c) => c.id === 'lipit-dalam-summary');
                const rawDalam = dalamItem?.calculate ? dalamItem.calculate(measurementsMap) : Math.max(0, ((measurementsMap.lebarKainTotal ?? 150) - 6 - (measurementsMap.lingkarPinggang ?? 67)) / (measurementsMap.jumlahLipit ?? 12));
                const formattedDalam = formatDraftingPrecision(rawDalam);
                const displayDalam = language === 'en' ? formattedDalam : formattedDalam.replace('.', ',');
                return (
                  <div className="bg-[#FAF6F3] rounded-xl p-3 border border-[#E8DED8] space-y-1">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#8F2635]">
                      {language === 'en' ? 'Pleat Depth' : 'Dalam Lipit'}
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="font-mono font-bold text-base sm:text-lg text-[#8F2635]">
                        {displayDalam}
                      </span>
                      <span className="text-xs text-[#6B5E57] font-medium">cm</span>
                    </div>
                    <p className="text-[10px] text-[#8C7D76] leading-tight">
                      {language === 'en' ? '(Fabric − 6 − Waist) ÷ Count' : '(Lebar Kain − 6 − LP) ÷ Lipit'}
                    </p>
                  </div>
                );
              })()}
            </div>

            {/* 3. Compact Sequential Point Calculation Rows: A–B, B–C, C–D, D–E followed by 'dan seterusnya' */}
            <div className="grid grid-cols-1 gap-1.5">
              {(calculations || [])
                .filter((item) => ['A – B', 'B – C', 'C – D', 'D – E'].includes(item.points))
                .map(renderCalculationRow)}
              <div className="py-2.5 px-3 text-center text-xs font-serif italic text-[#6B5E57] bg-[#FCFAF7] rounded-xl border border-dashed border-[#E8DED8]">
                dan seterusnya
              </div>
            </div>
          </div>
        ) : isKulot ? (
          /* POLA KULOT DEDICATED CALCULATION LIST */
          <div className="space-y-4">
            {/* 1. Metode A-C Selector Inside Calculation Section */}
            {onChangeKulotAcMethod && (
              <div className="bg-white rounded-xl p-3 border border-[#E8DED8] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#332C29] uppercase tracking-wide">
                    {language === 'en' ? 'A–C Method (Crotch Depth):' : 'Metode A–C (Kedalaman Pesak):'}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#F3E7E7] text-[#8F2635]">
                    {kulotAcMethod === 'tinggi-duduk' ? 'Tinggi Duduk' : 'Tinggi Panggul + 7–8 cm'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onChangeKulotAcMethod('tinggi-duduk')}
                    className={`py-2 px-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer text-center ${
                      kulotAcMethod === 'tinggi-duduk'
                        ? 'bg-[#8F2635] text-white shadow-xs font-bold'
                        : 'bg-[#FCFAF7] text-[#524640] border border-[#E8DED8] hover:bg-[#F3E7E7]'
                    }`}
                  >
                    Tinggi Duduk
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeKulotAcMethod('tinggi-panggul-range')}
                    className={`py-2 px-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer text-center ${
                      kulotAcMethod === 'tinggi-panggul-range'
                        ? 'bg-[#8F2635] text-white shadow-xs font-bold'
                        : 'bg-[#FCFAF7] text-[#524640] border border-[#E8DED8] hover:bg-[#F3E7E7]'
                    }`}
                  >
                    Tinggi Panggul + 7–8 cm
                  </button>
                </div>
                <p className="text-[10px] text-[#8C7D76] italic">
                  {kulotAcMethod === 'tinggi-duduk'
                    ? 'A–C dihitung langsung dari ukuran Tinggi Duduk.'
                    : 'A–C dihitung dengan rentang kelonggaran: tentukan sendiri angka di antara range tersebut sesuai kebutuhan.'}
                </p>
              </div>
            )}

            {/* 2. Key Proportion Highlight Cards */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-[#FAF6F3] rounded-xl p-3 border border-[#E8DED8] space-y-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#8F2635]">
                  {language === 'en' ? 'Front C–C\' Crotch' : 'Pesak Depan C–C\''}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-mono font-bold text-base sm:text-lg text-[#8F2635]">
                    {formatDraftingPrecision(((measurementsMap.lingkarPanggul ?? 84) / 10) - 2).replace('.', ',')}
                  </span>
                  <span className="text-xs text-[#6B5E57] font-medium">cm</span>
                </div>
                <p className="text-[10px] text-[#8C7D76] leading-tight">
                  ¹/₁₀ Lingkar Panggul − 2 cm
                </p>
              </div>

              <div className="bg-[#FAF6F3] rounded-xl p-3 border border-[#E8DED8] space-y-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#1D4ED8]">
                  {language === 'en' ? 'Back C–C\' Crotch' : 'Pesak Belakang C–C\''}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-mono font-bold text-base sm:text-lg text-[#1D4ED8]">
                    {formatDraftingPrecision(((measurementsMap.lingkarPanggul ?? 84) / 10) + 2).replace('.', ',')}
                  </span>
                  <span className="text-xs text-[#6B5E57] font-medium">cm</span>
                </div>
                <p className="text-[10px] text-[#8C7D76] leading-tight">
                  ¹/₁₀ Lingkar Panggul + 2 cm (+4 cm vs Depan)
                </p>
              </div>
            </div>

            {/* 3. POLA DEPAN & POLA BELAKANG ROWS */}
            {/* POLA DEPAN SECTION 🔴 */}
            {(activeTab === 'all' || activeTab === 'front') && frontList.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between pb-1 border-b border-[#E8DED8]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#8F2635]" />
                    <h3 className="font-serif font-bold text-sm sm:text-base text-[#332C29] tracking-wide uppercase">
                      {t.polaDepan}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-[#8C7D76] uppercase">
                    {language === 'en' ? 'Front Pattern Points & Golbi' : 'Titik Pola Depan & Golbi'}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-1.5">
                  {frontList.map(renderCalculationRow)}
                </div>
              </div>
            )}

            {/* POLA BELAKANG SECTION 🔵 */}
            {(activeTab === 'all' || activeTab === 'back') && backList.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between pb-1 border-b border-[#E8DED8]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1D4ED8]" />
                    <h3 className="font-serif font-bold text-sm sm:text-base text-[#1E3A8A] tracking-wide uppercase">
                      {t.polaBelakang}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-[#8C7D76] uppercase">
                    {language === 'en' ? 'Back Pattern Points' : 'Titik Pola Belakang'}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-1.5">
                  {backList.map(renderCalculationRow)}
                </div>
              </div>
            )}
          </div>
        ) : isBackFirst ? (
          <>
            {/* 1. POLA BELAKANG SECTION FIRST 🔵 */}
            {(activeTab === 'all' || activeTab === 'back') && backList.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between pb-1 border-b border-[#E8DED8]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1D4ED8]" />
                    <h3 className="font-serif font-bold text-sm sm:text-base text-[#1E3A8A] tracking-wide uppercase">
                      {t.polaBelakang}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-[#8C7D76] uppercase">
                    {language === 'en' ? 'Back Pattern Points' : 'Titik Pola Belakang'}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-1.5">
                  {backList.map(renderCalculationRow)}
                </div>
              </div>
            )}

            {/* 2. POLA DEPAN SECTION SECOND 🔴 */}
            {(activeTab === 'all' || activeTab === 'front') && frontList.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between pb-1 border-b border-[#E8DED8]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#8F2635]" />
                    <h3 className="font-serif font-bold text-sm sm:text-base text-[#332C29] tracking-wide uppercase">
                      {t.polaDepan}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-[#8C7D76] uppercase">
                    {language === 'en' ? 'Front Pattern Points & Side Dart' : 'Titik Pola Muka & Kupnat Sisi'}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-1.5">
                  {frontList.map(renderCalculationRow)}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {/* 1. POLA DEPAN SECTION */}
            {(activeTab === 'all' || activeTab === 'front') && frontList.length > 0 && (
              <div className={isRokSederhana ? 'space-y-[clamp(0.25rem,0.18rem+0.25vw,0.5rem)]' : 'space-y-2'}>
                <div className="flex items-center justify-between pb-1 border-b border-[#E8DED8]">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className={`rounded-full bg-[#8F2635] shrink-0 ${isRokSederhana ? 'size-[clamp(0.375rem,0.3rem+0.2vw,0.625rem)]' : 'w-2 h-2 sm:w-2.5 sm:h-2.5'}`} />
                    <h3 className={`font-serif font-bold ${isRokSederhana ? 'text-[clamp(0.625rem,0.5rem+0.4vw,1rem)]' : 'text-xs sm:text-base'} text-[#332C29] tracking-wide uppercase leading-tight`}>
                      {t.polaDepan}
                    </h3>
                  </div>
                  <span className={`${isRokSederhana ? 'hidden sm:inline text-[clamp(0.5625rem,0.48rem+0.25vw,0.625rem)]' : 'text-[10px]'} font-mono text-[#8C7D76] uppercase`}>
                    {language === 'en' ? 'Front Pattern Points' : 'Titik Pola Muka'}
                  </span>
                </div>

                <div className={`grid grid-cols-1 ${isRokSederhana ? 'gap-[clamp(0.2rem,0.14rem+0.25vw,0.375rem)]' : 'gap-1.5'}`}>
                  {frontList.map(renderCalculationRow)}
                </div>
              </div>
            )}

            {/* 2. POLA BELAKANG SECTION */}
            {(activeTab === 'all' || activeTab === 'back') && backList.length > 0 && (
              <div className={isRokSederhana ? 'space-y-[clamp(0.25rem,0.18rem+0.25vw,0.5rem)] pt-0.5' : 'space-y-2 pt-1'}>
                <div className="flex items-center justify-between pb-1 border-b border-[#E8DED8]">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className={`rounded-full bg-[#1D4ED8] shrink-0 ${isRokSederhana ? 'size-[clamp(0.375rem,0.3rem+0.2vw,0.625rem)]' : 'w-2 h-2 sm:w-2.5 sm:h-2.5'}`} />
                    <h3 className={`font-serif font-bold ${isRokSederhana ? 'text-[clamp(0.625rem,0.5rem+0.4vw,1rem)]' : 'text-xs sm:text-base'} text-[#1E3A8A] tracking-wide uppercase leading-tight`}>
                      {t.polaBelakang}
                    </h3>
                  </div>
                  <span className={`${isRokSederhana ? 'hidden sm:inline text-[clamp(0.5625rem,0.48rem+0.25vw,0.625rem)]' : 'text-[10px]'} font-mono text-[#8C7D76] uppercase`}>
                    {language === 'en' ? 'Back Pattern Points' : 'Titik Pola Belakang'}
                  </span>
                </div>

                <div className={`grid grid-cols-1 ${isRokSederhana ? 'gap-[clamp(0.2rem,0.14rem+0.25vw,0.375rem)]' : 'gap-1.5'}`}>
                  {backList.map(renderCalculationRow)}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer Info */}
      <div className={`${isRokSederhana ? 'px-[clamp(0.35rem,0.22rem+0.45vw,1.25rem)] py-[clamp(0.25rem,0.18rem+0.3vw,0.75rem)] text-[clamp(0.5625rem,0.46rem+0.32vw,0.75rem)]' : 'px-5 py-3 text-xs'} bg-[#E8DED8]/40 border-t border-[#E8DED8] flex items-center justify-between text-[#6B5E57]`}>
        <span className="flex items-center gap-1.5">
          <Info className={`text-[#8C7D76] shrink-0 ${isRokSederhana ? 'size-[clamp(0.625rem,0.5rem+0.3vw,0.8125rem)]' : 'size-[13px]'}`} />
          <span className="leading-tight">{t.calculationsHint}</span>
        </span>
      </div>
    </div>
  );
};
