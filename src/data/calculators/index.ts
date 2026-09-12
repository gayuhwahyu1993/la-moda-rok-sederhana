import { CalculatorConfig } from './types';
import { ROK_SEDERHANA_CONFIG } from './rokSederhana';
import { ROK_DRESSMAKING_CONFIG } from './rokDressmaking';
import { ROK_INDONESIA_CONFIG } from './rokIndonesia';
import { ROK_LINGKARAN_CONFIG } from './rokLingkaran';
import { BADAN_SEDERHANA_CONFIG } from './badanSederhana';
import { BADAN_DRESSMAKING_CONFIG } from './badanDressmaking';
import { BADAN_INDONESIA_CONFIG } from './badanIndonesia';
import { POLA_LENGAN_CONFIG } from './polaLengan';
import { POLA_CELANA_PIYAMA_CONFIG } from './polaCelanaPiyama';
import { POLA_ROK_KERUT_BERTINGKAT_CONFIG } from './polaRokKerutBertingkat';
import { ROK_PIAS_GODET_CONFIG } from './rokPiasGodet';
import { ROK_LIPIT_SEARAH_CONFIG } from './rokLipitSearah';
import { POLA_KULOT_CONFIG } from './polaKulot';

export * from './types';
export * from './rokSederhana';
export * from './rokDressmaking';
export * from './rokIndonesia';
export * from './rokLingkaran';
export * from './badanSederhana';
export * from './badanDressmaking';
export * from './badanIndonesia';
export * from './polaLengan';
export * from './polaCelanaPiyama';
export * from './polaRokKerutBertingkat';
export * from './rokPiasGodet';
export * from './rokLipitSearah';
export * from './polaKulot';

export const CALCULATOR_REGISTRY: Record<string, CalculatorConfig> = {
  'rok': ROK_SEDERHANA_CONFIG,
  'rok-sederhana': ROK_SEDERHANA_CONFIG,
  'rok-dressmaking': ROK_DRESSMAKING_CONFIG,
  'rok-indonesia': ROK_INDONESIA_CONFIG,
  'rok-lingkaran': ROK_LINGKARAN_CONFIG,
  'pola-rok-kerut-bertingkat': POLA_ROK_KERUT_BERTINGKAT_CONFIG,
  'rok-kerut-bertingkat': POLA_ROK_KERUT_BERTINGKAT_CONFIG,
  'rok-kerut': POLA_ROK_KERUT_BERTINGKAT_CONFIG,
  'tiered-skirt': POLA_ROK_KERUT_BERTINGKAT_CONFIG,
  'rok-pias-godet': ROK_PIAS_GODET_CONFIG,
  'rok-pias': ROK_PIAS_GODET_CONFIG,
  'pias-godet': ROK_PIAS_GODET_CONFIG,
  'pias': ROK_PIAS_GODET_CONFIG,
  'gored-skirt': ROK_PIAS_GODET_CONFIG,
  'godet': ROK_PIAS_GODET_CONFIG,
  'rok-lipit-searah': ROK_LIPIT_SEARAH_CONFIG,
  'rok-lipit': ROK_LIPIT_SEARAH_CONFIG,
  'lipit-searah': ROK_LIPIT_SEARAH_CONFIG,
  'lipit': ROK_LIPIT_SEARAH_CONFIG,
  'one-way-pleated-skirt': ROK_LIPIT_SEARAH_CONFIG,
  'pleated-skirt': ROK_LIPIT_SEARAH_CONFIG,
  'pola-kulot': POLA_KULOT_CONFIG,
  'kulot': POLA_KULOT_CONFIG,
  'culottes': POLA_KULOT_CONFIG,
  'culotte-pants': POLA_KULOT_CONFIG,
  'badan-sederhana': BADAN_SEDERHANA_CONFIG,
  'basic-bodice-sederhana': BADAN_SEDERHANA_CONFIG,
  'badan': BADAN_SEDERHANA_CONFIG,
  'badan-dressmaking': BADAN_DRESSMAKING_CONFIG,
  'basic-bodice-dressmaking': BADAN_DRESSMAKING_CONFIG,
  'badan-indonesia': BADAN_INDONESIA_CONFIG,
  'basic-bodice-indonesia': BADAN_INDONESIA_CONFIG,
  'pola-lengan': POLA_LENGAN_CONFIG,
  'lengan': POLA_LENGAN_CONFIG,
  'basic-sleeve': POLA_LENGAN_CONFIG,
  'pola-celana-piyama': POLA_CELANA_PIYAMA_CONFIG,
  'celana-piyama': POLA_CELANA_PIYAMA_CONFIG,
  'celana': POLA_CELANA_PIYAMA_CONFIG,
  'pajama-pants': POLA_CELANA_PIYAMA_CONFIG,
};

export const AVAILABLE_CALCULATORS = [
  ROK_SEDERHANA_CONFIG,
  ROK_DRESSMAKING_CONFIG,
  ROK_INDONESIA_CONFIG,
  ROK_LINGKARAN_CONFIG,
  POLA_ROK_KERUT_BERTINGKAT_CONFIG,
  ROK_PIAS_GODET_CONFIG,
  ROK_LIPIT_SEARAH_CONFIG,
  POLA_KULOT_CONFIG,
  BADAN_SEDERHANA_CONFIG,
  BADAN_DRESSMAKING_CONFIG,
  BADAN_INDONESIA_CONFIG,
  POLA_LENGAN_CONFIG,
  POLA_CELANA_PIYAMA_CONFIG,
];

/**
 * Safely get calculator configuration by ID with fallback to Pola 1 (Sistem Sederhana)
 */
export function getCalculatorConfig(id?: string | null): CalculatorConfig {
  if (!id) return ROK_SEDERHANA_CONFIG;
  return CALCULATOR_REGISTRY[id] || ROK_SEDERHANA_CONFIG;
}
