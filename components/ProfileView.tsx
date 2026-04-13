
import React, { useMemo, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Event, AppTheme, UserType, AppLanguage } from '../types';
import { Settings, X, Camera, Globe, Check, LogOut, Gavel, ShieldCheck, Zap, MapPin, Play, ChevronRight, Award, History, LayoutGrid, Gamepad2, Sparkles, MessageCircle, Heart, Users, Lightbulb, Smile, BookOpen, Coffee, Briefcase, Megaphone, Ear, CheckCircle2, UserPlus, Map as MapIcon, Globe2, Palette, Lock, Pencil, Music, Building2, Users2, Plane, Droplet, School, Home, Languages, LogIn } from 'lucide-react';
import { TRANSLATIONS, MOCK_EVENTS, EXPLORE_MEMORIES, ILLUSTRATED_AVATARS, DISCIPLINES, TAG_GROUPS } from '../constants';
import CreateEventModal from './CreateEventModal';
import CreateClubModal from './CreateClubModal';
import OnboardingFlow from './OnboardingFlow';
import LoginModal from './ui/LoginModal';

interface ProfileViewProps {
  user: User;
  onRegister: () => void;
  onLogout: () => void;
  onLogin: () => void;
  onOpenSettings: () => void;
  onSelectEvent?: (event: Event, e?: React.MouseEvent) => void;
  onOpenChat?: (eventId: string) => void;
  onUpdateUser?: (updatedUser: User) => void;
  onCreateEvent?: (eventData: any) => void;
  onOpenBusiness?: (id: string) => void;
  onViewMemories?: () => void;
  onToggleModal?: (isOpen: boolean) => void;
  events?: Event[];
  currentCity: string;
}

const LANGUAGES: { id: AppLanguage; name: string; flag: string }[] = [
    { id: 'en', name: 'English', flag: '🇺🇸' },
    { id: 'es', name: 'Español', flag: '🇪🇸' },
    { id: 'fr', name: 'Français', flag: '🇫🇷' },
    { id: 'pt', name: 'Português', flag: '🇧🇷' },
];

const RECOMMENDED_SLIDES = [
    {
        label: "Collaborative",
        title: "Create collaborative maps with your friends",
        bgColor: "bg-[#DCFCE7]",
        textColor: "text-emerald-900",
        labelColor: "text-emerald-600",
        icon: <MapIcon size={20} />,
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Aria&backgroundColor=transparent"
    },
    {
        label: "Global",
        title: "Explore events in other countries",
        bgColor: "bg-[#E0F2FE]",
        textColor: "text-blue-900",
        labelColor: "text-blue-600",
        icon: <Globe2 size={20} />,
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Finn&backgroundColor=transparent"
    },
    {
        label: "B2B Pulse",
        title: "Connect with similar businesses and collaborate",
        bgColor: "bg-[#FDF2F8]",
        textColor: "text-pink-900",
        labelColor: "text-pink-600",
        icon: <Briefcase size={20} />,
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Cleo&backgroundColor=transparent"
    },
    {
        label: "Talent",
        title: "Connect with artists and collaborate",
        bgColor: "bg-[#F5F3FF]",
        textColor: "text-purple-900",
        labelColor: "text-purple-600",
        icon: <Palette size={20} />,
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Zora&backgroundColor=transparent"
    },
    {
        label: "Originals",
        title: "Find unique events all around the world",
        bgColor: "bg-[#FFF7ED]",
        textColor: "text-orange-900",
        labelColor: "text-orange-600",
        icon: <Sparkles size={20} />,
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Koa&backgroundColor=transparent"
    }
];

