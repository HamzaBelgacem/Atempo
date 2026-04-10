
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Heart, MessageSquare, X, Camera, Globe, Check, Plus, Loader2, Sparkles, Image as ImageIcon, Users, Briefcase, ChevronRight, ChevronLeft, User as UserIcon, Languages, Gift, Share2, MoreHorizontal, MessageCircle } from 'lucide-react';
import { User, Event, MemoryItem, AppTheme } from '../types';
import { EXPLORE_MEMORIES, MOCK_BUSINESSES } from '../constants';

interface MemoriesViewProps {
    user: User;
    events: Event[];
    onNavigateToEvent: (event: Event) => void;
    onTriggerRegistration: () => void;
    onPublishingToggle?: (isPublishing: boolean) => void;
    onImageViewerToggle?: (isOpen: boolean) => void;
    currentCity: string;
    likedMemoryIds?: string[];
    memoryComments?: Record<string, string[]>;
    onToggleLike?: (id: string) => void;
    onAddComment?: (id: string, comment: string) => void;
    userMemories: MemoryItem[];
    onAddMemory: (memory: MemoryItem) => void;
}

interface CityStory {
    id: string;
    city: string;
    country: string;
    image: string;
    borderColor: string;
}

const MOCK_CITY_STORIES: Record<string, CityStory[]> = {
    'GENERAL': [
        { id: 's1', city: 'Paris', country: 'France', image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=400', borderColor: 'border-amber-400' },
        { id: 's2', city: 'Florence', country: 'Italy', image: 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?q=80&w=400', borderColor: 'border-rose-400' },
        { id: 's3', city: 'Kyoto', country: 'Japan', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=400', borderColor: 'border-emerald-400' },
        { id: 's4', city: 'Bilbao', country: 'Spain', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=400', borderColor: 'border-blue-400' },
        { id: 's5', city: 'London', country: 'UK', image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=400', borderColor: 'border-purple-400' }
    ],
    'ARLO': [
        { id: 'a1', city: 'Berlin', country: 'Germany', image: 'https://images.unsplash.com/photo-1518998053574-53ee7511c914?q=80&w=400', borderColor: 'border-zinc-400' },
        { id: 'a2', city: 'New York', country: 'USA', image: 'https://images.unsplash.com/photo-1493306454983-c5c073fba6bd?q=80&w=400', borderColor: 'border-amber-400' }
    ],
    'ZORA': [
        { id: 'z1', city: 'New Orleans', country: 'USA', image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=400', borderColor: 'border-orange-400' },
        { id: 'z2', city: 'Havana', country: 'Cuba', image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=400', borderColor: 'border-red-400' }
    ]
};

const MOCK_FRIENDS_POSTS = [
    {
        id: 'fp1',
        userName: 'ARLO',
        avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Arlo',
        from: 'DE',
        to: 'ES',
        day: 'Monday',
        caption: 'The new exhibition at the Guggenheim is mind-blowing. The way they use space and light is incredible.',
        images: [
            'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800',
            'https://images.unsplash.com/photo-1518998053574-53ee7511c914?q=80&w=800',
            'https://images.unsplash.com/photo-1493306454983-c5c073fba6bd?q=80&w=800'
        ],
        likes: 156,
        comments: 12
    },
    {
        id: 'fp2',
        userName: 'ZORA',
        avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Zora',
        from: 'US',
        to: 'CU',
        day: 'Friday',
        caption: 'Found this hidden jazz club in the basement of an old library. Pure magic.',
        images: [
            'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=800',
            'https://images.unsplash.com/photo-1514525253361-bee8718a340b?q=80&w=800'
        ],
        likes: 89,
        comments: 5
    }
];

const MemoriesView: React.FC<MemoriesViewProps> = ({ 
    user, 
    events, 
    onNavigateToEvent, 
    onPublishingToggle,
    onImageViewerToggle,
    currentCity,
    likedMemoryIds = [],
    memoryComments = {},
    onToggleLike,
    userMemories,
    onAddMemory,
}) => {
    const [activeFeed, setActiveFeed] = useState<'GENERAL' | 'PERSONAL' | 'FRIENDS'>('GENERAL');
    const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeFilterName, setActiveFilterName] = useState<string | null>(null);
    const [selectedCityFilter, setSelectedCityFilter] = useState<string | null>(null);
    
    // New Memory Flow
    const [isPublishing, setIsPublishing] = useState(false);

    useEffect(() => {
        onImageViewerToggle?.(selectedMemory !== null);
    }, [selectedMemory, onImageViewerToggle]);

    useEffect(() => {
        onPublishingToggle?.(isPublishing);
        return () => onPublishingToggle?.(false);
    }, [isPublishing, onPublishingToggle]);
    const [tempPhoto, setTempPhoto] = useState<string | null>(null);
    const [caption, setCaption] = useState('');
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const touchStartX = useRef<number>(0);

    const isDark = user.theme === AppTheme.DARK;
    const themeStyles = useMemo(() => {
        if (isDark) return { bg: 'bg-transparent', accent: 'text-accent', header: 'text-white', sidebar: 'bg-slate-900/95 border-white/10' };
        return { bg: 'bg-transparent', accent: 'text-accent', header: 'text-[#432818]', sidebar: 'bg-white/95 border-[#432818]/10' };
    }, [isDark]);

    const FOLLOWED_FRIENDS = [
        { name: 'ARLO', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Arlo' },
        { name: 'ZORA', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Zora' },
        { name: 'ELENA', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Elena' },
        { name: 'SOFIA', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Sofia' },
    ];

    const FOLLOWED_BUSINESSES = MOCK_BUSINESSES.map(b => ({
        name: b.name.toUpperCase(),
        avatar: b.logo
    }));

    const masonryItems = useMemo(() => [
        { id: 'm-arlo', url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800', userName: 'ARLO', caption: 'Modern art installation', likes: 124, type: 'image', height: 'h-[280px]', eventId: '1', city: 'Berlin' },
        { id: 'p1', url: 'placeholder', userName: '', caption: '', likes: 0, type: 'image', height: 'h-[140px]' },
        { id: 'm-zora', url: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=800', userName: 'ZORA', caption: 'Jazz night in the city', likes: 88, type: 'image', height: 'h-[200px]', eventId: '2', city: 'London' },
        { id: 'p2', url: 'placeholder', userName: '', caption: '', likes: 0, type: 'image', height: 'h-[180px]' },
        { id: 'm-elena', url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800', userName: 'ELENA', caption: 'Grand finale at the theatre', likes: 234, type: 'image', height: 'h-[220px]', eventId: '3' },
        { id: 'p3', url: 'placeholder', userName: '', caption: '', likes: 0, type: 'image', height: 'h-[120px]' },
        { id: 'm-sofia', url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=800', userName: 'SOFIA', caption: 'Night lights at the festival', likes: 45, type: 'image', height: 'h-[160px]', eventId: '4' },
    ], []);

    const filteredMasonry = useMemo(() => {
        let base = activeFeed === 'GENERAL' ? masonryItems : userMemories;
        if (activeFilterName) {
            base = base.filter(item => item.userName.toUpperCase() === activeFilterName.toUpperCase());
        }
        if (selectedCityFilter) {
            base = base.filter(item => item.city === selectedCityFilter);
        }
        return base;
    }, [masonryItems, userMemories, activeFilterName, activeFeed, selectedCityFilter]);

    const filteredExplore = useMemo(() => {
        if (activeFeed === 'PERSONAL') return [];
        let base = EXPLORE_MEMORIES;
        if (activeFilterName) {
            base = base.filter(item => item.userName.toUpperCase() === activeFilterName.toUpperCase());
        }
        if (selectedCityFilter) {
            base = base.filter(item => (item as any).city === selectedCityFilter);
        }
        return base;
    }, [activeFilterName, activeFeed, selectedCityFilter]);

    const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setTempPhoto(ev.target?.result as string);
                setIsPublishing(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePublish = () => {
        if (!tempPhoto) return;
        const heights = ['h-40', 'h-56', 'h-32', 'h-48', 'h-64'];
        const randomHeight = heights[Math.floor(Math.random() * heights.length)];
        
        const newMemory: MemoryItem = {
            id: `user-${Date.now()}`,
            url: tempPhoto,
            userName: user.name.toUpperCase(),
            caption: caption || 'New memory',
            likes: 0,
            type: 'image',
            height: randomHeight
        };
        onAddMemory(newMemory);
        setIsPublishing(false);
        setTempPhoto(null);
        setCaption('');
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        const touchCurrentX = e.touches[0].clientX;
        if (!isSidebarOpen && touchStartX.current < 50 && touchCurrentX - touchStartX.current > 30) {
            setIsSidebarOpen(true);
        }
        if (isSidebarOpen && touchStartX.current - touchCurrentX > 30) {
            setIsSidebarOpen(false);
        }
    };

    const CityStoriesRow = ({ stories }: { stories: CityStory[] }) => (
        <div className="flex gap-3 overflow-x-auto no-scrollbar py-2 px-1">
            {stories.map((story) => (
                <button 
                    key={story.id} 
                    onClick={() => setSelectedCityFilter(selectedCityFilter === story.city ? null : story.city)}
                    className="flex flex-col items-center shrink-0"
                >
                    <div className={`w-[64px] h-[64px] rounded-full p-0.5 border-[2px] shadow-sm transition-all active:scale-95 ${selectedCityFilter === story.city ? 'border-accent ring-1 ring-accent/20' : story.borderColor}`}>
                        <div className="w-full h-full rounded-full overflow-hidden bg-gray-100">
                            <img src={story.image} className="w-full h-full object-cover" alt={story.city} referrerPolicy="no-referrer" />
                        </div>
                    </div>
                    <div className="mt-2 text-center">
                        <p className={`text-[9px] font-black tracking-tight leading-none ${isDark ? 'text-white' : 'text-black'}`}>{story.city}</p>
                        <p className="text-[7px] font-bold text-gray-400 mt-0.5 uppercase tracking-widest">{story.country}</p>
                    </div>
                </button>
            ))}
        </div>
    );

    const MemoryCard: React.FC<{ item: any; className?: string }> = ({ item, className = '' }) => (
        <div 
            onClick={() => setSelectedMemory(item)}
            className={`relative break-inside-avoid mb-2 rounded-[32px] overflow-hidden group cursor-pointer active:scale-[0.98] transition-all shadow-ios-deep ${item.height || 'h-40'} ${className}`}
        >
            {item.type === 'image' && item.url === 'placeholder' ? (
                <div className="w-full h-full bg-white/40 backdrop-blur-sm border border-black/5" />
            ) : item.type === 'video' ? (
                <video 
                    src={item.url} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    autoPlay 
                    muted 
                    loop 
                    playsInline
                />
            ) : (
                <img src={item.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={item.userName} referrerPolicy="no-referrer" />
            )}
            {item.url !== 'placeholder' && (
                <>
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center overflow-hidden">
                            <img src={item.userName === user.name.toUpperCase() ? (user.avatarUrl || `https://api.dicebear.com/7.x/notionists/svg?seed=${user.name}`) : `https://api.dicebear.com/7.x/notionists/svg?seed=${item.userName}`} className="w-full h-full object-cover" alt={item.userName} referrerPolicy="no-referrer" />
                        </div>
                        <span className="text-[9px] font-bold text-white uppercase tracking-widest drop-shadow-md">
                            {item.userName}
                        </span>
                    </div>
                </>
            )}
        </div>
    );

    const FriendsFeed = () => (
        <div className="space-y-12">
            {MOCK_FRIENDS_POSTS.map((post) => (
                <div key={post.id} className="animate-fade-in">
                    {/* User Header */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full overflow-hidden border border-black/5 shadow-sm">
                                    <img src={post.avatar} className="w-full h-full object-cover" alt={post.userName} referrerPolicy="no-referrer" />
                                </div>
                                <div className="absolute -bottom-1 -left-1 w-5 h-5 rounded-full border-2 border-white overflow-hidden shadow-sm">
                                    <img src={`https://flagcdn.com/w40/${post.from.toLowerCase()}.png`} className="w-full h-full object-cover" alt={post.from} />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-base font-serif font-bold text-[#432818] leading-tight">{post.userName}</h3>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="text-[10px] font-black text-accent">{post.from}</span>
                                    <div className="flex items-center gap-0.5">
                                        <div className="w-3 h-[1px] bg-gray-300" />
                                        <ChevronRight size={8} className="text-gray-300" />
                                        <div className="w-3 h-[1px] bg-gray-300" />
                                    </div>
                                    <span className="text-[10px] font-black text-gray-400">{post.to}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <button className="text-gray-300 hover:text-gray-500 transition-colors">
                                <MoreHorizontal size={20} />
                            </button>
                            <span className="text-[10px] font-bold text-gray-400 mt-1">{post.day}</span>
                        </div>
                    </div>

                    {/* Caption */}
                    <div className="flex items-center gap-2 mb-4">
                        <p className="text-lg font-serif font-medium text-[#432818] tracking-tight">{post.caption}</p>
                        <button className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                            <Languages size={14} />
                        </button>
                    </div>

                    {/* Image Grid */}
                    <div className={`grid gap-1 rounded-2xl overflow-hidden ${
                        post.images.length === 1 ? 'grid-cols-1' : 
                        post.images.length === 2 ? 'grid-cols-2' : 
                        'grid-cols-3'
                    }`}>
                        {post.images.map((img, i) => (
                            <div 
                                key={i} 
                                onClick={() => setSelectedMemory({ id: `${post.id}-${i}`, url: img, userName: post.userName, caption: post.caption, likes: post.likes, type: 'image' } as any)}
                                className={`relative aspect-square bg-gray-100 cursor-pointer active:scale-[0.98] transition-all ${
                                    post.images.length === 1 ? 'aspect-video' : ''
                                }`}
                            >
                                <img src={img} className="w-full h-full object-cover" alt="Post" referrerPolicy="no-referrer" />
                                {i < 3 && (
                                    <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
                                        <Sparkles size={10} className="text-white" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Interaction Bar */}
                    <div className="flex items-center justify-between mt-4 px-1">
                        <div className="flex items-center gap-6">
                            <button className="flex items-center gap-1.5 text-gray-400 hover:text-accent transition-colors">
                                <Heart size={20} />
                                <span className="text-xs font-bold">{post.likes}</span>
                            </button>
                            <button className="text-gray-400 hover:text-accent transition-colors">
                                <MessageSquare size={20} />
                            </button>
                        </div>
                        <div className="flex items-center gap-6">
                            <button className="text-gray-400 hover:text-accent transition-colors">
                                <Languages size={20} />
                            </button>
                            <button className="text-gray-400 hover:text-accent transition-colors">
                                <Gift size={20} />
                            </button>
                            <button className="text-gray-400 hover:text-accent transition-colors">
                                <Share2 size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div 
            className={`h-full flex flex-col font-sans transition-colors duration-500 ${themeStyles.bg} relative overflow-hidden`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
        >
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" capture="environment" onChange={handlePhotoSelect} />

            {/* Sidebar Flow */}
            <div className={`fixed top-0 left-0 h-full w-72 z-[600] transition-transform duration-500 ease-out shadow-2xl backdrop-blur-xl border-r ${themeStyles.sidebar} ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full pt-20 px-6 pb-12 overflow-y-auto no-scrollbar">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h3 className={`text-xl font-black tracking-tighter ${themeStyles.header}`}>Following</h3>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">YOUR HORIZON NETWORK</p>
                        </div>
                        <button onClick={() => setIsSidebarOpen(false)} className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-gray-400">
                            <X size={16} />
                        </button>
                    </div>

                    <button 
                        onClick={() => { setActiveFilterName(null); setSelectedCityFilter(null); setIsSidebarOpen(false); }}
                        className={`flex items-center gap-4 p-3 rounded-2xl transition-all mb-8 ${activeFilterName === null ? 'bg-accent text-white shadow-glow-sunset' : 'hover:bg-black/5 text-gray-400'}`}
                    >
                        <div className="w-10 h-10 rounded-full border border-current flex items-center justify-center">
                            <Globe size={18} />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest">SEE ALL</span>
                        {activeFilterName === null && <Check size={14} className="ml-auto" />}
                    </button>

                    <div className="space-y-10">
                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <Users size={12} className="text-gray-400" />
                                <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">FRIENDS</h4>
                            </div>
                            <div className="space-y-2">
                                {FOLLOWED_FRIENDS.map(friend => (
                                    <button 
                                        key={friend.name}
                                        onClick={() => { setActiveFilterName(friend.name); setSelectedCityFilter(null); setIsSidebarOpen(false); }}
                                        className={`w-full flex items-center gap-4 p-2 rounded-2xl transition-all ${activeFilterName === friend.name ? 'bg-accent text-white shadow-sm' : 'hover:bg-black/5 text-gray-400'}`}
                                    >
                                        <div className="w-10 h-10 rounded-full overflow-hidden bg-white border border-black/5">
                                            <img src={friend.avatar} className="w-full h-full object-cover" alt={friend.name} referrerPolicy="no-referrer" />
                                        </div>
                                        <span className="text-[11px] font-black uppercase tracking-tight">{friend.name}</span>
                                        {activeFilterName === friend.name && <Check size={14} className="ml-auto" />}
                                    </button>
                                ))}
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <Briefcase size={12} className="text-gray-400" />
                                <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">BUSINESSES</h4>
                            </div>
                            <div className="space-y-2">
                                {FOLLOWED_BUSINESSES.map(biz => (
                                    <button 
                                        key={biz.name}
                                        onClick={() => { setActiveFilterName(biz.name); setSelectedCityFilter(null); setIsSidebarOpen(false); }}
                                        className={`w-full flex items-center gap-4 p-2 rounded-2xl transition-all ${activeFilterName === biz.name ? 'bg-accent text-white shadow-sm' : 'hover:bg-black/5 text-gray-400'}`}
                                    >
                                        <div className="w-10 h-10 rounded-full overflow-hidden bg-white border border-black/5">
                                            <img src={biz.avatar} className="w-full h-full object-cover" alt={biz.name} referrerPolicy="no-referrer" />
                                        </div>
                                        <span className="text-[11px] font-black uppercase tracking-tight truncate flex-1 text-left">{biz.name}</span>
                                        {activeFilterName === biz.name && <Check size={14} className="ml-auto" />}
                                    </button>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            {/* Publishing Overlay */}
            {isPublishing && tempPhoto && (
                <div className="fixed inset-0 z-[700] bg-black/95 backdrop-blur-xl flex flex-col animate-fade-in">
                    <div className="px-8 pt-16 flex justify-between items-center text-white">
                        <h2 className="text-xl font-black uppercase tracking-tighter">Edit Memory</h2>
                        <button onClick={() => setIsPublishing(false)} className="p-2 bg-white/10 rounded-full"><X size={20}/></button>
                    </div>
                    <div className="flex-1 p-8 flex flex-col items-center justify-center">
                        <div className="w-full max-w-sm aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl relative">
                            <img src={tempPhoto} className="w-full h-full object-cover" alt="Preview" referrerPolicy="no-referrer" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-6 left-6 flex items-center gap-2">
                                <Sparkles size={16} className="text-accent" />
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">Horizon Editor</span>
                            </div>
                        </div>
                        <input 
                            type="text"
                            placeholder="Add a caption..."
                            className="w-full max-w-sm mt-8 bg-transparent border-b border-white/20 py-4 text-white text-lg font-medium focus:outline-none focus:border-accent text-center"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                        />
                    </div>
                    <div className="p-10 pb-16">
                        <button 
                            onClick={handlePublish}
                            className="w-full py-6 bg-accent text-white rounded-[32px] font-black text-[11px] uppercase tracking-widest shadow-glow-sunset active:scale-95 transition-all"
                        >
                            Publish Now
                        </button>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="px-6 pt-8 pb-4 sticky top-0 z-20 backdrop-blur-xl bg-white/40">
                <div className="flex justify-between items-center mb-3">
                    <div>
                        <h1 className="text-3xl font-serif font-bold tracking-tight text-[#432818]">Memories</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => fileInputRef.current?.click()} 
                            className="w-7 h-7 rounded-full flex items-center justify-center transition-all active:scale-95 bg-white/60 text-slate-400 border border-white/40 shadow-sm"
                        >
                            <Camera size={14} />
                        </button>
                        <button onClick={() => setIsSidebarOpen(true)} className="w-7 h-7 rounded-full flex items-center justify-center transition-all active:scale-95 bg-white/60 text-slate-400 border border-white/40 shadow-sm">
                            <Users size={12} />
                        </button>
                    </div>
                </div>

                <div className="flex gap-1 p-1 rounded-[24px] bg-white/60 border border-white/40 shadow-sm backdrop-blur-md">
                    <button 
                        onClick={() => { setActiveFeed('GENERAL'); setSelectedCityFilter(null); }}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${activeFeed === 'GENERAL' ? 'bg-white text-[#FFB7B7] shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <Globe size={14} /> General
                    </button>
                    <button 
                        onClick={() => { setActiveFeed('FRIENDS'); setSelectedCityFilter(null); }}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${activeFeed === 'FRIENDS' ? 'bg-white text-[#FFB7B7] shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <Users size={14} /> Friends
                    </button>
                    <button 
                        onClick={() => { setActiveFeed('PERSONAL'); setSelectedCityFilter(null); }}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${activeFeed === 'PERSONAL' ? 'bg-white text-[#FFB7B7] shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <UserIcon size={14} /> My Feed
                    </button>
                </div>
                
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-3 ml-2">
                    {activeFeed === 'GENERAL' && activeFilterName ? `TRACES OF ${activeFilterName}` : ''}
                </p>
            </div>

            {/* Feed Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-40 mt-1">
                {activeFeed === 'PERSONAL' && (
                    <div className="mb-4">
                        {/* City Stories in Mi Feed */}
                        <div className="mb-2">
                            <CityStoriesRow stories={MOCK_CITY_STORIES.GENERAL} />
                        </div>

                        {userMemories.length === 0 ? (
                            <div className="mt-0">
                                <div className="flex items-center gap-2 mb-2 px-1">
                                    <div className="w-1 h-4 bg-accent rounded-full" />
                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Your Memory Gallery</h3>
                                </div>
                                <div className="grid grid-cols-3 gap-1 border border-black/5 rounded-[32px] overflow-hidden bg-white/40 backdrop-blur-sm">
                                    {[...Array(9)].map((_, i) => (
                                        <div 
                                            key={i} 
                                            className="aspect-square border border-black/[0.03] flex items-center justify-center group relative cursor-pointer"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <div className="absolute inset-0 bg-black/[0.01] group-hover:bg-accent/[0.03] transition-colors" />
                                            <ImageIcon size={16} className="text-black/5 group-hover:text-accent/20 transition-colors" />
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 flex flex-col items-center justify-center text-center opacity-30">
                                    <p className="text-[9px] font-black uppercase tracking-[0.2em]">You haven't published anything yet</p>
                                    <p className="text-[7px] font-bold uppercase tracking-widest mt-1">Tap any space to start</p>
                                </div>
                            </div>
                        ) : (
                            <div className="columns-3 gap-2">
                                {filteredMasonry.map((item, idx) => (
                                    <MemoryCard 
                                        key={item.id} 
                                        item={item} 
                                        className={idx === 1 ? 'mt-4' : idx === 2 ? 'mt-2' : ''} 
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeFeed === 'FRIENDS' && (
                    <div className="mb-8">
                        <FriendsFeed />
                    </div>
                )}

                {activeFeed === 'GENERAL' && (
                    <>
                        {/* City Stories in General Feed when a friend is selected */}
                        {activeFilterName && MOCK_CITY_STORIES[activeFilterName] && (
                            <div className="mb-10">
                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2 px-1">Viajes de {activeFilterName}</h3>
                                <CityStoriesRow stories={MOCK_CITY_STORIES[activeFilterName]} />
                            </div>
                        )}

                        <div className="columns-3 gap-2">
                            {filteredMasonry.map((item, idx) => (
                                <MemoryCard 
                                    key={item.id} 
                                    item={item} 
                                    className={idx === 1 ? 'mt-4' : idx === 2 ? 'mt-2' : ''} 
                                />
                            ))}
                            {filteredExplore.map((m, i) => (
                                <MemoryCard 
                                    key={m.id + i} 
                                    item={m} 
                                    className={(filteredMasonry.length + i) === 1 ? 'mt-4' : (filteredMasonry.length + i) === 2 ? 'mt-2' : ''}
                                />
                            ))}
                            {filteredMasonry.length === 0 && filteredExplore.length === 0 && (
                                <div className="col-span-3 h-64 flex flex-col items-center justify-center text-center opacity-30">
                                    <Users size={48} className="mb-4" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">NO RECENT MEMORIES</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
            
            {/* Sidebar Hint for Swipe */}
            {activeFeed === 'GENERAL' && !isSidebarOpen && (
                <div className="absolute left-1 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 opacity-20 pointer-events-none">
                    <div className="w-1 h-8 bg-black rounded-full mb-1"></div>
                    <span className="text-[6px] font-black vertical-text uppercase tracking-widest">SWIPE</span>
                </div>
            )}

            {/* Full Screen Image Viewer */}
            {selectedMemory && (
                <div className="fixed inset-0 z-[1000] bg-[#FDFCF8] overflow-y-auto animate-fade-in">
                    {/* Header / Back Button */}
                    <div className="sticky top-0 z-10 p-4 flex items-center">
                        <button 
                            onClick={() => setSelectedMemory(null)}
                            className="w-10 h-10 rounded-full bg-black/5 backdrop-blur-md flex items-center justify-center text-[#432818] active:scale-90 transition-all border border-black/5"
                        >
                            <ChevronLeft size={24} />
                        </button>
                    </div>

                    <div className="px-2 pb-20">
                        {/* Image Container */}
                        <div className="relative w-full rounded-[40px] overflow-hidden bg-white shadow-watercolor border border-black/5">
                            {selectedMemory.type === 'video' ? (
                                <video 
                                    src={selectedMemory.url} 
                                    className="w-full h-auto object-contain" 
                                    autoPlay 
                                    muted 
                                    loop 
                                    playsInline
                                />
                            ) : (
                                <img 
                                    src={selectedMemory.url} 
                                    className="w-full h-auto object-contain" 
                                    alt={selectedMemory.userName} 
                                    referrerPolicy="no-referrer" 
                                />
                            )}
                        </div>

                        {/* Interaction Bar */}
                        <div className="mt-6 flex items-center justify-between px-4">
                            <div className="flex items-center gap-6">
                                <button className="flex flex-col items-center gap-1">
                                    <Heart size={28} className="text-[#432818]" />
                                    <span className="text-[10px] text-[#432818]/60 font-black uppercase tracking-widest">{selectedMemory.likes}</span>
                                </button>
                                <button className="flex flex-col items-center gap-1">
                                    <MessageCircle size={28} className="text-[#432818]" />
                                    <span className="text-[10px] text-[#432818]/60 font-black uppercase tracking-widest">12</span>
                                </button>
                                <button className="flex flex-col items-center gap-1">
                                    <Share2 size={28} className="text-[#432818]" />
                                    <span className="text-[10px] text-[#432818]/60 font-black uppercase tracking-widest">SHARE</span>
                                </button>
                                <button className="flex flex-col items-center gap-1">
                                    <MoreHorizontal size={28} className="text-[#432818]" />
                                    <span className="text-[10px] text-[#432818]/60 font-black uppercase tracking-widest">MORE</span>
                                </button>
                            </div>
                            <button className="bg-[#E60023] text-white px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                                Guardar
                            </button>
                        </div>

                        {/* User Info Section */}
                        <div className="mt-8 px-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-fuchsia-600 p-[2px]">
                                    <div className="w-full h-full rounded-full bg-white p-[2px]">
                                        <img 
                                            src={`https://api.dicebear.com/7.x/notionists/svg?seed=${selectedMemory.userName}`} 
                                            className="w-full h-full rounded-full object-cover" 
                                            alt={selectedMemory.userName}
                                            referrerPolicy="no-referrer"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-[#432818] font-black text-sm uppercase tracking-widest">{selectedMemory.userName}</h3>
                                    <p className="text-[#432818]/40 text-[10px] font-bold uppercase tracking-widest">Art & Culture Enthusiast • 12k followers</p>
                                </div>
                            </div>
                            <button className="bg-black/5 text-[#432818] px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-black/10 active:scale-95 transition-all">
                                Seguir
                            </button>
                        </div>

                        {/* Content Section */}
                        <div className="mt-6 px-4">
                            <h2 className="text-[#432818] text-2xl font-serif font-medium leading-tight">
                                {selectedMemory.caption}
                            </h2>
                            <p className="mt-3 text-[#432818]/60 text-sm leading-relaxed font-medium">
                                Exploring the intersection of modern art and urban culture. This exhibition captures the essence of contemporary life through vibrant colors and bold textures.
                                <span className="text-[#432818]/30 font-bold ml-2 cursor-pointer uppercase text-[10px] tracking-widest">Ver más</span>
                            </p>
                        </div>

                        {/* Comments Preview */}
                        <div className="mt-10 px-4">
                            <h4 className="text-[#432818] font-black text-[10px] uppercase tracking-widest mb-4 opacity-40">Comentarios</h4>
                            <div className="flex gap-3 mb-6">
                                <div className="w-8 h-8 rounded-full bg-black/5 flex-shrink-0" />
                                <div className="flex-1 bg-black/5 rounded-2xl p-3 border border-black/5">
                                    <p className="text-[#432818]/20 text-[10px] font-bold uppercase tracking-widest italic">Añadir un comentario...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MemoriesView;
