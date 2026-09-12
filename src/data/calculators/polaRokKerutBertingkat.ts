import { BodyMeasurement, PatternCalculationItem, SizePreset, PatternModuleInfo } from '../../types/pattern';
import { CalculatorConfig } from './types';

/**
 * POLA ROK KERUT BERTINGKAT — TIERED GATHERED SKIRT PATTERN CALCULATOR
 * 
 * Standalone module for drafting dynamic tiered gathered skirt pattern.
 * Identifier: 'pola-rok-kerut-bertingkat' (aliases: 'rok-kerut-bertingkat', 'rok-kerut', 'tiered-skirt')
 * Title: Pola Rok Kerut Bertingkat / Tiered Gathered Skirt Pattern
 * Subtitle: Kalkulator Pola Rok Kerut Bertingkat / Tiered Gathered Skirt Pattern Calculator
 */

export const POLA_ROK_KERUT_BERTINGKAT_MODULE: PatternModuleInfo = {
  id: 'pola-rok-kerut-bertingkat',
  studioName: 'LA MODA LEARNING STUDIO',
  appTitle: 'Pattern Calculator',
  moduleTitle: 'Pola Rok Kerut Bertingkat',
  systemSubtitle: 'Kalkulator Pola Rok Kerut Bertingkat',
};

// 1. 4 Body Measurements
// Lingkar Pinggang, Tinggi Panggul, Lingkar Panggul, Panjang Rok
export const POLA_ROK_KERUT_BERTINGKAT_MEASUREMENTS: BodyMeasurement[] = [
  {
    id: 'lingkarPinggang',
    number: 1,
    name: 'Lingkar Pinggang',
    fieldKey: 'lingkarPinggang',
    value: 67,
    unit: 'cm',
    description: 'Diukur melingkar pas pada batas pinggang terkecil tanpa tambahan kelonggaran.',
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
    description: 'Diukur tegak lurus dari garis pinggang sampai batas panggul terbesar.',
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
    description: 'Diukur melingkar pas pada batas panggul terbesar tanpa tambahan kelonggaran.',
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
    description: 'Diukur dari batas pinggang ke bawah sampai batas panjang rok yang dikehendaki.',
    svgHighlightId: 'line-panjang-rok',
    category: 'length',
    group: 'primary',
  },
];

// 2. Standard Size Presets (S, M, L, XL)
export const POLA_ROK_KERUT_BERTINGKAT_PRESETS: SizePreset[] = [
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
    },
  },
];

/**
 * Dynamic Calculation Generator for Tiered Skirt Pattern (2 to 6 Tiers)
 * Default tier count: N = 3
 * 
 * Gathering multiplier: exactly 1.5
 * Tier-length adjustment:
 * - A–B (Tier 1) = tier length - 5 cm
 * - B–C (Tier 2) = tier length
 * - C–D (Tier 3) = tier length + 5 cm
 * 
 * Tier widths:
 * - A–A' (Tier 1) = 1/4 * (1.5 * Lingkar Pinggang)
 * - B–B' (Tier 2) = 1.5 * (A–A')
 * - C–C' (Tier 3) = 1.5 * (B–B')
 */
