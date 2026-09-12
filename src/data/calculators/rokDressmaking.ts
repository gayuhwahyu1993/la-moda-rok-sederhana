import { BodyMeasurement, PatternCalculationItem, SizePreset, PatternModuleInfo } from '../../types/pattern';
import { CalculatorConfig } from './types';

/**
 * POLA 2 — POLA DASAR ROK SISTEM DRESSMAKING
 * 
 * Identifier: 'rok-dressmaking'
 * Front and Back drafting formulas implemented strictly according to Dressmaking specifications.
 */

export const ROK_DRESSMAKING_MODULE: PatternModuleInfo = {
  id: 'basic-skirt-dressmaking',
  studioName: 'LA MODA LEARNING STUDIO',
  appTitle: 'Pattern Calculator',
  moduleTitle: 'Kalkulator Pola Dasar Rok',
  systemSubtitle: 'Sistem Dressmaking',
};

// 1. Dedicated measurement configuration array for Dressmaking system
export const ROK_DRESSMAKING_MEASUREMENTS: BodyMeasurement[] = [
  {
    id: 'lingkarPinggang',
    number: 1,
    name: 'Lingkar Pinggang',
    fieldKey: 'lingkarPinggang',
    value: 72,
    unit: 'cm',
    description: 'Diukur melingkar pas pada batas pinggang tersempit.',
    svgHighlightId: 'line-lingkar-pinggang',
    category: 'circumference',
  },
  {
    id: 'tinggiPanggul',
    number: 2,
    name: 'Tinggi Panggul',
    fieldKey: 'tinggiPanggul',
    value: 20,
    unit: 'cm',
    description: 'Diukur tegak lurus dari garis pinggang ke batas garis panggul.',
    svgHighlightId: 'line-tinggi-panggul',
    category: 'height',
  },
  {
    id: 'lingkarPanggul',
    number: 3,
    name: 'Lingkar Panggul',
    fieldKey: 'lingkarPanggul',
    value: 92,
    unit: 'cm',
    description: 'Diukur melingkar pada bagian panggul terbesar.',
    svgHighlightId: 'line-lingkar-panggul',
    category: 'circumference',
  },
  {
    id: 'panjangRok',
    number: 4,
    name: 'Panjang Rok',
    fieldKey: 'panjangRok',
    value: 60,
    unit: 'cm',
    description: 'Diukur dari garis pinggang ke bawah sampai batas panjang yang dikehendaki.',
    svgHighlightId: 'line-panjang-rok',
    category: 'length',
  },
];

// 2. Dedicated sizing presets for Dressmaking system
export const ROK_DRESSMAKING_PRESETS: SizePreset[] = [
  {
    id: 'size-s',
    name: 'Ukuran S (Small)',
    badge: 'S',
    description: 'Ukuran standar S untuk Pola Dasar Rok Dressmaking',
    values: {
      lingkarPinggang: 66,
      tinggiPanggul: 18,
      lingkarPanggul: 88,
      panjangRok: 55,
    },
  },
  {
    id: 'size-m',
    name: 'Ukuran M (Medium)',
    badge: 'M',
    description: 'Ukuran standar M untuk Pola Dasar Rok Dressmaking',
    values: {
      lingkarPinggang: 72,
      tinggiPanggul: 20,
      lingkarPanggul: 92,
      panjangRok: 60,
    },
  },
  {
    id: 'size-l',
    name: 'Ukuran L (Large)',
    badge: 'L',
    description: 'Ukuran standar L untuk Pola Dasar Rok Dressmaking',
    values: {
      lingkarPinggang: 78,
      tinggiPanggul: 20,
      lingkarPanggul: 98,
      panjangRok: 65,
    },
  },
  {
    id: 'size-xl',
    name: 'Ukuran XL (Extra Large)',
    badge: 'XL',
    description: 'Ukuran standar XL untuk Pola Dasar Rok Dressmaking',
    values: {
      lingkarPinggang: 84,
      tinggiPanggul: 22,
      lingkarPanggul: 104,
      panjangRok: 70,
    },
  },
];

