import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, UserPlus, Share2, EyeOff, Flag, Search, Building2, X } from 'lucide-react';

interface EventSettingsPanelProps {
  eventId: string;
  organizationName: string;
  organizationLogo?: string;
  onFavorite?: () => void;
  onFollow?: () => void;
  onShare?: () => void;
  onHide?: () => void;
  onReport?: () => void;
  onFindSimilar?: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const EventSettingsPanel: React.FC<EventSettingsPanelProps> = ({
  organizationName,
  organizationLogo,
  onFavorite,
  onFollow,
  onShare,
  onHide,
  onReport,
  onFindSimilar,
  isOpen,
  onClose
}) => {
  const actions = [
    {
      icon: organizationLogo ? (
        <img src={organizationLogo} className="w-5 h-5 rounded-full object-cover" alt={organizationName} referrerPolicy="no-referrer" />
      ) : (
        <Building2 size={20} className="text-primary/40" />
      ),
      label: organizationName,
      onClick: undefined,
      isHeader: true
    },
    {
      icon: <Heart size={20} />,
      label: "Add to favorite events",
      onClick: onFavorite
    },
    {
      icon: <UserPlus size={20} />,
      label: "Follow organizer",
      onClick: onFollow
    },
    {
      icon: <Share2 size={20} />,
      label: "Share with a friend",
      onClick: onShare
    },
    {
      icon: <EyeOff size={20} />,
      label: "Hide from preferred events",
      onClick: onHide
    },
    {
      icon: <Flag size={20} />,
      label: "Report event",
      onClick: onReport
    },
    {
      icon: <Search size={20} />,
      label: "Find similar events",
      onClick: onFindSimilar
    }
  ];

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
            className="absolute inset-0 z-[400] bg-black/40 backdrop-blur-[2px]"
          />

          {/* Panel */}
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute top-0 left-0 right-0 z-[410] bg-paper rounded-b-[32px] shadow-2xl border-b border-black/5 overflow-hidden flex flex-col"
          >
            <div className="flex flex-col">
              {actions.map((action, index) => (
                <div key={index}>
                  <button
                    disabled={action.isHeader}
                    onClick={() => {
                      action.onClick?.();
                      onClose();
                    }}
                    className={`w-full h-[52px] px-6 flex items-center gap-4 transition-all ${
                      action.isHeader 
                        ? 'cursor-default bg-primary/5' 
                        : 'active:bg-primary/5 hover:bg-primary/5'
                    }`}
                  >
                    <div className={`shrink-0 ${action.isHeader ? '' : 'text-primary/60'}`}>
                      {action.icon}
                    </div>
                    <span className={`tracking-tight ${
                      action.isHeader 
                        ? 'font-extrabold text-base text-primary' 
                        : 'text-sm font-medium text-primary/80'
                    }`}>
                      {action.label}
                    </span>
                  </button>
                  {index < actions.length - 1 && (
                    <div className="mx-6 h-[1px] bg-black/5" />
                  )}
                </div>
              ))}
            </div>

            {/* Handle bar at the bottom */}
            <div className="h-8 w-full flex items-center justify-center shrink-0">
              <div className="w-12 h-1 bg-primary/10 rounded-full" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EventSettingsPanel;