export function getTieredSkirtCalculations(tierCount: number = 3): PatternCalculationItem[] {
  const N = Math.min(6, Math.max(2, Math.round(tierCount || 3)));
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

  const items: PatternCalculationItem[] = [];
  let seq = 1;

  // 1. Length Formulas for each tier
  for (let i = 1; i <= N; i++) {
    const startLetter = letters[i - 1];
    const endLetter = letters[i];
    const pointLabel = `${startLetter} – ${endLetter}`;
    const pointId = `${startLetter}-${endLetter}`;

    if (N === 2) {
      if (i === 1) {
        items.push({
          id: `tiered-len-${i}`,
          sequence: seq++,
          points: pointLabel,
          patternSide: 'front',
          pointIdentifier: pointId,
          nameKey: `tiered_len_${i}`,
          type: 'value',
          calculate: (m: Record<string, number>) => {
            const pr = m.panjangRok ?? 50;
            return (pr / N) - 5;
          },
          formulaDisplay: `${pointLabel} = (Panjang Rok ÷ ${N}) − 5 cm`,
          formulaExplanation: `Panjang Tingkat 1 (Atas) = (Panjang Rok ÷ ${N}) − 5 cm`,
          referencedMeasurementNumbers: [4],
          referencedMeasurementNames: ['Panjang Rok'],
          patternPoints: [startLetter, endLetter],
          notes: `Panjang tingkatan 1 (atas) dikurangi 5 cm`,
        });
      } else {
        items.push({
          id: `tiered-len-${i}`,
          sequence: seq++,
          points: pointLabel,
          patternSide: 'front',
          pointIdentifier: pointId,
          nameKey: `tiered_len_${i}`,
          type: 'value',
          calculate: (m: Record<string, number>) => {
            const pr = m.panjangRok ?? 50;
            return (pr / N) + 5;
          },
          formulaDisplay: `${pointLabel} = (Panjang Rok ÷ ${N}) + 5 cm`,
          formulaExplanation: `Panjang Tingkat 2 (Bawah) = (Panjang Rok ÷ ${N}) + 5 cm`,
          referencedMeasurementNumbers: [4],
          referencedMeasurementNames: ['Panjang Rok'],
          patternPoints: [startLetter, endLetter],
          notes: `Panjang tingkatan 2 (bawah) ditambah 5 cm`,
        });
      }
    } else if (N === 3) {
      if (i === 1) {
        items.push({
          id: `tiered-len-${i}`,
          sequence: seq++,
          points: 'A – B',
          patternSide: 'front',
          pointIdentifier: 'A-B',
          nameKey: 'tiered_ab',
          type: 'value',
          calculate: (m: Record<string, number>) => {
            const pr = m.panjangRok ?? 50;
            return (pr / 3) - 5;
          },
          formulaDisplay: `A – B = (Panjang Rok ÷ 3) − 5 cm`,
          formulaExplanation: `Panjang Tingkat 1 (Atas) = (Panjang Rok ÷ 3) − 5 cm`,
          referencedMeasurementNumbers: [4],
          referencedMeasurementNames: ['Panjang Rok'],
          patternPoints: ['A', 'B'],
          notes: `Panjang tingkatan pertama (atas) dikurangi 5 cm`,
        });
      } else if (i === 2) {
        items.push({
          id: `tiered-len-${i}`,
          sequence: seq++,
          points: 'B – C',
          patternSide: 'front',
          pointIdentifier: 'B-C',
          nameKey: 'tiered_bc',
          type: 'value',
          calculate: (m: Record<string, number>) => {
            const pr = m.panjangRok ?? 50;
            return pr / 3;
          },
          formulaDisplay: `B – C = Panjang Rok ÷ 3`,
          formulaExplanation: `Panjang Tingkat 2 (Tengah) = Panjang Rok ÷ 3`,
          referencedMeasurementNumbers: [4],
          referencedMeasurementNames: ['Panjang Rok'],
          patternPoints: ['B', 'C'],
          notes: `Panjang tingkatan kedua (tengah) standar`,
        });
      } else {
        items.push({
          id: `tiered-len-${i}`,
          sequence: seq++,
          points: 'C – D',
          patternSide: 'front',
          pointIdentifier: 'C-D',
          nameKey: 'tiered_cd',
          type: 'value',
          calculate: (m: Record<string, number>) => {
            const pr = m.panjangRok ?? 50;
            return (pr / 3) + 5;
          },
          formulaDisplay: `C – D = (Panjang Rok ÷ 3) + 5 cm`,
          formulaExplanation: `Panjang Tingkat 3 (Bawah) = (Panjang Rok ÷ 3) + 5 cm`,
          referencedMeasurementNumbers: [4],
          referencedMeasurementNames: ['Panjang Rok'],
          patternPoints: ['C', 'D'],
          notes: `Panjang tingkatan ketiga (bawah) ditambah 5 cm`,
        });
      }
    } else {
      // N > 3
      if (i === 1) {
        items.push({
          id: `tiered-len-${i}`,
          sequence: seq++,
          points: pointLabel,
          patternSide: 'front',
          pointIdentifier: pointId,
          nameKey: `tiered_len_${i}`,
          type: 'value',
          calculate: (m: Record<string, number>) => {
            const pr = m.panjangRok ?? 50;
            return (pr / N) - 5;
          },
          formulaDisplay: `${pointLabel} = (Panjang Rok ÷ ${N}) − 5 cm`,
          formulaExplanation: `Panjang Tingkat 1 (Atas) = (Panjang Rok ÷ ${N}) − 5 cm`,
          referencedMeasurementNumbers: [4],
          referencedMeasurementNames: ['Panjang Rok'],
          patternPoints: [startLetter, endLetter],
          notes: `Panjang tingkatan 1 (atas) dikurangi 5 cm`,
        });
      } else if (i === N) {
        items.push({
          id: `tiered-len-${i}`,
          sequence: seq++,
          points: pointLabel,
          patternSide: 'front',
          pointIdentifier: pointId,
          nameKey: `tiered_len_${i}`,
          type: 'value',
          calculate: (m: Record<string, number>) => {
            const pr = m.panjangRok ?? 50;
            return (pr / N) + 5;
          },
          formulaDisplay: `${pointLabel} = (Panjang Rok ÷ ${N}) + 5 cm`,
          formulaExplanation: `Panjang Tingkat ${N} (Bawah) = (Panjang Rok ÷ ${N}) + 5 cm`,
          referencedMeasurementNumbers: [4],
          referencedMeasurementNames: ['Panjang Rok'],
          patternPoints: [startLetter, endLetter],
          notes: `Panjang tingkatan ${N} (bawah) ditambah 5 cm`,
        });
      } else {
        items.push({
          id: `tiered-len-${i}`,
          sequence: seq++,
          points: pointLabel,
          patternSide: 'front',
          pointIdentifier: pointId,
          nameKey: `tiered_len_${i}`,
          type: 'value',
          calculate: (m: Record<string, number>) => {
            const pr = m.panjangRok ?? 50;
            return pr / N;
          },
          formulaDisplay: `${pointLabel} = Panjang Rok ÷ ${N}`,
          formulaExplanation: `Panjang Tingkat ${i} = Panjang Rok ÷ ${N}`,
          referencedMeasurementNumbers: [4],
          referencedMeasurementNames: ['Panjang Rok'],
          patternPoints: [startLetter, endLetter],
          notes: `Panjang tingkatan ${i} standar`,
        });
      }
    }
  }

  // 2. Width Formulas for each tier
  // Tier 1: A – A' = 1/4 * (1.5 * LP)
  // Tier 2: B – B' = 1.5 * (A – A')
  // Tier 3: C – C' = 1.5 * (B – B')
  // ... Tier k: Letter_k – Letter_k' = 1.5 * (Prev_width)
  for (let i = 1; i <= N; i++) {
    const letter = letters[i - 1];
    const prevLetter = i > 1 ? letters[i - 2] : '';
    const pointLabel = `${letter} – ${letter}’`;
    const pointId = `${letter}-${letter}_prime`;

    if (i === 1) {
      items.push({
        id: `tiered-width-${i}`,
        sequence: seq++,
        points: pointLabel,
        patternSide: 'front',
        pointIdentifier: pointId,
        nameKey: `tiered_width_${i}`,
        type: 'value',
        calculate: (m: Record<string, number>) => {
          const lp = m.lingkarPinggang ?? 67;
          return 0.25 * (1.5 * lp);
        },
        formulaDisplay: `${pointLabel} = ¼ × (1.5 × Lingkar Pinggang)`,
        formulaExplanation: `Lebar kerutan tingkat 1 = ¼ × (1.5 × Lingkar Pinggang)`,
        referencedMeasurementNumbers: [1],
        referencedMeasurementNames: ['Lingkar Pinggang'],
        patternPoints: [letter, `${letter}'`],
        notes: `Lebar kerutan tingkat 1 (atas)`,
      });
    } else {
      const prevLabel = `${prevLetter} – ${prevLetter}’`;
      items.push({
        id: `tiered-width-${i}`,
        sequence: seq++,
        points: pointLabel,
        patternSide: 'front',
        pointIdentifier: pointId,
        nameKey: `tiered_width_${i}`,
        type: 'value',
        calculate: (m: Record<string, number>) => {
          const lp = m.lingkarPinggang ?? 67;
          let width = 0.25 * (1.5 * lp);
          for (let step = 2; step <= i; step++) {
            width = 1.5 * width;
          }
          return width;
        },
        formulaDisplay: `${pointLabel} = 1.5 × Jarak ${prevLabel}`,
        formulaExplanation: `Lebar kerutan tingkat ${i} = 1.5 × Jarak ${prevLabel}`,
        referencedMeasurementNumbers: [1],
        referencedMeasurementNames: ['Lingkar Pinggang'],
        patternPoints: [letter, `${letter}'`],
        notes: `Lebar kerutan tingkat ${i}`,
      });
    }
  }

  return items;
}

