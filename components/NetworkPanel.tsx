
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Globe, Check, User as UserIcon, Briefcase, ChevronRight, MessageCircle, UserMinus } from 'lucide-react';
import { User, Business, AppTheme } from '../types';

interface Friend {
  id: string;
  name: string;
  avatarUrl: string;
  isOnline: boolean;
  subtext: string;
}

interface NetworkPanelProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  friends: Friend[];
  followedBusinesses: Business[];
  onSeeAllFriends?: () => void;
  onSeeAllBusinesses?: () => void;
  onFriendClick?: (friend: Friend) => void;
  onBusinessClick?: (business: Business) => void;
  activeFilter?: string | null;
  onFilterChange?: (name: string | null) => void;
}

const NetworkPanel: React.FC<NetworkPanelProps> = ({
  isOpen,
  onClose,
  user,
  friends,
  followedBusinesses,
  onSeeAllFriends,
  onSeeAllBusinesses,
  onFriendClick,
  onBusinessClick,
  activeFilter,
  onFilterChange
}) => {
  const isDark = user.theme === AppTheme.DARK;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[600]"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            drag="x"
            dragConstraints={{ left: -300, right: 0 }}
            dragElastic={0.1}
            onDragEnd={(_, info) => {
              if (info.offset.x < -50 || info.velocity.x < -500) {
                onClose();
              }
            }}
            onPointerDown={(e) => e.stopPropagation()}
            style={{ backgroundColor: 'var(--color-surface, #FDFCF8)' }}
            className="fixed top-0 left-0 h-full w-[85%] max-w-[320px] z-[610] shadow-2xl rounded-r-[32px] overflow-hidden flex flex-col border-r border-white/10"
          >
            {/* Handle Bar */}
            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 w-1.5 h-16 bg-black/5 rounded-full" />

            {/* Header */}
            <div className="p-6 pt-12">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-black tracking-tighter text-primary">Following</h3>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">YOUR HORIZON NETWORK</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full bg-black/5 text-muted-foreground hover:bg-black/10 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <button
                onClick={() => onFilterChange?.(null)}
                className={`w-full flex items-center gap-3 p-3 rounded-full transition-all ${
                  activeFilter === null
                    ? 'bg-accent text-white shadow-lg'
                    : 'bg-black/5 text-muted-foreground'
                }`}
              >
                <Globe size={18} />
                <span className="text-xs font-bold uppercase tracking-widest flex-1 text-left">SEE ALL</span>
                {activeFilter === null && <Check size={16} />}
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 pb-12 space-y-8 no-scrollbar">
              {/* Friends Section */}
              <section>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <UserIcon size={14} className="text-muted-foreground" />
                    <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">
                      FRIENDS ({friends.length})
                    </h4>
                  </div>
                  <button
                    onClick={onSeeAllFriends}
                    className="text-[10px] font-bold text-primary uppercase tracking-widest"
                  >
                    See all →
                  </button>
                </div>

                <div className="space-y-1">
                  {friends.length > 0 ? (
                    friends.map((friend) => (
                      <div key={friend.id} className="relative group overflow-hidden rounded-2xl h-[64px]">
                        {/* Swipe Actions Background */}
                        <div className="absolute inset-0 flex items-center justify-start pl-4 gap-4 bg-black/5 pointer-events-none">
                          <button className="flex flex-col items-center gap-1 text-primary">
                            <MessageCircle size={18} />
                            <span className="text-[8px] font-bold uppercase">Message</span>
                          </button>
                          <button className="flex flex-col items-center gap-1 text-rose-500">
                            <UserMinus size={18} />
                            <span className="text-[8px] font-bold uppercase">Unfollow</span>
                          </button>
                        </div>

                        <motion.div
                          drag="x"
                          dragConstraints={{ left: 0, right: 120 }}
                          dragElastic={0.1}
                          style={{ backgroundColor: 'var(--color-surface, #FDFCF8)' }}
                          className={`relative flex items-center gap-3 p-2 rounded-2xl transition-all cursor-pointer z-10 h-full ${
                            activeFilter === friend.name ? 'bg-primary/10' : 'hover:bg-black/5'
                          }`}
                          onClick={() => onFriendClick?.(friend)}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="relative shrink-0">
                            <div className="w-11 h-11 rounded-full overflow-hidden border border-black/5">
                              <img
                                src={friend.avatarUrl}
                                className="w-full h-full object-cover"
                                alt={friend.name}
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            {friend.isOnline && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#22C55E] border-2 border-white rounded-full" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-black uppercase tracking-tight text-primary truncate">{friend.name}</p>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 truncate">{friend.subtext}</p>
                          </div>
                          <ChevronRight size={16} className="text-muted-foreground/40" />
                        </motion.div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 opacity-40">
                      <UserIcon size={32} className="mb-2" />
                      <p className="text-[10px] font-bold uppercase tracking-widest">No friends yet</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Businesses Section */}
              <section>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Briefcase size={14} className="text-muted-foreground" />
                    <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">
                      BUSINESSES ({followedBusinesses.length})
                    </h4>
                  </div>
                  <button
                    onClick={onSeeAllBusinesses}
                    className="text-[10px] font-bold text-primary uppercase tracking-widest"
                  >
                    See all →
                  </button>
                </div>

                <div className="space-y-1">
                  {followedBusinesses.length > 0 ? (
                    followedBusinesses.map((biz) => (
                      <motion.div
                        key={biz.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onBusinessClick?.(biz)}
                        className={`flex items-center gap-3 p-2 rounded-2xl transition-all cursor-pointer h-[64px] ${
                          activeFilter === biz.name ? 'bg-primary/10' : 'hover:bg-black/5'
                        }`}
                      >
                        <div className="w-11 h-11 rounded-full overflow-hidden border border-black/5 bg-white shrink-0">
                          <img
                            src={biz.logo}
                            className="w-full h-full object-cover"
                            alt={biz.name}
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-black uppercase tracking-tight text-primary truncate">{biz.name}</p>
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.5 bg-black/5 rounded text-[9px] font-black uppercase text-muted-foreground">
                              {biz.activeEventsCount > 0 ? 'Active' : 'Business'}
                            </span>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">1.2km</span>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-muted-foreground/40" />
                      </motion.div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 opacity-40">
                      <Briefcase size={32} className="mb-2" />
                      <p className="text-[10px] font-bold uppercase tracking-widest">No businesses followed</p>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NetworkPanel;
