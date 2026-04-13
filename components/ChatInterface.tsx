
import React, { useState, useRef, useEffect } from 'react';
import { ChatGroup, ChatMessage, ChatMember } from '../types';
import { Send, ArrowLeft, MoreVertical, MessageSquare, LayoutGrid, Smile, Paperclip, Camera, Mic, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatInterfaceProps {
  chat: ChatGroup;
  onBack: () => void;
  onViewMap: (eventId: string) => void;
  onOpenCommunity?: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ chat, onBack, onOpenCommunity }) => {
  const [newMessage, setNewMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(chat.messages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setChatMessages(chat.messages);
  }, [chat.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const formatTime = (timestamp: number) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(new Date(timestamp));
  };

  const handleSend = () => {
    if (!newMessage.trim()) return;
    
    const msg: ChatMessage = { 
      id: Date.now().toString(), 
      sender: 'You', 
      text: newMessage, 
      timestamp: Date.now(), 
      isMe: true
    };

    setChatMessages([...chatMessages, msg]);
    setNewMessage('');
  };

  // Mock colors for senders
  const senderColors: Record<string, string> = {
    'PASHA': 'text-teal-400',
    'Eva Lucia Dekkers': 'text-amber-400',
    'Juan Cruz': 'text-orange-400',
    'You': 'text-teal-500'
  };

  return (
    <div className="flex flex-col h-full relative font-sans overflow-hidden bg-[#FDFCF8]">
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none" style={{
          backgroundImage: `
            radial-gradient(at 0% 0%, rgba(252, 231, 243, 0.4) 0, transparent 70%),
            radial-gradient(at 100% 100%, rgba(243, 232, 255, 0.3) 0, transparent 70%)
          `
      }} />

      {/* Header */}
      <header className="bg-white/60 backdrop-blur-xl sticky top-0 z-50 px-4 py-3 border-b border-black/5 flex items-center gap-3 shrink-0">
        <button onClick={onBack} className="p-1 text-gray-600 hover:bg-black/5 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        
        <div className="flex items-center gap-3 flex-grow min-w-0">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-black/5 shadow-sm shrink-0">
            <img 
              src={`https://api.dicebear.com/7.x/notionists/svg?seed=${chat.name}`} 
              className="w-full h-full object-cover" 
              alt={chat.name} 
            />
          </div>
          <div className="min-w-0">
            <h2 className="text-[16px] font-bold text-gray-900 truncate leading-tight">
              {chat.name}
            </h2>
            <p className="text-[12px] font-bold text-gray-500/60 truncate leading-tight flex items-center gap-1">
              OASI Movement <span className="text-[10px]">🌱</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button onClick={onOpenCommunity} className="p-2 text-gray-500 hover:bg-black/5 rounded-full transition-colors relative">
            <LayoutGrid size={20} />
            <div className="absolute bottom-1 right-1 w-3 h-3 bg-[#FFB7B7] rounded-full border-2 border-white flex items-center justify-center shadow-glow-soft-pink">
              <div className="w-1 h-1 bg-white rounded-full" />
            </div>
          </button>
          <button className="p-2 text-gray-500 hover:bg-black/5 rounded-full transition-colors">
            <MessageSquare size={20} />
          </button>
          <button className="p-2 text-gray-500 hover:bg-black/5 rounded-full transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 no-scrollbar relative z-10">
        {/* System Message Example */}
        <div className="flex justify-center">
          <p className="text-[11px] font-bold text-gray-400 text-center max-w-[80%] leading-relaxed">
            +995 577 71 72 09 joined from the community.
          </p>
        </div>

        {/* Date Separator */}
        <div className="flex justify-center">
          <div className="px-3 py-1 bg-gray-100/80 backdrop-blur-sm rounded-lg">
            <span className="text-[11px] font-bold text-gray-500">Yesterday</span>
          </div>
        </div>

        {chatMessages.map((msg, index) => {
          const isMe = msg.isMe;
          const colorClass = senderColors[msg.sender] || 'text-teal-500';
          
          return (
            <div key={msg.id} className={`flex items-start gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
              {!isMe && (
                <div className="w-9 h-9 rounded-full overflow-hidden border border-black/5 shadow-sm shrink-0 mt-1">
                  <img 
                    src={`https://api.dicebear.com/7.x/notionists/svg?seed=${msg.sender}`} 
                    className="w-full h-full object-cover" 
                    alt={msg.sender} 
                  />
                </div>
              )}
              
              <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[85%]`}>
                {!isMe && (
                  <div className="flex items-center gap-2 px-1 mb-0.5">
                    <span className={`text-[13px] font-bold ${colorClass}`}>
                      ~ {msg.sender}
                    </span>
                    <span className="text-[11px] font-bold text-gray-400">
                      +39 351 300 3599
                    </span>
                  </div>
                )}
                
                <div className={`px-4 py-2.5 rounded-2xl shadow-sm border border-black/5 relative ${
                  isMe ? 'bg-[#FFB7B7] text-white rounded-tr-none shadow-glow-soft-pink' : 'bg-white/80 backdrop-blur-sm text-gray-900 rounded-tl-none'
                }`}>
                  <p className="text-[15px] font-medium leading-relaxed">
                    {msg.text}
                  </p>
                  <div className={`text-[10px] font-bold mt-1 text-right ${isMe ? 'text-white/60' : 'text-gray-400'}`}>
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Mocking the screenshot messages for better simulation */}
        {!chatMessages.some(m => m.text === 'Hey Where are you guys?') && (
          <>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-black/5 shadow-sm shrink-0 mt-1">
                <img src="https://api.dicebear.com/7.x/notionists/svg?seed=PASHA" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col items-start max-w-[85%]">
                <div className="flex items-center gap-2 px-1 mb-0.5">
                  <span className="text-[13px] font-bold text-teal-400">~ P A S H A</span>
                  <span className="text-[11px] font-bold text-gray-400">+39 351 300 3599</span>
                </div>
                <div className="px-4 py-2.5 rounded-2xl bg-white/80 backdrop-blur-sm border border-black/5 shadow-sm rounded-tl-none">
                  <p className="text-[15px] font-bold text-gray-900 leading-tight">Hey</p>
                  <p className="text-[15px] font-bold text-gray-900 leading-tight">Where are you guys?</p>
                  <div className="text-[10px] font-bold mt-1 text-right text-gray-400">19:02</div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-black/5 shadow-sm shrink-0 mt-1">
                <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Eva" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col items-start max-w-[85%]">
                <div className="flex items-center gap-2 px-1 mb-0.5">
                  <span className="text-[13px] font-bold text-amber-400">Eva Lucia Dekkers 🇳🇱</span>
                  <span className="text-[11px] font-bold text-gray-400">RBS Previous Intake A...</span>
                </div>
                <div className="px-4 py-2.5 rounded-2xl bg-white/80 backdrop-blur-sm border border-black/5 shadow-sm rounded-tl-none">
                  <p className="text-[15px] font-bold text-gray-900 leading-tight">Parking outside :)</p>
                  <p className="text-[15px] font-bold text-gray-900 leading-tight">The table in the back is reserved for us!</p>
                  <div className="text-[10px] font-bold mt-1 text-right text-gray-400">19:03</div>
                </div>
              </div>
            </div>
          </>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white/80 backdrop-blur-xl border-t border-black/5 p-3 pb-4 shrink-0 relative z-20">
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-100/80 rounded-full px-4 py-2 flex items-center gap-3">
            <button className="text-gray-500 hover:text-gray-700 transition-colors">
              <Smile size={24} />
            </button>
            <input 
              type="text" 
              className="flex-1 bg-transparent text-[15px] font-medium text-gray-900 focus:outline-none placeholder:text-gray-400" 
              placeholder="Message" 
              value={newMessage} 
              onChange={(e) => setNewMessage(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
            />
            <button className="text-gray-500 hover:text-gray-700 transition-colors rotate-45">
              <Paperclip size={22} />
            </button>
            <button className="text-gray-500 hover:text-gray-700 transition-colors">
              <Camera size={22} />
            </button>
          </div>
          
          <button 
            onClick={handleSend}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-glow-soft-pink ${
              newMessage.trim() ? 'bg-[#FFB7B7] text-white' : 'bg-[#FFB7B7] text-white'
            }`}
          >
            {newMessage.trim() ? <Send size={20} /> : <Mic size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
