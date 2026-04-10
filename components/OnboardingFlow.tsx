
import React, { useState, useMemo } from 'react';
import { TRANSLATIONS } from '../constants';
import { ChevronRight, MapPin, Globe, CheckCircle, Zap } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: (lang: 'en' | 'es', lat?: number, lng?: number) => void;
  initialLang: string;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete, initialLang }) => {
  const [step, setStep] = useState(0);
  const [lang, setLang] = useState<'en' | 'es'>(initialLang === 'en' ? 'en' : 'es');
  const t = useMemo(() => TRANSLATIONS[lang], [lang]);

  const slides = [
    { ...t.onboarding.v1, icon: <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-[24px] flex items-center justify-center"><Globe size={32} /></div> },
    { ...t.onboarding.v2, icon: <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-[24px] flex items-center justify-center"><Zap size={32} /></div> },
    { ...t.onboarding.v3, icon: <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[24px] flex items-center justify-center"><CheckCircle size={32} /></div> }
  ];

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => onComplete(lang, pos.coords.latitude, pos.coords.longitude),
        () => onComplete(lang)
      );
    } else {
      onComplete(lang);
    }
  };

  if (step < 3) {
    return (
      <div className="fixed inset-0 z-[100] bg-background flex flex-col p-10 animate-fade-in font-sans">
        <div className="flex justify-between items-center mb-16">
            <button onClick={() => setLang(lang === 'en' ? 'es' : 'en')} className="px-4 py-2 bg-white rounded-xl border border-gray-100 text-[10px] font-black uppercase tracking-widest">{lang.toUpperCase()}</button>
            <button onClick={() => onComplete(lang)} className="text-gray-400 font-bold text-sm tracking-tight">{t.onboarding.skip}</button>
        </div>
        <div className="flex-1 flex flex-col justify-center items-center text-center">
            <div className="mb-10 animate-scale-in">{slides[step].icon}</div>
            <h1 className="text-4xl font-black mb-4 tracking-tighter leading-none">{slides[step].t}</h1>
            <p className="text-gray-500 text-lg font-medium max-w-[280px] leading-relaxed">{slides[step].d}</p>
        </div>
        <div className="flex items-center justify-between mt-12">
            <div className="flex gap-1.5">
                {[0,1,2].map(i => <div key={i} className={`h-1.5 rounded-full transition-all ${i === step ? 'w-8 bg-black' : 'w-1.5 bg-gray-200'}`} />)}
            </div>
            <button onClick={() => setStep(step + 1)} className="w-16 h-16 bg-black text-white rounded-[24px] flex items-center justify-center shadow-2xl active:scale-90 transition-transform"><ChevronRight size={28} /></button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col justify-center items-center p-10 animate-fade-in text-center font-sans">
       <div className="w-20 h-20 bg-purple-50 text-purple-600 rounded-[32px] flex items-center justify-center mb-8 shadow-ios"><MapPin size={36} /></div>
       <h1 className="text-3xl font-black mb-3 tracking-tighter leading-none">{t.onboarding.locationTitle}</h1>
       <p className="text-gray-500 mb-12 font-medium max-w-[280px] leading-relaxed">{t.onboarding.locationSub}</p>
       <div className="w-full max-w-xs space-y-4">
          <button onClick={handleLocation} className="w-full py-5 bg-black text-white font-black rounded-3xl shadow-xl active:scale-95 transition-all">{t.onboarding.allowLoc}</button>
          <button onClick={() => onComplete(lang)} className="w-full py-4 text-gray-400 font-bold text-xs uppercase tracking-widest">{t.onboarding.nowNot}</button>
       </div>
    </div>
  );
};

export default OnboardingFlow;
