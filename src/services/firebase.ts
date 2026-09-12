import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  initializeFirestore, 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { optimizeImageFile } from '../utils/imageOptimizer';
import config from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp({
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId,
});

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Firestore with robust connection settings (force long-polling for sandbox/iframe support)
function initFirestoreInstance() {
  try {
    return initializeFirestore(
      app,
      {
        experimentalForceLongPolling: true,
      },
      config.firestoreDatabaseId || undefined
    );
  } catch (_e) {
    return config.firestoreDatabaseId
      ? getFirestore(app, config.firestoreDatabaseId)
      : getFirestore(app);
  }
}

export const db = initFirestoreInstance();

// Initialize Firebase Storage
export const storage = getStorage(app);

/**
 * Sign in as administrator using Email/Password
 */
export async function signInAdmin(email: string, password: string): Promise<User> {
  const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
  return credential.user;
}

/**
 * Sign out current administrator
 */
export async function signOutAdmin(): Promise<void> {
  await signOut(auth);
}

/**
 * Subscribe to Firebase Auth state changes
 */
export function subscribeAuthState(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
}

/**
 * Get current authenticated Firebase user
 */
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

export interface CalculatorImageConfig {
  id: string;
  garmentId?: string;
  systemId?: string;
  systemNumber?: number;
  name: string;
  measurementGuideImage?: string | null;
  patternImage?: string | null;
  dressmakingBackPatternImage?: string | null;
  dressmakingFrontPatternImage?: string | null;
  dressmakingSideDartImage?: string | null;
  sideDartDetailImage?: string | null;
  frontPatternImage?: string | null;
  backPatternImage?: string | null;
  detailPatternImage?: string | null;
  fullCirclePatternImage?: string | null;
  halfCirclePatternImage?: string | null;
  tier4PatternImage?: string | null;
  patternDescription?: string | null;
  frontPatternDescription?: string | null;
  backPatternDescription?: string | null;
  tier4PatternDescription?: string | null;
  sideDartDescription?: string | null;
  kupnatDescription?: string | null;
  fullCircleInstructions?: string | null;
  halfCircleInstructions?: string | null;
  // Bilingual English pattern drafting instructions
  patternDescription_en?: string | null;
  frontPatternDescription_en?: string | null;
  backPatternDescription_en?: string | null;
  tier4PatternDescription_en?: string | null;
  sideDartDescription_en?: string | null;
  kupnatDescription_en?: string | null;
  importantNote_id?: string | null;
  importantNote_en?: string | null;
  importantNotes_id?: string | null;
  importantNotes_en?: string | null;
  importantNotes?: string[] | null;
  storagePaths?: Record<string, string>;
  updatedAt?: string;
  updatedBy?: string;
}

export const SUPPORTED_CALCULATORS = [
  { id: 'shared-bodice', garmentId: 'shared', systemId: 'bodice-guide', systemNumber: 0, name: 'Asset Bersama: Petunjuk Pengukuran Badan (3 Modul)', active: true, isShared: true },
  { id: 'shared-skirt', garmentId: 'shared', systemId: 'skirt-guide', systemNumber: 0, name: 'Asset Bersama: Petunjuk Pengukuran Rok (3 Modul)', active: true, isShared: true },
  { id: 'shared-skirt-2meas', garmentId: 'shared', systemId: 'skirt-2meas-guide', systemNumber: 0, name: 'Asset Bersama: Petunjuk Pengukuran Rok (Rok Lingkaran & Rok Lipit Searah)', active: true, isShared: true },
  { id: 'shared-pants', garmentId: 'shared', systemId: 'pants-guide', systemNumber: 0, name: 'Asset Bersama: Petunjuk Pengukuran Celana (Kulot & Celana Piyama)', active: true, isShared: true },
  { id: 'badan-sederhana', garmentId: 'badan', systemId: 'sederhana', systemNumber: 1, name: 'Pola Dasar Badan Wanita — Sistem Sederhana', active: true },
  { id: 'badan-dressmaking', garmentId: 'badan', systemId: 'dressmaking', systemNumber: 2, name: 'Pola Dasar Badan Wanita — Sistem Dressmaking', active: true },
  { id: 'badan-indonesia', garmentId: 'badan', systemId: 'indonesia', systemNumber: 3, name: 'Pola Dasar Badan Wanita — Sistem Indonesia', active: true },
  { id: 'rok', garmentId: 'rok', systemId: 'sederhana', systemNumber: 1, name: 'Pola Dasar Rok — Sistem Sederhana', active: true },
  { id: 'rok-dressmaking', garmentId: 'rok', systemId: 'dressmaking', systemNumber: 2, name: 'Pola Dasar Rok — Sistem Dressmaking', active: true },
  { id: 'rok-indonesia', garmentId: 'rok', systemId: 'indonesia', systemNumber: 3, name: 'Pola Dasar Rok — Sistem Indonesia', active: true },
  { id: 'rok-lingkaran', garmentId: 'rok', systemId: 'lingkaran', systemNumber: 4, name: 'Rok Lingkaran & Setengah Lingkaran', active: true },
  { id: 'pola-rok-kerut-bertingkat', garmentId: 'rok', systemId: 'kerut-bertingkat', systemNumber: 5, name: 'Pola Rok Kerut Bertingkat', active: true },
  { id: 'rok-pias-godet', garmentId: 'rok', systemId: 'pias-godet', systemNumber: 6, name: 'Pola Rok Pias & Godet', active: true },
  { id: 'rok-lipit-searah', garmentId: 'rok', systemId: 'lipit-searah', systemNumber: 7, name: 'Pola Rok Lipit Searah', active: true },
  { id: 'pola-lengan', garmentId: 'lengan', systemId: 'standar', systemNumber: 1, name: 'Pola Dasar Lengan', active: true },
  { id: 'pola-celana-piyama', garmentId: 'celana', systemId: 'piyama', systemNumber: 1, name: 'Celana Piyama', active: true },
  { id: 'pola-kulot', garmentId: 'celana', systemId: 'kulot', systemNumber: 2, name: 'Pola Kulot', active: true },
  { id: 'dress', garmentId: 'dress', systemId: 'standar', systemNumber: 1, name: 'Pola Dasar Dress', active: false },
  { id: 'blouse', garmentId: 'blouse', systemId: 'standar', systemNumber: 1, name: 'Pola Dasar Blouse', active: false },
];

// Default fallback images for calculators
export const DEFAULT_CALCULATOR_IMAGES: Record<string, { 
  measurementGuideImage: string; 
  patternImage: string; 
  dressmakingBackPatternImage?: string;
  dressmakingFrontPatternImage?: string;
  dressmakingSideDartImage?: string;
  sideDartDetailImage?: string;
  frontPatternImage?: string;
  backPatternImage?: string;
  detailPatternImage?: string;
  fullCirclePatternImage?: string;
  halfCirclePatternImage?: string;
  tier4PatternImage?: string;
}> = {
  'shared-skirt': {
    measurementGuideImage: '/assets/skirt_measurement_guide.jpg',
    patternImage: '',
  },
  'shared-bodice': {
    measurementGuideImage: '',
    patternImage: '',
  },
  rok: {
    measurementGuideImage: '/assets/skirt_measurement_guide.jpg',
    patternImage: '',
  },
  'rok-sederhana': {
    measurementGuideImage: '/assets/skirt_measurement_guide.jpg',
    patternImage: '',
  },
  'rok-dressmaking': {
    measurementGuideImage: '/assets/skirt_measurement_guide.jpg',
    patternImage: '',
  },
  'rok-indonesia': {
    measurementGuideImage: '/assets/skirt_measurement_guide.jpg',
    patternImage: '',
  },
  'rok-lingkaran': {
    measurementGuideImage: 'https://firebasestorage.googleapis.com/v0/b/main-app-la-moda.firebasestorage.app/o/calculators%2Frok-lipit-searah%2Fmeasurement-guide%2F1789086057159_Untitled343_20260702094924.webp?alt=media&token=2f600401-fdf2-4353-b63b-b00acb2210d8',
    patternImage: '',
    fullCirclePatternImage: '',
    halfCirclePatternImage: '',
  },
  'pola-rok-kerut-bertingkat': {
    measurementGuideImage: '/assets/skirt_measurement_guide.jpg',
    patternImage: '',
    tier4PatternImage: '',
  },
  'rok-kerut-bertingkat': {
    measurementGuideImage: '/assets/skirt_measurement_guide.jpg',
    patternImage: '',
    tier4PatternImage: '',
  },
  'rok-pias-godet': {
    measurementGuideImage: '/assets/skirt_measurement_guide.jpg',
    patternImage: '',
  },
  'rok-pias': {
    measurementGuideImage: '/assets/skirt_measurement_guide.jpg',
    patternImage: '',
  },
  'rok-lipit-searah': {
    measurementGuideImage: 'https://firebasestorage.googleapis.com/v0/b/main-app-la-moda.firebasestorage.app/o/calculators%2Frok-lipit-searah%2Fmeasurement-guide%2F1789086057159_Untitled343_20260702094924.webp?alt=media&token=2f600401-fdf2-4353-b63b-b00acb2210d8',
    patternImage: '',
  },
  'rok-lipit': {
    measurementGuideImage: 'https://firebasestorage.googleapis.com/v0/b/main-app-la-moda.firebasestorage.app/o/calculators%2Frok-lipit-searah%2Fmeasurement-guide%2F1789086057159_Untitled343_20260702094924.webp?alt=media&token=2f600401-fdf2-4353-b63b-b00acb2210d8',
    patternImage: '',
  },
  'badan-sederhana': {
    measurementGuideImage: '',
    patternImage: '',
  },
  badan: {
    measurementGuideImage: '',
    patternImage: '',
  },
  'badan-dressmaking': {
    measurementGuideImage: '',
    patternImage: '',
    dressmakingBackPatternImage: '',
    dressmakingFrontPatternImage: '',
    dressmakingSideDartImage: '',
    sideDartDetailImage: '',
  },
  'badan-indonesia': {
    measurementGuideImage: '',
    patternImage: '',
    frontPatternImage: '',
    backPatternImage: '',
    detailPatternImage: '',
    dressmakingFrontPatternImage: '',
    dressmakingBackPatternImage: '',
    dressmakingSideDartImage: '',
    sideDartDetailImage: '',
  },
  'shared-pants': {
    measurementGuideImage: '',
    patternImage: '',
  },
  'pola-lengan': {
    measurementGuideImage: '',
    patternImage: '',
  },
  'pola-celana-piyama': {
    measurementGuideImage: '',
    patternImage: '',
  },
  'celana-piyama': {
    measurementGuideImage: '',
    patternImage: '',
  },
  'pola-kulot': {
    measurementGuideImage: '',
    patternImage: '',
  },
  kulot: {
    measurementGuideImage: '',
    patternImage: '',
  },
  dress: {
    measurementGuideImage: '',
    patternImage: '',
  },
  blouse: {
    measurementGuideImage: '',
    patternImage: '',
  },
};

const LOCAL_STORAGE_PREFIX = 'lamoda_calc_images_';

/**
 * Fetch calculator images from Firestore or local cache
 */
