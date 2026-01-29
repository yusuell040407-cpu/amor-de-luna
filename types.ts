export type PlanType = 'LUNA_NUEVA' | 'LUNA_LLENA' | 'ECLIPSE' | 'ECLIPSE_INFINITO';

export type CosmicRank = 'Polvo Estelar' | 'Órbita' | 'Constelación' | 'Eclipse' | 'Nova' | 'Supernova';

export type MessageType = 'text' | 'voice' | 'image' | 'gift' | 'system' | 'lunar_phase' | 'vanishing';

export interface FeedProfile {
  id: string;
  name: string;
  avatarUrl: string;
  status: string;
  interests: string[];
  isOnline: boolean;
  energyLevel: number;
}

export interface PartyRoom {
  id: string;
  name: string;
  hostName: string;
  listeners: number;
  tags: string[];
  type: 'Chill' | 'Game' | 'Debate';
}

export enum GalaxyMode {
  MENU,
  FEED,
  SOUL_GAME,
  VOICE_GAME,
  PARTY_ROOMS,
  ACTIVE_ROOM
}

export interface AntimateriaPackage {
  id: string;
  amount: number;
  price: number;
  label: string;
}

export enum AppScreen {
  LOGIN,
  REGISTER_STEP_1,
  REGISTER_STEP_2,
  MAIN
}

export interface ProfileAura {
  color: string;
  animation: 'pulse' | 'orbit' | 'twinkle' | 'none';
  intensity: number;
}

export interface ProfileBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
  rarity: 'Common' | 'Rare' | 'Legendary';
}

export interface ProfileCustomization {
  nameColor: string;
  avatarFrame: string | null;
  backgroundEffect: 'nebula' | 'stars' | 'void' | 'none';
  animatedEmoji: string | null;
  dailyPhrase?: string;
}

export interface AntimateriaTransaction {
  id: string;
  date: Date;
  action: string;
  amount: number;
  paymentIntentId?: string;
}

export interface SecurityMetrics {
  reputationScore: number;
  verificationLevel: 1 | 2 | 3;
  isShadowBanned: boolean;
  financialThrottle: boolean;
  lastActionTimestamp: Record<string, number>;
  dailyCounters: {
    likes: number;
    messages: number;
    amSpent: number;
    reportsReceived: number;
    paymentAttempts: number;
  };
}

export interface PrivacySettings {
  profileVisibility: 'Public' | 'Private';
  whoCanSeeDetails: 'Everyone' | 'Matches';
  reactionPermissions: 'Everyone' | 'Matches';
  messagePermissions: 'Everyone' | 'Matches';
}

export interface Message {
  id: string;
  sender: 'me' | 'other' | 'guardian';
  type: MessageType;
  text?: string;
  translatedText?: string;
  isTranslated?: boolean;
  isMirrored?: boolean;
  mediaUrl?: string;
  giftId?: string;
  timestamp: Date;
  scheduledFor?: Date;
  status: 'sent' | 'delivered' | 'seen' | 'scheduled' | 'vanishing';
}

export interface ChatSession {
  id: string;
  name: string;
  avatar: string;
  countryFlag: string;
  messages: Message[];
  messageCount: number;
  isRevealed: boolean;
  bondEnergy: number;
  isTyping?: boolean;
  isPeerActive?: boolean; // Nebular Pulse
  lastActive?: Date;
  source?: 'Soul Game' | 'Voice' | 'Party' | 'Orbita';
  translationActiveUntil?: number; // timestamp
  bondLevel?: string;
  statusMessage?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  country: string;
  city: string;
  language: string;
  phone?: string;
  gender: string;
  orientation: string;
  lookingFor: string;
  bio: string;
  avatarUrl: string;
  coverUrl?: string;
  isVerified: boolean;
  education: string;
  profession: string;
  zodiacSign: string;
  interests: string[];
  balanceAntimateria: number;
  antimateriaHistory: AntimateriaTransaction[];
  plan: PlanType;
  lastLogin: Date;
  matches: string[];
  likesSentToday: number;
  cornerPhotos: string[];
  relationshipStatus: string;
  religion: string;
  relationshipGoal: string;
  primarySchool: string;
  secondarySchool: string;
  highSchool: string;
  university: string;
  universityDegree: string;
  universityYears: number;
  secondaryWorkshops: { name: string, level: number }[];
  isStudying: boolean;
  isWorking: boolean;
  highSchoolCareer: string;
  security: SecurityMetrics;
  privacy: PrivacySettings;
  rank: CosmicRank;
  aura: ProfileAura;
  badges: ProfileBadge[];
  customization: ProfileCustomization;
  totalAMSpent: number;
  activeLunarActions?: Record<string, number>;
}

export enum MainTab {
  DISCOVERY,
  GALAXY,
  MESSAGES,
  WALLET,
  PROFILE
}