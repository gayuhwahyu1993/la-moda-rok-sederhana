/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { ApplicationHeader } from './components/ApplicationHeader';
import { ClientInfoSection } from './components/ClientInfoSection';
import { WorksheetIntroBanner } from './components/WorksheetIntroBanner';
import { BodyMeasurementSection } from './components/BodyMeasurementSection';
import { PatternCalculationSection } from './components/PatternCalculationSection';
import { PatternFormulaExplanationSection } from './components/PatternFormulaExplanationSection';
import { BodyMeasurementIllustration } from './components/BodyMeasurementIllustration';
import { PatternTechnicalDiagram } from './components/PatternTechnicalDiagram';
import { WorksheetFooter } from './components/WorksheetFooter';
import { PrintWorksheet } from './components/PrintWorksheet';
import { WorksheetPreviewView } from './components/WorksheetPreviewView';
import { AdminImageManager } from './components/AdminImageManager';
import { PrintOptionsModal } from './components/PrintOptionsModal';
import { getCalculatorConfig, CALCULATOR_REGISTRY } from './data/calculators';
import { FULL_CIRCLE_CALCULATIONS, HALF_CIRCLE_CALCULATIONS } from './data/calculators/rokLingkaran';
import { getTieredSkirtCalculations } from './data/calculators/polaRokKerutBertingkat';
import { getRokPiasGodetCalculations } from './data/calculators/rokPiasGodet';
import { getRokLipitSearahCalculations } from './data/calculators/rokLipitSearah';
import { getKulotCalculations } from './data/calculators/polaKulot';
import { BodyMeasurement, ClientInfo, WorksheetPrintOptions, DEFAULT_PRINT_OPTIONS } from './types/pattern';
import { CheckCircle2, AlertCircle, Printer, X, Info, Plus, Minus } from 'lucide-react';
import { LanguageProvider, useLanguage } from './i18n';
import { 
  CalculatorImageConfig, 
  getCalculatorImages, 
  subscribeCalculatorImages 
} from './services/firebase';

function getInitialCalculatorId(): string {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname.replace(/^\/+/, '').toLowerCase();
    if (path === 'pola-kulot' || path === 'kulot' || path === 'culottes' || path === 'culotte-pants') return 'pola-kulot';
    if (path === 'rok-lipit-searah' || path === 'rok-lipit' || path === 'lipit-searah' || path === 'lipit') return 'rok-lipit-searah';
    if (path === 'rok-pias-godet' || path === 'pias-godet' || path === 'rok-pias' || path === 'pias' || path === 'godet') return 'rok-pias-godet';
    if (path === 'pola-rok-kerut-bertingkat' || path === 'rok-kerut-bertingkat' || path === 'rok-kerut' || path === 'tiered-skirt') return 'pola-rok-kerut-bertingkat';
    if (path === 'pola-celana-piyama' || path === 'celana-piyama' || path === 'celana' || path === 'pajama-pants') return 'pola-celana-piyama';
    if (path === 'pola-lengan' || path === 'lengan' || path === 'basic-sleeve') return 'pola-lengan';
    if (path === 'badan-sederhana' || path === 'basic-bodice-sederhana') return 'badan-sederhana';
    if (path === 'badan-dressmaking' || path === 'basic-bodice-dressmaking' || path === 'badan') return 'badan-dressmaking';
    if (path === 'badan-indonesia' || path === 'basic-bodice-indonesia') return 'badan-indonesia';
    if (path === 'rok-lingkaran' || path === 'lingkaran') return 'rok-lingkaran';
    if (path === 'rok-indonesia' || path === 'indonesia') return 'rok-indonesia';
    if (path === 'rok-dressmaking' || path === 'dressmaking') return 'rok-dressmaking';
    if (path === 'rok-sederhana' || path === 'rok') return 'rok';

    const params = new URLSearchParams(window.location.search);
    const calcParam = params.get('calculator') || params.get('calc') || params.get('system');
    if (calcParam) {
      if (calcParam.includes('lipit')) return 'rok-lipit-searah';
      if (calcParam.includes('pias') || calcParam.includes('godet')) return 'rok-pias-godet';
      if (calcParam.includes('kerut') || calcParam.includes('bertingkat') || calcParam.includes('tiered')) return 'pola-rok-kerut-bertingkat';
      if (calcParam.includes('celana') || calcParam.includes('piyama') || calcParam.includes('pajama')) return 'pola-celana-piyama';
      if (calcParam.includes('lengan') || calcParam.includes('sleeve')) return 'pola-lengan';
      if (calcParam.includes('lingkaran')) return 'rok-lingkaran';
      if (calcParam.includes('sederhana') && calcParam.includes('badan')) return 'badan-sederhana';
      if (calcParam.includes('dressmaking') && calcParam.includes('badan')) return 'badan-dressmaking';
      if (calcParam.includes('indonesia') && calcParam.includes('badan')) return 'badan-indonesia';
      if (calcParam.includes('badan')) return 'badan-dressmaking';
      if (calcParam.includes('lingkaran')) return 'rok-lingkaran';
      if (calcParam.includes('indonesia')) return 'rok-indonesia';
      if (calcParam.includes('dressmaking')) return 'rok-dressmaking';
      if (calcParam.includes('sederhana') || calcParam === 'rok') return 'rok';
    }

    const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
    if (hash === 'rok-lipit-searah' || hash === 'rok-lipit' || hash === 'lipit-searah' || hash === 'lipit') return 'rok-lipit-searah';
    if (hash === 'rok-pias-godet' || hash === 'pias-godet' || hash === 'rok-pias' || hash === 'pias' || hash === 'godet') return 'rok-pias-godet';
    if (hash === 'pola-rok-kerut-bertingkat' || hash === 'rok-kerut-bertingkat' || hash === 'rok-kerut' || hash === 'tiered-skirt') return 'pola-rok-kerut-bertingkat';
    if (hash === 'pola-celana-piyama' || hash === 'celana-piyama' || hash === 'celana' || hash === 'pajama-pants') return 'pola-celana-piyama';
    if (hash === 'pola-lengan' || hash === 'lengan' || hash === 'basic-sleeve') return 'pola-lengan';
    if (hash === 'badan-sederhana' || hash === 'basic-bodice-sederhana') return 'badan-sederhana';
    if (hash === 'badan-dressmaking' || hash === 'basic-bodice-dressmaking' || hash === 'badan') return 'badan-dressmaking';
    if (hash === 'badan-indonesia' || hash === 'basic-bodice-indonesia') return 'badan-indonesia';
    if (hash === 'rok-lingkaran' || hash === 'lingkaran') return 'rok-lingkaran';
    if (hash === 'rok-indonesia' || hash === 'indonesia') return 'rok-indonesia';
    if (hash === 'rok-dressmaking' || hash === 'dressmaking') return 'rok-dressmaking';
    if (hash === 'rok-sederhana' || hash === 'rok') return 'rok';
  }
  return 'badan-dressmaking';
}

