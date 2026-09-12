import { BodyMeasurement, PatternCalculationItem, SizePreset, PatternModuleInfo } from '../../types/pattern';
import { CalculatorConfig } from './types';

/**
 * ROK LINGKARAN & SETENGAH LINGKARAN
 * 
 * Identifier: 'rok-lingkaran'
 * Contains two pattern systems in ONE calculator:
 * 1. Rok Lingkaran Penuh (Full Circle Skirt)
 * 2. Rok Setengah Lingkaran (Half Circle Skirt)
 */

export const ROK_LINGKARAN_MODULE: PatternModuleInfo = {
  id: 'rok-lingkaran',
  studioName: 'LA MODA LEARNING STUDIO',
  appTitle: 'Pattern Calculator',
  moduleTitle: 'Rok Lingkaran & Setengah Lingkaran',
  systemSubtitle: 'Lingkaran Penuh & Setengah Lingkaran',
};

// 1. Two measurements only: Lingkar Pinggang & Panjang Rok
export const ROK_LINGKARAN_MEASUREMENTS: BodyMeasurement[] = [
  {
    id: 'lingkarPinggang',
    number: 1,
    name: 'Lingkar Pinggang',
    fieldKey: 'lingkarPinggang',
    value: 67,
    unit: 'cm',
    description: 'Diukur melingkar pas pada batas pinggang tersempit.',
    svgHighlightId: 'line-lingkar-pinggang',
    category: 'circumference',
  },
  {
    id: 'panjangRok',
    number: 2,
    name: 'Panjang Rok',
    fieldKey: 'panjangRok',
    value: 50,
    unit: 'cm',
    description: 'Diukur tegak lurus dari garis pinggang ke bawah sesuai panjang rok yang diinginkan.',
    svgHighlightId: 'line-panjang-rok',
    category: 'length',
  },
];

// 2. Standard Size Presets
export const ROK_LINGKARAN_SIZE_PRESETS: SizePreset[] = [
  {
    id: 'size-s',
    name: 'Ukuran S (Kecil)',
    badge: 'S',
    description: 'Ukuran standar S untuk proporsi lingkar pinggang 64 cm',
    values: {
      lingkarPinggang: 64,
      panjangRok: 48,
    },
  },
  {
    id: 'size-m',
    name: 'Ukuran M (Sedang)',
    badge: 'M',
    description: 'Ukuran standar M La Moda untuk proporsi lingkar pinggang 67 cm',
    values: {
      lingkarPinggang: 67,
      panjangRok: 50,
    },
  },
  {
    id: 'size-l',
    name: 'Ukuran L (Besar)',
    badge: 'L',
    description: 'Ukuran standar L untuk proporsi lingkar pinggang 74 cm',
    values: {
      lingkarPinggang: 74,
      panjangRok: 52,
    },
  },
  {
    id: 'size-xl',
    name: 'Ukuran XL (Ekstra Besar)',
    badge: 'XL',
    description: 'Ukuran standar XL untuk proporsi lingkar pinggang 82 cm',
    values: {
      lingkarPinggang: 82,
      panjangRok: 55,
    },
  },
];

// 3. Formula for Rok Lingkaran Penuh (Full Circle Skirt)
// R = (1/6 Lingkar Pinggang) − 0.5 cm
// R = A – B = A – C = A – F
// B – D = F – G = C – E = Panjang Rok
export const FULL_CIRCLE_CALCULATIONS: PatternCalculationItem[] = [
  {
    id: 'full-radius-r',
    sequence: 1,
    points: 'Radius (R)',
    patternSide: 'front',
    pointIdentifier: 'radius-r',
    nameKey: 'radiusR',
    type: 'value',
    calculate: (m: Record<string, number>) => {
      const lp = m.lingkarPinggang ?? 67;
      return (lp / 6) - 0.5;
    },
    formulaDisplay: 'R = (1/6 Lingkar Pinggang) − 0.5 cm',
    formulaExplanation: 'R = A – B = A – C = A – F',
    referencedMeasurementNumbers: [1],
    referencedMeasurementNames: ['Lingkar Pinggang'],
    patternPoints: ['A', 'B', 'C', 'F'],
    notes: 'R = A – B = A – C = A – F',
  },
  {
    id: 'full-panjang-rok',
    sequence: 2,
    points: 'Panjang Rok',
    patternSide: 'front',
    pointIdentifier: 'panjang-rok',
    nameKey: 'panjangRok',
    type: 'value',
    calculate: (m: Record<string, number>) => m.panjangRok ?? 50,
    formulaDisplay: 'Panjang Rok',
    formulaExplanation: 'B – D = F – G = C – E = Panjang Rok',
    referencedMeasurementNumbers: [2],
    referencedMeasurementNames: ['Panjang Rok'],
    patternPoints: ['B', 'D', 'F', 'G', 'C', 'E'],
    notes: 'B – D = F – G = C – E = Panjang Rok',
  },
];

