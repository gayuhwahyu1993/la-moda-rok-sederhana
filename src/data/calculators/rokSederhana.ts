import { 
  CURRENT_PATTERN_MODULE, 
  INITIAL_MEASUREMENTS, 
  SIZE_PRESETS, 
  PATTERN_CALCULATIONS, 
  FRONT_PATTERN_CALCULATIONS, 
  BACK_PATTERN_CALCULATIONS 
} from '../patternData';
import { CalculatorConfig } from './types';

/**
 * POLA 1 — POLA DASAR ROK SISTEM SEDERHANA (LIVE / PRODUCTION)
 * 
 * Identifier: 'rok' (with alias 'rok-sederhana')
 * All formulas, measurements, and behaviors match the production skirt calculator.
 */
export const ROK_SEDERHANA_CONFIG: CalculatorConfig = {
  id: 'rok',
  name: 'Pola Dasar Rok — Sistem Sederhana',
  systemSubtitle: 'Sistem Sederhana',
  moduleInfo: {
    ...CURRENT_PATTERN_MODULE,
    id: 'basic-skirt-sederhana',
    moduleTitle: 'Kalkulator Pola Dasar Rok',
    systemSubtitle: 'Sistem Sederhana',
  },
  measurements: INITIAL_MEASUREMENTS,
  presets: SIZE_PRESETS,
  calculations: PATTERN_CALCULATIONS,
  frontCalculations: FRONT_PATTERN_CALCULATIONS,
  backCalculations: BACK_PATTERN_CALCULATIONS,
  defaultImages: {
    measurementGuideImage: '/assets/skirt_measurement_guide.jpg',
    patternImage: '',
  },
};
