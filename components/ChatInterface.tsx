
import React, { useState, useRef, useEffect } from 'react';
import { ChatGroup, ChatMessage, ChatMember } from '../types';
import { Send, ArrowLeft, Info, MapPin, Clock, ShieldCheck, X, Users, Award, Reply, CornerDownRight, Megaphone, MessageCircle, ChevronRight, LayoutGrid, User as UserIcon, CheckCircle2, Heart, Palette, HelpCircle, Sparkles, Play, BookOpen, Music, Video as VideoIcon, Plus } from 'lucide-react';
import { MOCK_EVENTS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';

interface ChatInterfaceProps {
  chat: ChatGroup;
  onBack: () => void;
  onViewMap: (eventId: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ chat, onBack, onViewMap }) => {
  const [activeTab, setActiveTab] = useState<'CHATS' | 'VOICE' | 'CALLS'>('CHATS');
  const [isCommunityView, setIsCommunityView] = useState(false);
  const [showProposeMenu, setShowProposeMenu] = useState(false);
  
  const [newMessage, setNewMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(chat.messages);
  const [showWelcome, setShowWelcome] = useState(false);

  // Mock Voice Rooms (based on image)
  const voiceRooms = [
    { id: 'v1', title: 'Sleepy head 😴', host: 'Phoenix', tag: 'Historias Extrañas', lang: 'EN', participants: 32, top: true, color: 'bg-rose-100' },
    { id: 'v2', title: 'Ideas de negocios 🧠🤝💼', host: 'Henry', tag: 'Podcast', lang: 'ES', participants: 8, color: 'bg-amber-100' },
    { id: 'v3', title: 'P 🌺🇵🇷🇨🇺🇩🇴🇭🇹🇧🇷🇻🇪🇨🇴🇫🇷🌺R', host: 'La Bori', tag: 'Historias Extrañas', lang: 'ES', participants: 4, color: 'bg-blue-100' },
    { id: 'v4', title: 'Your Daily Radio | Come Say Hi 🌈', host: 'MH', tag: 'Historias Extrañas', lang: 'EN', participants: 34, creator: true, color: 'bg-purple-100' },
  ];

  // Mock Video Calls
  const videoCalls = [
    { id: 'c1', title: 'Night Vibes 🌙', participants: 12, host: 'Elena', active: true, color: 'bg-indigo-50' },
    { id: 'c2', title: 'Design Critique 🎨', participants: 5, host: 'Arlo', active: true, color: 'bg-emerald-50' },
  ];

  useEffect(() => {
    setChatMessages(chat.messages);
  }, [chat.id]);
  
  const [announcements, setAnnouncements] = useState<ChatMessage[]>([
    {
      id: 'ann-1',
      sender: 'Organizer',
      text: 'Welcome to the Club! Here we share everything about our passion.',
      timestamp: Date.now() - 3600000,
      isMe: false,
      isAnnouncement: true
    }
  ]);
  
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isClub = chat.type === 'CLUB';

  const currentMessages = chatMessages;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, activeTab, isCommunityView]);

  useEffect(() => {
    if (chat.type === 'CLUB') {
      setShowWelcome(true);
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [chat.id]);

  const event = MOCK_EVENTS.find(e => e.id === chat.eventId);

  const formatTime = (timestamp: number) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(timestamp));
  };

  const handleSend = () => {
    if (!newMessage.trim() || activeTab !== 'CHATS') return;
    
    const msg: ChatMessage = { 
      id: Date.now().toString(), 
      sender: 'You', 
      text: newMessage, 
      timestamp: Date.now(), 
      isMe: true,
      replyTo: replyingTo ? {
        id: replyingTo.id,
        sender: replyingTo.sender,
        text: replyingTo.text
      } : undefined
    };

    setChatMessages([...chatMessages, msg]);
    setNewMessage('');
    setReplyingTo(null);
  };

  const VoiceRoomCard: React.FC<{ room: any }> = ({ room }) => (
    <div className={`p-4 rounded-[24px] ${room.color} border border-white/40 shadow-sm relative overflow-hidden group active:scale-[0.98] transition-all`}>
      <div className="flex justify-between items-center mb-2">
        <div className="flex gap-2">
          <span className="px-1.5 py-0.5 bg-black/10 rounded text-[7px] font-black">{room.lang}</span>
          <span className="px-1.5 py-0.5 bg-purple-500/20 text-purple-700 rounded text-[7px] font-black flex items-center gap-1">
            <MessageCircle size={8} /> {room.tag}
          </span>
          {room.top && (
            <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-700 rounded text-[7px] font-black flex items-center gap-1">
              🔥 Top 1
            </span>
          )}
        </div>
        <div className="px-1.5 py-0.5 bg-black/10 rounded-full text-[8px] font-black text-primary">
          {room.participants}
        </div>
      </div>
      
      <div className="flex justify-between items-center gap-4">
        <h3 className="text-sm font-serif font-bold text-primary tracking-tight leading-tight flex-1">
          {room.title}
        </h3>
        
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-gray-100 overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${room.id}-${i}`} className="w-full h-full object-cover" alt="participant" />
              </div>
            ))}
          </div>
          <div className="w-7 h-7 rounded-full bg-white border border-white/40 overflow-hidden">
            <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${room.host}`} className="w-full h-full object-cover" alt={room.host} />
          </div>
        </div>
      </div>
    </div>
  );

  const VideoCallCard: React.FC<{ call: any }> = ({ call }) => (
    <div className={`p-5 rounded-[32px] ${call.color} border border-white/40 shadow-sm relative overflow-hidden group active:scale-[0.98] transition-all`}>
      <div className="absolute top-4 right-4 flex items-center gap-1.5 z-10">
        <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
        <span className="text-[8px] font-black text-rose-500 uppercase tracking-widest">Live</span>
      </div>
      
      <h3 className="text-lg font-serif font-bold text-primary tracking-tight mb-4 leading-tight">
        {call.title}
      </h3>
      
      <div className="grid grid-cols-2 gap-2 mb-4">
        {[1, 2].map(i => (
          <div key={i} className="aspect-[3/4] rounded-2xl bg-white/40 overflow-hidden relative border border-white/40">
            <img 
              src={`https://picsum.photos/seed/${call.id}-${i}/400/600`} 
              className="w-full h-full object-cover" 
              alt="video" 
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/40 backdrop-blur-md rounded text-[7px] font-bold text-white">
              Participant {i}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white border border-white/40 overflow-hidden">
            <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${call.host}`} className="w-full h-full object-cover" alt={call.host} />
          </div>
          <span className="text-[10px] font-black text-primary">{call.host}</span>
        </div>
        <div className="px-3 py-1.5 bg-emerald-500 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20">
          Join Call
        </div>
      </div>
    </div>
  );

  if (isCommunityView) {
      return (
          <div className="fixed inset-0 z-[550] flex flex-col font-sans overflow-hidden animate-slide-up bg-[#fdf2f2]">
              <div className="px-8 pt-16 pb-6 flex items-center justify-between border-b border-gray-100/50 relative z-10 bg-white/40 backdrop-blur-md">
                  <div className="flex flex-col">
                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-1">{isClub ? 'Interest Club' : 'Event Community'}</span>
                      <h2 className="text-2xl font-black text-black tracking-tighter leading-none">{chat.name}</h2>
                  </div>
                  <button onClick={() => setIsCommunityView(false)} className="w-12 h-12 bg-white/80 rounded-2xl shadow-sm border border-white flex items-center justify-center text-black active:scale-90 transition-all">
                      <X size={24} />
                  </button>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar p-8 relative z-10 space-y-10 pb-40">
                  <div className="flex flex-col items-center text-center">
                      <div className="w-24 h-24 rounded-[32px] bg-white border border-gray-100 shadow-xl flex items-center justify-center font-black text-4xl text-emerald-500 overflow-hidden">
                          {chat.coverImage ? <img src={chat.coverImage} className="w-full h-full object-cover" /> : chat.name.charAt(0)}
                      </div>
                      <h3 className="text-xl font-black text-black tracking-tighter mb-1 mt-6">{chat.name}</h3>
                      <p className="text-xs font-bold text-gray-400">Pulse Channel • {chat.members.length} members</p>
                  </div>

                  <div className="space-y-4">
                      <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Channels of the {isClub ? 'Club' : 'Group'}</h3>
                      <div className="space-y-2">
                          <button 
                            onClick={() => { setActiveTab('CHATS'); setIsCommunityView(false); }}
                            className={`w-full p-6 rounded-[32px] border flex items-center gap-5 transition-all active:scale-[0.98] ${activeTab === 'CHATS' ? 'bg-white border-emerald-500 shadow-md' : 'bg-white/60 border-white/40'}`}
                          >
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${activeTab === 'CHATS' ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-emerald-500'}`}>
                                  <MessageCircle size={24} />
                              </div>
                              <div className="flex-1 text-left">
                                  <h4 className="text-sm font-black text-black">General Chat</h4>
                                  <p className="text-[10px] font-bold text-gray-400">Open conversation</p>
                              </div>
                              <ChevronRight size={18} className="text-gray-300" />
                          </button>

                          {isClub && (
                            <button 
                                onClick={() => { setActiveTab('VOICE'); setIsCommunityView(false); }}
                                className={`w-full p-6 rounded-[32px] border flex items-center gap-5 transition-all active:scale-[0.98] ${activeTab === 'VOICE' ? 'bg-white border-emerald-500 shadow-md' : 'bg-white/60 border-white/40'}`}
                            >
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${activeTab === 'VOICE' ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-500'}`}>
                                    <Music size={24} />
                                </div>
                                <div className="flex-1 text-left">
                                    <h4 className="text-sm font-black text-black">Voice Rooms</h4>
                                    <p className="text-[10px] font-bold text-gray-400">Live audio rooms</p>
                                </div>
                                <ChevronRight size={18} className="text-gray-300" />
                            </button>
                          )}
                      </div>
                  </div>

                  <div className="space-y-6">
                      <div className="flex items-center justify-between ml-1">
                          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Members</h3>
                          <Users size={14} className="text-gray-300" />
                      </div>
                      <div className="space-y-1">
                          {chat.members.map((member, i) => (
                              <div key={i} className="flex items-center justify-between p-4 bg-white/40 rounded-2xl border border-white/20">
                                  <div className="flex items-center gap-4">
                                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${member.isHost ? 'bg-emerald-600 text-white' : (member.gender === 'M' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600')}`}>
                                          <UserIcon size={18} />
                                      </div>
                                      <div className="flex flex-col">
                                          <span className="text-sm font-black text-black">{member.name}</span>
                                          {member.isHost && <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest leading-none mt-1">Admin</span>}
                                      </div>
                                  </div>
                                  {member.isTrusted && !member.isHost && <ShieldCheck size={14} className="text-emerald-500" />}
                              </div>
                          ))}
                      </div>
                  </div>
              </div>

              <div className="p-10 pb-14 bg-white/80 backdrop-blur-xl border-t border-gray-100 shrink-0 relative z-10">
                  <button onClick={() => setIsCommunityView(false)} className="w-full py-6 bg-black text-white rounded-[32px] font-black text-[11px] uppercase tracking-widest shadow-2xl active:scale-95 transition-all">
                      Back to Chat
                  </button>
              </div>
          </div>
      );
  }

  return (
    <div className="flex flex-col h-full relative font-sans overflow-hidden bg-[#fdf2f2]">
      <div className="absolute inset-0 z-0 bg-white/10" />

      <AnimatePresence>
        {showWelcome && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] w-[70%] max-w-[240px] pointer-events-none"
          >
            <div className="bg-white/80 backdrop-blur-2xl border border-white/60 p-6 rounded-[32px] shadow-watercolor flex flex-col items-center text-center relative overflow-hidden">
              {/* Synergistic watercolor blobs (soft pink/lavender) */}
              <div className="absolute -top-10 -left-10 w-24 h-24 bg-rose-200/30 rounded-full blur-2xl animate-float" />
              <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-indigo-200/30 rounded-full blur-2xl animate-float stagger-2" />
              
              <div className="w-14 h-14 bg-white rounded-2xl shadow-ios border border-white/60 flex items-center justify-center text-accent mb-4 relative z-10">
                <Sparkles size={28} />
              </div>
              <div className="relative z-10">
                <span className="text-[8px] font-black text-accent/60 uppercase tracking-[0.4em] mb-1.5 block">Welcome to the Club</span>
                <h3 className="text-xl font-serif font-bold text-primary tracking-tighter leading-tight mb-1">{chat.name}</h3>
                <p className="text-[9px] font-bold text-primary/30 uppercase tracking-widest">Connect with your vibe</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div 
        onClick={() => setIsCommunityView(true)}
        className="bg-white/80 backdrop-blur-md border-b border-white/40 sticky top-0 z-50 pt-2 shrink-0 cursor-pointer hover:bg-white/90 transition-all"
      >
        <div className="px-6 pb-4 flex items-center justify-between">
          <button 
            onClick={(e) => { e.stopPropagation(); onBack(); }} 
            className="p-2 bg-white/50 rounded-lg text-black active:scale-90 transition-all border border-white/40"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5">
                <h2 className="font-black text-black text-xs uppercase tracking-tight">
                    {chat.name}
                </h2>
            </div>
            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Tap to see Community</p>
          </div>
          <div className="flex items-center gap-2 relative">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowProposeMenu(!showProposeMenu); }}
              className="p-2 bg-emerald-500 text-white rounded-lg border border-emerald-400 active:scale-90 transition-all shadow-lg shadow-emerald-500/20"
            >
              <Plus size={16} />
            </button>
            <AnimatePresence>
              {showProposeMenu && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  className="absolute top-full right-0 mt-2 w-48 bg-white/90 backdrop-blur-xl border border-white/60 rounded-[24px] shadow-watercolor z-[60] p-2 overflow-hidden"
                >
                  <div className="flex flex-col gap-1">
                    {[
                      { id: 'chat', label: 'Propose Chat', icon: <MessageCircle size={14} />, color: 'text-emerald-500' },
                      { id: 'voice', label: 'Start Voice', icon: <Music size={14} />, color: 'text-amber-500' },
                      { id: 'call', label: 'Start Video', icon: <VideoIcon size={14} />, color: 'text-rose-500' }
                    ].map(item => (
                      <button 
                        key={item.id}
                        onClick={(e) => { e.stopPropagation(); setShowProposeMenu(false); }}
                        className="flex items-center gap-3 p-3 hover:bg-white/50 rounded-xl transition-colors text-left"
                      >
                        <div className={`w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center ${item.color}`}>
                          {item.icon}
                        </div>
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <button className="p-2 bg-white/50 text-gray-400 rounded-lg border border-white/40"><LayoutGrid size={16} /></button>
          </div>
        </div>
        
        <div className="px-6 pb-3">
          <div className="flex gap-1 p-1 rounded-[24px] bg-white/60 border border-white/40 shadow-sm backdrop-blur-md">
            {[
              { id: 'CHATS', label: 'Chats', icon: <MessageCircle size={14} /> },
              { id: 'VOICE', label: 'Voice', icon: <Music size={14} /> },
              { id: 'CALLS', label: 'Calls', icon: <VideoIcon size={14} /> }
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={(e) => { e.stopPropagation(); setActiveTab(tab.id as any); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${activeTab === tab.id ? 'bg-white text-[#FFB7B7] shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-2 no-scrollbar pb-10 relative z-10">
        {activeTab === 'VOICE' ? (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between px-2 mb-2">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Voice Rooms</h3>
                <Music size={14} className="text-amber-500" />
              </div>
              {voiceRooms.map(room => (
                <VoiceRoomCard key={room.id} room={room} />
              ))}
            </div>
        ) : activeTab === 'CALLS' ? (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between px-2 mb-2">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Live Video Calls</h3>
                <VideoIcon size={14} className="text-rose-500" />
              </div>
              {videoCalls.map(call => (
                <VideoCallCard key={call.id} call={call} />
              ))}
            </div>
        ) : (
            <>
              {/* Active Members Row (Similar to Friends in Memories) */}
              <div className="mb-4 animate-fade-in">
                <div className="flex items-center justify-between px-2 mb-3">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active in Club</h3>
                  <Users size={14} className="text-emerald-500" />
                </div>
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                  {chat.members.map((member, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 shrink-0">
                      <div className="w-14 h-14 rounded-[20px] p-0.5 bg-gradient-to-tr from-emerald-400 to-amber-400 shadow- watercolor">
                        <div className="w-full h-full rounded-[18px] bg-white p-0.5">
                          <img 
                            src={`https://api.dicebear.com/7.x/notionists/svg?seed=${member.name}`} 
                            className="w-full h-full object-cover rounded-[16px]" 
                            alt={member.name} 
                          />
                        </div>
                      </div>
                      <span className="text-[9px] font-black text-primary/60 uppercase tracking-widest">{member.name.split(' ')[0]}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {currentMessages.map((msg, index) => {
              const isFirstInSequence = index === 0 || chatMessages[index - 1]?.sender !== msg.sender;
              const member = chat.members.find(m => m.name === msg.sender);
              
              return (
                <div key={msg.id} className={`flex group/msg ${msg.isMe ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                  <div className={`max-w-[85%] flex ${msg.isMe ? 'flex-row-reverse' : 'flex-row'} items-end gap-3`}>
                     {!msg.isMe && isFirstInSequence && (
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-white/40 ${member?.gender === 'M' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                           <UserIcon size={14} />
                        </div>
                     )}
                     {!msg.isMe && !isFirstInSequence && <div className="w-8 shrink-0" />}
                     
                     <div className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'} gap-1`}>
                        {!msg.isMe && isFirstInSequence && (
                          <div className="text-[9px] font-black text-primary/40 uppercase tracking-widest ml-1 mb-0.5">
                            {msg.sender}
                          </div>
                        )}
                        <div className="relative">
                           <div 
                             className={`relative px-5 py-3.5 text-[13px] font-bold transition-all ${
                               msg.isMe 
                               ? 'bg-primary text-white rounded-[24px] rounded-br-none shadow-ios-deep' 
                               : 'bg-white text-primary border border-white/60 shadow-watercolor rounded-[24px] rounded-bl-none'
                             }`}
                           >
                             {msg.text}
                             <div className={`text-[7px] font-black mt-1.5 uppercase tracking-widest ${msg.isMe ? 'text-white/40 text-right' : 'text-primary/30'}`}>
                               {formatTime(msg.timestamp)}
                             </div>
                           </div>
                        </div>
                     </div>
                  </div>
                </div>
              );
              })}
            </>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white/80 backdrop-blur-xl border-t border-white/40 p-4 pb-4 space-y-3 shrink-0 relative z-10">
        {activeTab === 'CHATS' ? (
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-md rounded-2xl p-2 pl-6 pr-2 shadow-sm border border-white/60">
                <input 
                    type="text" 
                    className="flex-1 bg-transparent text-[13px] font-bold text-black focus:outline-none placeholder:text-gray-400" 
                    placeholder="Write in the club..." 
                    value={newMessage} 
                    onChange={(e) => setNewMessage(e.target.value)} 
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
                />
                <button 
                    onClick={handleSend} 
                    disabled={!newMessage.trim()} 
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${newMessage.trim() ? 'bg-black text-white shadow-xl active:scale-95' : 'bg-gray-200/50 text-gray-400'}`}
                >
                    <Send size={18} />
                </button>
            </div>
        ) : null}
      </div>
    </div>
  );
};

export default ChatInterface;
