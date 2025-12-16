import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { Input } from './Input';
import { ArrowLeftRight, User, Globe, CheckCircle, Smartphone, Lock, ChevronRight, Mail } from 'lucide-react';
import { signInWithPhoneNumber, verifySmsCode, checkUserExists, sendEmailVerification, checkEmailVerified } from '../services/auth';
import { Transaction, TransactionType, UserProfile, VirtualCard } from '../types';

// Duplicating ChromeCard locally to ensure visual consistency
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

interface AuthScreenProps {
  t: any;
  lang: 'en' | 'ar';
  setLanguage: (l: 'en' | 'ar') => void;
  onLoginSuccess: (phone: string) => void;
  onUpdateUser: (data: Partial<UserProfile>) => void;
}

// --- SIGN UP SCREEN (EMAIL FIRST) ---
export const SignUpScreen: React.FC<AuthScreenProps> = ({ t, lang, onLoginSuccess }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'EMAIL' | 'VERIFY'>('EMAIL');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!email.includes('@')) return;
    setLoading(true);
    await sendEmailVerification(email);
    setLoading(false);
    setStep('VERIFY');
  };

  const handleVerified = async () => {
    setLoading(true);
    const verified = await checkEmailVerified(email);
    setLoading(false);
    if(verified) {
      // Navigate to profile creation, pass email
      navigate('/complete-profile', { state: { email } });
    }
  };

  // Logo Reset Action
  const handleLogoClick = () => {
     window.location.reload(); 
  };

  return (
    <div className="h-[100dvh] bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-emerald-900/20 to-transparent pointer-events-none"></div>
      
      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-8 cursor-pointer active:scale-95 transition-transform" onClick={handleLogoClick}>
           <h1 className="text-4xl font-black italic text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-500 tracking-tighter mb-2">H3</h1>
           <p className="text-slate-400 text-xs uppercase tracking-widest">{t.createAccount}</p>
        </div>

        <ChromeCard>
          <div className="p-8">
            {step === 'EMAIL' ? (
              <form onSubmit={handleSendEmail} className="space-y-6">
                <Input 
                  label={t.enterEmail}
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-center"
                />
                <Button type="submit" variant="primary" isLoading={loading}>
                  {t.continue}
                </Button>
              </form>
            ) : (
              <div className="space-y-6 text-center">
                <div className="w-16 h-16 bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto text-emerald-500 border border-emerald-500/30">
                    <Mail size={32} />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-2">{t.checkEmail}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed px-4">{t.emailSentDesc} <br/><span className="text-white">{email}</span></p>
                </div>
                <Button onClick={handleVerified} variant="mercury" isLoading={loading}>
                  {t.iHaveVerified}
                </Button>
                <button 
                  type="button" 
                  onClick={() => setStep('EMAIL')} 
                  className="w-full text-center text-xs text-slate-500 hover:text-white mt-4"
                >
                  {t.resendCode}
                </button>
              </div>
            )}
          </div>
        </ChromeCard>

        <div className="mt-8 text-center">
            <p className="text-slate-600 text-xs">
                {t.alreadyHaveAccount} <button onClick={() => navigate('/login-new')} className="text-emerald-500 hover:text-emerald-400 font-bold ml-1">{t.login}</button>
            </p>
        </div>
      </div>
    </div>
  );
};

