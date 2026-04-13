
import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Event } from '../../types';
import { Share2, UserPlus, Star, Search, Flag, MessageCircle } from 'lucide-react';

interface ContextMenuProps {
  event: Event;
  position: { x: number, y: number };
  onClose: () => void;
  onAction: (action: string) => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ event, position, onClose, onAction }) => {
  // Smart positioning
  const menuWidth = 260;
  const menuHeight = 300; // Approximate
  const padding = 20;
  
  const style = useMemo(() => {
    const bottomNavHeight = 85; // Height of bottom navigation bar
    const safeBottom = window.innerHeight - bottomNavHeight - padding;
    
    let top = position.y - menuHeight - 20;
    let left = position.x - menuWidth / 2;
    let transformOrigin = 'bottom center';

    // If too close to top, show below
    if (top < padding) {
      top = position.y + 20;
      transformOrigin = 'top center';
      
      // If showing below would hit the bottom nav, try to shift it or keep it above but closer
      if (top + menuHeight > safeBottom) {
        // Force it above if possible, even if it hits the top slightly
        top = Math.max(padding, safeBottom - menuHeight);
        transformOrigin = 'bottom center';
      }
    } else if (top + menuHeight > safeBottom) {
      // If it's already above but somehow hitting bottom (unlikely if top is calculated correctly)
      top = safeBottom - menuHeight;
    }

    // Horizontal bounds
    if (left < padding) {
      left = padding;
      transformOrigin = top < position.y ? 'bottom left' : 'top left';
    } else if (left + menuWidth > window.innerWidth - padding) {
      left = window.innerWidth - menuWidth - padding;
      transformOrigin = top < position.y ? 'bottom right' : 'top right';
    }

    return { top, left, transformOrigin };
  }, [position]);

  const actions = [
    { id: 'share', label: 'Share', icon: <Share2 size={18} /> },
    { id: 'join', label: 'Join event', icon: <MessageCircle size={18} /> },
    { id: 'follow', label: 'Follow organizer', icon: <UserPlus size={18} /> },
    { id: 'rate', label: 'Rate', icon: <Star size={18} /> },
    { id: 'similar', label: 'Find similar', icon: <Search size={18} /> },
  ];

  return (
    <>
      {/* Invisible backdrop for dismissal */}
      <div 
        className="fixed inset-0 z-[9998] bg-transparent" 
        onClick={onClose}
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.85 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300, duration: 0.22 }}
        style={{
          position: 'fixed',
          top: style.top,
          left: style.left,
          width: menuWidth,
          transformOrigin: style.transformOrigin,
          zIndex: 9999,
          backgroundColor: '#FFFFFF',
          borderRadius: '18px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          overflow: 'hidden',
          pointerEvents: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3 flex items-center border-b border-[#F0F0F0]">
          <p className="text-[10px] font-black text-[#111111]/30 uppercase tracking-[0.2em]">
            {event.category}
          </p>
        </div>

        {/* Actions */}
        <div className="py-1">
          {actions.map((action, index) => (
            <React.Fragment key={action.id}>
              <button
                onClick={() => {
                  onAction(action.id);
                  onClose();
                }}
                className="w-full h-12 px-5 flex items-center gap-4 hover:bg-[#F5F5F5] active:bg-[#F5F5F5] transition-colors text-left"
              >
                <span className="text-[#111111]/60">{action.icon}</span>
                <span className="text-[14px] font-medium text-[#111111]">{action.label}</span>
              </button>
              {index < actions.length - 1 && (
                <div className="mx-5 h-[1px] bg-[#F0F0F0]" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Footer / Report */}
        <div className="border-t border-[#F0F0F0] py-1">
          <button
            onClick={() => {
              onAction('report');
              onClose();
            }}
            className="w-full h-12 px-5 flex items-center gap-4 hover:bg-[#F5F5F5] active:bg-[#F5F5F5] transition-colors text-left"
          >
            <span className="text-[#EF4444]"><Flag size={18} /></span>
            <span className="text-[14px] font-medium text-[#EF4444]">Report</span>
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default ContextMenu;
