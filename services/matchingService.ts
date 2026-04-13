
import { User, Group, SocialEnergy } from '../types';

/**
 * Generates optimally balanced groups for an event based on personality profiles.
 * 
 * Logic:
 * 1. Hard Constraints: Age (+/- 10 years) and Language.
 * 2. Interest Affinity: Group by similar motives/interests.
 * 3. Energy Balancing: Target 1 Icebreaker, 2-3 Catalysts, 1-2 Observers.
 */
export const generateAtempoGroups = (
  eventId: string,
  usersAttending: User[],
  groupSize: number = 5
): Group[] => {
  const groups: Group[] = [];
  let unassignedUsers = [...usersAttending];

  // Helper to calculate match score between a user and a potential group
  const calculateMatchScore = (user: User, group: Group): number => {
    let score = 0;
    const profile = user.personalityProfile;
    if (!profile) return 0;

    // Hard Constraint: Language (Must match)
    const languageMismatch = group.members.some(m => m.language !== user.language);
    if (languageMismatch) return -1000;

    // Hard Constraint: Age (Tolerance +/- 10 years)
    if (user.age) {
      const ageMismatch = group.members.some(m => m.age && Math.abs(m.age - user.age!) > 10);
      if (ageMismatch) return -1000;
    }

    // Interest Affinity
    const sameMotiveCount = group.members.filter(m => m.personalityProfile?.motive === profile.motive).length;
    score += sameMotiveCount * 20;

    const sameInterestCount = group.members.filter(m => m.personalityProfile?.interest === profile.interest).length;
    score += sameInterestCount * 15;

    // Energy Balancing (The Secret Sauce)
    const energyCounts = group.members.reduce((acc, m) => {
      const energy = m.personalityProfile?.energy;
      if (energy) acc[energy] = (acc[energy] || 0) + 1;
      return acc;
    }, {} as Record<SocialEnergy, number>);

    const currentEnergy = profile.energy;
    
    if (currentEnergy === 'The Icebreaker') {
      if (!energyCounts['The Icebreaker']) score += 40; // Highly needed
      else score -= 50; // Penalty for too many leaders
    } else if (currentEnergy === 'The Catalyst') {
      if ((energyCounts['The Catalyst'] || 0) < 3) score += 30;
      else score += 10;
    } else if (currentEnergy === 'The Observer') {
      if ((energyCounts['The Observer'] || 0) < 2) score += 30;
      else score -= 20; // Penalty for too many quiet listeners
    }

    return score;
  };

  // Simple greedy algorithm for grouping
  while (unassignedUsers.length > 0) {
    // Start a new group
    const seedUser = unassignedUsers.shift()!;
    const currentGroup: Group = {
      id: `group_${eventId}_${groups.length}`,
      eventId,
      members: [seedUser]
    };

    // Fill the group
    while (currentGroup.members.length < groupSize && unassignedUsers.length > 0) {
      let bestUserIndex = -1;
      let bestScore = -Infinity;

      for (let i = 0; i < unassignedUsers.length; i++) {
        const score = calculateMatchScore(unassignedUsers[i], currentGroup);
        if (score > bestScore) {
          bestScore = score;
          bestUserIndex = i;
        }
      }

      if (bestUserIndex !== -1 && bestScore > -500) {
        currentGroup.members.push(unassignedUsers.splice(bestUserIndex, 1)[0]);
      } else {
        // No good match found for this group, break and start next
        break;
      }
    }

    groups.push(currentGroup);
  }

  return groups;
};
