import { BodyMeasurement, PatternCalculationItem, SizePreset, PatternModuleInfo } from '../../types/pattern';
import { CalculatorConfig } from './types';

/**
 * POLA ROK LIPIT SEARAH — ONE-WAY PLEATED SKIRT PATTERN CALCULATOR
 * 
 * Standalone module for drafting dynamic one-way pleated skirt (rok lipit searah).
 * Identifier: 'rok-lipit-searah' (aliases: 'rok-lipit', 'lipit-searah', 'lipit', 'one-way-pleated-skirt', 'pleated-skirt')
 * Title: Pola Rok Lipit Searah / One-Way Pleated Skirt Pattern
 * Subtitle: Kalkulator Pola Rok Lipit Searah / One-Way Pleated Skirt Pattern Calculator
 */

export const POLA_ROK_LIPIT_SEARAH_MODULE: PatternModuleInfo = {
  id: 'rok-lipit-searah',
  studioName: 'LA MODA LEARNING STUDIO',
  appTitle: 'Pattern Calculator',
  moduleTitle: 'Pola Rok Lipit Searah',
  systemSubtitle: 'Kalkulator Pola Rok Lipit Searah',
};

// 1. Required Body Measurements & Inputs
export const POLA_ROK_LIPIT_SEARAH_MEASUREMENTS: BodyMeasurement[] = [
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
    id: 'panjangRok',
    number: 2,
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
    id: 'jumlahLipit',
    number: 3,
    name: 'Jumlah Lipit',
    fieldKey: 'jumlahLipit',
    value: 12,
    unit: 'lipit',
    description: 'Jumlah lipit searah yang diinginkan pada sekeliling rok (contoh: 8, 10, 12, 14, 16).',
    svgHighlightId: 'line-jumlah-lipit',
    category: 'circumference',
    group: 'additional',
  },
  {
    id: 'lebarKainTotal',
    number: 4,
    name: 'Lebar Kain Total',
    fieldKey: 'lebarKainTotal',
    value: 150,
    unit: 'cm',
    description: 'Total lebar bentangan kain sebelum pemotongan/kampuh (contoh: 150 cm).',
    svgHighlightId: 'line-lebar-kain-total',
    category: 'width',
    group: 'additional',
  },
];

// 2. Standard Size Presets (S, M, L, XL)
export const POLA_ROK_LIPIT_SEARAH_PRESETS: SizePreset[] = [
  {
    id: 'size-s',
    name: 'Ukuran S (Small)',
    badge: 'S',
    description: 'Proporsi tubuh standar ukuran Small La Moda (12 Lipit)',
    values: {
      lingkarPinggang: 64,
      panjangRok: 48,
      jumlahLipit: 12,
      lebarKainTotal: 150,
    },
  },
  {
    id: 'size-m',
    name: 'Ukuran M (Medium)',
    badge: 'M',
    description: 'Proporsi tubuh standar ukuran Medium La Moda (12 Lipit)',
    values: {
      lingkarPinggang: 67,
      panjangRok: 50,
      jumlahLipit: 12,
      lebarKainTotal: 150,
    },
  },
  {
    id: 'size-l',
    name: 'Ukuran L (Large)',
    badge: 'L',
    description: 'Proporsi tubuh standar ukuran Large La Moda (12 Lipit)',
    values: {
      lingkarPinggang: 74,
      panjangRok: 52,
      jumlahLipit: 12,
      lebarKainTotal: 150,
    },
  },
  {
    id: 'size-xl',
    name: 'Ukuran XL (Extra Large)',
    badge: 'XL',
    description: 'Proporsi tubuh standar ukuran XL La Moda (12 Lipit)',
    values: {
      lingkarPinggang: 82,
      panjangRok: 55,
      jumlahLipit: 12,
      lebarKainTotal: 150,
    },
  },
];

/**
 * Generate sequential alphabet point label (A, B, C... Z, A', B'... Z', A'', etc.)
 */
export function getSequentialPointLetter(index: number): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const cycle = Math.floor(index / letters.length);
  const letter = letters[index % letters.length];
  if (cycle === 0) return letter;
  return `${letter}${cycle === 1 ? "'" : `${cycle}`}`;
}

