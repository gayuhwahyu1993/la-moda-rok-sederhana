import { BodyMeasurement, PatternCalculationItem, SizePreset, PatternModuleInfo } from '../../types/pattern';
import { CalculatorConfig } from './types';

/**
 * POLA ROK PIAS & GODET — GORED SKIRT & GODET PATTERN CALCULATOR
 * 
 * Standalone module for drafting dynamic gored skirt (rok pias) with godet inserts.
 * Identifier: 'rok-pias-godet' (aliases: 'rok-pias', 'pias-godet', 'pias', 'gored-skirt', 'godet')
 * Title: Pola Rok Pias & Godet / Gored Skirt & Godet Pattern
 * Subtitle: Kalkulator Pola Rok Pias & Godet / Gored Skirt & Godet Pattern Calculator
 */

export const POLA_ROK_PIAS_GODET_MODULE: PatternModuleInfo = {
  id: 'rok-pias-godet',
  studioName: 'LA MODA LEARNING STUDIO',
  appTitle: 'Pattern Calculator',
  moduleTitle: 'Pola Rok Pias & Godet',
  systemSubtitle: 'Kalkulator Pola Rok Pias & Godet',
};

// 1. Body Measurements (4 Standard + Godet Inputs)
export const POLA_ROK_PIAS_GODET_MEASUREMENTS: BodyMeasurement[] = [
  {
    id: 'lingkarPinggang',
    number: 1,
    name: 'Lingkar Pinggang',
    fieldKey: 'lingkarPinggang',
    value: 67,
    unit: 'cm',
    description: 'Diukur melingkar pas pada batas pinggang tersempit tanpa kelonggaran.',
    svgHighlightId: 'line-lingkar-pinggang',
    category: 'circumference',
    group: 'primary',
  },
  {
    id: 'tinggiPanggul',
    number: 2,
    name: 'Tinggi Panggul',
    fieldKey: 'tinggiPanggul',
    value: 19,
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
    value: 94,
    unit: 'cm',
    description: 'Diukur melingkar pas pada bagian panggul terbesar tanpa kelonggaran.',
    svgHighlightId: 'line-lingkar-panggul',
    category: 'circumference',
    group: 'primary',
  },
  {
    id: 'panjangRok',
    number: 4,
    name: 'Panjang Rok',
    fieldKey: 'panjangRok',
    value: 50,
    unit: 'cm',
    description: 'Diukur dari garis pinggang ke bawah sampai batas panjang rok yang diinginkan.',
    svgHighlightId: 'line-panjang-rok',
    category: 'length',
    group: 'primary',
  },
  {
    id: 'tinggiGodet',
    number: 5,
    name: 'Tinggi Godet',
    fieldKey: 'tinggiGodet',
    value: 25,
    unit: 'cm',
    description: 'Diukur dari kelim bawah rok ke atas sesuai tinggi bukaan sisipan godet yang diinginkan.',
    svgHighlightId: 'line-tinggi-godet',
    category: 'height',
    group: 'additional',
  },
  {
    id: 'lebarGodet',
    number: 6,
    name: 'Lebar Godet',
    fieldKey: 'lebarGodet',
    value: 15,
    unit: 'cm',
    description: 'Lebar bukaan bawah dasar godet yang diinginkan.',
    svgHighlightId: 'line-lebar-godet',
    category: 'width',
    group: 'additional',
  },
];