// 3. Dedicated calculation arrays for Dressmaking system
// POLA DEPAN (FRONT PATTERN)
export const ROK_DRESSMAKING_FRONT_CALCULATIONS: PatternCalculationItem[] = [
  {
    id: 'calc-dressmaking-front-ab',
    sequence: 1,
    points: 'A – B',
    pointIdentifier: 'A-B',
    patternSide: 'front',
    nameKey: 'front_ab',
    type: 'value',
    calculate: (m) => m.panjangRok || 60,
    formulaDisplay: 'Panjang Rok',
    formulaExplanation: 'Panjang rok diambil dari ukuran tubuh no. 4',
    referencedMeasurementNumbers: [4],
    referencedMeasurementNames: ['Panjang Rok'],
    patternPoints: ['A', 'B'],
    notes: 'Panjang rok keseluruhan dari garis pinggang ke kelim bawah.',
  },
  {
    id: 'calc-dressmaking-front-ac',
    sequence: 2,
    points: 'A – C',
    pointIdentifier: 'A-C',
    patternSide: 'front',
    nameKey: 'front_ac',
    type: 'value',
    calculate: (m) => m.tinggiPanggul || 20,
    formulaDisplay: 'Tinggi Panggul',
    formulaExplanation: 'Tinggi panggul diambil dari ukuran tubuh no. 2',
    referencedMeasurementNumbers: [2],
    referencedMeasurementNames: ['Tinggi Panggul'],
    patternPoints: ['A', 'C'],
    notes: 'Turun tinggi panggul pada garis tengah muka (TM).',
  },
  {
    id: 'calc-dressmaking-front-aa1',
    sequence: 3,
    points: 'A – A1',
    pointIdentifier: 'A-A1',
    patternSide: 'front',
    nameKey: 'front_aa1',
    type: 'value',
    calculate: (m) => ((m.lingkarPinggang || 72) / 4) + 4,
    formulaDisplay: '¼ Lingkar Pinggang + 4 cm',
    formulaExplanation: '+4 cm = 3 cm lebar kupnat + 1 cm pembeda pola depan vs belakang',
    referencedMeasurementNumbers: [1],
    referencedMeasurementNames: ['Lingkar Pinggang'],
    patternPoints: ['A', 'A1'],
    notes: 'Lebar pinggang pola depan mendatar dari A ke A1.',
  },
  {
    id: 'calc-dressmaking-front-a1a2',
    sequence: 4,
    points: 'A1 – A2',
    pointIdentifier: 'A1-A2',
    patternSide: 'front',
    nameKey: 'front_a1a2',
    type: 'action',
    fixedValue: 1.5,
    calculate: () => 1.5,
    formulaDisplay: 'Naik 1,5 cm',
    formulaExplanation: 'Titik A1 dinaikkan 1,5 cm untuk kelengkungan pinggang samping',
    referencedMeasurementNumbers: [],
    referencedMeasurementNames: [],
    patternPoints: ['A1', 'A2'],
    notes: 'Dari A1 naik tegak lurus 1,5 cm ke A2 untuk membentuk lengkung pinggang.',
  },
  {
    id: 'calc-dressmaking-front-ad',
    sequence: 5,
    points: 'A – D',
    pointIdentifier: 'A-D',
    patternSide: 'front',
    nameKey: 'front_ad',
    type: 'value',
    calculate: (m) => (m.lingkarPinggang || 72) / 10,
    formulaDisplay: '1/10 Lingkar Pinggang',
    formulaExplanation: 'Letak titik posisi awal kupnat depan dari titik A',
    referencedMeasurementNumbers: [1],
    referencedMeasurementNames: ['Lingkar Pinggang'],
    patternPoints: ['A', 'D'],
    notes: 'D adalah titik posisi awal kupnat depan.',
  },
  {
    id: 'calc-dressmaking-front-dd1',
    sequence: 6,
    points: 'D – D1',
    pointIdentifier: 'D-D1',
    patternSide: 'front',
    nameKey: 'front_dd1',
    type: 'value',
    fixedValue: 3,
    calculate: () => 3,
    formulaDisplay: '3 cm',
    formulaExplanation: 'Lebar bukaan kupnat depan = 3 cm',
    referencedMeasurementNumbers: [],
    referencedMeasurementNames: [],
    patternPoints: ['D', 'D1'],
    notes: 'Lebar kupnat diukur 3 cm dari D ke D1.',
  },
  {
    id: 'calc-dressmaking-front-do',
    sequence: 7,
    points: 'D – O',
    pointIdentifier: 'D-O',
    patternSide: 'front',
    nameKey: 'front_do',
    type: 'value',
    fixedValue: 12,
    calculate: () => 12,
    formulaDisplay: '12 cm',
    formulaExplanation: 'Panjang kedalaman kupnat dari D ke titik sumbu O',
    referencedMeasurementNumbers: [],
    referencedMeasurementNames: [],
    patternPoints: ['D', 'O'],
    notes: 'Panjang sisi kupnat D ke titik sumbu O = 12 cm.',
  },
  {
    id: 'calc-dressmaking-front-d1o',
    sequence: 8,
    points: 'D1 – O',
    pointIdentifier: 'D1-O',
    patternSide: 'front',
    nameKey: 'front_d1o',
    type: 'value',
    fixedValue: 12,
    calculate: () => 12,
    formulaDisplay: '12 cm',
    formulaExplanation: 'Panjang kedalaman kupnat dari D1 ke titik sumbu O',
    referencedMeasurementNumbers: [],
    referencedMeasurementNames: [],
    patternPoints: ['D1', 'O'],
    notes: 'Panjang sisi kupnat D1 ke titik sumbu O = 12 cm (konstruksi D ── O ── D1).',
  },
  {
    id: 'calc-dressmaking-front-cc1',
    sequence: 9,
    points: 'C – C1',
    pointIdentifier: 'C-C1',
    patternSide: 'front',
    nameKey: 'front_cc1',
    type: 'value',
    calculate: (m) => ((m.lingkarPanggul || 92) / 4) + 1,
    formulaDisplay: '¼ Lingkar Panggul + 1 cm',
    formulaExplanation: '+1 cm = pembeda lebar pola depan vs pola belakang',
    referencedMeasurementNumbers: [3],
    referencedMeasurementNames: ['Lingkar Panggul'],
    patternPoints: ['C', 'C1'],
    notes: 'Lebar panggul pola depan dari C mendatar ke C1.',
  },
  {
    id: 'calc-dressmaking-front-bb1',
    sequence: 10,
    points: 'B – B1',
    pointIdentifier: 'B-B1',
    patternSide: 'front',
    nameKey: 'front_bb1',
    type: 'value',
    calculate: (m) => ((m.lingkarPanggul || 92) / 4) + 1,
    formulaDisplay: 'C – C1',
    formulaExplanation: 'Lebar dasar kelim bawah sama dengan lebar panggul C – C1',
    referencedMeasurementNumbers: [3],
    referencedMeasurementNames: ['Lingkar Panggul'],
    patternPoints: ['B', 'B1'],
    notes: 'B–B1 menggunakan nilai lebar horizontal yang sama dengan C–C1.',
  },
  {
    id: 'calc-dressmaking-front-b1b2',
    sequence: 11,
    points: 'B1 – B2',
    pointIdentifier: 'B1-B2',
    patternSide: 'front',
    nameKey: 'front_b1b2',
    type: 'value',
    fixedValue: 3,
    calculate: () => 3,
    formulaDisplay: '3 cm',
    formulaExplanation: 'Pengembangan kelim samping bawah = 3 cm',
    referencedMeasurementNumbers: [],
    referencedMeasurementNames: [],
    patternPoints: ['B1', 'B2'],
    notes: 'Pengembangan kelim samping bawah ke arah luar sebesar 3 cm.',
  },
  {
    id: 'calc-dressmaking-front-b2b3',
    sequence: 12,
    points: 'B2 – B3',
    pointIdentifier: 'B2-B3',
    patternSide: 'front',
    nameKey: 'front_b2b3',
    type: 'action',
    fixedValue: 1.5,
    calculate: () => 1.5,
    formulaDisplay: 'Naik 1,5 cm',
    formulaExplanation: 'Titik B2 dinaikkan 1,5 cm ke B3 untuk lengkung kelim bawah',
    referencedMeasurementNumbers: [],
    referencedMeasurementNames: [],
    patternPoints: ['B2', 'B3'],
    notes: 'Dari titik B2 naik 1,5 cm ke B3 lalu dihubungkan melengkung ke titik B.',
  },
];