// --- LOGIN SCREEN (EXISTING USERS ONLY) ---
export const LoginScreen: React.FC<AuthScreenProps> = ({ t, lang, onLoginSuccess }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if(phone.length < 8) return;
    setLoading(true);
    
    // Check if user exists first
    const exists = await checkUserExists(phone);
    
    if (exists) {
        const res = await signInWithPhoneNumber(phone);
        setLoading(false);
        if(res.success && res.verificationId) {
            setVerificationId(res.verificationId);
            setStep('OTP');
        }
    } else {
        setLoading(false);
        alert(t.accountNotFound);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if(code.length !== 6) return;
    setLoading(true);
    const res = await verifySmsCode(verificationId, code);
    setLoading(false);
    if(res.success) {
      onLoginSuccess(phone); 
      navigate('/');
    } else {
      alert("Invalid code");
    }
  };
  
  const handleLogoClick = () => {
     window.location.reload(); 
  };

  return (
    <div className="h-[100dvh] bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
       {/* Background */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-900/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-8 cursor-pointer active:scale-95 transition-transform" onClick={handleLogoClick}>
           <h1 className="text-4xl font-black italic text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-500 tracking-tighter mb-2">H3</h1>
           <p className="text-slate-400 text-xs uppercase tracking-widest">{t.welcome}</p>
        </div>

        <ChromeCard>
          <div className="p-8">
            {step === 'PHONE' ? (
              <form onSubmit={handleSendCode} className="space-y-6">
                <Input 
                  label={t.enterPhone}
                  placeholder="+966 5X XXX XXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="text-center font-mono"
                />
                <Button type="submit" variant="mercury" isLoading={loading}>
                  {t.login}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerify} className="space-y-6">
                <div className="text-center mb-4">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">{t.enterCodeDesc}</p>
                  <p className="text-sm text-emerald-400 font-mono mt-1">{phone}</p>
                </div>
                <Input 
                  label={t.verificationCode}
                  placeholder="000000"
                  value={code}
                  maxLength={6}
                  onChange={(e) => setCode(e.target.value)}
                  className="text-center font-mono text-xl tracking-[0.5em]"
                />
                <Button type="submit" variant="mercury" isLoading={loading}>
                  {t.verify}
                </Button>
                <button 
                  type="button" 
                  onClick={() => setStep('PHONE')} 
                  className="w-full text-center text-xs text-slate-500 hover:text-white mt-4"
                >
                  {t.resendCode}
                </button>
              </form>
            )}
          </div>
        </ChromeCard>

        <div className="mt-8 text-center">
            <p className="text-slate-600 text-xs">
                {t.dontHaveAccount} <button onClick={() => navigate('/signup')} className="text-emerald-500 hover:text-emerald-400 font-bold ml-1">{t.signUp}</button>
            </p>
        </div>
      </div>
    </div>
  );
};

