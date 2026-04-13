import React, { useState, useMemo, useRef, useEffect } from 'react';
import { User, ChatGroup, AppTheme, UserType } from '../types';
import { MessageSquare, Users, Briefcase, ArrowRight, Lock, Sparkles, Film, Music, Book, Palette, Globe, ChevronRight, Plus, Hash, PlayCircle, Gamepad2, Video, User as UserIcon, Search, Camera, X } from 'lucide-react';
import { TRANSLATIONS, MOCK_CLUBS } from '../constants';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';

interface ChatsListViewProps {
  user: User;
  onOpenChat: (chat: ChatGroup) => void;
  activeChats: ChatGroup[];
}

const ExplorarClubCard: React.FC<{ club: ChatGroup; onClick: () => void; index: number }> = ({ club, onClick, index }) => {
  // Predefined tints from the reference image
  const tints = [
    'bg-red-600/60',    // Red
    'bg-orange-800/60', // Deep Orange/Brown
    'bg-purple-700/60', // Purple
    'bg-yellow-600/60', // Yellow
    'bg-blue-600/60',   // Blue
  ];
  const tintClass = tints[index % tints.length];
  
  // Mock user count like in the image
  const userCount = 100 + Math.floor(Math.random() * 300);

  return (
    <button 
      onClick={onClick}
      className="relative aspect-[4/5] w-full rounded-[16px] overflow-hidden group shadow-watercolor active:scale-[0.96] transition-all border border-white/40"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Background Image - "Fit" to container */}
      <img 
        src={club.coverImage} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
        alt={club.name} 
        referrerPolicy="no-referrer"
      />
      
      {/* Color Overlay (Duotone effect simulation) */}
      <div className={`absolute inset-0 mix-blend-multiply ${tintClass} transition-opacity duration-500 group-hover:opacity-80`} />
      
      {/* Darker Bottom Gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent opacity-90" />

      {/* User Count Badge (Top Right) */}
      <div className="absolute top-3 right-3">
        <div className="flex items-center gap-1 px-2 py-0.5 bg-black/40 backdrop-blur-md border border-white/20 rounded-md">
          <UserIcon size={8} className="text-white" />
          <span className="text-[9px] font-black text-white">{userCount}</span>
        </div>
      </div>

      {/* Title (Bottom Left) */}
      <div className="absolute bottom-4 left-4 right-4 text-left">
        <h3 className="text-lg font-serif font-bold text-white leading-tight tracking-tight drop-shadow-md">
          {club.name}
        </h3>
      </div>
    </button>
  );
};

const StandardChatRow: React.FC<{ chat: ChatGroup; onClick: () => void; isDark: boolean }> = ({ chat, onClick, isDark }) => (
  <button 
    onClick={onClick}
    className={`w-full p-4 rounded-2xl border transition-all active:scale-[0.98] flex items-center gap-4 text-left group bg-white/60 border-white/40 shadow-watercolor`}
  >
    <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm relative shrink-0 border border-white/40">
      {chat.coverImage ? (
        <img src={chat.coverImage} className="w-full h-full object-cover" alt={chat.name} referrerPolicy="no-referrer" />
      ) : (
        <div className={`w-full h-full flex items-center justify-center font-bold text-lg bg-primary/5 text-primary/40`}>
          {chat.name.charAt(0)}
        </div>
      )}
      <div className="absolute bottom-1 right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-center mb-1">
        <h4 className="text-sm font-serif font-bold tracking-tight truncate text-primary">{chat.name}</h4>
        <span className="text-[8px] font-bold text-primary/40 uppercase tracking-widest">{chat.lastTime || '12m'}</span>
      </div>
      <p className={`text-[11px] font-bold truncate opacity-60 text-primary/60`}>{chat.lastMessage}</p>
    </div>
  </button>
);

