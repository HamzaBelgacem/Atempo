import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Search, Globe, Sparkles, Briefcase, MapPin, X, Instagram, UserPlus, ShieldCheck, Play, ArrowRight, UserCheck, Heart, MoreHorizontal, LayoutGrid, Map as MapIcon, Zap, ExternalLink, Filter, MessageSquare, Plus, Hash, ChevronDown, ChevronLeft, ChevronRight, Link as LinkIcon, Award, Target, User as UserIcon, Camera, Palette } from 'lucide-react';
import { AppTheme, UserType, ChatGroup, Event, User, Conversation } from '../types';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import ConversationListView from './ConversationListView';

interface PartnersViewProps {
  user: User;
  events: Event[];
  userTheme?: AppTheme;
  currentCity: string;
  userType?: UserType;
  onOpenChat: (chat: ChatGroup) => void;
  onJoinChat: (target: { id: string, title: string, type?: 'EVENT' | 'BUSINESS' }) => void;
  onEventClick?: (event: Event, e?: React.MouseEvent) => void;
  onToggleCollaborate?: (eventId: string) => void;
  onCollaboratorClick?: (collaboratorId: string) => void;
  initialSelectedTalentId?: string | null;
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
    { id: 'b1', name: 'Lumina Tech', sector: 'Media', image: 'https://picsum.photos/id/1/100/100', lat: 39.4750, lng: -0.3760 },
    { id: 'b2', name: 'Ars Longa', sector: 'Visual Arts', image: 'https://picsum.photos/id/2/100/100', lat: 39.4650, lng: -0.3700 },
    { id: 'b3', name: 'Vibe Agency', sector: 'Media', image: 'https://picsum.photos/id/3/100/100', lat: 39.4700, lng: -0.3800 },
    { id: 'b4', name: 'Sound Hub', sector: 'Performance', image: 'https://picsum.photos/id/4/100/100', lat: 39.4720, lng: -0.3740 }
];

const MOCK_B2B_CHATS = [
    { id: 'c1', title: 'AI in Cultural Logistics', lastMsg: 'Sacha: Proposal ready...', time: '12m' },
    { id: 'c2', title: 'Co-production 2025', lastMsg: 'Marco: Did you see the line-up?', time: '1h' }
];

const B2B_CATEGORIES = {
    sectors: ["Live Music", "Theatre", "Dance", "Comedy", "Performance", "Exhibitions", "Street Art", "Installations", "Screenings", "Indie", "Q&A", "Books", "Poetry", "Cultural Talks", "Fashion shows", "Design showcases", "Food culture experiences", "Local traditions", "Cultural routes", "Art", "Music", "Creative tech workshops", "Art & craft", "Design markets"],
    regions: ["Lazio", "Bavaria", "Catalonia", "Occitanie", "Ile-de-France", "Tuscany"],
    cities: ["Valencia", "Madrid", "Barcelona", "Berlin", "Paris", "Milan", "Rome", "London"]
};

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    name: 'Vibe Fest Crew',
    avatarUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=100',
    lastMessage: 'You: The stage setup is ready for tomorrow!',
    timestamp: '12:45',
    unreadCount: 0,
    isPinned: true,
    isMuted: false,
    isOnline: true,
    type: 'EVENT'
  },
  {
    id: '2',
    name: 'Sacha K.',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100',
    lastMessage: 'Check out these new digital textures.',
    timestamp: 'Yesterday',
    unreadCount: 3,
    isPinned: false,
    isMuted: false,
    isOnline: true,
    type: 'CREATIVE'
  },
  {
    id: '3',
    name: 'Hub Roma Route',
    avatarUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=100',
    lastMessage: 'Marco: New exhibition starting at 6 PM.',
    timestamp: 'Monday',
    unreadCount: 12,
    isPinned: false,
    isMuted: true,
    isOnline: false,
    type: 'HUB'
  },
  {
    id: '4',
    name: 'Techno Waves 2024',
    avatarUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=100',
    lastMessage: 'You: See you there!',
    timestamp: 'Sunday',
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
    isOnline: false,
    type: 'EVENT'
  },
  {
    id: '5',
    name: 'Marc R.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100',
    lastMessage: '✓✓ You: The proposal is in your inbox.',
    timestamp: '2d ago',
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
    isOnline: false,
    type: 'CREATIVE'
  }
];

