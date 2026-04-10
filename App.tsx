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
import SettingsModal from './components/SettingsModal';
import WelcomeGuide from './components/WelcomeGuide';
import { Map, Compass, User as UserIcon, PlayCircle, Briefcase, Shield, MessageSquare, Users } from 'lucide-react';
import { ViewState, User, UserType, Event, ChatGroup, Business, AppTheme, ChatMember, MemoryItem } from './types';
import { MOCK_EVENTS, MOCK_BUSINESSES, TRANSLATIONS } from './constants';

const THEME_COLORS: Record<AppTheme, string> = {
  [AppTheme.ROSE]: '#FDFCF8', 
  [AppTheme.OCEAN]: '#E0F2FE',
  [AppTheme.EMERALD]: '#DCFCE7',
  [AppTheme.LAVENDER]: '#F3E8FF',
  [AppTheme.SUNSET]: '#FFEDD5',
  [AppTheme.DARK]: '#2D3436'
};

const VIEW_ORDER: Record<ViewState, number> = {
  [ViewState.SPLASH]: 0,
  [ViewState.ONBOARDING]: 1,
  [ViewState.MAP]: 2,
  [ViewState.DISCOVER]: 3,
  [ViewState.MEMORIES]: 4,
  [ViewState.CHATS]: 5,
  [ViewState.PARTNERS]: 5,
  [ViewState.PROFILE]: 6,
};

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.SPLASH);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('eh_user_v3');
    return saved ? JSON.parse(saved) : {
      id: 'guest_' + Math.random().toString(36).substr(2, 9),
      name: 'Guest',
      language: 'en',
      isRegistered: false,
      isOnboarded: true,
      type: UserType.STANDARD,
      theme: AppTheme.ROSE,
      preferences: [],
      locationPermission: 'prompt',
      marketingAccepted: false,
      registeredEventIds: [],
      activeChatIds: [],
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
  }>(() => {
    const saved = localStorage.getItem('eh_interactions');
    return saved ? JSON.parse(saved) : {
      likedEventIds: [],
      likedMemoryIds: [],
      memoryComments: {}
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
  const [mapCenterTarget, setMapCenterTarget] = useState<Event | null>(null);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [activeChat, setActiveChat] = useState<ChatGroup | null>(null);
  const [showRegModal, setShowRegModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showWelcomeGuide, setShowWelcomeGuide] = useState(false);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [userMemories, setUserMemories] = useState<MemoryItem[]>([]);

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

  const navigateTo = (viewToNavigate: ViewState, options: { keepMapTarget?: boolean } = {}) => {
    setSelectedEvent(null);
    if (!options.keepMapTarget) setMapCenterTarget(null);
    setSelectedBusiness(null);
    setActiveChat(null);
    setShowRegModal(false);
    setShowSettings(false);
    setShowWelcomeGuide(false);
    setIsStoryOpen(false);
    setIsPublishing(false);
    setView(viewToNavigate);
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
      registeredEventIds: [],
      activeChatIds: [],
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
    setUser(prev => ({ ...prev, ...data, isRegistered: true }));
    setShowRegModal(false);
    setTimeout(() => {
      setShowWelcomeGuide(true);
    }, 500);
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

  const isDarkTheme = user.theme === AppTheme.DARK;
  const currentBgColor = THEME_COLORS[user.theme || AppTheme.ROSE];
  
  const getIconColor = (isActive: boolean) => {
    if (isActive) return isDarkTheme ? 'text-white' : 'text-black';
    return isDarkTheme ? 'text-white/30' : 'text-black/30';
  };

  const getViewBackgroundStyle = (currentView: ViewState) => {
    if (isDarkTheme) return {};
    
    // Use the Discover aesthetic (soft pink/lavender gradients) for all views as requested
    const gradients = `
      radial-gradient(at 0% 0%, rgba(252, 231, 243, 0.4) 0, transparent 70%),
      radial-gradient(at 100% 100%, rgba(243, 232, 255, 0.3) 0, transparent 70%)
    `;
    
    return {
      backgroundImage: gradients,
      backgroundColor: 'rgba(253, 252, 248, 0.05)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)'
    };
  };

  const appBackgroundStyle = useMemo(() => {
    if (isDarkTheme) {
      return { backgroundColor: '#2D3436', color: 'white' };
    }
    return { 
      backgroundColor: 'transparent', 
      color: '#2D3436'
    };
  }, [isDarkTheme]);

  if (view === ViewState.SPLASH) {
    return (
      <div className="fixed inset-0 bg-[#FFFFFF] flex items-center justify-center animate-fade-in">
        <div className="w-24 h-24 bg-black rounded-[32px] flex items-center justify-center shadow-ios-deep animate-scale-in">
          <Shield size={48} className="text-white" />
        </div>
      </div>
    );
  }

  return (
    <div 
        className={`flex flex-col h-screen w-full overflow-hidden relative font-sans transition-colors duration-500`}
        style={appBackgroundStyle}
    >
      {showWelcomeGuide && (
        <WelcomeGuide 
          userName={user.name} 
          onFinish={() => setShowWelcomeGuide(false)} 
        />
      )}

      {showRegModal && (
        <RegistrationModal 
          language={user.language} 
          onClose={() => setShowRegModal(false)} 
          onSuccess={handleRegistrationSuccess} 
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

      {selectedEvent && (
        <EventDetailModal 
          event={selectedEvent} 
          filteredEvents={currentFilteredEvents}
          onClose={() => setSelectedEvent(null)} 
          onAttend={(joinChat) => { 
              if (!user.isRegistered) { setShowRegModal(true); return; }
              if (joinChat) handleJoinChat(selectedEvent);
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
            setSelectedEvent(currentFilteredEvents[nextIndex]);
          }}
          language={user.language}
        />
      )}

      {selectedBusiness && (
          <BusinessProfileModal 
            business={selectedBusiness} 
            onClose={() => setSelectedBusiness(null)}
            onSelectEvent={setSelectedEvent}
          />
      )}

      {activeChat && (
        <div className="fixed inset-0 z-[250] animate-slide-up" style={appBackgroundStyle}>
          <ChatInterface 
            chat={activeChat} 
            onBack={() => setActiveChat(null)} 
            onViewMap={() => setActiveChat(null)} 
          />
        </div>
      )}

      <main className="flex-1 relative overflow-hidden">
        <div 
          key={view}
          className="h-full w-full absolute inset-0"
          style={getViewBackgroundStyle(view)}
        >
          {view === ViewState.MAP && (
            <MapView 
              events={events} 
              onEventClick={setSelectedEvent} 
              selectedCategory={selectedCategory} 
              onSelectCategory={setSelectedCategory} 
              user={user} 
              forceCenterEvent={mapCenterTarget || undefined}
              currentCity={currentCity}
              onCityChange={handleCityChange}
            />
          )}
          
          {view === ViewState.DISCOVER && (
            <DiscoverFeed 
              user={user}
              events={events} 
              onAttend={setSelectedEvent} 
              onEventClick={setSelectedEvent} 
              onViewMap={handleDeepLinkToMap} 
              onHostClick={handleOpenBusinessProfile}
              onStoryToggle={setIsStoryOpen}
              userLanguage={user.language} 
              userTheme={user.theme || AppTheme.ROSE}
              currentCity={currentCity}
              likedEventIds={interactions.likedEventIds}
              onToggleLike={toggleEventLike}
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
              currentCity={currentCity}
              likedMemoryIds={interactions.likedMemoryIds}
              memoryComments={interactions.memoryComments}
              onToggleLike={toggleMemoryLike}
              onAddComment={addMemoryComment}
              userMemories={userMemories}
              onAddMemory={(newMemory) => setUserMemories([newMemory, ...userMemories])}
            />
          )}
          
          {view === ViewState.PARTNERS && user.type === UserType.BUSINESS && (
            <PartnersView 
              userTheme={user.theme} 
              currentCity={currentCity}
              onOpenChat={(chat) => setActiveChat(chat)}
              onJoinChat={handleJoinChat}
            />
          )}

          {view === ViewState.CHATS && user.type === UserType.STANDARD && (
            <ChatsListView 
              user={user}
              activeChats={allChatGroups}
              onOpenChat={setActiveChat}
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
              onCreateEvent={handleCreateEvent}
              onOpenChat={(id) => {
                  const ev = events.find(e => e.id === id);
                  if (ev) handleJoinChat(ev);
              }}
              onOpenBusiness={handleOpenBusinessProfile}
              events={events}
              onViewMemories={() => navigateTo(ViewState.MEMORIES)}
              currentCity={currentCity}
            />
          )}
        </div>
      </main>

      <nav className={`fixed bottom-0 left-0 right-0 w-full h-[72px] bg-[#FDFCF8]/90 backdrop-blur-md border-t border-black/5 grid grid-cols-5 items-center px-6 z-[60] shadow-sm transition-transform duration-300 ${isStoryOpen || isPublishing || isImageViewerOpen || activeChat || selectedEvent || selectedBusiness || showSettings || showRegModal ? 'translate-y-full' : 'translate-y-0'}`}>
          <div className="flex justify-center">
            <button onClick={() => navigateTo(ViewState.MAP)} className="active:scale-95 flex items-center justify-center w-full h-full transition-all">
                <Map size={22} className={`${view === ViewState.MAP ? 'text-primary' : 'text-primary/40'} ${view === ViewState.MAP ? 'scale-110' : ''}`} strokeWidth={view === ViewState.MAP ? 3 : 2} />
            </button>
          </div>
          
          <div className="flex justify-center">
            <button onClick={() => navigateTo(ViewState.DISCOVER)} className="active:scale-95 flex items-center justify-center w-full h-full transition-all">
                <Compass size={22} className={`${view === ViewState.DISCOVER ? 'text-primary' : 'text-primary/40'} ${view === ViewState.DISCOVER ? 'scale-110' : ''}`} strokeWidth={view === ViewState.DISCOVER ? 3 : 2} />
            </button>
          </div>

          <div className="flex justify-center">
            <button onClick={() => navigateTo(ViewState.MEMORIES)} className="active:scale-95 flex items-center justify-center w-12 h-12 bg-transparent transition-all">
                <Users size={28} className={`${view === ViewState.MEMORIES ? 'text-primary' : 'text-primary/40'} transition-all`} strokeWidth={view === ViewState.MEMORIES ? 3 : 2} />
            </button>
          </div>

          <div className="flex justify-center">
            {user.type === UserType.BUSINESS ? (
              <button onClick={() => navigateTo(ViewState.PARTNERS)} className="active:scale-95 flex items-center justify-center w-full h-full transition-all">
                    <Briefcase size={22} className={`${view === ViewState.PARTNERS ? 'text-primary' : 'text-primary/40'} ${view === ViewState.PARTNERS ? 'scale-110' : ''}`} strokeWidth={view === ViewState.PARTNERS ? 3 : 2} />
              </button>
            ) : (
              <button onClick={() => navigateTo(ViewState.CHATS)} className="active:scale-95 flex items-center justify-center w-full h-full transition-all">
                    <MessageSquare size={22} className={`${view === ViewState.CHATS ? 'text-primary' : 'text-primary/40'} ${view === ViewState.CHATS ? 'scale-110' : ''}`} strokeWidth={view === ViewState.CHATS ? 3 : 2} />
              </button>
            )}
          </div>

          <div className="flex justify-center">
            <button onClick={() => navigateTo(ViewState.PROFILE)} className="active:scale-95 flex items-center justify-center w-full h-full transition-all">
              <div className={`relative w-7 h-7 rounded-full overflow-hidden border-2 transition-all ${view === ViewState.PROFILE ? 'border-primary scale-110' : 'border-transparent'}`}>
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} className="w-full h-full object-cover" alt="Profile" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full bg-[#CED4DA] relative">
                    {/* Stylized wave/yin-yang shape from the image */}
                    <div className="absolute bottom-0 right-0 w-[140%] h-[140%] bg-white rounded-[45%] translate-x-[20%] translate-y-[30%] rotate-[-15deg]" />
                    {/* Small dot from the image */}
                    <div className="absolute top-[25%] left-[25%] w-[15%] h-[15%] bg-white rounded-full opacity-90" />
                  </div>
                )}
              </div>
            </button>
          </div>
      </nav>
    </div>
  );
};

export default App;