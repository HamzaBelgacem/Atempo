import React, { useMemo, useState, useEffect } from 'react';
import { Event, AppTheme, CATEGORIES, Business, User } from '../types';
import { Lock, MapPin, Heart, Plus, Sparkles, X, ChevronRight, MessageSquare, Bookmark } from 'lucide-react';
import { MOCK_BUSINESSES } from '../constants';

interface DiscoverFeedProps {
  user: User;
  events: Event[];
  onAttend: (event: Event) => void;
  onEventClick: (event: Event) => void;
  onViewMap: (event: Event) => void;
  onHostClick: (hostId: string) => void;
  onStoryToggle?: (isOpen: boolean) => void;
  userLanguage?: string;
  userTheme?: AppTheme;
  currentCity: string;
  likedEventIds?: string[];
  onToggleLike?: (id: string) => void;
}

const StoryViewer: React.FC<{ 
  initialBusinessIndex: number;
  businesses: Business[];
  onClose: () => void; 
  onViewProfile: (id: string) => void;
}> = ({ initialBusinessIndex, businesses, onClose, onViewProfile }) => {
  const [currentIndex, setCurrentIndex] = useState(initialBusinessIndex);
  const [progress, setProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const business = businesses[currentIndex];

  useEffect(() => {
    setProgress(0);
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + 1;
      });
    }, 50);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < businesses.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleScreenTouch = (e: React.MouseEvent) => {
    const x = e.clientX;
    const width = window.innerWidth;
    if (x < width * 0.3) {
      handlePrev();
    } else {
      handleNext();
    }
  };

  return (
    <div className="fixed inset-0 z-[800] bg-black animate-fade-in flex flex-col select-none overflow-hidden">
      <style>{`
        @keyframes shooting-star {
          0% { transform: translateX(-100%) translateY(0); opacity: 0; }
          10% { opacity: 1; }
          30% { transform: translateX(200%) translateY(0); opacity: 0; }
          100% { transform: translateX(200%) translateY(0); opacity: 0; }
        }
        @keyframes heart-pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
        .animate-heart-pulse {
          animation: heart-pulse 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .shooting-star-line {
          position: absolute;
          top: 0;
          left: 0;
          width: 150px;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent);
          animation: shooting-star 6s infinite linear;
          pointer-events: none;
          z-index: 100;
        }
      `}</style>
      
      {/* Decorative Shooting Star */}
      <div className="shooting-star-line" style={{ top: '2px' }} />
      <div className="shooting-star-line" style={{ top: 'auto', bottom: '2px', animationDelay: '3s' }} />

      {/* Tap Areas Overlay */}
      <div 
        className="absolute inset-0 z-10 flex"
        onClick={handleScreenTouch}
      />

      {/* Progress Bar with Sunset Gradient */}
      <div className="absolute top-4 left-4 right-4 z-50 flex gap-1">
        {businesses.map((_, i) => (
          <div key={i} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-100 ease-linear ${i === currentIndex ? 'bg-sunset-gradient' : (i < currentIndex ? 'w-full bg-white/40' : 'w-0')}`} 
              style={i === currentIndex ? { width: `${progress}%` } : {}}
            />
          </div>
        ))}
      </div>

      {/* Media Content */}
      <div className="flex-1 relative">
        <img 
          src={business.coverImage} 
          className="w-full h-full object-cover" 
          alt={business.name} 
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
        
        {/* Top Header */}
        <div className="absolute top-10 left-6 flex items-center gap-3 z-20">
          <div className="w-8 h-8 rounded-full border border-white/20 p-0.5">
            <img src={business.logo} className="w-full h-full object-cover rounded-full" alt={business.name} referrerPolicy="no-referrer" />
          </div>
          <div>
            <h4 className="text-white font-black text-[11px] tracking-tight">{business.name}</h4>
            <span className="text-white/40 text-[7px] font-black uppercase tracking-widest">Sponsored</span>
          </div>
        </div>

        <button 
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="absolute top-10 right-6 p-2 bg-white/10 backdrop-blur-md rounded-full text-white z-20 active:scale-90"
        >
          <X size={20} />
        </button>

        {/* Action Buttons (Bottom Right) */}
        <div className="absolute bottom-24 right-6 flex flex-col gap-6 z-20 items-center">
            {/* LIKE BUTTON (Heart - Round) */}
            <button 
                onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
                className={`flex flex-col items-center gap-1 transition-all ${isLiked ? 'animate-heart-pulse' : ''}`}
            >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isLiked ? 'bg-accent shadow-glow-sunset text-white' : 'bg-black/20 backdrop-blur-md border border-white/20 text-white'}`}>
                    <Heart size={28} className={isLiked ? 'fill-white' : ''} />
                </div>
                <span className="text-[10px] font-black text-white">{isLiked ? '1.2k' : '1.1k'}</span>
            </button>

            {/* COMMENT BUTTON (Squircle) */}
            <button 
                onClick={(e) => { e.stopPropagation(); }}
                className="flex flex-col items-center gap-1 group"
            >
                <div className="w-14 h-14 rounded-[18px] bg-black/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white active:scale-95 transition-all group-hover:bg-white/30">
                    <MessageSquare size={24} />
                </div>
                <span className="text-[10px] font-black text-white">42</span>
            </button>

            {/* SAVE BUTTON (Squircle) */}
            <button 
                onClick={(e) => { e.stopPropagation(); setIsSaved(!isSaved); }}
                className="flex flex-col items-center gap-1 group"
            >
                <div className={`w-14 h-14 rounded-[18px] bg-black/20 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all ${isSaved ? 'text-amber-400' : 'text-white'} active:scale-95 group-hover:bg-white/30`}>
                    <Bookmark size={24} className={isSaved ? 'fill-current' : ''} />
                </div>
                <span className="text-[10px] font-black text-white">{isSaved ? 'Saved' : 'Save'}</span>
            </button>
        </div>

        {/* Bottom Content (Tap to visit) */}
        <div className="absolute bottom-16 left-0 right-0 px-8 flex flex-col items-center text-center z-20 pointer-events-none">
          <button 
            onClick={(e) => { e.stopPropagation(); onViewProfile(business.id); }}
            className="group flex flex-col items-center gap-3 active:scale-95 transition-all pointer-events-auto"
          >
            <div className="flex flex-col items-center">
              <span className="text-white/40 text-[9px] font-black uppercase tracking-[0.4em] mb-1">Visit Profile</span>
              <h2 className="text-xl font-black text-white tracking-tighter mb-4 decoration-white/10 underline-offset-4 underline">{business.name}</h2>
            </div>
            <div className="w-10 h-10 rounded-[16px] bg-white flex items-center justify-center text-black shadow-2xl group-hover:scale-110 transition-transform">
              <ChevronRight size={18} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

const DiscoverFeed: React.FC<DiscoverFeedProps> = ({ 
  user,
  events, 
  onEventClick, 
  onHostClick, 
  onStoryToggle,
  userTheme = AppTheme.ROSE,
  currentCity,
  likedEventIds = [],
  onToggleLike
}) => {
  const isDark = userTheme === AppTheme.DARK;
  const [viewedStoryIds, setViewedStoryIds] = useState<string[]>([]);
  const [storyIndex, setStoryIndex] = useState<number | null>(null);

  useEffect(() => {
    onStoryToggle?.(storyIndex !== null);
    return () => onStoryToggle?.(false);
  }, [storyIndex, onStoryToggle]);

  const themeStyles = useMemo(() => {
    if (userTheme === AppTheme.DARK) {
      return { bg: 'bg-transparent', text: 'text-white', secondaryText: 'text-slate-400', header: 'text-white/90', accent: 'text-accent', accentHover: 'hover:text-accent' };
    }
    return { 
      bg: 'bg-transparent',
      text: 'text-[#432818]', 
      secondaryText: '#997b66', 
      header: 'text-[#432818]', 
      accent: 'text-accent', 
      accentHover: 'hover:text-accent' 
    };
  }, [userTheme]);

  const featuredEvents = useMemo(() => events.filter(e => e.status === 'active').slice(0, 5), [events]);
  
  const eventsByCategory = useMemo(() => {
    const grouped: Record<string, Event[]> = {};
    CATEGORIES.filter(c => c !== 'All').forEach(cat => {
      const filtered = events.filter(e => e.category === cat);
      if (filtered.length > 0) grouped[cat] = filtered;
    });
    return grouped;
  }, [events]);

  const handleStoryClick = (index: number) => {
    const business = MOCK_BUSINESSES[index % MOCK_BUSINESSES.length];
    if (!viewedStoryIds.includes(business.id)) {
        setViewedStoryIds(prev => [...prev, business.id]);
    }
    setStoryIndex(index % MOCK_BUSINESSES.length);
  };

  const StoryItem: React.FC<{ business: Business; index: number }> = ({ business, index }) => {
    const isViewed = viewedStoryIds.includes(business.id);
    const hasActiveContent = business.activeEventsCount > 0;
    
    // Per request: Excluded from color change - remains emerald/green
    return (
      <button 
        onClick={() => handleStoryClick(index)}
        className="flex flex-col items-center gap-1.5 flex-shrink-0"
      >
        <div className={`w-16 h-16 rounded-full p-[2px] border-[2.5px] transition-all duration-500 active:scale-90 shadow-sm ${hasActiveContent && !isViewed ? 'border-emerald-500' : 'border-[#432818]/10 opacity-60'}`}>
          <div className="w-full h-full rounded-full overflow-hidden border-[1.5px] border-white">
            <img src={business.logo} className="w-full h-full object-cover" alt={business.name} referrerPolicy="no-referrer" />
          </div>
        </div>
        <span className={`text-[9px] font-black uppercase tracking-tighter truncate w-16 text-center ${themeStyles.text} ${hasActiveContent && !isViewed ? 'opacity-100' : 'opacity-50'}`}>
            {business.name.split(' ')[0]}
        </span>
      </button>
    );
  };

  const DiscoveryCard: React.FC<{ event: Event, isLarge?: boolean, showTag?: boolean }> = ({ event, isLarge = false, showTag = false }) => {
    const categoryColor = useMemo(() => {
      switch (event.category) {
        case 'Art': return 'bg-watercolor-art';
        case 'Music': return 'bg-watercolor-music';
        case 'Food': return 'bg-watercolor-food';
        case 'Tech': return 'bg-watercolor-tech';
        case 'Nightlife': return 'bg-watercolor-party';
        case 'Sport': return 'bg-watercolor-wellness';
        default: return 'bg-white/60';
      }
    }, [event.category]);

    return (
      <div 
        onClick={() => onEventClick(event)}
        className={`relative flex-shrink-0 rounded-[32px] overflow-hidden group cursor-pointer active:scale-[0.98] transition-all shadow-watercolor border border-black/10 ${isLarge ? 'w-60 h-72' : 'w-44 h-56'}`}
      >
        <img src={event.videoThumbnail} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={event.title} referrerPolicy="no-referrer" />
        <div className={`absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent`} />
        
        {showTag && (
          <div className="absolute top-4 left-4">
              <div className={`px-3 py-1 rounded-full ${categoryColor} backdrop-blur-md border border-white/40 shadow-sm`}>
                  <span className="text-[8px] font-bold text-primary uppercase tracking-widest">{event.category}</span>
              </div>
          </div>
        )}

        <div className="absolute bottom-6 left-6 right-6">
            <h4 className="text-white font-serif font-bold text-lg tracking-tight leading-tight group-hover:translate-y-[-2px] transition-transform">{event.title}</h4>
        </div>
      </div>
    );
  };

  const SectionHeader = ({ title }: { title: string }) => (
    <div className="px-6 mb-2 flex items-center gap-4">
      <h3 className={`text-lg font-serif font-bold tracking-tight shrink-0 ${themeStyles.header}`}>{title}</h3>
      <div className={`h-[1px] flex-1 opacity-10 ${isDark ? 'bg-white' : 'bg-[#432818]'}`} />
    </div>
  );

  return (
    <div className={`flex flex-col w-full h-full font-sans relative overflow-hidden transition-colors duration-500 ${themeStyles.bg}`}>
      
      {storyIndex !== null && (
        <StoryViewer 
          initialBusinessIndex={storyIndex}
          businesses={MOCK_BUSINESSES}
          onClose={() => setStoryIndex(null)} 
          onViewProfile={(id) => {
            setStoryIndex(null);
            onHostClick(id);
          }}
        />
      )}

      <div className="flex-1 overflow-y-auto no-scrollbar pt-8 pb-40">
        
        <div className="px-6 mb-4 flex justify-between items-start">
           <div>
            <h1 className={`text-2xl font-serif font-bold tracking-tight mb-0.5 ${themeStyles.text}`}>Good discovery, {user.name}</h1>
            <p className={`text-[9px] font-bold uppercase tracking-[0.1em] opacity-40 ${themeStyles.text}`}>EXPLORE THE NEWEST EXPERIENCES</p>
           </div>
        </div>

        {/* BUSINESS STORIES */}
        <div className="mb-4">
          <div className="flex gap-4 overflow-x-auto no-scrollbar px-6 pb-2">
            {MOCK_BUSINESSES.map((biz, idx) => (
              <StoryItem key={biz.id} business={biz} index={idx} />
            ))}
          </div>
        </div>

        {/* WHAT'S NEW (DESTACADOS) SECTION */}
        <section className="mb-4">
          <div className="px-6 mb-3 flex items-center gap-4">
             <h3 className={`text-xl font-serif font-bold tracking-tight shrink-0 ${themeStyles.header}`}>What's new</h3>
             <div className={`h-[1px] flex-1 opacity-10 ${isDark ? 'bg-white' : 'bg-[#432818]'}`} />
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar px-6 pb-2">
            {featuredEvents.map((event) => (
              <DiscoveryCard key={`f-${event.id}`} event={event} isLarge={true} showTag={true} />
            ))}
          </div>
        </section>

        {/* CATEGORY ROWS */}
        {Object.entries(eventsByCategory).map(([category, catEvents], sIdx) => (
          <section key={category} className="mb-4">
            <SectionHeader title={category} />
            <div className="flex gap-4 overflow-x-auto no-scrollbar px-6 pb-2">
              {(catEvents as Event[]).map((event) => (
                <DiscoveryCard key={`c-${event.id}`} event={event} />
              ))}
            </div>
          </section>
        ))}

        {/* CITY GUIDES */}
        <section className="mb-4 mt-2">
          <SectionHeader title="City Guides" />
          <div className="flex gap-4 overflow-x-auto no-scrollbar px-6 pb-2">
             <div className="w-60 h-72 flex-shrink-0 rounded-[32px] overflow-hidden relative group cursor-pointer shadow-xl" style={{ boxShadow: '0 8px 32px -4px rgba(67, 40, 24, 0.12)' }}>
                <img src="https://images.unsplash.com/photo-1541336032412-2048a678540d?q=80&w=800" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Praga" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#432818]/90 via-transparent to-transparent" />
                <div className="absolute top-5 left-5">
                   <div className="w-9 h-9 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20">
                      <Lock size={16} />
                   </div>
                </div>
                <div className="absolute bottom-6 left-6">
                   <h4 className="text-white font-black text-xl tracking-tighter">Valencia</h4>
                   <p className="text-white/50 text-[9px] font-black uppercase tracking-widest mt-1">34 Experiences</p>
                </div>
             </div>
             <div className="w-60 h-72 flex-shrink-0 rounded-[32px] overflow-hidden relative group cursor-pointer shadow-xl" style={{ boxShadow: '0 8px 32px -4px rgba(67, 40, 24, 0.12)' }}>
                <img src="https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=800" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60" alt="Madrid" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#432818]/90 via-transparent to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-[20px] flex items-center justify-center text-white border border-white/20">
                      <Lock size={20} />
                   </div>
                </div>
                <div className="absolute bottom-6 left-6">
                   <h4 className="text-white font-black text-xl tracking-tighter">Madrid</h4>
                   <p className="text-white/30 text-[9px] font-black uppercase tracking-widest mt-1">Coming Soon</p>
                </div>
             </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default DiscoverFeed;