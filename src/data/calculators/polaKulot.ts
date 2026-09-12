import { BodyMeasurement, PatternCalculationItem, SizePreset, PatternModuleInfo } from '../../types/pattern';
import { CalculatorConfig } from './types';

/**
 * POLA KULOT — CULOTTES PATTERN CALCULATOR
 * 
 * Module for drafting culottes pattern (pola kulot) transformed from basic skirt block.
 * Main purpose: Calculate measurements needed for kulot pattern transformation,
 * especially front and back crotch/seat extensions (pesak depan & belakang), golbi, and side balance.
 * 
 * Identifier: 'pola-kulot' (aliases: 'kulot', 'culottes', 'culotte-pants')
 * Title: Pola Kulot / Culottes Pattern
 * Subtitle: Kalkulator Pola Kulot / Culottes Pattern Calculator
 */

export const POLA_KULOT_MODULE: PatternModuleInfo = {
  id: 'pola-kulot',
  studioName: 'LA MODA LEARNING STUDIO',
  appTitle: 'Pattern Calculator',
  moduleTitle: 'Pola Kulot',
  systemSubtitle: 'Kalkulator Pola Kulot',
};

// 1. Required Body Measurements (Taken PAS / snug to body)
export const POLA_KULOT_MEASUREMENTS: BodyMeasurement[] = [
  {
    id: 'lingkarPinggang',
    number: 1,
    name: 'Lingkar Pinggang',
    fieldKey: 'lingkarPinggang',
    value: 67,
    unit: 'cm',
    description: 'Diukur pas melingkar pada pinggang terkecil tanpa tambahan kelonggaran.',
    svgHighlightId: 'line-lingkar-pinggang',
    category: 'circumference',
    group: 'primary',
  },
  {
    id: 'tinggiPanggul',
    number: 2,
    name: 'Tinggi Panggul',
    fieldKey: 'tinggiPanggul',
    value: 18,
    unit: 'cm',
    description: 'Diukur tegak lurus dari garis pinggang ke bawah sampai batas panggul terbesar.',
    svgHighlightId: 'line-tinggi-panggul',
    category: 'height',
    group: 'primary',
  },
  {
    id: 'lingkarPanggul',
    number: 3,
    name: 'Lingkar Panggul',
    fieldKey: 'lingkarPanggul',
    value: 84,
    unit: 'cm',
    description: 'Diukur pas melingkar pada panggul terbesar tanpa tambahan kelonggaran.',
    svgHighlightId: 'line-lingkar-panggul',
    category: 'circumference',
    group: 'primary',
  },
  {
    id: 'panjangKulot',
    number: 4,
    name: 'Panjang Kulot',
    fieldKey: 'panjangKulot',
    value: 55,
    unit: 'cm',
    description: 'Diukur dari batas garis pinggang ke bawah sampai batas panjang kulot yang diinginkan.',
    svgHighlightId: 'line-panjang-kulot',
    category: 'length',
    group: 'primary',
  },
  {
    id: 'tinggiDuduk',
    number: 5,
    name: 'Tinggi Duduk',
    fieldKey: 'tinggiDuduk',
    value: 21,
    unit: 'cm',
    description: 'Diukur dalam posisi duduk tegak di atas kursi datar, dari garis pinggang tegak lurus sampai alas duduk.',
    svgHighlightId: 'line-tinggi-duduk',
    category: 'height',
    group: 'primary',
  },
  {
    id: 'lingkarPesak',
    number: 6,
    name: 'Lingkar Pesak',
    fieldKey: 'lingkarPesak',
    value: 56,
    unit: 'cm',
    description: 'Diukur dari batas pinggang depan, melewati selangkangan, sampai batas pinggang belakang.',
    helperNote: 'Lingkar Pesak digunakan untuk pengecekan ulang ukuran pesak pada pola.',
    svgHighlightId: 'line-lingkar-pesak',
    category: 'circumference',
    group: 'additional',
  },
];