export async function getCalculatorImages(calculatorId: string): Promise<CalculatorImageConfig> {
  const actualDocId = (calculatorId === 'shared-bodice' || calculatorId === 'shared-badan')
    ? 'badan-dressmaking'
    : (calculatorId === 'shared-skirt' ? 'rok' : (calculatorId === 'shared-skirt-2meas' || calculatorId === 'shared-lingkaran-lipit' ? 'rok-lipit-searah' : (calculatorId === 'shared-pants' || calculatorId === 'shared-celana' || calculatorId === 'shared-kulot-piyama' ? 'pola-celana-piyama' : (calculatorId === 'lengan' || calculatorId === 'basic-sleeve' ? 'pola-lengan' : (calculatorId === 'celana-piyama' || calculatorId === 'celana' || calculatorId === 'pajama-pants' ? 'pola-celana-piyama' : (calculatorId === 'rok-sederhana' ? 'rok' : calculatorId))))));

  const defaults = DEFAULT_CALCULATOR_IMAGES[calculatorId] || DEFAULT_CALCULATOR_IMAGES[actualDocId] || { measurementGuideImage: '', patternImage: '' };
  
  // Try reading local storage first for instant load
  const cached = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}${calculatorId}`) || localStorage.getItem(`${LOCAL_STORAGE_PREFIX}${actualDocId}`);
  let initialConfig: CalculatorImageConfig = cached 
    ? JSON.parse(cached)
    : {
        id: calculatorId,
        name: SUPPORTED_CALCULATORS.find(c => c.id === calculatorId)?.name || calculatorId,
        measurementGuideImage: defaults.measurementGuideImage,
        patternImage: defaults.patternImage,
        dressmakingBackPatternImage: defaults.dressmakingBackPatternImage || '',
        dressmakingFrontPatternImage: defaults.dressmakingFrontPatternImage || '',
        dressmakingSideDartImage: defaults.dressmakingSideDartImage || defaults.sideDartDetailImage || '',
        fullCirclePatternImage: defaults.fullCirclePatternImage || '',
        halfCirclePatternImage: defaults.halfCirclePatternImage || '',
        tier4PatternImage: defaults.tier4PatternImage || '',
        importantNote_id: undefined,
        importantNote_en: '',
      };

  try {
    const docRef = doc(db, 'calculators', actualDocId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as Partial<CalculatorImageConfig>;
      initialConfig = {
        id: calculatorId,
        name: SUPPORTED_CALCULATORS.find(c => c.id === calculatorId)?.name || data.name || initialConfig.name,
        measurementGuideImage: data.measurementGuideImage !== undefined ? data.measurementGuideImage : defaults.measurementGuideImage,
        patternImage: data.patternImage !== undefined ? data.patternImage : (data.fullCirclePatternImage || ''),
        fullCirclePatternImage: data.fullCirclePatternImage !== undefined ? data.fullCirclePatternImage : (data.patternImage || defaults.fullCirclePatternImage || ''),
        halfCirclePatternImage: data.halfCirclePatternImage !== undefined ? data.halfCirclePatternImage : (data.backPatternImage || defaults.halfCirclePatternImage || ''),
        tier4PatternImage: data.tier4PatternImage !== undefined ? data.tier4PatternImage : (defaults.tier4PatternImage || ''),
        dressmakingBackPatternImage: data.dressmakingBackPatternImage !== undefined ? data.dressmakingBackPatternImage : (defaults.dressmakingBackPatternImage || ''),
        dressmakingFrontPatternImage: data.dressmakingFrontPatternImage !== undefined ? data.dressmakingFrontPatternImage : (defaults.dressmakingFrontPatternImage || ''),
        dressmakingSideDartImage: data.dressmakingSideDartImage !== undefined ? data.dressmakingSideDartImage : (data.sideDartDetailImage !== undefined ? data.sideDartDetailImage : (defaults.dressmakingSideDartImage || '')),
        sideDartDetailImage: data.sideDartDetailImage !== undefined ? data.sideDartDetailImage : (data.dressmakingSideDartImage !== undefined ? data.dressmakingSideDartImage : ''),
        patternDescription: data.patternDescription !== undefined ? data.patternDescription : '',
        frontPatternDescription: data.frontPatternDescription !== undefined ? data.frontPatternDescription : (data.fullCircleInstructions || ''),
        backPatternDescription: data.backPatternDescription !== undefined ? data.backPatternDescription : (data.halfCircleInstructions || ''),
        tier4PatternDescription: data.tier4PatternDescription !== undefined ? data.tier4PatternDescription : '',
        sideDartDescription: data.sideDartDescription !== undefined ? data.sideDartDescription : (data.kupnatDescription !== undefined ? data.kupnatDescription : ''),
        kupnatDescription: data.kupnatDescription !== undefined ? data.kupnatDescription : (data.sideDartDescription !== undefined ? data.sideDartDescription : ''),
        fullCircleInstructions: data.fullCircleInstructions !== undefined ? data.fullCircleInstructions : (data.frontPatternDescription || ''),
        halfCircleInstructions: data.halfCircleInstructions !== undefined ? data.halfCircleInstructions : (data.backPatternDescription || ''),
        patternDescription_en: data.patternDescription_en !== undefined ? data.patternDescription_en : '',
        frontPatternDescription_en: data.frontPatternDescription_en !== undefined ? data.frontPatternDescription_en : '',
        backPatternDescription_en: data.backPatternDescription_en !== undefined ? data.backPatternDescription_en : '',
        tier4PatternDescription_en: data.tier4PatternDescription_en !== undefined ? data.tier4PatternDescription_en : '',
        sideDartDescription_en: data.sideDartDescription_en !== undefined ? data.sideDartDescription_en : (data.kupnatDescription_en !== undefined ? data.kupnatDescription_en : ''),
        kupnatDescription_en: data.kupnatDescription_en !== undefined ? data.kupnatDescription_en : (data.sideDartDescription_en !== undefined ? data.sideDartDescription_en : ''),
        importantNote_id: data.importantNote_id !== undefined ? data.importantNote_id : (data.importantNotes_id !== undefined ? data.importantNotes_id : undefined),
        importantNote_en: data.importantNote_en !== undefined ? data.importantNote_en : (data.importantNotes_en !== undefined ? data.importantNotes_en : ''),
        updatedAt: data.updatedAt,
      };

      // For pants calculators, ensure measurementGuideImage is sourced from the authoritative shared celana piyama doc
      if (isPantsCalculator(actualDocId)) {
        if (actualDocId !== 'pola-celana-piyama') {
          try {
            const piyamaSnap = await getDoc(doc(db, 'calculators', 'pola-celana-piyama'));
            if (piyamaSnap.exists()) {
              const piyamaData = piyamaSnap.data() as Partial<CalculatorImageConfig>;
              if (piyamaData.measurementGuideImage && piyamaData.measurementGuideImage.trim().length > 0) {
                initialConfig.measurementGuideImage = piyamaData.measurementGuideImage;
                if (piyamaData.storagePaths?.measurementGuideImage) {
                  initialConfig.storagePaths = {
                    ...(initialConfig.storagePaths || {}),
                    measurementGuideImage: piyamaData.storagePaths.measurementGuideImage,
                  };
                }
              }
            }
          } catch (_e) {
            // Non-fatal
          }
        }
      }

      // For Rok Lingkaran & Setengah Lingkaran Student, ensure measurementGuideImage is read directly from the shared rok-lipit-searah asset
      if (actualDocId === 'rok-lingkaran' || actualDocId === 'lingkaran' || actualDocId === 'circle-skirt') {
        try {
          const lipitSnap = await getDoc(doc(db, 'calculators', 'rok-lipit-searah'));
          if (lipitSnap.exists()) {
            const lipitData = lipitSnap.data() as Partial<CalculatorImageConfig>;
            if (lipitData.measurementGuideImage && lipitData.measurementGuideImage.trim().length > 0) {
              initialConfig.measurementGuideImage = lipitData.measurementGuideImage;
              if (lipitData.storagePaths?.measurementGuideImage) {
                initialConfig.storagePaths = {
                  ...(initialConfig.storagePaths || {}),
                  measurementGuideImage: lipitData.storagePaths.measurementGuideImage,
                };
              }
            }
          }
        } catch (_e) {
          // Non-fatal
        }
        if (!initialConfig.measurementGuideImage || initialConfig.measurementGuideImage.trim().length === 0) {
          initialConfig.measurementGuideImage = DEFAULT_CALCULATOR_IMAGES['rok-lipit-searah']?.measurementGuideImage || '';
        }
      } else if (
        actualDocId === 'pola-rok-kerut-bertingkat' ||
        actualDocId === 'rok-kerut-bertingkat' ||
        actualDocId === 'rok-kerut' ||
        actualDocId === 'tiered-skirt' ||
        actualDocId === 'rok-pias-godet' ||
        actualDocId === 'rok-pias' ||
        actualDocId === 'pias-godet' ||
        actualDocId === 'pias' ||
        actualDocId === 'godet'
      ) {
        if (!initialConfig.measurementGuideImage || initialConfig.measurementGuideImage.trim().length === 0 || initialConfig.measurementGuideImage === '/assets/skirt_measurement_guide.jpg') {
          try {
            const skirtSnap = await getDoc(doc(db, 'calculators', 'rok'));
            if (skirtSnap.exists()) {
              const skirtData = skirtSnap.data() as Partial<CalculatorImageConfig>;
              if (skirtData.measurementGuideImage && skirtData.measurementGuideImage.trim().length > 0) {
                initialConfig.measurementGuideImage = skirtData.measurementGuideImage;
                if (skirtData.storagePaths?.measurementGuideImage) {
                  initialConfig.storagePaths = {
                    ...(initialConfig.storagePaths || {}),
                    measurementGuideImage: skirtData.storagePaths.measurementGuideImage,
                  };
                }
              }
            }
          } catch (_e) {
            // Non-fatal
          }
        }
      }

      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}${calculatorId}`, JSON.stringify(initialConfig));
    }
  } catch (err) {
    console.warn(`[Firebase] Could not fetch document for calculator "${calculatorId}":`, err);
  }

  return initialConfig;
}

/**
 * Subscribe to real-time updates for calculator images
 */