export const DEFAULT_TIERED_SKIRT_CALCULATIONS = getTieredSkirtCalculations(3);

export const DEFAULT_TIERED_SKIRT_INSTRUCTIONS = `**1. Penentuan Tingkat dan Rumus Dasar**
• Tentukan jumlah tingkatan rok yang diinginkan (default: 3 tingkatan).
• Panjang dasar tiap tingkatan diperoleh dari: **Panjang Rok ÷ Jumlah Tingkatan (N)**.

**2. Langkah Pembuatan Panjang Tingkat (Vertikal)**
• **A – B (Tingkat 1 / Atas)**: Ukur turun sepanjang **(Panjang Rok ÷ N) − 5 cm**.
• **B – C (Tingkat 2 / Tengah)**: Ukur turun sepanjang **Panjang Rok ÷ N**.
• **C – D (Tingkat 3 / Bawah)**: Ukur turun sepanjang **(Panjang Rok ÷ N) + 5 cm**.

**3. Langkah Pembuatan Lebar Kerutan (Horizontal)**
• **A – A’ (Lebar Tingkat 1)**: Ukur ke samping sepanjang **¼ × (1.5 × Lingkar Pinggang)**.
• **B – B’ (Lebar Tingkat 2)**: Ukur ke samping sepanjang **1.5 × Jarak A – A’**.
• **C – C’ (Lebar Tingkat 3)**: Ukur ke samping sepanjang **1.5 × Jarak B – B’**.

**4. Penyelesaian Pola**
• Buat pola tiap tingkatan berupa bidang persegi panjang tegak lurus.
• Beri tanda arah serat kain (panah vertikal) dan tanda lipatan kain bila diperlukan.
• **Catatan**: Pola depan dan pola belakang menggunakan bentuk konstruksi yang sama.`;