/**
 * Dynamic Calculation Generator for Rok Lipit Searah (One-Way Pleated Skirt)
 * 
 * Formulas:
 * - Jarak Lipit = Lingkar Pinggang ÷ Jumlah Lipit
 * - Dalam Lipit = (Lebar Kain Total - 6 cm - Lingkar Pinggang) ÷ Jumlah Lipit
 * - A – A' = Panjang Rok
 * - A – B = ½ Dalam Lipit
 * - B – C = Jarak Lipit
 * - C – D = Dalam Lipit
 * - D – E = Jarak Lipit
 * - E – F = Dalam Lipit
 * ... alternating dynamically for all pleats.
 * 
 * @param pleatCount Number of pleats (positive whole number, e.g. 8, 10, 12, 14, 16)
 * @param customFabricWidth Optional override for total fabric width
 */
export function getRokLipitSearahCalculations(
  pleatCount: number = 12,
  _customFabricWidth?: number
): PatternCalculationItem[] {
  const N = Math.max(1, Math.round(pleatCount || 12));
  const calculations: PatternCalculationItem[] = [];
  let seq = 1;

  // 1. Core Summary: Jarak Lipit
  calculations.push({
    id: 'lipit-jarak-summary',
    sequence: seq++,
    points: 'Jarak Lipit',
    patternSide: 'front',
    pointIdentifier: 'Jarak-Lipit',
    nameKey: 'jarak_lipit',
    type: 'value',
    calculate: (m: Record<string, number>) => {
      const lp = m.lingkarPinggang ?? 67;
      const count = Math.max(1, Math.round(m.jumlahLipit ?? N));
      return lp / count;
    },
    formulaDisplay: `Jarak Lipit = Lingkar Pinggang ÷ Jumlah Lipit (${N})`,
    formulaExplanation: `Jarak tampak antar lipit = Lingkar Pinggang ÷ ${N}`,
    referencedMeasurementNumbers: [1, 3],
    referencedMeasurementNames: ['Lingkar Pinggang', 'Jumlah Lipit'],
    patternPoints: ['B', 'C'],
    notes: `Lebar tampak dari setiap lipitan pada keliling pinggang`,
  });

  // 2. Core Summary: Dalam Lipit
  calculations.push({
    id: 'lipit-dalam-summary',
    sequence: seq++,
    points: 'Dalam Lipit',
    patternSide: 'front',
    pointIdentifier: 'Dalam-Lipit',
    nameKey: 'dalam_lipit',
    type: 'value',
    calculate: (m: Record<string, number>) => {
      const lp = m.lingkarPinggang ?? 67;
      const lk = m.lebarKainTotal ?? 150;
      const count = Math.max(1, Math.round(m.jumlahLipit ?? N));
      const sisaKain = lk - 6 - lp;
      return sisaKain > 0 ? sisaKain / count : 0;
    },
    formulaDisplay: `Dalam Lipit = (Lebar Kain Total − 6 cm − Lingkar Pinggang) ÷ Jumlah Lipit (${N})`,
    formulaExplanation: `Kedalaman lipatan tersembunyi = (Lebar Kain − 6 cm resleting − Lingkar Pinggang) ÷ ${N}`,
    referencedMeasurementNumbers: [1, 3, 4],
    referencedMeasurementNames: ['Lingkar Pinggang', 'Jumlah Lipit', 'Lebar Kain Total'],
    patternPoints: ['C', 'D'],
    notes: `Kedalaman lipatan kain di dalam setiap lipit (6 cm = 3 cm kanan + 3 cm kiri untuk resleting)`,
  });

  // 3. Pattern Construction: A – A' (Panjang Rok)
  calculations.push({
    id: 'lipit-panjang-rok',
    sequence: seq++,
    points: "A – A'",
    patternSide: 'front',
    pointIdentifier: 'A-A_prime',
    nameKey: 'panjang_rok',
    type: 'value',
    calculate: (m: Record<string, number>) => {
      return m.panjangRok ?? 50;
    },
    formulaDisplay: `A – A' = Panjang Rok`,
    formulaExplanation: `Tinggi vertikal bentangan pola rok = Panjang Rok`,
    referencedMeasurementNumbers: [2],
    referencedMeasurementNames: ['Panjang Rok'],
    patternPoints: ['A', "A'"],
    notes: `Panjang rok dari pinggang ke kelim bawah`,
  });

  // 4. Pattern Construction: A – B (½ Dalam Lipit)
  calculations.push({
    id: 'lipit-ab-setengah-dalam',
    sequence: seq++,
    points: 'A – B',
    patternSide: 'front',
    pointIdentifier: 'A-B',
    nameKey: 'setengah_dalam_lipit',
    type: 'value',
    calculate: (m: Record<string, number>) => {
      const lp = m.lingkarPinggang ?? 67;
      const lk = m.lebarKainTotal ?? 150;
      const count = Math.max(1, Math.round(m.jumlahLipit ?? N));
      const sisaKain = lk - 6 - lp;
      const dalamLipit = sisaKain > 0 ? sisaKain / count : 0;
      return dalamLipit / 2;
    },
    formulaDisplay: `A – B = ½ Dalam Lipit = Dalam Lipit ÷ 2`,
    formulaExplanation: `Awal lipit tengah muka = ½ × Dalam Lipit agar letak lipit tepat di tengah muka`,
    referencedMeasurementNumbers: [1, 3, 4],
    referencedMeasurementNames: ['Lingkar Pinggang', 'Jumlah Lipit', 'Lebar Kain Total'],
    patternPoints: ['A', 'B'],
    notes: `½ Dalam Lipit digunakan agar dalam lipit terletak tepat di tengah muka`,
  });

  // 5. Dynamic Alternating Construction Points for N Pleats
  // Sequence: B–C (Jarak Lipit), C–D (Dalam Lipit), D–E (Jarak Lipit), E–F (Dalam Lipit), etc.
  let currentPointIndex = 1; // 0 = A, 1 = B, 2 = C, etc.

  for (let pleatIndex = 1; pleatIndex <= N; pleatIndex++) {
    // Step a: Jarak Lipit (e.g. B–C, D–E, F–G, ...)
    const ptStartJarak = getSequentialPointLetter(currentPointIndex);
    const ptEndJarak = getSequentialPointLetter(currentPointIndex + 1);
    currentPointIndex++;

    const jarakPointLabel = `${ptStartJarak} – ${ptEndJarak}`;
    calculations.push({
      id: `lipit-jarak-${pleatIndex}`,
      sequence: seq++,
      points: jarakPointLabel,
      patternSide: 'front',
      pointIdentifier: `${ptStartJarak}-${ptEndJarak}`,
      nameKey: `jarak_lipit_${pleatIndex}`,
      type: 'value',
      calculate: (m: Record<string, number>) => {
        const lp = m.lingkarPinggang ?? 67;
        const count = Math.max(1, Math.round(m.jumlahLipit ?? N));
        return lp / count;
      },
      formulaDisplay: `${jarakPointLabel} = Jarak Lipit = Lingkar Pinggang ÷ ${N}`,
      formulaExplanation: `Jarak tampak lipit ke-${pleatIndex} = ${jarakPointLabel} = Lingkar Pinggang ÷ ${N}`,
      referencedMeasurementNumbers: [1, 3],
      referencedMeasurementNames: ['Lingkar Pinggang', 'Jumlah Lipit'],
      patternPoints: [ptStartJarak, ptEndJarak],
      notes: `Lebar tampak muka lipit ke-${pleatIndex}`,
    });

    // Step b: Dalam Lipit (e.g. C–D, E–F, G–H, ...)
    const ptStartDalam = getSequentialPointLetter(currentPointIndex);
    const ptEndDalam = getSequentialPointLetter(currentPointIndex + 1);
    currentPointIndex++;

    const dalamPointLabel = `${ptStartDalam} – ${ptEndDalam}`;
    calculations.push({
      id: `lipit-dalam-${pleatIndex}`,
      sequence: seq++,
      points: dalamPointLabel,
      patternSide: 'front',
      pointIdentifier: `${ptStartDalam}-${ptEndDalam}`,
      nameKey: `dalam_lipit_${pleatIndex}`,
      type: 'value',
      calculate: (m: Record<string, number>) => {
        const lp = m.lingkarPinggang ?? 67;
        const lk = m.lebarKainTotal ?? 150;
        const count = Math.max(1, Math.round(m.jumlahLipit ?? N));
        const sisaKain = lk - 6 - lp;
        return sisaKain > 0 ? sisaKain / count : 0;
      },
      formulaDisplay: `${dalamPointLabel} = Dalam Lipit = (Lebar Kain − 6 − LP) ÷ ${N}`,
      formulaExplanation: `Kedalaman lipatan dalam lipit ke-${pleatIndex} = ${dalamPointLabel}`,
      referencedMeasurementNumbers: [1, 3, 4],
      referencedMeasurementNames: ['Lingkar Pinggang', 'Jumlah Lipit', 'Lebar Kain Total'],
      patternPoints: [ptStartDalam, ptEndDalam],
      notes: `Kedalaman lipatan tersembunyi lipit ke-${pleatIndex}`,
    });
  }

  return calculations;
}

