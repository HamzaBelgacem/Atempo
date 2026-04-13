import React, { useMemo, useState, useEffect } from 'react';
import { Event, AppTheme, CATEGORIES, Business, User, UserType } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, MapPin, Heart, Plus, Sparkles, X, ChevronRight, Bookmark, Share2, ExternalLink, Mail, Globe as GlobeIcon, Calendar, ArrowLeft } from 'lucide-react';
import { MOCK_BUSINESSES } from '../constants';

interface DiscoverFeedProps {
  user: User;
  events: Event[];
  onAttend: (event: Event, e?: React.MouseEvent) => void;
  onEventClick: (event: Event, e?: React.MouseEvent) => void;
  onViewMap: (event: Event) => void;
  onHostClick: (hostId: string) => void;
  onStoryToggle?: (isOpen: boolean) => void;
  userLanguage?: string;
  userTheme?: AppTheme;
  currentCity: string;
  likedEventIds?: string[];
  onToggleLike?: (id: string) => void;
  businessStories?: { businessId: string; url: string; timestamp: number }[];
  onToggleCollaborate?: (eventId: string) => void;
  onCollaboratorClick?: (collaboratorId: string) => void;
}

const StoryViewer: React.FC<{ 
  initialBusinessIndex: number;
  businesses: Business[];
  onClose: () => void; 
  onViewProfile: (id: string) => void;
  businessStories: { businessId: string; url: string; timestamp: number }[];
}> = ({ initialBusinessIndex, businesses, onClose, onViewProfile, businessStories }) => {
  const [currentIndex, setCurrentIndex] = useState(initialBusinessIndex);
  const [progress, setProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const business = businesses[currentIndex];

  const storiesForBusiness = useMemo(() => {
    return businessStories.filter(s => s.businessId === business.id);
  }, [businessStories, business.id]);

  const displayImage = storiesForBusiness.length > 0 ? storiesForBusiness[0].url : business.coverImage;

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
          src={displayImage} 
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
        <div className="absolute bottom-24 right-6 flex flex-col gap-3 z-20 items-center">
            {/* LIKE BUTTON (Heart - Round) */}
            <button 
                onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
                className={`flex flex-col items-center transition-all ${isLiked ? 'animate-heart-pulse' : ''}`}
            >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isLiked ? 'bg-accent shadow-glow-sunset text-white' : 'bg-black/20 backdrop-blur-md border border-white/20 text-white'}`}>
                    <Heart size={18} className={isLiked ? 'fill-white' : ''} />
                </div>
                <span className="text-[8px] font-black text-white -mt-2 mb-1">{isLiked ? '1.2k' : '1.1k'}</span>
            </button>

            {/* SAVE BUTTON (Squircle) */}
            <button 
                onClick={(e) => { e.stopPropagation(); setIsSaved(!isSaved); }}
                className="flex flex-col items-center group"
            >
                <div className={`w-10 h-10 rounded-[12px] bg-black/20 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all ${isSaved ? 'text-amber-400' : 'text-white'} active:scale-95 group-hover:bg-white/30`}>
                    <Bookmark size={18} className={isSaved ? 'fill-current' : ''} />
                </div>
                <span className="text-[8px] font-black text-white -mt-2 mb-1">{isSaved ? 'Saved' : 'Save'}</span>
            </button>

            {/* SHARE BUTTON (Squircle) */}
            <button 
                onClick={(e) => { e.stopPropagation(); }}
                className="flex flex-col items-center group"
            >
                <div className="w-10 h-10 rounded-[12px] bg-black/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white active:scale-95 transition-all group-hover:bg-white/30">
                    <Share2 size={18} />
                </div>
                <span className="text-[8px] font-black text-white -mt-2 mb-1">Share</span>
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
  onToggleLike,
  businessStories = [],
  onToggleCollaborate,
  onCollaboratorClick
}) => {
  const isDark = userTheme === AppTheme.DARK;
  const [viewedStoryIds, setViewedStoryIds] = useState<string[]>([]);
  const [storyIndex, setStoryIndex] = useState<number | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [isBouncing, setIsBouncing] = useState(false);

  const ROME_GUIDE_DATA = {
    newsletters: [
      { name: 'Funweek Roma', description: 'The ultimate guide to concerts, festivals and clubbing in the Eternal City.', url: 'https://www.funweek.it', type: 'Newsletter & Web', icon: <Mail size={16} /> },
      { name: 'Zero Roma', description: 'Underground culture, art exhibitions, and the best nightlife spots.', url: 'https://zero.eu/it/roma/', type: 'Event Guide', icon: <GlobeIcon size={16} /> },
      { name: 'Wanted in Rome', description: 'English-language magazine for expats and tourists covering local news and events.', url: 'https://www.wantedinrome.com', type: 'Expats Guide', icon: <ExternalLink size={16} /> },
      { name: 'RomaToday Eventi', description: 'Real-time updates on local fairs, markets, and community events.', url: 'https://www.romatoday.it/eventi/', type: 'News & Events', icon: <Calendar size={16} /> },
      { name: 'Puntarella Rossa', description: 'The go-to source for foodies: new openings, food festivals, and restaurant reviews.', url: 'https://www.puntarellarossa.it', type: 'Food & Drink', icon: <Sparkles size={16} /> }
    ],
    featuredPosts: [
      { id: 'rp1', title: 'Spring in Villa Borghese', source: 'Zero Roma', date: 'Today', image: 'https://images.unsplash.com/photo-1525874684015-58379d421a52?q=80&w=400' },
      { id: 'rp2', title: 'Electronic Music Festival', source: 'Funweek', date: 'This Weekend', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400' },
      { id: 'rp3', title: 'Trastevere Food Tour', source: 'Puntarella Rossa', date: 'Tomorrow', image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=400' }
    ]
  };

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

  const featuredEvents = useMemo(() => {
    const userPrefs = user.preferences || [];
    
    // Sort by a combination of preference match and published date
    return [...events]
      .sort((a, b) => {
        // First, prioritize by tag matches
        const aMatches = (a.tags || []).filter(t => userPrefs.includes(t)).length;
        const bMatches = (b.tags || []).filter(t => userPrefs.includes(t)).length;
        
        if (bMatches !== aMatches) {
          return bMatches - aMatches;
        }
        
        // Then by category match
        const aCatMatch = userPrefs.includes(a.category) ? 1 : 0;
        const bCatMatch = userPrefs.includes(b.category) ? 1 : 0;
        
        if (bCatMatch !== aCatMatch) {
          return bCatMatch - aCatMatch;
        }

        // Finally, by publishedAt descending (What's New)
        const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 5);
  }, [events, user.preferences]);
  
  const eventsByCategory = useMemo(() => {
    const grouped: Record<string, Event[]> = {};
    const userPrefs = user.preferences || [];

    // Filter and group
    CATEGORIES.filter(c => c !== 'All').forEach(cat => {
      const filtered = events.filter(e => e.category === cat);
      if (filtered.length > 0) {
        // Sort events within category based on user tags (prioritize matches)
        const sorted = [...filtered].sort((a, b) => {
          const aMatches = (a.tags || []).filter(t => userPrefs.includes(t)).length;
          const bMatches = (b.tags || []).filter(t => userPrefs.includes(t)).length;
          return bMatches - aMatches;
        });
        grouped[cat] = sorted;
      }
    });

    // Sort categories based on user preferences (prioritize preferred categories)
    // We also consider if the category name itself is in preferences
    const sortedCategories = Object.keys(grouped).sort((a, b) => {
      const aIsPref = userPrefs.includes(a);
      const bIsPref = userPrefs.includes(b);
      
      if (aIsPref && !bIsPref) return -1;
      if (!aIsPref && bIsPref) return 1;
      
      // If both are preferred or both are not, check if they have events with matching tags
      const aHasTagMatch = grouped[a].some(e => (e.tags || []).some(t => userPrefs.includes(t)));
      const bHasTagMatch = grouped[b].some(e => (e.tags || []).some(t => userPrefs.includes(t)));
      
      if (aHasTagMatch && !bHasTagMatch) return -1;
      if (!aHasTagMatch && bHasTagMatch) return 1;
      
      return 0;
    });

    const finalGrouped: Record<string, Event[]> = {};
    sortedCategories.forEach(cat => {
      finalGrouped[cat] = grouped[cat];
    });

    return finalGrouped;
  }, [events, user.preferences]);

  const allStories = useMemo(() => {
    const businessesWithStories = MOCK_BUSINESSES.map(b => ({
      id: b.id,
      name: b.name,
      logo: b.logo,
      coverImage: b.coverImage,
      hasActiveContent: b.activeEventsCount > 0 || businessStories.some(s => s.businessId === b.id)
    }));
    return businessesWithStories;
  }, [businessStories]);

  const handleStoryClick = (index: number) => {
    const story = allStories[index];
    if (!viewedStoryIds.includes(story.id)) {
        setViewedStoryIds(prev => [...prev, story.id]);
    }
    setStoryIndex(index);
  };

  const StoryItem: React.FC<{ story: any; index: number }> = ({ story, index }) => {
    const isViewed = viewedStoryIds.includes(story.id);
    const hasActiveContent = story.hasActiveContent;
    
    return (
      <button 
        onClick={() => handleStoryClick(index)}
        className="flex flex-col items-center gap-1.5 flex-shrink-0"
      >
        <div className={`w-16 h-16 rounded-full p-[2px] border-[2.5px] transition-all duration-500 active:scale-90 shadow-sm ${hasActiveContent && !isViewed ? 'border-emerald-500' : 'border-[#432818]/10 opacity-60'}`}>
          <div className="w-full h-full rounded-full overflow-hidden border-[1.5px] border-white">
            <img src={story.logo} className="w-full h-full object-cover" alt={story.name} referrerPolicy="no-referrer" />
          </div>
        </div>
        <span className={`text-[9px] font-black uppercase tracking-tighter truncate w-16 text-center ${themeStyles.text} ${hasActiveContent && !isViewed ? 'opacity-100' : 'opacity-50'}`}>
            {story.name.split(' ')[0]}
        </span>
      </button>
    );
  };

  const DiscoveryCard: React.FC<{ event: Event, isLarge?: boolean, showTag?: boolean }> = ({ event, isLarge = false, showTag = false }) => {
    const categoryColor = useMemo(() => {
      const cat = event.category;
      if (['Live Music', 'Theatre', 'Dance', 'Comedy', 'Performance', 'Music'].includes(cat)) return 'bg-watercolor-music';
      if (['Exhibitions', 'Street Art', 'Installations', 'Art', 'Art & craft'].includes(cat)) return 'bg-watercolor-art';
      if (['Screenings', 'Indie', 'Q&A', 'Media'].includes(cat)) return 'bg-watercolor-tech';
      if (['Books', 'Poetry', 'Cultural Talks', 'Learning', 'Creative tech workshops'].includes(cat)) return 'bg-watercolor-tech';
      if (['Fashion shows', 'Design showcases', 'Fashion'].includes(cat)) return 'bg-watercolor-art';
      if (['Food culture experiences', 'Food'].includes(cat)) return 'bg-watercolor-food';
      if (['Local traditions', 'Cultural routes', 'Heritage'].includes(cat)) return 'bg-watercolor-art';
      if (['Design markets', 'Markets'].includes(cat)) return 'bg-watercolor-food';
      return 'bg-white/60';
    }, [event.category]);

    return (
      <div 
        onClick={(e) => onEventClick(event, e)}
        className={`relative flex-shrink-0 rounded-[16px] overflow-hidden group cursor-pointer active:scale-[0.98] transition-all shadow-watercolor border border-black/10 ${isLarge ? 'w-60 h-72' : 'w-44 h-56'}`}
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

        {user.type === UserType.BUSINESS && event.collaborators && event.collaborators.length > 0 && (
          <div className="absolute top-4 right-4 flex -space-x-2">
            {event.collaborators.slice(0, 3).map((collab) => (
              <div key={collab.id} className="w-6 h-6 rounded-full border border-white overflow-hidden shadow-sm">
                <img src={collab.avatarUrl || `https://api.dicebear.com/7.x/notionists/svg?seed=${collab.name}`} className="w-full h-full object-cover" alt={collab.name} referrerPolicy="no-referrer" />
              </div>
            ))}
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
      
      <AnimatePresence>
        {selectedCity === 'Rome' && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[900] bg-[#FDFCF8] flex flex-col overflow-y-auto no-scrollbar"
          >
            {/* Header */}
            <div className="sticky top-0 z-50 px-6 pt-12 pb-6 bg-[#FDFCF8]/80 backdrop-blur-xl border-b border-black/5 flex items-center gap-4">
              <button 
                onClick={() => setSelectedCity(null)}
                className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-[#432818] active:scale-90 transition-all"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h2 className="text-2xl font-serif font-bold text-[#432818]">Roma Guide</h2>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#432818]/40">Curated Event Sources</p>
              </div>
            </div>

            {/* Hero */}
            <div className="px-6 pt-6">
              <div className="w-full h-48 rounded-[32px] overflow-hidden relative shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=800" 
                  className="w-full h-full object-cover" 
                  alt="Rome" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles size={14} className="text-amber-400" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Premium Guide</span>
                  </div>
                  <h3 className="text-white text-3xl font-black tracking-tighter">ETERNAL CITY</h3>
                </div>
              </div>
            </div>

            {/* Featured Posts from Entities */}
            <div className="px-6 mt-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#432818]/60">Latest from Partners</h3>
                <button className="text-[10px] font-black uppercase tracking-widest text-accent">View All</button>
              </div>
              <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-6 px-6">
                {ROME_GUIDE_DATA.featuredPosts.map(post => (
                  <div key={post.id} className="w-48 flex-shrink-0 group cursor-pointer">
                    <div className="w-full aspect-[4/5] rounded-[24px] overflow-hidden mb-3 shadow-lg relative">
                      <img src={post.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={post.title} referrerPolicy="no-referrer" />
                      <div className="absolute top-3 left-3 px-2 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/20">
                        <span className="text-[8px] font-black text-white uppercase tracking-widest">{post.date}</span>
                      </div>
                    </div>
                    <h4 className="text-[13px] font-bold text-[#432818] leading-tight mb-1">{post.title}</h4>
                    <p className="text-[10px] font-medium text-[#432818]/40 uppercase tracking-widest">{post.source}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletters & Portals */}
            <div className="px-6 mt-12 pb-20">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#432818]/60 mb-6">Event Portals & Newsletters</h3>
              <div className="space-y-4">
                {ROME_GUIDE_DATA.newsletters.map((source, i) => (
                  <a 
                    key={i} 
                    href={source.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-white rounded-[24px] border border-black/5 shadow-sm active:scale-[0.98] transition-all group"
                  >
                    <div className="w-12 h-12 rounded-[18px] bg-accent/5 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                      {source.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[14px] font-black text-[#432818]">{source.name}</h4>
                        <span className="text-[8px] font-black text-accent uppercase tracking-widest bg-accent/10 px-2 py-0.5 rounded-full">{source.type}</span>
                      </div>
                      <p className="text-[11px] text-[#432818]/60 leading-snug mt-1">{source.description}</p>
                    </div>
                    <ChevronRight size={16} className="text-[#432818]/20 group-hover:text-accent transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {storyIndex !== null && (
        <StoryViewer 
          initialBusinessIndex={storyIndex}
          businesses={MOCK_BUSINESSES}
          onClose={() => setStoryIndex(null)} 
          onViewProfile={(id) => {
            setStoryIndex(null);
            onHostClick(id);
          }}
          businessStories={businessStories}
        />
      )}

      <div className="flex-1 overflow-y-auto no-scrollbar pt-8 pb-20">
        <motion.div
          animate={isBouncing ? { 
            y: [0, -12, 0],
            scaleY: [1, 1.03, 1],
            originY: 1
          } : { y: 0, scaleY: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          onAnimationComplete={() => setIsBouncing(false)}
        >
        <div className="px-6 mb-4 flex justify-between items-start">
           <div>
            <h1 className={`text-2xl font-serif font-bold tracking-tight mb-0.5 ${themeStyles.text}`}>Good discovery, {user.name}</h1>
            <p className={`text-[9px] font-bold uppercase tracking-[0.1em] opacity-40 ${themeStyles.text}`}>EXPLORE THE NEWEST EXPERIENCES</p>
           </div>
        </div>

        {/* BUSINESS STORIES */}
        <div className="mb-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar px-6 pb-2">
            {allStories.map((story, idx) => (
              <StoryItem key={story.id} story={story} index={idx} />
            ))}
          </div>
        </div>

        {/* WHAT'S NEW (DESTACADOS) SECTION */}
        <section className="mb-4">
          <div className="px-6 mb-3 flex items-center gap-4">
             <h3 className={`text-xl font-serif font-bold tracking-tight shrink-0 ${themeStyles.header}`}>What's new</h3>
             <div className={`h-[1px] flex-1 opacity-10 ${isDark ? 'bg-white' : 'bg-[#432818]'}`} />
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar px-6 pb-2">
            {featuredEvents.map((event) => (
              <DiscoveryCard key={`f-${event.id}`} event={event} isLarge={true} showTag={true} />
            ))}
          </div>
        </section>

        {/* CATEGORY ROWS */}
        {Object.entries(eventsByCategory).map(([category, catEvents], sIdx) => (
          <section key={category} className="mb-4">
            <SectionHeader title={category} />
            <div className="flex gap-2 overflow-x-auto no-scrollbar px-6 pb-2">
              {(catEvents as Event[]).map((event) => (
                <DiscoveryCard key={`c-${event.id}`} event={event} />
              ))}
            </div>
          </section>
        ))}

        {/* CITY GUIDES */}
        <section className="mb-4 mt-2">
          <SectionHeader title="City Guides" />
          <div className="flex gap-2 overflow-x-auto no-scrollbar px-6 pb-2">
             {[
               { name: 'Rome', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=800', locked: false, count: '124 Experiences' },
               { name: 'Bolonia', image: 'https://images.unsplash.com/photo-1541336032412-2048a678540d?q=80&w=800', locked: true, count: 'Coming Soon' },
               { name: 'Napoli', image: 'https://images.unsplash.com/photo-1523405493273-a82113872683?q=80&w=800', locked: true, count: 'Coming Soon' },
               { name: 'Venezia', image: 'https://images.unsplash.com/photo-1514890547357-a9ee2887ad8e?q=80&w=800', locked: true, count: 'Coming Soon' },
               { name: 'Milan', image: 'https://images.unsplash.com/photo-1520986606214-8b456906c813?q=80&w=800', locked: true, count: 'Coming Soon' },
             ].map((city) => (
               <div 
                 key={city.name} 
                 onClick={() => !city.locked && setSelectedCity(city.name)}
                 className="w-60 h-72 flex-shrink-0 rounded-[16px] overflow-hidden relative group cursor-pointer shadow-xl" 
                 style={{ boxShadow: '0 8px 32px -4px rgba(67, 40, 24, 0.12)' }}
               >
                  <img 
                    src={city.image} 
                    className={`absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${city.locked ? 'opacity-60' : 'opacity-100'}`} 
                    alt={city.name} 
                    referrerPolicy="no-referrer" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#432818]/90 via-transparent to-transparent" />
                  
                  {city.locked && (
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-[20px] flex items-center justify-center text-white border border-white/20">
                          <Lock size={20} />
                       </div>
                    </div>
                  )}

                  <div className="absolute bottom-6 left-6">
                     <h4 className="text-white font-black text-xl tracking-tighter">{city.name}</h4>
                     <p className={`text-[9px] font-black uppercase tracking-widest mt-1 ${city.locked ? 'text-white/30' : 'text-white/50'}`}>
                       {city.count}
                     </p>
                  </div>
               </div>
             ))}
          </div>
        </section>

        </motion.div>

        {/* Trigger for elastic bounce */}
        <motion.div 
          onViewportEnter={() => setIsBouncing(true)}
          className="h-1 w-full"
        />
      </div>
    </div>
  );
};

export default DiscoverFeed;