// 2. Standard Size Presets (S, M, L, XL)
export const POLA_ROK_PIAS_GODET_PRESETS: SizePreset[] = [
  {
    id: 'size-s',
    name: 'Ukuran S (Small)',
    badge: 'S',
    description: 'Proporsi tubuh standar ukuran Small La Moda',
    values: {
      lingkarPinggang: 64,
      tinggiPanggul: 18,
      lingkarPanggul: 90,
      panjangRok: 48,
      tinggiGodet: 25,
      lebarGodet: 15,
    },
  },
  {
    id: 'size-m',
    name: 'Ukuran M (Medium)',
    badge: 'M',
    description: 'Proporsi tubuh standar ukuran Medium La Moda',
    values: {
      lingkarPinggang: 67,
      tinggiPanggul: 19,
      lingkarPanggul: 94,
      panjangRok: 50,
      tinggiGodet: 25,
      lebarGodet: 15,
    },
  },
  {
    id: 'size-l',
    name: 'Ukuran L (Large)',
    badge: 'L',
    description: 'Proporsi tubuh standar ukuran Large La Moda',
    values: {
      lingkarPinggang: 74,
      tinggiPanggul: 20,
      lingkarPanggul: 100,
      panjangRok: 52,
      tinggiGodet: 25,
      lebarGodet: 15,
    },
  },
  {
    id: 'size-xl',
    name: 'Ukuran XL (Extra Large)',
    badge: 'XL',
    description: 'Proporsi tubuh standar ukuran XL La Moda',
    values: {
      lingkarPinggang: 82,
      tinggiPanggul: 21,
      lingkarPanggul: 106,
      panjangRok: 55,
      tinggiGodet: 25,
      lebarGodet: 15,
    },
  },
];

/**
 * Dynamic Calculation Generator for Rok Pias & Godet Pattern
 * @param panelCount Number of skirt panels (N: must be an even integer, e.g. 4, 6, 8, 10, 12, default 6)
 */
