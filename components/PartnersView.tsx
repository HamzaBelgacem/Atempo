import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Search, Globe, Sparkles, Briefcase, MapPin, X, Instagram, UserPlus, ShieldCheck, Play, ArrowRight, UserCheck, Heart, MoreHorizontal, LayoutGrid, Map as MapIcon, Zap, ExternalLink, Filter, MessageSquare, Plus, Hash, ChevronDown, ChevronLeft, ChevronRight, Link as LinkIcon, Award, Target } from 'lucide-react';
import { AppTheme, UserType, ChatGroup } from '../types';

interface PartnersViewProps {
  userTheme?: AppTheme;
  currentCity: string;
  onOpenChat: (chat: ChatGroup) => void;
  onJoinChat: (target: { id: string, title: string, type?: 'EVENT' | 'BUSINESS' }) => void;
}

const TALENT_CATEGORIES = [
    ["Avant-garde", "Techno", "Jazz", "Neo-Pop", "Digital Art", "Minimalism", "Cyberpunk"],
    ["Street Art", "Indie", "Soul", "House", "Trap", "Modern Flamenco", "Lo-Fi"],
    ["Synthwave", "Brutalism", "Bauhaus", "Pop Art", "Hip-Hop", "Alternative Rock", "Reggae"]
];

const ART_GALLERY_IMAGES = [
    "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=400", 
    "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=400", 
    "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=400", 
    "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?q=80&w=400", 
    "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=400"
];

const B2B_ENTITIES = [
    { id: 'b1', name: 'Lumina Tech', sector: 'Tech', image: 'https://picsum.photos/id/1/100/100', lat: 39.4750, lng: -0.3760 },
    { id: 'b2', name: 'Ars Longa', sector: 'Art', image: 'https://picsum.photos/id/2/100/100', lat: 39.4650, lng: -0.3700 },
    { id: 'b3', name: 'Vibe Agency', sector: 'Media', image: 'https://picsum.photos/id/3/100/100', lat: 39.4700, lng: -0.3800 },
    { id: 'b4', name: 'Sound Hub', sector: 'Music', image: 'https://picsum.photos/id/4/100/100', lat: 39.4720, lng: -0.3740 }
];

const MOCK_B2B_CHATS = [
    { id: 'c1', title: 'AI in Cultural Logistics', lastMsg: 'Sacha: Proposal ready...', time: '12m' },
    { id: 'c2', title: 'Co-production 2025', lastMsg: 'Marco: Did you see the line-up?', time: '1h' }
];

const B2B_CATEGORIES = {
    sectors: ["Software", "Galleries", "Record Labels", "Production", "Retail", "Logistics"],
    regions: ["Lazio", "Bavaria", "Catalonia", "Occitanie", "Ile-de-France", "Tuscany"],
    cities: ["Valencia", "Madrid", "Barcelona", "Berlin", "Paris", "Milan", "Rome", "London"]
};

const MOCK_TALENT = [
  { 
    id: 't1', 
    name: 'Sacha K.', 
    role: 'Artist', 
    image: 'https://api.dicebear.com/7.x/notionists/svg?seed=Sacha', 
    x: -120, y: -80, size: 90,
    skills: ["Music Production", "Modular Synth", "Sound Design"],
    bio: "Explorer of sound textures and industrial rhythms based in Valencia.",
    projects: ["Lumina Immersive", "Techno Waves 2024"]
  },
  { 
    id: 't2', 
    name: 'Marc R.', 
    role: 'Artist', 
    image: 'https://api.dicebear.com/7.x/notionists/svg?seed=Marc', 
    x: 130, y: 40, size: 100,
    skills: ["Creative Coding", "Generative Art", "UI/UX"],
    bio: "Digital designer merging algorithms with brutalist aesthetics.",
    projects: ["Cyber City VR", "Abstract Shapes"]
  },
  { 
    id: 't3', 
    name: 'Elena G.', 
    role: 'Manager', 
    image: 'https://api.dicebear.com/7.x/notionists/svg?seed=Elena', 
    x: -60, y: 160, size: 85,
    skills: ["Talent Booking", "PR", "Event Logistics"],
    bio: "Cultural manager specialized in developing emerging European talent.",
    projects: ["Indie Nights", "Creative Hub VLC"]
  },
];

