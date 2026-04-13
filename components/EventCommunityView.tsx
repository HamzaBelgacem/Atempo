import React from 'react';
import { ArrowLeft, MoreVertical, Megaphone, Users, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { Event, EventCommunity, CommunityGroup, ChatGroup } from '../types';
import { MOCK_COMMUNITIES } from '../constants';

interface EventCommunityViewProps {
  event?: Event;
  club?: ChatGroup;
  onBack: () => void;
  onOpenGroup: (group: CommunityGroup) => void;
  isOrganizer?: boolean;
}

interface GroupRowProps {
  group: CommunityGroup;
  isAnnouncement?: boolean;
  onOpenGroup: (group: CommunityGroup) => void;
}

const GroupRow: React.FC<GroupRowProps> = ({ group, isAnnouncement = false, onOpenGroup }) => (
  <button
    onClick={() => onOpenGroup(group)}
    className="w-full flex items-center px-4 py-4 hover:bg-black/5 active:bg-black/10 transition-colors border-b border-black/5 last:border-0 group"
  >
    <div className="relative flex-shrink-0">
      {isAnnouncement ? (
        <div className="w-14 h-14 rounded-[12px] bg-black flex items-center justify-center text-white group-hover:scale-105 transition-transform">
          <Megaphone size={26} />
        </div>
      ) : (
        <img
          src={group.avatarUrl}
          alt={group.name}
          className="w-14 h-14 rounded-[12px] object-cover shadow-watercolor bg-gray-100 border border-black/5 group-hover:scale-105 transition-transform"
          referrerPolicy="no-referrer"
        />
      )}
      {group.isJoined && !isAnnouncement && (
        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-teal-500 rounded-full border-2 border-white flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
        </div>
      )}
    </div>
    
    <div className="ml-4 flex-grow text-left min-w-0">
      <div className="flex justify-between items-baseline">
        <h4 className={`font-bold text-[16px] truncate tracking-tight ${isAnnouncement ? 'text-black' : 'text-gray-900'}`}>
          {group.name}
        </h4>
        {group.lastTimestamp && (
          <span className="text-[11px] font-bold text-gray-400 ml-2 flex-shrink-0 uppercase tracking-wider">
            {new Date(group.lastTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
      
      <div className="flex items-center mt-0.5">
        <p className={`text-[13px] truncate flex-grow ${group.lastMessage ? 'text-gray-500 font-medium' : 'text-gray-400 italic'}`}>
          {group.lastMessage || `${group.memberCount} members`}
        </p>
        {group.requiresRequest && !group.isJoined && (
          <span className="ml-2 px-2 py-0.5 bg-rose-50 text-rose-500 text-[9px] font-black rounded-full uppercase tracking-[0.1em] border border-rose-100">
            Request
          </span>
        )}
      </div>
    </div>
  </button>
);

const EventCommunityView: React.FC<EventCommunityViewProps> = ({
  event,
  club,
  onBack,
  onOpenGroup,
  isOrganizer = false
}) => {
  // Use mock data if available, otherwise generate a simulated community
  const contextId = event?.id || club?.id || 'unknown';
  const contextTitle = event?.title || club?.name || 'Community';
  const contextLogo = event?.hostAvatar || event?.videoThumbnail || club?.coverImage || 'https://picsum.photos/seed/community/200/200';
  const contextAttendees = event?.attendees || (club?.members?.length || 0) * 10; // Mock multiplier for clubs

  const community: EventCommunity = MOCK_COMMUNITIES[contextId] || {
    id: `sim-${contextId}`,
    eventId: contextId,
    name: contextTitle,
    logoUrl: contextLogo,
    groups: [
      {
        id: `ann-${contextId}`,
        name: 'Announcements',
        avatarUrl: contextLogo,
        lastMessage: `Welcome to the ${contextTitle} community!`,
        lastTimestamp: Date.now() - 3600000,
        memberCount: contextAttendees,
        isJoined: true,
        isAnnouncement: true
      },
      {
        id: `gen-${contextId}`,
        name: club ? `${contextTitle} Chat` : 'General Chat',
        avatarUrl: `https://picsum.photos/seed/${contextId}-gen/200/200`,
        lastMessage: club ? 'Welcome to our club chat!' : 'Anyone else excited for this?',
        lastTimestamp: Date.now() - 600000,
        memberCount: Math.floor(contextAttendees * 0.8),
        isJoined: true
      },
      {
        id: `meet-${contextId}`,
        name: club ? 'Club Meetups' : 'Meetups & Carpool',
        avatarUrl: `https://picsum.photos/seed/${contextId}-meet/200/200`,
        memberCount: Math.floor(contextAttendees * 0.3),
        isJoined: false
      },
      {
        id: `photo-${contextId}`,
        name: 'Photos & Memories',
        avatarUrl: `https://picsum.photos/seed/${contextId}-photo/200/200`,
        memberCount: Math.floor(contextAttendees * 0.5),
        isJoined: false
      }
    ]
  };

  const announcements = community.groups.find(g => g.isAnnouncement);
  const myGroups = community.groups.filter(g => g.isJoined && !g.isAnnouncement);
  const otherGroups = community.groups.filter(g => !g.isJoined);

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 bg-[#FDFCF8] z-[300] flex flex-col overflow-hidden"
    >
      {/* Watercolor Background Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-30 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-teal-100/40 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-rose-100/40 blur-[100px]" />
      </div>

      {/* Header */}
      <header className="flex items-center px-4 py-4 border-b border-black/5 bg-white/40 backdrop-blur-md sticky top-0 z-10">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-600 hover:bg-black/5 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        
        <div className="ml-2 flex items-center flex-grow min-w-0">
          <img
            src={community.logoUrl}
            alt={community.name}
            className="w-12 h-12 rounded-[12px] object-cover shadow-watercolor flex-shrink-0 border border-black/5"
            referrerPolicy="no-referrer"
          />
          <div className="ml-3 min-w-0">
            <h2 className="text-[18px] font-serif font-bold text-gray-900 truncate leading-tight flex items-center gap-1.5">
              {community.name}
              <span className="text-sm">🌱</span>
            </h2>
            <p className="text-[12px] font-bold text-gray-500/60 leading-tight uppercase tracking-widest mt-0.5">
              Community · {community.groups.length} groups
            </p>
          </div>
        </div>
        
        <button className="p-2 text-gray-600 hover:bg-black/5 rounded-full transition-colors">
          <MoreVertical size={20} />
        </button>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-32 relative z-1">
        {/* Announcements Section */}
        {announcements && (
          <div className="mt-2 mb-4">
            <div className="px-6 py-2">
              <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.25em]">
                Announcements
              </h3>
            </div>
            <div className="mx-4 rounded-[16px] overflow-hidden bg-white/40 backdrop-blur-sm border border-white/60 shadow-watercolor">
              <GroupRow group={announcements} isAnnouncement onOpenGroup={onOpenGroup} />
            </div>
          </div>
        )}

        {/* Groups you belong to */}
        {myGroups.length > 0 && (
          <div className="mb-4">
            <div className="px-6 py-2">
              <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.25em]">
                Groups you belong to
              </h3>
            </div>
            <div className="mx-4 rounded-[16px] overflow-hidden bg-white/40 backdrop-blur-sm border border-white/60 shadow-watercolor">
              {myGroups.map(group => (
                <GroupRow key={group.id} group={group} onOpenGroup={onOpenGroup} />
              ))}
            </div>
          </div>
        )}

        {/* Other groups to join */}
        {otherGroups.length > 0 && (
          <div className="mb-4">
            <div className="px-6 py-2">
              <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.25em]">
                Groups you can join
              </h3>
            </div>
            <div className="mx-4 rounded-[16px] overflow-hidden bg-white/40 backdrop-blur-sm border border-white/60 shadow-watercolor">
              {otherGroups.map(group => (
                <GroupRow key={group.id} group={group} onOpenGroup={onOpenGroup} />
              ))}
            </div>
          </div>
        )}

        {/* Recommendations Section */}
        <div className="mb-8">
          <div className="px-6 py-2">
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.25em]">
              Similar Communities
            </h3>
          </div>
          <div className="flex gap-4 overflow-x-auto px-6 pb-4 no-scrollbar">
            {[1, 2, 3].map((i) => (
              <button key={i} className="flex-shrink-0 w-32 group active:scale-95 transition-all">
                <div className="relative aspect-square rounded-[20px] overflow-hidden shadow-watercolor mb-2 border border-black/5">
                  <img 
                    src={`https://picsum.photos/seed/rec-${contextId}-${i}/200/200`} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    alt="Recommendation"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <p className="text-[12px] font-bold text-gray-800 truncate px-1">
                  {i === 1 ? 'Art Collective' : i === 2 ? 'Underground Beats' : 'Creative Hub'}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Fixed Button */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#FDFCF8] via-[#FDFCF8] to-transparent pt-12 z-20">
        <button className="w-full py-4 bg-black text-white rounded-[16px] flex items-center justify-center gap-3 hover:opacity-90 active:scale-[0.98] transition-all font-bold text-[14px] uppercase tracking-widest">
          <Plus size={20} strokeWidth={3} />
          <span>Add group</span>
        </button>
      </div>
    </motion.div>
  );
};

export default EventCommunityView;
