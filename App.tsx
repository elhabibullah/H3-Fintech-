import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { UserProfile, Transaction, TransactionType, ChatMessage } from './types';
import { Home, ArrowLeftRight, QrCode, User, MessageSquare, LogOut, Wallet, ShieldCheck, FileText, Bell, ChevronRight, CheckCircle, Smartphone, Mail, Edit2, X, Target, Save } from 'lucide-react';

// Components
import { Button } from './components/Button';
import { Input } from './components/Input';
import { generateSupportResponse } from './services/gemini';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

// --- Context ---
interface AppContextType {
  user: UserProfile | null;
  transactions: Transaction[];
  login: (phone: string) => void;
  logout: () => void;
  addTransaction: (t: Transaction) => void;
  updateBalance: (amount: number) => void;
  updateUser: (updatedData: Partial<UserProfile>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};

// --- Mock Data ---
const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', type: TransactionType.PAYMENT, amount: -12.50, date: '2023-10-25', status: 'COMPLETED', recipient: 'Downtown Cafe', description: 'Coffee & Snacks' },
  { id: '2', type: TransactionType.DEPOSIT, amount: 4500.00, date: '2023-10-24', status: 'COMPLETED', sender: 'Tech Solutions LLC', description: 'Monthly Salary' },
  { id: '3', type: TransactionType.TRANSFER, amount: -200.00, date: '2023-10-22', status: 'COMPLETED', recipient: 'Family Support', description: 'Transfer to Mother' },
  { id: '4', type: TransactionType.ZAKAT, amount: -1200.00, date: '2023-09-01', status: 'COMPLETED', recipient: 'Global Relief Fund', description: 'Annual Zakat' },
];

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('h3_active_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setTransactions(MOCK_TRANSACTIONS);
    }
  }, []);

  const normalizePhone = (p: string) => p.replace(/\s+/g, '').replace(/-/g, '');

  const login = (rawPhone: string) => {
    // STRICT CLEANING
    const phone = normalizePhone(rawPhone);
    const dbKey = `h3_db_${phone}`;
    const existingProfile = localStorage.getItem(dbKey);

    if (existingProfile) {
        const parsed = JSON.parse(existingProfile);
        setUser(parsed);
        localStorage.setItem('h3_active_user', JSON.stringify(parsed));
        setTransactions(MOCK_TRANSACTIONS);
        return;
    }

    const newUser: UserProfile = {
      name: 'Amir Hassan', 
      email: 'amir.hassan@example.com',
      phoneNumber: rawPhone,
      kycVerified: true,
      biometricEnabled: true,
      balance: 24500.00,
      currency: 'USD'
    };
    
    setUser(newUser);
    localStorage.setItem('h3_active_user', JSON.stringify(newUser));
    localStorage.setItem(dbKey, JSON.stringify(newUser));
    setTransactions(MOCK_TRANSACTIONS);
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
        
        // Merge Data
        const newUser = { ...prevUser, ...updatedData };
        
        // 1. Save to Active Session
        localStorage.setItem('h3_active_user', JSON.stringify(newUser));
        
        // 2. Save to Permanent Database Key (using the UPDATED phone number if changed, or original)
        // If phone number changes, we save to the NEW key.
        const phoneKey = normalizePhone(newUser.phoneNumber);
        localStorage.setItem(`h3_db_${phoneKey}`, JSON.stringify(newUser));
        
        return newUser;
    });
  };

  return (
    <AppContext.Provider value={{ user, transactions, login, logout, addTransaction, updateBalance, updateUser }}>
      {children}
    </AppContext.Provider>
  );
};

// --- Styles Utilities ---
const textMetal = "bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-200 to-slate-400 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]";