const HubMap: React.FC<{ entities: any[], onJoinChat: (target: any) => void }> = ({ entities, onJoinChat }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<any>(null);
    const overlays = useRef<any[]>([]);

    useEffect(() => {
        if (!mapRef.current || !window.google) return;

        if (!mapInstance.current) {
            mapInstance.current = new window.google.maps.Map(mapRef.current, {
                center: { lat: 39.4699, lng: -0.3763 },
                zoom: 14,
                disableDefaultUI: true,
                styles: [
                    { "featureType": "all", "elementType": "labels", "stylers": [{ "visibility": "off" }] },
                    { "featureType": "water", "elementType": "all", "stylers": [{ "color": "#f5f5f0" }] },
                    { "featureType": "landscape", "elementType": "all", "stylers": [{ "color": "#f5f5f0" }] }
                ]
            });
        }

        overlays.current.forEach(o => o.setMap(null));
        overlays.current = [];

        class EntityMarker extends window.google.maps.OverlayView {
            position: any; div: HTMLElement | null; entity: any;
            constructor(position: any, entity: any) {
                super();
                this.position = position;
                this.entity = entity;
                this.div = null;
            }
            onAdd() {
                const div = document.createElement('div');
                div.style.position = 'absolute';
                div.style.cursor = 'pointer';
                div.innerHTML = `
                    <div className="relative w-12 h-12 rounded-full border-2 border-white bg-white shadow-lg p-0.5 active:scale-90 transition-transform overflow-hidden">
                        <img src="${this.entity.image}" class="w-full h-full object-cover rounded-full" referrerpolicy="no-referrer" />
                    </div>
                `;
                div.addEventListener('click', (e) => {
                    e.stopPropagation();
                    onJoinChat({ id: this.entity.id, title: this.entity.name, type: 'BUSINESS' });
                });
                this.div = div;
                this.getPanes().overlayMouseTarget.appendChild(div);
            }
            draw() {
                const overlayProjection = this.getProjection();
                if (!overlayProjection || !this.div) return;
                const pos = overlayProjection.fromLatLngToDivPixel(this.position);
                if (pos) {
                    this.div.style.left = (pos.x - 24) + 'px';
                    this.div.style.top = (pos.y - 24) + 'px';
                }
            }
            onRemove() {
                if (this.div) {
                    this.div.parentNode?.removeChild(this.div);
                    this.div = null;
                }
            }
        }

        entities.forEach(entity => {
            const marker = new EntityMarker(new window.google.maps.LatLng(entity.lat, entity.lng), entity);
            marker.setMap(mapInstance.current);
            overlays.current.push(marker);
        });

    }, [entities, onJoinChat]);

    return (
        <div className="w-full h-80 rounded-[40px] overflow-hidden border border-black/5 shadow-inner relative group">
            <div ref={mapRef} className="w-full h-full" />
            <div className="absolute top-4 left-4 pointer-events-none">
                <div className="bg-black text-white px-3 py-1.5 rounded-2xl text-[8px] font-black uppercase tracking-widest shadow-2xl flex items-center gap-2">
                    <MapPin size={10} /> Hub Radar VLC
                </div>
            </div>
        </div>
    );
};