export function getRokPiasGodetCalculations(panelCount: number = 6): PatternCalculationItem[] {
  const N = Math.max(2, Math.round(panelCount || 6));
  let seq = 1;

  return [
    // ==========================================
    // SECTION 1: POLA ROK PIAS (1 HELAI PIAS)
    // ==========================================
    {
      id: 'pias-ac',
      sequence: seq++,
      points: 'A – C',
      patternSide: 'front',
      pointIdentifier: 'A-C',
      nameKey: 'pias_ac',
      type: 'value',
      calculate: (m: Record<string, number>) => {
        const lp = m.lingkarPinggang ?? 67;
        return lp / N;
      },
      formulaDisplay: `A – C = Lingkar Pinggang ÷ ${N}`,
      formulaExplanation: `Lebar Pinggang 1 Pias = Lingkar Pinggang ÷ Jumlah Pias (${N})`,
      referencedMeasurementNumbers: [1],
      referencedMeasurementNames: ['Lingkar Pinggang'],
      patternPoints: ['A', 'C'],
      notes: `Lebar pinggang untuk 1 helai pias`,
    },
    {
      id: 'pias-ab-bc',
      sequence: seq++,
      points: 'A – B = B – C',
      patternSide: 'front',
      pointIdentifier: 'A-B-B-C',
      nameKey: 'pias_ab_bc',
      type: 'value',
      calculate: (m: Record<string, number>) => {
        const lp = m.lingkarPinggang ?? 67;
        return lp / (2 * N);
      },
      formulaDisplay: `A – B = B – C = ½ × (A – C) = Lingkar Pinggang ÷ (2 × ${N})`,
      formulaExplanation: `Setengah Lebar Pinggang 1 Pias (dari titik tengah B) = Lingkar Pinggang ÷ (2 × ${N})`,
      referencedMeasurementNumbers: [1],
      referencedMeasurementNames: ['Lingkar Pinggang'],
      patternPoints: ['A', 'B', 'C'],
      notes: `Jarak dari titik tengah pinggang B ke titik A dan C`,
    },
    {
      id: 'pias-be',
      sequence: seq++,
      points: 'B – E',
      patternSide: 'front',
      pointIdentifier: 'B-E',
      nameKey: 'pias_be',
      type: 'value',
      calculate: (m: Record<string, number>) => {
        return m.tinggiPanggul ?? 19;
      },
      formulaDisplay: `B – E = Tinggi Panggul`,
      formulaExplanation: `Jarak dari titik tengah pinggang B ke garis panggul E = Tinggi Panggul`,
      referencedMeasurementNumbers: [2],
      referencedMeasurementNames: ['Tinggi Panggul'],
      patternPoints: ['B', 'E'],
      notes: `Tinggi panggul rok pias`,
    },
    {
      id: 'pias-bg',
      sequence: seq++,
      points: 'B – G',
      patternSide: 'front',
      pointIdentifier: 'B-G',
      nameKey: 'pias_bg',
      type: 'value',
      calculate: (m: Record<string, number>) => {
        return m.panjangRok ?? 50;
      },
      formulaDisplay: `B – G = Panjang Rok`,
      formulaExplanation: `Jarak dari titik tengah pinggang B ke garis kelim bawah G = Panjang Rok`,
      referencedMeasurementNumbers: [4],
      referencedMeasurementNames: ['Panjang Rok'],
      patternPoints: ['B', 'G'],
      notes: `Panjang rok pias`,
    },
    {
      id: 'pias-fd',
      sequence: seq++,
      points: 'F – D',
      patternSide: 'front',
      pointIdentifier: 'F-D',
      nameKey: 'pias_fd',
      type: 'value',
      calculate: (m: Record<string, number>) => {
        const lpg = m.lingkarPanggul ?? 94;
        return lpg / N;
      },
      formulaDisplay: `F – D = Lingkar Panggul ÷ ${N}`,
      formulaExplanation: `Lebar Panggul 1 Pias = Lingkar Panggul ÷ Jumlah Pias (${N})`,
      referencedMeasurementNumbers: [3],
      referencedMeasurementNames: ['Lingkar Panggul'],
      patternPoints: ['F', 'D'],
      notes: `Lebar panggul untuk 1 helai pias`,
    },
    {
      id: 'pias-fe-ed',
      sequence: seq++,
      points: 'F – E = E – D',
      patternSide: 'front',
      pointIdentifier: 'F-E-E-D',
      nameKey: 'pias_fe_ed',
      type: 'value',
      calculate: (m: Record<string, number>) => {
        const lpg = m.lingkarPanggul ?? 94;
        return lpg / (2 * N);
      },
      formulaDisplay: `F – E = E – D = ½ × (F – D) = Lingkar Panggul ÷ (2 × ${N})`,
      formulaExplanation: `Setengah Lebar Panggul 1 Pias (dari titik tengah E) = Lingkar Panggul ÷ (2 × ${N})`,
      referencedMeasurementNumbers: [3],
      referencedMeasurementNames: ['Lingkar Panggul'],
      patternPoints: ['F', 'E', 'D'],
      notes: `Jarak dari titik tengah panggul E ke titik F dan D`,
    },
    {
      id: 'pias-ggprime',
      sequence: seq++,
      points: 'G – G\' = G – G"',
      patternSide: 'front',
      pointIdentifier: 'G-G_prime-G-G_double_prime',
      nameKey: 'pias_gg_prime',
      type: 'value',
      calculate: (m: Record<string, number>) => {
        const lp = m.lingkarPinggang ?? 67;
        return lp / (2 * N);
      },
      formulaDisplay: `G – G' = G – G" = A – B = B – C = Lingkar Pinggang ÷ (2 × ${N})`,
      formulaExplanation: `Jarak dasar kelim bawah dari titik tengah G = A – B = B – C`,
      referencedMeasurementNumbers: [1],
      referencedMeasurementNames: ['Lingkar Pinggang'],
      patternPoints: ['G', "G'", 'G"'],
      notes: `Jarak dasar kelim bawah dari garis tengah`,
    },
    {
      id: 'pias-gprime-gdoubleprime',
      sequence: seq++,
      points: 'G\' – G"',
      patternSide: 'front',
      pointIdentifier: 'G_prime-G_double_prime',
      nameKey: 'pias_gprime_gdoubleprime',
      type: 'value',
      calculate: (m: Record<string, number>) => {
        const lp = m.lingkarPinggang ?? 67;
        return lp / N;
      },
      formulaDisplay: `G' – G" = (G – G') + (G – G") = A – C = Lingkar Pinggang ÷ ${N}`,
      formulaExplanation: `Lebar Bawah Dasar 1 Pias = A – C = Lingkar Pinggang ÷ Jumlah Pias (${N})`,
      referencedMeasurementNumbers: [1],
      referencedMeasurementNames: ['Lingkar Pinggang'],
      patternPoints: ["G'", 'G"'],
      notes: `Lebar dasar kelim bawah 1 helai pias sebelum penambahan godet/suai`,
    },

    // ==========================================
    // SECTION 2: POLA GODET
    // ==========================================
    {
      id: 'godet-ab',
      sequence: seq++,
      points: 'A – B (Godet)',
      patternSide: 'back', // Marking as 'back' so it cleanly groups or is distinguished
      pointIdentifier: 'Godet-A-B',
      nameKey: 'godet_ab',
      type: 'value',
      calculate: (m: Record<string, number>) => {
        return m.tinggiGodet ?? 25;
      },
      formulaDisplay: `A – B = Tinggi Godet`,
      formulaExplanation: `Tinggi Tegak Lurus Tengah Godet = Tinggi Godet`,
      referencedMeasurementNumbers: [5],
      referencedMeasurementNames: ['Tinggi Godet'],
      patternPoints: ['A', 'B'],
      notes: `Tinggi bukaan godet dari kelim bawah rok`,
    },
    {
      id: 'godet-bc-bd',
      sequence: seq++,
      points: 'B – C = B – D (Godet)',
      patternSide: 'back',
      pointIdentifier: 'Godet-B-C-B-D',
      nameKey: 'godet_bc_bd',
      type: 'value',
      calculate: (m: Record<string, number>) => {
        const lg = m.lebarGodet ?? 15;
        return lg / 2;
      },
      formulaDisplay: `B – C = B – D = ½ × Lebar Godet`,
      formulaExplanation: `Setengah Lebar Godet = ½ × Lebar Godet`,
      referencedMeasurementNumbers: [6],
      referencedMeasurementNames: ['Lebar Godet'],
      patternPoints: ['B', 'C', 'D'],
      notes: `Setengah lebar dasar bukaan godet dari titik tengah B`,
    },
    {
      id: 'godet-ccprime-ddprime',
      sequence: seq++,
      points: 'C – C\' = D – D\' (Godet)',
      patternSide: 'back',
      pointIdentifier: 'Godet-C-C_prime-D-D_prime',
      nameKey: 'godet_ccprime_ddprime',
      type: 'value',
      fixedValue: 1.5,
      formulaDisplay: `C – C' = D – D' = 1.5 cm`,
      formulaExplanation: `Lengkungan Kelim Bawah Godet: Dinaikkan 1.5 cm agar panjang sisi A–C' = A–D' = A–B`,
      referencedMeasurementNumbers: [],
      referencedMeasurementNames: [],
      patternPoints: ['C', "C'", 'D', "D'"],
      notes: `Dinaikkan 1.5 cm untuk membentuk lengkungan kelim godet yang rata dan rapi`,
    },
  ];
}

