import React, { useState } from 'react';
import { Compass, RotateCcw, Eye, Image as ImageIcon, ChevronDown, ChevronUp, FileText, Info, ZoomIn, ZoomOut } from 'lucide-react';
import { PatternCalculationItem } from '../types/pattern';
import { FRONT_PATTERN_CALCULATIONS, BACK_PATTERN_CALCULATIONS, formatDraftingPrecision } from '../data/patternData';
import { ROK_DRESSMAKING_DEFAULT_FRONT_INSTRUCTIONS, ROK_DRESSMAKING_DEFAULT_BACK_INSTRUCTIONS } from '../data/calculators/rokDressmaking';
import { DEFAULT_ROK_PIAS_INSTRUCTIONS, DEFAULT_ROK_GODET_INSTRUCTIONS } from '../data/calculators/rokPiasGodet';
import { useLanguage } from '../i18n';
import { FormattedPatternInstructions } from './FormattedPatternInstructions';

interface PatternTechnicalDiagramProps {
  calculations?: PatternCalculationItem[];
  measurementsMap: Record<string, number>;
  activeCalculationId: string | null;
  onSelectCalculation: (id: string | null) => void;
  imageUrl?: string | null;
  dressmakingBackPatternImage?: string | null;
  dressmakingFrontPatternImage?: string | null;
  dressmakingSideDartImage?: string | null;
  patternDescription?: string | null;
  frontPatternDescription?: string | null;
  backPatternDescription?: string | null;
  sideDartDescription?: string | null;
  importantNotes?: string[];
  importantNotes_id?: string | null;
  importantNotes_en?: string | null;
  importantNote_id?: string | null;
  importantNote_en?: string | null;
  calculatorId?: string;
  circleSkirtModel?: 'full' | 'half';
  tierCount?: number;
}