// --- Custom Chrome Card Component ---
// UPDATED: High Gloss, Conic Gradient, Corner Logic Fixed
const ChromeCard: React.FC<{ children: React.ReactNode; className?: string; rounded?: string }> = ({ children, className = "", rounded = "rounded-3xl" }) => {
  // Logic to calculate inner border radius so it fits perfectly
  let innerRounded = "rounded-[21px]"; // default for rounded-3xl
  if (rounded === "rounded-[2rem]") innerRounded = "rounded-[30px]";
  if (rounded === "rounded-2xl") innerRounded = "rounded-[14px]";
  if (rounded === "rounded-xl") innerRounded = "rounded-[10px]";

  return (
    // Outer Gradient (The Silver Border) - HIGH GLOSS UPDATE
    // Used linear + conic to create "Sheen"
    <div className={`relative p-[2px] bg-gradient-to-b from-white via-slate-300 to-slate-500 shadow-[0_0_20px_rgba(255,255,255,0.15)] ${rounded} ${className}`}>
      {/* Gloss Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-tr from-transparent via-white/80 to-transparent opacity-20 pointer-events-none ${rounded}`}></div>
      
      {/* Inner Content (The Black Card) */}
      <div className={`relative w-full bg-zinc-950 ${innerRounded} overflow-hidden`}>
        {children}
      </div>
    </div>
  );
};

// --- Screens ---

// 0. Intro Screen
const IntroScreen: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  return (
    <div className="relative h-screen w-full bg-black overflow-hidden">
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-100"
      >
        <source src="https://fit-4rce-x.s3.eu-north-1.amazonaws.com/Metaball_siver_bl_bg.mp4" type="video/mp4" />
      </video>

      {/* Top Text */}
      <div className="absolute top-8 left-0 w-full px-6 text-center z-20">
         <h1 className={`text-5xl font-extralight tracking-[0.2em] uppercase text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] mb-2`}>
            H3
         </h1>
         <p className={`text-xs font-semibold tracking-[0.4em] uppercase text-slate-300`}>
            Your World. Your Wealth.
         </p>
         <p className="text-slate-500 text-[9px] tracking-[0.6em] uppercase mt-3">Welcome to the future</p>
      </div>

      {/* Bottom Button */}
      <div className="absolute bottom-10 left-0 w-full flex flex-col items-center z-20">
        <button 
          onClick={onStart}
          className="group relative w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-500 active:scale-90"
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
}

// 1. Auth Screen
const AuthScreen: React.FC = () => {
  const { login } = useAppContext();
  const navigate = useNavigate();
  const [showIntro, setShowIntro] = useState(true);
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setStep('otp');
      setLoading(false);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    }, 1000);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) otpRefs.current[index + 1]?.focus();
    if (newOtp.every(digit => digit !== '') && index === 3 && value) handleOtpSubmit(newOtp.join(''));
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) otpRefs.current[index - 1]?.focus();
  };

  const handleOtpSubmit = (code?: string) => {
    setLoading(true);
    setTimeout(() => {
      login(phone);
      setLoading(false);
      navigate('/');
    }, 1500);
  };

  if (showIntro) return <IntroScreen onStart={() => setShowIntro(false)} />;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative bg-black">
      <ChromeCard className="w-full max-w-md">
        <div className="p-8">
            <div className="text-center mb-10">
            <div className="h-16 w-16 mx-auto flex items-center justify-center mb-6 rounded-full bg-gradient-to-br from-slate-200 to-slate-400 p-[2px] shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                    <span className={`text-2xl font-bold ${textMetal}`}>H3</span>
                </div>
            </div>
            <h1 className={`text-2xl font-medium mb-2 tracking-wide ${textMetal}`}>Security Check</h1>
            </div>

            {step === 'phone' ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-6">
                <Input 
                label="Mobile Number" 
                placeholder="+1 234 567 890" 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                />
                <Button type="submit" isLoading={loading} variant="mercury">
                Secure Login
                </Button>
            </form>
            ) : (
            <div className="space-y-8">
                <div className="text-center mb-6">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Access code sent to</p>
                <p className={`font-mono text-lg tracking-widest ${textMetal}`}>{phone}</p>
                </div>
                
                <div className="flex justify-center gap-4">
                {[0, 1, 2, 3].map((index) => (
                    // OTP Inputs with Chrome Border Wrapper
                    <div key={index} className="w-14 h-16 p-[2px] rounded-xl bg-gradient-to-b from-white via-slate-300 to-slate-500 shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                        <input 
                            ref={el => otpRefs.current[index] = el}
                            type="text" 
                            maxLength={1}
                            inputMode="numeric"
                            className="w-full h-full bg-black rounded-[10px] text-center text-2xl font-mono text-white outline-none focus:bg-zinc-900 transition-all placeholder-slate-700"
                            value={otp[index]}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            placeholder="-"
                        />
                    </div>
                ))}
                </div>
                
                <div className="pt-2">
                    <Button onClick={() => handleOtpSubmit()} isLoading={loading} variant="mercury">
                    Verify Access
                    </Button>
                </div>

                <button 
                type="button" 
                onClick={() => { setStep('phone'); setOtp(['','','','']); }} 
                className="w-full text-center text-[10px] text-slate-500 mt-6 hover:text-white transition-colors uppercase tracking-[0.2em]"
                >
                Change Number
                </button>
            </div>
            )}
        </div>
      </ChromeCard>
    </div>
  );
};

