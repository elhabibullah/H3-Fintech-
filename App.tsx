import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { UserProfile, Transaction, TransactionType, ChatMessage, VirtualCard } from './types';
import { Home, ArrowLeftRight, QrCode, User, MessageSquare, LogOut, Wallet, ShieldCheck, FileText, Bell, ChevronRight, CheckCircle, Smartphone, Mail, Edit2, X, Target, Save, Camera, Zap, CreditCard, Globe, Lock, Copy, Eye, EyeOff, Building2, TrendingUp, BarChart3, Settings, MapPin, SmartphoneNfc, Trash2, Menu, Plus, Check, AlertTriangle, Share2 } from 'lucide-react';

// Components
import { Button } from './components/Button';
import { Input } from './components/Input';
import { generateSupportResponse } from './services/gemini';
import { SignUpScreen, LoginScreen, CompleteProfileScreen } from './components/AuthScreens';

// --- Translations ---
const TRANSLATIONS = {
  en: {
    welcome: "Welcome Back",
    totalAssets: "Total Assets",
    transfer: "Transfer",
    receive: "Receive",
    bills: "Cards",
    recentActivity: "Recent Activity",
    viewAll: "View All",
    home: "Home",
    transact: "Transact",
    help: "Help",
    account: "Account",
    sendMoney: "Send Money",
    receiveMoney: "Receive Money",
    scanQr: "Scan QR Code",
    enterPhone: "Enter Phone Number",
    recipient: "Recipient",
    amount: "Amount",
    proceed: "Proceed to Review",
    availableBalance: "Available Balance",
    authorize: "Authorize Transfer",
    confirm: "Face ID Confirm",
    cancel: "Cancel",
    support: "H3 Assistant",
    typeInquiry: "Type your inquiry...",
    settings: "Settings",
    personalInfo: "Personal Information",
    security: "Security & FaceID",
    legal: "Legal Documents",
    language: "Language",
    logout: "Log Out",
    zakatCalc: "Zakat Calculator",
    calculate: "CALCULATE",
    payNow: "Pay Now",
    virtualCard: "Virtual Card",
    cardNumber: "Card Number",
    expiry: "Expiry",
    cvv: "CVV",
    freezeCard: "Freeze Card",
    copyDetails: "Copy Details",
    issueCard: "Issue New Card",
    noTransactions: "No transactions yet.",
    startTransacting: "Start by adding funds or making a transfer.",
    currency: "SAR",
    bankingPartner: "Banking services provided by SNB pursuant to SAMA license.",
    market: "Market",
    cards: "Cards",
    legalPageTitle: "Legal & Personal Info",
    legalName: "Legal Name",
    legalAddress: "Registered Address",
    country: "Country",
    cardDetails: "Card Details",
    unfreezeCard: "Unfreeze Card",
    cardFrozen: "Card is Frozen",
    addToWallet: "Add to Apple Wallet",
    addedToWallet: "Added to Wallet",
    city: "City",
    region: "Region/Province",
    postcode: "Postcode",
    saveChanges: "Save Changes",
    saved: "Saved Successfully",
    edit: "Edit",
    selectDesign: "Select Design",
    selectNetwork: "Select Network",
    confirmIssuance: "Issue Card",
    myCards: "My Cards",
    deleteCard: "Delete Card",
    deleteConfirmation: "This action is not revokable.",
    warning: "WARNING",
    confirmDelete: "Permanently Delete",
    insufficientFunds: "Insufficient funds",
    transferSuccess: "Transfer Successful",
    share: "Share Details",
    iban: "IBAN",
    kycVerified: "KYC Verified",
    // New Auth & Profile Translations
    signUp: "Sign Up",
    login: "Login",
    createAccount: "Create Account",
    verificationCode: "Verification Code",
    verify: "Verify",
    resendCode: "Resend Code",
    completeProfile: "Complete Profile",
    fullName: "Full Name",
    emailOptional: "Email (Optional)",
    selectLanguage: "Select Language",
    createProfile: "Create Profile",
    alreadyHaveAccount: "Already have an account?",
    dontHaveAccount: "Don't have an account?",
    sendCode: "Send Verification Code",
    enterCodeDesc: "Enter the 6-digit code sent to",
    fillProfileDesc: "Please complete your profile to continue.",
    // Mandatory Fields
    title: "Title",
    mr: "Mr",
    mrs: "Mrs",
    firstName: "First Name",
    lastName: "Last Name",
    bankName: "Bank Name",
    email: "Email",
    mobileNumber: "Mobile Number",
    municipality: "City / Municipality",
    province: "Province / Region",
    checkEmail: "Check your email",
    emailSentDesc: "We sent a verification link to",
    iHaveVerified: "I have verified my email",
    accountNotFound: "Account not found. Please Sign Up.",
    enterEmail: "Enter Email Address",
    continue: "Continue"
  },
  ar: {
    welcome: "مرحباً بعودتك",
    totalAssets: "إجمالي الأصول",
    transfer: "تحويل",
    receive: "استلام",
    bills: "بطاقاتي",
    recentActivity: "النشاط الأخير",
    viewAll: "عرض الكل",
    home: "الرئيسية",
    transact: "معاملات",
    help: "مساعدة",
    account: "حسابي",
    sendMoney: "إرسال الأموال",
    receiveMoney: "استلام الأموال",
    scanQr: "مسح الرمز",
    enterPhone: "إدخال رقم الجوال",
    recipient: "المستلم",
    amount: "المبلغ",
    proceed: "متابعة للمراجعة",
    availableBalance: "الرصيد المتاح",
    authorize: "تأكيد التحويل",
    confirm: "تأكيد بالبصمة",
    cancel: "إلغاء",
    support: "مساعد H3",
    typeInquiry: "اكتب استفسارك...",
    settings: "الإعدادات",
    personalInfo: "المعلومات الشخصية",
    security: "الأمان والبصمة",
    legal: "المستندات القانونية",
    language: "اللغة",
    logout: "تسجيل الخروج",
    zakatCalc: "حاسبة الزكاة",
    calculate: "احسب",
    payNow: "ادفع الآن",
    virtualCard: "بطاقة رقمية",
    cardNumber: "رقم البطاقة",
    expiry: "الانتهاء",
    cvv: "CVV",
    freezeCard: "تجميد البطاقة",
    copyDetails: "نسخ التفاصيل",
    issueCard: "إصدار بطاقة جديدة",
    noTransactions: "لا توجد معاملات بعد.",
    startTransacting: "ابدأ بإضافة أموال أو إجراء تحويل.",
    currency: "﷼",
    bankingPartner: "خدمات مصرفية مقدمة من البنك الأهلي السعودي بترخيص ساما.",
    market: "الأسواق",
    cards: "البطاقات",
    legalPageTitle: "المعلومات القانونية والشخصية",
    legalName: "الاسم القانوني",
    legalAddress: "العنوان المسجل",
    country: "الدولة",
    cardDetails: "تفاصيل البطاقة",
    unfreezeCard: "إلغاء التجميد",
    cardFrozen: "البطاقة مجمدة",
    addToWallet: "أضف إلى Apple Wallet",
    addedToWallet: "تمت الإضافة للمحفظة",
    city: "المدينة",
    region: "المنطقة",
    postcode: "الرمز البريدي",
    saveChanges: "حفظ التغييرات",
    saved: "تم الحفظ بنجاح",
    edit: "تعديل",
    selectDesign: "اختر التصميم",
    selectNetwork: "اختر الشبكة",
    confirmIssuance: "إصدار البطاقة",
    myCards: "بطاقاتي",
    deleteCard: "حذف البطاقة",
    deleteConfirmation: "هذا الإجراء لا يمكن التراجع عنه.",
    warning: "تحذير",
    confirmDelete: "حذف نهائي",
    insufficientFunds: "رصيد غير كافي",
    transferSuccess: "تم التحويل بنجاح",
    share: "مشاركة التفاصيل",
    iban: "الآيبان",
    kycVerified: "تم التحقق من الهوية",
    // New Auth & Profile Translations
    signUp: "تسجيل جديد",
    login: "دخول",
    createAccount: "إنشاء حساب",
    verificationCode: "رمز التحقق",
    verify: "تحقق",
    resendCode: "إعادة الإرسال",
    completeProfile: "إكمال الملف",
    fullName: "الاسم الكامل",
    emailOptional: "البريد (اختياري)",
    selectLanguage: "اختر اللغة",
    createProfile: "إنشاء الحساب",
    alreadyHaveAccount: "لديك حساب؟",
    dontHaveAccount: "ليس لديك حساب؟",
    sendCode: "إرسال الرمز",
    enterCodeDesc: "أدخل الرمز المكون من 6 أرقام المرسل إلى",
    fillProfileDesc: "يرجى إكمال بياناتك للمتابعة.",
    // Mandatory Fields
    title: "اللقب",
    mr: "سيد",
    mrs: "سيدة",
    firstName: "الاسم الأول",
    lastName: "اسم العائلة",
    bankName: "اسم البنك",
    email: "البريد الإلكتروني",
    mobileNumber: "رقم الجوال",
    municipality: "المدينة / البلدية",
    province: "المنطقة / المحافظة",
    checkEmail: "تحقق من بريدك",
    emailSentDesc: "أرسلنا رابط التحقق إلى",
    iHaveVerified: "تم التحقق من البريد",
    accountNotFound: "الحساب غير موجود. يرجى التسجيل.",
    enterEmail: "أدخل البريد الإلكتروني",
    continue: "متابعة"
  }
};