export function subscribeCalculatorImages(
  calculatorId: string,
  onUpdate: (config: CalculatorImageConfig) => void
): () => void {
  const actualDocId = (calculatorId === 'shared-bodice' || calculatorId === 'shared-badan')
    ? 'badan-dressmaking'
    : (calculatorId === 'shared-skirt' ? 'rok' : (calculatorId === 'shared-skirt-2meas' || calculatorId === 'shared-lingkaran-lipit' ? 'rok-lipit-searah' : (calculatorId === 'shared-pants' || calculatorId === 'shared-celana' || calculatorId === 'shared-kulot-piyama' ? 'pola-celana-piyama' : (calculatorId === 'lengan' || calculatorId === 'basic-sleeve' ? 'pola-lengan' : (calculatorId === 'celana-piyama' || calculatorId === 'celana' || calculatorId === 'pajama-pants' ? 'pola-celana-piyama' : (calculatorId === 'rok-sederhana' ? 'rok' : calculatorId))))));

  const defaults = DEFAULT_CALCULATOR_IMAGES[calculatorId] || DEFAULT_CALCULATOR_IMAGES[actualDocId] || { measurementGuideImage: '', patternImage: '' };
  
  try {
    const docRef = doc(db, 'calculators', actualDocId);
    let unsubPiyama: (() => void) | null = null;
    let unsubSharedSkirt2Meas: (() => void) | null = null;
    let unsubSharedSkirt: (() => void) | null = null;

    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as Partial<CalculatorImageConfig>;
          const updated: CalculatorImageConfig = {
            id: calculatorId,
            name: SUPPORTED_CALCULATORS.find(c => c.id === calculatorId)?.name || data.name || calculatorId,
            measurementGuideImage: (actualDocId === 'rok-lingkaran' || actualDocId === 'lingkaran' || actualDocId === 'circle-skirt')
              ? DEFAULT_CALCULATOR_IMAGES['rok-lipit-searah']?.measurementGuideImage
              : (data.measurementGuideImage !== undefined ? data.measurementGuideImage : defaults.measurementGuideImage),
            patternImage: data.patternImage !== undefined ? data.patternImage : (data.fullCirclePatternImage || ''),
            fullCirclePatternImage: data.fullCirclePatternImage !== undefined ? data.fullCirclePatternImage : (data.patternImage || defaults.fullCirclePatternImage || ''),
            halfCirclePatternImage: data.halfCirclePatternImage !== undefined ? data.halfCirclePatternImage : (data.backPatternImage || defaults.halfCirclePatternImage || ''),
            tier4PatternImage: data.tier4PatternImage !== undefined ? data.tier4PatternImage : (defaults.tier4PatternImage || ''),
            dressmakingBackPatternImage: data.dressmakingBackPatternImage !== undefined ? data.dressmakingBackPatternImage : (defaults.dressmakingBackPatternImage || ''),
            dressmakingFrontPatternImage: data.dressmakingFrontPatternImage !== undefined ? data.dressmakingFrontPatternImage : (defaults.dressmakingFrontPatternImage || ''),
            dressmakingSideDartImage: data.dressmakingSideDartImage !== undefined ? data.dressmakingSideDartImage : (data.sideDartDetailImage !== undefined ? data.sideDartDetailImage : (defaults.dressmakingSideDartImage || '')),
            sideDartDetailImage: data.sideDartDetailImage !== undefined ? data.sideDartDetailImage : (data.dressmakingSideDartImage !== undefined ? data.dressmakingSideDartImage : ''),
            patternDescription: data.patternDescription !== undefined ? data.patternDescription : '',
            frontPatternDescription: data.frontPatternDescription !== undefined ? data.frontPatternDescription : (data.fullCircleInstructions || ''),
            backPatternDescription: data.backPatternDescription !== undefined ? data.backPatternDescription : (data.halfCircleInstructions || ''),
            tier4PatternDescription: data.tier4PatternDescription !== undefined ? data.tier4PatternDescription : '',
            sideDartDescription: data.sideDartDescription !== undefined ? data.sideDartDescription : (data.kupnatDescription !== undefined ? data.kupnatDescription : ''),
            kupnatDescription: data.kupnatDescription !== undefined ? data.kupnatDescription : (data.sideDartDescription !== undefined ? data.sideDartDescription : ''),
            fullCircleInstructions: data.fullCircleInstructions !== undefined ? data.fullCircleInstructions : (data.frontPatternDescription || ''),
            halfCircleInstructions: data.halfCircleInstructions !== undefined ? data.halfCircleInstructions : (data.backPatternDescription || ''),
            patternDescription_en: data.patternDescription_en !== undefined ? data.patternDescription_en : '',
            frontPatternDescription_en: data.frontPatternDescription_en !== undefined ? data.frontPatternDescription_en : '',
            backPatternDescription_en: data.backPatternDescription_en !== undefined ? data.backPatternDescription_en : '',
            tier4PatternDescription_en: data.tier4PatternDescription_en !== undefined ? data.tier4PatternDescription_en : '',
            sideDartDescription_en: data.sideDartDescription_en !== undefined ? data.sideDartDescription_en : (data.kupnatDescription_en !== undefined ? data.kupnatDescription_en : ''),
            kupnatDescription_en: data.kupnatDescription_en !== undefined ? data.kupnatDescription_en : (data.sideDartDescription_en !== undefined ? data.sideDartDescription_en : ''),
            importantNote_id: data.importantNote_id !== undefined ? data.importantNote_id : (data.importantNotes_id !== undefined ? data.importantNotes_id : undefined),
            importantNote_en: data.importantNote_en !== undefined ? data.importantNote_en : (data.importantNotes_en !== undefined ? data.importantNotes_en : ''),
            updatedAt: data.updatedAt,
          };

          // For pants calculators, ensure measurementGuideImage is synced with the authoritative pola-celana-piyama source
          if (isPantsCalculator(actualDocId) && actualDocId !== 'pola-celana-piyama') {
            if (!unsubPiyama) {
              try {
                unsubPiyama = onSnapshot(doc(db, 'calculators', 'pola-celana-piyama'), (pSnap) => {
                  if (pSnap.exists()) {
                    const pData = pSnap.data() as Partial<CalculatorImageConfig>;
                    if (pData.measurementGuideImage !== undefined) {
                      updated.measurementGuideImage = pData.measurementGuideImage;
                      if (pData.storagePaths?.measurementGuideImage) {
                        updated.storagePaths = {
                          ...(updated.storagePaths || {}),
                          measurementGuideImage: pData.storagePaths.measurementGuideImage,
                        };
                      }
                      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}${calculatorId}`, JSON.stringify(updated));
                      onUpdate({ ...updated });
                    }
                  }
                });
              } catch (_e) {
                // Non-fatal
              }
            }
          }

          // For 2-Measurement skirts (Rok Lingkaran & Rok Lipit Searah), ensure measurementGuideImage stays synced across both calculators
          if (isTwoMeasurementSkirtCalculator(actualDocId)) {
            const siblingId = actualDocId === 'rok-lingkaran' ? 'rok-lipit-searah' : 'rok-lingkaran';
            if (!unsubSharedSkirt2Meas) {
              try {
                unsubSharedSkirt2Meas = onSnapshot(doc(db, 'calculators', siblingId), (sSnap) => {
                  if (sSnap.exists()) {
                    const sData = sSnap.data() as Partial<CalculatorImageConfig>;
                    const sharedUrl = sData.measurementGuideImage || DEFAULT_CALCULATOR_IMAGES['rok-lipit-searah']?.measurementGuideImage;
                    if (sharedUrl && sharedUrl !== updated.measurementGuideImage) {
                      updated.measurementGuideImage = sharedUrl;
                      if (sData.storagePaths?.measurementGuideImage) {
                        updated.storagePaths = {
                          ...(updated.storagePaths || {}),
                          measurementGuideImage: sData.storagePaths.measurementGuideImage,
                        };
                      }
                      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}${calculatorId}`, JSON.stringify(updated));
                      onUpdate({ ...updated });
                    }
                  }
                });
              } catch (_e) {
                // Non-fatal
              }
            }
          }

          // For Skirt calculators (Kerut Bertingkat & Pias Godet), ensure measurementGuideImage stays in sync with shared skirt guide
          if (
            actualDocId === 'pola-rok-kerut-bertingkat' ||
            actualDocId === 'rok-kerut-bertingkat' ||
            actualDocId === 'rok-kerut' ||
            actualDocId === 'tiered-skirt' ||
            actualDocId === 'rok-pias-godet' ||
            actualDocId === 'rok-pias' ||
            actualDocId === 'pias-godet' ||
            actualDocId === 'pias' ||
            actualDocId === 'godet'
          ) {
            if (!unsubSharedSkirt) {
              try {
                unsubSharedSkirt = onSnapshot(doc(db, 'calculators', 'rok'), (sSnap) => {
                  if (sSnap.exists()) {
                    const sData = sSnap.data() as Partial<CalculatorImageConfig>;
                    const sharedUrl = sData.measurementGuideImage || DEFAULT_CALCULATOR_IMAGES['rok']?.measurementGuideImage;
                    if (sharedUrl && sharedUrl !== updated.measurementGuideImage) {
                      updated.measurementGuideImage = sharedUrl;
                      if (sData.storagePaths?.measurementGuideImage) {
                        updated.storagePaths = {
                          ...(updated.storagePaths || {}),
                          measurementGuideImage: sData.storagePaths.measurementGuideImage,
                        };
                      }
                      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}${calculatorId}`, JSON.stringify(updated));
                      onUpdate({ ...updated });
                    }
                  }
                });
              } catch (_e) {
                // Non-fatal
              }
            }
          }

          localStorage.setItem(`${LOCAL_STORAGE_PREFIX}${calculatorId}`, JSON.stringify(updated));
          onUpdate(updated);
        } else {
          const fallback: CalculatorImageConfig = {
            id: calculatorId,
            name: SUPPORTED_CALCULATORS.find(c => c.id === calculatorId)?.name || calculatorId,
            measurementGuideImage: defaults.measurementGuideImage,
            patternImage: defaults.patternImage,
            fullCirclePatternImage: defaults.fullCirclePatternImage || '',
            halfCirclePatternImage: defaults.halfCirclePatternImage || '',
            tier4PatternImage: defaults.tier4PatternImage || '',
            dressmakingBackPatternImage: defaults.dressmakingBackPatternImage || '',
            dressmakingFrontPatternImage: defaults.dressmakingFrontPatternImage || '',
            dressmakingSideDartImage: defaults.dressmakingSideDartImage || defaults.sideDartDetailImage || '',
            sideDartDetailImage: defaults.sideDartDetailImage || '',
            patternDescription: '',
            frontPatternDescription: '',
            backPatternDescription: '',
            tier4PatternDescription: '',
            sideDartDescription: '',
            kupnatDescription: '',
            fullCircleInstructions: '',
            halfCircleInstructions: '',
            patternDescription_en: '',
            frontPatternDescription_en: '',
            backPatternDescription_en: '',
            tier4PatternDescription_en: '',
            sideDartDescription_en: '',
            kupnatDescription_en: '',
            importantNote_id: undefined,
            importantNote_en: '',
          };
          onUpdate(fallback);
        }
      },
      (error) => {
        console.warn(`[Firebase] onSnapshot error on calculators/${calculatorId}:`, error);
      }
    );
    return () => {
      unsubscribe();
      if (unsubPiyama) {
        unsubPiyama();
      }
      if (unsubSharedSkirt2Meas) {
        unsubSharedSkirt2Meas();
      }
      if (unsubSharedSkirt) {
        unsubSharedSkirt();
      }
    };
  } catch (err) {
    console.warn(`[Firebase] Failed to setup listener for calculators/${calculatorId}:`, err);
    return () => {};
  }
}

/**
 * Update the pattern creation descriptions (Front & Back) for a calculator in Firestore.
 * Saves to Firestore document `calculators/{calculatorId}` with `{ merge: true }`
 * without deleting or corrupting existing pattern description data.
 */
export async function updateCalculatorPatternDescriptions(
  calculatorId: string,
  frontDescription: string,
  backDescription: string,
  sideDartDescription?: string,
  tier4Description?: string,
  frontDescriptionEn?: string,
  backDescriptionEn?: string,
  sideDartDescriptionEn?: string,
  tier4DescriptionEn?: string,
  importantNoteId?: string,
  importantNoteEn?: string
): Promise<void> {
  const calcObj = SUPPORTED_CALCULATORS.find(c => c.id === calculatorId);
  const calculatorName = calcObj?.name || calculatorId;
  const docRef = doc(db, 'calculators', calculatorId);
  const now = new Date().toISOString();
  
  const isLipit = calculatorId === 'rok-lipit-searah' || calculatorId === 'rok-lipit' || calculatorId === 'lipit-searah' || calculatorId === 'lipit';
  const isCelana = calculatorId === 'pola-celana-piyama' || calculatorId === 'celana-piyama' || calculatorId === 'celana' || calculatorId === 'pajama-pants';
  const isSingleDesc = isLipit || isCelana;
  
  const updatePayload: Partial<CalculatorImageConfig> = {
    id: calculatorId,
    garmentId: calcObj?.garmentId || 'rok',
    systemId: calcObj?.systemId || calculatorId,
    systemNumber: calcObj?.systemNumber || 1,
    name: calculatorName,
    frontPatternDescription: frontDescription,
    backPatternDescription: isSingleDesc ? '' : backDescription,
    // Preserve combined legacy field so older reads/backwards-compat aren't broken
    patternDescription: isSingleDesc
      ? (frontDescription || '')
      : [
          frontDescription ? (calculatorId === 'rok-lingkaran' ? `[ROK LINGKARAN PENUH]\n${frontDescription}` : `[POLA DEPAN]\n${frontDescription}`) : '',
          backDescription ? (calculatorId === 'rok-lingkaran' ? `[ROK SETENGAH LINGKARAN]\n${backDescription}` : `[POLA BELAKANG]\n${backDescription}`) : '',
          sideDartDescription ? `[PEMBUATAN KUPNAT DEPAN]\n${sideDartDescription}` : '',
          tier4Description ? `[POLA TINGKAT 4]\n${tier4Description}` : ''
        ].filter(Boolean).join('\n\n') || frontDescription || backDescription || '',
    updatedAt: now,
  };

  if (sideDartDescription !== undefined) {
    updatePayload.sideDartDescription = sideDartDescription;
    updatePayload.kupnatDescription = sideDartDescription;
  }
  if (tier4Description !== undefined) {
    updatePayload.tier4PatternDescription = tier4Description;
  }

  // Bilingual English fields
  if (frontDescriptionEn !== undefined) {
    updatePayload.frontPatternDescription_en = frontDescriptionEn;
  }
  if (backDescriptionEn !== undefined) {
    updatePayload.backPatternDescription_en = isSingleDesc ? '' : backDescriptionEn;
  }
  if (sideDartDescriptionEn !== undefined) {
    updatePayload.sideDartDescription_en = sideDartDescriptionEn;
    updatePayload.kupnatDescription_en = sideDartDescriptionEn;
  }
  if (tier4DescriptionEn !== undefined) {
    updatePayload.tier4PatternDescription_en = tier4DescriptionEn;
  }
  if (frontDescriptionEn !== undefined || backDescriptionEn !== undefined) {
    updatePayload.patternDescription_en = isSingleDesc
      ? (frontDescriptionEn || '')
      : [
          frontDescriptionEn ? (calculatorId === 'rok-lingkaran' ? `[FULL CIRCLE SKIRT]\n${frontDescriptionEn}` : `[FRONT PATTERN]\n${frontDescriptionEn}`) : '',
          backDescriptionEn ? (calculatorId === 'rok-lingkaran' ? `[HALF CIRCLE SKIRT]\n${backDescriptionEn}` : `[BACK PATTERN]\n${backDescriptionEn}`) : '',
          sideDartDescriptionEn ? `[FRONT SIDE DART]\n${sideDartDescriptionEn}` : '',
          tier4DescriptionEn ? `[TIER 4 PATTERN]\n${tier4DescriptionEn}` : ''
        ].filter(Boolean).join('\n\n') || frontDescriptionEn || backDescriptionEn || '';
  }

  // Important Pattern Notes fields
  if (importantNoteId !== undefined) {
    updatePayload.importantNote_id = importantNoteId;
  }
  if (importantNoteEn !== undefined) {
    updatePayload.importantNote_en = importantNoteEn;
  }

  await setDoc(docRef, updatePayload, { merge: true });
  console.info(`[Firestore] Updated pattern descriptions for calculators/${calculatorId}:`, updatePayload);

  // Update local cache
  try {
    const cached = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}${calculatorId}`);
    const current = cached ? JSON.parse(cached) : { id: calculatorId, name: calculatorName };
    current.frontPatternDescription = frontDescription;
    current.backPatternDescription = backDescription;
    if (sideDartDescription !== undefined) {
      current.sideDartDescription = sideDartDescription;
      current.kupnatDescription = sideDartDescription;
    }
    if (tier4Description !== undefined) {
      current.tier4PatternDescription = tier4Description;
    }
    current.patternDescription = updatePayload.patternDescription;
    if (frontDescriptionEn !== undefined) {
      current.frontPatternDescription_en = frontDescriptionEn;
    }
    if (backDescriptionEn !== undefined) {
      current.backPatternDescription_en = backDescriptionEn;
    }
    if (sideDartDescriptionEn !== undefined) {
      current.sideDartDescription_en = sideDartDescriptionEn;
      current.kupnatDescription_en = sideDartDescriptionEn;
    }
    if (tier4DescriptionEn !== undefined) {
      current.tier4PatternDescription_en = tier4DescriptionEn;
    }
    if (updatePayload.patternDescription_en !== undefined) {
      current.patternDescription_en = updatePayload.patternDescription_en;
    }
    if (importantNoteId !== undefined) {
      current.importantNote_id = importantNoteId;
    }
    if (importantNoteEn !== undefined) {
      current.importantNote_en = importantNoteEn;
    }
    current.updatedAt = now;
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}${calculatorId}`, JSON.stringify(current));
  } catch (e) {
    console.warn('[LocalStorage] Could not cache pattern descriptions:', e);
  }
}

/**
 * Update an individual pattern description section independently in Firestore.
 */
export async function updateCalculatorSectionDescription(
  calculatorId: string,
  section: 'front' | 'back' | 'sideDart' | 'tier4' | 'notes',
  idText: string,
  enText?: string
): Promise<void> {
  const calcObj = SUPPORTED_CALCULATORS.find(c => c.id === calculatorId);
  const calculatorName = calcObj?.name || calculatorId;
  const docRef = doc(db, 'calculators', calculatorId);
  const now = new Date().toISOString();

  const updatePayload: Partial<CalculatorImageConfig> = {
    id: calculatorId,
    name: calculatorName,
    updatedAt: now,
  };

  const isLipit =
    calculatorId === 'rok-lipit-searah' ||
    calculatorId === 'rok-lipit' ||
    calculatorId === 'lipit-searah' ||
    calculatorId === 'lipit';
  const isCelana =
    calculatorId === 'pola-celana-piyama' ||
    calculatorId === 'celana-piyama' ||
    calculatorId === 'celana' ||
    calculatorId === 'pajama-pants';
  const isSingleDesc = isLipit || isCelana;

  if (section === 'front') {
    updatePayload.frontPatternDescription = idText;
    if (enText !== undefined) updatePayload.frontPatternDescription_en = enText;
    if (isSingleDesc) {
      updatePayload.patternDescription = idText;
      if (enText !== undefined) updatePayload.patternDescription_en = enText;
      updatePayload.backPatternDescription = '';
      updatePayload.backPatternDescription_en = '';
    }
  } else if (section === 'back') {
    if (!isSingleDesc) {
      updatePayload.backPatternDescription = idText;
      if (enText !== undefined) updatePayload.backPatternDescription_en = enText;
    }
  } else if (section === 'sideDart') {
    updatePayload.sideDartDescription = idText;
    updatePayload.kupnatDescription = idText;
    if (enText !== undefined) {
      updatePayload.sideDartDescription_en = enText;
      updatePayload.kupnatDescription_en = enText;
    }
  } else if (section === 'tier4') {
    updatePayload.tier4PatternDescription = idText;
    if (enText !== undefined) updatePayload.tier4PatternDescription_en = enText;
  } else if (section === 'notes') {
    updatePayload.importantNote_id = idText;
    if (enText !== undefined) updatePayload.importantNote_en = enText;
  }

  await setDoc(docRef, updatePayload, { merge: true });

  // Update local cache
  try {
    const cached = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}${calculatorId}`);
    const current = cached ? JSON.parse(cached) : { id: calculatorId, name: calculatorName };
    if (section === 'front') {
      current.frontPatternDescription = idText;
      if (enText !== undefined) current.frontPatternDescription_en = enText;
      if (isSingleDesc) {
        current.patternDescription = idText;
        if (enText !== undefined) current.patternDescription_en = enText;
        current.backPatternDescription = '';
        current.backPatternDescription_en = '';
      }
    } else if (section === 'back') {
      if (!isSingleDesc) {
        current.backPatternDescription = idText;
        if (enText !== undefined) current.backPatternDescription_en = enText;
      }
    } else if (section === 'sideDart') {
      current.sideDartDescription = idText;
      current.kupnatDescription = idText;
      if (enText !== undefined) {
        current.sideDartDescription_en = enText;
        current.kupnatDescription_en = enText;
      }
    } else if (section === 'tier4') {
      current.tier4PatternDescription = idText;
      if (enText !== undefined) current.tier4PatternDescription_en = enText;
    } else if (section === 'notes') {
      current.importantNote_id = idText;
      if (enText !== undefined) current.importantNote_en = enText;
    }
    current.updatedAt = now;
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}${calculatorId}`, JSON.stringify(current));
  } catch (e) {
    console.warn('[LocalStorage] Could not cache section description:', e);
  }
}

/**
 * Update Important Pattern Notes for a specific calculator in Firestore
 */
export async function updateCalculatorImportantNotes(
  calculatorId: string,
  noteId: string,
  noteEn?: string
): Promise<void> {
  return updateCalculatorSectionDescription(calculatorId, 'notes', noteId, noteEn);
}

/**
 * Clear/remove Important Pattern Notes for a specific calculator in Firestore
 */
export async function clearCalculatorImportantNotes(
  calculatorId: string
): Promise<void> {
  return updateCalculatorSectionDescription(calculatorId, 'notes', '', '');
}

/**
 * Update the single pattern creation description for a calculator in Firestore (legacy support).
 * Saves ONLY to Firestore document `calculators/{calculatorId}` with `{ merge: true }`.
 */
export async function updateCalculatorPatternDescription(
  calculatorId: string,
  description: string
): Promise<void> {
  const calcObj = SUPPORTED_CALCULATORS.find(c => c.id === calculatorId);
  const calculatorName = calcObj?.name || calculatorId;
  const docRef = doc(db, 'calculators', calculatorId);
  const now = new Date().toISOString();
  
  const updatePayload: Partial<CalculatorImageConfig> = {
    id: calculatorId,
    garmentId: calcObj?.garmentId || 'rok',
    systemId: calcObj?.systemId || calculatorId,
    systemNumber: calcObj?.systemNumber || 1,
    name: calculatorName,
    patternDescription: description,
    updatedAt: now,
  };

  await setDoc(docRef, updatePayload, { merge: true });
  console.info(`[Firestore] Updated patternDescription for calculators/${calculatorId}:`, updatePayload);

  // Update local cache
  try {
    const cached = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}${calculatorId}`);
    const current = cached ? JSON.parse(cached) : { id: calculatorId, name: calculatorName };
    current.patternDescription = description;
    current.updatedAt = now;
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}${calculatorId}`, JSON.stringify(current));
  } catch (e) {
    console.warn('[LocalStorage] Could not cache patternDescription:', e);
  }
}

export type CalculatorImageType = 
  | 'measurementGuideImage' 
  | 'patternImage' 
  | 'dressmakingBackPatternImage' 
  | 'dressmakingFrontPatternImage' 
  | 'dressmakingSideDartImage' 
  | 'sideDartDetailImage'
  | 'frontPatternImage'
  | 'backPatternImage'
  | 'detailPatternImage'
  | 'fullCirclePatternImage'
  | 'halfCirclePatternImage'
  | 'tier4PatternImage';

/**
 * Skirt calculators that share ONE common measurement guide image.
 */
export const SKIRT_CALCULATOR_IDS = [
  'rok',
  'rok-dressmaking',
  'rok-indonesia',
  'pola-rok-kerut-bertingkat',
  'rok-pias-godet',
] as const;
export const ALL_SKIRT_DOC_IDS = [
  'rok',
  'rok-dressmaking',
  'rok-indonesia',
  'rok-sederhana',
  'pola-rok-kerut-bertingkat',
  'rok-kerut-bertingkat',
  'rok-pias-godet',
  'rok-pias',
] as const;

export function isSkirtCalculator(calculatorId: string): boolean {
  return (
    calculatorId === 'rok' ||
    calculatorId === 'rok-sederhana' ||
    calculatorId === 'rok-dressmaking' ||
    calculatorId === 'rok-indonesia' ||
    calculatorId === 'pola-rok-kerut-bertingkat' ||
    calculatorId === 'rok-kerut-bertingkat' ||
    calculatorId === 'rok-kerut' ||
    calculatorId === 'tiered-skirt' ||
    calculatorId === 'rok-pias-godet' ||
    calculatorId === 'rok-pias' ||
    calculatorId === 'pias-godet' ||
    calculatorId === 'pias' ||
    calculatorId === 'godet' ||
    calculatorId === 'shared-skirt'
  );
}

export function isSkirtMeasurementGuide(calculatorId: string, imageType: string): boolean {
  return isSkirtCalculator(calculatorId) && imageType === 'measurementGuideImage';
}

/**
 * Bodice calculators that share ONE common measurement guide image.
 */
export const BODICE_CALCULATOR_IDS = ['badan-sederhana', 'badan-dressmaking', 'badan-indonesia'] as const;
export const ALL_BODICE_DOC_IDS = ['badan', 'badan-sederhana', 'badan-dressmaking', 'badan-indonesia'] as const;

export function isBodiceCalculator(calculatorId: string): boolean {
  return (
    calculatorId === 'badan' ||
    calculatorId === 'badan-sederhana' ||
    calculatorId === 'badan-dressmaking' ||
    calculatorId === 'badan-indonesia' ||
    calculatorId === 'shared-bodice' ||
    calculatorId === 'shared-badan'
  );
}

export function isBodiceMeasurementGuide(calculatorId: string, imageType: string): boolean {
  return isBodiceCalculator(calculatorId) && imageType === 'measurementGuideImage';
}

/**
 * Pants calculators (Pola Kulot & Celana Piyama) that share ONE common measurement guide image.
 */
export const PANTS_CALCULATOR_IDS = ['pola-kulot', 'pola-celana-piyama'] as const;
export const ALL_PANTS_DOC_IDS = ['pola-kulot', 'pola-celana-piyama'] as const;

export function isPantsCalculator(calculatorId: string): boolean {
  return (
    calculatorId === 'pola-kulot' ||
    calculatorId === 'kulot' ||
    calculatorId === 'culottes' ||
    calculatorId === 'culotte-pants' ||
    calculatorId === 'pola-celana-piyama' ||
    calculatorId === 'celana-piyama' ||
    calculatorId === 'celana' ||
    calculatorId === 'pajama-pants' ||
    calculatorId === 'shared-pants' ||
    calculatorId === 'shared-celana' ||
    calculatorId === 'shared-kulot-piyama'
  );
}

export function isPantsMeasurementGuide(calculatorId: string, imageType: string): boolean {
  return isPantsCalculator(calculatorId) && imageType === 'measurementGuideImage';
}

/**
 * 2-Measurement Skirt calculators (Rok Lingkaran & Setengah Lingkaran, and Rok Lipit Searah)
 * that share ONE common measurement guide image asset.
 */
export const TWO_MEASUREMENT_SKIRT_CALCULATOR_IDS = ['rok-lingkaran', 'rok-lipit-searah'] as const;
export const ALL_TWO_MEASUREMENT_SKIRT_DOC_IDS = ['rok-lingkaran', 'rok-lipit-searah'] as const;

export function isTwoMeasurementSkirtCalculator(calculatorId: string): boolean {
  return (
    calculatorId === 'rok-lingkaran' ||
    calculatorId === 'lingkaran' ||
    calculatorId === 'circle-skirt' ||
    calculatorId === 'rok-lipit-searah' ||
    calculatorId === 'rok-lipit' ||
    calculatorId === 'lipit-searah' ||
    calculatorId === 'lipit' ||
    calculatorId === 'one-way-pleated-skirt' ||
    calculatorId === 'shared-skirt-2meas' ||
    calculatorId === 'shared-lingkaran-lipit'
  );
}

export function isTwoMeasurementSkirtGuide(calculatorId: string, imageType: string): boolean {
  return isTwoMeasurementSkirtCalculator(calculatorId) && imageType === 'measurementGuideImage';
}

/**
 * Extract storage path from a Firebase Storage download URL, gs:// URL, or raw storage path.
 */
export function extractStoragePath(urlOrPath: string): string | null {
  if (!urlOrPath || typeof urlOrPath !== 'string') return null;
  
  const trimmed = urlOrPath.trim();
  if (!trimmed) return null;

  // If starts with 'shared/', normalize to 'calculators/shared/'
  if (trimmed.startsWith('shared/')) {
    return `calculators/${trimmed}`;
  }

  // If already a relative storage path (e.g. "calculators/rok/pattern/123_file.png")
  if (trimmed.startsWith('calculators/')) {
    return trimmed;
  }

  // If gs:// URL (e.g. "gs://bucket-name/calculators/...")
  if (trimmed.startsWith('gs://')) {
    const withoutPrefix = trimmed.replace('gs://', '');
    const firstSlash = withoutPrefix.indexOf('/');
    return firstSlash !== -1 ? withoutPrefix.substring(firstSlash + 1) : null;
  }

  // If standard Firebase Storage download URL: .../o/<encoded-path>?...
  if (trimmed.includes('firebasestorage.googleapis.com') || trimmed.includes('/o/')) {
    try {
      const parts = trimmed.split('/o/');
      if (parts.length > 1) {
        const pathPart = parts[1].split('?')[0];
        return decodeURIComponent(pathPart);
      }
    } catch (e) {
      console.warn('[Firebase Storage] Could not decode path from URL:', trimmed, e);
    }
  }

  // If Google Cloud Storage direct URL: https://storage.googleapis.com/<bucket>/<path>
  if (trimmed.includes('storage.googleapis.com')) {
    try {
      const parsed = new URL(trimmed);
      const segments = parsed.pathname.split('/').filter(Boolean);
      if (segments.length > 1) {
        return decodeURIComponent(segments.slice(1).join('/'));
      }
    } catch (e) {
      console.warn('[Firebase Storage] Could not parse Google Cloud Storage URL:', trimmed, e);
    }
  }

  return null;
}

/**
 * Physically delete an image object from Firebase Storage.
 * Safety: Only deletes files within the 'calculators/' storage directory.
 * Error Handling: If deletion fails due to an unexpected error (not already deleted), throws to prevent silent failure.
 */
export async function deletePhysicalStorageFile(urlOrPath: string): Promise<boolean> {
  if (!urlOrPath) return false;

  // Ignore static assets or local assets
  if (urlOrPath.startsWith('/') || urlOrPath.startsWith('blob:') || urlOrPath.startsWith('data:')) {
    return false;
  }

  const storagePath = extractStoragePath(urlOrPath);
  if (!storagePath) {
    console.warn('[Firebase Storage] Could not determine storage path for file deletion:', urlOrPath);
    return false;
  }

  // Safety check: ensure we only delete files within the calculators storage path
  if (!storagePath.startsWith('calculators/')) {
    console.warn('[Firebase Storage] Aborting deletion: Path is outside calculators/ directory:', storagePath);
    return false;
  }

  try {
    const fileRef = ref(storage, storagePath);
    await deleteObject(fileRef);
    console.info(`[Firebase Storage] Physical file deleted successfully: ${storagePath}`);
    return true;
  } catch (err: unknown) {
    const errorObj = err as { code?: string; message?: string };
    // If the object was already deleted or not found in storage, treat as handled safely
    if (
      errorObj?.code === 'storage/object-not-found' ||
      errorObj?.message?.includes('object-not-found') ||
      errorObj?.message?.includes('does not exist')
    ) {
      console.warn(`[Firebase Storage] File was already deleted or not found in storage: ${storagePath}`);
      return true;
    }

    console.warn(`[Firebase Storage] Could not physically delete ${storagePath} (skipping physical deletion):`, err);
    return false;
  }
}

/**
 * Upload an image file to Firebase Storage and save the HTTPS download URL & storagePath to Firestore.
 * 
 * Special handling for Skirt Calculators:
 * - Rok Sistem Sederhana ('rok')
 * - Rok Sistem Dressmaking ('rok-dressmaking')
 * - Rok Sistem Indonesia ('rok-indonesia')
 * All three share ONE physical file in `calculators/shared/measurement-guides/`.
 * Uploading or replacing from any skirt calculator updates all three in Firestore simultaneously.
 */
export async function uploadCalculatorImage(
  calculatorId: string,
  imageType: CalculatorImageType,
  file: File
): Promise<string> {
  const isSharedSkirtGuide = isSkirtMeasurementGuide(calculatorId, imageType);
  const isSharedBodiceGuide = isBodiceMeasurementGuide(calculatorId, imageType);
  const isSharedPantsGuide = isPantsMeasurementGuide(calculatorId, imageType);
  const isShared2MeasSkirtGuide = isTwoMeasurementSkirtGuide(calculatorId, imageType);
  const calcObj = SUPPORTED_CALCULATORS.find(c => c.id === calculatorId);
  const calculatorName = calcObj?.name || calculatorId;
  
  // 1. Optimize / compress image file before upload (resizes oversized files and converts to lightweight WebP)
  const optimizedFile = await optimizeImageFile(file, {
    maxWidth: 2048,
    maxHeight: 2048,
    quality: 0.88,
    targetFormat: file.type === 'image/png' ? 'image/webp' : 'image/webp',
  });

  const cleanName = (optimizedFile.name || file.name).replace(/[^a-zA-Z0-9._-]/g, '_');

  // 2. Determine storage path and collect OLD candidates to safely auto-delete after replacement
  let storagePath = '';
  const oldCandidates: (string | null | undefined)[] = [];

  if (isSharedBodiceGuide) {
    // ONE SHARED STORAGE FILE for all 3 bodice calculators
    storagePath = `calculators/shared/measurement-guides/bodice/${Date.now()}_${cleanName}`;

    // Collect existing guide images across all bodice calculators
    for (const bId of ALL_BODICE_DOC_IDS) {
      try {
        const bSnap = await getDoc(doc(db, 'calculators', bId));
        if (bSnap.exists()) {
          const bData = bSnap.data() as Partial<CalculatorImageConfig>;
          oldCandidates.push(bData.measurementGuideImage);
          oldCandidates.push(bData.storagePaths?.measurementGuideImage);
        }
      } catch (_e) {
        // Non-fatal
      }
    }
  } else if (isSharedSkirtGuide) {
    // ONE SHARED STORAGE FILE for all 3 skirt calculators
    storagePath = `calculators/shared/measurement-guides/${Date.now()}_${cleanName}`;

    // Collect existing guide images across all skirt calculators
    for (const sId of ALL_SKIRT_DOC_IDS) {
      try {
        const sSnap = await getDoc(doc(db, 'calculators', sId));
        if (sSnap.exists()) {
          const sData = sSnap.data() as Partial<CalculatorImageConfig>;
          oldCandidates.push(sData.measurementGuideImage);
          oldCandidates.push(sData.storagePaths?.measurementGuideImage);
        }
      } catch (_e) {
        // Non-fatal
      }
    }
  } else if (isSharedPantsGuide) {
    // ONE SHARED STORAGE FILE for Pola Kulot & Celana Piyama
    storagePath = `calculators/shared/measurement-guides/pants/${Date.now()}_${cleanName}`;

    // Collect ONLY previous shared pants guide files to protect existing unshared assets
    for (const pId of ALL_PANTS_DOC_IDS) {
      try {
        const pSnap = await getDoc(doc(db, 'calculators', pId));
        if (pSnap.exists()) {
          const pData = pSnap.data() as Partial<CalculatorImageConfig>;
          const existingPath = pData.storagePaths?.measurementGuideImage;
          if (existingPath && (existingPath.includes('calculators/shared/measurement-guides/pants') || existingPath.includes('calculators/pola-celana-piyama/measurement-guide'))) {
            oldCandidates.push(existingPath);
          }
        }
      } catch (_e) {
        // Non-fatal
      }
    }
  } else if (isShared2MeasSkirtGuide) {
    // ONE SHARED STORAGE FILE for Rok Lingkaran & Rok Lipit Searah
    storagePath = `calculators/shared/measurement-guides/skirt-2meas/${Date.now()}_${cleanName}`;

    // Collect previous shared 2-measurement skirt guide files to protect other assets
    for (const sId of ALL_TWO_MEASUREMENT_SKIRT_DOC_IDS) {
      try {
        const sSnap = await getDoc(doc(db, 'calculators', sId));
        if (sSnap.exists()) {
          const sData = sSnap.data() as Partial<CalculatorImageConfig>;
          const existingPath = sData.storagePaths?.measurementGuideImage;
          if (
            existingPath &&
            (existingPath.includes('calculators/shared/measurement-guides/skirt-2meas') ||
             existingPath.includes('calculators/rok-lipit-searah/measurement-guide') ||
             existingPath.includes('calculators/rok-lingkaran/measurement-guide'))
          ) {
            oldCandidates.push(existingPath);
          }
        }
      } catch (_e) {
        // Non-fatal
      }
    }
  } else {
    // Normal calculator-specific image slot
    const docRef = doc(db, 'calculators', calculatorId);
    let existingDocData: Partial<CalculatorImageConfig> = {};
    try {
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        existingDocData = snap.data() as Partial<CalculatorImageConfig>;
      }
    } catch (_e) {
      // Non-fatal
    }

    oldCandidates.push(
      existingDocData[imageType],
      existingDocData.storagePaths?.[imageType]
    );

    if (calculatorId === 'rok-lingkaran') {
      if (imageType === 'fullCirclePatternImage' || imageType === 'patternImage' || imageType === 'frontPatternImage') {
        oldCandidates.push(
          existingDocData.fullCirclePatternImage,
          existingDocData.patternImage,
          existingDocData.frontPatternImage,
          existingDocData.storagePaths?.fullCirclePatternImage,
          existingDocData.storagePaths?.patternImage,
          existingDocData.storagePaths?.frontPatternImage
        );
      } else if (imageType === 'halfCirclePatternImage' || imageType === 'backPatternImage') {
        oldCandidates.push(
          existingDocData.halfCirclePatternImage,
          existingDocData.backPatternImage,
          existingDocData.storagePaths?.halfCirclePatternImage,
          existingDocData.storagePaths?.backPatternImage
        );
      }
    } else if (imageType === 'dressmakingSideDartImage' || imageType === 'sideDartDetailImage' || imageType === 'detailPatternImage') {
      oldCandidates.push(
        existingDocData.dressmakingSideDartImage,
        existingDocData.sideDartDetailImage,
        existingDocData.detailPatternImage,
        existingDocData.storagePaths?.dressmakingSideDartImage,
        existingDocData.storagePaths?.sideDartDetailImage,
        existingDocData.storagePaths?.detailPatternImage
      );
    } else if (imageType === 'dressmakingFrontPatternImage' || imageType === 'frontPatternImage') {
      oldCandidates.push(
        existingDocData.dressmakingFrontPatternImage,
        existingDocData.frontPatternImage,
        existingDocData.storagePaths?.dressmakingFrontPatternImage,
        existingDocData.storagePaths?.frontPatternImage
      );
    } else if (imageType === 'dressmakingBackPatternImage' || imageType === 'backPatternImage') {
      oldCandidates.push(
        existingDocData.dressmakingBackPatternImage,
        existingDocData.backPatternImage,
        existingDocData.storagePaths?.dressmakingBackPatternImage,
        existingDocData.storagePaths?.backPatternImage
      );
    } else if (imageType === 'tier4PatternImage') {
      oldCandidates.push(
        existingDocData.tier4PatternImage,
        existingDocData.storagePaths?.tier4PatternImage
      );
    }

    let folder = 'pattern';
    if (calculatorId === 'rok-lingkaran') {
      if (imageType === 'fullCirclePatternImage' || imageType === 'frontPatternImage' || imageType === 'patternImage') {
        folder = 'pattern/full';
      } else if (imageType === 'halfCirclePatternImage' || imageType === 'backPatternImage') {
        folder = 'pattern/half';
      }
    } else if (imageType === 'measurementGuideImage') {
      folder = 'measurement-guide';
    } else if (imageType === 'tier4PatternImage') {
      folder = 'pattern/tier4';
    } else if (imageType === 'dressmakingBackPatternImage' || imageType === 'backPatternImage') {
      folder = 'pattern/back';
    } else if (imageType === 'dressmakingFrontPatternImage' || imageType === 'frontPatternImage') {
      folder = 'pattern/front';
    } else if (imageType === 'detailPatternImage') {
      folder = 'pattern/detail';
    } else if (imageType === 'dressmakingSideDartImage' || imageType === 'sideDartDetailImage') {
      folder = 'pattern/side-dart';
    }

    storagePath = `calculators/${calculatorId}/${folder}/${Date.now()}_${cleanName}`;
  }

  // Unique list of non-empty old candidate URLs/paths
  const uniqueOldCandidates = Array.from(
    new Set(oldCandidates.filter((item): item is string => Boolean(item && typeof item === 'string' && item.trim().length > 0)))
  );

  // 3. Upload single optimized file to Firebase Storage
  const storageRef = ref(storage, storagePath);
  const metadata = {
    contentType: optimizedFile.type || 'image/webp',
    customMetadata: {
      calculatorId,
      imageType,
      isSharedSkirtGuide: isSharedSkirtGuide ? 'true' : 'false',
      isSharedBodiceGuide: isSharedBodiceGuide ? 'true' : 'false',
      isSharedPantsGuide: isSharedPantsGuide ? 'true' : 'false',
      uploadedAt: new Date().toISOString(),
      originalSize: `${file.size}`,
      optimizedSize: `${optimizedFile.size}`,
    }
  };

  const snapshot = await uploadBytes(storageRef, optimizedFile, metadata);
  const downloadUrl = await getDownloadURL(snapshot.ref);

  // Strict URL check: Ensure it is a valid HTTPS download URL
  if (!downloadUrl || !downloadUrl.startsWith('https://')) {
    throw new Error('Firebase Storage did not return a valid HTTPS download URL.');
  }

  console.info(`[Firebase Storage] Uploaded ${imageType} successfully to ${storagePath}:`, downloadUrl);
  const now = new Date().toISOString();

  // 4. Update Firestore
  if (isSharedBodiceGuide) {
    // Update all 3 bodice calculators in Firestore to point to the ONE shared image
    for (const bId of ALL_BODICE_DOC_IDS) {
      const bodiceCalcObj = SUPPORTED_CALCULATORS.find(c => c.id === bId);
      const bodiceDocRef = doc(db, 'calculators', bId);
      let bExistingStoragePaths: Record<string, string> = {};
      try {
        const bSnap = await getDoc(bodiceDocRef);
        if (bSnap.exists()) {
          bExistingStoragePaths = { ...((bSnap.data() as Partial<CalculatorImageConfig>).storagePaths || {}) };
        }
      } catch (_e) {
        // Non-fatal
      }

      bExistingStoragePaths.measurementGuideImage = storagePath;

      const bodicePayload: Partial<CalculatorImageConfig> & { storagePaths?: Record<string, string> } = {
        id: bId,
        garmentId: 'badan',
        systemId: bodiceCalcObj?.systemId || bId,
        systemNumber: bodiceCalcObj?.systemNumber || 1,
        name: bodiceCalcObj?.name || bId,
        measurementGuideImage: downloadUrl,
        storagePaths: bExistingStoragePaths,
        updatedAt: now,
      };

      await setDoc(bodiceDocRef, bodicePayload, { merge: true });
      console.info(`[Firestore] Shared Bodice Measurement Guide synced for calculators/${bId}`);

      // Update local storage cache for instant UI feedback
      try {
        const cached = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}${bId}`);
        const current = cached ? JSON.parse(cached) : { id: bId, name: bodiceCalcObj?.name || bId };
        current.measurementGuideImage = downloadUrl;
        current.storagePaths = bExistingStoragePaths;
        current.updatedAt = now;
        localStorage.setItem(`${LOCAL_STORAGE_PREFIX}${bId}`, JSON.stringify(current));
      } catch (e) {
        console.warn(`[LocalStorage] Could not cache image config for ${bId}:`, e);
      }
    }
  } else if (isSharedSkirtGuide) {
    // Update all 3 skirt calculators in Firestore to point to the ONE shared image
    for (const sId of ALL_SKIRT_DOC_IDS) {
      const skirtCalcObj = SUPPORTED_CALCULATORS.find(c => c.id === sId);
      const skirtDocRef = doc(db, 'calculators', sId);
      let sExistingStoragePaths: Record<string, string> = {};
      try {
        const sSnap = await getDoc(skirtDocRef);
        if (sSnap.exists()) {
          sExistingStoragePaths = { ...((sSnap.data() as Partial<CalculatorImageConfig>).storagePaths || {}) };
        }
      } catch (_e) {
        // Non-fatal
      }

      sExistingStoragePaths.measurementGuideImage = storagePath;

      const skirtPayload: Partial<CalculatorImageConfig> & { storagePaths?: Record<string, string> } = {
        id: sId,
        garmentId: 'rok',
        systemId: skirtCalcObj?.systemId || sId,
        systemNumber: skirtCalcObj?.systemNumber || 1,
        name: skirtCalcObj?.name || sId,
        measurementGuideImage: downloadUrl,
        storagePaths: sExistingStoragePaths,
        updatedAt: now,
      };

      await setDoc(skirtDocRef, skirtPayload, { merge: true });
      console.info(`[Firestore] Shared Measurement Guide synced for calculators/${sId}`);

      // Update local storage cache for instant UI feedback
      try {
        const cached = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}${sId}`);
        const current = cached ? JSON.parse(cached) : { id: sId, name: skirtCalcObj?.name || sId };
        current.measurementGuideImage = downloadUrl;
        current.storagePaths = sExistingStoragePaths;
        current.updatedAt = now;
        localStorage.setItem(`${LOCAL_STORAGE_PREFIX}${sId}`, JSON.stringify(current));
      } catch (e) {
        console.warn(`[LocalStorage] Could not cache image config for ${sId}:`, e);
      }
    }
  } else if (isSharedPantsGuide) {
    // Update Pola Kulot, Celana Piyama, and shared-pants in Firestore to point to the ONE shared image
    for (const pId of ALL_PANTS_DOC_IDS) {
      const pantsCalcObj = SUPPORTED_CALCULATORS.find(c => c.id === pId);
      const pantsDocRef = doc(db, 'calculators', pId);
      let pExistingStoragePaths: Record<string, string> = {};
      try {
        const pSnap = await getDoc(pantsDocRef);
        if (pSnap.exists()) {
          pExistingStoragePaths = { ...((pSnap.data() as Partial<CalculatorImageConfig>).storagePaths || {}) };
        }
      } catch (_e) {
        // Non-fatal
      }

      pExistingStoragePaths.measurementGuideImage = storagePath;

      const pantsPayload: Partial<CalculatorImageConfig> & { storagePaths?: Record<string, string> } = {
        id: pId,
        garmentId: 'celana',
        systemId: pantsCalcObj?.systemId || pId,
        systemNumber: pantsCalcObj?.systemNumber || 1,
        name: pantsCalcObj?.name || pId,
        measurementGuideImage: downloadUrl,
        storagePaths: pExistingStoragePaths,
        updatedAt: now,
      };

      await setDoc(pantsDocRef, pantsPayload, { merge: true });
      console.info(`[Firestore] Shared Pants Measurement Guide synced for calculators/${pId}`);

      // Update local storage cache for instant UI feedback
      try {
        const cached = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}${pId}`);
        const current = cached ? JSON.parse(cached) : { id: pId, name: pantsCalcObj?.name || pId };
        current.measurementGuideImage = downloadUrl;
        current.storagePaths = pExistingStoragePaths;
        current.updatedAt = now;
        localStorage.setItem(`${LOCAL_STORAGE_PREFIX}${pId}`, JSON.stringify(current));
      } catch (e) {
        console.warn(`[LocalStorage] Could not cache image config for ${pId}:`, e);
      }
    }
  } else if (isShared2MeasSkirtGuide) {
    // Update both Rok Lingkaran and Rok Lipit Searah in Firestore to point to the ONE shared image
    for (const sId of ALL_TWO_MEASUREMENT_SKIRT_DOC_IDS) {
      const skirtCalcObj = SUPPORTED_CALCULATORS.find(c => c.id === sId);
      const skirtDocRef = doc(db, 'calculators', sId);
      let sExistingStoragePaths: Record<string, string> = {};
      try {
        const sSnap = await getDoc(skirtDocRef);
        if (sSnap.exists()) {
          sExistingStoragePaths = { ...((sSnap.data() as Partial<CalculatorImageConfig>).storagePaths || {}) };
        }
      } catch (_e) {
        // Non-fatal
      }

      sExistingStoragePaths.measurementGuideImage = storagePath;

      const skirtPayload: Partial<CalculatorImageConfig> & { storagePaths?: Record<string, string> } = {
        id: sId,
        garmentId: 'rok',
        systemId: skirtCalcObj?.systemId || sId,
        systemNumber: skirtCalcObj?.systemNumber || 1,
        name: skirtCalcObj?.name || sId,
        measurementGuideImage: downloadUrl,
        storagePaths: sExistingStoragePaths,
        updatedAt: now,
      };

      await setDoc(skirtDocRef, skirtPayload, { merge: true });
      console.info(`[Firestore] Shared 2-Measurement Skirt Guide synced for calculators/${sId}`);

      // Update local storage cache for instant UI feedback
      try {
        const cached = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}${sId}`);
        const current = cached ? JSON.parse(cached) : { id: sId, name: skirtCalcObj?.name || sId };
        current.measurementGuideImage = downloadUrl;
        current.storagePaths = sExistingStoragePaths;
        current.updatedAt = now;
        localStorage.setItem(`${LOCAL_STORAGE_PREFIX}${sId}`, JSON.stringify(current));
      } catch (e) {
        console.warn(`[LocalStorage] Could not cache image config for ${sId}:`, e);
      }
    }
  } else {
    // Normal single-calculator Firestore update
    const docRef = doc(db, 'calculators', calculatorId);
    let existingStoragePaths: Record<string, string> = {};
    try {
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        existingStoragePaths = { ...((snap.data() as Partial<CalculatorImageConfig>).storagePaths || {}) };
      }
    } catch (_e) {
      // Non-fatal
    }

    const newStoragePaths: Record<string, string> = {
      ...existingStoragePaths,
      [imageType]: storagePath,
    };

    const updatePayload: Partial<CalculatorImageConfig> & { storagePaths?: Record<string, string> } = {
      id: calculatorId,
      garmentId: calcObj?.garmentId || (calculatorId.includes('badan') ? 'badan' : 'rok'),
      systemId: calcObj?.systemId || calculatorId,
      systemNumber: calcObj?.systemNumber || 1,
      name: calculatorName,
      [imageType]: downloadUrl,
      storagePaths: newStoragePaths,
      updatedAt: now,
    };

    // Sync aliases if needed
    if (calculatorId === 'rok-lingkaran') {
      if (imageType === 'fullCirclePatternImage') {
        updatePayload.patternImage = downloadUrl;
        updatePayload.frontPatternImage = downloadUrl;
        newStoragePaths.patternImage = storagePath;
        newStoragePaths.frontPatternImage = storagePath;
      } else if (imageType === 'halfCirclePatternImage') {
        updatePayload.backPatternImage = downloadUrl;
        newStoragePaths.backPatternImage = storagePath;
      }
    }

    if (imageType === 'dressmakingSideDartImage') {
      updatePayload.sideDartDetailImage = downloadUrl;
      newStoragePaths.sideDartDetailImage = storagePath;
    } else if (imageType === 'sideDartDetailImage') {
      updatePayload.dressmakingSideDartImage = downloadUrl;
      newStoragePaths.dressmakingSideDartImage = storagePath;
    } else if (imageType === 'frontPatternImage') {
      updatePayload.dressmakingFrontPatternImage = downloadUrl;
      newStoragePaths.dressmakingFrontPatternImage = storagePath;
    } else if (imageType === 'backPatternImage') {
      updatePayload.dressmakingBackPatternImage = downloadUrl;
      newStoragePaths.dressmakingBackPatternImage = storagePath;
    } else if (imageType === 'detailPatternImage') {
      updatePayload.dressmakingSideDartImage = downloadUrl;
      updatePayload.sideDartDetailImage = downloadUrl;
      newStoragePaths.dressmakingSideDartImage = storagePath;
      newStoragePaths.sideDartDetailImage = storagePath;
    }

    await setDoc(docRef, updatePayload, { merge: true });
    console.info(`[Firestore] Document calculators/${calculatorId} updated with new Storage URL & path:`, updatePayload);

    // Update local cache
    try {
      const cached = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}${calculatorId}`);
      const current = cached ? JSON.parse(cached) : { id: calculatorId, name: calculatorName };
      current[imageType] = downloadUrl;
      if (calculatorId === 'rok-lingkaran') {
        if (imageType === 'fullCirclePatternImage') {
          current.patternImage = downloadUrl;
          current.frontPatternImage = downloadUrl;
        } else if (imageType === 'halfCirclePatternImage') {
          current.backPatternImage = downloadUrl;
        }
      }
      if (imageType === 'dressmakingSideDartImage') current.sideDartDetailImage = downloadUrl;
      if (imageType === 'sideDartDetailImage') current.dressmakingSideDartImage = downloadUrl;
      current.storagePaths = newStoragePaths;
      current.updatedAt = now;
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}${calculatorId}`, JSON.stringify(current));
    } catch (e) {
      console.warn('[LocalStorage] Could not cache image config:', e);
    }
  }

  // 5. AUTO-DELETE OLD PHYSICAL IMAGE FROM FIREBASE STORAGE
  // Only executed after the new upload and all Firestore reference updates have fully succeeded.
  for (const oldItem of uniqueOldCandidates) {
    if (
      oldItem &&
      oldItem !== downloadUrl &&
      oldItem !== storagePath &&
      (oldItem.includes('firebasestorage.googleapis.com') ||
       oldItem.includes('storage.googleapis.com') ||
       oldItem.startsWith('calculators/') ||
       oldItem.startsWith('gs://'))
    ) {
      try {
        console.info(`[Firebase Storage] Auto-deleting old replaced image file: ${oldItem}`);
        await deletePhysicalStorageFile(oldItem);
        console.info(`[Firebase Storage] Successfully auto-deleted old replaced image: ${oldItem}`);
      } catch (delErr) {
        console.warn(`[Firebase Storage] Non-blocking: could not delete old image ${oldItem}:`, delErr);
      }
    }
  }

  return downloadUrl;
}

/**
 * Remove an image from a calculator configuration:
 * 1. Retrieves current image URL / storage path from Firestore document.
 * 2. If shared skirt guide: clears reference across all 3 skirt calculators and checks remaining references before physical deletion.
 * 3. Physically deletes the specific storage object from Firebase Storage if no references remain.
 * 4. Removes the URL and storage path reference from Firestore with { merge: true }.
 * 5. Updates local cache and propagates the change.
 */
export async function removeCalculatorImage(
  calculatorId: string,
  imageType: CalculatorImageType
): Promise<void> {
  const isSharedSkirtGuide = isSkirtMeasurementGuide(calculatorId, imageType);
  const isSharedBodiceGuide = isBodiceMeasurementGuide(calculatorId, imageType);
  const isSharedPantsGuide = isPantsMeasurementGuide(calculatorId, imageType);
  const isShared2MeasSkirtGuide = isTwoMeasurementSkirtGuide(calculatorId, imageType);
  const calcObj = SUPPORTED_CALCULATORS.find(c => c.id === calculatorId);
  const calculatorName = calcObj?.name || calculatorId;
  const now = new Date().toISOString();

  if (isSharedBodiceGuide) {
    // 1. Collect candidate URLs/paths across all bodice calculators
    const candidateUrlsOrPaths: (string | null | undefined)[] = [];
    for (const bId of ALL_BODICE_DOC_IDS) {
      try {
        const bSnap = await getDoc(doc(db, 'calculators', bId));
        if (bSnap.exists()) {
          const bData = bSnap.data() as Partial<CalculatorImageConfig>;
          candidateUrlsOrPaths.push(bData.measurementGuideImage);
          candidateUrlsOrPaths.push(bData.storagePaths?.measurementGuideImage);
        }
      } catch (_e) {
        // Non-fatal
      }
    }

    const uniqueCandidates = Array.from(
      new Set(candidateUrlsOrPaths.filter((u): u is string => Boolean(u && typeof u === 'string' && u.trim().length > 0)))
    );

    // 2. Clear measurementGuideImage from all 3 bodice calculators in Firestore
    for (const bId of ALL_BODICE_DOC_IDS) {
      const bodiceDocRef = doc(db, 'calculators', bId);
      let bExistingStoragePaths: Record<string, string> = {};
      try {
        const bSnap = await getDoc(bodiceDocRef);
        if (bSnap.exists()) {
          bExistingStoragePaths = { ...((bSnap.data() as Partial<CalculatorImageConfig>).storagePaths || {}) };
        }
      } catch (_e) {
        // Non-fatal
      }

      delete bExistingStoragePaths.measurementGuideImage;

      await setDoc(bodiceDocRef, {
        id: bId,
        measurementGuideImage: '',
        storagePaths: bExistingStoragePaths,
        updatedAt: now,
      }, { merge: true });

      // Update local cache
      try {
        const cached = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}${bId}`);
        const current = cached ? JSON.parse(cached) : { id: bId };
        current.measurementGuideImage = '';
        if (current.storagePaths) delete current.storagePaths.measurementGuideImage;
        current.updatedAt = now;
        localStorage.setItem(`${LOCAL_STORAGE_PREFIX}${bId}`, JSON.stringify(current));
      } catch (e) {
        console.warn(`[LocalStorage] Could not clear cache for ${bId}:`, e);
      }
    }

    // 3. DELETE SAFETY: Physically delete old shared storage objects only now that all references have been cleared
    for (const item of uniqueCandidates) {
      if (
        item.includes('firebasestorage.googleapis.com') ||
        item.includes('storage.googleapis.com') ||
        item.startsWith('calculators/') ||
        item.startsWith('gs://')
      ) {
        await deletePhysicalStorageFile(item);
      }
    }

    console.info('[Firestore] Shared Bodice Measurement Guide removed for all bodice calculators.');
    return;
  }

  if (isSharedSkirtGuide) {
    // 1. Collect candidate URLs/paths across all skirt calculators
    const candidateUrlsOrPaths: (string | null | undefined)[] = [];
    for (const sId of ALL_SKIRT_DOC_IDS) {
      try {
        const sSnap = await getDoc(doc(db, 'calculators', sId));
        if (sSnap.exists()) {
          const sData = sSnap.data() as Partial<CalculatorImageConfig>;
          candidateUrlsOrPaths.push(sData.measurementGuideImage);
          candidateUrlsOrPaths.push(sData.storagePaths?.measurementGuideImage);
        }
      } catch (_e) {
        // Non-fatal
      }
    }

    const uniqueCandidates = Array.from(
      new Set(candidateUrlsOrPaths.filter((u): u is string => Boolean(u && typeof u === 'string' && u.trim().length > 0)))
    );

    // 2. Clear measurementGuideImage from all 3 skirt calculators in Firestore
    for (const sId of ALL_SKIRT_DOC_IDS) {
      const skirtDocRef = doc(db, 'calculators', sId);
      let sExistingStoragePaths: Record<string, string> = {};
      try {
        const sSnap = await getDoc(skirtDocRef);
        if (sSnap.exists()) {
          sExistingStoragePaths = { ...((sSnap.data() as Partial<CalculatorImageConfig>).storagePaths || {}) };
        }
      } catch (_e) {
        // Non-fatal
      }

      delete sExistingStoragePaths.measurementGuideImage;

      await setDoc(skirtDocRef, {
        id: sId,
        measurementGuideImage: '',
        storagePaths: sExistingStoragePaths,
        updatedAt: now,
      }, { merge: true });

      // Update local cache
      try {
        const cached = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}${sId}`);
        const current = cached ? JSON.parse(cached) : { id: sId };
        current.measurementGuideImage = '';
        if (current.storagePaths) delete current.storagePaths.measurementGuideImage;
        current.updatedAt = now;
        localStorage.setItem(`${LOCAL_STORAGE_PREFIX}${sId}`, JSON.stringify(current));
      } catch (e) {
        console.warn(`[LocalStorage] Could not clear cache for ${sId}:`, e);
      }
    }

    // 3. DELETE SAFETY: Physically delete old shared storage objects only now that all references have been cleared
    for (const item of uniqueCandidates) {
      if (
        item.includes('firebasestorage.googleapis.com') ||
        item.includes('storage.googleapis.com') ||
        item.startsWith('calculators/') ||
        item.startsWith('gs://')
      ) {
        await deletePhysicalStorageFile(item);
      }
    }

    console.info('[Firestore] Shared Measurement Guide removed for all skirt calculators.');
    return;
  }

  if (isSharedPantsGuide) {
    // 1. Collect candidate URLs/paths across all pants calculators
    const candidateUrlsOrPaths: (string | null | undefined)[] = [];
    for (const pId of ALL_PANTS_DOC_IDS) {
      try {
        const pSnap = await getDoc(doc(db, 'calculators', pId));
        if (pSnap.exists()) {
          const pData = pSnap.data() as Partial<CalculatorImageConfig>;
          candidateUrlsOrPaths.push(pData.measurementGuideImage);
          candidateUrlsOrPaths.push(pData.storagePaths?.measurementGuideImage);
        }
      } catch (_e) {
        // Non-fatal
      }
    }

    const uniqueCandidates = Array.from(
      new Set(candidateUrlsOrPaths.filter((u): u is string => Boolean(u && typeof u === 'string' && u.trim().length > 0)))
    );

    // 2. Clear measurementGuideImage from all pants calculators in Firestore
    for (const pId of ALL_PANTS_DOC_IDS) {
      const pantsDocRef = doc(db, 'calculators', pId);
      let pExistingStoragePaths: Record<string, string> = {};
      try {
        const pSnap = await getDoc(pantsDocRef);
        if (pSnap.exists()) {
          pExistingStoragePaths = { ...((pSnap.data() as Partial<CalculatorImageConfig>).storagePaths || {}) };
        }
      } catch (_e) {
        // Non-fatal
      }

      delete pExistingStoragePaths.measurementGuideImage;

      await setDoc(pantsDocRef, {
        id: pId,
        measurementGuideImage: '',
        storagePaths: pExistingStoragePaths,
        updatedAt: now,
      }, { merge: true });

      // Update local cache
      try {
        const cached = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}${pId}`);
        const current = cached ? JSON.parse(cached) : { id: pId };
        current.measurementGuideImage = '';
        if (current.storagePaths) delete current.storagePaths.measurementGuideImage;
        current.updatedAt = now;
        localStorage.setItem(`${LOCAL_STORAGE_PREFIX}${pId}`, JSON.stringify(current));
      } catch (e) {
        console.warn(`[LocalStorage] Could not clear cache for ${pId}:`, e);
      }
    }

    // 3. DELETE SAFETY: Physically delete old shared storage objects only now that all references have been cleared
    for (const item of uniqueCandidates) {
      if (
        item.includes('calculators/shared/measurement-guides/pants') ||
        item.startsWith('calculators/shared/measurement-guides/pants') ||
        item.includes('calculators/pola-celana-piyama/measurement-guide') ||
        item.startsWith('calculators/pola-celana-piyama/measurement-guide')
      ) {
        await deletePhysicalStorageFile(item);
      }
    }

    console.info('[Firestore] Shared Pants Measurement Guide removed for all pants calculators.');
    return;
  }

  if (isShared2MeasSkirtGuide) {
    // 1. Collect candidate URLs/paths across both 2-measurement skirt calculators
    const candidateUrlsOrPaths: (string | null | undefined)[] = [];
    for (const sId of ALL_TWO_MEASUREMENT_SKIRT_DOC_IDS) {
      try {
        const sSnap = await getDoc(doc(db, 'calculators', sId));
        if (sSnap.exists()) {
          const sData = sSnap.data() as Partial<CalculatorImageConfig>;
          candidateUrlsOrPaths.push(sData.measurementGuideImage);
          candidateUrlsOrPaths.push(sData.storagePaths?.measurementGuideImage);
        }
      } catch (_e) {
        // Non-fatal
      }
    }

    const uniqueCandidates = Array.from(
      new Set(candidateUrlsOrPaths.filter((u): u is string => Boolean(u && typeof u === 'string' && u.trim().length > 0)))
    );

    // 2. Clear measurementGuideImage from both calculators in Firestore
    for (const sId of ALL_TWO_MEASUREMENT_SKIRT_DOC_IDS) {
      const skirtDocRef = doc(db, 'calculators', sId);
      let sExistingStoragePaths: Record<string, string> = {};
      try {
        const sSnap = await getDoc(skirtDocRef);
        if (sSnap.exists()) {
          sExistingStoragePaths = { ...((sSnap.data() as Partial<CalculatorImageConfig>).storagePaths || {}) };
        }
      } catch (_e) {
        // Non-fatal
      }

      delete sExistingStoragePaths.measurementGuideImage;

      await setDoc(skirtDocRef, {
        id: sId,
        measurementGuideImage: '',
        storagePaths: sExistingStoragePaths,
        updatedAt: now,
      }, { merge: true });

      // Update local cache
      try {
        const cached = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}${sId}`);
        const current = cached ? JSON.parse(cached) : { id: sId };
        current.measurementGuideImage = '';
        if (current.storagePaths) delete current.storagePaths.measurementGuideImage;
        current.updatedAt = now;
        localStorage.setItem(`${LOCAL_STORAGE_PREFIX}${sId}`, JSON.stringify(current));
      } catch (e) {
        console.warn(`[LocalStorage] Could not clear cache for ${sId}:`, e);
      }
    }

    // 3. DELETE SAFETY: Physically delete old shared storage objects only now that all references have been cleared
    for (const item of uniqueCandidates) {
      if (
        item.includes('calculators/shared/measurement-guides/skirt-2meas') ||
        item.startsWith('calculators/shared/measurement-guides/skirt-2meas')
      ) {
        await deletePhysicalStorageFile(item);
      }
    }

    console.info('[Firestore] Shared 2-Measurement Skirt Guide removed for all 2-measurement skirt calculators.');
    return;
  }

  // Standard single calculator image slot removal
  const docRef = doc(db, 'calculators', calculatorId);

  // 1. Fetch current document to find current stored URL(s) and storagePath(s)
  let currentDocData: Partial<CalculatorImageConfig> = {};
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      currentDocData = docSnap.data() as Partial<CalculatorImageConfig>;
    }
  } catch (err) {
    console.warn(`[Firebase] Could not fetch document calculators/${calculatorId} before deletion:`, err);
  }

  // 2. Identify candidate URLs/paths for this specific image slot and its aliases
  const candidateUrlsOrPaths: (string | null | undefined)[] = [
    currentDocData[imageType],
    currentDocData.storagePaths?.[imageType],
  ];

  if (calculatorId === 'rok-lingkaran') {
    if (imageType === 'fullCirclePatternImage') {
      candidateUrlsOrPaths.push(
        currentDocData.patternImage,
        currentDocData.frontPatternImage,
        currentDocData.storagePaths?.patternImage,
        currentDocData.storagePaths?.frontPatternImage
      );
    } else if (imageType === 'halfCirclePatternImage') {
      candidateUrlsOrPaths.push(
        currentDocData.backPatternImage,
        currentDocData.storagePaths?.backPatternImage
      );
    }
  } else if (imageType === 'dressmakingSideDartImage' || imageType === 'sideDartDetailImage') {
    candidateUrlsOrPaths.push(
      currentDocData.dressmakingSideDartImage,
      currentDocData.sideDartDetailImage,
      currentDocData.storagePaths?.dressmakingSideDartImage,
      currentDocData.storagePaths?.sideDartDetailImage
    );
  } else if (imageType === 'dressmakingFrontPatternImage' || imageType === 'frontPatternImage') {
    candidateUrlsOrPaths.push(
      currentDocData.dressmakingFrontPatternImage,
      currentDocData.frontPatternImage,
      currentDocData.storagePaths?.dressmakingFrontPatternImage,
      currentDocData.storagePaths?.frontPatternImage
    );
  } else if (imageType === 'dressmakingBackPatternImage' || imageType === 'backPatternImage') {
    candidateUrlsOrPaths.push(
      currentDocData.dressmakingBackPatternImage,
      currentDocData.backPatternImage,
      currentDocData.storagePaths?.dressmakingBackPatternImage,
      currentDocData.storagePaths?.backPatternImage
    );
  } else if (imageType === 'tier4PatternImage') {
    candidateUrlsOrPaths.push(
      currentDocData.tier4PatternImage,
      currentDocData.storagePaths?.tier4PatternImage
    );
  }

  // Filter unique valid candidates
  const uniqueUrlsOrPaths = Array.from(
    new Set(candidateUrlsOrPaths.filter((u): u is string => Boolean(u && typeof u === 'string' && u.trim().length > 0)))
  );

  // 3. Physically delete each associated file from Firebase Storage
  for (const item of uniqueUrlsOrPaths) {
    if (
      item.includes('firebasestorage.googleapis.com') ||
      item.includes('storage.googleapis.com') ||
      item.startsWith('calculators/') ||
      item.startsWith('gs://')
    ) {
      await deletePhysicalStorageFile(item);
    }
  }

  // 4. Build Firestore update payload to clear URL and storagePath
  const currentStoragePaths = { ...(currentDocData.storagePaths || {}) };
  delete currentStoragePaths[imageType];

  const updatePayload: Partial<CalculatorImageConfig> & { storagePaths?: Record<string, string> } = {
    id: calculatorId,
    name: calculatorName,
    [imageType]: '',
    updatedAt: now,
  };

  if (calculatorId === 'rok-lingkaran') {
    if (imageType === 'fullCirclePatternImage') {
      updatePayload.patternImage = '';
      updatePayload.frontPatternImage = '';
      delete currentStoragePaths.patternImage;
      delete currentStoragePaths.frontPatternImage;
    } else if (imageType === 'halfCirclePatternImage') {
      updatePayload.backPatternImage = '';
      delete currentStoragePaths.backPatternImage;
    }
  }

  if (imageType === 'dressmakingSideDartImage') {
    updatePayload.sideDartDetailImage = '';
    delete currentStoragePaths.sideDartDetailImage;
  } else if (imageType === 'sideDartDetailImage') {
    updatePayload.dressmakingSideDartImage = '';
    delete currentStoragePaths.dressmakingSideDartImage;
  } else if (imageType === 'dressmakingFrontPatternImage' || imageType === 'frontPatternImage') {
    updatePayload.dressmakingFrontPatternImage = '';
    updatePayload.frontPatternImage = '';
    delete currentStoragePaths.dressmakingFrontPatternImage;
    delete currentStoragePaths.frontPatternImage;
  } else if (imageType === 'dressmakingBackPatternImage' || imageType === 'backPatternImage') {
    updatePayload.dressmakingBackPatternImage = '';
    updatePayload.backPatternImage = '';
    delete currentStoragePaths.dressmakingBackPatternImage;
    delete currentStoragePaths.backPatternImage;
  }

  updatePayload.storagePaths = currentStoragePaths;

  // 5. Update Firestore
  await setDoc(docRef, updatePayload, { merge: true });
  console.info(`[Firestore] Image ${imageType} and physical storage file removed for calculators/${calculatorId}`);

  // 6. Update local cache
  try {
    const cached = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}${calculatorId}`);
    const current = cached ? JSON.parse(cached) : { id: calculatorId, name: calculatorName };
    current[imageType] = '';
    if (calculatorId === 'rok-lingkaran') {
      if (imageType === 'fullCirclePatternImage') {
        current.patternImage = '';
        current.frontPatternImage = '';
      } else if (imageType === 'halfCirclePatternImage') {
        current.backPatternImage = '';
      }
    }
    if (imageType === 'dressmakingSideDartImage') current.sideDartDetailImage = '';
    if (imageType === 'sideDartDetailImage') current.dressmakingSideDartImage = '';
    if (imageType === 'dressmakingFrontPatternImage') current.frontPatternImage = '';
    if (imageType === 'frontPatternImage') current.dressmakingFrontPatternImage = '';
    if (imageType === 'dressmakingBackPatternImage') current.backPatternImage = '';
    if (imageType === 'backPatternImage') current.dressmakingBackPatternImage = '';
    if (current.storagePaths) {
      delete current.storagePaths[imageType];
    }
    current.updatedAt = now;
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}${calculatorId}`, JSON.stringify(current));
  } catch (e) {
    console.warn('[LocalStorage] Could not update cache after image removal:', e);
  }
}
