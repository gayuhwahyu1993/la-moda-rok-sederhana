import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Image as ImageIcon, 
  RefreshCw, 
  Eye, 
  Database,
  Check,
  X,
  Lock,
  LogOut,
  LogIn,
  Mail,
  ShieldCheck,
  FileText,
  Save,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { 
  SUPPORTED_CALCULATORS, 
  CalculatorImageConfig, 
  CalculatorImageType,
  getCalculatorImages, 
  subscribeCalculatorImages, 
  uploadCalculatorImage,
  removeCalculatorImage,
  updateCalculatorPatternDescriptions,
  updateCalculatorPatternDescription,
  updateCalculatorSectionDescription,
  updateCalculatorImportantNotes,
  clearCalculatorImportantNotes,
  DEFAULT_CALCULATOR_IMAGES,
  isSkirtCalculator,
  isBodiceCalculator,
  isPantsCalculator,
  isTwoMeasurementSkirtCalculator,
  signInAdmin,
  signOutAdmin,
  subscribeAuthState,
  getCurrentUser
} from '../services/firebase';
import { User } from 'firebase/auth';
import skirtMeasurementGuideImg from '../assets/images/skirt_measurement_restored_1787486044371.jpg';
import { FormattedPatternInstructions } from './FormattedPatternInstructions';
import { DEFAULT_ROK_PIAS_INSTRUCTIONS, DEFAULT_ROK_GODET_INSTRUCTIONS } from '../data/calculators/rokPiasGodet';
import { getCalculatorConfig } from '../data/calculators';
import { Bold, ListOrdered, List, AlignLeft, Sparkles, ChevronDown, ChevronUp, Globe } from 'lucide-react';

interface AdminImageManagerProps {
  onBackToStudentCalculator: () => void;
}

interface ImageUploadState {
  file: File | null;
  previewUrl: string | null;
  isUploading: boolean;
  error: string | null;
  success: boolean;
}

const isTieredSkirtCalc = (id: string) =>
  id === 'pola-rok-kerut-bertingkat' ||
  id === 'rok-kerut-bertingkat' ||
  id === 'rok-kerut' ||
  id === 'tiered-skirt';

const isRokLipitSearahCalc = (id: string) =>
  id === 'rok-lipit-searah' ||
  id === 'rok-lipit' ||
  id === 'lipit-searah' ||
  id === 'lipit';

const isRokPiasGodetCalc = (id: string) =>
  id === 'rok-pias-godet' ||
  id === 'pias-godet' ||
  id === 'rok-pias' ||
  id === 'pias' ||
  id === 'godet';

const isPolaCelanaCalc = (id: string) =>
  id === 'pola-celana-piyama' ||
  id === 'celana-piyama' ||
  id === 'celana' ||
  id === 'pajama-pants';