// POLA BELAKANG (BACK PATTERN)
export const ROK_DRESSMAKING_BACK_CALCULATIONS: PatternCalculationItem[] = [
  {
    id: 'calc-dressmaking-back-ae',
    sequence: 1,
    points: 'A – E',
    pointIdentifier: 'A-E',
    patternSide: 'back',
    nameKey: 'back_ae',
    type: 'value',
    fixedValue: 2,
    calculate: () => 2,
    formulaDisplay: '2 cm',
    formulaExplanation: 'Titik E dibentuk dengan mengukur 2 cm ke arah dalam dari titik A',
    referencedMeasurementNumbers: [],
    referencedMeasurementNames: [],
    patternPoints: ['A', 'E'],
    notes: 'Dari titik A, ukur 2 cm ke arah dalam untuk membentuk titik E.',
  },
  {
    id: 'calc-dressmaking-back-bf',
    sequence: 2,
    points: 'B – F',
    pointIdentifier: 'B-F',
    patternSide: 'back',
    nameKey: 'back_bf',
    type: 'value',
    fixedValue: 2,
    calculate: () => 2,
    formulaDisplay: '2 cm',
    formulaExplanation: 'Titik F dibentuk dengan mengukur 2 cm ke arah dalam dari titik B',
    referencedMeasurementNumbers: [],
    referencedMeasurementNames: [],
    patternPoints: ['B', 'F'],
    notes: 'Dari titik B, ukur 2 cm ke arah dalam untuk membentuk titik F.',
  },
];

