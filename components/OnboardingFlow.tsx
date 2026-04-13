
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Check, Loader2, Share2, Download } from 'lucide-react';
import { QUIZ_QUESTIONS, ARCHETYPES_DATA, getArchetypeFromAnswers } from '../constants';
import { PersonalityProfile, PersonalityArchetype, SocialEnergy } from '../types';

interface OnboardingFlowProps {
  onComplete: (profile: PersonalityProfile) => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [archetype, setArchetype] = useState<PersonalityArchetype | null>(null);

  const handleAnswer = (questionId: string, value: string) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 300);
    } else {
      // Last question answered
      setIsAnalyzing(true);
      const resultArchetype = getArchetypeFromAnswers(newAnswers);
      setArchetype(resultArchetype);
      
      setTimeout(() => {
        setIsAnalyzing(false);
        setShowResult(true);
      }, 2500);
    }
  };

  const handleFinish = () => {
    if (archetype) {
      onComplete({
        archetype,
        motive: answers.motive,
        energy: answers.energy as SocialEnergy,
        interest: answers.interest,
        atmosphere: answers.atmosphere
      });
    }
  };

  const progress = ((currentStep + 1) / QUIZ_QUESTIONS.length) * 100;

  if (showResult && archetype) {
    const data = ARCHETYPES_DATA[archetype];
    return (
      <div className="fixed inset-0 z-[100] bg-black/5 flex flex-col items-center justify-center p-4 font-sans overflow-hidden backdrop-blur-sm">
        {/* Click outside to exit */}
        <div className="absolute inset-0 z-0" onClick={handleFinish} />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-lg bg-white rounded-3xl shadow-ios-deep overflow-y-auto no-scrollbar flex flex-col items-center p-8 relative z-10 max-h-[85vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-200 via-purple-200 to-blue-200" />
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-6"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-400 mb-2 block">Your Atempo Personality is</span>
            <h1 className="text-4xl font-black tracking-tighter text-gray-900">{archetype}</h1>
          </motion.div>

          {/* CRITICAL: Large prominent space for illustration */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="w-64 h-64 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 relative group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-rose-100/50 to-blue-100/50 rounded-full blur-2xl opacity-50 group-hover:opacity-80 transition-opacity" />
            <img 
              src={data.illustration} 
              alt={archetype} 
              className="w-full h-full object-contain relative z-10"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center text-gray-500 font-medium leading-relaxed mb-8 px-4 text-sm"
          >
            {data.description}
          </motion.p>

          <div className="w-full grid grid-cols-2 gap-3 mb-8">
            <div className="bg-rose-50 p-4 rounded-2xl text-center">
              <span className="text-[9px] font-bold uppercase tracking-widest text-rose-400 block mb-1">Motive</span>
              <span className="text-xs font-black text-rose-900">{answers.motive}</span>
            </div>
            <div className="bg-blue-50 p-4 rounded-2xl text-center">
              <span className="text-[9px] font-bold uppercase tracking-widest text-blue-400 block mb-1">Energy</span>
              <span className="text-xs font-black text-blue-900">{answers.energy}</span>
            </div>
          </div>

          <button 
            onClick={handleFinish}
            className="w-full py-5 bg-black text-white rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            Enter Atempo <ChevronRight size={20} />
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-6 flex gap-6 relative z-10"
        >
          <button className="w-12 h-12 bg-white rounded-full shadow-ios flex items-center justify-center text-gray-400 active:scale-90 transition-transform"><Share2 size={20} /></button>
          <button className="w-12 h-12 bg-white rounded-full shadow-ios flex items-center justify-center text-gray-400 active:scale-90 transition-transform"><Download size={20} /></button>
        </motion.div>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#FDFCF8] flex flex-col items-center justify-center p-10 font-sans">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="mb-8 text-rose-400"
        >
          <Loader2 size={64} strokeWidth={3} />
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-black tracking-tighter text-center"
        >
          Analyzing your vibe...
        </motion.h2>
        <p className="text-gray-400 font-medium mt-2">Curating your unique profile</p>
      </div>
    );
  }

  const currentQuestion = QUIZ_QUESTIONS[currentStep];

  return (
    <div className="fixed inset-0 z-[100] bg-[#FDFCF8] flex flex-col font-sans overflow-hidden">
      {/* Progress Bar */}
      <div className="pt-12 px-8">
        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-black"
          />
        </div>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Step {currentStep + 1} of {QUIZ_QUESTIONS.length}</span>
          <button onClick={() => onComplete({
            archetype: PersonalityArchetype.EXPLORER,
            motive: 'A bit of everything',
            energy: 'The Catalyst',
            interest: 'Casual chat',
            atmosphere: 'Relaxed & mellow'
          })} className="text-[10px] font-black uppercase tracking-widest text-gray-300">Skip</button>
        </div>
      </div>

      {/* Question Content */}
      <div className="flex-1 flex flex-col px-8 pt-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="flex-1 flex flex-col"
          >
            <h2 className="text-4xl font-black tracking-tighter leading-[1.1] mb-12 text-gray-900">
              {currentQuestion.question}
            </h2>

            <div className="grid grid-cols-1 gap-4 overflow-y-auto no-scrollbar pb-12">
              {currentQuestion.options.map((option) => (
                <motion.button
                  key={option.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleAnswer(currentQuestion.id, option.value)}
                  className={`
                    w-full p-6 rounded-[32px] text-left transition-all flex items-center gap-5
                    ${answers[currentQuestion.id] === option.value 
                      ? 'bg-black text-white shadow-xl' 
                      : 'bg-white border-2 border-gray-50 text-gray-900 shadow-ios hover:border-gray-200'}
                  `}
                >
                  <span className="text-3xl">{option.icon}</span>
                  <div className="flex-1">
                    <span className="text-lg font-black tracking-tight block">{option.label}</span>
                    {option.sub && (
                      <span className={`text-xs font-medium block mt-0.5 ${answers[currentQuestion.id] === option.value ? 'text-gray-400' : 'text-gray-500'}`}>
                        {option.sub}
                      </span>
                    )}
                  </div>
                  {answers[currentQuestion.id] === option.value && (
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <Check size={18} />
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-rose-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};

export default OnboardingFlow;