const ChatsListView: React.FC<ChatsListViewProps> = ({ user, onOpenChat, activeChats }) => {
  const [isSearching, setIsSearching] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [displayedClubs, setDisplayedClubs] = useState<ChatGroup[]>(MOCK_CLUBS);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({
    container: scrollRef,
  });

  const titleScale = useTransform(scrollY, [0, 60], [1, 0.85]);
  const titleOpacity = useTransform(scrollY, [0, 60], [1, 0]);
  const titleBlur = useTransform(scrollY, [0, 60], ["blur(0px)", "blur(4px)"]);
  const titleY = useTransform(scrollY, [0, 60], [0, 60]);

  const t = useMemo(() => TRANSLATIONS[user.language] || TRANSLATIONS.en, [user.language]);
  const isDark = user.theme === AppTheme.DARK;

  const MOCK_SEARCH_RESULTS = [
    { id: 's1', title: 'Contemporary Art Collective', image: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?q=80&w=200' },
    { id: 's2', title: 'Underground Jazz Society', image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=200' },
    { id: 's3', title: 'Classical Literature Circle', image: 'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?q=80&w=200' },
    { id: 's4', title: 'Street Photography Guild', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=200' },
    { id: 's5', title: 'Independent Cinema Club', image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=200' },
    { id: 's6', title: 'Modern Sculpture Workshop', image: 'https://images.unsplash.com/photo-1544413647-ad539264244d?q=80&w=200' },
    { id: 's7', title: 'Digital Illustration Hub', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200' },
    { id: 's8', title: 'Renaissance History Group', image: 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?q=80&w=200' },
  ];

  const searchResults = searchQuery.trim() === '' 
    ? MOCK_SEARCH_RESULTS 
    : MOCK_SEARCH_RESULTS.filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleSelectClub = (result: typeof MOCK_SEARCH_RESULTS[0]) => {
    const alreadyExists = displayedClubs.find(c => c.id === result.id);
    
    if (!alreadyExists) {
      const newClub: ChatGroup = {
        id: result.id,
        name: result.title,
        eventId: 'club-context',
        type: 'CLUB',
        lastMessage: 'Welcome to the club!',
        lastTime: 'Just now',
        coverImage: result.image,
        tags: ['Art', 'Culture'],
        members: [{ name: user.name, gender: 'M', eventsAttended: 0, isTrusted: true, isHost: false }],
        messages: []
      };
      setDisplayedClubs(prev => [newClub, ...prev]);
      onOpenChat(newClub);
    } else {
      onOpenChat(alreadyExists);
    }
    
    setIsSearching(false);
    setSearchQuery('');
  };

  return (
    <div className={`h-full flex flex-col font-sans transition-colors duration-500 bg-transparent text-primary relative`}>
      
      {/* SEARCH OVERLAY */}
      <AnimatePresence>
        {isSearching && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed inset-0 z-[100] flex flex-col ${isDark ? 'bg-[#2D3436]' : 'bg-[#FDFCF8]'}`}
          >
            {/* Search Bar Top */}
            <div className="px-4 pt-12 pb-4 flex items-center gap-3">
              <div className={`flex-1 flex items-center gap-3 px-4 py-2.5 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/5'}`}>
                <Search size={18} className="opacity-40" />
                <input 
                  autoFocus
                  type="text"
                  placeholder="Search your clubs"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-sm font-bold placeholder:opacity-40"
                />
                {user.type === UserType.ARTIST_CURATOR && (
                  <Camera size={18} className="opacity-40" />
                )}
              </div>
              <button 
                onClick={() => {
                  setIsSearching(false);
                  setSearchQuery('');
                }}
                className="text-sm font-bold opacity-60"
              >
                Cancel
              </button>
            </div>

            {/* Results List */}
            <div className="flex-1 overflow-y-auto px-4 py-4 no-scrollbar">
              <div className="space-y-6">
                {searchResults.map((result) => (
                  <button 
                    key={result.id} 
                    onClick={() => handleSelectClub(result)}
                    className="w-full flex items-center gap-4 group text-left"
                  >
                    <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-white/10 shadow-sm">
                      <img src={result.image} className="w-full h-full object-cover" alt={result.title} referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold tracking-tight truncate">{result.title}</h4>
                    </div>
                    <div className="p-2 opacity-20 group-hover:opacity-100 transition-opacity">
                      <Plus size={16} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar pb-20">
          <motion.div
            animate={isBouncing ? { 
                y: [0, -10, 0],
                scaleY: [1, 1.02, 1],
                originY: 1
            } : { y: 0, scaleY: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            onAnimationComplete={() => setIsBouncing(false)}
          >
          {/* HEADER (Not sticky) */}
          <div className="px-6 pt-8 pb-4 relative h-[60px] flex items-center">
              <motion.div 
                style={{ 
                    scale: titleScale, 
                    opacity: titleOpacity, 
                    filter: titleBlur,
                    y: titleY,
                    zIndex: 10
                }}
                className="flex justify-between items-center w-full"
              >
                  <div>
                      <h1 className={`text-2xl font-serif font-bold tracking-tight mb-0.5 ${isDark ? 'text-white' : 'text-[#432818]'}`}>{t.chats.title}</h1>
                      <p className={`text-[9px] font-bold uppercase tracking-[0.1em] opacity-40 ${isDark ? 'text-white' : 'text-[#432818]'}`}>Join clubs to share and learn</p>
                  </div>
              </motion.div>
          </div>
          
          {/* SEARCH BAR TRIGGER (Sticky) */}
          <div className={`sticky top-0 z-20 px-5 py-4 backdrop-blur-xl ${isDark ? 'bg-[#2D3436]/40' : 'bg-white/40'}`}>
            <button 
              onClick={() => setIsSearching(true)}
              className={`w-full flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all active:scale-[0.98] ${isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/5'}`}
            >
              <Search size={18} className="opacity-40" />
              <span className="text-sm font-bold opacity-40">Search your clubs</span>
              <div className="flex-1" />
              {user.type === UserType.ARTIST_CURATOR && (
                <Camera size={18} className="opacity-40" />
              )}
            </button>
          </div>

          {/* SECTION: EXPLORAR (CLUBS) */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-1">
              {displayedClubs.map((club, idx) => (
                <ExplorarClubCard 
                  key={club.id} 
                  club={club} 
                  onClick={() => onOpenChat(club)} 
                  index={idx}
                />
              ))}
            </div>
          </div>
          </motion.div>
          <motion.div 
            onViewportEnter={() => setIsBouncing(true)}
            className="h-1 w-full"
          />
      </div>
    </div>
  );
};

export default ChatsListView;
