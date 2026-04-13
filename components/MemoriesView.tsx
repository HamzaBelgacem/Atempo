
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, LayoutGroup } from 'motion/react';
import { Heart, MessageSquare, X, Camera, Globe, Check, Plus, Loader2, Sparkles, Image as ImageIcon, Users, Briefcase, ChevronRight, ChevronLeft, User as UserIcon, Languages, Gift, Share2, MoreHorizontal, MessageCircle, Repeat, Send, FlaskConical, Play, Pause, ArrowLeft } from 'lucide-react';
import { User, Event, MemoryItem, AppTheme } from '../types';
import { EXPLORE_MEMORIES, MOCK_BUSINESSES } from '../constants';
import NetworkPanel from './NetworkPanel';

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
    businessStories?: { businessId: string; url: string; timestamp: number }[];
    onAddMemory: (memory: MemoryItem) => void;
    onAddStory?: (story: { businessId: string; url: string; timestamp: number }) => void;
    isSidebarOpen?: boolean;
    onSidebarToggle?: (isOpen: boolean) => void;
    onEventClick?: (event: Event, e?: React.MouseEvent) => void;
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
        url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800',
        urls: [
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
        url: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=800',
        urls: [
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
    onAddComment,
    userMemories,
    businessStories = [],
    onAddMemory,
    onAddStory,
    isSidebarOpen = false,
    onSidebarToggle,
}) => {
    const [activeFeed, setActiveFeed] = useState<'GENERAL' | 'PERSONAL' | 'LAB'>('GENERAL');
    const [isBouncing, setIsBouncing] = useState(false);
    const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);
    const [selectedFriendImage, setSelectedFriendImage] = useState<string | null>(null);
    const [activeFilterName, setActiveFilterName] = useState<string | null>(null);
    const [selectedCityFilter, setSelectedCityFilter] = useState<string | null>(null);
    const [longPressedMemory, setLongPressedMemory] = useState<MemoryItem | null>(null);
    const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
    const [hiddenPostIds, setHiddenPostIds] = useState<string[]>([]);

    const [activeLabFilter, setActiveLabFilter] = useState('Todos');
    const [isLavaPaused, setIsLavaPaused] = useState(false);

    const LAB_CATEGORIES = ['Todos', 'Arte', 'Patrimonio', 'Comida', 'Música', 'Ciencia'];

    const setIsSidebarOpen = (isOpen: boolean) => {
        onSidebarToggle?.(isOpen);
    };
    
    // New Memory Flow
    const [isPublishing, setIsPublishing] = useState(false);
    const [savedMemoryIds, setSavedMemoryIds] = useState<string[]>([]);
    const [followingUserNames, setFollowingUserNames] = useState<string[]>([]);

    useEffect(() => {
        onImageViewerToggle?.(selectedMemory !== null || longPressedMemory !== null || selectedFriendImage !== null);
    }, [selectedMemory, longPressedMemory, selectedFriendImage, onImageViewerToggle]);

    useEffect(() => {
        onPublishingToggle?.(isPublishing);
        return () => onPublishingToggle?.(false);
    }, [isPublishing, onPublishingToggle]);
    const [tempPhoto, setTempPhoto] = useState<string | null>(null);
    const [caption, setCaption] = useState('');
    const [showCommentInput, setShowCommentInput] = useState(false);
    const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
    const [commentText, setCommentText] = useState('');
    const [viewerOpen, setViewerOpen] = useState(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (selectedMemory && !viewerOpen) {
            setViewerOpen(true);
            // Small delay to ensure the DOM is rendered before scrolling
            setTimeout(() => {
                const element = document.getElementById(`feed-item-${selectedMemory.id}`);
                if (element) {
                    element.scrollIntoView({ behavior: 'auto', block: 'start' });
                }
            }, 100);
        } else if (!selectedMemory) {
            setViewerOpen(false);
        }
    }, [selectedMemory, viewerOpen]);
    const touchStartX = useRef<number>(0);

    const { scrollY } = useScroll({
        container: scrollRef,
    });

    const titleScale = useTransform(scrollY, [0, 60], [1, 0.85]);
    const titleOpacity = useTransform(scrollY, [0, 60], [1, 0]);
    const titleBlur = useTransform(scrollY, [0, 60], ["blur(0px)", "blur(4px)"]);
    const titleY = useTransform(scrollY, [0, 60], [0, 60]);

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

    const MemoryPost: React.FC<{ 
        item: MemoryItem; 
        selectedMemoryId: string | undefined;
        likedMemoryIds: string[];
        onToggleLike?: (id: string) => void;
        onHidePost: (id: string) => void;
    }> = ({ item, selectedMemoryId, likedMemoryIds, onToggleLike, onHidePost }) => {
        const [currentImageIndex, setCurrentImageIndex] = useState(0);
        const images = item.urls || [item.url];

        return (
            <div id={`feed-item-${item.id}`} className="mb-8 bg-transparent">
                {/* Post Header */}
                <div className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-black/5">
                            <img 
                                src={item.avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${item.userName}`} 
                                className="w-full h-full object-cover" 
                                alt={item.userName}
                                referrerPolicy="no-referrer"
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-[#432818] font-bold text-[14px] leading-none">{item.userName}</h3>
                            </div>
                            <div className="flex items-center gap-1.5 mt-1">
                                <span className="text-[#432818]/40 text-[11px] font-medium">1w</span>
                                <span className="text-[#432818]/20 text-[11px]">•</span>
                                <button className="text-accent text-[11px] font-bold">Subscribe</button>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                            <MoreHorizontal size={20} />
                        </button>
                        <button 
                            onClick={() => onHidePost(item.id)}
                            className="p-2 text-gray-400 hover:text-gray-600"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Text Content */}
                {item.caption && (
                    <div className="px-4 pb-3">
                        <p className="text-[#432818] text-[15px] leading-relaxed font-medium">
                            {item.caption}
                        </p>
                    </div>
                )}

                {/* Media Carousel */}
                <div className="relative w-full overflow-hidden">
                    <div 
                        className="relative w-full aspect-square bg-black/5"
                    >
                        <div 
                            className="flex h-full transition-transform duration-300 ease-out"
                            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                            onTouchStart={(e) => e.stopPropagation()}
                            onTouchMove={(e) => e.stopPropagation()}
                        >
                            {images.map((url, idx) => (
                                <div key={idx} className="w-full h-full flex-shrink-0">
                                    {item.type === 'video' ? (
                                        <video 
                                            src={url} 
                                            className="w-full h-full object-cover rounded-2xl px-2" 
                                            autoPlay 
                                            muted 
                                            loop 
                                            playsInline
                                        />
                                    ) : (
                                        <img 
                                            src={url === 'placeholder' ? `https://picsum.photos/seed/mem-${item.id}/800/800` : url} 
                                            className="w-full h-full object-cover rounded-2xl px-2" 
                                            alt={item.userName} 
                                            referrerPolicy="no-referrer" 
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Carousel Controls */}
                        {images.length > 1 && (
                            <>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(prev => Math.max(0, prev - 1)); }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(prev => Math.min(images.length - 1, prev + 1)); }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Dot Indicator */}
                    {images.length > 1 && (
                        <div className="flex justify-center gap-1.5 mt-3">
                            {images.map((_, idx) => (
                                <div 
                                    key={idx} 
                                    className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentImageIndex ? 'bg-accent w-3' : 'bg-gray-300'}`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Action Row */}
                <div className="mt-4 flex items-center justify-between px-4">
                    <div className="flex items-center gap-6">
                        <button 
                            onClick={() => onToggleLike?.(item.id)}
                            className="flex items-center gap-1.5 group"
                        >
                            <Heart 
                                size={22} 
                                className={`transition-colors ${likedMemoryIds.includes(item.id) ? 'fill-accent text-accent' : 'text-gray-400 group-hover:text-accent'}`} 
                            />
                            <span className="text-[13px] text-gray-400 font-bold">
                                {((item.likes || 0) + (likedMemoryIds.includes(item.id) ? 1 : 0)).toLocaleString()}
                            </span>
                        </button>
                        <button className="flex items-center gap-1.5 group text-gray-400">
                            <MessageCircle size={22} />
                            <span className="text-[13px] font-bold">{item.commentsCount || 37}</span>
                        </button>
                        <button className="flex items-center gap-1.5 group text-gray-400">
                            <Repeat size={22} />
                            <span className="text-[13px] font-bold">{item.repostsCount || '1.1k'}</span>
                        </button>
                        <button className="text-gray-400">
                            <Send size={22} />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const masonryItems = useMemo(() => [
        { 
            id: 'm-arlo', 
            url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800', 
            urls: [
                'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800',
                'https://images.unsplash.com/photo-1518998053574-53ee7511c914?q=80&w=800',
                'https://images.unsplash.com/photo-1493306454983-c5c073fba6bd?q=80&w=800'
            ],
            userName: 'ARLO', 
            caption: 'Modern art installation. The way they use space and light is incredible.', 
            likes: 124, 
            type: 'image', 
            height: 'h-[280px]', 
            eventId: '1', 
            city: 'Berlin' 
        },
        { id: 'p1', url: 'placeholder', userName: '', caption: '', likes: 0, type: 'image', height: 'h-[140px]' },
        { id: 'm-zora', url: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=800', userName: 'ZORA', caption: 'Jazz night in the city', likes: 88, type: 'image', height: 'h-[200px]', eventId: '2', city: 'London' },
        { id: 'p2', url: 'placeholder', userName: '', caption: '', likes: 0, type: 'image', height: 'h-[180px]' },
        { id: 'm-elena', url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800', userName: 'ELENA', caption: 'Grand finale at the theatre', likes: 234, type: 'image', height: 'h-[220px]', eventId: '3' },
        { id: 'p3', url: 'placeholder', userName: '', caption: '', likes: 0, type: 'image', height: 'h-[120px]' },
        { id: 'm-sofia', url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=800', userName: 'SOFIA', caption: 'Night lights at the festival', likes: 45, type: 'image', height: 'h-[160px]', eventId: '4' },
    ], []);

    const labMemories = useMemo(() => {
        // Filter memories that are "Lab" content (mocking this by taking some from explore or general)
        const base = [...EXPLORE_MEMORIES, ...masonryItems];
        let filtered = base.filter(item => item.id.includes('lab') || (item as any).isLab);
        
        // If no explicit lab items, just take a subset for demo
        if (filtered.length === 0) {
            filtered = base.slice(0, 20).map(item => ({ ...item, isLab: true }));
        }

        if (activeLabFilter !== 'Todos') {
            // Mock category filtering
            return filtered.filter((_, i) => i % 2 === 0);
        }
        return filtered;
    }, [activeLabFilter, masonryItems]);

    const LavaLampHero = () => {
        return (
            <div className="relative w-full h-[35vh] bg-[#0D0D0D] overflow-hidden flex items-center justify-center">
                {/* Lava Blobs */}
                <div className={`absolute inset-0 transition-opacity duration-1000 ${isLavaPaused ? 'opacity-50' : 'opacity-100'}`}>
                    {[
                        { color: 'rgba(255, 183, 183, 0.4)', size: 'w-40 h-40', duration: '12s', delay: '0s', x: '10%', y: '20%' },
                        { color: 'rgba(255, 127, 80, 0.3)', size: 'w-56 h-56', duration: '15s', delay: '-2s', x: '60%', y: '10%' },
                        { color: 'rgba(255, 191, 0, 0.25)', size: 'w-48 h-48', duration: '10s', delay: '-5s', x: '30%', y: '60%' },
                        { color: 'rgba(147, 112, 219, 0.3)', size: 'w-64 h-64', duration: '18s', delay: '-1s', x: '70%', y: '50%' },
                        { color: 'rgba(255, 105, 180, 0.2)', size: 'w-36 h-36', duration: '14s', delay: '-8s', x: '15%', y: '75%' },
                    ].map((blob, i) => (
                        <motion.div
                            key={i}
                            className={`absolute rounded-[60%] blur-3xl ${blob.size}`}
                            style={{
                                backgroundColor: blob.color,
                                left: blob.x,
                                top: blob.y,
                                mixBlendMode: 'screen',
                                willChange: 'transform',
                            }}
                            animate={isLavaPaused ? {} : {
                                y: [0, -100, 0],
                                scale: [1, 1.2, 1],
                                x: [0, 30, 0],
                            }}
                            transition={{
                                duration: parseInt(blob.duration),
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: parseInt(blob.delay)
                            }}
                        />
                    ))}
                </div>

                {/* Overlay Text */}
                <div className="relative z-10 text-center select-none">
                    <h1 className="text-5xl tracking-[-0.05em] text-white flex items-baseline gap-2">
                        <span className="font-black">THE</span>
                        <span className="font-extralight opacity-80">LAB</span>
                    </h1>
                </div>

                {/* Controls */}
                <button 
                    onClick={() => setActiveFeed('GENERAL')}
                    className="absolute top-6 left-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white active:scale-90 transition-all border border-white/10"
                >
                    <ArrowLeft size={20} />
                </button>

                <button 
                    onClick={() => setIsLavaPaused(!isLavaPaused)}
                    className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white active:scale-90 transition-all border border-white/10"
                >
                    {isLavaPaused ? <Play size={18} fill="currentColor" /> : <Pause size={18} fill="currentColor" />}
                </button>
            </div>
        );
    };

    const getPreferenceScore = (item: MemoryItem) => {
        const userPrefs = user.preferences || [];
        const linkedEvent = events.find(e => e.id === item.eventId);
        if (!linkedEvent) return 0;

        let score = 0;
        // Category match
        if (userPrefs.includes(linkedEvent.category)) {
            score += 10;
        }
        // Tag matches
        const tagMatches = (linkedEvent.tags || []).filter(t => userPrefs.includes(t)).length;
        score += tagMatches * 2;

        return score;
    };

    const filteredMasonry = useMemo(() => {
        let base = activeFeed === 'GENERAL' ? masonryItems : userMemories;
        
        // If business, also include their stories in their personal feed
        if (activeFeed === 'PERSONAL' && user.type === 'business') {
            const storiesAsMemories = businessStories
                .filter(s => s.businessId === user.id)
                .map(s => ({
                    id: `story-${s.timestamp}`,
                    url: s.url,
                    userName: user.name.toUpperCase(),
                    caption: 'Business Story',
                    likes: 0,
                    type: 'image' as const,
                    height: 'h-56',
                    city: currentCity
                }));
            base = [...storiesAsMemories, ...base];
        }

        if (activeFilterName) {
            base = base.filter(item => item.userName.toUpperCase() === activeFilterName.toUpperCase());
        }
        if (selectedCityFilter) {
            base = base.filter(item => item.city === selectedCityFilter);
        }

        // Sort by preference score
        return [...base].sort((a, b) => getPreferenceScore(b) - getPreferenceScore(a));
    }, [masonryItems, userMemories, activeFilterName, activeFeed, selectedCityFilter, user.preferences, events]);

    const filteredExplore = useMemo(() => {
        if (activeFeed === 'PERSONAL') return [];
        let base = EXPLORE_MEMORIES;
        if (activeFilterName) {
            base = base.filter(item => item.userName.toUpperCase() === activeFilterName.toUpperCase());
        }
        if (selectedCityFilter) {
            base = base.filter(item => (item as any).city === selectedCityFilter);
        }

        // Sort by preference score
        return [...base].sort((a, b) => getPreferenceScore(b) - getPreferenceScore(a));
    }, [activeFilterName, activeFeed, selectedCityFilter, user.preferences, events]);

    const fullFeed = useMemo(() => {
        if (activeFeed === 'GENERAL') {
            const combined = [...filteredMasonry, ...filteredExplore].filter(item => item.url !== 'placeholder');
            return combined.sort((a, b) => getPreferenceScore(b) - getPreferenceScore(a));
        }
        if (activeFeed === 'PERSONAL') {
            return filteredMasonry.filter(item => item.url !== 'placeholder');
        }
        if (activeFeed === 'LAB') {
            return labMemories;
        }
        return [];
    }, [activeFeed, filteredMasonry, filteredExplore, labMemories]);

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
        
        if (user.type === 'business') {
            onAddStory?.({
                businessId: user.id,
                url: tempPhoto,
                timestamp: Date.now()
            });
        } else {
            const heights = ['h-40', 'h-56', 'h-32', 'h-48', 'h-64'];
            const randomHeight = heights[Math.floor(Math.random() * heights.length)];
            
            const newMemory: MemoryItem = {
                id: `user-${Date.now()}`,
                url: tempPhoto,
                userName: user.name.toUpperCase(),
                caption: caption || 'New memory',
                likes: 0,
                type: 'image',
                height: randomHeight,
                city: currentCity
            };
            onAddMemory(newMemory);
        }
        
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

    const MemoryCard: React.FC<{ item: any; className?: string }> = ({ item, className = '' }) => {
        const linkedEvent = events.find(e => e.id === item.eventId);
        const timerRef = useRef<NodeJS.Timeout | null>(null);
        const isLongPressTriggered = useRef(false);
        
        const handlePointerDown = (e: React.PointerEvent) => {
            isLongPressTriggered.current = false;
            timerRef.current = setTimeout(() => {
                setLongPressedMemory(item);
                isLongPressTriggered.current = true;
            }, 333);
        };

        const handlePointerUp = () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
            
            if (!isLongPressTriggered.current) {
                // Short tap: Navigate to post
                setSelectedMemory(item);
            } else {
                // Release after long press: Close popup
                setLongPressedMemory(null);
            }
        };

        const handlePointerLeave = () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
            setLongPressedMemory(null);
        };

        return (
            <div 
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerLeave}
                className={`relative break-inside-avoid mb-3 rounded-2xl overflow-hidden group cursor-pointer active:scale-[0.98] transition-all shadow-ios-deep ${item.height || 'h-48'} ${className}`}
            >
                {item.type === 'image' && item.url === 'placeholder' ? (
                    <img 
                        src={`https://picsum.photos/seed/mem-${item.id}/400/600`} 
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700" 
                        alt="Memory Placeholder" 
                        referrerPolicy="no-referrer" 
                    />
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
                    <img 
                        src={item.url} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        alt={item.userName} 
                        referrerPolicy="no-referrer" 
                    />
                )}
                
                {user.type === 'business' && linkedEvent && linkedEvent.collaborators && linkedEvent.collaborators.length > 0 && (
                    <div className="absolute top-3 right-3 flex -space-x-2 z-10">
                        {linkedEvent.collaborators.slice(0, 3).map((collab) => (
                            <div key={collab.id} className="w-5 h-5 rounded-full border border-white overflow-hidden shadow-sm">
                                <img src={collab.avatarUrl || `https://api.dicebear.com/7.x/notionists/svg?seed=${collab.name}`} className="w-full h-full object-cover" alt={collab.name} referrerPolicy="no-referrer" />
                            </div>
                        ))}
                    </div>
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
    };

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
                        (post.urls || []).length === 1 ? 'grid-cols-1' : 
                        (post.urls || []).length === 2 ? 'grid-cols-2' : 
                        'grid-cols-3'
                    }`}>
                        {(post.urls || []).map((img, i) => (
                            <div 
                                key={i} 
                                onClick={() => setSelectedFriendImage(img)}
                                className={`relative aspect-square bg-gray-100 cursor-pointer active:scale-[0.98] transition-all ${
                                    (post.urls || []).length === 1 ? 'aspect-video' : ''
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

    const FOLLOWED_FRIENDS_DATA = [
        { id: 'f1', name: 'ARLO', avatarUrl: 'https://api.dicebear.com/7.x/notionists/svg?seed=Arlo', isOnline: true, subtext: 'Last event: Jazz Night' },
        { id: 'f2', name: 'ZORA', avatarUrl: 'https://api.dicebear.com/7.x/notionists/svg?seed=Zora', isOnline: false, subtext: 'Shared location: Berlin' },
        { id: 'f3', name: 'ELENA', avatarUrl: 'https://api.dicebear.com/7.x/notionists/svg?seed=Elena', isOnline: true, subtext: '2 mutual friends' },
        { id: 'f4', name: 'SOFIA', avatarUrl: 'https://api.dicebear.com/7.x/notionists/svg?seed=Sofia', isOnline: true, subtext: 'Online now' },
    ];

    const FOLLOWED_BUSINESSES_DATA = MOCK_BUSINESSES.slice(0, 3);

    return (
        <div 
            className={`h-full flex flex-col font-sans transition-colors duration-500 ${themeStyles.bg} relative overflow-hidden`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
        >
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" capture="environment" onChange={handlePhotoSelect} />

            <NetworkPanel 
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                user={user}
                friends={FOLLOWED_FRIENDS_DATA}
                followedBusinesses={FOLLOWED_BUSINESSES_DATA}
                activeFilter={activeFilterName}
                onFilterChange={(name) => {
                    setActiveFilterName(name);
                    setSelectedCityFilter(null);
                    setIsSidebarOpen(false);
                }}
                onFriendClick={(friend) => {
                    setActiveFilterName(friend.name);
                    setSelectedCityFilter(null);
                    setIsSidebarOpen(false);
                }}
                onBusinessClick={(biz) => {
                    setActiveFilterName(biz.name);
                    setSelectedCityFilter(null);
                    setIsSidebarOpen(false);
                }}
            />

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
                            className="w-full py-6 bg-accent text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-glow-sunset active:scale-95 transition-all"
                        >
                            Publish Now
                        </button>
                    </div>
                </div>
            )}

            {/* Feed Content */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar">
                {/* Title Section (Not sticky) */}
                <div className="px-6 pt-8 pb-4 relative h-[60px] flex items-center">
                    <motion.div 
                        style={{ 
                            scale: titleScale, 
                            opacity: titleOpacity, 
                            filter: titleBlur,
                            y: titleY,
                            zIndex: 10
                        }}
                        className="flex justify-between items-start w-full"
                    >
                        <div>
                            <h1 className={`text-2xl font-serif font-bold tracking-tight mb-0.5 ${isDark ? 'text-white' : 'text-[#432818]'}`}>Memories</h1>
                            <p className={`text-[9px] font-bold uppercase tracking-[0.1em] opacity-40 ${isDark ? 'text-white' : 'text-[#432818]'}`}>The network's memories</p>
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
                    </motion.div>
                </div>

                {/* Filters (Sticky) */}
                <div 
                    className="sticky top-0 z-20 px-5 py-4"
                    style={{
                        backgroundImage: isDark ? 'none' : `
                            radial-gradient(at 0% 0%, rgba(255, 192, 203, 0.28) 0, transparent 70%),
                            radial-gradient(at 100% 100%, rgba(230, 210, 255, 0.22) 0, transparent 70%)
                        `,
                        backgroundColor: isDark ? '#2D3436' : '#FDFCF8',
                        backgroundAttachment: 'fixed'
                    }}
                >
                    <div className="flex items-center justify-center gap-8 relative">
                        {/* General Filter */}
                        <button 
                            onClick={() => { setActiveFeed('GENERAL'); setSelectedCityFilter(null); }}
                            className={`flex flex-col items-center justify-center transition-all active:scale-95 ${activeFeed === 'GENERAL' ? 'text-[#FFB7B7]' : 'text-slate-400'}`}
                        >
                            <div className="flex items-center gap-[6px]">
                                <Globe size={16} className={activeFeed === 'GENERAL' ? 'opacity-100' : 'opacity-45'} />
                                <div className="relative">
                                    <span className={`text-[9px] font-bold uppercase tracking-[0.1em] ${activeFeed === 'GENERAL' ? 'opacity-100' : 'opacity-45'}`}>General</span>
                                    {activeFeed === 'GENERAL' && (
                                        <motion.div 
                                            layoutId="memoriesUnderline"
                                            className="absolute -bottom-[2px] left-0 right-0 h-[2px] bg-[#FFB7B7]"
                                            transition={{ duration: 0.22, ease: "easeOut" }}
                                        />
                                    )}
                                </div>
                            </div>
                        </button>

                        {/* Divider */}
                        <div className="w-[1px] h-[16px] bg-current opacity-15" />

                        {/* Lab Filter */}
                        <button 
                            onClick={() => { setActiveFeed('LAB'); setSelectedCityFilter(null); }}
                            className={`flex flex-col items-center justify-center transition-all active:scale-95 ${activeFeed === 'LAB' ? 'text-[#FFB7B7]' : 'text-slate-400'}`}
                        >
                            <div className="flex items-center gap-[6px]">
                                <FlaskConical size={16} className={activeFeed === 'LAB' ? 'opacity-100' : 'opacity-45'} />
                                <div className="relative">
                                    <span className={`text-[9px] font-bold uppercase tracking-[0.1em] ${activeFeed === 'LAB' ? 'opacity-100' : 'opacity-45'}`}>Lab</span>
                                    {activeFeed === 'LAB' && (
                                        <motion.div 
                                            layoutId="memoriesUnderline"
                                            className="absolute -bottom-[2px] left-0 right-0 h-[2px] bg-[#FFB7B7]"
                                            transition={{ duration: 0.22, ease: "easeOut" }}
                                        />
                                    )}
                                </div>
                            </div>
                        </button>

                        {/* Divider */}
                        <div className="w-[1px] h-[16px] bg-current opacity-15" />

                        {/* My Feed Filter */}
                        <button 
                            onClick={() => { setActiveFeed('PERSONAL'); setSelectedCityFilter(null); }}
                            className={`flex flex-col items-center justify-center transition-all active:scale-95 ${activeFeed === 'PERSONAL' ? 'text-[#FFB7B7]' : 'text-slate-400'}`}
                        >
                            <div className="flex items-center gap-[6px]">
                                <UserIcon size={16} className={activeFeed === 'PERSONAL' ? 'opacity-100' : 'opacity-45'} />
                                <div className="relative">
                                    <span className={`text-[9px] font-bold uppercase tracking-[0.1em] ${activeFeed === 'PERSONAL' ? 'opacity-100' : 'opacity-45'}`}>My Feed</span>
                                    {activeFeed === 'PERSONAL' && (
                                        <motion.div 
                                            layoutId="memoriesUnderline"
                                            className="absolute -bottom-[2px] left-0 right-0 h-[2px] bg-[#FFB7B7]"
                                            transition={{ duration: 0.22, ease: "easeOut" }}
                                        />
                                    )}
                                </div>
                            </div>
                        </button>
                    </div>
                    
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-3 ml-2">
                        {activeFeed === 'GENERAL' && activeFilterName ? `TRACES OF ${activeFilterName}` : ''}
                    </p>
                </div>

                <div className="px-2 pb-20 mt-1">
                    <motion.div
                        animate={isBouncing ? { 
                            y: [0, -10, 0],
                            scaleY: [1, 1.02, 1],
                            originY: 1
                        } : { y: 0, scaleY: 1 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        onAnimationComplete={() => setIsBouncing(false)}
                    >
                    {activeFeed === 'LAB' && (
                        <div className="animate-fade-in -mt-1">
                            <div className="-mx-2">
                                <LavaLampHero />
                            </div>
                            
                            <div className="py-6 px-6 text-center">
                                <p className={`text-lg font-medium leading-relaxed ${isDark ? 'text-white/90' : 'text-[#432818]/90'}`}>
                                    Explore artistic and technological experiments from creatives
                                </p>
                            </div>

                            <div className="h-[1px] w-full bg-black/5 mx-auto" />

                            <div className="py-4">
                                <h2 className={`text-sm font-black uppercase tracking-[0.3em] mb-4 text-center ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                                    EXPERIMENTS
                                </h2>

                                <div className="flex flex-wrap justify-center gap-2 mb-6">
                                    {LAB_CATEGORIES.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setActiveLabFilter(cat)}
                                            className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                                                activeLabFilter === cat 
                                                    ? 'bg-accent border-accent text-white shadow-lg shadow-accent/20' 
                                                    : `bg-transparent ${isDark ? 'border-white/10 text-white/40' : 'border-black/10 text-slate-400'}`
                                            }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>

                                <div className="columns-3 gap-2">
                                    {labMemories.map((item, i) => (
                                        <MemoryCard 
                                            key={item.id} 
                                            item={item} 
                                            className={i === 1 ? 'mt-4' : i === 2 ? 'mt-2' : ''}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

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
                                <div className="grid grid-cols-3 gap-1 border border-black/5 rounded-2xl overflow-hidden bg-white/40 backdrop-blur-sm">
                                    {[...Array(9)].map((_, i) => (
                                        <div 
                                            key={i} 
                                            className="aspect-square border border-black/[0.03] flex items-center justify-center group relative cursor-pointer overflow-hidden"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <img 
                                                src={`https://picsum.photos/seed/empty-grid-${i}/200/200`} 
                                                className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity" 
                                                alt="Placeholder" 
                                                referrerPolicy="no-referrer" 
                                            />
                                            <div className="absolute inset-0 bg-black/[0.01] group-hover:bg-accent/[0.03] transition-colors" />
                                            <ImageIcon size={16} className="text-black/5 group-hover:text-accent/20 transition-colors relative z-10" />
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
                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2 px-1">Trips by {activeFilterName}</h3>
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
                </motion.div>
                <motion.div 
                    onViewportEnter={() => setIsBouncing(true)}
                    className="h-1 w-full"
                />
            </div>
            
            {/* Sidebar Hint for Swipe */}
            {activeFeed === 'GENERAL' && !isSidebarOpen && (
                <div className="absolute left-1 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 opacity-20 pointer-events-none">
                    <div className="w-1 h-8 bg-black rounded-full mb-1"></div>
                    <span className="text-[6px] font-black vertical-text uppercase tracking-widest">SWIPE</span>
                </div>
            )}

            {/* Full Screen Image Viewer */}
            <AnimatePresence>
            {selectedMemory && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[1000] bg-[#FDFCF8] overflow-y-auto no-scrollbar scroll-smooth" 
                    ref={scrollRef}
                >
                    {/* Header / Back Button */}
                    <div className="sticky top-0 z-50 p-4 flex items-center bg-[#FDFCF8]/80 backdrop-blur-md border-b border-black/5">
                        <button 
                            onClick={() => setSelectedMemory(null)}
                            className="w-10 h-10 rounded-full bg-black/5 backdrop-blur-md flex items-center justify-center text-[#432818] active:scale-90 transition-all border border-black/5"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <div className="ml-4">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#432818]">Memories Feed</h3>
                        </div>
                    </div>

                    <div className="pb-20">
                        {fullFeed.filter(item => !hiddenPostIds.includes(item.id)).map((item) => (
                            <MemoryPost 
                                key={item.id} 
                                item={item} 
                                selectedMemoryId={selectedMemory?.id}
                                likedMemoryIds={likedMemoryIds}
                                onToggleLike={onToggleLike}
                                onHidePost={(id) => setHiddenPostIds(prev => [...prev, id])}
                            />
                        ))}
                    </div>
                </motion.div>
            )}
            </AnimatePresence>

            {/* Long Press Preview Popup */}
            <AnimatePresence>
                {longPressedMemory && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[2000] flex items-center justify-center p-5"
                        onClick={() => setLongPressedMemory(null)}
                    >
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-lg"
                        />
                        <motion.div 
                            initial={{ clipPath: 'circle(0% at 50% 50%)', scale: 0.8, opacity: 0 }}
                            animate={{ clipPath: 'circle(100% at 50% 50%)', scale: 1, opacity: 1 }}
                            exit={{ clipPath: 'circle(0% at 50% 50%)', scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
                            className="relative w-full h-full max-w-[90vw] max-h-[90vh] rounded-[16px] overflow-hidden shadow-2xl bg-black cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedMemory(longPressedMemory);
                                setLongPressedMemory(null);
                            }}
                        >
                            {longPressedMemory.type === 'video' ? (
                                <video 
                                    src={longPressedMemory.url} 
                                    className="w-full h-full object-cover" 
                                    autoPlay 
                                    muted 
                                    loop 
                                    playsInline
                                />
                            ) : (
                                <img 
                                    src={longPressedMemory.url === 'placeholder' ? `https://picsum.photos/seed/mem-${longPressedMemory.id}/800/1200` : longPressedMemory.url} 
                                    className="w-full h-full object-cover" 
                                    alt="Preview" 
                                    referrerPolicy="no-referrer" 
                                />
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Simple Friend Image Popup */}
            {selectedFriendImage && (
                <div 
                    className="fixed inset-0 z-[2000] bg-black/95 flex items-center justify-center p-4 animate-fade-in"
                    onClick={() => setSelectedFriendImage(null)}
                >
                    <button 
                        onClick={() => setSelectedFriendImage(null)}
                        className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white active:scale-90 transition-all border border-white/10"
                    >
                        <X size={28} />
                    </button>
                    <div className="relative max-w-full max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl animate-scale-in" onClick={e => e.stopPropagation()}>
                        <img 
                            src={selectedFriendImage} 
                            className="w-full h-auto max-h-[85vh] object-contain" 
                            alt="Friend Post" 
                            referrerPolicy="no-referrer"
                        />
                    </div>
                </div>
            )}
        </div>
    </div>
);
};

export default MemoriesView;