// 2. Standard Size Presets (S, M, L, XL)
export const POLA_KULOT_PRESETS: SizePreset[] = [
  {
    id: 'size-s',
    name: 'Ukuran S (Small)',
    badge: 'S',
    description: 'Proporsi tubuh standar ukuran Small La Moda (Pinggang 64 cm, Panggul 80 cm)',
    values: {
      lingkarPinggang: 64,
      tinggiPanggul: 18,
      lingkarPanggul: 80,
      panjangKulot: 52,
      tinggiDuduk: 20,
      lingkarPesak: 54,
    },
  },
  {
    id: 'size-m',
    name: 'Ukuran M (Medium)',
    badge: 'M',
    description: 'Proporsi tubuh standar ukuran Medium La Moda (Pinggang 67 cm, Panggul 84 cm)',
    values: {
      lingkarPinggang: 67,
      tinggiPanggul: 18,
      lingkarPanggul: 84,
      panjangKulot: 55,
      tinggiDuduk: 21,
      lingkarPesak: 56,
    },
  },
  {
    id: 'size-l',
    name: 'Ukuran L (Large)',
    badge: 'L',
    description: 'Proporsi tubuh standar ukuran Large La Moda (Pinggang 74 cm, Panggul 92 cm)',
    values: {
      lingkarPinggang: 74,
      tinggiPanggul: 19,
      lingkarPanggul: 92,
      panjangKulot: 58,
      tinggiDuduk: 22,
      lingkarPesak: 60,
    },
  },
  {
    id: 'size-xl',
    name: 'Ukuran XL (Extra Large)',
    badge: 'XL',
    description: 'Proporsi tubuh standar ukuran XL La Moda (Pinggang 82 cm, Panggul 100 cm)',
    values: {
      lingkarPinggang: 82,
      tinggiPanggul: 20,
      lingkarPanggul: 100,
      panjangKulot: 60,
      tinggiDuduk: 23,
      lingkarPesak: 64,
    },
  },
];

/**
 * Helper to compute A–C formatted string based on method
 */
export function formatKulotAcDisplay(
  method: 'tinggi-duduk' | 'tinggi-panggul-range',
  measurementsMap: Record<string, number>,
  language: 'id' | 'en' = 'id'
): { display: string; lower: number; upper: number; isRange: boolean } {
  const td = measurementsMap.tinggiDuduk ?? 21;
  const tp = measurementsMap.tinggiPanggul ?? 18;

  if (method === 'tinggi-duduk') {
    const formattedVal = language === 'en' ? `${td} cm` : `${String(td).replace('.', ',')} cm`;
    return {
      display: formattedVal,
      lower: td,
      upper: td,
      isRange: false,
    };
  }

  // Method 2: Tinggi Panggul + 7–8 cm
  // Lower = TP + 7, Upper = TP + 8
  const lower = tp + 7;
  const upper = tp + 8;
  const lowerStr = language === 'en' ? `${lower} cm` : `${String(lower).replace('.', ',')} cm`;
  const upperStr = language === 'en' ? `${upper} cm` : `${String(upper).replace('.', ',')} cm`;
  const rangeText = language === 'en'
    ? `${lowerStr} up to ${upperStr}`
    : `${lowerStr} sampai dengan ${upperStr}`;

  return {
    display: rangeText,
    lower,
    upper,
    isRange: true,
  };
}

/**
 * Dynamic Pattern Calculations for Kulot
 */