export const DEFAULT_TIERED_SKIRT_TIER4_INSTRUCTIONS = `**1. Penentuan Tingkat dan Rumus Dasar (Konstruksi 4 Tingkat)**
• Tentukan jumlah tingkatan rok (4 tingkatan).
• Panjang dasar tiap tingkatan diperoleh dari: **Panjang Rok ÷ 4**.

**2. Langkah Pembuatan Panjang Tingkat (Vertikal)**
• **A – B (Tingkat 1 / Atas)**: Ukur turun sepanjang **(Panjang Rok ÷ 4) − 5 cm**.
• **B – C (Tingkat 2 / Tengah Atas)**: Ukur turun sepanjang **Panjang Rok ÷ 4**.
• **C – D (Tingkat 3 / Tengah Bawah)**: Ukur turun sepanjang **Panjang Rok ÷ 4**.
• **D – E (Tingkat 4 / Bawah)**: Ukur turun sepanjang **(Panjang Rok ÷ 4) + 5 cm**.

**3. Langkah Pembuatan Lebar Kerutan (Horizontal)**
• **A – A’ (Lebar Tingkat 1)**: Ukur ke samping sepanjang **¼ × (1.5 × Lingkar Pinggang)**.
• **B – B’ (Lebar Tingkat 2)**: Ukur ke samping sepanjang **1.5 × Jarak A – A’**.
• **C – C’ (Lebar Tingkat 3)**: Ukur ke samping sepanjang **1.5 × Jarak B – B’**.
• **D – D’ (Lebar Tingkat 4)**: Ukur ke samping sepanjang **1.5 × Jarak C – C’**.

**4. Penyelesaian Pola**
• Buat pola tiap tingkatan berupa bidang persegi panjang tegak lurus.
• Beri tanda arah serat kain (panah vertikal) dan tanda lipatan kain bila diperlukan.
• **Catatan**: Pola depan dan pola belakang menggunakan bentuk konstruksi yang sama. Untuk tingkatan 5 atau 6, pola referensi mengikuti prinsip konstruksi 4 tingkat ini.`;

export const POLA_ROK_KERUT_BERTINGKAT_CONFIG: CalculatorConfig = {
  id: 'pola-rok-kerut-bertingkat',
  name: 'Pola Rok Kerut Bertingkat',
  systemSubtitle: 'Kalkulator Pola Rok Kerut Bertingkat',
  garmentCategory: 'rok',
  systemId: 'pola-rok-kerut-bertingkat',
  moduleInfo: POLA_ROK_KERUT_BERTINGKAT_MODULE,
  measurements: POLA_ROK_KERUT_BERTINGKAT_MEASUREMENTS,
  presets: POLA_ROK_KERUT_BERTINGKAT_PRESETS,
  calculations: DEFAULT_TIERED_SKIRT_CALCULATIONS,
  frontCalculations: DEFAULT_TIERED_SKIRT_CALCULATIONS,
  backCalculations: [],
  importantNotes: [
    'Semua ukuran diambil pas pada tubuh.',
    'Pola depan dan pola belakang menggunakan bentuk konstruksi yang sama.',
  ],
  defaultImages: {
    measurementGuideImage: '',
    patternImage: '',
  },
  defaultPatternDescription: DEFAULT_TIERED_SKIRT_INSTRUCTIONS,
  defaultFrontPatternDescription: DEFAULT_TIERED_SKIRT_INSTRUCTIONS,
  defaultBackPatternDescription: '',
  defaultTier4PatternDescription: DEFAULT_TIERED_SKIRT_TIER4_INSTRUCTIONS,
};