// --- COMPLETE PROFILE SCREEN ---
export const CompleteProfileScreen: React.FC<AuthScreenProps> = ({ t, lang, setLanguage, onLoginSuccess, onUpdateUser }) => {
    const navigate = useNavigate();
    // Retrieve email from nav state
    const state = (window.history.state as any)?.usr || { email: '' }; // Fallback
    
    // Strict Mandatory Fields
    const [formData, setFormData] = useState({
        title: 'Mr' as 'Mr' | 'Mrs',
        firstName: '',
        lastName: '',
        // Address
        address: '',
        city: '',
        region: '',
        postcode: '',
        country: 'Saudi Arabia',
        // Banking
        bankName: '',
        iban: '',
        // Contact
        email: state.email || '',
        mobileNumber: ''
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const validate = () => {
        if (!formData.firstName || !formData.lastName) return false;
        if (!formData.address || !formData.city || !formData.region || !formData.postcode) return false;
        if (!formData.bankName || !formData.iban) return false;
        if (!formData.email || !formData.mobileNumber) return false;
        return true;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!validate()) {
            setError("All fields are mandatory.");
            return;
        }
        
        setLoading(true);
        setTimeout(() => {
             // 1. Initialize User Session
             onLoginSuccess(formData.mobileNumber); 
             
             // 2. Update strict profile data
             onUpdateUser({
                 ...formData,
                 name: `${formData.firstName} ${formData.lastName}`,
                 phoneNumber: formData.mobileNumber,
                 kycVerified: true // Assuming completeness = KYC done for this stage
             });
             
             setLoading(false);
             navigate('/');
        }, 1500);
    };

    return (
        <div className="h-[100dvh] bg-black flex flex-col relative">
             <div className="flex items-center gap-4 mb-6 pt-8 px-6">
                <button onClick={() => navigate(-1)} className={`p-2 bg-zinc-900 rounded-full text-slate-400 hover:text-white transition-colors border border-slate-800`}>
                    <ArrowLeftRight size={20} className="rotate-180 rtl:rotate-0" /> 
                </button>
                <h1 className="text-lg font-medium tracking-wide text-white">{t.completeProfile}</h1>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-12">
                <div className="mb-6">
                    <p className="text-slate-400 text-sm">{t.fillProfileDesc}</p>
                </div>

                <ChromeCard>
                    <div className="p-6 space-y-6">
                         {/* Language Selection */}
                         <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 pl-1">{t.selectLanguage}</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button type="button" onClick={() => setLanguage('en')} className={`py-3 rounded-xl border text-xs font-bold tracking-widest transition-all ${lang === 'en' ? 'bg-zinc-800 border-emerald-500 text-white' : 'bg-zinc-900 border-zinc-800 text-slate-500'}`}>English</button>
                                <button type="button" onClick={() => setLanguage('ar')} className={`py-3 rounded-xl border text-xs font-bold tracking-widest transition-all ${lang === 'ar' ? 'bg-zinc-800 border-emerald-500 text-white' : 'bg-zinc-900 border-zinc-800 text-slate-500'}`}>العربية</button>
                            </div>
                         </div>

                        {/* Identity */}
                        <div className="space-y-4 pt-4 border-t border-zinc-800/50">
                            <h3 className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Identity</h3>
                             <div className="w-full">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 pl-1">{t.title}</label>
                                 <div className="relative p-[2px] rounded-xl bg-gradient-to-b from-white via-slate-300 to-slate-500 shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                                    <div className="relative bg-black rounded-[10px] w-full">
                                        <select name="title" value={formData.title} onChange={handleChange} className="w-full bg-transparent text-white rounded-[10px] px-4 py-3.5 outline-none focus:bg-zinc-900/50 transition-all font-light tracking-wide appearance-none">
                                            <option value="Mr">{t.mr}</option>
                                            <option value="Mrs">{t.mrs}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Input label={t.firstName} name="firstName" value={formData.firstName} onChange={handleChange} />
                                <Input label={t.lastName} name="lastName" value={formData.lastName} onChange={handleChange} />
                            </div>
                        </div>

                        {/* Contact */}
                        <div className="space-y-4 pt-4 border-t border-zinc-800/50">
                            <h3 className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Contact</h3>
                            <Input label={t.email} name="email" value={formData.email} onChange={handleChange} type="email" />
                            <Input label={t.mobileNumber} name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} type="tel" placeholder="+966..." />
                        </div>

                        {/* Address */}
                        <div className="space-y-4 pt-4 border-t border-zinc-800/50">
                            <h3 className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Address</h3>
                            <Input label={t.legalAddress} name="address" value={formData.address} onChange={handleChange} />
                            <div className="grid grid-cols-2 gap-4">
                                <Input label={t.municipality} name="city" value={formData.city} onChange={handleChange} />
                                <Input label={t.postcode} name="postcode" value={formData.postcode} onChange={handleChange} />
                            </div>
                            <Input label={t.province} name="region" value={formData.region} onChange={handleChange} />
                            <div className="w-full">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 pl-1">{t.country}</label>
                                 <div className="relative p-[2px] rounded-xl bg-gradient-to-b from-white via-slate-300 to-slate-500 shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                                    <div className="relative bg-black rounded-[10px] w-full">
                                        <select name="country" value={formData.country} onChange={handleChange} className="w-full bg-transparent text-white rounded-[10px] px-4 py-3.5 outline-none focus:bg-zinc-900/50 transition-all font-light tracking-wide appearance-none">
                                            <option value="Saudi Arabia">Saudi Arabia</option>
                                            <option value="UAE">UAE</option>
                                            <option value="Bahrain">Bahrain</option>
                                            <option value="Kuwait">Kuwait</option>
                                            <option value="Qatar">Qatar</option>
                                            <option value="Oman">Oman</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Banking */}
                        <div className="space-y-4 pt-4 border-t border-zinc-800/50">
                            <h3 className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Banking</h3>
                            <Input label={t.bankName} name="bankName" value={formData.bankName} onChange={handleChange} />
                            <Input label={t.iban} name="iban" value={formData.iban} onChange={handleChange} placeholder="SA..." />
                        </div>

                        {error && <p className="text-red-500 text-xs text-center">{error}</p>}
                    </div>
                </ChromeCard>
                
                <div className="mt-8">
                    <Button onClick={handleSubmit} isLoading={loading} variant="primary">
                        {t.createProfile}
                    </Button>
                </div>
            </div>
        </div>
    );
};