export const AdminImageManager: React.FC<AdminImageManagerProps> = ({
  onBackToStudentCalculator,
}) => {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(getCurrentUser());
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const [selectedCalcId, setSelectedCalcId] = useState<string>('rok');
  const [calculatorData, setCalculatorData] = useState<CalculatorImageConfig | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Upload states for each section
  const [guideUpload, setGuideUpload] = useState<ImageUploadState>({
    file: null,
    previewUrl: null,
    isUploading: false,
    error: null,
    success: false,
  });

  const [patternUpload, setPatternUpload] = useState<ImageUploadState>({
    file: null,
    previewUrl: null,
    isUploading: false,
    error: null,
    success: false,
  });

  // Dedicated upload states for Dressmaking (3 independent slots)
  const [backPatternUpload, setBackPatternUpload] = useState<ImageUploadState>({
    file: null,
    previewUrl: null,
    isUploading: false,
    error: null,
    success: false,
  });

  const [frontPatternUpload, setFrontPatternUpload] = useState<ImageUploadState>({
    file: null,
    previewUrl: null,
    isUploading: false,
    error: null,
    success: false,
  });

  const [sideDartUpload, setSideDartUpload] = useState<ImageUploadState>({
    file: null,
    previewUrl: null,
    isUploading: false,
    error: null,
    success: false,
  });

  // Dedicated upload state for Tiered Skirt Tier 4 Pattern
  const [tier4PatternUpload, setTier4PatternUpload] = useState<ImageUploadState>({
    file: null,
    previewUrl: null,
    isUploading: false,
    error: null,
    success: false,
  });

  // Pattern Description state (Separate Front, Back, Side Dart/Kupnat, and Tier 4) - Indonesian (ID)
  const [frontPatternDescriptionText, setFrontPatternDescriptionText] = useState<string>('');
  const [backPatternDescriptionText, setBackPatternDescriptionText] = useState<string>('');
  const [sideDartDescriptionText, setSideDartDescriptionText] = useState<string>('');
  const [tier4PatternDescriptionText, setTier4PatternDescriptionText] = useState<string>('');

  // Pattern Description state - English (EN) - Manually entered by Admin
  const [frontPatternDescriptionEnText, setFrontPatternDescriptionEnText] = useState<string>('');
  const [backPatternDescriptionEnText, setBackPatternDescriptionEnText] = useState<string>('');
  const [sideDartDescriptionEnText, setSideDartDescriptionEnText] = useState<string>('');
  const [tier4PatternDescriptionEnText, setTier4PatternDescriptionEnText] = useState<string>('');

  // Important Pattern Notes state - Bilingual (ID & EN) - Manually entered by Admin
  const [importantNoteIdText, setImportantNoteIdText] = useState<string>('');
  const [importantNoteEnText, setImportantNoteEnText] = useState<string>('');
  const [showNotesPreview, setShowNotesPreview] = useState<boolean>(false);

  // Section-level independent saving status
  const [savingSection, setSavingSection] = useState<'front' | 'back' | 'sideDart' | 'tier4' | 'notes' | null>(null);
  const [sectionSaveSuccess, setSectionSaveSuccess] = useState<string | null>(null);

  const [isSavingDescription, setIsSavingDescription] = useState<boolean>(false);
  const [descriptionSaveSuccess, setDescriptionSaveSuccess] = useState<boolean>(false);
  const [descriptionSaveError, setDescriptionSaveError] = useState<string | null>(null);

  // Active preview toggle state
  const [showFrontPreview, setShowFrontPreview] = useState<boolean>(true);
  const [showBackPreview, setShowBackPreview] = useState<boolean>(true);
  const [showSideDartPreview, setShowSideDartPreview] = useState<boolean>(true);
  const [showTier4Preview, setShowTier4Preview] = useState<boolean>(true);

  // Active preview language tab ('id' | 'en')
  const [frontPreviewLang, setFrontPreviewLang] = useState<'id' | 'en'>('id');
  const [backPreviewLang, setBackPreviewLang] = useState<'id' | 'en'>('id');
  const [sideDartPreviewLang, setSideDartPreviewLang] = useState<'id' | 'en'>('id');
  const [tier4PreviewLang, setTier4PreviewLang] = useState<'id' | 'en'>('id');

  // Deletion state tracking
  const [deletingSlot, setDeletingSlot] = useState<string | null>(null);
  const [deleteSuccessMsg, setDeleteSuccessMsg] = useState<string | null>(null);
  const [deleteErrorMsg, setDeleteErrorMsg] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    slot: CalculatorImageType;
    slotLabel: string;
    isDressmaking: boolean;
    confirmMessage: string;
  } | null>(null);

  const guideFileInputRef = useRef<HTMLInputElement>(null);
  const patternFileInputRef = useRef<HTMLInputElement>(null);
  const backPatternFileInputRef = useRef<HTMLInputElement>(null);
  const frontPatternFileInputRef = useRef<HTMLInputElement>(null);
  const sideDartFileInputRef = useRef<HTMLInputElement>(null);
  const tier4PatternFileInputRef = useRef<HTMLInputElement>(null);

  // Textarea refs for ID and EN formatting toolbars
  const frontTextareaRef = useRef<HTMLTextAreaElement>(null);
  const backTextareaRef = useRef<HTMLTextAreaElement>(null);
  const sideDartTextareaRef = useRef<HTMLTextAreaElement>(null);
  const tier4TextareaRef = useRef<HTMLTextAreaElement>(null);
  const frontEnTextareaRef = useRef<HTMLTextAreaElement>(null);
  const backEnTextareaRef = useRef<HTMLTextAreaElement>(null);
  const sideDartEnTextareaRef = useRef<HTMLTextAreaElement>(null);
  const tier4EnTextareaRef = useRef<HTMLTextAreaElement>(null);
  const notesTextareaRef = useRef<HTMLTextAreaElement>(null);
  const notesEnTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Helper for applying formatting to textareas naturally
  const applyFormatting = (
    textareaRef: React.RefObject<HTMLTextAreaElement | null>,
    currentText: string,
    setText: (val: string) => void,
    type: 'bold' | 'numbered' | 'bullet' | 'paragraph'
  ) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = currentText.substring(start, end);

    let newText = currentText;
    let newCursorPos = start;

    if (type === 'bold') {
      if (selected) {
        const wrapped = `**${selected}**`;
        newText = currentText.substring(0, start) + wrapped + currentText.substring(end);
        newCursorPos = start + wrapped.length;
      } else {
        const placeholder = `**Teks Tebal**`;
        newText = currentText.substring(0, start) + placeholder + currentText.substring(end);
        newCursorPos = start + 2;
      }
    } else if (type === 'numbered') {
      if (selected) {
        const lines = selected.split('\n');
        const formattedLines = lines.map((line, idx) => {
          const clean = line.replace(/^(\d+[\.\)]|\([0-9a-zA-Z]\)|[•\-\*–—])\s*/, '');
          return `${idx + 1}. ${clean}`;
        }).join('\n');
        newText = currentText.substring(0, start) + formattedLines + currentText.substring(end);
        newCursorPos = start + formattedLines.length;
      } else {
        const prefix = (start === 0 || currentText[start - 1] === '\n') ? '1. ' : '\n1. ';
        newText = currentText.substring(0, start) + prefix + currentText.substring(end);
        newCursorPos = start + prefix.length;
      }
    } else if (type === 'bullet') {
      if (selected) {
        const lines = selected.split('\n');
        const formattedLines = lines.map((line) => {
          const clean = line.replace(/^(\d+[\.\)]|\([0-9a-zA-Z]\)|[•\-\*–—])\s*/, '');
          return `• ${clean}`;
        }).join('\n');
        newText = currentText.substring(0, start) + formattedLines + currentText.substring(end);
        newCursorPos = start + formattedLines.length;
      } else {
        const prefix = (start === 0 || currentText[start - 1] === '\n') ? '• ' : '\n• ';
        newText = currentText.substring(0, start) + prefix + currentText.substring(end);
        newCursorPos = start + prefix.length;
      }
    } else if (type === 'paragraph') {
      const spacing = start === 0 ? '' : '\n\n';
      newText = currentText.substring(0, start) + spacing + currentText.substring(end);
      newCursorPos = start + spacing.length;
    }

    setText(newText);
    setTimeout(() => {
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  // Subscribe to Firebase Auth state
  useEffect(() => {
    const unsubscribe = subscribeAuthState((user) => {
      setCurrentUser(user);
      setIsAuthChecking(false);
    });
    return () => unsubscribe();
  }, []);

  // Subscribe to selected calculator changes in Firebase
  useEffect(() => {
    setIsLoading(true);
    // Reset pending upload previews and description feedback when switching calculator
    resetGuideState();
    resetPatternState();
    resetBackPatternState();
    resetFrontPatternState();
    resetSideDartState();
    resetTier4PatternState();
    setDescriptionSaveSuccess(false);
    setDescriptionSaveError(null);

    // Initial fetch
    getCalculatorImages(selectedCalcId).then((data) => {
      setCalculatorData(data);
      let defaultFront = '';
      let defaultBack = '';
      if (selectedCalcId === 'rok-pias-godet') {
        if (data.patternDescription && (data.patternDescription.includes('[POLA GODET]') || data.patternDescription.includes('[POLA BELAKANG]'))) {
          const splitMarker = data.patternDescription.includes('[POLA GODET]') ? '[POLA GODET]' : '[POLA BELAKANG]';
          const parts = data.patternDescription.split(splitMarker);
          defaultFront = parts[0].replace(/\[(POLA PIAS|POLA DEPAN)\]/, '').trim();
          defaultBack = parts[1]?.trim() || '';
        } else {
          defaultFront = DEFAULT_ROK_PIAS_INSTRUCTIONS;
          defaultBack = DEFAULT_ROK_GODET_INSTRUCTIONS;
        }
      }

      let defaultFrontEn = '';
      let defaultBackEn = '';
      if (selectedCalcId === 'rok-pias-godet' && data.patternDescription_en) {
        const splitMarkerEn = data.patternDescription_en.includes('[POLA GODET]')
          ? '[POLA GODET]'
          : data.patternDescription_en.includes('[GODET PATTERN]')
          ? '[GODET PATTERN]'
          : data.patternDescription_en.includes('[POLA BELAKANG]')
          ? '[POLA BELAKANG]'
          : '[BACK PATTERN]';
        if (data.patternDescription_en.includes(splitMarkerEn)) {
          const partsEn = data.patternDescription_en.split(splitMarkerEn);
          defaultFrontEn = partsEn[0].replace(/\[(POLA PIAS|POLA DEPAN|PANEL PATTERN|FRONT PATTERN)\]/, '').trim();
          defaultBackEn = partsEn[1]?.trim() || '';
        }
      }

      const isCelana = isPolaCelanaCalc(selectedCalcId);
      setFrontPatternDescriptionText(data.frontPatternDescription || (isCelana ? (data.patternDescription || '') : '') || defaultFront || (data.patternDescription && !data.backPatternDescription ? data.patternDescription : ''));
      setBackPatternDescriptionText(isCelana ? '' : (data.backPatternDescription || defaultBack || ''));
      setSideDartDescriptionText(data.sideDartDescription || data.kupnatDescription || '');
      setTier4PatternDescriptionText(data.tier4PatternDescription || '');

      setFrontPatternDescriptionEnText(data.frontPatternDescription_en || (isCelana ? (data.patternDescription_en || '') : '') || defaultFrontEn || (data.patternDescription_en && !data.backPatternDescription_en ? data.patternDescription_en : ''));
      setBackPatternDescriptionEnText(isCelana ? '' : (data.backPatternDescription_en || defaultBackEn || ''));
      setSideDartDescriptionEnText(data.sideDartDescription_en || data.kupnatDescription_en || '');
      setTier4PatternDescriptionEnText(data.tier4PatternDescription_en || '');

      let defaultNotesId = '';
      try {
        const calcCfg = getCalculatorConfig(selectedCalcId);
        if (calcCfg?.importantNotes && calcCfg.importantNotes.length > 0) {
          defaultNotesId = calcCfg.importantNotes.join('\n');
        }
      } catch {}

      if (data.importantNote_id !== undefined && data.importantNote_id !== null) {
        setImportantNoteIdText(data.importantNote_id);
      } else {
        setImportantNoteIdText(defaultNotesId);
      }
      setImportantNoteEnText(data.importantNote_en || '');

      setIsLoading(false);
    });

    // Real-time subscription
    const unsubscribe = subscribeCalculatorImages(selectedCalcId, (updated) => {
      setCalculatorData(updated);
      let defaultFront = '';
      let defaultBack = '';
      if (selectedCalcId === 'rok-pias-godet') {
        if (updated.patternDescription && (updated.patternDescription.includes('[POLA GODET]') || updated.patternDescription.includes('[POLA BELAKANG]'))) {
          const splitMarker = updated.patternDescription.includes('[POLA GODET]') ? '[POLA GODET]' : '[POLA BELAKANG]';
          const parts = updated.patternDescription.split(splitMarker);
          defaultFront = parts[0].replace(/\[(POLA PIAS|POLA DEPAN)\]/, '').trim();
          defaultBack = parts[1]?.trim() || '';
        } else {
          defaultFront = DEFAULT_ROK_PIAS_INSTRUCTIONS;
          defaultBack = DEFAULT_ROK_GODET_INSTRUCTIONS;
        }
      }

      let defaultFrontEn = '';
      let defaultBackEn = '';
      if (selectedCalcId === 'rok-pias-godet' && updated.patternDescription_en) {
        const splitMarkerEn = updated.patternDescription_en.includes('[POLA GODET]')
          ? '[POLA GODET]'
          : updated.patternDescription_en.includes('[GODET PATTERN]')
          ? '[GODET PATTERN]'
          : updated.patternDescription_en.includes('[POLA BELAKANG]')
          ? '[POLA BELAKANG]'
          : '[BACK PATTERN]';
        if (updated.patternDescription_en.includes(splitMarkerEn)) {
          const partsEn = updated.patternDescription_en.split(splitMarkerEn);
          defaultFrontEn = partsEn[0].replace(/\[(POLA PIAS|POLA DEPAN|PANEL PATTERN|FRONT PATTERN)\]/, '').trim();
          defaultBackEn = partsEn[1]?.trim() || '';
        }
      }

      const isCelana = isPolaCelanaCalc(selectedCalcId);
      setFrontPatternDescriptionText(updated.frontPatternDescription || (isCelana ? (updated.patternDescription || '') : '') || defaultFront || (updated.patternDescription && !updated.backPatternDescription ? updated.patternDescription : ''));
      setBackPatternDescriptionText(isCelana ? '' : (updated.backPatternDescription || defaultBack || ''));
      setSideDartDescriptionText(updated.sideDartDescription || updated.kupnatDescription || '');
      setTier4PatternDescriptionText(updated.tier4PatternDescription || '');

      setFrontPatternDescriptionEnText(updated.frontPatternDescription_en || (isCelana ? (updated.patternDescription_en || '') : '') || defaultFrontEn || (updated.patternDescription_en && !updated.backPatternDescription_en ? updated.patternDescription_en : ''));
      setBackPatternDescriptionEnText(isCelana ? '' : (updated.backPatternDescription_en || defaultBackEn || ''));
      setSideDartDescriptionEnText(updated.sideDartDescription_en || updated.kupnatDescription_en || '');
      setTier4PatternDescriptionEnText(updated.tier4PatternDescription_en || '');

      let defaultNotesSubId = '';
      try {
        const calcCfg = getCalculatorConfig(selectedCalcId);
        if (calcCfg?.importantNotes && calcCfg.importantNotes.length > 0) {
          defaultNotesSubId = calcCfg.importantNotes.join('\n');
        }
      } catch {}

      if (updated.importantNote_id !== undefined && updated.importantNote_id !== null) {
        setImportantNoteIdText(updated.importantNote_id);
      } else {
        setImportantNoteIdText(defaultNotesSubId);
      }
      setImportantNoteEnText(updated.importantNote_en || '');

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [selectedCalcId]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword) {
      setLoginError('Harap masukkan email dan kata sandi admin.');
      return;
    }
    setIsLoggingIn(true);
    setLoginError(null);
    try {
      await signInAdmin(loginEmail, loginPassword);
      setLoginPassword('');
    } catch (err: unknown) {
      console.error('[AdminImageManager] Login error:', err);
      const authErr = err as { code?: string; message?: string };
      let msg = 'Gagal masuk. Periksa kembali email dan kata sandi Anda.';
      if (
        authErr?.code === 'auth/invalid-credential' || 
        authErr?.code === 'auth/wrong-password' || 
        authErr?.code === 'auth/user-not-found' ||
        authErr?.code === 'auth/invalid-email'
      ) {
        msg = 'Email atau kata sandi yang Anda masukkan salah.';
      } else if (authErr?.code === 'auth/too-many-requests') {
        msg = 'Terlalu banyak percobaan gagal. Silakan coba beberapa saat lagi.';
      } else if (authErr?.message) {
        msg = `Gagal masuk: ${authErr.message}`;
      }
      setLoginError(msg);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOutAdmin();
    } catch (err) {
      console.error('[AdminImageManager] Logout error:', err);
    }
  };

  const resetGuideState = () => {
    if (guideUpload.previewUrl && guideUpload.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(guideUpload.previewUrl);
    }
    setGuideUpload({
      file: null,
      previewUrl: null,
      isUploading: false,
      error: null,
      success: false,
    });
    if (guideFileInputRef.current) guideFileInputRef.current.value = '';
  };

  const resetPatternState = () => {
    if (patternUpload.previewUrl && patternUpload.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(patternUpload.previewUrl);
    }
    setPatternUpload({
      file: null,
      previewUrl: null,
      isUploading: false,
      error: null,
      success: false,
    });
    if (patternFileInputRef.current) patternFileInputRef.current.value = '';
  };

  const resetBackPatternState = () => {
    if (backPatternUpload.previewUrl && backPatternUpload.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(backPatternUpload.previewUrl);
    }
    setBackPatternUpload({
      file: null,
      previewUrl: null,
      isUploading: false,
      error: null,
      success: false,
    });
    if (backPatternFileInputRef.current) backPatternFileInputRef.current.value = '';
  };

  const resetFrontPatternState = () => {
    if (frontPatternUpload.previewUrl && frontPatternUpload.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(frontPatternUpload.previewUrl);
    }
    setFrontPatternUpload({
      file: null,
      previewUrl: null,
      isUploading: false,
      error: null,
      success: false,
    });
    if (frontPatternFileInputRef.current) frontPatternFileInputRef.current.value = '';
  };

  const resetSideDartState = () => {
    if (sideDartUpload.previewUrl && sideDartUpload.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(sideDartUpload.previewUrl);
    }
    setSideDartUpload({
      file: null,
      previewUrl: null,
      isUploading: false,
      error: null,
      success: false,
    });
    if (sideDartFileInputRef.current) sideDartFileInputRef.current.value = '';
  };

  const resetTier4PatternState = () => {
    if (tier4PatternUpload.previewUrl && tier4PatternUpload.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(tier4PatternUpload.previewUrl);
    }
    setTier4PatternUpload({
      file: null,
      previewUrl: null,
      isUploading: false,
      error: null,
      success: false,
    });
    if (tier4PatternFileInputRef.current) tier4PatternFileInputRef.current.value = '';
  };

  const handleDressmakingFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    slot: CalculatorImageType
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image format
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      const errorMsg = 'Format file tidak didukung. Harap pilih file JPG, JPEG, PNG, atau WebP.';
      if (slot === 'dressmakingBackPatternImage' || slot === 'halfCirclePatternImage') {
        setBackPatternUpload(prev => ({ ...prev, error: errorMsg, success: false }));
      } else if (slot === 'dressmakingFrontPatternImage' || slot === 'fullCirclePatternImage') {
        setFrontPatternUpload(prev => ({ ...prev, error: errorMsg, success: false }));
      } else {
        setSideDartUpload(prev => ({ ...prev, error: errorMsg, success: false }));
      }
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    if (slot === 'dressmakingBackPatternImage' || slot === 'halfCirclePatternImage') {
      setBackPatternUpload({
        file,
        previewUrl,
        isUploading: false,
        error: null,
        success: false,
      });
    } else if (slot === 'dressmakingFrontPatternImage' || slot === 'fullCirclePatternImage') {
      setFrontPatternUpload({
        file,
        previewUrl,
        isUploading: false,
        error: null,
        success: false,
      });
    } else {
      setSideDartUpload({
        file,
        previewUrl,
        isUploading: false,
        error: null,
        success: false,
      });
    }
  };

  const handleSaveDressmakingImage = async (
    slot: CalculatorImageType
  ) => {
    let state = backPatternUpload;
    let setter = setBackPatternUpload;
    if (slot === 'dressmakingFrontPatternImage' || slot === 'fullCirclePatternImage') {
      state = frontPatternUpload;
      setter = setFrontPatternUpload;
    } else if (slot === 'dressmakingSideDartImage' || slot === 'detailPatternImage') {
      state = sideDartUpload;
      setter = setSideDartUpload;
    }

    if (!state.file) return;

    setter(prev => ({ ...prev, isUploading: true, error: null, success: false }));

    try {
      await uploadCalculatorImage(selectedCalcId, slot, state.file);
      setter({
        file: null,
        previewUrl: null,
        isUploading: false,
        error: null,
        success: true,
      });
      setTimeout(() => setter(prev => ({ ...prev, success: false })), 4000);
    } catch (err: unknown) {
      console.error(`[AdminImageManager] Error updating ${slot}:`, err);
      const errorObj = err as { message?: string };
      const detail = errorObj?.message ? ` (${errorObj.message})` : '';
      setter(prev => ({
        ...prev,
        isUploading: false,
        error: `Gambar gagal diperbarui. Gambar sebelumnya tetap digunakan.${detail}`,
        success: false,
      }));
    } finally {
      setter(prev => ({ ...prev, isUploading: false }));
    }
  };

  const handleRemoveDressmakingImage = (
    slot: CalculatorImageType,
    slotLabel: string
  ) => {
    setDeleteModal({
      isOpen: true,
      slot,
      slotLabel,
      isDressmaking: true,
      confirmMessage: `Tindakan ini akan menghapus file fisik ${slotLabel} dari Firebase Storage dan mengosongkan gambar di modul ini.`,
    });
  };

  const handleRemoveImage = (
    type: 'measurementGuideImage' | 'patternImage' | 'tier4PatternImage',
    typeLabel: string
  ) => {
    const isSharedSkirt = isSkirtCalculator(selectedCalcId) && type === 'measurementGuideImage';
    const isSharedBodice = isBodiceCalculator(selectedCalcId) && type === 'measurementGuideImage';
    const isSharedPants = isPantsCalculator(selectedCalcId) && type === 'measurementGuideImage';
    const isShared2MeasSkirt = isTwoMeasurementSkirtCalculator(selectedCalcId) && type === 'measurementGuideImage';
    const confirmMessage = isSharedSkirt
      ? `Perhatian: Gambar ini digunakan bersama oleh kalkulator rok (Sederhana, Dressmaking, Indonesia, Kerut Bertingkat, dan Pias & Godet). Tindakan ini akan mengosongkan gambar petunjuk pada modul rok dan membersihkan file fisik dari Firebase Storage.`
      : isSharedBodice
      ? `Perhatian: Gambar ini digunakan bersama oleh ketiga kalkulator pola dasar badan (Sederhana, Dressmaking, Indonesia). Tindakan ini akan mengosongkan gambar petunjuk pada ketiga modul badan dan membersihkan file fisik dari Firebase Storage.`
      : isSharedPants
      ? `Perhatian: Gambar ini digunakan bersama oleh kalkulator celana (Pola Kulot dan Celana Piyama). Tindakan ini akan mengosongkan gambar petunjuk pada kedua modul celana dan membersihkan file fisik dari Firebase Storage.`
      : isShared2MeasSkirt
      ? `Perhatian: Gambar ini digunakan bersama oleh kalkulator Rok Lingkaran & Rok Lipit Searah. Tindakan ini akan mengosongkan gambar petunjuk pada kedua modul rok dan membersihkan file fisik dari Firebase Storage.`
      : `Tindakan ini akan menghapus file fisik ${typeLabel} dari Firebase Storage dan mengosongkan gambar di modul ini.`;

    setDeleteModal({
      isOpen: true,
      slot: type,
      slotLabel: typeLabel,
      isDressmaking: false,
      confirmMessage,
    });
  };

  const executeConfirmedDeletion = async () => {
    if (!deleteModal) return;
    const { slot, slotLabel } = deleteModal;
    const isSharedSkirt = isSkirtCalculator(selectedCalcId) && slot === 'measurementGuideImage';
    const isSharedBodice = isBodiceCalculator(selectedCalcId) && slot === 'measurementGuideImage';
    const isSharedPants = isPantsCalculator(selectedCalcId) && slot === 'measurementGuideImage';
    const isShared2MeasSkirt = isTwoMeasurementSkirtCalculator(selectedCalcId) && slot === 'measurementGuideImage';

    setDeletingSlot(slot);
    setDeleteSuccessMsg(null);
    setDeleteErrorMsg(null);
    setDeleteModal(null);

    try {
      await removeCalculatorImage(selectedCalcId, slot);
      setCalculatorData((prev) => {
        if (!prev) return prev;
        const updated = { ...prev, [slot]: '' };
        if (updated.storagePaths) {
          const newPaths = { ...updated.storagePaths };
          delete newPaths[slot];
          updated.storagePaths = newPaths;
        }
        return updated;
      });
      setDeleteSuccessMsg(
        isSharedSkirt
          ? `${slotLabel} berhasil dihapus dari semua kalkulator rok dan file fisik Firebase Storage telah dibersihkan.`
          : isSharedBodice
          ? `${slotLabel} berhasil dihapus dari semua kalkulator pola dasar badan dan file fisik Firebase Storage telah dibersihkan.`
          : isSharedPants
          ? `${slotLabel} berhasil dihapus dari kalkulator Pola Kulot & Celana Piyama dan file fisik Firebase Storage telah dibersihkan.`
          : isShared2MeasSkirt
          ? `${slotLabel} berhasil dihapus dari kalkulator Rok Lingkaran & Rok Lipit Searah dan file fisik Firebase Storage telah dibersihkan.`
          : `${slotLabel} berhasil dihapus secara permanen dari Firebase Storage dan database.`
      );
      setTimeout(() => setDeleteSuccessMsg(null), 5000);
    } catch (err: unknown) {
      console.error(`[AdminImageManager] Error removing ${slot}:`, err);
      const errObj = err as { message?: string };
      const msg = errObj?.message || 'Gagal menghapus file dari Firebase Storage atau database.';
      setDeleteErrorMsg(`Gagal menghapus ${slotLabel}: ${msg}`);
    } finally {
      setDeletingSlot(null);
    }
  };

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'measurementGuideImage' | 'patternImage' | 'tier4PatternImage'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image format
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      const errorMsg = 'Format file tidak didukung. Harap pilih file JPG, JPEG, PNG, atau WebP.';
      if (type === 'measurementGuideImage') {
        setGuideUpload(prev => ({ ...prev, error: errorMsg, success: false }));
      } else if (type === 'tier4PatternImage') {
        setTier4PatternUpload(prev => ({ ...prev, error: errorMsg, success: false }));
      } else {
        setPatternUpload(prev => ({ ...prev, error: errorMsg, success: false }));
      }
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    if (type === 'measurementGuideImage') {
      setGuideUpload({
        file,
        previewUrl,
        isUploading: false,
        error: null,
        success: false,
      });
    } else if (type === 'tier4PatternImage') {
      setTier4PatternUpload({
        file,
        previewUrl,
        isUploading: false,
        error: null,
        success: false,
      });
    } else {
      setPatternUpload({
        file,
        previewUrl,
        isUploading: false,
        error: null,
        success: false,
      });
    }
  };

  const handleSaveImage = async (type: 'measurementGuideImage' | 'patternImage' | 'tier4PatternImage') => {
    const state = type === 'measurementGuideImage' ? guideUpload : type === 'tier4PatternImage' ? tier4PatternUpload : patternUpload;
    if (!state.file) return;

    // 1. Set saving = true
    if (type === 'measurementGuideImage') {
      setGuideUpload(prev => ({ ...prev, isUploading: true, error: null, success: false }));
    } else if (type === 'tier4PatternImage') {
      setTier4PatternUpload(prev => ({ ...prev, isUploading: true, error: null, success: false }));
    } else {
      setPatternUpload(prev => ({ ...prev, isUploading: true, error: null, success: false }));
    }

    try {
      // 2. Upload image, obtain URL, update Firestore
      await uploadCalculatorImage(selectedCalcId, type, state.file);
      
      // 3. Reset upload form and show success
      if (type === 'measurementGuideImage') {
        setGuideUpload({
          file: null,
          previewUrl: null,
          isUploading: false,
          error: null,
          success: true,
        });
        setTimeout(() => setGuideUpload(prev => ({ ...prev, success: false })), 4000);
      } else if (type === 'tier4PatternImage') {
        setTier4PatternUpload({
          file: null,
          previewUrl: null,
          isUploading: false,
          error: null,
          success: true,
        });
        setTimeout(() => setTier4PatternUpload(prev => ({ ...prev, success: false })), 4000);
      } else {
        setPatternUpload({
          file: null,
          previewUrl: null,
          isUploading: false,
          error: null,
          success: true,
        });
        setTimeout(() => setPatternUpload(prev => ({ ...prev, success: false })), 4000);
      }
    } catch (err: unknown) {
      console.error(`[AdminImageManager] Error updating ${type}:`, err);
      const errorObj = err as { message?: string };
      const detail = errorObj?.message ? ` (${errorObj.message})` : '';
      const errorMsg = `Gambar gagal diperbarui. Gambar sebelumnya tetap digunakan.${detail}`;
      
      if (type === 'measurementGuideImage') {
        setGuideUpload(prev => ({ ...prev, isUploading: false, error: errorMsg, success: false }));
      } else if (type === 'tier4PatternImage') {
        setTier4PatternUpload(prev => ({ ...prev, isUploading: false, error: errorMsg, success: false }));
      } else {
        setPatternUpload(prev => ({ ...prev, isUploading: false, error: errorMsg, success: false }));
      }
    } finally {
      // Guaranteed fallback: ensures button ALWAYS leaves loading state under any circumstance
      if (type === 'measurementGuideImage') {
        setGuideUpload(prev => ({ ...prev, isUploading: false }));
      } else if (type === 'tier4PatternImage') {
        setTier4PatternUpload(prev => ({ ...prev, isUploading: false }));
      } else {
        setPatternUpload(prev => ({ ...prev, isUploading: false }));
      }
    }
  };

  const handleSaveDescriptions = async () => {
    setIsSavingDescription(true);
    setDescriptionSaveSuccess(false);
    setDescriptionSaveError(null);

    try {
      await updateCalculatorPatternDescriptions(
        selectedCalcId,
        frontPatternDescriptionText,
        (isRokLipitSearah || isPolaCelana) ? '' : backPatternDescriptionText,
        sideDartDescriptionText,
        tier4PatternDescriptionText,
        frontPatternDescriptionEnText,
        (isRokLipitSearah || isPolaCelana) ? '' : backPatternDescriptionEnText,
        sideDartDescriptionEnText,
        tier4PatternDescriptionEnText,
        importantNoteIdText,
        importantNoteEnText
      );
      setDescriptionSaveSuccess(true);
      setTimeout(() => setDescriptionSaveSuccess(false), 4000);
    } catch (err: unknown) {
      console.error('[AdminImageManager] Error saving pattern descriptions:', err);
      const errorObj = err as { message?: string };
      const detail = errorObj?.message ? ` (${errorObj.message})` : '';
      setDescriptionSaveError(`Gagal menyimpan instruksi pola ke Firestore.${detail}`);
    } finally {
      setIsSavingDescription(false);
    }
  };

  const handleSaveSection = async (section: 'front' | 'back' | 'sideDart' | 'tier4' | 'notes') => {
    setSavingSection(section);
    setSectionSaveSuccess(null);
    setDescriptionSaveError(null);

    try {
      let idVal = '';
      let enVal = '';
      if (section === 'front') {
        idVal = frontPatternDescriptionText;
        enVal = frontPatternDescriptionEnText;
      } else if (section === 'back') {
        idVal = (isRokLipitSearah || isPolaCelana) ? '' : backPatternDescriptionText;
        enVal = (isRokLipitSearah || isPolaCelana) ? '' : backPatternDescriptionEnText;
      } else if (section === 'sideDart') {
        idVal = sideDartDescriptionText;
        enVal = sideDartDescriptionEnText;
      } else if (section === 'tier4') {
        idVal = tier4PatternDescriptionText;
        enVal = tier4PatternDescriptionEnText;
      } else if (section === 'notes') {
        idVal = importantNoteIdText;
        enVal = importantNoteEnText;
      }

      await updateCalculatorSectionDescription(selectedCalcId, section, idVal, enVal);
      setSectionSaveSuccess(section);
      setTimeout(() => setSectionSaveSuccess(null), 4000);
    } catch (err: unknown) {
      console.error(`[AdminImageManager] Error saving section ${section}:`, err);
      const errorObj = err as { message?: string };
      const detail = errorObj?.message ? ` (${errorObj.message})` : '';
      setDescriptionSaveError(`Gagal menyimpan bagian ini ke Firestore.${detail}`);
    } finally {
      setSavingSection(null);
    }
  };

  const handleClearNotes = async () => {
    setSavingSection('notes');
    setSectionSaveSuccess(null);
    setDescriptionSaveError(null);

    try {
      await clearCalculatorImportantNotes(selectedCalcId);
      setImportantNoteIdText('');
      setImportantNoteEnText('');
      setSectionSaveSuccess('notes');
      setTimeout(() => setSectionSaveSuccess(null), 4000);
    } catch (err: unknown) {
      console.error('[AdminImageManager] Error clearing important notes:', err);
      const errorObj = err as { message?: string };
      const detail = errorObj?.message ? ` (${errorObj.message})` : '';
      setDescriptionSaveError(`Gagal mengosongkan catatan penting di Firestore.${detail}`);
    } finally {
      setSavingSection(null);
    }
  };

  const selectedCalcObj = SUPPORTED_CALCULATORS.find(c => c.id === selectedCalcId);
  const isPants = isPantsCalculator(selectedCalcId);
  const pantsSharedGuideImg = isPants
    ? (() => {
        try {
          const cachedPiyama = localStorage.getItem(`lamoda_calc_img_pola-celana-piyama`);
          if (cachedPiyama) {
            const parsed = JSON.parse(cachedPiyama);
            return parsed.measurementGuideImage || '';
          }
        } catch {}
        return '';
      })()
    : '';

  const rawGuideImg = calculatorData?.measurementGuideImage || (isPants ? pantsSharedGuideImg : (DEFAULT_CALCULATOR_IMAGES[selectedCalcId]?.measurementGuideImage || ''));
  const currentGuideImg = (rawGuideImg && (rawGuideImg.startsWith('http') || rawGuideImg.startsWith('data:') || rawGuideImg.startsWith('blob:')))
    ? rawGuideImg
    : (isSkirtCalculator(selectedCalcId) ? (skirtMeasurementGuideImg || rawGuideImg || '/assets/skirt_measurement_guide.jpg') : (isPants ? pantsSharedGuideImg : rawGuideImg));
  const currentPatternImg = calculatorData?.patternImage || DEFAULT_CALCULATOR_IMAGES[selectedCalcId]?.patternImage || '';
  const currentTier4PatternImg = calculatorData?.tier4PatternImage || DEFAULT_CALCULATOR_IMAGES[selectedCalcId]?.tier4PatternImage || '';
  const isTieredSkirt = isTieredSkirtCalc(selectedCalcId);
  const isRokLipitSearah = isRokLipitSearahCalc(selectedCalcId);
  const isPolaCelana = isPolaCelanaCalc(selectedCalcId);
  const isRokPiasGodet = isRokPiasGodetCalc(selectedCalcId);

  // 1. Initial Auth Loading State
  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-[#FCFAF7] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw size={28} className="animate-spin text-[#8F2635]" />
          <p className="text-xs font-semibold text-[#6B5E57] tracking-wider uppercase">
            Memeriksa sesi otentikasi...
          </p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated Admin Login Screen
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#FCFAF7] text-[#332C29] flex flex-col selection:bg-[#8F2635] selection:text-white">
        {/* Header */}
        <header className="bg-[#FCFAF7]/95 backdrop-blur-sm border-b border-[#E8DED8] sticky top-0 z-30 shadow-2xs">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={onBackToStudentCalculator}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#DFD4CD] bg-white hover:bg-[#E8DED8] text-[#6B5E57] hover:text-[#332C29] text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Kembali ke Kalkulator Siswa</span>
            </button>

            <div className="flex items-center gap-2">
              <img
                src="/la-moda-logo.svg"
                alt="La MODA"
                className="h-7 w-auto object-contain select-none"
              />
              <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-[#8F2635] uppercase bg-[#8F2635]/10 px-2 py-0.5 rounded">
                ADMIN LOGIN
              </span>
            </div>
          </div>
        </header>

        {/* Login Card */}
        <main className="flex-1 max-w-md w-full mx-auto px-4 py-12 sm:py-16 flex flex-col justify-center">
          <div className="bg-white rounded-2xl border border-[#E8DED8] p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col items-center text-center pb-6 border-b border-[#E8DED8]">
              <div className="w-12 h-12 rounded-2xl bg-[#8F2635]/10 flex items-center justify-center text-[#8F2635] mb-3">
                <Lock size={22} />
              </div>
              <p className="text-[11px] font-mono font-bold tracking-[0.22em] text-[#8F2635] uppercase">
                LA MODA LEARNING STUDIO
              </p>
              <h1 className="font-serif text-2xl font-bold text-[#332C29] tracking-tight mt-1">
                Admin Image Manager
              </h1>
              <p className="text-xs text-[#6B5E57] mt-1.5">
                Masuk dengan akun administrator Firebase untuk mengunggah dan mengelola gambar instruksional.
              </p>
            </div>

            {loginError && (
              <div className="mt-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
                <AlertCircle size={16} className="shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#6B5E57] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Mail size={13} />
                  <span>Email Admin</span>
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@lamoda.com"
                  autoComplete="username"
                  className="w-full bg-[#FCFAF7] border border-[#DFD4CD] rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#332C29] placeholder-[#8C7D76]/60 focus:outline-none focus:ring-2 focus:ring-[#8F2635] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B5E57] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Lock size={13} />
                  <span>Kata Sandi</span>
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  className="w-full bg-[#FCFAF7] border border-[#DFD4CD] rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#332C29] placeholder-[#8C7D76]/60 focus:outline-none focus:ring-2 focus:ring-[#8F2635] focus:bg-white transition-all"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#8F2635] hover:bg-[#7A1F2D] active:bg-[#681925] text-white text-sm font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isLoggingIn ? (
                    <>
                      <RefreshCw size={15} className="animate-spin" />
                      <span>Memverifikasi Akun...</span>
                    </>
                  ) : (
                    <>
                      <LogIn size={15} />
                      <span>Masuk sebagai Administrator</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={onBackToStudentCalculator}
              className="text-xs text-[#8C7D76] hover:text-[#332C29] transition-colors cursor-pointer"
            >
              ← Kembali ke Mode Kalkulator Siswa
            </button>
          </div>
        </main>
      </div>
    );
  }

  // 3. Authenticated Admin Interface
  return (
    <div className="min-h-screen bg-[#FCFAF7] text-[#332C29] flex flex-col selection:bg-[#8F2635] selection:text-white">
      {/* Top Header Bar */}
      <header className="bg-[#FCFAF7]/95 backdrop-blur-sm border-b border-[#E8DED8] sticky top-0 z-30 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToStudentCalculator}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#DFD4CD] bg-white hover:bg-[#E8DED8] text-[#6B5E57] hover:text-[#332C29] text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
              title="Kembali ke Kalkulator Pola Siswa"
            >
              <ArrowLeft size={14} />
              <span>Kalkulator Siswa</span>
            </button>

            <div className="hidden sm:block h-5 w-[1px] bg-[#E8DED8]" />

            <div className="flex items-center gap-2">
              <img
                src="/la-moda-logo.svg"
                alt="La MODA"
                className="h-7 w-auto object-contain select-none"
              />
              <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-[#8F2635] uppercase bg-[#8F2635]/10 px-2 py-0.5 rounded">
                ADMIN
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Authenticated User Badge */}
            <div className="hidden md:flex items-center gap-1.5 text-xs text-[#332C29] font-medium bg-[#E8DED8]/60 px-3 py-1 rounded-full border border-[#DFD4CD]">
              <ShieldCheck size={14} className="text-[#8F2635]" />
              <span className="font-mono text-[11px] truncate max-w-[180px]">{currentUser.email}</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-[#5B7E38] font-medium bg-[#5B7E38]/10 px-2.5 py-1 rounded-full border border-[#5B7E38]/20">
              <span className="w-2 h-2 rounded-full bg-[#5B7E38] animate-pulse" />
              <span className="hidden sm:inline">Storage Authorized</span>
            </div>

            {/* Logout Action */}
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#DFD4CD] bg-white hover:bg-[#F3E7E7] text-[#8F2635] hover:text-[#7A1F2D] text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
              title="Keluar dari Akun Administrator"
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Admin Title Card */}
        <div className="bg-white rounded-2xl border border-[#E8DED8] p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E8DED8]">
            <div>
              <p className="text-xs font-mono font-bold tracking-[0.22em] text-[#8F2635] uppercase">
                LA MODA LEARNING STUDIO
              </p>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#332C29] tracking-tight mt-1">
                LA MODA CALCULATOR IMAGE MANAGER
              </h1>
              <p className="text-sm text-[#6B5E57] mt-1">
                Pusat manajemen penggantian gambar instruksional untuk seluruh aplikasi Kalkulator Pola La Moda.
              </p>
            </div>

            {/* Calculator Selector */}
            <div className="bg-[#FCFAF7] p-3.5 rounded-xl border border-[#DFD4CD] min-w-[280px]">
              <label htmlFor="calc-select" className="block text-xs font-bold text-[#6B5E57] uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Pilih Kalkulator</span>
                <span className="text-[10px] text-[#8F2635] font-mono">
                  {selectedCalcObj?.active ? '● Aktif' : '○ Segera'}
                </span>
              </label>
              <select
                id="calc-select"
                value={selectedCalcId}
                onChange={(e) => setSelectedCalcId(e.target.value)}
                className="w-full bg-white border border-[#DFD4CD] rounded-lg px-3 py-2 text-sm font-semibold text-[#332C29] focus:outline-none focus:ring-2 focus:ring-[#8F2635] cursor-pointer"
              >
                {SUPPORTED_CALCULATORS.map((calc) => (
                  <option key={calc.id} value={calc.id}>
                    {calc.name} {calc.active ? '' : '(Koneksi Baru)'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between text-xs text-[#6B5E57]">
            <div className="flex items-center gap-2">
              <Database size={13} className="text-[#8F2635]" />
              <span>Lokasi Data: <strong className="font-mono text-[#332C29]">calculators/{selectedCalcId}</strong></span>
            </div>
            {calculatorData?.updatedAt && (
              <span className="text-[11px] font-mono text-[#8C7D76]">
                Terakhir diupdate: {new Date(calculatorData.updatedAt).toLocaleString('id-ID')}
              </span>
            )}
          </div>
        </div>

        {/* Global Deletion Feedback Banner */}
        {deleteSuccessMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 animate-fadeIn shadow-xs">
            <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
            <span className="font-semibold">{deleteSuccessMsg}</span>
          </div>
        )}

        {deleteErrorMsg && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5 animate-fadeIn shadow-xs">
            <AlertCircle size={16} className="shrink-0 text-red-600" />
            <span className="font-semibold">{deleteErrorMsg}</span>
          </div>
        )}

        {/* Section 1: ILUSTRASI PETUNJUK PENGUKURAN (Omitted for rok-lingkaran) */}
        {selectedCalcId !== 'rok-lingkaran' && (
        <section className="bg-white rounded-2xl border border-[#E8DED8] shadow-sm overflow-hidden transition-all">
          <div className="px-6 py-4 bg-[#FCFAF7] border-b border-[#E8DED8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-[#332C29] tracking-wide">
                  ILUSTRASI PETUNJUK PENGUKURAN
                </h2>
                {isSkirtCalculator(selectedCalcId) && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/80">
                    <Sparkles size={11} className="text-amber-600" />
                    Asset Bersama (Kalkulator Rok)
                  </span>
                )}
                {isBodiceCalculator(selectedCalcId) && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/80">
                    <Sparkles size={11} className="text-amber-600" />
                    Asset Bersama (3 Kalkulator Pola Badan)
                  </span>
                )}
                {isPantsCalculator(selectedCalcId) && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/80">
                    <Sparkles size={11} className="text-amber-600" />
                    Asset Bersama (Pola Kulot & Celana Piyama)
                  </span>
                )}
                {isTwoMeasurementSkirtCalculator(selectedCalcId) && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/80">
                    <Sparkles size={11} className="text-amber-600" />
                    Asset Bersama (Rok Lingkaran & Rok Lipit Searah)
                  </span>
                )}
              </div>
              <p className="text-xs text-[#6B5E57] mt-0.5">
                {isSkirtCalculator(selectedCalcId) 
                  ? 'Gambar panduan posisi pita ukur tubuh (4 ukuran). Dikelola sebagai satu aset bersama yang terhubung langsung ke kalkulator rok (Sederhana, Dressmaking, Indonesia, Kerut Bertingkat, dan Pias & Godet).'
                  : isBodiceCalculator(selectedCalcId)
                  ? 'Gambar panduan posisi pita ukur tubuh wanita. Dikelola sebagai satu aset bersama yang terhubung langsung ke 3 kalkulator pola dasar badan (Sederhana, Dressmaking, dan Indonesia).'
                  : isPantsCalculator(selectedCalcId)
                  ? 'Gambar panduan posisi pita ukur tubuh. Dikelola sebagai satu aset bersama yang terhubung langsung ke 2 kalkulator celana (Pola Kulot dan Celana Piyama).'
                  : isTwoMeasurementSkirtCalculator(selectedCalcId)
                  ? 'Gambar panduan posisi pita ukur tubuh (Lingkar Pinggang & Panjang Rok). Dikelola sebagai satu aset bersama yang terhubung langsung ke kalkulator Rok Lingkaran & Setengah Lingkaran dan Rok Lipit Searah.'
                  : 'Gambar panduan posisi pita ukur tubuh.'
                }
              </p>
            </div>

            {/* Action: Ganti Gambar & Hapus */}
            <div className="flex items-center gap-2">
              {(calculatorData?.measurementGuideImage || (isPants && currentGuideImg)) && (
                <button
                  type="button"
                  onClick={() => handleRemoveImage('measurementGuideImage', 'Gambar Petunjuk Pengukuran')}
                  disabled={deletingSlot === 'measurementGuideImage' || guideUpload.isUploading}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 bg-red-50/60 hover:bg-red-100/80 text-red-700 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                  title="Hapus gambar dari Firebase Storage dan database"
                >
                  {deletingSlot === 'measurementGuideImage' ? (
                    <>
                      <RefreshCw size={13} className="animate-spin text-red-600" />
                      <span>Menghapus...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 size={13} />
                      <span className="hidden sm:inline">Hapus</span>
                    </>
                  )}
                </button>
              )}
              {selectedCalcId === 'pola-kulot' ? (
                <button
                  type="button"
                  onClick={() => setSelectedCalcId('pola-celana-piyama')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                  title="Beralih ke Celana Piyama untuk mengunggah atau mengganti gambar bersama"
                >
                  <ExternalLink size={14} />
                  <span>Kelola di Celana Piyama</span>
                </button>
              ) : (
                <>
                  <input
                    ref={guideFileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={(e) => handleFileSelect(e, 'measurementGuideImage')}
                    className="hidden"
                    id="upload-guide-input"
                  />
                  <button
                    type="button"
                    onClick={() => guideFileInputRef.current?.click()}
                    disabled={guideUpload.isUploading || deletingSlot === 'measurementGuideImage'}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#8F2635] hover:bg-[#7A1F2D] active:bg-[#681925] text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    <Upload size={14} />
                    <span>{calculatorData?.measurementGuideImage ? 'Ganti Gambar' : 'Upload Gambar'}</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Kulot Shared Illustration Info Banner */}
          {selectedCalcId === 'pola-kulot' && (
            <div className="mx-6 mt-4 p-3.5 rounded-xl bg-amber-50/90 border border-amber-200/90 text-amber-900 text-xs flex items-start gap-2.5">
              <Sparkles size={16} className="text-amber-700 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-amber-950">Aset Bersama Terpadu (Pola Kulot + Celana Piyama)</p>
                <p className="text-amber-800/90 leading-relaxed">
                  Ilustrasi petunjuk pengukuran Pola Kulot menggunakan 1 sumber gambar bersama yang terhubung langsung dengan Celana Piyama. Untuk menjaga konsistensi dan mencegah duplikasi, upload gambar baru dikelola terpusat melalui modul <strong>Celana Piyama</strong>.
                </p>
              </div>
            </div>
          )}

          {/* Feedback messages */}
          {guideUpload.error && (
            <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{guideUpload.error}</span>
            </div>
          )}

          {guideUpload.success && (
            <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 size={15} className="shrink-0 text-emerald-600" />
              <span>Gambar petunjuk pengukuran berhasil diperbarui dan disimpan ke Firebase!</span>
            </div>
          )}

          {/* Body Content */}
          <div className="p-6">
            {guideUpload.previewUrl ? (
              /* PREVIEW STATE: Current vs New */
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Current Stored Image */}
                  <div className="bg-[#FCFAF7] p-4 rounded-xl border border-[#E8DED8] flex flex-col items-center">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#6B5E57] mb-3">
                      Gambar Saat Ini
                    </p>
                    <div className="w-full h-80 flex items-center justify-center bg-white rounded-lg border border-[#E8DED8] overflow-hidden p-2">
                      {currentGuideImg ? (
                        <img
                          src={currentGuideImg}
                          alt="Current Measurement Guide"
                          className="max-h-full max-w-full object-contain"
                          onError={(e) => {
                            console.error('[ImageManager] Failed to load measurement guide image:', currentGuideImg);
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.parentElement?.querySelector('.img-fallback');
                            if (fallback) (fallback as HTMLElement).style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className="img-fallback hidden w-full h-full flex-col items-center justify-center text-xs text-[#8C7D76]">
                        <ImageIcon size={28} className="mb-2 text-[#DFD4CD]" />
                        <span>Gambar panduan belum tersedia.</span>
                      </div>
                    </div>
                  </div>

                  {/* New Image Preview */}
                  <div className="bg-[#FCFAF7] p-4 rounded-xl border-2 border-dashed border-[#8F2635]/40 flex flex-col items-center">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#8F2635] mb-3 flex items-center gap-1.5">
                      <Eye size={13} />
                      <span>Pratinjau Gambar Baru</span>
                    </p>
                    <div className="w-full h-80 flex items-center justify-center bg-white rounded-lg border border-[#E8DED8] overflow-hidden p-2">
                      <img
                        src={guideUpload.previewUrl}
                        alt="New Measurement Guide Preview"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    {guideUpload.file && (
                      <p className="text-[11px] font-mono text-[#6B5E57] mt-2">
                        {guideUpload.file.name} ({(guideUpload.file.size / 1024).toFixed(1)} KB)
                      </p>
                    )}
                  </div>
                </div>

                {/* Confirm Save Bar */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8DED8]">
                  <button
                    type="button"
                    onClick={resetGuideState}
                    disabled={guideUpload.isUploading}
                    className="px-4 py-2 rounded-xl border border-[#DFD4CD] bg-white hover:bg-[#E8DED8] text-[#6B5E57] text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveImage('measurementGuideImage')}
                    disabled={guideUpload.isUploading}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#8F2635] hover:bg-[#7A1F2D] text-white text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    {guideUpload.isUploading ? (
                      <>
                        <RefreshCw size={13} className="animate-spin" />
                        <span>Menyimpan ke Firebase...</span>
                      </>
                    ) : (
                      <>
                        <Check size={14} />
                        <span>Simpan Perubahan</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              /* DEFAULT STATE: Display Current Stored Image */
              <div className="flex flex-col items-center">
                <div className="w-full max-w-md h-96 flex items-center justify-center bg-[#FCFAF7] rounded-xl border border-[#E8DED8] p-4 relative">
                  {currentGuideImg ? (
                    <img
                      src={currentGuideImg}
                      alt="Instructional Measurement Guide"
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        console.error('[ImageManager] Failed to load measurement guide:', currentGuideImg);
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.parentElement?.querySelector('.img-fallback-default');
                        if (fallback) (fallback as HTMLElement).style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`img-fallback-default ${currentGuideImg ? 'hidden' : 'flex'} w-full h-full flex-col items-center justify-center text-xs text-[#8C7D76]`}>
                    <ImageIcon size={32} className="mb-2 text-[#DFD4CD]" />
                    <span>Gambar panduan belum tersedia.</span>
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <span className="text-[11px] font-mono text-[#6B5E57] bg-[#E8DED8] px-3 py-1 rounded-md">
                    Target Penyimpanan: {isSkirtCalculator(selectedCalcId)
                      ? 'calculators/shared/measurement-guides/ (Kalkulator Rok Bersama)'
                      : isBodiceCalculator(selectedCalcId)
                      ? 'calculators/shared/measurement-guides/bodice/ (3 Kalkulator Badan)'
                      : isPantsCalculator(selectedCalcId)
                      ? 'calculators/shared/measurement-guides/pants/ (Pola Kulot & Celana Piyama)'
                      : `calculators/${selectedCalcId}/measurementGuideImage`}
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>
        )}

        {/* Section 2: GAMBAR POLA */}
        {selectedCalcId === 'rok-lingkaran' ? (
          <div className="space-y-6">
            {/* Header for Kelola Gambar Pola Rok Lingkaran */}
            <div className="bg-[#FCFAF7] p-5 rounded-2xl border border-[#E8DED8] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#8F2635] text-white flex items-center justify-center font-bold shadow-xs">
                  <ImageIcon size={20} />
                </div>
                <div>
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-[#332C29]">
                    KELOLA GAMBAR POLA — ROK LINGKARAN
                  </h2>
                  <p className="text-xs text-[#6B5E57]">
                    Upload master gambar teknis pola secara terpisah untuk model Lingkaran Penuh dan Setengah Lingkaran.
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono font-bold text-[#8F2635] bg-[#F3E7E7] px-3 py-1 rounded-full border border-[#E8DED8] self-start sm:self-auto">
                2 Model Pola Terpisah
              </span>
            </div>

            {/* Slot 1: Rok Lingkaran Penuh */}
            <section className="bg-white rounded-2xl border border-[#E8DED8] shadow-sm overflow-hidden transition-all">
              <div className="px-6 py-4 bg-[#FCFAF7] border-b border-[#E8DED8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-[#8F2635] text-white text-xs font-mono font-bold flex items-center justify-center shadow-xs">
                    01
                  </span>
                  <div>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#332C29] tracking-wide flex items-center gap-2">
                      <span>UPLOAD POLA — ROK LINGKARAN PENUH</span>
                      <span className="text-[11px] font-mono text-[#8F2635] bg-[#F3E7E7] px-2 py-0.5 rounded border border-[#E8DED8]">
                        Lingkaran Penuh ⭕
                      </span>
                    </h3>
                    <p className="text-xs text-[#6B5E57]">
                      Gambar master blueprint teknis untuk Rok Lingkaran Penuh (Radius R = 1/6 LP − 0.5 cm).
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {(calculatorData?.fullCirclePatternImage || calculatorData?.patternImage) && (
                    <button
                      type="button"
                      onClick={() => handleRemoveDressmakingImage('fullCirclePatternImage', 'Gambar Rok Lingkaran Penuh')}
                      disabled={deletingSlot === 'fullCirclePatternImage' || frontPatternUpload.isUploading}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 bg-red-50/60 hover:bg-red-100/80 text-red-700 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                      title="Hapus Gambar Rok Lingkaran Penuh dari Firebase Storage dan database"
                    >
                      {deletingSlot === 'fullCirclePatternImage' ? (
                        <>
                          <RefreshCw size={13} className="animate-spin text-red-600" />
                          <span>Menghapus...</span>
                        </>
                      ) : (
                        <>
                          <Trash2 size={13} />
                          <span className="hidden sm:inline">Hapus</span>
                        </>
                      )}
                    </button>
                  )}
                  <input
                    ref={frontPatternFileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={(e) => handleDressmakingFileSelect(e, 'fullCirclePatternImage')}
                    className="hidden"
                    id="upload-full-circle-input"
                  />
                  <button
                    type="button"
                    onClick={() => frontPatternFileInputRef.current?.click()}
                    disabled={frontPatternUpload.isUploading || deletingSlot === 'fullCirclePatternImage'}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#8F2635] hover:bg-[#7A1F2D] active:bg-[#681925] text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    <Upload size={14} />
                    <span>{(calculatorData?.fullCirclePatternImage || calculatorData?.patternImage) ? 'Ganti Gambar' : 'Upload Gambar'}</span>
                  </button>
                </div>
              </div>

              {frontPatternUpload.error && (
                <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{frontPatternUpload.error}</span>
                </div>
              )}

              {frontPatternUpload.success && (
                <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 size={15} className="shrink-0 text-emerald-600" />
                  <span>Gambar Rok Lingkaran Penuh berhasil disimpan ke Firebase!</span>
                </div>
              )}

              <div className="p-6">
                {frontPatternUpload.previewUrl ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-[#FCFAF7] p-4 rounded-xl border border-[#E8DED8] flex flex-col items-center">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#6B5E57] mb-3">
                          Gambar Saat Ini
                        </p>
                        <div className="w-full h-72 flex items-center justify-center bg-white rounded-lg border border-[#E8DED8] overflow-hidden p-2">
                          {(calculatorData?.fullCirclePatternImage || calculatorData?.patternImage) ? (
                            <img
                              src={calculatorData?.fullCirclePatternImage || calculatorData?.patternImage || ''}
                              alt="Current Full Circle Pattern"
                              className="max-h-full max-w-full object-contain"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-xs text-[#8C7D76]">
                              <ImageIcon size={28} className="mb-2 text-[#DFD4CD]" />
                              <span>Gambar belum diunggah.</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-[#FCFAF7] p-4 rounded-xl border-2 border-dashed border-[#8F2635]/40 flex flex-col items-center">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#8F2635] mb-3 flex items-center gap-1.5">
                          <Eye size={13} />
                          <span>Pratinjau Gambar Baru</span>
                        </p>
                        <div className="w-full h-72 flex items-center justify-center bg-white rounded-lg border border-[#E8DED8] overflow-hidden p-2">
                          <img
                            src={frontPatternUpload.previewUrl}
                            alt="New Full Circle Pattern Preview"
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        {frontPatternUpload.file && (
                          <p className="text-[11px] font-mono text-[#6B5E57] mt-2">
                            {frontPatternUpload.file.name} ({(frontPatternUpload.file.size / 1024).toFixed(1)} KB)
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8DED8]">
                      <button
                        type="button"
                        onClick={resetFrontPatternState}
                        disabled={frontPatternUpload.isUploading}
                        className="px-4 py-2 rounded-xl border border-[#DFD4CD] bg-white hover:bg-[#E8DED8] text-[#6B5E57] text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveDressmakingImage('fullCirclePatternImage')}
                        disabled={frontPatternUpload.isUploading}
                        className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#8F2635] hover:bg-[#7A1F2D] text-white text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
                      >
                        {frontPatternUpload.isUploading ? (
                          <>
                            <RefreshCw size={13} className="animate-spin" />
                            <span>Menyimpan ke Firebase...</span>
                          </>
                        ) : (
                          <>
                            <Check size={14} />
                            <span>Simpan Perubahan</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-full max-w-md h-80 flex items-center justify-center bg-[#FCFAF7] rounded-xl border border-[#E8DED8] p-4 relative">
                      {(calculatorData?.fullCirclePatternImage || calculatorData?.patternImage) ? (
                        <img
                          src={calculatorData?.fullCirclePatternImage || calculatorData?.patternImage || ''}
                          alt="Pola Rok Lingkaran Penuh"
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-xs text-[#8C7D76]">
                          <ImageIcon size={32} className="mb-2 text-[#DFD4CD]" />
                          <span>Gambar Pola Rok Lingkaran Penuh belum diunggah.</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-3 text-center">
                      <span className="text-[11px] font-mono text-[#6B5E57] bg-[#E8DED8] px-3 py-1 rounded-md">
                        Target Penyimpanan: calculators/rok-lingkaran/pattern/full/
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Slot 2: Rok Setengah Lingkaran */}
            <section className="bg-white rounded-2xl border border-[#E8DED8] shadow-sm overflow-hidden transition-all">
              <div className="px-6 py-4 bg-[#FCFAF7] border-b border-[#E8DED8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-[#332C29] text-white text-xs font-mono font-bold flex items-center justify-center shadow-xs">
                    02
                  </span>
                  <div>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#332C29] tracking-wide flex items-center gap-2">
                      <span>UPLOAD POLA — ROK SETENGAH LINGKARAN</span>
                      <span className="text-[11px] font-mono text-[#332C29] bg-[#E8DED8] px-2 py-0.5 rounded border border-[#DFD4CD]">
                        Setengah Lingkaran 🌓
                      </span>
                    </h3>
                    <p className="text-xs text-[#6B5E57]">
                      Gambar master blueprint teknis untuk Rok Setengah Lingkaran (Radius R = 1/3 LP − 1 cm).
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {(calculatorData?.halfCirclePatternImage || calculatorData?.backPatternImage) && (
                    <button
                      type="button"
                      onClick={() => handleRemoveDressmakingImage('halfCirclePatternImage', 'Gambar Rok Setengah Lingkaran')}
                      disabled={deletingSlot === 'halfCirclePatternImage' || backPatternUpload.isUploading}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 bg-red-50/60 hover:bg-red-100/80 text-red-700 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                      title="Hapus Gambar Rok Setengah Lingkaran dari Firebase Storage dan database"
                    >
                      {deletingSlot === 'halfCirclePatternImage' ? (
                        <>
                          <RefreshCw size={13} className="animate-spin text-red-600" />
                          <span>Menghapus...</span>
                        </>
                      ) : (
                        <>
                          <Trash2 size={13} />
                          <span className="hidden sm:inline">Hapus</span>
                        </>
                      )}
                    </button>
                  )}
                  <input
                    ref={backPatternFileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={(e) => handleDressmakingFileSelect(e, 'halfCirclePatternImage')}
                    className="hidden"
                    id="upload-half-circle-input"
                  />
                  <button
                    type="button"
                    onClick={() => backPatternFileInputRef.current?.click()}
                    disabled={backPatternUpload.isUploading || deletingSlot === 'halfCirclePatternImage'}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#8F2635] hover:bg-[#7A1F2D] active:bg-[#681925] text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    <Upload size={14} />
                    <span>{(calculatorData?.halfCirclePatternImage || calculatorData?.backPatternImage) ? 'Ganti Gambar' : 'Upload Gambar'}</span>
                  </button>
                </div>
              </div>

              {backPatternUpload.error && (
                <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{backPatternUpload.error}</span>
                </div>
              )}

              {backPatternUpload.success && (
                <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 size={15} className="shrink-0 text-emerald-600" />
                  <span>Gambar Rok Setengah Lingkaran berhasil disimpan ke Firebase!</span>
                </div>
              )}

              <div className="p-6">
                {backPatternUpload.previewUrl ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-[#FCFAF7] p-4 rounded-xl border border-[#E8DED8] flex flex-col items-center">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#6B5E57] mb-3">
                          Gambar Saat Ini
                        </p>
                        <div className="w-full h-72 flex items-center justify-center bg-white rounded-lg border border-[#E8DED8] overflow-hidden p-2">
                          {(calculatorData?.halfCirclePatternImage || calculatorData?.backPatternImage) ? (
                            <img
                              src={calculatorData?.halfCirclePatternImage || calculatorData?.backPatternImage || ''}
                              alt="Current Half Circle Pattern"
                              className="max-h-full max-w-full object-contain"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-xs text-[#8C7D76]">
                              <ImageIcon size={28} className="mb-2 text-[#DFD4CD]" />
                              <span>Gambar belum diunggah.</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-[#FCFAF7] p-4 rounded-xl border-2 border-dashed border-[#8F2635]/40 flex flex-col items-center">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#8F2635] mb-3 flex items-center gap-1.5">
                          <Eye size={13} />
                          <span>Pratinjau Gambar Baru</span>
                        </p>
                        <div className="w-full h-72 flex items-center justify-center bg-white rounded-lg border border-[#E8DED8] overflow-hidden p-2">
                          <img
                            src={backPatternUpload.previewUrl}
                            alt="New Half Circle Pattern Preview"
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        {backPatternUpload.file && (
                          <p className="text-[11px] font-mono text-[#6B5E57] mt-2">
                            {backPatternUpload.file.name} ({(backPatternUpload.file.size / 1024).toFixed(1)} KB)
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8DED8]">
                      <button
                        type="button"
                        onClick={resetBackPatternState}
                        disabled={backPatternUpload.isUploading}
                        className="px-4 py-2 rounded-xl border border-[#DFD4CD] bg-white hover:bg-[#E8DED8] text-[#6B5E57] text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveDressmakingImage('halfCirclePatternImage')}
                        disabled={backPatternUpload.isUploading}
                        className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#8F2635] hover:bg-[#7A1F2D] text-white text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
                      >
                        {backPatternUpload.isUploading ? (
                          <>
                            <RefreshCw size={13} className="animate-spin" />
                            <span>Menyimpan ke Firebase...</span>
                          </>
                        ) : (
                          <>
                            <Check size={14} />
                            <span>Simpan Perubahan</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-full max-w-md h-80 flex items-center justify-center bg-[#FCFAF7] rounded-xl border border-[#E8DED8] p-4 relative">
                      {(calculatorData?.halfCirclePatternImage || calculatorData?.backPatternImage) ? (
                        <img
                          src={calculatorData?.halfCirclePatternImage || calculatorData?.backPatternImage || ''}
                          alt="Pola Rok Setengah Lingkaran"
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-xs text-[#8C7D76]">
                          <ImageIcon size={32} className="mb-2 text-[#DFD4CD]" />
                          <span>Gambar Pola Rok Setengah Lingkaran belum diunggah.</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-3 text-center">
                      <span className="text-[11px] font-mono text-[#6B5E57] bg-[#E8DED8] px-3 py-1 rounded-md">
                        Target Penyimpanan: calculators/rok-lingkaran/pattern/half/
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        ) : (selectedCalcId === 'badan-dressmaking' || selectedCalcId === 'badan-indonesia') ? (
          <div className="space-y-6">
            {/* Header for Kelola Gambar Pola */}
            <div className="bg-[#FCFAF7] p-5 rounded-2xl border border-[#E8DED8] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#8F2635] text-white flex items-center justify-center font-bold shadow-xs">
                  <ImageIcon size={20} />
                </div>
                <div>
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-[#332C29]">
                    KELOLA GAMBAR POLA
                  </h2>
                  <p className="text-xs text-[#6B5E57]">
                    {selectedCalcId === 'badan-indonesia'
                      ? `Kelola master gambar teknis pola untuk ${selectedCalcObj?.name || 'Pola Dasar Badan Sistem Indonesia'}.`
                      : `Kelola 3 master gambar teknis pola secara terpisah dan independen untuk ${selectedCalcObj?.name || 'Pola Badan'}.`}
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono font-bold text-[#8F2635] bg-[#F3E7E7] px-3 py-1 rounded-full border border-[#E8DED8] self-start sm:self-auto">
                {selectedCalcId === 'badan-indonesia' ? '1 Slot Gambar Master' : '3 Slot Gambar Independen'}
              </span>
            </div>

            {(() => {
              // Slot Pola Depan Component
              const frontPatternSlot = (slotIndex: string) => (
                <section key="slot-front" className="bg-white rounded-2xl border border-[#E8DED8] shadow-sm overflow-hidden transition-all">
                  <div className="px-6 py-4 bg-[#FCFAF7] border-b border-[#E8DED8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-[#8F2635] text-white text-xs font-mono font-bold flex items-center justify-center shadow-xs">
                        {slotIndex}
                      </span>
                      <div>
                        <h3 className="font-serif text-base sm:text-lg font-bold text-[#332C29] tracking-wide flex items-center gap-2">
                          <span>{selectedCalcId === 'badan-indonesia' ? 'Pola Badan Dasar Sistem Indonesia' : 'Pola Depan'}</span>
                          <span className="text-[11px] font-mono text-[#8F2635] bg-[#F3E7E7] px-2 py-0.5 rounded border border-[#E8DED8]">
                            {selectedCalcId === 'badan-indonesia' ? 'Pola Master 🔴' : 'Pola Depan 🔴'}
                          </span>
                        </h3>
                        <p className="text-xs text-[#6B5E57]">
                          {selectedCalcId === 'badan-indonesia'
                            ? 'Upload master pola / blueprint untuk Pola Badan Dasar Sistem Indonesia.'
                            : 'Upload master pola / blueprint khusus untuk Pola Depan.'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {calculatorData?.dressmakingFrontPatternImage && (
                        <button
                          type="button"
                          onClick={() => handleRemoveDressmakingImage('dressmakingFrontPatternImage', selectedCalcId === 'badan-indonesia' ? 'Gambar Pola Badan Dasar Sistem Indonesia' : 'Gambar Pola Depan')}
                          disabled={deletingSlot === 'dressmakingFrontPatternImage' || frontPatternUpload.isUploading}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 bg-red-50/60 hover:bg-red-100/80 text-red-700 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                          title={selectedCalcId === 'badan-indonesia' ? 'Hapus Gambar Pola dari Firebase Storage dan database' : 'Hapus Gambar Pola Depan dari Firebase Storage dan database'}
                        >
                          {deletingSlot === 'dressmakingFrontPatternImage' ? (
                            <>
                              <RefreshCw size={13} className="animate-spin text-red-600" />
                              <span>Menghapus...</span>
                            </>
                          ) : (
                            <>
                              <Trash2 size={13} />
                              <span className="hidden sm:inline">Hapus</span>
                            </>
                          )}
                        </button>
                      )}
                      <input
                        ref={frontPatternFileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={(e) => handleDressmakingFileSelect(e, 'dressmakingFrontPatternImage')}
                        className="hidden"
                        id="upload-front-pattern-input"
                      />
                      <button
                        type="button"
                        onClick={() => frontPatternFileInputRef.current?.click()}
                        disabled={frontPatternUpload.isUploading || deletingSlot === 'dressmakingFrontPatternImage'}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#8F2635] hover:bg-[#7A1F2D] active:bg-[#681925] text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
                      >
                        <Upload size={14} />
                        <span>{calculatorData?.dressmakingFrontPatternImage ? 'Ganti Gambar' : 'Upload Gambar'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Feedback messages */}
                  {frontPatternUpload.error && (
                    <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                      <AlertCircle size={15} className="shrink-0" />
                      <span>{frontPatternUpload.error}</span>
                    </div>
                  )}

                  {frontPatternUpload.success && (
                    <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn">
                      <CheckCircle2 size={15} className="shrink-0 text-emerald-600" />
                      <span>{selectedCalcId === 'badan-indonesia' ? 'Gambar Pola Badan Dasar Sistem Indonesia berhasil diperbarui dan disimpan ke Firebase!' : 'Gambar Pola Depan berhasil diperbarui dan disimpan ke Firebase!'}</span>
                    </div>
                  )}

                  {/* Body Content */}
                  <div className="p-6">
                    {frontPatternUpload.previewUrl ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-[#FCFAF7] p-4 rounded-xl border border-[#E8DED8] flex flex-col items-center">
                            <p className="text-xs font-bold uppercase tracking-wider text-[#6B5E57] mb-3">
                              Gambar Saat Ini
                            </p>
                            <div className="w-full h-72 flex items-center justify-center bg-white rounded-lg border border-[#E8DED8] overflow-hidden p-2">
                              {calculatorData?.dressmakingFrontPatternImage ? (
                                <img
                                  src={calculatorData.dressmakingFrontPatternImage}
                                  alt="Current Front Pattern"
                                  className="max-h-full max-w-full object-contain"
                                />
                              ) : (
                                <div className="flex flex-col items-center justify-center text-xs text-[#8C7D76]">
                                  <ImageIcon size={28} className="mb-2 text-[#DFD4CD]" />
                                  <span>Gambar belum diunggah.</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="bg-[#FCFAF7] p-4 rounded-xl border-2 border-dashed border-[#8F2635]/40 flex flex-col items-center">
                            <p className="text-xs font-bold uppercase tracking-wider text-[#8F2635] mb-3 flex items-center gap-1.5">
                              <Eye size={13} />
                              <span>Pratinjau Gambar Baru</span>
                            </p>
                            <div className="w-full h-72 flex items-center justify-center bg-white rounded-lg border border-[#E8DED8] overflow-hidden p-2">
                              <img
                                src={frontPatternUpload.previewUrl}
                                alt="New Front Pattern Preview"
                                className="max-h-full max-w-full object-contain"
                              />
                            </div>
                            {frontPatternUpload.file && (
                              <p className="text-[11px] font-mono text-[#6B5E57] mt-2">
                                {frontPatternUpload.file.name} ({(frontPatternUpload.file.size / 1024).toFixed(1)} KB)
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8DED8]">
                          <button
                            type="button"
                            onClick={resetFrontPatternState}
                            disabled={frontPatternUpload.isUploading}
                            className="px-4 py-2 rounded-xl border border-[#DFD4CD] bg-white hover:bg-[#E8DED8] text-[#6B5E57] text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                          >
                            Batal
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveDressmakingImage('dressmakingFrontPatternImage')}
                            disabled={frontPatternUpload.isUploading}
                            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#8F2635] hover:bg-[#7A1F2D] text-white text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
                          >
                            {frontPatternUpload.isUploading ? (
                              <>
                                <RefreshCw size={13} className="animate-spin" />
                                <span>Menyimpan ke Firebase...</span>
                              </>
                            ) : (
                              <>
                                <Check size={14} />
                                <span>Simpan Perubahan</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="w-full max-w-md h-80 flex items-center justify-center bg-[#FCFAF7] rounded-xl border border-[#E8DED8] p-4 relative">
                          {calculatorData?.dressmakingFrontPatternImage ? (
                            <img
                              src={calculatorData.dressmakingFrontPatternImage}
                              alt={selectedCalcId === 'badan-indonesia' ? 'Pola Badan Dasar Sistem Indonesia' : 'Pola Depan'}
                              className="max-h-full max-w-full object-contain"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-xs text-[#8C7D76]">
                              <ImageIcon size={32} className="mb-2 text-[#DFD4CD]" />
                              <span>{selectedCalcId === 'badan-indonesia' ? 'Gambar Pola Badan Dasar Sistem Indonesia belum diunggah.' : 'Gambar Pola Depan belum diunggah.'}</span>
                            </div>
                          )}
                        </div>
                        <div className="mt-3 text-center">
                          <span className="text-[11px] font-mono text-[#6B5E57] bg-[#E8DED8] px-3 py-1 rounded-md">
                            Target Penyimpanan: calculators/{selectedCalcId}/pattern/front/
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              );

              // Slot Pola Belakang Component
              const backPatternSlot = (slotIndex: string) => (
                <section key="slot-back" className="bg-white rounded-2xl border border-[#E8DED8] shadow-sm overflow-hidden transition-all">
                  <div className="px-6 py-4 bg-[#FCFAF7] border-b border-[#E8DED8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-[#1D4ED8] text-white text-xs font-mono font-bold flex items-center justify-center shadow-xs">
                        {slotIndex}
                      </span>
                      <div>
                        <h3 className="font-serif text-base sm:text-lg font-bold text-[#332C29] tracking-wide flex items-center gap-2">
                          <span>Pola Belakang</span>
                          <span className="text-[11px] font-mono text-[#1D4ED8] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            Pola Belakang 🔵
                          </span>
                        </h3>
                        <p className="text-xs text-[#6B5E57]">
                          Upload master pola / blueprint khusus untuk Pola Belakang.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {calculatorData?.dressmakingBackPatternImage && (
                        <button
                          type="button"
                          onClick={() => handleRemoveDressmakingImage('dressmakingBackPatternImage', 'Gambar Pola Belakang')}
                          disabled={deletingSlot === 'dressmakingBackPatternImage' || backPatternUpload.isUploading}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 bg-red-50/60 hover:bg-red-100/80 text-red-700 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                          title="Hapus Gambar Pola Belakang dari Firebase Storage dan database"
                        >
                          {deletingSlot === 'dressmakingBackPatternImage' ? (
                            <>
                              <RefreshCw size={13} className="animate-spin text-red-600" />
                              <span>Menghapus...</span>
                            </>
                          ) : (
                            <>
                              <Trash2 size={13} />
                              <span className="hidden sm:inline">Hapus</span>
                            </>
                          )}
                        </button>
                      )}
                      <input
                        ref={backPatternFileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={(e) => handleDressmakingFileSelect(e, 'dressmakingBackPatternImage')}
                        className="hidden"
                        id="upload-back-pattern-input"
                      />
                      <button
                        type="button"
                        onClick={() => backPatternFileInputRef.current?.click()}
                        disabled={backPatternUpload.isUploading || deletingSlot === 'dressmakingBackPatternImage'}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1D4ED8] hover:bg-[#1E40AF] active:bg-[#1E3A8A] text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
                      >
                        <Upload size={14} />
                        <span>{calculatorData?.dressmakingBackPatternImage ? 'Ganti Gambar' : 'Upload Gambar'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Feedback messages */}
                  {backPatternUpload.error && (
                    <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                      <AlertCircle size={15} className="shrink-0" />
                      <span>{backPatternUpload.error}</span>
                    </div>
                  )}

                  {backPatternUpload.success && (
                    <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn">
                      <CheckCircle2 size={15} className="shrink-0 text-emerald-600" />
                      <span>Gambar Pola Belakang berhasil diperbarui dan disimpan ke Firebase!</span>
                    </div>
                  )}

                  {/* Body Content */}
                  <div className="p-6">
                    {backPatternUpload.previewUrl ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-[#FCFAF7] p-4 rounded-xl border border-[#E8DED8] flex flex-col items-center">
                            <p className="text-xs font-bold uppercase tracking-wider text-[#6B5E57] mb-3">
                              Gambar Saat Ini
                            </p>
                            <div className="w-full h-72 flex items-center justify-center bg-white rounded-lg border border-[#E8DED8] overflow-hidden p-2">
                              {calculatorData?.dressmakingBackPatternImage ? (
                                <img
                                  src={calculatorData.dressmakingBackPatternImage}
                                  alt="Current Back Pattern"
                                  className="max-h-full max-w-full object-contain"
                                />
                              ) : (
                                <div className="flex flex-col items-center justify-center text-xs text-[#8C7D76]">
                                  <ImageIcon size={28} className="mb-2 text-[#DFD4CD]" />
                                  <span>Gambar belum diunggah.</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="bg-[#FCFAF7] p-4 rounded-xl border-2 border-dashed border-[#1D4ED8]/40 flex flex-col items-center">
                            <p className="text-xs font-bold uppercase tracking-wider text-[#1D4ED8] mb-3 flex items-center gap-1.5">
                              <Eye size={13} />
                              <span>Pratinjau Gambar Baru</span>
                            </p>
                            <div className="w-full h-72 flex items-center justify-center bg-white rounded-lg border border-[#E8DED8] overflow-hidden p-2">
                              <img
                                src={backPatternUpload.previewUrl}
                                alt="New Back Pattern Preview"
                                className="max-h-full max-w-full object-contain"
                              />
                            </div>
                            {backPatternUpload.file && (
                              <p className="text-[11px] font-mono text-[#6B5E57] mt-2">
                                {backPatternUpload.file.name} ({(backPatternUpload.file.size / 1024).toFixed(1)} KB)
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8DED8]">
                          <button
                            type="button"
                            onClick={resetBackPatternState}
                            disabled={backPatternUpload.isUploading}
                            className="px-4 py-2 rounded-xl border border-[#DFD4CD] bg-white hover:bg-[#E8DED8] text-[#6B5E57] text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                          >
                            Batal
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveDressmakingImage('dressmakingBackPatternImage')}
                            disabled={backPatternUpload.isUploading}
                            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
                          >
                            {backPatternUpload.isUploading ? (
                              <>
                                <RefreshCw size={13} className="animate-spin" />
                                <span>Menyimpan ke Firebase...</span>
                              </>
                            ) : (
                              <>
                                <Check size={14} />
                                <span>Simpan Perubahan</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="w-full max-w-md h-80 flex items-center justify-center bg-[#FCFAF7] rounded-xl border border-[#E8DED8] p-4 relative">
                          {calculatorData?.dressmakingBackPatternImage ? (
                            <img
                              src={calculatorData.dressmakingBackPatternImage}
                              alt="Pola Belakang"
                              className="max-h-full max-w-full object-contain"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-xs text-[#8C7D76]">
                              <ImageIcon size={32} className="mb-2 text-[#DFD4CD]" />
                              <span>Gambar Pola Belakang belum diunggah.</span>
                            </div>
                          )}
                        </div>
                        <div className="mt-3 text-center">
                          <span className="text-[11px] font-mono text-[#6B5E57] bg-[#E8DED8] px-3 py-1 rounded-md">
                            Target Penyimpanan: calculators/{selectedCalcId}/pattern/back/
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              );

              // Slot Detail / Side Dart Component
              const detailPatternSlot = (slotIndex: string) => (
                <section key="slot-detail" className="bg-white rounded-2xl border border-[#E8DED8] shadow-sm overflow-hidden transition-all">
                  <div className="px-6 py-4 bg-[#FCFAF7] border-b border-[#E8DED8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-[#8F2635] text-white text-xs font-mono font-bold flex items-center justify-center shadow-xs">
                        {slotIndex}
                      </span>
                      <div>
                        <h3 className="font-serif text-base sm:text-lg font-bold text-[#332C29] tracking-wide flex items-center gap-2">
                          <span>{selectedCalcId === 'badan-indonesia' ? 'Detail Pola / Kupnat' : 'Detail Kupnat Sisi — Pola Depan'}</span>
                          <span className="text-[11px] font-mono text-[#8F2635] bg-[#F3E7E7] px-2 py-0.5 rounded border border-[#E8DED8]">
                            {selectedCalcId === 'badan-indonesia' ? 'Detail Pola 🔴' : 'Detail Kupnat 🔴'}
                          </span>
                        </h3>
                        <p className="text-xs text-[#6B5E57]">
                          {selectedCalcId === 'badan-indonesia'
                            ? 'Upload ilustrasi detail konstruksi kupnat / detail teknis pola sistem Indonesia.'
                            : 'Upload ilustrasi petunjuk detail pembentukan Kupnat Sisi pada Pola Depan.'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {(calculatorData?.dressmakingSideDartImage || calculatorData?.sideDartDetailImage) && (
                        <button
                          type="button"
                          onClick={() => handleRemoveDressmakingImage('dressmakingSideDartImage', 'Gambar Detail Pola')}
                          disabled={deletingSlot === 'dressmakingSideDartImage' || sideDartUpload.isUploading}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 bg-red-50/60 hover:bg-red-100/80 text-red-700 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                          title="Hapus Gambar Detail Pola dari Firebase Storage dan database"
                        >
                          {deletingSlot === 'dressmakingSideDartImage' ? (
                            <>
                              <RefreshCw size={13} className="animate-spin text-red-600" />
                              <span>Menghapus...</span>
                            </>
                          ) : (
                            <>
                              <Trash2 size={13} />
                              <span className="hidden sm:inline">Hapus</span>
                            </>
                          )}
                        </button>
                      )}
                      <input
                        ref={sideDartFileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={(e) => handleDressmakingFileSelect(e, 'dressmakingSideDartImage')}
                        className="hidden"
                        id="upload-side-dart-input"
                      />
                      <button
                        type="button"
                        onClick={() => sideDartFileInputRef.current?.click()}
                        disabled={sideDartUpload.isUploading || deletingSlot === 'dressmakingSideDartImage'}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#8F2635] hover:bg-[#7A1F2D] active:bg-[#681925] text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
                      >
                        <Upload size={14} />
                        <span>{(calculatorData?.dressmakingSideDartImage || calculatorData?.sideDartDetailImage) ? 'Ganti Gambar' : 'Upload Gambar'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Feedback messages */}
                  {sideDartUpload.error && (
                    <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                      <AlertCircle size={15} className="shrink-0" />
                      <span>{sideDartUpload.error}</span>
                    </div>
                  )}

                  {sideDartUpload.success && (
                    <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn">
                      <CheckCircle2 size={15} className="shrink-0 text-emerald-600" />
                      <span>Gambar Detail berhasil diperbarui dan disimpan ke Firebase!</span>
                    </div>
                  )}

                  {/* Body Content */}
                  <div className="p-6">
                    {sideDartUpload.previewUrl ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-[#FCFAF7] p-4 rounded-xl border border-[#E8DED8] flex flex-col items-center">
                            <p className="text-xs font-bold uppercase tracking-wider text-[#6B5E57] mb-3">
                              Gambar Saat Ini
                            </p>
                            <div className="w-full h-72 flex items-center justify-center bg-white rounded-lg border border-[#E8DED8] overflow-hidden p-2">
                              {(calculatorData?.dressmakingSideDartImage || calculatorData?.sideDartDetailImage) ? (
                                <img
                                  src={calculatorData.dressmakingSideDartImage || calculatorData?.sideDartDetailImage}
                                  alt="Current Side Dart Detail"
                                  className="max-h-full max-w-full object-contain"
                                />
                              ) : (
                                <div className="flex flex-col items-center justify-center text-xs text-[#8C7D76]">
                                  <ImageIcon size={28} className="mb-2 text-[#DFD4CD]" />
                                  <span>Gambar belum diunggah.</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="bg-[#FCFAF7] p-4 rounded-xl border-2 border-dashed border-[#8F2635]/40 flex flex-col items-center">
                            <p className="text-xs font-bold uppercase tracking-wider text-[#8F2635] mb-3 flex items-center gap-1.5">
                              <Eye size={13} />
                              <span>Pratinjau Gambar Baru</span>
                            </p>
                            <div className="w-full h-72 flex items-center justify-center bg-white rounded-lg border border-[#E8DED8] overflow-hidden p-2">
                              <img
                                src={sideDartUpload.previewUrl}
                                alt="New Detail Preview"
                                className="max-h-full max-w-full object-contain"
                              />
                            </div>
                            {sideDartUpload.file && (
                              <p className="text-[11px] font-mono text-[#6B5E57] mt-2">
                                {sideDartUpload.file.name} ({(sideDartUpload.file.size / 1024).toFixed(1)} KB)
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8DED8]">
                          <button
                            type="button"
                            onClick={resetSideDartState}
                            disabled={sideDartUpload.isUploading}
                            className="px-4 py-2 rounded-xl border border-[#DFD4CD] bg-white hover:bg-[#E8DED8] text-[#6B5E57] text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                          >
                            Batal
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveDressmakingImage('dressmakingSideDartImage')}
                            disabled={sideDartUpload.isUploading}
                            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#8F2635] hover:bg-[#7A1F2D] text-white text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
                          >
                            {sideDartUpload.isUploading ? (
                              <>
                                <RefreshCw size={13} className="animate-spin" />
                                <span>Menyimpan ke Firebase...</span>
                              </>
                            ) : (
                              <>
                                <Check size={14} />
                                <span>Simpan Perubahan</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="w-full max-w-md h-80 flex items-center justify-center bg-[#FCFAF7] rounded-xl border border-[#E8DED8] p-4 relative">
                          {(calculatorData?.dressmakingSideDartImage || calculatorData?.sideDartDetailImage) ? (
                            <img
                              src={calculatorData.dressmakingSideDartImage || calculatorData?.sideDartDetailImage}
                              alt="Detail Kupnat"
                              className="max-h-full max-w-full object-contain"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-xs text-[#8C7D76]">
                              <ImageIcon size={32} className="mb-2 text-[#DFD4CD]" />
                              <span>Gambar Detail belum diunggah.</span>
                            </div>
                          )}
                        </div>
                        <div className="mt-3 text-center">
                          <span className="text-[11px] font-mono text-[#6B5E57] bg-[#E8DED8] px-3 py-1 rounded-md">
                            Target Penyimpanan: calculators/{selectedCalcId}/pattern/detail/
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              );

              // Render order: Indonesia = Only 1 slot (Pola Badan Dasar Sistem Indonesia); Dressmaking = Back -> Front -> Detail
              if (selectedCalcId === 'badan-indonesia') {
                return (
                  <>
                    {frontPatternSlot('01')}
                  </>
                );
              }

              return (
                <>
                  {backPatternSlot('01')}
                  {frontPatternSlot('02')}
                  {detailPatternSlot('03')}
                </>
              );
            })()}
          </div>
        ) : isTieredSkirt ? (
          /* DEDICATED SECTION FOR ROK KERUT BERTINGKAT (Pola Tingkat 3 & Pola Tingkat 4) */
          <div className="space-y-6">
            {/* Header for Kelola Gambar Pola Rok Kerut Bertingkat */}
            <div className="bg-[#FCFAF7] p-5 rounded-2xl border border-[#E8DED8] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#8F2635] text-white flex items-center justify-center font-bold shadow-xs">
                  <ImageIcon size={20} />
                </div>
                <div>
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-[#332C29]">
                    KELOLA GAMBAR POLA — ROK KERUT BERTINGKAT
                  </h2>
                  <p className="text-xs text-[#6B5E57]">
                    Upload master gambar teknis pola secara terpisah untuk Pola Tingkat 3 (2 & 3 tingkatan) dan Pola Tingkat 4 (4, 5, & 6 tingkatan).
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono font-bold text-[#8F2635] bg-[#F3E7E7] px-3 py-1 rounded-full border border-[#E8DED8] self-start sm:self-auto">
                2 Model Pola Terpisah
              </span>
            </div>

            {/* Slot 1: Pola Tingkat 3 (digunakan untuk 2 & 3 tingkatan) */}
            <section className="bg-white rounded-2xl border border-[#E8DED8] shadow-sm overflow-hidden transition-all">
              <div className="px-6 py-4 bg-[#FCFAF7] border-b border-[#E8DED8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-[#8F2635] text-white text-xs font-mono font-bold flex items-center justify-center shadow-xs">
                    01
                  </span>
                  <div>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#332C29] tracking-wide flex items-center gap-2">
                      <span>Pola Tingkat 3 (digunakan untuk 2 & 3 tingkatan)</span>
                      <span className="text-[11px] font-mono text-[#8F2635] bg-[#F3E7E7] px-2 py-0.5 rounded border border-[#E8DED8]">
                        2 & 3 Tingkatan
                      </span>
                    </h3>
                    <p className="text-xs text-[#6B5E57]">
                      Gambar master teknis yang ditampilkan otomatis saat siswa memilih 2 atau 3 tingkatan rok.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {currentPatternImg && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImage('patternImage', 'Pola Tingkat 3')}
                      disabled={deletingSlot === 'patternImage' || patternUpload.isUploading}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 bg-red-50/60 hover:bg-red-100/80 text-red-700 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                      title="Hapus Pola Tingkat 3 dari Firebase Storage dan database"
                    >
                      {deletingSlot === 'patternImage' ? (
                        <>
                          <RefreshCw size={13} className="animate-spin text-red-600" />
                          <span>Menghapus...</span>
                        </>
                      ) : (
                        <>
                          <Trash2 size={13} />
                          <span className="hidden sm:inline">Hapus</span>
                        </>
                      )}
                    </button>
                  )}
                  <input
                    ref={patternFileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={(e) => handleFileSelect(e, 'patternImage')}
                    className="hidden"
                    id="upload-tier3-pattern-input"
                  />
                  <button
                    type="button"
                    onClick={() => patternFileInputRef.current?.click()}
                    disabled={patternUpload.isUploading || deletingSlot === 'patternImage'}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#8F2635] hover:bg-[#7A1F2D] active:bg-[#681925] text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    <Upload size={14} />
                    <span>{currentPatternImg ? 'Ganti Gambar' : 'Upload Gambar'}</span>
                  </button>
                </div>
              </div>

              {/* Feedback messages */}
              {patternUpload.error && (
                <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{patternUpload.error}</span>
                </div>
              )}

              {patternUpload.success && (
                <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 size={15} className="shrink-0 text-emerald-600" />
                  <span>Gambar Pola Tingkat 3 berhasil diperbarui dan disimpan ke Firebase!</span>
                </div>
              )}

              {/* Body Content */}
              <div className="p-6">
                {patternUpload.previewUrl ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-[#FCFAF7] p-4 rounded-xl border border-[#E8DED8] flex flex-col items-center">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#6B5E57] mb-3">
                          Gambar Pola Tingkat 3 Saat Ini
                        </p>
                        <div className="w-full h-80 flex items-center justify-center bg-white rounded-lg border border-[#E8DED8] overflow-hidden p-2">
                          {currentPatternImg ? (
                            <img
                              src={currentPatternImg}
                              alt="Current Tier 3 Pattern"
                              className="max-h-full max-w-full object-contain"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-xs text-[#8C7D76]">
                              <ImageIcon size={28} className="mb-2 text-[#DFD4CD]" />
                              <span>Pola Tingkat 3 belum tersedia.</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-[#FCFAF7] p-4 rounded-xl border border-[#8F2635]/30 flex flex-col items-center">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#8F2635] mb-3 flex items-center gap-1.5">
                          <Check size={14} />
                          Pratinjau Gambar Baru (Pola Tingkat 3)
                        </p>
                        <div className="w-full h-80 flex items-center justify-center bg-white rounded-lg border border-[#8F2635]/20 overflow-hidden p-2">
                          <img
                            src={patternUpload.previewUrl}
                            alt="New Tier 3 Pattern Preview"
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        {patternUpload.file && (
                          <p className="text-[11px] font-mono text-[#6B5E57] mt-2">
                            {patternUpload.file.name} ({(patternUpload.file.size / 1024).toFixed(1)} KB)
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8DED8]">
                      <button
                        type="button"
                        onClick={resetPatternState}
                        disabled={patternUpload.isUploading}
                        className="px-4 py-2 rounded-xl border border-[#DFD4CD] bg-white hover:bg-[#E8DED8] text-[#6B5E57] text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveImage('patternImage')}
                        disabled={patternUpload.isUploading}
                        className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#8F2635] hover:bg-[#7A1F2D] text-white text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
                      >
                        {patternUpload.isUploading ? (
                          <>
                            <RefreshCw size={13} className="animate-spin" />
                            <span>Menyimpan ke Firebase...</span>
                          </>
                        ) : (
                          <>
                            <Check size={14} />
                            <span>Simpan Perubahan</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-full max-w-md h-80 flex items-center justify-center bg-[#FCFAF7] rounded-xl border border-[#E8DED8] p-4 relative">
                      {currentPatternImg ? (
                        <img
                          src={currentPatternImg}
                          alt="Pola Tingkat 3"
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-xs text-[#8C7D76]">
                          <ImageIcon size={32} className="mb-2 text-[#DFD4CD]" />
                          <span>Pola Tingkat 3 belum diunggah.</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-3 text-center">
                      <span className="text-[11px] font-mono text-[#6B5E57] bg-[#E8DED8] px-3 py-1 rounded-md">
                        Target Penyimpanan: calculators/{selectedCalcId}/patternImage
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Slot 2: Pola Tingkat 4 (digunakan untuk 4, 5, & 6 tingkatan) */}
            <section className="bg-white rounded-2xl border border-[#E8DED8] shadow-sm overflow-hidden transition-all">
              <div className="px-6 py-4 bg-[#FCFAF7] border-b border-[#E8DED8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-[#332C29] text-white text-xs font-mono font-bold flex items-center justify-center shadow-xs">
                    02
                  </span>
                  <div>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#332C29] tracking-wide flex items-center gap-2">
                      <span>Pola Tingkat 4 (digunakan untuk 4, 5, & 6 tingkatan)</span>
                      <span className="text-[11px] font-mono text-[#332C29] bg-[#EDE8E4] px-2 py-0.5 rounded border border-[#DFD4CD]">
                        4, 5, & 6 Tingkatan
                      </span>
                    </h3>
                    <p className="text-xs text-[#6B5E57]">
                      Gambar master teknis yang ditampilkan otomatis saat siswa memilih 4, 5, atau 6 tingkatan rok.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {currentTier4PatternImg && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImage('tier4PatternImage', 'Pola Tingkat 4')}
                      disabled={deletingSlot === 'tier4PatternImage' || tier4PatternUpload.isUploading}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 bg-red-50/60 hover:bg-red-100/80 text-red-700 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                      title="Hapus Pola Tingkat 4 dari Firebase Storage dan database"
                    >
                      {deletingSlot === 'tier4PatternImage' ? (
                        <>
                          <RefreshCw size={13} className="animate-spin text-red-600" />
                          <span>Menghapus...</span>
                        </>
                      ) : (
                        <>
                          <Trash2 size={13} />
                          <span className="hidden sm:inline">Hapus</span>
                        </>
                      )}
                    </button>
                  )}
                  <input
                    ref={tier4PatternFileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={(e) => handleFileSelect(e, 'tier4PatternImage')}
                    className="hidden"
                    id="upload-tier4-pattern-input"
                  />
                  <button
                    type="button"
                    onClick={() => tier4PatternFileInputRef.current?.click()}
                    disabled={tier4PatternUpload.isUploading || deletingSlot === 'tier4PatternImage'}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#332C29] hover:bg-[#241F1D] active:bg-[#1A1615] text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    <Upload size={14} />
                    <span>{currentTier4PatternImg ? 'Ganti Gambar' : 'Upload Gambar'}</span>
                  </button>
                </div>
              </div>

              {/* Feedback messages */}
              {tier4PatternUpload.error && (
                <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{tier4PatternUpload.error}</span>
                </div>
              )}

              {tier4PatternUpload.success && (
                <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 size={15} className="shrink-0 text-emerald-600" />
                  <span>Gambar Pola Tingkat 4 berhasil diperbarui dan disimpan ke Firebase!</span>
                </div>
              )}

              {/* Body Content */}
              <div className="p-6">
                {tier4PatternUpload.previewUrl ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-[#FCFAF7] p-4 rounded-xl border border-[#E8DED8] flex flex-col items-center">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#6B5E57] mb-3">
                          Gambar Pola Tingkat 4 Saat Ini
                        </p>
                        <div className="w-full h-80 flex items-center justify-center bg-white rounded-lg border border-[#E8DED8] overflow-hidden p-2">
                          {currentTier4PatternImg ? (
                            <img
                              src={currentTier4PatternImg}
                              alt="Current Tier 4 Pattern"
                              className="max-h-full max-w-full object-contain"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-xs text-[#8C7D76]">
                              <ImageIcon size={28} className="mb-2 text-[#DFD4CD]" />
                              <span>Pola Tingkat 4 belum tersedia.</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-[#FCFAF7] p-4 rounded-xl border border-[#332C29]/30 flex flex-col items-center">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#332C29] mb-3 flex items-center gap-1.5">
                          <Check size={14} />
                          Pratinjau Gambar Baru (Pola Tingkat 4)
                        </p>
                        <div className="w-full h-80 flex items-center justify-center bg-white rounded-lg border border-[#332C29]/20 overflow-hidden p-2">
                          <img
                            src={tier4PatternUpload.previewUrl}
                            alt="New Tier 4 Pattern Preview"
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        {tier4PatternUpload.file && (
                          <p className="text-[11px] font-mono text-[#6B5E57] mt-2">
                            {tier4PatternUpload.file.name} ({(tier4PatternUpload.file.size / 1024).toFixed(1)} KB)
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8DED8]">
                      <button
                        type="button"
                        onClick={resetTier4PatternState}
                        disabled={tier4PatternUpload.isUploading}
                        className="px-4 py-2 rounded-xl border border-[#DFD4CD] bg-white hover:bg-[#E8DED8] text-[#6B5E57] text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveImage('tier4PatternImage')}
                        disabled={tier4PatternUpload.isUploading}
                        className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#332C29] hover:bg-[#241F1D] text-white text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
                      >
                        {tier4PatternUpload.isUploading ? (
                          <>
                            <RefreshCw size={13} className="animate-spin" />
                            <span>Menyimpan ke Firebase...</span>
                          </>
                        ) : (
                          <>
                            <Check size={14} />
                            <span>Simpan Perubahan</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-full max-w-md h-80 flex items-center justify-center bg-[#FCFAF7] rounded-xl border border-[#E8DED8] p-4 relative">
                      {currentTier4PatternImg ? (
                        <img
                          src={currentTier4PatternImg}
                          alt="Pola Tingkat 4"
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-xs text-[#8C7D76]">
                          <ImageIcon size={32} className="mb-2 text-[#DFD4CD]" />
                          <span>Pola Tingkat 4 belum diunggah.</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-3 text-center">
                      <span className="text-[11px] font-mono text-[#6B5E57] bg-[#E8DED8] px-3 py-1 rounded-md">
                        Target Penyimpanan: calculators/{selectedCalcId}/tier4PatternImage
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        ) : (
          /* STANDARD SECTION FOR OTHER CALCULATORS */
          <section className="bg-white rounded-2xl border border-[#E8DED8] shadow-sm overflow-hidden transition-all">
            <div className="px-6 py-4 bg-[#FCFAF7] border-b border-[#E8DED8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-serif text-lg sm:text-xl font-bold text-[#332C29] tracking-wide">
                  GAMBAR POLA
                </h2>
                <p className="text-xs text-[#6B5E57]">
                  {isRokLipitSearah
                    ? 'Gambar master konstruksi pola teknis Rok Lipit Searah.'
                    : "Gambar master konstruksi pola teknis (titik A, B, C, D, A', C', D', E, TM, TB)."}
                </p>
              </div>

              {/* Action: Ganti Gambar / Hapus */}
              <div className="flex items-center gap-2">
                {currentPatternImg && (
                  <button
                    type="button"
                    onClick={() => handleRemoveImage('patternImage', 'Gambar Pola')}
                    disabled={deletingSlot === 'patternImage' || patternUpload.isUploading}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 bg-red-50/60 hover:bg-red-100/80 text-red-700 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                    title="Hapus Gambar Pola dari Firebase Storage dan database"
                  >
                    {deletingSlot === 'patternImage' ? (
                      <>
                        <RefreshCw size={13} className="animate-spin text-red-600" />
                        <span>Menghapus...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 size={13} />
                        <span className="hidden sm:inline">Hapus</span>
                      </>
                    )}
                  </button>
                )}
                <input
                  ref={patternFileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={(e) => handleFileSelect(e, 'patternImage')}
                  className="hidden"
                  id="upload-pattern-input"
                />
                <button
                  type="button"
                  onClick={() => patternFileInputRef.current?.click()}
                  disabled={patternUpload.isUploading || deletingSlot === 'patternImage'}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#8F2635] hover:bg-[#7A1F2D] active:bg-[#681925] text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <Upload size={14} />
                  <span>{currentPatternImg ? 'Ganti Gambar' : 'Upload Gambar'}</span>
                </button>
              </div>
            </div>

            {/* Feedback messages */}
            {patternUpload.error && (
              <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{patternUpload.error}</span>
              </div>
            )}

            {patternUpload.success && (
              <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 size={15} className="shrink-0 text-emerald-600" />
                <span>Gambar pola teknis berhasil diperbarui dan disimpan ke Firebase!</span>
              </div>
            )}

            {/* Body Content */}
            <div className="p-6">
              {patternUpload.previewUrl ? (
                /* PREVIEW STATE: Current vs New */
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Current Stored Image */}
                    <div className="bg-[#FCFAF7] p-4 rounded-xl border border-[#E8DED8] flex flex-col items-center">
                      <p className="text-xs font-bold uppercase tracking-wider text-[#6B5E57] mb-3">
                        Gambar Saat Ini
                      </p>
                      <div className="w-full h-80 flex items-center justify-center bg-white rounded-lg border border-[#E8DED8] overflow-hidden p-2">
                        {currentPatternImg ? (
                          <img
                            src={currentPatternImg}
                            alt="Current Pattern Artwork"
                            className="max-h-full max-w-full object-contain"
                            onError={(e) => {
                              console.error('[ImageManager] Failed to load pattern image:', currentPatternImg);
                              e.currentTarget.style.display = 'none';
                              const fallback = e.currentTarget.parentElement?.querySelector('.pattern-img-fallback');
                              if (fallback) (fallback as HTMLElement).style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className="pattern-img-fallback hidden w-full h-full flex-col items-center justify-center text-xs text-[#8C7D76]">
                          <ImageIcon size={28} className="mb-2 text-[#DFD4CD]" />
                          <span>Gambar panduan belum tersedia.</span>
                        </div>
                      </div>
                    </div>

                    {/* New Image Preview */}
                    <div className="bg-[#FCFAF7] p-4 rounded-xl border-2 border-dashed border-[#8F2635]/40 flex flex-col items-center">
                      <p className="text-xs font-bold uppercase tracking-wider text-[#8F2635] mb-3 flex items-center gap-1.5">
                        <Eye size={13} />
                        <span>Pratinjau Gambar Baru</span>
                      </p>
                      <div className="w-full h-80 flex items-center justify-center bg-white rounded-lg border border-[#E8DED8] overflow-hidden p-2">
                        <img
                          src={patternUpload.previewUrl}
                          alt="New Pattern Preview"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      {patternUpload.file && (
                        <p className="text-[11px] font-mono text-[#6B5E57] mt-2">
                          {patternUpload.file.name} ({(patternUpload.file.size / 1024).toFixed(1)} KB)
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Confirm Save Bar */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8DED8]">
                    <button
                      type="button"
                      onClick={resetPatternState}
                      disabled={patternUpload.isUploading}
                      className="px-4 py-2 rounded-xl border border-[#DFD4CD] bg-white hover:bg-[#E8DED8] text-[#6B5E57] text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveImage('patternImage')}
                      disabled={patternUpload.isUploading}
                      className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#8F2635] hover:bg-[#7A1F2D] text-white text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      {patternUpload.isUploading ? (
                        <>
                          <RefreshCw size={13} className="animate-spin" />
                          <span>Menyimpan ke Firebase...</span>
                        </>
                      ) : (
                        <>
                          <Check size={14} />
                          <span>Simpan Perubahan</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                /* DEFAULT STATE: Display Current Stored Image */
                <div className="flex flex-col items-center">
                  <div className="w-full max-w-lg h-96 flex items-center justify-center bg-[#FCFAF7] rounded-xl border border-[#E8DED8] p-4 relative">
                    {currentPatternImg ? (
                      <img
                        src={currentPatternImg}
                        alt="Instructional Technical Pattern"
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          console.error('[ImageManager] Failed to load pattern image:', currentPatternImg);
                          e.currentTarget.style.display = 'none';
                          const fallback = e.currentTarget.parentElement?.querySelector('.pattern-img-fallback-default');
                          if (fallback) (fallback as HTMLElement).style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`pattern-img-fallback-default ${currentPatternImg ? 'hidden' : 'flex'} w-full h-full flex-col items-center justify-center text-xs text-[#8C7D76]`}>
                      <ImageIcon size={32} className="mb-2 text-[#DFD4CD]" />
                      <span>Gambar pola belum tersedia.</span>
                    </div>
                  </div>
                  <div className="mt-3 text-center">
                    <span className="text-[11px] font-mono text-[#6B5E57] bg-[#E8DED8] px-3 py-1 rounded-md">
                      Target Penyimpanan: calculators/{selectedCalcId}/patternImage
                    </span>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Section 3: CARA PEMBUATAN POLA (DUAL SECTION: POLA DEPAN & POLA BELAKANG / TINGKAT 3 & TINGKAT 4) */}
        <div className="space-y-6">
          {/* Header & Global Save Bar */}
          <div className="bg-[#FCFAF7] p-5 rounded-2xl border border-[#E8DED8] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#8F2635] text-white flex items-center justify-center font-bold shadow-xs">
                <FileText size={20} />
              </div>
              <div>
                <h2 className="font-serif text-lg sm:text-xl font-bold text-[#332C29]">
                  INSTRUKSI CARA PEMBUATAN POLA
                </h2>
                <p className="text-xs text-[#6B5E57]">
                  {isTieredSkirt
                    ? `Kelola instruksi langkah pembuatan Pola Tingkat 3 & Pola Tingkat 4 secara terpisah untuk ${selectedCalcObj?.name || selectedCalcId}.`
                    : isRokLipitSearah
                    ? `Kelola instruksi langkah pembuatan pola untuk ${selectedCalcObj?.name || selectedCalcId}.`
                    : isPolaCelana
                    ? `Kelola instruksi langkah pembuatan pola untuk ${selectedCalcObj?.name || selectedCalcId}.`
                    : isRokPiasGodet
                    ? `Kelola instruksi langkah pembuatan Pola Pias & Pola Godet secara terpisah untuk ${selectedCalcObj?.name || selectedCalcId}.`
                    : `Kelola instruksi langkah pembuatan Pola Depan & Pola Belakang secara terpisah untuk ${selectedCalcObj?.name || selectedCalcId}.`}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveDescriptions}
              disabled={isSavingDescription || isLoading}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#8F2635] hover:bg-[#7A1F2D] active:bg-[#681925] text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isSavingDescription ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Menyimpan ke Firestore...</span>
                </>
              ) : (
                <>
                  <Save size={14} />
                  <span>Simpan Semua Instruksi Pola</span>
                </>
              )}
            </button>
          </div>

          {/* Feedback messages */}
          {descriptionSaveError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{descriptionSaveError}</span>
            </div>
          )}

          {descriptionSaveSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
              <span className="font-semibold">✓ Berhasil Disimpan!</span>
              <span>
                {isTieredSkirt
                  ? 'Instruksi Pola Tingkat 3 dan Pola Tingkat 4 berhasil disimpan secara terpisah ke Firestore.'
                  : isRokLipitSearah
                  ? 'Instruksi Pola Rok Lipit Searah berhasil disimpan ke Firestore.'
                  : isPolaCelana
                  ? 'Instruksi Pola Celana Piyama berhasil disimpan ke Firestore.'
                  : isRokPiasGodet
                  ? 'Instruksi Pola Pias dan Pola Godet berhasil disimpan secara terpisah ke Firestore.'
                  : 'Instruksi Pola Depan dan Pola Belakang berhasil disimpan secara terpisah ke Firestore.'}
              </span>
            </div>
          )}

          {/* 3A. Dedicated Section: CARA PEMBUATAN POLA — POLA DEPAN / ROK LINGKARAN PENUH / POLA TINGKAT 3 */}
          <section className="bg-white rounded-2xl border border-[#E8DED8] shadow-sm overflow-hidden transition-all">
            <div className="px-6 py-4 bg-[#FCFAF7] border-b border-[#E8DED8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase bg-[#8F2635] text-white">
                  {isTieredSkirt
                    ? 'Pola Tingkat 3'
                    : selectedCalcId === 'rok-lingkaran'
                    ? 'Lingkaran Penuh'
                    : isRokLipitSearah
                    ? 'Pola Rok'
                    : isPolaCelana
                    ? 'Pola Celana'
                    : isRokPiasGodet
                    ? 'Pola Pias'
                    : 'Pola Depan'}
                </span>
                <div>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-[#332C29]">
                    {isTieredSkirt
                      ? 'CARA PEMBUATAN POLA — POLA TINGKAT 3 (DIGUNAKAN UNTUK 2 & 3 TINGKATAN)'
                      : selectedCalcId === 'rok-lingkaran'
                      ? 'CARA PEMBUATAN POLA — ROK LINGKARAN PENUH'
                      : (isRokLipitSearah || isPolaCelana)
                      ? 'CARA PEMBUATAN POLA'
                      : isRokPiasGodet
                      ? 'CARA PEMBUATAN POLA — PIAS'
                      : 'CARA PEMBUATAN POLA — POLA DEPAN'}
                  </h3>
                  <p className="text-xs text-[#6B5E57]">
                    {isTieredSkirt
                      ? 'Kelola instruksi bilingual untuk konstruksi Rok Kerut 2 dan 3 Tingkat.'
                      : selectedCalcId === 'rok-lingkaran'
                      ? 'Kelola instruksi bilingual untuk konstruksi Rok Lingkaran Penuh.'
                      : isRokLipitSearah
                      ? 'Kelola instruksi bilingual untuk konstruksi pola Rok Lipit Searah.'
                      : isPolaCelana
                      ? 'Kelola instruksi bilingual untuk konstruksi pola Celana Piyama.'
                      : isRokPiasGodet
                      ? 'Kelola instruksi bilingual untuk konstruksi 1 helai Pola Pias.'
                      : 'Kelola instruksi bilingual untuk konstruksi Pola Depan.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowFrontPreview(!showFrontPreview)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DFD4CD] bg-white hover:bg-[#F5EFEB] text-xs font-semibold text-[#6B5E57] transition-all cursor-pointer"
                >
                  <Eye size={13} />
                  <span>{showFrontPreview ? 'Tutup Pratinjau' : 'Lihat Pratinjau'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveSection('front')}
                  disabled={savingSection === 'front' || isSavingDescription}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#8F2635] hover:bg-[#7A1F2D] text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
                  title="Simpan bagian ini ke Firestore"
                >
                  {savingSection === 'front' ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Save size={13} />
                      <span>Simpan Bagian Ini</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {sectionSaveSuccess === 'front' && (
              <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 size={15} className="shrink-0 text-emerald-600" />
                <span>Instruksi bagian ini (ID & EN) berhasil disimpan ke Firestore!</span>
              </div>
            )}

            <div className="p-6 space-y-6">
              {/* Dual-Language Input Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 1. Indonesian Description Field */}
                <div className="space-y-3 bg-[#FCFAF7] p-4 rounded-xl border border-[#E8DED8]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-600"></span>
                      <span className="text-xs font-bold text-[#332C29] tracking-wide uppercase">
                        Deskripsi Bahasa Indonesia
                      </span>
                    </div>
                    <span className="text-[11px] text-[#6B5E57] bg-white px-2 py-0.5 rounded border border-[#DFD4CD]">
                      🇮🇩 Bahasa Indonesia
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6B5E57]">
                    Instruksi manual yang tampil saat siswa memilih Bahasa Indonesia.
                  </p>

                  {/* Formatting Toolbar - ID */}
                  <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-lg bg-white border border-[#DFD4CD]">
                    <button
                      type="button"
                      title="Format Teks Tebal (**tebal**)"
                      onClick={() => applyFormatting(frontTextareaRef, frontPatternDescriptionText, setFrontPatternDescriptionText, 'bold')}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#F5EFEB] hover:bg-[#E8DED8] text-xs font-bold text-[#332C29] transition-all cursor-pointer"
                    >
                      <Bold size={12} />
                      <span>Tebal</span>
                    </button>
                    <button
                      type="button"
                      title="Format Daftar Bernomor (1. 2. 3.)"
                      onClick={() => applyFormatting(frontTextareaRef, frontPatternDescriptionText, setFrontPatternDescriptionText, 'numbered')}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#F5EFEB] hover:bg-[#E8DED8] text-xs font-bold text-[#332C29] transition-all cursor-pointer"
                    >
                      <ListOrdered size={12} />
                      <span>Nomor</span>
                    </button>
                    <button
                      type="button"
                      title="Format Daftar Poin (• Poin)"
                      onClick={() => applyFormatting(frontTextareaRef, frontPatternDescriptionText, setFrontPatternDescriptionText, 'bullet')}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#F5EFEB] hover:bg-[#E8DED8] text-xs font-bold text-[#332C29] transition-all cursor-pointer"
                    >
                      <List size={12} />
                      <span>Poin</span>
                    </button>
                    <button
                      type="button"
                      title="Sisipkan Paragraf Baru"
                      onClick={() => applyFormatting(frontTextareaRef, frontPatternDescriptionText, setFrontPatternDescriptionText, 'paragraph')}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#F5EFEB] hover:bg-[#E8DED8] text-xs font-bold text-[#332C29] transition-all cursor-pointer"
                    >
                      <AlignLeft size={12} />
                      <span>Paragraf</span>
                    </button>
                  </div>

                  {/* Textarea - ID */}
                  <textarea
                    ref={frontTextareaRef}
                    id="front-pattern-description-input"
                    rows={8}
                    value={frontPatternDescriptionText}
                    onChange={(e) => setFrontPatternDescriptionText(e.target.value)}
                    placeholder={
                      isTieredSkirt
                        ? `Contoh:\n1. Bagian Pinggang: Lebar = Lingkar Pinggang + 4 cm\n2. Tingkat 1: Lebar = 1.5 x Lingkar Pinggang, Panjang = 20 cm\n3. Tingkat 2: Lebar = 2 x Tingkat 1, Panjang = 25 cm\n4. Tingkat 3: Lebar = 2 x Tingkat 2, Panjang = 30 cm`
                        : `Contoh:\n1. A – B = Turun lekuk pinggang depan 1.5 cm\n2. A – C = Tinggi panggul 20 cm\n3. A – D = Panjang rok 60 cm\n• Buat garis pinggang dari A ke A' melengkung\n• Tarik garis sisi dari A' ke C'`
                    }
                    className="w-full p-3.5 rounded-xl border border-[#DFD4CD] bg-white focus:border-[#8F2635] focus:ring-2 focus:ring-[#8F2635]/20 text-xs sm:text-sm text-[#332C29] placeholder-[#A89A92] font-sans leading-relaxed transition-all resize-y"
                  />
                  <div className="flex items-center justify-between text-[11px] text-[#8C7D76]">
                    <span className="font-mono text-[#6B5E57] bg-white px-2 py-0.5 rounded border border-[#E8DED8]">
                      Field: frontPatternDescription
                    </span>
                    <span className="font-mono text-[#6B5E57]">{frontPatternDescriptionText.length} karakter</span>
                  </div>
                </div>

                {/* 2. English Description Field */}
                <div className="space-y-3 bg-[#FCFAF7] p-4 rounded-xl border border-[#E8DED8]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                      <span className="text-xs font-bold text-[#332C29] tracking-wide uppercase">
                        English Description
                      </span>
                    </div>
                    <span className="text-[11px] text-[#6B5E57] bg-white px-2 py-0.5 rounded border border-[#DFD4CD]">
                      🇬🇧 English (Manual)
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6B5E57]">
                    Manual input for English mode. Leave empty if not yet translated.
                  </p>

                  {/* Formatting Toolbar - EN */}
                  <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-lg bg-white border border-[#DFD4CD]">
                    <button
                      type="button"
                      title="Format Bold Text (**bold**)"
                      onClick={() => applyFormatting(frontEnTextareaRef, frontPatternDescriptionEnText, setFrontPatternDescriptionEnText, 'bold')}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#F5EFEB] hover:bg-[#E8DED8] text-xs font-bold text-[#332C29] transition-all cursor-pointer"
                    >
                      <Bold size={12} />
                      <span>Bold</span>
                    </button>
                    <button
                      type="button"
                      title="Format Numbered List (1. 2. 3.)"
                      onClick={() => applyFormatting(frontEnTextareaRef, frontPatternDescriptionEnText, setFrontPatternDescriptionEnText, 'numbered')}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#F5EFEB] hover:bg-[#E8DED8] text-xs font-bold text-[#332C29] transition-all cursor-pointer"
                    >
                      <ListOrdered size={12} />
                      <span>Numbered</span>
                    </button>
                    <button
                      type="button"
                      title="Format Bullet List (• Bullet)"
                      onClick={() => applyFormatting(frontEnTextareaRef, frontPatternDescriptionEnText, setFrontPatternDescriptionEnText, 'bullet')}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#F5EFEB] hover:bg-[#E8DED8] text-xs font-bold text-[#332C29] transition-all cursor-pointer"
                    >
                      <List size={12} />
                      <span>Bullets</span>
                    </button>
                    <button
                      type="button"
                      title="Insert New Paragraph"
                      onClick={() => applyFormatting(frontEnTextareaRef, frontPatternDescriptionEnText, setFrontPatternDescriptionEnText, 'paragraph')}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#F5EFEB] hover:bg-[#E8DED8] text-xs font-bold text-[#332C29] transition-all cursor-pointer"
                    >
                      <AlignLeft size={12} />
                      <span>Paragraph</span>
                    </button>
                  </div>

                  {/* Textarea - EN */}
                  <textarea
                    ref={frontEnTextareaRef}
                    id="front-pattern-description-en-input"
                    rows={8}
                    value={frontPatternDescriptionEnText}
                    onChange={(e) => setFrontPatternDescriptionEnText(e.target.value)}
                    placeholder={
                      isTieredSkirt
                        ? `Example:\n1. Waistband: Width = Waist Circumference + 4 cm\n2. Tier 1: Width = 1.5 x Waist Circumference, Length = 20 cm\n3. Tier 2: Width = 2 x Tier 1, Length = 25 cm\n4. Tier 3: Width = 2 x Tier 2, Length = 30 cm`
                        : `Example:\n1. A – B = Front waist curve drop 1.5 cm\n2. A – C = Hip height 20 cm\n3. A – D = Skirt length 60 cm\n• Create waist curve line from A to A'\n• Draw side seam line from A' to C'`
                    }
                    className="w-full p-3.5 rounded-xl border border-[#DFD4CD] bg-white focus:border-[#8F2635] focus:ring-2 focus:ring-[#8F2635]/20 text-xs sm:text-sm text-[#332C29] placeholder-[#A89A92] font-sans leading-relaxed transition-all resize-y"
                  />
                  <div className="flex items-center justify-between text-[11px] text-[#8C7D76]">
                    <span className="font-mono text-[#6B5E57] bg-white px-2 py-0.5 rounded border border-[#E8DED8]">
                      Field: frontPatternDescription_en
                    </span>
                    <span className="font-mono text-[#6B5E57]">{frontPatternDescriptionEnText.length} characters</span>
                  </div>
                </div>
              </div>

              {/* Live Formatted Preview with Language Switch */}
              {showFrontPreview && (
                <div className="p-4 rounded-xl bg-[#FAF6F3] border border-[#E8DED8] space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E8DED8]">
                    <span className="text-xs font-bold text-[#8F2635] uppercase tracking-wider flex items-center gap-1.5">
                      <Eye size={13} />
                      Pratinjau Tampilan Siswa ({isTieredSkirt ? 'Pola Tingkat 3' : selectedCalcId === 'rok-lingkaran' ? 'Rok Lingkaran Penuh' : (isRokLipitSearah || isPolaCelana) ? 'Cara Pembuatan Pola' : selectedCalcId === 'rok-pias-godet' ? 'Pola Pias' : 'Pola Depan'})
                    </span>
                    
                    {/* Preview Language Tabs */}
                    <div className="inline-flex rounded-lg border border-[#DFD4CD] p-0.5 bg-white">
                      <button
                        type="button"
                        onClick={() => setFrontPreviewLang('id')}
                        className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                          frontPreviewLang === 'id'
                            ? 'bg-[#8F2635] text-white shadow-xs'
                            : 'text-[#6B5E57] hover:text-[#332C29]'
                        }`}
                      >
                        🇮🇩 Bahasa Indonesia
                      </button>
                      <button
                        type="button"
                        onClick={() => setFrontPreviewLang('en')}
                        className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                          frontPreviewLang === 'en'
                            ? 'bg-[#8F2635] text-white shadow-xs'
                            : 'text-[#6B5E57] hover:text-[#332C29]'
                        }`}
                      >
                        🇬🇧 English
                      </button>
                    </div>
                  </div>

                  {frontPreviewLang === 'id' ? (
                    frontPatternDescriptionText.trim() ? (
                      <FormattedPatternInstructions content={frontPatternDescriptionText} accentColor="burgundy" />
                    ) : (
                      <p className="text-xs text-[#8C7D76] italic py-2">
                        Deskripsi Bahasa Indonesia belum diisi.
                      </p>
                    )
                  ) : (
                    frontPatternDescriptionEnText.trim() ? (
                      <FormattedPatternInstructions content={frontPatternDescriptionEnText} accentColor="burgundy" />
                    ) : (
                      <p className="text-xs text-[#8C7D76] italic py-2">
                        English description has not been entered yet.
                      </p>
                    )
                  )}
                </div>
              )}
            </div>
          </section>

          {/* 3B. Dedicated Section: POLA TINGKAT 4 (untuk Rok Kerut Bertingkat) ATAU POLA BELAKANG / ROK SETENGAH LINGKARAN */}
          {isTieredSkirt ? (
            /* Tiered Skirt Tier 4 Description Editor */
            <section className="bg-white rounded-2xl border border-[#E8DED8] shadow-sm overflow-hidden transition-all">
              <div className="px-6 py-4 bg-[#FCFAF7] border-b border-[#E8DED8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase bg-[#332C29] text-white">
                    Pola Tingkat 4
                  </span>
                  <div>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#332C29]">
                      CARA PEMBUATAN POLA — POLA TINGKAT 4 (DIGUNAKAN UNTUK 4, 5, & 6 TINGKATAN)
                    </h3>
                    <p className="text-xs text-[#6B5E57]">
                      Kelola instruksi bilingual untuk konstruksi Rok Kerut 4, 5, dan 6 Tingkat.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowTier4Preview(!showTier4Preview)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DFD4CD] bg-white hover:bg-[#F5EFEB] text-xs font-semibold text-[#6B5E57] transition-all cursor-pointer"
                  >
                    <Eye size={13} />
                    <span>{showTier4Preview ? 'Tutup Pratinjau' : 'Lihat Pratinjau'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveSection('tier4')}
                    disabled={savingSection === 'tier4' || isSavingDescription}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#332C29] hover:bg-[#241F1D] text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
                    title="Simpan bagian ini ke Firestore"
                  >
                    {savingSection === 'tier4' ? (
                      <>
                        <RefreshCw size={13} className="animate-spin" />
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <>
                        <Save size={13} />
                        <span>Simpan Bagian Ini</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {sectionSaveSuccess === 'tier4' && (
                <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 size={15} className="shrink-0 text-emerald-600" />
                  <span>Instruksi Pola Tingkat 4 (ID & EN) berhasil disimpan ke Firestore!</span>
                </div>
              )}

              <div className="p-6 space-y-6">
                {/* Dual-Language Input Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* 1. Indonesian Description Field */}
                  <div className="space-y-3 bg-[#FCFAF7] p-4 rounded-xl border border-[#E8DED8]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-600"></span>
                        <span className="text-xs font-bold text-[#332C29] tracking-wide uppercase">
                          Deskripsi Bahasa Indonesia
                        </span>
                      </div>
                      <span className="text-[11px] text-[#6B5E57] bg-white px-2 py-0.5 rounded border border-[#DFD4CD]">
                        🇮🇩 Bahasa Indonesia
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6B5E57]">
                      Instruksi manual yang tampil saat siswa memilih Bahasa Indonesia.
                    </p>

                    {/* Formatting Toolbar - ID */}
                    <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-lg bg-white border border-[#DFD4CD]">
                      <button
                        type="button"
                        title="Format Teks Tebal (**tebal**)"
                        onClick={() => applyFormatting(tier4TextareaRef, tier4PatternDescriptionText, setTier4PatternDescriptionText, 'bold')}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#F5EFEB] hover:bg-[#E8DED8] text-xs font-bold text-[#332C29] transition-all cursor-pointer"
                      >
                        <Bold size={12} />
                        <span>Tebal</span>
                      </button>
                      <button
                        type="button"
                        title="Format Daftar Bernomor (1. 2. 3.)"
                        onClick={() => applyFormatting(tier4TextareaRef, tier4PatternDescriptionText, setTier4PatternDescriptionText, 'numbered')}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#F5EFEB] hover:bg-[#E8DED8] text-xs font-bold text-[#332C29] transition-all cursor-pointer"
                      >
                        <ListOrdered size={12} />
                        <span>Nomor</span>
                      </button>
                      <button
                        type="button"
                        title="Format Daftar Poin (• Poin)"
                        onClick={() => applyFormatting(tier4TextareaRef, tier4PatternDescriptionText, setTier4PatternDescriptionText, 'bullet')}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#F5EFEB] hover:bg-[#E8DED8] text-xs font-bold text-[#332C29] transition-all cursor-pointer"
                      >
                        <List size={12} />
                        <span>Poin</span>
                      </button>
                      <button
                        type="button"
                        title="Sisipkan Paragraf Baru"
                        onClick={() => applyFormatting(tier4TextareaRef, tier4PatternDescriptionText, setTier4PatternDescriptionText, 'paragraph')}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#F5EFEB] hover:bg-[#E8DED8] text-xs font-bold text-[#332C29] transition-all cursor-pointer"
                      >
                        <AlignLeft size={12} />
                        <span>Paragraf</span>
                      </button>
                    </div>

                    {/* Textarea - ID */}
                    <textarea
                      ref={tier4TextareaRef}
                      id="tier4-pattern-description-input"
                      rows={8}
                      value={tier4PatternDescriptionText}
                      onChange={(e) => setTier4PatternDescriptionText(e.target.value)}
                      placeholder={`Contoh:\n1. Bagian Pinggang: Lebar = Lingkar Pinggang + 4 cm\n2. Tingkat 1: Lebar = 1.5 x Lingkar Pinggang, Panjang = 15 cm\n3. Tingkat 2: Lebar = 2 x Tingkat 1, Panjang = 18 cm\n4. Tingkat 3: Lebar = 2 x Tingkat 2, Panjang = 20 cm\n5. Tingkat 4: Lebar = 2 x Tingkat 3, Panjang = 25 cm`}
                      className="w-full p-3.5 rounded-xl border border-[#DFD4CD] bg-white focus:border-[#332C29] focus:ring-2 focus:ring-[#332C29]/20 text-xs sm:text-sm text-[#332C29] placeholder-[#A89A92] font-sans leading-relaxed transition-all resize-y"
                    />
                    <div className="flex items-center justify-between text-[11px] text-[#8C7D76]">
                      <span className="font-mono text-[#6B5E57] bg-white px-2 py-0.5 rounded border border-[#E8DED8]">
                        Field: tier4PatternDescription
                      </span>
                      <span className="font-mono text-[#6B5E57]">{tier4PatternDescriptionText.length} karakter</span>
                    </div>
                  </div>

                  {/* 2. English Description Field */}
                  <div className="space-y-3 bg-[#FCFAF7] p-4 rounded-xl border border-[#E8DED8]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                        <span className="text-xs font-bold text-[#332C29] tracking-wide uppercase">
                          English Description
                        </span>
                      </div>
                      <span className="text-[11px] text-[#6B5E57] bg-white px-2 py-0.5 rounded border border-[#DFD4CD]">
                        🇬🇧 English (Manual)
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6B5E57]">
                      Manual input for English mode. Leave empty if not yet translated.
                    </p>

                    {/* Formatting Toolbar - EN */}
                    <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-lg bg-white border border-[#DFD4CD]">
                      <button
                        type="button"
                        title="Format Bold Text (**bold**)"
                        onClick={() => applyFormatting(tier4EnTextareaRef, tier4PatternDescriptionEnText, setTier4PatternDescriptionEnText, 'bold')}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#F5EFEB] hover:bg-[#E8DED8] text-xs font-bold text-[#332C29] transition-all cursor-pointer"
                      >
                        <Bold size={12} />
                        <span>Bold</span>
                      </button>
                      <button
                        type="button"
                        title="Format Numbered List (1. 2. 3.)"
                        onClick={() => applyFormatting(tier4EnTextareaRef, tier4PatternDescriptionEnText, setTier4PatternDescriptionEnText, 'numbered')}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#F5EFEB] hover:bg-[#E8DED8] text-xs font-bold text-[#332C29] transition-all cursor-pointer"
                      >
                        <ListOrdered size={12} />
                        <span>Numbered</span>
                      </button>
                      <button
                        type="button"
                        title="Format Bullet List (• Bullet)"
                        onClick={() => applyFormatting(tier4EnTextareaRef, tier4PatternDescriptionEnText, setTier4PatternDescriptionEnText, 'bullet')}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#F5EFEB] hover:bg-[#E8DED8] text-xs font-bold text-[#332C29] transition-all cursor-pointer"
                      >
                        <List size={12} />
                        <span>Bullets</span>
                      </button>
                      <button
                        type="button"
                        title="Insert New Paragraph"
                        onClick={() => applyFormatting(tier4EnTextareaRef, tier4PatternDescriptionEnText, setTier4PatternDescriptionEnText, 'paragraph')}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#F5EFEB] hover:bg-[#E8DED8] text-xs font-bold text-[#332C29] transition-all cursor-pointer"
                      >
                        <AlignLeft size={12} />
                        <span>Paragraph</span>
                      </button>
                    </div>

                    {/* Textarea - EN */}
                    <textarea
                      ref={tier4EnTextareaRef}
                      id="tier4-pattern-description-en-input"
                      rows={8}
                      value={tier4PatternDescriptionEnText}
                      onChange={(e) => setTier4PatternDescriptionEnText(e.target.value)}
                      placeholder={`Example:\n1. Waistband: Width = Waist Circumference + 4 cm\n2. Tier 1: Width = 1.5 x Waist Circumference, Length = 15 cm\n3. Tier 2: Width = 2 x Tier 1, Length = 18 cm\n4. Tier 3: Width = 2 x Tier 2, Length = 20 cm\n5. Tier 4: Width = 2 x Tier 3, Length = 25 cm`}
                      className="w-full p-3.5 rounded-xl border border-[#DFD4CD] bg-white focus:border-[#332C29] focus:ring-2 focus:ring-[#332C29]/20 text-xs sm:text-sm text-[#332C29] placeholder-[#A89A92] font-sans leading-relaxed transition-all resize-y"
                    />
                    <div className="flex items-center justify-between text-[11px] text-[#8C7D76]">
                      <span className="font-mono text-[#6B5E57] bg-white px-2 py-0.5 rounded border border-[#E8DED8]">
                        Field: tier4PatternDescription_en
                      </span>
                      <span className="font-mono text-[#6B5E57]">{tier4PatternDescriptionEnText.length} characters</span>
                    </div>
                  </div>
                </div>

                {/* Live Formatted Preview with Language Switch */}
                {showTier4Preview && (
                  <div className="p-4 rounded-xl bg-[#FAF6F3] border border-[#E8DED8] space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E8DED8]">
                      <span className="text-xs font-bold text-[#332C29] uppercase tracking-wider flex items-center gap-1.5">
                        <Eye size={13} />
                        Pratinjau Tampilan Siswa (Pola Tingkat 4)
                      </span>

                      {/* Preview Language Tabs */}
                      <div className="inline-flex rounded-lg border border-[#DFD4CD] p-0.5 bg-white">
                        <button
                          type="button"
                          onClick={() => setTier4PreviewLang('id')}
                          className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                            tier4PreviewLang === 'id'
                              ? 'bg-[#332C29] text-white shadow-xs'
                              : 'text-[#6B5E57] hover:text-[#332C29]'
                          }`}
                        >
                          🇮🇩 Bahasa Indonesia
                        </button>
                        <button
                          type="button"
                          onClick={() => setTier4PreviewLang('en')}
                          className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                            tier4PreviewLang === 'en'
                              ? 'bg-[#332C29] text-white shadow-xs'
                              : 'text-[#6B5E57] hover:text-[#332C29]'
                          }`}
                        >
                          🇬🇧 English
                        </button>
                      </div>
                    </div>

                    {tier4PreviewLang === 'id' ? (
                      tier4PatternDescriptionText.trim() ? (
                        <FormattedPatternInstructions content={tier4PatternDescriptionText} accentColor="charcoal" />
                      ) : (
                        <p className="text-xs text-[#8C7D76] italic py-2">
                          Deskripsi Bahasa Indonesia belum diisi.
                        </p>
                      )
                    ) : (
                      tier4PatternDescriptionEnText.trim() ? (
                        <FormattedPatternInstructions content={tier4PatternDescriptionEnText} accentColor="charcoal" />
                      ) : (
                        <p className="text-xs text-[#8C7D76] italic py-2">
                          English description has not been entered yet.
                        </p>
                      )
                    )}
                  </div>
                )}
              </div>
            </section>
          ) : (isRokLipitSearah || isPolaCelana) ? null : (
            /* Standard Back Pattern / Half Circle Description Editor */
            <section className="bg-white rounded-2xl border border-[#E8DED8] shadow-sm overflow-hidden transition-all">
              <div className="px-6 py-4 bg-[#FCFAF7] border-b border-[#E8DED8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase bg-[#332C29] text-white">
                    {selectedCalcId === 'rok-lingkaran'
                      ? 'Setengah Lingkaran'
                      : selectedCalcId === 'rok-pias-godet'
                      ? 'Pola Godet'
                      : 'Pola Belakang'}
                  </span>
                  <div>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#332C29]">
                      {selectedCalcId === 'rok-lingkaran'
                        ? 'CARA PEMBUATAN POLA — ROK SETENGAH LINGKARAN'
                        : selectedCalcId === 'rok-pias-godet'
                        ? 'CARA PEMBUATAN POLA — GODET'
                        : 'CARA PEMBUATAN POLA — POLA BELAKANG'}
                    </h3>
                    <p className="text-xs text-[#6B5E57]">
                      {selectedCalcId === 'rok-lingkaran'
                        ? 'Kelola instruksi bilingual untuk konstruksi Rok Setengah Lingkaran.'
                        : selectedCalcId === 'rok-pias-godet'
                        ? 'Kelola instruksi bilingual untuk konstruksi Pola Godet.'
                        : 'Kelola instruksi bilingual untuk konstruksi Pola Belakang.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowBackPreview(!showBackPreview)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DFD4CD] bg-white hover:bg-[#F5EFEB] text-xs font-semibold text-[#6B5E57] transition-all cursor-pointer"
                  >
                    <Eye size={13} />
                    <span>{showBackPreview ? 'Tutup Pratinjau' : 'Lihat Pratinjau'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveSection('back')}
                    disabled={savingSection === 'back' || isSavingDescription}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#332C29] hover:bg-[#241F1D] text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
                    title="Simpan bagian ini ke Firestore"
                  >
                    {savingSection === 'back' ? (
                      <>
                        <RefreshCw size={13} className="animate-spin" />
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <>
                        <Save size={13} />
                        <span>Simpan Bagian Ini</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {sectionSaveSuccess === 'back' && (
                <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 size={15} className="shrink-0 text-emerald-600" />
                  <span>Instruksi bagian ini (ID & EN) berhasil disimpan ke Firestore!</span>
                </div>
              )}

              <div className="p-6 space-y-6">
                {/* Dual-Language Input Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* 1. Indonesian Description Field */}
                  <div className="space-y-3 bg-[#FCFAF7] p-4 rounded-xl border border-[#E8DED8]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-600"></span>
                        <span className="text-xs font-bold text-[#332C29] tracking-wide uppercase">
                          Deskripsi Bahasa Indonesia
                        </span>
                      </div>
                      <span className="text-[11px] text-[#6B5E57] bg-white px-2 py-0.5 rounded border border-[#DFD4CD]">
                        🇮🇩 Bahasa Indonesia
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6B5E57]">
                      Instruksi manual yang tampil saat siswa memilih Bahasa Indonesia.
                    </p>

                    {/* Formatting Toolbar - ID */}
                    <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-lg bg-white border border-[#DFD4CD]">
                      <button
                        type="button"
                        title="Format Teks Tebal (**tebal**)"
                        onClick={() => applyFormatting(backTextareaRef, backPatternDescriptionText, setBackPatternDescriptionText, 'bold')}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#F5EFEB] hover:bg-[#E8DED8] text-xs font-bold text-[#332C29] transition-all cursor-pointer"
                      >
                        <Bold size={12} />
                        <span>Tebal</span>
                      </button>
                      <button
                        type="button"
                        title="Format Daftar Bernomor (1. 2. 3.)"
                        onClick={() => applyFormatting(backTextareaRef, backPatternDescriptionText, setBackPatternDescriptionText, 'numbered')}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#F5EFEB] hover:bg-[#E8DED8] text-xs font-bold text-[#332C29] transition-all cursor-pointer"
                      >
                        <ListOrdered size={12} />
                        <span>Nomor</span>
                      </button>
                      <button
                        type="button"
                        title="Format Daftar Poin (• Poin)"
                        onClick={() => applyFormatting(backTextareaRef, backPatternDescriptionText, setBackPatternDescriptionText, 'bullet')}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#F5EFEB] hover:bg-[#E8DED8] text-xs font-bold text-[#332C29] transition-all cursor-pointer"
                      >
                        <List size={12} />
                        <span>Poin</span>
                      </button>
                      <button
                        type="button"
                        title="Sisipkan Paragraf Baru"
                        onClick={() => applyFormatting(backTextareaRef, backPatternDescriptionText, setBackPatternDescriptionText, 'paragraph')}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#F5EFEB] hover:bg-[#E8DED8] text-xs font-bold text-[#332C29] transition-all cursor-pointer"
                      >
                        <AlignLeft size={12} />
                        <span>Paragraf</span>
                      </button>
                    </div>

                    {/* Textarea - ID */}
                    <textarea
                      ref={backTextareaRef}
                      id="back-pattern-description-input"
                      rows={8}
                      value={backPatternDescriptionText}
                      onChange={(e) => setBackPatternDescriptionText(e.target.value)}
                      placeholder={
                        selectedCalcId === 'rok-pias-godet'
                          ? `Contoh:\n1. A – B = Panjang godet (sama dengan panjang belahan pias)\n2. B – C = B – D = Lebar godet bawah (10 – 15 cm)\n• Buat garis lengkung bawah godet C – B' – D\n• Godet dipotong sebanyak jumlah belahan pias`
                          : `Contoh:\n1. A – B = Turun lekuk pinggang belakang 2 cm\n2. A – C = Tinggi panggul 20 cm\n3. A – D = Panjang rok 60 cm\n• Garis sisi sama dengan pola depan\n• TB lurus mengikuti serat kain`
                      }
                      className="w-full p-3.5 rounded-xl border border-[#DFD4CD] bg-white focus:border-[#332C29] focus:ring-2 focus:ring-[#332C29]/20 text-xs sm:text-sm text-[#332C29] placeholder-[#A89A92] font-sans leading-relaxed transition-all resize-y"
                    />
                    <div className="flex items-center justify-between text-[11px] text-[#8C7D76]">
                      <span className="font-mono text-[#6B5E57] bg-white px-2 py-0.5 rounded border border-[#E8DED8]">
                        Field: backPatternDescription
                      </span>
                      <span className="font-mono text-[#6B5E57]">{backPatternDescriptionText.length} karakter</span>
                    </div>
                  </div>

                  {/* 2. English Description Field */}
                  <div className="space-y-3 bg-[#FCFAF7] p-4 rounded-xl border border-[#E8DED8]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                        <span className="text-xs font-bold text-[#332C29] tracking-wide uppercase">
                          English Description
                        </span>
                      </div>
                      <span className="text-[11px] text-[#6B5E57] bg-white px-2 py-0.5 rounded border border-[#DFD4CD]">
                        🇬🇧 English (Manual)
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6B5E57]">
                      Manual input for English mode. Leave empty if not yet translated.
                    </p>

                    {/* Formatting Toolbar - EN */}
                    <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-lg bg-white border border-[#DFD4CD]">
                      <button
                        type="button"
                        title="Format Bold Text (**bold**)"
                        onClick={() => applyFormatting(backEnTextareaRef, backPatternDescriptionEnText, setBackPatternDescriptionEnText, 'bold')}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#F5EFEB] hover:bg-[#E8DED8] text-xs font-bold text-[#332C29] transition-all cursor-pointer"
                      >
                        <Bold size={12} />
                        <span>Bold</span>
                      </button>
                      <button
                        type="button"
                        title="Format Numbered List (1. 2. 3.)"
                        onClick={() => applyFormatting(backEnTextareaRef, backPatternDescriptionEnText, setBackPatternDescriptionEnText, 'numbered')}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#F5EFEB] hover:bg-[#E8DED8] text-xs font-bold text-[#332C29] transition-all cursor-pointer"
                      >
                        <ListOrdered size={12} />
                        <span>Numbered</span>
                      </button>
                      <button
                        type="button"
                        title="Format Bullet List (• Bullet)"
                        onClick={() => applyFormatting(backEnTextareaRef, backPatternDescriptionEnText, setBackPatternDescriptionEnText, 'bullet')}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#F5EFEB] hover:bg-[#E8DED8] text-xs font-bold text-[#332C29] transition-all cursor-pointer"
                      >
                        <List size={12} />
                        <span>Bullets</span>
                      </button>
                      <button
                        type="button"
                        title="Insert New Paragraph"
                        onClick={() => applyFormatting(backEnTextareaRef, backPatternDescriptionEnText, setBackPatternDescriptionEnText, 'paragraph')}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#F5EFEB] hover:bg-[#E8DED8] text-xs font-bold text-[#332C29] transition-all cursor-pointer"
                      >
                        <AlignLeft size={12} />
                        <span>Paragraph</span>
                      </button>
                    </div>

                    {/* Textarea - EN */}
                    <textarea
                      ref={backEnTextareaRef}
                      id="back-pattern-description-en-input"
                      rows={8}
                      value={backPatternDescriptionEnText}
                      onChange={(e) => setBackPatternDescriptionEnText(e.target.value)}
                      placeholder={
                        selectedCalcId === 'rok-pias-godet'
                          ? `Example:\n1. A – B = Godet length (equal to panel slit length)\n2. B – C = B – D = Bottom godet width (10 – 15 cm)\n• Create curved bottom line of godet C – B' – D\n• Cut godet pieces according to the number of slits`
                          : `Example:\n1. A – B = Back waist curve drop 2 cm\n2. A – C = Hip height 20 cm\n3. A – D = Skirt length 60 cm\n• Side seam line identical to front pattern\n• Back Center line follows fabric grain`
                      }
                      className="w-full p-3.5 rounded-xl border border-[#DFD4CD] bg-white focus:border-[#332C29] focus:ring-2 focus:ring-[#332C29]/20 text-xs sm:text-sm text-[#332C29] placeholder-[#A89A92] font-sans leading-relaxed transition-all resize-y"
                    />
                    <div className="flex items-center justify-between text-[11px] text-[#8C7D76]">
                      <span className="font-mono text-[#6B5E57] bg-white px-2 py-0.5 rounded border border-[#E8DED8]">
                        Field: backPatternDescription_en
                      </span>
                      <span className="font-mono text-[#6B5E57]">{backPatternDescriptionEnText.length} characters</span>
                    </div>
                  </div>
                </div>

                {/* Live Formatted Preview with Language Switch */}
                {showBackPreview && (
                  <div className="p-4 rounded-xl bg-[#FAF6F3] border border-[#E8DED8] space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E8DED8]">
                      <span className="text-xs font-bold text-[#332C29] uppercase tracking-wider flex items-center gap-1.5">
                        <Eye size={13} />
                        Pratinjau Tampilan Siswa ({selectedCalcId === 'rok-lingkaran' ? 'Rok Setengah Lingkaran' : selectedCalcId === 'rok-pias-godet' ? 'Pola Godet' : 'Pola Belakang'})
                      </span>

                      {/* Preview Language Tabs */}
                      <div className="inline-flex rounded-lg border border-[#DFD4CD] p-0.5 bg-white">
                        <button
                          type="button"
                          onClick={() => setBackPreviewLang('id')}
                          className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                            backPreviewLang === 'id'
                              ? 'bg-[#332C29] text-white shadow-xs'
                              : 'text-[#6B5E57] hover:text-[#332C29]'
                          }`}
                        >
                          🇮🇩 Bahasa Indonesia
                        </button>
                        <button
                          type="button"
                          onClick={() => setBackPreviewLang('en')}
                          className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                            backPreviewLang === 'en'
                              ? 'bg-[#332C29] text-white shadow-xs'
                              : 'text-[#6B5E57] hover:text-[#332C29]'
                          }`}
                        >
                          🇬🇧 English
                        </button>
                      </div>
                    </div>

                    {backPreviewLang === 'id' ? (
                      backPatternDescriptionText.trim() ? (
                        <FormattedPatternInstructions content={backPatternDescriptionText} accentColor="charcoal" />
                      ) : (
                        <p className="text-xs text-[#8C7D76] italic py-2">
                          Deskripsi Bahasa Indonesia belum diisi.
                        </p>
                      )
                    ) : (
                      backPatternDescriptionEnText.trim() ? (
                        <FormattedPatternInstructions content={backPatternDescriptionEnText} accentColor="charcoal" />
                      ) : (
                        <p className="text-xs text-[#8C7D76] italic py-2">
                          English description has not been entered yet.
                        </p>
                      )
                    )}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* 3C. Dedicated Section for Dressmaking Bodice: CARA PEMBUATAN KUPNAT — ZOOM PEMBUATAN KUPNAT */}
          {(selectedCalcId === 'badan-dressmaking' || selectedCalcId === 'basic-bodice-dressmaking' || (Boolean(selectedCalcId?.includes('dressmaking')) && Boolean(selectedCalcId?.includes('badan')))) && (
            <section className="bg-white rounded-2xl border border-[#E8DED8] shadow-sm overflow-hidden transition-all">
              <div className="px-6 py-4 bg-[#FCFAF7] border-b border-[#E8DED8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase bg-[#8F2635] text-white">
                    Pembuatan Kupnat
                  </span>
                  <div>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#332C29]">
                      CARA PEMBUATAN KUPNAT — ZOOM PEMBUATAN KUPNAT DEPAN
                    </h3>
                    <p className="text-xs text-[#6B5E57]">
                      Kelola instruksi bilingual untuk visual Zoom Pembuatan Kupnat Sisi pada Pola Depan Dressmaking.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowSideDartPreview(!showSideDartPreview)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DFD4CD] bg-white hover:bg-[#F5EFEB] text-xs font-semibold text-[#6B5E57] transition-all cursor-pointer"
                  >
                    <Eye size={13} />
                    <span>{showSideDartPreview ? 'Tutup Pratinjau' : 'Lihat Pratinjau'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveSection('sideDart')}
                    disabled={savingSection === 'sideDart' || isSavingDescription}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#8F2635] hover:bg-[#7A1F2D] text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
                    title="Simpan bagian ini ke Firestore"
                  >
                    {savingSection === 'sideDart' ? (
                      <>
                        <RefreshCw size={13} className="animate-spin" />
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <>
                        <Save size={13} />
                        <span>Simpan Bagian Ini</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {sectionSaveSuccess === 'sideDart' && (
                <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 size={15} className="shrink-0 text-emerald-600" />
                  <span>Instruksi Pembuatan Kupnat (ID & EN) berhasil disimpan ke Firestore!</span>
                </div>
              )}

              <div className="p-6 space-y-6">
                {/* Dual-Language Input Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* 1. Indonesian Description Field */}
                  <div className="space-y-3 bg-[#FCFAF7] p-4 rounded-xl border border-[#E8DED8]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-600"></span>
                        <span className="text-xs font-bold text-[#332C29] tracking-wide uppercase">
                          Deskripsi Bahasa Indonesia
                        </span>
                      </div>
                      <span className="text-[11px] text-[#6B5E57] bg-white px-2 py-0.5 rounded border border-[#DFD4CD]">
                        🇮🇩 Bahasa Indonesia
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6B5E57]">
                      Instruksi manual yang tampil saat siswa memilih Bahasa Indonesia.
                    </p>

                    {/* Formatting Toolbar - ID */}
                    <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-lg bg-white border border-[#DFD4CD]">
                      <button
                        type="button"
                        title="Format Teks Tebal (**tebal**)"
                        onClick={() => applyFormatting(sideDartTextareaRef, sideDartDescriptionText, setSideDartDescriptionText, 'bold')}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#F5EFEB] hover:bg-[#E8DED8] text-xs font-bold text-[#332C29] transition-all cursor-pointer"
                      >
                        <Bold size={12} />
                        <span>Tebal</span>
                      </button>
                      <button
                        type="button"
                        title="Format Daftar Bernomor (1. 2. 3.)"
                        onClick={() => applyFormatting(sideDartTextareaRef, sideDartDescriptionText, setSideDartDescriptionText, 'numbered')}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#F5EFEB] hover:bg-[#E8DED8] text-xs font-bold text-[#332C29] transition-all cursor-pointer"
                      >
                        <ListOrdered size={12} />
                        <span>Nomor</span>
                      </button>
                      <button
                        type="button"
                        title="Format Daftar Poin (• Poin)"
                        onClick={() => applyFormatting(sideDartTextareaRef, sideDartDescriptionText, setSideDartDescriptionText, 'bullet')}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#F5EFEB] hover:bg-[#E8DED8] text-xs font-bold text-[#332C29] transition-all cursor-pointer"
                      >
                        <List size={12} />
                        <span>Poin</span>
                      </button>
                      <button
                        type="button"
                        title="Sisipkan Paragraf Baru"
                        onClick={() => applyFormatting(sideDartTextareaRef, sideDartDescriptionText, setSideDartDescriptionText, 'paragraph')}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#F5EFEB] hover:bg-[#E8DED8] text-xs font-bold text-[#332C29] transition-all cursor-pointer"
                      >
                        <AlignLeft size={12} />
                        <span>Paragraf</span>
                      </button>
                    </div>

                    {/* Textarea - ID */}
                    <textarea
                      ref={sideDartTextareaRef}
                      id="side-dart-description-input"
                      rows={8}
                      value={sideDartDescriptionText}
                      onChange={(e) => setSideDartDescriptionText(e.target.value)}
                      placeholder={`Contoh:\n1. B – B1 = Turun 5 cm pada garis sisi\n2. Tarik garis penolong dari B1 menuju titik puncak payudara (O)\n3. Tentukan besar bukaan kupnat sisi (selisih panjang muka dan panjang punggung)\n• Ujung kupnat dimundurkan 2–3 cm dari titik puncak payudara`}
                      className="w-full p-3.5 rounded-xl border border-[#DFD4CD] bg-white focus:border-[#8F2635] focus:ring-2 focus:ring-[#8F2635]/20 text-xs sm:text-sm text-[#332C29] placeholder-[#A89A92] font-sans leading-relaxed transition-all resize-y"
                    />
                    <div className="flex items-center justify-between text-[11px] text-[#8C7D76]">
                      <span className="font-mono text-[#6B5E57] bg-white px-2 py-0.5 rounded border border-[#E8DED8]">
                        Field: sideDartDescription / kupnatDescription
                      </span>
                      <span className="font-mono text-[#6B5E57]">{sideDartDescriptionText.length} karakter</span>
                    </div>
                  </div>

                  {/* 2. English Description Field */}
                  <div className="space-y-3 bg-[#FCFAF7] p-4 rounded-xl border border-[#E8DED8]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                        <span className="text-xs font-bold text-[#332C29] tracking-wide uppercase">
                          English Description
                        </span>
                      </div>
                      <span className="text-[11px] text-[#6B5E57] bg-white px-2 py-0.5 rounded border border-[#DFD4CD]">
                        🇬🇧 English (Manual)
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6B5E57]">
                      Manual input for English mode. Leave empty if not yet translated.
                    </p>

                    {/* Formatting Toolbar - EN */}
                    <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-lg bg-white border border-[#DFD4CD]">
                      <button
                        type="button"
                        title="Format Bold Text (**bold**)"
                        onClick={() => applyFormatting(sideDartEnTextareaRef, sideDartDescriptionEnText, setSideDartDescriptionEnText, 'bold')}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#F5EFEB] hover:bg-[#E8DED8] text-xs font-bold text-[#332C29] transition-all cursor-pointer"
                      >
                        <Bold size={12} />
                        <span>Bold</span>
                      </button>
                      <button
                        type="button"
                        title="Format Numbered List (1. 2. 3.)"
                        onClick={() => applyFormatting(sideDartEnTextareaRef, sideDartDescriptionEnText, setSideDartDescriptionEnText, 'numbered')}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#F5EFEB] hover:bg-[#E8DED8] text-xs font-bold text-[#332C29] transition-all cursor-pointer"
                      >
                        <ListOrdered size={12} />
                        <span>Numbered</span>
                      </button>
                      <button
                        type="button"
                        title="Format Bullet List (• Bullet)"
                        onClick={() => applyFormatting(sideDartEnTextareaRef, sideDartDescriptionEnText, setSideDartDescriptionEnText, 'bullet')}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#F5EFEB] hover:bg-[#E8DED8] text-xs font-bold text-[#332C29] transition-all cursor-pointer"
                      >
                        <List size={12} />
                        <span>Bullets</span>
                      </button>
                      <button
                        type="button"
                        title="Insert New Paragraph"
                        onClick={() => applyFormatting(sideDartEnTextareaRef, sideDartDescriptionEnText, setSideDartDescriptionEnText, 'paragraph')}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#F5EFEB] hover:bg-[#E8DED8] text-xs font-bold text-[#332C29] transition-all cursor-pointer"
                      >
                        <AlignLeft size={12} />
                        <span>Paragraph</span>
                      </button>
                    </div>

                    {/* Textarea - EN */}
                    <textarea
                      ref={sideDartEnTextareaRef}
                      id="side-dart-description-en-input"
                      rows={8}
                      value={sideDartDescriptionEnText}
                      onChange={(e) => setSideDartDescriptionEnText(e.target.value)}
                      placeholder={`Example:\n1. B – B1 = Drop 5 cm along the side seam\n2. Draw a guideline from B1 towards the bust apex point (O)\n3. Determine side dart intake (difference between front length and back length)\n• Dart tip ends 2–3 cm back from the bust apex point`}
                      className="w-full p-3.5 rounded-xl border border-[#DFD4CD] bg-white focus:border-[#8F2635] focus:ring-2 focus:ring-[#8F2635]/20 text-xs sm:text-sm text-[#332C29] placeholder-[#A89A92] font-sans leading-relaxed transition-all resize-y"
                    />
                    <div className="flex items-center justify-between text-[11px] text-[#8C7D76]">
                      <span className="font-mono text-[#6B5E57] bg-white px-2 py-0.5 rounded border border-[#E8DED8]">
                        Field: sideDartDescription_en
                      </span>
                      <span className="font-mono text-[#6B5E57]">{sideDartDescriptionEnText.length} characters</span>
                    </div>
                  </div>
                </div>

                {/* Live Formatted Preview with Language Switch */}
                {showSideDartPreview && (
                  <div className="p-4 rounded-xl bg-[#FAF6F3] border border-[#E8DED8] space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E8DED8]">
                      <span className="text-xs font-bold text-[#8F2635] uppercase tracking-wider flex items-center gap-1.5">
                        <Eye size={13} />
                        Pratinjau Tampilan Siswa (Zoom Pembuatan Kupnat)
                      </span>

                      {/* Preview Language Tabs */}
                      <div className="inline-flex rounded-lg border border-[#DFD4CD] p-0.5 bg-white">
                        <button
                          type="button"
                          onClick={() => setSideDartPreviewLang('id')}
                          className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                            sideDartPreviewLang === 'id'
                              ? 'bg-[#8F2635] text-white shadow-xs'
                              : 'text-[#6B5E57] hover:text-[#332C29]'
                          }`}
                        >
                          🇮🇩 Bahasa Indonesia
                        </button>
                        <button
                          type="button"
                          onClick={() => setSideDartPreviewLang('en')}
                          className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                            sideDartPreviewLang === 'en'
                              ? 'bg-[#8F2635] text-white shadow-xs'
                              : 'text-[#6B5E57] hover:text-[#332C29]'
                          }`}
                        >
                          🇬🇧 English
                        </button>
                      </div>
                    </div>

                    {sideDartPreviewLang === 'id' ? (
                      sideDartDescriptionText.trim() ? (
                        <FormattedPatternInstructions content={sideDartDescriptionText} accentColor="burgundy" />
                      ) : (
                        <p className="text-xs text-[#8C7D76] italic py-2">
                          Deskripsi Bahasa Indonesia belum diisi.
                        </p>
                      )
                    ) : (
                      sideDartDescriptionEnText.trim() ? (
                        <FormattedPatternInstructions content={sideDartDescriptionEnText} accentColor="burgundy" />
                      ) : (
                        <p className="text-xs text-[#8C7D76] italic py-2">
                          English description has not been entered yet.
                        </p>
                      )
                    )}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* SECTION 3E: CATATAN PENTING POLA (IMPORTANT PATTERN NOTES) */}
          <section
            id="admin-important-notes-section"
            className="rounded-2xl border border-[#E8DED8] bg-white overflow-hidden shadow-xs"
          >
            {/* Section Header */}
            <div className="p-5 border-b border-[#E8DED8] bg-[#FAF8F5] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-[#8F2635] tracking-wider uppercase bg-[#F3E8E8] px-2.5 py-0.5 rounded-full">
                    Catatan Pola (Opsional)
                  </span>
                  {importantNoteIdText.trim() || importantNoteEnText.trim() ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      Aktif
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-[#8C7D76] bg-[#E8DED8]/60 px-2 py-0.5 rounded-full">
                      Kosong (Tidak Tampil di Siswa)
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-[#332C29] mt-1">
                  CATATAN PENTING POLA (IMPORTANT PATTERN NOTES)
                </h3>
                <p className="text-xs text-[#6B5E57] mt-0.5 max-w-2xl">
                  Kelola catatan penting pola dalam Bahasa Indonesia &amp; English secara mandiri. Tampil di atas gambar pola pada dasbor siswa. Jika dikosongkan, bagian catatan di dasbor siswa otomatis disembunyikan.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowNotesPreview(!showNotesPreview)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    showNotesPreview
                      ? 'bg-[#8F2635] text-white border-[#8F2635]'
                      : 'border-[#DFD4CD] bg-white text-[#6B5E57] hover:bg-[#F5EFEB]'
                  }`}
                  title="Pratinjau Catatan Penting Pola"
                >
                  <Eye size={13} />
                  <span>{showNotesPreview ? 'Tutup Pratinjau' : 'Pratinjau'}</span>
                </button>

                {(importantNoteIdText.trim() || importantNoteEnText.trim()) && (
                  <button
                    type="button"
                    onClick={handleClearNotes}
                    disabled={savingSection === 'notes' || isSavingDescription}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                    title="Kosongkan Catatan Penting Pola"
                  >
                    <Trash2 size={13} />
                    <span>Kosongkan</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleSaveSection('notes')}
                  disabled={savingSection === 'notes' || isSavingDescription}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#8F2635] hover:bg-[#7A1F2D] text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {savingSection === 'notes' ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Save size={13} />
                      <span>Simpan Catatan</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Section Save Success Feedback */}
            {sectionSaveSuccess === 'notes' && (
              <div className="mx-5 mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                <span>Catatan Penting Pola (ID &amp; EN) berhasil disimpan ke Firestore!</span>
              </div>
            )}

            {/* Dual Language Input Grid */}
            <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Column 1: Indonesian Notes */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🇮🇩</span>
                    <span className="text-xs font-bold text-[#332C29]">Catatan Penting — Bahasa Indonesia</span>
                    <span className="text-[10px] bg-[#F3E8E8] text-[#8F2635] px-1.5 py-0.5 rounded font-medium">
                      ID
                    </span>
                  </div>
                  <span className="text-[11px] text-[#8C7D76]">
                    {importantNoteIdText.length} karakter
                  </span>
                </div>
                <p className="text-[11px] text-[#6B5E57]">
                  Tampil saat siswa memilih Bahasa Indonesia. Kosongkan jika tidak ada catatan khusus untuk pola ini.
                </p>

                {/* Toolbar */}
                <div className="flex items-center gap-1 p-1 bg-[#FAF8F5] border border-[#E8DED8] rounded-lg">
                  <button
                    type="button"
                    title="Tebal (**teks**)"
                    onClick={() => applyFormatting(notesTextareaRef, importantNoteIdText, setImportantNoteIdText, 'bold')}
                    className="p-1.5 rounded hover:bg-[#E8DED8] text-[#6B5E57] hover:text-[#332C29] transition-colors"
                  >
                    <Bold size={13} />
                  </button>
                  <button
                    type="button"
                    title="Daftar Bernomor (1. )"
                    onClick={() => applyFormatting(notesTextareaRef, importantNoteIdText, setImportantNoteIdText, 'numbered')}
                    className="p-1.5 rounded hover:bg-[#E8DED8] text-[#6B5E57] hover:text-[#332C29] transition-colors"
                  >
                    <ListOrdered size={13} />
                  </button>
                  <button
                    type="button"
                    title="Daftar Poin (- )"
                    onClick={() => applyFormatting(notesTextareaRef, importantNoteIdText, setImportantNoteIdText, 'bullet')}
                    className="p-1.5 rounded hover:bg-[#E8DED8] text-[#6B5E57] hover:text-[#332C29] transition-colors"
                  >
                    <List size={13} />
                  </button>
                  <button
                    type="button"
                    title="Paragraf Baru"
                    onClick={() => applyFormatting(notesTextareaRef, importantNoteIdText, setImportantNoteIdText, 'paragraph')}
                    className="p-1.5 rounded hover:bg-[#E8DED8] text-[#6B5E57] hover:text-[#332C29] transition-colors"
                  >
                    <AlignLeft size={13} />
                  </button>
                </div>

                {/* Textarea ID */}
                <textarea
                  ref={notesTextareaRef}
                  id="admin-important-notes-id-textarea"
                  value={importantNoteIdText}
                  onChange={(e) => setImportantNoteIdText(e.target.value)}
                  placeholder="Contoh:&#10;* Untuk model ini, penambahan kupnat bersifat opsional.&#10;* Selalu lakukan pengecekan ulang lingkar pinggang sebelum memotong kain."
                  rows={7}
                  className="w-full p-3 rounded-xl border border-[#DFD4CD] focus:border-[#8F2635] focus:ring-1 focus:ring-[#8F2635] outline-hidden text-xs font-mono text-[#332C29] bg-white resize-y leading-relaxed"
                />
                <div className="text-[11px] text-[#8C7D76] font-mono">
                  Field Firestore: <code className="text-[#8F2635] font-bold">importantNote_id</code>
                </div>
              </div>

              {/* Column 2: English Notes */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🇬🇧</span>
                    <span className="text-xs font-bold text-[#332C29]">Important Notes — English</span>
                    <span className="text-[10px] bg-[#E8EDF2] text-[#2C4E6F] px-1.5 py-0.5 rounded font-medium">
                      EN
                    </span>
                  </div>
                  <span className="text-[11px] text-[#8C7D76]">
                    {importantNoteEnText.length} characters
                  </span>
                </div>
                <p className="text-[11px] text-[#6B5E57]">
                  Displayed when student selects English. Keep empty if not available in English.
                </p>

                {/* Toolbar */}
                <div className="flex items-center gap-1 p-1 bg-[#FAF8F5] border border-[#E8DED8] rounded-lg">
                  <button
                    type="button"
                    title="Bold (**text**)"
                    onClick={() => applyFormatting(notesEnTextareaRef, importantNoteEnText, setImportantNoteEnText, 'bold')}
                    className="p-1.5 rounded hover:bg-[#E8DED8] text-[#6B5E57] hover:text-[#332C29] transition-colors"
                  >
                    <Bold size={13} />
                  </button>
                  <button
                    type="button"
                    title="Numbered List (1. )"
                    onClick={() => applyFormatting(notesEnTextareaRef, importantNoteEnText, setImportantNoteEnText, 'numbered')}
                    className="p-1.5 rounded hover:bg-[#E8DED8] text-[#6B5E57] hover:text-[#332C29] transition-colors"
                  >
                    <ListOrdered size={13} />
                  </button>
                  <button
                    type="button"
                    title="Bullet List (- )"
                    onClick={() => applyFormatting(notesEnTextareaRef, importantNoteEnText, setImportantNoteEnText, 'bullet')}
                    className="p-1.5 rounded hover:bg-[#E8DED8] text-[#6B5E57] hover:text-[#332C29] transition-colors"
                  >
                    <List size={13} />
                  </button>
                  <button
                    type="button"
                    title="New Paragraph"
                    onClick={() => applyFormatting(notesEnTextareaRef, importantNoteEnText, setImportantNoteEnText, 'paragraph')}
                    className="p-1.5 rounded hover:bg-[#E8DED8] text-[#6B5E57] hover:text-[#332C29] transition-colors"
                  >
                    <AlignLeft size={13} />
                  </button>
                </div>

                {/* Textarea EN */}
                <textarea
                  ref={notesEnTextareaRef}
                  id="admin-important-notes-en-textarea"
                  value={importantNoteEnText}
                  onChange={(e) => setImportantNoteEnText(e.target.value)}
                  placeholder="Example:&#10;* For this pattern, dart addition is optional.&#10;* Always double-check waist measurement before cutting fabric."
                  rows={7}
                  className="w-full p-3 rounded-xl border border-[#DFD4CD] focus:border-[#8F2635] focus:ring-1 focus:ring-[#8F2635] outline-hidden text-xs font-mono text-[#332C29] bg-white resize-y leading-relaxed"
                />
                <div className="text-[11px] text-[#8C7D76] font-mono">
                  Field Firestore: <code className="text-[#8F2635] font-bold">importantNote_en</code>
                </div>
              </div>
            </div>

            {/* Live Preview Panel */}
            {showNotesPreview && (
              <div className="p-5 bg-[#FAF8F5] border-t border-[#E8DED8] space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#332C29] uppercase tracking-wider flex items-center gap-2">
                    <Eye size={14} className="text-[#8F2635]" />
                    <span>Pratinjau Catatan Penting Pola (Live Preview)</span>
                  </h4>
                  <span className="text-[11px] text-[#8C7D76]">
                    Format otomatis (tebal, nomor, poin, link)
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white border border-[#E8DED8] shadow-xs">
                    <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-[#E8DED8]">
                      <span className="text-xs">🇮🇩</span>
                      <span className="text-xs font-bold text-[#332C29]">Pratinjau Bahasa Indonesia</span>
                    </div>
                    {importantNoteIdText.trim() ? (
                      <FormattedPatternInstructions content={importantNoteIdText} accentColor="burgundy" />
                    ) : (
                      <p className="text-xs text-[#8C7D76] italic py-2">
                        Belum ada catatan Bahasa Indonesia.
                      </p>
                    )}
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-[#E8DED8] shadow-xs">
                    <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-[#E8DED8]">
                      <span className="text-xs">🇬🇧</span>
                      <span className="text-xs font-bold text-[#332C29]">English Preview</span>
                    </div>
                    {importantNoteEnText.trim() ? (
                      <FormattedPatternInstructions content={importantNoteEnText} accentColor="burgundy" />
                    ) : (
                      <p className="text-xs text-[#8C7D76] italic py-2">
                        No English notes entered yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Bottom Save Action */}
          <div className="p-5 rounded-2xl bg-white border border-[#E8DED8] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <span className="text-xs text-[#6B5E57]">
              Semua perubahan tersimpan langsung ke database Firestore secara aman tanpa menghapus data sebelumnya.
            </span>
            <button
              type="button"
              onClick={handleSaveDescriptions}
              disabled={isSavingDescription || isLoading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#8F2635] hover:bg-[#7A1F2D] text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50 shrink-0"
            >
              {isSavingDescription ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Check size={15} />
                  <span>Simpan Semua Instruksi Pola</span>
                </>
              )}
            </button>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E8DED8] py-4 px-6 text-center text-xs text-[#8C7D76]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} La Moda Learning Studio • Image Management System</span>
          <button
            type="button"
            onClick={onBackToStudentCalculator}
            className="text-[#8F2635] hover:underline font-semibold cursor-pointer"
          >
            ← Kembali ke Kalkulator Pola Rok Siswa
          </button>
        </div>
      </footer>

      {/* In-App Delete Confirmation Modal (Reliable in all iframe and sandbox contexts) */}
      {deleteModal?.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E8DED8] space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                <Trash2 size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#332C29] font-serif">
                  Konfirmasi Hapus {deleteModal.slotLabel}
                </h3>
                <p className="text-xs text-[#6B5E57] mt-1.5 leading-relaxed">
                  {deleteModal.confirmMessage}
                </p>
              </div>
            </div>

            <div className="p-3 bg-red-50/80 rounded-xl border border-red-200/80 text-[11px] text-red-800 flex items-center gap-2">
              <AlertCircle size={14} className="shrink-0 text-red-600" />
              <span>Tindakan ini permanen dan tidak dapat dibatalkan.</span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModal(null)}
                disabled={Boolean(deletingSlot)}
                className="px-4 py-2 rounded-xl border border-[#DFD4CD] bg-white hover:bg-[#FCFAF7] text-[#6B5E57] text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={executeConfirmedDeletion}
                disabled={Boolean(deletingSlot)}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
              >
                {deletingSlot ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={13} />
                    <span>Hapus Sekarang</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
