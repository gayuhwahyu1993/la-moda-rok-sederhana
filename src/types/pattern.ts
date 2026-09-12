export interface BodyMeasurement {
  id: string;
  number: number;
  name: string;
  fieldKey: string;
  value: number;
  unit: string;
  description: string;
  svgHighlightId: string;
  category: 'circumference' | 'length' | 'width' | 'height';
  group?: 'primary' | 'additional';
  helperNote?: string;
}

export interface PatternCalculationItem {
  id: string;
  sequence: number;
  points: string; // e.g. "A – B", "A – C", "A – D", "A – A’", "C – C’", "D – D’", "D’", "B – E", "E → kanan", "E → bawah"
  patternSide: 'front' | 'back';
  pointIdentifier: string; // e.g. "A-B", "A-A'", "D'", "E-right"
  nameKey: string;
  type: 'value' | 'action'; // 'value' has cm result, 'action' is like "naik 1 cm"
  actionType?: 'raise1cm' | 'right3cm' | 'down12cm';
  calculate?: (m: Record<string, number>) => number;
  fixedValue?: number;
  formulaDisplay: string;
  formulaExplanation?: string;
  referencedMeasurementNumbers: number[];
  referencedMeasurementNames: string[];
  patternPoints: string[];
  lineIdentifier?: string;
  notes?: string;
}

// Backwards compatibility alias
export type PatternCalculation = PatternCalculationItem;

export interface SizePreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  values: Record<string, number>;
}

export interface PatternModuleInfo {
  id?: string;
  studioName?: string;
  appTitle?: string;
  moduleTitle?: string;
  systemSubtitle?: string;
}

export interface ClientInfo {
  clientName: string;
  phoneNumber: string;
  projectName: string;
  date: string;
}

export interface SavedProject {
  id: string;
  clientInfo: ClientInfo;
  moduleInfo: PatternModuleInfo;
  measurements: BodyMeasurement[];
  selectedPresetId: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorksheetPrintOptions {
  includeMeasurements: boolean;
  includeCalculations: boolean;
  includePatternImage: boolean;
  includePatternDescription?: boolean; // backwards compatibility alias
  includeFrontPatternDescription: boolean;
  includeBackPatternDescription: boolean;
  includeFormulaCalculations: boolean;
  includeBackPatternImage?: boolean;
  includeFrontPatternImage?: boolean;
  includeSideDartImage?: boolean;
}

export const DEFAULT_PRINT_OPTIONS: WorksheetPrintOptions = {
  includeMeasurements: true,
  includeCalculations: true,
  includePatternImage: true,
  includePatternDescription: true,
  includeFrontPatternDescription: true,
  includeBackPatternDescription: true,
  includeFormulaCalculations: false,
  includeBackPatternImage: true,
  includeFrontPatternImage: true,
  includeSideDartImage: true,
};

