import React from 'react';
import { Notification } from '../types';
import { Bell, MessageCircle, Calendar, X } from 'lucide-react';

interface NotificationToastProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ notifications, onDismiss }) => {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 left-0 right-0 z-[60] flex flex-col items-center pointer-events-none space-y-2 px-4">
      {notifications.map((notif) => (
        <div 
          key={notif.id}
          className="bg-white/90 backdrop-blur-md border border-slate-200 text-slate-900 p-4 rounded-2xl shadow-lg flex items-start gap-3 max-w-sm w-full pointer-events-auto animate-[slideInTop_0.3s_ease-out]"
        >
          <div className={`p-2 rounded-full flex-shrink-0 ${
            notif.type === 'EVENT' ? 'bg-primary/10 text-primary' :
            notif.type === 'MESSAGE' ? 'bg-green-500/10 text-green-500' :
            'bg-orange-500/10 text-orange-500'
          }`}>
            {notif.type === 'EVENT' && <Bell size={18} />}
            {notif.type === 'MESSAGE' && <MessageCircle size={18} />}
            {notif.type === 'REMINDER' && <Calendar size={18} />}
          </div>
          
          <div className="flex-1">
            <h4 className="font-bold text-sm text-slate-900">{notif.title}</h4>
            <p className="text-xs text-slate-500 mt-1">{notif.message}</p>
          </div>

          <button 
            onClick={() => onDismiss(notif.id)}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationToast;