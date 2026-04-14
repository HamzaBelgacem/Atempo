import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  X, Check, Apple, Chrome, ChevronRight, Briefcase,
  User as UserIcon, ArrowLeft, Sparkles, MapPin, Tag,
  Plus, Clock, Loader2, LogIn,
} from 'lucide-react';
import { UserType, AppTheme, User } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { DISCIPLINES, TAG_GROUPS } from '../constants';

// ─── Firebase ────────────────────────────────────────────────────────────────
import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

const firebaseApp  = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const firebaseAuth = getAuth(firebaseApp);
const firebaseDb   = getFirestore(firebaseApp);

// ─── Types ───────────────────────────────────────────────────────────────────
interface RegistrationModalProps {
  language: string;
  onClose: () => void;
  inviteCode?: string;
  onSuccess: (user: User) => void;
}

// ─── Constants ───────────────────────────────────────────────────────────────
const BUSINESS_TYPES = ['Gallery', 'Studio', 'Cafe', 'Club', 'Workshop', 'Store', 'Agency', 'Collective'];

const COUNTRY_CODES = [
  { code: 'MA', flag: '🇲🇦', dial: '+212', name: 'Morocco' },
  { code: 'AD', flag: '🇦🇩', dial: '+376', name: 'Andorra' },
  { code: 'BE', flag: '🇧🇪', dial: '+32',  name: 'Belgium' },
  { code: 'BR', flag: '🇧🇷', dial: '+55',  name: 'Brazil' },
  { code: 'CH', flag: '🇨🇭', dial: '+41',  name: 'Switzerland' },
  { code: 'CL', flag: '🇨🇱', dial: '+56',  name: 'Chile' },
  { code: 'CN', flag: '🇨🇳', dial: '+86',  name: 'China' },
  { code: 'CO', flag: '🇨🇴', dial: '+57',  name: 'Colombia' },
  { code: 'DE', flag: '🇩🇪', dial: '+49',  name: 'Germany' },
  { code: 'DK', flag: '🇩🇰', dial: '+45',  name: 'Denmark' },
  { code: 'ES', flag: '🇪🇸', dial: '+34',  name: 'Spain' },
  { code: 'FR', flag: '🇫🇷', dial: '+33',  name: 'France' },
  { code: 'GB', flag: '🇬🇧', dial: '+44',  name: 'United Kingdom' },
  { code: 'IT', flag: '🇮🇹', dial: '+39',  name: 'Italy' },
  { code: 'MX', flag: '🇲🇽', dial: '+52',  name: 'Mexico' },
  { code: 'NL', flag: '🇳🇱', dial: '+31',  name: 'Netherlands' },
  { code: 'PT', flag: '🇵🇹', dial: '+351', name: 'Portugal' },
  { code: 'US', flag: '🇺🇸', dial: '+1',   name: 'United States' },
  { code: 'VE', flag: '🇻🇪', dial: '+58',  name: 'Venezuela' },
  { code: 'UY', flag: '🇺🇾', dial: '+598', name: 'Uruguay' },
  { code: 'PY', flag: '🇵🇾', dial: '+595', name: 'Paraguay' },
  { code: 'BO', flag: '🇧🇴', dial: '+591', name: 'Bolivia' },
  { code: 'EC', flag: '🇪🇨', dial: '+593', name: 'Ecuador' },
  { code: 'PA', flag: '🇵🇦', dial: '+507', name: 'Panama' },
  { code: 'CR', flag: '🇨🇷', dial: '+506', name: 'Costa Rica' },
  { code: 'DO', flag: '🇩🇴', dial: '+1',   name: 'Dominican Republic' },
  { code: 'GT', flag: '🇬🇹', dial: '+502', name: 'Guatemala' },
  { code: 'HN', flag: '🇭🇳', dial: '+504', name: 'Honduras' },
  { code: 'SV', flag: '🇸🇻', dial: '+503', name: 'El Salvador' },
  { code: 'NI', flag: '🇳🇮', dial: '+505', name: 'Nicaragua' },
  { code: 'CU', flag: '🇨🇺', dial: '+53',  name: 'Cuba' },
  { code: 'PR', flag: '🇵🇷', dial: '+1',   name: 'Puerto Rico' },
].sort((a, b) => a.name.localeCompare(b.name));

