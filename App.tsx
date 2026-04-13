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
import { Map, Compass, User as UserIcon, PlayCircle, Briefcase, Shield, MessageSquare, Users, X } from 'lucide-react';
import { ViewState, User, UserType, Event, ChatGroup, Business, AppTheme, ChatMember, MemoryItem, Notification, ContributorRole, PersonalityProfile } from './types';
import { MOCK_EVENTS, MOCK_BUSINESSES, TRANSLATIONS } from './constants';
import LoginModal from './components/ui/LoginModal';

const THEME_COLORS: Record<AppTheme, string> = {
  [AppTheme.ROSE]: '#FDFCF8', 
  [AppTheme.OCEAN]: '#E0F2FE',
  [AppTheme.EMERALD]: '#DCFCE7',
  [AppTheme.LAVENDER]: '#F3E8FF',
  [AppTheme.SUNSET]: '#FFEDD5',
  [AppTheme.DARK]: '#2D3436'
};
const users = [
  {
    id: 1,
    name: "John Doe",
    email: "test@demo.com",
    password: "1234",
  },
  {
    id: 2,
    name: "Anna Smith",
    email: "anna@test.com",
    password: "abcd",
  },
];
const VIEW_ORDER: Record<ViewState, number> = {
  [ViewState.SPLASH]: 0,
  [ViewState.MAP]: 2,
  [ViewState.DISCOVER]: 3,
  [ViewState.MEMORIES]: 4,
  [ViewState.CHATS]: 5,
  [ViewState.PARTNERS]: 5,
  [ViewState.PROFILE]: 6,
  [ViewState.COMMUNITY]: 7,
};



