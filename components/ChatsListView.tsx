import React, { useState, useMemo, useRef, useEffect } from 'react';
import { User, ChatGroup, AppTheme } from '../types';
import { MessageSquare, Users, Briefcase, Search, ArrowRight, Lock, Sparkles, Film, Music, Book, Palette, Globe, ChevronRight, Plus, Hash, PlayCircle, Gamepad2, Video, User as UserIcon } from 'lucide-react';
import { TRANSLATIONS, MOCK_CLUBS } from '../constants';

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
      className="relative aspect-[4/5] w-full rounded-[24px] overflow-hidden group shadow-watercolor active:scale-[0.96] transition-all border border-white/40"
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
    className={`w-full p-4 rounded-[32px] border transition-all active:scale-[0.98] flex items-center gap-4 text-left group bg-white/60 border-white/40 shadow-watercolor`}
  >
    <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm relative shrink-0 border border-white/40">
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
  const [activeTab, setActiveTab] = useState<'EVENTS' | 'FRIENDS' | 'BUSINESS' | 'CLUBS'>('EVENTS');
  const recentChatsRef = useRef<HTMLDivElement>(null);
  
  const t = useMemo(() => TRANSLATIONS[user.language] || TRANSLATIONS.en, [user.language]);
  const isDark = user.theme === AppTheme.DARK;

  const filteredChats = useMemo(() => {
    return activeChats.filter(chat => {
      if (activeTab === 'EVENTS') return chat.type === 'EVENT' || !chat.type;
      if (activeTab === 'FRIENDS') return chat.type === 'FRIEND';
      if (activeTab === 'BUSINESS') return chat.type === 'BUSINESS';
      if (activeTab === 'CLUBS') return chat.type === 'CLUB';
      return false;
    });
  }, [activeChats, activeTab]);

  return (
    <div className={`h-full flex flex-col font-sans transition-colors duration-500 bg-transparent text-primary`}>
      
      {/* HEADER & TABS */}
      <div className={`px-6 pt-6 pb-6 sticky top-0 z-20 backdrop-blur-xl bg-white/40`}>
          <div className="flex justify-between items-center mb-4">
              <div>
                  <h1 className="text-3xl font-serif font-bold tracking-tight text-[#432818]">{t.chats.title}</h1>
              </div>
              <button className={`w-7 h-7 rounded-full flex items-center justify-center transition-all active:scale-95 bg-white/60 text-slate-400 border border-white/40 shadow-sm`}>
                  <Search size={12} />
              </button>
          </div>

          <div className={`flex gap-1 p-1 rounded-[24px] bg-white/60 border border-white/40 shadow-sm backdrop-blur-md`}>
              {[
                  { id: 'EVENTS', label: t.chats.tabs.events, icon: <MessageSquare size={16} /> },
                  { id: 'FRIENDS', label: t.chats.tabs.friends, icon: <Users size={16} /> },
                  { id: 'BUSINESS', label: t.chats.tabs.business, icon: <Briefcase size={16} /> },
                  { id: 'CLUBS', label: t.chats.tabs.clubs, icon: <Hash size={16} /> }
              ].map((tab) => (
                  <button 
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${activeTab === tab.id ? 'bg-white text-[#FFB7B7] shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                      {tab.icon} {tab.label}
                  </button>
              ))}
          </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-6 pt-2 pb-40">
          
          {/* SECTION: EXPLORAR (CLUBS) */}
          <div className="space-y-4">
            {/* Image-based section header removed as per request */}
            <div className="grid grid-cols-2 gap-2">
              {MOCK_CLUBS.map((club, idx) => (
                <ExplorarClubCard 
                  key={club.id} 
                  club={club} 
                  onClick={() => onOpenChat(club)} 
                  index={idx}
                />
              ))}
            </div>
          </div>

          {/* SECTION: CONVERSACIONES RECIENTES */}
          <div ref={recentChatsRef} className="space-y-6 mt-16">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">
                    Recent Conversations
                </h3>
                <button className="text-[9px] font-black text-emerald-500 uppercase flex items-center gap-1">
                    See More <ChevronRight size={12} />
                </button>
            </div>
            
            {activeTab !== 'CLUBS' && filteredChats.length === 0 ? (
                <div className="py-20 flex flex-col items-center text-center px-10">
                    <div className={`w-20 h-20 rounded-[32px] flex items-center justify-center mb-8 ${isDark ? 'bg-white/5 text-white/20' : 'bg-gray-50 text-gray-200'}`}>
                        <Lock size={32} />
                    </div>
                    <h3 className="text-xl font-black tracking-tight mb-2 opacity-60">{t.chats.emptyTitle}</h3>
                    <p className="text-xs font-medium text-gray-400 leading-relaxed">{t.chats.emptySub}</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredChats.map((chat) => (
                        <StandardChatRow 
                            key={chat.id} 
                            chat={chat} 
                            onClick={() => onOpenChat(chat)} 
                            isDark={isDark} 
                        />
                    ))}
                </div>
            )}
          </div>

          {/* DISCOVER MORE FOOTER */}
          <div className="mt-16 pt-10 border-t border-black/5 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-[22px] bg-emerald-50 text-emerald-500 flex items-center justify-center shadow-sm mb-4">
                  <Sparkles size={28} />
              </div>
              <h4 className={`text-lg font-black tracking-tighter ${isDark ? 'text-white' : 'text-black'}`}>Connect with your city</h4>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Join more clubs to expand your network</p>
          </div>
      </div>
    </div>
  );
};

export default ChatsListView;
