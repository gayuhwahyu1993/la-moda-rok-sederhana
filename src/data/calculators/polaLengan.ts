import { BodyMeasurement, PatternCalculationItem, SizePreset, PatternModuleInfo } from '../../types/pattern';
import { CalculatorConfig } from './types';

/**
 * POLA DASAR LENGAN — BASIC SLEEVE PATTERN CALCULATOR
 * 
 * Standalone module for drafting a standard sleeve pattern.
 * Identifier: 'pola-lengan' (alias: 'lengan')
 * Title: Pola Dasar Lengan
 * Subtitle: Kalkulator Pola Dasar Lengan
 */

export const POLA_LENGAN_MODULE: PatternModuleInfo = {
  id: 'pola-lengan',
  studioName: 'LA MODA LEARNING STUDIO',
  appTitle: 'Pattern Calculator',
  moduleTitle: 'Pola Dasar Lengan',
  systemSubtitle: 'Kalkulator Pola Dasar Lengan',
};

// 1. 4 Body Measurements Configuration Array
export const POLA_LENGAN_MEASUREMENTS: BodyMeasurement[] = [
  {
    id: 'tinggiPuncakLengan',
    number: 1,
    name: 'Tinggi Puncak Lengan',
    fieldKey: 'tinggiPuncakLengan',
    value: 13,
    unit: 'cm',
    description: 'Diukur tegak lurus dari ujung tulang bahu luar ke bawah sampai batas garis lingkar kerung ketiak badan.',
    svgHighlightId: 'line-tinggi-puncak-lengan',
    category: 'height',
    group: 'primary',
  },
  {
    id: 'lingkarKerungLengan',
    number: 2,
    name: 'Lingkar Kerung Lengan',
    fieldKey: 'lingkarKerungLengan',
    value: 42,
    unit: 'cm',
    description: 'Diukur keliling kerung ketiak badan dari titik bahu melalui bawah ketiak kembali ke titik bahu.',
    svgHighlightId: 'line-lingkar-kerung-lengan',
    category: 'circumference',
    group: 'primary',
  },
  {
    id: 'panjangLengan',
    number: 3,
    name: 'Panjang Lengan',
    fieldKey: 'panjangLengan',
    value: 54,
    unit: 'cm',
    description: 'Diukur dari puncak lengan (ujung tulang bahu luar) ke bawah sepanjang lengan sampai batas pergelangan.',
    svgHighlightId: 'line-panjang-lengan',
    category: 'length',
    group: 'primary',
  },
  {
    id: 'lingkarLubangPipaLengan',
    number: 4,
    name: 'Lingkar Lubang Pipa Lengan',
    fieldKey: 'lingkarLubangPipaLengan',
    value: 24,
    unit: 'cm',
    description: 'Diukur melingkar pada pergelangan tangan atau batas bukaan bawah pipa lengan yang dikehendaki.',
    svgHighlightId: 'line-lingkar-lubang-pipa-lengan',
    category: 'circumference',
    group: 'primary',
  },
];

// 2. Standard Size Presets (S, M, L, XL)
export const POLA_LENGAN_PRESETS: SizePreset[] = [
  {
    id: 'size-s',
    name: 'Ukuran S (Small)',
    badge: 'S',
    description: 'Proporsi tubuh standar ukuran Small La Moda',
    values: {
      tinggiPuncakLengan: 12,
      lingkarKerungLengan: 40,
      panjangLengan: 24,
      lingkarLubangPipaLengan: 30,
    },
  },
  {
    id: 'size-m',
    name: 'Ukuran M (Medium)',
    badge: 'M',
    description: 'Proporsi tubuh standar ukuran Medium La Moda',
    values: {
      tinggiPuncakLengan: 13,
      lingkarKerungLengan: 42,
      panjangLengan: 54,
      lingkarLubangPipaLengan: 24,
    },
  },
  {
    id: 'size-l',
    name: 'Ukuran L (Large)',
    badge: 'L',
    description: 'Proporsi tubuh standar ukuran Large La Moda',
    values: {
      tinggiPuncakLengan: 14,
      lingkarKerungLengan: 44,
      panjangLengan: 56,
      lingkarLubangPipaLengan: 26,
    },
  },
  {
    id: 'size-xl',
    name: 'Ukuran XL (Extra Large)',
    badge: 'XL',
    description: 'Proporsi tubuh standar ukuran Extra Large La Moda',
    values: {
      tinggiPuncakLengan: 15,
      lingkarKerungLengan: 46,
      panjangLengan: 58,
      lingkarLubangPipaLengan: 28,
    },
  },
];

