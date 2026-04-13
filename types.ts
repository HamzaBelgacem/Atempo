
export enum ViewState {
  SPLASH = 'SPLASH',
  MAP = 'MAP',
  DISCOVER = 'DISCOVER',
  MEMORIES = 'MEMORIES',
  PROFILE = 'PROFILE',
  PARTNERS = 'PARTNERS',
  CHATS = 'CHATS',
  COMMUNITY = 'COMMUNITY'
}

export enum UserType {
  STANDARD = 'STANDARD',
  BUSINESS = 'BUSINESS',
  ARTIST_CURATOR = 'ARTIST_CURATOR'
}

export enum AppTheme {
  ROSE = 'ROSE',
  OCEAN = 'OCEAN',
  EMERALD = 'EMERALD',
  LAVENDER = 'LAVENDER',
  SUNSET = 'SUNSET',
  DARK = 'DARK'
}

export interface UserNotificationPrefs {
  newEvents: boolean;
  groupMessages: boolean;
  businessInvites: boolean;
}

export type AppLanguage = 'en' | 'es' | 'fr' | 'pt';

export interface User {
  id: string;
  name: string;
  email?: string;
  password?: string;
  bio?: string;
  avatarUrl?: string;
  professional?: string;
  instagramHandle?: string;
  locationLabel?: string;
  language: AppLanguage;
  isRegistered: boolean;
  isLogIn: boolean;
  isOnboarded: boolean;
  type: UserType;
  theme?: AppTheme;
  preferences: string[];
  gender?: 'M' | 'F' | 'O';
  age?: number;
  timePreferences?: string[];
  locationPermission: 'prompt' | 'granted' | 'denied';
  marketingAccepted: boolean;
  isGameCompleted?: boolean;
  gameAnswers?: Record<string, string>;
  hasAttendedEvent?: boolean;
  hasUploadedMemory?: boolean;
  isVerified?: boolean;
  hasLifetimeSubscription?: boolean;
  registeredEventIds?: string[];
  activeChatIds?: string[];
  notificationPrefs?: UserNotificationPrefs;
  personalityProfile?: PersonalityProfile;
  // Business specific fields
  reliability?: number;
  rating?: number;
  totalAttendees?: number;
  organizationBio?: string;
  favoriteAddress?: {
    label: string;
    lat: number;
    lng: number;
  };
}

export interface BusinessService {
  id: string;
  name: string;
  price: string;
  description: string;
}

export interface Business {
  id: string;
  name: string;
  logo: string;
  coverImage: string;
  description: string;
  location: string;
  followers: number;
  rating: number;
  verified: boolean;
  activeEventsCount: number;
  services?: BusinessService[];
}

export type ContributorRole = 'Event Host' | 'Performing Artist' | 'Visual Artist' | 'Curator' | 'Sponsor' | 'Co-organizer';

export interface EventCollaborator {
  id: string;
  name: string;
  avatarUrl?: string;
  professional?: string;
  role: ContributorRole;
  eventsCount?: number;
  followersCount?: number;
  collaborationsCount?: number;
  distance?: string;
}

export interface Event {
  id: string;
  title: string;
  category: string;
  description: string;
  videoThumbnail: string;
  videoUrl?: string;
  date: string;
  time: string;
  status: 'active' | 'upcoming';
  attendees: number;
  maxCapacity: number;
  lat: number;
  lng: number;
  hostId: string;
  hostName?: string;
  hostAvatar?: string;
  averageAge?: number;
  price?: number;
  address?: string;
  tags?: string[];
  minGroupSize?: number;
  maxGroupSize?: number;
  publishedAt?: string;
  collaboratorIds?: string[];
  collaborators?: EventCollaborator[];
}

export interface MemoryItem {
    id: string;
    url: string;
    urls?: string[];
    userName: string;
    caption: string;
    likes: number;
    type: 'image' | 'video';
    height: string; 
    eventId?: string;
    city?: string;
    country?: string;
    timestamp?: number;
    avatar?: string;
    commentsCount?: number;
    repostsCount?: number;
}

export interface CityStatus {
  name: string;
  entityCount: number;
  requiredCount: number;
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
  isMe: boolean;
  isAnnouncement?: boolean;
  replyTo?: {
    id: string;
    sender: string;
    text: string;
  };
}

export interface ChatMember {
  name: string;
  gender: 'M' | 'F';
  eventsAttended: number;
  isTrusted: boolean;
  isHost?: boolean;
}

export interface ChatGroup {
  id: string;
  name: string;
  eventId: string;
  messages: ChatMessage[];
  members: ChatMember[];
  lastMessage?: string;
  lastTime?: string;
  type?: 'EVENT' | 'FRIEND' | 'BUSINESS' | 'CLUB';
  coverImage?: string;
  tags?: string[];
}

export interface Conversation {
  id: string;
  name: string;
  avatarUrl?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
  isOnline: boolean;
  type: 'EVENT' | 'HUB' | 'CREATIVE';
}

export interface Notification {
  id: string;
  type: 'EVENT' | 'MESSAGE' | 'REMINDER';
  title: string;
  message: string;
  timestamp: number;
}

export interface CommunityGroup {
  id: string;
  name: string;
  avatarUrl?: string;
  lastMessage?: string;
  lastTimestamp?: number;
  memberCount: number;
  isJoined: boolean;
  isAnnouncement?: boolean;
  requiresRequest?: boolean;
}

export enum PersonalityArchetype {
  CONNECTOR = 'The Connector',
  VISIONARY = 'The Visionary',
  STORYTELLER = 'The Storyteller',
  PHILOSOPHER = 'The Philosopher',
  EXPLORER = 'The Explorer',
  STRATEGIST = 'The Strategist',
  MASTERMIND = 'The Mastermind',
  INNOVATOR = 'The Innovator',
  SPARK = 'The Spark',
  EMPATH = 'The Empath',
  CHILL_WAVE = 'The Chill Wave',
  GUIDE = 'The Guide'
}

export type SocialEnergy = 'The Icebreaker' | 'The Catalyst' | 'The Observer';

export interface PersonalityProfile {
  archetype: PersonalityArchetype;
  motive: string;
  energy: SocialEnergy;
  interest: string;
  atmosphere: string;
}

export interface Group {
  id: string;
  eventId: string;
  members: User[];
  score?: number;
}

export interface EventCommunity {
  id: string;
  eventId: string;
  name: string;
  logoUrl: string;
  groups: CommunityGroup[];
}

export const CATEGORIES = [
  'All', 
  'Visual Arts', 
  'Performance', 
  'Music', 
  'Media', 
  'Literature', 
  'Fashion', 
  'Food', 
  'Heritage', 
  'Learning', 
  'Markets'
];