// --- Context ---
interface AppContextType {
  user: UserProfile | null;
  transactions: Transaction[];
  virtualCards: VirtualCard[];
  login: (phone: string, lang: 'en'|'ar') => void;
  logout: () => void;
  addTransaction: (t: Transaction) => void;
  updateBalance: (amount: number) => void;
  updateUser: (updatedData: Partial<UserProfile>) => void;
  addVirtualCard: (type: 'VISA' | 'MASTERCARD', color: 'SILVER' | 'BLACK' | 'GOLD') => void;
  removeVirtualCard: (id: string) => void;
  toggleCardStatus: (id: string) => void;
  t: typeof TRANSLATIONS.en;
  lang: 'en' | 'ar';
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [virtualCards, setVirtualCards] = useState<VirtualCard[]>([]);

  // Initialize persistence
  useEffect(() => {
     const storedUser = localStorage.getItem('h3_active_user');
     
     if (storedUser) {
         try {
             const u = JSON.parse(storedUser);
             // Ensure schema migration by merging with defaults if fields are missing
             const defaults = {
                address: 'Omar ibn Khattab Street',
                city: 'Madinat an-Nabi',
                region: 'Madinah',
                postcode: '42312',
                country: 'Saudi Arabia',
                title: 'Mr',
                firstName: 'Abdelwahid',
                lastName: 'Hashim',
                bankName: 'SNB',
                iban: 'SA42100000001234567890'
             };
             const migratedUser = { ...defaults, ...u };
             setUser(migratedUser);
             
             const cards = localStorage.getItem(`h3_cards_${u.phoneNumber}`);
             if (cards) setVirtualCards(JSON.parse(cards));
         } catch (e) {
             console.error("Data corruption detected, resetting user", e);
             localStorage.removeItem('h3_active_user');
         }
     }
  }, []);

  const normalizePhone = (p: string) => p.replace(/\D/g, '');

  const login = (rawPhone: string, initialLang: 'en' | 'ar') => {
    const phone = normalizePhone(rawPhone);
    const dbKey = `h3_db_${phone}`;
    const existingProfile = localStorage.getItem(dbKey);

    if (existingProfile) {
        const parsed = JSON.parse(existingProfile);
        parsed.language = initialLang;
        // Migration check for legacy data
        if (!parsed.address) parsed.address = 'Omar ibn Khattab Street';
        if (!parsed.city) parsed.city = 'Madinat an-Nabi';
        if (!parsed.country) parsed.country = 'Saudi Arabia';
        
        setUser(parsed);
        localStorage.setItem('h3_active_user', JSON.stringify(parsed));
        setTransactions([]);
        const cards = localStorage.getItem(`h3_cards_${parsed.phoneNumber}`);
        if (cards) setVirtualCards(JSON.parse(cards));
        return;
    }

    const newUser: UserProfile = {
      title: 'Mr',
      firstName: 'Abdelwahid',
      lastName: 'Hashim',
      name: 'Abdelwahid Habibullah Adam Banu Hashim', 
      email: 'elhabibullah@gmail.com',
      phoneNumber: rawPhone,
      kycVerified: true,
      biometricEnabled: false,
      balance: 0.00,
      currency: 'SAR',
      language: initialLang,
      address: 'Omar ibn Khattab Street',
      city: 'Madinat an-Nabi',
      region: 'Madinah',
      postcode: '42312',
      country: 'Saudi Arabia',
      bankName: 'SNB',
      iban: 'SA0000000000000000000000'
    };
    
    setUser(newUser);
    localStorage.setItem('h3_active_user', JSON.stringify(newUser));
    localStorage.setItem(dbKey, JSON.stringify(newUser));
    setTransactions([]);
    setVirtualCards([]);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('h3_active_user');
  };

  const addTransaction = (t: Transaction) => {
    setTransactions(prev => [t, ...prev]);
  };

  const updateBalance = (amount: number) => {
    if (user) {
      const updatedUser = { ...user, balance: user.balance + amount };
      setUser(updatedUser);
      localStorage.setItem('h3_active_user', JSON.stringify(updatedUser));
      const phoneKey = normalizePhone(user.phoneNumber);
      localStorage.setItem(`h3_db_${phoneKey}`, JSON.stringify(updatedUser));
    }
  };

  const updateUser = (updatedData: Partial<UserProfile>) => {
    setUser((prevUser) => {
        if (!prevUser) return null;
        const newUser = { ...prevUser, ...updatedData };
        localStorage.setItem('h3_active_user', JSON.stringify(newUser));
        const phoneKey = normalizePhone(newUser.phoneNumber);
        localStorage.setItem(`h3_db_${phoneKey}`, JSON.stringify(newUser));
        return newUser;
    });
  };