export function getKulotCalculations(
  acMethod: 'tinggi-duduk' | 'tinggi-panggul-range' = 'tinggi-duduk'
): PatternCalculationItem[] {
  return [
    // 1. A – B (Panjang Kulot)
    {
      id: 'kulot-ab-front',
      sequence: 1,
      points: 'A – B',
      patternSide: 'front',
      pointIdentifier: 'A-B',
      nameKey: 'panjangKulot',
      type: 'value',
      calculate: (m) => m.panjangKulot ?? 55,
      formulaDisplay: 'Panjang Kulot',
      formulaExplanation: 'Panjang kulot dari garis pinggang ke bawah sampai batas panjang yang diinginkan.',
      referencedMeasurementNumbers: [4],
      referencedMeasurementNames: ['Panjang Kulot'],
      patternPoints: ['A', 'B'],
      lineIdentifier: 'line-a-b',
    },
    // 2. A – C (Metode A–C Terpilih)
    {
      id: 'kulot-ac-front',
      sequence: 2,
      points: 'A – C',
      patternSide: 'front',
      pointIdentifier: 'A-C',
      nameKey: 'metodeAC',
      type: 'value',
      calculate: (m) => {
        if (acMethod === 'tinggi-duduk') {
          return m.tinggiDuduk ?? 21;
        }
        // In range mode, calculate midpoint/lower
        return (m.tinggiPanggul ?? 18) + 7;
      },
      formulaDisplay: acMethod === 'tinggi-duduk' ? 'Tinggi Duduk' : 'Tinggi Panggul + 7–8 cm',
      formulaExplanation: acMethod === 'tinggi-duduk'
        ? 'Kedalaman pesak dihitung langsung dari ukuran Tinggi Duduk.'
        : 'Kedalaman pesak dihitung dari Tinggi Panggul + 7 s/d 8 cm (tentukan sendiri angka di antara rentang sesuai kelonggaran).',
      referencedMeasurementNumbers: acMethod === 'tinggi-duduk' ? [5] : [2],
      referencedMeasurementNames: acMethod === 'tinggi-duduk' ? ['Tinggi Duduk'] : ['Tinggi Panggul'],
      patternPoints: ['A', 'C'],
      lineIdentifier: 'line-a-c',
      notes: acMethod === 'tinggi-panggul-range' ? 'Rentang kelonggaran 7–8 cm' : undefined,
    },
    // 3. C – C' Pola Depan (1/10 Lingkar Panggul − 2 cm)
    {
      id: 'kulot-cc-front',
      sequence: 3,
      points: "C – C'",
      patternSide: 'front',
      pointIdentifier: "C-C'",
      nameKey: 'pesakDepan',
      type: 'value',
      calculate: (m) => ((m.lingkarPanggul ?? 84) / 10) - 2,
      formulaDisplay: '¹/₁₀ Lingkar Panggul − 2 cm',
      formulaExplanation: 'Perpanjangan pesak depan kulot ke arah kiri dari garis tengah muka.',
      referencedMeasurementNumbers: [3],
      referencedMeasurementNames: ['Lingkar Panggul'],
      patternPoints: ['C', "C'"],
      lineIdentifier: 'line-c-c-prime-front',
    },
    // 4. C – C" Pola Depan (C – C" = C – C')
    {
      id: 'kulot-cc-double-front',
      sequence: 4,
      points: 'C – C"',
      patternSide: 'front',
      pointIdentifier: 'C-C"',
      nameKey: 'pesakDepanTinggi',
      type: 'value',
      calculate: (m) => ((m.lingkarPanggul ?? 84) / 10) - 2,
      formulaDisplay: "Sama dengan C – C' (¹/₁₀ Lingkar Panggul − 2 cm)",
      formulaExplanation: 'Garis bantu vertikal ke atas dari titik C untuk melengkungkan pesak depan (Hubungkan A – C" – C\').',
      referencedMeasurementNumbers: [3],
      referencedMeasurementNames: ['Lingkar Panggul'],
      patternPoints: ['C', 'C"'],
      lineIdentifier: 'line-c-c-double-prime-front',
    },
    // 5. Golbi Pola Depan (4 cm)
    {
      id: 'kulot-golbi-front',
      sequence: 5,
      points: 'Golbi',
      patternSide: 'front',
      pointIdentifier: 'Golbi',
      nameKey: 'lebarGolbi',
      type: 'value',
      fixedValue: 4,
      calculate: () => 4,
      formulaDisplay: '4 cm (ke kiri dari titik A)',
      formulaExplanation: 'Kelebaran golbi untuk tempat pemasangan resleting celana/kulot.',
      referencedMeasurementNumbers: [],
      referencedMeasurementNames: [],
      patternPoints: ['A', 'Golbi'],
      lineIdentifier: 'line-golbi',
    },
    // 6. Panjang Golbi Pola Depan (18 cm)
    {
      id: 'kulot-panjang-golbi-front',
      sequence: 6,
      points: 'Panjang Golbi',
      patternSide: 'front',
      pointIdentifier: 'PanjangGolbi',
      nameKey: 'panjangGolbi',
      type: 'value',
      fixedValue: 18,
      calculate: () => 18,
      formulaDisplay: '18 cm (untuk resleting 17 cm)',
      formulaExplanation: 'Panjang lidah golbi dari pinggang ke bawah yang disiapkan untuk resleting 17 cm.',
      referencedMeasurementNumbers: [],
      referencedMeasurementNames: [],
      patternPoints: ['Golbi-Atas', 'Golbi-Bawah'],
      lineIdentifier: 'line-panjang-golbi',
    },
    // 7. B' naik Pola Depan (1.5 cm)
    {
      id: 'kulot-b-naik-front',
      sequence: 7,
      points: "B' naik",
      patternSide: 'front',
      pointIdentifier: "B'-naik",
      nameKey: 'bPrimeNaikFront',
      type: 'value',
      fixedValue: 1.5,
      calculate: () => 1.5,
      formulaDisplay: '1,5 cm (menyeimbangkan sudut sisi pola)',
      formulaExplanation: 'Titik sisi bawah dinaikkan 1,5 cm agar jatuhnya keliman samping tidak meruncing ke bawah.',
      referencedMeasurementNumbers: [],
      referencedMeasurementNames: [],
      patternPoints: ['B', "B'"],
      lineIdentifier: 'line-b-prime-front',
    },

    // ==========================================
    // POLA BELAKANG (BACK PATTERN)
    // ==========================================
    // 8. A – B Pola Belakang (Panjang Kulot)
    {
      id: 'kulot-ab-back',
      sequence: 8,
      points: 'A – B',
      patternSide: 'back',
      pointIdentifier: 'A-B-back',
      nameKey: 'panjangKulotBack',
      type: 'value',
      calculate: (m) => m.panjangKulot ?? 55,
      formulaDisplay: 'Panjang Kulot',
      formulaExplanation: 'Panjang kulot belakang dari garis pinggang ke bawah.',
      referencedMeasurementNumbers: [4],
      referencedMeasurementNames: ['Panjang Kulot'],
      patternPoints: ['A', 'B'],
      lineIdentifier: 'line-a-b-back',
    },
    // 9. A – C Pola Belakang
    {
      id: 'kulot-ac-back',
      sequence: 9,
      points: 'A – C',
      patternSide: 'back',
      pointIdentifier: 'A-C-back',
      nameKey: 'metodeACBack',
      type: 'value',
      calculate: (m) => {
        if (acMethod === 'tinggi-duduk') {
          return m.tinggiDuduk ?? 21;
        }
        return (m.tinggiPanggul ?? 18) + 7;
      },
      formulaDisplay: acMethod === 'tinggi-duduk' ? 'Tinggi Duduk' : 'Tinggi Panggul + 7–8 cm',
      formulaExplanation: acMethod === 'tinggi-duduk'
        ? 'Kedalaman pesak belakang sama dengan ukuran Tinggi Duduk.'
        : 'Kedalaman pesak belakang dihitung dari Tinggi Panggul + 7 s/d 8 cm.',
      referencedMeasurementNumbers: acMethod === 'tinggi-duduk' ? [5] : [2],
      referencedMeasurementNames: acMethod === 'tinggi-duduk' ? ['Tinggi Duduk'] : ['Tinggi Panggul'],
      patternPoints: ['A', 'C'],
      lineIdentifier: 'line-a-c-back',
      notes: acMethod === 'tinggi-panggul-range' ? 'Rentang kelonggaran 7–8 cm' : undefined,
    },
    // 10. C – C' Pola Belakang (1/10 Lingkar Panggul + 2 cm)
    {
      id: 'kulot-cc-back',
      sequence: 10,
      points: "C – C'",
      patternSide: 'back',
      pointIdentifier: "C-C'-back",
      nameKey: 'pesakBelakang',
      type: 'value',
      calculate: (m) => ((m.lingkarPanggul ?? 84) / 10) + 2,
      formulaDisplay: '¹/₁₀ Lingkar Panggul + 2 cm',
      formulaExplanation: 'Perpanjangan pesak belakang kulot (lebih panjang 4 cm dari pesak depan untuk ruang anatomis panggul belakang).',
      referencedMeasurementNumbers: [3],
      referencedMeasurementNames: ['Lingkar Panggul'],
      patternPoints: ['C', "C'"],
      lineIdentifier: 'line-c-c-prime-back',
    },
    // 11. C – C" Pola Belakang (C – C" = C – C')
    {
      id: 'kulot-cc-double-back',
      sequence: 11,
      points: 'C – C"',
      patternSide: 'back',
      pointIdentifier: 'C-C"-back',
      nameKey: 'pesakBelakangTinggi',
      type: 'value',
      calculate: (m) => ((m.lingkarPanggul ?? 84) / 10) + 2,
      formulaDisplay: "Sama dengan C – C' (¹/₁₀ Lingkar Panggul + 2 cm)",
      formulaExplanation: 'Garis bantu vertikal ke atas dari titik C untuk melengkungkan pesak belakang (Hubungkan A – C" – C\').',
      referencedMeasurementNumbers: [3],
      referencedMeasurementNames: ['Lingkar Panggul'],
      patternPoints: ['C', 'C"'],
      lineIdentifier: 'line-c-c-double-prime-back',
    },
    // 12. B' naik Pola Belakang (1.5 cm)
    {
      id: 'kulot-b-naik-back',
      sequence: 12,
      points: "B' naik",
      patternSide: 'back',
      pointIdentifier: "B'-naik-back",
      nameKey: 'bPrimeNaikBack',
      type: 'value',
      fixedValue: 1.5,
      calculate: () => 1.5,
      formulaDisplay: '1,5 cm (menyeimbangkan sudut sisi pola)',
      formulaExplanation: 'Titik sisi bawah dinaikkan 1,5 cm untuk menyeimbangkan sudut keliman sisi pola belakang.',
      referencedMeasurementNumbers: [],
      referencedMeasurementNames: [],
      patternPoints: ['B', "B'"],
      lineIdentifier: 'line-b-prime-back',
    },
  ];
}