// 2. Dashboard Screen
const DashboardScreen: React.FC = () => {
  const { user, transactions } = useAppContext();
  
  const data = [
    { name: '1', uv: 4000 },
    { name: '5', uv: 3000 },
    { name: '10', uv: 5000 },
    { name: '15', uv: 4780 },
    { name: '20', uv: 5890 },
    { name: '25', uv: 4390 },
    { name: '30', uv: 6490 },
  ];

  return (
    <div className="p-6 space-y-8 pb-24 bg-black min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center pt-2">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-slate-200 to-slate-400 p-[1px] shadow-[0_0_15px_rgba(255,255,255,0.2)]">
             <div className="h-full w-full rounded-full bg-zinc-900 flex items-center justify-center text-white font-light text-lg">
               {user?.name.charAt(0)}
             </div>
          </div>
          <div>
            <p className="text-[9px] text-slate-500 uppercase tracking-[0.2em] font-bold">Welcome Back</p>
            <p className={`font-medium text-lg tracking-wide ${textMetal}`}>{user?.name}</p>
          </div>
        </div>
        <button className={`p-3 bg-zinc-900 rounded-full text-slate-300 hover:text-white transition-colors shadow-lg border border-slate-700`}>
          <Bell size={18} />
        </button>
      </div>

      {/* Total Assets Card with Chrome Wrapper - FIXED ROUNDING */}
      <ChromeCard rounded="rounded-[2rem]">
        {/* Metallic Shine Overlay */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-b from-white/10 to-transparent rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 p-8">
          <div className="flex justify-between items-start mb-4">
             <p className="text-slate-400 text-[10px] font-bold tracking-[0.2em] uppercase">Total Assets</p>
             <div className="px-2 py-1 rounded bg-emerald-950/50 border border-emerald-500/30">
                <span className="text-[10px] text-emerald-400 font-mono tracking-wider">+2.4%</span>
             </div>
          </div>
          <h2 className={`text-4xl font-light mb-10 tracking-tight text-white drop-shadow-md`}>
            <span className="text-slate-500 mr-2 font-thin">$</span>
            {user?.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </h2>
          
          <div className="grid grid-cols-3 gap-4">
            <LinkButton to="/transfer" icon={<ArrowLeftRight size={20} />} label="Transfer" />
            <LinkButton to="/receive" icon={<QrCode size={20} />} label="Receive" />
            <LinkButton to="/pay" icon={<Wallet size={20} />} label="Bills" />
          </div>
        </div>
      </ChromeCard>

      {/* Analytics Mini Chart - Chrome Wrapper */}
      <ChromeCard>
        <div className="p-6 relative backdrop-blur-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Market Trend</h3>
                <span className="text-emerald-500 text-[10px] font-mono bg-emerald-950/30 px-2 py-1 rounded border border-emerald-900/30">LIVE</span>
            </div>
            <div className="h-32 w-full -ml-2">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e2e8f0" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#e2e8f0" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <Area type="monotone" dataKey="uv" stroke="#e2e8f0" strokeWidth={1.5} fillOpacity={1} fill="url(#colorUv)" />
                </AreaChart>
            </ResponsiveContainer>
            </div>
        </div>
      </ChromeCard>

      {/* Recent Transactions */}
      <div>
        <div className="flex justify-between items-end mb-6 px-1">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Recent Activity</h3>
          <button className="text-[10px] text-emerald-500 hover:text-emerald-400 font-medium uppercase tracking-wider border-b border-transparent hover:border-emerald-500 transition-all">View All</button>
        </div>
        <div className="space-y-4">
          {transactions.map(tx => (
            // Each transaction is a Chrome Card
            <ChromeCard key={tx.id} rounded="rounded-2xl" className="group">
                <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-zinc-900/50 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center border transition-all ${
                        tx.amount > 0 
                            ? 'bg-emerald-950/20 border-emerald-900/30 text-emerald-500' 
                            : 'bg-zinc-950 border-zinc-800 text-slate-400'
                        }`}>
                        {tx.amount > 0 ? <ArrowLeftRight size={18} className="rotate-45" /> : <ArrowLeftRight size={18} className="-rotate-45" />}
                        </div>
                        <div>
                        <p className="font-medium text-slate-200 text-sm group-hover:text-white transition-colors">{tx.description || tx.type}</p>
                        <p className="text-[10px] text-slate-600 uppercase tracking-wider mt-1">{tx.date}</p>
                        </div>
                    </div>
                    <p className={`font-mono text-sm tracking-wide ${tx.amount > 0 ? 'text-emerald-400' : 'text-slate-300'}`}>
                        {tx.amount > 0 ? '+' : ''}{Math.abs(tx.amount).toFixed(2)}
                    </p>
                </div>
            </ChromeCard>
          ))}
        </div>
      </div>
    </div>
  );
};

// Updated Link Button - SIMPLIFIED WHITE
const LinkButton: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => {
  const navigate = useNavigate();
  return (
    <button 
      onClick={() => navigate(to)}
      className="flex-1 flex flex-col items-center gap-3 bg-white hover:bg-slate-50 active:scale-[0.98] py-5 rounded-2xl transition-all shadow-lg border border-slate-100"
    >
      <div className="text-slate-900">{icon}</div>
      <span className="text-[9px] font-black text-slate-900 uppercase tracking-[0.2em]">{label}</span>
    </button>
  );
};

// 3. Transfer Screen
const TransferScreen: React.FC = () => {
  const { user, addTransaction, updateBalance } = useAppContext();
  const navigate = useNavigate();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [showBiometric, setShowBiometric] = useState(false);

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    setShowBiometric(true);
  };

  const confirmBiometric = () => {
    setLoading(true);
    setTimeout(() => {
      const amt = parseFloat(amount);
      const newTx: Transaction = {
        id: Date.now().toString(),
        type: TransactionType.TRANSFER,
        amount: -amt,
        recipient,
        date: new Date().toLocaleDateString(),
        status: 'COMPLETED',
        description: `Transfer to ${recipient}`
      };
      addTransaction(newTx);
      updateBalance(-amt);
      setLoading(false);
      setShowBiometric(false);
      navigate('/');
    }, 2000); 
  };

  return (
    <div className="p-6 h-full flex flex-col bg-black">
      <div className="flex items-center gap-4 mb-8 pt-2">
        <button onClick={() => navigate(-1)} className={`p-2 bg-zinc-900 rounded-full text-slate-400 hover:text-white transition-colors border border-slate-800`}>
          <ArrowLeftRight size={20} className="rotate-180" /> 
        </button>
        <h1 className={`text-lg font-medium tracking-wide ${textMetal}`}>Send Money</h1>
      </div>

      <div className="flex-1">
        {/* Available Balance - Chrome Card */}
        <ChromeCard className="mb-10 text-center">
            <div className="p-8">
                <p className="text-emerald-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">Available Balance</p>
                <p className={`text-4xl font-light text-white`}>${user?.balance.toFixed(2)}</p>
            </div>
        </ChromeCard>

        <form onSubmit={handleTransfer} className="space-y-6">
          <Input 
            label="Recipient" 
            placeholder="IBAN / Email / Phone"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            required
          />
          <Input 
            label="Amount (USD)" 
            placeholder="0.00"
            type="number"
            min="1"
            max={user?.balance}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          
          <div className="pt-8">
             <Button type="submit" variant="mercury">Proceed to Review</Button>
          </div>
        </form>
      </div>

      {showBiometric && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-6">
          <ChromeCard rounded="rounded-[2rem]" className="w-full max-w-sm text-center">
            <div className="p-8 relative">
                 {/* Scanner line animation */}
                <div className="absolute top-0 left-0 w-full h-0.5 bg-emerald-500/50 animate-[scan_2s_ease-in-out_infinite] shadow-[0_0_15px_rgba(16,185,129,0.8)] z-20"></div>

                <div className="mx-auto h-24 w-24 bg-gradient-to-tr from-zinc-800 to-black rounded-full flex items-center justify-center text-emerald-500 mb-6 border border-slate-700 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                <ShieldCheck size={40} strokeWidth={1.5} />
                </div>
                <h3 className={`text-xl font-medium mb-2 ${textMetal}`}>Authorize Transfer</h3>
                <p className="text-slate-500 text-sm mb-8">Confirm transfer of <span className="text-white font-semibold">${amount}</span> to <span className="text-white">{recipient}</span></p>
                
                <div className="space-y-3">
                <Button onClick={confirmBiometric} isLoading={loading} variant="primary">
                    {loading ? 'Verifying...' : 'Face ID Confirm'}
                </Button>
                <Button variant="ghost" onClick={() => setShowBiometric(false)} disabled={loading}>
                    Cancel
                </Button>
                </div>
            </div>
          </ChromeCard>
        </div>
      )}
    </div>
  );
};

// 4. Receive Screen
const ReceiveScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppContext();

  return (
    <div className="p-6 h-full flex flex-col items-center bg-black">
      <div className="w-full flex items-center gap-4 mb-8 pt-2">
        <button onClick={() => navigate(-1)} className={`p-2 bg-zinc-900 rounded-full text-slate-400 hover:text-white border border-slate-800`}>
          <ArrowLeftRight size={20} className="rotate-180" />
        </button>
        <h1 className={`text-lg font-medium tracking-wide ${textMetal}`}>Receive Money</h1>
      </div>

      <div className={`bg-white p-6 rounded-[2rem] shadow-[0_0_50px_rgba(255,255,255,0.05)] mb-10 relative group border-4 border-slate-200`}>
         <div className="w-64 h-64 bg-white flex items-center justify-center relative overflow-hidden z-10">
            <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=H3:${user?.phoneNumber}`} 
                alt="QR Code" 
                className="w-full h-full object-contain mix-blend-multiply"
            />
         </div>
      </div>
      
      <div className="text-center mb-10 space-y-3">
        <p className={`font-medium text-2xl tracking-tight ${textMetal}`}>{user?.name}</p>
        <div className="inline-block px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800">
             <p className="text-emerald-500 text-sm font-mono tracking-wider">{user?.phoneNumber}</p>
        </div>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <Button variant="mercury" onClick={() => alert("Link copied to clipboard!")} className="text-black">
          Copy Payment Link
        </Button>
        <Button variant="ghost">Share via SMS</Button>
      </div>
    </div>
  );
};

// 5. Support Screen (Gemini AI)
const SupportScreen: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: 'Welcome to H3 Assistant. How may I assist you with your portfolio today?', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const responseText = await generateSupportResponse(userMsg.text, history);

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, botMsg]);
    setIsTyping(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-black">
      <div className="p-4 border-b border-zinc-900 bg-black/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-center relative">
         <div className="absolute left-4 bg-emerald-900/20 p-2 rounded-full border border-emerald-900/30">
             <MessageSquare className="text-emerald-500" size={16} />
         </div>
         <h1 className="text-[10px] font-bold text-slate-200 tracking-[0.2em] uppercase">H3 Assistant</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-gradient-to-br from-emerald-700 to-emerald-900 text-white rounded-br-none border border-emerald-600/30' 
                : 'bg-zinc-900 text-slate-300 rounded-bl-none border border-zinc-800'
            }`}>
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
             <div className="bg-zinc-900 p-4 rounded-2xl rounded-bl-none border border-zinc-800 flex gap-1.5 items-center h-12">
                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-100"></span>
                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-200"></span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-black border-t border-zinc-900">
        <form onSubmit={handleSend} className="flex gap-3">
          <Input 
             className="!py-3"
             placeholder="Type your inquiry..."
             value={input}
             onChange={(e) => setInput(e.target.value)}
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isTyping}
            className="bg-emerald-700 hover:bg-emerald-600 text-white p-3 rounded-xl disabled:opacity-50 transition-all border border-emerald-600 h-[52px]"
          >
            <ArrowLeftRight size={20} className={isTyping ? "animate-spin" : "-rotate-45"} />
          </button>
        </form>
      </div>
    </div>
  );
};

// 6. Edit Profile Screen (Fixed)
const EditProfileScreen: React.FC = () => {
    const { user, updateUser } = useAppContext();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: ''
    });
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setTimeout(() => {
            updateUser(formData);
            setSuccess(true);
            setSaving(false);
            setTimeout(() => {
                navigate('/settings');
            }, 1000);
        }, 800);
    };

    return (
        <div className="p-6 h-full flex flex-col bg-black">
            <div className="flex items-center gap-4 mb-8 pt-2">
                <button onClick={() => navigate('/settings')} className={`p-2 bg-zinc-900 rounded-full text-slate-400 hover:text-white transition-colors border border-slate-800`}>
                    <ArrowLeftRight size={20} className="rotate-180" />
                </button>
                <h1 className={`text-lg font-medium tracking-wide ${textMetal}`}>Edit Profile</h1>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex justify-center mb-8">
                    <div className="relative group cursor-pointer">
                        <div className="h-28 w-28 rounded-full bg-zinc-900 border-2 border-zinc-800 flex items-center justify-center text-3xl font-light text-emerald-500 shadow-xl overflow-hidden">
                             {formData.name.charAt(0) || 'U'}
                        </div>
                        <div className="absolute bottom-0 right-0 bg-emerald-600 p-2.5 rounded-full border-4 border-black text-white shadow-lg">
                            <Edit2 size={16} />
                        </div>
                    </div>
                </div>

                <Input 
                    label="Full Name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange}
                    required 
                />
                <Input 
                    label="Email Address" 
                    name="email" 
                    type="email"
                    value={formData.email} 
                    onChange={handleChange}
                    required 
                />
                 <Input 
                    label="Phone Number" 
                    name="phoneNumber" 
                    value={formData.phoneNumber} 
                    onChange={handleChange}
                    required 
                />

                <div className="pt-8">
                    <Button type="submit" variant="mercury" isLoading={saving} className={success ? "!bg-emerald-600 !text-white !border-emerald-500" : ""}>
                         {success ? (
                             <>
                                <CheckCircle size={18} /> Saved Successfully
                             </>
                         ) : (
                             "Save Changes"
                         )}
                    </Button>
                    <Button type="button" variant="ghost" className="mt-3 text-slate-500 hover:text-white" onClick={() => navigate('/settings')}>Cancel</Button>
                </div>
            </form>
        </div>
    );
};


// 7. Settings / Profile Screen (Main)
const SettingsScreen: React.FC = () => {
  const { user, logout } = useAppContext();
  const navigate = useNavigate();
  const [zakatDue, setZakatDue] = useState<number | null>(null);

  const calculateZakat = () => {
    if (user) {
      setZakatDue(user.balance * 0.025);
    }
  };

  return (
    <div className="p-6 pb-24 space-y-8 bg-black min-h-screen">
      <h1 className={`text-xl font-medium tracking-wide pt-2 ${textMetal}`}>Account & Settings</h1>
      
      {/* User Card - FIXED: PADDING INSIDE, NOT ON BORDER */}
      <ChromeCard>
        <div className="flex items-center gap-6 p-6 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-slate-100/5 blur-3xl rounded-full -mr-10 -mt-10"></div>
            <div className="relative h-20 w-20 rounded-full bg-black border border-slate-700 flex items-center justify-center text-3xl font-light text-emerald-500 z-10 shadow-lg">
            {user?.name.charAt(0)}
            </div>
            <div className="relative z-10">
            <h2 className={`font-semibold text-lg tracking-wide text-white`}>{user?.name}</h2>
            <p className="text-slate-500 text-xs mb-3 font-mono">{user?.email}</p>
            <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/30 text-emerald-500 text-[9px] font-bold tracking-wider border border-emerald-900/50">
                <CheckCircle size={10} /> VERIFIED
                </span>
            </div>
            </div>
        </div>
      </ChromeCard>

      {/* Halal Tools */}
      <div>
        <h3 className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] mb-4 ml-1">Islamic Finance</h3>
        <ChromeCard rounded="rounded-2xl">
          <div className="p-5">
             <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                    <div className="bg-emerald-500/5 p-2.5 rounded-xl border border-emerald-500/10">
                        <Wallet size={20} className="text-emerald-500" />
                    </div>
                    <div>
                        <span className="text-slate-200 text-sm font-medium block">Zakat Calculator</span>
                        <span className="text-slate-600 text-[10px] block">2.5% of annual savings</span>
                    </div>
                </div>
                <Button 
                    onClick={calculateZakat} 
                    variant="ghost" 
                    className="w-auto py-2 px-4 text-[10px] h-auto border border-slate-700 hover:border-emerald-500 hover:bg-zinc-800"
                >
                    CALCULATE
                </Button>
             </div>
             {zakatDue !== null && (
                 <div className="bg-black p-4 rounded-xl border border-slate-800 mt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                     <div className="flex justify-between items-end">
                         <div>
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Estimated Zakat</p>
                            <p className="text-2xl font-light text-white">${zakatDue.toFixed(2)}</p>
                         </div>
                         <Button variant="mercury" className="w-auto py-2 px-5 text-xs h-auto">Pay Now</Button>
                     </div>
                 </div>
             )}
          </div>
        </ChromeCard>
      </div>

      {/* Settings List */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] ml-1">Configuration</h3>
        
        <ChromeCard rounded="rounded-2xl">
          <div className="divide-y divide-zinc-800/50">
            <button 
                onClick={() => navigate('/settings/edit')}
                className="w-full p-5 flex items-center justify-between hover:bg-zinc-900 transition-colors group"
            >
                <div className="flex items-center gap-4">
                <User size={20} className="text-slate-400 group-hover:text-emerald-500 transition-colors" />
                <span className="text-slate-200 text-sm font-medium">Personal Information</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider">Edit</span>
                    <ChevronRight size={16} className="text-slate-600" />
                </div>
            </button>
            
            <div className="p-5 flex items-center justify-between group cursor-pointer hover:bg-zinc-900 transition-colors">
                <div className="flex items-center gap-4">
                <ShieldCheck size={20} className="text-slate-400 group-hover:text-emerald-500 transition-colors" />
                <span className="text-slate-200 text-sm font-medium">Security & FaceID</span>
                </div>
                <div className="w-11 h-6 bg-zinc-800 rounded-full relative cursor-pointer border border-zinc-700 group-hover:border-emerald-500/50 transition-colors">
                    <div className="absolute right-1 top-1 w-3.5 h-3.5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                </div>
            </div>

            <div className="p-5 flex items-center justify-between group cursor-pointer hover:bg-zinc-900 transition-colors">
                <div className="flex items-center gap-4">
                <FileText size={20} className="text-slate-400 group-hover:text-emerald-500 transition-colors" />
                <span className="text-slate-200 text-sm font-medium">Legal Documents</span>
                </div>
                <ChevronRight size={16} className="text-slate-600" />
            </div>
          </div>
        </ChromeCard>
      </div>

      <Button variant="danger" onClick={logout} className="mt-8 border-red-900/20 bg-red-950/30 text-red-400 hover:bg-red-900/30 hover:border-red-900/40">
        <LogOut size={18} />
        Log Out
      </Button>
    </div>
  );
};

// --- Layout & Navigation ---
const Layout: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => {
      if (path === '/settings' && location.pathname.startsWith('/settings')) return "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]";
      return location.pathname === path ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" : "text-slate-600 hover:text-slate-400";
  }
  
  return (
    <div className="max-w-md mx-auto h-screen bg-black flex flex-col shadow-2xl overflow-hidden relative border-x border-zinc-900">
      <div className="flex-1 overflow-y-auto scroll-smooth">
        <Routes>
          <Route path="/" element={<DashboardScreen />} />
          <Route path="/transfer" element={<TransferScreen />} />
          <Route path="/receive" element={<ReceiveScreen />} />
          <Route path="/support" element={<SupportScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
          <Route path="/settings/edit" element={<EditProfileScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* Premium Bottom Navigation - Aluminium Bar */}
      <nav className={`h-[90px] bg-black border-t border-zinc-800 flex justify-around items-start px-2 pt-5 z-50`}>
        <button onClick={() => window.location.hash = '#/'} className={`flex flex-col items-center p-2 transition-all duration-300 ${isActive('/')}`}>
          <Home size={26} strokeWidth={1.5} />
          <span className="text-[9px] font-medium mt-1.5 tracking-widest uppercase">Home</span>
        </button>
        <button onClick={() => window.location.hash = '#/transfer'} className={`flex flex-col items-center p-2 transition-all duration-300 ${isActive('/transfer')}`}>
          <ArrowLeftRight size={26} strokeWidth={1.5} />
          <span className="text-[9px] font-medium mt-1.5 tracking-widest uppercase">Transact</span>
        </button>
        <button onClick={() => window.location.hash = '#/support'} className={`flex flex-col items-center p-2 transition-all duration-300 ${isActive('/support')}`}>
          <MessageSquare size={26} strokeWidth={1.5} />
          <span className="text-[9px] font-medium mt-1.5 tracking-widest uppercase">Help</span>
        </button>
        <button onClick={() => window.location.hash = '#/settings'} className={`flex flex-col items-center p-2 transition-all duration-300 ${isActive('/settings')}`}>
          <User size={26} strokeWidth={1.5} />
          <span className="text-[9px] font-medium mt-1.5 tracking-widest uppercase">Account</span>
        </button>
      </nav>
    </div>
  );
};

const App: React.FC = () => {
  const { user } = useAppContext();
  return user ? <Layout /> : <AuthScreen />;
};

const Root: React.FC = () => {
  return (
    <HashRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </HashRouter>
  );
};

export default Root;