const TalentLinkedInCard: React.FC<{ profile: any; onClose: () => void }> = ({ profile, onClose }) => {
    return (
        <div className="fixed inset-0 z-[600] bg-black/40 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in" onClick={onClose}>
            <div className="bg-[#FDFCF8] border border-black/5 w-full max-w-sm rounded-[40px] overflow-hidden shadow-2xl animate-slide-up flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                {/* Header Section */}
                <div className="h-40 w-full bg-[#1a1a1a] relative shrink-0">
                    <div className="absolute -bottom-10 left-8">
                        <div className="w-24 h-24 rounded-full bg-[#FDFCF8] p-1 shadow-lg">
                            <img src={profile.image} className="w-full h-full object-cover rounded-full" alt={profile.name} referrerPolicy="no-referrer" />
                        </div>
                    </div>
                    <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-white/10 rounded-full text-white backdrop-blur-md active:scale-90 transition-all border border-white/10">
                        <X size={18} />
                    </button>
                </div>

                {/* Profile Content */}
                <div className="p-8 pt-14 overflow-y-auto no-scrollbar space-y-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-2xl font-serif font-medium tracking-tight text-black leading-none">{profile.name}</h2>
                            <ShieldCheck size={16} className="text-emerald-600" />
                        </div>
                        <p className="text-gray-400 text-[10px] font-medium uppercase tracking-[0.2em]">{profile.role}</p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Professional Bio</h4>
                        <p className="text-[13px] font-serif italic leading-relaxed text-gray-600">
                            "{profile.bio || "Creative professional connecting visions and realities in Horizon."}"
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Skills & Expertise</h4>
                        <div className="flex flex-wrap gap-1.5">
                            {(profile.skills || ["Creativity", "Innovation", "Networking"]).map((skill: string) => (
                                <span key={skill} className="px-3 py-1 bg-black/5 border border-black/5 rounded-full text-[9px] font-medium text-gray-600 uppercase tracking-wider">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Recent Projects</h4>
                        <div className="space-y-2">
                            {(profile.projects || ["Horizon Launch", "VLC Art Summit"]).map((project: string) => (
                                <div key={project} className="w-full p-3 bg-white rounded-2xl border border-black/5 flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-lg bg-black/5 flex items-center justify-center text-black">
                                            <Target size={12} />
                                        </div>
                                        <span className="text-[11px] font-medium text-black tracking-tight">{project}</span>
                                    </div>
                                    <ChevronRight size={14} className="text-gray-300 group-hover:text-black transition-colors" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button className="flex-1 py-4 bg-black text-white rounded-full font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all">
                             Connect <ArrowRight size={14} />
                        </button>
                        <button className="w-12 h-12 bg-white border border-black/10 rounded-full flex items-center justify-center text-black active:scale-95 transition-all">
                             <MessageSquare size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const HubInternalContent: React.FC<{
    title: string;
    description: string;
    categories: string[];
    entities: any[];
    isDark: boolean;
    onBack: () => void;
    onJoinChat: (target: { id: string, title: string, type?: 'EVENT' | 'BUSINESS' }) => void;
}> = ({ title, description, categories, entities, isDark, onBack, onJoinChat }) => (
    <div className="fixed inset-0 z-[600] bg-[#FDFCF8] animate-slide-up overflow-y-auto no-scrollbar pb-32">
        <div className="px-8 pt-16 pb-6 flex items-center justify-between border-b border-black/5 sticky top-0 bg-[#FDFCF8]/80 backdrop-blur-xl z-10">
            <button onClick={onBack} className="flex items-center gap-2 text-gray-400 font-bold text-[9px] uppercase tracking-widest active:scale-95 transition-all hover:text-black">
                <ChevronLeft size={14} /> Back
            </button>
            <h2 className="text-lg font-serif font-medium text-black tracking-tight">{title}</h2>
            <div className="w-10 h-10"></div>
        </div>

        <div className="p-8 space-y-10">
            <p className="text-[14px] font-serif italic text-gray-500 leading-relaxed border-l-2 border-black/10 pl-5">
                {description}
            </p>

            <div className="space-y-4">
                <h4 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Geographic Ecosystem</h4>
                <HubMap entities={entities} onJoinChat={onJoinChat} />
            </div>

            <div>
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
                    {ART_GALLERY_IMAGES.map((img, i) => (
                        <div key={i} className="flex-shrink-0 w-52 h-64 rounded-[32px] overflow-hidden shadow-md active:scale-95 transition-transform border border-black/5">
                            <img src={img} className="w-full h-full object-cover" alt="Art" referrerPolicy="no-referrer" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Entity Filters</h4>
                <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                        <button key={cat} className="px-4 py-2 bg-white text-gray-500 rounded-full text-[9px] font-medium uppercase tracking-widest border border-black/5 shadow-sm active:scale-95 transition-all hover:bg-black hover:text-white">
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Entities in the Hub</h4>
                <div className="space-y-3">
                    {entities.map(ent => (
                        <div key={ent.id} className="w-full p-4 bg-white rounded-[24px] flex items-center justify-between border border-black/5 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50">
                                    <img src={ent.image} className="w-full h-full object-cover" alt={ent.name} referrerPolicy="no-referrer" />
                                </div>
                                <div className="text-left">
                                    <h4 className="text-xs font-bold uppercase tracking-tight text-black">{ent.name}</h4>
                                    <span className="text-[9px] font-medium text-gray-400 uppercase tracking-widest">{ent.sector}</span>
                                </div>
                            </div>
                            <button onClick={() => onJoinChat({ id: ent.id, title: ent.name, type: 'BUSINESS' })} className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center shadow-sm active:scale-95">
                                <Plus size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Active Threads</h4>
                <div className="space-y-3">
                    {MOCK_B2B_CHATS.map(chat => (
                        <button key={chat.id} onClick={() => onJoinChat({ id: chat.id, title: chat.title, type: 'BUSINESS' })} className="w-full p-5 bg-white rounded-[24px] text-left border border-black/5 hover:border-black/20 transition-all shadow-sm">
                            <div className="flex justify-between items-center mb-1">
                                <h5 className="text-[10px] font-bold uppercase tracking-tight text-black">{chat.title}</h5>
                                <span className="text-[8px] font-bold text-gray-400">{chat.time}</span>
                            </div>
                            <p className="text-[10px] font-medium text-gray-500 italic leading-relaxed">"{chat.lastMsg}"</p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const B2BView: React.FC<{ currentCity: string; onJoinChat: (target: { id: string, title: string, type?: 'EVENT' | 'BUSINESS' }) => void }> = ({ currentCity, onJoinChat }) => {
    const [selectedHub, setSelectedHub] = useState<string | null>(null);

    const HUB_DATA: Record<string, any> = {
        sectors: {
            title: "Hub: Sectors",
            description: "Creative industries, tech hubs, and European cultural curation.",
            categories: B2B_CATEGORIES.sectors,
            entities: B2B_ENTITIES.slice(0, 2),
            icon: <LayoutGrid size={22} />
        },
        regions: {
            title: "Hub: Regions",
            description: "Strategic connections with regional nodes of cultural innovation.",
            categories: B2B_CATEGORIES.regions,
            entities: B2B_ENTITIES.slice(1, 3),
            icon: <MapIcon size={22} />
        },
        city: {
            title: `${currentCity} Route`,
            description: `The strategic core of your city. Participate in the local network of ${currentCity}.`,
            categories: B2B_CATEGORIES.cities,
            entities: B2B_ENTITIES,
            icon: <MapPin size={22} />
        }
    };

    return (
        <div className="absolute inset-0 z-10 overflow-y-auto no-scrollbar pt-48 pb-40 bg-transparent">
            {selectedHub && (
                <HubInternalContent 
                    {...HUB_DATA[selectedHub]} 
                    isDark={false} 
                    onBack={() => setSelectedHub(null)}
                    onJoinChat={onJoinChat}
                />
            )}

            {/* TRIPLE ROW CAROUSEL IMAGES - Smaller and almost touching */}
            <div className="px-6 space-y-0.5 mb-10 overflow-hidden">
                {[1, 2, 3].map((row) => (
                    <div key={row} className={`flex gap-1.5 overflow-x-auto no-scrollbar py-0 ${row === 2 ? 'pl-10' : row === 3 ? 'pl-5' : ''}`}>
                        {[...ART_GALLERY_IMAGES, ...ART_GALLERY_IMAGES].map((img, i) => (
                            <div key={`${row}-${i}`} className="flex-shrink-0 w-24 aspect-[4/5] rounded-xl overflow-hidden border border-black/5 shadow-sm active:scale-95 transition-transform">
                                <img 
                                    src={`https://picsum.photos/seed/network-art-${row}-${i}/300/400`} 
                                    className="w-full h-full object-cover" 
                                    alt="Art Carousel" 
                                    referrerPolicy="no-referrer" 
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <div className="px-6 space-y-4">
                <div className="flex items-center gap-3 mb-4 ml-2">
                    <div className="w-1 h-4 bg-black rounded-full"></div>
                    <h3 className="text-[9px] font-bold uppercase tracking-[0.3em] text-gray-400">Networking Hubs</h3>
                </div>

                {Object.entries(HUB_DATA).map(([key, data]) => (
                    <button 
                        key={key}
                        onClick={() => setSelectedHub(key)}
                        className="w-full p-6 rounded-[32px] flex items-center justify-between border border-black/5 bg-white shadow-sm transition-all active:scale-[0.98] group hover:border-black/20"
                    >
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center shadow-sm group-hover:bg-gray-800 transition-colors">
                                {data.icon}
                            </div>
                            <div className="text-left">
                                <h4 className="text-lg font-serif font-medium tracking-tight leading-none mb-1 text-black">{data.title}</h4>
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Enter Hub</span>
                            </div>
                        </div>
                        <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300 group-hover:text-black transition-colors">
                            <ArrowRight size={16} />
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

const useBubblePhysics = () => {
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [velocity, setVelocity] = useState({ x: 0, y: 0 });
    const requestRef = useRef<number>(null);
    const lastMousePos = useRef({ x: 0, y: 0 });
    const isDragging = useRef(false);

    const update = useCallback(() => {
        if (!isDragging.current) {
            setOffset(prev => ({
                x: prev.x + velocity.x,
                y: prev.y + velocity.y
            }));
            setVelocity(prev => ({
                x: prev.x * 0.94,
                y: prev.y * 0.94
            }));
        }
        requestRef.current = requestAnimationFrame(update);
    }, [velocity]);

    useEffect(() => {
        requestRef.current = requestAnimationFrame(update);
        return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
    }, [update]);

    const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
        isDragging.current = true;
        const pos = 'touches' in e ? e.touches[0] : e;
        lastMousePos.current = { x: pos.clientX, y: pos.clientY };
        setVelocity({ x: 0, y: 0 });
    };

    const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDragging.current) return;
        const pos = 'touches' in e ? e.touches[0] : e;
        const dx = pos.clientX - lastMousePos.current.x;
        const dy = pos.clientY - lastMousePos.current.y;
        
        setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
        setVelocity({ x: dx, y: dy });
        lastMousePos.current = { x: pos.clientX, y: pos.clientY };
    };

    const handleMouseUp = () => {
        isDragging.current = false;
    };

    return { offset, handleMouseDown, handleMouseMove, handleMouseUp };
};

const PartnersView: React.FC<PartnersViewProps> = ({ userTheme, currentCity, onOpenChat, onJoinChat }) => {
    const [activeTab, setActiveTab] = useState<'B2B' | 'ARTIST' | 'MANAGER'>('ARTIST');
    const [selectedProfile, setSelectedProfile] = useState<any | null>(null);
    const { offset, handleMouseDown, handleMouseMove, handleMouseUp } = useBubblePhysics();
    const isDarkGlobal = userTheme === AppTheme.DARK;

    const filteredTalent = useMemo(() => {
        return MOCK_TALENT.filter(t => (activeTab === 'ARTIST' ? t.role === 'Artist' : t.role === 'Manager'));
    }, [activeTab]);

    const FilterRow = ({ categories, offsetScroll }: { categories: string[], offsetScroll: number }) => (
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar py-1 mask-linear-fade">
            <div className="flex gap-2.5 px-6" style={{ transform: `translateX(${offsetScroll}px)` }}>
                {categories.map(cat => (
                    <button key={cat} className={`flex-shrink-0 px-5 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest border transition-all ${activeTab === 'B2B' ? 'bg-white border-black/5 text-gray-400' : 'bg-white/10 border-white/10 text-white/60 backdrop-blur-md'}`}>
                        {cat}
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <div className={`h-full w-full overflow-hidden font-sans relative transition-colors duration-500 ${isDarkGlobal ? 'bg-[#0f172a]' : 'bg-[#FDFCF8]'}`}>
            
            {selectedProfile && <TalentLinkedInCard profile={selectedProfile} onClose={() => setSelectedProfile(null)} />}

            {/* TOP HEADER - Professional & Refined */}
            <div className={`absolute top-0 left-0 right-0 z-[50] px-6 pt-10 pb-4 backdrop-blur-md border-b ${activeTab === 'B2B' ? 'bg-[#FDFCF8]/95 border-black/5' : 'bg-[#1a1a1a]/95 border-white/5'}`}>
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className={`text-3xl font-serif font-medium tracking-tight leading-none ${activeTab === 'B2B' ? 'text-black' : 'text-white'}`}>Network</h1>
                        <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mt-1 ${activeTab === 'B2B' ? 'text-gray-400' : 'text-white/40'}`}>{currentCity.toUpperCase()} PULSE</p>
                    </div>
                    <button className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all active:scale-90 ${activeTab === 'B2B' ? 'bg-white border-black/5 text-black shadow-sm' : 'bg-white/10 border-white/10 text-white shadow-sm'}`}>
                        <Search size={20} />
                    </button>
                </div>

                <div className={`flex gap-1 p-1 rounded-full w-full border shadow-sm ${activeTab === 'B2B' ? 'bg-black/5 border-black/5' : 'bg-white/5 border-white/5'}`}>
                    {[
                        { id: 'B2B', icon: <Globe size={13} /> },
                        { id: 'ARTIST', icon: <Sparkles size={13} /> },
                        { id: 'MANAGER', icon: <Briefcase size={13} /> }
                    ].map((tab) => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all ${activeTab === tab.id ? (activeTab === 'B2B' ? 'bg-white text-black shadow-md' : 'bg-white text-black shadow-md') : (activeTab === 'B2B' ? 'text-gray-400 hover:text-black' : 'text-white/40 hover:text-white')}`}
                        >
                            {tab.icon} {tab.id}
                        </button>
                    ))}
                </div>
            </div>

            {activeTab === 'B2B' ? (
                <B2BView currentCity={currentCity} onJoinChat={onJoinChat} />
            ) : (
                <div 
                    className="w-full h-full relative cursor-grab active:cursor-grabbing select-none overflow-hidden bg-[#1a1a1a]"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleMouseDown}
                    onTouchMove={handleMouseMove}
                    onTouchEnd={handleMouseUp}
                >
                    <div className="absolute inset-0 bg-radial-gradient from-white/5 to-transparent pointer-events-none" />
                    
                    <div className="absolute top-[160px] left-0 right-0 z-40 space-y-2 pointer-events-auto">
                        <FilterRow categories={TALENT_CATEGORIES[0]} offsetScroll={0} />
                        <FilterRow categories={TALENT_CATEGORIES[1]} offsetScroll={-20} />
                        <FilterRow categories={TALENT_CATEGORIES[2]} offsetScroll={15} />
                    </div>

                    <div className="w-full h-full relative pt-48">
                        {filteredTalent.map((talent) => (
                            <div 
                                key={`${talent.id}-${activeTab}`}
                                onClick={(e) => { e.stopPropagation(); setSelectedProfile(talent); }}
                                className="absolute flex flex-col items-center transition-opacity duration-700"
                                style={{
                                    left: `calc(50% + ${talent.x + offset.x}px)`,
                                    top: `calc(50% + ${talent.y + offset.y}px)`,
                                    width: talent.size,
                                    height: talent.size,
                                    transform: 'translate(-50%, -50%)',
                                }}
                            >
                                <div className="w-full h-full relative group">
                                    <div className="absolute inset-0 bg-white/5 rounded-full blur-3xl group-active:scale-150 transition-all duration-500" />
                                    {/* Profile Bubbles perfectly round */}
                                    <div className="w-full h-full rounded-full border border-white/10 p-1 bg-[#FDFCF8] shadow-2xl transition-all group-active:scale-90 overflow-hidden">
                                        <img 
                                            src={talent.image} 
                                            className="w-full h-full object-cover rounded-full pointer-events-none transition-transform duration-700 group-hover:scale-110" 
                                            alt={talent.name} 
                                            referrerPolicy="no-referrer"
                                        />
                                    </div>
                                    <div className="absolute -bottom-1 right-2 w-5 h-5 bg-black rounded-full border border-white/10 shadow-2xl flex items-center justify-center text-white">
                                        <ShieldCheck size={10} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PartnersView;