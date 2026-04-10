import React, { useState, useRef, useEffect } from 'react';
import { Event } from '../types';
import { X, Users, Clock, Flame, ShieldCheck, Info, MessageSquare, ArrowRight, Play, ChevronUp, ChevronDown, Heart, Share2, ArrowLeft, MoreVertical, MapPin, Calendar } from 'lucide-react';

interface EventDetailModalProps {
  event: Event;
  filteredEvents?: Event[];
  onClose: () => void;
  onAttend: (joinChat: boolean) => void;
  onOpenBusiness: (id: string) => void;
  onNavigate: (direction: 'next' | 'prev') => void;
  language: string;
}

const EventDetailModal: React.FC<EventDetailModalProps> = ({ event, onClose, onAttend, onOpenBusiness, onNavigate, language }) => {
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const cardRef = useRef<HTMLDivElement>(null);

  // Re-center when event changes
  useEffect(() => {
    setDragOffset({ x: 0, y: 0 });
    setIsDetailsExpanded(false);
  }, [event.id]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    
    const deltaX = currentX - touchStartX.current;
    const deltaY = currentY - touchStartY.current;
    
    // We update both offsets but we'll prioritize the dominant axis in the end
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const { x, y } = dragOffset;
    
    // Determine dominant axis
    if (Math.abs(x) > Math.abs(y)) {
      // Horizontal swipe: Navigation
      if (x > 100) {
        onNavigate('prev');
      } else if (x < -100) {
        onNavigate('next');
      } else {
        setDragOffset({ x: 0, y: 0 });
      }
    } else {
      // Vertical swipe: Expand/Collapse Details
      if (y < -60) {
        // Swipe up
        setIsDetailsExpanded(true);
      } else if (y > 60 && isDetailsExpanded) {
        // Swipe down when expanded
        setIsDetailsExpanded(false);
      }
      setDragOffset({ x: 0, y: 0 });
    }
  };

  // Visual effects based on drag (Tinder rotation + Vertical slide hint)
  const rotation = dragOffset.x * 0.05;
  const cardOpacity = Math.max(0.5, 1 - Math.abs(dragOffset.x) / 600);
  
  // Calculate dynamic transform for the info panel when dragging vertically
  const infoPanelTransform = isDetailsExpanded 
    ? `translateY(${Math.max(0, dragOffset.y)}px)` 
    : `translateY(${Math.min(0, dragOffset.y)}px)`;

  return (
    <div 
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-white/40 backdrop-blur-md animate-fade-in pointer-events-auto overflow-hidden" 
      onClick={onClose}
    >
      <div 
        ref={cardRef}
        key={event.id}
        className={`w-full max-w-sm h-[680px] relative transition-all duration-300 ${isDragging ? '' : 'ease-out'} rounded-[48px] overflow-hidden shadow-watercolor bg-white/60 border border-black/10`}
        style={{ 
          transform: `translateX(${dragOffset.x}px) rotate(${rotation}deg)`,
          opacity: cardOpacity
        }}
        onClick={e => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <button 
          onClick={onClose} 
          className="absolute -top-12 right-0 z-[350] w-10 h-10 bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-primary active:scale-95 transition-all border border-white/40 shadow-watercolor"
        >
          <X size={20} />
        </button>

        <div className="relative w-full h-full bg-white/60 backdrop-blur-md rounded-[40px] overflow-hidden shadow-watercolor flex flex-col border border-black/10">
          
          {/* MAIN CONTENT (Video + Quick Info) */}
          <div className="flex-1 relative bg-black">
            <video 
              src={event.videoUrl} 
              autoPlay 
              loop 
              muted 
              playsInline 
              poster={event.videoThumbnail}
              className="w-full h-full object-cover"
            />
            
            {/* Top Indicator Overlay */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-primary/50 to-transparent pointer-events-none p-6">
                <span className="text-[10px] font-bold text-white uppercase tracking-[0.3em] drop-shadow-md">Horizon Live</span>
            </div>

            {/* Floating details trigger button (also clickable) */}
            <button 
              onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
              className="absolute bottom-6 right-6 w-14 h-14 bg-white/60 backdrop-blur-md text-primary rounded-2xl flex flex-col items-center justify-center shadow-watercolor active:scale-95 transition-all border border-white/40 group z-20 animate-float"
            >
              {isDetailsExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} className="group-hover:text-primary transition-colors" />}
              <span className="text-[6px] font-bold uppercase mt-1">{isDetailsExpanded ? 'Cerrar' : 'Info'}</span>
            </button>

            {/* Bottom Bar Indicator - Swipe Up hint */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-60">
                <div className="w-8 h-1 bg-white/50 rounded-full"></div>
                <span className="text-[7px] font-bold text-white uppercase tracking-[0.3em]">Desliza arriba</span>
            </div>
          </div>

          {/* QUICK SUMMARY (Stays at the bottom) */}
          <div className="bg-white/60 backdrop-blur-md px-6 py-5 flex items-center justify-between border-t border-white/40 relative z-10 shrink-0">
            <div className="flex flex-col items-start min-w-0">
              <span className="text-[7px] font-bold text-primary uppercase tracking-widest mb-0.5">{event.category}</span>
              <h3 className="text-sm font-serif font-bold text-primary truncate w-full tracking-tight">{event.title}</h3>
            </div>
            
            <div className="flex items-center gap-4 shrink-0 ml-4">
              <div className="flex flex-col items-center">
                <Users size={14} className="text-primary mb-0.5" />
                <span className="text-[9px] font-bold text-primary">{event.attendees}</span>
              </div>
              <div className="w-[1px] h-6 bg-white/40"></div>
              <div className="flex flex-col items-center">
                <Clock size={14} className="text-primary mb-0.5" />
                <span className="text-[9px] font-bold text-primary">{event.time}</span>
              </div>
              <div className="w-[1px] h-6 bg-white/40"></div>
              <div className="flex flex-col items-center">
                <Flame size={14} className="text-primary mb-0.5" />
                <span className="text-[9px] font-bold text-primary">{event.averageAge || '25+'}</span>
              </div>
            </div>
          </div>

          {/* EXPANDABLE DETAILS PANEL (Slides up) */}
          <div 
            className={`absolute inset-0 z-30 bg-paper text-primary transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) flex flex-col shadow-watercolor`}
            style={{ 
                transform: isDetailsExpanded ? infoPanelTransform : `translateY(100%)`,
                top: '0' 
            }}
          >
            {/* Header / Top Bar */}
            <div className="flex justify-between items-center px-6 py-4 shrink-0">
              <button 
                onClick={() => setIsDetailsExpanded(false)}
                className="p-2 hover:bg-primary/5 rounded-full transition-colors text-primary/40"
              >
                <ArrowLeft size={24} />
              </button>
              <button className="p-2 hover:bg-primary/5 rounded-full transition-colors text-primary/40">
                <MoreVertical size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-32">
              {/* Action Buttons */}
              <div className="flex gap-3 mb-8 mt-2">
                <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-primary/10 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-primary/5 transition-colors text-primary/60 shadow-sm">
                  <Heart size={14} />
                  <span>Add to favorites</span>
                </button>
                <button className="flex items-center justify-center gap-2 py-3 px-6 border border-primary/10 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-primary/5 transition-colors text-primary/60 shadow-sm">
                  <Share2 size={14} />
                  <span>Share</span>
                </button>
              </div>

              {/* Title & Info */}
              <div className="space-y-4 mb-8">
                <h2 className="text-3xl font-serif font-bold tracking-tight leading-tight text-primary">{event.title}</h2>
                
                <div className="space-y-1">
                  <p className="text-primary/60 font-bold text-sm uppercase tracking-widest">
                    {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <p className="text-primary/80 text-base">
                    <span className="font-bold">Time:</span> {event.time}
                  </p>
                  <p className="text-primary/80 text-base underline decoration-1 underline-offset-4 cursor-pointer hover:text-primary transition-colors">
                    {event.address || 'Location details available upon booking'}
                  </p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-8">
                {event.tags?.map(tag => (
                  <span key={tag} className="px-3 py-1.5 bg-white/40 backdrop-blur-md rounded-lg text-[8px] font-bold uppercase tracking-widest text-primary/50 border border-white/60 shadow-sm">
                    {tag}
                  </span>
                )) || (
                  <span className="px-3 py-1.5 bg-white/40 backdrop-blur-md rounded-lg text-[8px] font-bold uppercase tracking-widest text-primary/50 border border-white/60 shadow-sm">
                    {event.category}
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="space-y-4 mb-10">
                <div className={`text-primary/70 leading-relaxed text-base font-medium ${!showFullDescription ? 'line-clamp-6' : ''}`}>
                  {event.description}
                </div>
                {event.description.length > 200 && (
                  <button 
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-primary font-bold text-xs uppercase tracking-widest hover:underline"
                  >
                    {showFullDescription ? 'Show less' : 'Show more'}
                  </button>
                )}
              </div>

              {/* Host Section */}
              <section className="mb-10">
                <h4 className="text-[9px] font-bold text-primary/30 uppercase tracking-[0.3em] mb-4">Vibe Host</h4>
                <button 
                  onClick={() => onOpenBusiness(event.hostId)}
                  className="w-full p-4 bg-white/40 backdrop-blur-md rounded-[28px] border border-white/60 flex items-center gap-4 hover:shadow-md transition-all group shadow-watercolor"
                >
                  <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white/40 shrink-0">
                    <img src={event.hostAvatar} className="w-full h-full object-cover" alt="Host" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h5 className="font-bold text-xs tracking-tight text-primary truncate">{event.hostName}</h5>
                      <ShieldCheck size={14} className="text-primary/40 shrink-0" />
                    </div>
                    <p className="text-[8px] font-bold text-primary/30 uppercase tracking-widest mt-0.5">Visitar Partner</p>
                  </div>
                  <ArrowRight size={18} className="text-primary/20 group-hover:text-primary transition-all" />
                </button>
              </section>
            </div>

            {/* Bottom Bar */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-paper via-paper to-transparent pt-12 flex items-center justify-between z-40">
              <div className="flex flex-col">
                {event.price && event.price > 0 ? (
                  <span className="text-2xl font-serif font-bold text-primary">{event.price.toFixed(2)} €</span>
                ) : (
                  <span className="text-2xl font-serif font-bold text-primary">Free</span>
                )}
              </div>
              <button 
                onClick={() => onAttend(true)}
                className="px-12 py-4 bg-primary text-white font-bold rounded-2xl hover:opacity-90 active:scale-95 transition-all shadow-glow-sunset uppercase tracking-[0.2em] text-[11px]"
              >
                Join
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;