export const DEFAULT_ROK_PIAS_GODET_CALCULATIONS = getRokPiasGodetCalculations(6);

export const DEFAULT_ROK_PIAS_INSTRUCTIONS = `**1. Penentuan Jumlah Pias Rok (N)**
• Jumlah pias harus berupa bilangan genap (contoh: 4, 6, 8, 10, dll). Default: **6 pias**.
• Pola yang dibuat adalah **1 helai pias** yang dipotong sebanyak jumlah pias yang ditentukan.

**2. Langkah Pembuatan Pola 1 Helai Pias**
• **Garis Tengah Pola**: Buat garis tegak lurus tengah **B – G = Panjang Rok**.
• **Tinggi Panggul**: Ukur turun dari titik B sepanjang garis tengah **B – E = Tinggi Panggul**.
• **Garis Pinggang (A – C)**: 
  - Buat garis mendatar tegak lurus di titik B.
  - **A – B = B – C = Lingkar Pinggang ÷ (2 × Jumlah Pias)**.
  - Lebar pinggang total 1 pias: **A – C = Lingkar Pinggang ÷ Jumlah Pias**.
• **Garis Panggul (F – D)**: 
  - Buat garis mendatar tegak lurus di titik E.
  - **F – E = E – D = Lingkar Panggul ÷ (2 × Jumlah Pias)**.
  - Lebar panggul total 1 pias: **F – D = Lingkar Panggul ÷ Jumlah Pias**.
• **Garis Kelim Bawah Dasar (G' – G")**:
  - Buat garis mendatar tegak lurus di titik G.
  - **G – G' = G – G" = A – B = Lingkar Pinggang ÷ (2 × Jumlah Pias)**.
• **Membentuk Sisi Pias**:
  - Hubungkan titik A melalui F sampai batas kelim bawah G', dan titik C melalui D sampai batas kelim bawah G".`;