export const ROK_DRESSMAKING_CALCULATIONS: PatternCalculationItem[] = [
  ...ROK_DRESSMAKING_FRONT_CALCULATIONS,
  ...ROK_DRESSMAKING_BACK_CALCULATIONS,
];

export const ROK_DRESSMAKING_DEFAULT_FRONT_INSTRUCTIONS = `1. A – B = Panjang Rok (diambil dari ukuran tubuh)
2. A – C = Tinggi Panggul (turun tinggi panggul pada garis TM)
3. A – A1 = ¼ Lingkar Pinggang + 4 cm (+4 cm = 3 cm lebar kupnat + 1 cm pembeda pola depan)
4. A1 – A2 = Naik 1,5 cm (membentuk kelengkungan pinggang samping)
5. A – D = 1/10 Lingkar Pinggang (titik letak kupnat depan)
6. D – D1 = 3 cm (lebar bukaan kupnat depan)
7. D – O = 12 cm (panjang sumbu kupnat depan)
8. D1 – O = 12 cm (panjang sumbu kupnat depan)
9. C – C1 = ¼ Lingkar Panggul + 1 cm
10. B – B1 = C – C1 (lebar dasar kelim bawah sama dengan lebar panggul)
11. B1 – B2 = 3 cm (pengembangan kelim samping bawah)
12. B2 – B3 = Naik 1,5 cm (dihubungkan melengkung ke titik B)`;

export const ROK_DRESSMAKING_DEFAULT_BACK_INSTRUCTIONS = `1. A – E = Masuk 2 cm dari titik A ke arah dalam untuk letak belahan atau resleting belakang
2. B – F = Masuk 2 cm dari titik B ke arah dalam untuk letak belahan atau resleting belakang`;

export const ROK_DRESSMAKING_IMPORTANT_NOTES = [
  'Pada konstruksi pola rok sistem dressmaking, pola depan dan pola belakang berhimpitan. Yang membedakan keduanya hanya posisi garis Tengah Muka (TM) dan Tengah Belakang (TB), sedangkan bentuk sisi sampingnya sama persis. Oleh karena itu, pola belakang dapat dipindahkan menggunakan kertas karbon.',
];

export const ROK_DRESSMAKING_CONFIG: CalculatorConfig = {
  id: 'rok-dressmaking',
  name: 'Pola Dasar Rok — Sistem Dressmaking',
  systemSubtitle: 'Sistem Dressmaking',
  moduleInfo: ROK_DRESSMAKING_MODULE,
  measurements: ROK_DRESSMAKING_MEASUREMENTS,
  presets: ROK_DRESSMAKING_PRESETS,
  calculations: ROK_DRESSMAKING_CALCULATIONS,
  frontCalculations: ROK_DRESSMAKING_FRONT_CALCULATIONS,
  backCalculations: ROK_DRESSMAKING_BACK_CALCULATIONS,
  importantNotes: ROK_DRESSMAKING_IMPORTANT_NOTES,
  defaultFrontPatternDescription: ROK_DRESSMAKING_DEFAULT_FRONT_INSTRUCTIONS,
  defaultBackPatternDescription: ROK_DRESSMAKING_DEFAULT_BACK_INSTRUCTIONS,
  defaultImages: {
    measurementGuideImage: '/assets/skirt_measurement_guide.jpg',
    patternImage: '',
  },
};