// 3. Pattern Calculations - Rumus Pola Lengan (Unified Construction)
export const POLA_LENGAN_CALCULATIONS: PatternCalculationItem[] = [
  {
    id: 'calc-lengan-ab',
    sequence: 1,
    points: 'A – B',
    pointIdentifier: 'A-B',
    patternSide: 'front',
    nameKey: 'lengan_ab',
    type: 'value',
    calculate: (m) => m.tinggiPuncakLengan || 0,
    formulaDisplay: 'Tinggi Puncak Lengan',
    formulaExplanation: 'Tinggi Puncak Lengan',
    referencedMeasurementNumbers: [1],
    referencedMeasurementNames: ['Tinggi Puncak Lengan'],
    patternPoints: ['A', 'B'],
    lineIdentifier: 'line-A-B',
    notes: 'Tinggi Puncak Lengan',
  },
  {
    id: 'calc-lengan-ac-ad',
    sequence: 2,
    points: 'A – C = A – D',
    pointIdentifier: 'A-C-A-D',
    patternSide: 'front',
    nameKey: 'lengan_ac_ad',
    type: 'value',
    calculate: (m) => ((m.lingkarKerungLengan || 0) / 2) - 0.5,
    formulaDisplay: '½ Lingkar Kerung Lengan − 0,5 cm',
    formulaExplanation: '(½ × Lingkar Kerung Lengan) − 0,5 cm',
    referencedMeasurementNumbers: [2],
    referencedMeasurementNames: ['Lingkar Kerung Lengan'],
    patternPoints: ['A', 'C', 'D'],
    lineIdentifier: 'line-A-C-A-D',
    notes: '½ Lingkar Kerung Lengan − 0,5 cm',
  },
  {
    id: 'calc-lengan-sepertiga-ac-ad',
    sequence: 3,
    points: '1/3 A – C = 1/3 A – D',
    pointIdentifier: '1/3-A-C-A-D',
    patternSide: 'front',
    nameKey: 'lengan_sepertiga_ac_ad',
    type: 'value',
    calculate: (m) => (((m.lingkarKerungLengan || 0) / 2) - 0.5) / 3,
    formulaDisplay: '1/3 × (A – C)',
    formulaExplanation: '1/3 × (A – C) = 1/3 × (A – D)',
    referencedMeasurementNumbers: [2],
    referencedMeasurementNames: ['Lingkar Kerung Lengan'],
    patternPoints: ['A', 'C', 'D'],
    lineIdentifier: 'line-1/3-A-C-A-D',
    notes: '1/3 × (A – C) = 1/3 × (A – D)',
  },
  {
    id: 'calc-lengan-ae',
    sequence: 4,
    points: 'A – E',
    pointIdentifier: 'A-E',
    patternSide: 'front',
    nameKey: 'lengan_ae',
    type: 'value',
    calculate: (m) => m.panjangLengan || 0,
    formulaDisplay: 'Panjang Lengan',
    formulaExplanation: 'Panjang Lengan',
    referencedMeasurementNumbers: [3],
    referencedMeasurementNames: ['Panjang Lengan'],
    patternPoints: ['A', 'E'],
    lineIdentifier: 'line-A-E',
    notes: 'Panjang Lengan',
  },
  {
    id: 'calc-lengan-ef-eg',
    sequence: 5,
    points: 'E – F = E – G',
    pointIdentifier: 'E-F-E-G',
    patternSide: 'front',
    nameKey: 'lengan_ef_eg',
    type: 'value',
    calculate: (m) => (m.lingkarLubangPipaLengan || 0) / 2,
    formulaDisplay: '½ Lingkar Pipa Lengan',
    formulaExplanation: '½ × Lingkar Pipa Lengan',
    referencedMeasurementNumbers: [4],
    referencedMeasurementNames: ['Lingkar Lubang Pipa Lengan'],
    patternPoints: ['E', 'F', 'G'],
    lineIdentifier: 'line-E-F-E-G',
    notes: '½ Lingkar Pipa Lengan',
  },
];

export const POLA_LENGAN_FRONT_CALCULATIONS: PatternCalculationItem[] = POLA_LENGAN_CALCULATIONS;
export const POLA_LENGAN_BACK_CALCULATIONS: PatternCalculationItem[] = [];

export const POLA_LENGAN_IMPORTANT_NOTES: string[] = [
  '1. A – B = Tinggi Puncak Lengan (Sleeve Cap Height).',
  '2. A – C = A – D = ½ Lingkar Kerung Lengan − 0,5 cm = (Armhole Circumference ÷ 2) − 0.5 cm.',
  '3. 1/3 A – C = (A – C) ÷ 3 dan 1/3 A – D = (A – D) ÷ 3.',
  '4. A – E = Panjang Lengan (Sleeve Length).',
  '5. E – F = E – G = ½ Lingkar Bukaan Lengan = Sleeve Opening Circumference ÷ 2.',
];

export const POLA_LENGAN_DEFAULT_DESCRIPTION = `[POLA DASAR LENGAN]
1. A – B = Tinggi Puncak Lengan (Sleeve Cap Height)
2. A – C = A – D = ½ Lingkar Kerung Lengan − 0,5 cm:
   - A – C = (Lingkar Kerung Lengan ÷ 2) − 0,5 cm
   - A – D = Sama dengan A – C
3. Pembagian Garis Kerung Lengan:
   - 1/3 A – C = (A – C) ÷ 3
   - 1/3 A – D = (A – D) ÷ 3
4. A – E = Panjang Lengan (Sleeve Length)
5. Garis Bukaan Bawah Lengan:
   - E – F = Lingkar Bukaan Lengan ÷ 2
   - E – G = Sama dengan E – F`;

export const POLA_LENGAN_CONFIG: CalculatorConfig = {
  id: 'pola-lengan',
  name: 'Pola Dasar Lengan',
  systemSubtitle: 'Kalkulator Pola Dasar Lengan',
  garmentCategory: 'lengan',
  systemId: 'standar',
  moduleInfo: POLA_LENGAN_MODULE,
  measurements: POLA_LENGAN_MEASUREMENTS,
  presets: POLA_LENGAN_PRESETS,
  calculations: POLA_LENGAN_CALCULATIONS,
  frontCalculations: POLA_LENGAN_FRONT_CALCULATIONS,
  backCalculations: POLA_LENGAN_BACK_CALCULATIONS,
  importantNotes: POLA_LENGAN_IMPORTANT_NOTES,
  defaultImages: {
    measurementGuideImage: '',
    patternImage: '',
  },
  defaultPatternDescription: POLA_LENGAN_DEFAULT_DESCRIPTION,
};