  const addVirtualCard = (type: 'VISA' | 'MASTERCARD', color: 'SILVER' | 'BLACK' | 'GOLD') => {
      if (!user) return;
      const prefix = type === 'VISA' ? '4' : '5';
      const newCard: VirtualCard = {
          id: Date.now().toString(),
          cardNumber: `${prefix}${Math.floor(Math.random() * 1000000000000000).toString().padEnd(15, '0')}`,
          expiry: `${Math.floor(Math.random() * 12) + 1}/${Math.floor(Math.random() * 5) + 26}`,
          cvv: Math.floor(Math.random() * 900 + 100).toString(),
          holderName: user.name.toUpperCase(),
          type: type,
          status: 'ACTIVE',
          color: color
      };
      const updatedCards = [...virtualCards, newCard];
      setVirtualCards(updatedCards);
      localStorage.setItem(`h3_cards_${user.phoneNumber}`, JSON.stringify(updatedCards));
  };

  const removeVirtualCard = (id: string) => {
      if (!user) return;
      const updatedCards = virtualCards.filter(c => c.id !== id);
      setVirtualCards(updatedCards);
      localStorage.setItem(`h3_cards_${user.phoneNumber}`, JSON.stringify(updatedCards));
  };

  const toggleCardStatus = (id: string) => {
      if (!user) return;
      const updatedCards = virtualCards.map(c => 
          c.id === id ? { ...c, status: c.status === 'ACTIVE' ? 'FROZEN' : 'ACTIVE' as 'ACTIVE' | 'FROZEN' } : c
      );
      setVirtualCards(updatedCards);
      localStorage.setItem(`h3_cards_${user.phoneNumber}`, JSON.stringify(updatedCards));
  };

  const lang = user?.language || 'en';
  const t = TRANSLATIONS[lang];

  return (
    <AppContext.Provider value={{ user, transactions, virtualCards, login, logout, addTransaction, updateBalance, updateUser, addVirtualCard, removeVirtualCard, toggleCardStatus, t, lang }}>
      <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className="h-full w-full">
        {children}
      </div>
    </AppContext.Provider>
  );
};

// --- Styles Utilities ---
const textMetal = "bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-200 to-slate-400 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]";

// --- Custom Chrome Card Component ---
const ChromeCard: React.FC<{ children: React.ReactNode; className?: string; rounded?: string }> = ({ children, className = "", rounded = "rounded-3xl" }) => {
  let innerRounded = "rounded-[21px]"; 
  if (rounded === "rounded-[2rem]") innerRounded = "rounded-[30px]";
  if (rounded === "rounded-2xl") innerRounded = "rounded-[14px]";
  if (rounded === "rounded-xl") innerRounded = "rounded-[10px]";

  return (
    <div className={`relative p-[2px] bg-gradient-to-b from-white via-slate-300 to-slate-500 shadow-[0_0_20px_rgba(255,255,255,0.15)] ${rounded} ${className}`}>
      <div className={`absolute inset-0 bg-gradient-to-tr from-transparent via-white/80 to-transparent opacity-20 pointer-events-none ${rounded}`}></div>
      <div className={`relative w-full bg-zinc-950 ${innerRounded} overflow-hidden`}>
        {children}
      </div>
    </div>
  );
};

const LinkButton: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => {
  const navigate = useNavigate();
  return (
    <button 
      onClick={() => navigate(to)}
      className="flex flex-col items-center justify-center p-4 rounded-2xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-slate-600 transition-all active:scale-95 group h-24"
    >
      <div className="text-emerald-500 group-hover:text-emerald-400 transition-colors mb-2">{icon}</div>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-white transition-colors">{label}</span>
    </button>
  );
};

// --- Helper Components ---

const VisaLogo: React.FC<{ className?: string }> = ({ className = "h-8" }) => (
    <svg viewBox="0 0 100 32" className={className} fill="currentColor">
        <path d="M34.3 1.2L24.1 27h6.4l2.1-5.7h7.9l1.2 5.7h5.8L38.9 1.2h-4.6zm-1.8 17.5l2.6-7.3 1.5 7.3h-4.1zM64.6 17c.2-4.1-6-4.3-5.9-6.9.1-1.8 1.9-2.5 3.6-2.6 1.3-.1 3.5.2 4.6.7l.8-5.3c-1.1-.4-3-.8-5.2-.8-5.6 0-9.5 2.9-9.6 7.1-.1 3.1 2.8 4.8 4.9 5.8 2.2 1 2.9 1.7 2.9 2.6 0 1.4-1.7 2-3.3 2-2.2 0-4.9-.7-5.9-1.2l-.8 5.6c1.4.6 3.9 1.1 6.5 1.1 6.1 0 10.1-2.9 10.1-7.3M78.6 1.2l-6 25.8h5.9l6-25.8h-5.9zM15.4 1.2H9.5L1.3 25.4c-.2.6.4 1.1 1 1.1h6.2c.9 0 1.6-.5 1.9-1.2l6.8-24.1z" />
    </svg>
);

const MastercardLogo: React.FC<{ className?: string }> = ({ className = "h-8" }) => (
    <div className={`flex items-center ${className}`}>
        <div className="w-8 h-8 rounded-full bg-red-600/90 mix-blend-screen -mr-4"></div>
        <div className="w-8 h-8 rounded-full bg-yellow-500/90 mix-blend-screen"></div>
    </div>
);

