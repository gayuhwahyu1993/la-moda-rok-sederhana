export type Language = 'id' | 'en';

export interface Translations {
  // Brand & Application Info
  studioName: string;
  appTitle: string;
  patternCalculator: string;
  moduleTitle: string;
  systemSubtitle: string;
  headerSubtitle: string;
  patternWorksheetBadge: string;

  // Pattern Modules Support
  modules: {
    'basic-skirt': { title: string; subtitle: string };
    'basic-bodice': { title: string; subtitle: string };
    'basic-sleeve': { title: string; subtitle: string };
    [key: string]: { title: string; subtitle: string } | undefined;
  };

  // Header & Presets
  presetLabel: string;
  resetBtn: string;
  resetTitle: string;
  previewWorksheet: string;
  printWorksheet: string;
  printWorksheetA4: string;
  printHeaderTitle: string;
  previewHeaderTitle: string;

  // Client Info Section
  clientDataTitle: string;
  clientDataSubtitle: string;
  clientNameLabel: string;
  clientNamePlaceholder: string;
  phoneNumberLabel: string;
  phoneNumberPlaceholder: string;
  dateLabel: string;
  datePlaceholder: string;

  // Intro Banner
  workflowPrinciple: string;
  bannerTitle: string;
  bannerDescription: string;
  stepMeasurementNo: string;
  stepBodyMeasurement: string;
  stepPatternFormula: string;
  stepPatternPoints: string;

  // Stages
  stage1Badge: string;
  stage1Title: string;
  stage2Badge: string;
  stage2Title: string;

  // Stage 1: Body Measurements
  measurementsTitle: string;
  measurementsSubtitle: string;
  measurementsCountSuffix: string;
  measurementHint: string;
  measurementNote: string;
  unitCm: string;
  unitLabel: string;
  numberOnIllustrationTitle: string;
  primaryMeasurementsTitle?: string;
  additionalMeasurementsTitle?: string;
  additionalMeasurementsSubtitle?: string;
  controlMeasurementHelper?: string;
  pajamaMeasurementPrinciple?: string;

  // Measurement Items (by fieldKey)
  measurements: {
    lingkarPinggang: { name: string; description: string };
    tinggiPanggul: { name: string; description: string };
    lingkarPanggul: { name: string; description: string };
    panjangRok: { name: string; description: string };
    lingkarBadan?: { name: string; description: string };
    panjangPunggung?: { name: string; description: string };
    panjangSisi?: { name: string; description: string };
    lingkarLeher?: { name: string; description: string };
    panjangBahu?: { name: string; description: string };
    lebarMuka?: { name: string; description: string };
    tinggiDada?: { name: string; description: string };
    jarakDada?: { name: string; description: string };
    lebarPunggung?: { name: string; description: string };
    [key: string]: { name: string; description: string } | undefined;
  };

  // Presets
  presets: {
    'size-s': { name: string; description: string };
    'size-m': { name: string; description: string };
    'size-l': { name: string; description: string };
    'size-xl': { name: string; description: string };
  };

  // Stage 2: Pattern Calculations
  calculationsTitle: string;
  calculationsSubtitle: string;
  polaDepan: string;
  polaBelakang: string;
  naik: string;
  kanan: string;
  bawah: string;
  lebarKupnat: string;
  panjangKupnat: string;
  raise1cm: string;
  right3cm: string;
  down12cm: string;
  formulaDetailsBtn: string;
  simplifyBtn: string;
  learnFormulas: string;
  hideFormulas: string;
  formulaExplanationTitle: string;
  formulaToggleTitle: string;
  formulaLabel: string;
  refersToNumber: string;
  calculationsHint: string;
  measuringPointsSuffix: string;
  frontBackDifferenceNote: string;

  // Calculation Names & Items
  calculationItems: {
    front_ab: string;
    front_ac: string;
    front_ad: string;
    front_aa_prime: string;
    front_cc_prime: string;
    front_dd_prime: string;
    front_d_prime_action: string;
    front_be: string;
    front_e_right: string;
    front_e_down: string;
    back_ab: string;
    back_ac: string;
    back_ad: string;
    back_aa_prime: string;
    back_cc_prime: string;
    back_dd_prime: string;
    back_d_prime_action: string;
    back_be: string;
    back_e_right: string;
    back_e_down: string;
  };

  // Body Illustration
  illustrationTitle: string;
  illustrationSubtitle: string;
  technicalFashionGuide: string;
  measurementGuideTitle: string;
  showMeasurementGuide: string;
  hideMeasurementGuide: string;

  // Technical Diagram
  diagramTitle: string;
  diagramSubtitle: string;
  scale14Construction: string;
  hipLineGuide: string;
  bottomLineGuide: string;
  dartApex: string;
  grainline: string;
  grainlineShort: string;
  cf_cb: string;
  cf: string;
  cb: string;
  fold: string;
  pointLabels: {
    A: string;
    B: string;
    C: string;
    D: string;
    A_prime: string;
    C_prime: string;
    D_prime: string;
    E: string;
  };
  patternPointsLabel: string;
  resetHighlight: string;

  // Print Options Modal & Sections
  printOptionsTitle: string;
  printOptionsSubtitle: string;
  optMeasurements: string;
  optMeasurementsDesc: string;
  optCalculations: string;
  optCalculationsDesc: string;
  optPatternImage: string;
  optPatternImageDesc: string;
  optPatternDescription: string;
  optPatternDescriptionDesc: string;
  optFrontPatternDescription: string;
  optFrontPatternDescriptionDesc: string;
  optBackPatternDescription: string;
  optBackPatternDescriptionDesc: string;
  optFormulaCalculations: string;
  optFormulaCalculationsDesc: string;
  printNowBtn: string;
  previewFirstBtn: string;
  cancelBtn: string;
  printOptionsBadge: string;
  patternDraftingTitle: string;
  frontPatternDraftingTitle: string;
  backPatternDraftingTitle: string;
  frontPatternInstructionsTitle: string;
  backPatternInstructionsTitle: string;
  masterPatternTitle: string;
  masterPatternSubtitle: string;
  formulaCalculationTitle: string;
  formulaCalculationSubtitle: string;

  // Preview Mode
  previewViewTitle: string;
  a4PaperPreviewBadge: string;
  previewViewSubtitle: string;
  backToCalculator: string;
  printWorksheetBtn: string;
  printWorksheetBottomBtn: string;
  paperStandardNote: string;
  printFormatBadge: string;

  // Print Worksheet (PDF)
  worksheetSheetBadge: string;
  scale14Pdf: string;
  printedDatePrefix: string;
  patternPointsPdfHeader: string;
  skirtPatternPdfHeader: string;
  footerStudioNote: string;
  footerDocNote: string;

  // Footer
  learningStandardTitle: string;
  learningStandardDesc: string;
  classInstructionsTitle: string;
  classInstructionsDesc: string;
  exportDocTitle: string;
  exportDocDesc: string;
  copyrightNotice: string;
  fashionEngineeringTag: string;
  digitalWorksheetVersion: string;

  // Toast / Print Feedback
  toastPreparing: string;
  toastSuccess: string;
  toastPreviewNotice: string;
  toastError: string;
}