export const DEFAULT_ROK_GODET_INSTRUCTIONS = `**1. Langkah Pembuatan Pola Godet (Sisipan Gelombang)**
• **Tinggi Godet**: Buat garis tegak lurus tengah **A – B = Tinggi Godet** (default: 25 cm).
• **Lebar Dasar Godet**: 
  - Buat garis mendatar tegak lurus di titik B.
  - **B – C = B – D = ½ × Lebar Godet** (default: 15 ÷ 2 = 7.5 cm).
• **Membentuk Lengkungan Kelim Godet**:
  - Tarik garis sisi dari titik puncak A ke C dan A ke D.
  - Pada titik C dan D, ukur naik sepanjang sisi **C – C' = D – D' = 1.5 cm** (atau samakan panjang A–C' = A–D' = A–B).
  - Bentuk lengkungan kelim bawah yang halus menghubungkan titik C', B, dan D'.

**2. Penyelesaian Pola & Pemotongan**
• Beri tanda arah serat kain (panah vertikal tepat di garis tengah B–G pias dan A–B godet).
• Potong pola pias sebanyak jumlah pias yang diinginkan dan godet sebanyak jumlah sambungan antar pias.`;

export const DEFAULT_ROK_PIAS_GODET_INSTRUCTIONS = `${DEFAULT_ROK_PIAS_INSTRUCTIONS}\n\n${DEFAULT_ROK_GODET_INSTRUCTIONS}`;

export const ROK_PIAS_GODET_CONFIG: CalculatorConfig = {
  id: 'rok-pias-godet',
  name: 'Pola Rok Pias & Godet',
  systemSubtitle: 'Kalkulator Pola Rok Pias & Godet',
  garmentCategory: 'rok',
  systemId: 'rok-pias-godet',
  moduleInfo: POLA_ROK_PIAS_GODET_MODULE,
  measurements: POLA_ROK_PIAS_GODET_MEASUREMENTS,
  presets: POLA_ROK_PIAS_GODET_PRESETS,
  calculations: DEFAULT_ROK_PIAS_GODET_CALCULATIONS,
  frontCalculations: DEFAULT_ROK_PIAS_GODET_CALCULATIONS.filter(c => c.patternSide === 'front'),
  backCalculations: DEFAULT_ROK_PIAS_GODET_CALCULATIONS.filter(c => c.patternSide === 'back'),
  importantNotes: [
    'Jumlah pias rok harus berupa bilangan genap (contoh: 4, 6, 8, 10, dll).',
    'Semua ukuran diambil pas pada tubuh tanpa tambahan kelonggaran.',
    'Pola 1 helai pias dipotong sebanyak jumlah pias yang ditentukan.',
  ],
  defaultImages: {
    measurementGuideImage: '/assets/skirt_measurement_guide.jpg',
    patternImage: '',
  },
  defaultPatternDescription: DEFAULT_ROK_PIAS_INSTRUCTIONS,
  defaultFrontPatternDescription: DEFAULT_ROK_PIAS_INSTRUCTIONS,
  defaultBackPatternDescription: DEFAULT_ROK_GODET_INSTRUCTIONS,
};