const CardVisual: React.FC<{ card: VirtualCard; showDetails?: boolean }> = ({ card, showDetails = true }) => {
    // Styles mapping
    const styles = {
        SILVER: "bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 text-slate-800",
        BLACK: "bg-gradient-to-br from-zinc-800 via-zinc-900 to-black text-white border border-white/10",
        GOLD: "bg-gradient-to-br from-[#FCEabb] via-[#f8b500] to-[#f8b500] text-amber-950"
    };

    const textColor = card.color === 'BLACK' ? 'text-white' : (card.color === 'GOLD' ? 'text-amber-950' : 'text-slate-800');
    const labelColor = card.color === 'BLACK' ? 'text-slate-400' : (card.color === 'GOLD' ? 'text-amber-800/70' : 'text-slate-600');

    return (
        <div className={`relative aspect-[1.586] w-full rounded-2xl overflow-hidden shadow-2xl p-6 flex flex-col justify-between ${styles[card.color]} ${card.status === 'FROZEN' ? 'grayscale opacity-70' : ''}`}>
             {/* Shine/Texture */}
             <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent opacity-40 pointer-events-none"></div>
             {card.color === 'BLACK' && <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>}

             <div className="relative z-10 flex justify-between items-start">
                 <div className="flex items-center gap-2">
                     <span className={`font-bold italic text-lg tracking-widest ${textColor}`}>H3</span>
                     <div className={`text-[10px] border px-1.5 rounded ${card.color === 'BLACK' ? 'border-slate-600' : 'border-current'} ${labelColor} font-mono`}>VIRTUAL</div>
                 </div>
                 {/* Contactless Symbol */}
                 <div className={textColor}>
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 4 3.5 6 6"/>
                        <path d="M15.09 14c.18-.46.3-.9.3-1.5a6 6 0 0 0-4-5.65" opacity="0.5"/>
                        <path d="M1.9 14c.2-.7.6-1.3 1.1-1.8a10 10 0 0 1 12.3-1.6" opacity="0.3"/>
                     </svg>
                 </div>
             </div>

             <div className="relative z-10 flex flex-col gap-5">
                 {/* Chip */}
                 <div className="w-10 h-8 bg-yellow-200/80 rounded-md border border-yellow-400/50 flex flex-col justify-center items-center overflow-hidden relative shadow-inner">
                     <div className="absolute w-[1px] h-full bg-yellow-600/50 left-1/3"></div>
                     <div className="absolute w-[1px] h-full bg-yellow-600/50 right-1/3"></div>
                     <div className="absolute h-[1px] w-full bg-yellow-600/50 top-1/3"></div>
                     <div className="absolute h-[1px] w-full bg-yellow-600/50 bottom-1/3"></div>
                 </div>

                 {/* Number */}
                 <div className={`font-mono text-xl sm:text-2xl tracking-widest drop-shadow-sm ${textColor}`} dir="ltr">
                     {showDetails ? card.cardNumber.match(/.{1,4}/g)?.join(' ') : `•••• •••• •••• ${card.cardNumber.slice(-4)}`}
                 </div>
             </div>

             <div className="relative z-10 flex justify-between items-end">
                 <div className="flex flex-col gap-1">
                     <p className={`font-mono text-xs sm:text-sm uppercase tracking-widest truncate max-w-[150px] ${textColor}`}>{card.holderName}</p>
                     <div className="flex gap-6 mt-1">
                         <div>
                             <p className={`text-[7px] uppercase tracking-widest mb-0.5 ${labelColor}`}>Expiry</p>
                             <p className={`font-mono text-xs sm:text-sm ${textColor}`}>{card.expiry}</p>
                         </div>
                         <div>
                             <p className={`text-[7px] uppercase tracking-widest mb-0.5 ${labelColor}`}>CVV</p>
                             <p className={`font-mono text-xs sm:text-sm ${textColor}`}>{showDetails ? card.cvv : '•••'}</p>
                         </div>
                     </div>
                 </div>
                 <div className={`${textColor} drop-shadow-md`}>
                     {card.type === 'VISA' ? <VisaLogo /> : <MastercardLogo />}
                 </div>
             </div>
        </div>
    );
};

// --- Bottom Navigation ---
const BottomNav: React.FC = () => {
    const { t } = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="fixed bottom-6 left-6 right-6 z-40">
           {/* Glassmorphism Float Bar */}
           <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-3xl p-2 shadow-2xl flex justify-between items-center px-6 h-16 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
              
              <button onClick={() => navigate('/')} className={`flex flex-col items-center justify-center gap-1 w-12 transition-all ${isActive('/') ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}>
                  <Home size={20} />
              </button>

              <button onClick={() => navigate('/transfer')} className={`flex flex-col items-center justify-center gap-1 w-12 transition-all ${isActive('/transfer') ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}>
                  <ArrowLeftRight size={20} />
              </button>
              
              <button onClick={() => navigate('/cards')} className={`flex flex-col items-center justify-center gap-1 w-12 transition-all ${isActive('/cards') ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}>
                  <CreditCard size={20} />
              </button>

              <button onClick={() => navigate('/legal')} className={`flex flex-col items-center justify-center gap-1 w-12 transition-all ${isActive('/legal') ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}>
                  <Settings size={20} />
              </button>
           </div>
        </div>
    );
};

// --- Screens ---

const IntroScreen: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  return (
    <div className="fixed inset-0 h-full w-full bg-black overflow-hidden z-50 flex flex-col items-center justify-center" dir="ltr">
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-100"
      >
        <source src="https://fit-4rce-x.s3.eu-north-1.amazonaws.com/Metaball_siver_bl_bg.mp4" type="video/mp4" />
      </video>

      <div className="absolute top-8 left-0 w-full px-6 text-center z-20">
         <h1 className={`text-5xl font-extralight tracking-[0.2em] uppercase text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] mb-2`}>
            H3
         </h1>
         <p className={`text-xs font-semibold tracking-[0.4em] uppercase text-slate-300`}>
            Your World. Your Wealth.
         </p>
         <p className="text-slate-500 text-[9px] tracking-[0.6em] uppercase mt-3">Fintech • Digital Wallet</p>
      </div>

      <div className="absolute bottom-12 left-0 w-full flex flex-col items-center z-20">
        <button 
          onClick={onStart}
          className="group relative w-16 h-16 rounded-full flex items-center justify-center transition-transform duration-500 active:scale-90"
          aria-label="Enter App"
        >
           <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]">
              <defs>
                <linearGradient id="alum-shine" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#cbd5e1" />
                  <stop offset="25%" stopColor="#ffffff" />
                  <stop offset="50%" stopColor="#94a3b8" />
                  <stop offset="52%" stopColor="#e2e8f0" />
                  <stop offset="100%" stopColor="#ffffff" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="46" stroke="url(#alum-shine)" strokeWidth="0.5" fill="none" className="opacity-90" />
              <circle cx="50" cy="50" r="38" stroke="url(#alum-shine)" strokeWidth="2.5" fill="none" className="group-hover:stroke-[3px] transition-all duration-300" />
              <circle cx="50" cy="50" r="24" stroke="url(#alum-shine)" strokeWidth="1.5" fill="none" />
              <circle cx="50" cy="50" r="5" fill="url(#alum-shine)" className="shadow-[0_0_15px_white]" />
              <line x1="50" y1="2" x2="50" y2="12" stroke="url(#alum-shine)" strokeWidth="2" />
              <line x1="50" y1="88" x2="50" y2="98" stroke="url(#alum-shine)" strokeWidth="2" />
              <line x1="2" y1="50" x2="12" y2="50" stroke="url(#alum-shine)" strokeWidth="2" />
              <line x1="88" y1="50" x2="98" y2="50" stroke="url(#alum-shine)" strokeWidth="2" />
           </svg>
        </button>
      </div>
    </div>
  );
};

const AuthScreen: React.FC = () => {
    const { login, t } = useAppContext();
    const [phone, setPhone] = useState('');
    const [lang, setLang] = useState<'en' | 'ar'>('en');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if(phone.length < 8) return;
        setLoading(true);
        setTimeout(() => login(phone, lang), 1500);
    };

    return (
        <div className="h-[100dvh] bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
             <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-emerald-900/20 to-transparent pointer-events-none"></div>
             
             <div className="w-full max-w-sm relative z-10">
                 <div className="text-center mb-12">
                     <h1 className="text-6xl font-black italic text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-500 tracking-tighter mb-4">H3</h1>
                     <p className="text-slate-400 text-xs uppercase tracking-widest">Neobank of the Future</p>
                 </div>

                 <ChromeCard>
                     <div className="p-8">
                         <div className="flex justify-center gap-4 mb-8">
                             <button onClick={() => setLang('en')} className={`text-xs font-bold tracking-widest transition-colors ${lang === 'en' ? 'text-white' : 'text-slate-600'}`}>EN</button>
                             <div className="w-[1px] h-4 bg-slate-700"></div>
                             <button onClick={() => setLang('ar')} className={`text-xs font-bold tracking-widest transition-colors ${lang === 'ar' ? 'text-white' : 'text-slate-600'}`}>AR</button>
                         </div>

                         <form onSubmit={handleLogin} className="space-y-6">
                             <Input 
                                label={t.enterPhone}
                                placeholder="+966 5X XXX XXXX"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="text-center font-mono"
                             />
                             <Button type="submit" variant="primary" isLoading={loading}>
                                 {t.proceed}
                             </Button>
                         </form>
                     </div>
                 </ChromeCard>
                 
                 <div className="mt-8 text-center space-y-4">
                    <p className="text-center text-[10px] text-slate-600 mt-8 max-w-[200px] mx-auto leading-relaxed">
                        {t.bankingPartner}
                    </p>
                    {/* Minimal addition for Auth Flow navigation */}
                    <button onClick={() => navigate('/signup')} className="text-xs text-emerald-500/80 hover:text-emerald-400 uppercase tracking-widest transition-colors">
                        {t.dontHaveAccount} {t.signUp}
                    </button>
                 </div>
             </div>
        </div>
    );
};

