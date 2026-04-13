
import React from 'react';
import { Business, Event } from '../types';
import { X, ShieldCheck, MapPin, Users, Star, ArrowRight, Instagram, Globe } from 'lucide-react';
import { MOCK_EVENTS, EXPLORE_MEMORIES } from '../constants';

interface BusinessProfileModalProps {
  business: Business;
  onClose: () => void;
  onSelectEvent: (event: Event) => void;
}

const BusinessProfileModal: React.FC<BusinessProfileModalProps> = ({ business, onClose, onSelectEvent }) => {
  const activeEvents = MOCK_EVENTS.filter(e => e.hostId === business.id);
  const memories = EXPLORE_MEMORIES.filter(m => activeEvents.some(e => e.id === m.eventId));

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-6 animate-fade-in pointer-events-auto" onClick={onClose} style={{
      backgroundImage: `
        radial-gradient(at 0% 0%, rgba(255, 180, 200, 0.4) 0, transparent 70%),
        radial-gradient(at 100% 100%, rgba(220, 180, 255, 0.3) 0, transparent 70%)
      `,
      backgroundColor: 'rgba(253, 252, 248, 0.9)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)'
    }}>
      <div 
        className="bg-paper w-full max-w-sm rounded-[48px] overflow-hidden shadow-watercolor animate-scale-in flex flex-col max-h-[85vh] border border-black/10"
        onClick={e => e.stopPropagation()}
      >
        {/* Cover & Close */}
        <div className="h-44 w-full relative shrink-0">
            <img src={business.coverImage} className="w-full h-full object-cover" alt="Cover" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-t from-paper to-black/20"></div>
            <button 
                onClick={onClose} 
                className="absolute top-4 right-4 z-30 w-10 h-10 bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-primary active:scale-95 transition-all border border-white/40 shadow-watercolor"
            >
                <X size={20} />
            </button>
            {/* Logo Overlay */}
            <div className="absolute -bottom-8 left-8">
                <div className="w-20 h-20 rounded-[28px] bg-white/60 backdrop-blur-md p-1 shadow-watercolor border border-white/40">
                    <img src={business.logo} className="w-full h-full object-cover rounded-[24px]" alt="Logo" referrerPolicy="no-referrer" />
                </div>
            </div>
        </div>

        <div className="px-8 pt-12 pb-10 overflow-y-auto no-scrollbar">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-2xl font-serif font-bold tracking-tight text-primary leading-none">{business.name}</h2>
                        {business.verified && <ShieldCheck size={18} className="text-primary" />}
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-primary/40 uppercase tracking-widest">
                            <MapPin size={10} /> {business.location}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-primary uppercase tracking-widest">
                            <Star size={10} className="fill-current" /> {business.rating}
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="w-9 h-9 bg-white/40 backdrop-blur-md rounded-xl flex items-center justify-center text-primary border border-white/40 shadow-watercolor"><Instagram size={18} /></button>
                </div>
            </div>

            <p className="text-primary/60 text-[13px] font-bold leading-relaxed italic mb-8">
                "{business.description}"
            </p>

            <div className="flex gap-4 mb-10">
                <div className="flex-1 p-4 bg-white/40 backdrop-blur-md rounded-[28px] shadow-watercolor border border-white/40 flex flex-col items-center">
                    <span className="text-xl font-bold text-primary">{business.followers}</span>
                    <span className="text-[8px] font-bold text-primary/40 uppercase tracking-widest">Seguidores</span>
                </div>
                <div className="flex-1 p-4 bg-white/40 backdrop-blur-md rounded-[28px] shadow-watercolor border border-white/40 flex flex-col items-center">
                    <span className="text-xl font-bold text-primary">{business.activeEventsCount}</span>
                    <span className="text-[8px] font-bold text-primary/40 uppercase tracking-widest">Eventos Hoy</span>
                </div>
            </div>

            {/* Current Events */}
            <div className="mb-10">
                <h4 className="text-[10px] font-bold text-primary/40 uppercase tracking-[0.2em] mb-4">Eventos Activos</h4>
                <div className="space-y-3">
                    {activeEvents.map(event => (
                        <button 
                            key={event.id}
                            onClick={() => onSelectEvent(event)}
                            className="w-full flex items-center gap-4 p-3 bg-white/40 backdrop-blur-md rounded-2xl shadow-watercolor border border-white/40 hover:border-primary/20 transition-all text-left group"
                        >
                            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-white/40">
                                <img src={event.videoThumbnail} className="w-full h-full object-cover" alt="Event" referrerPolicy="no-referrer" />
                            </div>
                            <div className="flex-1">
                                <h5 className="text-[11px] font-bold text-primary leading-tight mb-1">{event.title}</h5>
                                <div className="flex items-center gap-3">
                                    <span className="text-[8px] font-bold uppercase text-primary/60">{event.time}</span>
                                </div>
                            </div>
                            <ArrowRight size={16} className="text-primary/20 group-hover:text-primary transition-all" />
                        </button>
                    ))}
                </div>
            </div>

            {/* Memories Gallery */}
            <div>
                <h4 className="text-[10px] font-bold text-primary/40 uppercase tracking-[0.2em] mb-4">Recuerdos</h4>
                <div className="grid grid-cols-3 gap-2">
                    {memories.map(memory => (
                        <div key={memory.id} className="aspect-square rounded-2xl overflow-hidden bg-white/40 border border-white/40 shadow-watercolor">
                            <img src={memory.url} className="w-full h-full object-cover" alt="Memory" referrerPolicy="no-referrer" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessProfileModal;