export const DEFAULT_ROK_LIPIT_SEARAH_CALCULATIONS = getRokLipitSearahCalculations(12);

export const DEFAULT_ROK_LIPIT_SEARAH_INSTRUCTIONS = `**1. Ketetapan Rumus & Kampuh Resleting**
• **Jarak Lipit** = Lingkar Pinggang ÷ Jumlah Lipit
• **Dalam Lipit** = (Lebar Kain Total − 6 cm − Lingkar Pinggang) ÷ Jumlah Lipit
• **Kampuh Resleting** = 3 cm kanan + 3 cm kiri = 6 cm (telah diperhitungkan dalam rumus Dalam Lipit).

**2. Langkah Pembuatan Pola Rok Lipit Searah**
• **Panjang Rok (A – A')**: Buat garis vertikal sesuai panjang rok yang diinginkan.
• **Setengah Dalam Lipit (A – B)**: Ukur mendatar **A – B = ½ Dalam Lipit** di awal garis pinggang agar lipit pertama terletak tepat di tengah muka.
• **Lipit Pertama**: 
  - **B – C = Jarak Lipit** (lebar muka lipit ke-1).
  - **C – D = Dalam Lipit** (kedalaman lipatan lipit ke-1).
• **Lipit Berikutnya**: 
  - Lanjutkan pola secara bergantian: **Jarak Lipit → Dalam Lipit → Jarak Lipit → Dalam Lipit** sampai seluruh jumlah lipit terpenuhi.
• Tarik garis tegak lurus ke bawah dari setiap titik lipit pada garis pinggang ke garis kelim bawah rok.
• Lipat pola kertas sesuai arah lipit yang diinginkan (searah) sebelum menggunting bagian pinggang untuk mendapatkan bentuk garis pinggang yang pas saat dilipat.`;