export const PatternTechnicalDiagram: React.FC<PatternTechnicalDiagramProps> = ({
  calculations,
  measurementsMap,
  activeCalculationId,
  onSelectCalculation,
  imageUrl,
  dressmakingBackPatternImage,
  dressmakingFrontPatternImage,
  dressmakingSideDartImage,
  patternDescription,
  frontPatternDescription,
  backPatternDescription,
  sideDartDescription,
  importantNotes,
  importantNotes_id,
  importantNotes_en,
  importantNote_id,
  importantNote_en,
  calculatorId,
  circleSkirtModel = 'full',
  tierCount = 3,
}) => {
  const { t, language } = useLanguage();
  const [hasImageError, setHasImageError] = useState(false);
  const [hasBackImageError, setHasBackImageError] = useState(false);
  const [hasFrontImageError, setHasFrontImageError] = useState(false);
  const [hasSideDartImageError, setHasSideDartImageError] = useState(false);

  const isRokLingkaran = calculatorId === 'rok-lingkaran' || calculatorId === 'lingkaran';
  const isTieredSkirt = calculatorId === 'pola-rok-kerut-bertingkat' || calculatorId === 'rok-kerut-bertingkat' || calculatorId === 'rok-kerut' || calculatorId === 'tiered-skirt';
  const isPolaCelana = calculatorId === 'pola-celana-piyama' || calculatorId === 'celana-piyama' || calculatorId === 'celana' || calculatorId === 'pajama-pants';
  const isRokPiasGodet = calculatorId === 'rok-pias-godet' || calculatorId === 'pias-godet' || calculatorId === 'rok-pias' || calculatorId === 'pias' || calculatorId === 'godet';
  const isRokLipitSearah = calculatorId === 'rok-lipit-searah' || calculatorId === 'rok-lipit' || calculatorId === 'lipit-searah' || calculatorId === 'lipit';
  const isRokSederhana = calculatorId === 'rok' || calculatorId === 'rok-sederhana';

  // Check if current calculator is Bodice (Badan Sederhana / Badan Dressmaking / Badan Indonesia)
  const isDressmakingBodice = calculatorId === 'badan-dressmaking' || 
    calculatorId === 'basic-bodice-dressmaking' || 
    (Boolean(calculatorId?.includes('dressmaking')) && Boolean(calculatorId?.includes('badan')));

  const isIndonesianBodice = calculatorId === 'badan-indonesia' || 
    calculatorId === 'basic-bodice-indonesia' || 
    (Boolean(calculatorId?.includes('indonesia')) && Boolean(calculatorId?.includes('badan')));

  const isBodice = calculatorId === 'badan-sederhana' || 
    calculatorId === 'badan' || 
    calculatorId === 'basic-bodice-sederhana' || 
    isDressmakingBodice ||
    isIndonesianBodice;

  const isDressmakingSkirt = calculatorId === 'rok-dressmaking' || 
    calculatorId === 'basic-skirt-dressmaking' ||
    (Boolean(calculatorId?.includes('dressmaking')) && !isBodice);

  const isBackFirst = isDressmakingBodice;

  // Accordion open/collapse states (collapsed by default)
  const [isFrontOpen, setIsFrontOpen] = useState(false);
  const [isBackOpen, setIsBackOpen] = useState(false);
  const [isLegacyOpen, setIsLegacyOpen] = useState(false);

  // Display-only visual zoom level for pattern diagram (Default 1.0x)
  const [zoomScale, setZoomScale] = useState<number>(1.0);
  const handleZoomIn = () => setZoomScale((prev) => Math.min(2.5, Number((prev + 0.25).toFixed(2))));
  const handleZoomOut = () => setZoomScale((prev) => Math.max(0.75, Number((prev - 0.25).toFixed(2))));
  const handleResetZoom = () => setZoomScale(1.0);

  // Dedicated open/collapse states for Dressmaking Bodice blocks (expanded by default for clear instruction flow)
  const [isDressmakingBackOpen, setIsDressmakingBackOpen] = useState(true);
  const [isDressmakingFrontOpen, setIsDressmakingFrontOpen] = useState(true);
  const [isDressmakingKupnatOpen, setIsDressmakingKupnatOpen] = useState(true);

  // Important Pattern Notes (Catatan Penting Pola) collapsible accordion state (closed by default)
  const [isImportantNotesOpen, setIsImportantNotesOpen] = useState(false);

  // Reset notes collapsible state and zoom level whenever calculator changes
  React.useEffect(() => {
    setIsImportantNotesOpen(false);
    setZoomScale(1.0);
  }, [calculatorId]);

  // Resolve Important Pattern Notes content (Bilingual & Dynamic from Admin / Firestore)
  const resolvedNotesContent = React.useMemo(() => {
    const rawId = importantNote_id !== undefined && importantNote_id !== null
      ? importantNote_id
      : (importantNotes_id !== undefined && importantNotes_id !== null ? importantNotes_id : undefined);

    const rawEn = importantNote_en !== undefined && importantNote_en !== null
      ? importantNote_en
      : (importantNotes_en !== undefined && importantNotes_en !== null ? importantNotes_en : undefined);

    if (language === 'en') {
      if (rawEn !== undefined && rawEn.trim().length > 0) {
        return rawEn.trim();
      }
      return '';
    }

    // Indonesian language handling
    if (rawId !== undefined && rawId.trim().length > 0) {
      return rawId.trim();
    }
    // If rawId was explicitly set as empty string in Firestore, treat as empty
    if (rawId !== undefined && rawId.trim().length === 0) {
      return '';
    }

    // Default fallback from hardcoded notes if Firestore hasn't been set yet (Indonesian only)
    if (isDressmakingSkirt) {
      return 'Pada konstruksi pola rok sistem dressmaking, pola depan dan pola belakang berhimpitan. Yang membedakan keduanya hanya posisi garis Tengah Muka (TM) dan Tengah Belakang (TB), sedangkan bentuk sisi sampingnya sama persis. Oleh karena itu, pola belakang dapat dipindahkan menggunakan kertas karbon.';
    }

    if (importantNotes && importantNotes.length > 0) {
      return importantNotes.join('\n');
    }

    return '';
  }, [importantNote_id, importantNotes_id, importantNote_en, importantNotes_en, language, isDressmakingSkirt, importantNotes]);

  // Reset error state whenever images change
  React.useEffect(() => {
    setHasImageError(false);
    setHasBackImageError(false);
    setHasFrontImageError(false);
    setHasSideDartImageError(false);
  }, [imageUrl, dressmakingBackPatternImage, dressmakingFrontPatternImage, dressmakingSideDartImage]);

  // Find active calculation if any
  const allCalcs = calculations !== undefined
    ? calculations
    : [...FRONT_PATTERN_CALCULATIONS, ...BACK_PATTERN_CALCULATIONS];
  const activeCalc = allCalcs.find((c) => c.id === activeCalculationId);

  // Active calculation display values
  const getActiveCalcDisplay = () => {
    if (!activeCalc) return null;
    if (activeCalc.type === 'action') {
      return language === 'en' ? 'raise 1 cm' : 'naik 1 cm';
    }
    const val = activeCalc.calculate ? activeCalc.calculate(measurementsMap) : activeCalc.fixedValue ?? 0;
    return `${formatDraftingPrecision(val)} cm`;
  };

  // Determine effective front/back/side-dart instruction strings
  let defaultFrontForPias = '';
  let defaultBackForPias = '';
  if (isRokPiasGodet) {
    if (patternDescription && (
      patternDescription.includes('[POLA GODET]') ||
      patternDescription.includes('[GODET PATTERN]') ||
      patternDescription.includes('[POLA BELAKANG]') ||
      patternDescription.includes('[BACK PATTERN]')
    )) {
      const splitMarker = patternDescription.includes('[GODET PATTERN]')
        ? '[GODET PATTERN]'
        : patternDescription.includes('[BACK PATTERN]')
        ? '[BACK PATTERN]'
        : patternDescription.includes('[POLA GODET]')
        ? '[POLA GODET]'
        : '[POLA BELAKANG]';
      const parts = patternDescription.split(splitMarker);
      defaultFrontForPias = parts[0].replace(/\[(POLA PIAS|POLA DEPAN|PANEL PATTERN|FRONT PATTERN)\]/, '').trim();
      defaultBackForPias = parts[1]?.trim() || '';
    } else if (language !== 'en') {
      defaultFrontForPias = DEFAULT_ROK_PIAS_INSTRUCTIONS;
      defaultBackForPias = DEFAULT_ROK_GODET_INSTRUCTIONS;
    }
  }

  const effectiveFrontDesc = frontPatternDescription?.trim() || (isPolaCelana ? patternDescription?.trim() || '' : '') || (language !== 'en' ? (isDressmakingSkirt ? ROK_DRESSMAKING_DEFAULT_FRONT_INSTRUCTIONS : isRokPiasGodet ? defaultFrontForPias : '') : '');
  const effectiveBackDesc = isPolaCelana ? '' : (backPatternDescription?.trim() || (language !== 'en' ? (isDressmakingSkirt ? ROK_DRESSMAKING_DEFAULT_BACK_INSTRUCTIONS : isRokPiasGodet ? defaultBackForPias : '') : ''));
  const effectiveSideDartDesc = sideDartDescription?.trim() || '';
  const hasSplitDescriptions = Boolean(effectiveFrontDesc || effectiveBackDesc || effectiveSideDartDesc);
  const effectiveLegacyDesc = !hasSplitDescriptions ? patternDescription?.trim() || '' : '';

  return (
    <div className="bg-[#FCFAF7] rounded-2xl border border-[#E8DED8] shadow-sm overflow-hidden h-full flex flex-col transition-all">
      {/* Header Bar */}
      <div className="px-3 xs:px-4 sm:px-5 py-2.5 sm:py-4 bg-[#E8DED8]/40 border-b border-[#E8DED8] flex items-center justify-between gap-1.5 sm:gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-[#E8DED8] text-[#8F2635] flex items-center justify-center font-medium shadow-xs shrink-0">
            <Compass size={14} className="sm:size-4" />
          </div>
          <div className="min-w-0">
            <h3 className="font-serif text-xs xs:text-sm sm:text-xl font-bold text-[#332C29] tracking-wide leading-tight truncate">
              {t.diagramTitle}
            </h3>
            <p className="hidden sm:block text-xs text-[#6B5E57] truncate">
              {isRokLingkaran
                ? (circleSkirtModel === 'full'
                    ? (language === 'en' ? 'Master Blueprint • Full Circle Skirt (360°)' : 'Master Pola Rok Lingkaran Penuh (360°)')
                    : (language === 'en' ? 'Master Blueprint • Half Circle Skirt (180°)' : 'Master Pola Rok Setengah Lingkaran (180°)'))
                : isTieredSkirt
                ? (tierCount >= 4
                    ? (language === 'en' ? 'Master Blueprint • Tiered Gathered Skirt (4-Tier Pattern)' : 'Master Pola Rok Kerut Bertingkat (Pola Tingkat 4)')
                    : (language === 'en' ? 'Master Blueprint • Tiered Gathered Skirt (3-Tier Pattern)' : 'Master Pola Rok Kerut Bertingkat (Pola Tingkat 3)'))
                : isRokLipitSearah
                ? (language === 'en' ? 'Master Blueprint • One-Way Pleated Skirt Pattern' : 'Master Pola Rok Lipit Searah')
                : isRokPiasGodet
                ? (language === 'en' ? 'Master Blueprint (Pias & Godet)' : 'Master Pola (Pias & Godet)')
                : (language === 'en' ? 'Master Blueprint (Front & Back)' : 'Master Pola (Depan & Belakang)')}{' '}
              • {t.scale14Construction}
            </p>
          </div>
        </div>

        {/* Right side: Display Zoom Controls & Master Pattern Indicator Badge */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Display-only Visual Zoom Controls */}
          <div className="flex items-center bg-[#FCFAF7] border border-[#DFD4CD] rounded-full p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoomScale <= 0.75}
              title={language === 'en' ? 'Zoom Out' : 'Perkecil Pola'}
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[#6B5E57] hover:text-[#8F2635] hover:bg-[#E8DED8] disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer transition-colors"
            >
              <ZoomOut size={11} className="sm:size-3" />
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              title={language === 'en' ? 'Reset Fit' : 'Atur Ulang Ukuran Pola'}
              className="px-1 text-[9px] xs:text-[10px] sm:text-[11px] font-mono font-semibold text-[#6B5E57] hover:text-[#8F2635] cursor-pointer"
            >
              {Math.round(zoomScale * 100)}%
            </button>
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoomScale >= 2.5}
              title={language === 'en' ? 'Zoom In' : 'Perbesar Pola'}
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[#6B5E57] hover:text-[#8F2635] hover:bg-[#E8DED8] disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer transition-colors"
            >
              <ZoomIn size={11} className="sm:size-3" />
            </button>
          </div>

          {/* Master Pattern Indicator Badge */}
          <div className="hidden sm:flex items-center gap-1.5 bg-[#7A1F2D] text-white px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-semibold shadow-xs select-none">
            <Eye size={12} />
            <span>{language === 'en' ? 'Master Pattern' : 'Pola Master'}</span>
          </div>
        </div>
      </div>

      {/* Main Pattern Canvas */}
      <div className={`relative ${isBodice ? 'p-2 sm:p-3 min-h-0' : 'p-2 sm:p-4 min-h-[460px]'} bg-[#FCFAF7] flex-1 flex flex-col items-center overflow-y-auto`}>
        {/* Drafting Grid Aesthetic */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, #332C29 1px, transparent 1px), linear-gradient(to bottom, #332C29 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
          }}
        />

        {/* Active calculation focus banner */}
        {activeCalc && (
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-20 bg-[#332C29] text-[#FCFAF7] px-4 py-1.5 rounded-full shadow-lg text-xs font-medium flex items-center gap-2 border border-[#4A423B] transition-all max-w-[90%] truncate">
            <span className="px-2 py-0.5 rounded bg-[#8F2635] text-white font-mono font-bold text-[11px] shrink-0">
              {activeCalc.points}
            </span>
            <span className="truncate">
              {activeCalc.patternSide === 'front' ? t.polaDepan : t.polaBelakang} ={' '}
              <strong className="text-[#E8DED8] font-mono">{getActiveCalcDisplay()}</strong>
            </span>
            <button
              type="button"
              onClick={() => onSelectCalculation(null)}
              className="text-[#DFD4CD] hover:text-white ml-1 p-0.5 transition-colors cursor-pointer"
              title={t.resetHighlight}
            >
              <RotateCcw size={12} />
            </button>
          </div>
        )}

        {/* Important Pattern Notes (Catatan Penting Pola) - Positioned directly above pattern image */}
        {resolvedNotesContent.trim().length > 0 && (
          <div className={`w-full max-w-4xl ${isBodice ? 'mb-2' : isRokSederhana ? 'mb-[clamp(0.25rem,0.18rem+0.25vw,0.75rem)]' : 'mb-4'} bg-white rounded-xl border border-[#E8DED8] shadow-2xs overflow-hidden transition-all`}>
            <button
              type="button"
              id="toggle-catatan-penting-pola"
              onClick={() => setIsImportantNotesOpen(!isImportantNotesOpen)}
              aria-expanded={isImportantNotesOpen}
              className={`w-full ${isRokSederhana ? 'px-[clamp(0.35rem,0.22rem+0.35vw,1.25rem)] py-[clamp(0.28rem,0.18rem+0.28vw,0.75rem)]' : 'px-4 sm:px-5 py-3 sm:py-3.5'} flex items-center justify-between text-left hover:bg-[#FAF6F3] active:bg-[#F5EFEB] transition-colors cursor-pointer select-none`}
            >
              <div className={`flex items-center ${isRokSederhana ? 'gap-[clamp(0.2rem,0.14rem+0.2vw,0.5rem)]' : 'gap-2'} text-[#8F2635] min-w-0`}>
                <Info className={`shrink-0 ${isRokSederhana ? 'size-[clamp(0.75rem,0.65rem+0.25vw,1rem)]' : 'size-4'}`} />
                <h4 className={`font-serif font-bold ${isRokSederhana ? 'text-[clamp(0.65rem,0.54rem+0.35vw,0.875rem)] tracking-tight sm:tracking-wide whitespace-nowrap' : 'text-xs sm:text-sm tracking-wide uppercase'}`}>
                  {language === 'en' ? 'Important Pattern Notes' : 'Catatan Penting Pola'}
                </h4>
              </div>
              <div className={`flex items-center gap-1 text-[#8F2635] ${isRokSederhana ? 'text-[clamp(0.5625rem,0.48rem+0.25vw,0.75rem)]' : 'text-xs'} font-semibold shrink-0`}>
                <span className={`${isRokSederhana ? 'hidden sm:inline text-[11px]' : 'text-[11px]'} text-[#8C7D76]`}>
                  {isImportantNotesOpen ? (language === 'en' ? 'Hide' : 'Tutup') : (language === 'en' ? 'Show' : 'Buka')}
                </span>
                {isImportantNotesOpen ? (
                  <ChevronUp className={isRokSederhana ? 'size-[clamp(0.75rem,0.65rem+0.25vw,1rem)]' : 'size-4'} />
                ) : (
                  <ChevronDown className={isRokSederhana ? 'size-[clamp(0.75rem,0.65rem+0.25vw,1rem)]' : 'size-4'} />
                )}
              </div>
            </button>
            {isImportantNotesOpen && (
              <div className={`${isRokSederhana ? 'px-[clamp(0.35rem,0.22rem+0.35vw,1.25rem)] pb-[clamp(0.35rem,0.22rem+0.35vw,1.25rem)]' : 'px-4 pb-4 sm:px-5 sm:pb-5'} pt-1 border-t border-[#E8DED8] bg-[#FCFAF7] select-text`}>
                <div className="pt-2">
                  <FormattedPatternInstructions content={resolvedNotesContent} accentColor="burgundy" isFluid={isRokSederhana} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Master High-Resolution Pattern Reference Artwork */}
        {isIndonesianBodice ? (
          <div className="w-full space-y-6 pt-0 pb-2 relative flex flex-col items-center select-none">
            {/* POLA BADAN DASAR SISTEM INDONESIA */}
            <div className="w-full bg-white rounded-2xl border border-[#E8DED8] overflow-hidden shadow-xs">
              <div className="px-4 py-3 bg-[#FCFAF7] border-b border-[#E8DED8] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8F2635] shrink-0" />
                  <h4 className="font-serif text-sm font-bold text-[#332C29] tracking-wide">
                    {language === 'en' ? 'Basic Bodice Pattern — Indonesian System' : 'Pola Badan Dasar Sistem Indonesia'}
                  </h4>
                </div>
                <span className="text-[10.5px] font-mono text-[#8F2635] bg-[#F3E7E7] px-2 py-0.5 rounded border border-[#E8DED8]">
                  Pola Master 🔴
                </span>
              </div>
              <div className="w-full p-2 sm:p-4 flex items-center justify-center bg-[#FCFAF7]">
                {(dressmakingFrontPatternImage || imageUrl || dressmakingBackPatternImage) && !hasFrontImageError ? (
                  <img
                    src={dressmakingFrontPatternImage || imageUrl || dressmakingBackPatternImage || ''}
                    onError={() => setHasFrontImageError(true)}
                    alt="Pola Badan Dasar Sistem Indonesia"
                    referrerPolicy="no-referrer"
                    className="w-full h-auto max-h-[80vh] object-contain filter contrast-[1.03] drop-shadow-xs rounded-lg transition-all"
                  />
                ) : (
                  <div className="w-full min-h-[220px] flex flex-col items-center justify-center text-xs text-[#8C7D76] bg-white rounded-xl border border-dashed border-[#DFD4CD] p-6 text-center">
                    <ImageIcon size={32} className="mb-2 text-[#DFD4CD]" />
                    <p className="font-medium text-[#6B5E57]">
                      {language === 'en' ? 'Pattern image not available yet.' : 'Gambar pola belum tersedia.'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Subtitle footer badge */}
            <div className="mt-2 text-center">
              <span className="text-[11px] font-mono text-[#6B5E57] bg-[#E8DED8] px-2.5 py-0.5 rounded-md">
                {language === 'en'
                  ? 'Blueprint Master Konstruksi Pola Badan Dasar Sistem Indonesia'
                  : 'Blueprint Master Konstruksi Pola Badan Dasar Sistem Indonesia'}
              </span>
            </div>

            {/* Collapsible Pattern Drafting Instructions Below Pattern Images (Front First for Indonesia) */}
            <div className="w-full max-w-4xl mt-6 pt-4 border-t border-[#E8DED8] space-y-3 select-text">
              {/* Front Accordion Component first */}
              {effectiveFrontDesc && (
                <div key="accordion-front" className="bg-white rounded-xl border border-[#E8DED8] overflow-hidden shadow-xs transition-all">
                  <button
                    type="button"
                    id="accordion-toggle-pola-depan"
                    onClick={() => setIsFrontOpen(!isFrontOpen)}
                    aria-expanded={isFrontOpen}
                    className="w-full px-4 sm:px-5 py-3.5 flex items-center justify-between text-left hover:bg-[#FAF6F3] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#8F2635] shrink-0"></span>
                      <span className="font-serif text-xs sm:text-sm font-bold text-[#332C29] tracking-wide">
                        {isPolaCelana
                          ? (language === 'en' ? 'Pattern Drafting Instructions' : 'Cara Pembuatan Pola')
                          : (language === 'en' ? 'Pattern Drafting Instructions — Front Pattern' : 'Cara Pembuatan Pola — Pola Depan')}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[#8F2635] text-xs font-semibold">
                      <span className="hidden sm:inline text-[11px] text-[#8C7D76]">
                        {isFrontOpen ? (language === 'en' ? 'Hide' : 'Tutup') : (language === 'en' ? 'Show' : 'Buka')}
                      </span>
                      {isFrontOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </button>

                  {isFrontOpen && (
                    <div className="px-4 sm:px-6 py-4 bg-[#FCFAF7] border-t border-[#E8DED8] animate-fadeIn">
                      <FormattedPatternInstructions content={effectiveFrontDesc} accentColor="burgundy" />
                    </div>
                  )}
                </div>
              )}

              {/* Back Accordion Component second */}
              {effectiveBackDesc && !isPolaCelana && (
                <div key="accordion-back" className="bg-white rounded-xl border border-[#E8DED8] overflow-hidden shadow-xs transition-all">
                  <button
                    type="button"
                    id="accordion-toggle-pola-belakang"
                    onClick={() => setIsBackOpen(!isBackOpen)}
                    aria-expanded={isBackOpen}
                    className="w-full px-4 sm:px-5 py-3.5 flex items-center justify-between text-left hover:bg-[#FAF6F3] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#1D4ED8] shrink-0"></span>
                      <span className="font-serif text-xs sm:text-sm font-bold text-[#332C29] tracking-wide">
                        {language === 'en' ? 'Pattern Drafting Instructions — Back Pattern' : 'Cara Pembuatan Pola — Pola Belakang'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[#1D4ED8] text-xs font-semibold">
                      <span className="hidden sm:inline text-[11px] text-[#8C7D76]">
                        {isBackOpen ? (language === 'en' ? 'Hide' : 'Tutup') : (language === 'en' ? 'Show' : 'Buka')}
                      </span>
                      {isBackOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </button>

                  {isBackOpen && (
                    <div className="px-4 sm:px-6 py-4 bg-[#FCFAF7] border-t border-[#E8DED8] animate-fadeIn">
                      <FormattedPatternInstructions content={effectiveBackDesc} accentColor="blue" />
                    </div>
                  )}
                </div>
              )}

              {/* Fallback Legacy Accordion */}
              {effectiveLegacyDesc && (
                <div className="bg-white rounded-xl border border-[#E8DED8] overflow-hidden shadow-xs transition-all">
                  <button
                    type="button"
                    id="accordion-toggle-pola-legacy"
                    onClick={() => setIsLegacyOpen(!isLegacyOpen)}
                    aria-expanded={isLegacyOpen}
                    className="w-full px-4 sm:px-5 py-3.5 flex items-center justify-between text-left hover:bg-[#FAF6F3] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#8F2635] shrink-0"></span>
                      <span className="font-serif text-xs sm:text-sm font-bold text-[#332C29] tracking-wide">
                        {language === 'en' ? 'Pattern Drafting Instructions' : 'Cara Pembuatan Pola'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[#8F2635] text-xs font-semibold">
                      <span className="hidden sm:inline text-[11px] text-[#8C7D76]">
                        {isLegacyOpen ? (language === 'en' ? 'Hide' : 'Tutup') : (language === 'en' ? 'Show' : 'Buka')}
                      </span>
                      {isLegacyOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </button>

                  {isLegacyOpen && (
                    <div className="px-4 sm:px-6 py-4 bg-[#FCFAF7] border-t border-[#E8DED8] animate-fadeIn">
                      <FormattedPatternInstructions content={effectiveLegacyDesc} accentColor="burgundy" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : isDressmakingBodice ? (
          <div className="w-full space-y-6 pt-0 pb-2 relative flex flex-col items-center select-none">
            {/* 1. POLA BELAKANG BLOCK 🔵 */}
            <div className="w-full bg-white rounded-2xl border border-[#E8DED8] overflow-hidden shadow-xs">
              <div className="px-4 py-3 bg-[#FCFAF7] border-b border-[#E8DED8] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1D4ED8] shrink-0" />
                  <h4 className="font-serif text-sm font-bold text-[#332C29] tracking-wide">
                    {language === 'en' ? 'Back Pattern — Dressmaking System' : 'Pola Belakang — Sistem Dressmaking'}
                  </h4>
                </div>
                <span className="text-[10.5px] font-mono text-[#1D4ED8] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Pola Belakang 🔵
                </span>
              </div>
              <div className="w-full p-2 sm:p-4 flex items-center justify-center bg-[#FCFAF7]">
                {(dressmakingBackPatternImage || (!dressmakingFrontPatternImage && imageUrl)) && !hasBackImageError ? (
                  <img
                    src={dressmakingBackPatternImage || imageUrl || ''}
                    onError={() => setHasBackImageError(true)}
                    alt="Pola Belakang Sistem Dressmaking"
                    referrerPolicy="no-referrer"
                    className="w-full h-auto max-h-[80vh] object-contain filter contrast-[1.03] drop-shadow-xs rounded-lg transition-all"
                  />
                ) : (
                  <div className="w-full min-h-[220px] flex flex-col items-center justify-center text-xs text-[#8C7D76] bg-white rounded-xl border border-dashed border-[#DFD4CD] p-6 text-center">
                    <ImageIcon size={32} className="mb-2 text-[#DFD4CD]" />
                    <p className="font-medium text-[#6B5E57]">
                      {language === 'en' ? 'Back pattern image not available yet.' : 'Gambar Pola Belakang belum tersedia.'}
                    </p>
                  </div>
                )}
              </div>

              {/* Deskripsi Pola Belakang tepat di bawah gambar Pola Belakang */}
              {effectiveBackDesc && (
                <div className="border-t border-[#E8DED8] bg-[#FAF6F3]/60">
                  <button
                    type="button"
                    id="toggle-pola-belakang-desc"
                    onClick={() => setIsDressmakingBackOpen(!isDressmakingBackOpen)}
                    aria-expanded={isDressmakingBackOpen}
                    className="w-full px-4 sm:px-5 py-3 flex items-center justify-between text-left hover:bg-[#FAF6F3] transition-colors cursor-pointer border-b border-[#E8DED8]"
                  >
                    <div className="flex items-center gap-2">
                      <FileText size={15} className="text-[#1D4ED8]" />
                      <span className="font-serif text-xs sm:text-sm font-bold text-[#332C29] tracking-wide">
                        {language === 'en' ? 'Pattern Making Instructions — Back Pattern' : 'Cara Membuat Pola — Pola Belakang'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[#1D4ED8] text-xs font-semibold">
                      <span className="hidden sm:inline text-[11px] text-[#8C7D76]">
                        {isDressmakingBackOpen ? (language === 'en' ? 'Hide' : 'Tutup') : (language === 'en' ? 'Show' : 'Buka')}
                      </span>
                      {isDressmakingBackOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </button>
                  {isDressmakingBackOpen && (
                    <div className="px-4 sm:px-6 py-4 bg-[#FCFAF7] select-text">
                      <FormattedPatternInstructions content={effectiveBackDesc} accentColor="blue" />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 2. POLA DEPAN BLOCK 🔴 */}
            <div className="w-full bg-white rounded-2xl border border-[#E8DED8] overflow-hidden shadow-xs">
              <div className="px-4 py-3 bg-[#FCFAF7] border-b border-[#E8DED8] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8F2635] shrink-0" />
                  <h4 className="font-serif text-sm font-bold text-[#332C29] tracking-wide">
                    {language === 'en' ? 'Front Pattern — Dressmaking System' : 'Pola Depan — Sistem Dressmaking'}
                  </h4>
                </div>
                <span className="text-[10.5px] font-mono text-[#8F2635] bg-[#F3E7E7] px-2 py-0.5 rounded border border-[#E8DED8]">
                  Pola Depan 🔴
                </span>
              </div>
              <div className="w-full p-2 sm:p-4 flex items-center justify-center bg-[#FCFAF7]">
                {dressmakingFrontPatternImage && !hasFrontImageError ? (
                  <img
                    src={dressmakingFrontPatternImage}
                    onError={() => setHasFrontImageError(true)}
                    alt="Pola Depan Sistem Dressmaking"
                    referrerPolicy="no-referrer"
                    className="w-full h-auto max-h-[80vh] object-contain filter contrast-[1.03] drop-shadow-xs rounded-lg transition-all"
                  />
                ) : (
                  <div className="w-full min-h-[220px] flex flex-col items-center justify-center text-xs text-[#8C7D76] bg-white rounded-xl border border-dashed border-[#DFD4CD] p-6 text-center">
                    <ImageIcon size={32} className="mb-2 text-[#DFD4CD]" />
                    <p className="font-medium text-[#6B5E57]">
                      {language === 'en' ? 'Front pattern image not available yet.' : 'Gambar Pola Depan belum tersedia.'}
                    </p>
                  </div>
                )}
              </div>

              {/* Deskripsi Pola Depan tepat di bawah gambar Pola Depan */}
              {effectiveFrontDesc && (
                <div className="border-t border-[#E8DED8] bg-[#FAF6F3]/60">
                  <button
                    type="button"
                    id="toggle-pola-depan-desc"
                    onClick={() => setIsDressmakingFrontOpen(!isDressmakingFrontOpen)}
                    aria-expanded={isDressmakingFrontOpen}
                    className="w-full px-4 sm:px-5 py-3 flex items-center justify-between text-left hover:bg-[#FAF6F3] transition-colors cursor-pointer border-b border-[#E8DED8]"
                  >
                    <div className="flex items-center gap-2">
                      <FileText size={15} className="text-[#8F2635]" />
                      <span className="font-serif text-xs sm:text-sm font-bold text-[#332C29] tracking-wide">
                        {language === 'en' ? 'Pattern Making Instructions — Front Pattern' : 'Cara Membuat Pola — Pola Depan'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[#8F2635] text-xs font-semibold">
                      <span className="hidden sm:inline text-[11px] text-[#8C7D76]">
                        {isDressmakingFrontOpen ? (language === 'en' ? 'Hide' : 'Tutup') : (language === 'en' ? 'Show' : 'Buka')}
                      </span>
                      {isDressmakingFrontOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </button>
                  {isDressmakingFrontOpen && (
                    <div className="px-4 sm:px-6 py-4 bg-[#FCFAF7] select-text">
                      <FormattedPatternInstructions content={effectiveFrontDesc} accentColor="burgundy" />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 3. ZOOM PEMBUATAN KUPNAT BLOCK 🔴 */}
            <div className="w-full bg-white rounded-2xl border border-[#E8DED8] overflow-hidden shadow-xs">
              <div className="px-4 py-3 bg-[#FCFAF7] border-b border-[#E8DED8] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8F2635] shrink-0" />
                  <h4 className="font-serif text-sm font-bold text-[#332C29] tracking-wide">
                    {language === 'en' ? 'Zoom Front Dart Construction' : 'Zoom Pembuatan Kupnat'}
                  </h4>
                </div>
                <span className="text-[10.5px] font-mono text-[#8F2635] bg-[#F3E7E7] px-2 py-0.5 rounded border border-[#E8DED8]">
                  Zoom Pembuatan Kupnat 🔴
                </span>
              </div>
              <div className="w-full p-2 sm:p-4 flex items-center justify-center bg-[#FCFAF7]">
                {dressmakingSideDartImage && !hasSideDartImageError ? (
                  <img
                    src={dressmakingSideDartImage}
                    onError={() => setHasSideDartImageError(true)}
                    alt="Zoom Pembuatan Kupnat Pola Depan Sistem Dressmaking"
                    referrerPolicy="no-referrer"
                    className="w-full h-auto max-h-[70vh] object-contain filter contrast-[1.03] drop-shadow-xs rounded-lg transition-all"
                  />
                ) : (
                  <div className="w-full min-h-[180px] flex flex-col items-center justify-center text-xs text-[#8C7D76] bg-white rounded-xl border border-dashed border-[#DFD4CD] p-6 text-center">
                    <ImageIcon size={32} className="mb-2 text-[#DFD4CD]" />
                    <p className="font-medium text-[#6B5E57]">
                      {language === 'en' ? 'Dart zoom detail image not available yet.' : 'Gambar Zoom Pembuatan Kupnat belum tersedia.'}
                    </p>
                  </div>
                )}
              </div>

              {/* Deskripsi Pembuatan Kupnat tepat di bawah gambar Zoom Pembuatan Kupnat */}
              {effectiveSideDartDesc && (
                <div className="border-t border-[#E8DED8] bg-[#FAF6F3]/60">
                  <button
                    type="button"
                    id="toggle-pola-kupnat-desc"
                    onClick={() => setIsDressmakingKupnatOpen(!isDressmakingKupnatOpen)}
                    aria-expanded={isDressmakingKupnatOpen}
                    className="w-full px-4 sm:px-5 py-3 flex items-center justify-between text-left hover:bg-[#FAF6F3] transition-colors cursor-pointer border-b border-[#E8DED8]"
                  >
                    <div className="flex items-center gap-2">
                      <FileText size={15} className="text-[#8F2635]" />
                      <span className="font-serif text-xs sm:text-sm font-bold text-[#332C29] tracking-wide">
                        {language === 'en' ? 'Pattern Making Instructions — Front Dart Construction' : 'Cara Membuat Pola — Pembuatan Kupnat Depan'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[#8F2635] text-xs font-semibold">
                      <span className="hidden sm:inline text-[11px] text-[#8C7D76]">
                        {isDressmakingKupnatOpen ? (language === 'en' ? 'Hide' : 'Tutup') : (language === 'en' ? 'Show' : 'Buka')}
                      </span>
                      {isDressmakingKupnatOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </button>
                  {isDressmakingKupnatOpen && (
                    <div className="px-4 sm:px-6 py-4 bg-[#FCFAF7] select-text">
                      <FormattedPatternInstructions content={effectiveSideDartDesc} accentColor="burgundy" />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Subtitle footer badge */}
            <div className="mt-2 text-center">
              <span className="text-[11px] font-mono text-[#6B5E57] bg-[#E8DED8] px-2.5 py-0.5 rounded-md">
                {language === 'en'
                  ? 'Blueprint Master Konstruksi Pola Dressmaking • Pola Belakang → Pola Depan → Zoom Pembuatan Kupnat'
                  : 'Blueprint Master Konstruksi Pola Dressmaking • Pola Belakang → Pola Depan → Zoom Pembuatan Kupnat'}
              </span>
            </div>
          </div>
        ) : (
          <div className={`w-full ${isBodice ? 'max-w-none pt-0 pb-2' : 'max-w-4xl pt-0.5 pb-3'} relative flex flex-col items-center select-none`}>
            <div className={`w-full ${isBodice ? 'flex items-start justify-center p-0 sm:p-1' : isRokSederhana ? 'h-[350px] xs:h-[410px] sm:h-[480px] md:h-[520px] flex items-center justify-center p-0.5 sm:p-1' : 'h-[320px] xs:h-[380px] sm:h-[460px] md:h-[500px] flex items-center justify-center p-0.5 sm:p-1'} overflow-hidden`}>
              {imageUrl && !hasImageError ? (
                <div
                  className="relative w-full h-full flex items-center justify-center transition-transform duration-200 ease-out origin-center"
                  style={{
                    transform: `scale(${zoomScale})`,
                  }}
                >
                  <img
                    src={imageUrl}
                    onError={() => setHasImageError(true)}
                    alt={isBodice ? 'La Moda Bodice Master Pattern' : isRokLipitSearah ? 'Blueprint Pola Rok Lipit Searah' : isRokPiasGodet ? 'Blueprint Pola Rok Pias & Godet' : 'La Moda Skirt Master Pattern (Pola Depan Merah & Pola Belakang Biru)'}
                    referrerPolicy="no-referrer"
                    className={`w-full ${isBodice ? 'h-auto max-h-[85vh]' : 'h-full'} object-contain filter contrast-[1.04] drop-shadow-xs rounded-lg transition-all`}
                  />
                </div>
              ) : (
                <div className={`w-full ${isBodice ? 'min-h-[260px]' : 'h-full'} flex flex-col items-center justify-center text-xs text-[#8C7D76] bg-[#FCFAF7] rounded-xl border border-dashed border-[#DFD4CD] p-6 text-center`}>
                  <ImageIcon size={32} className="mb-2 text-[#DFD4CD]" />
                  <p className="font-medium text-[#6B5E57]">{language === 'en' ? 'Pattern image not available yet.' : 'Gambar pola belum tersedia.'}</p>
                </div>
              )}
            </div>
            <div className={`${isRokSederhana ? 'mt-1 sm:mt-1.5' : 'mt-2'} text-center px-1`}>
              <span className={`${isRokSederhana ? 'text-[clamp(0.48rem,0.42rem+0.16vw,0.625rem)] font-sans tracking-normal text-[#8C7D76] bg-[#F5EFEB]/90 border border-[#E8DED8]/70 px-2 py-0.5 rounded-md leading-tight inline-block max-w-full' : 'text-[11px] font-mono text-[#6B5E57] bg-[#E8DED8] px-2.5 py-0.5 rounded-md'}`}>
                {isRokLingkaran
                  ? (circleSkirtModel === 'full'
                      ? (language === 'en' ? 'Blueprint Master Pattern • Full Circle Skirt (360°)' : 'Blueprint Master Konstruksi Pola • Rok Lingkaran Penuh (360°)')
                      : (language === 'en' ? 'Blueprint Master Pattern • Half Circle Skirt (180°)' : 'Blueprint Master Konstruksi Pola • Rok Setengah Lingkaran (180°)'))
                  : isTieredSkirt
                  ? (language === 'en' ? 'Blueprint Master Pattern • Tiered Gathered Skirt' : 'Blueprint Master Konstruksi Pola • Pola Rok Kerut Bertingkat')
                  : isPolaCelana
                  ? (language === 'en' ? 'Blueprint Master Pattern • Pajama Pants' : 'Blueprint Master Konstruksi Pola • Pola Celana Piyama')
                  : isRokLipitSearah
                  ? (language === 'en' ? 'Blueprint Master Pattern • One-Way Pleated Skirt' : 'Blueprint Master Konstruksi Pola • Pola Rok Lipit Searah')
                  : isRokPiasGodet
                  ? (language === 'en' ? 'Blueprint Master Pattern • Pias & Godet Skirt' : 'Blueprint Master Konstruksi Pola • Pola Rok Pias & Godet')
                  : (language === 'en' ? 'Original La Moda Pattern Drafting Blueprint • Pola Depan & Belakang' : 'Blueprint Master Konstruksi Pola La Moda • Pola Depan & Belakang')}
              </span>
            </div>

            {/* Explanation Note for Tiered Skirt (Identical Front & Back Construction) */}
            {isTieredSkirt && (
              <div className="w-full max-w-2xl mt-3 px-4 py-2.5 bg-amber-50/80 rounded-xl border border-amber-200/80 text-center">
                <p className="text-xs font-medium text-amber-900 flex items-center justify-center gap-1.5">
                  <Info size={14} className="text-amber-700 shrink-0" />
                  <span>
                    {language === 'en'
                      ? 'Front and back patterns use exactly the same construction.'
                      : 'Pola depan dan pola belakang menggunakan bentuk konstruksi yang sama.'}
                  </span>
                </p>
              </div>
            )}

            {/* Collapsible Pattern Drafting Instructions Below Pattern Image */}
            <div className={`w-full max-w-4xl ${isRokSederhana ? 'mt-[clamp(0.5rem,0.35rem+0.5vw,1.5rem)] pt-[clamp(0.35rem,0.25rem+0.4vw,1rem)] space-y-[clamp(0.35rem,0.22rem+0.35vw,0.75rem)]' : 'mt-6 pt-4 space-y-3'} border-t border-[#E8DED8] select-text`}>
              {isTieredSkirt ? (
                /* DEDICATED INSTRUCTIONS FOR TIERED SKIRT */
                (effectiveFrontDesc || effectiveLegacyDesc) && (
                  <div key="accordion-tiered-skirt" className="bg-white rounded-xl border border-[#E8DED8] overflow-hidden shadow-xs transition-all">
                    <button
                      type="button"
                      id="accordion-toggle-pola-rok-kerut-bertingkat"
                      onClick={() => setIsFrontOpen(!isFrontOpen)}
                      aria-expanded={isFrontOpen}
                      className="w-full px-4 sm:px-5 py-3.5 flex items-center justify-between text-left hover:bg-[#FAF6F3] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#8F2635] shrink-0"></span>
                        <span className="font-serif text-xs sm:text-sm font-bold text-[#332C29] tracking-wide">
                          {language === 'en'
                            ? (tierCount >= 4 ? 'Pattern Making Instructions — Tier 4' : 'Pattern Making Instructions — Tier 3')
                            : (tierCount >= 4 ? 'Cara Membuat Pola — Tingkat 4' : 'Cara Membuat Pola — Tingkat 3')}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[#8F2635] text-xs font-semibold">
                        <span className="hidden sm:inline text-[11px] text-[#8C7D76]">
                          {isFrontOpen ? (language === 'en' ? 'Hide' : 'Tutup') : (language === 'en' ? 'Show' : 'Buka')}
                        </span>
                        {isFrontOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </button>

                    {isFrontOpen && (
                      <div className="px-4 sm:px-6 py-4 bg-[#FCFAF7] border-t border-[#E8DED8] animate-fadeIn">
                        <FormattedPatternInstructions content={effectiveFrontDesc || effectiveLegacyDesc || ''} accentColor="burgundy" />
                      </div>
                    )}
                  </div>
                )
              ) : isRokLingkaran ? (
                /* DEDICATED SINGLE MODEL INSTRUCTIONS FOR ROK LINGKARAN */
                circleSkirtModel === 'full' ? (
                  (effectiveFrontDesc || effectiveLegacyDesc) && (
                    <div key="accordion-full-circle" className="bg-white rounded-xl border border-[#E8DED8] overflow-hidden shadow-xs transition-all">
                      <button
                        type="button"
                        id="accordion-toggle-pola-rok-lingkaran-penuh"
                        onClick={() => setIsFrontOpen(!isFrontOpen)}
                        aria-expanded={isFrontOpen}
                        className="w-full px-4 sm:px-5 py-3.5 flex items-center justify-between text-left hover:bg-[#FAF6F3] transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#8F2635] shrink-0"></span>
                          <span className="font-serif text-xs sm:text-sm font-bold text-[#332C29] tracking-wide">
                            {language === 'en' ? 'Pattern Making Instructions — Full Circle Skirt (360°)' : 'Cara Membuat Pola — Rok Lingkaran Penuh (360°)'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[#8F2635] text-xs font-semibold">
                          <span className="hidden sm:inline text-[11px] text-[#8C7D76]">
                            {isFrontOpen ? (language === 'en' ? 'Hide' : 'Tutup') : (language === 'en' ? 'Show' : 'Buka')}
                          </span>
                          {isFrontOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                      </button>

                      {isFrontOpen && (
                        <div className="px-4 sm:px-6 py-4 bg-[#FCFAF7] border-t border-[#E8DED8] animate-fadeIn">
                          <FormattedPatternInstructions content={effectiveFrontDesc || effectiveLegacyDesc || ''} accentColor="burgundy" />
                        </div>
                      )}
                    </div>
                  )
                ) : (
                  (effectiveBackDesc || effectiveLegacyDesc) && (
                    <div key="accordion-half-circle" className="bg-white rounded-xl border border-[#E8DED8] overflow-hidden shadow-xs transition-all">
                      <button
                        type="button"
                        id="accordion-toggle-pola-rok-setengah-lingkaran"
                        onClick={() => setIsBackOpen(!isBackOpen)}
                        aria-expanded={isBackOpen}
                        className="w-full px-4 sm:px-5 py-3.5 flex items-center justify-between text-left hover:bg-[#FAF6F3] transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#1D4ED8] shrink-0"></span>
                          <span className="font-serif text-xs sm:text-sm font-bold text-[#332C29] tracking-wide">
                            {language === 'en' ? 'Pattern Making Instructions — Half Circle Skirt (180°)' : 'Cara Membuat Pola — Rok Setengah Lingkaran (180°)'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[#1D4ED8] text-xs font-semibold">
                          <span className="hidden sm:inline text-[11px] text-[#8C7D76]">
                            {isBackOpen ? (language === 'en' ? 'Hide' : 'Tutup') : (language === 'en' ? 'Show' : 'Buka')}
                          </span>
                          {isBackOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                      </button>

                      {isBackOpen && (
                        <div className="px-4 sm:px-6 py-4 bg-[#FCFAF7] border-t border-[#E8DED8] animate-fadeIn">
                          <FormattedPatternInstructions content={effectiveBackDesc || effectiveLegacyDesc || ''} accentColor="blue" />
                        </div>
                      )}
                    </div>
                  )
                )
              ) : isRokLipitSearah ? (
                /* DEDICATED INSTRUCTIONS FOR ROK LIPIT SEARAH (ONE PATTERN ONLY — NO FRONT/BACK DESIGNATION) */
                <div key="accordion-rok-lipit-searah" className="bg-white rounded-xl border border-[#E8DED8] overflow-hidden shadow-xs transition-all">
                  <button
                    type="button"
                    id="accordion-toggle-pola-rok-lipit-searah"
                    onClick={() => setIsFrontOpen(!isFrontOpen)}
                    aria-expanded={isFrontOpen}
                    className="w-full px-4 sm:px-5 py-3.5 flex items-center justify-between text-left hover:bg-[#FAF6F3] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#8F2635] shrink-0"></span>
                      <span className="font-serif text-xs sm:text-sm font-bold text-[#332C29] tracking-wide">
                        {language === 'en' ? 'Pattern Making Instructions — One-Way Pleated Skirt' : 'Cara Membuat Pola — Rok Lipit Searah'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[#8F2635] text-xs font-semibold">
                      <span className="hidden sm:inline text-[11px] text-[#8C7D76]">
                        {isFrontOpen ? (language === 'en' ? 'Hide' : 'Tutup') : (language === 'en' ? 'Show' : 'Buka')}
                      </span>
                      {isFrontOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </button>

                  {isFrontOpen && (
                    <div className="px-4 sm:px-6 py-4 bg-[#FCFAF7] border-t border-[#E8DED8] animate-fadeIn">
                      {(effectiveFrontDesc || effectiveLegacyDesc || patternDescription) ? (
                        <FormattedPatternInstructions content={effectiveFrontDesc || effectiveLegacyDesc || patternDescription || ''} accentColor="burgundy" />
                      ) : (
                        <p className="text-xs text-[#8C7D76] italic font-sans py-1">
                          {language === 'en'
                            ? 'Pattern making instructions in English have not been configured yet in the Admin panel.'
                            : 'Instruksi pembuatan pola belum dikonfigurasi di panel Admin.'}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Front Accordion Component */}
                  {(() => {
                    const frontAccordion = effectiveFrontDesc ? (
                      <div key="accordion-front" className="bg-white rounded-xl border border-[#E8DED8] overflow-hidden shadow-xs transition-all">
                        <button
                          type="button"
                          id={isPolaCelana ? "accordion-toggle-cara-pembuatan-pola" : isRokPiasGodet ? "accordion-toggle-pola-pias" : "accordion-toggle-pola-depan"}
                          onClick={() => setIsFrontOpen(!isFrontOpen)}
                          aria-expanded={isFrontOpen}
                          className={`w-full ${isRokSederhana ? 'px-[clamp(0.35rem,0.22rem+0.35vw,1.25rem)] py-[clamp(0.28rem,0.18rem+0.28vw,0.75rem)]' : 'px-4 sm:px-5 py-3.5'} flex items-center justify-between text-left hover:bg-[#FAF6F3] transition-colors cursor-pointer`}
                        >
                          <div className={`flex items-center ${isRokSederhana ? 'gap-[clamp(0.2rem,0.14rem+0.2vw,0.5rem)]' : 'gap-2.5'} min-w-0`}>
                            <span className={`${isRokSederhana ? 'size-[clamp(0.35rem,0.28rem+0.2vw,0.625rem)]' : 'w-2.5 h-2.5'} rounded-full bg-[#8F2635] shrink-0`}></span>
                            <span className={`font-serif ${isRokSederhana ? 'text-[clamp(0.58rem,0.48rem+0.35vw,0.8125rem)] tracking-tight sm:tracking-wide whitespace-nowrap' : 'text-xs sm:text-sm tracking-wide'} font-bold text-[#332C29] leading-tight`}>
                              {isPolaCelana
                                ? (language === 'en' ? 'Pattern Drafting Instructions' : 'Cara Pembuatan Pola')
                                : isRokPiasGodet
                                ? (language === 'en' ? 'Pattern Making Instructions — Pias' : 'Cara Membuat Pola — Pias')
                                : (language === 'en' ? 'Pattern Making Instructions — Front Pattern' : 'Cara Membuat Pola — Pola Depan')}
                            </span>
                          </div>
                          <div className={`flex items-center gap-1 text-[#8F2635] ${isRokSederhana ? 'text-[clamp(0.5625rem,0.48rem+0.25vw,0.75rem)]' : 'text-xs'} font-semibold shrink-0`}>
                            <span className="hidden sm:inline text-[11px] text-[#8C7D76]">
                              {isFrontOpen ? (language === 'en' ? 'Hide' : 'Tutup') : (language === 'en' ? 'Show' : 'Buka')}
                            </span>
                            {isFrontOpen ? <ChevronUp className={isRokSederhana ? 'size-[clamp(0.75rem,0.65rem+0.25vw,1rem)]' : 'size-4'} /> : <ChevronDown className={isRokSederhana ? 'size-[clamp(0.75rem,0.65rem+0.25vw,1rem)]' : 'size-4'} />}
                          </div>
                        </button>

                        {isFrontOpen && (
                          <div className={`${isRokSederhana ? 'px-[clamp(0.35rem,0.22rem+0.35vw,1.5rem)] py-[clamp(0.3rem,0.2rem+0.3vw,1rem)]' : 'px-4 sm:px-6 py-4'} bg-[#FCFAF7] border-t border-[#E8DED8] animate-fadeIn`}>
                            <FormattedPatternInstructions content={effectiveFrontDesc} accentColor="burgundy" isFluid={isRokSederhana} />
                          </div>
                        )}
                      </div>
                    ) : null;

                    const backAccordion = effectiveBackDesc ? (
                      <div key="accordion-back" className="bg-white rounded-xl border border-[#E8DED8] overflow-hidden shadow-xs transition-all">
                        <button
                          type="button"
                          id={isRokPiasGodet ? "accordion-toggle-pola-godet" : "accordion-toggle-pola-belakang"}
                          onClick={() => setIsBackOpen(!isBackOpen)}
                          aria-expanded={isBackOpen}
                          className={`w-full ${isRokSederhana ? 'px-[clamp(0.35rem,0.22rem+0.35vw,1.25rem)] py-[clamp(0.28rem,0.18rem+0.28vw,0.75rem)]' : 'px-4 sm:px-5 py-3.5'} flex items-center justify-between text-left hover:bg-[#FAF6F3] transition-colors cursor-pointer`}
                        >
                          <div className={`flex items-center ${isRokSederhana ? 'gap-[clamp(0.2rem,0.14rem+0.2vw,0.5rem)]' : 'gap-2.5'} min-w-0`}>
                            <span className={`${isRokSederhana ? 'size-[clamp(0.35rem,0.28rem+0.2vw,0.625rem)]' : 'w-2.5 h-2.5'} rounded-full bg-[#332C29] shrink-0`}></span>
                            <span className={`font-serif ${isRokSederhana ? 'text-[clamp(0.58rem,0.48rem+0.35vw,0.8125rem)] tracking-tight sm:tracking-wide whitespace-nowrap' : 'text-xs sm:text-sm tracking-wide'} font-bold text-[#332C29] leading-tight`}>
                              {isRokPiasGodet
                                ? (language === 'en' ? 'Pattern Making Instructions — Godet' : 'Cara Membuat Pola — Godet')
                                : (language === 'en' ? 'Pattern Making Instructions — Back Pattern' : 'Cara Membuat Pola — Pola Belakang')}
                            </span>
                          </div>
                          <div className={`flex items-center gap-1 text-[#332C29] ${isRokSederhana ? 'text-[clamp(0.5625rem,0.48rem+0.25vw,0.75rem)]' : 'text-xs'} font-semibold shrink-0`}>
                            <span className="hidden sm:inline text-[11px] text-[#8C7D76]">
                              {isBackOpen ? (language === 'en' ? 'Hide' : 'Tutup') : (language === 'en' ? 'Show' : 'Buka')}
                            </span>
                            {isBackOpen ? <ChevronUp className={isRokSederhana ? 'size-[clamp(0.75rem,0.65rem+0.25vw,1rem)]' : 'size-4'} /> : <ChevronDown className={isRokSederhana ? 'size-[clamp(0.75rem,0.65rem+0.25vw,1rem)]' : 'size-4'} />}
                          </div>
                        </button>

                        {isBackOpen && (
                          <div className={`${isRokSederhana ? 'px-[clamp(0.35rem,0.22rem+0.35vw,1.5rem)] py-[clamp(0.3rem,0.2rem+0.3vw,1rem)]' : 'px-4 sm:px-6 py-4'} bg-[#FCFAF7] border-t border-[#E8DED8] animate-fadeIn`}>
                            <FormattedPatternInstructions content={effectiveBackDesc} accentColor="charcoal" isFluid={isRokSederhana} />
                          </div>
                        )}
                      </div>
                    ) : null;

                    return isBackFirst ? (
                      <>
                        {backAccordion}
                        {frontAccordion}
                      </>
                    ) : (
                      <>
                        {frontAccordion}
                        {backAccordion}
                      </>
                    );
                  })()}

                  {/* 3. Fallback Legacy Accordion if only single patternDescription is set */}
                  {effectiveLegacyDesc ? (
                    <div className="bg-white rounded-xl border border-[#E8DED8] overflow-hidden shadow-xs transition-all">
                      <button
                        type="button"
                        id="accordion-toggle-pola-legacy"
                        onClick={() => setIsLegacyOpen(!isLegacyOpen)}
                        aria-expanded={isLegacyOpen}
                        className={`w-full ${isRokSederhana ? 'px-[clamp(0.35rem,0.22rem+0.35vw,1.25rem)] py-[clamp(0.28rem,0.18rem+0.28vw,0.75rem)]' : 'px-4 sm:px-5 py-3.5'} flex items-center justify-between text-left hover:bg-[#FAF6F3] transition-colors cursor-pointer`}
                      >
                        <div className={`flex items-center ${isRokSederhana ? 'gap-[clamp(0.2rem,0.14rem+0.2vw,0.5rem)]' : 'gap-2.5'} min-w-0`}>
                          <span className={`${isRokSederhana ? 'size-[clamp(0.35rem,0.28rem+0.2vw,0.625rem)]' : 'w-2.5 h-2.5'} rounded-full bg-[#8F2635] shrink-0`}></span>
                          <span className={`font-serif ${isRokSederhana ? 'text-[clamp(0.58rem,0.48rem+0.35vw,0.8125rem)] tracking-tight sm:tracking-wide whitespace-nowrap' : 'text-xs sm:text-sm tracking-wide'} font-bold text-[#332C29] leading-tight`}>
                            {isPolaCelana
                              ? (language === 'en' ? 'Pattern Drafting Instructions' : 'Cara Pembuatan Pola')
                              : (language === 'en' ? 'Pattern Making Instructions' : 'Cara Membuat Pola')}
                          </span>
                        </div>
                        <div className={`flex items-center gap-1 text-[#8F2635] ${isRokSederhana ? 'text-[clamp(0.5625rem,0.48rem+0.25vw,0.75rem)]' : 'text-xs'} font-semibold shrink-0`}>
                          <span className="hidden sm:inline text-[11px] text-[#8C7D76]">
                            {isLegacyOpen ? (language === 'en' ? 'Hide' : 'Tutup') : (language === 'en' ? 'Show' : 'Buka')}
                          </span>
                          {isLegacyOpen ? <ChevronUp className={isRokSederhana ? 'size-[clamp(0.75rem,0.65rem+0.25vw,1rem)]' : 'size-4'} /> : <ChevronDown className={isRokSederhana ? 'size-[clamp(0.75rem,0.65rem+0.25vw,1rem)]' : 'size-4'} />}
                        </div>
                      </button>

                      {isLegacyOpen && (
                        <div className={`${isRokSederhana ? 'px-[clamp(0.35rem,0.22rem+0.35vw,1.5rem)] py-[clamp(0.3rem,0.2rem+0.3vw,1rem)]' : 'px-4 sm:px-6 py-4'} bg-[#FCFAF7] border-t border-[#E8DED8] animate-fadeIn`}>
                          <FormattedPatternInstructions content={effectiveLegacyDesc} accentColor="burgundy" isFluid={isRokSederhana} />
                        </div>
                      )}
                    </div>
                  ) : null}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
