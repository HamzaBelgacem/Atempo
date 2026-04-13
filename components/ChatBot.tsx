
import React, { useState } from 'react';
import { Send, Bot } from 'lucide-react';
import { getChatbotResponse } from '../services/geminiService';

const ChatBot: React.FC<{userType: string}> = ({userType}) => {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<{role: 'user' | 'bot', text: string}[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMsg = input;
        setInput('');
        setHistory(prev => [...prev, { role: 'user', text: userMsg }]);
        setLoading(true);

        const response = await getChatbotResponse(userMsg, userType);
        
        setHistory(prev => [...prev, { role: 'bot', text: response }]);
        setLoading(false);
    };

    return (
        <div className="bg-white rounded-[32px] border border-gray-100 overflow-hidden flex flex-col h-72 shadow-ios">
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-gray-50/50">
                {history.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 px-6">
                        <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mb-4 text-purple-600">
                             <Bot size={24} />
                        </div>
                        <p className="text-xs font-bold leading-relaxed">I'm your Horizon guide. Ask me about city insights or event details!</p>
                    </div>
                )}
                {history.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-3.5 rounded-2xl text-[13px] font-semibold leading-relaxed ${msg.role === 'user' ? 'bg-purple-600 text-white shadow-md' : 'bg-white text-gray-800 border border-gray-100 shadow-sm'}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {loading && <div className="flex items-center gap-2 text-[11px] font-black text-purple-400 pl-2">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>}
            </div>
            <div className="bg-white flex border-t border-gray-200 h-12">
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Message assistant..."
                    className="flex-1 bg-transparent px-4 text-[13px] font-semibold text-black focus:outline-none placeholder:text-gray-400"
                />
                <button onClick={handleSend} disabled={loading} className="w-12 h-12 bg-purple-600 text-white rounded-none flex items-center justify-center active:scale-95 disabled:opacity-50 transition-all">
                    <Send size={16} />
                </button>
            </div>
        </div>
    );
};

export default ChatBot;
