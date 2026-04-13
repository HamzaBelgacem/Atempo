
import React, { useState } from 'react';
import { X, Bell, Shield, Lock, Palette, ChevronRight, Check, MapPin, Camera, Mic, LogOut, Info, UserCircle, Briefcase, MessageCircle, Trash2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppTheme, User, UserType, UserNotificationPrefs } from '../types';

interface SettingsModalProps {
  user: User;
  onClose: () => void;
  onUpdateTheme: (theme: AppTheme) => void;
  onLogout: () => void;
    onLogIn: () => void;
  onUpdateUser: (user: User) => void;
}

const THEME_OPTIONS = [
    { id: AppTheme.ROSE, name: 'Rose White', color: '#fdf2f2', border: 'border-pink-100' },
    { id: AppTheme.DARK, name: 'Deep Space', color: '#0B1120', border: 'border-blue-900/50' },
];

const SettingsModal: React.FC<SettingsModalProps> = ({ user, onClose, onUpdateTheme, onLogout, onLogIn, onUpdateUser }) => {
  const isBusiness = user.type === UserType.BUSINESS;
  const isDark = user.theme === AppTheme.DARK;
  
  const currentPrefs: UserNotificationPrefs = user.notificationPrefs || {
    newEvents: true,
    groupMessages: true,
    businessInvites: true
  };

  const toggleNotification = (key: keyof UserNotificationPrefs) => {
    onUpdateUser({
      ...user,
      notificationPrefs: {
        ...currentPrefs,
        [key]: !currentPrefs[key]
      }
    });
  };

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const  [showLoginModal, setShowLogInConfirm] = useState(false);

  const notificationItems = [
    { key: 'newEvents' as const, label: 'New Events', icon: <Bell size={14} /> },
    { key: 'groupMessages' as const, label: 'Group Messages', icon: <MessageCircle size={14} /> },
    { key: 'businessInvites' as const, label: 'Business Invites', icon: <Briefcase size={14} /> }
  ];

  return (
    <div className="fixed inset-0 z-[600] bg-black/60 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in font-sans">
      <div className={`${isDark ? 'bg-slate-900 border border-white/10' : 'bg-white'} w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-in`}>
        
        {/* Header */}
        <div className={`px-10 pt-10 pb-6 flex items-center justify-between border-b ${isDark ? 'border-white/5' : 'border-gray-50'}`}>
            <div>
                <h2 className={`text-2xl font-black tracking-tighter leading-none ${isDark ? 'text-white' : 'text-black'}`}>Settings</h2>
                <p className={`text-[10px] font-black uppercase tracking-widest mt-2 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>Customize your Atempo ID</p>
            </div>
            <button onClick={onClose} className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isDark ? 'bg-white/5 text-white/40 hover:text-white' : 'bg-gray-50 text-gray-400 hover:text-black'}`}>
                <X size={20} />
            </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-10 space-y-10">
            
            {/* 1. SECCIÓN: TEMAS */}
            <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                    <Palette size={16} className="text-accent" />
                    <h3 className={`text-[11px] font-black uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-gray-400'}`}>App Theme</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {THEME_OPTIONS.map((theme) => (
                        <button
                            key={theme.id}
                            onClick={() => onUpdateTheme(theme.id)}
                            className={`p-4 rounded-xl border transition-all flex items-center gap-3 relative overflow-hidden ${user.theme === theme.id ? 'border-accent shadow-md scale-[1.02]' : isDark ? 'border-white/5 hover:border-white/20' : 'border-gray-100 hover:border-accent/20'}`}
                            style={{ backgroundColor: theme.id === AppTheme.DARK ? '#0B1120' : isDark ? '#1E293B' : 'white' }}
                        >
                            <div 
                                className={`w-6 h-6 rounded-full border ${theme.border} shrink-0`}
                                style={{ backgroundColor: theme.color }}
                            />
                            <span className={`text-[10px] font-black uppercase tracking-widest ${theme.id === AppTheme.DARK || isDark ? 'text-white' : 'text-black'}`}>
                                {theme.name}
                            </span>
                            {user.theme === theme.id && (
                                <div className="absolute top-1 right-1">
                                    <div className="bg-accent text-white p-1 rounded-full"><Check size={8} strokeWidth={4} /></div>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* 2. SECCIÓN: NOTIFICACIONES */}
            <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                    <Bell size={16} className="text-accent" />
                    <h3 className={`text-[11px] font-black uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-gray-400'}`}>Notifications</h3>
                </div>
                <div className="space-y-2">
                    {notificationItems.map((item) => {
                        const active = currentPrefs[item.key];
                        return (
                            <div key={item.key} className={`flex items-center justify-between p-5 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50/50'}`}>
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-xl ${active ? 'bg-accent/10 text-accent' : isDark ? 'bg-white/5 text-white/20' : 'bg-gray-100 text-gray-400'}`}>
                                        {item.icon}
                                    </div>
                                    <span className={`text-[12px] font-bold ${isDark ? 'text-white/80' : 'text-gray-700'}`}>{item.label}</span>
                                </div>
                                <button 
                                    onClick={() => toggleNotification(item.key)}
                                    className={`w-12 h-6 rounded-full relative transition-colors duration-300 shadow-inner ${active ? 'bg-accent' : isDark ? 'bg-white/10' : 'bg-gray-200'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 ${active ? 'right-1' : 'left-1'}`} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 3. SECCIÓN: PERMISOS */}
            <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                    <Shield size={16} className="text-accent" />
                    <h3 className={`text-[11px] font-black uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-gray-400'}`}>Privacy & Permissions</h3>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { id: 'loc', icon: <MapPin size={18} />, active: user.locationPermission === 'granted' },
                        { id: 'cam', icon: <Camera size={18} />, active: true },
                        { id: 'mic', icon: <Mic size={18} />, active: true }
                    ].map((p, i) => (
                        <div key={i} className={`p-6 rounded-xl border flex flex-col items-center gap-3 ${p.active ? 'bg-accent/10 border-accent/20 text-accent' : isDark ? 'bg-white/5 border-white/5 text-white/20' : 'bg-gray-50 border-gray-100 text-gray-300'}`}>
                            {p.icon}
                            <span className="text-[8px] font-black uppercase tracking-widest">{p.active ? 'ON' : 'OFF'}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Logout and Danger Zone */}
            <div className="space-y-4 pt-4 pb-10">
                <button 
                    onClick={() => setShowLogoutConfirm(true)}
                    className={`w-full py-5 ${isDark ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-500'} font-black text-[11px] uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-3 active:scale-95 transition-all`}
                >
                    <LogOut size={16} /> Logout
                </button>
                
                <div className="flex flex-col items-center">
                    <button className="flex items-center gap-1.5 py-1 px-3 opacity-30 hover:opacity-100 transition-opacity active:scale-95">
                        <Trash2 size={10} className="text-red-500" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-red-500">Delete account permanently</span>
                    </button>
                </div>
            </div>
             <div className="space-y-4 pt-4 pb-10">
                <button 
                    onClick={() => setShowLogInConfirm(true)}
                    className={`w-full py-5 ${isDark ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-500'} font-black text-[11px] uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-3 active:scale-95 transition-all`}
                >
                    <LogOut size={16} /> Log In0
                </button>
                
                <div className="flex flex-col items-center">
                    <button className="flex items-center gap-1.5 py-1 px-3 opacity-30 hover:opacity-100 transition-opacity active:scale-95">
                        <Trash2 size={10} className="text-red-500" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-red-500">Delete account permanently</span>
                    </button>
                </div>
            </div>
        </div>

        <div className={`px-10 py-6 flex items-center justify-center gap-4 ${isDark ? 'bg-black/20' : 'bg-gray-50'}`}>
            <Info size={12} className="text-gray-400" />
            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Atempo v3.3.0 • Made with love in Valencia</span>
        </div>

      </div>

      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[700] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`${isDark ? 'bg-slate-900 border border-white/10' : 'bg-white'} w-full max-w-xs rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center gap-6`}
            >
              <div className={`w-16 h-16 rounded-2xl ${isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-500'} flex items-center justify-center shadow-inner`}>
                <LogOut size={32} />
              </div>
              
              <div className="space-y-2">
                <h3 className={`text-xl font-serif font-bold ${isDark ? 'text-white' : 'text-black'}`}>Log Out</h3>
                <p className={`text-[11px] font-black uppercase tracking-[0.2em] leading-relaxed ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                  Are you sure you want to leave? <br/> Your session will be closed.
                </p>
              </div>

              <div className="w-full flex flex-col gap-3">
                <button 
                  onClick={onLogout}
                  className="w-full py-4 bg-red-500 text-white rounded-xl font-black text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-red-500/20 active:scale-95 transition-all">
                  Yes, Log Out
                </button>
                <button 
                  onClick={() => setShowLogoutConfirm(false)}
                  className={`w-full py-4 ${isDark ? 'bg-white/5 text-white/60' : 'bg-gray-100 text-gray-500'} rounded-xl font-black text-[11px] uppercase tracking-[0.2em] active:scale-95 transition-all`}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

       <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-[700] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`${isDark ? 'bg-slate-900 border border-white/10' : 'bg-white'} w-full max-w-xs rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center gap-6`}
            >
              <div className={`w-16 h-16 rounded-2xl ${isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-500'} flex items-center justify-center shadow-inner`}>
                <LogOut size={32} />
              </div>
              
              <div className="space-y-2">
                <h3 className={`text-xl font-serif font-bold ${isDark ? 'text-white' : 'text-black'}`}>Log In----</h3>
                <p className={`text-[11px] font-black uppercase tracking-[0.2em] leading-relaxed ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                  Are you sure you want to leave? <br/> Your session will be closed.
                </p>
              </div>

              <div className="w-full flex flex-col gap-3">
                <button 
                  onClick={onLogIn}
                  className="w-full py-4 bg-red-500 text-white rounded-xl font-black text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-red-500/20 active:scale-95 transition-all">
                  Yes, Log In
                </button>
             <button 
                  onClick={() => setShowLogInConfirm(false)}
                  className={`w-full py-4 ${isDark ? 'bg-white/5 text-white/60' : 'bg-gray-100 text-gray-500'} rounded-xl font-black text-[11px] uppercase tracking-[0.2em] active:scale-95 transition-all`}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SettingsModal;
