import React, { useState, useRef, useEffect } from 'react';
import { User, UserType, Event } from '../types';
import { X, Users, Clock, Flame, ShieldCheck, Info, MessageSquare, ArrowRight, Play, ChevronUp, ChevronDown, Heart, Share2, ArrowLeft, MoreVertical, MapPin, Calendar, Plus, Check, Star, ExternalLink, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import EventSettingsPanel from './EventSettingsPanel';
import { ContributorRole, EventCollaborator } from '../types';

interface EventDetailModalProps {
  event: Event;
  user: User;
  tapPosition?: { x: number, y: number } | null;
  filteredEvents?: Event[];
  onClose: () => void;
  onAttend: (joinChat: boolean) => void;
  onOpenBusiness: (id: string) => void;
  onNavigate: (direction: 'next' | 'prev') => void;
  language: string;
  onToggleCollaborate?: (eventId: string) => void;
  onCollaboratorClick?: (collaboratorId: string) => void;
  onFavorite?: () => void;
  onFollow?: () => void;
  onShare?: () => void;
  onHide?: () => void;
  onReport?: () => void;
  onFindSimilar?: () => void;
}

const EventDetailModal: React.FC<EventDetailModalProps> = ({ 
  event, 
  user,
  tapPosition,
  filteredEvents,
  onClose, 
  onAttend, 
  onOpenBusiness, 
  onNavigate, 
  language,
  onToggleCollaborate,
  onCollaboratorClick,
  onFavorite,
  onFollow,
  onShare,
  onHide,
  onReport,
  onFindSimilar
}) => {
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isCollabExpanded, setIsCollabExpanded] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedContributor, setSelectedContributor] = useState<EventCollaborator | null>(null);
  const [contributorTapPos, setContributorTapPos] = useState<{ x: number, y: number } | null>(null);
  const [showJoinOptions, setShowJoinOptions] = useState(false);
  const [joinConfirmation, setJoinConfirmation] = useState<string | null>(null);
  
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const isCreative = user.type === UserType.ARTIST_CURATOR;
  const isBusiness = user.type === UserType.BUSINESS;
  const isCollaborating = event.collaboratorIds?.includes(user.id);

  const [direction, setDirection] = useState(0);

  const currentIndex = filteredEvents?.findIndex(e => e.id === event.id) ?? -1;
  const prevEvent = filteredEvents && currentIndex > 0 ? filteredEvents[currentIndex - 1] : null;
  const nextEvent = filteredEvents && currentIndex < filteredEvents.length - 1 ? filteredEvents[currentIndex + 1] : null;

  // Re-center when event changes
  useEffect(() => {
    setDragOffset({ x: 0, y: 0 });
    setIsDetailsExpanded(false);
  }, [event.id]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isDetailsExpanded) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || isDetailsExpanded) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    
    const deltaX = currentX - touchStartX.current;
    const deltaY = currentY - touchStartY.current;
    
    // Allow movement on both axes for a more fluid feel
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging || isDetailsExpanded) return;
    setIsDragging(false);
    
    const { x, y } = dragOffset;
    
    // Determine dominant axis
    if (Math.abs(x) > Math.abs(y)) {
      // Horizontal swipe: Navigation
      if (x > 80) {
        setDirection(-1);
        onNavigate('prev');
      } else if (x < -80) {
        setDirection(1);
        onNavigate('next');
      }
    } else {
      // Vertical swipe: Expand Details or Close
      if (y < -60) {
        setIsDetailsExpanded(true);
      } else if (y > 100) {
        onClose();
        return;
      }
    }
    setDragOffset({ x: 0, y: 0 });
  };

  // Visual effects based on drag (Vertical slide hint)
  const cardOpacity = Math.max(0.5, 1 - Math.abs(dragOffset.x) / 600 - (!isDetailsExpanded && dragOffset.y > 0 ? dragOffset.y / 600 : 0));
  const cardRotation = isDetailsExpanded ? 0 : (dragOffset.x / 20);
  
  // Calculate dynamic transform for the info panel when dragging vertically
  const infoPanelTransform = isDetailsExpanded 
    ? `translateY(${Math.max(0, dragOffset.y)}px)` 
    : `translateY(${Math.min(0, dragOffset.y)}px)`;

  const getRoleColor = (role: ContributorRole) => {
    switch (role) {
      case 'Event Host': return 'bg-primary/10 text-primary';
      case 'Performing Artist':
      case 'Visual Artist': return 'bg-orange-500/10 text-orange-600';
      case 'Curator': return 'bg-blue-500/10 text-blue-600';
      default: return 'bg-gray-500/10 text-gray-600';
    }
  };

  const getStatsText = (contributor: EventCollaborator) => {
    switch (contributor.role) {
      case 'Performing Artist':
      case 'Visual Artist':
        return `${contributor.eventsCount || 0} events · ${contributor.followersCount || 0} followers`;
      case 'Event Host':
        return `${contributor.eventsCount || 0} events hosted · ${contributor.distance || '0.5 km'}`;
      default:
        return `${contributor.collaborationsCount || 0} collaborations`;
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.9
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.9
    })
  };

  const circleVariants = {
    initial: (pos: { x: number, y: number } | null) => ({
      clipPath: pos ? `circle(0px at ${pos.x}px ${pos.y}px)` : 'circle(0% at 50% 50%)',
    }),
    animate: (pos: { x: number, y: number } | null) => ({
      clipPath: pos ? `circle(150vmax at ${pos.x}px ${pos.y}px)` : 'circle(150% at 50% 50%)',
      transition: {
        duration: 0.48,
        ease: [0.4, 0, 0.2, 1], // Material Design Standard Easing
      }
    }),
    exit: (pos: { x: number, y: number } | null) => ({
      clipPath: pos ? `circle(0px at ${pos.x}px ${pos.y}px)` : 'circle(0% at 50% 50%)',
      transition: {
        duration: 0.28,
        ease: [0.4, 0, 1, 1], // ease-in
      }
    })
  };

  const bubbleVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.8
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1.1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.8
    })
  };

  return (
    <motion.div 
      className="fixed inset-0 z-[300] flex items-end justify-center pointer-events-none overflow-hidden pb-1" 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
    >
      {/* Click overlay to close */}
      <div className="absolute inset-0 pointer-events-auto" onClick={onClose} />

      <div className="relative w-full h-[70vh] flex items-end justify-center overflow-visible px-4 pointer-events-auto">
        
        {/* Peek Cards */}
        <AnimatePresence initial={false}>
          {!isDetailsExpanded && prevEvent && (
            <motion.div 
              key={`peek-prev-${prevEvent.id}`}
              initial={{ opacity: 0, x: '-100%' }}
              animate={{ 
                opacity: 0.85 + (dragOffset.x > 0 ? dragOffset.x / 500 : 0), 
                x: `calc(-88% + ${dragOffset.x}px)`, 
                scale: 0.92 + (dragOffset.x > 0 ? dragOffset.x / 2000 : 0),
                rotate: dragOffset.x > 0 ? dragOffset.x / 40 : -5
              }}
              exit={{ opacity: 0, x: '-100%' }}
              className="absolute left-0 w-[85%] h-full rounded-3xl overflow-hidden shadow-2xl bg-white/60 border border-black/10 pointer-events-none"
            >
              <img src={prevEvent.videoThumbnail} className="w-full h-full object-cover opacity-80" alt="" />
            </motion.div>
          )}

          {!isDetailsExpanded && nextEvent && (
            <motion.div 
              key={`peek-next-${nextEvent.id}`}
              initial={{ opacity: 0, x: '100%' }}
              animate={{ 
                opacity: 0.85 + (dragOffset.x < 0 ? -dragOffset.x / 500 : 0), 
                x: `calc(88% + ${dragOffset.x}px)`, 
                scale: 0.92 + (dragOffset.x < 0 ? -dragOffset.x / 2000 : 0),
                rotate: dragOffset.x < 0 ? dragOffset.x / 40 : 5
              }}
              exit={{ opacity: 0, x: '100%' }}
              className="absolute right-0 w-[85%] h-full rounded-3xl overflow-hidden shadow-2xl bg-white/60 border border-black/10 pointer-events-none"
            >
              <img src={nextEvent.videoThumbnail} className="w-full h-full object-cover opacity-80" alt="" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Card */}
        <motion.div 
          ref={cardRef}
          animate={{ 
            x: dragOffset.x,
            y: !isDetailsExpanded && dragOffset.y > 0 ? dragOffset.y : 0,
            rotate: cardRotation,
            opacity: cardOpacity
          }}
          transition={isDragging ? { type: "just" } : { type: "spring", stiffness: 300, damping: 30 }}
          className={`w-full max-w-sm h-full relative rounded-3xl overflow-hidden shadow-watercolor bg-white/60 border border-black/10 z-10`}
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

        <div className="relative w-full h-full bg-white/60 backdrop-blur-md rounded-2xl overflow-hidden shadow-watercolor flex flex-col border border-black/10">
          
          {/* SETTINGS PANEL */}
          <EventSettingsPanel 
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            eventId={event.id}
            organizationName={event.hostName}
            organizationLogo={event.hostAvatar}
            onFavorite={onFavorite}
            onFollow={onFollow}
            onShare={onShare}
            onHide={onHide}
            onReport={onReport}
            onFindSimilar={onFindSimilar}
          />

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
            </div>

            {/* Swipe up hint */}
            {!isDetailsExpanded && (
              <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-1 pointer-events-none z-20">
                <div className="w-10 h-1 bg-white/40 rounded-full" />
                <span className="text-[9px] font-black text-white/80 uppercase tracking-[0.2em] drop-shadow-md">Slide up</span>
              </div>
            )}

            {/* Settings Trigger */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsSettingsOpen(true);
              }}
              className="absolute top-6 right-6 z-[360] w-10 h-10 flex items-center justify-center text-white active:scale-95 transition-all"
            >
              <MoreVertical size={20} />
            </button>

            {/* Collaboration Overlay */}
            <div className="absolute bottom-4 left-6 z-20 flex flex-col items-start gap-2" onClick={e => e.stopPropagation()}>
              {isCreative && (
                <div className="flex flex-col items-start">
                  <span className="text-[7px] font-black text-white/60 uppercase tracking-[0.2em] mb-1 ml-1 drop-shadow-md">I know how</span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleCollaborate?.(event.id);
                    }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border shadow-lg active:scale-90 overflow-hidden ${isCollaborating ? 'bg-emerald-500 border-emerald-400' : 'bg-white/20 backdrop-blur-md border-white/40 text-white hover:bg-white/30'}`}
                  >
                    <div className="relative w-full h-full">
                      <img src={user.avatarUrl || `https://api.dicebear.com/7.x/notionists/svg?seed=${user.name}`} className={`w-full h-full object-cover ${isCollaborating ? 'opacity-100' : 'opacity-60'}`} alt={user.name} referrerPolicy="no-referrer" />
                      {!isCollaborating && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Plus size={16} className="text-white drop-shadow-md" />
                        </div>
                      )}
                      {isCollaborating && (
                        <div className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border border-white flex items-center justify-center">
                          <Check size={8} className="text-white" />
                        </div>
                      )}
                    </div>
                  </button>
                </div>
              )}

              {isBusiness && event.collaborators && event.collaborators.length > 0 && (
                <div className="relative">
                  <div className="flex flex-col-reverse gap-2">
                    <AnimatePresence>
                      {isCollabExpanded && event.collaborators.map((collab, idx) => (
                        <motion.button
                          key={collab.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          transition={{ delay: idx * 0.05 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onCollaboratorClick?.(collab.id);
                          }}
                          className="flex items-center gap-3 bg-white/90 backdrop-blur-md p-1.5 pr-4 rounded-full shadow-xl border border-white/40 active:scale-95 transition-all"
                        >
                          <div className="w-8 h-8 rounded-full overflow-hidden border border-black/5">
                            <img src={collab.avatarUrl || `https://picsum.photos/seed/${collab.id}/100/100`} className="w-full h-full object-cover" alt={collab.name} referrerPolicy="no-referrer" />
                          </div>
                          <div className="flex flex-col items-start">
                            <span className="text-[9px] font-bold text-black leading-none">{collab.name}</span>
                            <span className="text-[7px] font-medium text-black/40 uppercase tracking-widest mt-0.5">{collab.professional || 'Creative'}</span>
                          </div>
                        </motion.button>
                      ))}
                    </AnimatePresence>
                    
                    <div className="flex flex-col items-start">
                      <span className="text-[7px] font-black text-white/60 uppercase tracking-[0.2em] mb-1 ml-1 drop-shadow-md">find creatives</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsCollabExpanded(!isCollabExpanded);
                        }}
                        className="flex items-center -space-x-4 active:scale-95 transition-all"
                      >
                        {event.collaborators.slice(0, 3).map((collab, i) => (
                          <div 
                            key={collab.id} 
                            className="w-10 h-10 rounded-full border-2 border-white bg-white shadow-lg overflow-hidden relative"
                            style={{ zIndex: 10 - i }}
                          >
                            <img src={collab.avatarUrl || `https://picsum.photos/seed/${collab.id}/100/100`} className="w-full h-full object-cover" alt={collab.name} referrerPolicy="no-referrer" />
                            {i === 0 && event.collaborators.length > 3 && (
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <span className="text-[10px] font-bold text-white">+{event.collaborators.length - 3}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </button>
                    </div>
                  </div>
                </div>
              )}
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
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 transition-colors text-primary/40"
              >
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

              {/* Tags Carousel */}
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-8 -mx-1 px-1">
                {Array.from(new Set(event.tags || [])).map(tag => (
                  <span key={tag} className="flex-shrink-0 px-3 py-1.5 bg-white/40 backdrop-blur-md rounded-lg text-[8px] font-bold uppercase tracking-widest text-primary/50 border border-white/60 shadow-sm">
                    {tag}
                  </span>
                )) || (
                  <span className="flex-shrink-0 px-3 py-1.5 bg-white/40 backdrop-blur-md rounded-lg text-[8px] font-bold uppercase tracking-widest text-primary/50 border border-white/60 shadow-sm">
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

              {/* Contributors Section */}
              {event.collaborators && event.collaborators.length > 0 && (
                <section className="mb-10">
                  <div className="w-full h-[1px] bg-primary/5 mb-8" />
                  <h4 className="text-[10px] font-bold text-primary/40 uppercase tracking-[0.3em] mb-6">Creatives & Contributors</h4>
                  
                  <div className="px-6">
                    <div className="flex flex-col space-y-[-24px]">
                      {[...(event.collaborators || [])].sort((a, b) => {
                        if (a.role === 'Event Host') return -1;
                        if (b.role === 'Event Host') return 1;
                        return 0;
                      }).map((collab, idx) => (
                        <div 
                          key={collab.id}
                          className={`w-[180px] ${idx % 2 === 0 ? 'self-start' : 'self-end'} flex flex-col items-center text-center group relative z-10`}
                        >
                          <button
                            onClick={(e) => {
                              setContributorTapPos({ x: e.clientX, y: e.clientY });
                              setSelectedContributor(collab);
                            }}
                            className="flex flex-col items-center"
                          >
                            <div className="w-20 h-20 rounded-full border-2 border-primary/30 p-1 mb-3 transition-transform group-active:scale-95 bg-paper">
                              <div className="w-full h-full rounded-full overflow-hidden bg-primary/5 flex items-center justify-center">
                                {collab.avatarUrl ? (
                                  <img src={collab.avatarUrl} className="w-full h-full object-cover" alt={collab.name} referrerPolicy="no-referrer" />
                                ) : (
                                  <span className="text-xl font-bold text-primary/40">{collab.name.charAt(0)}</span>
                                )}
                              </div>
                            </div>
                            <span className="text-sm font-bold text-primary mb-1 truncate w-full px-2">{collab.name}</span>
                            <div className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider mb-1 ${getRoleColor(collab.role)}`}>
                              {collab.role}
                            </div>
                            <span className="text-[10px] text-primary/40 font-medium">{getStatsText(collab)}</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* Host Section (Fallback if not in collaborators) */}
              {!event.collaborators?.some(c => c.role === 'Event Host') && (
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
              )}
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
                onClick={() => setShowJoinOptions(true)}
                className="px-12 py-4 bg-primary text-white font-bold rounded-2xl hover:opacity-90 active:scale-95 transition-all shadow-glow-sunset uppercase tracking-[0.2em] text-[11px]"
              >
                Join
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>

      {/* Join Options Modal */}
      <AnimatePresence>
        {showJoinOptions && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md" onClick={() => setShowJoinOptions(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-paper w-full max-w-xs rounded-[32px] p-8 shadow-2xl flex flex-col items-center text-center gap-6 border border-white/40"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
                <Users size={32} />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-serif font-bold text-primary">Join in English</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed text-primary/40">
                  Choose how you want to experience this event
                </p>
              </div>

              <div className="w-full flex flex-col gap-3">
                <button 
                  onClick={() => {
                    onAttend(true);
                    setJoinConfirmation("You've joined the group community!");
                    setShowJoinOptions(false);
                    setTimeout(() => setJoinConfirmation(null), 3000);
                  }}
                  className="w-full py-4 bg-primary text-white rounded-xl font-black text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Users size={14} />
                  Join in a group
                </button>
                <button 
                  onClick={() => {
                    onAttend(false);
                    setJoinConfirmation("Event saved! Enjoy your solo adventure.");
                    setShowJoinOptions(false);
                    setTimeout(() => setJoinConfirmation(null), 3000);
                  }}
                  className="w-full py-4 bg-white border border-primary/10 text-primary/60 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <UserIcon size={14} />
                  Go alone
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Join Confirmation Toast */}
      <AnimatePresence>
        {joinConfirmation && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-6 right-6 z-[700] flex justify-center pointer-events-none"
          >
            <div className="bg-emerald-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-emerald-400/20">
              <Check size={18} />
              <span className="text-[11px] font-black uppercase tracking-widest">{joinConfirmation}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contributor Profile Card Overlay */}
      <AnimatePresence>
        {selectedContributor && (
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            custom={contributorTapPos}
            variants={circleVariants}
            className="fixed inset-0 z-[500] bg-paper flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-6 py-6 border-b border-black/5">
              <button 
                onClick={() => setSelectedContributor(null)}
                className="p-2 hover:bg-primary/5 rounded-full transition-colors text-primary/40"
              >
                <ArrowLeft size={24} />
              </button>
              <span className="text-[10px] font-bold text-primary/40 uppercase tracking-[0.3em]">Profile</span>
              <div className="w-10" />
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-8">
              <div className="flex flex-col items-center text-center mb-10">
                <div className="w-24 h-24 rounded-full border-2 border-primary/30 p-1 mb-6">
                  <div className="w-full h-full rounded-full overflow-hidden bg-primary/5 flex items-center justify-center">
                    {selectedContributor.avatarUrl ? (
                      <img src={selectedContributor.avatarUrl} className="w-full h-full object-cover" alt={selectedContributor.name} referrerPolicy="no-referrer" />
                    ) : (
                      <span className="text-2xl font-bold text-primary/40">{selectedContributor.name.charAt(0)}</span>
                    )}
                  </div>
                </div>
                <h3 className="text-2xl font-serif font-bold text-primary mb-2">{selectedContributor.name}</h3>
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-8 ${getRoleColor(selectedContributor.role)}`}>
                  {selectedContributor.role}
                </div>

                <div className="flex gap-8 w-full justify-center mb-10">
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-serif font-bold text-primary">{selectedContributor.eventsCount || 0}</span>
                    <span className="text-[9px] font-bold text-primary/30 uppercase tracking-widest">Events</span>
                  </div>
                  <div className="w-[1px] h-8 bg-primary/5" />
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-serif font-bold text-primary">{selectedContributor.followersCount || 0}</span>
                    <span className="text-[9px] font-bold text-primary/30 uppercase tracking-widest">Followers</span>
                  </div>
                  <div className="w-[1px] h-8 bg-primary/5" />
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-serif font-bold text-primary">{selectedContributor.collaborationsCount || 0}</span>
                    <span className="text-[9px] font-bold text-primary/30 uppercase tracking-widest">Collabs</span>
                  </div>
                </div>

                <button className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-[11px] uppercase tracking-[0.2em] shadow-glow-sunset active:scale-95 transition-all mb-12">
                  Follow
                </button>

                <div className="w-full text-left">
                  <h4 className="text-[10px] font-bold text-primary/40 uppercase tracking-[0.3em] mb-6">Shared Events</h4>
                  <div className="space-y-4">
                    {/* Mock shared events */}
                    {[1, 2].map((i) => (
                      <div key={i} className="flex gap-4 p-3 bg-white/40 backdrop-blur-md rounded-2xl border border-white/60">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-primary/5">
                          <img src={`https://picsum.photos/seed/event-${i}/100/100`} className="w-full h-full object-cover" alt="Event" referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <h5 className="font-bold text-xs text-primary mb-1">Past Event {i}</h5>
                          <p className="text-[9px] font-bold text-primary/30 uppercase tracking-widest">Oct 2025 · Valencia</p>
                        </div>
                        <div className="flex items-center">
                          <ExternalLink size={16} className="text-primary/20" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EventDetailModal;