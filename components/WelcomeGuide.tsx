
import React, { useState } from 'react';
import { X, Map, Compass, PlayCircle, User as UserIcon, Sparkles, ChevronRight, CheckCircle2 } from 'lucide-react';

interface WelcomeGuideProps {
  userName: string;
  onFinish: () => void;
}

const WelcomeGuide: React.FC<WelcomeGuideProps> = ({ userName, onFinish }) => {
  const [step, setStep] = useState(0);

  const slides = [
    {
      title: `¡Hola, ${userName}!`,
      description: "Tu Atempo ID ya está activo. Estás a punto de descubrir la ciudad como nunca antes.",
      icon: <Sparkles size={48} className="text-white" />,
      highlight: "Tu pasaporte cultural empieza aquí.",
      color: "from-rose-400 to-orange-400",
      accent: "bg-rose-500",
      light: "bg-rose-50"
    },
    {
      title: "Explora el Mapa",
      description: "Encuentra eventos activos a tu alrededor. Los iconos con video te muestran el ambiente real ahora mismo.",
      icon: <Map size={48} className="text-white" />,
      highlight: "Sigue el Discovery de la ciudad.",
      color: "from-emerald-400 to-teal-400",
      accent: "bg-emerald-500",
      light: "bg-emerald-50"
    },
    {
      title: "Decide con Discovery",
      description: "Mira previews en video antes de ir. Sin filtros, sin esperas, solo la realidad del evento.",
      icon: <Compass size={48} className="text-white" />,
      highlight: "Elige tu próxima experiencia en segundos.",
      color: "from-purple-400 to-indigo-400",
      accent: "bg-purple-500",
      light: "bg-purple-50"
    },
    {
      title: "Tus Recuerdos",
      description: "Captura y comparte 'Huellas' de los eventos. Construye tu historia y mejora tu Karma.",
      icon: <PlayCircle size={48} className="text-white" />,
      highlight: "Tu legado cultural en un solo lugar.",
      color: "from-blue-400 to-cyan-400",
      accent: "bg-blue-500",
      light: "bg-blue-50"
    }
  ];

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      onFinish();
    }
  };

  const currentSlide = slides[step];

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-black/40 backdrop-blur-xl animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-scale-in relative border border-white/20">
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 flex gap-1.5 p-4 z-10">
            {slides.map((_, i) => (
                <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-white shadow-sm' : 'bg-white/30'}`} />
            ))}
        </div>

        {/* Colorful Header Section */}
        <div className={`h-48 w-full bg-gradient-to-br ${currentSlide.color} flex items-center justify-center relative overflow-hidden`}>
            <div className="absolute inset-0 opacity-20">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white rounded-full blur-3xl" />
            </div>
            <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl shadow-lg flex items-center justify-center border border-white/30 animate-float">
                {currentSlide.icon}
            </div>
        </div>

        <div className="p-10 flex flex-col items-center text-center">
            <h2 className="text-3xl font-serif font-bold text-primary tracking-tight mb-4">
                {currentSlide.title}
            </h2>
            
            <p className="text-primary/60 text-base font-medium leading-relaxed mb-8">
                {currentSlide.description}
            </p>

            <div className={`px-5 py-2.5 ${currentSlide.light} rounded-2xl mb-10 transition-colors duration-500`}>
                <span className={`text-[11px] font-black uppercase tracking-widest ${currentSlide.accent.replace('bg-', 'text-')}`}>
                    {currentSlide.highlight}
                </span>
            </div>

            <button 
                onClick={handleNext}
                className={`w-full py-5 ${currentSlide.accent} text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-3 group`}
            >
                <span className="uppercase tracking-[0.2em] text-[12px] font-black">
                    {step === slides.length - 1 ? 'Empezar ahora' : 'Siguiente'}
                </span>
                {step === slides.length - 1 ? <CheckCircle2 size={20} /> : <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />}
            </button>
        </div>

        <div className="pb-8 text-center">
            <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.3em]">Atempo Welcome Guide</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeGuide;
