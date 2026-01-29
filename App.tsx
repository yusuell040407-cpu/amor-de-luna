import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MainTab, AppScreen, UserProfile, PlanType, AntimateriaTransaction, SecurityMetrics, CosmicRank } from './types';
import { Discovery } from './components/Discovery';
import { Store } from './components/Store';
import { MessagesTab } from './components/MessagesTab';
import { ProfileTab } from './components/ProfileTab';
import { GalaxyTab } from './components/GalaxyTab';
import { AuthFlow } from './components/AuthFlow';
import { supabase } from './lib/supabase';
import { 
  Moon, 
  MessageSquare, 
  Wallet, 
  User, 
  Compass, 
  Stars, 
  LogOut,
  ShieldAlert,
  Menu,
  Heart,
  X,
  Zap,
  CheckCircle,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Globe
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const INITIAL_SECURITY: SecurityMetrics = {
  reputationScore: 80,
  verificationLevel: 1,
  isShadowBanned: false,
  financialThrottle: false,
  lastActionTimestamp: {},
  dailyCounters: {
    likes: 0,
    messages: 0,
    amSpent: 0,
    reportsReceived: 0,
    paymentAttempts: 0
  }
};

const calculateRank = (totalAM: number): CosmicRank => {
  if (totalAM > 15000) return 'Supernova';
  if (totalAM > 5000) return 'Nova';
  if (totalAM > 1500) return 'Eclipse';
  if (totalAM > 500) return 'Constelación';
  if (totalAM > 100) return 'Órbita';
  return 'Polvo Estelar';
};

const MOCK_USER: UserProfile = {
  id: 'me',
  name: 'Astronauta',
  age: 28,
  country: 'México',
  city: 'Guadalajara',
  language: 'Español',
  gender: 'Hombre',
  orientation: 'Hetero',
  lookingFor: 'Relación',
  bio: 'Explorador de galaxias y amante del café frío.',
  avatarUrl: 'https://picsum.photos/seed/me/400/400',
  coverUrl: 'https://picsum.photos/seed/cover/800/400',
  isVerified: true,
  education: 'Ingeniería Espacial',
  profession: 'Developer',
  zodiacSign: 'Capricornio',
  interests: ['Coding', 'Gaming', 'Stars'],
  balanceAntimateria: 250,
  antimateriaHistory: [
    { id: '1', date: new Date(), action: 'Bono de Bienvenida', amount: 250 }
  ],
  plan: 'LUNA_NUEVA',
  lastLogin: new Date(),
  matches: [],
  likesSentToday: 0,
  cornerPhotos: [
    'https://picsum.photos/200/200?1',
    'https://picsum.photos/200/200?2',
    'https://picsum.photos/200/200?3',
    'https://picsum.photos/200/200?4'
  ],
  relationshipStatus: 'Soltero',
  religion: 'Ninguna',
  relationshipGoal: 'Relación',
  primarySchool: 'Escuela Primaria 1',
  secondarySchool: 'Secundaria Federal',
  highSchool: 'Bachillerato Tecnológico',
  university: 'Tec de Monterrey',
  universityDegree: 'Ingeniería',
  universityYears: 4,
  secondaryWorkshops: [{ name: 'Astronomía', level: 4 }],
  isStudying: false,
  isWorking: true,
  highSchoolCareer: 'Físico-Matemático',
  security: INITIAL_SECURITY,
  privacy: {
    profileVisibility: 'Public',
    whoCanSeeDetails: 'Everyone',
    reactionPermissions: 'Everyone',
    messagePermissions: 'Everyone'
  },
  rank: 'Órbita',
  aura: {
    color: '#22d3ee',
    animation: 'pulse',
    intensity: 40
  },
  badges: [
    { id: 'b1', name: 'Fundador', icon: '🚀', description: 'Primeros exploradores de la luna.', rarity: 'Legendary' }
  ],
  customization: {
    nameColor: '#ffffff',
    avatarFrame: null,
    backgroundEffect: 'stars',
    animatedEmoji: '✨'
  },
  totalAMSpent: 150
};

const SecurityAlert = ({ message, onDismiss }: { message: string, onDismiss: () => void }) => (
  <div className="fixed top-24 left-6 right-6 z-[150] glass border-red-500/30 p-5 rounded-2xl flex items-center gap-4 animate-in slide-in-from-top-4 duration-600 shadow-2xl mirror-shine">
    <div className="bg-red-500/10 p-2.5 rounded-xl">
      <AlertTriangle className="text-red-500 shrink-0" size={20} />
    </div>
    <p className="text-xs text-gray-200 flex-1 font-semibold leading-relaxed tracking-tight">{message}</p>
    <button onClick={onDismiss} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-500"><X size={16}/></button>
  </div>
);

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.LOGIN);
  const [activeTab, setActiveTab] = useState<MainTab>(MainTab.DISCOVERY);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentMatch, setCurrentMatch] = useState<any>(null);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [securityAlert, setSecurityAlert] = useState<string | null>(null);

  // Handle Supabase Session
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        handleAuthSuccess(session.user);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        handleAuthSuccess(session.user);
      } else {
        setUser(null);
        setCurrentScreen(AppScreen.LOGIN);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthSuccess = (supabaseUser: any) => {
    const syncedUser: UserProfile = {
      ...MOCK_USER,
      id: supabaseUser.id,
      name: supabaseUser.user_metadata.full_name || supabaseUser.email.split('@')[0],
      avatarUrl: supabaseUser.user_metadata.avatar_url || MOCK_USER.avatarUrl,
    };
    setUser(syncedUser);
    setCurrentScreen(AppScreen.MAIN);
  };

  const validateAction = useCallback((actionType: string, cooldownMs: number = 1000): boolean => {
    if (!user) return false;
    const now = Date.now();
    const lastAction = user.security.lastActionTimestamp[actionType] || 0;
    
    if (now - lastAction < cooldownMs) {
      setSecurityAlert("Protección Nebula: Acciones muy frecuentes.");
      return false;
    }

    setUser(prev => prev ? ({
      ...prev,
      security: {
        ...prev.security,
        lastActionTimestamp: { ...prev.security.lastActionTimestamp, [actionType]: now }
      }
    }) : null);
    return true;
  }, [user]);

  const spendAntimateria = (amount: number, action: string) => {
    if (!user) return false;
    if (!validateAction('spend_am', 1200)) return false;

    if (user.balanceAntimateria < amount) {
      setSecurityAlert("Tu Bóveda requiere más energía de Antimateria.");
      setActiveTab(MainTab.WALLET);
      return false;
    }

    const newTransaction: AntimateriaTransaction = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date(),
      action,
      amount: -amount
    };

    setUser(prev => {
      if (!prev) return null;
      const newTotalSpent = prev.totalAMSpent + amount;
      return {
        ...prev,
        balanceAntimateria: prev.balanceAntimateria - amount,
        totalAMSpent: newTotalSpent,
        rank: calculateRank(newTotalSpent),
        antimateriaHistory: [newTransaction, ...prev.antimateriaHistory],
        security: {
          ...prev.security,
          dailyCounters: {
            ...prev.security.dailyCounters,
            amSpent: prev.security.dailyCounters.amSpent + amount
          }
        }
      };
    });
    return true;
  };

  const handleUpdateProfile = (updates: Partial<UserProfile>) => {
    setUser(prev => prev ? ({ ...prev, ...updates }) : null);
    setSecurityAlert("Sincronización cósmica completada.");
    setTimeout(() => setSecurityAlert(null), 3000);
  };

  const handleMatch = (profile: any) => {
    setCurrentMatch(profile);
    setUser(prev => prev ? ({
      ...prev,
      likesSentToday: prev.likesSentToday + 1
    }) : null);
  };

  const handlePurchaseComplete = (amount: number, paymentId: string) => {
    if (!user) return;
    const exists = user.antimateriaHistory.some(t => t.paymentIntentId === paymentId);
    if (exists) return;

    const trans: AntimateriaTransaction = { 
      id: Date.now().toString(), 
      date: new Date(), 
      action: 'Carga de Bóveda (Stripe HD)', 
      amount, 
      paymentIntentId: paymentId 
    };

    setUser(u => u ? ({
      ...u, 
      balanceAntimateria: u.balanceAntimateria + amount, 
      antimateriaHistory: [trans, ...u.antimateriaHistory],
      security: {
        ...u.security,
        reputationScore: Math.min(100, u.security.reputationScore + 5),
        verificationLevel: Math.max(u.security.verificationLevel, 2) as 1|2|3
      }
    }) : null);
    setShowPaymentSuccess(true);
  };

  const handlePlanUpgrade = (p: PlanType, paymentId: string) => {
    if (!user) return;
    const exists = user.antimateriaHistory.some(t => t.paymentIntentId === paymentId);
    if (exists) return;

    const trans: AntimateriaTransaction = { 
      id: Date.now().toString(), 
      date: new Date(), 
      action: `Elevación de Órbita: ${p}`, 
      amount: 0, 
      paymentIntentId: paymentId 
    };

    setUser(u => u ? ({
      ...u, 
      plan: p,
      antimateriaHistory: [trans, ...u.antimateriaHistory],
      security: {
        ...u.security,
        reputationScore: 100,
        verificationLevel: 3
      }
    }) : null);
    setShowPaymentSuccess(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentScreen(AppScreen.LOGIN);
    setIsMenuOpen(false);
  };

  const NavItem = ({ tab, icon: Icon, label }: { tab: MainTab, icon: any, label: string }) => (
    <button 
      onClick={() => { setActiveTab(tab); setIsMenuOpen(false); }}
      className={`flex flex-col items-center gap-2 transition-all duration-600 transform ${activeTab === tab ? 'text-moon-accent scale-105' : 'text-gray-500 hover:text-gray-400'}`}
    >
      <div className={`p-3 rounded-2xl transition-all duration-600 shadow-inner ${activeTab === tab ? 'bg-moon-accent/10 border border-moon-accent/30 shadow-[0_0_25px_rgba(34,211,238,0.2)]' : 'bg-transparent border-transparent'}`}>
        <Icon size={22} strokeWidth={activeTab === tab ? 2.5 : 2} className={activeTab === tab ? 'animate-pulse' : ''} />
      </div>
      <span className="text-[8px] font-black uppercase tracking-[0.3em]">{label}</span>
    </button>
  );

  if (currentScreen !== AppScreen.MAIN || !user) {
    return (
      <AuthFlow 
        onComplete={(u) => { setUser(u); setCurrentScreen(AppScreen.MAIN); }}
        setScreen={setCurrentScreen}
        currentScreen={currentScreen}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto relative bg-void overflow-hidden shadow-2xl ring-1 ring-white/5 premium-card">
      
      {securityAlert && <SecurityAlert message={securityAlert} onDismiss={() => setSecurityAlert(null)} />}

      {currentMatch && (
        <div className="fixed inset-0 z-[100] bg-void/95 backdrop-blur-3xl flex flex-col items-center justify-center p-10 text-center animate-in fade-in zoom-in duration-800">
          <div className="relative mb-16 glass-premium p-10 rounded-[4.5rem] border-moon-accent/20 shadow-[0_0_60px_rgba(34,211,238,0.2)]">
            <div className="flex items-center gap-10 relative z-10">
              <div className="relative group">
                <img src={user.avatarUrl} className="w-24 h-24 rounded-full border-[3px] border-moon-accent shadow-2xl group-hover:scale-110 transition-transform" />
                <div className="absolute inset-0 rounded-full border border-white/10 opacity-20"></div>
              </div>
              <Sparkles className="text-moon-accent animate-pulse opacity-60" size={32} />
              <div className="relative group">
                <img src={currentMatch.avatarUrl} className="w-24 h-24 rounded-full border-[3px] border-moon-accent shadow-2xl group-hover:scale-110 transition-transform" />
                <div className="absolute inset-0 rounded-full border border-white/10 opacity-20"></div>
              </div>
            </div>
          </div>
          <h2 className="text-5xl font-black neon-text mb-6 italic tracking-tighter">¡Sincronía!</h2>
          <p className="text-moon-accent/70 text-[10px] font-black tracking-[0.4em] uppercase mb-16">Conexión establecida en la órbita</p>
          <div className="flex flex-col w-full gap-5 max-w-[280px]">
            <button onClick={() => { setActiveTab(MainTab.MESSAGES); setCurrentMatch(null); }} className="py-5 bg-moon-accent text-void font-black rounded-3xl shadow-xl hover:shadow-moon-accent/30 active:scale-95 transition-all mirror-shine uppercase text-[11px] tracking-widest">Transmitir Mensaje</button>
            <button onClick={() => setCurrentMatch(null)} className="py-5 bg-white/5 text-gray-500 font-bold rounded-3xl hover:bg-white/10 transition-all text-[11px] uppercase tracking-widest">Seguir Viaje</button>
          </div>
        </div>
      )}

      <header className="px-6 py-5 flex justify-between items-center glass z-20 border-b border-white/5 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="bg-void/50 p-2 rounded-xl border border-moon-accent/15 shadow-inner">
            <Moon className="text-moon-accent" size={18} />
          </div>
          <h1 className="font-black text-lg tracking-[0.2em] neon-text italic uppercase">De Luna</h1>
        </div>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2.5 bg-white/5 px-4 py-2 rounded-full border border-white/5 shadow-inner group">
            <Zap size={14} className="text-moon-accent" fill="currentColor" />
            <span className="text-xs font-black tracking-tight">{user.balanceAntimateria}</span>
          </div>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 bg-transparent text-gray-400 hover:text-white transition-colors">
            <Menu size={22} />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto relative z-10 custom-scrollbar bg-gradient-to-b from-void via-[#0a0f1e] to-void">
        {activeTab === MainTab.DISCOVERY && (
          <Discovery 
            onMatch={handleMatch} 
            isPremium={user.plan !== 'LUNA_NUEVA'} 
            onSpend={spendAntimateria}
            likesToday={user.likesSentToday}
            reputation={user.security.reputationScore}
          />
        )}
        {activeTab === MainTab.GALAXY && (
          <GalaxyTab 
            isPremium={user.plan !== 'LUNA_NUEVA'} 
            onPremiumRequired={() => setActiveTab(MainTab.WALLET)}
            onSpendAntimateria={spendAntimateria}
            onMatchSucceeded={handleMatch}
          />
        )}
        {activeTab === MainTab.MESSAGES && (
          <MessagesTab 
            isPremium={user.plan !== 'LUNA_NUEVA'} 
            onUnlock={() => spendAntimateria(100, 'Desbloqueo Chat')}
            onPremiumRequired={() => setActiveTab(MainTab.WALLET)} 
            securityLevel={user.security.verificationLevel}
            onSpendAntimateria={spendAntimateria}
          />
        )}
        {activeTab === MainTab.WALLET && (
          <Store 
            user={user}
            onInitiatePayment={() => {}}
            onPurchaseComplete={handlePurchaseComplete}
            onPlanUpgrade={handlePlanUpgrade}
          />
        )}
        {activeTab === MainTab.PROFILE && (
          <ProfileTab 
            user={user} 
            onUpdateBio={() => Promise.resolve("")} 
            onSpend={spendAntimateria}
            onSave={handleUpdateProfile}
          />
        )}
      </main>

      <nav className="glass h-28 flex justify-around items-center px-8 border-t border-white/5 z-20 shadow-[0_-15px_40px_rgba(0,0,0,0.6)]">
        <NavItem tab={MainTab.DISCOVERY} icon={Compass} label="Órbita" />
        <NavItem tab={MainTab.GALAXY} icon={Globe} label="Galaxia" />
        <NavItem tab={MainTab.MESSAGES} icon={MessageSquare} label="Vínculos" />
        <NavItem tab={MainTab.WALLET} icon={Wallet} label="Bóveda" />
        <NavItem tab={MainTab.PROFILE} icon={User} label="Destino" />
      </nav>

      {isMenuOpen && (
        <div className="absolute inset-0 bg-void/95 backdrop-blur-3xl z-[100] animate-in slide-in-from-right duration-600 p-12 overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-center mb-16">
             <h2 className="text-3xl font-black neon-text italic tracking-tighter">Protocolos</h2>
             <button onClick={() => setIsMenuOpen(false)} className="p-3.5 glass-premium rounded-2xl border border-white/10 text-white shadow-xl active:scale-90 transition-all"><X size={20}/></button>
          </div>
          <div className="space-y-8 max-w-sm mx-auto">
             <div className="p-8 glass-premium rounded-[3rem] border-moon-accent/15 mirror-shine shadow-3xl">
                <p className="text-[10px] text-moon-accent uppercase font-black tracking-[0.4em] mb-6">Estado de Reputación</p>
                <div className="flex justify-between items-center mb-4">
                   <span className="text-[11px] text-gray-500 font-black tracking-widest uppercase">Puntaje Nebula</span>
                   <span className="text-lg font-black text-white italic tracking-tighter">{user.security.reputationScore}%</span>
                </div>
                <div className="w-full h-2.5 bg-void/50 rounded-full mt-2 overflow-hidden shadow-inner border border-white/5 p-0.5">
                   <div className="h-full bg-gradient-to-r from-moon-accent to-moon-purple transition-all duration-1500 rounded-full" style={{ width: `${user.security.reputationScore}%` }}></div>
                </div>
             </div>
             
             <div className="grid grid-cols-1 gap-4">
               <button onClick={handleLogout} className="w-full text-left p-6 glass-premium rounded-2xl border-red-500/15 text-red-500/80 font-black uppercase text-[10px] tracking-[0.3em] flex items-center gap-4 hover:bg-red-500/10 transition-all mirror-shine group">
                  <LogOut size={18} className="group-hover:translate-x-1 transition-transform" /> Salir de la Galaxia
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}