const MOCK_TALENT = [
  { 
    id: 't1', 
    name: 'Sacha K.', 
    role: 'Digital Artist', 
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400', 
    tags: ["Visuals", "3D", "VLC"],
    skills: ["Music Production", "Modular Synth", "Sound Design"],
    bio: "Explorer of sound textures and industrial rhythms based in Valencia.",
    projects: ["Lumina Immersive", "Techno Waves 2024"]
  },
  { 
    id: 't2', 
    name: 'Marc R.', 
    role: 'Cultural Manager', 
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400', 
    tags: ["Events", "Booking", "Strategy"],
    skills: ["Creative Coding", "Generative Art", "UI/UX"],
    bio: "Digital designer merging algorithms with brutalist aesthetics.",
    projects: ["Cyber City VR", "Abstract Shapes"]
  },
  { 
    id: 't3', 
    name: 'Elena G.', 
    role: 'Art Curator', 
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400', 
    tags: ["Exhibitions", "Fine Art", "VLC"],
    skills: ["Talent Booking", "PR", "Event Logistics"],
    bio: "Cultural manager specialized in developing emerging European talent.",
    projects: ["Indie Nights", "Creative Hub VLC"]
  },
  {
    id: 't4',
    name: 'Julian V.',
    role: 'Sound Engineer',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400',
    tags: ["Audio", "Live", "Tech"],
    skills: ["Mixing", "Mastering", "Acoustics"],
    bio: "Passionate about high-fidelity soundscapes and immersive audio experiences.",
    projects: ["Sonic Boom", "Echoes of VLC"]
  },
  {
    id: 't5',
    name: 'Sofia L.',
    role: 'Creative Director',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400',
    tags: ["Design", "Branding", "Art"],
    skills: ["Art Direction", "Graphic Design", "Storytelling"],
    bio: "Crafting visual identities for the next generation of cultural events.",
    projects: ["Vibe Fest", "Horizon Identity"]
  },
  {
    id: 't6',
    name: 'Adrian M.',
    role: 'Music Producer',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400',
    tags: ["Electronic", "Studio", "VLC"],
    skills: ["Ableton Live", "Synthesis", "Composition"],
    bio: "Blending organic sounds with electronic beats in the heart of Valencia.",
    projects: ["Midnight Sessions", "Organic Pulse"]
  },
  {
    id: 't7',
    name: 'Lucia P.',
    role: 'Cultural Mediator',
    image: 'https://images.unsplash.com/photo-1531123897727-8f129e16fd3c?q=80&w=400',
    tags: ["Community", "Social", "Art"],
    skills: ["Workshop Design", "Public Speaking", "Mediation"],
    bio: "Bridging the gap between art institutions and local communities.",
    projects: ["Neighborhood Canvas", "Inclusive Art VLC"]
  },
  {
    id: 't8',
    name: 'Mateo S.',
    role: 'Lighting Designer',
    image: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?q=80&w=400',
    tags: ["Stage", "Light", "Show"],
    skills: ["DMX Control", "Stage Lighting", "Visual Effects"],
    bio: "Creating atmospheric environments for live performances and exhibitions.",
    projects: ["Neon Nights", "Lumina Stage"]
  }
];

