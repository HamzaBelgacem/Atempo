import React, { useState, useEffect, useMemo } from 'react';
import MapView from './components/MapView';
import DiscoverFeed from './components/DiscoverFeed';
import ProfileView from './components/ProfileView';
import PartnersView from './components/PartnersView';
import MemoriesView from './components/MemoriesView';
import ChatsListView from './components/ChatsListView';
import RegistrationModal from './components/RegistrationModal';
import EventDetailModal from './components/EventDetailModal';
import BusinessProfileModal from './components/BusinessProfileModal';
import ChatInterface from './components/ChatInterface';
import EventCommunityView from './components/EventCommunityView';
import SettingsModal from './components/SettingsModal';
import WelcomeGuide from './components/WelcomeGuide';
import OnboardingFlow from './components/OnboardingFlow';
import NotificationToast from './components/NotificationToast';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring, animate } from 'motion/react';
import { Map, Compass, User as UserIcon, Briefcase, MessageSquare, Users, X } from 'lucide-react';
import { ViewState, User, UserType, Event, ChatGroup, Business, AppTheme, ChatMember, MemoryItem, Notification, ContributorRole, PersonalityProfile } from './types';
import { MOCK_EVENTS, MOCK_BUSINESSES, TRANSLATIONS } from './constants';

// ─── Firebase imports ────────────────────────────────────────────────────────
import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
} from 'firebase/firestore';

// ─── Firebase config (reads from Vite env vars set in Vercel) ────────────────
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

// Prevent re-initialising on hot-reload
const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const firebaseAuth = getAuth(firebaseApp);
const firebaseDb   = getFirestore(firebaseApp);

// ─── Theme helpers ────────────────────────────────────────────────────────────
const THEME_COLORS: Record<AppTheme, string> = {
  [AppTheme.ROSE]:     '#FDFCF8',
  [AppTheme.OCEAN]:    '#E0F2FE',
  [AppTheme.EMERALD]:  '#DCFCE7',
  [AppTheme.LAVENDER]: '#F3E8FF',
  [AppTheme.SUNSET]:   '#FFEDD5',
  [AppTheme.DARK]:     '#2D3436',
};

const VIEW_ORDER: Record<ViewState, number> = {
  [ViewState.SPLASH]:     0,
  [ViewState.ONBOARDING]: 1,
  [ViewState.MAP]:        2,
  [ViewState.DISCOVER]:   3,
  [ViewState.MEMORIES]:   4,
  [ViewState.CHATS]:      5,
  [ViewState.PARTNERS]:   5,
  [ViewState.PROFILE]:    6,
  [ViewState.COMMUNITY]:  7,
};

// ─── Default guest user ───────────────────────────────────────────────────────
const buildGuestUser = (): User => ({
  id: 'guest_' + Math.random().toString(36).substr(2, 9),
  name: 'Guest',
  language: 'en',
  isRegistered: false,
  isOnboarded: false,
  type: UserType.STANDARD,
  theme: AppTheme.ROSE,
  preferences: [],
  locationPermission: 'prompt',
  marketingAccepted: false,
  registeredEventIds: ['e1', 'e3'],
  activeChatIds: ['e1', 'e3'],
  instagramHandle: '@horizon_guest',
  locationLabel: 'Valencia',
  notificationPrefs: { newEvents: true, groupMessages: true, businessInvites: true },
});

