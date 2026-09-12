import React from 'react';
import { 
  ClientInfo, 
  BodyMeasurement, 
  PatternModuleInfo, 
  WorksheetPrintOptions, 
  DEFAULT_PRINT_OPTIONS,
  PatternCalculationItem
} from '../types/pattern';
import { 
  formatDraftingPrecision,
  FRONT_PATTERN_CALCULATIONS,
  BACK_PATTERN_CALCULATIONS
} from '../data/patternData';
import { DEFAULT_CALCULATOR_IMAGES } from '../services/firebase';
import { formatLocalizedDate } from '../utils/storage';
import { useLanguage } from '../i18n';
import { FormattedPatternInstructions } from './FormattedPatternInstructions';
import { CircleSkirtFormulaDisplay } from './CircleSkirtFormulaDisplay';

interface PrintWorksheetProps {
  moduleInfo: PatternModuleInfo;
  clientInfo: ClientInfo;
  measurements: BodyMeasurement[];
  calculations?: PatternCalculationItem[];
  measurementsMap: Record<string, number>;
  patternImage?: string | null;
  dressmakingBackPatternImage?: string | null;
  dressmakingFrontPatternImage?: string | null;
  dressmakingSideDartImage?: string | null;
  patternDescription?: string | null;
  frontPatternDescription?: string | null;
  backPatternDescription?: string | null;
  printOptions?: WorksheetPrintOptions;
  isPreview?: boolean;
  circleSkirtModel?: 'full' | 'half';
  panelCount?: number;
}

interface WorksheetFormulaRowProps {
  point: string;
  formulaDesc: string;
  substitution?: string;
  finalResult: string;
  isFrontSide?: boolean;
}