const DashboardScreen: React.FC = () => {
    // ... (No Changes to Logic, just reuse existing)
    const { user, transactions, t, lang } = useAppContext();
    const navigate = useNavigate();
    // Chat State
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [chatInput, setChatInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    useEffect(scrollToBottom, [messages, isChatOpen]);
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim()) return;
        const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: chatInput, timestamp: Date.now() };
        setMessages(prev => [...prev, userMsg]);
        setChatInput('');
        setIsTyping(true);
        const history = messages.map(m => ({ role: m.role, parts: [{ text: m.text }] }));
        const responseText = await generateSupportResponse(userMsg.text, history);
        const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: responseText, timestamp: Date.now() };
        setMessages(prev => [...prev, aiMsg]);
        setIsTyping(false);
    };

    return (
        <div className="h-[100dvh] bg-black flex flex-col relative overflow-hidden">
             {/* Background Ambience */}
             <div className="absolute top-[-20%] right-[-20%] w-[500px] h-[500px] bg-emerald-900/20 rounded-full blur-[100px] pointer-events-none"></div>
             {/* Header */}
             <div className="px-6 pt-8 pb-4 flex justify-between items-center relative z-10">
                 <div>
                     <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">{t.welcome}</p>
                     <h2 className={`text-xl font-medium truncate max-w-[200px] ${textMetal}`}>{user?.name}</h2>
                 </div>
                 <div 
                    className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-slate-400 overflow-hidden cursor-pointer hover:border-emerald-500/50 transition-colors"
                    onClick={() => navigate('/legal')} 
                 >
                     {user?.profileImage ? ( <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" /> ) : ( <User size={18} /> )}
                 </div>
             </div>
             <div className="flex-1 overflow-y-auto px-6 pb-24 relative z-10 scrollbar-hide">
                 <ChromeCard className="mb-8" rounded="rounded-[2rem]">
                     <div className="p-6 relative overflow-hidden group">
                         <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                             <div className="px-2 py-1 rounded border border-emerald-500/30 bg-emerald-900/10 text-[10px] text-emerald-400 uppercase tracking-wider">Active</div>
                         </div>
                         <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em] mb-2">{t.totalAssets}</p>
                         <h1 className="text-4xl font-light text-white mb-6 font-mono tracking-tighter">
                             {user?.currency} <span className="font-bold">{user?.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                         </h1>
                         <div className="flex gap-3">
                             <Button onClick={() => navigate('/transfer')} className="flex-1 h-12 text-xs" variant="primary"> <ArrowLeftRight size={16} /> {t.transfer} </Button>
                             <Button onClick={() => navigate('/receive')} className="flex-1 h-12 text-xs" variant="secondary"> <QrCode size={16} /> {t.receive} </Button>
                         </div>
                     </div>
                 </ChromeCard>
                 <div className="grid grid-cols-4 gap-3 mb-8">
                     <LinkButton to="/transfer" icon={<ArrowLeftRight size={24}/>} label={t.transfer} />
                     <LinkButton to="/cards" icon={<CreditCard size={24}/>} label={t.cards} />
                     <LinkButton to="/receive" icon={<QrCode size={24}/>} label={t.receive} />
                     <LinkButton to="/legal" icon={<User size={24}/>} label={t.account} />
                 </div>
                 <div className="mb-8">
                     <div className="flex justify-between items-center mb-4">
                         <h3 className={`text-sm font-bold uppercase tracking-widest ${textMetal}`}>{t.recentActivity}</h3>
                         <button className="text-[10px] text-emerald-500 uppercase tracking-widest hover:text-emerald-400">{t.viewAll}</button>
                     </div>
                     <div className="space-y-3">
                         {transactions.length === 0 ? (
                             <div className="p-8 rounded-2xl border border-dashed border-zinc-800 text-center">
                                 <p className="text-slate-500 text-xs">{t.noTransactions}</p>
                             </div>
                         ) : (
                             transactions.slice(0, 5).map(tx => (
                                 <div key={tx.id} className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-800 hover:border-zinc-700 transition-all">
                                     <div className="flex items-center gap-4">
                                         <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.amount > 0 ? 'bg-emerald-900/20 text-emerald-500' : 'bg-zinc-800 text-slate-400'}`}>
                                             {tx.amount > 0 ? <ArrowLeftRight className="rotate-45" size={18} /> : <ArrowLeftRight className="-rotate-45" size={18} />}
                                         </div>
                                         <div>
                                             <p className="text-white text-sm font-medium">{tx.description || tx.type}</p>
                                             <p className="text-slate-500 text-xs">{tx.date}</p>
                                         </div>
                                     </div>
                                     <span className={`text-sm font-mono font-bold ${tx.amount > 0 ? 'text-emerald-400' : 'text-slate-200'}`}>
                                         {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}
                                     </span>
                                 </div>
                             ))
                         )}
                     </div>
                 </div>
             </div>
             <button onClick={() => setIsChatOpen(true)} className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center text-white z-30 hover:scale-110 transition-transform active:scale-95"> <MessageSquare size={24} fill="currentColor" /> </button>
             {isChatOpen && (
                 <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setIsChatOpen(false)}>
                     <div className="w-full h-[85vh] sm:h-[600px] sm:max-w-md bg-zinc-950 border border-zinc-800 rounded-t-3xl sm:rounded-3xl flex flex-col shadow-2xl animate-in slide-in-from-bottom-20 duration-300" onClick={e => e.stopPropagation()}>
                         <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50 rounded-t-3xl">
                             <div className="flex items-center gap-3"> <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div> <span className="font-bold text-slate-200 tracking-wide">{t.support}</span> </div>
                             <button onClick={() => setIsChatOpen(false)} className="p-2 text-slate-500 hover:text-white"><X size={20}/></button>
                         </div>
                         <div className="flex-1 overflow-y-auto p-4 space-y-4">
                             {messages.length === 0 && ( <div className="text-center py-12 text-slate-600"> <MessageSquare size={48} className="mx-auto mb-4 opacity-20" /> <p className="text-sm">How can Hura help you today?</p> </div> )}
                             {messages.map(msg => (
                                 <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                     <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${ msg.role === 'user' ? 'bg-emerald-900/30 text-emerald-100 rounded-tr-sm border border-emerald-500/20' : 'bg-zinc-800 text-slate-200 rounded-tl-sm border border-zinc-700' }`}> {msg.text} </div>
                                 </div>
                             ))}
                             {isTyping && ( <div className="flex justify-start"> <div className="bg-zinc-800 p-3 rounded-2xl rounded-tl-sm border border-zinc-700 flex gap-1"> <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div> <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-100"></div> <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-200"></div> </div> </div> )}
                             <div ref={messagesEndRef} />
                         </div>
                         <div className="p-4 border-t border-zinc-800 bg-zinc-900/50 rounded-b-3xl">
                             <form onSubmit={handleSendMessage} className="flex gap-2">
                                 <input className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors" placeholder={t.typeInquiry} value={chatInput} onChange={e => setChatInput(e.target.value)} />
                                 <button type="submit" disabled={!chatInput.trim() || isTyping} className="p-3 bg-emerald-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-500 transition-colors"> <ChevronRight size={20} /> </button>
                             </form>
                         </div>
                     </div>
                 </div>
             )}
             <BottomNav />
        </div>
    );
};

