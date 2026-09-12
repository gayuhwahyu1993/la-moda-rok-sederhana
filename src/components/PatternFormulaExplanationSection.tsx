import React from 'react';
import { BookOpen, Sparkles, Info } from 'lucide-react';
import { useLanguage } from '../i18n';
import { formatDraftingPrecision } from '../data/patternData';
import { getSequentialPointLetter } from '../data/calculators/rokLipitSearah';
import { CircleSkirtFormulaDisplay } from './CircleSkirtFormulaDisplay';

interface PatternFormulaExplanationSectionProps {
  measurementsMap: Record<string, number>;
  calculatorId?: string;
  hasCalculations?: boolean;
  circleSkirtModel?: 'full' | 'half';
  tierCount?: number;
  panelCount?: number;
  kulotAcMethod?: 'tinggi-duduk' | 'tinggi-panggul-range';
}

interface CompactFormulaBlockProps {
  point: string;
  formulaDesc?: string;
  formula?: string;
  substitution?: string;
  finalResult?: string;
  result?: string;
  isFrontSide?: boolean;
  pointWidthClass?: string;
}

const CompactFormulaBlock: React.FC<CompactFormulaBlockProps> = ({
  point,
  formulaDesc,
  formula,
  substitution,
  finalResult,
  result,
  isFrontSide = true,
  pointWidthClass = 'w-24 sm:w-28 shrink-0',
}) => {
  const rawResult = finalResult ?? result ?? '';
  const resultWithUnit = rawResult ? (rawResult.includes('cm') ? rawResult : `${rawResult} cm`) : '';
  const displayDesc = formulaDesc || formula || '';

  // Clean substitution and result to check if substitution is an actual calculation step
  // (contains arithmetic operators) or just a direct measurement / duplicate number
  const cleanSub = (substitution ?? '').replace(/cm/gi, '').trim();
  const cleanRes = (rawResult ?? '').replace(/cm/gi, '').trim();

  // If substitution is identical to result or has no math operators (e.g. "+", "-", "*", "/", "÷", "×", "|"),
  // treat as a direct measurement or constant -> do NOT show `= sub = res`, show only `= res`
  const hasArithmetic = /[+\-*\/÷×|]/.test(cleanSub) && cleanSub !== cleanRes;
  const showIntermediateSubstitution = Boolean(substitution && hasArithmetic);

  return (
    <div className="bg-white rounded-lg px-3.5 py-2 sm:px-4 sm:py-2.5 border border-[#E8DED8] shadow-2xs hover:border-[#D5C7BF] transition-all flex items-start gap-2.5 sm:gap-3.5">
      {/* COLUMN 1: Pattern Point Identifier (Flexible / Configurable Width) */}
      <div className={`${pointWidthClass} pt-0.5`}>
        <span
          className={`font-mono font-bold text-xs sm:text-sm tracking-tight whitespace-nowrap ${
            isFrontSide ? 'text-[#8F2635]' : 'text-[#1D4ED8]'
          }`}
          style={{ whiteSpace: 'nowrap' }}
        >
          {point}
        </span>
      </div>

      {/* COLUMN 2: Formula & Substituted Calculation (Remaining Width) */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        {/* Line 1: Formula description */}
        <div className="text-xs sm:text-sm font-medium text-[#524640] leading-snug min-h-[1.15rem] sm:min-h-[1.25rem]">
          {displayDesc ? displayDesc : <span>&nbsp;</span>}
        </div>

        {/* Line 2: Substituted calculation + final result */}
        <div className="text-xs sm:text-sm font-mono text-[#4A423B] mt-0.5 flex items-baseline gap-1 flex-wrap leading-snug">
          {showIntermediateSubstitution ? (
            <>
              <span>= {substitution} =</span>
              <span
                className={`font-bold ${
                  isFrontSide ? 'text-[#8F2635]' : 'text-[#1D4ED8]'
                }`}
              >
                {resultWithUnit}
              </span>
            </>
          ) : (
            <>
              <span>=</span>
              <span
                className={`font-bold ${
                  isFrontSide ? 'text-[#8F2635]' : 'text-[#1D4ED8]'
                }`}
              >
                {resultWithUnit}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export const PatternFormulaExplanationSection: React.FC<PatternFormulaExplanationSectionProps> = ({
  measurementsMap,
  calculatorId = 'rok',
  hasCalculations = true,
  circleSkirtModel = 'full',
  tierCount = 3,
  panelCount = 6,
  kulotAcMethod = 'tinggi-duduk',
}) => {
  const { t, language } = useLanguage();

  const isBadanDressmaking = calculatorId === 'badan-dressmaking' || calculatorId === 'basic-bodice-dressmaking' || (calculatorId?.includes('dressmaking') && calculatorId?.includes('badan'));
  const isBadanIndonesia = calculatorId === 'badan-indonesia' || calculatorId === 'basic-bodice-indonesia' || (calculatorId?.includes('indonesia') && calculatorId?.includes('badan'));
  const isBadanSederhana = calculatorId === 'badan-sederhana' || calculatorId === 'badan' || calculatorId === 'basic-bodice-sederhana';
  const isPolaLengan = calculatorId === 'pola-lengan' || calculatorId === 'lengan' || calculatorId === 'basic-sleeve';
  const isPolaCelana = calculatorId === 'pola-celana-piyama' || calculatorId === 'celana-piyama' || calculatorId === 'celana' || calculatorId === 'pajama-pants' || calculatorId?.includes('celana') || calculatorId?.includes('piyama');
  const isRokPiasGodet = calculatorId === 'rok-pias-godet' || calculatorId === 'pias-godet' || calculatorId === 'rok-pias' || calculatorId === 'pias' || calculatorId === 'godet';
  const isRokLipitSearah = calculatorId === 'rok-lipit-searah' || calculatorId === 'rok-lipit' || calculatorId === 'lipit-searah' || calculatorId === 'lipit' || calculatorId?.includes('lipit');
  const isKulot = calculatorId === 'pola-kulot' || calculatorId === 'kulot' || calculatorId === 'culottes' || calculatorId === 'culotte-pants';
  const isRokLingkaran = calculatorId === 'rok-lingkaran' || calculatorId === 'lingkaran';
  const isTieredSkirt = calculatorId === 'pola-rok-kerut-bertingkat' || calculatorId === 'rok-kerut-bertingkat' || calculatorId === 'rok-kerut' || calculatorId === 'tiered-skirt';
  const isSederhana = calculatorId === 'rok' || calculatorId === 'rok-sederhana';
  const isDressmaking = calculatorId === 'rok-dressmaking';
  const isIndonesia = calculatorId === 'rok-indonesia';

  const systemDisplayName = isKulot
    ? (language === 'en' ? 'Kulot (Culottes) Pattern Calculator' : 'Kalkulator Pola Kulot')
    : isPolaCelana
    ? (language === 'en' ? 'Basic Pajama Pants Pattern Calculator' : 'Pola Dasar Celana Piyama')
    : isPolaLengan
    ? (language === 'en' ? 'Basic Sleeve Pattern Calculator' : 'Pola Dasar Lengan')
    : isRokPiasGodet
    ? (language === 'en' ? 'Gored Skirt & Godet Pattern' : 'Pola Rok Pias & Godet')
    : isRokLipitSearah
    ? (language === 'en' ? 'One-Way Pleated Skirt Pattern' : 'Pola Rok Lipit Searah')
    : isTieredSkirt
    ? (language === 'en' ? 'Tiered Gathered Skirt Pattern' : 'Pola Rok Kerut Bertingkat')
    : isRokLingkaran
    ? (language === 'en' ? 'Circle & Half Circle Skirt' : 'Rok Lingkaran & Setengah Lingkaran')
    : isBadanDressmaking
    ? (language === 'en' ? 'Pola Dasar Badan Wanita — Dressmaking System' : 'Pola Dasar Badan Wanita — Sistem Dressmaking')
    : isBadanIndonesia
    ? (language === 'en' ? 'Pola Dasar Badan Wanita — Indonesian System' : 'Pola Dasar Badan Wanita — Sistem Indonesia')
    : isBadanSederhana
    ? (language === 'en' ? 'Pola Dasar Badan Wanita — Standard System' : 'Pola Dasar Badan Wanita — Sistem Sederhana')
    : isIndonesia
    ? (language === 'en' ? 'Pola Dasar Rok — Indonesian System' : 'Pola Dasar Rok — Sistem Indonesia')
    : isDressmaking
    ? (language === 'en' ? 'Pola Dasar Rok — Dressmaking System' : 'Pola Dasar Rok — Sistem Dressmaking')
    : (language === 'en' ? 'Pola Dasar Rok — Standard System' : 'Pola Dasar Rok — Sistem Sederhana');

  // Dynamic user measurements (Kulot)
  const panjangKulot = measurementsMap.panjangKulot ?? 55;
  const tdKulot = measurementsMap.tinggiDuduk ?? 21;
  const tpKulot = measurementsMap.tinggiPanggul ?? 18;
  const lpgKulot = measurementsMap.lingkarPanggul ?? 84;
  const lpesakKulot = measurementsMap.lingkarPesak ?? 56;
  const kulotFrontCC = (lpgKulot / 10) - 2;
  const kulotBackCC = (lpgKulot / 10) + 2;

  // Dynamic user measurements (Pajama Pants)
  const pc = measurementsMap.panjangCelana ?? 60;
  const tduduk = measurementsMap.tinggiDuduk ?? 18;
  const lpk = measurementsMap.lingkarPipaKaki ?? 36;

  // Dynamic user measurements (Rok & Godet)
  const lp = measurementsMap.lingkarPinggang ?? 67;
  const tp = measurementsMap.tinggiPanggul ?? 19;
  const lpg = measurementsMap.lingkarPanggul ?? 94;
  const pr = measurementsMap.panjangRok ?? 50;
  const tg = measurementsMap.tinggiGodet ?? 25;
  const lg = measurementsMap.lebarGodet ?? 15;
  const N = Math.max(2, Math.round(panelCount || 6));

  // Dynamic user measurements (Lengan)
  const tpl = measurementsMap.tinggiPuncakLengan ?? 13;
  const lkl = measurementsMap.lingkarKerungLengan ?? 42;
  const pl = measurementsMap.panjangLengan ?? 54;
  const llpl = measurementsMap.lingkarLubangPipaLengan ?? 24;

  // Dynamic user measurements (Badan)
  const pp = measurementsMap.panjangPunggung ?? 39;
  const ps = measurementsMap.panjangSisi ?? 19;
  const ll = measurementsMap.lingkarLeher ?? 36;
  const pb = measurementsMap.panjangBahu ?? 13;
  const pm = measurementsMap.panjangMuka ?? 36;
  const lm = measurementsMap.lebarMuka ?? 33;
  const lpung = measurementsMap.lebarPunggung ?? 35;
  const lb = measurementsMap.lingkarBadan ?? 85;
  const td = measurementsMap.tinggiDada ?? 20;
  const jd = measurementsMap.jarakDada ?? 18;
  const lping = measurementsMap.lingkarPinggang ?? 67;

  // Dynamic user measurements (Rok Lipit Searah)
  const jumlahLipit = measurementsMap.jumlahLipit ?? 12;
  const lebarKainTotal = measurementsMap.lebarKainTotal ?? 150;
  const nLipit = Math.max(1, Math.round(jumlahLipit));
  const lipitJarak = lp / nLipit;
  const lipitSisaKain = lebarKainTotal - 6 - lp;
  const lipitDalam = lipitSisaKain > 0 ? lipitSisaKain / nLipit : 0;
  const lipitSetengahDalam = lipitDalam / 2;

  // Localized decimal string formatter
  const formatVal = (val: number) => {
    const formatted = formatDraftingPrecision(val);
    return language === 'en' ? formatted : formatted.replace('.', ',');
  };

  // Dressmaking Bodice Calculations
  // 1. POLA BELAKANG (Back Pattern)
  const dmBackAB = pp;
  const dmBackAC = (ll / 6) + 1;
  const dmBackCD = pp / 2;
  const dmBackAE = (ll / 6) + 0.5;
  const dmBackEF = pb;
  const dmBackCG = (pp / 2) / 2;
  const dmBackGGprime = lpung / 2;
  const dmBackDDprime = (lb / 4) - 1;
  const dmBackBBprime = (lping / 4) - 1 + 3;
  const dmBackBH = lping / 10;

  // 2. POLA DEPAN (Front Pattern)
  const dmFrontAB = pm;
  const dmFrontAC = (ll / 6) + 2;
  const dmFrontAD = (ll / 6) + 1;
  const dmFrontDE = pb;
  const dmFrontFFprime = lm / 2;
  const dmFrontGGprime = (lb / 4) + 1;
  const dmFrontBBprime = (lping / 4) + 1 + 3;
  const dmFrontDP = td;
  const dmFrontPPprime = jd / 2;
  const dmFrontSideDart = Math.max(Math.abs(pm - pp), 3);

  // Bodice calculations
  const frontBodiceAB = pp + 1.5;
  const frontBodiceBC = (pp / 2) - 1;
  const frontBodiceAD = (ll / 6) + 2.5;
  const frontBodiceAAprime = (ll / 6) + 0.5;
  const frontBodiceDDprime = Math.max(((pp + 1.5 - ((pp / 2) - 1)) - ((ll / 6) + 2.5)) / 2, 5);
  const frontBodiceDDdoublePrime = lm / 2;
  const frontBodiceCCprime = (lb / 4) + 1;
  const frontBodiceFFprime = jd / 2;
  const frontBodiceBBdoublePrime = (lping / 4) + 1 + 3;

  const backBodiceAB = pp + 1.5;
  const backBodiceBC = (pp / 2) - 1;
  const backBodiceAAprime = (ll / 6) + 0.5;
  const backBodiceDDdoublePrime = (lm + 1) / 2;
  const backBodiceCCprime = (lb / 4) - 1;
  const backBodiceBF = (lping / 10) - 1;
  const backBodiceBBdoublePrime = (lping / 4) - 1 + 3;

  // Calculated values for Sistem Sederhana
  const frontAA = (lp / 4) + 1 + 3;
  const frontCC = (lpg / 4) + 1;
  const frontDD = (lpg / 4) + 1 + 3;
  const frontBE = (lp / 10) + 1;

  const backAA = (lp / 4) - 1 + 3;
  const backCC = (lpg / 4) - 1;
  const backDD = (lpg / 4) - 1 + 3;
  const backBE = (lp / 10) - 1;

  // Calculated values for Sistem Dressmaking
  const dressmakingFrontAA1 = (lp / 4) + 4;
  const dressmakingFrontAD = lp / 10;
  const dressmakingFrontCC1 = (lpg / 4) + 1;

  // Calculated values for Sistem Indonesia Rok
  const indonesiaFrontAE = (lp / 4) + 1;
  const indonesiaFrontCF = (lpg / 4) + 1;
  const indonesiaBackAE = (lp / 4) - 1 + 2;
  const indonesiaBackCF = (lpg / 4) - 1;
  const indonesiaBackBJ = (lp / 10) - 1;

  // Calculated values for Sistem Indonesia Badan
  const idFrontAB = pm;
  const idFrontBC = (ll / 6) + 2.5;
  const idFrontCD = (ll / 6) + 0.5;
  const idFrontAE = (lb / 4) + 1;
  const idFrontEF = ps;
  const idFrontCG = (lb / 4) + 1;
  const idFrontGH = pb / 3;
  const idFrontDI = pb;
  const idFrontDK = (pb / 2) - 1;
  const idFrontJL = (pb / 2) + 1;
  const idFrontAM = lping / 10;
  const idFrontKKprime = 0.5;
  const idFrontMN = td;
  const idFrontEP = 3;
  const idFrontPO = ((lping / 4) + 1) - (lping / 10);
  const idFrontBQ = 4;
  const qrVal = measurementsMap.jarakQR ?? 0;
  const idFrontST = Math.max(0, (lm / 2) - qrVal);

  const idBackAB = pp;
  const idBackBC = 1.5;
  const idBackCD = ll / 6;
  const idBackAE = (lb / 4) - 1;
  const idBackEF = ps;
  const idBackCG = (lb / 4) - 1;
  const idBackGH = Math.max((((pp - 1.5) - ps) / 4) - 1, 3.5);
  const idBackDI = pb;
  const idBackDK = (pb / 2) - 1;
  const idBackJL = (pb / 2) + 1;
  const idBackAM = (lping / 10) - 1;
  const idBackMO = 2;
  const idBackOP = ((lping / 4) - 1) - ((lping / 10) - 1);
  const idBackQR = lpung / 2;
  const idBackKT = 6;

  const constantLabel = language === 'en' ? 'Formula constant' : 'Ketetapan rumus';

  return (
    <section id="section-penjelasan-rumus" className="space-y-3 pt-3">
      {/* Section Header */}
      <div className="bg-[#FCFAF7] rounded-2xl border border-[#E8DED8] p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-[#E8DED8]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#8F2635] text-white flex items-center justify-center shadow-xs">
              <BookOpen size={19} />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#332C29] tracking-wide">
                {t.formulaExplanationTitle}
              </h2>
              <p className="text-xs sm:text-sm text-[#6B5E57] mt-0.5">
                {language === 'en'
                  ? 'Step-by-step mathematical breakdown connecting body measurements to pattern geometry'
                  : 'Penjelasan langkah demi langkah penurunan rumus dari ukuran tubuh ke konstruksi pola'}
              </p>
            </div>
          </div>

          {/* Pedagogical Principle Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#E8DED8]/60 border border-[#DFD4CD] text-xs font-mono font-medium text-[#4A423B]">
            <Sparkles size={13} className="text-[#8F2635]" />
            <span>
              {language === 'en'
                ? 'Body Measurement → Formula → Substituted Value → Final Pattern Measurement'
                : 'Ukuran Tubuh → Formula → Nilai Substitusi → Hasil Pola'}
            </span>
          </div>
        </div>

        {/* 0. POLA DASAR LENGAN UNIFIED FORMULA BREAKDOWN */}
        {isPolaLengan ? (
          <div className="max-w-2xl mx-auto pt-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2.5 border-b-2 border-[#8F2635]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#8F2635] shadow-2xs" />
                  <h3 className="font-serif text-base sm:text-lg font-bold text-[#8F2635] uppercase tracking-wider">
                    {language === 'en' ? 'BASIC SLEEVE PATTERN' : 'RUMUS POLA LENGAN'}
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-[#8F2635] bg-[#F3E7E7] px-2.5 py-0.5 rounded-full border border-[#E8DED8]">
                  5 {language === 'en' ? 'Formulas' : 'Perhitungan'}
                </span>
              </div>

              <div className="space-y-2">
                <CompactFormulaBlock
                  point="A – B"
                  pointWidthClass="w-36 sm:w-48 shrink-0"
                  formulaDesc={language === 'en' ? 'Sleeve Cap Height' : 'Tinggi Puncak Lengan'}
                  finalResult={`${formatVal(tpl)} cm`}
                  isFrontSide={true}
                />
                <CompactFormulaBlock
                  point="A – C = A – D"
                  pointWidthClass="w-36 sm:w-48 shrink-0"
                  formulaDesc={language === 'en' ? '½ Armhole Circumference − 0.5 cm' : '½ Lingkar Kerung Lengan − 0,5 cm'}
                  substitution={`(½ × ${formatVal(lkl)}) − 0,5 cm`}
                  finalResult={`${formatVal((lkl / 2) - 0.5)} cm`}
                  isFrontSide={true}
                />
                <CompactFormulaBlock
                  point="1/3 A – C = 1/3 A – D"
                  pointWidthClass="w-36 sm:w-48 shrink-0"
                  formulaDesc={language === 'en' ? '1/3 × (A – C)' : '1/3 × (A – C)'}
                  substitution={`1/3 × ${formatVal((lkl / 2) - 0.5)} cm`}
                  finalResult={`${formatVal(((lkl / 2) - 0.5) / 3)} cm`}
                  isFrontSide={true}
                />
                <CompactFormulaBlock
                  point="A – E"
                  pointWidthClass="w-36 sm:w-48 shrink-0"
                  formulaDesc={language === 'en' ? 'Sleeve Length' : 'Panjang Lengan'}
                  finalResult={`${formatVal(pl)} cm`}
                  isFrontSide={true}
                />
                <CompactFormulaBlock
                  point="E – F = E – G"
                  pointWidthClass="w-36 sm:w-48 shrink-0"
                  formulaDesc={language === 'en' ? '½ Sleeve Opening Circumference' : '½ Lingkar Pipa Lengan'}
                  substitution={`½ × ${formatVal(llpl)} cm`}
                  finalResult={`${formatVal(llpl / 2)} cm`}
                  isFrontSide={true}
                />
              </div>
            </div>
          </div>
        ) : isPolaCelana ? (
          <div className="max-w-2xl mx-auto pt-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2.5 border-b-2 border-[#8F2635]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#8F2635] shadow-2xs" />
                  <h3 className="font-serif text-base sm:text-lg font-bold text-[#8F2635] uppercase tracking-wider">
                    {language === 'en' ? 'BASIC PAJAMA PANTS PATTERN' : 'RUMUS POLA DASAR CELANA PIYAMA'}
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-[#8F2635] bg-[#F3E7E7] px-2.5 py-0.5 rounded-full border border-[#E8DED8]">
                  9 {language === 'en' ? 'Formulas' : 'Perhitungan'}
                </span>
              </div>

              <div className="space-y-2">
                <CompactFormulaBlock
                  point="A – B = C – D"
                  pointWidthClass="w-36 sm:w-48 shrink-0"
                  formulaDesc={language === 'en' ? '½ (Hip Circumference + 10 cm)' : '½ (Lingkar Panggul + 10 cm)'}
                  substitution={`½ × (${formatVal(lpg)} + 10)`}
                  finalResult={`${formatVal((lpg + 10) / 2)} cm`}
                  isFrontSide={true}
                />
                <CompactFormulaBlock
                  point="E – F"
                  pointWidthClass="w-36 sm:w-48 shrink-0"
                  formulaDesc={language === 'en' ? 'Sitting Height + 7 cm (Construction Allowance)' : 'Tinggi Duduk + 7 cm (Kelonggaran Konstruksi)'}
                  substitution={`${formatVal(tduduk)} + 7`}
                  finalResult={`${formatVal(tduduk + 7)} cm`}
                  isFrontSide={true}
                />
                <CompactFormulaBlock
                  point="D – G"
                  pointWidthClass="w-36 sm:w-48 shrink-0"
                  formulaDesc={language === 'en' ? '(1/10 × Hip Circumference) + 2.5 cm (Back Crotch)' : '(1/10 × Lingkar Panggul) + 2,5 cm (Pesak Belakang)'}
                  substitution={`(1/10 × ${formatVal(lpg)}) + 2,5`}
                  finalResult={`${formatVal((lpg / 10) + 2.5)} cm`}
                  isFrontSide={true}
                />
                <CompactFormulaBlock
                  point="C – H"
                  pointWidthClass="w-36 sm:w-48 shrink-0"
                  formulaDesc={language === 'en' ? '½ (D – G) (Front Crotch)' : '½ (D – G) (Pesak Depan)'}
                  substitution={`½ × ${formatVal((lpg / 10) + 2.5)}`}
                  finalResult={`${formatVal(((lpg / 10) + 2.5) / 2)} cm`}
                  isFrontSide={true}
                />
                <CompactFormulaBlock
                  point="E – I"
                  pointWidthClass="w-36 sm:w-48 shrink-0"
                  formulaDesc={language === 'en' ? 'Pants Length' : 'Panjang Celana'}
                  finalResult={`${formatVal(pc)} cm`}
                  isFrontSide={true}
                />
                <CompactFormulaBlock
                  point="I – J"
                  pointWidthClass="w-36 sm:w-48 shrink-0"
                  formulaDesc={language === 'en' ? '½ Leg Opening Circumference − 2 cm (Front Opening)' : '½ Lingkar Pipa Kaki − 2 cm (Pipa Depan)'}
                  substitution={`(½ × ${formatVal(lpk)}) − 2`}
                  finalResult={`${formatVal((lpk / 2) - 2)} cm`}
                  isFrontSide={true}
                />
                <CompactFormulaBlock
                  point="I – K"
                  pointWidthClass="w-36 sm:w-48 shrink-0"
                  formulaDesc={language === 'en' ? '½ Leg Opening Circumference + 2 cm (Back Opening)' : '½ Lingkar Pipa Kaki + 2 cm (Pipa Belakang)'}
                  substitution={`(½ × ${formatVal(lpk)}) + 2`}
                  finalResult={`${formatVal((lpk / 2) + 2)} cm`}
                  isFrontSide={true}
                />
                <CompactFormulaBlock
                  point="B"
                  pointWidthClass="w-36 sm:w-48 shrink-0"
                  formulaDesc={language === 'en' ? 'Raise 3 cm (Back Waist Rise)' : 'Naik 3 cm (Pinggang Belakang)'}
                  finalResult="3 cm"
                  isFrontSide={true}
                />
              </div>
            </div>
          </div>
        ) : isRokPiasGodet ? (
          <div className="pt-5 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {/* LEFT COLUMN: POLA ROK PIAS (1 HELAI PIAS) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2.5 border-b-2 border-[#8F2635]">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#8F2635] shadow-2xs" />
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#8F2635] uppercase tracking-wider">
                      {language === 'en' ? `Gored Skirt Pattern (${N} Panels)` : `Pola Rok Pias (${N} Pias)`}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#8F2635] bg-[#F3E7E7] px-2.5 py-0.5 rounded-full border border-[#E8DED8]">
                    8 {language === 'en' ? 'Formulas' : 'Perhitungan'}
                  </span>
                </div>

                <div className="space-y-2">
                  {/* 1. A – C */}
                  <CompactFormulaBlock
                    point="A – C"
                    pointWidthClass="w-36 sm:w-44 shrink-0"
                    formulaDesc={language === 'en' ? `Waist Width per Panel = Waist ÷ ${N}` : `Lebar Pinggang 1 Pias = Lingkar Pinggang ÷ ${N}`}
                    substitution={`${formatVal(lp)} ÷ ${N}`}
                    finalResult={`${formatVal(lp / N)} cm`}
                    isFrontSide={true}
                  />

                  {/* 2. A – B = B – C */}
                  <CompactFormulaBlock
                    point="A – B = B – C"
                    pointWidthClass="w-36 sm:w-44 shrink-0"
                    formulaDesc={language === 'en' ? `½ Waist Width per Panel = Waist ÷ (2 × ${N})` : `Setengah Lebar Pinggang = Lingkar Pinggang ÷ (2 × ${N})`}
                    substitution={`${formatVal(lp)} ÷ ${2 * N}`}
                    finalResult={`${formatVal(lp / (2 * N))} cm`}
                    isFrontSide={true}
                  />

                  {/* 3. B – E */}
                  <CompactFormulaBlock
                    point="B – E"
                    pointWidthClass="w-36 sm:w-44 shrink-0"
                    formulaDesc={language === 'en' ? 'Hip Depth' : 'Tinggi Panggul'}
                    finalResult={`${formatVal(tp)} cm`}
                    isFrontSide={true}
                  />

                  {/* 4. B – G */}
                  <CompactFormulaBlock
                    point="B – G"
                    pointWidthClass="w-36 sm:w-44 shrink-0"
                    formulaDesc={language === 'en' ? 'Skirt Length' : 'Panjang Rok'}
                    finalResult={`${formatVal(pr)} cm`}
                    isFrontSide={true}
                  />

                  {/* 5. F – D */}
                  <CompactFormulaBlock
                    point="F – D"
                    pointWidthClass="w-36 sm:w-44 shrink-0"
                    formulaDesc={language === 'en' ? `Hip Width per Panel = Hip ÷ ${N}` : `Lebar Panggul 1 Pias = Lingkar Panggul ÷ ${N}`}
                    substitution={`${formatVal(lpg)} ÷ ${N}`}
                    finalResult={`${formatVal(lpg / N)} cm`}
                    isFrontSide={true}
                  />

                  {/* 6. F – E = E – D */}
                  <CompactFormulaBlock
                    point="F – E = E – D"
                    pointWidthClass="w-36 sm:w-44 shrink-0"
                    formulaDesc={language === 'en' ? `½ Hip Width per Panel = Hip ÷ (2 × ${N})` : `Setengah Lebar Panggul = Lingkar Panggul ÷ (2 × ${N})`}
                    substitution={`${formatVal(lpg)} ÷ ${2 * N}`}
                    finalResult={`${formatVal(lpg / (2 * N))} cm`}
                    isFrontSide={true}
                  />

                  {/* 7. G – G' = G – G" */}
                  <CompactFormulaBlock
                    point="G – G' = G – G&quot;"
                    pointWidthClass="w-36 sm:w-44 shrink-0"
                    formulaDesc={language === 'en' ? `Bottom Center Offset = A – B = Waist ÷ (2 × ${N})` : `Jarak Dasar Kelim = A – B = Lingkar Pinggang ÷ (2 × ${N})`}
                    substitution={`${formatVal(lp)} ÷ ${2 * N}`}
                    finalResult={`${formatVal(lp / (2 * N))} cm`}
                    isFrontSide={true}
                  />

                  {/* 8. G' – G" */}
                  <CompactFormulaBlock
                    point="G' – G&quot;"
                    pointWidthClass="w-36 sm:w-44 shrink-0"
                    formulaDesc={language === 'en' ? `Base Bottom Width = A – C = Waist ÷ ${N}` : `Lebar Dasar Bawah 1 Pias = A – C = Lingkar Pinggang ÷ ${N}`}
                    substitution={`${formatVal(lp)} ÷ ${N}`}
                    finalResult={`${formatVal(lp / N)} cm`}
                    isFrontSide={true}
                  />
                </div>
              </div>

              {/* RIGHT COLUMN: POLA GODET */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2.5 border-b-2 border-[#1D4ED8]">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#1D4ED8] shadow-2xs" />
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#1E3A8A] uppercase tracking-wider">
                      {language === 'en' ? 'Godet Insert Pattern' : 'Pola Sisipan Godet'}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#1E40AF] bg-[#DBEAFE] px-2.5 py-0.5 rounded-full border border-[#BFDBFE]">
                    3 {language === 'en' ? 'Formulas' : 'Perhitungan'}
                  </span>
                </div>

                <div className="space-y-2">
                  {/* 1. A – B (Godet) */}
                  <CompactFormulaBlock
                    point="A – B"
                    pointWidthClass="w-36 sm:w-44 shrink-0"
                    formulaDesc={language === 'en' ? 'Godet Height (Center Line)' : 'Tinggi Tegak Lurus Tengah Godet'}
                    finalResult={`${formatVal(tg)} cm`}
                    isFrontSide={false}
                  />

                  {/* 2. B – C = B – D (Godet) */}
                  <CompactFormulaBlock
                    point="B – C = B – D"
                    pointWidthClass="w-36 sm:w-44 shrink-0"
                    formulaDesc={language === 'en' ? '½ Bottom Godet Width' : '½ Lebar Dasar Bawah Godet'}
                    substitution={`½ × ${formatVal(lg)} cm`}
                    finalResult={`${formatVal(lg / 2)} cm`}
                    isFrontSide={false}
                  />

                  {/* 3. C – C' = D – D' (Godet) */}
                  <CompactFormulaBlock
                    point="C – C' = D – D'"
                    pointWidthClass="w-36 sm:w-44 shrink-0"
                    formulaDesc={language === 'en' ? 'Side Hem Curve Rise (A–C\' = A–D\' = A–B)' : 'Kenaikan Lengkung Kelim Sisi (A–C\' = A–D\' = A–B)'}
                    finalResult="1,5 cm"
                    isFrontSide={false}
                  />
                </div>

                {/* Educational Note Box for Godet */}
                <div className="p-3.5 bg-[#EFF6FF] rounded-xl border border-[#BFDBFE] text-[#1E3A8A] text-xs space-y-1 mt-3">
                  <p className="font-bold flex items-center gap-1.5">
                    <Info size={14} className="shrink-0" />
                    {language === 'en' ? 'Godet Construction Principle:' : 'Prinsip Konstruksi Godet:'}
                  </p>
                  <p className="leading-relaxed">
                    {language === 'en'
                      ? `Godet is a triangular insert placed between skirt panel seams. The side edges A–C' and A–D' are drafted exactly equal to center height A–B (${formatVal(tg)} cm) by raising points C and D by 1.5 cm so the hemline drapes smoothly without sagging.`
                      : `Godet adalah kain sisipan segitiga di antara sambungan pias rok. Panjang sisi miring A–C' dan A–D' dibuat sama persis dengan tinggi tengah A–B (${formatVal(tg)} cm) dengan menaikkan titik C dan D sebesar 1,5 cm agar jatuhan kelim bawah rata dan tidak menjuntai.`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : isRokLipitSearah ? (
          /* POLA ROK LIPIT SEARAH FORMULA SECTION */
          <div className="pt-5 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {/* LEFT COLUMN: KETETAPAN RUMUS & LANGKAH DASAR */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2.5 border-b-2 border-[#8F2635]">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#8F2635] shadow-2xs" />
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#8F2635] uppercase tracking-wider">
                      {language === 'en' ? 'Core Formulas & Principles' : 'Ketetapan Rumus & Prinsip Lipit'}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#8F2635] bg-[#F3E7E7] px-2.5 py-0.5 rounded-full border border-[#E8DED8]">
                    {nLipit} {language === 'en' ? 'Pleats' : 'Lipit'}
                  </span>
                </div>

                <div className="space-y-2">
                  {/* 1. Jarak Lipit */}
                  <div className="bg-white rounded-lg px-3.5 py-2 sm:px-4 sm:py-2.5 border border-[#E8DED8] shadow-2xs hover:border-[#D5C7BF] transition-all">
                    <div className="text-xs sm:text-sm font-semibold text-[#332C29] whitespace-nowrap overflow-x-auto tracking-tight leading-snug">
                      <span>{language === 'en' ? 'Pleat Distance' : 'Jarak Lipit'}</span>
                      <span> = {language === 'en' ? `Waist ÷ Pleats (${nLipit})` : `Lingkar Pinggang ÷ Jumlah Lipit (${nLipit})`}</span>
                    </div>
                    <div className="text-xs sm:text-sm font-semibold mt-0.5 leading-snug whitespace-nowrap overflow-x-auto flex items-baseline">
                      <span className="invisible select-none" aria-hidden="true">
                        {language === 'en' ? 'Pleat Distance' : 'Jarak Lipit'}
                      </span>
                      <span>&nbsp;=&nbsp;</span>
                      <span className="font-mono font-normal text-[#4A423B] flex items-baseline gap-1">
                        <span>{formatVal(lp)} ÷ {nLipit} =</span>
                        <span className="font-bold text-[#8F2635]">{formatVal(lipitJarak)} cm</span>
                      </span>
                    </div>
                  </div>

                  {/* 2. Dalam Lipit */}
                  <div className="bg-white rounded-lg px-3.5 py-2 sm:px-4 sm:py-2.5 border border-[#E8DED8] shadow-2xs hover:border-[#D5C7BF] transition-all">
                    <div className="text-xs sm:text-sm font-semibold text-[#332C29] whitespace-nowrap overflow-x-auto tracking-tight leading-snug">
                      <span>{language === 'en' ? 'Pleat Depth' : 'Dalam Lipit'}</span>
                      <span> = {language === 'en' ? `(Total Fabric − 6 cm − Waist) ÷ ${nLipit}` : `(Lebar Kain Total − 6 cm − Lingkar Pinggang) ÷ ${nLipit}`}</span>
                    </div>
                    <div className="text-xs sm:text-sm font-semibold mt-0.5 leading-snug whitespace-nowrap overflow-x-auto flex items-baseline">
                      <span className="invisible select-none" aria-hidden="true">
                        {language === 'en' ? 'Pleat Depth' : 'Dalam Lipit'}
                      </span>
                      <span>&nbsp;=&nbsp;</span>
                      <span className="font-mono font-normal text-[#4A423B] flex items-baseline gap-1">
                        <span>({formatVal(lebarKainTotal)} − 6 − {formatVal(lp)}) ÷ ${nLipit} =</span>
                        <span className="font-bold text-[#8F2635]">{formatVal(lipitDalam)} cm</span>
                      </span>
                    </div>
                  </div>

                  {/* 3. A – A' */}
                  <div className="bg-white rounded-lg px-3.5 py-2 sm:px-4 sm:py-2.5 border border-[#E8DED8] shadow-2xs hover:border-[#D5C7BF] transition-all">
                    <div className="text-xs sm:text-sm font-semibold text-[#332C29] whitespace-nowrap overflow-x-auto tracking-tight leading-snug">
                      <span>A – A'</span>
                      <span> = {language === 'en' ? 'Skirt Length' : 'Panjang Rok'}</span>
                    </div>
                    <div className="text-xs sm:text-sm font-semibold mt-0.5 leading-snug whitespace-nowrap overflow-x-auto flex items-baseline">
                      <span className="invisible select-none" aria-hidden="true">
                        A – A'
                      </span>
                      <span>&nbsp;=&nbsp;</span>
                      <span className="font-mono font-normal text-[#4A423B] flex items-baseline gap-1">
                        <span className="font-bold text-[#8F2635]">{formatVal(pr)} cm</span>
                      </span>
                    </div>
                  </div>

                  {/* 4. A – B */}
                  <div className="bg-white rounded-lg px-3.5 py-2 sm:px-4 sm:py-2.5 border border-[#E8DED8] shadow-2xs hover:border-[#D5C7BF] transition-all">
                    <div className="text-xs sm:text-sm font-semibold text-[#332C29] whitespace-nowrap overflow-x-auto tracking-tight leading-snug">
                      <span>A – B</span>
                      <span> = {language === 'en' ? '½ Pleat Depth (Center Front Placement)' : '½ Dalam Lipit (Agar tepat di Tengah Muka)'}</span>
                    </div>
                    <div className="text-xs sm:text-sm font-semibold mt-0.5 leading-snug whitespace-nowrap overflow-x-auto flex items-baseline">
                      <span className="invisible select-none" aria-hidden="true">
                        A – B
                      </span>
                      <span>&nbsp;=&nbsp;</span>
                      <span className="font-mono font-normal text-[#4A423B] flex items-baseline gap-1">
                        <span>{formatVal(lipitDalam)} ÷ 2 =</span>
                        <span className="font-bold text-[#8F2635]">{formatVal(lipitSetengahDalam)} cm</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: TITIK-TITIK KONSTRUKSI BERGANTIAN */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2.5 border-b-2 border-[#8F2635]">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#8F2635] shadow-2xs" />
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#332C29] uppercase tracking-wider">
                      {language === 'en' ? 'Sequential Pleat Points' : 'Urutan Titik Konstruksi Lipit'}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#8F2635] bg-[#F3E7E7] px-2.5 py-0.5 rounded-full border border-[#E8DED8]">
                    3 {language === 'en' ? 'Steps' : 'Langkah'}
                  </span>
                </div>

                <div className="space-y-2">
                  <CompactFormulaBlock
                    key="jarak-1"
                    point="B – C"
                    pointWidthClass="w-36 sm:w-44 shrink-0"
                    formulaDesc={language === 'en' ? 'Pleat 1 Width = Pleat Distance' : 'Lipit ke-1 = Jarak Lipit'}
                    substitution={`${formatVal(lp)} ÷ ${nLipit}`}
                    finalResult={`${formatVal(lipitJarak)} cm`}
                    isFrontSide={true}
                  />
                  <CompactFormulaBlock
                    key="dalam-1"
                    point="C – D"
                    pointWidthClass="w-36 sm:w-44 shrink-0"
                    formulaDesc={language === 'en' ? 'Pleat 1 Fold Depth = Pleat Depth' : 'Lipit ke-1 = Dalam Lipit'}
                    substitution={`(${formatVal(lebarKainTotal)} − 6 − ${formatVal(lp)}) ÷ ${nLipit}`}
                    finalResult={`${formatVal(lipitDalam)} cm`}
                    isFrontSide={false}
                  />
                  <CompactFormulaBlock
                    key="jarak-2"
                    point="D – E"
                    pointWidthClass="w-36 sm:w-44 shrink-0"
                    formulaDesc={language === 'en' ? 'Pleat 2 Width = Pleat Distance' : 'Lipit ke-2 = Jarak Lipit'}
                    substitution={`${formatVal(lp)} ÷ ${nLipit}`}
                    finalResult={`${formatVal(lipitJarak)} cm`}
                    isFrontSide={true}
                  />
                  <div className="py-2.5 px-3 text-center text-xs font-serif italic text-[#6B5E57] bg-[#FCFAF7] rounded-xl border border-dashed border-[#E8DED8]">
                    dan seterusnya
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : isKulot ? (
          /* ======================================================== */
          /* POLA DASAR KULOT FORMULA BREAKDOWN SECTION              */
          /* ======================================================== */
          <div className="pt-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {/* LEFT COLUMN: POLA DEPAN (FRONT PATTERN & GOLBI) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2.5 border-b-2 border-[#8F2635]">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#8F2635] shadow-2xs" />
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#8F2635] uppercase tracking-wider">
                      {language === 'en' ? 'FRONT PATTERN & GOLBI' : 'POLA DEPAN & GOLBI'}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#8F2635] bg-[#F3E7E7] px-2.5 py-0.5 rounded-full border border-[#E8DED8]">
                    7 {language === 'en' ? 'Formulas' : 'Perhitungan'}
                  </span>
                </div>

                <div className="space-y-2">
                  {/* 1. A – B */}
                  <CompactFormulaBlock
                    point="A – B"
                    formulaDesc={language === 'en' ? 'Culottes Length (Basic Skirt Length)' : 'Panjang Kulot = Panjang Rok'}
                    finalResult={`${formatVal(panjangKulot)} cm`}
                    isFrontSide={true}
                  />

                  {/* 2. A – C */}
                  {kulotAcMethod === 'tinggi-panggul-range' ? (
                    <CompactFormulaBlock
                      point="A – C"
                      formulaDesc={language === 'en' ? 'Hip Height + 7 to 8 cm (Ease Range)' : 'Tinggi Panggul + 7 s/d 8 cm (Rentang Kelonggaran)'}
                      substitution={language === 'en'
                        ? `(${formatVal(tpKulot)} + 7) cm up to (${formatVal(tpKulot)} + 8) cm`
                        : `(${formatVal(tpKulot)} + 7) cm sampai dengan (${formatVal(tpKulot)} + 8) cm`}
                      finalResult={language === 'en'
                        ? `${formatVal(tpKulot + 7)} cm up to ${formatVal(tpKulot + 8)} cm`
                        : `${formatVal(tpKulot + 7)} cm sampai dengan ${formatVal(tpKulot + 8)} cm`}
                      isFrontSide={true}
                    />
                  ) : (
                    <CompactFormulaBlock
                      point="A – C"
                      formulaDesc={language === 'en' ? 'Sitting Height' : 'Tinggi Duduk'}
                      finalResult={`${formatVal(tdKulot)} cm`}
                      isFrontSide={true}
                    />
                  )}

                  {/* 3. C – C' */}
                  <CompactFormulaBlock
                    point="C – C'"
                    formulaDesc={language === 'en' ? '1/10 Hip Circumference − 2 cm' : '1/10 Lingkar Panggul − 2 cm'}
                    substitution={`(1/10 × ${formatVal(lpgKulot)} cm) − 2 cm`}
                    finalResult={`${formatVal(kulotFrontCC)} cm`}
                    isFrontSide={true}
                  />

                  {/* 4. C – C" */}
                  <CompactFormulaBlock
                    point="C – C&quot;"
                    formulaDesc={language === 'en' ? 'Equal to C – C\' (Straight downward extension)' : 'Sama dengan C – C\' (Perpanjangan garis lurus bawah)'}
                    finalResult={`${formatVal(kulotFrontCC)} cm`}
                    isFrontSide={true}
                  />

                  {/* 5. Golbi */}
                  <CompactFormulaBlock
                    point="Golbi"
                    formulaDesc={language === 'en' ? 'Zipper Fly Extension Width' : 'Lebar Tambahan Golbi'}
                    finalResult="4 cm"
                    isFrontSide={true}
                  />

                  {/* 6. Panjang Golbi */}
                  <CompactFormulaBlock
                    point={language === 'en' ? 'Fly Length' : 'Panjang Golbi'}
                    formulaDesc={language === 'en' ? 'For 17 cm standard zipper' : 'Untuk resleting 17 cm'}
                    finalResult="18 cm"
                    isFrontSide={true}
                  />

                  {/* 7. B' */}
                  <CompactFormulaBlock
                    point="B'"
                    formulaDesc={language === 'en' ? 'Side Hem Adjustment (Raise)' : 'Sisi Luar Bawah (Naik)'}
                    finalResult="1,5 cm"
                    isFrontSide={true}
                  />
                </div>
              </div>

              {/* RIGHT COLUMN: POLA BELAKANG (BACK PATTERN) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2.5 border-b-2 border-[#1D4ED8]">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#1D4ED8] shadow-2xs" />
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#1D4ED8] uppercase tracking-wider">
                      {language === 'en' ? 'BACK PATTERN' : 'POLA BELAKANG'}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#1D4ED8] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                    5 {language === 'en' ? 'Formulas' : 'Perhitungan'}
                  </span>
                </div>

                <div className="space-y-2">
                  {/* 1. A – B */}
                  <CompactFormulaBlock
                    point="A – B"
                    formulaDesc={language === 'en' ? 'Culottes Length (Basic Skirt Length)' : 'Panjang Kulot = Panjang Rok'}
                    finalResult={`${formatVal(panjangKulot)} cm`}
                    isFrontSide={false}
                  />

                  {/* 2. A – C */}
                  {kulotAcMethod === 'tinggi-panggul-range' ? (
                    <CompactFormulaBlock
                      point="A – C"
                      formulaDesc={language === 'en' ? 'Hip Height + 7 to 8 cm (Ease Range)' : 'Tinggi Panggul + 7 s/d 8 cm (Rentang Kelonggaran)'}
                      substitution={language === 'en'
                        ? `(${formatVal(tpKulot)} + 7) cm up to (${formatVal(tpKulot)} + 8) cm`
                        : `(${formatVal(tpKulot)} + 7) cm sampai dengan (${formatVal(tpKulot)} + 8) cm`}
                      finalResult={language === 'en'
                        ? `${formatVal(tpKulot + 7)} cm up to ${formatVal(tpKulot + 8)} cm`
                        : `${formatVal(tpKulot + 7)} cm sampai dengan ${formatVal(tpKulot + 8)} cm`}
                      isFrontSide={false}
                    />
                  ) : (
                    <CompactFormulaBlock
                      point="A – C"
                      formulaDesc={language === 'en' ? 'Sitting Height' : 'Tinggi Duduk'}
                      finalResult={`${formatVal(tdKulot)} cm`}
                      isFrontSide={false}
                    />
                  )}

                  {/* 3. C – C' */}
                  <CompactFormulaBlock
                    point="C – C'"
                    formulaDesc={language === 'en' ? '1/10 Hip Circumference + 2 cm' : '1/10 Lingkar Panggul + 2 cm'}
                    substitution={`(1/10 × ${formatVal(lpgKulot)} cm) + 2 cm`}
                    finalResult={`${formatVal(kulotBackCC)} cm`}
                    isFrontSide={false}
                  />

                  {/* 4. C – C" */}
                  <CompactFormulaBlock
                    point="C – C&quot;"
                    formulaDesc={language === 'en' ? 'Equal to C – C\' (Straight downward extension)' : 'Sama dengan C – C\' (Perpanjangan garis lurus bawah)'}
                    finalResult={`${formatVal(kulotBackCC)} cm`}
                    isFrontSide={false}
                  />

                  {/* 5. B' */}
                  <CompactFormulaBlock
                    point="B'"
                    formulaDesc={language === 'en' ? 'Side Hem Adjustment (Raise)' : 'Sisi Luar Bawah (Naik)'}
                    finalResult="1,5 cm"
                    isFrontSide={false}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : isRokLingkaran ? (
          <>
            <div className="max-w-2xl mx-auto pt-5">
              {circleSkirtModel === 'full' ? (
                /* ROK LINGKARAN PENUH */
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2.5 border-b-2 border-[#8F2635]">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#8F2635] shadow-2xs" />
                      <h3 className="font-serif text-base sm:text-lg font-bold text-[#8F2635] uppercase tracking-wider">
                        {language === 'en' ? 'Full Circle Skirt Formula (360°)' : 'Formula Rok Lingkaran Penuh (360°)'}
                      </h3>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#8F2635] bg-[#F3E7E7] px-2.5 py-0.5 rounded-full border border-[#E8DED8]">
                      3 {language === 'en' ? 'Formulas' : 'Perhitungan'}
                    </span>
                  </div>

                  <CircleSkirtFormulaDisplay
                    model="full"
                    language={language}
                    waistCircumference={lp}
                    skirtLength={pr}
                  />
                </div>
              ) : (
                /* ROK SETENGAH LINGKARAN */
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2.5 border-b-2 border-[#1D4ED8]">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#1D4ED8] shadow-2xs" />
                      <h3 className="font-serif text-base sm:text-lg font-bold text-[#1D4ED8] uppercase tracking-wider">
                        {language === 'en' ? 'Half Circle Skirt Formula (180°)' : 'Formula Rok Setengah Lingkaran (180°)'}
                      </h3>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#1D4ED8] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                      3 {language === 'en' ? 'Formulas' : 'Perhitungan'}
                    </span>
                  </div>

                  <CircleSkirtFormulaDisplay
                    model="half"
                    language={language}
                    waistCircumference={lp}
                    skirtLength={pr}
                  />
                </div>
              )}
            </div>

            {/* Informative Footer Note */}
            <div className="mt-6 pt-3.5 border-t border-[#E8DED8] flex items-center justify-between gap-3 flex-wrap text-xs text-[#6B5E57]">
              <p className="italic">
                * {language === 'en'
                  ? 'All calculations use drafting formulas derived directly from your entered measurements.'
                  : 'Semua perhitungan menggunakan rumus konstruksi pola yang diturunkan langsung dari ukuran yang Anda masukkan.'}
              </p>
              <p className="font-mono font-medium text-[#8F2635]">
                {language === 'en' ? 'Proportional Drafting Geometry' : 'Geometri Pola Proporsional'}
              </p>
            </div>
          </>
        ) : isTieredSkirt ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 pt-5">
              {/* LEFT COLUMN: PANJANG TINGKATAN ROK (VERTIKAL) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2.5 border-b-2 border-[#8F2635]">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#8F2635] shadow-2xs" />
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#8F2635] uppercase tracking-wider">
                      {language === 'en' ? '1. Skirt Tier Lengths (Vertical)' : '1. Panjang Tingkatan Rok (Vertikal)'}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#8F2635] bg-[#F3E7E7] px-2.5 py-0.5 rounded-full border border-[#E8DED8]">
                    {tierCount} {language === 'en' ? 'Tiers' : 'Tingkatan'}
                  </span>
                </div>

                <div className="space-y-2">
                  {(() => {
                    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
                    const N = Math.min(6, Math.max(2, tierCount));
                    const blocks = [];
                    for (let i = 1; i <= N; i++) {
                      const startL = letters[i - 1];
                      const endL = letters[i];
                      const pointLabel = `${startL} – ${endL}`;
                      if (i === 1) {
                        blocks.push(
                          <CompactFormulaBlock
                            key={`tier-len-${i}`}
                            point={pointLabel}
                            pointWidthClass="w-24 sm:w-28 shrink-0"
                            formulaDesc={language === 'en' ? `Tier 1 Length = (Skirt Length ÷ ${N}) − 5 cm` : `Panjang Tingkat 1 = (Panjang Rok ÷ ${N}) − 5 cm`}
                            substitution={`(${formatVal(pr)} cm ÷ ${N}) − 5 cm = ${formatVal(pr / N)} cm − 5 cm`}
                            finalResult={`${formatVal((pr / N) - 5)} cm`}
                            isFrontSide={true}
                          />
                        );
                      } else if (i === N) {
                        blocks.push(
                          <CompactFormulaBlock
                            key={`tier-len-${i}`}
                            point={pointLabel}
                            pointWidthClass="w-24 sm:w-28 shrink-0"
                            formulaDesc={language === 'en' ? `Tier ${N} Length = (Skirt Length ÷ ${N}) + 5 cm` : `Panjang Tingkat ${N} = (Panjang Rok ÷ ${N}) + 5 cm`}
                            substitution={`(${formatVal(pr)} cm ÷ ${N}) + 5 cm = ${formatVal(pr / N)} cm + 5 cm`}
                            finalResult={`${formatVal((pr / N) + 5)} cm`}
                            isFrontSide={true}
                          />
                        );
                      } else {
                        blocks.push(
                          <CompactFormulaBlock
                            key={`tier-len-${i}`}
                            point={pointLabel}
                            pointWidthClass="w-24 sm:w-28 shrink-0"
                            formulaDesc={language === 'en' ? `Tier ${i} Length = Skirt Length ÷ ${N}` : `Panjang Tingkat ${i} = Panjang Rok ÷ ${N}`}
                            substitution={`${formatVal(pr)} cm ÷ ${N}`}
                            finalResult={`${formatVal(pr / N)} cm`}
                            isFrontSide={true}
                          />
                        );
                      }
                    }
                    return blocks;
                  })()}
                </div>
              </div>

              {/* RIGHT COLUMN: LEBAR KERUTAN TINGKATAN ROK (HORIZONTAL) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2.5 border-b-2 border-[#332C29]">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#332C29] shadow-2xs" />
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#332C29] uppercase tracking-wider">
                      {language === 'en' ? '2. Skirt Tier Widths (Horizontal)' : '2. Lebar Kerutan Tingkatan Rok (Horizontal)'}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#332C29] bg-[#E8DED8] px-2.5 py-0.5 rounded-full border border-[#DFD4CD]">
                    {tierCount} {language === 'en' ? 'Widths' : 'Lebar'}
                  </span>
                </div>

                <div className="space-y-2">
                  {(() => {
                    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
                    const N = Math.min(6, Math.max(2, tierCount));
                    const blocks = [];
                    let prevWidth = 0.25 * (1.5 * lp);
                    for (let i = 1; i <= N; i++) {
                      const letter = letters[i - 1];
                      const prevLetter = i > 1 ? letters[i - 2] : '';
                      const pointLabel = `${letter} – ${letter}’`;
                      if (i === 1) {
                        blocks.push(
                          <CompactFormulaBlock
                            key={`tier-width-${i}`}
                            point={pointLabel}
                            pointWidthClass="w-24 sm:w-28 shrink-0"
                            formulaDesc={language === 'en' ? '¼ × (1.5 × Waist Circumference)' : '¼ × (1.5 × Lingkar Pinggang)'}
                            substitution={`¼ × (1.5 × ${formatVal(lp)} cm) = ¼ × ${formatVal(1.5 * lp)} cm`}
                            finalResult={`${formatVal(prevWidth)} cm`}
                            isFrontSide={false}
                          />
                        );
                      } else {
                        const currentWidth = prevWidth * 1.5;
                        const prevLabel = `${prevLetter} – ${prevLetter}’`;
                        blocks.push(
                          <CompactFormulaBlock
                            key={`tier-width-${i}`}
                            point={pointLabel}
                            pointWidthClass="w-24 sm:w-28 shrink-0"
                            formulaDesc={language === 'en' ? `1.5 × Distance ${prevLabel}` : `1.5 × Jarak ${prevLabel}`}
                            substitution={`1.5 × ${formatVal(prevWidth)} cm`}
                            finalResult={`${formatVal(currentWidth)} cm`}
                            isFrontSide={false}
                          />
                        );
                        prevWidth = currentWidth;
                      }
                    }
                    return blocks;
                  })()}
                </div>
              </div>
            </div>

            {/* Construction Note Callout */}
            <div className="mt-5 p-3.5 bg-amber-50/80 rounded-xl border border-amber-200/80 text-center">
              <p className="text-xs font-medium text-amber-900 flex items-center justify-center gap-1.5">
                <Info size={14} className="text-amber-700 shrink-0" />
                <span>
                  {language === 'en'
                    ? 'Construction Note: Front and back patterns use exactly the same construction.'
                    : 'Catatan Konstruksi: Pola depan dan pola belakang menggunakan bentuk konstruksi yang sama.'}
                </span>
              </p>
            </div>

            {/* Informative Footer Note */}
            <div className="mt-6 pt-3.5 border-t border-[#E8DED8] flex items-center justify-between gap-3 flex-wrap text-xs text-[#6B5E57]">
              <p className="italic">
                * {language === 'en'
                  ? 'All calculations use drafting formulas derived directly from your entered measurements.'
                  : 'Semua perhitungan menggunakan rumus konstruksi pola yang diturunkan langsung dari ukuran yang Anda masukkan.'}
              </p>
              <p className="font-mono font-medium text-[#8F2635]">
                {language === 'en' ? 'Proportional Drafting Geometry' : 'Geometri Pola Proporsional'}
              </p>
            </div>
          </>
        ) : isBadanIndonesia ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 pt-5">
              {/* LEFT COLUMN: POLA DEPAN (FRONT PATTERN) - 17 FORMULAS FIRST */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2.5 border-b-2 border-[#8F2635]">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#8F2635] shadow-2xs" />
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#8F2635] uppercase tracking-wider">
                      {t.polaDepan}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#8F2635] bg-[#F3E7E7] px-2.5 py-0.5 rounded-full border border-[#E8DED8]">
                    17 {language === 'en' ? 'Formulas' : 'Perhitungan'}
                  </span>
                </div>

                <div className="space-y-2">
                  <CompactFormulaBlock
                    point="A – B"
                    formulaDesc={language === 'en' ? 'Front Length' : 'Panjang Muka'}
                    formula="Panjang Muka"
                    substitution={formatVal(pm)}
                    result={formatVal(idFrontAB)}
                    isFrontSide={true}
                  />
                  <CompactFormulaBlock
                    point="B – C"
                    formulaDesc={language === 'en' ? '⅙ Neck Circumference + 2.5 cm' : '⅙ Lingkar Leher + 2,5 cm'}
                    formula="⅙ Lingkar Leher + 2,5 cm"
                    substitution={`(${formatVal(ll)} / 6) + 2,5`}
                    result={formatVal(idFrontBC)}
                    isFrontSide={true}
                  />
                  <CompactFormulaBlock
                    point="C – D"
                    formulaDesc={language === 'en' ? '⅙ Neck Circumference + 0.5 cm' : '⅙ Lingkar Leher + 0,5 cm'}
                    formula="⅙ Lingkar Leher + 0,5 cm"
                    substitution={`(${formatVal(ll)} / 6) + 0,5`}
                    result={formatVal(idFrontCD)}
                    isFrontSide={true}
                  />
                  <CompactFormulaBlock
                    point="A – E"
                    formulaDesc={language === 'en' ? '¼ Bust Circumference + 1 cm (or + 2 cm)' : '¼ Lingkar Badan + 1 cm (atau + 2 cm)'}
                    formula="¼ Lingkar Badan + 1 cm"
                    substitution={`(${formatVal(lb)} / 4) + 1`}
                    result={formatVal(idFrontAE)}
                    isFrontSide={true}
                  />
                  <CompactFormulaBlock
                    point="E – F"
                    formulaDesc={language === 'en' ? 'Side Length' : 'Panjang Sisi'}
                    formula="Panjang Sisi"
                    substitution={formatVal(ps)}
                    result={formatVal(idFrontEF)}
                    isFrontSide={true}
                  />
                  <CompactFormulaBlock
                    point="C – G"
                    formulaDesc={language === 'en' ? 'A – E (¼ Bust + 1 cm)' : 'A – E (¼ Lingkar Badan + 1 cm)'}
                    formula="¼ Lingkar Badan + 1 cm"
                    substitution={`(${formatVal(lb)} / 4) + 1`}
                    result={formatVal(idFrontCG)}
                    isFrontSide={true}
                  />
                  <CompactFormulaBlock
                    point="G – H"
                    formulaDesc={language === 'en' ? '⅓ Shoulder Length' : '⅓ Panjang Bahu'}
                    formula="⅓ Panjang Bahu"
                    substitution={`${formatVal(pb)} / 3`}
                    result={formatVal(idFrontGH)}
                    isFrontSide={true}
                  />
                  <CompactFormulaBlock
                    point="D – I"
                    formulaDesc={language === 'en' ? 'Shoulder Length' : 'Panjang Bahu'}
                    formula="Panjang Bahu"
                    substitution={formatVal(pb)}
                    result={formatVal(idFrontDI)}
                    isFrontSide={true}
                  />
                  <CompactFormulaBlock
                    point="D – K"
                    formulaDesc={language === 'en' ? '½ Shoulder Length − 1 cm' : '½ Panjang Bahu − 1 cm'}
                    formula="½ Panjang Bahu − 1 cm"
                    substitution={`(${formatVal(pb)} / 2) − 1`}
                    result={formatVal(idFrontDK)}
                    isFrontSide={true}
                  />
                  <CompactFormulaBlock
                    point="J – L"
                    formulaDesc={language === 'en' ? '½ Shoulder Length + 1 cm' : '½ Panjang Bahu + 1 cm'}
                    formula="½ Panjang Bahu + 1 cm"
                    substitution={`(${formatVal(pb)} / 2) + 1`}
                    result={formatVal(idFrontJL)}
                    isFrontSide={true}
                  />
                  <CompactFormulaBlock
                    point="A – M"
                    formulaDesc={language === 'en' ? '1/10 Waist Circumference' : '1/10 Lingkar Pinggang'}
                    formula="1/10 Lingkar Pinggang"
                    substitution={`${formatVal(lping)} / 10`}
                    result={formatVal(idFrontAM)}
                    isFrontSide={true}
                  />
                  <CompactFormulaBlock
                    point="K – K’"
                    formulaDesc={language === 'en' ? 'Shoulder Dart Extension' : 'Perpanjangan Kup Bahu'}
                    formula="Ketetapan kup bahu"
                    finalResult="0,5 cm"
                    isFrontSide={true}
                  />
                  <CompactFormulaBlock
                    point="M – N"
                    formulaDesc={language === 'en' ? 'Bust Height' : 'Tinggi Dada'}
                    formula="Tinggi Dada"
                    substitution={formatVal(td)}
                    result={formatVal(idFrontMN)}
                    isFrontSide={true}
                  />
                  <CompactFormulaBlock
                    point="E – P"
                    formulaDesc={language === 'en' ? 'Side Waist Inset' : 'Masuk Garis Pinggang Samping'}
                    formula="Ketetapan sisi pinggang"
                    finalResult="3 cm"
                    isFrontSide={true}
                  />
                  <CompactFormulaBlock
                    point="P – O"
                    formulaDesc={language === 'en' ? '{(¼ Waist) + 1 cm} − (A – M)' : '{(¼ Lingkar Pinggang) + 1 cm} − (A – M)'}
                    formula="{(¼ Lingkar Pinggang) + 1 cm} − (A – M)"
                    substitution={`((${formatVal(lping)} / 4) + 1) − ${formatVal(idFrontAM)}`}
                    result={formatVal(idFrontPO)}
                    isFrontSide={true}
                  />
                  <CompactFormulaBlock
                    point="B – Q"
                    formulaDesc={language === 'en' ? 'Chest Width Line Drop' : 'Turun Batas Garis Lebar Muka'}
                    formula="Ketetapan garis lebar muka"
                    finalResult="4 cm"
                    isFrontSide={true}
                  />
                  <CompactFormulaBlock
                    point="S – T"
                    formulaDesc={language === 'en' ? '½ Chest Width − (Q – R)' : '½ Lebar Muka − (Q – R)'}
                    formula="½ Lebar Muka (Q–R diukur manual pada pola)"
                    substitution={qrVal > 0 ? `(${formatVal(lm)} / 2) − ${formatVal(qrVal)}` : `${formatVal(lm)} / 2`}
                    result={formatVal(idFrontST)}
                    isFrontSide={true}
                  />
                </div>
              </div>

              {/* RIGHT COLUMN: POLA BELAKANG (BACK PATTERN) - 15 FORMULAS */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2.5 border-b-2 border-[#1D4ED8]">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#1D4ED8] shadow-2xs" />
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#1E3A8A] uppercase tracking-wider">
                      {t.polaBelakang}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#1E40AF] bg-[#DBEAFE] px-2.5 py-0.5 rounded-full border border-[#BFDBFE]">
                    15 {language === 'en' ? 'Formulas' : 'Perhitungan'}
                  </span>
                </div>

                <div className="space-y-2">
                  <CompactFormulaBlock
                    point="A – B"
                    formulaDesc={language === 'en' ? 'Back Length' : 'Panjang Punggung'}
                    formula="Panjang Punggung"
                    substitution={formatVal(pp)}
                    result={formatVal(idBackAB)}
                    isFrontSide={false}
                  />
                  <CompactFormulaBlock
                    point="B – C"
                    formulaDesc={language === 'en' ? 'Back Neck Curve Raise' : 'Naik Lekuk Leher Belakang'}
                    formula="Ketetapan lekuk leher belakang"
                    finalResult="1,5 cm"
                    isFrontSide={false}
                  />
                  <CompactFormulaBlock
                    point="C – D"
                    formulaDesc={language === 'en' ? '⅙ Neck Circumference' : '⅙ Lingkar Leher'}
                    formula="⅙ Lingkar Leher"
                    substitution={`${formatVal(ll)} / 6`}
                    result={formatVal(idBackCD)}
                    isFrontSide={false}
                  />
                  <CompactFormulaBlock
                    point="A – E"
                    formulaDesc={language === 'en' ? '¼ Bust Circumference − 1 cm (or − 2 cm)' : '¼ Lingkar Badan − 1 cm (atau − 2 cm)'}
                    formula="¼ Lingkar Badan − 1 cm"
                    substitution={`(${formatVal(lb)} / 4) − 1`}
                    result={formatVal(idBackAE)}
                    isFrontSide={false}
                  />
                  <CompactFormulaBlock
                    point="E – F"
                    formulaDesc={language === 'en' ? 'Side Length' : 'Panjang Sisi'}
                    formula="Panjang Sisi"
                    substitution={formatVal(ps)}
                    result={formatVal(idBackEF)}
                    isFrontSide={false}
                  />
                  <CompactFormulaBlock
                    point="C – G"
                    formulaDesc={language === 'en' ? 'A – E (¼ Bust − 1 cm)' : 'A – E (¼ Lingkar Badan − 1 cm)'}
                    formula="¼ Lingkar Badan − 1 cm"
                    substitution={`(${formatVal(lb)} / 4) − 1`}
                    result={formatVal(idBackCG)}
                    isFrontSide={false}
                  />
                  <CompactFormulaBlock
                    point="G – H"
                    formulaDesc={language === 'en' ? '¼ (F – G) − 1 cm' : '¼ (F – G) − 1 cm'}
                    formula="¼ (F – G) − 1 cm"
                    substitution={`¼ (${formatVal(pp - 1.5)} − ${formatVal(ps)}) − 1`}
                    result={formatVal(idBackGH)}
                    isFrontSide={false}
                  />
                  <CompactFormulaBlock
                    point="D – I"
                    formulaDesc={language === 'en' ? 'Shoulder Length' : 'Panjang Bahu'}
                    formula="Panjang Bahu"
                    substitution={formatVal(pb)}
                    result={formatVal(idBackDI)}
                    isFrontSide={false}
                  />
                  <CompactFormulaBlock
                    point="D – K"
                    formulaDesc={language === 'en' ? '½ Shoulder Length − 1 cm' : '½ Panjang Bahu − 1 cm'}
                    formula="½ Panjang Bahu − 1 cm"
                    substitution={`(${formatVal(pb)} / 2) − 1`}
                    result={formatVal(idBackDK)}
                    isFrontSide={false}
                  />
                  <CompactFormulaBlock
                    point="J – L"
                    formulaDesc={language === 'en' ? '½ Shoulder Length + 1 cm' : '½ Panjang Bahu + 1 cm'}
                    formula="½ Panjang Bahu + 1 cm"
                    substitution={`(${formatVal(pb)} / 2) + 1`}
                    result={formatVal(idBackJL)}
                    isFrontSide={false}
                  />
                  <CompactFormulaBlock
                    point="A – M"
                    formulaDesc={language === 'en' ? '1/10 Waist Circumference − 1 cm' : '1/10 Lingkar Pinggang − 1 cm'}
                    formula="1/10 Lingkar Pinggang − 1 cm"
                    substitution={`(${formatVal(lping)} / 10) − 1`}
                    result={formatVal(idBackAM)}
                    isFrontSide={false}
                  />
                  <CompactFormulaBlock
                    point="M – O"
                    formulaDesc={language === 'en' ? 'Back Waist Dart Width' : 'Lebar Kupnat Pinggang Belakang'}
                    formula="Ketetapan kupnat pinggang belakang"
                    finalResult="2 cm"
                    isFrontSide={false}
                  />
                  <CompactFormulaBlock
                    point="O – P"
                    formulaDesc={language === 'en' ? '{(¼ Waist) − 1 cm} − (A – M)' : '{(¼ Lingkar Pinggang) − 1 cm} − (A – M)'}
                    formula="{(¼ Lingkar Pinggang) − 1 cm} − (A – M)"
                    substitution={`((${formatVal(lping)} / 4) − 1) − ${formatVal(idBackAM)}`}
                    result={formatVal(idBackOP)}
                    isFrontSide={false}
                  />
                  <CompactFormulaBlock
                    point="Q – R"
                    formulaDesc={language === 'en' ? '½ Back Width' : '½ Lebar Punggung'}
                    formula="½ Lebar Punggung"
                    substitution={`${formatVal(lpung)} / 2`}
                    result={formatVal(idBackQR)}
                    isFrontSide={false}
                  />
                  <CompactFormulaBlock
                    point="K – T"
                    formulaDesc={language === 'en' ? 'Back Shoulder Dart Length' : 'Panjang Kupnat Bahu Belakang'}
                    formula="Ketetapan panjang kupnat bahu"
                    finalResult="6 cm"
                    isFrontSide={false}
                  />
                </div>
              </div>
            </div>

            {/* Informative Footer Note */}
            <div className="mt-6 pt-3.5 border-t border-[#E8DED8] flex items-center justify-between gap-3 flex-wrap text-xs text-[#6B5E57]">
              <p className="italic">
                * {language === 'en'
                  ? 'Indonesian Bodice System: Front pattern is drafted first (+1 cm / +2 cm), followed by Back pattern (−1 cm / −2 cm) with shoulder darts and waist contouring.'
                  : 'Sistem Pola Dasar Badan Indonesia: Pola depan dibuat terlebih dahulu (+1 cm / +2 cm), diikuti pola belakang (−1 cm / −2 cm) dengan kup bahu dan kup pinggang proporsional.'}
              </p>
              <p className="font-mono font-medium text-[#8F2635]">
                {language === 'en' ? 'Indonesian Women\'s Bodice Drafting System' : 'Konstruksi Pola Dasar Badan Wanita Sistem Indonesia'}
              </p>
            </div>
          </>
        ) : isBadanDressmaking ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 pt-5">
              {/* LEFT COLUMN: POLA BELAKANG (BACK PATTERN) - 12 FORMULAS FIRST */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2.5 border-b-2 border-[#1D4ED8]">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#1D4ED8] shadow-2xs" />
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#1E3A8A] uppercase tracking-wider">
                      {t.polaBelakang}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#1E40AF] bg-[#DBEAFE] px-2.5 py-0.5 rounded-full border border-[#BFDBFE]">
                    12 {language === 'en' ? 'Formulas' : 'Perhitungan'}
                  </span>
                </div>

                <div className="space-y-2">
                  <CompactFormulaBlock
                    point="A – B"
                    formulaDesc={language === 'en' ? 'Back Length' : 'Panjang Punggung (Garis TB)'}
                    formula="Panjang Punggung"
                    substitution={formatVal(pp)}
                    result={formatVal(dmBackAB)}
                    isFrontSide={false}
                  />
                  <CompactFormulaBlock
                    point="A – C"
                    formulaDesc={language === 'en' ? '⅙ Neck Circumference + 1 cm' : '⅙ Lingkar Leher + 1 cm'}
                    formula="⅙ Lingkar Leher + 1 cm"
                    substitution={`(${formatVal(ll)} / 6) + 1`}
                    result={formatVal(dmBackAC)}
                    isFrontSide={false}
                  />
                  <CompactFormulaBlock
                    point="C – D"
                    formulaDesc={language === 'en' ? '½ Back Length (Alt: Side Length)' : '½ Panjang Punggung (Alt: Panjang Sisi)'}
                    formula="½ Panjang Punggung"
                    substitution={`${formatVal(pp)} / 2`}
                    result={formatVal(dmBackCD)}
                    isFrontSide={false}
                  />
                  <CompactFormulaBlock
                    point="A – E"
                    formulaDesc={language === 'en' ? '⅙ Neck Circumference + 0.5 cm' : '⅙ Lingkar Leher + 0,5 cm'}
                    formula="⅙ Lingkar Leher + 0,5 cm"
                    substitution={`(${formatVal(ll)} / 6) + 0,5`}
                    result={formatVal(dmBackAE)}
                    isFrontSide={false}
                  />
                  <CompactFormulaBlock
                    point="E – F"
                    formulaDesc={language === 'en' ? 'Shoulder Length' : 'Panjang Bahu'}
                    formula="Panjang Bahu"
                    substitution={formatVal(pb)}
                    result={formatVal(dmBackEF)}
                    isFrontSide={false}
                  />
                  <CompactFormulaBlock
                    point="F"
                    formulaDesc={language === 'en' ? 'Shoulder slope down 3 to 3.5 cm' : 'Turun 3 s/d 3,5 cm (Kemiringan bahu)'}
                    formula="Ketetapan turun bahu belakang"
                    substitution="3 cm"
                    result="3"
                    isFrontSide={false}
                  />
                  <CompactFormulaBlock
                    point="C – G"
                    formulaDesc={language === 'en' ? '½ C – D (Back width line)' : '½ C – D (Letak Lebar Punggung)'}
                    formula="½ (C – D)"
                    substitution={`${formatVal(dmBackCD)} / 2`}
                    result={formatVal(dmBackCG)}
                    isFrontSide={false}
                  />
                  <CompactFormulaBlock
                    point="G – G'"
                    formulaDesc={language === 'en' ? '½ Back Width' : '½ Lebar Punggung'}
                    formula="½ Lebar Punggung"
                    substitution={`${formatVal(lpung)} / 2`}
                    result={formatVal(dmBackGGprime)}
                    isFrontSide={false}
                  />
                  <CompactFormulaBlock
                    point="D – D'"
                    formulaDesc={language === 'en' ? '¼ Bust Circumference − 1 cm' : '¼ Lingkar Badan − 1 cm'}
                    formula="¼ Lingkar Badan − 1 cm"
                    substitution={`(${formatVal(lb)} / 4) − 1`}
                    result={formatVal(dmBackDDprime)}
                    isFrontSide={false}
                  />
                  <CompactFormulaBlock
                    point="B – B'"
                    formulaDesc={language === 'en' ? '¼ Waist Circumference − 1 cm + 3 cm' : '¼ Lingkar Pinggang − 1 cm + 3 cm'}
                    formula="¼ Lingkar Pinggang − 1 cm + 3 cm"
                    substitution={`(${formatVal(lping)} / 4) − 1 + 3`}
                    result={formatVal(dmBackBBprime)}
                    isFrontSide={false}
                  />
                  <CompactFormulaBlock
                    point="B – H"
                    formulaDesc={language === 'en' ? '1/10 Waist Circumference' : '1/10 Lingkar Pinggang (Letak kupnat)'}
                    formula="1/10 Lingkar Pinggang"
                    substitution={`${formatVal(lping)} / 10`}
                    result={formatVal(dmBackBH)}
                    isFrontSide={false}
                  />
                  <CompactFormulaBlock
                    point="H – H'"
                    formulaDesc={language === 'en' ? 'Back dart width 3 cm' : 'Lebar Kupnat Belakang 3 cm'}
                    formula="Lebar bukaan kupnat belakang"
                    substitution="3 cm"
                    result="3"
                    isFrontSide={false}
                  />
                </div>
              </div>

              {/* RIGHT COLUMN: POLA DEPAN (FRONT PATTERN) - 12 FORMULAS SECOND */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2.5 border-b-2 border-[#8F2635]">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#8F2635] shadow-2xs" />
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#8F2635] uppercase tracking-wider">
                      {t.polaDepan}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#8F2635] bg-[#F3E7E7] px-2.5 py-0.5 rounded-full border border-[#E8DED8]">
                    12 {language === 'en' ? 'Formulas' : 'Perhitungan'}
                  </span>
                </div>

                <div className="space-y-2">
                  <CompactFormulaBlock
                    point="A – B"
                    formulaDesc={language === 'en' ? 'Front Length' : 'Panjang Muka (Garis TM)'}
                    formula="Panjang Muka"
                    substitution={formatVal(pm)}
                    result={formatVal(dmFrontAB)}
                    isFrontSide={true}
                  />
                  <CompactFormulaBlock
                    point="A – C"
                    formulaDesc={language === 'en' ? '⅙ Neck Circumference + 2 cm' : '⅙ Lingkar Leher + 2 cm'}
                    formula="⅙ Lingkar Leher + 2 cm"
                    substitution={`(${formatVal(ll)} / 6) + 2`}
                    result={formatVal(dmFrontAC)}
                    isFrontSide={true}
                  />
                  <CompactFormulaBlock
                    point="A – D"
                    formulaDesc={language === 'en' ? '⅙ Neck Circumference + 1 cm' : '⅙ Lingkar Leher + 1 cm'}
                    formula="⅙ Lingkar Leher + 1 cm"
                    substitution={`(${formatVal(ll)} / 6) + 1`}
                    result={formatVal(dmFrontAD)}
                    isFrontSide={true}
                  />
                  <CompactFormulaBlock
                    point="D – E"
                    formulaDesc={language === 'en' ? 'Shoulder Length' : 'Panjang Bahu'}
                    formula="Panjang Bahu"
                    substitution={formatVal(pb)}
                    result={formatVal(dmFrontDE)}
                    isFrontSide={true}
                  />
                  <CompactFormulaBlock
                    point="E"
                    formulaDesc={language === 'en' ? 'Shoulder slope down 3.5 cm' : 'Turun 3,5 cm (Kemiringan bahu muka)'}
                    formula="Ketetapan turun bahu muka"
                    substitution="3,5 cm"
                    result="3,5"
                    isFrontSide={true}
                  />
                  <CompactFormulaBlock
                    point="C – F"
                    formulaDesc={language === 'en' ? 'Front chest width down 5 cm' : 'Turun 5 cm (Letak Lebar Muka)'}
                    formula="Ketetapan letak garis lebar muka"
                    substitution="5 cm"
                    result="5"
                    isFrontSide={true}
                  />
                  <CompactFormulaBlock
                    point="F – F'"
                    formulaDesc={language === 'en' ? '½ Front Chest Width' : '½ Lebar Muka'}
                    formula="½ Lebar Muka"
                    substitution={`${formatVal(lm)} / 2`}
                    result={formatVal(dmFrontFFprime)}
                    isFrontSide={true}
                  />
                  <CompactFormulaBlock
                    point="G – G'"
                    formulaDesc={language === 'en' ? '¼ Bust Circumference + 1 cm' : '¼ Lingkar Badan + 1 cm'}
                    formula="¼ Lingkar Badan + 1 cm"
                    substitution={`(${formatVal(lb)} / 4) + 1`}
                    result={formatVal(dmFrontGGprime)}
                    isFrontSide={true}
                  />
                  <CompactFormulaBlock
                    point="B – B'"
                    formulaDesc={language === 'en' ? '¼ Waist Circumference + 1 cm + 3 cm' : '¼ Lingkar Pinggang + 1 cm + 3 cm'}
                    formula="¼ Lingkar Pinggang + 1 cm + 3 cm"
                    substitution={`(${formatVal(lping)} / 4) + 1 + 3`}
                    result={formatVal(dmFrontBBprime)}
                    isFrontSide={true}
                  />
                  <CompactFormulaBlock
                    point="D – P"
                    formulaDesc={language === 'en' ? 'Bust Height' : 'Tinggi Dada'}
                    formula="Tinggi Dada"
                    substitution={formatVal(td)}
                    result={formatVal(dmFrontDP)}
                    isFrontSide={true}
                  />
                  <CompactFormulaBlock
                    point="P – P'"
                    formulaDesc={language === 'en' ? '½ Bust Distance (Bust Point)' : '½ Jarak Dada (Puncak Dada / Bust Point)'}
                    formula="½ Jarak Dada"
                    substitution={`${formatVal(jd)} / 2`}
                    result={formatVal(dmFrontPPprime)}
                    isFrontSide={true}
                  />
                  <CompactFormulaBlock
                    point="Kupnat Sisi"
                    formulaDesc={language === 'en' ? 'Side Dart (Length difference: 3 to 4 cm)' : 'Kupnat Sisi (Selisih Panjang Sisi: 3 s/d 4 cm)'}
                    formula="Selisih Panjang Muka vs Punggung (Min 3 cm)"
                    substitution={`|${formatVal(pm)} − ${formatVal(pp)}|`}
                    result={formatVal(dmFrontSideDart)}
                    isFrontSide={true}
                  />
                </div>
              </div>
            </div>

            {/* Informative Footer Note */}
            <div className="mt-6 pt-3.5 border-t border-[#E8DED8] flex items-center justify-between gap-3 flex-wrap text-xs text-[#6B5E57]">
              <p className="italic">
                * {language === 'en'
                  ? 'Dressmaking Bodice System Construction Order: Back Pattern 🔵 → Front Pattern 🔴 → Side Dart (Kupnat Sisi).'
                  : 'Urutan Konstruksi Pola Badan Sistem Dressmaking: Pola Belakang 🔵 → Pola Depan 🔴 → Pembentukan Kupnat Sisi (Side Dart).'}
              </p>
              <p className="font-mono font-medium text-[#8F2635]">
                {language === 'en' ? 'Dressmaking Bodice Drafting System' : 'Konstruksi Pola Dasar Badan Sistem Dressmaking'}
              </p>
            </div>
          </>
        ) : isBadanSederhana ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 pt-5">
              {/* LEFT COLUMN: POLA DEPAN (FRONT PATTERN) - 14 FORMULAS */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2.5 border-b-2 border-[#8F2635]">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#8F2635] shadow-2xs" />
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#8F2635] uppercase tracking-wider">
                      {t.polaDepan}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#8F2635] bg-[#F3E7E7] px-2.5 py-0.5 rounded-full border border-[#E8DED8]">
                    14 {language === 'en' ? 'Formulas' : 'Perhitungan'}
                  </span>
                </div>

                <div className="space-y-2">
                  <CompactFormulaBlock
                    point="A – B"
                    formulaDesc={language === 'en' ? 'Back Length + 1.5 cm' : 'Panjang Punggung + 1.5 s/d 2 cm'}
                    formula="Panjang Punggung + 1.5 cm"
                    substitution={`${formatVal(pp)} + 1,5`}
                    result={formatVal(frontBodiceAB)}
                  />
                  <CompactFormulaBlock
                    point="B – C"
                    formulaDesc={language === 'en' ? '½ Back Length − 1 cm (Alt: Side Length)' : '½ Panjang Punggung − 1 cm (Alt: Panjang Sisi)'}
                    formula="½ Panjang Punggung − 1 cm"
                    substitution={`(${formatVal(pp)} / 2) − 1 (atau Panjang Sisi: ${formatVal(ps)})`}
                    result={formatVal(frontBodiceBC)}
                  />
                  <CompactFormulaBlock
                    point="A – D"
                    formulaDesc={language === 'en' ? '⅙ Neck Circumference + 2.5 cm' : '⅙ Lingkar Leher + 2.5 cm'}
                    formula="⅙ Lingkar Leher + 2.5 cm"
                    substitution={`(${formatVal(ll)} / 6) + 2,5`}
                    result={formatVal(frontBodiceAD)}
                  />
                  <CompactFormulaBlock
                    point="A – A'"
                    formulaDesc={language === 'en' ? '⅙ Neck Circumference + 0.5 cm' : '⅙ Lingkar Leher + 0.5 cm'}
                    formula="⅙ Lingkar Leher + 0.5 cm"
                    substitution={`(${formatVal(ll)} / 6) + 0,5`}
                    result={formatVal(frontBodiceAAprime)}
                  />
                  <CompactFormulaBlock
                    point="A' – E"
                    formulaDesc={language === 'en' ? 'Shoulder Length' : 'Panjang Bahu'}
                    formula="Panjang Bahu"
                    substitution={formatVal(pb)}
                    result={formatVal(pb)}
                  />
                  <CompactFormulaBlock
                    point="E"
                    formulaDesc={language === 'en' ? 'Shoulder slope down 3.5 cm' : 'Turun 3.5 cm (3 s/d 3.5 cm)'}
                    formula="Ketetapan turun bahu muka"
                    substitution="3.5 cm"
                    result="3,5"
                  />
                  <CompactFormulaBlock
                    point="D – D'"
                    formulaDesc={language === 'en' ? '½ D – C (or drop 5 cm)' : '½ D – C (Alt: Turun 5 cm)'}
                    formula="½ (AC − AD) atau turun 5 cm"
                    substitution={`½ (${formatVal(frontBodiceAB - frontBodiceBC)} − ${formatVal(frontBodiceAD)})`}
                    result={formatVal(frontBodiceDDprime)}
                  />
                  <CompactFormulaBlock
                    point="D' – D''"
                    formulaDesc={language === 'en' ? '½ Front Chest Width' : '½ Lebar Muka'}
                    formula="½ Lebar Muka"
                    substitution={`${formatVal(lm)} / 2`}
                    result={formatVal(frontBodiceDDdoublePrime)}
                  />
                  <CompactFormulaBlock
                    point="C – C'"
                    formulaDesc={language === 'en' ? '¼ Bust Circumference + 1 cm' : '¼ Lingkar Badan + 1 cm'}
                    formula="¼ Lingkar Badan + 1 cm"
                    substitution={`(${formatVal(lb)} / 4) + 1`}
                    result={formatVal(frontBodiceCCprime)}
                  />
                  <CompactFormulaBlock
                    point="B – B'"
                    formulaDesc={language === 'en' ? '¼ Bust Circumference + 1 cm' : '¼ Lingkar Badan + 1 cm'}
                    formula="¼ Lingkar Badan + 1 cm"
                    substitution={`(${formatVal(lb)} / 4) + 1`}
                    result={formatVal(frontBodiceCCprime)}
                  />
                  <CompactFormulaBlock
                    point="D – F"
                    formulaDesc={language === 'en' ? 'Bust Height' : 'Tinggi Dada'}
                    formula="Tinggi Dada"
                    substitution={formatVal(td)}
                    result={formatVal(td)}
                  />
                  <CompactFormulaBlock
                    point="F – F'"
                    formulaDesc={language === 'en' ? '½ Bust Point Distance' : '½ Jarak Dada'}
                    formula="½ Jarak Dada"
                    substitution={`${formatVal(jd)} / 2`}
                    result={formatVal(frontBodiceFFprime)}
                  />
                  <CompactFormulaBlock
                    point="B"
                    formulaDesc={language === 'en' ? 'Center Front waist drop 2 cm' : 'Turun 2 s/d 3 cm'}
                    formula="Ketetapan lekuk pinggang muka"
                    substitution="2 cm"
                    result="2"
                  />
                  <CompactFormulaBlock
                    point="B – B''"
                    formulaDesc={language === 'en' ? '¼ Waist Circumference + 1 cm + 3 cm' : '¼ Lingkar Pinggang + 1 cm + 3 cm'}
                    formula="¼ Lingkar Pinggang + 1 cm + 3 cm"
                    substitution={`(${formatVal(lping)} / 4) + 1 + 3`}
                    result={formatVal(frontBodiceBBdoublePrime)}
                  />
                </div>
              </div>

              {/* RIGHT COLUMN: POLA BELAKANG (BACK PATTERN) - 13 FORMULAS */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2.5 border-b-2 border-[#1D4ED8]">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#1D4ED8] shadow-2xs" />
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#1E3A8A] uppercase tracking-wider">
                      {t.polaBelakang}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#1E40AF] bg-[#DBEAFE] px-2.5 py-0.5 rounded-full border border-[#BFDBFE]">
                    13 {language === 'en' ? 'Formulas' : 'Perhitungan'}
                  </span>
                </div>

                <div className="space-y-2">
                  <CompactFormulaBlock
                    point="A – B"
                    formulaDesc={language === 'en' ? 'Back Length + 1.5 cm' : 'Panjang Punggung + 1.5 s/d 2 cm'}
                    formula="Panjang Punggung + 1.5 cm"
                    substitution={`${formatVal(pp)} + 1,5`}
                    result={formatVal(backBodiceAB)}
                    isFrontSide={false}
                  />
                  <CompactFormulaBlock
                    point="B – C"
                    formulaDesc={language === 'en' ? '½ Back Length − 1 cm (Alt: Side Length)' : '½ Panjang Punggung − 1 cm (Alt: Panjang Sisi)'}
                    formula="½ Panjang Punggung − 1 cm"
                    substitution={`(${formatVal(pp)} / 2) − 1 (atau Panjang Sisi: ${formatVal(ps)})`}
                    result={formatVal(backBodiceBC)}
                    isFrontSide={false}
                  />
                  <CompactFormulaBlock
                    point="A – D"
                    formulaDesc={language === 'en' ? 'Back neck drop 1 to 2 cm' : 'Turun 1 cm s/d 2 cm'}
                    formula="Ketetapan lekuk leher belakang"
                    substitution="1.5 cm"
                    result="1,5"
                    isFrontSide={false}
                  />
                  <CompactFormulaBlock
                    point="A – A'"
                    formulaDesc={language === 'en' ? '⅙ Neck Circumference + 0.5 cm' : '⅙ Lingkar Leher + 0.5 cm'}
                    formula="⅙ Lingkar Leher + 0.5 cm"
                    substitution={`(${formatVal(ll)} / 6) + 0,5`}
                    result={formatVal(backBodiceAAprime)}
                    isFrontSide={false}
                  />
                  <CompactFormulaBlock
                    point="A' – E"
                    formulaDesc={language === 'en' ? 'Shoulder Length' : 'Panjang Bahu'}
                    formula="Panjang Bahu"
                    substitution={formatVal(pb)}
                    result={formatVal(pb)}
                    isFrontSide={false}
                  />
                  <CompactFormulaBlock
                    point="E"
                    formulaDesc={language === 'en' ? 'Shoulder slope down 4 cm' : 'Turun 4 cm (3 s/d 4 cm)'}
                    formula="Ketetapan turun bahu belakang"
                    substitution="4 cm"
                    result="4"
                    isFrontSide={false}
                  />
                  <CompactFormulaBlock
                    point="D – D'"
                    formulaDesc={language === 'en' ? 'Back width line down 8 to 10 cm' : 'Turun 8 cm s/d 10 cm'}
                    formula="Ketetapan garis lebar punggung"
                    substitution="9 cm"
                    result="9"
                    isFrontSide={false}
                  />
                  <CompactFormulaBlock
                    point="D' – D''"
                    formulaDesc={language === 'en' ? '½ Back Width (Front Chest Width + 1 cm)' : '½ Lebar Punggung (Lebar Muka + 1 cm)'}
                    formula="½ (Lebar Muka + 1 cm)"
                    substitution={`(${formatVal(lm)} + 1) / 2`}
                    result={formatVal(backBodiceDDdoublePrime)}
                    isFrontSide={false}
                  />
                  <CompactFormulaBlock
                    point="C – C'"
                    formulaDesc={language === 'en' ? '¼ Bust Circumference − 1 cm' : '¼ Lingkar Badan − 1 cm'}
                    formula="¼ Lingkar Badan − 1 cm"
                    substitution={`(${formatVal(lb)} / 4) − 1`}
                    result={formatVal(backBodiceCCprime)}
                    isFrontSide={false}
                  />
                  <CompactFormulaBlock
                    point="B – B'"
                    formulaDesc={language === 'en' ? '¼ Bust Circumference − 1 cm' : '¼ Lingkar Badan − 1 cm'}
                    formula="¼ Lingkar Badan − 1 cm"
                    substitution={`(${formatVal(lb)} / 4) − 1`}
                    result={formatVal(backBodiceCCprime)}
                    isFrontSide={false}
                  />
                  <CompactFormulaBlock
                    point="B – F"
                    formulaDesc={language === 'en' ? '1/10 Waist Circumference − 1 cm' : '1/10 Lingkar Pinggang − 1 cm'}
                    formula="1/10 Lingkar Pinggang − 1 cm"
                    substitution={`(${formatVal(lping)} / 10) − 1`}
                    result={formatVal(backBodiceBF)}
                    isFrontSide={false}
                  />
                  <CompactFormulaBlock
                    point="F – F'"
                    formulaDesc={language === 'en' ? 'Back dart width 3 cm' : 'Kupnat 3 cm'}
                    formula="Besar kupnat belakang"
                    substitution="3 cm"
                    result="3"
                    isFrontSide={false}
                  />
                  <CompactFormulaBlock
                    point="B – B''"
                    formulaDesc={language === 'en' ? '¼ Waist Circumference − 1 cm + 3 cm' : '¼ Lingkar Pinggang − 1 cm + 3 cm'}
                    formula="¼ Lingkar Pinggang − 1 cm + 3 cm"
                    substitution={`(${formatVal(lping)} / 4) − 1 + 3`}
                    result={formatVal(backBodiceBBdoublePrime)}
                    isFrontSide={false}
                  />
                </div>
              </div>
            </div>

            {/* Informative Footer Note */}
            <div className="mt-6 pt-3.5 border-t border-[#E8DED8] flex items-center justify-between gap-3 flex-wrap text-xs text-[#6B5E57]">
              <p className="italic">
                * {language === 'en'
                  ? 'Standard Bodice System: Front pattern is wider by +1 cm, Back pattern is narrower by −1 cm with 3 cm waist dart.'
                  : 'Sistem Pola Dasar Badan Sederhana: Pola depan lebih besar (+1 cm), pola belakang dikurangi (−1 cm) dengan kupnat pinggang 3 cm.'}
              </p>
              <p className="font-mono font-medium text-[#8F2635]">
                {language === 'en' ? 'Standard Women\'s Bodice Drafting System' : 'Konstruksi Pola Dasar Badan Wanita Sistem Sederhana'}
              </p>
            </div>
          </>
        ) : isIndonesia ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 pt-5">
              {/* LEFT COLUMN: POLA DEPAN (FRONT PATTERN) - 8 FORMULAS */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2.5 border-b-2 border-[#8F2635]">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#8F2635] shadow-2xs" />
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#8F2635] uppercase tracking-wider">
                      {t.polaDepan}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#8F2635] bg-[#F3E7E7] px-2.5 py-0.5 rounded-full border border-[#E8DED8]">
                    8 {language === 'en' ? 'Formulas' : 'Perhitungan'}
                  </span>
                </div>

                <div className="space-y-2">
                  {/* 1. A – B */}
                  <CompactFormulaBlock
                    point="A – B"
                    formulaDesc={constantLabel}
                    finalResult="2 cm"
                    isFrontSide={true}
                  />

                  {/* 2. B – C */}
                  <CompactFormulaBlock
                    point="B – C"
                    formulaDesc={language === 'en' ? 'Hip Depth' : 'Tinggi Panggul'}
                    finalResult={`${formatVal(tp)} cm`}
                    isFrontSide={true}
                  />

                  {/* 3. B – D */}
                  <CompactFormulaBlock
                    point="B – D"
                    formulaDesc={language === 'en' ? 'Skirt Length' : 'Panjang Rok'}
                    finalResult={`${formatVal(pr)} cm`}
                    isFrontSide={true}
                  />

                  {/* 4. A – E */}
                  <CompactFormulaBlock
                    point="A – E"
                    formulaDesc={language === 'en' ? '¼ Waist Circumference + 1 cm' : '¼ Lingkar Pinggang + 1 cm'}
                    substitution={`(¼ × ${formatVal(lp)} cm) + 1 cm`}
                    finalResult={`${formatVal(indonesiaFrontAE)} cm`}
                    isFrontSide={true}
                  />

                  {/* 5. C – F */}
                  <CompactFormulaBlock
                    point="C – F"
                    formulaDesc={language === 'en' ? '¼ Hip Circumference + 1 cm' : '¼ Lingkar Panggul + 1 cm'}
                    substitution={`(¼ × ${formatVal(lpg)} cm) + 1 cm`}
                    finalResult={`${formatVal(indonesiaFrontCF)} cm`}
                    isFrontSide={true}
                  />

                  {/* 6. D – G */}
                  <CompactFormulaBlock
                    point="D – G"
                    formulaDesc={language === 'en' ? 'C – F' : 'C – F'}
                    substitution={`(¼ × ${formatVal(lpg)} cm) + 1 cm`}
                    finalResult={`${formatVal(indonesiaFrontCF)} cm`}
                    isFrontSide={true}
                  />

                  {/* 7. G – H */}
                  <CompactFormulaBlock
                    point="G – H"
                    formulaDesc={language === 'en' ? 'Hem Flare' : 'Pengembangan Kelim Bawah'}
                    finalResult="5 cm"
                    isFrontSide={true}
                  />

                  {/* 8. H – I */}
                  <CompactFormulaBlock
                    point="H – I"
                    formulaDesc={language === 'en' ? 'Raise 1.5 cm (Hem curve)' : 'Naik 1,5 cm (Lengkung kelim bawah)'}
                    finalResult="1,5 cm"
                    isFrontSide={true}
                  />
                </div>
              </div>

              {/* RIGHT COLUMN: POLA BELAKANG (BACK PATTERN) - 12 FORMULAS */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2.5 border-b-2 border-[#332C29]">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#332C29] shadow-2xs" />
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#332C29] uppercase tracking-wider">
                      {t.polaBelakang}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#332C29] bg-[#E8DED8] px-2.5 py-0.5 rounded-full border border-[#DFD4CD]">
                    12 {language === 'en' ? 'Formulas' : 'Perhitungan'}
                  </span>
                </div>

                <div className="space-y-2">
                  {/* 1. A – B */}
                  <CompactFormulaBlock
                    point="A – B"
                    formulaDesc={constantLabel}
                    finalResult="2 cm"
                    isFrontSide={false}
                  />

                  {/* 2. B – C */}
                  <CompactFormulaBlock
                    point="B – C"
                    formulaDesc={language === 'en' ? 'Hip Depth' : 'Tinggi Panggul'}
                    finalResult={`${formatVal(tp)} cm`}
                    isFrontSide={false}
                  />

                  {/* 3. B – D */}
                  <CompactFormulaBlock
                    point="B – D"
                    formulaDesc={language === 'en' ? 'Skirt Length' : 'Panjang Rok'}
                    finalResult={`${formatVal(pr)} cm`}
                    isFrontSide={false}
                  />

                  {/* 4. A – E */}
                  <CompactFormulaBlock
                    point="A – E"
                    formulaDesc={language === 'en' ? '¼ Waist Circumference − 1 cm + 2 cm' : '¼ Lingkar Pinggang − 1 cm + 2 cm'}
                    substitution={`(¼ × ${formatVal(lp)} cm) − 1 cm + 2 cm`}
                    finalResult={`${formatVal(indonesiaBackAE)} cm`}
                    isFrontSide={false}
                  />

                  {/* 5. C – F */}
                  <CompactFormulaBlock
                    point="C – F"
                    formulaDesc={language === 'en' ? '¼ Hip Circumference − 1 cm' : '¼ Lingkar Panggul − 1 cm'}
                    substitution={`(¼ × ${formatVal(lpg)} cm) − 1 cm`}
                    finalResult={`${formatVal(indonesiaBackCF)} cm`}
                    isFrontSide={false}
                  />

                  {/* 6. D – G */}
                  <CompactFormulaBlock
                    point="D – G"
                    formulaDesc={language === 'en' ? 'C – F' : 'C – F'}
                    substitution={`(¼ × ${formatVal(lpg)} cm) − 1 cm`}
                    finalResult={`${formatVal(indonesiaBackCF)} cm`}
                    isFrontSide={false}
                  />

                  {/* 7. G – H */}
                  <CompactFormulaBlock
                    point="G – H"
                    formulaDesc={language === 'en' ? 'Hem Flare' : 'Pengembangan Kelim Bawah'}
                    finalResult="5 cm"
                    isFrontSide={false}
                  />

                  {/* 8. B – J */}
                  <CompactFormulaBlock
                    point="B – J"
                    formulaDesc={language === 'en' ? '1/10 Waist Circumference − 1 cm' : '1/10 Lingkar Pinggang − 1 cm'}
                    substitution={`(1/10 × ${formatVal(lp)} cm) − 1 cm`}
                    finalResult={`${formatVal(indonesiaBackBJ)} cm`}
                    isFrontSide={false}
                  />

                  {/* 9. J – K */}
                  <CompactFormulaBlock
                    point="J – K"
                    formulaDesc={language === 'en' ? 'Dart Width' : 'Lebar Kupnat'}
                    finalResult="2 cm"
                    isFrontSide={false}
                  />

                  {/* 10. J – L */}
                  <CompactFormulaBlock
                    point="J – L"
                    formulaDesc={language === 'en' ? 'Dart Depth (Left Side)' : 'Panjang Kupnat (Sisi Kiri)'}
                    finalResult="12 cm"
                    isFrontSide={false}
                  />

                  {/* 11. K – L */}
                  <CompactFormulaBlock
                    point="K – L"
                    formulaDesc={language === 'en' ? 'Dart Depth (Right Side)' : 'Panjang Kupnat (Sisi Kanan)'}
                    finalResult="12 cm"
                    isFrontSide={false}
                  />

                  {/* 12. H – I */}
                  <CompactFormulaBlock
                    point="H – I"
                    formulaDesc={language === 'en' ? 'Raise 1.5 cm (Hem curve)' : 'Naik 1,5 cm (Lengkung kelim bawah)'}
                    finalResult="1,5 cm"
                    isFrontSide={false}
                  />
                </div>
              </div>
            </div>
          </>
        ) : isDressmaking ? (
          /* 2. DRESSMAKING SYSTEM FORMULA BREAKDOWN */
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 pt-5">
              {/* LEFT COLUMN: POLA DEPAN (FRONT PATTERN) - 12 FORMULAS */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2.5 border-b-2 border-[#8F2635]">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#8F2635] shadow-2xs" />
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#8F2635] uppercase tracking-wider">
                      {t.polaDepan}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#8F2635] bg-[#F3E7E7] px-2.5 py-0.5 rounded-full border border-[#E8DED8]">
                    12 {language === 'en' ? 'Formulas' : 'Perhitungan'}
                  </span>
                </div>

                <div className="space-y-2">
                  {/* 1. A – B */}
                  <CompactFormulaBlock
                    point="A – B"
                    formulaDesc={language === 'en' ? 'Skirt Length' : 'Panjang Rok'}
                    finalResult={`${formatVal(pr)} cm`}
                    isFrontSide={true}
                  />

                  {/* 2. A – C */}
                  <CompactFormulaBlock
                    point="A – C"
                    formulaDesc={language === 'en' ? 'Hip Depth' : 'Tinggi Panggul'}
                    finalResult={`${formatVal(tp)} cm`}
                    isFrontSide={true}
                  />

                  {/* 3. A – A1 */}
                  <CompactFormulaBlock
                    point="A – A1"
                    formulaDesc={language === 'en' ? '¼ Waist Circumference + 4 cm' : '¼ Lingkar Pinggang + 4 cm'}
                    substitution={`(¼ × ${formatVal(lp)} cm) + 4 cm`}
                    finalResult={`${formatVal(dressmakingFrontAA1)} cm`}
                    isFrontSide={true}
                  />

                  {/* 4. A1 – A2 */}
                  <CompactFormulaBlock
                    point="A1 – A2"
                    formulaDesc={language === 'en' ? 'Raise 1.5 cm (Side waist curve)' : 'Naik 1,5 cm (Lengkung pinggang samping)'}
                    finalResult="1,5 cm"
                    isFrontSide={true}
                  />

                  {/* 5. A – D */}
                  <CompactFormulaBlock
                    point="A – D"
                    formulaDesc={language === 'en' ? '1/10 Waist Circumference' : '1/10 Lingkar Pinggang (Posisi kupnat)'}
                    substitution={`1/10 × ${formatVal(lp)} cm`}
                    finalResult={`${formatVal(dressmakingFrontAD)} cm`}
                    isFrontSide={true}
                  />

                  {/* 6. D – D1 */}
                  <CompactFormulaBlock
                    point="D – D1"
                    formulaDesc={language === 'en' ? 'Dart Width' : 'Lebar Kupnat'}
                    finalResult="3 cm"
                    isFrontSide={true}
                  />

                  {/* 7. D – O */}
                  <CompactFormulaBlock
                    point="D – O"
                    formulaDesc={language === 'en' ? 'Dart Depth' : 'Panjang Kupnat'}
                    finalResult="12 cm"
                    isFrontSide={true}
                  />

                  {/* 8. D1 – O */}
                  <CompactFormulaBlock
                    point="D1 – O"
                    formulaDesc={language === 'en' ? 'Dart Depth' : 'Panjang Kupnat'}
                    finalResult="12 cm"
                    isFrontSide={true}
                  />

                  {/* 9. C – C1 */}
                  <CompactFormulaBlock
                    point="C – C1"
                    formulaDesc={language === 'en' ? '¼ Hip Circumference + 1 cm' : '¼ Lingkar Panggul + 1 cm'}
                    substitution={`(¼ × ${formatVal(lpg)} cm) + 1 cm`}
                    finalResult={`${formatVal(dressmakingFrontCC1)} cm`}
                    isFrontSide={true}
                  />

                  {/* 10. B – B1 */}
                  <CompactFormulaBlock
                    point="B – B1"
                    formulaDesc={language === 'en' ? 'C – C1 (Horizontal hip width)' : 'C – C1 (Lebar mendatar panggul)'}
                    substitution={`(¼ × ${formatVal(lpg)} cm) + 1 cm`}
                    finalResult={`${formatVal(dressmakingFrontCC1)} cm`}
                    isFrontSide={true}
                  />

                  {/* 11. B1 – B2 */}
                  <CompactFormulaBlock
                    point="B1 – B2"
                    formulaDesc={language === 'en' ? 'Bottom Hem Flare' : 'Pengembangan Kelim Bawah'}
                    finalResult="3 cm"
                    isFrontSide={true}
                  />

                  {/* 12. B2 – B3 */}
                  <CompactFormulaBlock
                    point="B2 – B3"
                    formulaDesc={language === 'en' ? 'Raise 1.5 cm (Hem curve)' : 'Naik 1,5 cm (Lengkung kelim bawah)'}
                    finalResult="1,5 cm"
                    isFrontSide={true}
                  />
                </div>
              </div>

              {/* RIGHT COLUMN: POLA BELAKANG (BACK PATTERN) - 2 FORMULAS */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2.5 border-b-2 border-[#332C29]">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#332C29] shadow-2xs" />
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#332C29] uppercase tracking-wider">
                      {t.polaBelakang}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#332C29] bg-[#E8DED8] px-2.5 py-0.5 rounded-full border border-[#DFD4CD]">
                    2 {language === 'en' ? 'Formulas' : 'Perhitungan'}
                  </span>
                </div>

                <div className="space-y-2">
                  {/* 1. A – E */}
                  <CompactFormulaBlock
                    point="A – E"
                    formulaDesc={language === 'en' ? 'Zipper / Back Opening Allowance' : 'Ketetapan Belahan Resleting Belakang'}
                    finalResult="2 cm"
                    isFrontSide={false}
                  />

                  {/* 2. B – F */}
                  <CompactFormulaBlock
                    point="B – F"
                    formulaDesc={language === 'en' ? 'Zipper / Back Opening Allowance' : 'Ketetapan Belahan Resleting Belakang'}
                    finalResult="2 cm"
                    isFrontSide={false}
                  />
                </div>
              </div>
            </div>

            {/* Informative Footer Note */}
            <div className="mt-6 pt-3.5 border-t border-[#E8DED8] flex items-center justify-between gap-3 flex-wrap text-xs text-[#6B5E57]">
              <p className="italic">
                * {language === 'en'
                  ? 'Dressmaking drafting system: Front pattern is wider by 1 cm and includes 3 cm dart allocation (+4 cm total).'
                  : 'Sistem pola Dressmaking: Pola depan lebih besar 1 cm dan dialokasikan kupnat 3 cm (+4 cm total).'}
              </p>
              <p className="font-mono font-medium text-[#8F2635]">
                {language === 'en' ? 'Professional Dressmaking Drafting System' : 'Sistem Konstruksi Pola Dressmaking'}
              </p>
            </div>
          </>
        ) : !isSederhana || !hasCalculations ? (
          /* 3. PENDING CUSTOM FORMULAS */
          <div className="py-12 px-4 text-center space-y-3 bg-white/60 rounded-xl border border-dashed border-[#D5C7BF] mt-5">
            <div className="w-10 h-10 mx-auto rounded-full bg-[#E8DED8] text-[#8F2635] flex items-center justify-center">
              <BookOpen size={20} />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <p className="font-serif font-bold text-sm text-[#332C29]">
                {language === 'en' ? `${systemDisplayName} Formula Breakdown Ready for Setup` : `Penjelasan Rumus ${systemDisplayName}`}
              </p>
              <p className="text-xs text-[#6B5E57] leading-relaxed">
                {language === 'en'
                  ? `The step-by-step mathematical derivation for ${systemDisplayName} will be displayed here once formulas are configured.`
                  : `Penjabaran langkah matematis untuk ${systemDisplayName} akan ditampilkan di sini setelah rumus dikonfigurasi.`}
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* 4. TWO-COLUMN WORKBOOK LAYOUT FOR POLA 1 (SEDERHANA) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 pt-5">
              {/* LEFT COLUMN: POLA DEPAN (FRONT PATTERN) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2.5 border-b-2 border-[#8F2635]">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#8F2635] shadow-2xs" />
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#8F2635] uppercase tracking-wider">
                      {t.polaDepan}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#8F2635] bg-[#F3E7E7] px-2.5 py-0.5 rounded-full border border-[#E8DED8]">
                    10 {language === 'en' ? 'Formulas' : 'Perhitungan'}
                  </span>
                </div>

                <div className="space-y-2">
                  {/* 1. A – B */}
                  <CompactFormulaBlock
                    point="A – B"
                    formulaDesc={constantLabel}
                    finalResult="2 cm"
                    isFrontSide={true}
                  />

                  {/* 2. A – C */}
                  <CompactFormulaBlock
                    point="A – C"
                    formulaDesc={language === 'en' ? 'Hip Depth' : 'Tinggi Panggul'}
                    finalResult={`${formatVal(tp)} cm`}
                    isFrontSide={true}
                  />

                  {/* 3. A – D */}
                  <CompactFormulaBlock
                    point="A – D"
                    formulaDesc={language === 'en' ? 'Skirt Length' : 'Panjang Rok'}
                    finalResult={`${formatVal(pr)} cm`}
                    isFrontSide={true}
                  />

                  {/* 4. A – A’ */}
                  <CompactFormulaBlock
                    point="A – A’"
                    formulaDesc={language === 'en' ? '¼ Waist Circumference + 1 cm + 3 cm' : '¼ Lingkar Pinggang + 1 cm + 3 cm'}
                    substitution={`(¼ × ${formatVal(lp)} cm) + 1 cm + 3 cm`}
                    finalResult={`${formatVal(frontAA)} cm`}
                    isFrontSide={true}
                  />

                  {/* 5. C – C’ */}
                  <CompactFormulaBlock
                    point="C – C’"
                    formulaDesc={language === 'en' ? '¼ Hip Circumference + 1 cm' : '¼ Lingkar Panggul + 1 cm'}
                    substitution={`(¼ × ${formatVal(lpg)} cm) + 1 cm`}
                    finalResult={`${formatVal(frontCC)} cm`}
                    isFrontSide={true}
                  />

                  {/* 6. D – D’ */}
                  <CompactFormulaBlock
                    point="D – D’"
                    formulaDesc={language === 'en' ? '¼ Hip Circumference + 1 cm + 3 cm' : '¼ Lingkar Panggul + 1 cm + 3 cm'}
                    substitution={`(¼ × ${formatVal(lpg)} cm) + 1 cm + 3 cm`}
                    finalResult={`${formatVal(frontDD)} cm`}
                    isFrontSide={true}
                  />

                  {/* 7. D’ */}
                  <CompactFormulaBlock
                    point="D’"
                    formulaDesc={language === 'en' ? 'Raise' : 'Naik'}
                    finalResult="1 cm"
                    isFrontSide={true}
                  />

                  {/* 8. B – E */}
                  <CompactFormulaBlock
                    point="B – E"
                    formulaDesc={language === 'en' ? '1/10 Waist Circumference + 1 cm' : '1/10 Lingkar Pinggang + 1 cm'}
                    substitution={`(1/10 × ${formatVal(lp)} cm) + 1 cm`}
                    finalResult={`${formatVal(frontBE)} cm`}
                    isFrontSide={true}
                  />

                  {/* 9. E → kanan */}
                  <CompactFormulaBlock
                    point={language === 'en' ? 'E → right' : 'E → kanan'}
                    formulaDesc={language === 'en' ? 'Dart Width' : 'Lebar Kupnat'}
                    finalResult="3 cm"
                    isFrontSide={true}
                  />

                  {/* 10. E → bawah */}
                  <CompactFormulaBlock
                    point={language === 'en' ? 'E → down' : 'E → bawah'}
                    formulaDesc={language === 'en' ? 'Dart Length' : 'Panjang Kupnat'}
                    finalResult="12 cm"
                    isFrontSide={true}
                  />
                </div>
              </div>

              {/* RIGHT COLUMN: POLA BELAKANG (BACK PATTERN) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2.5 border-b-2 border-[#332C29]">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#332C29] shadow-2xs" />
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#332C29] uppercase tracking-wider">
                      {t.polaBelakang}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#332C29] bg-[#E8DED8] px-2.5 py-0.5 rounded-full border border-[#DFD4CD]">
                    10 {language === 'en' ? 'Formulas' : 'Perhitungan'}
                  </span>
                </div>

                <div className="space-y-2">
                  {/* 1. A – B */}
                  <CompactFormulaBlock
                    point="A – B"
                    formulaDesc={constantLabel}
                    finalResult="1 cm"
                    isFrontSide={false}
                  />

                  {/* 2. A – C */}
                  <CompactFormulaBlock
                    point="A – C"
                    formulaDesc={language === 'en' ? 'Hip Depth' : 'Tinggi Panggul'}
                    finalResult={`${formatVal(tp)} cm`}
                    isFrontSide={false}
                  />

                  {/* 3. A – D */}
                  <CompactFormulaBlock
                    point="A – D"
                    formulaDesc={language === 'en' ? 'Skirt Length' : 'Panjang Rok'}
                    finalResult={`${formatVal(pr)} cm`}
                    isFrontSide={false}
                  />

                  {/* 4. A – A’ */}
                  <CompactFormulaBlock
                    point="A – A’"
                    formulaDesc={language === 'en' ? '¼ Waist Circumference − 1 cm + 3 cm' : '¼ Lingkar Pinggang − 1 cm + 3 cm'}
                    substitution={`(¼ × ${formatVal(lp)} cm) − 1 cm + 3 cm`}
                    finalResult={`${formatVal(backAA)} cm`}
                    isFrontSide={false}
                  />

                  {/* 5. C – C’ */}
                  <CompactFormulaBlock
                    point="C – C’"
                    formulaDesc={language === 'en' ? '¼ Hip Circumference − 1 cm' : '¼ Lingkar Panggul − 1 cm'}
                    substitution={`(¼ × ${formatVal(lpg)} cm) − 1 cm`}
                    finalResult={`${formatVal(backCC)} cm`}
                    isFrontSide={false}
                  />

                  {/* 6. D – D’ */}
                  <CompactFormulaBlock
                    point="D – D’"
                    formulaDesc={language === 'en' ? '¼ Hip Circumference − 1 cm + 3 cm' : '¼ Lingkar Panggul − 1 cm + 3 cm'}
                    substitution={`(¼ × ${formatVal(lpg)} cm) − 1 cm + 3 cm`}
                    finalResult={`${formatVal(backDD)} cm`}
                    isFrontSide={false}
                  />

                  {/* 7. D’ */}
                  <CompactFormulaBlock
                    point="D’"
                    formulaDesc={language === 'en' ? 'Raise' : 'Naik'}
                    finalResult="1 cm"
                    isFrontSide={false}
                  />

                  {/* 8. B – E */}
                  <CompactFormulaBlock
                    point="B – E"
                    formulaDesc={language === 'en' ? '1/10 Waist Circumference − 1 cm' : '1/10 Lingkar Pinggang − 1 cm'}
                    substitution={`(1/10 × ${formatVal(lp)} cm) − 1 cm`}
                    finalResult={`${formatVal(backBE)} cm`}
                    isFrontSide={false}
                  />

                  {/* 9. E → kanan */}
                  <CompactFormulaBlock
                    point={language === 'en' ? 'E → right' : 'E → kanan'}
                    formulaDesc={language === 'en' ? 'Dart Width' : 'Lebar Kupnat'}
                    finalResult="3 cm"
                    isFrontSide={false}
                  />

                  {/* 10. E → bawah */}
                  <CompactFormulaBlock
                    point={language === 'en' ? 'E → down' : 'E → bawah'}
                    formulaDesc={language === 'en' ? 'Dart Length' : 'Panjang Kupnat'}
                    finalResult="12 cm"
                    isFrontSide={false}
                  />
                </div>
              </div>
            </div>

            {/* Informative Footer Note */}
            <div className="mt-6 pt-3.5 border-t border-[#E8DED8] flex items-center justify-between gap-3 flex-wrap text-xs text-[#6B5E57]">
              <p className="italic">
                * {language === 'en'
                  ? 'All calculations use drafting formulas derived directly from your entered measurements.'
                  : 'Semua perhitungan menggunakan rumus konstruksi pola yang diturunkan langsung dari ukuran yang Anda masukkan.'}
              </p>
              <p className="font-mono font-medium text-[#8F2635]">
                {language === 'en' ? 'Proportional Drafting Geometry' : 'Geometri Pola Proporsional'}
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  );
};
