import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'motion/react';
import { MoreVertical, Archive, Trash2, BellOff, Pin, CheckCheck, Plus, X, ArrowLeft, MessageSquare, Check } from 'lucide-react';
import { Conversation, AppTheme } from '../types';

interface ConversationListViewProps {
  conversations: Conversation[];
  onOpenConversation: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onMute: (id: string) => void;
  onSelect: (ids: string[]) => void;
}

const Ripple: React.FC<{ x: number; y: number; onComplete: () => void }> = ({ x, y, onComplete }) => {
  return (
    <motion.span
      initial={{ scale: 0, opacity: 0.5 }}
      animate={{ scale: 4, opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      onAnimationComplete={onComplete}
      className="absolute bg-black/10 rounded-full pointer-events-none"
      style={{
        left: x,
        top: y,
        width: 100,
        height: 100,
        marginLeft: -50,
        marginTop: -50,
      }}
    />
  );
};

const ConversationRow: React.FC<{
  conversation: Conversation;
  isSelected: boolean;
  isSelectionMode: boolean;
  onTap: (x: number, y: number) => void;
  onLongPress: () => void;
  onArchive: () => void;
  onDelete: () => void;
}> = ({ conversation, isSelected, isSelectionMode, onTap, onLongPress, onArchive, onDelete }) => {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const x = useMotionValue(0);
  const swipeThreshold = -100;
  const deleteThreshold = -200;

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (isSelectionMode) return;
    longPressTimer.current = setTimeout(() => {
      onLongPress();
    }, 600);
  };

  const handleTouchEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const rippleX = e.clientX - rect.left;
    const rippleY = e.clientY - rect.top;
    
    setRipples(prev => [...prev, { id: Date.now(), x: rippleX, y: rippleY }]);
    
    if (isSelectionMode) {
      onLongPress(); // Toggle selection
    } else {
      onTap(rippleX, rippleY);
    }
  };

  const archiveOpacity = useTransform(x, [0, swipeThreshold], [0, 1]);
  const deleteOpacity = useTransform(x, [swipeThreshold, deleteThreshold], [0, 1]);

  return (
    <div className="relative overflow-hidden bg-white/40 backdrop-blur-md border-b border-white/20 group">
      {/* Swipe Actions Background */}
      <div className="absolute inset-0 flex justify-end items-center px-6 gap-4 pointer-events-none">
        <motion.div 
          style={{ opacity: archiveOpacity }}
          className="flex flex-col items-center text-gray-400"
        >
          <Archive size={20} />
          <span className="text-[10px] font-bold uppercase mt-1">Archive</span>
        </motion.div>
        <motion.div 
          style={{ opacity: deleteOpacity }}
          className="flex flex-col items-center text-red-500"
        >
          <Trash2 size={20} />
          <span className="text-[10px] font-bold uppercase mt-1">Delete</span>
        </motion.div>
      </div>

      <motion.div
        drag="x"
        dragConstraints={{ left: -250, right: 0 }}
        dragElastic={0.1}
        onDragEnd={(_, info) => {
          if (info.offset.x < deleteThreshold) {
            onDelete();
          } else if (info.offset.x < swipeThreshold) {
            onArchive();
          }
          x.set(0);
        }}
        style={{ x }}
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
        className={`relative h-[72px] flex items-center px-4 gap-3 cursor-pointer transition-colors ${isSelected ? 'bg-primary/10' : 'hover:bg-white/20 active:bg-white/30'}`}
      >
        {ripples.map(ripple => (
          <Ripple 
            key={ripple.id} 
            x={ripple.x} 
            y={ripple.y} 
            onComplete={() => setRipples(prev => prev.filter(r => r.id !== ripple.id))} 
          />
        ))}

        {/* Avatar Section */}
        <div className="relative shrink-0 w-12 h-12">
          <AnimatePresence initial={false}>
            {isSelectionMode ? (
              <motion.div
                key="selection"
                initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.5, opacity: 0, rotate: 45 }}
                className={`absolute inset-0 rounded-full flex items-center justify-center z-10 ${isSelected ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'}`}
              >
                <Check size={24} strokeWidth={3} />
              </motion.div>
            ) : (
              <motion.div
                key="avatar"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="absolute inset-0 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center"
              >
                {conversation.avatarUrl ? (
                  <img src={conversation.avatarUrl} className="w-full h-full object-cover" alt={conversation.name} referrerPolicy="no-referrer" />
                ) : (
                  <span className="text-lg font-bold text-primary">{conversation.name.charAt(0)}</span>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          
          <AnimatePresence>
            {conversation.unreadCount > 0 && !isSelectionMode && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center border-2 border-white z-20"
              >
                <span className="text-[10px] font-bold text-white">{conversation.unreadCount}</span>
              </motion.div>
            )}
          </AnimatePresence>
          
          {conversation.isOnline && !isSelectionMode && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white z-20" />
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0 h-full flex flex-col justify-center">
          <div className="flex justify-between items-baseline mb-0.5">
            <h3 className="text-[15px] font-bold text-[#111111] truncate pr-2">{conversation.name}</h3>
            <span className="text-[12px] text-[#888888] shrink-0">{conversation.timestamp}</span>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-[13px] text-[#888888] truncate flex-1">
              {conversation.lastMessage.startsWith('You:') && <CheckCheck size={14} className="inline mr-1 text-primary" />}
              {conversation.lastMessage}
            </p>
            <div className="flex gap-1.5 ml-2 shrink-0">
              {conversation.isMuted && <BellOff size={12} className="text-[#888888]" />}
              {conversation.isPinned && <Pin size={12} className="text-[#888888] rotate-45" />}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const ConversationListView: React.FC<ConversationListViewProps> = ({
  conversations,
  onOpenConversation,
  onArchive,
  onDelete,
  onMute,
  onSelect
}) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const filters = ["All", "Events", "Hubs", "Creatives", "+"];

  const filteredConversations = useMemo(() => {
    return conversations.filter(c => {
      const matchesFilter = activeFilter === 'All' || 
                           (activeFilter === 'Events' && c.type === 'EVENT') ||
                           (activeFilter === 'Hubs' && c.type === 'HUB') ||
                           (activeFilter === 'Creatives' && c.type === 'CREATIVE');
      return matchesFilter;
    });
  }, [conversations, activeFilter]);

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => {
      const next = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id];
      if (next.length === 0) setIsSelectionMode(false);
      onSelect(next);
      return next;
    });
  };

  const startSelection = (id: string) => {
    setIsSelectionMode(true);
    setSelectedIds([id]);
    onSelect([id]);
  };

  const cancelSelection = () => {
    setIsSelectionMode(false);
    setSelectedIds([]);
    onSelect([]);
  };

  return (
    <div className="flex flex-col h-full bg-transparent relative overflow-hidden">
      {/* Selection Toolbar */}
      <AnimatePresence>
        {isSelectionMode && (
          <motion.div
            initial={{ y: -60 }}
            animate={{ y: 0 }}
            exit={{ y: -60 }}
            className="absolute top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl z-[100] flex items-center px-4 justify-between shadow-md"
          >
            <div className="flex items-center gap-4">
              <button onClick={cancelSelection} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} />
              </button>
              <span className="text-lg font-bold">{selectedIds.length} selected</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => selectedIds.forEach(onMute)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <BellOff size={20} />
              </button>
              <button onClick={() => selectedIds.forEach(onArchive)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Archive size={20} />
              </button>
              <button onClick={() => selectedIds.forEach(onDelete)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-red-500">
                <Trash2 size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-y-auto no-scrollbar pt-4">
        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 mb-6 relative">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`relative px-5 py-2 rounded-full text-[12px] font-bold transition-all border shrink-0 ${activeFilter === filter ? 'text-white border-primary' : 'bg-white/20 border-white/30 text-slate-600'}`}
            >
              <span className="relative z-10">{filter}</span>
              {activeFilter === filter && (
                <motion.div
                  layoutId="active-filter"
                  className="absolute inset-0 bg-primary rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Conversation List */}
        <div className="flex flex-col">
          <AnimatePresence initial={false} mode="popLayout">
            {filteredConversations.length > 0 ? (
              filteredConversations.map(conv => (
                <motion.div
                  key={conv.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                >
                  <ConversationRow
                    conversation={conv}
                    isSelected={selectedIds.includes(conv.id)}
                    isSelectionMode={isSelectionMode}
                    onTap={() => onOpenConversation(conv.id)}
                    onLongPress={() => isSelectionMode ? toggleSelection(conv.id) : startSelection(conv.id)}
                    onArchive={() => onArchive(conv.id)}
                    onDelete={() => onDelete(conv.id)}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-20 px-10 text-center"
              >
                <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-6 border border-white/20">
                  <MessageSquare size={40} className="text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-[#111111] mb-2">No conversations yet</h3>
                <p className="text-sm text-[#888888] mb-8">Start a new chat with creatives or join a hub discussion.</p>
                <button className="px-8 py-3 bg-primary text-white rounded-full font-bold text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                  Start Chatting
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ConversationListView;