// ... (Rest of screens like LegalProfileScreen, EditProfileScreen, CardsScreen, TransferScreen, ReceiveScreen, etc.)
// Re-exporting App logic properly as before
const LegalProfileScreen: React.FC = () => { /* ... existing code ... */ const { user, logout, t, lang } = useAppContext(); const navigate = useNavigate(); return ( <div className="h-[100dvh] bg-black flex flex-col relative"> <div className="flex items-center justify-between mb-6 pt-8 px-6"> <div className="flex items-center gap-4"> <button onClick={() => navigate('/')} className={`p-2 bg-zinc-900 rounded-full text-slate-400 hover:text-white transition-colors border border-slate-800`}> <ArrowLeftRight size={20} className="rotate-180 rtl:rotate-0" /> </button> <h1 className={`text-lg font-medium tracking-wide ${textMetal}`}>{t.legalPageTitle}</h1> </div> <button onClick={() => navigate('/edit-profile')} className="text-emerald-500 text-sm font-bold tracking-wider uppercase hover:text-emerald-400">{t.edit}</button> </div> <div className="flex-1 overflow-y-auto px-6 pb-32"> <ChromeCard className="mb-6"> <div className="p-6"> <div className="flex items-center gap-4 mb-6"> <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center text-slate-400 border border-zinc-700"> {user?.profileImage ? ( <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover rounded-full" /> ) : ( <User size={32} /> )} </div> <div> <h2 className="text-lg font-bold text-white mb-1">{user?.name}</h2> <p className="text-xs text-slate-500 font-mono">{user?.phoneNumber}</p> </div> </div> <div className="grid grid-cols-1 gap-4 border-t border-zinc-800/50 pt-4"> <div> <p className="text-[10px] uppercase text-slate-500 tracking-widest mb-1">{t.legalName}</p> <p className="text-sm text-slate-300">{user?.name}</p> </div> <div> <p className="text-[10px] uppercase text-slate-500 tracking-widest mb-1">{t.legalAddress}</p> <p className="text-sm text-slate-300 leading-relaxed"> {user?.address}<br/> {user?.city}, {user?.region}<br/> {user?.postcode}, {user?.country} </p> </div> </div> </div> </ChromeCard> <div className="space-y-2"> <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex justify-between items-center"> <div className="flex items-center gap-3"> <ShieldCheck size={20} className="text-emerald-500" /> <span className="text-sm font-medium text-slate-300">{t.kycVerified}</span> </div> <CheckCircle size={16} className="text-emerald-500" /> </div> <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex justify-between items-center opacity-50"> <div className="flex items-center gap-3"> <SmartphoneNfc size={20} className="text-slate-500" /> <span className="text-sm font-medium text-slate-300">{t.addToWallet}</span> </div> <ChevronRight size={16} className="text-slate-600" /> </div> <div className="mt-8"> <Button variant="danger" onClick={logout} className="h-12 text-xs"> <LogOut size={16} /> {t.logout} </Button> </div> </div> </div> <BottomNav /> </div> ); };
const EditProfileScreen: React.FC = () => { /* ... existing code ... */ const { user, updateUser, t } = useAppContext(); const navigate = useNavigate(); const [formData, setFormData] = useState({ name: user?.name || '', email: user?.email || '', address: user?.address || '', city: user?.city || '', region: user?.region || '', country: user?.country || '', postcode: user?.postcode || '' }); const [loading, setLoading] = useState(false); const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { setFormData(prev => ({ ...prev, [e.target.name]: e.target.value })); }; const handleSave = () => { setLoading(true); setTimeout(() => { updateUser(formData); setLoading(false); navigate(-1); }, 1000); }; return ( <div className="h-[100dvh] bg-black flex flex-col relative"> <div className="flex items-center gap-4 mb-6 pt-8 px-6"> <button onClick={() => navigate(-1)} className={`p-2 bg-zinc-900 rounded-full text-slate-400 hover:text-white transition-colors border border-slate-800`}> <ArrowLeftRight size={20} className="rotate-180 rtl:rotate-0" /> </button> <h1 className={`text-lg font-medium tracking-wide ${textMetal}`}>{t.edit} {t.personalInfo}</h1> </div> <div className="flex-1 overflow-y-auto px-6 pb-24"> <ChromeCard> <div className="p-6 space-y-6"> <Input label={t.legalName} name="name" value={formData.name} onChange={handleChange} /> <Input label="Email" name="email" value={formData.email} onChange={handleChange} /> <div className="h-[1px] bg-zinc-800/50 my-2"></div> <Input label={t.legalAddress} name="address" value={formData.address} onChange={handleChange} /> <div className="grid grid-cols-2 gap-4"> <Input label={t.city} name="city" value={formData.city} onChange={handleChange} /> <Input label={t.postcode} name="postcode" value={formData.postcode} onChange={handleChange} /> </div> <Input label={t.region} name="region" value={formData.region} onChange={handleChange} /> <Input label={t.country} name="country" value={formData.country} onChange={handleChange} /> </div> </ChromeCard> <div className="mt-6"> <Button onClick={handleSave} isLoading={loading} variant="mercury"> <Save size={18} /> {t.saveChanges} </Button> </div> </div> </div> ); };
const CardsScreen: React.FC = () => { /* ... existing code ... */ const { user, virtualCards, addVirtualCard, removeVirtualCard, toggleCardStatus, t, lang } = useAppContext(); const navigate = useNavigate(); const [isCreating, setIsCreating] = useState(false); const [newNetwork, setNewNetwork] = useState<'VISA' | 'MASTERCARD'>('VISA'); const [newDesign, setNewDesign] = useState<'SILVER' | 'BLACK' | 'GOLD'>('BLACK'); const [loading, setLoading] = useState(false); const [settingsCardId, setSettingsCardId] = useState<string | null>(null); const [showDeleteWarning, setShowDeleteWarning] = useState(false); const handleIssueCard = () => { setLoading(true); setTimeout(() => { addVirtualCard(newNetwork, newDesign); setLoading(false); setIsCreating(false); }, 1500); }; const handleDeleteCard = () => { if (settingsCardId) { removeVirtualCard(settingsCardId); setSettingsCardId(null); setShowDeleteWarning(false); } }; const previewCard: VirtualCard = { id: 'preview', cardNumber: newNetwork === 'VISA' ? '4000123456789010' : '5000123456789010', expiry: '12/28', cvv: '123', holderName: user?.name.toUpperCase() || 'YOUR NAME', type: newNetwork, status: 'ACTIVE', color: newDesign }; return ( <div className="h-[100dvh] bg-black flex flex-col relative"> <div className="flex items-center justify-between mb-6 pt-8 px-6"> <div className="flex items-center gap-4"> <button onClick={() => navigate('/')} className={`p-2 bg-zinc-900 rounded-full text-slate-400 hover:text-white transition-colors border border-slate-800`}> <ArrowLeftRight size={20} className="rotate-180 rtl:rotate-0" /> </button> <h1 className={`text-lg font-medium tracking-wide ${textMetal}`}>{isCreating ? t.issueCard : t.myCards}</h1> </div> {!isCreating && ( <button onClick={() => setIsCreating(true)} className="p-2 bg-emerald-900/30 text-emerald-500 rounded-full border border-emerald-500/30 hover:bg-emerald-900/50 transition-colors"> <Plus size={20} /> </button> )} </div> <div className="flex-1 overflow-y-auto px-6 pb-32"> {isCreating ? ( <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"> <div> <div className="mb-4 flex justify-center"> <div className="w-full max-w-[340px]"> <CardVisual card={previewCard} showDetails={false} /> </div> </div> <p className="text-center text-xs text-slate-500 uppercase tracking-widest">Card Preview</p> </div> <div className="space-y-3"> <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">{t.selectNetwork}</label> <div className="grid grid-cols-2 gap-4"> <button onClick={() => setNewNetwork('VISA')} className={`p-4 rounded-xl border flex items-center justify-center transition-all h-16 ${newNetwork === 'VISA' ? 'bg-zinc-800 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.15)]' : 'bg-zinc-900 border-zinc-800 opacity-50'}`}> <VisaLogo className="h-6 text-white" /> </button> <button onClick={() => setNewNetwork('MASTERCARD')} className={`p-4 rounded-xl border flex items-center justify-center transition-all h-16 ${newNetwork === 'MASTERCARD' ? 'bg-zinc-800 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.15)]' : 'bg-zinc-900 border-zinc-800 opacity-50'}`}> <MastercardLogo className="h-8" /> </button> </div> </div> <div className="space-y-3"> <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">{t.selectDesign}</label> <div className="grid grid-cols-3 gap-3"> <button onClick={() => setNewDesign('SILVER')} className={`relative h-20 rounded-xl overflow-hidden border transition-all ${newDesign === 'SILVER' ? 'border-emerald-500 scale-105' : 'border-transparent opacity-60'}`}> <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-400"></div> <span className="relative z-10 text-[10px] font-bold text-slate-800 p-2 block">Silver</span> </button> <button onClick={() => setNewDesign('BLACK')} className={`relative h-20 rounded-xl overflow-hidden border transition-all ${newDesign === 'BLACK' ? 'border-emerald-500 scale-105' : 'border-transparent opacity-60'}`}> <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-black"></div> <span className="relative z-10 text-[10px] font-bold text-white p-2 block">Midnight</span> </button> <button onClick={() => setNewDesign('GOLD')} className={`relative h-20 rounded-xl overflow-hidden border transition-all ${newDesign === 'GOLD' ? 'border-emerald-500 scale-105' : 'border-transparent opacity-60'}`}> <div className="absolute inset-0 bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600"></div> <span className="relative z-10 text-[10px] font-bold text-amber-900 p-2 block">Gold</span> </button> </div> </div> <div className="pt-4"> <Button onClick={handleIssueCard} isLoading={loading} variant="mercury"> {t.confirmIssuance} </Button> </div> </div> ) : ( <div className="space-y-6"> {virtualCards.length === 0 ? ( <div className="text-center py-20 opacity-50"> <CreditCard size={48} className="mx-auto mb-4 text-slate-600" strokeWidth={1} /> <p className="text-slate-400">No cards found.</p> <Button className="mt-6 w-auto mx-auto" variant="ghost" onClick={() => setIsCreating(true)}>Create your first card</Button> </div> ) : ( virtualCards.map((card) => ( <div key={card.id} className="group relative"> <CardVisual card={card} /> <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide"> <button onClick={() => toggleCardStatus(card.id)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium border transition-colors whitespace-nowrap ${card.status === 'FROZEN' ? 'bg-emerald-900/20 text-emerald-400 border-emerald-500/30' : 'bg-zinc-900 text-slate-300 border-zinc-700'}`}> {card.status === 'FROZEN' ? <Lock size={12} /> : <Lock size={12} />} {card.status === 'FROZEN' ? t.unfreezeCard : t.freezeCard} </button> <button onClick={() => setSettingsCardId(card.id)} className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium bg-zinc-900 text-slate-300 border border-zinc-700 hover:text-white transition-colors whitespace-nowrap"> <Settings size={12} /> {t.settings} </button> </div> </div> )) )} </div> )} </div> <BottomNav /> {settingsCardId && ( <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => { setSettingsCardId(null); setShowDeleteWarning(false); }}> <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-t-3xl sm:rounded-3xl p-6 animate-in slide-in-from-bottom-10 duration-300" onClick={(e) => e.stopPropagation()}> <div className="w-12 h-1 bg-zinc-700 rounded-full mx-auto mb-6"></div> {!showDeleteWarning ? ( <> <h3 className={`text-lg font-medium mb-6 ${textMetal}`}>{t.settings}</h3> <div className="space-y-2"> <button className="w-full flex items-center gap-4 p-4 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 transition-colors text-left" onClick={() => { toggleCardStatus(settingsCardId); setSettingsCardId(null); }}> <div className="p-2 bg-emerald-900/20 text-emerald-400 rounded-lg"><Lock size={18}/></div> <span className="text-sm font-medium text-slate-200"> {virtualCards.find(c => c.id === settingsCardId)?.status === 'FROZEN' ? t.unfreezeCard : t.freezeCard} </span> </button> <button className="w-full flex items-center gap-4 p-4 rounded-xl bg-red-900/10 hover:bg-red-900/20 transition-colors text-left group" onClick={() => setShowDeleteWarning(true)}> <div className="p-2 bg-red-900/20 text-red-500 rounded-lg group-hover:bg-red-900/30"><Trash2 size={18}/></div> <span className="text-sm font-medium text-red-400 group-hover:text-red-300">{t.deleteCard}</span> </button> </div> </> ) : ( <div className="text-center"> <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20"> <AlertTriangle className="text-red-500" size={32} /> </div> <h3 className="text-xl font-bold text-red-500 mb-2">{t.warning}</h3> <p className="text-slate-400 text-sm mb-8 px-4">{t.deleteConfirmation}</p> <div className="space-y-3"> <Button variant="danger" onClick={handleDeleteCard}> {t.confirmDelete} </Button> <Button variant="ghost" onClick={() => setShowDeleteWarning(false)}> {t.cancel} </Button> </div> </div> )} </div> </div> )} </div> ); };
const TransferScreen: React.FC = () => { /* ... existing code ... */ const { user, updateBalance, addTransaction, t, lang } = useAppContext(); const navigate = useNavigate(); const [amount, setAmount] = useState(''); const [recipient, setRecipient] = useState(''); const [loading, setLoading] = useState(false); const [success, setSuccess] = useState(false); const [error, setError] = useState(''); const handleTransfer = (e: React.FormEvent) => { e.preventDefault(); setError(''); const val = parseFloat(amount); if (!user || isNaN(val) || val <= 0) { setError("Invalid amount"); return; } if (val > user.balance) { setError(t.insufficientFunds); return; } if (!recipient) { setError("Recipient required"); return; } setLoading(true); setTimeout(() => { updateBalance(-val); addTransaction({ id: Date.now().toString(), type: TransactionType.TRANSFER, amount: -val, date: new Date().toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', { day: 'numeric', month: 'short' }), status: 'COMPLETED', description: `Transfer to ${recipient}`, recipient: recipient }); setLoading(false); setSuccess(true); setTimeout(() => { navigate('/'); }, 1500); }, 1500); }; return ( <div className="h-[100dvh] bg-black flex flex-col relative"> <div className="flex items-center gap-4 mb-8 pt-8 px-6"> <button onClick={() => navigate(-1)} className={`p-2 bg-zinc-900 rounded-full text-slate-400 hover:text-white transition-colors border border-slate-800`}> <ArrowLeftRight size={20} className="rotate-180 rtl:rotate-0" /> </button> <h1 className={`text-lg font-medium tracking-wide ${textMetal}`}>{t.sendMoney}</h1> </div> <div className="flex-1 overflow-y-auto px-6"> <ChromeCard> <div className="p-6"> {success ? ( <div className="py-12 flex flex-col items-center animate-in zoom-in duration-300"> <div className="w-16 h-16 bg-emerald-900/20 rounded-full flex items-center justify-center border border-emerald-500/30 mb-4 text-emerald-500"> <Check size={32} /> </div> <h3 className="text-xl font-medium text-white mb-1">{t.transferSuccess}</h3> <p className="text-slate-500 text-sm font-mono">{amount} {user?.currency}</p> </div> ) : ( <form onSubmit={handleTransfer} className="space-y-6"> <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 text-center mb-6"> <p className="text-[10px] uppercase text-slate-500 tracking-widest mb-1">{t.availableBalance}</p> <p className="text-2xl font-light text-white font-mono">{user?.balance.toLocaleString()} {user?.currency}</p> </div> <Input label={t.recipient} placeholder={t.enterPhone} value={recipient} onChange={(e) => setRecipient(e.target.value)} /> <div> <Input label={t.amount} type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} error={error} /> </div> <div className="pt-4"> <Button type="submit" variant="mercury" isLoading={loading}> {t.authorize} </Button> </div> </form> )} </div> </ChromeCard> </div> <BottomNav /> </div> ); };
const ReceiveScreen: React.FC = () => { /* ... existing code ... */ const { user, t } = useAppContext(); const navigate = useNavigate(); return ( <div className="h-[100dvh] bg-black flex flex-col relative"> <div className="flex items-center gap-4 mb-8 pt-8 px-6"> <button onClick={() => navigate(-1)} className={`p-2 bg-zinc-900 rounded-full text-slate-400 hover:text-white transition-colors border border-slate-800`}> <ArrowLeftRight size={20} className="rotate-180 rtl:rotate-0" /> </button> <h1 className={`text-lg font-medium tracking-wide ${textMetal}`}>{t.receiveMoney}</h1> </div> <div className="flex-1 overflow-y-auto px-6 flex flex-col items-center"> <ChromeCard className="w-full max-w-sm mb-6"> <div className="p-8 flex flex-col items-center"> <div className="w-64 h-64 bg-white rounded-2xl p-4 mb-6 shadow-inner"> <div className="w-full h-full border-4 border-black border-dashed rounded-lg flex items-center justify-center relative overflow-hidden"> <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black to-transparent"></div> <QrCode size={120} className="text-black" /> <div className="absolute bottom-2 right-2"> <div className="w-4 h-4 bg-black rounded-sm"></div> </div> <div className="absolute top-2 left-2"> <div className="w-4 h-4 bg-black rounded-sm"></div> </div> <div className="absolute top-2 right-2"> <div className="w-4 h-4 bg-black rounded-sm"></div> </div> </div> </div> <div className="text-center w-full space-y-4"> <div> <p className="text-[10px] uppercase text-slate-500 tracking-widest mb-1">{t.recipient}</p> <p className="text-lg font-medium text-white">{user?.name}</p> </div> <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 flex items-center justify-between"> <div className="text-left"> <p className="text-[9px] uppercase text-slate-500 tracking-widest mb-0.5">{t.iban}</p> <p className="text-xs font-mono text-slate-300">SA42 1000 0000 1234 5678 90</p> </div> <button className="p-2 text-slate-400 hover:text-white"><Copy size={16}/></button> </div> </div> </div> </ChromeCard> <Button variant="secondary" className="max-w-xs"> <Share2 size={18} /> {t.share} </Button> </div> <BottomNav /> </div> ); };
// ...

const AppRoutes = () => {
    const { user, t, lang, login, updateUser } = useAppContext();
    const [authLang, setAuthLang] = useState<'en'|'ar'>('en');

    // Bridge function for AuthScreens
    const setLanguage = (l: 'en' | 'ar') => setAuthLang(l);
    // Use the authLang for translations if user is null
    const effectiveT = user ? t : TRANSLATIONS[authLang];
    const effectiveLang = user ? lang : authLang;

    // Bridge for updating user from Profile screen
    const handleLoginSuccess = (phone: string) => login(phone, authLang);

    return (
        <Routes>
            <Route path="/signup" element={<SignUpScreen t={effectiveT} lang={effectiveLang} setLanguage={setLanguage} onLoginSuccess={handleLoginSuccess} onUpdateUser={updateUser} />} />
            <Route path="/login-new" element={<LoginScreen t={effectiveT} lang={effectiveLang} setLanguage={setLanguage} onLoginSuccess={handleLoginSuccess} onUpdateUser={updateUser} />} />
            <Route path="/complete-profile" element={<CompleteProfileScreen t={effectiveT} lang={effectiveLang} setLanguage={setLanguage} onLoginSuccess={handleLoginSuccess} onUpdateUser={updateUser} />} />
            
            {/* Existing Routes */}
            {!user ? (
                 <Route path="*" element={<AuthScreen />} />
            ) : (
                <>
                    <Route path="/" element={<DashboardScreen />} />
                    <Route path="/legal" element={<LegalProfileScreen />} />
                    <Route path="/edit-profile" element={<EditProfileScreen />} />
                    <Route path="/cards" element={<CardsScreen />} />
                    <Route path="/transfer" element={<TransferScreen />} />
                    <Route path="/receive" element={<ReceiveScreen />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </>
            )}
        </Routes>
    );
};

const AppWrapper: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);

  return (
      <>
        {showIntro && <IntroScreen onStart={() => setShowIntro(false)} />}
        <AppRoutes />
      </>
  );
}

const App: React.FC = () => {
    return (
        <HashRouter>
            <AppProvider>
                <AppWrapper />
            </AppProvider>
        </HashRouter>
    );
};

export default App;