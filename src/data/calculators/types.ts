import { BodyMeasurement, PatternCalculationItem, SizePreset, PatternModuleInfo } from '../../types/pattern';

export interface CalculatorConfig {
  id: string;
  name: string;
  systemSubtitle: string;
  garmentCategory?: string;
  systemId?: string;
  moduleInfo: PatternModuleInfo;
  measurements: BodyMeasurement[];
  presets: SizePreset[];
  calculations: PatternCalculationItem[];
  frontCalculations: PatternCalculationItem[];
  backCalculations: PatternCalculationItem[];
  importantNotes?: string[];
  defaultImages: {
    measurementGuideImage: string;
    patternImage: string;
  };
  defaultPatternDescription?: string;
  defaultFrontPatternDescription?: string;
  defaultBackPatternDescription?: string;
  defaultSideDartDescription?: string;
  defaultTier4PatternImage?: string;
  defaultTier4PatternDescription?: string;
}