export const POLA_KULOT_CALCULATIONS = getKulotCalculations('tinggi-duduk');

export const POLA_KULOT_FRONT_CALCULATIONS = POLA_KULOT_CALCULATIONS.filter((c) => c.patternSide === 'front');
export const POLA_KULOT_BACK_CALCULATIONS = POLA_KULOT_CALCULATIONS.filter((c) => c.patternSide === 'back');

export const POLA_KULOT_CONFIG: CalculatorConfig = {
  id: 'pola-kulot',
  name: 'Pola Kulot',
  systemSubtitle: 'Kalkulator Pola Kulot',
  garmentCategory: 'celana',
  systemId: 'kulot',
  moduleInfo: POLA_KULOT_MODULE,
  measurements: POLA_KULOT_MEASUREMENTS,
  presets: POLA_KULOT_PRESETS,
  calculations: POLA_KULOT_CALCULATIONS,
  frontCalculations: POLA_KULOT_FRONT_CALCULATIONS,
  backCalculations: POLA_KULOT_BACK_CALCULATIONS,
  importantNotes: [
    'Semua ukuran badan diambil PAS (snug) pada tubuh, kelonggaran ditambahkan pada langkah pecah pola.',
    'Pesak belakang dibuat lebih panjang daripada pesak depan untuk memberikan ruang yang sesuai dengan bentuk tubuh bagian belakang.',
    'Lingkar Pesak digunakan untuk pengecekan ulang ukuran pesak pada pola (tidak masuk ke dalam rumus C–C\').',
    'Panjang golbi 18 cm disiapkan untuk resleting 17 cm.',
    'B\' naik 1,5 cm untuk menyeimbangkan keliman sudut sisi pola.',
  ],
  defaultImages: {
    measurementGuideImage: '',
    patternImage: '',
  },
  defaultPatternDescription: 'Transformasi Pola Kulot dari Pola Dasar Rok',
  defaultFrontPatternDescription: 'Pola Depan Kulot: A–B = Panjang Kulot, A–C = Metode A–C, C–C\' = ¹/₁₀ Lingkar Panggul − 2 cm, C–C" = C–C\', Golbi = 4 cm, Panjang Golbi = 18 cm, B\' naik = 1,5 cm.',
  defaultBackPatternDescription: 'Pola Belakang Kulot: A–B = Panjang Kulot, A–C = Metode A–C, C–C\' = ¹/₁₀ Lingkar Panggul + 2 cm, C–C" = C–C\', B\' naik = 1,5 cm.',
};