const SHIFT_OPTIONS = [
  { id: 'day',       label: 'Day',       icon: <Clock size={14} /> },
  { id: 'afternoon', label: 'Afternoon', icon: <Clock size={14} /> },
  { id: 'night',     label: 'Night',     icon: <Clock size={14} /> },
];

const CATEGORIES = [
  { id: 'visual_arts',     label: 'Visual Arts',     image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=400' },
  { id: 'crafts',          label: 'Crafts',           image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=400' },
  { id: 'fashion',         label: 'Fashion',          image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=400' },
  { id: 'food',            label: 'Food',             image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=400' },
  { id: 'nature',          label: 'Nature',           image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=400' },
  { id: 'science',         label: 'Science',          image: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=400' },
  { id: 'history',         label: 'History',          image: 'https://images.unsplash.com/photo-1461360228754-6e81c478b882?q=80&w=400' },
  { id: 'performing_arts', label: 'Performing Arts',  image: 'https://images.unsplash.com/photo-1503095396549-807a8bc3667c?q=80&w=400' },
  { id: 'travel',          label: 'Travel',           image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=400' },
  { id: 'design',          label: 'Design',           image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=400' },
  { id: 'natural_history', label: 'Natural History',  image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=400' },
  { id: 'sports',          label: 'Sports',           image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=400' },
];

// ─── Helper: map Firebase error codes to readable messages ───────────────────
const firebaseErrorMessage = (code: string): string => {
  switch (code) {
    case 'auth/email-already-in-use':    return 'An account with this email already exists. Please log in instead.';
    case 'auth/invalid-email':           return 'Please enter a valid email address.';
    case 'auth/weak-password':           return 'Password must be at least 6 characters.';
    case 'auth/user-not-found':          return 'No account found with this email.';
    case 'auth/wrong-password':          return 'Incorrect password. Please try again.';
    case 'auth/invalid-credential':      return 'Incorrect email or password. Please try again.';
    case 'auth/too-many-requests':       return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':  return 'Network error. Check your connection and try again.';
    default:                             return 'Something went wrong. Please try again.';
  }
};

// ─── Component ────────────────────────────────────────────────────────────────
const RegistrationModal: React.FC<RegistrationModalProps> = ({ onClose, onSuccess, inviteCode }) => {

  // 'login' | register steps 1-5
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // ── Shared loading / error state ────────────────────────────────────────────
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg]   = useState('');

  // ── Login fields ────────────────────────────────────────────────────────────
  const [loginEmail,    setLoginEmail]    = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // ── Register step ────────────────────────────────────────────────────────────
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Step 1 – interests
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Step 2 – disciplines / tags
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag,    setCustomTag]     = useState('');
  const [workShifts,   setWorkShifts]    = useState<string[]>([]);

  // Step 3 – profile details
  const [name,            setName]            = useState('');
  const [email,           setEmail]           = useState('');
  const [password,        setPassword]        = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType,        setUserType]        = useState<UserType>(UserType.STANDARD);

  // Step 4 – location
  const [city,            setCity]            = useState('');
  const [from,            setFrom]            = useState('');
  const [citySuggestions, setCitySuggestions] = useState<any[]>([]);
  const [fromSuggestions, setFromSuggestions] = useState<any[]>([]);
  const [isSearchingCity, setIsSearchingCity] = useState(false);
  const [isSearchingFrom, setIsSearchingFrom] = useState(false);
  const autocompleteService = useRef<any>(null);

  // Step 5 – phone
  const [phoneNumber,          setPhoneNumber]          = useState('');
  const [selectedCountry,      setSelectedCountry]      = useState(COUNTRY_CODES.find(c => c.code === 'ES') || COUNTRY_CODES[0]);
  const [isCountrySelectorOpen,setIsCountrySelectorOpen]= useState(false);
  const [countrySearch,        setCountrySearch]        = useState('');

  // ── Google Maps autocomplete ─────────────────────────────────────────────────
  useEffect(() => {
    if ((window as any).google && !autocompleteService.current) {
      autocompleteService.current = new (window as any).google.maps.places.AutocompleteService();
    }
  }, []);

  const fetchSuggestions = (
    input: string,
    setter: (v: any[]) => void,
    loadingSetter: (v: boolean) => void,
  ) => {
    if (!input || input.length < 2 || !autocompleteService.current) { setter([]); return; }
    loadingSetter(true);
    autocompleteService.current.getPlacePredictions(
      { input, types: ['(cities)'] },
      (predictions: any[] | null, status: string) => {
        loadingSetter(false);
        setter(status === 'OK' && predictions ? predictions : []);
      },
    );
  };

  useEffect(() => {
    const t = setTimeout(() => fetchSuggestions(city, setCitySuggestions, setIsSearchingCity), 300);
    return () => clearTimeout(t);
  }, [city]);

  useEffect(() => {
    const t = setTimeout(() => fetchSuggestions(from, setFromSuggestions, setIsSearchingFrom), 300);
    return () => clearTimeout(t);
  }, [from]);

  // ── Tag helpers ──────────────────────────────────────────────────────────────
  const allAvailableTags = useMemo(() => {
    const baseTags = Array.from(new Set([...DISCIPLINES, ...BUSINESS_TYPES]));
    if (selectedTags.length === 0) return baseTags;
    const scores: Record<string, number> = {};
    baseTags.forEach(tag => {
      if (selectedTags.includes(tag)) { scores[tag] = 10000; return; }
      let score = 0;
      selectedTags.forEach(selected => {
        Object.entries(TAG_GROUPS).forEach(([, members]) => {
          if (members.some(m => selected.toLowerCase().includes(m.toLowerCase()) || m.toLowerCase().includes(selected.toLowerCase()))) {
            if (members.some(m => tag.toLowerCase().includes(m.toLowerCase()) || m.toLowerCase().includes(tag.toLowerCase()))) score += 100;
          }
        });
        const sw = selected.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 3);
        const tw = tag.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 3);
        sw.forEach(s => { if (tw.some(t => t.includes(s) || s.includes(t))) score += 20; });
      });
      scores[tag] = score;
    });
    return [...baseTags].sort((a, b) => scores[b] - scores[a] || baseTags.indexOf(a) - baseTags.indexOf(b));
  }, [selectedTags]);

  const toggleTag   = (tag: string)   => setSelectedTags(p  => p.includes(tag)   ? p.filter(t => t !== tag)   : [...p, tag]);
  const toggleShift = (shift: string) => setWorkShifts(p    => p.includes(shift) ? p.filter(s => s !== shift) : [...p, shift]);
  const addCustomTag = () => {
    if (customTag && !selectedTags.includes(customTag)) { setSelectedTags(p => [...p, customTag]); setCustomTag(''); }
  };

  // ── Firebase: LOGIN ──────────────────────────────────────────────────────────
  const handleLogin = async () => {
    setErrorMsg('');
    if (!loginEmail || !loginPassword) { setErrorMsg('Please enter your email and password.'); return; }
    setIsLoading(true);
    try {
      const credential = await signInWithEmailAndPassword(firebaseAuth, loginEmail.trim(), loginPassword);
      const snap = await getDoc(doc(firebaseDb, 'users', credential.user.uid));
      if (!snap.exists()) {
        setErrorMsg('Account found but profile is missing. Please register again.');
        setIsLoading(false);
        return;
      }
      const profile = snap.data() as User;
      onSuccess(profile);
    } catch (err: any) {
      setErrorMsg(firebaseErrorMessage(err.code));
    } finally {
      setIsLoading(false);
    }
  };

  // ── Firebase: REGISTER (called at end of step 5) ─────────────────────────────
  const handleRegister = async () => {
    setErrorMsg('');
    if (!name || !email || !password) { setErrorMsg('Please fill in all required fields.'); return; }
    if (password !== confirmPassword)  { setErrorMsg('Passwords do not match.'); return; }
    if (password.length < 6)           { setErrorMsg('Password must be at least 6 characters.'); return; }

    setIsLoading(true);
    try {
      // 1. Create Firebase Auth account
      const credential = await createUserWithEmailAndPassword(firebaseAuth, email.trim(), password);
      const uid = credential.user.uid;

      // 2. Set display name
      await updateProfile(credential.user, { displayName: name });

      // 3. Build the full user profile
      const newUser: User = {
        id:                    uid,
        name,
        email:                 email.trim(),
        language:              'en',
        isRegistered:          true,
        isOnboarded:           false,
        type:                  userType,
        theme:                 AppTheme.ROSE,
        preferences:           [...selectedCategories, ...selectedTags],
        locationPermission:    'prompt',
        marketingAccepted:     true,
        registeredEventIds:    [],
        activeChatIds:         [],
        instagramHandle:       '',
        locationLabel:         city || 'Valencia',
        from,
        phoneNumber:           `${selectedCountry.dial} ${phoneNumber}`.trim(),
        timePreferences:       workShifts.length > 0 ? workShifts : ['night'],
        notificationPrefs:     { newEvents: true, groupMessages: true, businessInvites: true },
        inviteCode,
        // Business perks if invite code provided
        isVerified:              !!(inviteCode && userType === UserType.BUSINESS),
        hasLifetimeSubscription: !!(inviteCode && userType === UserType.BUSINESS),
      };

      // 4. Save to Firestore
      await setDoc(doc(firebaseDb, 'users', uid), {
        ...newUser,
        createdAt: serverTimestamp(),
      });

      // 5. Notify parent
      onSuccess(newUser);

    } catch (err: any) {
      setErrorMsg(firebaseErrorMessage(err.code));
    } finally {
      setIsLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER: LOGIN SCREEN
  // ─────────────────────────────────────────────────────────────────────────────
  const renderLogin = () => (
    <motion.div
      key="login"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full space-y-6 pb-8"
    >
      <div className="text-center space-y-2 pt-4">
        <h1 className="text-3xl font-serif font-bold text-primary tracking-tight">Welcome back</h1>
        <p className="text-sm text-primary/40 font-bold">Sign in to your Atempo account</p>
      </div>

      {/* Error banner */}
      {errorMsg && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-500 text-center">
          {errorMsg}
        </div>
      )}

      <div className="space-y-3">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-primary/40 uppercase tracking-widest ml-1">Email</label>
          <input
            type="email"
            autoComplete="email"
            className="w-full px-6 py-4 bg-white/40 backdrop-blur-md rounded-xl border border-white/40 text-base font-bold text-primary outline-none focus:border-primary/30 transition-all shadow-watercolor placeholder:text-primary/20"
            placeholder="example@email.com"
            value={loginEmail}
            onChange={e => { setLoginEmail(e.target.value); setErrorMsg(''); }}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-primary/40 uppercase tracking-widest ml-1">Password</label>
          <input
            type="password"
            autoComplete="current-password"
            className="w-full px-6 py-4 bg-white/40 backdrop-blur-md rounded-xl border border-white/40 text-base font-bold text-primary outline-none focus:border-primary/30 transition-all shadow-watercolor placeholder:text-primary/20"
            placeholder="••••••••"
            value={loginPassword}
            onChange={e => { setLoginPassword(e.target.value); setErrorMsg(''); }}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
        </div>
      </div>

      <button
        onClick={handleLogin}
        disabled={isLoading || !loginEmail || !loginPassword}
        className="w-full py-4 bg-primary text-white font-bold rounded-xl text-base shadow-glow-sunset active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-40"
      >
        {isLoading ? (
          <><Loader2 size={18} className="animate-spin" /> Signing in…</>
        ) : (
          <><LogIn size={18} /> Sign In</>
        )}
      </button>

      <div className="relative flex items-center justify-center py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/40" />
        </div>
        <span className="relative px-4 bg-transparent text-[10px] font-bold text-primary/20 uppercase tracking-widest">
          Don't have an account?
        </span>
      </div>

      <button
        onClick={() => { setMode('register'); setStep(1); setErrorMsg(''); }}
        className="w-full py-3.5 border border-white/40 bg-white/40 backdrop-blur-md rounded-xl font-bold text-primary/70 text-sm active:scale-[0.98] transition-all shadow-watercolor"
      >
        Create an Account
      </button>
    </motion.div>
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER: REGISTER STEPS
  // ─────────────────────────────────────────────────────────────────────────────

  // Dot indicator
  const StepDots = ({ current }: { current: number }) => (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map(n => (
        <div key={n} className={`w-1.5 h-1.5 rounded-full transition-all ${n === current ? 'bg-primary' : 'bg-primary/20'}`} />
      ))}
    </div>
  );

  const renderStep1 = () => (
    <motion.div
      key="step1"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      className="w-full space-y-8 pb-24"
    >
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-serif font-bold text-primary tracking-tight">Select your interests</h1>
        <p className="text-sm text-primary/40 font-bold">You can edit this later in settings</p>
      </div>

      <div className="grid grid-cols-3 gap-y-8 gap-x-4">
        {CATEGORIES.map(cat => {
          const isSelected = selectedCategories.includes(cat.id);
          return (
            <div key={cat.id} className="flex flex-col items-center gap-3">
              <button
                onClick={() => setSelectedCategories(p => p.includes(cat.id) ? p.filter(c => c !== cat.id) : [...p, cat.id])}
                className="relative w-24 h-24 rounded-full overflow-hidden active:scale-95 transition-all shadow-lg"
              >
                <img src={cat.image} alt={cat.label} className={`w-full h-full object-cover transition-transform duration-500 ${isSelected ? 'scale-110' : 'scale-100'}`} referrerPolicy="no-referrer" />
                {isSelected && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="absolute top-1 right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                      <Check size={14} className="text-white" strokeWidth={4} />
                    </div>
                  </div>
                )}
              </button>
              <span className="text-[11px] font-bold text-primary/70 text-center leading-tight">{cat.label}</span>
            </div>
          );
        })}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-paper via-paper/95 to-transparent flex items-center justify-between z-10">
        <button onClick={() => { setMode('login'); setErrorMsg(''); }} className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">
          Sign In
        </button>
        <StepDots current={1} />
        <button onClick={() => setStep(2)} className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest">
          Next <ChevronRight size={14} />
        </button>
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
      className="w-full space-y-8 pb-24"
    >
      <div className="text-center">
        <h1 className="text-2xl font-serif font-bold text-primary tracking-tight mb-2">Choose Disciplines</h1>
        <p className="text-sm text-primary/40 font-bold">What are you interested in?</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <label className="text-[10px] font-bold text-primary/40 uppercase tracking-widest ml-1">Interests & Disciplines</label>
          <div className="flex flex-wrap gap-3">
            {allAvailableTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all border shadow-sm ${
                  selectedTags.includes(tag)
                    ? 'bg-primary text-white border-primary shadow-glow-sunset scale-[1.02]'
                    : 'bg-white/60 text-primary/70 border-white/60 hover:border-primary/20'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-bold text-primary/40 uppercase tracking-widest ml-1">Add Custom Tags</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" />
              <input
                type="text"
                className="w-full pl-12 pr-4 py-3 bg-white/40 backdrop-blur-md rounded-xl border border-white/40 text-sm font-bold text-primary outline-none focus:border-primary/20 transition-all shadow-watercolor placeholder:text-primary/20"
                placeholder="New tag..."
                value={customTag}
                onChange={e => setCustomTag(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addCustomTag()}
              />
            </div>
            <button
              onClick={addCustomTag}
              className="w-12 h-12 bg-white/60 backdrop-blur-md rounded-xl border border-white/40 flex items-center justify-center text-primary/60 active:scale-90 transition-all shadow-watercolor"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-paper via-paper/95 to-transparent flex items-center justify-between z-10">
        <button onClick={() => setStep(1)} className="flex items-center gap-2 text-[10px] font-bold text-primary/40 uppercase tracking-widest">
          <ArrowLeft size={14} /> Back
        </button>
        <StepDots current={2} />
        <button onClick={() => setStep(3)} className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest">
          Next <ChevronRight size={14} />
        </button>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
      className="w-full space-y-8 pb-24"
    >
      <div className="text-center">
        <h1 className="text-2xl font-serif font-bold text-primary tracking-tight mb-2">Complete Profile</h1>
        <p className="text-sm text-primary/40 font-bold">Just a few more details to start.</p>
      </div>

      {/* Error banner */}
      {errorMsg && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-500 text-center">
          {errorMsg}
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-primary/40 uppercase tracking-widest ml-1">Full Name</label>
          <input
            type="text"
            autoComplete="name"
            className="w-full px-6 py-4 bg-white/40 backdrop-blur-md rounded-xl border border-white/40 text-lg font-bold text-primary outline-none focus:border-primary/20 transition-all shadow-watercolor placeholder:text-primary/20"
            placeholder="Full name"
            autoFocus
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-primary/40 uppercase tracking-widest ml-1">Email</label>
          <input
            type="email"
            autoComplete="email"
            className="w-full px-6 py-4 bg-white/40 backdrop-blur-md rounded-xl border border-white/40 text-lg font-bold text-primary outline-none focus:border-primary/20 transition-all shadow-watercolor placeholder:text-primary/20"
            placeholder="example@email.com"
            value={email}
            onChange={e => { setEmail(e.target.value); setErrorMsg(''); }}
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-primary/40 uppercase tracking-widest ml-1">Password</label>
          <input
            type="password"
            autoComplete="new-password"
            className="w-full px-6 py-4 bg-white/40 backdrop-blur-md rounded-xl border border-white/40 text-lg font-bold text-primary outline-none focus:border-primary/20 transition-all shadow-watercolor placeholder:text-primary/20"
            placeholder="Min 6 characters"
            value={password}
            onChange={e => { setPassword(e.target.value); setErrorMsg(''); }}
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-primary/40 uppercase tracking-widest ml-1">Confirm Password</label>
          <input
            type="password"
            autoComplete="new-password"
            className={`w-full px-6 py-4 bg-white/40 backdrop-blur-md rounded-xl border text-lg font-bold text-primary outline-none transition-all shadow-watercolor placeholder:text-primary/20 ${
              confirmPassword && confirmPassword !== password ? 'border-red-300 focus:border-red-400' : 'border-white/40 focus:border-primary/20'
            }`}
            placeholder="••••••••"
            value={confirmPassword}
            onChange={e => { setConfirmPassword(e.target.value); setErrorMsg(''); }}
          />
          {confirmPassword && confirmPassword !== password && (
            <p className="text-[10px] font-bold text-red-400 ml-1">Passwords don't match</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-primary/40 uppercase tracking-widest ml-1">Profile Type</label>
          <div className="flex flex-col gap-2 p-1 bg-white/40 backdrop-blur-md rounded-xl border border-white/40 shadow-watercolor">
            <button onClick={() => setUserType(UserType.STANDARD)} className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${userType === UserType.STANDARD ? 'bg-accent text-white shadow-glow-sunset' : 'text-primary/40'}`}>
              <UserIcon size={14} /> Attendee
            </button>
            <button onClick={() => setUserType(UserType.ARTIST_CURATOR)} className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${userType === UserType.ARTIST_CURATOR ? 'bg-accent text-white shadow-glow-sunset' : 'text-primary/40'}`}>
              <Sparkles size={14} /> Creative
            </button>
            <button onClick={() => setUserType(UserType.BUSINESS)} className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${userType === UserType.BUSINESS ? 'bg-accent text-white shadow-glow-sunset' : 'text-primary/40'}`}>
              <Briefcase size={14} /> Business
            </button>
          </div>
        </div>

        {userType !== UserType.STANDARD && (
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-primary/40 uppercase tracking-widest ml-1">Work Shift</label>
            <div className="flex gap-2 p-1 bg-white/40 backdrop-blur-md rounded-xl border border-white/40 shadow-watercolor">
              {SHIFT_OPTIONS.map(shift => (
                <button
                  key={shift.id}
                  onClick={() => toggleShift(shift.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${workShifts.includes(shift.id) ? 'bg-accent text-white shadow-glow-sunset' : 'text-primary/40'}`}
                >
                  {shift.icon} {shift.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-paper via-paper/95 to-transparent flex items-center justify-between z-10">
        <button onClick={() => setStep(2)} className="flex items-center gap-2 text-[10px] font-bold text-primary/40 uppercase tracking-widest">
          <ArrowLeft size={14} /> Back
        </button>
        <StepDots current={3} />
        <button
          onClick={() => { setErrorMsg(''); setStep(4); }}
          disabled={!name || !email || !password || password !== confirmPassword || password.length < 6}
          className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest disabled:opacity-20"
        >
          Next <ChevronRight size={14} />
        </button>
      </div>
    </motion.div>
  );

  const renderStep4 = () => (
    <motion.div
      key="step4"
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
      className="w-full space-y-8 pb-24"
    >
      <div className="text-center">
        <h1 className="text-2xl font-serif font-bold text-primary tracking-tight mb-2">Location</h1>
        <p className="text-sm text-primary/40 font-bold">Where can we find you?</p>
      </div>

      <div className="space-y-4">
        {/* Current city */}
        <div className="space-y-2 relative">
          <label className="text-[10px] font-bold text-primary/40 uppercase tracking-widest ml-1">Current City</label>
          <div className="relative">
            <MapPin size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/20" />
            <input
              type="text"
              className="w-full pl-14 pr-12 py-4 bg-white/40 backdrop-blur-md rounded-xl border border-white/40 text-lg font-bold text-primary outline-none focus:border-primary/20 transition-all shadow-watercolor placeholder:text-primary/20"
              placeholder="e.g. Valencia"
              value={city}
              onChange={e => setCity(e.target.value)}
              onBlur={() => setTimeout(() => setCitySuggestions([]), 200)}
            />
            {isSearchingCity && <Loader2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/20 animate-spin" />}
          </div>
          {citySuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-white/90 backdrop-blur-xl rounded-xl border border-white/40 shadow-ios-deep overflow-hidden animate-fade-in">
              {citySuggestions.map(s => (
                <button key={s.place_id} onClick={() => { setCity(s.description); setCitySuggestions([]); }} className="w-full px-6 py-3 text-left hover:bg-accent/5 transition-colors border-b border-black/5 last:border-0">
                  <div className="text-sm font-bold text-primary">{s.structured_formatting.main_text}</div>
                  <div className="text-[10px] text-primary/40 font-medium">{s.structured_formatting.secondary_text}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* From */}
        <div className="space-y-2 relative">
          <label className="text-[10px] font-bold text-primary/40 uppercase tracking-widest ml-1">Where are you from?</label>
          <div className="relative">
            <input
              type="text"
              className="w-full px-6 py-4 bg-white/40 backdrop-blur-md rounded-xl border border-white/40 text-lg font-bold text-primary outline-none focus:border-primary/20 transition-all shadow-watercolor placeholder:text-primary/20"
              placeholder="Hometown"
              value={from}
              onChange={e => setFrom(e.target.value)}
              onBlur={() => setTimeout(() => setFromSuggestions([]), 200)}
            />
            {isSearchingFrom && <Loader2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/20 animate-spin" />}
          </div>
          {fromSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-white/90 backdrop-blur-xl rounded-xl border border-white/40 shadow-ios-deep overflow-hidden animate-fade-in">
              {fromSuggestions.map(s => (
                <button key={s.place_id} onClick={() => { setFrom(s.description); setFromSuggestions([]); }} className="w-full px-6 py-3 text-left hover:bg-accent/5 transition-colors border-b border-black/5 last:border-0">
                  <div className="text-sm font-bold text-primary">{s.structured_formatting.main_text}</div>
                  <div className="text-[10px] text-primary/40 font-medium">{s.structured_formatting.secondary_text}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-paper via-paper/95 to-transparent flex items-center justify-between z-10">
        <button onClick={() => setStep(3)} className="flex items-center gap-2 text-[10px] font-bold text-primary/40 uppercase tracking-widest">
          <ArrowLeft size={14} /> Back
        </button>
        <StepDots current={4} />
        <button
          onClick={() => setStep(5)}
          disabled={!city}
          className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest disabled:opacity-20"
        >
          Next <ChevronRight size={14} />
        </button>
      </div>
    </motion.div>
  );

  const renderStep5 = () => {
    const filteredCountries = COUNTRY_CODES.filter(c =>
      c.name.toLowerCase().includes(countrySearch.toLowerCase()) || c.dial.includes(countrySearch)
    );

    return (
      <motion.div
        key="step5"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
        className="w-full space-y-8 pb-24"
      >
        <div className="text-center">
          <h1 className="text-2xl font-serif font-bold text-primary tracking-tight mb-2">Final Step</h1>
          <p className="text-sm text-primary/40 font-bold">Add your phone number (optional).</p>
        </div>

        {/* Error banner */}
        {errorMsg && (
          <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-500 text-center">
            {errorMsg}
          </div>
        )}

        <div className="relative space-y-4">
          <div className="flex gap-2">
            <div
              onClick={() => setIsCountrySelectorOpen(!isCountrySelectorOpen)}
              className="flex items-center gap-2 px-3 py-3 bg-white/40 backdrop-blur-md rounded-xl border border-white/40 min-w-[90px] cursor-pointer active:scale-95 transition-all shadow-watercolor"
            >
              <span className="text-lg">{selectedCountry.flag}</span>
              <span className="font-bold text-primary/60 text-sm">{selectedCountry.dial}</span>
            </div>
            <input
              type="tel"
              className="flex-1 px-4 py-3 bg-white/40 backdrop-blur-md rounded-xl border border-white/40 text-base font-bold text-primary outline-none focus:border-primary/20 transition-all shadow-watercolor placeholder:text-primary/20"
              placeholder="Phone number (optional)"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
            />
          </div>

          <AnimatePresence>
            {isCountrySelectorOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full left-0 right-0 z-[60] mt-2 bg-white/95 backdrop-blur-xl rounded-2xl border border-white/40 shadow-ios-deep overflow-hidden flex flex-col max-h-[300px]"
              >
                <div className="p-3 border-b border-black/5">
                  <input
                    type="text"
                    placeholder="Search country..."
                    className="w-full px-4 py-2 bg-black/5 rounded-lg text-xs font-bold outline-none focus:bg-black/10 transition-all"
                    value={countrySearch}
                    onChange={e => setCountrySearch(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="overflow-y-auto no-scrollbar">
                  {filteredCountries.map(country => (
                    <button
                      key={country.code}
                      onClick={() => { setSelectedCountry(country); setIsCountrySelectorOpen(false); setCountrySearch(''); }}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-accent/5 transition-colors border-b border-black/5 last:border-0"
                    >
                      <span className="text-lg">{country.flag}</span>
                      <span className="text-sm font-bold text-primary flex-1 text-left">{country.name}</span>
                      <span className="text-xs font-bold text-primary/40">{country.dial}</span>
                    </button>
                  ))}
                  {filteredCountries.length === 0 && (
                    <div className="p-8 text-center text-xs font-bold text-primary/20">No countries found</div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Complete Registration button */}
        <button
          onClick={handleRegister}
          disabled={isLoading}
          className="w-full py-4 bg-accent text-white font-bold rounded-xl text-base shadow-glow-sunset active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-40"
        >
          {isLoading ? (
            <><Loader2 size={18} className="animate-spin" /> Creating account…</>
          ) : (
            'Complete Registration'
          )}
        </button>

        <div className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-paper via-paper/95 to-transparent flex items-center justify-between z-10">
          <button onClick={() => setStep(4)} className="flex items-center gap-2 text-[10px] font-bold text-primary/40 uppercase tracking-widest">
            <ArrowLeft size={14} /> Back
          </button>
          <StepDots current={5} />
          <div className="w-10" />
        </div>
      </motion.div>
    );
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // SHELL
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 z-[500] flex flex-col font-sans overflow-hidden"
      style={{
        backgroundImage: `
          radial-gradient(at 0% 0%, rgba(255,180,200,0.4) 0, transparent 70%),
          radial-gradient(at 100% 100%, rgba(220,180,255,0.3) 0, transparent 70%)
        `,
        backgroundColor:     'rgba(253,252,248,0.9)',
        backdropFilter:      'blur(16px)',
        WebkitBackdropFilter:'blur(16px)',
      }}
    >
      {/* Header */}
      <div className="px-8 pt-8 pb-4 flex items-center justify-between shrink-0">
        {/* Toggle login/register from header */}
        {mode === 'login' ? (
          <button
            onClick={() => { setMode('register'); setStep(1); setErrorMsg(''); }}
            className="text-[10px] font-bold text-primary/40 uppercase tracking-widest"
          >
            Register
          </button>
        ) : (
          <button
            onClick={() => { setMode('login'); setErrorMsg(''); }}
            className="flex items-center gap-1 text-[10px] font-bold text-primary/40 uppercase tracking-widest"
          >
            <ArrowLeft size={12} /> Login
          </button>
        )}
        <button
          onClick={onClose}
          className="w-8 h-8 bg-white/40 backdrop-blur-md rounded-xl flex items-center justify-center text-primary/40 active:scale-90 transition-all border border-white/40 shadow-watercolor"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-8">
        <div className="max-w-md mx-auto w-full flex flex-col items-center">
          <AnimatePresence mode="wait">
            {mode === 'login' && renderLogin()}
            {mode === 'register' && step === 1 && renderStep1()}
            {mode === 'register' && step === 2 && renderStep2()}
            {mode === 'register' && step === 3 && renderStep3()}
            {mode === 'register' && step === 4 && renderStep4()}
            {mode === 'register' && step === 5 && renderStep5()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default RegistrationModal;