// 4. Formula for Rok Setengah Lingkaran (Half Circle Skirt)
// R = 1/3 Lingkar Pinggang − 1 cm
// R = A – B = A – D = A – C
// B – B’ = C – C’ = D – D’ = Panjang Rok
export const HALF_CIRCLE_CALCULATIONS: PatternCalculationItem[] = [
  {
    id: 'half-radius-r',
    sequence: 1,
    points: 'Radius (R)',
    patternSide: 'front',
    pointIdentifier: 'radius-r',
    nameKey: 'radiusR',
    type: 'value',
    calculate: (m: Record<string, number>) => {
      const lp = m.lingkarPinggang ?? 67;
      return (lp / 3) - 1;
    },
    formulaDisplay: 'R = 1/3 Lingkar Pinggang − 1 cm',
    formulaExplanation: 'R = A – B = A – D = A – C',
    referencedMeasurementNumbers: [1],
    referencedMeasurementNames: ['Lingkar Pinggang'],
    patternPoints: ['A', 'B', 'D', 'C'],
    notes: 'R = A – B = A – D = A – C',
  },
  {
    id: 'half-panjang-rok',
    sequence: 2,
    points: 'Panjang Rok',
    patternSide: 'front',
    pointIdentifier: 'panjang-rok',
    nameKey: 'panjangRok',
    type: 'value',
    calculate: (m: Record<string, number>) => m.panjangRok ?? 50,
    formulaDisplay: 'Panjang Rok',
    formulaExplanation: "B – B' = C – C' = D – D' = Panjang Rok",
    referencedMeasurementNumbers: [2],
    referencedMeasurementNames: ['Panjang Rok'],
    patternPoints: ['B', "B'", 'C', "C'", 'D', "D'"],
    notes: "B – B' = C – C' = D – D' = Panjang Rok",
  },
];

export const ROK_LINGKARAN_IMPORTANT_NOTES: string[] = [
  'Gunakan kain dengan jatuhan (drape) yang baik untuk efek gelombang rok lingkaran yang optimal.',
  'Biarkan rok digantung selama minimal 24 jam sebelum meratakan kelim bawah (hemline) karena potongan serong (bias) akan memanjang alami.',
  'Pastikan radius (R) diukur secara konsisten dari titik pusat (A) dengan meteran atau jangka ukur.',
];

/**
 * Unified Calculator Configuration for Rok Lingkaran & Setengah Lingkaran
 */
export const ROK_LINGKARAN_CONFIG: CalculatorConfig = {
  id: 'rok-lingkaran',
  name: 'Rok Lingkaran & Setengah Lingkaran',
  systemSubtitle: 'Lingkaran & 1/2 Lingkaran',
  garmentCategory: 'rok',
  systemId: 'lingkaran',
  moduleInfo: ROK_LINGKARAN_MODULE,
  measurements: ROK_LINGKARAN_MEASUREMENTS,
  presets: ROK_LINGKARAN_SIZE_PRESETS,
  calculations: FULL_CIRCLE_CALCULATIONS,
  frontCalculations: FULL_CIRCLE_CALCULATIONS,
  backCalculations: HALF_CIRCLE_CALCULATIONS,
  importantNotes: [],
  defaultImages: {
    measurementGuideImage: '',
    patternImage: '',
  },
  defaultPatternDescription: '',
  defaultFrontPatternDescription: '',
  defaultBackPatternDescription: '',
};
