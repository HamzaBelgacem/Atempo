
import React, { useState } from 'react';
import { X, ChevronRight, MapPin, Type, AlignLeft, CheckCircle2, ShieldCheck, Users2, Sparkles, Gavel, Info } from 'lucide-react';
import { User } from '../types';

interface CreateClubModalProps {
  user: User;
  onClose: () => void;
  onCreate: (clubData: any) => void;
}

const CreateClubModal: React.FC<CreateClubModalProps> = ({ user, onClose, onCreate }) => {
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [agreedToLegal, setAgreedToLegal] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    city: '',
    keywords: '',
    rules: '',
    administrator: user.name,
  });

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else {
      if (!agreedToLegal) return;
      setIsSuccess(true);
    }
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[700] flex items-center justify-center p-6 bg-white/40 backdrop-blur-xl animate-fade-in">
        <div className="bg-paper w-full max-w-sm rounded-[48px] shadow-watercolor overflow-hidden flex flex-col items-center text-center p-10 animate-scale-in border border-black/10">
          <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center mb-8 shadow-glow-sunset animate-bounce">
              <CheckCircle2 size={50} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-primary mb-4 tracking-tight">Club Created!</h2>
          <p className="text-primary/60 text-sm font-bold leading-relaxed mb-10 px-4">
            Your club "{formData.name}" has been successfully established. You can now start inviting members and managing your community.
          </p>
          <div className="w-full space-y-4">
            <button 
                onClick={() => onCreate(formData)}
                className="w-full py-5 bg-primary text-white rounded-2xl font-bold text-[11px] uppercase tracking-[0.2em] shadow-glow-sunset active:scale-95 transition-all flex items-center justify-center gap-3"
            >
                Go to Club
            </button>
            <button 
                onClick={onClose}
                className="text-[10px] font-bold text-primary/40 uppercase tracking-widest"
            >
                Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const LEGAL_TEXT = `
    Atempo Club Creation & Management Agreement

    1. PROPER BEHAVIOR: As a Club Creator, you commit to fostering an environment of respect, inclusivity, and safety. Harassment, discrimination, or any form of abusive behavior within your club will not be tolerated and may lead to immediate club dissolution.

    2. CONSTANT MANAGEMENT: You agree to actively manage and moderate your club. This includes responding to member reports, maintaining active discussions, and ensuring the club's content aligns with Atempo's community standards.

    3. EVENT PRIVILEGES: You acknowledge that the ability to create official Atempo events is a privilege granted to established and well-managed clubs. Atempo reserves the right to review club performance before enabling event creation features.

    4. COMPLIANCE: You agree to comply with all local laws and Atempo's global Terms of Service. You are responsible for all activities that occur within your club.

    5. MODERATION RIGHTS: Atempo reserves the right to monitor club activity and intervene, suspend, or remove any club that violates these terms or negatively impacts the community experience.

    By clicking "Create Club", you legally bind yourself to these rules and confirm your commitment to professional club management.
  `;

  return (
    <div className="fixed inset-0 z-[700] flex flex-col bg-[#FDFCF8] animate-fade-in overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0 opacity-40" style={{
          backgroundImage: `
            radial-gradient(at 0% 0%, rgba(252, 231, 243, 0.6) 0, transparent 70%),
            radial-gradient(at 100% 100%, rgba(243, 232, 255, 0.5) 0, transparent 70%),
            radial-gradient(at 50% 50%, rgba(220, 252, 231, 0.3) 0, transparent 70%)
          `
      }} />

      <div className="relative z-10 flex flex-col h-full">
        <div className="p-8 pt-12 pb-6 flex items-center justify-between border-b border-black/5">
            <div>
                <span className="text-[10px] font-black text-primary/40 uppercase tracking-[0.3em]">Establish a Club</span>
                <h2 className="text-2xl font-serif font-bold text-primary tracking-tight mt-1">Step {step} of 4</h2>
            </div>
            <button onClick={onClose} className="p-3 bg-white/60 backdrop-blur-md rounded-2xl text-primary/40 border border-white/40 shadow-sm active:scale-95 transition-all"><X size={20}/></button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-8">
            <div className="max-w-md mx-auto w-full">
                {step === 1 && (
                <div className="space-y-6 animate-fade-in">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-primary/40 uppercase tracking-widest ml-1">Club Name</label>
                        <div className="relative">
                            <Users2 className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={16} />
                            <input 
                                type="text" 
                                className="w-full pl-12 pr-6 py-4 bg-white/40 backdrop-blur-md rounded-2xl border border-white/40 text-sm font-bold outline-none focus:border-primary/20"
                                placeholder="e.g., Rome Jazz Enthusiasts"
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-primary/40 uppercase tracking-widest ml-1">Subject / Theme</label>
                        <div className="relative">
                            <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={16} />
                            <input 
                                type="text" 
                                className="w-full pl-12 pr-6 py-4 bg-white/40 backdrop-blur-md rounded-2xl border border-white/40 text-sm font-bold outline-none focus:border-primary/20"
                                placeholder="e.g., Music, Art, Technology"
                                value={formData.subject}
                                onChange={e => setFormData({...formData, subject: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-primary/40 uppercase tracking-widest ml-1">City</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={16} />
                            <input 
                                type="text" 
                                className="w-full pl-12 pr-6 py-4 bg-white/40 backdrop-blur-md rounded-2xl border border-white/40 text-sm font-bold outline-none focus:border-primary/20"
                                placeholder="e.g., Rome, Italy"
                                value={formData.city}
                                onChange={e => setFormData({...formData, city: e.target.value})}
                            />
                        </div>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-6 animate-fade-in">
                    <div className="space-y-2 text-left">
                        <label className="text-[10px] font-bold text-primary/40 uppercase tracking-widest ml-1">Keywords (comma separated)</label>
                        <div className="relative">
                            <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={16} />
                            <input 
                                type="text" 
                                className="w-full pl-12 pr-6 py-4 bg-white/40 backdrop-blur-md rounded-2xl border border-white/40 text-sm font-bold outline-none"
                                placeholder="e.g., jazz, vinyl, night, culture"
                                value={formData.keywords}
                                onChange={e => setFormData({...formData, keywords: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="space-y-2 text-left">
                        <label className="text-[10px] font-bold text-primary/40 uppercase tracking-widest ml-1">Club Administrator</label>
                        <div className="relative">
                            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={16} />
                            <input 
                                type="text" 
                                className="w-full pl-12 pr-6 py-4 bg-white/40 backdrop-blur-md rounded-2xl border border-white/40 text-sm font-bold outline-none"
                                value={formData.administrator}
                                onChange={e => setFormData({...formData, administrator: e.target.value})}
                            />
                        </div>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="space-y-6 animate-fade-in">
                    <div className="space-y-2 text-left">
                        <label className="text-[10px] font-bold text-primary/40 uppercase tracking-widest ml-1">Club Internal Rules</label>
                        <textarea 
                            className="w-full p-6 bg-white/40 backdrop-blur-md rounded-3xl border border-white/40 text-sm font-bold italic outline-none h-48 resize-none"
                            placeholder="Define how members should interact within your club..."
                            value={formData.rules}
                            onChange={e => setFormData({...formData, rules: e.target.value})}
                        />
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                        <Info size={16} className="text-blue-500 mt-0.5 shrink-0" />
                        <p className="text-[9px] font-bold text-blue-900/60 leading-relaxed uppercase tracking-widest">
                            These rules will be visible to all members before they join your club.
                        </p>
                    </div>
                </div>
            )}

            {step === 4 && (
                <div className="space-y-6 animate-fade-in">
                    <div className="space-y-2 text-left">
                        <label className="text-[10px] font-bold text-primary/40 uppercase tracking-widest ml-1">Legal Rules & Guidelines</label>
                        <div className="w-full p-6 bg-white/40 backdrop-blur-md rounded-3xl border border-white/40 text-[10px] font-bold text-primary/60 leading-relaxed h-64 overflow-y-auto no-scrollbar whitespace-pre-line">
                            {LEGAL_TEXT}
                        </div>
                    </div>
                    <label className="flex items-center gap-3 p-4 bg-white/40 backdrop-blur-md rounded-2xl border border-white/40 cursor-pointer active:scale-[0.98] transition-all">
                        <input 
                            type="checkbox" 
                            className="w-5 h-5 rounded-lg border-2 border-primary/20 text-primary focus:ring-primary"
                            checked={agreedToLegal}
                            onChange={e => setAgreedToLegal(e.target.checked)}
                        />
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">I agree to the Club Legal Rules</span>
                    </label>
                </div>
            )}
            </div>
        </div>

        <div className="p-8 pb-12 border-t border-black/5 bg-white/20 backdrop-blur-md">
            <div className="max-w-md mx-auto w-full flex gap-3">
                {step > 1 && (
                    <button 
                        onClick={() => setStep(step - 1)}
                        className="flex-1 py-5 bg-white/60 text-primary/40 border border-white/40 rounded-2xl font-bold text-[11px] uppercase tracking-[0.2em] active:scale-95 transition-all"
                    >
                        Back
                    </button>
                )}
                <button 
                    onClick={handleNext}
                    disabled={step === 4 && !agreedToLegal}
                    className={`flex-[2] py-5 ${step === 4 && !agreedToLegal ? 'bg-gray-200 text-gray-400' : 'bg-primary text-white shadow-glow-sunset'} rounded-2xl font-bold text-[11px] uppercase tracking-[0.2em] active:scale-95 transition-all flex items-center justify-center gap-3`}
                >
                    {step === 4 ? 'Create Club' : 'Next'}
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CreateClubModal;