// ─── Component ────────────────────────────────────────────────────────────────
const App: React.FC = () => {

  // ── Navigation state ────────────────────────────────────────────────────────
  const [view, setView] = useState<ViewState>(ViewState.SPLASH);
  const [direction, setDirection] = useState(0);
  const [transitionType, setTransitionType] = useState<'swipe' | 'tap'>('tap');
  const dragX = useMotionValue(0);
  const dragXSpring = useSpring(dragX, { stiffness: 300, damping: 30 });

  // ── Filter state ─────────────────────────────────────────────────────────────
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTime, setSelectedTime]         = useState<string>('Now');
  const [priceFilter, setPriceFilter]           = useState<'all' | 'paid' | 'free'>('all');
  const [mapSearchTerm, setMapSearchTerm]       = useState<string>('');

  // ── Events state ─────────────────────────────────────────────────────────────
  const [events, setEvents] = useState<Event[]>(
    MOCK_EVENTS.map(e => ({
      ...e,
      collaboratorIds: e.id === 'e19' ? [e.hostId, 't1', 't2']
                     : e.id === 'e20' ? [e.hostId, 't3']
                     : [],
      collaborators: e.id === 'e19' ? [
        { id: e.hostId, name: e.hostName || 'Host', avatarUrl: e.hostAvatar, role: 'Event Host' as ContributorRole, eventsCount: 45, distance: '1.2 km' },
        { id: 't1', name: 'Sacha K.', avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400', role: 'Performing Artist' as ContributorRole, eventsCount: 12, followersCount: 850 },
        { id: 't2', name: 'Marc R.',  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400', role: 'Curator' as ContributorRole, collaborationsCount: 5 },
      ] : e.id === 'e20' ? [
        { id: e.hostId, name: e.hostName || 'Host', avatarUrl: e.hostAvatar, role: 'Event Host' as ContributorRole, eventsCount: 32, distance: '0.8 km' },
        { id: 't3', name: 'Elena G.', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400', role: 'Visual Artist' as ContributorRole, eventsCount: 8, followersCount: 1200 },
      ] : [],
    }))
  );

  // ── User state — seed from localStorage, then Firebase overwrites if logged in ─
  const [user, setUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem('eh_user_v3');
      return saved ? JSON.parse(saved) : buildGuestUser();
    } catch {
      return buildGuestUser();
    }
  });

  // ── authLoading prevents the splash from skipping before Firebase resolves ──
  const [authLoading, setAuthLoading] = useState(true);

  // ── Firebase auth state listener ─────────────────────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Pull the full profile from Firestore
          const snap = await getDoc(doc(firebaseDb, 'users', firebaseUser.uid));
          if (snap.exists()) {
            const profile = snap.data() as User;
            setUser(profile);
            localStorage.setItem('eh_user_v3', JSON.stringify(profile));
          }
        } catch (err) {
          console.error('Failed to load user profile from Firestore:', err);
        }
      } else {
        // Not signed in — keep whatever is in localStorage (guest or previously saved guest)
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // ── Persist user to localStorage whenever it changes ────────────────────────
  useEffect(() => {
    localStorage.setItem('eh_user_v3', JSON.stringify(user));
  }, [user]);

  // ── Interactions ─────────────────────────────────────────────────────────────
  const [interactions, setInteractions] = useState<{
    likedEventIds:      string[];
    likedMemoryIds:     string[];
    memoryComments:     Record<string, string[]>;
    followedBusinessIds: string[];
    hiddenEventIds:     string[];
    reportedEventIds:   string[];
  }>(() => {
    try {
      const saved = localStorage.getItem('eh_interactions');
      return saved ? JSON.parse(saved) : {
        likedEventIds: [], likedMemoryIds: [], memoryComments: {},
        followedBusinessIds: [], hiddenEventIds: [], reportedEventIds: [],
      };
    } catch {
      return {
        likedEventIds: [], likedMemoryIds: [], memoryComments: {},
        followedBusinessIds: [], hiddenEventIds: [], reportedEventIds: [],
      };
    }
  });

  useEffect(() => {
    localStorage.setItem('eh_interactions', JSON.stringify(interactions));
  }, [interactions]);

  const toggleEventLike    = (id: string) => setInteractions(p => ({ ...p, likedEventIds:      p.likedEventIds.includes(id)   ? p.likedEventIds.filter(x => x !== id)   : [...p.likedEventIds, id] }));
  const toggleMemoryLike   = (id: string) => setInteractions(p => ({ ...p, likedMemoryIds:     p.likedMemoryIds.includes(id)  ? p.likedMemoryIds.filter(x => x !== id)  : [...p.likedMemoryIds, id] }));
  const toggleBusinessFollow = (id: string) => setInteractions(p => ({ ...p, followedBusinessIds: p.followedBusinessIds.includes(id) ? p.followedBusinessIds.filter(x => x !== id) : [...p.followedBusinessIds, id] }));
  const hideEvent   = (id: string) => setInteractions(p => ({ ...p, hiddenEventIds:   [...p.hiddenEventIds, id] }));
  const reportEvent = (id: string) => setInteractions(p => ({ ...p, reportedEventIds: [...p.reportedEventIds, id] }));
  const addMemoryComment = (memoryId: string, comment: string) =>
    setInteractions(p => ({ ...p, memoryComments: { ...p.memoryComments, [memoryId]: [...(p.memoryComments[memoryId] || []), comment] } }));

  // ── Modal / overlay state ────────────────────────────────────────────────────
  const [currentCity,           setCurrentCity]           = useState<string>(user.locationLabel || 'Valencia');
  const [selectedEvent,         setSelectedEvent]         = useState<Event | null>(null);
  const [tapPosition,           setTapPosition]           = useState<{ x: number; y: number } | null>(null);
  const [selectedCollaboratorId,setSelectedCollaboratorId]= useState<string | null>(null);
  const [mapCenterTarget,       setMapCenterTarget]       = useState<Event | null>(null);
  const [selectedBusiness,      setSelectedBusiness]      = useState<Business | null>(null);
  const [activeChat,            setActiveChat]            = useState<ChatGroup | null>(null);
  const [activeCommunityEvent,  setActiveCommunityEvent]  = useState<Event | null>(null);
  const [activeCommunityClub,   setActiveCommunityClub]   = useState<ChatGroup | null>(null);
  const [showRegModal,          setShowRegModal]          = useState(false);
  const [inviteCode,            setInviteCode]            = useState<string | undefined>(undefined);
  const [showSettings,          setShowSettings]          = useState(false);
  const [showWelcomeGuide,      setShowWelcomeGuide]      = useState(false);
  const [allChatGroups,         setAllChatGroups]         = useState<ChatGroup[]>([]);
  const [notifications,         setNotifications]         = useState<Notification[]>([]);
  const [isStoryOpen,           setIsStoryOpen]           = useState(false);
  const [isPublishing,          setIsPublishing]          = useState(false);
  const [isImageViewerOpen,     setIsImageViewerOpen]     = useState(false);
  const [isProfileModalOpen,    setIsProfileModalOpen]    = useState(false);
  const [isSidebarOpen,         setIsSidebarOpen]         = useState(false);
  const [userMemories,          setUserMemories]          = useState<MemoryItem[]>([]);
  const [businessStories,       setBusinessStories]       = useState<{ businessId: string; url: string; timestamp: number }[]>([]);
  const [capturedFile,          setCapturedFile]          = useState<File | null>(null);
  const [showPublishModal,      setShowPublishModal]      = useState(false);

  const t = useMemo(() => TRANSLATIONS[user.language] || TRANSLATIONS.en, [user.language]);

  const currentFilteredEvents = useMemo(
    () => events.filter(e => selectedCategory === 'All' || e.category === selectedCategory),
    [events, selectedCategory]
  );

  // ── Invite code from URL ─────────────────────────────────────────────────────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('inviteCode');
    if (code) {
      setInviteCode(code);
      if (!user.isRegistered) setShowRegModal(true);
    }
  }, [user.isRegistered]);

  // ── Splash → next view (wait for auth to resolve first) ─────────────────────
  useEffect(() => {
    if (view === ViewState.SPLASH && !authLoading) {
      const timer = setTimeout(() => {
        navigateTo(user.isOnboarded ? ViewState.MAP : ViewState.ONBOARDING);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [view, authLoading, user.isOnboarded]);

  // ── Tabs ─────────────────────────────────────────────────────────────────────
  const tabs = useMemo(() => [
    { id: ViewState.MAP,      icon: Map,            label: 'Map',     screen: ViewState.MAP },
    { id: ViewState.DISCOVER, icon: Compass,        label: 'Discover',screen: ViewState.DISCOVER },
    { id: ViewState.MEMORIES, icon: Users,          label: 'Memories',screen: ViewState.MEMORIES },
    {
      id:     (user.type === UserType.BUSINESS || user.type === UserType.ARTIST_CURATOR) ? ViewState.PARTNERS : ViewState.CHATS,
      icon:   (user.type === UserType.BUSINESS || user.type === UserType.ARTIST_CURATOR) ? Briefcase : MessageSquare,
      label:  'Network',
      screen: (user.type === UserType.BUSINESS || user.type === UserType.ARTIST_CURATOR) ? ViewState.PARTNERS : ViewState.CHATS,
    },
    { id: ViewState.PROFILE,  icon: UserIcon,       label: 'Profile', screen: ViewState.PROFILE },
  ], [user.type]);

  const currentTabIndex = useMemo(() => tabs.findIndex(t => t.id === view), [tabs, view]);

  const indicatorX = useTransform(dragX, (v) => {
    const screenWidth = window.innerWidth || 375;
    const tabWidth = (screenWidth - 48) / tabs.length;
    return currentTabIndex * tabWidth - (v / screenWidth) * tabWidth;
  });

  // ── Navigation ───────────────────────────────────────────────────────────────
  const navigateTo = (viewToNavigate: ViewState, options: { keepMapTarget?: boolean; trigger?: 'swipe' | 'tap' } = {}) => {
    if (view === viewToNavigate) return;
    const currentOrder = VIEW_ORDER[view] || 0;
    const nextOrder    = VIEW_ORDER[viewToNavigate] || 0;
    const trigger      = options.trigger || 'tap';
    setTransitionType(trigger);
    setDirection(nextOrder > currentOrder ? 1 : -1);
    setSelectedEvent(null);
    if (!options.keepMapTarget) setMapCenterTarget(null);
    setSelectedBusiness(null);
    setActiveChat(null);
    setActiveCommunityEvent(null);
    setActiveCommunityClub(null);
    setShowRegModal(false);
    setShowSettings(false);
    setShowWelcomeGuide(false);
    setIsStoryOpen(false);
    setIsPublishing(false);
    setIsProfileModalOpen(false);
    setView(viewToNavigate);
    dragX.set(0);
  };

  const getNextTab = (currentView: ViewState): ViewState | null => {
    const order = VIEW_ORDER[currentView];
    if (order === undefined || order < 2 || order >= 6) return null;
    const nextOrder = order + 1;
    if (nextOrder === 5) return (user.type === UserType.BUSINESS || user.type === UserType.ARTIST_CURATOR) ? ViewState.PARTNERS : ViewState.CHATS;
    const entry = Object.entries(VIEW_ORDER).find(([, val]) => val === nextOrder);
    return entry ? (entry[0] as ViewState) : null;
  };

  const getPrevTab = (currentView: ViewState): ViewState | null => {
    const order = VIEW_ORDER[currentView];
    if (order === undefined || order <= 2 || order > 6) return null;
    const prevOrder = order - 1;
    if (prevOrder === 5) return (user.type === UserType.BUSINESS || user.type === UserType.ARTIST_CURATOR) ? ViewState.PARTNERS : ViewState.CHATS;
    const entry = Object.entries(VIEW_ORDER).find(([, val]) => val === prevOrder);
    return entry ? (entry[0] as ViewState) : null;
  };

  const handleDragEnd = (_event: any, info: any) => {
    const threshold         = window.innerWidth * 0.3;
    const velocityThreshold = 500;
    if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
      const next = getNextTab(view);
      next ? navigateTo(next, { trigger: 'swipe' }) : animate(dragX, 0, { type: 'spring', stiffness: 300, damping: 30 });
    } else if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
      const prev = getPrevTab(view);
      prev ? navigateTo(prev, { trigger: 'swipe' }) : animate(dragX, 0, { type: 'spring', stiffness: 300, damping: 30 });
    } else {
      animate(dragX, 0, { type: 'spring', stiffness: 300, damping: 30 });
    }
  };

  // ── Notification helper ──────────────────────────────────────────────────────
  const addNotification = (title: string, message: string, type: 'EVENT' | 'MESSAGE' | 'REMINDER' = 'EVENT') => {
    const id = Math.random().toString(36).substring(7);
    setNotifications(prev => [...prev, { id, title, message, type, timestamp: new Date().toISOString(), read: false }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 5000);
  };

  // ── Auth handlers ────────────────────────────────────────────────────────────

  /**
   * Called by RegistrationModal after a successful Firebase register OR login.
   * The modal now returns the full User object (already written to Firestore).
   */
  const handleRegistrationSuccess = (data: User) => {
    const updatedUser: User = {
      ...data,
      isRegistered: true,
      // Business with invite code gets perks
      isVerified:              data.inviteCode && data.type === UserType.BUSINESS ? true : data.isVerified,
      hasLifetimeSubscription: data.inviteCode && data.type === UserType.BUSINESS ? true : data.hasLifetimeSubscription,
    };
    setUser(updatedUser);
    localStorage.setItem('eh_user_v3', JSON.stringify(updatedUser));
    if (updatedUser.locationLabel) setCurrentCity(updatedUser.locationLabel);
    setShowRegModal(false);
    setTimeout(() => setShowWelcomeGuide(true), 500);
  };

  /**
   * Logs the user out of Firebase and resets local state to guest.
   */
  const handleLogout = async () => {
    try {
      await signOut(firebaseAuth);
    } catch (err) {
      console.error('Firebase signOut error:', err);
    }
    localStorage.removeItem('eh_user_v3');
    const guest = buildGuestUser();
    guest.isOnboarded = true; // skip onboarding after first time
    setUser(guest);
    setAllChatGroups([]);
    setCurrentCity('Valencia');
    setShowSettings(false);
    setShowRegModal(true);
    navigateTo(ViewState.MAP);
  };

  // ── Onboarding ───────────────────────────────────────────────────────────────
  const handleOnboardingComplete = (profile: PersonalityProfile) => {
    const updatedUser = { ...user, isOnboarded: true, personalityProfile: profile };
    setUser(updatedUser);
    localStorage.setItem('eh_user_v3', JSON.stringify(updatedUser));
    navigateTo(ViewState.MAP);
  };

  // ── Event helpers ────────────────────────────────────────────────────────────
  const handleEventClick = (event: Event | null, e?: React.MouseEvent | React.PointerEvent | MouseEvent) => {
    if (event && e) {
      setTapPosition({ x: e.clientX, y: e.clientY });
    } else if (event) {
      setTapPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    }
    setSelectedEvent(event);
  };

  const handleToggleCollaborate = (eventId: string) => {
    if (!user.isRegistered) { setShowRegModal(true); return; }
    setEvents(prev => prev.map(e => {
      if (e.id !== eventId) return e;
      const isCollaborating  = e.collaboratorIds?.includes(user.id);
      const newIds           = isCollaborating ? e.collaboratorIds?.filter(id => id !== user.id) : [...(e.collaboratorIds || []), user.id];
      const newCollaborators = isCollaborating
        ? e.collaborators?.filter(c => c.id !== user.id)
        : [...(e.collaborators || []), { id: user.id, name: user.name, avatarUrl: user.avatarUrl, role: 'Performing Artist' as ContributorRole, eventsCount: 0, followersCount: 0, collaborationsCount: 1 }];
      return { ...e, collaboratorIds: newIds, collaborators: newCollaborators };
    }));
  };

  const handleOpenCollaboratorProfile = (collaboratorId: string) => {
    setSelectedCollaboratorId(collaboratorId);
    navigateTo(ViewState.PARTNERS);
  };

  const handleOpenBusinessProfile = (businessId: string) => {
    const business = MOCK_BUSINESSES.find(b => b.id === businessId);
    if (business) { setSelectedEvent(null); setSelectedBusiness(business); }
  };

  const handleJoinChat = (target: Event | { id: string; title: string; type?: 'EVENT' | 'BUSINESS' }) => {
    const isEvent = 'attendees' in target;
    const name    = (target as any).title;
    const id      = target.id;
    const mockMembers: ChatMember[] = [
      { name: isEvent ? (target as Event).hostName || 'Host' : 'Partner', gender: 'F', eventsAttended: 150, isTrusted: true, isHost: true },
      { name: 'Alex M.',  gender: 'M', eventsAttended: 24, isTrusted: true },
      { name: 'Sacha K.', gender: 'F', eventsAttended: 8,  isTrusted: false },
    ];
    const mockChat: ChatGroup = {
      id:          `chat-${id}`,
      name,
      eventId:     isEvent ? id : 'b2b-context',
      messages:    [{ id: 'm1', sender: isEvent ? (target as Event).hostName || 'Host' : 'System', text: `Connecting to ${name} pulse...`, timestamp: Date.now(), isMe: false }],
      members:     mockMembers,
      type:        isEvent ? 'EVENT' : 'BUSINESS',
      lastMessage: `Connecting to ${name} pulse...`,
      lastTime:    'Now',
    };
    setAllChatGroups(prev => prev.find(c => c.id === mockChat.id) ? prev : [mockChat, ...prev]);
    if (isEvent) {
      setUser(prev => ({
        ...prev,
        activeChatIds:      prev.activeChatIds?.includes(id)      ? prev.activeChatIds      : [...(prev.activeChatIds || []), id],
        registeredEventIds: prev.registeredEventIds?.includes(id) ? prev.registeredEventIds : [...(prev.registeredEventIds || []), id],
      }));
    }
    setSelectedEvent(null);
    setActiveChat(mockChat);
  };

  const handleCreateEvent = (formData: any) => {
    const newEvent: Event = {
      id:             'e-' + Math.random().toString(36).substr(2, 9),
      title:          formData.title,
      category:       formData.category,
      description:    formData.description,
      videoThumbnail: formData.imageFile ? URL.createObjectURL(formData.imageFile) : 'https://images.unsplash.com/photo-1514525253361-b83f85f58352?q=80&w=800',
      videoUrl:       formData.videoFile ? URL.createObjectURL(formData.videoFile) : 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      date:           formData.date,
      time:           formData.time,
      status:         'active',
      attendees:      0,
      maxCapacity:    formData.capacity,
      lat:            formData.lat,
      lng:            formData.lng,
      hostId:         user.id,
      hostName:       user.name,
      hostAvatar:     user.avatarUrl || 'https://picsum.photos/id/64/100/100',
      averageAge:     0,
      price:          formData.price,
      address:        formData.location,
      tags:           [formData.category],
      minGroupSize:   formData.minGroupSize,
      maxGroupSize:   formData.maxGroupSize,
    };
    setEvents(prev => [newEvent, ...prev]);
    navigateTo(ViewState.MAP);
    setTimeout(() => setMapCenterTarget(newEvent), 500);
  };

  const handleDeepLinkToMap = (event: Event) => {
    setMapCenterTarget(event);
    navigateTo(ViewState.MAP, { keepMapTarget: true });
  };

  const handleCityChange = (newCity: string) => {
    setCurrentCity(newCity);
    setUser(prev => ({ ...prev, locationLabel: newCity }));
  };

  const handleCapture = (file: File) => {
    if (!user.isRegistered) { setShowRegModal(true); return; }
    setCapturedFile(file);
    setShowPublishModal(true);
  };

  const handlePublish = (caption: string) => {
    if (!capturedFile) return;
    const url     = URL.createObjectURL(capturedFile);
    const isVideo = capturedFile.type.startsWith('video/');
    if (user.type === UserType.BUSINESS) {
      setBusinessStories(prev => [{ businessId: user.id, url, timestamp: Date.now() }, ...prev]);
    } else {
      const newMemory: MemoryItem = {
        id:       'mem-' + Math.random().toString(36).substr(2, 9),
        url,
        userName: user.name,
        caption,
        likes:    0,
        type:     isVideo ? 'video' : 'image',
        height:   '400px',
        city:     currentCity,
      };
      setUserMemories(prev => [newMemory, ...prev]);
    }
    setCapturedFile(null);
    setShowPublishModal(false);
  };

  const handleUpdateTheme = (newTheme: AppTheme) => setUser(prev => ({ ...prev, theme: newTheme }));

  // ── Style helpers ────────────────────────────────────────────────────────────
  const isDarkTheme = user.theme === AppTheme.DARK;

  const getIconColor = (isActive: boolean) => {
    if (isActive) return isDarkTheme ? 'text-white' : 'text-black';
    return isDarkTheme ? 'text-white/30' : 'text-black/30';
  };

  const getViewBackgroundStyle = (_v: ViewState) => ({ background: 'transparent' });

  const appBackgroundStyle = useMemo(() => isDarkTheme
    ? { backgroundColor: '#0B1120', backgroundImage: 'radial-gradient(at 0% 0%, rgba(29,78,216,0.15) 0,transparent 50%),radial-gradient(at 100% 100%,rgba(30,58,138,0.15) 0,transparent 50%)', color: 'white' }
    : { backgroundColor: 'transparent', color: '#2D3436' },
  [isDarkTheme]);

  const splashStyle = useMemo(() => isDarkTheme
    ? { backgroundColor: '#0B1120', backgroundImage: 'radial-gradient(at 0% 0%, rgba(29,78,216,0.15) 0,transparent 50%),radial-gradient(at 100% 100%,rgba(30,58,138,0.15) 0,transparent 50%)', color: 'white' }
    : { backgroundImage: 'radial-gradient(at 0% 0%,rgba(255,192,203,0.6) 0,transparent 70%),radial-gradient(at 100% 100%,rgba(230,200,255,0.5) 0,transparent 70%)', backgroundColor: '#FDFCF8', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' },
  [isDarkTheme]);

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div
      className="flex flex-col h-screen w-full overflow-hidden relative font-sans transition-colors duration-500"
      style={view === ViewState.SPLASH ? splashStyle : appBackgroundStyle}
    >
      {view === ViewState.SPLASH ? (
        <div className="fixed inset-0 flex items-center justify-center animate-fade-in z-[1000]">
          <div className="animate-scale-in">
            <h1 className={`text-[64px] font-serif italic tracking-tighter ${isDarkTheme ? 'text-white' : 'text-black'}`}>Atempo</h1>
          </div>
        </div>
      ) : (
        <>
          {/* ── Notification toasts ── */}
          <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
            <AnimatePresence>
              {notifications.map(n => (
                <NotificationToast key={n.id} notification={n} />
              ))}
            </AnimatePresence>
          </div>

          {/* ── Welcome guide ── */}
          {showWelcomeGuide && (
            <WelcomeGuide userName={user.name} onFinish={() => setShowWelcomeGuide(false)} />
          )}

          {/* ── Publish memory modal ── */}
          {showPublishModal && capturedFile && (
            <div className="fixed inset-0 z-[500] bg-black/60 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
              <div className="bg-paper w-full max-w-sm rounded-[48px] overflow-hidden shadow-watercolor p-8 animate-scale-in border border-black/10">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-serif font-bold tracking-tight text-primary">
                    {user.type === UserType.BUSINESS ? 'Publish Story' : 'Publish Memory'}
                  </h2>
                  <button onClick={() => setShowPublishModal(false)} className="text-primary/40"><X size={24} /></button>
                </div>
                <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-black/5 mb-6 border border-black/5 relative">
                  {capturedFile.type.startsWith('video/') ? (
                    <video src={URL.createObjectURL(capturedFile)} className="w-full h-full object-cover" autoPlay muted loop />
                  ) : (
                    <img src={URL.createObjectURL(capturedFile)} className="w-full h-full object-cover" alt="Capture" />
                  )}
                </div>
                <textarea
                  id="publish-caption"
                  placeholder={user.type === UserType.BUSINESS ? 'Add a description for your story...' : 'Write a caption for this memory...'}
                  className="w-full h-24 bg-white/40 backdrop-blur-md rounded-2xl p-4 text-sm font-bold text-primary placeholder:text-primary/30 focus:outline-none border border-white/40 shadow-watercolor mb-6 resize-none"
                />
                <button
                  onClick={() => {
                    const caption = (document.getElementById('publish-caption') as HTMLTextAreaElement).value;
                    handlePublish(caption);
                  }}
                  className="w-full py-4 bg-primary text-white rounded-2xl font-bold uppercase tracking-widest text-[11px] shadow-glow-sunset active:scale-95 transition-all"
                >
                  Publish Now
                </button>
              </div>
            </div>
          )}

          {/* ── Registration / Login modal ── */}
          {showRegModal && (
            <RegistrationModal
              language={user.language}
              onClose={() => setShowRegModal(false)}
              onSuccess={handleRegistrationSuccess}
              inviteCode={inviteCode}
            />
          )}

          {/* ── Settings modal ── */}
          {showSettings && (
            <SettingsModal
              user={user}
              onClose={() => setShowSettings(false)}
              onUpdateTheme={handleUpdateTheme}
              onLogout={handleLogout}
              onUpdateUser={setUser}
            />
          )}

          {/* ── Event detail modal ── */}
          <AnimatePresence>
            {selectedEvent && (
              <EventDetailModal
                key={selectedEvent.id}
                event={selectedEvent}
                user={user}
                tapPosition={tapPosition}
                filteredEvents={currentFilteredEvents}
                onClose={() => setSelectedEvent(null)}
                onAttend={(joinChat) => {
                  if (!user.isRegistered) { setShowRegModal(true); return; }
                  if (joinChat) {
                    setActiveCommunityEvent(selectedEvent);
                    setSelectedEvent(null);
                  } else {
                    setUser(prev => ({
                      ...prev,
                      registeredEventIds: prev.registeredEventIds?.includes(selectedEvent.id)
                        ? prev.registeredEventIds
                        : [...(prev.registeredEventIds || []), selectedEvent.id],
                    }));
                    setSelectedEvent(null);
                  }
                }}
                onOpenBusiness={handleOpenBusinessProfile}
                onNavigate={(dir) => {
                  const index     = currentFilteredEvents.findIndex(e => e.id === selectedEvent.id);
                  const nextIndex = dir === 'next'
                    ? (index + 1) % currentFilteredEvents.length
                    : (index - 1 + currentFilteredEvents.length) % currentFilteredEvents.length;
                  setSelectedEvent(currentFilteredEvents[nextIndex]);
                }}
                language={user.language}
                onToggleCollaborate={handleToggleCollaborate}
                onCollaboratorClick={handleOpenCollaboratorProfile}
                onFavorite={() => toggleEventLike(selectedEvent.id)}
                onFollow={() => toggleBusinessFollow(selectedEvent.hostId)}
                onShare={() => {
                  if (navigator.share) {
                    navigator.share({ title: selectedEvent.title, text: selectedEvent.description, url: window.location.href }).catch(console.error);
                  } else {
                    addNotification('Share', 'Sharing is not supported on this browser');
                  }
                }}
                onHide={() => {
                  hideEvent(selectedEvent.id);
                  addNotification('Event Hidden', 'This event will no longer appear in your feed.');
                  setSelectedEvent(null);
                }}
                onReport={() => {
                  reportEvent(selectedEvent.id);
                  addNotification('Reported', 'Event reported. Thank you for your feedback.');
                  setSelectedEvent(null);
                }}
                onFindSimilar={() => {
                  setSelectedCategory(selectedEvent.category);
                  navigateTo(ViewState.MAP);
                }}
              />
            )}
          </AnimatePresence>

          {/* ── Business profile modal ── */}
          {selectedBusiness && (
            <BusinessProfileModal
              business={selectedBusiness}
              onClose={() => setSelectedBusiness(null)}
              onSelectEvent={setSelectedEvent}
            />
          )}

          {/* ── Event community view ── */}
          <AnimatePresence>
            {activeCommunityEvent && (
              <EventCommunityView
                event={activeCommunityEvent}
                onBack={() => setActiveCommunityEvent(null)}
                onOpenGroup={(group) => {
                  const mockChat: ChatGroup = {
                    id: group.id, name: group.name,
                    eventId: activeCommunityEvent.id,
                    type: group.isAnnouncement ? 'EVENT' : 'CLUB',
                    messages: [], members: [],
                    lastMessage: group.lastMessage || '', lastTime: 'Now',
                  };
                  setActiveChat(mockChat);
                }}
                isOrganizer={activeCommunityEvent.hostId === user.id}
              />
            )}
          </AnimatePresence>

          {/* ── Club community view ── */}
          <AnimatePresence>
            {activeCommunityClub && (
              <EventCommunityView
                club={activeCommunityClub}
                onBack={() => setActiveCommunityClub(null)}
                onOpenGroup={(group) => {
                  const mockChat: ChatGroup = {
                    id: group.id, name: group.name,
                    eventId: activeCommunityClub.id,
                    type: group.isAnnouncement ? 'EVENT' : 'CLUB',
                    messages: [], members: [],
                    lastMessage: group.lastMessage || '', lastTime: 'Now',
                  };
                  setActiveChat(mockChat);
                }}
              />
            )}
          </AnimatePresence>

          {/* ── Chat interface ── */}
          <AnimatePresence>
            {activeChat && (
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200, duration: 0.32 }}
                className="fixed inset-0 z-[400]"
                style={appBackgroundStyle}
              >
                <ChatInterface
                  chat={activeChat}
                  onBack={() => setActiveChat(null)}
                  onViewMap={() => setActiveChat(null)}
                  onOpenCommunity={() => {
                    const event = events.find(e => e.id === activeChat.eventId);
                    if (event) setActiveCommunityEvent(event);
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Main content area ── */}
          <main className="flex-1 relative overflow-hidden">
            {view !== ViewState.MAP && (
              <div
                className="absolute inset-0 z-0"
                style={{
                  backgroundImage: 'radial-gradient(at 0% 0%,rgba(255,192,203,0.28) 0,transparent 70%),radial-gradient(at 100% 100%,rgba(230,210,255,0.22) 0,transparent 70%)',
                  backgroundColor: isDarkTheme ? 'rgba(10,10,10,0.78)' : 'rgba(253,252,248,0.78)',
                  backdropFilter: 'blur(16px) saturate(1.2)',
                  WebkitBackdropFilter: 'blur(16px) saturate(1.2)',
                }}
              />
            )}

            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={view}
                custom={direction}
                variants={{
                  enter: (d: number) => ({
                    zIndex: 10,
                    x:       transitionType === 'tap' ? 0 : d > 0 ? '100%' : '-100%',
                    opacity: transitionType === 'tap' ? 1 : 0,
                  }),
                  center: { zIndex: isImageViewerOpen ? 1000 : 10, x: 0, opacity: 1 },
                  exit: (d: number) => ({
                    zIndex: 0,
                    x:       transitionType === 'tap' ? 0 : d < 0 ? '100%' : '-100%',
                    opacity: transitionType === 'tap' ? 1 : 0,
                  }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x:       { type: 'spring', stiffness: 300, damping: 30, duration: transitionType === 'tap' ? 0 : 0.28 },
                  opacity: { duration: transitionType === 'tap' ? 0 : 0.2 },
                }}
                drag={view !== ViewState.MAP && view !== ViewState.SPLASH ? 'x' : false}
                dragDirectionLock
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.5}
                onDragStart={() => setTransitionType('swipe')}
                onDragEnd={handleDragEnd}
                style={{ x: dragX }}
                className="h-full w-full absolute inset-0"
              >
                <div className="h-full w-full" style={getViewBackgroundStyle(view)}>

                  {view === ViewState.ONBOARDING && (
                    <OnboardingFlow onComplete={handleOnboardingComplete} />
                  )}

                  {view === ViewState.MAP && (
                    <MapView
                      events={events}
                      onEventClick={handleEventClick}
                      selectedCategory={selectedCategory}
                      onSelectCategory={setSelectedCategory}
                      selectedTime={selectedTime}
                      onSelectTime={setSelectedTime}
                      priceFilter={priceFilter}
                      onSelectPriceFilter={setPriceFilter}
                      searchTerm={mapSearchTerm}
                      onSearchChange={setMapSearchTerm}
                      user={user}
                      forceCenterEvent={mapCenterTarget || undefined}
                      currentCity={currentCity}
                      onCityChange={handleCityChange}
                      onCapture={handleCapture}
                    />
                  )}

                  {view === ViewState.DISCOVER && (
                    <DiscoverFeed
                      user={user}
                      events={events}
                      onAttend={handleEventClick}
                      onEventClick={handleEventClick}
                      onViewMap={handleDeepLinkToMap}
                      onHostClick={handleOpenBusinessProfile}
                      onStoryToggle={setIsStoryOpen}
                      userLanguage={user.language}
                      userTheme={user.theme || AppTheme.ROSE}
                      currentCity={currentCity}
                      likedEventIds={interactions.likedEventIds}
                      onToggleLike={toggleEventLike}
                      businessStories={businessStories}
                      onToggleCollaborate={handleToggleCollaborate}
                      onCollaboratorClick={handleOpenCollaboratorProfile}
                    />
                  )}

                  {view === ViewState.MEMORIES && (
                    <MemoriesView
                      user={user}
                      events={events}
                      onNavigateToEvent={(ev) => { setMapCenterTarget(ev); navigateTo(ViewState.MAP); }}
                      onTriggerRegistration={() => setShowRegModal(true)}
                      onPublishingToggle={setIsPublishing}
                      onImageViewerToggle={setIsImageViewerOpen}
                      isSidebarOpen={isSidebarOpen}
                      onSidebarToggle={setIsSidebarOpen}
                      currentCity={currentCity}
                      likedMemoryIds={interactions.likedMemoryIds}
                      memoryComments={interactions.memoryComments}
                      onToggleLike={toggleMemoryLike}
                      onAddComment={addMemoryComment}
                      userMemories={userMemories}
                      businessStories={businessStories}
                      onAddMemory={(newMemory) => setUserMemories(prev => [newMemory, ...prev])}
                      onAddStory={(newStory) => setBusinessStories(prev => [newStory, ...prev])}
                      onEventClick={handleEventClick}
                    />
                  )}

                  {view === ViewState.PARTNERS && (user.type === UserType.BUSINESS || user.type === UserType.ARTIST_CURATOR) && (
                    <PartnersView
                      user={user}
                      events={events}
                      userTheme={user.theme}
                      currentCity={currentCity}
                      userType={user.type}
                      onOpenChat={(chat) => setActiveChat(chat)}
                      onJoinChat={handleJoinChat}
                      onEventClick={setSelectedEvent}
                      onToggleCollaborate={handleToggleCollaborate}
                      onCollaboratorClick={handleOpenCollaboratorProfile}
                      initialSelectedTalentId={selectedCollaboratorId}
                    />
                  )}

                  {view === ViewState.CHATS && user.type !== UserType.BUSINESS && (
                    <ChatsListView
                      user={user}
                      activeChats={allChatGroups}
                      onOpenChat={(chat) => {
                        if (chat.type === 'CLUB') {
                          setActiveCommunityClub(chat);
                        } else {
                          setActiveChat(chat);
                        }
                      }}
                    />
                  )}

                  {view === ViewState.PROFILE && (
                    <ProfileView
                      user={user}
                      onRegister={() => setShowRegModal(true)}
                      onLogout={handleLogout}
                      onSelectEvent={setSelectedEvent}
                      onOpenSettings={() => setShowSettings(true)}
                      onUpdateUser={setUser}
                      events={events}
                      onCreateEvent={handleCreateEvent}
                    />
                  )}

                </div>
              </motion.div>
            </AnimatePresence>
          </main>

          {/* ── Bottom navigation bar ── */}
          {view !== ViewState.ONBOARDING && (
            <nav className={`relative flex items-center justify-around px-6 pb-safe pt-3 border-t z-50 ${isDarkTheme ? 'border-white/10 bg-[#0B1120]/80' : 'border-black/5 bg-white/70'} backdrop-blur-xl`}>
              {/* Sliding active indicator */}
              <motion.div
                className={`absolute top-0 h-[2px] rounded-full ${isDarkTheme ? 'bg-white' : 'bg-black'}`}
                style={{
                  width: `${100 / tabs.length}%`,
                  x: indicatorX,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
              {tabs.map((tab) => {
                const isActive = view === tab.id ||
                  (tab.id === ViewState.PARTNERS && view === ViewState.PARTNERS) ||
                  (tab.id === ViewState.CHATS    && view === ViewState.CHATS);
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => navigateTo(tab.screen)}
                    className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${isActive ? 'scale-105' : 'scale-100 opacity-50'}`}
                  >
                    <Icon size={22} className={getIconColor(isActive)} strokeWidth={isActive ? 2 : 1.5} />
                    <span className={`text-[10px] font-bold tracking-wider uppercase ${getIconColor(isActive)}`}>
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default App;
