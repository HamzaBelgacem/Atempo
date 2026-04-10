
import React, { useMemo, useState, useRef, useEffect } from 'react';
import { User, Event, AppTheme, UserType, AppLanguage } from '../types';
import { Settings, X, Camera, Globe, Check, LogOut, Gavel, ShieldCheck, Zap, MapPin, Play, ChevronRight, Award, History, LayoutGrid, Gamepad2, Sparkles, MessageCircle, Heart, Users, Lightbulb, Smile, BookOpen, Coffee, Briefcase, Megaphone, Ear, CheckCircle2, UserPlus, Map as MapIcon, Globe2, Palette, Lock, Pencil, Music, Building2, Users2, Plane, Droplet, School, Home, Languages } from 'lucide-react';
import { TRANSLATIONS, MOCK_EVENTS, EXPLORE_MEMORIES, ILLUSTRATED_AVATARS } from '../constants';
import CreateEventModal from './CreateEventModal';

interface ProfileViewProps {
  user: User;
  onRegister: () => void;
  onLogout: () => void;
  onOpenSettings: () => void;
  onSelectEvent?: (event: Event) => void;
  onOpenChat?: (eventId: string) => void;
  onUpdateUser?: (updatedUser: User) => void;
  onCreateEvent?: (eventData: any) => void;
  onOpenBusiness?: (id: string) => void;
  onViewMemories?: () => void;
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

const ScenarioGameModal: React.FC<{ onClose: () => void, userName: string }> = ({ onClose, userName }) => {
    const [step, setStep] = useState(1);
    const [isFinished, setIsFinished] = useState(false);

    const questions = [
        {
            id: 1,
            title: "What are you looking for in an experience?",
            options: [
                { id: 'people', label: 'Meet new people', icon: <Users size={20} />, color: 'bg-blue-500' },
                { id: 'learn', label: 'Learn something', icon: <BookOpen size={20} />, color: 'bg-emerald-500' },
                { id: 'inspire', label: 'Get inspired', icon: <Sparkles size={20} />, color: 'bg-purple-500' },
                { id: 'casual', label: 'Casual plans', icon: <Coffee size={20} />, color: 'bg-orange-500' },
                { id: 'networking', label: 'Networking', icon: <Briefcase size={20} />, color: 'bg-indigo-500' },
                { id: 'all', label: 'A bit of everything', icon: <Heart size={20} />, color: 'bg-rose-500' },
            ]
        },
        {
            id: 2,
            title: "In a group, you usually...",
            options: [
                { id: 'listen', label: 'Just listen', icon: <Ear size={20} />, color: 'bg-slate-500' },
                { id: 'join', label: 'Join the talk', icon: <MessageCircle size={20} />, color: 'bg-emerald-500' },
                { id: 'lead', label: 'Lead the chat', icon: <Megaphone size={20} />, color: 'bg-amber-500' },
            ]
        },
        {
            id: 3,
            title: "Which topics do you enjoy most?",
            options: [
                { id: 'debate', label: 'Debates', icon: <Gavel size={20} />, color: 'bg-red-500' },
                { id: 'personal', label: 'Personal stories', icon: <Heart size={20} />, color: 'bg-rose-500' },
                { id: 'work', label: 'Work & Projects', icon: <Briefcase size={20} />, color: 'bg-blue-600' },
                { id: 'creative', label: 'Creative ideas', icon: <Lightbulb size={20} />, color: 'bg-yellow-500' },
                { id: 'future', label: 'Future trends', icon: <Zap size={20} />, color: 'bg-indigo-600' },
                { id: 'casual', label: 'Casual chat', icon: <Smile size={20} />, color: 'bg-emerald-500' },
            ]
        }
    ];

    const currentQuestion = questions[step - 1];

    const handleNext = () => {
        if (step < 3) setStep(step + 1);
        else setIsFinished(true);
    };

    if (isFinished) {
        return (
            <div className="fixed inset-0 z-[800] bg-black/40 backdrop-blur-xl flex items-center justify-center p-6 animate-fade-in">
                <div className="bg-white rounded-[48px] w-full max-w-sm p-10 flex flex-col items-center text-center shadow-2xl animate-scale-in">
                    <div className="w-20 h-20 bg-primary/5 text-primary rounded-full flex items-center justify-center mb-6 shadow-sm">
                        <CheckCircle2 size={40} />
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-primary tracking-tight mb-4">Thanks, {userName}!</h3>
                    <p className="text-primary/60 text-sm font-bold leading-relaxed mb-8">
                        Now we can create better matches with people you'll actually like in your next Horizon.
                    </p>
                    <button onClick={onClose} className="w-full py-5 bg-primary text-white rounded-[28px] font-bold text-[11px] uppercase tracking-widest shadow-glow-sunset active:scale-95 transition-all">
                        Close Game
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[800] bg-white/40 backdrop-blur-xl flex items-center justify-center p-6 animate-fade-in">
            <div className="bg-paper rounded-[48px] w-full max-w-md flex flex-col max-h-[90vh] shadow-watercolor animate-scale-in overflow-hidden border border-white/40">
                <div className="px-8 pt-10 pb-6 flex justify-between items-center border-b border-white/40">
                    <div>
                        <span className="text-[10px] font-bold text-primary/40 uppercase tracking-[0.3em]">Horizon Match Game</span>
                        <h2 className="text-2xl font-serif font-bold text-primary tracking-tight leading-none mt-1">Step {step} of 3</h2>
                    </div>
                    <button onClick={onClose} className="p-3 bg-white/40 backdrop-blur-md rounded-2xl text-primary/40 hover:text-primary transition-colors border border-white/40"><X size={20} /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 no-scrollbar space-y-8">
                    <h3 className="text-xl font-serif font-bold text-primary leading-tight text-center px-4">{currentQuestion.title}</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                        {currentQuestion.options.map(opt => (
                            <button 
                                key={opt.id}
                                onClick={handleNext}
                                className="flex flex-col items-center gap-4 p-6 bg-white/40 backdrop-blur-md rounded-[32px] border border-white/40 hover:border-primary/20 hover:bg-white transition-all active:scale-95 group shadow-watercolor"
                            >
                                <div className={`w-14 h-14 ${opt.color} text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                    {opt.icon}
                                </div>
                                <span className="text-[10px] font-bold text-primary/40 uppercase tracking-widest text-center leading-tight">{opt.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-8 pt-0 flex justify-center">
                    <div className="flex gap-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i <= step ? 'w-8 bg-accent' : 'w-2 bg-gray-200'}`} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProfileView: React.FC<ProfileViewProps> = ({ 
  user, 
  onLogout, 
  onRegister,
  onOpenSettings, 
  onSelectEvent, 
  onUpdateUser,
  onCreateEvent,
  onViewMemories,
  events = MOCK_EVENTS,
  currentCity
}) => {
  const t = useMemo(() => TRANSLATIONS[user.language] || TRANSLATIONS.en, [user.language]);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showManageEvents, setShowManageEvents] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showScenarioGame, setShowScenarioGame] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Editable Profile State
  const [editName, setEditName] = useState(user.name);
  const [editIntro, setEditIntro] = useState("Ciao! I just moved to Rome and I'm looking for new horizons! 🌍 Help me explore!");
  const [editHometown, setEditHometown] = useState("Valencia, Spain");
  const [editOccupation, setEditOccupation] = useState("");
  const [editSchool, setEditSchool] = useState("Rome Business School, Rome");
  const [editSocialId, setEditSocialId] = useState("@at_royarancibia");
  const [editLocation, setEditLocation] = useState("Rome, Italy");

  const handleSaveProfile = () => {
    if (onUpdateUser) {
      onUpdateUser({
        ...user,
        name: editName,
      });
    }
    setShowEditProfile(false);
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
                    <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest mt-2">Horizon Illustrated Identities</p>
                </div>
                <button onClick={() => setShowAvatarPicker(false)} className="p-3 bg-white/40 backdrop-blur-md rounded-2xl text-primary/40 hover:text-primary transition-colors border border-white/40"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
                <div className="grid grid-cols-3 gap-4">
                    {ILLUSTRATED_AVATARS.map((url, i) => (
                        <button 
                            key={i} 
                            onClick={() => selectIllustratedAvatar(url)}
                            className={`aspect-square rounded-[32px] overflow-hidden bg-white/40 border-4 transition-all active:scale-90 animate-reveal-stagger shadow-watercolor ${user.avatarUrl === url ? 'border-primary scale-105' : 'border-transparent hover:border-white/60'}`}
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
    <div className="fixed inset-0 z-[700] bg-white/40 backdrop-blur-xl flex items-center justify-center p-6 animate-fade-in" onClick={() => setShowManageEvents(false)}>
        <div className="bg-paper rounded-3xl w-full max-w-md flex flex-col max-h-[85vh] shadow-watercolor animate-scale-in border border-white/40" onClick={e => e.stopPropagation()}>
            <div className="p-8 pb-4 flex justify-between items-center border-b border-white/40">
                <div>
                    <h3 className="text-2xl font-serif font-bold text-primary tracking-tight leading-none">Manage Events</h3>
                    <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest mt-2">Active & Past Horizons</p>
                </div>
                <button onClick={() => setShowManageEvents(false)} className="p-3 bg-white/40 backdrop-blur-md rounded-2xl text-primary/40 hover:text-primary transition-colors border border-white/40"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 no-scrollbar space-y-6">
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
                                    <span className="block text-[10px] font-black text-primary">124</span>
                                    <span className="text-[7px] font-bold text-primary/30 uppercase tracking-widest">Views</span>
                                </div>
                                <div className="text-center">
                                    <span className="block text-[10px] font-black text-primary">42</span>
                                    <span className="text-[7px] font-bold text-primary/30 uppercase tracking-widest">Joins</span>
                                </div>
                                <div className="text-center">
                                    <span className="block text-[10px] font-black text-primary">8.5</span>
                                    <span className="text-[7px] font-bold text-primary/30 uppercase tracking-widest">Rating</span>
                                </div>
                            </div>
                        </div>
                    );
                }) : (
                    <div className="py-20 text-center opacity-30">
                        <p className="text-sm font-bold uppercase tracking-widest">No events to manage</p>
                    </div>
                )}
            </div>
            <div className="p-8 pt-0">
                <button onClick={() => { setShowManageEvents(false); setShowCreateEvent(true); }} className="w-full py-5 bg-primary text-white rounded-2xl font-bold text-[11px] uppercase tracking-[0.2em] shadow-glow-sunset active:scale-95 transition-all">
                    Create New Horizon
                </button>
            </div>
        </div>
    </div>
  );

  const EditProfileModal = () => (
    <div className="fixed inset-0 z-[800] bg-white flex flex-col animate-fade-in">
        <div className="px-6 pt-12 pb-6 flex items-center justify-between sticky top-0 bg-white z-10 border-b border-gray-100">
            <button onClick={() => setShowEditProfile(false)} className="p-3 bg-gray-50 rounded-2xl text-primary/40"><X size={20} /></button>
            <h2 className="text-xl font-serif font-bold text-primary">Edit Profile</h2>
            <button onClick={handleSaveProfile} className="px-5 py-2.5 bg-primary text-white rounded-full font-bold text-[10px] uppercase tracking-widest shadow-glow-sunset">Save</button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-20 space-y-8 no-scrollbar bg-white">
            {/* About Me */}
            <section>
                <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary/40 mb-4 px-1">About Me</h3>
                <div className="space-y-3">
                    <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                        <label className="block text-[8px] font-black text-primary/30 uppercase tracking-widest mb-1">Name</label>
                        <input 
                            type="text" 
                            value={editName} 
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full bg-transparent font-bold text-primary focus:outline-none"
                        />
                    </div>
                    <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 flex justify-between items-start">
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
                    <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
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
                    <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 flex justify-between items-center">
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
                    <button className="w-full p-5 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                            <Music size={20} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary/40">Add hobbies</span>
                        <div className="ml-auto flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-rose-500" />
                            <ChevronRight size={18} className="text-primary/20" />
                        </div>
                    </button>
                    <button className="w-full p-5 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-500 flex items-center justify-center">
                            <Plane size={20} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary/40">Places I want to visit</span>
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
                    <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-4">
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
                    <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-4">
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
                    <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-4">
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
                    <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 flex justify-between items-center">
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
                    <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 flex justify-between items-center">
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
        className={`w-28 h-28 rounded-[40px] p-1 relative transition-all active:scale-95 cursor-pointer group ${isBusiness ? 'bg-black' : 'bg-[#FFB7B7]'}`}
    >
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
        <div className="w-full h-full bg-white rounded-[36px] overflow-hidden flex items-center justify-center relative shadow-inner">
            {user.avatarUrl ? (
                <img src={user.avatarUrl} className="w-full h-full object-cover" alt="Profile" referrerPolicy="no-referrer" />
            ) : (
                <span className="text-3xl font-serif font-bold text-black uppercase">{user.name.charAt(0)}</span>
            )}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera size={20} className="text-white" />
            </div>
        </div>
        <div className={`absolute -bottom-1 -right-1 w-10 h-10 rounded-full border-[3px] border-white shadow-lg flex items-center justify-center bg-[#FFB7B7] text-white`}>
            {isBusiness ? <ShieldCheck size={16} /> : <Zap size={16} />}
        </div>
    </div>
  );

  return (
    <div className={`h-full overflow-y-auto pb-44 no-scrollbar font-sans transition-colors duration-500 bg-transparent text-primary`}>
      
      {showAvatarPicker && <AvatarPickerModal />}
      {showManageEvents && <ManageEventsModal />}
      {showEditProfile && <EditProfileModal />}
      {showScenarioGame && <ScenarioGameModal onClose={() => setShowScenarioGame(false)} userName={user.name} />}
      
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

          <div className="px-6 pt-16 relative">
              <button 
                  onClick={onOpenSettings}
                  className={`absolute top-12 right-6 w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-95 bg-white text-[#432818] shadow-xl z-20`}
              >
                  <Settings size={24} />
              </button>

              <div className="flex items-center gap-6 mb-6">
                  {renderAvatar()}
                  
                  <div className="flex-1 flex flex-col gap-2">
                      <div className={`flex items-center justify-between px-4 py-3 rounded-[24px] bg-[#FFF9E5] transition-all shadow-sm`}>
                          <div className="flex items-center gap-2.5">
                              <Award size={16} className="text-[#F59E0B]" />
                              <span className="text-[9px] font-black uppercase tracking-[0.15em] text-[#432818]/60">Karma</span>
                          </div>
                          <span className={`text-xs font-black text-[#432818]`}>24</span>
                      </div>
                      <div className={`flex items-center justify-between px-4 py-3 rounded-[24px] bg-[#F0F7FF] transition-all shadow-sm`}>
                          <div className="flex items-center gap-2.5">
                              <History size={16} className="text-[#3B82F6]" />
                              <span className="text-[9px] font-black uppercase tracking-[0.15em] text-[#432818]/60">Exp.</span>
                          </div>
                          <span className={`text-xs font-black text-[#1D4ED8]`}>{historyEvents.length}</span>
                      </div>
                      <div className={`flex items-center justify-between px-4 py-3 rounded-[24px] bg-[#F0FDF4] transition-all shadow-sm`}>
                          <div className="flex items-center gap-2.5">
                              <ShieldCheck size={16} className="text-[#10B981]" />
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
              </div>
          </div>

          <div className="flex flex-col items-start px-6 mb-4">
              <h1 className={`text-3xl font-serif font-bold tracking-tight leading-none text-primary`}>
                  {user.isRegistered ? user.name : 'Guest'}
              </h1>
              <div className="flex items-center justify-between w-full mt-3">
                  <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-primary/40 font-bold text-[10px] uppercase tracking-widest">
                          <MapPin size={11} className="text-primary" /> {currentCity}
                      </span>
                      <div className="w-1 h-1 bg-primary/10 rounded-full"></div>
                      <span className="text-primary font-bold text-[10px] uppercase tracking-[0.2em]">
                          {isBusiness ? 'Partner Pro' : 'ID Passport'}
                      </span>
                  </div>
              </div>
          </div>

          {/* Action Buttons: Create & Manage */}
          <div className="px-6 mb-6 flex gap-3">
              <button 
                onClick={() => setShowCreateEvent(true)}
                className="flex-1 py-5 bg-primary text-white rounded-2xl font-bold text-[11px] uppercase tracking-[0.2em] shadow-glow-sunset active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                  <Sparkles size={18} />
                  Create Event
              </button>
              <button 
                onClick={() => setShowManageEvents(true)}
                className="flex-1 py-5 bg-white/40 backdrop-blur-md text-primary rounded-2xl font-bold text-[11px] uppercase tracking-[0.2em] border border-white/60 shadow-watercolor active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                  <LayoutGrid size={18} />
                  Manage
              </button>
          </div>

          {/* Gamified Scenario Section */}
          <button 
            onClick={() => setShowScenarioGame(true)}
            className="w-full mb-6 p-6 rounded-[32px] relative overflow-hidden flex items-center gap-5 transition-all active:scale-[0.98] shadow-watercolor group border border-white/40"
            style={{ background: 'linear-gradient(135deg, #FCE7F3 0%, #F3E8FF 100%)' }}
          >
              <div className="relative z-10 text-left flex-1">
                  <div className="inline-block bg-white/60 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-bold text-primary uppercase tracking-widest mb-3">
                    Game Quest
                  </div>
                  <h3 className="text-lg font-serif font-bold text-primary leading-tight mb-2">Tell us more about yourself with a game</h3>
                  <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest opacity-60">Tap to start the match</p>
              </div>
              
              <div className="relative shrink-0 w-24 h-24 flex items-center justify-center">
                  <div className="absolute inset-0 bg-white/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
                  <img 
                    src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=transparent" 
                    className="w-20 h-20 object-contain relative z-10 drop-shadow-lg animate-float" 
                    alt="Caricature" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute -top-2 -right-2 bg-primary text-white p-2 rounded-xl shadow-lg rotate-12 group-hover:rotate-0 transition-transform">
                      <Gamepad2 size={16} />
                  </div>
              </div>
              
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-3xl" />
          </button>

      <div className="px-6 space-y-6">
          {/* Automatic Carousel Recommendations Section */}
          <section>
              <div className="flex items-center gap-2 mb-5 px-1">
                  <Sparkles size={16} className="text-primary/40" />
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] opacity-40">Recommendations</h3>
              </div>
              <div className="relative h-32 overflow-hidden rounded-[32px] shadow-watercolor border border-white/40">
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
                      <button key={event.id} onClick={() => onSelectEvent?.(event)} className={`flex-shrink-0 w-40 p-3 rounded-[32px] border border-black/10 bg-white/40 flex flex-col items-start gap-2 text-left transition-all shadow-watercolor`}>
                          <div className="w-full aspect-square rounded-[24px] overflow-hidden mb-1 bg-white/40 group">
                              <img src={event.videoThumbnail} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={event.title} referrerPolicy="no-referrer" />
                          </div>
                          <h4 className="text-[10px] font-bold leading-tight line-clamp-1 px-1">{event.title}</h4>
                      </button>
                  ))}
                  {historyEvents.length === 0 && <div className="w-full py-10 text-center opacity-30"><p className="text-[10px] font-bold uppercase tracking-widest">No activity yet</p></div>}
              </div>
          </section>

          {/* Premium Subscription Card */}
          <section>
              <div className="relative overflow-hidden rounded-[40px] p-6 shadow-watercolor border border-white/40 bg-white/40 group">
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
                                  <h3 className="text-lg font-serif font-bold text-primary tracking-tight">Horizon</h3>
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
                              <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-white/30 border border-white/40">
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
          <section className="space-y-3 pb-24 pt-4 border-t border-white/40">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] opacity-40 mb-3 px-1">Management & Legal</h3>
              <button onClick={() => setShowLanguageModal(true)} className={`w-full p-5 rounded-[32px] border border-white/40 bg-white/40 flex items-center justify-between transition-all shadow-watercolor active:scale-95`}>
                  <div className="flex items-center gap-4">
                      <Globe size={18} className="text-primary/40" />
                      <div className="text-left">
                          <span className="text-[12px] font-bold block">Language</span>
                          <span className="text-[9px] font-bold text-primary uppercase tracking-widest">{LANGUAGES.find(l => l.id === user.language)?.name}</span>
                      </div>
                  </div>
                  <ChevronRight size={16} className="text-primary/20" />
              </button>
              <button className={`w-full p-5 rounded-[32px] border border-white/40 bg-white/40 flex items-center justify-between transition-all shadow-watercolor active:scale-95`}>
                  <div className="flex items-center gap-4">
                      <Gavel size={18} className="text-primary/40" />
                      <span className="text-[12px] font-bold">Terms & Privacy</span>
                  </div>
                  <ChevronRight size={16} className="text-primary/20" />
              </button>

              {/* Conditional Button: Register for Guests, Logout for Registered Users */}
              {user.isRegistered ? (
                  <button 
                    onClick={onLogout} 
                    className={`w-full p-5 rounded-[32px] border border-rose-100 bg-rose-50 text-rose-500 flex items-center gap-4 active:scale-95 transition-all mt-6 shadow-watercolor`}
                  >
                      <LogOut size={18} />
                      <span className="text-[11px] font-bold uppercase tracking-widest">Logout</span>
                  </button>
              ) : (
                  <button 
                    onClick={onRegister} 
                    className={`w-full p-5 rounded-[32px] border border-primary bg-primary text-white flex items-center gap-4 active:scale-95 transition-all mt-6 shadow-glow-sunset`}
                  >
                      <Zap size={18} fill="currentColor" />
                      <span className="text-[11px] font-bold uppercase tracking-widest">Register</span>
                  </button>
              )}
          </section>
      </div>
    </div>
  );
};

export default ProfileView;
