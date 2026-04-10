
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
      description: "Tu Horizon ID ya está activo. Estás a punto de descubrir la ciudad como nunca antes.",
      icon: <Sparkles size={48} className="text-emerald-500" />,
      highlight: "Tu pasaporte cultural empieza aquí."
    },
    {
      title: "Explora el Mapa",
      description: "Encuentra eventos activos a tu alrededor. Los iconos con video te muestran el ambiente real ahora mismo.",
      icon: <Map size={48} className="text-emerald-500" />,
      highlight: "Sigue el Discovery de la ciudad."
    },
    {
      title: "Decide con Discovery",
      description: "Mira previews en video antes de ir. Sin filtros, sin esperas, solo la realidad del evento.",
      icon: <Compass size={48} className="text-purple-600" />,
      highlight: "Elige tu próxima experiencia en segundos."
    },
    {
      title: "Tus Recuerdos",
      description: "Captura y comparte 'Huellas' de los eventos. Construye tu historia y mejora tu Karma.",
      icon: <PlayCircle size={48} className="text-rose-500" />,
      highlight: "Tu legado cultural en un solo lugar."
    }
  ];

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      onFinish();
    }
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-black/40 backdrop-blur-xl animate-fade-in">
      <div className="bg-[#fdf2f2] w-full max-w-sm rounded-[48px] shadow-2xl overflow-hidden flex flex-col animate-scale-in relative border border-white/20">
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 flex gap-1 p-2">
            {slides.map((_, i) => (
                <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-emerald-500' : 'bg-gray-200'}`} />
            ))}
        </div>

        <div className="p-10 pt-16 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-white rounded-[32px] shadow-ios flex items-center justify-center mb-8 animate-pulse">
                {slides[step].icon}
            </div>

            <h2 className="text-3xl font-black text-black tracking-tighter leading-none mb-4">
                {slides[step].title}
            </h2>
            
            <p className="text-gray-500 text-sm font-medium leading-relaxed mb-6">
                {slides[step].description}
            </p>

            <div className="px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100 mb-10">
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                    {slides[step].highlight}
                </span>
            </div>

            <button 
                onClick={handleNext}
                className="w-full py-5 bg-black text-white font-black rounded-[28px] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 group"
            >
                <span className="uppercase tracking-[0.2em] text-[11px]">
                    {step === slides.length - 1 ? 'Empezar ahora' : 'Siguiente'}
                </span>
                {step === slides.length - 1 ? <CheckCircle2 size={18} /> : <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
        </div>

        <div className="pb-8 text-center">
            <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.3em]">Horizon Welcome Guide</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeGuide;