const ARTISTIC_PROFESSIONS = [
    { name: 'Digital Artist', related: ['Illustrator', '3D Artist', 'Concept Artist', 'Graphic Designer', 'NFT', 'Visuals', 'CGI'] },
    { name: 'Art Curator', related: ['Gallery Manager', 'Exhibition Designer', 'Art Historian', 'Fine Art', 'Museum', 'Collection'] },
    { name: 'Music Producer', related: ['Sound Engineer', 'Composer', 'DJ', 'Electronic Music', 'Mixing', 'Mastering', 'Beatmaker'] },
    { name: 'Cultural Manager', related: ['Event Producer', 'Arts Administrator', 'Project Manager', 'Cultural Mediator', 'Grant Writing'] },
    { name: 'Lighting Designer', related: ['Stage Tech', 'Visual Artist', 'Scenographer', 'Light Show', 'DMX', 'Atmosphere'] },
    { name: 'Creative Director', related: ['Art Direction', 'Branding', 'Storytelling', 'Concept Developer', 'Advertising'] },
    { name: 'Sound Engineer', related: ['Audio Tech', 'Live Sound', 'Acoustics', 'Recording', 'Foley', 'Post-production'] },
    { name: 'Cultural Mediator', related: ['Community Manager', 'Social Art', 'Workshop Design', 'Education', 'Inclusion'] },
    { name: 'Motion Designer', related: ['Animator', 'Video Artist', 'After Effects', 'VFX', 'Kinetic Typography'] },
    { name: 'Scenographer', related: ['Set Designer', 'Theater', 'Stage Design', 'Installation Art', 'Spatial Design'] },
    { name: 'Booking Agent', related: ['Talent Manager', 'Tour Manager', 'Music Industry', 'Promoter', 'Artist Relations'] },
    { name: 'VJ', related: ['Video Jockey', 'Live Visuals', 'Mapping', 'Generative Art', 'Resolume', 'TouchDesigner'] },
    { name: 'Copywriter', related: ['Content Creator', 'Creative Writing', 'Storytelling', 'Journalist', 'Scriptwriter'] },
    { name: 'Photographer', related: ['Visual Arts', 'Fashion Photography', 'Street Photography', 'Editor', 'Retoucher'] },
    { name: 'Fashion Designer', related: ['Textile Art', 'Stylist', 'Apparel', 'Creative Direction', 'Pattern Making'] },
    { name: 'UI/UX Designer', related: ['Product Design', 'Digital Product', 'Interface', 'User Experience', 'Figma', 'Prototyping'] },
    { name: 'Illustrator', related: ['Drawing', 'Character Design', 'Editorial Art', 'Painter', 'Digital Painting'] },
    { name: 'Ceramist', related: ['Sculptor', 'Crafts', 'Pottery', 'Fine Art', 'Tactile'] },
    { name: 'Choreographer', related: ['Dance', 'Performance Art', 'Movement Director', 'Theater', 'Contemporary Dance'] },
    { name: 'Actor', related: ['Performance', 'Theater', 'Cinema', 'Voice Over', 'Drama'] },
    { name: '3D Modeler', related: ['Blender', 'ZBrush', 'Character Artist', 'Environment Artist', 'Game Dev'] },
    { name: 'Tattoo Artist', related: ['Ink', 'Illustration', 'Body Art', 'Skin Design'] },
    { name: 'Muralist', related: ['Street Art', 'Graffiti', 'Public Art', 'Large Scale'] },
    { name: 'Sound Designer', related: ['Synthesizer', 'Audio Effects', 'Game Audio', 'Film Sound'] },
    { name: 'Video Editor', related: ['Premiere Pro', 'Final Cut', 'Color Grading', 'Post-production'] },
    { name: 'Social Media Manager', related: ['Content Strategy', 'Digital Marketing', 'Influencer', 'Community'] },
    { name: 'Web Developer', related: ['Frontend', 'Backend', 'Creative Coding', 'Interactive'] },
    { name: 'Architect', related: ['Spatial Design', 'Urban Planning', 'Interior Design', 'Structure'] },
    { name: 'Interior Designer', related: ['Decor', 'Space Planning', 'Furniture Design', 'Aesthetics'] },
    { name: 'Jewelry Designer', related: ['Crafts', 'Metalwork', 'Accessories', 'Luxury'] }
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
                        <div className="flex items-center gap-2">
                            <p className="text-gray-400 text-[10px] font-medium uppercase tracking-[0.2em]">{profile.role}</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h4 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Professional Bio</h4>
                        <p className="text-[13px] font-serif italic leading-relaxed text-gray-600">
                            "{profile.bio || "Creative professional connecting visions and realities in Horizon."}"
                        </p>
                    </div>

                    {/* Tags Carousel with a fine line */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <h4 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest shrink-0">Tags</h4>
                            <div className="h-[1px] flex-1 bg-black/5" />
                        </div>
                        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 -mx-1 px-1">
                            {Array.from(new Set(profile.tags || [])).map((tag: string) => (
                                <span key={tag} className="flex-shrink-0 px-4 py-2 bg-white/60 backdrop-blur-md rounded-xl text-[9px] font-bold uppercase tracking-[0.15em] text-black/60 border border-black/5 shadow-sm">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Skills & Expertise</h4>
                        <div className="flex flex-wrap gap-1.5">
                            {Array.from(new Set(profile.skills || ["Creativity", "Innovation", "Networking"])).map((skill: string) => (
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
                                <div className="w-12 h-12 rounded-xl overflow-hidden bg-primary/5">
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
    return null; // This is now handled in the main grid
};

const TalentCard: React.FC<{ talent: any; onClick: () => void; index: number }> = ({ talent, onClick, index }) => {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 2) * 0.1 }}
      onClick={onClick}
      className="relative aspect-[3/4] w-full rounded-[24px] overflow-hidden group shadow-sm active:scale-[0.98] transition-all border border-black/5 bg-white"
    >
      <img 
        src={talent.image} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        alt={talent.name} 
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />
      
      <div className="absolute bottom-4 left-4 right-4 text-left">
        <div className="flex overflow-x-auto no-scrollbar gap-2 mb-3 -mx-1 px-1">
          {Array.from(new Set(talent.tags || [])).map((tag: string) => (
            <span key={tag} className="flex-shrink-0 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-lg text-[8px] font-black text-white uppercase tracking-[0.2em]">
              {tag}
            </span>
          ))}
        </div>
        <h3 className="text-lg font-serif font-bold text-white leading-tight tracking-tight">
          {talent.name}
        </h3>
        <p className="text-[9px] font-bold text-white/60 uppercase tracking-[0.15em] mt-0.5">{talent.role}</p>
      </div>
    </motion.button>
  );
};

const NetworkCard: React.FC<{ item: any; onClick: () => void; index: number }> = ({ item, onClick, index }) => {
  const tints = [
    'bg-blue-600/60',
    'bg-emerald-600/60',
    'bg-purple-700/60',
    'bg-amber-600/60',
    'bg-rose-600/60',
  ];
  const tintClass = tints[index % tints.length];
  const userCount = 50 + Math.floor(Math.random() * 150);

  return (
    <button 
      onClick={onClick}
      className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden group shadow-md active:scale-[0.98] transition-all border border-white/20"
    >
      <img 
        src={item.image || `https://picsum.photos/seed/${item.id}/800/450`} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
        alt={item.name || item.title} 
        referrerPolicy="no-referrer"
      />
      <div className={`absolute inset-0 mix-blend-multiply ${tintClass} transition-opacity duration-500 group-hover:opacity-80`} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90" />

      <div className="absolute top-5 right-5">
        <div className="flex items-center gap-1.5 px-3 py-1.5">
          <UserIcon size={12} className="text-white" />
          <span className="text-[11px] font-black text-white">{userCount}</span>
        </div>
      </div>

      <div className="absolute bottom-6 left-6 right-6 text-left">
        <p className="text-[10px] font-bold text-white/70 uppercase tracking-[0.25em] mb-1.5">{item.sector || item.role || 'Network'}</p>
        <h3 className="text-2xl font-serif font-medium text-white leading-tight tracking-tight drop-shadow-lg">
          {item.name || item.title}
        </h3>
      </div>
    </button>
  );
};


const PartnersView: React.FC<PartnersViewProps> = ({ 
  user,
  events,
  userTheme, 
  currentCity, 
  userType, 
  onOpenChat, 
  onJoinChat,
  onEventClick,
  onToggleCollaborate,
  onCollaboratorClick,
  initialSelectedTalentId
}) => {
    const [activeTab, setActiveTab] = useState<'B2B' | 'TALENT' | 'CHATS'>('B2B');
    const [isBouncing, setIsBouncing] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedHub, setSelectedHub] = useState<string | null>(null);
    const [selectedProfile, setSelectedProfile] = useState<any | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const { scrollY } = useScroll({
        container: scrollRef,
    });

    const titleScale = useTransform(scrollY, [0, 60], [1, 0.85]);
    const titleOpacity = useTransform(scrollY, [0, 60], [1, 0]);
    const titleBlur = useTransform(scrollY, [0, 60], ["blur(0px)", "blur(4px)"]);
    const titleY = useTransform(scrollY, [0, 60], [0, 60]);

    useEffect(() => {
        if (initialSelectedTalentId) {
            const talent = MOCK_TALENT.find(t => t.id === initialSelectedTalentId);
            if (talent) {
                setSelectedProfile(talent);
            }
        }
    }, [initialSelectedTalentId]);
    
    const isDark = userTheme === AppTheme.DARK;

    const HUB_DATA: Record<string, any> = {
        sectors: {
            id: 'sectors',
            title: "Hub: Sectors",
            name: "Hub: Sectors",
            description: "Creative industries, tech hubs, and European cultural curation.",
            categories: B2B_CATEGORIES.sectors,
            entities: B2B_ENTITIES.slice(0, 2),
            icon: <LayoutGrid size={22} />,
            image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=400"
        },
        regions: {
            id: 'regions',
            title: "Hub Italy",
            name: "Hub Italy",
            description: "Strategic connections with regional nodes of cultural innovation in Italy.",
            categories: B2B_CATEGORIES.regions,
            entities: B2B_ENTITIES.slice(1, 3),
            icon: <Globe size={22} />,
            image: "https://images.unsplash.com/photo-1449156001935-d28bc3dfae2f?q=80&w=400"
        },
        city: {
            id: 'city',
            title: `Hub Roma Route`,
            name: `Hub Roma Route`,
            description: `The strategic core of your city. Participate in the local network of Rome.`,
            categories: B2B_CATEGORIES.cities,
            entities: B2B_ENTITIES,
            icon: <MapPin size={22} />,
            image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=400"
        }
    };

    const filteredItems = useMemo(() => {
        if (activeTab === 'B2B') {
            return Object.values(HUB_DATA);
        } else {
            return MOCK_TALENT;
        }
    }, [activeTab]);

    return (
        <div className={`h-full flex flex-col font-sans transition-colors duration-500 bg-transparent text-primary relative`}>
            
            {selectedProfile && <TalentLinkedInCard profile={selectedProfile} onClose={() => setSelectedProfile(null)} />}
            
            {selectedHub && (
                <HubInternalContent 
                    {...HUB_DATA[selectedHub]} 
                    isDark={isDark} 
                    onBack={() => setSelectedHub(null)}
                    onJoinChat={onJoinChat}
                />
            )}

            {/* SEARCH OVERLAY */}
            <AnimatePresence>
                {isSearching && (
                    <motion.div 
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className={`fixed inset-0 z-[100] flex flex-col ${isDark ? 'bg-[#2D3436]' : 'bg-[#FDFCF8]'}`}
                    >
                        <div className="px-4 pt-12 pb-4 flex items-center gap-3 border-b border-black/5">
                            <div className={`flex-1 flex items-center gap-3 px-4 py-2.5 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-primary/5 border-primary/5'}`}>
                                <Search size={18} className="opacity-40" />
                                <input 
                                    autoFocus
                                    type="text"
                                    placeholder={activeTab === 'TALENT' ? "Search by profession or skill" : "Search partners, talent or clubs"}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-1 bg-transparent border-none outline-none text-sm font-bold placeholder:opacity-40"
                                />
                                {userType === UserType.ARTIST_CURATOR && (
                                    <Camera size={18} className="opacity-40" />
                                )}
                            </div>
                            <button 
                                onClick={() => {
                                    setIsSearching(false);
                                    setSearchQuery('');
                                }}
                                className="text-sm font-bold opacity-60"
                            >
                                Cancel
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-6 py-6 no-scrollbar">
                            {searchQuery.trim() === '' ? (
                                <div className="space-y-8">
                                    {activeTab === 'B2B' ? (
                                        <>
                                            {/* RECOMMENDED CLUBS SECTION */}
                                            <div>
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Recommended Clubs</h3>
                                                    <Sparkles size={14} className="text-amber-500" />
                                                </div>
                                                <div className="space-y-4">
                                                    {[
                                                        { id: 'c1', name: 'Creative Tech Hub', members: '1.2k', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=200' },
                                                        { id: 'c2', name: 'Art & Logistics', members: '850', image: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?q=80&w=200' },
                                                        { id: 'c3', name: 'VLC Music Network', members: '2.4k', image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=200' }
                                                    ].map((club) => (
                                                        <button 
                                                            key={club.id}
                                                            className="w-full flex items-center gap-4 group text-left active:scale-[0.98] transition-all"
                                                        >
                                                            <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-black/5 shadow-sm">
                                                                <img src={club.image} className="w-full h-full object-cover" alt={club.name} referrerPolicy="no-referrer" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="text-sm font-bold tracking-tight truncate">{club.name}</h4>
                                                                <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">{club.members} members</p>
                                                            </div>
                                                            <div className="p-2 opacity-20 group-hover:opacity-100 transition-opacity">
                                                                <Plus size={16} />
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            {/* ARTISTIC PROFESSIONS SECTION */}
                                            <div>
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Artistic Professions</h3>
                                                    <Palette size={14} className="text-primary" />
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {ARTISTIC_PROFESSIONS.slice(0, 12).map((prof) => (
                                                        <button 
                                                            key={prof.name}
                                                            onClick={() => setSearchQuery(prof.name)}
                                                            className="px-4 py-2 bg-black/5 border border-black/5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all"
                                                        >
                                                            {prof.name}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* TRENDING PARTNERS */}
                                    <div>
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-4">Trending Partners</h3>
                                        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                                            {B2B_ENTITIES.map(entity => (
                                                <button 
                                                    key={entity.id}
                                                    className="flex-shrink-0 w-24 flex flex-col items-center gap-2 active:scale-95 transition-all"
                                                >
                                                    <div className="w-16 h-16 rounded-full overflow-hidden border border-black/5 shadow-sm">
                                                        <img src={entity.image} className="w-full h-full object-cover" alt={entity.name} referrerPolicy="no-referrer" />
                                                    </div>
                                                    <span className="text-[10px] font-bold text-center truncate w-full">{entity.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* FEATURED TALENT */}
                                    <div>
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-4">Featured Talent</h3>
                                        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                                            {MOCK_TALENT.slice(0, 4).map(talent => (
                                                <button 
                                                    key={talent.id}
                                                    onClick={() => {
                                                        setSelectedProfile(talent);
                                                        setIsSearching(false);
                                                    }}
                                                    className="flex-shrink-0 w-32 flex flex-col items-start gap-2 active:scale-95 transition-all"
                                                >
                                                    <div className="w-32 h-40 rounded-2xl overflow-hidden border border-black/5 shadow-sm">
                                                        <img src={talent.image} className="w-full h-full object-cover" alt={talent.name} referrerPolicy="no-referrer" />
                                                    </div>
                                                    <div className="w-full">
                                                        <h4 className="text-[11px] font-bold truncate">{talent.name}</h4>
                                                        <p className="text-[8px] font-bold opacity-40 uppercase tracking-widest truncate">{talent.role}</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* DYNAMIC RECOMMENDATIONS FOR TALENT */}
                                    {activeTab === 'TALENT' && (
                                        <div className="space-y-4">
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Related Concepts</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {ARTISTIC_PROFESSIONS
                                                    .filter(p => 
                                                        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                                        p.related.some(r => r.toLowerCase().includes(searchQuery.toLowerCase()))
                                                    )
                                                    .map(p => (
                                                        <button 
                                                            key={p.name}
                                                            onClick={() => setSearchQuery(p.name)}
                                                            className="px-4 py-2 bg-primary/10 border border-primary/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-all"
                                                        >
                                                            {p.name}
                                                        </button>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    )}

                                    {/* SEARCH RESULTS */}
                                    <div className="mt-8">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-4">Search Results</h3>
                                        {MOCK_TALENT.filter(t => 
                                            t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                            t.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
                                        ).length > 0 ? (
                                            <div className="grid grid-cols-2 gap-3">
                                                {MOCK_TALENT.filter(t => 
                                                    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                                    t.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                    t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
                                                ).map((talent, idx) => (
                                                    <TalentCard 
                                                        key={talent.id} 
                                                        talent={talent} 
                                                        onClick={() => {
                                                            setSelectedProfile(talent);
                                                            setIsSearching(false);
                                                        }} 
                                                        index={idx}
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-20 opacity-40">
                                                <Search size={40} className="mx-auto mb-4" />
                                                <p className="text-sm font-bold">No results for "{searchQuery}"</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar">
                {/* HEADER (Not sticky) */}
                <div className="px-6 pt-8 pb-4 relative h-[60px] flex items-center">
                    <motion.div 
                        style={{ 
                            scale: titleScale, 
                            opacity: titleOpacity, 
                            filter: titleBlur,
                            y: titleY,
                            zIndex: 10
                        }}
                        className="flex justify-between items-center w-full"
                    >
                        <div>
                            <h1 className={`text-2xl font-serif font-bold tracking-tight mb-0.5 ${isDark ? 'text-white' : 'text-[#432818]'}`}>Network</h1>
                            <p className={`text-[9px] font-bold uppercase tracking-[0.1em] opacity-40 ${isDark ? 'text-white' : 'text-[#432818]'}`}>The network connects to the hub</p>
                        </div>
                    </motion.div>
                </div>

                {/* TABS (FILTER) (Sticky) */}
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
                        {[
                            { id: 'B2B', label: 'Hubs', icon: <Globe size={16} /> },
                            { id: 'TALENT', label: 'Talent', icon: <Sparkles size={16} /> },
                            { id: 'CHATS', label: 'Chats', icon: <MessageSquare size={16} /> }
                        ].map((tab, index, array) => (
                            <React.Fragment key={tab.id}>
                                <button 
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`flex flex-col items-center justify-center transition-all active:scale-95 ${activeTab === tab.id ? 'text-[#FFB7B7]' : 'text-slate-400'}`}
                                >
                                    <div className="flex items-center gap-[6px]">
                                        <div className={activeTab === tab.id ? 'opacity-100' : 'opacity-45'}>
                                            {tab.icon}
                                        </div>
                                        <div className="relative">
                                            <span className={`text-[9px] font-bold uppercase tracking-[0.1em] ${activeTab === tab.id ? 'opacity-100' : 'opacity-45'}`}>
                                                {tab.label}
                                            </span>
                                            {activeTab === tab.id && (
                                                <motion.div 
                                                    layoutId="networkUnderline"
                                                    className="absolute -bottom-[2px] left-0 right-0 h-[2px] bg-[#FFB7B7]"
                                                    transition={{ duration: 0.22, ease: "easeOut" }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </button>
                                {index < array.length - 1 && (
                                    <div className="w-[1px] h-[16px] bg-current opacity-15" />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <div className="px-1 pt-2 pb-20">
                    <motion.div
                        animate={isBouncing ? { 
                            y: [0, -10, 0],
                            scaleY: [1, 1.02, 1],
                            originY: 1
                        } : { y: 0, scaleY: 1 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        onAnimationComplete={() => setIsBouncing(false)}
                    >
                    {/* SEARCH BAR TRIGGER (BELOW FILTER) */}
                    {activeTab !== 'CHATS' && (
                        <div className="px-5 mb-6">
                        <button 
                            onClick={() => setIsSearching(true)}
                            className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl border transition-all active:scale-[0.98] ${isDark ? 'bg-white/5 border-white/10' : 'bg-primary/5 border-primary/5'}`}
                        >
                            <Search size={18} className="opacity-40" />
                            <span className="text-sm font-bold opacity-40">Search partners or talent</span>
                            <div className="flex-1" />
                            {userType === UserType.ARTIST_CURATOR && (
                                <Camera size={18} className="opacity-40" />
                            )}
                        </button>
                    </div>
                )}

                <div className="px-2 h-full">
                    {activeTab === 'B2B' ? (
                        <div className="flex flex-col gap-2">
                            {filteredItems.map((item, idx) => (
                                <NetworkCard 
                                    key={item.id} 
                                    item={item} 
                                    onClick={() => setSelectedHub(item.id)} 
                                    index={idx}
                                />
                            ))}
                        </div>
                    ) : activeTab === 'TALENT' ? (
                        <div className="grid grid-cols-2 gap-3">
                            {filteredItems.map((item, idx) => (
                                <TalentCard 
                                    key={item.id} 
                                    talent={item} 
                                    onClick={() => setSelectedProfile(item)} 
                                    index={idx}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="h-full -mx-5 bg-transparent">
                            <ConversationListView 
                                conversations={MOCK_CONVERSATIONS}
                                onOpenConversation={(id) => onJoinChat({ id, title: 'Chat', type: 'BUSINESS' })}
                                onArchive={(id) => console.log('Archive', id)}
                                onDelete={(id) => console.log('Delete', id)}
                                onMute={(id) => console.log('Mute', id)}
                                onSelect={(ids) => console.log('Selected', ids)}
                            />
                        </div>
                    )}
                    </div>
                    </motion.div>
                    <motion.div 
                        onViewportEnter={() => setIsBouncing(true)}
                        className="h-1 w-full"
                    />
                </div>
            </div>
        </div>
    );
};

export default PartnersView;