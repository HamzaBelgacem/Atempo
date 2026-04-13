import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LogIn } from 'lucide-react';

type Props = {
  onClose: () => void;
  onLogin: (email: string, password: string) => void;
  isDark?: boolean;
};

const LoginModal: React.FC<Props> = ({ onClose, onLogin, isDark = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="fixed inset-0 z-[700] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md">
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className={`${
          isDark ? 'bg-slate-900 border border-white/10' : 'bg-white'
        } w-full max-w-xs rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center gap-6`}
      >
        
        {/* Icon */}
        <div
          className={`w-16 h-16 rounded-2xl ${
            isDark ? 'bg-red-500/20 text-green-400' : 'bg-red-50 text-green-500'
          } flex items-center justify-center shadow-inner`}
        >
          <LogIn size={32} />
        </div>

        {/* Title */}
        <h3 className={`text-xl font-serif font-bold ${isDark ? 'text-white' : 'text-black'}`}>
          Login
        </h3>

        {/* Inputs */}
        <div className="w-full flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-xl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-xl"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="w-full flex flex-col gap-3">
          
          <button
            onClick={() => onLogin(email, password)}
            className="w-full py-4 bg-red-500 text-white rounded-xl font-black text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-red-500/20 active:scale-95 transition-all"
          >
            Yes, Log In
          </button>

          <button
            onClick={onClose}
            className={`w-full py-4 ${
              isDark ? 'bg-white/5 text-white/60' : 'bg-gray-100 text-gray-500'
            } rounded-xl font-black text-[11px] uppercase tracking-[0.2em] active:scale-95 transition-all`}
          >
            Cancel
          </button>

        </div>

      </motion.div>
    </div>
  );
};

export default LoginModal;