const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.SPLASH);
  const [direction, setDirection] = useState(0);
  const [transitionType, setTransitionType] = useState<"swipe" | "tap">("tap");
  const dragX = useMotionValue(0);
  const dragXSpring = useSpring(dragX, { stiffness: 300, damping: 30 });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTime, setSelectedTime] = useState<string>('Now');
  const [priceFilter, setPriceFilter] = useState<'all' | 'paid' | 'free'>('all');
  const [mapSearchTerm, setMapSearchTerm] = useState<string>('');
  const [events, setEvents] = useState<Event[]>(MOCK_EVENTS.map(e => ({
    ...e,
    collaboratorIds: e.id === 'e19' ? [e.hostId, 't1', 't2'] : e.id === 'e20' ? [e.hostId, 't3'] : [],
    collaborators: e.id === 'e19' ? [
      { id: e.hostId, name: e.hostName || 'Host', avatarUrl: e.hostAvatar, role: 'Event Host' as ContributorRole, eventsCount: 45, distance: '1.2 km' },
      { id: 't1', name: 'Sacha K.', avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400', role: 'Performing Artist' as ContributorRole, eventsCount: 12, followersCount: 850 },
      { id: 't2', name: 'Marc R.', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400', role: 'Curator' as ContributorRole, collaborationsCount: 5 }
    ] : e.id === 'e20' ? [
      { id: e.hostId, name: e.hostName || 'Host', avatarUrl: e.hostAvatar, role: 'Event Host' as ContributorRole, eventsCount: 32, distance: '0.8 km' },
      { id: 't3', name: 'Elena G.', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400', role: 'Visual Artist' as ContributorRole, eventsCount: 8, followersCount: 1200 }
    ] : []
  })));

  const [usersDB, setUsersDB] = useState<any[]>(() => {
  const saved = localStorage.getItem('eh_users_db');
  return saved ? JSON.parse(saved) : [];
});

useEffect(() => {
  localStorage.setItem('eh_users_db', JSON.stringify(usersDB));
}, [usersDB]);
  const handleToggleCollaborate = (eventId: string) => {
    if (!user.isRegistered) {
      setShowRegModal(true);
      return;
    }
    
    setEvents(prev => prev.map(e => {
      if (e.id === eventId) {
        const isCollaborating = e.collaboratorIds?.includes(user.id);
        const newIds = isCollaborating 
          ? e.collaboratorIds?.filter(id => id !== user.id) 
          : [...(e.collaboratorIds || []), user.id];
        
        const newCollaborators = isCollaborating
          ? e.collaborators?.filter(c => c.id !== user.id)
          : [...(e.collaborators || []), { 
              id: user.id, 
              name: user.name, 
              avatarUrl: user.avatarUrl, 
              role: 'Performing Artist' as ContributorRole,
              eventsCount: 0,
              followersCount: 0,
              collaborationsCount: 1
            }];

        return { ...e, collaboratorIds: newIds, collaborators: newCollaborators };
      }
      return e;
    }));
  };

  const handleOpenCollaboratorProfile = (collaboratorId: string) => {
    setSelectedCollaboratorId(collaboratorId);
    navigateTo(ViewState.PARTNERS);
  };
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('eh_user_v3');
    return saved ? JSON.parse(saved) : {
      id: 'guest_' + Math.random().toString(36).substr(2, 9),
      name: 'Guest',
     // email: 'email@example.com',
     // password: 'password',
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
      notificationPrefs: {
        newEvents: true,
        groupMessages: true,
        businessInvites: true
      }
    };
  });

  const [allChatGroups, setAllChatGroups] = useState<ChatGroup[]>([]);
  const [interactions, setInteractions] = useState<{
    likedEventIds: string[];
    likedMemoryIds: string[];
    memoryComments: Record<string, string[]>;
    followedBusinessIds: string[];
    hiddenEventIds: string[];
    reportedEventIds: string[];
  }>(() => {
    const saved = localStorage.getItem('eh_interactions');
    return saved ? JSON.parse(saved) : {
      likedEventIds: [],
      likedMemoryIds: [],
      memoryComments: {},
      followedBusinessIds: [],
      hiddenEventIds: [],
      reportedEventIds: []
    };
  });

  useEffect(() => {
    localStorage.setItem('eh_interactions', JSON.stringify(interactions));
  }, [interactions]);

  const toggleEventLike = (eventId: string) => {
    setInteractions(prev => ({
      ...prev,
      likedEventIds: prev.likedEventIds.includes(eventId) 
        ? prev.likedEventIds.filter(id => id !== eventId)
        : [...prev.likedEventIds, eventId]
    }));
  };

  const toggleMemoryLike = (memoryId: string) => {
    setInteractions(prev => ({
      ...prev,
      likedMemoryIds: prev.likedMemoryIds.includes(memoryId)
        ? prev.likedMemoryIds.filter(id => id !== memoryId)
        : [...prev.likedMemoryIds, memoryId]
    }));
  };

  const toggleBusinessFollow = (businessId: string) => {
    setInteractions(prev => ({
      ...prev,
      followedBusinessIds: prev.followedBusinessIds.includes(businessId)
        ? prev.followedBusinessIds.filter(id => id !== businessId)
        : [...prev.followedBusinessIds, businessId]
    }));
  };

  const hideEvent = (eventId: string) => {
    setInteractions(prev => ({
      ...prev,
      hiddenEventIds: [...prev.hiddenEventIds, eventId]
    }));
  };

  const reportEvent = (eventId: string) => {
    setInteractions(prev => ({
      ...prev,
      reportedEventIds: [...prev.reportedEventIds, eventId]
    }));
  };

  const addMemoryComment = (memoryId: string, comment: string) => {
    setInteractions(prev => ({
      ...prev,
      memoryComments: {
        ...prev.memoryComments,
        [memoryId]: [...(prev.memoryComments[memoryId] || []), comment]
      }
    }));
  };

  const [currentCity, setCurrentCity] = useState<string>(user.locationLabel || 'Valencia');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [tapPosition, setTapPosition] = useState<{ x: number, y: number } | null>(null);
  const [selectedCollaboratorId, setSelectedCollaboratorId] = useState<string | null>(null);
  const [mapCenterTarget, setMapCenterTarget] = useState<Event | null>(null);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [activeChat, setActiveChat] = useState<ChatGroup | null>(null);
  const [activeCommunityEvent, setActiveCommunityEvent] = useState<Event | null>(null);
  const [activeCommunityClub, setActiveCommunityClub] = useState<ChatGroup | null>(null);
  const [showRegModal, setShowRegModal] = useState(false);
  const [inviteCode, setInviteCode] = useState<string | undefined>(undefined);
  const [showSettings, setShowSettings] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (title: string, message: string, type: 'EVENT' | 'MESSAGE' | 'REMINDER' = 'EVENT') => {
    const id = Math.random().toString(36).substring(7);
    setNotifications(prev => [...prev, { id, title, message, type, timestamp: new Date().toISOString(), read: false }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const handleEventClick = (event: Event | null, e?: React.MouseEvent | React.PointerEvent | MouseEvent) => {
    if (event && e) {
      setTapPosition({ x: e.clientX, y: e.clientY });
    } else if (event) {
      setTapPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    }
    setSelectedEvent(event);
  };

  const [showWelcomeGuide, setShowWelcomeGuide] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('inviteCode');
    if (code) {
      setInviteCode(code);
      if (!user.isRegistered) {
        setShowRegModal(true);
      }
    }
  }, [user.isRegistered]);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userMemories, setUserMemories] = useState<MemoryItem[]>([]);
  const [businessStories, setBusinessStories] = useState<{ businessId: string; url: string; timestamp: number }[]>([]);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [showPublishModal, setShowPublishModal] = useState(false);

  const t = useMemo(() => TRANSLATIONS[user.language] || TRANSLATIONS.en, [user.language]);

  const currentFilteredEvents = useMemo(() => {
    return events.filter(e => selectedCategory === 'All' || e.category === selectedCategory);
  }, [events, selectedCategory]);

  useEffect(() => {
    localStorage.setItem('eh_user_v3', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    if (view === ViewState.SPLASH) {
      const timer = setTimeout(() => {
        navigateTo(ViewState.MAP);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [view]);

  const tabs = useMemo(() => [
    { id: ViewState.MAP, icon: Map, label: 'Map', screen: ViewState.MAP, disableSwipeNav: true },
    { id: ViewState.DISCOVER, icon: Compass, label: 'Discover', screen: ViewState.DISCOVER },
    { id: ViewState.MEMORIES, icon: Users, label: 'Memories', screen: ViewState.MEMORIES },
    { 
      id: (user.type === UserType.BUSINESS || user.type === UserType.ARTIST_CURATOR) ? ViewState.PARTNERS : ViewState.CHATS, 
      icon: (user.type === UserType.BUSINESS || user.type === UserType.ARTIST_CURATOR) ? Briefcase : MessageSquare, 
      label: 'Network', 
      screen: (user.type === UserType.BUSINESS || user.type === UserType.ARTIST_CURATOR) ? ViewState.PARTNERS : ViewState.CHATS 
    },
    { id: ViewState.PROFILE, icon: UserIcon, label: 'Profile', screen: ViewState.PROFILE }
  ], [user.type]);

  const currentTabIndex = useMemo(() => tabs.findIndex(t => t.id === view), [tabs, view]);
  
  const indicatorX = useTransform(dragX, (v) => {
    const screenWidth = window.innerWidth || 375;
    const tabWidth = (screenWidth - 48) / tabs.length; // 48 is px-6 padding
    return currentTabIndex * tabWidth - (v / screenWidth) * tabWidth;
  });

  const navigateTo = (viewToNavigate: ViewState, options: { keepMapTarget?: boolean, trigger?: "swipe" | "tap" } = {}) => {
    if (view === viewToNavigate) return;

    const currentOrder = VIEW_ORDER[view] || 0;
    const nextOrder = VIEW_ORDER[viewToNavigate] || 0;
    
    const trigger = options.trigger || "tap";
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
    
    // Reset drag position after navigation
    dragX.set(0);
  };

  const getNextTab = (currentView: ViewState): ViewState | null => {
    const order = VIEW_ORDER[currentView];
    if (order === undefined || order < 2 || order >= 6) return null;
    const nextOrder = order + 1;
    if (nextOrder === 5) {
      return (user.type === UserType.BUSINESS || user.type === UserType.ARTIST_CURATOR) 
        ? ViewState.PARTNERS 
        : ViewState.CHATS;
    }
    const entry = Object.entries(VIEW_ORDER).find(([key, val]) => val === nextOrder);
    return entry ? (entry[0] as ViewState) : null;
  };

  const getPrevTab = (currentView: ViewState): ViewState | null => {
    const order = VIEW_ORDER[currentView];
    if (order === undefined || order <= 2 || order > 6) return null;
    const prevOrder = order - 1;
    if (prevOrder === 5) {
        return (user.type === UserType.BUSINESS || user.type === UserType.ARTIST_CURATOR) 
          ? ViewState.PARTNERS 
          : ViewState.CHATS;
    }
    const entry = Object.entries(VIEW_ORDER).find(([key, val]) => val === prevOrder);
    return entry ? (entry[0] as ViewState) : null;
  };

  const handleDragEnd = (event: any, info: any) => {
    const threshold = window.innerWidth * 0.3;
    const velocityThreshold = 500;
    
    if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
      const next = getNextTab(view);
      if (next) {
        navigateTo(next, { trigger: "swipe" });
      } else {
        animate(dragX, 0, { type: "spring", stiffness: 300, damping: 30 });
      }
    } else if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
      const prev = getPrevTab(view);
      if (prev) {
        navigateTo(prev, { trigger: "swipe" });
      } else {
        animate(dragX, 0, { type: "spring", stiffness: 300, damping: 30 });
      }
    } else {
      animate(dragX, 0, { type: "spring", stiffness: 300, damping: 30 });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('eh_user_v3');
    setUser({
      id: 'guest_' + Math.random().toString(36).substr(2, 9),
      name: 'Guest',
      language: 'en',
      isOnboarded: true, 
      isRegistered: false,
      type: UserType.STANDARD,
      theme: AppTheme.ROSE,
      preferences: [],
      locationPermission: 'prompt',
      marketingAccepted: false,
      registeredEventIds: ['e1', 'e3'],
      activeChatIds: ['e1', 'e3'],
      instagramHandle: '@horizon_guest',
      locationLabel: 'Valencia',
      notificationPrefs: {
        newEvents: true,
        groupMessages: true,
        businessInvites: true
      }
    });
    setAllChatGroups([]);
    setCurrentCity('Valencia');
    setShowSettings(false);
    setShowRegModal(true); 
    navigateTo(ViewState.MAP);
  };

  const handleJoinChat = (target: Event | { id: string, title: string, type?: 'EVENT' | 'BUSINESS' }) => {
    const isEvent = 'attendees' in target;
    const name = isEvent ? (target as Event).title : (target as any).title;
    const id = target.id;

    const mockMembers: ChatMember[] = [
      { name: isEvent ? (target as Event).hostName || 'Host' : 'Partner', gender: 'F', eventsAttended: 150, isTrusted: true, isHost: true },
      { name: 'Alex M.', gender: 'M', eventsAttended: 24, isTrusted: true },
      { name: 'Sacha K.', gender: 'F', eventsAttended: 8, isTrusted: false },
    ];

    const mockChat: ChatGroup = {
      id: `chat-${id}`,
      name: name,
      eventId: isEvent ? id : 'b2b-context',
      messages: [
        { id: 'm1', sender: isEvent ? (target as Event).hostName || 'Host' : 'System', text: `Connecting to ${name} pulse...`, timestamp: Date.now(), isMe: false }
      ],
      members: mockMembers,
      type: isEvent ? 'EVENT' : 'BUSINESS',
      lastMessage: `Connecting to ${name} pulse...`,
      lastTime: 'Now'
    };
    
    setAllChatGroups(prev => {
        const exists = prev.find(c => c.id === mockChat.id);
        return exists ? prev : [mockChat, ...prev];
    });

    if (isEvent) {
        setUser(prev => ({
            ...prev,
            activeChatIds: prev.activeChatIds?.includes(id) ? prev.activeChatIds : [...(prev.activeChatIds || []), id],
            registeredEventIds: prev.registeredEventIds?.includes(id) ? prev.registeredEventIds : [...(prev.registeredEventIds || []), id]
        }));
    }

    setSelectedEvent(null);
    setActiveChat(mockChat);
  };

  const handleOpenBusinessProfile = (businessId: string) => {
    const business = MOCK_BUSINESSES.find(b => b.id === businessId);
    if (business) {
        setSelectedEvent(null);
        setSelectedBusiness(business);
    }
  };

  const handleRegistrationSuccess = (data: any) => {
    const updatedUser = { ...data, isRegistered: true };
    setUsersDB(prev => [...prev, updatedUser]) ;   
    // If business registers with invite code, grant benefits (mocked)
    if (data.inviteCode && data.type === UserType.BUSINESS) {
      updatedUser.isVerified = true;
      updatedUser.hasLifetimeSubscription = true;
    }

    setUser(prev => ({ ...prev, ...updatedUser }));
    if (data.locationLabel) {
      setCurrentCity(data.locationLabel);
    }
    setShowRegModal(false);
    setTimeout(() => {
      setShowWelcomeGuide(true);
    }, 500);
  };

  // const handleLogin = (email: string, password: string) => {
  // const existingUser = usersDB.find(
  //   u => u.email === email && u.password === password
  // );

const handleLogin1 = (email: string, password: string) => {


  if (email === fakeUser.email && password === fakeUser.password) {
    console.log("Login success ✅");

    // exemple user state
    setUser({
      ...user,
      isRegistered: true,
      email: fakeUser.email,
      name: fakeUser.name,
      password: fakeUser.password,
    });

    setShowLoginModal(false);
  } else {
    alert("Invalid credentials ❌");
  }


  if (!fakeUser || user.email !== fakeUser.email || user.password !== fakeUser.password) {
    addNotification('Error', 'Invalid credentials', 'EVENT');
    return;
  }

  setUser(fakeUser);
  setShowLoginModal(false);
  addNotification('Welcome back', `Hello ${fakeUser.name}!`, 'EVENT');
};
const handleLogin = async (email: string, password: string) => {
 
  const res = await fetch("http://localhost:3001/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    addNotification("Error", data.message, "EVENT");
    return;
  }

  setUser(data.user);
  setShowLoginModal(false);
};

  const handleUpdateTheme = (newTheme: AppTheme) => {
    setUser(prev => ({ ...prev, theme: newTheme }));
  };

  const handleCreateEvent = (formData: any) => {
    const newEvent: Event = {
      id: 'e-' + Math.random().toString(36).substr(2, 9),
      title: formData.title,
      category: formData.category,
      description: formData.description,
      videoThumbnail: formData.imageFile ? URL.createObjectURL(formData.imageFile) : 'https://images.unsplash.com/photo-1514525253361-b83f85f58352?q=80&w=800', 
      videoUrl: formData.videoFile ? URL.createObjectURL(formData.videoFile) : 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      date: formData.date,
      time: formData.time,
      status: 'active',
      attendees: 0,
      maxCapacity: formData.capacity,
      lat: formData.lat,
      lng: formData.lng,
      hostId: user.id,
      hostName: user.name,
      hostAvatar: user.avatarUrl || 'https://picsum.photos/id/64/100/100',
      averageAge: 0,
      price: formData.price,
      address: formData.location,
      tags: [formData.category],
      minGroupSize: formData.minGroupSize,
      maxGroupSize: formData.maxGroupSize
    };

    setEvents(prev => [newEvent, ...prev]);
    navigateTo(ViewState.MAP);
    setTimeout(() => {
        setMapCenterTarget(newEvent);
    }, 500);
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
    if (!user.isRegistered) {
      setShowRegModal(true);
      return;
    }
    setCapturedFile(file);
    setShowPublishModal(true);
  };

  const handlePublish = (caption: string) => {
    if (!capturedFile) return;

    const url = URL.createObjectURL(capturedFile);
    const isVideo = capturedFile.type.startsWith('video/');

    if (user.type === UserType.BUSINESS) {
      setBusinessStories(prev => [
        { businessId: user.id, url, timestamp: Date.now() },
        ...prev
      ]);
    } else {
      const newMemory: MemoryItem = {
        id: 'mem-' + Math.random().toString(36).substr(2, 9),
        url,
        userName: user.name,
        caption,
        likes: 0,
        type: isVideo ? 'video' : 'image',
        height: '400px',
        city: currentCity
      };
      setUserMemories(prev => [newMemory, ...prev]);
    }

    setCapturedFile(null);
    setShowPublishModal(false);
  };

  const isDarkTheme = user.theme === AppTheme.DARK;
  const currentBgColor = THEME_COLORS[user.theme || AppTheme.ROSE];
  
  const getIconColor = (isActive: boolean) => {
    if (isActive) return isDarkTheme ? 'text-white' : 'text-black';
    return isDarkTheme ? 'text-white/30' : 'text-black/30';
  };

  const getViewBackgroundStyle = (currentView: ViewState) => {
    return {
      background: 'transparent'
    };
  };

  const appBackgroundStyle = useMemo(() => {
    if (isDarkTheme) {
      return { 
        backgroundColor: '#0B1120', 
        backgroundImage: 'radial-gradient(at 0% 0%, rgba(29, 78, 216, 0.15) 0, transparent 50%), radial-gradient(at 100% 100%, rgba(30, 58, 138, 0.15) 0, transparent 50%)',
        color: 'white' 
      };
    }
    return { 
      backgroundColor: 'transparent', 
      color: '#2D3436'
    };
  }, [isDarkTheme]);

  const splashStyle = useMemo(() => {
    if (isDarkTheme) {
      return {
        backgroundColor: '#0B1120',
        backgroundImage: 'radial-gradient(at 0% 0%, rgba(29, 78, 216, 0.15) 0, transparent 50%), radial-gradient(at 100% 100%, rgba(30, 58, 138, 0.15) 0, transparent 50%)',
        color: 'white'
      };
    }
    return {
      backgroundImage: `
        radial-gradient(at 0% 0%, rgba(255, 192, 203, 0.6) 0, transparent 70%),
        radial-gradient(at 100% 100%, rgba(230, 200, 255, 0.5) 0, transparent 70%)
      `,
      backgroundColor: '#FDFCF8',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)'
    };
  }, [isDarkTheme]);

  return (
    <div 
        className={`flex flex-col h-screen w-full overflow-hidden relative font-sans transition-colors duration-500`}
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
          {showWelcomeGuide && (
        <WelcomeGuide 
          userName={user.name} 
          onFinish={() => setShowWelcomeGuide(false)} 
        />
      )}

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
              placeholder={user.type === UserType.BUSINESS ? "Add a description for your story..." : "Write a caption for this memory..."}
              className="w-full h-24 bg-white/40 backdrop-blur-md rounded-2xl p-4 text-sm font-bold text-primary placeholder:text-primary/30 focus:outline-none border border-white/40 shadow-watercolor mb-6 resize-none"
              id="publish-caption"
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

      {showRegModal && (
        <RegistrationModal 
          language={user.language} 
          onClose={() => setShowRegModal(false)} 
          onSuccess={handleRegistrationSuccess} 
          inviteCode={inviteCode}
        />
      )}
{showLoginModal && (
  <LoginModal
    onClose={() => setShowLoginModal(false)}
    onLogin={handleLogin}
  />
)}
      {showSettings && (
          <SettingsModal 
            user={user} 
            onClose={() => setShowSettings(false)}
            onUpdateTheme={handleUpdateTheme}
            onLogout={handleLogout}
            onUpdateUser={setUser}
          />
      )}

      <AnimatePresence>
        {selectedEvent && (
          <EventDetailModal 
            key="event-detail-modal"
            event={selectedEvent} 
            user={user}
          tapPosition={tapPosition}
          filteredEvents={currentFilteredEvents}
          onClose={() => setSelectedEvent(null)} 
          onAttend={(joinChat) => { 
              if (!user.isRegistered) { setShowRegModal(true); return; }
              if (joinChat) {
                  // Redirect to community instead of direct chat
                  setActiveCommunityEvent(selectedEvent);
                  setSelectedEvent(null);
              }
              else {
                  setUser(prev => ({ ...prev, registeredEventIds: prev.registeredEventIds?.includes(selectedEvent.id) ? prev.registeredEventIds : [...(prev.registeredEventIds || []), selectedEvent.id] }));
                  setSelectedEvent(null);
              }
          }}
          onOpenBusiness={handleOpenBusinessProfile}
          onNavigate={(direction) => {
            const index = currentFilteredEvents.findIndex(e => e.id === selectedEvent.id);
            const nextIndex = direction === 'next' 
              ? (index + 1) % currentFilteredEvents.length 
              : (index - 1 + currentFilteredEvents.length) % currentFilteredEvents.length;
            const nextEvent = currentFilteredEvents[nextIndex];
            setSelectedEvent(nextEvent);
            setMapCenterTarget(nextEvent);
          }}
          language={user.language}
          onToggleCollaborate={handleToggleCollaborate}
          onCollaboratorClick={handleOpenCollaboratorProfile}
          onFavorite={() => toggleEventLike(selectedEvent.id)}
          onFollow={() => toggleBusinessFollow(selectedEvent.hostId)}
          onShare={() => {
            if (navigator.share) {
              navigator.share({
                title: selectedEvent.title,
                text: selectedEvent.description,
                url: window.location.href
              }).catch(console.error);
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

      {selectedBusiness && (
          <BusinessProfileModal 
            business={selectedBusiness} 
            onClose={() => setSelectedBusiness(null)}
            onSelectEvent={setSelectedEvent}
          />
      )}

      <AnimatePresence>
        {activeCommunityEvent && (
          <EventCommunityView
            event={activeCommunityEvent}
            onBack={() => setActiveCommunityEvent(null)}
            onOpenGroup={(group) => {
              const mockChat: ChatGroup = {
                id: group.id,
                name: group.name,
                eventId: activeCommunityEvent.id,
                type: group.isAnnouncement ? 'EVENT' : 'CLUB',
                messages: [],
                members: [],
                lastMessage: group.lastMessage || '',
                lastTime: 'Now'
              };
              setActiveChat(mockChat);
            }}
            isOrganizer={activeCommunityEvent.hostId === user.id}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeCommunityClub && (
          <EventCommunityView
            club={activeCommunityClub}
            onBack={() => setActiveCommunityClub(null)}
            onOpenGroup={(group) => {
              const mockChat: ChatGroup = {
                id: group.id,
                name: group.name,
                eventId: activeCommunityClub.id,
                type: group.isAnnouncement ? 'EVENT' : 'CLUB',
                messages: [],
                members: [],
                lastMessage: group.lastMessage || '',
                lastTime: 'Now'
              };
              setActiveChat(mockChat);
            }}
          />
        )}
      </AnimatePresence>

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
                if (event) {
                  setActiveCommunityEvent(event);
                }
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 relative overflow-hidden">
        {/* Static Background Layer - Stays behind transitions to prevent overlap artifacts */}
        {view !== ViewState.MAP && (
          <div 
            className="absolute inset-0 z-0" 
            style={{
              backgroundImage: `
                radial-gradient(at 0% 0%, rgba(255, 192, 203, 0.28) 0, transparent 70%),
                radial-gradient(at 100% 100%, rgba(230, 210, 255, 0.22) 0, transparent 70%)
              `,
              backgroundColor: isDarkTheme ? 'rgba(10, 10, 10, 0.78)' : 'rgba(253, 252, 248, 0.78)',
              backdropFilter: 'blur(16px) saturate(1.2)',
              WebkitBackdropFilter: 'blur(16px) saturate(1.2)'
            }}
          />
        )}
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div 
            key={view}
            custom={direction}
            variants={{
              enter: (direction: number) => ({
                zIndex: 10,
                x: transitionType === "tap" ? 0 : direction > 0 ? '100%' : '-100%',
                opacity: transitionType === "tap" ? 1 : 0
              }),
              center: {
                zIndex: isImageViewerOpen ? 1000 : 10,
                x: 0,
                opacity: 1
              },
              exit: (direction: number) => ({
                zIndex: 0,
                x: transitionType === "tap" ? 0 : direction < 0 ? '100%' : '-100%',
                opacity: transitionType === "tap" ? 1 : 0
              })
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { 
                type: "spring", 
                stiffness: 300, 
                damping: 30, 
                duration: transitionType === "tap" ? 0 : 0.28 
              },
              opacity: { duration: transitionType === "tap" ? 0 : 0.2 }
            }}
            drag={view !== ViewState.MAP && view !== ViewState.SPLASH ? "x" : false}
            dragDirectionLock
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.5}
            onDragStart={() => setTransitionType("swipe")}
            onDragEnd={handleDragEnd}
            style={{ x: dragX }}
            className="h-full w-full absolute inset-0"
          >
            <div className="h-full w-full" style={getViewBackgroundStyle(view)}>
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
                isEventSelected={!!selectedEvent}
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
                onNavigateToEvent={(ev) => {
                    setMapCenterTarget(ev);
                    navigateTo(ViewState.MAP);
                }} 
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
            
            {(view === ViewState.PARTNERS && (user.type === UserType.BUSINESS || user.type === UserType.ARTIST_CURATOR)) && (
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
                onLogin={() => setShowLoginModal(true)}
                onSelectEvent={setSelectedEvent}
                onOpenSettings={() => setShowSettings(true)}
                onUpdateUser={setUser}
                onCreateEvent={handleCreateEvent}
                onOpenChat={(id) => {
                    const ev = events.find(e => e.id === id);
                    if (ev) handleJoinChat(ev);
                }}
                onOpenBusiness={handleOpenBusinessProfile}
                onToggleModal={setIsProfileModalOpen}
                events={events}
                onViewMemories={() => navigateTo(ViewState.MEMORIES)}
                currentCity={currentCity}
              />
            )}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      <NotificationToast 
        notifications={notifications} 
        onDismiss={(id) => setNotifications(prev => prev.filter(n => n.id !== id))} 
      />

      <nav className={`fixed bottom-0 left-0 right-0 w-full h-[72px] bg-[#FDFCF8]/90 backdrop-blur-md border-t border-black/5 flex items-center px-6 z-[60] shadow-sm transition-transform duration-300 ${isStoryOpen || isPublishing || isImageViewerOpen || activeChat || selectedEvent || selectedBusiness || showSettings || showRegModal || isProfileModalOpen || isSidebarOpen || activeCommunityEvent || activeCommunityClub ? 'translate-y-full' : 'translate-y-0'}`}>
          {tabs.map((tab, idx) => {
            const Icon = tab.icon;
            const isActive = view === tab.id;
            
            return (
              <div key={tab.id} className="flex-1 flex justify-center">
                <button 
                  onClick={() => navigateTo(tab.id as ViewState, { trigger: "tap" })} 
                  className="active:scale-95 flex flex-col items-center justify-center w-full h-full transition-all gap-1"
                >
                  {tab.id === ViewState.PROFILE ? (
                    <div className={`relative w-7 h-7 rounded-full overflow-hidden border-2 transition-all ${isActive ? 'border-primary scale-110' : 'border-transparent'}`}>
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} className="w-full h-full object-cover" alt="Profile" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full bg-[#CED4DA] relative">
                          <div className="absolute bottom-0 right-0 w-[140%] h-[140%] bg-white rounded-[45%] translate-x-[20%] translate-y-[30%] rotate-[-15deg]" />
                          <div className="absolute top-[25%] left-[25%] w-[15%] h-[15%] bg-white rounded-full opacity-90" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <Icon 
                      size={idx === 2 ? 28 : 22} 
                      className={`${isActive ? 'text-primary' : 'text-primary/40'} ${isActive && idx !== 2 ? 'scale-110' : ''} transition-all`} 
                      strokeWidth={isActive ? 3 : 2} 
                    />
                  )}
                </button>
              </div>
            );
          })}
      </nav>
        </>
      )}
    </div>
  );
};

export default App;