function AppContent() {
  const { t, language } = useLanguage();

  // Active Calculator System state (default: 'rok' / Sistem Sederhana)
  const [activeCalculatorId, setActiveCalculatorId] = useState<string>(getInitialCalculatorId);

  // Active configuration resolved from registry
  const activeConfig = useMemo(() => {
    return getCalculatorConfig(activeCalculatorId);
  }, [activeCalculatorId]);

  // Admin Image Manager View Toggle state
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  // Live Firebase-managed images for current calculator
  const [calculatorImages, setCalculatorImages] = useState<CalculatorImageConfig | null>(null);

  // Client information state (clean start without pre-filled values to show placeholders)
  const [clientInfo, setClientInfo] = useState<ClientInfo>({
    clientName: '',
    phoneNumber: '',
    projectName: 'Pola Dasar Rok',
    date: '',
  });

  // State for body measurements & sizing presets (pre-populated with active calculator standard values)
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>(() => activeConfig.measurements);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('size-m');

  // Model selector for Rok Lingkaran & Setengah Lingkaran ('full' = Lingkaran Penuh, 'half' = Setengah Lingkaran)
  const [circleSkirtModel, setCircleSkirtModel] = useState<'full' | 'half'>('full');

  // Skirt Tier count for Pola Rok Kerut Bertingkat (2 to 6, default 3)
  const [tierCount, setTierCount] = useState<number>(3);

  // Panel count for Rok Pias & Godet (even numbers, default 6)
  const [panelCount, setPanelCount] = useState<number>(6);

  // A-C Crotch Depth Calculation Method for Pola Kulot ('tinggi-duduk' = Tinggi Duduk direct, 'tinggi-panggul-range' = Tinggi Panggul + 7-8 cm)
  const [kulotAcMethod, setKulotAcMethod] = useState<'tinggi-duduk' | 'tinggi-panggul-range'>('tinggi-duduk');

  // Jarak Q–R manual measurement on pattern for Pola Dasar Badan Sistem Indonesia (S–T line)
  const [badanIndonesiaJarakQR, setBadanIndonesiaJarakQR] = useState<number | ''>('');

  // Preview Worksheet Mode state
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);

  // Print Options Modal state
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);

  // Worksheet Print Options state
  const [printOptions, setPrintOptions] = useState<WorksheetPrintOptions>(DEFAULT_PRINT_OPTIONS);

  // Interactive link states for highlight sync between controls and diagrams
  const [activeMeasurementNumber, setActiveMeasurementNumber] = useState<number | null>(null);
  const [activeCalculationId, setActiveCalculationId] = useState<string | null>(null);

  // Collapsible Measurement Guide Toggle state (Closed by default for clean compact UI)
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  // Print feedback toast state
  const [printFeedback, setPrintFeedback] = useState<{
    status: 'preparing' | 'success' | 'error' | 'preview-notice';
    message: string;
  } | null>(null);

  // Synchronize URL popstate (Back / Forward navigation)
  useEffect(() => {
    const handlePopState = () => {
      const newId = getInitialCalculatorId();
      setActiveCalculatorId(newId);
    };
    window.addEventListener('popstate', handlePopState);

    // Ensure URL reflects active calculator
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname.replace(/^\/+/, '');
      if (!currentPath && activeCalculatorId === 'badan-dressmaking') {
        window.history.replaceState({ calculatorId: 'badan-dressmaking' }, '', '/badan-dressmaking');
      }
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, [activeCalculatorId]);

  // Handle switching calculator system
  const handleSelectCalculator = useCallback((calcId: string) => {
    const normalizedId = calcId === 'rok-sederhana' ? 'rok' : calcId;
    setActiveCalculatorId(normalizedId);
    
    // Preserve student entered measurements when switching systems
    const newConfig = getCalculatorConfig(normalizedId);
    setMeasurements((prevMeasurements) => {
      const prevMap: Record<string, number> = {};
      prevMeasurements.forEach(m => { prevMap[m.fieldKey] = m.value; });
      return newConfig.measurements.map(m => ({
        ...m,
        value: prevMap[m.fieldKey] !== undefined ? prevMap[m.fieldKey] : m.value,
      }));
    });
    setActiveCalculationId(null);
    setActiveMeasurementNumber(null);
    setIsGuideOpen(false);

    // Update browser URL
    if (typeof window !== 'undefined') {
      const targetPath = normalizedId === 'rok' ? '/' : `/${normalizedId}`;
      window.history.pushState({ calculatorId: normalizedId }, '', targetPath);
    }
  }, []);

  // Subscribe to real-time image updates from Firebase Firestore for the active calculator
  useEffect(() => {
    // Initial fetch
    getCalculatorImages(activeConfig.id).then((data) => {
      setCalculatorImages(data);
    });

    // Real-time listener: student calculator auto-updates when admin saves new images!
    const unsubscribe = subscribeCalculatorImages(activeConfig.id, (updated) => {
      setCalculatorImages(updated);
    });

    return () => unsubscribe();
  }, [activeConfig.id]);

  // Quick key-value lookup map for formulas
  const measurementsMap = useMemo(() => {
    const map: Record<string, number> = {};
    measurements.forEach((m) => {
      map[m.fieldKey] = m.value;
    });
    if (activeCalculatorId === 'badan-indonesia' && typeof badanIndonesiaJarakQR === 'number' && !isNaN(badanIndonesiaJarakQR)) {
      map.jarakQR = badanIndonesiaJarakQR;
    }
    return map;
  }, [measurements, activeCalculatorId, badanIndonesiaJarakQR]);

  // Dynamically resolve active calculations for single or dual model systems
  const activeCalculations = useMemo(() => {
    if (activeCalculatorId === 'rok-lingkaran') {
      return circleSkirtModel === 'full' ? FULL_CIRCLE_CALCULATIONS : HALF_CIRCLE_CALCULATIONS;
    }
    if (
      activeCalculatorId === 'pola-rok-kerut-bertingkat' ||
      activeCalculatorId === 'rok-kerut-bertingkat' ||
      activeCalculatorId === 'rok-kerut' ||
      activeCalculatorId === 'tiered-skirt'
    ) {
      return getTieredSkirtCalculations(tierCount);
    }
    if (
      activeCalculatorId === 'rok-pias-godet' ||
      activeCalculatorId === 'pias-godet' ||
      activeCalculatorId === 'rok-pias' ||
      activeCalculatorId === 'pias' ||
      activeCalculatorId === 'godet'
    ) {
      return getRokPiasGodetCalculations(panelCount);
    }
    if (
      activeCalculatorId === 'rok-lipit-searah' ||
      activeCalculatorId === 'rok-lipit' ||
      activeCalculatorId === 'lipit-searah' ||
      activeCalculatorId === 'lipit'
    ) {
      const pleatCount = measurementsMap.jumlahLipit ?? 12;
      return getRokLipitSearahCalculations(pleatCount);
    }
    if (
      activeCalculatorId === 'pola-kulot' ||
      activeCalculatorId === 'kulot' ||
      activeCalculatorId === 'culottes' ||
      activeCalculatorId === 'culotte-pants'
    ) {
      return getKulotCalculations(kulotAcMethod);
    }
    return activeConfig.calculations;
  }, [activeCalculatorId, circleSkirtModel, tierCount, panelCount, measurementsMap, kulotAcMethod, activeConfig]);

  // Dynamically resolve pattern image for student screen & printing
  const activePatternImage = useMemo(() => {
    if (activeCalculatorId === 'rok-lingkaran') {
      return circleSkirtModel === 'full'
        ? (calculatorImages?.dressmakingFrontPatternImage || calculatorImages?.patternImage || calculatorImages?.fullCirclePatternImage || '')
        : (calculatorImages?.dressmakingBackPatternImage || calculatorImages?.halfCirclePatternImage || '');
    }
    if (
      activeCalculatorId === 'pola-rok-kerut-bertingkat' ||
      activeCalculatorId === 'rok-kerut-bertingkat' ||
      activeCalculatorId === 'rok-kerut' ||
      activeCalculatorId === 'tiered-skirt'
    ) {
      if (tierCount >= 4) {
        return calculatorImages?.tier4PatternImage || '';
      }
      return calculatorImages?.patternImage || '';
    }
    return calculatorImages?.patternImage;
  }, [activeCalculatorId, circleSkirtModel, tierCount, calculatorImages]);

  // Dynamically resolve pattern description instructions based on active language
  const activePatternDescription = useMemo(() => {
    const isEn = language === 'en';
    if (activeCalculatorId === 'rok-lingkaran') {
      if (isEn) {
        return circleSkirtModel === 'full'
          ? (calculatorImages?.frontPatternDescription_en || '')
          : (calculatorImages?.backPatternDescription_en || '');
      }
      return circleSkirtModel === 'full'
        ? (calculatorImages?.frontPatternDescription || calculatorImages?.fullCircleInstructions || activeConfig.defaultFrontPatternDescription || '')
        : (calculatorImages?.backPatternDescription || calculatorImages?.halfCircleInstructions || activeConfig.defaultBackPatternDescription || '');
    }
    if (
      activeCalculatorId === 'pola-rok-kerut-bertingkat' ||
      activeCalculatorId === 'rok-kerut-bertingkat' ||
      activeCalculatorId === 'rok-kerut' ||
      activeCalculatorId === 'tiered-skirt'
    ) {
      if (tierCount >= 4) {
        return isEn
          ? (calculatorImages?.tier4PatternDescription_en || '')
          : (calculatorImages?.tier4PatternDescription || activeConfig.defaultTier4PatternDescription || '');
      }
      return isEn
        ? (calculatorImages?.frontPatternDescription_en || calculatorImages?.patternDescription_en || '')
        : (calculatorImages?.frontPatternDescription ||
            calculatorImages?.patternDescription ||
            activeConfig.defaultPatternDescription ||
            activeConfig.defaultFrontPatternDescription ||
            '');
    }
    if (
      activeCalculatorId === 'rok-lipit-searah' ||
      activeCalculatorId === 'rok-lipit' ||
      activeCalculatorId === 'lipit-searah' ||
      activeCalculatorId === 'lipit'
    ) {
      if (isEn) {
        return (
          calculatorImages?.frontPatternDescription_en ||
          calculatorImages?.patternDescription_en ||
          ''
        );
      }
      return (
        calculatorImages?.frontPatternDescription ||
        calculatorImages?.patternDescription ||
        activeConfig.defaultPatternDescription ||
        activeConfig.defaultFrontPatternDescription ||
        ''
      );
    }
    if (isEn) {
      return calculatorImages?.patternDescription_en || '';
    }
    return calculatorImages?.patternDescription || activeConfig.defaultPatternDescription || '';
  }, [activeCalculatorId, circleSkirtModel, tierCount, calculatorImages, activeConfig, language]);

  const activeFrontPatternDescription = useMemo(() => {
    const isEn = language === 'en';
    if (
      activeCalculatorId === 'pola-rok-kerut-bertingkat' ||
      activeCalculatorId === 'rok-kerut-bertingkat' ||
      activeCalculatorId === 'rok-kerut' ||
      activeCalculatorId === 'tiered-skirt'
    ) {
      if (tierCount >= 4) {
        return isEn
          ? (calculatorImages?.tier4PatternDescription_en || '')
          : (calculatorImages?.tier4PatternDescription || activeConfig.defaultTier4PatternDescription || '');
      }
      return isEn
        ? (calculatorImages?.frontPatternDescription_en || calculatorImages?.patternDescription_en || '')
        : (calculatorImages?.frontPatternDescription || calculatorImages?.patternDescription || activeConfig.defaultFrontPatternDescription || '');
    }
    if (
      activeCalculatorId === 'rok-lipit-searah' ||
      activeCalculatorId === 'rok-lipit' ||
      activeCalculatorId === 'lipit-searah' ||
      activeCalculatorId === 'lipit' ||
      activeCalculatorId === 'pola-celana-piyama' ||
      activeCalculatorId === 'celana-piyama' ||
      activeCalculatorId === 'celana' ||
      activeCalculatorId === 'pajama-pants'
    ) {
      if (isEn) {
        return (
          calculatorImages?.frontPatternDescription_en ||
          calculatorImages?.patternDescription_en ||
          ''
        );
      }
      return (
        calculatorImages?.frontPatternDescription ||
        calculatorImages?.patternDescription ||
        activeConfig.defaultFrontPatternDescription ||
        activeConfig.defaultPatternDescription ||
        ''
      );
    }
    return isEn
      ? (calculatorImages?.frontPatternDescription_en || '')
      : (calculatorImages?.frontPatternDescription || activeConfig.defaultFrontPatternDescription || '');
  }, [activeCalculatorId, tierCount, calculatorImages, activeConfig, language]);

  const activeBackPatternDescription = useMemo(() => {
    const isEn = language === 'en';
    if (
      activeCalculatorId === 'rok-lipit-searah' ||
      activeCalculatorId === 'rok-lipit' ||
      activeCalculatorId === 'lipit-searah' ||
      activeCalculatorId === 'lipit' ||
      activeCalculatorId === 'pola-celana-piyama' ||
      activeCalculatorId === 'celana-piyama' ||
      activeCalculatorId === 'celana' ||
      activeCalculatorId === 'pajama-pants'
    ) {
      return '';
    }
    return isEn
      ? (calculatorImages?.backPatternDescription_en || '')
      : (calculatorImages?.backPatternDescription || activeConfig.defaultBackPatternDescription || '');
  }, [activeCalculatorId, calculatorImages, activeConfig, language]);

  const activeSideDartDescription = useMemo(() => {
    const isEn = language === 'en';
    return isEn
      ? (calculatorImages?.sideDartDescription_en || calculatorImages?.kupnatDescription_en || '')
      : (calculatorImages?.sideDartDescription || calculatorImages?.kupnatDescription || activeConfig.defaultSideDartDescription || '');
  }, [calculatorImages, activeConfig, language]);

  // Update browser document title immediately when language, module, or calculator changes
  useEffect(() => {
    const moduleId = activeConfig.moduleInfo.id || 'basic-skirt';
    const localizedModule = t.modules?.[moduleId];
    const displayTitle = localizedModule?.title || activeConfig.moduleInfo.moduleTitle || activeConfig.name || t.moduleTitle;
    const displaySubtitle = localizedModule?.subtitle || activeConfig.systemSubtitle || activeConfig.moduleInfo.systemSubtitle || '';
    const displayStudio = activeConfig.moduleInfo.studioName || t.studioName;
    document.title = `${displayTitle} ${displaySubtitle ? `— ${displaySubtitle}` : ''} | ${displayStudio}`;
  }, [t, activeConfig]);

  // Handle client info input changes
  const handleChangeClientInfo = (field: keyof ClientInfo, value: string) => {
    setClientInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle value change for a measurement field
  const handleMeasurementChange = (fieldKey: string, newValue: number) => {
    setMeasurements((prev) =>
      prev.map((item) => (item.fieldKey === fieldKey ? { ...item, value: newValue } : item))
    );
    setSelectedPresetId('custom');
  };

  // Handle selecting a standard size preset
  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const preset = activeConfig.presets.find((p) => p.id === presetId);
    if (preset) {
      setMeasurements((prev) =>
        prev.map((item) => ({
          ...item,
          value: preset.values[item.fieldKey] ?? item.value,
        }))
      );
    }
  };

  // Reset measurements & client info to default
  const handleReset = () => {
    handleSelectPreset('size-m');
    setBadanIndonesiaJarakQR('');
    setClientInfo({
      clientName: '',
      phoneNumber: '',
      projectName: activeConfig.name,
      date: '',
    });
    setActiveMeasurementNumber(null);
    setActiveCalculationId(null);
    setPrintFeedback(null);
  };

  // Trigger browser print dialog for A4 worksheet with feedback
  const handlePrint = () => {
    console.info(`[La Moda Pattern Calculator] Executing Cetak Worksheet handler for ${activeConfig.name}...`);
    console.info('Client Data:', clientInfo);
    console.info('Body Measurements:', measurements);
    console.info('Calculations:', activeConfig.calculations.map((c) => ({
      points: c.points,
      value: c.calculate ? c.calculate(measurementsMap) : c.fixedValue ?? 0,
    })));

    setPrintFeedback({
      status: 'preparing',
      message: t.toastPreparing,
    });

    try {
      const originalTitle = document.title;
      
      const rawClientName = clientInfo.clientName.trim();
      const safeClientName = rawClientName
        ? rawClientName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '')
        : 'La_Moda';

      const moduleId = activeConfig.moduleInfo.id || 'basic-skirt';
      const localizedModule = t.modules?.[moduleId];
      const activeModuleTitle = localizedModule?.title || activeConfig.moduleInfo.moduleTitle || activeConfig.name;

      const cleanModuleName = activeModuleTitle
        .replace(/^(Kalkulator|Basic)\s+/i, '')
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9_-]/g, '');

      const pdfFileName = `${safeClientName}_${cleanModuleName}`;
      document.title = pdfFileName;

      const handleAfterPrint = () => {
        document.title = originalTitle;
        window.removeEventListener('afterprint', handleAfterPrint);
      };
      window.addEventListener('afterprint', handleAfterPrint);

      window.focus();

      setTimeout(() => {
        if (typeof window.print === 'function') {
          try {
            window.print();
            setPrintFeedback({
              status: 'success',
              message: t.toastSuccess,
            });
          } catch (printErr) {
            console.warn('[Print Warning] window.print restricted in frame:', printErr);
            setPrintFeedback({
              status: 'preview-notice',
              message: t.toastPreviewNotice,
            });
          }
        } else {
          setPrintFeedback({
            status: 'preview-notice',
            message: t.toastPreviewNotice,
          });
        }
      }, 100);

      setTimeout(() => {
        document.title = originalTitle;
      }, 3000);

    } catch (error) {
      console.error('Worksheet print failed:', error);
      setPrintFeedback({
        status: 'error',
        message: t.toastError,
      });
    }
  };

  // Handle clicking calculation card
  const handleSelectCalculation = (calcId: string | null) => {
    setActiveCalculationId(calcId);
    if (calcId) {
      const calc = activeConfig.calculations.find((c) => c.id === calcId);
      if (calc && calc.referencedMeasurementNumbers.length > 0) {
        setActiveMeasurementNumber(calc.referencedMeasurementNumbers[0]);
      }
    } else {
      setActiveMeasurementNumber(null);
    }
  };

  // IF ADMIN IMAGE MANAGER MODE IS ACTIVE
  if (isAdminOpen) {
    return (
      <AdminImageManager
        onBackToStudentCalculator={() => setIsAdminOpen(false)}
      />
    );
  }

  // IF PREVIEW MODE IS ACTIVE
  if (isPreviewOpen) {
    return (
      <div className="min-h-screen bg-[#F3E7E7] text-[#332C29]">
        {/* Printable target for background Ctrl+P / window.print() */}
        <div className="hidden print:block">
          <PrintWorksheet
            moduleInfo={activeConfig.moduleInfo}
            clientInfo={clientInfo}
            measurements={measurements}
            calculations={activeCalculations}
            measurementsMap={measurementsMap}
            patternImage={activePatternImage}
            dressmakingBackPatternImage={calculatorImages?.dressmakingBackPatternImage}
            dressmakingFrontPatternImage={calculatorImages?.dressmakingFrontPatternImage}
            dressmakingSideDartImage={calculatorImages?.dressmakingSideDartImage || calculatorImages?.sideDartDetailImage}
            patternDescription={activePatternDescription}
            frontPatternDescription={activeFrontPatternDescription}
            backPatternDescription={activeBackPatternDescription}
            circleSkirtModel={circleSkirtModel}
            tierCount={tierCount}
            panelCount={panelCount}
            printOptions={printOptions}
            isPreview={false}
          />
        </div>

        {/* Visual A4 Paper Preview Component (Screen only) */}
        <div className="print:hidden">
          <WorksheetPreviewView
            moduleInfo={activeConfig.moduleInfo}
            clientInfo={clientInfo}
            measurements={measurements}
            calculations={activeCalculations}
            measurementsMap={measurementsMap}
            patternImage={activePatternImage}
            dressmakingBackPatternImage={calculatorImages?.dressmakingBackPatternImage}
            dressmakingFrontPatternImage={calculatorImages?.dressmakingFrontPatternImage}
            dressmakingSideDartImage={calculatorImages?.dressmakingSideDartImage || calculatorImages?.sideDartDetailImage}
            patternDescription={activePatternDescription}
            frontPatternDescription={activeFrontPatternDescription}
            backPatternDescription={activeBackPatternDescription}
            circleSkirtModel={circleSkirtModel}
            tierCount={tierCount}
            panelCount={panelCount}
            printOptions={printOptions}
            onChangePrintOptions={setPrintOptions}
            onClose={() => setIsPreviewOpen(false)}
            onPrint={handlePrint}
          />
        </div>
      </div>
    );
  }

  // STANDARD CALCULATOR VIEW
  return (
    <div className="min-h-screen bg-[#F3E7E7] text-[#332C29] flex flex-col selection:bg-[#E8DED8]">
      
      {/* ======================================================== */}
      {/* SCREEN VIEW (Hidden when printing via print:hidden)      */}
      {/* ======================================================== */}
      <div className="screen-only print:hidden flex flex-col min-h-screen">
        
        {/* Studio Top Navbar with System Switcher */}
        <Header
          presets={activeConfig.presets}
          selectedPresetId={selectedPresetId}
          onSelectPreset={handleSelectPreset}
          onReset={handleReset}
          onPrint={() => setIsPrintModalOpen(true)}
          onPreview={() => setIsPreviewOpen(true)}
          onOpenAdmin={() => setIsAdminOpen(true)}
          activeView="two-column"
          onToggleView={() => {}}
          activeCalculatorId={activeConfig.id}
          onSelectCalculator={handleSelectCalculator}
        />

        {/* Temporary Interactive Feedback Toast (Print Notification) */}
        {printFeedback && (
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4">
            <div 
              className={`rounded-xl p-3.5 flex items-center justify-between text-xs sm:text-sm shadow-xs border transition-all ${
                printFeedback.status === 'preparing'
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : printFeedback.status === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : printFeedback.status === 'preview-notice'
                  ? 'bg-blue-50 border-blue-200 text-blue-900'
                  : 'bg-red-50 border-red-200 text-red-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {printFeedback.status === 'preparing' && (
                  <Printer size={16} className="text-amber-700 animate-pulse shrink-0" />
                )}
                {printFeedback.status === 'success' && (
                  <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
                )}
                {printFeedback.status === 'preview-notice' && (
                  <Info size={16} className="text-blue-700 shrink-0" />
                )}
                {printFeedback.status === 'error' && (
                  <AlertCircle size={16} className="text-red-700 shrink-0" />
                )}
                <span className="font-medium">{printFeedback.message}</span>
              </div>
              <button 
                onClick={() => setPrintFeedback(null)}
                className="text-neutral-500 hover:text-neutral-800 p-1 rounded-lg hover:bg-neutral-200/50 transition-colors ml-3 cursor-pointer shrink-0"
              >
                <X size={15} />
              </button>
            </div>
          </div>
        )}

        {/* Main Worksheet Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
          
          {/* 1. Application Header - Brand → Application → Current Pattern Module */}
          <ApplicationHeader
            moduleInfo={activeConfig.moduleInfo}
          />

          {/* 2. Client Information (Data Klien) */}
          <ClientInfoSection
            clientInfo={clientInfo}
            onChangeClientInfo={handleChangeClientInfo}
          />

          {/* Educational Principle Explainer Banner */}
          <WorksheetIntroBanner activeCalculatorId={activeCalculatorId} />

          {/* ======================================================== */}
          {/* STAGE 1 — BODY MEASUREMENTS (DAFTAR UKURAN)               */}
          {/* Two-Column: LEFT (Measurement List) | RIGHT (Illustration) */}
          {/* ======================================================== */}
          <section id="stage-1-body-measurements" className="space-y-3">
            {/* Stage 1 Identifier Tag */}
            <div className="flex items-center gap-2.5 px-1">
              <span className="px-2.5 py-0.5 rounded-full bg-[#332C29] text-[#FCFAF7] text-[11px] font-mono font-bold tracking-wider uppercase">
                {t.stage1Badge}
              </span>
              <span className="font-serif text-lg font-bold text-[#332C29] tracking-wide">
                {t.stage1Title}
              </span>
            </div>

            {/* Stage 1 Layout: Special Model Selector for Rok Lingkaran vs Standard Bodice/Skirt */}
            {activeCalculatorId === 'rok-lingkaran' ? (
              <div className="space-y-6">
                {isGuideOpen ? (
                  <div className="grid grid-cols-12 gap-2 xs:gap-2.5 sm:gap-4 lg:gap-6 items-start">
                    {/* LEFT COLUMN: Measurement list & input fields */}
                    <div className="col-span-7 xs:col-span-7 sm:col-span-7 md:col-span-6 lg:col-span-6">
                      <BodyMeasurementSection
                        measurements={measurements}
                        onMeasurementChange={handleMeasurementChange}
                        activeMeasurementNumber={activeMeasurementNumber}
                        onHoverMeasurement={setActiveMeasurementNumber}
                        calculatorId={activeConfig.id}
                        isGuideOpen={isGuideOpen}
                        onToggleGuide={() => setIsGuideOpen(false)}
                        hasGuideImage={true}
                      />
                    </div>

                    {/* RIGHT COLUMN: Measurement Guide illustration (Side-by-side with inputs) */}
                    <div className="col-span-5 xs:col-span-5 sm:col-span-5 md:col-span-6 lg:col-span-6 sticky top-2 sm:top-4 self-start">
                      <BodyMeasurementIllustration
                        measurements={measurements}
                        activeMeasurementNumber={activeMeasurementNumber}
                        onSelectMeasurementNumber={setActiveMeasurementNumber}
                        imageUrl={calculatorImages?.measurementGuideImage}
                        calculatorId={activeConfig.id}
                        isGuideOpen={isGuideOpen}
                        onToggleGuide={() => setIsGuideOpen(false)}
                      />
                    </div>
                  </div>
                ) : null}

                <div className={`grid grid-cols-1 ${isGuideOpen ? 'grid-cols-1' : 'md:grid-cols-12'} gap-6 items-start`}>
                  {/* 1. Input Ukuran Badan (only shown here when guide is closed) */}
                  {!isGuideOpen && (
                    <div className="md:col-span-6 xl:col-span-5">
                      <BodyMeasurementSection
                        measurements={measurements}
                        onMeasurementChange={handleMeasurementChange}
                        activeMeasurementNumber={activeMeasurementNumber}
                        onHoverMeasurement={setActiveMeasurementNumber}
                        calculatorId={activeConfig.id}
                        isGuideOpen={false}
                        onToggleGuide={() => setIsGuideOpen(true)}
                        hasGuideImage={true}
                      />
                    </div>
                  )}

                  {/* 2. Pilih Model Rok Lingkaran */}
                  <div className={isGuideOpen ? "w-full space-y-4" : "md:col-span-6 xl:col-span-7 space-y-4"}>
                    <div className="bg-[#FCFAF7] rounded-2xl border border-[#E8DED8] p-5 sm:p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#E8DED8]">
                      <div className="flex items-center gap-2.5">
                        <span className="w-3 h-3 rounded-full bg-[#8F2635]" />
                        <div>
                          <h4 className="font-serif text-sm sm:text-base font-bold text-[#332C29] tracking-wider uppercase">
                            PILIH MODEL ROK LINGKARAN
                          </h4>
                          <p className="text-[11px] text-[#6B5E57] mt-0.5">
                            Pilih jenis potongan rok untuk menghitung jari-jari (R) dan pola potong
                          </p>
                        </div>
                      </div>
                      <span className={`text-[11px] font-mono font-bold px-3 py-1 rounded-full border ${
                        circleSkirtModel === 'full'
                          ? 'text-[#8F2635] bg-[#F3E7E7] border-[#E8DED8]'
                          : 'text-[#1D4ED8] bg-blue-50 border-blue-200'
                      }`}>
                        {circleSkirtModel === 'full' ? 'Lingkaran Penuh (360°)' : 'Setengah Lingkaran (180°)'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                      {/* Full Circle Skirt Card */}
                      <button
                        type="button"
                        onClick={() => setCircleSkirtModel('full')}
                        className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          circleSkirtModel === 'full'
                            ? 'bg-white border-[#8F2635] shadow-md ring-2 ring-[#8F2635]/20'
                            : 'bg-white/60 hover:bg-white border-[#E8DED8]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className={`font-serif text-sm font-bold ${
                              circleSkirtModel === 'full' ? 'text-[#8F2635]' : 'text-[#332C29]'
                            }`}>
                              Rok Lingkaran Penuh
                            </span>
                            <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                              circleSkirtModel === 'full' ? 'border-[#8F2635] bg-[#8F2635]' : 'border-[#DFD4CD]'
                            }`}>
                              {circleSkirtModel === 'full' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </span>
                          </div>
                          <p className="text-xs text-[#6B5E57] mt-2 leading-relaxed">
                            Pola lingkaran 360° dengan jatuhan gelombang bervolume penuh di sekeliling pinggang.
                          </p>
                        </div>
                        <div className="mt-3 pt-2.5 border-t border-[#F3E7E7] flex items-center justify-between">
                          <span className="text-[10px] font-mono text-[#8F2635] font-bold">
                            R = ⅙ Lingkar Pinggang − 0,5 cm
                          </span>
                          <span className="text-[10px] font-mono font-bold text-[#8F2635] bg-[#F3E7E7] px-1.5 py-0.5 rounded">
                            360°
                          </span>
                        </div>
                      </button>

                      {/* Half Circle Skirt Card */}
                      <button
                        type="button"
                        onClick={() => setCircleSkirtModel('half')}
                        className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          circleSkirtModel === 'half'
                            ? 'bg-white border-[#1D4ED8] shadow-md ring-2 ring-[#1D4ED8]/20'
                            : 'bg-white/60 hover:bg-white border-[#E8DED8]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className={`font-serif text-sm font-bold ${
                              circleSkirtModel === 'half' ? 'text-[#1D4ED8]' : 'text-[#332C29]'
                            }`}>
                              Rok Setengah Lingkaran
                            </span>
                            <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                              circleSkirtModel === 'half' ? 'border-[#1D4ED8] bg-[#1D4ED8]' : 'border-[#DFD4CD]'
                            }`}>
                              {circleSkirtModel === 'half' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </span>
                          </div>
                          <p className="text-xs text-[#6B5E57] mt-2 leading-relaxed">
                            Pola setengah lingkaran 180° dengan siluet A-line anggun dan efisien penggunaan kain.
                          </p>
                        </div>
                        <div className="mt-3 pt-2.5 border-t border-blue-50 flex items-center justify-between">
                          <span className="text-[10px] font-mono text-[#1D4ED8] font-bold">
                            R = ⅓ Lingkar Pinggang − 1 cm
                          </span>
                          <span className="text-[10px] font-mono font-bold text-[#1D4ED8] bg-blue-50 px-1.5 py-0.5 rounded">
                            180°
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            ) : (activeCalculatorId === 'pola-rok-kerut-bertingkat' || activeCalculatorId === 'rok-kerut-bertingkat' || activeCalculatorId === 'rok-kerut' || activeCalculatorId === 'tiered-skirt') ? (
              /* Pola Rok Kerut Bertingkat: Input Ukuran Badan, Petunjuk Pengukuran & Pengaturan Tingkatan */
              <div className="space-y-6">
                {isGuideOpen && (
                  <div className="grid grid-cols-12 gap-2 xs:gap-2.5 sm:gap-4 lg:gap-6 items-start">
                    {/* LEFT COLUMN: Measurement list & input fields */}
                    <div className="col-span-7 xs:col-span-7 sm:col-span-7 md:col-span-6 lg:col-span-6">
                      <BodyMeasurementSection
                        measurements={measurements}
                        onMeasurementChange={handleMeasurementChange}
                        activeMeasurementNumber={activeMeasurementNumber}
                        onHoverMeasurement={setActiveMeasurementNumber}
                        calculatorId={activeConfig.id}
                        isGuideOpen={isGuideOpen}
                        onToggleGuide={() => setIsGuideOpen(false)}
                        hasGuideImage={true}
                      />
                    </div>

                    {/* RIGHT COLUMN: Measurement Guide illustration (Side-by-side with inputs) */}
                    <div className="col-span-5 xs:col-span-5 sm:col-span-5 md:col-span-6 lg:col-span-6 sticky top-2 sm:top-4 self-start">
                      <BodyMeasurementIllustration
                        measurements={measurements}
                        activeMeasurementNumber={activeMeasurementNumber}
                        onSelectMeasurementNumber={setActiveMeasurementNumber}
                        imageUrl={calculatorImages?.measurementGuideImage}
                        calculatorId={activeConfig.id}
                        isGuideOpen={isGuideOpen}
                        onToggleGuide={() => setIsGuideOpen(false)}
                      />
                    </div>
                  </div>
                )}

                <div className={`grid grid-cols-1 ${isGuideOpen ? 'grid-cols-1' : 'lg:grid-cols-12'} gap-6 items-stretch`}>
                  {/* LEFT SIDE — Measurement List (only shown here when guide is closed) */}
                  {!isGuideOpen && (
                    <div className="lg:col-span-6 xl:col-span-6">
                      <BodyMeasurementSection
                        measurements={measurements}
                        onMeasurementChange={handleMeasurementChange}
                        activeMeasurementNumber={activeMeasurementNumber}
                        onHoverMeasurement={setActiveMeasurementNumber}
                        calculatorId={activeConfig.id}
                        isGuideOpen={false}
                        onToggleGuide={() => setIsGuideOpen(true)}
                        hasGuideImage={true}
                      />
                    </div>
                  )}

                  {/* RIGHT SIDE — Dynamic Tier Count Selector & Configuration Panel */}
                  <div className={`${isGuideOpen ? 'w-full' : 'lg:col-span-6 xl:col-span-6'} flex flex-col`}>
                  <div className="bg-white rounded-2xl border border-[#E8DED8] p-5 sm:p-6 shadow-xs flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-[#E8DED8]">
                        <div className="flex items-center gap-2.5">
                          <span className="w-3 h-3 rounded-full bg-[#8F2635] shadow-xs" />
                          <h3 className="font-serif font-bold text-base sm:text-lg text-[#332C29]">
                            {language === 'en' ? 'Skirt Tiers Configuration' : 'Pengaturan Jumlah Tingkatan Rok'}
                          </h3>
                        </div>
                        <span className="text-xs font-mono font-bold text-[#8F2635] bg-[#F3E7E7] px-2.5 py-1 rounded-full border border-[#E8DED8]">
                          {tierCount} {language === 'en' ? 'Tiers' : 'Tingkat'}
                        </span>
                      </div>

                      <div className="mt-4 space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#6B5E57] uppercase tracking-wider mb-2">
                            {language === 'en' ? 'Select Number of Tiers (2 - 6)' : 'Pilih Jumlah Tingkatan (2 - 6 Tingkat)'}
                          </label>
                          <div className="grid grid-cols-5 gap-2">
                            {[2, 3, 4, 5, 6].map((num) => {
                              const isSelected = tierCount === num;
                              return (
                                <button
                                  key={num}
                                  type="button"
                                  id={`tier-selector-btn-${num}`}
                                  onClick={() => setTierCount(num)}
                                  className={`py-3 px-2 rounded-xl font-mono font-bold text-sm sm:text-base transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                                    isSelected
                                      ? 'bg-[#8F2635] text-white shadow-md ring-2 ring-[#8F2635]/30'
                                      : 'bg-[#FCFAF7] text-[#332C29] border border-[#E8DED8] hover:bg-[#FAF6F3] hover:border-[#8F2635]/40'
                                  }`}
                                >
                                  <span>{num}</span>
                                  <span className={`text-[10px] uppercase font-sans font-medium ${isSelected ? 'text-white/80' : 'text-[#8C7D76]'}`}>
                                    {language === 'en' ? 'Tiers' : 'Tingkat'}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Note for 5 and 6 tiers: "Disarankan untuk rok panjang." */}
                        {(tierCount === 5 || tierCount === 6) && (
                          <div className="p-3.5 bg-amber-50/90 rounded-xl border border-amber-200 text-amber-900 flex items-start gap-2.5">
                            <Info size={16} className="text-amber-700 shrink-0 mt-0.5" />
                            <div className="text-xs">
                              <p className="font-bold">
                                {language === 'en' ? 'Recommendation:' : 'Saran Penggunaan:'}
                              </p>
                              <p className="mt-0.5 font-medium">
                                {language === 'en' ? 'Recommended for maxi / long skirts.' : 'Disarankan untuk rok panjang.'}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Proportional summary preview card */}
                        <div className="bg-[#FCFAF7] p-4 rounded-xl border border-[#E8DED8] space-y-2">
                          <h4 className="text-xs font-bold text-[#332C29] uppercase tracking-wide">
                            {language === 'en' ? 'Proportional Drafting Formula' : 'Rumus Pembagian Tingkat'}
                          </h4>
                          <ul className="text-xs text-[#6B5E57] space-y-1.5 list-disc list-inside">
                            <li>
                              <span className="font-semibold text-[#332C29]">{language === 'en' ? 'Tier 1 (Top):' : 'Tingkat 1 (Atas):'}</span>{' '}
                              <span className="font-mono text-[#8F2635]">(Panjang Rok ÷ {tierCount}) − 5 cm</span>
                            </li>
                            {tierCount > 2 && (
                              <li>
                                <span className="font-semibold text-[#332C29]">{language === 'en' ? `Tier 2 to ${tierCount - 1} (Middle):` : `Tingkat 2 s/d ${tierCount - 1} (Tengah):`}</span>{' '}
                                <span className="font-mono text-[#8F2635]">Panjang Rok ÷ {tierCount}</span>
                              </li>
                            )}
                            <li>
                              <span className="font-semibold text-[#332C29]">{language === 'en' ? `Tier ${tierCount} (Bottom):` : `Tingkat ${tierCount} (Bawah):`}</span>{' '}
                              <span className="font-mono text-[#8F2635]">(Panjang Rok ÷ {tierCount}) + 5 cm</span>
                            </li>
                            <li>
                              <span className="font-semibold text-[#332C29]">{language === 'en' ? 'Gathering Ratio:' : 'Rasio Kerutan:'}</span>{' '}
                              <span className="font-mono text-[#8F2635]">1.5× kelipatan tiap tingkatan ke bawah</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 mt-4 border-t border-[#E8DED8] text-center text-xs text-[#8C7D76] italic">
                      {language === 'en'
                        ? 'Front and back patterns use exactly the same construction.'
                        : 'Pola depan dan pola belakang menggunakan bentuk konstruksi yang sama.'}
                    </div>
                  </div>
                </div>
                </div>
              </div>
            ) : (activeCalculatorId === 'rok-pias-godet' || activeCalculatorId === 'pias-godet' || activeCalculatorId === 'rok-pias' || activeCalculatorId === 'pias' || activeCalculatorId === 'godet') ? (
              /* Pola Rok Pias & Godet: Input Ukuran Badan, Petunjuk Pengukuran & Pengaturan Jumlah Pias (N) */
              <div className="space-y-6">
                {isGuideOpen && (
                  <div className="grid grid-cols-12 gap-2 xs:gap-2.5 sm:gap-4 lg:gap-6 items-start">
                    {/* LEFT COLUMN: Measurement list & input fields */}
                    <div className="col-span-7 xs:col-span-7 sm:col-span-7 md:col-span-6 lg:col-span-6">
                      <BodyMeasurementSection
                        measurements={measurements}
                        onMeasurementChange={handleMeasurementChange}
                        activeMeasurementNumber={activeMeasurementNumber}
                        onHoverMeasurement={setActiveMeasurementNumber}
                        calculatorId={activeConfig.id}
                        isGuideOpen={isGuideOpen}
                        onToggleGuide={() => setIsGuideOpen(false)}
                        hasGuideImage={true}
                      />
                    </div>

                    {/* RIGHT COLUMN: Measurement Guide illustration (Side-by-side with inputs) */}
                    <div className="col-span-5 xs:col-span-5 sm:col-span-5 md:col-span-6 lg:col-span-6 sticky top-2 sm:top-4 self-start">
                      <BodyMeasurementIllustration
                        measurements={measurements}
                        activeMeasurementNumber={activeMeasurementNumber}
                        onSelectMeasurementNumber={setActiveMeasurementNumber}
                        imageUrl={calculatorImages?.measurementGuideImage}
                        calculatorId={activeConfig.id}
                        isGuideOpen={isGuideOpen}
                        onToggleGuide={() => setIsGuideOpen(false)}
                      />
                    </div>
                  </div>
                )}

                <div className={`grid grid-cols-1 ${isGuideOpen ? 'grid-cols-1' : 'lg:grid-cols-12'} gap-6 items-stretch`}>
                  {/* LEFT SIDE — Measurement List (only shown here when guide is closed) */}
                  {!isGuideOpen && (
                    <div className="lg:col-span-6 xl:col-span-6">
                      <BodyMeasurementSection
                        measurements={measurements}
                        onMeasurementChange={handleMeasurementChange}
                        activeMeasurementNumber={activeMeasurementNumber}
                        onHoverMeasurement={setActiveMeasurementNumber}
                        calculatorId={activeConfig.id}
                        isGuideOpen={false}
                        onToggleGuide={() => setIsGuideOpen(true)}
                        hasGuideImage={true}
                      />
                    </div>
                  )}

                  {/* RIGHT SIDE — Dynamic Panel Count (N) Selector & Configuration Panel */}
                  <div className={`${isGuideOpen ? 'w-full' : 'lg:col-span-6 xl:col-span-6'} flex flex-col`}>
                  <div className="bg-white rounded-2xl border border-[#E8DED8] p-5 sm:p-6 shadow-xs flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-[#E8DED8]">
                        <div className="flex items-center gap-2.5">
                          <span className="w-3 h-3 rounded-full bg-[#8F2635] shadow-xs" />
                          <h3 className="font-serif font-bold text-base sm:text-lg text-[#332C29]">
                            {language === 'en' ? 'Gored Skirt Panels (N)' : 'Pengaturan Jumlah Pias Rok (N)'}
                          </h3>
                        </div>
                        <span className="text-xs font-mono font-bold text-[#8F2635] bg-[#F3E7E7] px-2.5 py-1 rounded-full border border-[#E8DED8]">
                          {panelCount} {language === 'en' ? 'Gores' : 'Pias'}
                        </span>
                      </div>

                      <div className="mt-4 space-y-4">
                        {/* Interactive Numeric Stepper & Direct Input */}
                        <div>
                          <label htmlFor="input-panel-count" className="block text-xs font-semibold text-[#6B5E57] uppercase tracking-wider mb-1.5">
                            {language === 'en' ? 'Skirt Panel Count (N)' : 'Jumlah Pias Rok (N)'}
                          </label>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setPanelCount((prev) => Math.max(4, prev - 2))}
                              disabled={panelCount <= 4}
                              aria-label="Kurangi pias"
                              className="w-11 h-11 rounded-xl bg-[#FCFAF7] border border-[#E8DED8] hover:bg-[#F3E7E7] hover:border-[#8F2635]/40 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-[#332C29] transition-all cursor-pointer shadow-xs"
                            >
                              <Minus size={16} />
                            </button>
                            
                            <div className="flex-1 relative">
                              <input
                                type="number"
                                id="input-panel-count"
                                value={panelCount}
                                min={4}
                                max={24}
                                step={2}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value, 10);
                                  if (!isNaN(val) && val > 0) {
                                    setPanelCount(val);
                                  }
                                }}
                                className="w-full h-11 text-center font-mono font-bold text-base text-[#332C29] bg-[#FCFAF7] border border-[#E8DED8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8F2635]/30 focus:border-[#8F2635]"
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-serif text-[#8C7D76] pointer-events-none font-medium">
                                {language === 'en' ? 'Gores' : 'Pias'}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => setPanelCount((prev) => prev + 2)}
                              aria-label="Tambah pias"
                              className="w-11 h-11 rounded-xl bg-[#FCFAF7] border border-[#E8DED8] hover:bg-[#F3E7E7] hover:border-[#8F2635]/40 flex items-center justify-center text-[#332C29] transition-all cursor-pointer shadow-xs"
                            >
                              <Plus size={16} />
                            </button>
                          </div>

                          <p className="mt-1.5 text-[11px] text-[#8C7D76]">
                            {language === 'en'
                              ? '* Panel count must be an even number (e.g. 4, 6, 8, 10).'
                              : '* Jumlah pias harus genap (contoh: 4, 6, 8, 10, dst).'}
                          </p>

                          {/* Real-time Even Number Validation Warning */}
                          {panelCount % 2 !== 0 && (
                            <div className="mt-2 p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 flex items-center gap-2 text-xs">
                              <AlertCircle size={15} className="text-amber-700 shrink-0" />
                              <span className="font-medium">
                                {language === 'en'
                                  ? 'Panel count must be an even number (e.g. 4, 6, 8, 10) to maintain pattern symmetry.'
                                  : 'Jumlah pias rok harus berupa bilangan genap (contoh: 4, 6, 8, 10, dll) agar konstruksi pola simetris.'}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Proportional summary preview card */}
                        <div className="bg-[#FCFAF7] p-4 rounded-xl border border-[#E8DED8] space-y-2">
                          <h4 className="text-xs font-bold text-[#332C29] uppercase tracking-wide">
                            {language === 'en' ? 'Gored Skirt & Godet Formula Summary' : 'Ringkasan Rumus Pembagian Pias'}
                          </h4>
                          <ul className="text-xs text-[#6B5E57] space-y-1.5 list-disc list-inside">
                            <li>
                              <span className="font-semibold text-[#332C29]">{language === 'en' ? 'Waist per Panel:' : 'Lebar Pinggang 1 Pias:'}</span>{' '}
                              <span className="font-mono text-[#8F2635]">Lingkar Pinggang ÷ {panelCount}</span>
                            </li>
                            <li>
                              <span className="font-semibold text-[#332C29]">{language === 'en' ? 'Hip per Panel:' : 'Lebar Panggul 1 Pias:'}</span>{' '}
                              <span className="font-mono text-[#8F2635]">Lingkar Panggul ÷ {panelCount}</span>
                            </li>
                          </ul>
                        </div>

                        {/* Catatan Penting Pola */}
                        <div className="bg-white p-4 rounded-xl border border-[#E8DED8] shadow-2xs space-y-2">
                          <div className="flex items-center gap-2 text-[#8F2635]">
                            <Info size={15} className="shrink-0" />
                            <h4 className="font-serif font-bold text-xs uppercase tracking-wide">
                              Catatan Penting Pola
                            </h4>
                          </div>
                          <ul className="space-y-1.5 text-xs text-[#524640] leading-relaxed">
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#8F2635] mt-1.5 shrink-0" />
                              <span>Jumlah pias rok harus berupa bilangan genap (contoh: 4, 6, 8, 10, dll).</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#8F2635] mt-1.5 shrink-0" />
                              <span>Semua ukuran diambil pas pada tubuh tanpa tambahan kelonggaran.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#8F2635] mt-1.5 shrink-0" />
                              <span>Pola 1 helai pias dipotong sebanyak jumlah pias yang ditentukan.</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 mt-4 border-t border-[#E8DED8] text-center text-xs text-[#8C7D76] italic">
                      {language === 'en'
                        ? `This drafting calculates 1 panel unit. Cut ${panelCount} identical panels and ${panelCount} godet inserts.`
                        : `Pola ini menghasilkan perhitungan 1 helai pias. Gunting ${panelCount} helai pias dan ${panelCount} lembar sisipan godet.`}
                    </div>
                  </div>
                </div>
                </div>
              </div>
            ) : (activeCalculatorId === 'pola-kulot' || activeCalculatorId === 'kulot' || activeCalculatorId === 'culottes' || activeCalculatorId === 'culotte-pants') ? (
              /* Pola Kulot: Input Ukuran, Petunjuk Pengukuran, & Pengaturan Konstruksi */
              <div className="space-y-6">
                {isGuideOpen ? (
                  <div className="grid grid-cols-12 gap-2 xs:gap-2.5 sm:gap-4 lg:gap-6 items-start">
                    {/* LEFT COLUMN: Measurement list & input fields */}
                    <div className="col-span-7 xs:col-span-7 sm:col-span-7 md:col-span-6 lg:col-span-6">
                      <BodyMeasurementSection
                        measurements={measurements}
                        onMeasurementChange={handleMeasurementChange}
                        activeMeasurementNumber={activeMeasurementNumber}
                        onHoverMeasurement={setActiveMeasurementNumber}
                        calculatorId={activeConfig.id}
                        isGuideOpen={isGuideOpen}
                        onToggleGuide={() => setIsGuideOpen(false)}
                        hasGuideImage={true}
                      />
                    </div>

                    {/* RIGHT COLUMN: Measurement Guide illustration (Side-by-side with inputs) */}
                    <div className="col-span-5 xs:col-span-5 sm:col-span-5 md:col-span-6 lg:col-span-6 sticky top-2 sm:top-4 self-start">
                      <BodyMeasurementIllustration
                        measurements={measurements}
                        activeMeasurementNumber={activeMeasurementNumber}
                        onSelectMeasurementNumber={setActiveMeasurementNumber}
                        imageUrl={calculatorImages?.measurementGuideImage}
                        calculatorId={activeConfig.id}
                        isGuideOpen={isGuideOpen}
                        onToggleGuide={() => setIsGuideOpen(false)}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    {/* LEFT SIDE — Measurement List */}
                    <div className="lg:col-span-6 xl:col-span-6">
                      <BodyMeasurementSection
                        measurements={measurements}
                        onMeasurementChange={handleMeasurementChange}
                        activeMeasurementNumber={activeMeasurementNumber}
                        onHoverMeasurement={setActiveMeasurementNumber}
                        calculatorId={activeConfig.id}
                        isGuideOpen={false}
                        onToggleGuide={() => setIsGuideOpen(true)}
                        hasGuideImage={true}
                      />
                    </div>

                    {/* RIGHT SIDE — Kulot Crotch & Pattern Transformation Controls */}
                    <div className="lg:col-span-6 xl:col-span-6 flex flex-col">
                      <div className="bg-white rounded-2xl border border-[#E8DED8] p-5 sm:p-6 shadow-xs flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between pb-3 border-b border-[#E8DED8]">
                            <div className="flex items-center gap-2.5">
                              <span className="w-3 h-3 rounded-full bg-[#8F2635] shadow-xs" />
                              <h3 className="font-serif font-bold text-base sm:text-lg text-[#332C29]">
                                {language === 'en' ? 'Culottes Construction Settings' : 'Pengaturan Konstruksi Pola Kulot'}
                              </h3>
                            </div>
                            <span className="text-xs font-mono font-bold text-[#8F2635] bg-[#F3E7E7] px-2.5 py-1 rounded-full border border-[#E8DED8]">
                              {kulotAcMethod === 'tinggi-duduk'
                                ? (language === 'en' ? 'Sitting Height' : 'Tinggi Duduk')
                                : (language === 'en' ? 'Hip + 7-8 cm' : 'TP + 7–8 cm')}
                            </span>
                          </div>

                          <div className="mt-4 space-y-4">
                            {/* Option Selector for A-C (Tinggi Duduk vs TP + 7-8 cm) */}
                            <div>
                              <label className="block text-xs font-semibold text-[#6B5E57] uppercase tracking-wider mb-2">
                                {language === 'en' ? 'Select A–C Calculation Method (Crotch Line):' : 'Pilih Metode Perhitungan A–C (Garis Pesak):'}
                              </label>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {/* Option 1: Tinggi Duduk Direct */}
                                <button
                                  type="button"
                                  id="btn-kulot-method-tinggi-duduk"
                                  onClick={() => setKulotAcMethod('tinggi-duduk')}
                                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                                    kulotAcMethod === 'tinggi-duduk'
                                      ? 'bg-[#FCFAF7] border-[#8F2635] ring-2 ring-[#8F2635]/20 shadow-xs'
                                      : 'bg-white hover:bg-[#FAF6F3] border-[#E8DED8]'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className={`text-xs font-bold ${kulotAcMethod === 'tinggi-duduk' ? 'text-[#8F2635]' : 'text-[#332C29]'}`}>
                                      {language === 'en' ? 'Method 1: Direct Sitting Height' : 'Metode 1: Tinggi Duduk'}
                                    </span>
                                    <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                                      kulotAcMethod === 'tinggi-duduk' ? 'border-[#8F2635] bg-[#8F2635]' : 'border-[#DFD4CD]'
                                    }`}>
                                      {kulotAcMethod === 'tinggi-duduk' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-[#6B5E57] mt-1.5 leading-relaxed">
                                    {language === 'en' ? 'Uses exact entered sitting height.' : 'Menggunakan ukuran Tinggi Duduk yang diukur langsung.'}
                                  </p>
                                  <div className="mt-2 pt-2 border-t border-[#E8DED8] flex items-center justify-between text-xs font-mono">
                                    <span className="text-[#8C7D76]">A–C =</span>
                                    <span className="font-bold text-[#8F2635]">{measurementsMap.tinggiDuduk ?? 21} cm</span>
                                  </div>
                                </button>

                                {/* Option 2: Tinggi Panggul + 7-8 cm Range */}
                                <button
                                  type="button"
                                  id="btn-kulot-method-tinggi-panggul"
                                  onClick={() => setKulotAcMethod('tinggi-panggul-range')}
                                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                                    kulotAcMethod === 'tinggi-panggul-range'
                                      ? 'bg-[#FCFAF7] border-[#8F2635] ring-2 ring-[#8F2635]/20 shadow-xs'
                                      : 'bg-white hover:bg-[#FAF6F3] border-[#E8DED8]'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className={`text-xs font-bold ${kulotAcMethod === 'tinggi-panggul-range' ? 'text-[#8F2635]' : 'text-[#332C29]'}`}>
                                      {language === 'en' ? 'Method 2: Hip + 7–8 cm Range' : 'Metode 2: TP + 7–8 cm'}
                                    </span>
                                    <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                                      kulotAcMethod === 'tinggi-panggul-range' ? 'border-[#8F2635] bg-[#8F2635]' : 'border-[#DFD4CD]'
                                    }`}>
                                      {kulotAcMethod === 'tinggi-panggul-range' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-[#6B5E57] mt-1.5 leading-relaxed">
                                    {language === 'en' ? 'Formula alternative with adjustable ease.' : 'Alternatif rumus: Tinggi Panggul + rentang kelonggaran 7–8 cm.'}
                                  </p>
                                  <div className="mt-2 pt-2 border-t border-[#E8DED8] flex items-center justify-between text-xs font-mono">
                                    <span className="text-[#8C7D76]">A–C =</span>
                                    <span className="font-bold text-[#8F2635]">
                                      {(measurementsMap.tinggiPanggul ?? 18) + 7} s/d {(measurementsMap.tinggiPanggul ?? 18) + 8} cm
                                    </span>
                                  </div>
                                </button>
                              </div>
                            </div>

                            {/* Summary & Principles */}
                            <div className="bg-[#FCFAF7] p-4 rounded-xl border border-[#E8DED8] space-y-2">
                              <h4 className="text-xs font-bold text-[#332C29] uppercase tracking-wide">
                                {language === 'en' ? 'Culottes Extension Summary' : 'Ringkasan Rumus Perpanjangan Pola'}
                              </h4>
                              <ul className="text-xs text-[#6B5E57] space-y-1.5 list-disc list-inside">
                                <li>
                                  <span className="font-semibold text-[#332C29]">{language === 'en' ? 'Front Crotch Extension (C–C\'):' : 'Perpanjangan Pesak Depan (C–C\'):'}</span>{' '}
                                  <span className="font-mono text-[#8F2635] text-[11px] sm:text-xs">
                                    {language === 'en' ? '¹/₁₀ Waist Circumference − 2 cm' : '¹/₁₀ Lingkar Pinggang − 2 cm'}
                                  </span>{' '}
                                  <span className="text-[11px] sm:text-xs text-[#6B5E57]">({(((measurementsMap.lingkarPanggul ?? 84) / 10) - 2).toFixed(1).replace('.', ',')} cm)</span>
                                </li>
                                <li>
                                  <span className="font-semibold text-[#332C29]">{language === 'en' ? 'Back Crotch Extension (C–C\'):' : 'Perpanjangan Pesak Belakang (C–C\'):'}</span>{' '}
                                  <span className="font-mono text-[#1D4ED8] text-[11px] sm:text-xs">
                                    {language === 'en' ? '¹/₁₀ Waist Circumference + 2 cm' : '¹/₁₀ Lingkar Pinggang + 2 cm'}
                                  </span>{' '}
                                  <span className="text-[11px] sm:text-xs text-[#6B5E57]">({(((measurementsMap.lingkarPanggul ?? 84) / 10) + 2).toFixed(1).replace('.', ',')} cm)</span>
                                </li>
                                <li>
                                  <span className="font-semibold text-[#332C29]">{language === 'en' ? 'Zipper Fly (Golbi):' : 'Lebar & Panjang Golbi:'}</span>{' '}
                                  <span className="font-mono text-[#8F2635]">4 cm × 18 cm</span>
                                </li>
                                <li>
                                  <span className="font-semibold text-[#332C29]">{language === 'en' ? 'Side Hem Raise (B\'):' : 'Kenaikan Sisi Luar Bawah (B\'):'}</span>{' '}
                                  <span className="font-mono text-[#332C29]">1,5 cm</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 mt-4 border-t border-[#E8DED8] text-center text-xs text-[#8C7D76] italic">
                          {language === 'en'
                            ? 'Culottes pattern is transformed directly on top of your basic skirt foundation.'
                            : 'Pola kulot dibuat langsung sebagai modifikasi di atas pola dasar rok Anda.'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* When guide is open, show Kulot Construction Settings below the measurement & guide grid */}
                {isGuideOpen && (
                  <div className="w-full">
                    <div className="bg-white rounded-2xl border border-[#E8DED8] p-5 sm:p-6 shadow-xs">
                      <div className="flex items-center justify-between pb-3 border-b border-[#E8DED8]">
                        <div className="flex items-center gap-2.5">
                          <span className="w-3 h-3 rounded-full bg-[#8F2635] shadow-xs" />
                          <h3 className="font-serif font-bold text-base sm:text-lg text-[#332C29]">
                            {language === 'en' ? 'Culottes Construction Settings' : 'Pengaturan Konstruksi Pola Kulot'}
                          </h3>
                        </div>
                        <span className="text-xs font-mono font-bold text-[#8F2635] bg-[#F3E7E7] px-2.5 py-1 rounded-full border border-[#E8DED8]">
                          {kulotAcMethod === 'tinggi-duduk'
                            ? (language === 'en' ? 'Sitting Height' : 'Tinggi Duduk')
                            : (language === 'en' ? 'Hip + 7-8 cm' : 'TP + 7–8 cm')}
                        </span>
                      </div>

                      <div className="mt-4 space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#6B5E57] uppercase tracking-wider mb-2">
                            {language === 'en' ? 'Select A–C Calculation Method (Crotch Line):' : 'Pilih Metode Perhitungan A–C (Garis Pesak):'}
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <button
                              type="button"
                              id="btn-kulot-method-tinggi-duduk-open"
                              onClick={() => setKulotAcMethod('tinggi-duduk')}
                              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                                kulotAcMethod === 'tinggi-duduk'
                                  ? 'bg-[#FCFAF7] border-[#8F2635] ring-2 ring-[#8F2635]/20 shadow-xs'
                                  : 'bg-white hover:bg-[#FAF6F3] border-[#E8DED8]'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className={`text-xs font-bold ${kulotAcMethod === 'tinggi-duduk' ? 'text-[#8F2635]' : 'text-[#332C29]'}`}>
                                  {language === 'en' ? 'Method 1: Direct Sitting Height' : 'Metode 1: Tinggi Duduk'}
                                </span>
                                <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                                  kulotAcMethod === 'tinggi-duduk' ? 'border-[#8F2635] bg-[#8F2635]' : 'border-[#DFD4CD]'
                                }`}>
                                  {kulotAcMethod === 'tinggi-duduk' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#6B5E57] mt-1.5 leading-relaxed">
                                {language === 'en' ? 'Uses exact entered sitting height.' : 'Menggunakan ukuran Tinggi Duduk yang diukur langsung.'}
                              </p>
                              <div className="mt-2 pt-2 border-t border-[#E8DED8] flex items-center justify-between text-xs font-mono">
                                <span className="text-[#8C7D76]">A–C =</span>
                                <span className="font-bold text-[#8F2635]">{measurementsMap.tinggiDuduk ?? 21} cm</span>
                              </div>
                            </button>

                            <button
                              type="button"
                              id="btn-kulot-method-tinggi-panggul-open"
                              onClick={() => setKulotAcMethod('tinggi-panggul-range')}
                              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                                kulotAcMethod === 'tinggi-panggul-range'
                                  ? 'bg-[#FCFAF7] border-[#8F2635] ring-2 ring-[#8F2635]/20 shadow-xs'
                                  : 'bg-white hover:bg-[#FAF6F3] border-[#E8DED8]'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className={`text-xs font-bold ${kulotAcMethod === 'tinggi-panggul-range' ? 'text-[#8F2635]' : 'text-[#332C29]'}`}>
                                  {language === 'en' ? 'Method 2: Hip + 7–8 cm Range' : 'Metode 2: TP + 7–8 cm'}
                                </span>
                                <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                                  kulotAcMethod === 'tinggi-panggul-range' ? 'border-[#8F2635] bg-[#8F2635]' : 'border-[#DFD4CD]'
                                }`}>
                                  {kulotAcMethod === 'tinggi-panggul-range' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#6B5E57] mt-1.5 leading-relaxed">
                                {language === 'en' ? 'Formula alternative with adjustable ease.' : 'Alternatif rumus: Tinggi Panggul + rentang kelonggaran 7–8 cm.'}
                              </p>
                              <div className="mt-2 pt-2 border-t border-[#E8DED8] flex items-center justify-between text-xs font-mono">
                                <span className="text-[#8C7D76]">A–C =</span>
                                <span className="font-bold text-[#8F2635]">
                                  {(measurementsMap.tinggiPanggul ?? 18) + 7} s/d {(measurementsMap.tinggiPanggul ?? 18) + 8} cm
                                </span>
                              </div>
                            </button>
                          </div>
                        </div>

                        <div className="bg-[#FCFAF7] p-4 rounded-xl border border-[#E8DED8] space-y-2">
                          <h4 className="text-xs font-bold text-[#332C29] uppercase tracking-wide">
                            {language === 'en' ? 'Culottes Extension Summary' : 'Ringkasan Rumus Perpanjangan Pola'}
                          </h4>
                          <ul className="text-xs text-[#6B5E57] space-y-1.5 list-disc list-inside">
                            <li>
                              <span className="font-semibold text-[#332C29]">{language === 'en' ? 'Front Crotch Extension (C–C\'):' : 'Perpanjangan Pesak Depan (C–C\'):'}</span>{' '}
                              <span className="font-mono text-[#8F2635] text-[11px] sm:text-xs">
                                {language === 'en' ? '¹/₁₀ Waist Circumference − 2 cm' : '¹/₁₀ Lingkar Pinggang − 2 cm'}
                              </span>{' '}
                              <span className="text-[11px] sm:text-xs text-[#6B5E57]">({(((measurementsMap.lingkarPanggul ?? 84) / 10) - 2).toFixed(1).replace('.', ',')} cm)</span>
                            </li>
                            <li>
                              <span className="font-semibold text-[#332C29]">{language === 'en' ? 'Back Crotch Extension (C–C\'):' : 'Perpanjangan Pesak Belakang (C–C\'):'}</span>{' '}
                              <span className="font-mono text-[#1D4ED8] text-[11px] sm:text-xs">
                                {language === 'en' ? '¹/₁₀ Waist Circumference + 2 cm' : '¹/₁₀ Lingkar Pinggang + 2 cm'}
                              </span>{' '}
                              <span className="text-[11px] sm:text-xs text-[#6B5E57]">({(((measurementsMap.lingkarPanggul ?? 84) / 10) + 2).toFixed(1).replace('.', ',')} cm)</span>
                            </li>
                            <li>
                              <span className="font-semibold text-[#332C29]">{language === 'en' ? 'Zipper Fly (Golbi):' : 'Lebar & Panjang Golbi:'}</span>{' '}
                              <span className="font-mono text-[#8F2635]">4 cm × 18 cm</span>
                            </li>
                            <li>
                              <span className="font-semibold text-[#332C29]">{language === 'en' ? 'Side Hem Raise (B\'):' : 'Kenaikan Sisi Luar Bawah (B\'):'}</span>{' '}
                              <span className="font-mono text-[#332C29]">1,5 cm</span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="pt-3 mt-4 border-t border-[#E8DED8] text-center text-xs text-[#8C7D76] italic">
                        {language === 'en'
                          ? 'Culottes pattern is transformed directly on top of your basic skirt foundation.'
                          : 'Pola kulot dibuat langsung sebagai modifikasi di atas pola dasar rok Anda.'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Calculators with Measurement Guide: Bodices, Skirts, Sleeve, Pajama, etc. */
              isGuideOpen ? (
                <div className="grid grid-cols-12 gap-2 xs:gap-2.5 sm:gap-4 lg:gap-6 items-start">
                  {/* LEFT COLUMN: Measurement list & input fields */}
                  <div className="col-span-7 xs:col-span-7 sm:col-span-7 md:col-span-6 lg:col-span-6">
                    <BodyMeasurementSection
                      measurements={measurements}
                      onMeasurementChange={handleMeasurementChange}
                      activeMeasurementNumber={activeMeasurementNumber}
                      onHoverMeasurement={setActiveMeasurementNumber}
                      calculatorId={activeConfig.id}
                      isGuideOpen={isGuideOpen}
                      onToggleGuide={() => setIsGuideOpen(false)}
                      hasGuideImage={true}
                    />
                  </div>

                  {/* RIGHT COLUMN: Measurement Guide illustration (Side-by-side with inputs) */}
                  <div className="col-span-5 xs:col-span-5 sm:col-span-5 md:col-span-6 lg:col-span-6 sticky top-2 sm:top-4 self-start">
                    <BodyMeasurementIllustration
                      measurements={measurements}
                      activeMeasurementNumber={activeMeasurementNumber}
                      onSelectMeasurementNumber={setActiveMeasurementNumber}
                      imageUrl={calculatorImages?.measurementGuideImage}
                      calculatorId={activeConfig.id}
                      isGuideOpen={isGuideOpen}
                      onToggleGuide={() => setIsGuideOpen(false)}
                    />
                  </div>
                </div>
              ) : (
                <div className="w-full">
                  <BodyMeasurementSection
                    measurements={measurements}
                    onMeasurementChange={handleMeasurementChange}
                    activeMeasurementNumber={activeMeasurementNumber}
                    onHoverMeasurement={setActiveMeasurementNumber}
                    calculatorId={activeConfig.id}
                    isGuideOpen={false}
                    onToggleGuide={() => setIsGuideOpen(true)}
                    hasGuideImage={true}
                  />
                </div>
              )
            )}
          </section>

          {/* ======================================================== */}
          {/* STAGE 2 — PATTERN CALCULATION (HASIL PERHITUNGAN)        */}
          {/* Two-Column: LEFT (Quick Calculation) | RIGHT (Diagram)   */}
          {/* ======================================================== */}
          <section id="stage-2-pattern-calculation" className="space-y-3 pt-2">
            {/* Stage 2 Identifier Tag */}
            <div className="flex items-center gap-2.5 px-1">
              <span className="px-2.5 py-0.5 rounded-full bg-[#8F2635] text-[#FCFAF7] text-[11px] font-mono font-bold tracking-wider uppercase">
                {t.stage2Badge}
              </span>
              <span className="font-serif text-lg font-bold text-[#332C29] tracking-wide">
                {t.stage2Title}
              </span>
            </div>

            {/* Stage 2 Two-Column Grid */}
            <div className={
              (activeConfig.id === 'rok' || activeConfig.id === 'rok-sederhana')
                ? "grid grid-cols-12 gap-1.5 xs:gap-2 sm:gap-4 lg:gap-6 items-stretch"
                : "grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
            }>
              {/* LEFT SIDE — Quick Calculation List (A–B = XX cm) */}
              <div className={
                (activeConfig.id === 'rok' || activeConfig.id === 'rok-sederhana')
                  ? "col-span-4 xs:col-span-4 sm:col-span-5 lg:col-span-5 min-w-0"
                  : activeCalculatorId.includes('badan') ? 'lg:col-span-4 xl:col-span-4' : 'lg:col-span-5'
              }>
                <PatternCalculationSection
                  calculations={activeCalculations}
                  measurementsMap={measurementsMap}
                  activeCalculationId={activeCalculationId}
                  onSelectCalculation={handleSelectCalculation}
                  calculatorId={activeConfig.id}
                  circleSkirtModel={circleSkirtModel}
                  kulotAcMethod={kulotAcMethod}
                  onChangeKulotAcMethod={setKulotAcMethod}
                  jarakQR={badanIndonesiaJarakQR}
                  onChangeJarakQR={setBadanIndonesiaJarakQR}
                />
              </div>

              {/* RIGHT SIDE — Large Technical Pattern Diagram */}
              <div className={
                (activeConfig.id === 'rok' || activeConfig.id === 'rok-sederhana')
                  ? "col-span-8 xs:col-span-8 sm:col-span-7 lg:col-span-7 min-w-0"
                  : activeCalculatorId.includes('badan') ? 'lg:col-span-8 xl:col-span-8' : 'lg:col-span-7'
              }>
                <PatternTechnicalDiagram
                  calculations={activeCalculations}
                  measurementsMap={measurementsMap}
                  activeCalculationId={activeCalculationId}
                  onSelectCalculation={handleSelectCalculation}
                  imageUrl={activePatternImage}
                  dressmakingBackPatternImage={calculatorImages?.dressmakingBackPatternImage}
                  dressmakingFrontPatternImage={calculatorImages?.dressmakingFrontPatternImage}
                  dressmakingSideDartImage={calculatorImages?.dressmakingSideDartImage || calculatorImages?.sideDartDetailImage}
                  patternDescription={activePatternDescription}
                  frontPatternDescription={activeFrontPatternDescription}
                  backPatternDescription={activeBackPatternDescription}
                  sideDartDescription={activeSideDartDescription}
                  importantNotes={activeConfig.importantNotes}
                  importantNote_id={calculatorImages?.importantNote_id}
                  importantNote_en={calculatorImages?.importantNote_en}
                  calculatorId={activeConfig.id}
                  circleSkirtModel={circleSkirtModel}
                  tierCount={tierCount}
                />
              </div>
            </div>
          </section>

          {/* ======================================================== */}
          {/* EDUCATIONAL FORMULA EXPLANATION & CONSTRUCTION SECTION   */}
          {/* ======================================================== */}
          <PatternFormulaExplanationSection
            measurementsMap={measurementsMap}
            calculatorId={activeConfig.id}
            hasCalculations={activeCalculations.length > 0}
            circleSkirtModel={circleSkirtModel}
            tierCount={tierCount}
            panelCount={panelCount}
            kulotAcMethod={kulotAcMethod}
          />

        </main>

        {/* Studio Footer */}
        <WorksheetFooter />
      </div>

      {/* ======================================================== */}
      {/* PRINT OPTIONS DIALOG / MODAL                             */}
      {/* ======================================================== */}
      <PrintOptionsModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        clientInfo={clientInfo}
        onChangeClientInfo={handleChangeClientInfo}
        printOptions={printOptions}
        onChangePrintOptions={setPrintOptions}
        onConfirmPrint={() => {
          setIsPrintModalOpen(false);
          handlePrint();
        }}
        onOpenPreview={() => {
          setIsPrintModalOpen(false);
          setIsPreviewOpen(true);
        }}
      />

      {/* ======================================================== */}
      {/* PRINT-ONLY A4 OPTIMIZED WORKSHEET                        */}
      {/* ======================================================== */}
      <div className="hidden print:block">
        <PrintWorksheet
          moduleInfo={activeConfig.moduleInfo}
          clientInfo={clientInfo}
          measurements={measurements}
          calculations={activeCalculations}
          measurementsMap={measurementsMap}
          patternImage={activePatternImage}
          dressmakingBackPatternImage={calculatorImages?.dressmakingBackPatternImage}
          dressmakingFrontPatternImage={calculatorImages?.dressmakingFrontPatternImage}
          dressmakingSideDartImage={calculatorImages?.dressmakingSideDartImage || calculatorImages?.sideDartDetailImage}
          patternDescription={activePatternDescription}
          frontPatternDescription={activeFrontPatternDescription}
          backPatternDescription={activeBackPatternDescription}
          circleSkirtModel={circleSkirtModel}
          panelCount={panelCount}
          printOptions={printOptions}
          isPreview={false}
        />
      </div>

    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider defaultLanguage="id">
      <AppContent />
    </LanguageProvider>
  );
}
