
export enum ViewState {
  SPLASH = 'SPLASH',
  ONBOARDING = 'ONBOARDING',
  MAP = 'MAP',
  DISCOVER = 'DISCOVER',
  MEMORIES = 'MEMORIES',
  PROFILE = 'PROFILE',
  PARTNERS = 'PARTNERS',
  CHATS = 'CHATS'
}

export enum UserType {
  STANDARD = 'STANDARD',
  BUSINESS = 'BUSINESS'
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
  bio?: string;
  avatarUrl?: string;
  instagramHandle?: string;
  locationLabel?: string;
  language: AppLanguage;
  isRegistered: boolean;
  isOnboarded: boolean;
  type: UserType;
  theme?: AppTheme;
  preferences: string[];
  gender?: 'M' | 'F' | 'O';
  age?: number;
  timePreferences?: string[];
  locationPermission: 'prompt' | 'granted' | 'denied';
  marketingAccepted: boolean;
  registeredEventIds?: string[];
  activeChatIds?: string[];
  notificationPrefs?: UserNotificationPrefs;
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
}

export interface MemoryItem {
    id: string;
    url: string;
    userName: string;
    caption: string;
    likes: number;
    type: 'image' | 'video';
    height: string; 
    eventId?: string;
    city?: string;
    country?: string;
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

export interface Notification {
  id: string;
  type: 'EVENT' | 'MESSAGE' | 'REMINDER';
  title: string;
  message: string;
  timestamp: number;
}

export const CATEGORIES = ['All', 'Art', 'Music', 'Sport', 'Tech', 'Food', 'Nightlife', 'Festivities', 'Kids'];