const ToDoList: React.FC<{ user: User }> = ({ user }) => {
    const tasks = [
        { id: 1, label: 'Fill out the questionnaire', completed: !!user.isGameCompleted },
        { id: 2, label: 'Complete your personal profile', completed: user.isRegistered },
        { id: 3, label: 'Explore events', completed: (user.registeredEventIds?.length || 0) > 0 },
        { id: 4, label: 'Join an event', completed: (user.registeredEventIds?.length || 0) > 0 },
        { id: 5, label: 'Attend and give your opinion', completed: !!user.hasAttendedEvent },
        { id: 6, label: 'Upload event image and publish', completed: !!user.hasUploadedMemory },
    ];

    const allCompleted = tasks.every(task => task.completed);
    if (allCompleted) return null;

    return (
        <div className="w-full p-6 bg-white/40 backdrop-blur-md rounded-2xl border border-white/40 shadow-watercolor animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 size={18} className="text-primary/40" />
                <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary/40">Your Journey</h3>
            </div>
            <div className="space-y-3">
                {tasks.map(task => (
                    <div key={task.id} className="flex items-center gap-3 group">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${task.completed ? 'bg-emerald-500 border-emerald-500' : 'border-primary/10 bg-white/20'}`}>
                            {task.completed && <Check size={12} className="text-white" />}
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${task.completed ? 'text-primary/80' : 'text-primary/30'}`}>
                            {task.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ProfileView: React.FC<ProfileViewProps> = ({ 
  user, 
  onLogout, 
  onLogin,
  onRegister,
  onOpenSettings, 
  onSelectEvent, 
  onUpdateUser,
  onCreateEvent,
  onViewMemories,
  onOpenChat,
  onToggleModal,
  events = MOCK_EVENTS,
  currentCity
}) => {
  const t = useMemo(() => TRANSLATIONS[user.language] || TRANSLATIONS.en, [user.language]);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showCreateClub, setShowCreateClub] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showManageEvents, setShowManageEvents] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);
  const [showScenarioGame, setShowScenarioGame] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showInterestsModal, setShowInterestsModal] = useState(false);
  const [showRegMessage, setShowRegMessage] = useState(false);

  useEffect(() => {
    if (onToggleModal) {
      onToggleModal(showCreateEvent || showManageEvents || showScenarioGame);
    }
  }, [showCreateEvent, showManageEvents, showScenarioGame, onToggleModal]);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Editable Profile State
  const [editName, setEditName] = useState(user.name);
  const [editIntro, setEditIntro] = useState(user.bio || "Ciao! I just moved to Rome and I'm looking for new horizons! 🌍 Help me explore!");
  const [editHometown, setEditHometown] = useState(user.locationLabel || "Valencia, Spain");
  const [editOccupation, setEditOccupation] = useState(user.professional || "");
  const [editSchool, setEditSchool] = useState("Rome Business School, Rome");
  const [editSocialId, setEditSocialId] = useState(user.instagramHandle || "@at_royarancibia");
  const [editLocation, setEditLocation] = useState(user.locationLabel || "Rome, Italy");
  const [editPreferences, setEditPreferences] = useState<string[]>(user.preferences || []);

  const handleSaveProfile = () => {
    if (onUpdateUser) {
      onUpdateUser({
        ...user,
        name: editName,
        bio: editIntro,
        locationLabel: editLocation,
        professional: editOccupation,
        instagramHandle: editSocialId,
        preferences: editPreferences
      });
    }
    setShowEditProfile(false);
  };

  const handleRestrictedAction = (action: () => void) => {
    if (!user.isRegistered) {
      setShowRegMessage(true);
      setTimeout(() => setShowRegMessage(false), 4000);
    } else {
      action();
    }
  };
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDark = user.theme === AppTheme.DARK;
  const isBusiness = user.type === UserType.BUSINESS;

  useEffect(() => {
    const interval = setInterval(() => {
        setCurrentSlideIndex((prev) => (prev + 1) % RECOMMENDED_SLIDES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const themeStyles = useMemo(() => {
    if (isDark) return { bg: 'bg-transparent', accent: 'text-slate-300', border: 'border-white/10', fill: 'bg-slate-700' };
    return { bg: 'bg-transparent', accent: 'text-[#432818]', border: 'border-[#432818]/10', fill: 'bg-[#432818]' };
  }, [isDark]);

  const userMemories = useMemo(() => EXPLORE_MEMORIES.filter((_, i) => i % 2 === 0), []);
  const historyEvents = useMemo(() => isBusiness ? events.filter(e => e.hostId === user.id) : events.filter(e => user.registeredEventIds?.includes(e.id)), [user, events, isBusiness]);

  const handleAvatarClick = () => {
    if (isBusiness) {
        fileInputRef.current?.click();
    } else {
        setShowAvatarPicker(true);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpdateUser) {
        const reader = new FileReader();
        reader.onloadend = () => onUpdateUser({ ...user, avatarUrl: reader.result as string });
        reader.readAsDataURL(file);
    }
  };

  const selectIllustratedAvatar = (url: string) => {
    if (onUpdateUser) onUpdateUser({ ...user, avatarUrl: url });
    setShowAvatarPicker(false);
  };

  const AvatarPickerModal = () => (
    <div className="fixed inset-0 z-[700] bg-white/40 backdrop-blur-xl flex items-center justify-center p-6 animate-fade-in" onClick={() => setShowAvatarPicker(false)}>
        <div className="bg-paper rounded-[48px] w-full max-w-md flex flex-col max-h-[85vh] shadow-watercolor animate-scale-in border border-white/40" onClick={e => e.stopPropagation()}>
            <div className="p-8 pb-4 flex justify-between items-center border-b border-white/40">
                <div>
                    <h3 className="text-2xl font-serif font-bold text-primary tracking-tight leading-none">Choose Personality</h3>
                    <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest mt-2">Atempo Illustrated Identities</p>
                </div>
                <button onClick={() => setShowAvatarPicker(false)} className="p-3 bg-white/40 backdrop-blur-md rounded-2xl text-primary/40 hover:text-primary transition-colors border border-white/40"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
                <div className="grid grid-cols-3 gap-4">
                    {ILLUSTRATED_AVATARS.map((url, i) => (
                        <button 
                            key={i} 
                            onClick={() => selectIllustratedAvatar(url)}
                            className={`aspect-square rounded-2xl overflow-hidden bg-white/40 border-4 transition-all active:scale-90 animate-reveal-stagger shadow-watercolor ${user.avatarUrl === url ? 'border-primary scale-105' : 'border-transparent hover:border-white/60'}`}
                            style={{ animationDelay: `${i * 0.02}s` }}
                        >
                            <img src={url} className="w-full h-full object-cover" alt={`Personality ${i}`} referrerPolicy="no-referrer" />
                        </button>
                    ))}
                </div>
            </div>
            <div className="p-8 pt-0">
                <p className="text-[8px] font-bold text-center text-primary/20 uppercase tracking-[0.4em]">Exclusive Minimalist Styles</p>
            </div>
        </div>
    </div>
  );

  const ManageEventsModal = () => (
    <div className="fixed inset-0 z-[700] flex flex-col bg-[#FDFCF8] animate-fade-in overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 z-0 opacity-40" style={{
            backgroundImage: `
                radial-gradient(at 0% 0%, rgba(252, 231, 243, 0.6) 0, transparent 70%),
                radial-gradient(at 100% 100%, rgba(243, 232, 255, 0.5) 0, transparent 70%),
                radial-gradient(at 50% 50%, rgba(220, 252, 231, 0.3) 0, transparent 70%)
            `
        }} />

        <div className="relative z-10 flex flex-col h-full">
            <div className="p-8 pt-12 pb-6 flex justify-between items-center border-b border-black/5">
                <div>
                    <h3 className="text-2xl font-serif font-bold text-primary tracking-tight leading-none">{isBusiness ? 'Manage Events' : 'Manage Clubs'}</h3>
                    <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest mt-2">{isBusiness ? 'Active & Past Atempos' : 'Your Active Communities'}</p>
                </div>
                <button onClick={() => setShowManageEvents(false)} className="p-3 bg-white/60 backdrop-blur-md rounded-2xl text-primary/40 hover:text-primary transition-colors border border-white/40 shadow-sm active:scale-95 transition-all"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
                <div className="max-w-md mx-auto w-full space-y-6">
                    {historyEvents.length > 0 ? historyEvents.map((event, i) => {
                        const statusColor = i === 0 ? 'bg-emerald-500' : i === 1 ? 'bg-amber-500' : 'bg-rose-500';
                        const statusText = i === 0 ? 'Active' : i === 1 ? 'Pending' : 'Completed';
                        
                        return (
                            <div key={event.id} className="p-5 bg-white/40 backdrop-blur-md rounded-2xl border border-white/40 shadow-sm flex flex-col gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white/40 shrink-0">
                                        <img src={event.videoThumbnail} className="w-full h-full object-cover" alt={event.title} referrerPolicy="no-referrer" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-sm text-primary truncate">{event.title}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className={`w-2 h-2 rounded-full ${statusColor}`} />
                                            <span className="text-[9px] font-bold text-primary/40 uppercase tracking-widest">{statusText}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/20">
                                    <div className="text-center">
                                        <span className="block text-[10px] font-black text-primary">{isBusiness ? '124' : '48'}</span>
                                        <span className="text-[7px] font-bold text-primary/30 uppercase tracking-widest">{isBusiness ? 'Views' : 'Members'}</span>
                                    </div>
                                    <div className="text-center">
                                        <span className="block text-[10px] font-black text-primary">{isBusiness ? '42' : '12'}</span>
                                        <span className="text-[7px] font-bold text-primary/30 uppercase tracking-widest">{isBusiness ? 'Joins' : 'Active'}</span>
                                    </div>
                                    <div className="text-center">
                                        <span className="block text-[10px] font-black text-primary">{isBusiness ? '8.5' : '4.9'}</span>
                                        <span className="text-[7px] font-bold text-primary/30 uppercase tracking-widest">Rating</span>
                                    </div>
                                </div>
                            </div>
                        );
                    }) : (
                        <div className="py-20 text-center opacity-30">
                            <p className="text-sm font-bold uppercase tracking-widest">{isBusiness ? 'No events to manage' : 'No clubs to manage'}</p>
                        </div>
                    )}
                </div>
            </div>
            <div className="p-8 pb-12 border-t border-black/5 bg-white/20 backdrop-blur-md">
                <div className="max-w-md mx-auto w-full">
                    <button onClick={() => { 
                        setShowManageEvents(false); 
                        if (isBusiness) setShowCreateEvent(true);
                        else setShowCreateClub(true);
                    }} className="w-full py-5 bg-primary text-white rounded-2xl font-bold text-[11px] uppercase tracking-[0.2em] shadow-glow-sunset active:scale-95 transition-all">
                        {isBusiness ? 'Create New Atempo' : 'Create New Club'}
                    </button>
                </div>
            </div>
        </div>
    </div>
  );

  const ManageInterestsModal = () => {
    const allAvailableTags = useMemo(() => {
      const scores: Record<string, number> = {};
      DISCIPLINES.forEach(tag => {
        scores[tag] = 0;
        editPreferences.forEach(selected => {
          if (TAG_GROUPS[selected]?.includes(tag)) scores[tag] += 100;
          const selectedWords = selected.toLowerCase().split(' ');
          const tagWords = tag.toLowerCase().split(' ');
          selectedWords.forEach(sw => {
            if (tagWords.some(tw => tw.includes(sw) || sw.includes(tw))) scores[tag] += 20;
          });
        });
        if (editPreferences.includes(tag)) scores[tag] = 10000;
      });
      return [...DISCIPLINES].sort((a, b) => scores[b] - scores[a]);
    }, [editPreferences]);

    const handleDone = () => {
      if (!showEditProfile && onUpdateUser) {
        onUpdateUser({ ...user, preferences: editPreferences });
      }
      setShowInterestsModal(false);
    };

    return (
      <div className="fixed inset-0 z-[900] bg-black/20 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in" onClick={handleDone}>
          <div className="bg-white rounded-[32px] w-full max-w-md flex flex-col max-h-[80vh] shadow-ios-deep animate-scale-in overflow-hidden border border-black/5" onClick={e => e.stopPropagation()}>
              <div className="px-8 pt-10 pb-6 flex items-center justify-between border-b border-gray-100">
                  <div>
                      <h2 className="text-2xl font-serif font-bold text-primary tracking-tight leading-none">Interests</h2>
                      <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest mt-2">Select your disciplines</p>
                  </div>
                  <button onClick={handleDone} className="p-3 bg-primary/5 rounded-2xl text-primary/40 hover:text-primary transition-colors"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
                  <div className="flex flex-wrap gap-3">
                      {Array.from(new Set(allAvailableTags)).map(tag => (
                          <button
                              key={tag}
                              onClick={() => {
                                  setEditPreferences(prev => 
                                      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                                  );
                              }}
                              className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all border shadow-sm ${
                                  editPreferences.includes(tag)
                                      ? 'bg-primary text-white border-primary shadow-glow-sunset scale-[1.02]'
                                      : 'bg-white/60 text-primary/70 border-white/60 hover:border-primary/20'
                              }`}
                          >
                              {tag}
                          </button>
                      ))}
                  </div>
              </div>
              <div className="p-8 pt-0">
                  <button 
                      onClick={handleDone} 
                      className="w-full py-5 bg-primary text-white rounded-2xl font-bold text-[11px] uppercase tracking-widest shadow-glow-sunset active:scale-95 transition-all"
                  >
                      Done
                  </button>
              </div>
          </div>
      </div>
    );
  };

  const EditProfileModal = () => (
    <div className="fixed inset-0 z-[800] bg-white flex flex-col animate-fade-in">
        <div className="px-6 pt-12 pb-6 flex items-center justify-between sticky top-0 bg-white z-10 border-b border-gray-100">
            <button onClick={() => setShowEditProfile(false)} className="p-3 bg-primary/5 rounded-2xl text-primary/40"><X size={20} /></button>
            <h2 className="text-xl font-serif font-bold text-primary">Edit Profile</h2>
            <button onClick={handleSaveProfile} className="px-5 py-2.5 bg-primary text-white rounded-full font-bold text-[10px] uppercase tracking-widest shadow-glow-sunset">Save</button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-20 space-y-8 no-scrollbar bg-white">
            {/* About Me */}
            <section>
                <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary/40 mb-4 px-1">About Me</h3>
                <div className="space-y-3">
                    <div className="p-5 bg-primary/5 rounded-2xl border border-primary/5">
                        <label className="block text-[8px] font-black text-primary/30 uppercase tracking-widest mb-1">Name</label>
                        <input 
                            type="text" 
                            value={editName} 
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full bg-transparent font-bold text-primary focus:outline-none"
                        />
                    </div>
                    <div className="p-5 bg-primary/5 rounded-2xl border border-primary/5 flex justify-between items-start">
                        <div className="flex-1">
                            <label className="block text-[8px] font-black text-primary/30 uppercase tracking-widest mb-1">Introduction</label>
                            <textarea 
                                value={editIntro}
                                onChange={(e) => setEditIntro(e.target.value)}
                                className="w-full bg-transparent font-bold text-primary text-sm focus:outline-none resize-none h-20"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Languages */}
            <section>
                <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary/40 mb-4 px-1">Languages</h3>
                <div className="space-y-3">
                    <div className="p-5 bg-primary/5 rounded-2xl border border-primary/5">
                        <label className="block text-[8px] font-black text-primary/30 uppercase tracking-widest mb-1">Native</label>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-primary">Spanish</span>
                            <div className="w-4 h-0.5 bg-emerald-500 rounded-full" />
                        </div>
                    </div>
                    <button className="w-full p-5 bg-white rounded-2xl border border-dashed border-primary/20 flex items-center justify-between text-primary/40">
                        <span className="text-[10px] font-bold uppercase tracking-widest">Add languages you teach</span>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-rose-500" />
                            <ChevronRight size={18} />
                        </div>
                    </button>
                    <div className="p-5 bg-primary/5 rounded-2xl border border-primary/5 flex justify-between items-center">
                        <div>
                            <label className="block text-[8px] font-black text-primary/30 uppercase tracking-widest mb-1">Learning</label>
                            <span className="text-sm font-bold text-primary">Italian</span>
                        </div>
                        <ChevronRight size={18} className="text-primary/20" />
                    </div>
                </div>
            </section>

            {/* Interests */}
            <section>
                <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary/40 mb-4 px-1">Interests</h3>
                <div className="space-y-3">
                    <button 
                        onClick={() => setShowInterestsModal(true)}
                        className="w-full p-5 bg-primary/5 rounded-2xl border border-primary/5 flex items-center gap-4"
                    >
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                            <Music size={20} />
                        </div>
                        <div className="flex-1 text-left">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary/40 block">Your Tags</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {editPreferences.length > 0 ? editPreferences.slice(0, 3).map(p => (
                                    <span key={p} className="text-[8px] font-black text-primary uppercase tracking-tighter">{p}</span>
                                )) : <span className="text-[8px] font-black text-primary/20 uppercase tracking-tighter">Add hobbies</span>}
                                {editPreferences.length > 3 && <span className="text-[8px] font-black text-primary/20">+{editPreferences.length - 3}</span>}
                            </div>
                        </div>
                        <div className="ml-auto flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-rose-500" />
                            <ChevronRight size={18} className="text-primary/20" />
                        </div>
                    </button>
                </div>
            </section>

            {/* Personal Information */}
            <section>
                <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary/40 mb-4 px-1">Personal Information</h3>
                <div className="space-y-3">
                    <div className="p-5 bg-primary/5 rounded-2xl border border-primary/5 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                            <Home size={20} />
                        </div>
                        <div className="text-left flex-1">
                            <label className="block text-[8px] font-black text-primary/30 uppercase tracking-widest mb-1">Hometown</label>
                            <input 
                                type="text"
                                value={editHometown}
                                onChange={(e) => setEditHometown(e.target.value)}
                                className="w-full bg-transparent font-bold text-primary text-xs focus:outline-none"
                            />
                        </div>
                    </div>
                    <div className="p-5 bg-primary/5 rounded-2xl border border-primary/5 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                            <Briefcase size={20} />
                        </div>
                        <div className="text-left flex-1">
                            <label className="block text-[8px] font-black text-primary/30 uppercase tracking-widest mb-1">My Occupation</label>
                            <input 
                                type="text"
                                value={editOccupation}
                                placeholder="Add occupation"
                                onChange={(e) => setEditOccupation(e.target.value)}
                                className="w-full bg-transparent font-bold text-primary text-xs focus:outline-none"
                            />
                        </div>
                    </div>
                    <div className="p-5 bg-primary/5 rounded-2xl border border-primary/5 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-500 flex items-center justify-center">
                            <School size={20} />
                        </div>
                        <div className="text-left flex-1">
                            <label className="block text-[8px] font-black text-primary/30 uppercase tracking-widest mb-1">My School</label>
                            <input 
                                type="text"
                                value={editSchool}
                                onChange={(e) => setEditSchool(e.target.value)}
                                className="w-full bg-transparent font-bold text-primary text-xs focus:outline-none"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Other */}
            <section>
                <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary/40 mb-4 px-1">Other</h3>
                <div className="space-y-3">
                    <div className="p-5 bg-primary/5 rounded-2xl border border-primary/5 flex justify-between items-center">
                        <div className="flex-1">
                            <label className="block text-[8px] font-black text-primary/30 uppercase tracking-widest mb-1">Social ID</label>
                            <input 
                                type="text"
                                value={editSocialId}
                                onChange={(e) => setEditSocialId(e.target.value)}
                                className="w-full bg-transparent font-bold text-primary text-sm focus:outline-none"
                            />
                        </div>
                    </div>
                    <div className="p-5 bg-primary/5 rounded-2xl border border-primary/5 flex justify-between items-center">
                        <div className="flex-1">
                            <label className="block text-[8px] font-black text-primary/30 uppercase tracking-widest mb-1">Location</label>
                            <input 
                                type="text"
                                value={editLocation}
                                onChange={(e) => setEditLocation(e.target.value)}
                                className="w-full bg-transparent font-bold text-primary text-sm focus:outline-none"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
  );

  const renderAvatar = () => (
    <div 
        onClick={handleAvatarClick}
        className={`w-24 h-24 rounded-full p-1 relative transition-all active:scale-95 cursor-pointer group ${isBusiness ? 'bg-accent' : 'bg-[#FFB7B7]'}`}
    >
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
        <div className="w-full h-full bg-white rounded-full overflow-hidden flex items-center justify-center relative shadow-inner">
            {user.avatarUrl ? (
                <img src={user.avatarUrl} className="w-full h-full object-cover" alt="Profile" referrerPolicy="no-referrer" />
            ) : (
                <span className="text-3xl font-serif font-bold text-black uppercase">{user.name.charAt(0)}</span>
            )}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera size={20} className="text-white" />
            </div>
        </div>
    </div>
  );

  return (
    <div className={`h-full overflow-y-auto pb-20 no-scrollbar font-sans transition-colors duration-500 bg-transparent text-primary`}>
      
      {showAvatarPicker && <AvatarPickerModal />}
      {showManageEvents && <ManageEventsModal />}
      {showInterestsModal && <ManageInterestsModal />}
      {showEditProfile && <EditProfileModal />}
      {showScenarioGame && (
        <OnboardingFlow 
            onComplete={(profile) => {
                onUpdateUser?.({ 
                    ...user, 
                    isGameCompleted: true, 
                    personalityProfile: profile,
                    isOnboarded: true 
                });
                setShowScenarioGame(false);
            }}
        />
      )}
      
      {showRegMessage && (
        <div className="fixed bottom-24 left-6 right-6 z-[900] animate-slide-up">
          <div className="bg-black/90 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10">
            <ShieldCheck size={20} className="text-[#FFB7B7]" />
            <p className="text-[11px] font-bold leading-tight">
              To create {isBusiness ? 'an event' : 'a club'}, you must register as an attendee or business.
            </p>
            <button onClick={() => setShowRegMessage(false)} className="ml-auto p-1 hover:bg-white/10 rounded-lg transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>
      )}
      
      {showLanguageModal && (
          <div className="fixed inset-0 z-[600] bg-white/40 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in" onClick={() => setShowLanguageModal(false)}>
              <div className="bg-paper rounded-[44px] w-full max-w-xs p-8 shadow-watercolor animate-scale-in border border-white/40" onClick={e => e.stopPropagation()}>
                  <h3 className="text-xl font-serif font-bold text-primary tracking-tight mb-6 text-center">Language</h3>
                  <div className="space-y-2">
                      {LANGUAGES.map(lang => (
                          <button key={lang.id} onClick={() => { if(onUpdateUser) onUpdateUser({...user, language: lang.id}); setShowLanguageModal(false); }} className={`w-full p-5 rounded-2xl border flex items-center justify-between transition-all active:scale-[0.98] ${user.language === lang.id ? 'bg-primary/5 border-primary shadow-sm' : 'bg-white/40 border-white/40'}`}>
                              <div className="flex items-center gap-4"><span className="text-2xl">{lang.flag}</span><span className={`text-sm font-bold ${user.language === lang.id ? 'text-primary' : 'text-primary/40'}`}>{lang.name}</span></div>
                              {user.language === lang.id && <Check size={18} className="text-primary" />}
                          </button>
                      ))}
                  </div>
              </div>
          </div>
      )}

      {showCreateEvent && (
          <CreateEventModal user={user} onClose={() => setShowCreateEvent(false)} onUpdateUser={onUpdateUser || (() => {})} onCreate={(data) => { onCreateEvent?.(data); setShowCreateEvent(false); }} />
      )}

      {showCreateClub && (
          <CreateClubModal user={user} onClose={() => setShowCreateClub(false)} onCreate={(data) => { console.log('Club Created:', data); setShowCreateClub(false); }} />
      )}

      <motion.div
          animate={isBouncing ? { 
              y: [0, -10, 0],
              scaleY: [1, 1.02, 1],
              originY: 1
          } : { y: 0, scaleY: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          onAnimationComplete={() => setIsBouncing(false)}
      >
          <div className="px-6 pt-8 relative">
              <div className="flex items-center gap-6 mb-6">
                  {renderAvatar()}
                  
                  <div className="flex-1 flex flex-col gap-1.5">
                      <div className={`flex items-center justify-between px-4 py-2 rounded-xl bg-[#FFF9E5] transition-all shadow-sm`}>
                          <div className="flex items-center gap-2.5">
                              <Award size={14} strokeWidth={1.5} className="text-[#F59E0B]" />
                              <span className="text-[9px] font-black uppercase tracking-[0.15em] text-[#432818]/60">Karma</span>
                          </div>
                          <span className={`text-xs font-black text-[#432818]`}>24</span>
                      </div>
                      <div className={`flex items-center justify-between px-4 py-2 rounded-xl bg-[#F0F7FF] transition-all shadow-sm`}>
                          <div className="flex items-center gap-2.5">
                              <History size={14} strokeWidth={1.5} className="text-[#3B82F6]" />
                              <span className="text-[9px] font-black uppercase tracking-[0.15em] text-[#432818]/60">Exp.</span>
                          </div>
                          <span className={`text-xs font-black text-[#1D4ED8]`}>{historyEvents.length}</span>
                      </div>
                      <div className={`flex items-center justify-between px-4 py-2 rounded-xl bg-[#F0FDF4] transition-all shadow-sm`}>
                          <div className="flex items-center gap-2.5">
                              <ShieldCheck size={14} strokeWidth={1.5} className="text-[#10B981]" />
                              <span className="text-[9px] font-black uppercase tracking-[0.15em] text-[#432818]/60">Trust</span>
                          </div>
                          <span className={`text-xs font-black text-[#047857]`}>92%</span>
                      </div>
                  </div>
              </div>
              
              <div className="flex justify-between mt-6 px-2">
                  <div className="flex flex-col items-center">
                      <span className="text-lg font-serif font-bold text-primary">12</span>
                      <span className="text-[8px] font-bold text-primary/40 uppercase tracking-widest">Artists</span>
                  </div>
                  <div className="flex flex-col items-center">
                      <span className="text-lg font-serif font-bold text-primary">8</span>
                      <span className="text-[8px] font-bold text-primary/40 uppercase tracking-widest">Business</span>
                  </div>
                  <div className="flex flex-col items-center">
                      <span className="text-lg font-serif font-bold text-primary">142</span>
                      <span className="text-[8px] font-bold text-primary/40 uppercase tracking-widest">Friends</span>
                  </div>
                  <button 
                    onClick={() => setShowEditProfile(true)}
                    className="flex flex-col items-center gap-1 group"
                  >
                      <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary group-active:scale-90 transition-all">
                          <Pencil size={14} />
                      </div>
                      <span className="text-[8px] font-bold text-primary/40 uppercase tracking-widest">Edit</span>
                  </button>
                  <button 
                    onClick={onOpenSettings}
                    className="flex flex-col items-center gap-1 group"
                  >
                      <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary group-active:scale-90 transition-all">
                          <Settings size={14} />
                      </div>
                      <span className="text-[8px] font-bold text-primary/40 uppercase tracking-widest">Settings</span>
                  </button>
              </div>
          </div>

          <div className="flex flex-col items-start px-6 mb-4">
              <h1 className={`text-2xl font-serif font-bold tracking-tight mb-0.5 text-primary flex items-center gap-2`}>
                  {user.isRegistered ? user.name : 'Guest'}
                  {user.isVerified && <CheckCircle2 size={20} className="text-blue-500" />}
              </h1>
              <div className="flex items-center justify-between w-full mt-1">
                  <div className="flex items-center gap-2.5">
                      <span className="flex items-center gap-1 text-primary/40 font-bold text-[9px] uppercase tracking-[0.1em]">
                          <MapPin size={10} className="text-primary opacity-40" /> {currentCity}
                      </span>
                      <div className="w-1 h-1 bg-primary/10 rounded-full"></div>
                      <span className="text-primary/60 font-bold text-[9px] uppercase tracking-[0.1em] flex items-center gap-1">
                          {isBusiness ? 'Partner Pro' : 'ID Passport'}
                          {user.hasLifetimeSubscription && (
                            <span className="ml-2 px-2 py-0.5 bg-accent/10 text-accent rounded-full text-[7px] font-black tracking-widest border border-accent/20">
                              LIFETIME SUB
                            </span>
                          )}
                      </span>
                  </div>
              </div>
          </div>

          {/* Action Buttons: Create & Manage */}
          <div className="px-6 mb-6 flex gap-3">
              <button 
                onClick={() => handleRestrictedAction(() => {
                    if (isBusiness) {
                        setShowCreateEvent(true);
                    } else {
                        setShowCreateClub(true);
                    }
                })}
                className={`flex-1 py-3 ${isBusiness ? 'bg-accent' : 'bg-[#FFB7B7]'} text-white rounded-xl font-bold text-[11px] uppercase tracking-[0.2em] active:scale-95 transition-all flex items-center justify-center`}
              >
                  {isBusiness ? 'Create Event' : 'Create Club'}
              </button>
              <button 
                onClick={() => handleRestrictedAction(() => setShowManageEvents(true))}
                className="flex-1 py-3 bg-white/40 backdrop-blur-md text-primary rounded-xl font-bold text-[11px] uppercase tracking-[0.2em] border border-white/60 shadow-watercolor active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                  <LayoutGrid size={18} />
                  Manage
              </button>
          </div>

          {/* Interests Display */}
          <div className="px-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary/40">Interests & Vibes</h3>
                  <button 
                    onClick={() => {
                        setEditPreferences(user.preferences || []);
                        setShowInterestsModal(true);
                    }} 
                    className="text-[9px] font-bold text-accent uppercase tracking-widest"
                  >
                      Edit
                  </button>
              </div>
              <div className="flex flex-wrap gap-2">
                  {user.preferences && user.preferences.length > 0 ? user.preferences.map(pref => (
                      <div key={pref} className="px-4 py-2 bg-white/40 backdrop-blur-md rounded-xl border border-white/60 shadow-sm text-[9px] font-bold text-primary uppercase tracking-widest">
                          {pref}
                      </div>
                  )) : (
                      <p className="text-[10px] font-bold text-primary/20 uppercase tracking-widest italic">No interests added yet...</p>
                  )}
              </div>
          </div>

      <div className="px-6 space-y-2">
          {/* Gamified Scenario Section or To-Do List */}
          {!user.isGameCompleted ? (
            <button 
                onClick={() => setShowScenarioGame(true)}
                className="w-full h-32 p-5 rounded-xl relative overflow-hidden flex items-center gap-5 transition-all active:scale-[0.98] shadow-watercolor group border border-white/40"
                style={{ background: 'linear-gradient(135deg, #FCE7F3 0%, #F3E8FF 100%)' }}
            >
                <div className="relative z-10 text-left flex-1">
                    <div className="inline-block bg-white/60 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-bold text-primary uppercase tracking-widest mb-2">
                        Game Quest
                    </div>
                    <h3 className="text-base font-serif font-bold text-primary leading-tight mb-1">Tell us more about yourself with a game</h3>
                    <p className="text-[9px] font-bold text-primary/40 uppercase tracking-widest opacity-60">Tap to start the match</p>
                </div>
                
                <div className="relative shrink-0 w-20 h-20 flex items-center justify-center">
                    <div className="absolute inset-0 bg-white/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
                    <img 
                        src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=transparent" 
                        className="w-16 h-16 object-contain relative z-10 drop-shadow-lg animate-float" 
                        alt="Caricature" 
                        referrerPolicy="no-referrer"
                    />
                    <div className="absolute -top-1 -right-1 bg-primary text-white p-1.5 rounded-lg shadow-lg rotate-12 group-hover:rotate-0 transition-transform">
                        <Gamepad2 size={14} />
                    </div>
                </div>
                
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-3xl" />
            </button>
          ) : (
            <ToDoList user={user} />
          )}

          {/* Automatic Carousel Recommendations Section */}
          <section>
              <div className="flex items-center gap-2 mb-1 px-1">
                  <Sparkles size={16} className="text-primary/40" />
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] opacity-40">Recommendations</h3>
              </div>
              <div className="relative h-32 overflow-hidden rounded-xl shadow-watercolor border border-white/40">
                  {RECOMMENDED_SLIDES.map((slide, index) => (
                      <div 
                        key={index}
                        className={`absolute inset-0 ${slide.bgColor} p-6 flex items-center gap-5 transition-all duration-700 ${index === currentSlideIndex ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
                      >
                          <div className="relative z-10 text-left flex-1">
                              <div className={`inline-block bg-white/60 backdrop-blur-md px-3 py-1 rounded-full text-[8px] font-bold ${slide.labelColor} uppercase tracking-widest mb-2`}>
                                {slide.label}
                              </div>
                              <h3 className={`text-sm font-serif font-bold ${slide.textColor} leading-tight`}>{slide.title}</h3>
                          </div>
                          <div className="relative shrink-0 w-20 h-20 flex items-center justify-center">
                              <div className="absolute inset-0 bg-white/20 rounded-full blur-xl" />
                              <img src={slide.avatar} className="w-16 h-16 object-contain relative z-10 animate-float" alt="Slide Icon" referrerPolicy="no-referrer" />
                              <div className="absolute -top-1 -right-1 bg-white/60 backdrop-blur-md p-2 rounded-xl shadow-sm text-primary scale-90 border border-white/40">
                                  {slide.icon}
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
              {/* Carousel Indicators */}
              <div className="flex justify-center gap-1.5 mt-4">
                  {RECOMMENDED_SLIDES.map((_, i) => (
                      <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === currentSlideIndex ? 'w-6 bg-primary' : 'w-1 bg-primary/10'}`} />
                  ))}
              </div>
          </section>

          {/* Recent Activity Section */}
          <section>
              <div className="flex justify-between items-center mb-5 px-1">
                  <div className="flex items-center gap-2">
                      <LayoutGrid size={16} className="text-primary/40" />
                      <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] opacity-40">Recent Activity</h3>
                  </div>
                  <button className="text-[9px] font-bold uppercase tracking-widest text-primary hover:underline">History</button>
              </div>
              <div className="flex gap-4 overflow-x-auto no-scrollbar py-1">
                  {historyEvents.slice(0, 5).map((event, idx) => (
                      <button key={event.id} onClick={(e) => onSelectEvent?.(event, e)} className={`flex-shrink-0 w-40 p-3 rounded-xl border border-black/10 bg-white/40 flex flex-col items-start gap-2 text-left transition-all shadow-watercolor`}>
                          <div className="w-full aspect-square rounded-xl overflow-hidden mb-1 bg-white/40 group">
                              <img src={event.videoThumbnail} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={event.title} referrerPolicy="no-referrer" />
                          </div>
                          <h4 className="text-[10px] font-bold leading-tight line-clamp-1 px-1">{event.title}</h4>
                      </button>
                  ))}
                  {historyEvents.length === 0 && <div className="w-full py-10 text-center opacity-30"><p className="text-[10px] font-bold uppercase tracking-widest">No activity yet</p></div>}
              </div>
          </section>

          {/* Current Chats Section */}
          {!isBusiness && (
            <section className="mt-2">
                <div className="flex justify-between items-center mb-5 px-1">
                    <div className="flex items-center gap-2">
                        <MessageCircle size={16} className="text-primary/40" />
                        <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] opacity-40">Current Chats</h3>
                    </div>
                    <button className="text-[9px] font-bold uppercase tracking-widest text-primary hover:underline">View All</button>
                </div>
                
                {user.registeredEventIds && user.registeredEventIds.length > 0 ? (
                    <div className="flex gap-4 overflow-x-auto no-scrollbar py-1">
                        {MOCK_EVENTS.filter(e => user.registeredEventIds?.includes(e.id)).map((event) => (
                            <button 
                                key={`chat-${event.id}`} 
                                onClick={() => onOpenChat?.(event.id)}
                                className="flex-shrink-0 w-64 p-4 rounded-xl border border-black/5 bg-white/40 backdrop-blur-xl flex flex-col gap-3 transition-all hover:bg-white/60 shadow-watercolor group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="relative shrink-0">
                                        <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white shadow-sm">
                                            <img src={event.videoThumbnail} className="w-full h-full object-cover" alt={event.title} referrerPolicy="no-referrer" />
                                        </div>
                                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-[11px] font-bold text-primary truncate leading-tight">{event.title}</h4>
                                        <p className="text-[8px] font-black text-primary/20 uppercase tracking-widest">Active Now</p>
                                    </div>
                                    <div className="w-6 h-6 rounded-full bg-primary/5 flex items-center justify-center text-primary/40 group-hover:bg-primary group-hover:text-white transition-all">
                                        <ChevronRight size={12} />
                                    </div>
                                </div>
                                <div className="p-3 rounded-xl bg-white/40 border border-black/5">
                                    <div className="flex items-center gap-2 mb-1">
                                        <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${event.id}&backgroundColor=transparent`} className="w-4 h-4 rounded-full bg-accent/10" alt="User" />
                                        <span className="text-[9px] font-bold text-accent">Sofia L.</span>
                                        <span className="text-[8px] text-primary/20 ml-auto font-bold">2m</span>
                                    </div>
                                    <p className="text-[10px] text-primary/60 line-clamp-2 leading-relaxed italic">
                                        "Hey! Is anyone already there? I'm near the entrance..."
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="w-full py-8 text-center rounded-3xl border border-dashed border-black/10 bg-black/[0.02]">
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-20">Join an event to start chatting</p>
                    </div>
                )}
            </section>
          )}

          <section>
              <div className="relative overflow-hidden rounded-xl p-6 shadow-watercolor border border-black/5 bg-white group">
                  {/* Background Accents */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-accent/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-accent/10 transition-colors duration-700" />
                  
                  <div className="relative z-10">
                      {/* Header with Logo and Upgrade Button */}
                      <div className="flex justify-between items-center mb-5">
                          <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-xl bg-accent shadow-glow-sunset flex items-center justify-center text-white">
                                  <Sparkles size={16} />
                              </div>
                              <div className="flex items-center gap-1.5">
                                  <h3 className="text-lg font-serif font-bold text-primary tracking-tight">Atempo</h3>
                                  <span className="px-2 py-0.5 bg-primary/5 rounded-full text-[7px] font-black text-primary uppercase tracking-widest border border-primary/10">Gold</span>
                              </div>
                          </div>
                          <button className="px-5 py-2.5 bg-primary text-white rounded-full font-black text-[9px] uppercase tracking-widest shadow-glow-sunset active:scale-95 transition-all">
                              Upgrade
                          </button>
                      </div>

                      {/* Comparison Table */}
                      <div className="space-y-1.5">
                          <div className="flex items-center justify-between px-1 mb-1">
                              <span className="text-[8px] font-black text-primary/30 uppercase tracking-[0.2em]">What's included</span>
                              <div className="flex gap-6">
                                  <span className="text-[8px] font-black text-primary/30 uppercase tracking-[0.2em] w-8 text-center">Free</span>
                                  <span className="text-[8px] font-black text-accent uppercase tracking-[0.2em] w-8 text-center">Gold</span>
                              </div>
                          </div>
                          
                          {[
                              { text: "Join exclusive groups" },
                              { text: "Personalized routes" },
                              { text: "Blended maps with friends" },
                              { text: "International content" }
                          ].map((benefit, i) => (
                              <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-primary/5 border border-primary/5">
                                  <span className="text-[10px] font-bold text-primary/70 uppercase tracking-widest">{benefit.text}</span>
                                  <div className="flex gap-6">
                                      <div className="w-8 flex justify-center text-primary/20">
                                          <Lock size={12} />
                                      </div>
                                      <div className="w-8 flex justify-center text-accent">
                                          <Check size={14} strokeWidth={3} />
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>

                      <button className="w-full mt-5 text-[9px] font-black text-primary/40 uppercase tracking-[0.3em] hover:text-primary transition-colors text-center">
                          See all features
                      </button>
                  </div>
              </div>
          </section>

          {/* Management Section */}
          <section className="space-y-3 pb-4 pt-4 border-t border-white/40">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] opacity-40 mb-3 px-1">Management & Legal</h3>
              <button onClick={() => setShowLanguageModal(true)} className={`w-full p-5 rounded-2xl border border-white/40 bg-white/40 flex items-center justify-between transition-all shadow-watercolor active:scale-95`}>
                  <div className="flex items-center gap-4">
                      <Globe size={18} className="text-primary/40" />
                      <div className="text-left">
                          <span className="text-[12px] font-bold block">Language</span>
                          <span className="text-[9px] font-bold text-primary uppercase tracking-widest">{LANGUAGES.find(l => l.id === user.language)?.name}</span>
                      </div>
                  </div>
                  <ChevronRight size={16} className="text-primary/20" />
              </button>
              <button className={`w-full p-5 rounded-2xl border border-white/40 bg-white/40 flex items-center justify-between transition-all shadow-watercolor active:scale-95`}>
                  <div className="flex items-center gap-4">
                      <Gavel size={18} className="text-primary/40" />
                      <span className="text-[12px] font-bold">Terms & Privacy</span>
                  </div>
                  <ChevronRight size={16} className="text-primary/20" />
              </button>

              {/* Conditional Button: Register for Guests, Logout for Registered Users */}
              {user.isRegistered ? (
                  <button 
                    onClick={() => setShowLogoutConfirm(true)} 
                    className={`w-full p-5 rounded-2xl border border-rose-100 bg-rose-50 text-rose-500 flex items-center gap-4 active:scale-95 transition-all mt-6 shadow-watercolor`}
                  >
                      <LogOut size={18} />
                      <span className="text-[11px] font-bold uppercase tracking-widest">Logout</span>
                  </button>
              ) : (
                <div>   <button 
                    onClick={onRegister} 
                    className={`w-full p-5 rounded-2xl border border-primary bg-primary text-white flex items-center gap-4 active:scale-95 transition-all mt-6 shadow-glow-sunset`}
                  >
                      <Zap size={18} fill="currentColor" />
                      <span className="text-[11px] font-bold uppercase tracking-widest">Register</span>
                  </button>
                  <br></br>
                   <button 
                    onClick={() => setShowLoginModal(true)} 
                    
                    className={`w-full p-5 rounded-2xl border border-rose-100 bg-green-50 text-green-500 flex items-center gap-4 active:scale-95 transition-all mt-6 shadow-watercolor`}
                  >
                      <LogIn size={18} />
                      <span className="text-[11px] font-bold uppercase tracking-widest">Login</span>
                  </button>
                  </div>
               

                  
              )}
          </section>
          </div>
      </motion.div>
      <motion.div 
          onViewportEnter={() => setIsBouncing(true)}
          className="h-1 w-full"
      />

      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[700] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`${isDark ? 'bg-slate-900 border border-white/10' : 'bg-white'} w-full max-w-xs rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center gap-6`}
            >
              <div className={`w-16 h-16 rounded-2xl ${isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-500'} flex items-center justify-center shadow-inner`}>
                <LogOut size={32} />
              </div>
              
              <div className="space-y-2">
                <h3 className={`text-xl font-serif font-bold ${isDark ? 'text-white' : 'text-black'}`}>Log Out</h3>
                <p className={`text-[11px] font-black uppercase tracking-[0.2em] leading-relaxed ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                  Are you sure you want to leave? <br/> Your session will be closed.
                </p>
              </div>

              <div className="w-full flex flex-col gap-3">
                <button 
                  onClick={onLogout}
                  className="w-full py-4 bg-red-500 text-white rounded-xl font-black text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-red-500/20 active:scale-95 transition-all"
                >
                  Yes, Log Out
                </button>
                <button 
                  onClick={() => setShowLogoutConfirm(false)}
                  className={`w-full py-4 ${isDark ? 'bg-white/5 text-white/60' : 'bg-gray-100 text-gray-500'} rounded-xl font-black text-[11px] uppercase tracking-[0.2em] active:scale-95 transition-all`}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
<AnimatePresence>
  {showLoginModal && (
    <LoginModal
      onClose={() => setShowLoginModal(false)}
      onLogin={(data) => {
        onLogin();
        setShowLoginModal(false);
      }}
    />
  )}
</AnimatePresence>

       {/* <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-[700] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`${isDark ? 'bg-slate-900 border border-white/10' : 'bg-white'} w-full max-w-xs rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center gap-6`}
            >
              <div className={`w-16 h-16 rounded-2xl ${isDark ? 'bg-red-500/20 text-green-400' : 'bg-red-50 text-green-500'} flex items-center justify-center shadow-inner`}>
                <LogIn size={32} />
              </div>
              
              <div className="space-y-2">
                <h3 className={`text-xl font-serif font-bold ${isDark ? 'text-white' : 'text-black'}`}>Login**</h3>
     
              </div>

             <div className="w-full flex flex-col gap-3">
                      
                <button 
                  onClick={onLogin}
                  className="w-full py-4 bg-red-500 text-white rounded-xl font-black text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-red-500/20 active:scale-95 transition-all"
                >
                  Yes, Log In
                </button>
                <button 
                  onClick={() => setShowLoginModal(false)}
                  className={`w-full py-4 ${isDark ? 'bg-white/5 text-white/60' : 'bg-gray-100 text-gray-500'} rounded-xl font-black text-[11px] uppercase tracking-[0.2em] active:scale-95 transition-all`}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence> */}
    </div>
  );
};

export default ProfileView;