export const ROK_LIPIT_SEARAH_CONFIG: CalculatorConfig = {
  id: 'rok-lipit-searah',
  name: 'Pola Rok Lipit Searah',
  systemSubtitle: 'Kalkulator Pola Rok Lipit Searah',
  garmentCategory: 'rok',
  systemId: 'rok-lipit-searah',
  moduleInfo: POLA_ROK_LIPIT_SEARAH_MODULE,
  measurements: POLA_ROK_LIPIT_SEARAH_MEASUREMENTS,
  presets: POLA_ROK_LIPIT_SEARAH_PRESETS,
  calculations: DEFAULT_ROK_LIPIT_SEARAH_CALCULATIONS,
  frontCalculations: DEFAULT_ROK_LIPIT_SEARAH_CALCULATIONS,
  backCalculations: [],
  importantNotes: [
    '½ Dalam Lipit digunakan pada titik awal (A – B) agar lipit terletak tepat di tengah muka.',
    'Kampuh resleting = 3 cm kanan + 3 cm kiri = 6 cm (telah diperhitungkan dalam rumus Dalam Lipit).',
    'Lebar Kain Total adalah lebar kain utuh maupun kain setelah digabung (jika menggunakan 2 helai kain) sebelum dikurangi kampuh jahit atau kampuh resleting.',
  ],
  defaultImages: {
    measurementGuideImage: '/assets/skirt_measurement_guide.jpg',
    patternImage: '',
  },
  defaultPatternDescription: DEFAULT_ROK_LIPIT_SEARAH_INSTRUCTIONS,
  defaultFrontPatternDescription: DEFAULT_ROK_LIPIT_SEARAH_INSTRUCTIONS,
  defaultBackPatternDescription: '',
};