const WorksheetFormulaRow: React.FC<WorksheetFormulaRowProps> = ({
  point,
  formulaDesc,
  substitution,
  finalResult,
  isFrontSide = true,
}) => {
  const cleanSub = (substitution ?? '').replace(/cm/gi, '').trim();
  const cleanRes = (finalResult ?? '').replace(/cm/gi, '').trim();
  const hasArithmetic = /[+\-*\/÷×|]/.test(cleanSub) && cleanSub !== cleanRes;
  const showIntermediateSubstitution = Boolean(substitution && hasArithmetic);

  return (
    <div className="py-1 border-b border-neutral-200/70 last:border-0 flex items-start gap-2 print-break-inside-avoid">
      {/* COLUMN 1: Point Label (Fixed Width for consistent alignment) */}
      <div className="w-[66px] sm:w-[72px] shrink-0 pt-0.5">
        <span
          className={`font-mono font-bold text-[11px] tracking-tight whitespace-nowrap ${
            isFrontSide ? 'text-[#8F2635]' : 'text-[#332C29]'
          }`}
          style={{ whiteSpace: 'nowrap' }}
        >
          {point}
        </span>
      </div>

      {/* COLUMN 2: Formula Description & Calculation */}
      <div className="flex-1 min-w-0">
        {showIntermediateSubstitution ? (
          // Two-line layout for mathematical derivation
          <>
            <div className="text-[11px] text-neutral-800 font-medium leading-tight">
              {formulaDesc}
            </div>
            <div className="text-[10.5px] font-mono text-neutral-700 mt-0.5 leading-tight flex items-baseline gap-1 flex-wrap">
              <span>= {substitution} =</span>
              <span
                className={`font-bold ${
                  isFrontSide ? 'text-[#8F2635]' : 'text-[#332C29]'
                }`}
              >
                {finalResult}
              </span>
            </div>
          </>
        ) : (
          // Single-line compact layout for constants / direct measurements
          <div className="text-[11px] leading-tight flex items-baseline justify-between gap-1 flex-wrap pt-0.5">
            <span className="text-neutral-700">
              {formulaDesc}
            </span>
            <span className="font-mono text-[10.5px] text-neutral-700 whitespace-nowrap">
              = <strong className={`font-bold ${isFrontSide ? 'text-[#8F2635]' : 'text-[#332C29]'}`}>{finalResult}</strong>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export const PrintWorksheet: React.FC<PrintWorksheetProps> = ({
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
  printOptions = DEFAULT_PRINT_OPTIONS,
  isPreview = false,
  circleSkirtModel = 'full',
}) => {
  const { t, language } = useLanguage();

  const moduleId = moduleInfo?.id || 'basic-skirt';
  const isRokLingkaran = moduleId === 'rok-lingkaran' || moduleId === 'lingkaran' || moduleId === 'circle-skirt' || Boolean(moduleInfo?.id?.includes('lingkaran')) || Boolean(moduleInfo?.moduleTitle?.includes('Lingkaran'));
  const localizedModule = t.modules?.[moduleId];
  const displayStudioName = t.studioName || moduleInfo?.studioName || 'LA MODA LEARNING STUDIO';
  const displayAppTitle = t.patternCalculator || t.appTitle || moduleInfo?.appTitle || 'Kalkulator Pola';
  
  const displayModuleTitle = isRokLingkaran
    ? (circleSkirtModel === 'full'
        ? (language === 'en' ? 'Full Circle Skirt Pattern Calculator (360°)' : 'Kalkulator Pola Dasar Rok Lingkaran Penuh (360°)')
        : (language === 'en' ? 'Half Circle Skirt Pattern Calculator (180°)' : 'Kalkulator Pola Dasar Rok Setengah Lingkaran (180°)'))
    : (localizedModule?.title || moduleInfo?.moduleTitle || t.moduleTitle || 'Kalkulator Pola Dasar Rok');

  const displaySystemSubtitle = isRokLingkaran
    ? (circleSkirtModel === 'full'
        ? (language === 'en' ? 'Full Circle Skirt Model (360°)' : 'Model Rok Lingkaran Penuh (360°)')
        : (language === 'en' ? 'Half Circle Skirt Model (180°)' : 'Model Rok Setengah Lingkaran (180°)'))
    : (localizedModule?.subtitle || moduleInfo?.systemSubtitle || t.systemSubtitle || 'Sistem Indonesia');

  // Effective instruction strings
  const effectiveFrontDesc = frontPatternDescription?.trim() || '';
  const effectiveBackDesc = backPatternDescription?.trim() || '';
  const hasSplitDesc = Boolean(effectiveFrontDesc || effectiveBackDesc);

  // Master Pattern Image resolution fallback
  const resolvedPatternImage = isRokLingkaran
    ? (circleSkirtModel === 'full'
        ? (patternImage || dressmakingFrontPatternImage || '')
        : (patternImage || dressmakingBackPatternImage || ''))
    : (patternImage || 
       dressmakingBackPatternImage ||
       dressmakingFrontPatternImage ||
       DEFAULT_CALCULATOR_IMAGES['rok']?.patternImage || 
       '/default-skirt-pattern.png');

  // Measurements values for formula calculations
  const lp = measurementsMap.lingkarPinggang ?? 70;
  const tp = measurementsMap.tinggiPanggul ?? 20;
  const lpg = measurementsMap.lingkarPanggul ?? 92;
  const pr = measurementsMap.panjangRok ?? 60;

  const formatVal = (val: number) => {
    const formatted = formatDraftingPrecision(val);
    return language === 'en' ? formatted : formatted.replace('.', ',');
  };

  // Calculated formula values for detailed breakdown (Sederhana)
  const frontAA = (lp / 4) + 1 + 3;
  const frontCC = (lpg / 4) + 1;
  const frontDD = (lpg / 4) + 1 + 3;
  const frontBE = (lp / 10) + 1;

  const backAA = (lp / 4) - 1 + 3;
  const backCC = (lpg / 4) - 1;
  const backDD = (lpg / 4) - 1 + 3;
  const backBE = (lp / 10) - 1;

  // Skirt formulas
  const dressmakingFrontAA1 = (lp / 4) + 4;
  const dressmakingFrontAD = lp / 10;
  const dressmakingFrontCC1 = (lpg / 4) + 1;

  const indonesiaFrontAE = (lp / 4) + 1;
  const indonesiaFrontCF = (lpg / 4) + 1;
  const indonesiaBackAE = (lp / 4) - 1 + 2;
  const indonesiaBackCF = (lpg / 4) - 1;
  const indonesiaBackBJ = (lp / 10) - 1;

  // Configurable print image display parameters per calculator system
  // For 'rok' (Sistem Sederhana): scale 1.08 & max-height 480px
  // For 'rok-dressmaking': scale 0.92 & max-height 415px
  // For 'rok-indonesia': scale 1.0 & max-height 460px
  // For 'badan' (Sistem Sederhana / Dressmaking / Indonesia): clean natural top-aligned layout without empty top space
  const isBodice = moduleInfo?.id?.includes('bodice') || moduleInfo?.id?.includes('badan') || moduleInfo?.moduleTitle?.includes('Badan');
  const isPolaLengan = moduleInfo?.id?.includes('lengan') || moduleInfo?.id?.includes('sleeve') || moduleInfo?.moduleTitle?.includes('Lengan');
  const isPolaCelana = moduleInfo?.id?.includes('celana') || moduleInfo?.id?.includes('piyama') || moduleInfo?.moduleTitle?.includes('Celana') || moduleInfo?.moduleTitle?.includes('Piyama');
  const isTieredSkirt = moduleInfo?.id?.includes('kerut-bertingkat') || moduleInfo?.id?.includes('tiered-skirt') || moduleInfo?.moduleTitle?.includes('Bertingkat');
  const isRokPiasGodet = moduleId === 'rok-pias-godet' || moduleId === 'pias-godet' || moduleId === 'rok-pias' || moduleId === 'pias' || moduleId === 'godet' || moduleInfo?.id?.includes('pias') || moduleInfo?.moduleTitle?.includes('Pias');
  const isRokLipitSearah = moduleId === 'rok-lipit-searah' || moduleId === 'rok-lipit' || moduleId === 'lipit-searah' || moduleId === 'lipit' || moduleInfo?.id?.includes('lipit') || moduleInfo?.moduleTitle?.includes('Lipit');
  const isKulot = moduleId === 'pola-kulot' || moduleId === 'kulot' || moduleId === 'culottes' || moduleId === 'culotte-pants' || moduleInfo?.id?.includes('kulot') || moduleInfo?.moduleTitle?.includes('Kulot');
  const isBodiceDressmaking = (moduleInfo?.id?.includes('dressmaking') || moduleInfo?.systemSubtitle?.includes('Dressmaking')) && Boolean(isBodice);
  const isDressmaking = (moduleInfo?.id === 'basic-skirt-dressmaking' || moduleInfo?.systemSubtitle?.includes('Dressmaking')) && !isBodice && !isPolaLengan && !isPolaCelana && !isTieredSkirt && !isRokPiasGodet && !isRokLipitSearah && !isKulot;
  const isIndonesia = (moduleInfo?.id === 'basic-skirt-indonesia' || moduleInfo?.systemSubtitle?.includes('Indonesia')) && !isBodice && !isPolaLengan && !isPolaCelana && !isTieredSkirt && !isRokPiasGodet && !isRokLipitSearah && !isKulot;
  const isBodiceSederhana = (moduleInfo?.id === 'basic-bodice-sederhana' || moduleInfo?.id === 'badan-sederhana') && Boolean(isBodice);
  const isBackFirst = Boolean(isBodiceDressmaking);
  const printImageScale = (isBodice || isPolaLengan || isPolaCelana || isTieredSkirt || isRokPiasGodet || isRokLipitSearah || isKulot || isRokLingkaran) ? 1.0 : isDressmaking ? 0.92 : isIndonesia ? 1.0 : 1.08;
  const printImageMaxHeight = (isBodice || isPolaLengan || isPolaCelana || isTieredSkirt || isRokPiasGodet || isRokLipitSearah || isKulot) ? 'max-h-[520px]' : isDressmaking ? 'max-h-[415px]' : isIndonesia ? 'max-h-[460px]' : isRokLingkaran ? 'max-h-[285px]' : 'max-h-[480px]';

  const constantLabel = language === 'en' ? 'Formula constant' : 'Ketetapan rumus';

  const frontCalcs = calculations !== undefined 
    ? calculations.filter((c) => c.patternSide === 'front') 
    : FRONT_PATTERN_CALCULATIONS;
  const backCalcs = calculations !== undefined 
    ? calculations.filter((c) => c.patternSide === 'back') 
    : BACK_PATTERN_CALCULATIONS;

  const piasCalcs = (calculations || []).filter((c) => c.id.startsWith('pias-') || c.patternSide !== 'back');
  const godetCalcs = (calculations || []).filter((c) => c.id.startsWith('godet-') || c.patternSide === 'back');

  // Helper to extract clean point label & calculated practical result for construction items
  const getPracticalCalcData = (item: PatternCalculationItem) => {
    const pointLabel = item.points;
    const val = item.calculate ? item.calculate(measurementsMap) : item.fixedValue ?? 0;
    const formatted = formatDraftingPrecision(val);
    const resultNumber = language === 'en' ? formatted : formatted.replace('.', ',');
    return { pointLabel, resultNumber };
  };

  // Determine section visibility
  const showLeftCol = printOptions.includeMeasurements || printOptions.includeCalculations;
  const showRightCol = printOptions.includePatternImage;

  return (
    <div 
      id={isPreview ? undefined : "printable-worksheet"}
      className={`w-full max-w-[210mm] mx-auto bg-white text-black font-sans text-xs leading-normal ${
        isPreview ? 'p-0' : 'p-3'
      }`}
    >
      {/* 1. HEADER */}
      <header className="border-b-2 border-black pb-2.5 mb-3 flex justify-between items-start print-break-inside-avoid">
        <div>
          <p className="text-[10px] font-bold tracking-[0.25em] text-neutral-600 uppercase font-mono">
            {displayStudioName}
          </p>
          <p className="text-xs font-semibold text-neutral-800 tracking-wider">
            {displayAppTitle}
          </p>
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-black mt-0.5 leading-tight">
            {displayModuleTitle}
          </h1>
          <p className="font-serif italic text-[11px] text-neutral-700 font-semibold mt-0.5">
            {displaySystemSubtitle}
          </p>
        </div>

        <div className="text-right text-xs font-mono">
          <span className="inline-block border border-black px-2.5 py-0.5 text-[11px] font-bold text-black uppercase tracking-wider mb-1">
            {t.worksheetSheetBadge}
          </span>
          <p className="text-[10px] text-neutral-600">{t.scale14Pdf}</p>
          <p className="text-[10px] text-neutral-500 mt-0.5">
            {t.printedDatePrefix} {formatLocalizedDate(clientInfo.date, language)}
          </p>
        </div>
      </header>

      {/* 2. CLIENT INFORMATION (DATA KLIEN) */}
      <section className="mb-3.5 border border-neutral-300 rounded p-2.5 bg-neutral-50/70 print-break-inside-avoid">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-black border-b border-neutral-300 pb-1 mb-1.5 flex items-center justify-between">
          <span>{t.clientDataTitle}</span>
          <span className="text-[9px] font-mono text-neutral-500 font-normal">Identitas Pemilik Pola</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex justify-between sm:justify-start sm:gap-2 items-baseline border-b sm:border-b-0 border-dotted border-neutral-300 pb-0.5 sm:pb-0">
            <span className="text-[10px] font-semibold text-neutral-600 uppercase tracking-wide">
              {t.clientNameLabel}:
            </span>
            <span className="font-bold text-black truncate max-w-[190px]">
              {clientInfo.clientName.trim() || '—'}
            </span>
          </div>
          <div className="flex justify-between sm:justify-start sm:gap-2 items-baseline border-b sm:border-b-0 border-dotted border-neutral-300 pb-0.5 sm:pb-0">
            <span className="text-[10px] font-semibold text-neutral-600 uppercase tracking-wide">
              {t.phoneNumberLabel}:
            </span>
            <span className="font-mono font-medium text-black">
              {clientInfo.phoneNumber.trim() || '—'}
            </span>
          </div>
          <div className="flex justify-between sm:justify-start sm:gap-2 items-baseline">
            <span className="text-[10px] font-semibold text-neutral-600 uppercase tracking-wide">
              {t.dateLabel}:
            </span>
            <span className="font-mono font-medium text-black">
              {formatLocalizedDate(clientInfo.date, language)}
            </span>
          </div>
        </div>
      </section>

      {/* 3. MAIN SECTION: 2-COLUMN CORRESPONDENCE TO STUDENT APP (OR EXPANDED FULL-WIDTH FOR BODICE) */}
      {/* LEFT = MEASUREMENTS + PRACTICAL CALCULATION RESULTS | RIGHT = PATTERN MASTER IMAGE */}
      {(showLeftCol || showRightCol) && (
        <div 
          className={`grid gap-3 mb-3 print-break-inside-avoid ${
            isBodiceSederhana
              ? 'grid-cols-1'
              : (showLeftCol && showRightCol ? 'grid-cols-1 sm:grid-cols-[42%_58%] print:grid-cols-[42%_58%]' : 'grid-cols-1')
          }`}
        >
          {/* ======================================================== */}
          {/* LEFT SIDE: DATA PENGUKURAN + HASIL UKURAN POLA          */}
          {/* ======================================================== */}
          {showLeftCol && (
            <div className="flex flex-col gap-2">
              {/* 3A. DATA PENGUKURAN */}
              {printOptions.includeMeasurements && (
                <section className="border border-neutral-300 rounded p-2.5 bg-white">
                  <h2 className="text-[11px] font-bold uppercase tracking-wider text-black border-b border-neutral-300 pb-1 mb-1.5 flex items-center justify-between">
                    <span>{t.optMeasurements}</span>
                    <span className="text-[9px] font-mono text-neutral-500 font-normal">{t.unitLabel}</span>
                  </h2>
                  
                  <div className={(!isBodiceSederhana && showRightCol) ? 'space-y-1' : 'grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1'}>
                    {measurements.map((m) => {
                      const transM = t.measurements[m.fieldKey as keyof typeof t.measurements];
                      const displayName = transM?.name || m.name;
                      return (
                        <div 
                          key={m.id} 
                          className="flex items-center justify-between text-xs py-1 px-1.5 rounded-sm border-b border-neutral-100 last:border-0 bg-neutral-50/40"
                        >
                          <span className="text-neutral-900 font-medium whitespace-nowrap pr-2 flex items-center">
                            <strong className="font-mono text-black mr-1.5 text-[11px]">{m.number}.</strong>
                            <span>{displayName}</span>
                          </span>
                          <span className="font-mono font-bold text-black whitespace-nowrap shrink-0 text-right">
                            {m.value} <span className="text-[10px] text-neutral-600 font-normal">{m.unit}</span>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* 3B. HASIL UKURAN POLA / PATTERN CONSTRUCTION MEASUREMENTS */}
              {printOptions.includeCalculations && (
                <section className="border border-neutral-300 rounded p-2 bg-white">
                  <h2 className="text-[11px] font-bold uppercase tracking-wider text-black border-b border-neutral-300 pb-1 mb-1.5 flex items-center justify-between">
                    <span>{t.optCalculations}</span>
                    <span className="text-[9px] font-mono text-neutral-500 font-normal">
                      {language === 'en' ? 'Construction Values' : 'Ukuran Konstruksi'}
                    </span>
                  </h2>

                  {isRokLingkaran ? (
                    <div className={`border rounded p-1.5 bg-[#FCFAF7] ${
                      circleSkirtModel === 'full' ? 'border-[#8F2635]/25' : 'border-[#1D4ED8]/25'
                    }`}>
                      <div className={`flex items-center justify-between border-b-2 pb-0.5 mb-1 ${
                        circleSkirtModel === 'full' ? 'border-[#8F2635]' : 'border-[#1D4ED8]'
                      }`}>
                        <span className={`font-serif font-bold text-[10.5px] uppercase tracking-wider ${
                          circleSkirtModel === 'full' ? 'text-[#8F2635]' : 'text-[#1D4ED8]'
                        }`}>
                          {circleSkirtModel === 'full'
                            ? (language === 'en' ? 'Full Circle Skirt (360°)' : 'Rok Lingkaran Penuh (360°)')
                            : (language === 'en' ? 'Half Circle Skirt (180°)' : 'Rok Setengah Lingkaran (180°)')}
                        </span>
                      </div>
                      <div className="space-y-0.5">
                        <div className="grid grid-cols-[135px_16px_1fr] items-baseline text-[10px] py-0.5 border-b border-neutral-200/50">
                          <span
                            className={`font-mono font-bold whitespace-nowrap ${
                              circleSkirtModel === 'full' ? 'text-[#8F2635]' : 'text-[#1D4ED8]'
                            }`}
                            style={{ whiteSpace: 'nowrap' }}
                          >
                            RADIUS (R)
                          </span>
                          <span className="font-mono text-neutral-400 text-center font-normal">
                            =
                          </span>
                          <span className="font-mono text-neutral-800 whitespace-nowrap pl-0.5">
                            <strong className={`font-bold ${
                              circleSkirtModel === 'full' ? 'text-[#8F2635]' : 'text-[#1D4ED8]'
                            }`}>
                              {formatVal(circleSkirtModel === 'full' ? (lp / 6) - 0.5 : (lp / 3) - 1)}
                            </strong>{' '}
                            <span className="text-[8.5px] text-neutral-500 font-normal">cm</span>
                          </span>
                        </div>

                        <div className="grid grid-cols-[135px_16px_1fr] items-baseline text-[10px] py-0.5 border-b border-neutral-200/50">
                          <span
                            className={`font-mono font-bold whitespace-nowrap ${
                              circleSkirtModel === 'full' ? 'text-[#8F2635]' : 'text-[#1D4ED8]'
                            }`}
                            style={{ whiteSpace: 'nowrap' }}
                          >
                            {circleSkirtModel === 'full' ? 'A–B = A–C = A–F' : 'A–B = A–D = A–C'}
                          </span>
                          <span className="font-mono text-neutral-400 text-center font-normal">
                            =
                          </span>
                          <span className="font-mono text-neutral-800 whitespace-nowrap pl-0.5">
                            <strong className={`font-bold ${
                              circleSkirtModel === 'full' ? 'text-[#8F2635]' : 'text-[#1D4ED8]'
                            }`}>
                              {formatVal(circleSkirtModel === 'full' ? (lp / 6) - 0.5 : (lp / 3) - 1)}
                            </strong>{' '}
                            <span className="text-[8.5px] text-neutral-500 font-normal">cm</span>
                          </span>
                        </div>

                        <div className="grid grid-cols-[135px_16px_1fr] items-baseline text-[10px] py-0.5">
                          <span
                            className={`font-mono font-bold whitespace-nowrap ${
                              circleSkirtModel === 'full' ? 'text-[#8F2635]' : 'text-[#1D4ED8]'
                            }`}
                            style={{ whiteSpace: 'nowrap' }}
                          >
                            {circleSkirtModel === 'full' ? 'B–D = F–G = C–E' : "B–B' = C–C' = D–D'"}
                          </span>
                          <span className="font-mono text-neutral-400 text-center font-normal">
                            =
                          </span>
                          <span className="font-mono text-neutral-800 whitespace-nowrap pl-0.5">
                            <strong className={`font-bold ${
                              circleSkirtModel === 'full' ? 'text-[#8F2635]' : 'text-[#1D4ED8]'
                            }`}>
                              {formatVal(pr)}
                            </strong>{' '}
                            <span className="text-[8.5px] text-neutral-500 font-normal">cm</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (isTieredSkirt || isPolaLengan || isPolaCelana) ? (
                    <div className="border border-[#8F2635]/25 rounded p-1.5 bg-[#FCFAF7]">
                      <div className="flex items-center justify-between border-b-2 border-[#8F2635] pb-0.5 mb-1">
                        <span className="font-serif font-bold text-[10.5px] uppercase tracking-wider text-[#8F2635]">
                          {isTieredSkirt
                            ? (language === 'en' ? 'Tiered Skirt Pattern Calculations' : 'Pola Rok Kerut Bertingkat')
                            : isPolaLengan
                            ? (language === 'en' ? 'Basic Sleeve Pattern' : 'Pola Dasar Lengan')
                            : (language === 'en' ? 'Basic Pajama Pants Pattern' : 'Pola Dasar Celana Piyama')}
                        </span>
                      </div>
                      <div className="space-y-0.5">
                        {(calculations || []).map((item) => {
                          const { pointLabel, resultNumber } = getPracticalCalcData(item);
                          return (
                            <div 
                              key={item.id} 
                              className="grid grid-cols-[100px_8px_1fr] items-baseline text-[10px] py-0.5 border-b border-neutral-200/50 last:border-0"
                            >
                              <span className="font-mono font-bold text-[#8F2635] truncate">
                                {pointLabel}
                              </span>
                              <span className="font-mono text-neutral-400 text-center font-normal">
                                =
                              </span>
                              <span className="font-mono text-neutral-800 whitespace-nowrap pl-0.5">
                                <strong className="font-bold text-[#8F2635]">{resultNumber}</strong>{' '}
                                <span className="text-[8.5px] text-neutral-500 font-normal">cm</span>
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : isRokPiasGodet ? (
                    <div className="grid grid-cols-2 gap-1.5">
                      {/* Box 1: Pola Rok Pias */}
                      <div className="border border-[#8F2635]/25 rounded p-1.5 bg-[#FCFAF7]">
                        <div className="flex items-center justify-between border-b-2 border-[#8F2635] pb-0.5 mb-1">
                          <span className="font-serif font-bold text-[10.5px] uppercase tracking-wider text-[#8F2635]">
                            {language === 'en' ? 'Gored Skirt Pattern' : 'Pola Rok Pias'}
                          </span>
                        </div>
                        <div className="space-y-0.5">
                          {piasCalcs.map((item) => {
                            const { pointLabel, resultNumber } = getPracticalCalcData(item);
                            return (
                              <div 
                                key={item.id} 
                                className="grid grid-cols-[70px_8px_1fr] items-baseline text-[10px] py-0.5 border-b border-neutral-200/50 last:border-0"
                              >
                                <span className="font-mono font-bold text-[#8F2635] truncate">
                                  {pointLabel}
                                </span>
                                <span className="font-mono text-neutral-400 text-center font-normal">
                                  =
                                </span>
                                <span className="font-mono text-neutral-800 whitespace-nowrap pl-0.5">
                                  <strong className="font-bold text-[#8F2635]">{resultNumber}</strong>{' '}
                                  <span className="text-[8.5px] text-neutral-500 font-normal">cm</span>
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Box 2: Pola Godet */}
                      <div className="border border-[#1D4ED8]/25 rounded p-1.5 bg-[#F0F5FF]">
                        <div className="flex items-center justify-between border-b-2 border-[#1D4ED8] pb-0.5 mb-1">
                          <span className="font-serif font-bold text-[10.5px] uppercase tracking-wider text-[#1E3A8A]">
                            {language === 'en' ? 'Godet Insert' : 'Pola Sisipan Godet'}
                          </span>
                        </div>
                        <div className="space-y-0.5">
                          {godetCalcs.map((item) => {
                            const { pointLabel, resultNumber } = getPracticalCalcData(item);
                            return (
                              <div 
                                key={item.id} 
                                className="grid grid-cols-[70px_8px_1fr] items-baseline text-[10px] py-0.5 border-b border-neutral-200/50 last:border-0"
                              >
                                <span className="font-mono font-bold text-[#1D4ED8] truncate">
                                  {pointLabel}
                                </span>
                                <span className="font-mono text-neutral-400 text-center font-normal">
                                  =
                                </span>
                                <span className="font-mono text-neutral-800 whitespace-nowrap pl-0.5">
                                  <strong className="font-bold text-[#1D4ED8]">{resultNumber}</strong>{' '}
                                  <span className="text-[8.5px] text-neutral-500 font-normal">cm</span>
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : isRokLipitSearah ? (
                    <div className="border border-[#8F2635]/25 rounded p-1.5 bg-[#FCFAF7]">
                      <div className="flex items-center justify-between border-b-2 border-[#8F2635] pb-0.5 mb-1">
                        <span className="font-serif font-bold text-[10.5px] uppercase tracking-wider text-[#8F2635]">
                          {language === 'en' ? 'One-Way Pleated Skirt Pattern' : 'Pola Rok Lipit Searah'}
                        </span>
                        <span className="text-[9px] font-mono text-[#8F2635] font-semibold">
                          4 {t.measuringPointsSuffix}
                        </span>
                      </div>
                      <div className="space-y-0.5">
                        {(calculations || [])
                          .filter((c) => ['A – B', 'B – C', 'C – D', 'D – E'].includes(c.points))
                          .map((item) => {
                            const { pointLabel, resultNumber } = getPracticalCalcData(item);
                            return (
                              <div 
                                key={item.id} 
                                className="grid grid-cols-[70px_8px_1fr] items-baseline text-[10px] py-0.5 border-b border-neutral-200/50 last:border-0"
                              >
                                <span className="font-mono font-bold text-[#8F2635] truncate">
                                  {pointLabel}
                                </span>
                                <span className="font-mono text-neutral-400 text-center font-normal">
                                  =
                                </span>
                                <span className="font-mono text-neutral-800 whitespace-nowrap pl-0.5">
                                  <strong className="font-bold text-[#8F2635]">{resultNumber}</strong>{' '}
                                  <span className="text-[8.5px] text-neutral-500 font-normal">cm</span>
                                </span>
                              </div>
                            );
                          })}
                        <div className="py-1 text-center text-[9.5px] font-serif italic text-neutral-500 border-t border-dashed border-neutral-300">
                          dan seterusnya
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-1.5">
                      {/* Render according to isBackFirst */}
                      {(() => {
                        const frontBox = (
                          <div key="front-box" className="border border-[#8F2635]/25 rounded p-1.5 bg-[#FCFAF7]">
                            <div className="flex items-center justify-between border-b-2 border-[#8F2635] pb-0.5 mb-1">
                              <span className="font-serif font-bold text-[10.5px] uppercase tracking-wider text-[#8F2635]">
                                {t.polaDepan}
                              </span>
                            </div>
                            <div className="space-y-0.5">
                              {frontCalcs.length > 0 ? (
                                frontCalcs.map((item) => {
                                  const { pointLabel, resultNumber } = getPracticalCalcData(item);
                                  return (
                                    <div 
                                      key={item.id} 
                                      className="grid grid-cols-[52px_8px_1fr] items-baseline text-[10px] py-0.5 border-b border-neutral-200/50 last:border-0"
                                    >
                                      <span className="font-mono font-bold text-[#8F2635] truncate">
                                        {pointLabel}
                                      </span>
                                      <span className="font-mono text-neutral-400 text-center font-normal">
                                        =
                                      </span>
                                      <span className="font-mono text-neutral-800 whitespace-nowrap pl-0.5">
                                        <strong className="font-bold text-[#8F2635]">{resultNumber}</strong>{' '}
                                        <span className="text-[8.5px] text-neutral-500 font-normal">cm</span>
                                      </span>
                                    </div>
                                  );
                                })
                              ) : (
                                <div className="text-[9.5px] text-neutral-500 italic py-2 text-center">
                                  Formula siap dikonfigurasi
                                </div>
                              )}
                            </div>
                          </div>
                        );

                        const backBox = (
                          <div key="back-box" className="border border-[#1D4ED8]/25 rounded p-1.5 bg-[#FCFAF7]">
                            <div className="flex items-center justify-between border-b-2 border-[#1D4ED8] pb-0.5 mb-1">
                              <span className="font-serif font-bold text-[10.5px] uppercase tracking-wider text-[#1E3A8A]">
                                {t.polaBelakang}
                              </span>
                            </div>
                            <div className="space-y-0.5">
                              {backCalcs.length > 0 ? (
                                backCalcs.map((item) => {
                                  const { pointLabel, resultNumber } = getPracticalCalcData(item);
                                  return (
                                    <div 
                                      key={item.id} 
                                      className="grid grid-cols-[52px_8px_1fr] items-baseline text-[10px] py-0.5 border-b border-neutral-200/50 last:border-0"
                                    >
                                      <span className="font-mono font-bold text-[#1D4ED8] truncate">
                                        {pointLabel}
                                      </span>
                                      <span className="font-mono text-neutral-400 text-center font-normal">
                                        =
                                      </span>
                                      <span className="font-mono text-neutral-800 whitespace-nowrap pl-0.5">
                                        <strong className="font-bold text-[#1D4ED8]">{resultNumber}</strong>{' '}
                                        <span className="text-[8.5px] text-neutral-500 font-normal">cm</span>
                                      </span>
                                    </div>
                                  );
                                })
                              ) : (
                                <div className="text-[9.5px] text-neutral-500 italic py-2 text-center">
                                  Formula siap dikonfigurasi
                                </div>
                              )}
                            </div>
                          </div>
                        );

                        return isBackFirst ? (
                          <>
                            {backBox}
                            {frontBox}
                          </>
                        ) : (
                          <>
                            {frontBox}
                            {backBox}
                          </>
                        );
                      })()}
                    </div>
                  )}
                </section>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* RIGHT SIDE: PATTERN MASTER IMAGE (ENLARGED)             */}
          {/* ======================================================== */}
          {showRightCol && (
            <div className={`flex flex-col ${isRokLingkaran ? 'h-full' : ''}`}>
              <section className={`border border-neutral-300 rounded p-1.5 bg-white flex flex-col ${isRokLingkaran ? 'h-full' : ''}`}>
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-black border-b border-neutral-300 pb-1 mb-1 flex items-center justify-between shrink-0">
                  <span>{t.masterPatternTitle}</span>
                  <span className="text-[9px] font-mono text-neutral-500 font-normal">
                    {language === 'en' ? 'Blueprint 1:4' : 'Blueprint Skala 1:4'}
                  </span>
                </h2>

                <div 
                  className={`w-full flex flex-col items-center ${
                    isRokLingkaran
                      ? 'justify-between h-[300px] sm:h-[320px] print:h-[285px] p-2'
                      : 'justify-start p-1.5'
                  } bg-neutral-50/30 rounded border border-neutral-200 overflow-hidden`}
                >
                  <div 
                    className={`w-full flex-1 flex items-center justify-center overflow-hidden ${
                      isRokLingkaran ? 'p-1 min-h-0' : 'py-0.5'
                    }`}
                  >
                    {resolvedPatternImage ? (
                      <img
                        src={resolvedPatternImage}
                        alt="Pola Master Blueprint"
                        className={
                          isRokLingkaran
                            ? "max-w-full max-h-full w-auto h-auto object-contain mx-auto block"
                            : `w-full h-auto ${printImageMaxHeight} object-contain mx-auto transition-transform origin-top`
                        }
                        style={
                          isRokLingkaran
                            ? {
                                maxWidth: '100%',
                                maxHeight: '100%',
                                width: 'auto',
                                height: 'auto',
                                objectFit: 'contain',
                              }
                            : { transform: `scale(${printImageScale})` }
                        }
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center p-4 text-neutral-400">
                        <span className="text-xs font-medium text-neutral-500">
                          {language === 'en' ? 'Pattern Blueprint' : 'Ilustrasi Pola Master'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="py-0.5 text-center z-10 bg-white/95 w-full border-t border-neutral-200/60 mt-1 shrink-0">
                    <span className="text-[8.5px] font-mono text-neutral-600 bg-neutral-200/70 px-2 py-0.5 rounded">
                      {isRokLingkaran
                        ? (circleSkirtModel === 'full'
                            ? (language === 'en' ? 'Blueprint Master Pattern • Full Circle Skirt (360°)' : 'Blueprint Master Konstruksi Pola • Rok Lingkaran Penuh (360°)')
                            : (language === 'en' ? 'Blueprint Master Pattern • Half Circle Skirt (180°)' : 'Blueprint Master Konstruksi Pola • Rok Setengah Lingkaran (180°)'))
                        : isTieredSkirt
                        ? (language === 'en' ? 'Blueprint Master Pattern • Tiered Gathered Skirt' : 'Blueprint Master Konstruksi Pola • Pola Rok Kerut Bertingkat')
                        : isKulot
                        ? (language === 'en' ? 'Blueprint Master Pattern • Culottes Pattern' : 'Blueprint Master Konstruksi Pola • Pola Dasar Kulot')
                        : isPolaCelana
                        ? (language === 'en' ? 'Blueprint Master Pattern • Pajama Pants' : 'Blueprint Master Konstruksi Pola • Pola Celana Piyama')
                        : isRokLipitSearah
                        ? (language === 'en' ? 'Blueprint Master Pattern • One-Way Pleated Skirt' : 'Blueprint Master Konstruksi Pola • Pola Rok Lipit Searah')
                        : (language === 'en'
                            ? 'Blueprint Master Pattern • Front (Muka) & Back (Belakang)'
                            : 'Blueprint Master Konstruksi Pola • Pola Depan & Belakang')}
                    </span>
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>
      )}

      {/* 4. CARA PEMBUATAN POLA (PATTERN INSTRUCTIONS: FRONT / BACK / BOTH) */}
      {isTieredSkirt ? (
        (effectiveFrontDesc || patternDescription) && (
          <section key="tiered-skirt-instructions" className="mb-3.5 border border-neutral-300 rounded p-3 bg-neutral-50/60 print-break-inside-avoid">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-black border-b border-neutral-300 pb-1 mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#8F2635]"></span>
                <span>
                  {language === 'en' ? 'Pattern Making Instructions — Tiered Gathered Skirt' : 'Cara Membuat Pola — Rok Kerut Bertingkat'}
                </span>
              </div>
              <span className="text-[9px] font-mono text-[#8F2635] font-semibold">
                {language === 'en' ? 'Skirt Blueprint' : 'Pola Rok'}
              </span>
            </h2>

            <div className="text-xs text-neutral-900 leading-relaxed font-sans pl-1">
              <FormattedPatternInstructions content={effectiveFrontDesc || patternDescription || ''} accentColor="burgundy" />
            </div>
          </section>
        )
      ) : isRokLingkaran ? (
        /* Single Model Instructions for Rok Lingkaran */
        circleSkirtModel === 'full' ? (
          (effectiveFrontDesc || patternDescription) && (
            <section key="full-circle-instructions" className="mb-3.5 border border-neutral-300 rounded p-3 bg-neutral-50/60 print-break-inside-avoid">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-black border-b border-neutral-300 pb-1 mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#8F2635]"></span>
                  <span>
                    {language === 'en' ? 'Pattern Making Instructions — Full Circle Skirt (360°)' : 'Cara Membuat Pola — Rok Lingkaran Penuh (360°)'}
                  </span>
                </div>
                <span className="text-[9px] font-mono text-[#8F2635] font-semibold">
                  360°
                </span>
              </h2>

              <div className="text-xs text-neutral-900 leading-relaxed font-sans pl-1">
                <FormattedPatternInstructions content={effectiveFrontDesc || patternDescription || ''} accentColor="burgundy" />
              </div>
            </section>
          )
        ) : (
          (effectiveBackDesc || patternDescription) && (
            <section key="half-circle-instructions" className="mb-3.5 border border-neutral-300 rounded p-3 bg-neutral-50/60 print-break-inside-avoid">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-black border-b border-neutral-300 pb-1 mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#1D4ED8]"></span>
                  <span>
                    {language === 'en' ? 'Pattern Making Instructions — Half Circle Skirt (180°)' : 'Cara Membuat Pola — Rok Setengah Lingkaran (180°)'}
                  </span>
                </div>
                <span className="text-[9px] font-mono text-[#1D4ED8] font-semibold">
                  180°
                </span>
              </h2>

              <div className="text-xs text-neutral-900 leading-relaxed font-sans pl-1">
                <FormattedPatternInstructions content={effectiveBackDesc || patternDescription || ''} accentColor="blue" />
              </div>
            </section>
          )
        )
      ) : isRokLipitSearah ? (
        (effectiveFrontDesc || patternDescription) && (
          <section key="rok-lipit-searah-instructions" className="mb-3.5 border border-neutral-300 rounded p-3 bg-neutral-50/60 print-break-inside-avoid">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-black border-b border-neutral-300 pb-1 mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#8F2635]"></span>
                <span>
                  {language === 'en' ? 'Pattern Making Instructions — One-Way Pleated Skirt' : 'Cara Membuat Pola — Rok Lipit Searah'}
                </span>
              </div>
              <span className="text-[9px] font-mono text-[#8F2635] font-semibold">
                {language === 'en' ? 'Skirt Blueprint' : 'Pola Rok'}
              </span>
            </h2>

            <div className="text-xs text-neutral-900 leading-relaxed font-sans pl-1">
              <FormattedPatternInstructions content={effectiveFrontDesc || patternDescription || ''} accentColor="burgundy" />
            </div>
          </section>
        )
      ) : (
        <>
          {(() => {
            const frontInstructions = printOptions.includeFrontPatternDescription && effectiveFrontDesc ? (
              <section key="front-instructions" className="mb-3.5 border border-neutral-300 rounded p-3 bg-neutral-50/60 print-break-inside-avoid">
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-black border-b border-neutral-300 pb-1 mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#8F2635]"></span>
                    <span>{t.frontPatternInstructionsTitle}</span>
                  </div>
                  <span className="text-[9px] font-mono text-[#8F2635] font-semibold">
                    {language === 'en' ? 'Front Pattern' : 'Pola Depan'}
                  </span>
                </h2>

                <div className="text-xs text-neutral-900 leading-relaxed font-sans pl-1">
                  <FormattedPatternInstructions content={effectiveFrontDesc} accentColor="burgundy" />
                </div>
              </section>
            ) : null;

            const backInstructions = printOptions.includeBackPatternDescription && effectiveBackDesc ? (
              <section key="back-instructions" className="mb-3.5 border border-neutral-300 rounded p-3 bg-neutral-50/60 print-break-inside-avoid">
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-black border-b border-neutral-300 pb-1 mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#332C29]"></span>
                    <span>{t.backPatternInstructionsTitle}</span>
                  </div>
                  <span className="text-[9px] font-mono text-[#332C29] font-semibold">
                    {language === 'en' ? 'Back Pattern' : 'Pola Belakang'}
                  </span>
                </h2>

                <div className="text-xs text-neutral-900 leading-relaxed font-sans pl-1">
                  <FormattedPatternInstructions content={effectiveBackDesc} accentColor="charcoal" />
                </div>
              </section>
            ) : null;

            return isBackFirst ? (
              <>
                {backInstructions}
                {frontInstructions}
              </>
            ) : (
              <>
                {frontInstructions}
                {backInstructions}
              </>
            );
          })()}

          {/* 4C. Fallback Legacy Pattern Description if split fields aren't present */}
          {!hasSplitDesc && (printOptions.includePatternDescription || printOptions.includeFrontPatternDescription) && patternDescription && patternDescription.trim() && (
            <section className="mb-3.5 border border-neutral-300 rounded p-3 bg-neutral-50/60 print-break-inside-avoid">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-black border-b border-neutral-300 pb-1 mb-2 flex items-center justify-between">
                <span>{t.patternDraftingTitle}</span>
                <span className="text-[9px] font-mono text-neutral-500 font-normal">
                  {language === 'en' ? 'Construction Steps' : 'Langkah Konstruksi'}
                </span>
              </h2>

              <div className="text-xs text-neutral-900 leading-relaxed font-sans pl-1">
                <FormattedPatternInstructions content={patternDescription} accentColor="burgundy" />
              </div>
            </section>
          )}
        </>
      )}

      {/* 5. OPTIONAL SEPARATE SECTION: PERHITUNGAN RUMUS LENGKAP (DEFAULT: OFF) */}
      {printOptions.includeFormulaCalculations && (
        <section className="mb-3.5 border border-neutral-300 rounded p-2.5 sm:p-3 bg-white print-break-inside-avoid">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-black border-b border-neutral-300 pb-1 mb-2.5 flex items-center justify-between">
            <span>{t.formulaCalculationTitle}</span>
            <span className="text-[9px] font-mono text-neutral-500 font-normal">
              {t.formulaCalculationSubtitle}
            </span>
          </h2>

          {isRokLingkaran ? (
            /* Rok Lingkaran single formula section */
            <div className={`border rounded p-2 bg-neutral-50/30 ${
              circleSkirtModel === 'full' ? 'border-[#8F2635]/30' : 'border-[#1D4ED8]/30'
            }`}>
              <div className={`flex items-center justify-between border-b-2 pb-1 mb-1.5 ${
                circleSkirtModel === 'full' ? 'border-[#8F2635]' : 'border-[#1D4ED8]'
              }`}>
                <span className={`font-serif font-bold text-xs uppercase tracking-wider ${
                  circleSkirtModel === 'full' ? 'text-[#8F2635]' : 'text-[#1D4ED8]'
                }`}>
                  {circleSkirtModel === 'full'
                    ? (language === 'en' ? 'Full Circle Skirt Formulas (360°)' : 'Formula Rok Lingkaran Penuh (360°)')
                    : (language === 'en' ? 'Half Circle Skirt Formulas (180°)' : 'Formula Rok Setengah Lingkaran (180°)')}
                </span>
                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${
                  circleSkirtModel === 'full'
                    ? 'text-[#8F2635] bg-[#F3E7E7] border-[#E8DED8]'
                    : 'text-[#1D4ED8] bg-blue-50 border-blue-200'
                }`}>
                  3 {language === 'en' ? 'Formulas' : 'Perhitungan'}
                </span>
              </div>

              <CircleSkirtFormulaDisplay
                model={circleSkirtModel || 'full'}
                language={language}
                waistCircumference={lp}
                skirtLength={pr}
                isPrint={true}
              />
            </div>
          ) : isPolaLengan ? (
            /* Pola Lengan single unified formula section */
            <div className="border border-[#8F2635]/30 rounded p-2 bg-neutral-50/30">
              <div className="flex items-center justify-between border-b-2 border-[#8F2635] pb-1 mb-1">
                <span className="font-serif font-bold text-xs uppercase tracking-wider text-[#8F2635]">
                  {language === 'en' ? 'BASIC SLEEVE PATTERN' : 'RUMUS POLA LENGAN'}
                </span>
                <span className="text-[9px] font-mono font-bold text-[#8F2635] bg-[#F3E7E7] px-2 py-0.5 rounded border border-[#E8DED8]">
                  {frontCalcs.length || 5} {language === 'en' ? 'Formulas' : 'Perhitungan'}
                </span>
              </div>

              <div className="space-y-0.5">
                {frontCalcs.map((item) => {
                  const { pointLabel, resultNumber } = getPracticalCalcData(item);
                  return (
                    <WorksheetFormulaRow
                      key={item.id}
                      point={pointLabel}
                      formulaDesc={item.formulaDisplay || item.formulaExplanation || ''}
                      finalResult={`${resultNumber} cm`}
                      isFrontSide={true}
                    />
                  );
                })}
              </div>
            </div>
          ) : isTieredSkirt ? (
            /* Pola Rok Kerut Bertingkat single unified formula section */
            <div className="border border-[#8F2635]/30 rounded p-2 bg-neutral-50/30">
              <div className="flex items-center justify-between border-b-2 border-[#8F2635] pb-1 mb-1">
                <span className="font-serif font-bold text-xs uppercase tracking-wider text-[#8F2635]">
                  {language === 'en' ? 'TIERED GATHERED SKIRT PATTERN' : 'RUMUS POLA ROK KERUT BERTINGKAT'}
                </span>
                <span className="text-[9px] font-mono font-bold text-[#8F2635] bg-[#F3E7E7] px-2 py-0.5 rounded border border-[#E8DED8]">
                  {calculations?.length || 6} {language === 'en' ? 'Formulas' : 'Perhitungan'}
                </span>
              </div>

              <div className="space-y-0.5">
                {(calculations || []).map((item) => {
                  const { pointLabel, resultNumber } = getPracticalCalcData(item);
                  return (
                    <WorksheetFormulaRow
                      key={item.id}
                      point={pointLabel}
                      formulaDesc={item.formulaDisplay || item.formulaExplanation || ''}
                      finalResult={`${resultNumber} cm`}
                      isFrontSide={true}
                    />
                  );
                })}
              </div>
            </div>
          ) : isRokLipitSearah ? (() => {
            const lkRok = measurementsMap.lebarKainTotal ?? 150;
            const nLipitRok = Math.max(1, Math.round(measurementsMap.jumlahLipit ?? 12));
            const sisaKainRok = lkRok - 6 - lp;
            const dalamLipitRok = sisaKainRok > 0 ? sisaKainRok / nLipitRok : 0;
            const setengahDalamLipitRok = dalamLipitRok / 2;
            const jarakLipitRok = lp / nLipitRok;

            return (
              /* Pola Rok Lipit Searah single unified formula section */
              <div className="border border-[#8F2635]/30 rounded p-2 bg-neutral-50/30">
                <div className="flex items-center justify-between border-b-2 border-[#8F2635] pb-1 mb-1.5">
                  <span className="font-serif font-bold text-xs uppercase tracking-wider text-[#8F2635]">
                    {language === 'en' ? 'ONE-WAY PLEATED SKIRT PATTERN' : 'RUMUS POLA ROK LIPIT SEARAH'}
                  </span>
                  <span className="text-[9px] font-mono font-bold text-[#8F2635] bg-[#F3E7E7] px-2 py-0.5 rounded border border-[#E8DED8]">
                    4 {language === 'en' ? 'Formulas' : 'Perhitungan'}
                  </span>
                </div>

                <div className="space-y-1.5 pt-0.5">
                  {/* 1. A – B */}
                  <div className="border-b border-neutral-200/60 pb-1.5 last:border-0 print-break-inside-avoid">
                    <div className="text-[11px] font-medium text-neutral-800 leading-tight">
                      <span>A – B</span>
                      <span>{language === 'en' ? ' = ½ Pleat Depth = Pleat Depth ÷ 2' : ' = ½ Dalam Lipit = Dalam Lipit ÷ 2'}</span>
                    </div>
                    <div className="text-[10.5px] font-medium leading-tight flex items-baseline mt-0.5">
                      <span className="invisible select-none" aria-hidden="true">A – B</span>
                      <span className="text-neutral-800">&nbsp;=&nbsp;</span>
                      <span className="font-mono font-normal text-neutral-700 flex items-baseline gap-1">
                        <span>{formatVal(dalamLipitRok)} ÷ 2 =</span>
                        <strong className="font-bold text-[#8F2635]">{formatVal(setengahDalamLipitRok)} cm</strong>
                      </span>
                    </div>
                  </div>

                  {/* 2. B – C */}
                  <div className="border-b border-neutral-200/60 pb-1.5 last:border-0 print-break-inside-avoid">
                    <div className="text-[11px] font-medium text-neutral-800 leading-tight">
                      <span>B – C</span>
                      <span>{language === 'en' ? ` = Pleat Distance = Waist ÷ ${nLipitRok}` : ` = Jarak Lipit = Lingkar Pinggang ÷ ${nLipitRok}`}</span>
                    </div>
                    <div className="text-[10.5px] font-medium leading-tight flex items-baseline mt-0.5">
                      <span className="invisible select-none" aria-hidden="true">B – C</span>
                      <span className="text-neutral-800">&nbsp;=&nbsp;</span>
                      <span className="font-mono font-normal text-neutral-700 flex items-baseline gap-1">
                        <span>{formatVal(lp)} ÷ {nLipitRok} =</span>
                        <strong className="font-bold text-[#8F2635]">{formatVal(jarakLipitRok)} cm</strong>
                      </span>
                    </div>
                  </div>

                  {/* 3. C – D */}
                  <div className="border-b border-neutral-200/60 pb-1.5 last:border-0 print-break-inside-avoid">
                    <div className="text-[11px] font-medium text-neutral-800 leading-tight">
                      <span>C – D</span>
                      <span>{language === 'en' ? ` = Pleat Depth = (Total Fabric − 6 − Waist) ÷ ${nLipitRok}` : ` = Dalam Lipit = (Lebar Kain − 6 − LP) ÷ ${nLipitRok}`}</span>
                    </div>
                    <div className="text-[10.5px] font-medium leading-tight flex items-baseline mt-0.5">
                      <span className="invisible select-none" aria-hidden="true">C – D</span>
                      <span className="text-neutral-800">&nbsp;=&nbsp;</span>
                      <span className="font-mono font-normal text-neutral-700 flex items-baseline gap-1">
                        <span>({formatVal(lkRok)} − 6 − {formatVal(lp)}) ÷ {nLipitRok} =</span>
                        <strong className="font-bold text-[#8F2635]">{formatVal(dalamLipitRok)} cm</strong>
                      </span>
                    </div>
                  </div>

                  {/* 4. D – E */}
                  <div className="border-b border-neutral-200/60 pb-1.5 last:border-0 print-break-inside-avoid">
                    <div className="text-[11px] font-medium text-neutral-800 leading-tight">
                      <span>D – E</span>
                      <span>{language === 'en' ? ` = Pleat Distance = Waist ÷ ${nLipitRok}` : ` = Jarak Lipit = Lingkar Pinggang ÷ ${nLipitRok}`}</span>
                    </div>
                    <div className="text-[10.5px] font-medium leading-tight flex items-baseline mt-0.5">
                      <span className="invisible select-none" aria-hidden="true">D – E</span>
                      <span className="text-neutral-800">&nbsp;=&nbsp;</span>
                      <span className="font-mono font-normal text-neutral-700 flex items-baseline gap-1">
                        <span>{formatVal(lp)} ÷ {nLipitRok} =</span>
                        <strong className="font-bold text-[#8F2635]">{formatVal(jarakLipitRok)} cm</strong>
                      </span>
                    </div>
                  </div>

                  <div className="py-1 px-2 text-center text-[10px] font-serif italic text-neutral-600 bg-white/70 rounded border border-dashed border-neutral-300">
                    dan seterusnya
                  </div>
                </div>
              </div>
            );
          })() : isPolaCelana ? (
            /* Pola Celana Piyama single unified formula section */
            <div className="border border-[#8F2635]/30 rounded p-2 bg-neutral-50/30">
              <div className="flex items-center justify-between border-b-2 border-[#8F2635] pb-1 mb-1">
                <span className="font-serif font-bold text-xs uppercase tracking-wider text-[#8F2635]">
                  {language === 'en' ? 'BASIC PAJAMA PANTS PATTERN' : 'RUMUS POLA DASAR CELANA PIYAMA'}
                </span>
                <span className="text-[9px] font-mono font-bold text-[#8F2635] bg-[#F3E7E7] px-2 py-0.5 rounded border border-[#E8DED8]">
                  {calculations?.length || 9} {language === 'en' ? 'Formulas' : 'Perhitungan'}
                </span>
              </div>

              <div className="space-y-0.5">
                {(calculations || []).map((item) => {
                  const { pointLabel, resultNumber } = getPracticalCalcData(item);
                  return (
                    <WorksheetFormulaRow
                      key={item.id}
                      point={pointLabel}
                      formulaDesc={item.formulaDisplay || item.formulaExplanation || ''}
                      finalResult={`${resultNumber} cm`}
                      isFrontSide={true}
                    />
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* POLA DEPAN */}
            <div className="border border-neutral-200 rounded p-2 bg-neutral-50/30">
              <div className="flex items-center justify-between border-b-2 border-[#8F2635] pb-1 mb-1">
                <span className="font-serif font-bold text-xs uppercase tracking-wider text-[#8F2635]">
                  {t.polaDepan}
                </span>
                <span className="text-[9px] font-mono font-bold text-[#8F2635] bg-[#F3E7E7] px-2 py-0.5 rounded border border-[#E8DED8]">
                  {(isBodice || isPolaLengan) ? frontCalcs.length : isIndonesia ? '8' : isDressmaking ? '12' : '10'} {language === 'en' ? 'Formulas' : 'Perhitungan'}
                </span>
              </div>

              <div className="space-y-0.5">
                {(isBodice || isPolaLengan) ? (
                  frontCalcs.map((item) => {
                    const { pointLabel, resultNumber } = getPracticalCalcData(item);
                    return (
                      <WorksheetFormulaRow
                        key={item.id}
                        point={pointLabel}
                        formulaDesc={item.formulaDisplay || item.formulaExplanation || ''}
                        finalResult={`${resultNumber} cm`}
                        isFrontSide={true}
                      />
                    );
                  })
                ) : isIndonesia ? (
                  <>
                    {/* 1. A – B */}
                    <WorksheetFormulaRow
                      point="A – B"
                      formulaDesc={constantLabel}
                      finalResult="2 cm"
                      isFrontSide={true}
                    />

                    {/* 2. B – C */}
                    <WorksheetFormulaRow
                      point="B – C"
                      formulaDesc={language === 'en' ? 'Hip Depth' : 'Tinggi Panggul'}
                      finalResult={`${formatVal(tp)} cm`}
                      isFrontSide={true}
                    />

                    {/* 3. B – D */}
                    <WorksheetFormulaRow
                      point="B – D"
                      formulaDesc={language === 'en' ? 'Skirt Length' : 'Panjang Rok'}
                      finalResult={`${formatVal(pr)} cm`}
                      isFrontSide={true}
                    />

                    {/* 4. A – E */}
                    <WorksheetFormulaRow
                      point="A – E"
                      formulaDesc={language === 'en' ? '¼ Waist Circumference + 1 cm' : '¼ Lingkar Pinggang + 1 cm'}
                      substitution={`(¼ × ${formatVal(lp)} cm) + 1 cm`}
                      finalResult={`${formatVal(indonesiaFrontAE)} cm`}
                      isFrontSide={true}
                    />

                    {/* 5. C – F */}
                    <WorksheetFormulaRow
                      point="C – F"
                      formulaDesc={language === 'en' ? '¼ Hip Circumference + 1 cm' : '¼ Lingkar Panggul + 1 cm'}
                      substitution={`(¼ × ${formatVal(lpg)} cm) + 1 cm`}
                      finalResult={`${formatVal(indonesiaFrontCF)} cm`}
                      isFrontSide={true}
                    />

                    {/* 6. D – G */}
                    <WorksheetFormulaRow
                      point="D – G"
                      formulaDesc={language === 'en' ? 'C – F' : 'C – F'}
                      substitution={`(¼ × ${formatVal(lpg)} cm) + 1 cm`}
                      finalResult={`${formatVal(indonesiaFrontCF)} cm`}
                      isFrontSide={true}
                    />

                    {/* 7. G – H */}
                    <WorksheetFormulaRow
                      point="G – H"
                      formulaDesc={language === 'en' ? 'Hem Flare' : 'Pengembangan Kelim Bawah'}
                      finalResult="5 cm"
                      isFrontSide={true}
                    />

                    {/* 8. H – I */}
                    <WorksheetFormulaRow
                      point="H – I"
                      formulaDesc={language === 'en' ? 'Raise 1.5 cm (Hem curve)' : 'Naik 1,5 cm (Lengkung kelim bawah)'}
                      finalResult="1,5 cm"
                      isFrontSide={true}
                    />
                  </>
                ) : isDressmaking ? (
                  <>
                    {/* 1. A – B */}
                    <WorksheetFormulaRow
                      point="A – B"
                      formulaDesc={language === 'en' ? 'Skirt Length' : 'Panjang Rok'}
                      finalResult={`${formatVal(pr)} cm`}
                      isFrontSide={true}
                    />

                    {/* 2. A – C */}
                    <WorksheetFormulaRow
                      point="A – C"
                      formulaDesc={language === 'en' ? 'Hip Depth' : 'Tinggi Panggul'}
                      finalResult={`${formatVal(tp)} cm`}
                      isFrontSide={true}
                    />

                    {/* 3. A – A1 */}
                    <WorksheetFormulaRow
                      point="A – A1"
                      formulaDesc={language === 'en' ? '¼ Waist Circumference + 4 cm' : '¼ Lingkar Pinggang + 4 cm'}
                      substitution={`(¼ × ${formatVal(lp)} cm) + 4 cm`}
                      finalResult={`${formatVal(dressmakingFrontAA1)} cm`}
                      isFrontSide={true}
                    />

                    {/* 4. A1 – A2 */}
                    <WorksheetFormulaRow
                      point="A1 – A2"
                      formulaDesc={language === 'en' ? 'Raise 1.5 cm (Side waist curve)' : 'Naik 1,5 cm (Lengkung pinggang samping)'}
                      finalResult="1,5 cm"
                      isFrontSide={true}
                    />

                    {/* 5. A – D */}
                    <WorksheetFormulaRow
                      point="A – D"
                      formulaDesc={language === 'en' ? '1/10 Waist Circumference' : '1/10 Lingkar Pinggang (Posisi kupnat)'}
                      substitution={`1/10 × ${formatVal(lp)} cm`}
                      finalResult={`${formatVal(dressmakingFrontAD)} cm`}
                      isFrontSide={true}
                    />

                    {/* 6. D – D1 */}
                    <WorksheetFormulaRow
                      point="D – D1"
                      formulaDesc={language === 'en' ? 'Dart Width' : 'Lebar Kupnat'}
                      finalResult="3 cm"
                      isFrontSide={true}
                    />

                    {/* 7. D – O */}
                    <WorksheetFormulaRow
                      point="D – O"
                      formulaDesc={language === 'en' ? 'Dart Depth' : 'Panjang Kupnat'}
                      finalResult="12 cm"
                      isFrontSide={true}
                    />

                    {/* 8. D1 – O */}
                    <WorksheetFormulaRow
                      point="D1 – O"
                      formulaDesc={language === 'en' ? 'Dart Depth' : 'Panjang Kupnat'}
                      finalResult="12 cm"
                      isFrontSide={true}
                    />

                    {/* 9. C – C1 */}
                    <WorksheetFormulaRow
                      point="C – C1"
                      formulaDesc={language === 'en' ? '¼ Hip Circumference + 1 cm' : '¼ Lingkar Panggul + 1 cm'}
                      substitution={`(¼ × ${formatVal(lpg)} cm) + 1 cm`}
                      finalResult={`${formatVal(dressmakingFrontCC1)} cm`}
                      isFrontSide={true}
                    />

                    {/* 10. B – B1 */}
                    <WorksheetFormulaRow
                      point="B – B1"
                      formulaDesc={language === 'en' ? 'C – C1 (Horizontal hip width)' : 'C – C1 (Lebar mendatar panggul)'}
                      substitution={`(¼ × ${formatVal(lpg)} cm) + 1 cm`}
                      finalResult={`${formatVal(dressmakingFrontCC1)} cm`}
                      isFrontSide={true}
                    />

                    {/* 11. B1 – B2 */}
                    <WorksheetFormulaRow
                      point="B1 – B2"
                      formulaDesc={language === 'en' ? 'Bottom Hem Flare' : 'Pengembangan Kelim Bawah'}
                      finalResult="3 cm"
                      isFrontSide={true}
                    />

                    {/* 12. B2 – B3 */}
                    <WorksheetFormulaRow
                      point="B2 – B3"
                      formulaDesc={language === 'en' ? 'Raise 1.5 cm (Hem curve)' : 'Naik 1,5 cm (Lengkung kelim bawah)'}
                      finalResult="1,5 cm"
                      isFrontSide={true}
                    />
                  </>
                ) : (
                  <>
                    {/* 1. A – B */}
                    <WorksheetFormulaRow
                      point="A – B"
                      formulaDesc={constantLabel}
                      finalResult="2 cm"
                      isFrontSide={true}
                    />

                    {/* 2. A – C */}
                    <WorksheetFormulaRow
                      point="A – C"
                      formulaDesc={language === 'en' ? 'Hip Depth' : 'Tinggi Panggul'}
                      finalResult={`${formatVal(tp)} cm`}
                      isFrontSide={true}
                    />

                    {/* 3. A – D */}
                    <WorksheetFormulaRow
                      point="A – D"
                      formulaDesc={language === 'en' ? 'Skirt Length' : 'Panjang Rok'}
                      finalResult={`${formatVal(pr)} cm`}
                      isFrontSide={true}
                    />

                    {/* 4. A – A’ */}
                    <WorksheetFormulaRow
                      point="A – A’"
                      formulaDesc={language === 'en' ? '¼ Waist Circumference + 1 cm + 3 cm' : '¼ Lingkar Pinggang + 1 cm + 3 cm'}
                      substitution={`(¼ × ${formatVal(lp)} cm) + 1 cm + 3 cm`}
                      finalResult={`${formatVal(frontAA)} cm`}
                      isFrontSide={true}
                    />

                    {/* 5. C – C’ */}
                    <WorksheetFormulaRow
                      point="C – C’"
                      formulaDesc={language === 'en' ? '¼ Hip Circumference + 1 cm' : '¼ Lingkar Panggul + 1 cm'}
                      substitution={`(¼ × ${formatVal(lpg)} cm) + 1 cm`}
                      finalResult={`${formatVal(frontCC)} cm`}
                      isFrontSide={true}
                    />

                    {/* 6. D – D’ */}
                    <WorksheetFormulaRow
                      point="D – D’"
                      formulaDesc={language === 'en' ? '¼ Hip Circumference + 1 cm + 3 cm' : '¼ Lingkar Panggul + 1 cm + 3 cm'}
                      substitution={`(¼ × ${formatVal(lpg)} cm) + 1 cm + 3 cm`}
                      finalResult={`${formatVal(frontDD)} cm`}
                      isFrontSide={true}
                    />

                    {/* 7. D’ */}
                    <WorksheetFormulaRow
                      point="D’"
                      formulaDesc={language === 'en' ? 'Raise' : 'Naik'}
                      finalResult="1 cm"
                      isFrontSide={true}
                    />

                    {/* 8. B – E */}
                    <WorksheetFormulaRow
                      point="B – E"
                      formulaDesc={language === 'en' ? '1/10 Waist Circumference + 1 cm' : '1/10 Lingkar Pinggang + 1 cm'}
                      substitution={`(1/10 × ${formatVal(lp)} cm) + 1 cm`}
                      finalResult={`${formatVal(frontBE)} cm`}
                      isFrontSide={true}
                    />

                    {/* 9. E → kanan */}
                    <WorksheetFormulaRow
                      point={language === 'en' ? 'E → right' : 'E → kanan'}
                      formulaDesc={language === 'en' ? 'Dart Width' : 'Lebar Kupnat'}
                      finalResult="3 cm"
                      isFrontSide={true}
                    />

                    {/* 10. E → bawah */}
                    <WorksheetFormulaRow
                      point={language === 'en' ? 'E → down' : 'E → bawah'}
                      formulaDesc={language === 'en' ? 'Dart Length' : 'Panjang Kupnat'}
                      finalResult="12 cm"
                      isFrontSide={true}
                    />
                  </>
                )}
              </div>
            </div>

            {/* POLA BELAKANG */}
            <div className="border border-neutral-200 rounded p-2 bg-neutral-50/30">
              <div className="flex items-center justify-between border-b-2 border-[#332C29] pb-1 mb-1">
                <span className="font-serif font-bold text-xs uppercase tracking-wider text-[#332C29]">
                  {t.polaBelakang}
                </span>
                <span className="text-[9px] font-mono font-bold text-[#332C29] bg-[#E8DED8] px-2 py-0.5 rounded border border-[#DFD4CD]">
                  {(isBodice || isPolaLengan) ? backCalcs.length : isIndonesia ? '12' : isDressmaking ? '2' : '10'} {language === 'en' ? 'Formulas' : 'Perhitungan'}
                </span>
              </div>

              <div className="space-y-0.5">
                {(isBodice || isPolaLengan) ? (
                  backCalcs.map((item) => {
                    const { pointLabel, resultNumber } = getPracticalCalcData(item);
                    return (
                      <WorksheetFormulaRow
                        key={item.id}
                        point={pointLabel}
                        formulaDesc={item.formulaDisplay || item.formulaExplanation || ''}
                        finalResult={`${resultNumber} cm`}
                        isFrontSide={false}
                      />
                    );
                  })
                ) : isIndonesia ? (
                  <>
                    {/* 1. A – B */}
                    <WorksheetFormulaRow
                      point="A – B"
                      formulaDesc={constantLabel}
                      finalResult="2 cm"
                      isFrontSide={false}
                    />

                    {/* 2. B – C */}
                    <WorksheetFormulaRow
                      point="B – C"
                      formulaDesc={language === 'en' ? 'Hip Depth' : 'Tinggi Panggul'}
                      finalResult={`${formatVal(tp)} cm`}
                      isFrontSide={false}
                    />

                    {/* 3. B – D */}
                    <WorksheetFormulaRow
                      point="B – D"
                      formulaDesc={language === 'en' ? 'Skirt Length' : 'Panjang Rok'}
                      finalResult={`${formatVal(pr)} cm`}
                      isFrontSide={false}
                    />

                    {/* 4. A – E */}
                    <WorksheetFormulaRow
                      point="A – E"
                      formulaDesc={language === 'en' ? '¼ Waist Circumference − 1 cm + 2 cm' : '¼ Lingkar Pinggang − 1 cm + 2 cm'}
                      substitution={`(¼ × ${formatVal(lp)} cm) − 1 cm + 2 cm`}
                      finalResult={`${formatVal(indonesiaBackAE)} cm`}
                      isFrontSide={false}
                    />

                    {/* 5. C – F */}
                    <WorksheetFormulaRow
                      point="C – F"
                      formulaDesc={language === 'en' ? '¼ Hip Circumference − 1 cm' : '¼ Lingkar Panggul − 1 cm'}
                      substitution={`(¼ × ${formatVal(lpg)} cm) − 1 cm`}
                      finalResult={`${formatVal(indonesiaBackCF)} cm`}
                      isFrontSide={false}
                    />

                    {/* 6. D – G */}
                    <WorksheetFormulaRow
                      point="D – G"
                      formulaDesc={language === 'en' ? 'C – F' : 'C – F'}
                      substitution={`(¼ × ${formatVal(lpg)} cm) − 1 cm`}
                      finalResult={`${formatVal(indonesiaBackCF)} cm`}
                      isFrontSide={false}
                    />

                    {/* 7. G – H */}
                    <WorksheetFormulaRow
                      point="G – H"
                      formulaDesc={language === 'en' ? 'Hem Flare' : 'Pengembangan Kelim Bawah'}
                      finalResult="5 cm"
                      isFrontSide={false}
                    />

                    {/* 8. B – J */}
                    <WorksheetFormulaRow
                      point="B – J"
                      formulaDesc={language === 'en' ? '1/10 Waist Circumference − 1 cm' : '1/10 Lingkar Pinggang − 1 cm'}
                      substitution={`(1/10 × ${formatVal(lp)} cm) − 1 cm`}
                      finalResult={`${formatVal(indonesiaBackBJ)} cm`}
                      isFrontSide={false}
                    />

                    {/* 9. J – K */}
                    <WorksheetFormulaRow
                      point="J – K"
                      formulaDesc={language === 'en' ? 'Dart Width' : 'Lebar Kupnat'}
                      finalResult="2 cm"
                      isFrontSide={false}
                    />

                    {/* 10. J – L */}
                    <WorksheetFormulaRow
                      point="J – L"
                      formulaDesc={language === 'en' ? 'Dart Depth (Left Side)' : 'Panjang Kupnat (Sisi Kiri)'}
                      finalResult="12 cm"
                      isFrontSide={false}
                    />

                    {/* 11. K – L */}
                    <WorksheetFormulaRow
                      point="K – L"
                      formulaDesc={language === 'en' ? 'Dart Depth (Right Side)' : 'Panjang Kupnat (Sisi Kanan)'}
                      finalResult="12 cm"
                      isFrontSide={false}
                    />

                    {/* 12. H – I */}
                    <WorksheetFormulaRow
                      point="H – I"
                      formulaDesc={language === 'en' ? 'Raise 1.5 cm (Hem curve)' : 'Naik 1,5 cm (Lengkung kelim bawah)'}
                      finalResult="1,5 cm"
                      isFrontSide={false}
                    />
                  </>
                ) : isDressmaking ? (
                  <>
                    {/* 1. A – E */}
                    <WorksheetFormulaRow
                      point="A – E"
                      formulaDesc={language === 'en' ? '2 cm' : '2 cm'}
                      finalResult="2 cm"
                      isFrontSide={false}
                    />

                    {/* 2. B – F */}
                    <WorksheetFormulaRow
                      point="B – F"
                      formulaDesc={language === 'en' ? '2 cm' : '2 cm'}
                      finalResult="2 cm"
                      isFrontSide={false}
                    />
                  </>
                ) : (
                  <>
                    {/* 1. A – B */}
                    <WorksheetFormulaRow
                      point="A – B"
                      formulaDesc={constantLabel}
                      finalResult="1 cm"
                      isFrontSide={false}
                    />

                    {/* 2. A – C */}
                    <WorksheetFormulaRow
                      point="A – C"
                      formulaDesc={language === 'en' ? 'Hip Depth' : 'Tinggi Panggul'}
                      finalResult={`${formatVal(tp)} cm`}
                      isFrontSide={false}
                    />

                    {/* 3. A – D */}
                    <WorksheetFormulaRow
                      point="A – D"
                      formulaDesc={language === 'en' ? 'Skirt Length' : 'Panjang Rok'}
                      finalResult={`${formatVal(pr)} cm`}
                      isFrontSide={false}
                    />

                    {/* 4. A – A’ */}
                    <WorksheetFormulaRow
                      point="A – A’"
                      formulaDesc={language === 'en' ? '¼ Waist Circumference − 1 cm + 3 cm' : '¼ Lingkar Pinggang − 1 cm + 3 cm'}
                      substitution={`(¼ × ${formatVal(lp)} cm) − 1 cm + 3 cm`}
                      finalResult={`${formatVal(backAA)} cm`}
                      isFrontSide={false}
                    />

                    {/* 5. C – C’ */}
                    <WorksheetFormulaRow
                      point="C – C’"
                      formulaDesc={language === 'en' ? '¼ Hip Circumference − 1 cm' : '¼ Lingkar Panggul − 1 cm'}
                      substitution={`(¼ × ${formatVal(lpg)} cm) − 1 cm`}
                      finalResult={`${formatVal(backCC)} cm`}
                      isFrontSide={false}
                    />

                    {/* 6. D – D’ */}
                    <WorksheetFormulaRow
                      point="D – D’"
                      formulaDesc={language === 'en' ? '¼ Hip Circumference − 1 cm + 3 cm' : '¼ Lingkar Panggul − 1 cm + 3 cm'}
                      substitution={`(¼ × ${formatVal(lpg)} cm) − 1 cm + 3 cm`}
                      finalResult={`${formatVal(backDD)} cm`}
                      isFrontSide={false}
                    />

                    {/* 7. D’ */}
                    <WorksheetFormulaRow
                      point="D’"
                      formulaDesc={language === 'en' ? 'Raise' : 'Naik'}
                      finalResult="1 cm"
                      isFrontSide={false}
                    />

                    {/* 8. B – E */}
                    <WorksheetFormulaRow
                      point="B – E"
                      formulaDesc={language === 'en' ? '1/10 Waist Circumference − 1 cm' : '1/10 Lingkar Pinggang − 1 cm'}
                      substitution={`(1/10 × ${formatVal(lp)} cm) − 1 cm`}
                      finalResult={`${formatVal(backBE)} cm`}
                      isFrontSide={false}
                    />

                    {/* 9. E → kanan */}
                    <WorksheetFormulaRow
                      point={language === 'en' ? 'E → right' : 'E → kanan'}
                      formulaDesc={language === 'en' ? 'Dart Width' : 'Lebar Kupnat'}
                      finalResult="3 cm"
                      isFrontSide={false}
                    />

                    {/* 10. E → bawah */}
                    <WorksheetFormulaRow
                      point={language === 'en' ? 'E → down' : 'E → bawah'}
                      formulaDesc={language === 'en' ? 'Dart Length' : 'Panjang Kupnat'}
                      finalResult="12 cm"
                      isFrontSide={false}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        )}

          {/* CATATAN PENTING POLA KHUSUS SISTEM INDONESIA */}
          {isIndonesia && (
            <div className="mt-2.5 pt-2 border-t border-neutral-200 text-[10px] text-neutral-700 space-y-1">
              <p>
                <strong>Catatan Penting Pola:</strong> Penambahan 1 cm pada pola depan dan pengurangan 1 cm pada pola belakang bukan untuk kelonggaran, tetapi untuk membedakan lebar pola depan dan pola belakang agar pola depan lebih lebar daripada pola belakang.
              </p>
            </div>
          )}

          {/* CATATAN PENTING POLA KHUSUS SISTEM DRESSMAKING */}
          {isDressmaking && (
            <div className="mt-2.5 pt-2 border-t border-neutral-200 text-[10px] text-neutral-700 space-y-1">
              <p>
                <strong>Catatan Penting:</strong> Pada konstruksi pola rok sistem dressmaking, pola depan dan pola belakang berhimpitan. Yang membedakan keduanya hanya posisi garis Tengah Muka (TM) dan Tengah Belakang (TB), sedangkan bentuk sisi sampingnya sama persis. Oleh karena itu, pola belakang dapat dipindahkan menggunakan kertas karbon.
              </p>
            </div>
          )}
        </section>
      )}

      {/* 6. FOOTER NOTE */}
      <footer className="border-t border-neutral-300 pt-2 mt-3 text-[9px] text-neutral-600 flex justify-between items-center font-mono print-break-inside-avoid">
        <span>{t.footerStudioNote}</span>
        <span>{t.footerDocNote}</span>
      </footer>
    </div>
  );
};
