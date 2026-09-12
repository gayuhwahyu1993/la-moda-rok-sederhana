import React from 'react';
import { formatDraftingPrecision } from '../data/patternData';

export interface CircleSkirtFormulaDisplayProps {
  model: 'full' | 'half';
  language: 'id' | 'en';
  waistCircumference: number;
  skirtLength: number;
  isPrint?: boolean;
  onSelectCalculation?: (id: string | null) => void;
  activeCalculationId?: string | null;
}

interface CalculationRow {
  label: React.ReactNode;
  value: string;
  isResult?: boolean;
}

interface FormulaBlockData {
  id: string;
  rows: CalculationRow[];
}

export const CircleSkirtFormulaDisplay: React.FC<CircleSkirtFormulaDisplayProps> = ({
  model,
  language,
  waistCircumference,
  skirtLength,
  isPrint = false,
  onSelectCalculation,
  activeCalculationId,
}) => {
  const lp = waistCircumference ?? 67;
  const pr = skirtLength ?? 50;

  const formatVal = (val: number | undefined) => {
    if (val === undefined || isNaN(val)) return '0';
    const formatted = formatDraftingPrecision(val);
    return language === 'en' ? formatted : formatted.replace('.', ',');
  };

  const isFull = model === 'full';

  // 1. Calculate Radius according to standard drafting rules:
  // Full Circle: R = (1/6 Lingkar Pinggang) − 0.5 cm
  // Half Circle: R = (1/3 Lingkar Pinggang) − 1 cm
  const rawRadius = isFull ? (lp / 6) - 0.5 : (lp / 3) - 1;
  const radiusFormatted = `${formatVal(rawRadius)} cm`;
  const lengthFormatted = `${formatVal(pr)} cm`;

  // Formula substitution text
  const radiusSubstitution = isFull
    ? `(⅙ × ${formatVal(lp)} cm) − ${language === 'en' ? '0.5 cm' : '0,5 cm'}`
    : `(⅓ × ${formatVal(lp)} cm) − 1 cm`;

  const skirtLengthLabel = language === 'en' ? 'Skirt Length' : 'Panjang Rok';

  // Point equivalence labels (strictly on one line)
  // Full Circle: A–B = A–C = A–F = R (waist curve radius) and B–D = F–G = C–E (hemline curve)
  // Half Circle: A–B = A–D = A–C = R (waist curve radius) and B–B' = C–C' = D–D' (hemline curve)
  const waistPointsLabel = isFull ? 'A–B = A–C = A–F = R' : 'A–B = A–D = A–C = R';
  const hemPointsLabel = isFull ? 'B–D = F–G = C–E' : "B–B' = C–C' = D–D'";

  const blocks: FormulaBlockData[] = [
    {
      id: isFull ? 'full-radius-r' : 'half-radius-r',
      rows: [
        {
          label: 'RADIUS (R)',
          value: radiusSubstitution,
          isResult: false,
        },
        {
          label: '',
          value: radiusFormatted,
          isResult: true,
        },
      ],
    },
    {
      id: isFull ? 'full-radius-points' : 'half-radius-points',
      rows: [
        {
          label: waistPointsLabel,
          value: 'R',
          isResult: false,
        },
        {
          label: '',
          value: radiusFormatted,
          isResult: true,
        },
      ],
    },
    {
      id: isFull ? 'full-panjang-rok' : 'half-panjang-rok',
      rows: [
        {
          label: hemPointsLabel,
          value: skirtLengthLabel,
          isResult: false,
        },
        {
          label: '',
          value: lengthFormatted,
          isResult: true,
        },
      ],
    },
  ];

  const accentText = isFull ? 'text-[#8F2635]' : 'text-[#1D4ED8]';
  const activeClass = isFull
    ? 'bg-[#FDF2F2] border-[#8F2635] shadow-xs ring-1 ring-[#8F2635]/30'
    : 'bg-[#EFF6FF] border-[#2563EB] shadow-xs ring-1 ring-[#2563EB]/30';
  const hoverClass = isFull
    ? 'hover:bg-[#FDF4F4] hover:border-[#D5C7BF]'
    : 'hover:bg-[#F0F5FF] hover:border-[#93C5FD]';

  // --- PRINT WORKSHEET LAYOUT ---
  if (isPrint) {
    return (
      <div className="space-y-1.5 print-break-inside-avoid">
        {blocks.map((block) => (
          <div
            key={block.id}
            className={`border rounded p-1.5 bg-white ${
              isFull ? 'border-[#8F2635]/30' : 'border-[#1D4ED8]/30'
            }`}
          >
            {/* Standardized 3-Column Grid: [formula/label] [=] [result] */}
            <div className="grid grid-cols-[165px_16px_1fr] items-baseline gap-y-0.5 text-[10px]">
              {block.rows.map((row, rIdx) => (
                <React.Fragment key={rIdx}>
                  <div className="text-neutral-800 font-mono font-bold whitespace-nowrap">
                    {row.label || '\u00A0'}
                  </div>
                  <div className="font-mono text-neutral-400 text-center font-normal select-none">
                    =
                  </div>
                  <div className="font-mono text-neutral-900 whitespace-nowrap pl-0.5">
                    {row.isResult ? (
                      <strong className={`font-bold ${accentText}`}>{row.value}</strong>
                    ) : (
                      <span>{row.value}</span>
                    )}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // --- ON-SCREEN INTERACTIVE / DISPLAY LAYOUT ---
  return (
    <div className="space-y-2.5">
      {blocks.map((block) => {
        const isClickable = Boolean(onSelectCalculation);
        const isActive = activeCalculationId === block.id;

        return (
          <div
            key={block.id}
            onClick={() => {
              if (onSelectCalculation) {
                onSelectCalculation(isActive ? null : block.id);
              }
            }}
            className={`bg-white rounded-xl border p-3 sm:p-3.5 shadow-2xs transition-all duration-150 ${
              isActive
                ? activeClass
                : `border-[#E8DED8] ${isClickable ? `${hoverClass} cursor-pointer` : ''}`
            }`}
          >
            {/* STANDARDIZED 3-COLUMN CALCULATION GRID:
                [formula/label column] [= column] [value column]
                The "=" column is fixed/centered, aligning vertically across all rows and cards! */}
            <div className="grid grid-cols-[170px_18px_1fr] sm:grid-cols-[210px_22px_1fr] items-baseline gap-y-1.5 text-xs sm:text-sm">
              {block.rows.map((row, rIdx) => (
                <React.Fragment key={rIdx}>
                  {/* Column 1: Formula / Label */}
                  <div className="font-mono font-bold text-[#332C29] leading-snug whitespace-nowrap overflow-hidden text-ellipsis sm:overflow-visible">
                    {row.label || '\u00A0'}
                  </div>

                  {/* Column 2: = Operator (Fixed Width & Centered) */}
                  <div className="font-mono text-neutral-400 text-center font-normal select-none leading-snug">
                    =
                  </div>

                  {/* Column 3: Value / Substituted Math */}
                  <div className="font-mono text-[#332C29] leading-snug whitespace-nowrap overflow-x-auto">
                    {row.isResult ? (
                      <strong className={`font-bold sm:text-[15px] ${accentText}`}>
                        {row.value}
                      </strong>
                    ) : (
                      <span className="text-[#4A423B] font-medium">{row.value}</span>
                    )}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
