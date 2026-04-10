
import React, { useState } from 'react';
import { X, Check, Apple, Chrome, Facebook, ChevronRight, Briefcase, User as UserIcon, ArrowLeft } from 'lucide-react';
import { UserType } from '../types';

interface RegistrationModalProps {
  language: string;
  onClose: () => void;
  onSuccess: (data: { 
    name: string; 
    email: string; 
    prefs: string[]; 
    marketing: boolean; 
    type: UserType;
    gender: 'M' | 'F' | 'O';
    age: number;
    timePrefs: string[];
  }) => void;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [userType, setUserType] = useState<UserType>(UserType.STANDARD);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleFinalize = () => {
    if (!name) return;
    onSuccess({ 
      name, 
      email: `${name.toLowerCase().replace(/\s/g, '')}@horizon.app`, 
      prefs: [], 
      marketing: true, 
      type: userType, 
      gender: 'O', 
      age: 25, 
      timePrefs: ['night']
    });
  };

  return (
    <div className="fixed inset-0 z-[500] bg-paper animate-fade-in flex flex-col font-sans">
      {/* Header */}
      <div className="px-8 pt-16 pb-4 flex items-center justify-end shrink-0">
          <button onClick={onClose} className="w-10 h-10 bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-primary/40 active:scale-90 transition-all border border-white/40 shadow-watercolor">
            <X size={20}/>
          </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-8">
        <div className="max-w-md mx-auto w-full flex flex-col items-center">
          
          {step === 1 ? (
            <div className="w-full space-y-8 animate-slide-up">
              <h1 className="text-2xl font-serif font-bold text-center text-primary tracking-tight mb-8">Enter your number</h1>
              
              <div className="flex gap-3">
                <div className="flex items-center gap-2 px-4 py-4 bg-white/40 backdrop-blur-md rounded-2xl border border-white/40 min-w-[100px] cursor-pointer active:scale-95 transition-all shadow-watercolor">
                  <span className="text-xl">🇪🇸</span>
                  <span className="font-bold text-primary/60">+34</span>
                  <ChevronRight size={14} className="text-primary/20 rotate-90" />
                </div>
                <input 
                  type="tel" 
                  className="flex-1 px-6 py-4 bg-white/40 backdrop-blur-md rounded-2xl border border-white/40 text-lg font-bold text-primary outline-none focus:border-primary/20 transition-all shadow-watercolor placeholder:text-primary/20"
                  placeholder="Phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>

              <button 
                onClick={() => setStep(2)}
                className="w-full py-5 bg-primary text-white font-bold rounded-3xl text-lg shadow-glow-sunset active:scale-[0.98] transition-all flex items-center justify-center"
              >
                Sign In
              </button>

              <div className="relative flex items-center justify-center py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/40"></div>
                </div>
                <span className="relative px-4 bg-paper text-[10px] font-bold text-primary/20 uppercase tracking-widest">OR</span>
              </div>

              <div className="space-y-3">
                <button className="w-full py-4 border border-white/40 bg-white/40 backdrop-blur-md rounded-3xl flex items-center px-6 gap-4 hover:bg-white active:scale-[0.98] transition-all shadow-watercolor">
                  <Apple size={22} className="fill-primary" />
                  <span className="flex-1 text-center font-bold text-primary/60">Continue with Apple</span>
                </button>
                <button className="w-full py-4 border border-white/40 bg-white/40 backdrop-blur-md rounded-3xl flex items-center px-6 gap-4 hover:bg-white active:scale-[0.98] transition-all shadow-watercolor">
                  <Chrome size={22} className="text-red-400" />
                  <span className="flex-1 text-center font-bold text-primary/60">Continue with Google</span>
                </button>
                <button className="w-full py-4 border border-white/40 bg-white/40 backdrop-blur-md rounded-3xl flex items-center px-6 gap-4 hover:bg-white active:scale-[0.98] transition-all shadow-watercolor">
                  <Facebook size={22} className="text-blue-400 fill-blue-400" />
                  <span className="flex-1 text-center font-bold text-primary/60">Continue with Facebook</span>
                </button>
              </div>

              <p className="text-[11px] text-primary/40 text-center leading-relaxed px-4 pt-10 font-bold">
                If you are creating a new account, <span className="underline">Terms & Conditions</span> and <span className="underline">Privacy Policy</span> will apply. You can also set up your <span className="underline">communication preferences</span>.
              </p>
            </div>
          ) : (
            <div className="w-full space-y-8 animate-slide-up">
              <div className="text-center">
                <h1 className="text-2xl font-serif font-bold text-primary tracking-tight mb-2">Complete Profile</h1>
                <p className="text-sm text-primary/40 font-bold">Just a few more details to start.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-primary/40 uppercase tracking-widest ml-1">What's your name?</label>
                  <input 
                    type="text" 
                    className="w-full px-6 py-4 bg-white/40 backdrop-blur-md rounded-2xl border border-white/40 text-lg font-bold text-primary outline-none focus:border-primary/20 transition-all shadow-watercolor placeholder:text-primary/20"
                    placeholder="Full name"
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-primary/40 uppercase tracking-widest ml-1">Profile Type</label>
                  <div className="flex gap-3 p-1 bg-white/40 backdrop-blur-md rounded-2xl border border-white/40 shadow-watercolor">
                      <button 
                        onClick={() => setUserType(UserType.STANDARD)} 
                        className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${userType === UserType.STANDARD ? 'bg-primary text-white shadow-glow-sunset' : 'text-primary/40'}`}
                      >
                        <UserIcon size={16} /> Person
                      </button>
                      <button 
                        onClick={() => setUserType(UserType.BUSINESS)} 
                        className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${userType === UserType.BUSINESS ? 'bg-primary text-white shadow-glow-sunset' : 'text-primary/40'}`}
                      >
                        <Briefcase size={16} /> Business
                      </button>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-col gap-4">
                <button 
                  onClick={handleFinalize}
                  disabled={!name}
                  className="w-full py-5 bg-primary text-white font-bold rounded-3xl text-lg shadow-glow-sunset active:scale-[0.98] disabled:opacity-20 transition-all"
                >
                  Create Horizon ID
                </button>
                <button 
                  onClick={() => setStep(1)}
                  className="flex items-center justify-center gap-2 text-primary/40 font-bold text-[10px] uppercase tracking-widest py-2"
                >
                  <ArrowLeft size={14} /> Back
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default RegistrationModal;
