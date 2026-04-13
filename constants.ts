import { Business, Event, MemoryItem, ChatGroup, EventCommunity, PersonalityArchetype, SocialEnergy } from './types';

// Illustrated avatar seeds for the requested style (Notionist)
export const ILLUSTRATED_AVATARS = [
    "Jude", "Kaden", "Amaya", "Finn", "Aria", "Leo", "Mya", "Noel", 
    "Sasha", "Zane", "Rhea", "Kai", "Eden", "Rumi", "Nico", "Lula",
    "Remy", "Cleo", "Dax", "Veda", "Koa", "Skye", "Arlo", "Zora"
].map(seed => `https://api.dicebear.com/7.x/notionists/svg?seed=${seed}&backgroundColor=fdf2f2,f0fdf4,f0f9ff,f5f3ff,fff7ed`);

export const TRANSLATIONS: Record<string, any> = {
  en: {
    nav: { map: 'Map', discovery: 'Discovery', memories: 'Connect', net: 'Net', id: 'ID', chats: 'Chats' },
    chats: {
      title: 'Conversations',
      emptyTitle: 'Silent Horizon',
      emptySub: 'Join an event or club to start chatting with people sharing your vibe.',
      tabs: {
        events: 'Events',
        friends: 'Friends',
        business: 'B2B',
        clubs: 'Clubs'
      }
    }
  },
  es: {
    nav: { map: 'Mapa', discovery: 'Descubrir', memories: 'Conectar', net: 'Red', id: 'ID', chats: 'Chats' },
    chats: {
      title: 'Conversations',
      emptyTitle: 'Silent Horizon',
      emptySub: 'Join an event or club to start chatting with people sharing your vibe.',
      tabs: {
        events: 'Events',
        friends: 'Friends',
        business: 'B2B',
        clubs: 'Clubs'
      }
    }
  }
};

export const QUIZ_QUESTIONS = [
  {
    id: 'motive',
    question: "What are you primarily looking for in an experience?",
    options: [
      { label: "Meet new people", icon: "👋", value: "Meet new people" },
      { label: "Learn something new", icon: "🎓", value: "Learn something new" },
      { label: "Seek inspiration", icon: "✨", value: "Seek inspiration" },
      { label: "Casual hangs", icon: "☕", value: "Casual hangs" },
      { label: "Professional networking", icon: "💼", value: "Professional networking" },
      { label: "A bit of everything", icon: "🌈", value: "A bit of everything" }
    ]
  },
  {
    id: 'energy',
    question: "In a group setting, what role do you naturally fall into?",
    options: [
      { label: "The Icebreaker", icon: "🧊", value: "The Icebreaker", sub: "I lead and talk a lot" },
      { label: "The Catalyst", icon: "⚡", value: "The Catalyst", sub: "I join the flow and add energy" },
      { label: "The Observer", icon: "🔭", value: "The Observer", sub: "I listen, absorb, and thoughtfully contribute" }
    ]
  },
  {
    id: 'interest',
    question: "Which topics light you up the most?",
    options: [
      { label: "Deep personal debates", icon: "🧠", value: "Deep personal debates" },
      { label: "Sharing personal stories", icon: "📖", value: "Sharing personal stories" },
      { label: "Work/Professional projects", icon: "🚀", value: "Work/Professional projects" },
      { label: "Creative ideas", icon: "💡", value: "Creative ideas" },
      { label: "Future trends", icon: "🔮", value: "Future trends" },
      { label: "Casual chat", icon: "💬", value: "Casual chat" }
    ]
  },
  {
    id: 'atmosphere',
    question: "What's your ideal social atmosphere?",
    options: [
      { label: "Fast-paced & energetic", icon: "🔥", value: "Fast-paced & energetic" },
      { label: "Relaxed & mellow", icon: "🍃", value: "Relaxed & mellow" },
      { label: "Deep & intimate", icon: "🕯️", value: "Deep & intimate" },
      { label: "Structured & goal-oriented", icon: "🎯", value: "Structured & goal-oriented" }
    ]
  }
];

export const ARCHETYPES_DATA: Record<PersonalityArchetype, { description: string, illustration: string }> = {
  [PersonalityArchetype.CONNECTOR]: {
    description: "The life of the party who weaves everyone together.",
    illustration: "https://api.dicebear.com/7.x/notionists/svg?seed=Jude&backgroundColor=fdf2f2"
  },
  [PersonalityArchetype.VISIONARY]: {
    description: "Always brainstorming and looking for the next big concept.",
    illustration: "https://api.dicebear.com/7.x/notionists/svg?seed=Aria&backgroundColor=f0f9ff"
  },
  [PersonalityArchetype.STORYTELLER]: {
    description: "Captivates the group with relatable and funny anecdotes.",
    illustration: "https://api.dicebear.com/7.x/notionists/svg?seed=Finn&backgroundColor=fff7ed"
  },
  [PersonalityArchetype.PHILOSOPHER]: {
    description: "Loves digging into the 'why' and engaging in intimate, deep discussions.",
    illustration: "https://api.dicebear.com/7.x/notionists/svg?seed=Rumi&backgroundColor=f5f3ff"
  },
  [PersonalityArchetype.EXPLORER]: {
    description: "Open-minded, curious, and loves jumping into new subjects.",
    illustration: "https://api.dicebear.com/7.x/notionists/svg?seed=Kai&backgroundColor=f0fdf4"
  },
  [PersonalityArchetype.STRATEGIST]: {
    description: "Goal-oriented, looking to build meaningful professional bridges.",
    illustration: "https://api.dicebear.com/7.x/notionists/svg?seed=Zane&backgroundColor=f0f9ff"
  },
  [PersonalityArchetype.MASTERMIND]: {
    description: "Absorbs information like a sponge, great at giving targeted, quiet advice.",
    illustration: "https://api.dicebear.com/7.x/notionists/svg?seed=Nico&backgroundColor=f5f3ff"
  },
  [PersonalityArchetype.INNOVATOR]: {
    description: "High-energy forward-thinker who wants to build the future.",
    illustration: "https://api.dicebear.com/7.x/notionists/svg?seed=Skye&backgroundColor=fdf2f2"
  },
  [PersonalityArchetype.SPARK]: {
    description: "Brings a sudden burst of energy and gets the group laughing and imagining.",
    illustration: "https://api.dicebear.com/7.x/notionists/svg?seed=Leo&backgroundColor=fff7ed"
  },
  [PersonalityArchetype.EMPATH]: {
    description: "The ultimate listener; makes everyone in the group feel heard and safe.",
    illustration: "https://api.dicebear.com/7.x/notionists/svg?seed=Amaya&backgroundColor=fdf2f2"
  },
  [PersonalityArchetype.CHILL_WAVE]: {
    description: "Low-stress, easy-going, just happy to be here and go with the flow.",
    illustration: "https://api.dicebear.com/7.x/notionists/svg?seed=Eden&backgroundColor=f0fdf4"
  },
  [PersonalityArchetype.GUIDE]: {
    description: "The glue that takes someone else's idea and elevates it.",
    illustration: "https://api.dicebear.com/7.x/notionists/svg?seed=Cleo&backgroundColor=f5f3ff"
  }
};

export const getArchetypeFromAnswers = (answers: Record<string, string>): PersonalityArchetype => {
  const { motive, energy, interest } = answers;

  if (motive === "Meet new people" && interest === "Casual chat") return PersonalityArchetype.CONNECTOR;
  if (motive === "Seek inspiration" && interest === "Creative ideas") return PersonalityArchetype.VISIONARY;
  if (motive === "Meet new people" && interest === "Sharing personal stories") return PersonalityArchetype.STORYTELLER;
  if (motive === "Learn something new" && interest === "Deep personal debates") return PersonalityArchetype.PHILOSOPHER;
  if (motive === "A bit of everything") return PersonalityArchetype.EXPLORER;
  if (motive === "Professional networking" && energy !== "The Observer") return PersonalityArchetype.STRATEGIST;
  if (motive === "Learn something new" && energy === "The Observer") return PersonalityArchetype.MASTERMIND;
  if (motive === "Seek inspiration" && interest === "Future trends") return PersonalityArchetype.INNOVATOR;
  if (motive === "Meet new people" && interest === "Creative ideas") return PersonalityArchetype.SPARK;
  if (motive === "Casual hangs" && energy === "The Observer") return PersonalityArchetype.EMPATH;
  if (motive === "Casual hangs" && interest === "Casual chat") return PersonalityArchetype.CHILL_WAVE;
  
  return PersonalityArchetype.GUIDE;
};
export const TAG_GROUPS: Record<string, string[]> = {
  'art': ['Exhibitions', 'Street Art', 'Installations', 'Art', 'Art & craft', 'visual arts 🎨', 'digital art 🖼️', 'generative art 🌀', 'AI in Art 🤖', 'Photography 📸', 'Gallery', 'Studio', 'Art & Illustration'],
  'music': ['Live Music', 'Music', 'performance 🎭', 'Theatre', 'Dance', 'Comedy', 'Performance', 'Nightlife 🌃', 'Festivals 🎡', 'Club', 'Jazz'],
  'cinema': ['Screenings', 'Indie', 'Q&A', 'media 🎥', 'Film & TV', 'Cinema 🎬'],
  'literature': ['Books', 'Poetry', 'Cultural Talks', 'literature 📚', 'Fiction', 'Philosophy'],
  'fashion': ['Fashion shows', 'Design showcases', 'fashion 👗', 'Sustainable Design 🌱', 'Architecture 🏗️', 'Design markets'],
  'food': ['Food culture experiences', 'food 🍽️', 'Gastronomy 🍷', 'Cafe', 'Food & Drink'],
  'heritage': ['Local traditions', 'Cultural routes', 'heritage 🏛️', 'Folklore 🏮', 'Museums 🏛️', 'History'],
  'learning': ['Creative tech workshops', 'learning 🎓', 'Education', 'Science', 'Creative tech workshops'],
  'business': ['Design markets', 'Business', 'Finance', 'Agency', 'Collective', 'Startup', 'Markets 🛍️'],
  'politics': ['U.S. Politics', 'World Politics', 'Health Politics', 'News', 'International'],
  'wellness': ['Wellness 🧘', 'Health & Wellness', 'Health & Politics', 'Parenting']
};

export const DISCIPLINES = [
  'Live Music', 'Theatre', 'Dance', 'Comedy', 'Performance',
  'Exhibitions', 'Street Art', 'Installations',
  'Screenings', 'Indie', 'Q&A',
  'Books', 'Poetry', 'Cultural Talks',
  'Fashion shows', 'Design showcases',
  'Food culture experiences',
  'Local traditions', 'Cultural routes',
  'Art', 'Music', 'Creative tech workshops',
  'Art & craft', 'Design markets',
  'Culture', 'Technology', 'Business', 'U.S. Politics', 'Finance', 'Food & Drink', 
  'Sports', 'Art & Illustration', 'World Politics', 'Health Politics', 'News', 
  'Fashion & Beauty', 'Faith & Spirituality', 'Climate & Environment', 
  'Science', 'Literature', 'Fiction', 'Health & Wellness', 'Travel', 
  'Parenting', 'Philosophy', 'Comics', 'International', 'Crypto', 'History', 
  'Humor', 'Education', 'Film & TV',
  'Software Dev 💻', 'Web3 🌐', 'Cybersecurity 🛡️',
  'Museums 🏛️', 'Sculpture 🗿', 'Opera 🎭', 'Ballet 🩰', 'Folklore 🏮', 'Cinema 🎬', 'Crafts 🧶',
  'visual arts 🎨', 'performance 🎭', 'food 🍽️', 'media 🎥', 'literature 📚', 
  'fashion 👗', 'heritage 🏛️', 'learning 🎓', 'markets 🛍️',
  'creative coding 💻', 'digital art 🖼️', 'generative art 🌀',
  'AI in Art 🤖', 'VR/AR Experiences 👓', 'Sustainable Design 🌱',
  'Wellness 🧘', 'Local Craftsmanship 🔨', 'Photography 📸', 'Architecture 🏗️',
  'Gastronomy 🍷', 'Nightlife 🌃', 'Festivals 🎡'
];

export const MOCK_BUSINESSES: Business[] = [
  {
    id: 'b1',
    name: 'Lumina Center',
    logo: 'https://picsum.photos/seed/lumina/200/200',
    coverImage: 'https://picsum.photos/seed/lumina-cover/800/600',
    description: 'Immersive art space and digital technology.',
    location: 'Ruzafa, Valencia',
    followers: 1240,
    rating: 4.8,
    verified: true,
    activeEventsCount: 2
  },
  {
    id: 'b2',
    name: 'The Jazz Lab',
    logo: 'https://picsum.photos/seed/jazz/200/200',
    coverImage: 'https://picsum.photos/seed/jazz-cover/800/600',
    description: 'Jazz clubs with daily jam sessions.',
    location: 'El Carmen, Valencia',
    followers: 850,
    rating: 4.9,
    verified: true,
    activeEventsCount: 2
  },
  {
    id: 'b3',
    name: 'Skyline Terrace',
    logo: 'https://picsum.photos/seed/skyline/200/200',
    coverImage: 'https://picsum.photos/seed/skyline-cover/800/600',
    description: 'The best terrace with views of Valencia.',
    location: 'Ruzafa, Valencia',
    followers: 2100,
    rating: 4.7,
    verified: true,
    activeEventsCount: 2
  },
  {
    id: 'b4',
    name: 'Urban Canvas',
    logo: 'https://picsum.photos/seed/canvas/200/200',
    coverImage: 'https://picsum.photos/seed/canvas-cover/800/600',
    description: 'Urban art gallery and cultural tours.',
    location: 'El Carmen, Valencia',
    followers: 1560,
    rating: 4.6,
    verified: true,
    activeEventsCount: 2
  },
  {
    id: 'b5',
    name: 'Padel Pro Academy',
    logo: 'https://picsum.photos/seed/padel/200/200',
    coverImage: 'https://picsum.photos/seed/padel-cover/800/600',
    description: 'Sports center specialized in padel.',
    location: 'Valencia',
    followers: 980,
    rating: 4.8,
    verified: true,
    activeEventsCount: 1
  },
  {
    id: 'b6',
    name: 'Tech & Coffee',
    logo: 'https://picsum.photos/seed/tech/200/200',
    coverImage: 'https://picsum.photos/seed/tech-cover/800/600',
    description: 'Coworking space and tech networking.',
    location: 'Valencia',
    followers: 3200,
    rating: 4.9,
    verified: true,
    activeEventsCount: 1
  }
];

export const MOCK_EVENTS: Event[] = [
  {
    id: 'e19',
    title: 'Jazz Jam Session',
    category: 'Performance',
    description: 'Join us for our legendary daily jam session at The Jazz Lab. Tonight, we feature a special guest trio from Berlin followed by an open stage for local musicians. Whether you\'re a seasoned pro or a jazz enthusiast, the atmosphere is electric and the music is pure soul. Grab a cocktail and immerse yourself in the deep grooves of El Carmen\'s finest jazz scene.',
    videoThumbnail: 'https://picsum.photos/seed/jazz-jam/400/300',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    date: '2026-03-31',
    time: '21:00-00:00',
    status: 'active',
    attendees: 18,
    maxCapacity: 40,
    lat: 39.4765,
    lng: -0.3790,
    hostId: 'b2',
    hostName: 'The Jazz Lab',
    hostAvatar: 'https://picsum.photos/seed/jazz/200/200',
    price: 0.00,
    address: 'Calle de Quart, 15, 46001 Valencia, Spain',
    tags: ['Performance', 'Jazz', 'Live Music', 'Valencia', 'Medium', 'Local', 'Jazz Trio', 'Millennials'],
    publishedAt: '2026-03-25T10:00:00Z'
  },
  {
    id: 'e20',
    title: 'Sunset Rooftop Party',
    category: 'Performance',
    description: 'The ultimate golden hour experience. Skyline Terrace presents a special Thursday sunset session with deep house beats and panoramic views of Ruzafa. Experience the magic of Valencia as the sun dips below the horizon. Our mixologists have prepared a special sunset menu for tonight only. Limited capacity for an exclusive vibe.',
    videoThumbnail: 'https://picsum.photos/seed/rooftop-party/400/300',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    date: '2026-03-31',
    time: '18:30-22:00',
    status: 'active',
    attendees: 35,
    maxCapacity: 60,
    lat: 39.4620,
    lng: -0.3740,
    hostId: 'b3',
    hostName: 'Skyline Terrace',
    hostAvatar: 'https://picsum.photos/seed/skyline/200/200',
    price: 0.00,
    address: 'Calle de Cádiz, 45, 46006 Valencia, Spain',
    tags: ['Performance', 'Rooftop', 'Party', 'Valencia', 'Sunset', 'Large', 'Corporate', 'Live DJ', 'Gen Z'],
    publishedAt: '2026-03-26T12:00:00Z'
  },
  {
    id: 'e21',
    title: 'Street Art Workshop',
    category: 'Visual Arts',
    description: 'Ever wanted to try your hand at stencil art? Join Urban Canvas for a hands-on workshop in the heart of El Carmen. We provide all materials, including spray paints and protective gear. Learn the basics of composition and technique from a local street artist. You\'ll leave with your own custom canvas piece. No previous experience required!',
    videoThumbnail: 'https://picsum.photos/seed/art-workshop/400/300',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    date: '2026-03-31',
    time: '17:00-19:30',
    status: 'active',
    attendees: 8,
    maxCapacity: 12,
    lat: 39.4780,
    lng: -0.3810,
    hostId: 'b4',
    hostName: 'Urban Canvas',
    hostAvatar: 'https://picsum.photos/seed/canvas/200/200',
    price: 0.00,
    address: 'Calle de la Corona, 8, 46003 Valencia, Spain',
    tags: ['Visual Arts', 'Workshop', 'Street Art', 'Valencia', 'Creative', 'Small', 'Freelance', 'Painter', 'Families'],
    publishedAt: '2026-03-24T09:00:00Z'
  },
  {
    id: 'e1',
    title: 'Techno Yoga Session',
    category: 'Performance',
    description: 'An in-person meeting to pause for a moment, listen to a true business story, and meet people with whom it makes sense to really talk. If you\'re in Rome, this is the right evening for you. An in-person meeting to pause for a moment, listen to a true business story, and meet people with whom it makes sense to really talk. An open conversation, an aperitivo, and the right time to get to know each other. We would be pleased to have Matteo Aliotta, Head of Growth at LTV, with us. He will share his entrepreneurial journey live: where he started, what didn\'t work, and the choices that really made a difference. Why should you participate? It\'s an evening to meet people who are working on an idea or a startup and want to discuss things without haste. Founders, aspiring founders, alumni, and people who gravitate around the startup ecosystem.',
    videoThumbnail: 'https://picsum.photos/seed/yoga/400/300',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    date: '2026-03-31',
    time: '19:00-21:00',
    status: 'active',
    attendees: 12,
    maxCapacity: 20,
    lat: 39.4699,
    lng: -0.3763,
    hostId: 'b1',
    hostName: 'Lumina Center',
    hostAvatar: 'https://picsum.photos/seed/lumina/200/200',
    price: 15.00,
    address: 'Calle de la Paz, 12, 46003 Valencia, Spain',
    tags: ['Performance', 'Yoga', 'Techno', 'Mindfulness', 'Valencia', 'Boutique', 'Creative Studio', 'Live DJ', 'Professionals'],
    publishedAt: '2026-03-27T15:00:00Z'
  },
  {
    id: 'e2',
    title: 'Secret Vinyl Night',
    category: 'Performance',
    description: 'Discover the hidden gems of the local music scene in this exclusive vinyl-only event. Hosted in a secret penthouse overlooking the historic center, this night is dedicated to the warmth of analog sound. Bring your favorite record and share the story behind it with a community of passionate audiophiles. We\'ll have a curated selection of local wines and artisanal snacks to accompany the deep grooves. The evening starts with a guided listening session followed by an open deck where anyone can spin their tracks. It\'s more than just a party; it\'s a celebration of musical heritage and a chance to connect with fellow collectors in an intimate, high-fidelity environment. Limited spots available to ensure a cozy atmosphere.',
    videoThumbnail: 'https://picsum.photos/seed/vinyl/400/300',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    date: '2026-04-01',
    time: '21:30-00:30',
    status: 'upcoming',
    attendees: 8,
    maxCapacity: 15,
    lat: 39.4750,
    lng: -0.3750,
    hostId: 'b2',
    hostName: 'The Jazz Lab',
    hostAvatar: 'https://picsum.photos/seed/jazz/200/200',
    price: 0.00,
    address: 'Plaza de la Reina, 5, 46001 Valencia, Spain',
    tags: ['Performance', 'Vinyl', 'Exclusive', 'Small', 'Local', 'Jazz Trio', 'Millennials'],
    publishedAt: '2026-03-28T10:00:00Z'
  },
  {
    id: 'e3',
    title: 'Rooftop Sunset Party',
    category: 'Performance',
    description: 'Experience the magic of the Mediterranean sunset from the most exclusive rooftop in Ruzafa. As the golden hour paints the city, our resident DJs will set the mood with a blend of deep house and organic beats. This is the ultimate gathering for those who appreciate fine cocktails, breathtaking views, and a sophisticated social atmosphere. Meet the trendsetters and creative minds of Valencia in a space designed for connection and celebration. Your ticket includes a welcome drink and access to our gourmet tapas bar. Whether you\'re looking to network or simply dance the night away, the Skyline Terrace offers the perfect backdrop for an unforgettable evening. Dress code: Summer Chic.',
    videoThumbnail: 'https://picsum.photos/seed/sunset/400/300',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    date: '2026-04-02',
    time: '18:30-22:30',
    status: 'active',
    attendees: 45,
    maxCapacity: 60,
    lat: 39.4610,
    lng: -0.3750,
    hostId: 'b3',
    hostName: 'Skyline Terrace',
    hostAvatar: 'https://picsum.photos/seed/skyline/200/200',
    price: 0.00,
    address: 'Gran Via de les Germanies, 24, 46006 Valencia, Spain',
    tags: ['Performance', 'Rooftop', 'Sunset', 'Party', 'Ruzafa', 'Large', 'Corporate', 'Live DJ', 'Gen Z'],
    publishedAt: '2026-03-29T18:00:00Z'
  },
  {
    id: 'e4',
    title: 'Urban Art Tour',
    category: 'Visual Arts',
    description: 'Dive into the vibrant soul of El Carmen with our expert-led urban art exploration. This isn\'t just a walk; it\'s a deep dive into the stories, techniques, and social messages behind Valencia\'s most iconic murals. We\'ll visit hidden alleys and grand plazas, discovering works by world-renowned street artists and local legends. Learn about the evolution of the city\'s graffiti culture and how it has shaped the neighborhood\'s identity. The tour concludes at a local artist\'s studio where you can see the creative process firsthand and engage in a Q&A session. Perfect for art lovers, photographers, and anyone curious about the intersection of public space and creative expression. Comfortable shoes are highly recommended.',
    videoThumbnail: 'https://picsum.photos/seed/art/400/300',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    date: '2026-04-03',
    time: '11:00-13:30',
    status: 'upcoming',
    attendees: 5,
    maxCapacity: 12,
    lat: 39.4760,
    lng: -0.3780,
    hostId: 'b4',
    hostName: 'Urban Canvas',
    hostAvatar: 'https://picsum.photos/seed/canvas/200/200',
    price: 0.00,
    address: 'Calle de Quart, 35, 46001 Valencia, Spain',
    tags: ['Visual Arts', 'StreetArt', 'Culture', 'Tour', 'Small', 'Freelance', 'Painter', 'Families'],
    publishedAt: '2026-03-30T08:00:00Z'
  },
  {
    id: 'e5',
    title: 'Padel Tournament',
    category: 'Performance',
    description: 'Join our high-energy intermediate padel tournament at the premier Padel Pro Academy. This event is designed for players who want to test their skills in a competitive yet friendly environment. The format is a fast-paced round-robin followed by a knockout stage, ensuring plenty of play time for everyone. Meet other padel enthusiasts, improve your game, and compete for exciting prizes from our local sponsors. We provide professional-grade balls and have rackets available for rent. After the matches, join us for a social mixer at the academy lounge with refreshing drinks and healthy snacks. It\'s the perfect opportunity to find new playing partners and become part of Valencia\'s growing padel community.',
    videoThumbnail: 'https://picsum.photos/seed/padel-event/400/300',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    date: '2026-03-31',
    time: '10:00-14:00',
    status: 'active',
    attendees: 16,
    maxCapacity: 16,
    lat: 39.4740,
    lng: -0.3580,
    hostId: 'b5',
    hostName: 'Padel Pro Academy',
    hostAvatar: 'https://picsum.photos/seed/padel/200/200',
    price: 0.00,
    address: 'Avenida de las Baleares, 15, 46023 Valencia, Spain',
    tags: ['Performance', 'Padel', 'Tournament', 'Fitness', 'Medium', 'Corporate', 'Performance Art', 'Professionals'],
    publishedAt: '2026-03-29T10:00:00Z'
  },
  {
    id: 'e6',
    title: 'Tech Networking Brunch',
    category: 'Media',
    description: 'Fuel your network and your body at our monthly Tech & Coffee brunch. This event brings together the brightest minds in Valencia\'s tech ecosystem—from startup founders and senior developers to investors and digital nomads. Enjoy a curated healthy brunch menu while engaging in meaningful conversations about the latest trends in AI, web3, and sustainable tech. We feature a short "lightning talk" from a local success story to spark discussion. Whether you\'re looking for a co-founder, a new career opportunity, or simply want to stay connected with the local scene, this brunch is the place to be. Held in our modern coworking space, it\'s the perfect environment for professional growth and community building.',
    videoThumbnail: 'https://picsum.photos/seed/tech-event/400/300',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackAds.mp4',
    date: '2026-03-31',
    time: '12:30-15:00',
    status: 'active',
    attendees: 22,
    maxCapacity: 30,
    lat: 39.4730,
    lng: -0.3760,
    hostId: 'b6',
    hostName: 'Tech & Coffee',
    hostAvatar: 'https://picsum.photos/seed/tech/200/200',
    price: 0.00,
    address: 'Calle de Colon, 1, 46004 Valencia, Spain',
    tags: ['Media', 'Networking', 'Brunch', 'Startup', 'Massive', 'Creative Studio', 'Performance Art', 'Professionals'],
    publishedAt: '2026-03-30T10:00:00Z'
  },
  {
    id: 'e7',
    title: 'Wine Tasting Experience',
    category: 'Food',
    description: 'Embark on a sensory journey through the rich vineyards of the Valencian region. Our expert sommelier will guide you through a selection of five exceptional local wines, explaining the unique terroir and traditional winemaking techniques that define them. Each wine is carefully paired with artisanal cheeses and cured meats from local producers, creating a perfect harmony of flavors. Learn how to identify different notes, understand aging processes, and discover the stories behind each bottle. This intimate experience is held in our beautifully restored cellar, providing an authentic and educational atmosphere. Whether you\'re a wine connoisseur or a curious beginner, you\'ll leave with a deeper appreciation for the local viticulture.',
    videoThumbnail: 'https://picsum.photos/seed/wine/400/300',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
    date: '2026-04-02',
    time: '20:00-22:00',
    status: 'active',
    attendees: 10,
    maxCapacity: 15,
    lat: 39.4660,
    lng: -0.3680,
    hostId: 'b1',
    hostName: 'Lumina Center',
    hostAvatar: 'https://picsum.photos/seed/lumina/200/200',
    price: 0.00,
    address: 'Calle de Jorge Juan, 19, 46004 Valencia, Spain',
    tags: ['Food', 'Wine', 'Tasting', 'Gourmet', 'Valencia', 'Small', 'Local', 'Sommelier', 'Professionals'],
    publishedAt: '2026-03-20T14:00:00Z'
  },
  {
    id: 'e8',
    title: 'Rooftop Jazz Night',
    category: 'Performance',
    description: 'Let the smooth sounds of live jazz transport you as you take in the panoramic views of Valencia under the stars. Our Rooftop Jazz Night features a rotating lineup of the city\'s finest musicians, from classic quartets to experimental fusion groups. The atmosphere is sophisticated yet relaxed, perfect for a romantic date or a night out with friends who appreciate high-quality live performance. Our mixologists have created a special menu of jazz-inspired cocktails to complement the music. As the night progresses, the session often turns into an impromptu jam, offering a unique and dynamic experience every time. Join us at The Jazz Lab\'s rooftop for an evening of musical excellence and urban elegance.',
    videoThumbnail: 'https://picsum.photos/seed/jazz-night/400/300',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    date: '2026-04-03',
    time: '21:00-23:30',
    status: 'active',
    attendees: 30,
    maxCapacity: 40,
    lat: 39.4765,
    lng: -0.3740,
    hostId: 'b2',
    hostName: 'The Jazz Lab',
    hostAvatar: 'https://picsum.photos/seed/jazz/200/200',
    price: 0.00,
    address: 'Calle de la Paz, 2, 46003 Valencia, Spain',
    tags: ['Performance', 'Jazz', 'Rooftop', 'Live', 'Medium', 'Local', 'Jazz Trio', 'Millennials'],
    publishedAt: '2026-03-21T16:00:00Z'
  },
  {
    id: 'e9',
    title: 'Sunset Yoga Flow',
    category: 'Performance',
    description: 'Find your inner peace as the day transitions into night with our Sunset Yoga Flow. Held in a beautiful park setting with views of the city skyline, this session is designed to help you decompress and reconnect with your body. Our experienced instructor will lead you through a series of fluid movements and deep stretches, synchronized with the natural rhythm of the setting sun. The class is suitable for all levels, with modifications provided for beginners and challenges for more advanced practitioners. Bring your own mat and a light sweater for the final relaxation. It\'s a wonderful way to experience urban nature and end your day with a sense of calm and clarity. Join our community of mindful movers.',
    videoThumbnail: 'https://picsum.photos/seed/yoga-sunset/400/300',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    date: '2026-04-04',
    time: '19:30-20:45',
    status: 'upcoming',
    attendees: 15,
    maxCapacity: 25,
    lat: 39.4680,
    lng: -0.3650,
    hostId: 'b1',
    hostName: 'Lumina Center',
    hostAvatar: 'https://picsum.photos/seed/lumina/200/200',
    price: 0.00,
    address: 'Jardines del Real, 46010 Valencia, Spain',
    tags: ['Performance', 'Yoga', 'Sunset', 'Wellness', 'Nature', 'Small', 'Creative Studio', 'Live DJ', 'Families'],
    publishedAt: '2026-03-22T18:00:00Z'
  },
  {
    id: 'e10',
    title: 'Night Food Market',
    category: 'Markets',
    description: 'Explore a world of flavors at our vibrant Night Food Market. We\'ve gathered the best local street food vendors and gourmet producers in one place for a celebration of culinary diversity. From authentic Valencian paella and artisanal tacos to creative vegan dishes and decadent desserts, there\'s something for every palate. The market is alive with music, communal seating, and a festive atmosphere that captures the essence of Mediterranean nightlife. Discover new favorite dishes, meet the passionate people behind the food, and enjoy a night of social dining. We also feature a selection of local craft beers and organic wines. It\'s the perfect destination for foodies and anyone looking for a lively and delicious evening out.',
    videoThumbnail: 'https://picsum.photos/seed/food-market/400/300',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    date: '2026-03-31',
    time: '20:30-00:00',
    status: 'active',
    attendees: 80,
    maxCapacity: 100,
    lat: 39.4590,
    lng: -0.3720,
    hostId: 'b2',
    hostName: 'The Jazz Lab',
    hostAvatar: 'https://picsum.photos/seed/jazz/200/200',
    price: 0.00,
    address: 'Mercado de Tapineria, 46001 Valencia, Spain',
    tags: ['Markets', 'Market', 'StreetFood', 'Food', 'Massive', 'Local', 'Live DJ', 'Gen Z'],
    publishedAt: '2026-03-23T20:00:00Z'
  },
  {
    id: 'e11',
    title: 'Colosseum Sunset Yoga',
    category: 'Performance',
    description: 'An in-person meeting to pause for a moment, listen to a true business story, and meet people with whom it makes sense to really talk. If you\'re in Rome, this is the right evening for you. An in-person meeting to pause for a moment, listen to a true business story, and meet people with whom it makes sense to really talk. An open conversation, an aperitivo, and the right time to get to know each other. We would be pleased to have Matteo Aliotta, Head of Growth at LTV, with us. He will share his entrepreneurial journey live: where he started, what didn\'t work, and the choices that really made a difference. Why should you participate? It\'s an evening to meet people who are working on an idea or a startup and want to discuss things without haste. Founders, aspiring founders, alumni, and people who gravitate around the startup ecosystem.',
    videoThumbnail: 'https://picsum.photos/seed/rome-yoga/400/300',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    date: '2026-03-31',
    time: '19:30-21:00',
    status: 'active',
    attendees: 25,
    maxCapacity: 40,
    lat: 41.8902,
    lng: 12.4922,
    hostId: 'b1',
    hostName: 'Lumina Center',
    hostAvatar: 'https://picsum.photos/seed/lumina/200/200',
    price: 0.00,
    address: 'Piazza del Colosseo, 1, 00184 Roma RM, Italy',
    tags: ['Performance', 'Yoga', 'History', 'Rome', 'Sunset', 'Medium', 'Creative Studio', 'Live DJ', 'Professionals'],
    publishedAt: '2026-03-24T10:00:00Z'
  },
  {
    id: 'e12',
    title: 'Trastevere Food Tour',
    category: 'Food',
    description: 'Discover the authentic flavors of Rome in its most picturesque neighborhood. Our Trastevere Food Tour takes you away from the tourist traps and into the heart of Roman culinary tradition. We\'ll visit family-run bakeries, historic cheese shops, and local trattorias that have been serving the community for generations. Taste classic dishes like supplì, pasta alla carbonara, and authentic Roman pizza, all while learning about the history and culture of this vibrant area. Our local guide will share insider tips on where to eat, drink, and experience the real Rome. The tour includes multiple tastings and a sit-down meal with local wine. It\'s a delicious and immersive way to experience the soul of the Eternal City through its food.',
    videoThumbnail: 'https://picsum.photos/seed/rome-food/400/300',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    date: '2026-04-01',
    time: '12:00-15:30',
    status: 'upcoming',
    attendees: 10,
    maxCapacity: 15,
    lat: 41.8894,
    lng: 12.4673,
    hostId: 'b3',
    hostName: 'Skyline Terrace',
    hostAvatar: 'https://picsum.photos/seed/skyline/200/200',
    price: 65.00,
    address: 'Piazza di Santa Maria in Trastevere, 00153 Roma RM, Italy',
    tags: ['Food', 'Tour', 'Rome', 'Trastevere', 'Small', 'Local', 'Sommelier', 'Millennials'],
    publishedAt: '2026-03-25T12:00:00Z'
  },
  {
    id: 'e13',
    title: 'Vatican Museums Night Visit',
    category: 'Heritage',
    description: 'Experience the world\'s most renowned art collection in a completely new light. Our exclusive Vatican Museums Night Visit allows you to tour the galleries after the general public has left, offering a more intimate and peaceful atmosphere. Marvel at the Sistine Chapel, the Raphael Rooms, and the Gallery of Maps without the usual crowds. Our expert art historian will guide you through the highlights, sharing fascinating stories and historical context that bring the masterpieces to life. The evening includes access to areas often closed during the day and a special reception in the Pinecone Courtyard. This is a rare opportunity to witness the beauty of the Vatican under the moonlight, creating a truly magical and unforgettable experience.',
    videoThumbnail: 'https://picsum.photos/seed/vatican/400/300',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    date: '2026-03-31',
    time: '20:00-23:00',
    status: 'active',
    attendees: 30,
    maxCapacity: 50,
    lat: 39.4700,
    lng: -0.3800,
    hostId: 'b4',
    hostName: 'Urban Canvas',
    hostAvatar: 'https://picsum.photos/seed/canvas/200/200',
    price: 0.00,
    address: 'Calle de la Paz, 2, 46003 Valencia, Spain',
    tags: ['Visual Arts', 'History', 'Vatican', 'Exclusive', 'Large', 'Freelance', 'Painter', 'Professionals'],
    publishedAt: '2026-03-26T14:00:00Z'
  },
  {
    id: 'e14',
    title: 'Piazza Navona Street Music',
    category: 'Performance',
    description: 'Immerse yourself in the Baroque beauty of Piazza Navona while enjoying a curated selection of Rome\'s finest street musicians. This acoustic outdoor concert brings together talented local artists for an evening of diverse musical performances, from classical strings to contemporary folk. The atmosphere is magical, with the fountains and palaces providing a stunning backdrop to the music. Grab a gelato from a nearby shop, find a spot on the steps, and let the melodies fill the air. Our host will introduce each act and share stories about the musical heritage of the city. It\'s a celebration of public art and community, offering a unique way to experience one of Rome\'s most iconic squares. Free to attend, but donations for the artists are encouraged.',
    videoThumbnail: 'https://picsum.photos/seed/rome-music/400/300',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    date: '2026-04-03',
    time: '18:00-20:30',
    status: 'upcoming',
    attendees: 100,
    maxCapacity: 200,
    lat: 41.8992,
    lng: 12.4731,
    hostId: 'b2',
    hostName: 'The Jazz Lab',
    hostAvatar: 'https://picsum.photos/seed/jazz/200/200',
    price: 0.00,
    address: 'Piazza Navona, 00186 Roma RM, Italy',
    tags: ['Performance', 'Street', 'Rome', 'Free', 'Massive', 'Local', 'Jazz Trio', 'Families'],
    publishedAt: '2026-03-27T16:00:00Z'
  },
  {
    id: 'e15',
    title: 'Villa Borghese Picnic',
    category: 'Food',
    description: 'Join our community for a relaxed Sunday picnic in the heart of Rome\'s most beautiful park. Villa Borghese offers the perfect escape from the city\'s hustle, with its lush gardens, serene lakes, and historic villas. We\'ll gather in a shaded area for an afternoon of food, games, and conversation. This is a "potluck" style event, so bring your favorite Roman snacks or a homemade dish to share with new friends. We provide blankets, music, and a selection of outdoor games like frisbee and bocce. It\'s a wonderful opportunity to meet locals and fellow travelers in a casual and friendly setting. After the picnic, feel free to explore the park\'s many attractions, including the Borghese Gallery and the Pincio terrace views.',
    videoThumbnail: 'https://picsum.photos/seed/rome-picnic/400/300',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    date: '2026-03-31',
    time: '13:00-17:00',
    status: 'active',
    attendees: 15,
    maxCapacity: 30,
    lat: 41.9129,
    lng: 12.4848,
    hostId: 'b6',
    hostName: 'Tech & Coffee',
    hostAvatar: 'https://picsum.photos/seed/tech/200/200',
    price: 0.00,
    address: 'Piazzale Napoleone I, 00197 Roma RM, Italy',
    tags: ['Nature', 'Food', 'Picnic', 'Park', 'Rome', 'Medium', 'Corporate', 'Performance Art', 'Gen Z'],
    publishedAt: '2026-03-28T18:00:00Z'
  },
  {
    id: 'e16',
    title: 'Roman Forum History Walk',
    category: 'Heritage',
    description: 'Step back in time and explore the ruins of the ancient Roman Empire\'s political and social center. Our Roman Forum History Walk is led by a passionate archaeologist who will bring the stones to life with vivid storytelling and historical insights. Discover the temples, basilicas, and public spaces where the fate of the Western world was once decided. Learn about the daily lives of Roman citizens, the grand spectacles of the empire, and the architectural innovations that still influence us today. The tour includes access to the Palatine Hill, offering breathtaking views over the forum and the city. It\'s an essential experience for anyone wanting to understand the deep history of Rome beyond the surface. Small group size for an interactive experience.',
    videoThumbnail: 'https://picsum.photos/seed/rome-forum/400/300',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackAds.mp4',
    date: '2026-04-01',
    time: '10:00-12:30',
    status: 'upcoming',
    attendees: 12,
    maxCapacity: 20,
    lat: 41.8925,
    lng: 12.4853,
    hostId: 'b4',
    hostName: 'Urban Canvas',
    hostAvatar: 'https://picsum.photos/seed/canvas/200/200',
    price: 0.00,
    address: 'Via della Salara Vecchia, 5/6, 00186 Roma RM, Italy',
    tags: ['Visual Arts', 'History', 'Rome', 'Tour', 'Small', 'Freelance', 'Painter', 'Professionals'],
    publishedAt: '2026-03-29T20:00:00Z'
  },
  {
    id: 'e17',
    title: 'Pantheon Architectural Talk',
    category: 'Learning',
    description: 'Join us for a deep dive into the engineering marvel that is the Roman Pantheon. This technical talk explores the innovative use of concrete, the geometry of the massive dome, and the symbolic significance of the oculus. Led by a local architect and historian, we\'ll examine the structure from both a historical and modern engineering perspective. Learn how the Romans achieved such incredible scale and durability, and how the Pantheon has influenced architectural design for two millennia. The session includes a guided tour of the interior and an analysis of the surrounding Piazza della Rotonda. Perfect for students, professionals, and anyone fascinated by the intersection of technology, history, and beauty. We\'ll conclude with a discussion over coffee at a nearby historic cafe.',
    videoThumbnail: 'https://picsum.photos/seed/pantheon/400/300',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
    date: '2026-03-31',
    time: '16:00-18:00',
    status: 'active',
    attendees: 20,
    maxCapacity: 40,
    lat: 39.4680,
    lng: -0.3720,
    hostId: 'b6',
    hostName: 'Tech & Coffee',
    hostAvatar: 'https://picsum.photos/seed/tech/200/200',
    price: 0.00,
    address: 'Calle de Colon, 10, 46004 Valencia, Spain',
    tags: ['Media', 'Architecture', 'History', 'Rome', 'Medium', 'Creative Studio', 'Performance Art', 'Professionals'],
    publishedAt: '2026-03-30T22:00:00Z'
  },
  {
    id: 'e18',
    title: 'Tiber River Boat Party',
    category: 'Performance',
    description: 'Celebrate the night aboard our exclusive Tiber River Boat Party. As we cruise through the heart of Rome, you\'ll experience the city\'s illuminated monuments from a unique perspective. Our onboard DJs will keep the energy high with a mix of international hits and Italian favorites. The boat features multiple decks, a full bar, and a lounge area for those who want to relax and take in the views. Meet a diverse crowd of locals and international visitors in a festive and safe environment. Your ticket includes two drinks and a selection of gourmet finger foods. It\'s the ultimate Roman nightlife experience, combining the beauty of the river with the excitement of a high-end club. Departure from near Castel Sant\'Angelo. Don\'t miss the boat!',
    videoThumbnail: 'https://picsum.photos/seed/rome-boat/400/300',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    date: '2026-04-03',
    time: '22:00-02:00',
    status: 'upcoming',
    attendees: 50,
    maxCapacity: 80,
    lat: 41.8919,
    lng: 12.4722,
    hostId: 'b3',
    hostName: 'Skyline Terrace',
    hostAvatar: 'https://picsum.photos/seed/skyline/200/200',
    price: 0.00,
    address: 'Lungotevere Castello, 00193 Roma RM, Italy',
    tags: ['Performance', 'Party', 'Rome', 'Boat', 'Large', 'Corporate', 'Live DJ', 'Gen Z'],
    publishedAt: '2026-03-31T00:00:00Z'
  },
  {
    id: 'e22',
    title: 'Poetry Slam in the Garden',
    category: 'Literature',
    description: 'An evening of spoken word and lyrical expression in a hidden botanical garden. Local poets and storytellers gather to share their latest works under the stars. The atmosphere is intimate and supportive, celebrating the power of language and the art of performance. Whether you\'re a writer or a listener, this is a unique opportunity to connect with the city\'s literary pulse. Refreshments and light snacks provided.',
    videoThumbnail: 'https://picsum.photos/seed/poetry/400/300',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    date: '2026-03-31',
    time: '19:00-21:30',
    status: 'active',
    attendees: 12,
    maxCapacity: 30,
    lat: 39.4790,
    lng: -0.3750,
    hostId: 'b4',
    hostName: 'Urban Canvas',
    hostAvatar: 'https://picsum.photos/seed/canvas/200/200',
    price: 5.00,
    address: 'Jardín de las Hespérides, 46008 Valencia, Spain',
    tags: ['Literature', 'Poetry', 'Spoken Word', 'Valencia', 'Culture', 'Small', 'Creative', 'Millennials'],
    publishedAt: '2026-03-31T12:00:00Z'
  },
  {
    id: 'e23',
    title: 'Vintage Fashion Runway',
    category: 'Fashion',
    description: 'A curated showcase of timeless style and sustainable fashion. Local vintage boutiques and independent designers present their latest collections in a stunning industrial space. Experience the creativity and craftsmanship of the fashion world, from classic silhouettes to avant-garde reinterpretations. The event features a live DJ, pop-up shops, and a social mixer for fashion enthusiasts and industry professionals.',
    videoThumbnail: 'https://picsum.photos/seed/fashion-show/400/300',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    date: '2026-03-31',
    time: '20:00-23:00',
    status: 'active',
    attendees: 45,
    maxCapacity: 100,
    lat: 39.4650,
    lng: -0.3700,
    hostId: 'b6',
    hostName: 'Tech & Coffee',
    hostAvatar: 'https://picsum.photos/seed/tech/200/200',
    price: 10.00,
    address: 'La Marina de Valencia, 46024 Valencia, Spain',
    tags: ['Fashion', 'Vintage', 'Sustainable', 'Valencia', 'Runway', 'Large', 'Creative', 'Gen Z'],
    publishedAt: '2026-03-31T15:00:00Z'
  }
];

export const EXPLORE_MEMORIES: MemoryItem[] = [
    {
        id: 'mem1',
        url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800',
        userName: 'Alex M.',
        caption: 'Incredible exhibition at the museum',
        likes: 42,
        type: 'image',
        height: 'h-64'
    },
    {
        id: 'mem2',
        url: 'https://assets.mixkit.co/videos/preview/mixkit-concert-crowd-with-lights-and-smoke-2158-large.mp4',
        userName: 'Sacha K.',
        caption: 'The performance was breathtaking',
        likes: 128,
        type: 'video',
        height: 'h-32'
    },
    {
        id: 'mem3',
        url: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=800',
        userName: 'Elena',
        caption: 'Jazz night in the city',
        likes: 56,
        type: 'image',
        height: 'h-44'
    },
    {
        id: 'mem4',
        url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=800',
        userName: 'Jordan',
        caption: 'Festival season vibes',
        likes: 89,
        type: 'image',
        height: 'h-48'
    },
    {
        id: 'mem5',
        url: 'https://images.unsplash.com/photo-1514525253361-bee8718a340b?q=80&w=800',
        userName: 'Mike',
        caption: 'Live concert experience',
        likes: 112,
        type: 'image',
        height: 'h-36'
    },
    {
        id: 'mem6',
        url: 'https://images.unsplash.com/photo-1518998053574-53ee7511c914?q=80&w=800',
        userName: 'Sofia',
        caption: 'Exploring the art gallery',
        likes: 34,
        type: 'image',
        height: 'h-40'
    },
    {
        id: 'mem7',
        url: 'https://images.unsplash.com/photo-1459749411177-042180ce673c?q=80&w=800',
        userName: 'Dax',
        caption: 'Street performance',
        likes: 77,
        type: 'image',
        height: 'h-28'
    },
    {
        id: 'mem8',
        url: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800',
        userName: 'Cleo',
        caption: 'Cultural festival',
        likes: 95,
        type: 'image',
        height: 'h-56'
    },
    {
        id: 'mem9',
        url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800',
        userName: 'Kai',
        caption: 'Theatre night',
        likes: 150,
        type: 'image',
        height: 'h-40'
    },
    {
        id: 'mem10',
        url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800',
        userName: 'Rumi',
        caption: 'Art installation',
        likes: 210,
        type: 'image',
        height: 'h-48'
    },
    {
        id: 'mem11',
        url: 'https://images.unsplash.com/photo-1505373630103-f21ee09d9a98?q=80&w=800',
        userName: 'Aria',
        caption: 'Classical music concert',
        likes: 64,
        type: 'image',
        height: 'h-32'
    },
    {
        id: 'mem12',
        url: 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?q=80&w=800',
        userName: 'Finn',
        caption: 'Sculpture garden',
        likes: 82,
        type: 'image',
        height: 'h-40'
    },
    {
        id: 'mem13',
        url: 'https://images.unsplash.com/photo-1460666882912-c9034074949a?q=80&w=800',
        userName: 'Zora',
        caption: 'Painting workshop',
        likes: 45,
        type: 'image',
        height: 'h-52'
    },
    {
        id: 'mem14',
        url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800',
        userName: 'Arlo',
        caption: 'Modern art museum',
        likes: 67,
        type: 'image',
        height: 'h-44'
    },
    {
        id: 'mem15',
        url: 'https://images.unsplash.com/photo-1515405299443-f71bb4040976?q=80&w=800',
        userName: 'Skye',
        caption: 'Abstract colors',
        likes: 88,
        type: 'image',
        height: 'h-36'
    },
    {
        id: 'mem16',
        url: 'https://images.unsplash.com/photo-1501472312651-726afe119ff1?q=80&w=800',
        userName: 'Koa',
        caption: 'Gallery opening',
        likes: 120,
        type: 'image',
        height: 'h-48'
    },
    {
        id: 'mem17',
        url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800',
        userName: 'Veda',
        caption: 'Artistic expression',
        likes: 54,
        type: 'image',
        height: 'h-40'
    },
    {
        id: 'mem18',
        url: 'https://images.unsplash.com/photo-1493306454983-c5c073fba6bd?q=80&w=800',
        userName: 'Dax',
        caption: 'Urban photography',
        likes: 92,
        type: 'image',
        height: 'h-56'
    },
    {
        id: 'mem19',
        url: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=800',
        userName: 'Cleo',
        caption: 'Music festival',
        likes: 110,
        type: 'image',
        height: 'h-44'
    },
    {
        id: 'mem20',
        url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=800',
        userName: 'Remy',
        caption: 'Nightlife vibes',
        likes: 76,
        type: 'image',
        height: 'h-32'
    }
];

export const MOCK_CLUBS: ChatGroup[] = [
  {
    id: 'club-1',
    name: 'Cinephile Atempo',
    eventId: 'club-context',
    type: 'CLUB',
    lastMessage: 'Shared: Video analysis of Parasite...',
    lastTime: '2h',
    coverImage: 'https://picsum.photos/seed/cine/400/300',
    tags: ['Cinema', 'Review', 'Video'],
    members: [
      { name: 'Sofia L.', gender: 'F', eventsAttended: 42, isTrusted: true, isHost: true },
      { name: 'Marc V.', gender: 'M', eventsAttended: 12, isTrusted: false },
      { name: 'Elena G.', gender: 'F', eventsAttended: 28, isTrusted: true }
    ],
    messages: [
      { id: 'c1-m1', sender: 'Sofia L.', text: 'Have you seen the latest video on Parasite\'s editing? It\'s incredible.', timestamp: Date.now() - 7200000, isMe: false },
      { id: 'c1-m2', sender: 'Marc V.', text: 'Yes! The way they use lines in the house is masterfully done.', timestamp: Date.now() - 3600000, isMe: false },
      { id: 'c1-m3', sender: 'Elena G.', text: 'Bong Joon-ho is a genius. Should we do a screening this weekend?', timestamp: Date.now() - 1800000, isMe: false }
    ]
  },
  {
    id: 'club-2',
    name: 'Vinyl Collectors',
    eventId: 'club-context',
    type: 'CLUB',
    lastMessage: 'New recommended album: After Hours...',
    lastTime: '5h',
    coverImage: 'https://picsum.photos/seed/vinyl-club/400/300',
    tags: ['Performance', 'Vinyl', 'Retro'],
    members: [
      { name: 'David R.', gender: 'M', eventsAttended: 85, isTrusted: true, isHost: true },
      { name: 'Carla M.', gender: 'F', eventsAttended: 15, isTrusted: true }
    ],
    messages: [
      { id: 'c2-m1', sender: 'David R.', text: 'I just got a first edition of Kind of Blue. Sounds insane.', timestamp: Date.now() - 18000000, isMe: false },
      { id: 'c2-m2', sender: 'Carla M.', text: 'So jealous! I\'m still looking for After Hours on red vinyl.', timestamp: Date.now() - 14400000, isMe: false }
    ]
  },
  {
    id: 'club-3',
    name: 'The Reading Nook',
    eventId: 'club-context',
    type: 'CLUB',
    lastMessage: 'PDF: Best Sci-Fi books list...',
    lastTime: 'Yesterday',
    coverImage: 'https://picsum.photos/seed/books/400/300',
    tags: ['Literature', 'Discussion', 'Cozy'],
    members: [
      { name: 'Laura S.', gender: 'F', eventsAttended: 30, isTrusted: true, isHost: true },
      { name: 'Pablo K.', gender: 'M', eventsAttended: 5, isTrusted: false }
    ],
    messages: [
      { id: 'c3-m1', sender: 'Laura S.', text: 'I uploaded the PDF with the Sci-Fi list we discussed yesterday.', timestamp: Date.now() - 86400000, isMe: false },
      { id: 'c3-m2', sender: 'Pablo K.', text: 'Great! I\'ll start with Dune before the second part comes out.', timestamp: Date.now() - 82800000, isMe: false }
    ]
  },
  {
    id: 'club-4',
    name: 'Street Art Hunters',
    eventId: 'club-context',
    type: 'CLUB',
    members: [
      { name: 'Iker B.', gender: 'M', eventsAttended: 50, isTrusted: true, isHost: true },
      { name: 'Sara P.', gender: 'F', eventsAttended: 22, isTrusted: true }
    ],
    messages: [
      { id: 'c4-m1', sender: 'Iker B.', text: 'Who\'s up for the graffiti tour through Ruzafa this Sunday?', timestamp: Date.now() - 600000, isMe: false },
      { id: 'c4-m2', sender: 'Sara P.', text: 'Me! I heard there\'s a new mural by Escif near the market.', timestamp: Date.now() - 300000, isMe: false }
    ]
  }
];

export const MOCK_COMMUNITIES: Record<string, EventCommunity> = {
  'e19': {
    id: 'c1',
    eventId: 'e19',
    name: 'Jazz Jam Session',
    logoUrl: 'https://picsum.photos/seed/jazz/200/200',
    groups: [
      {
        id: 'g1',
        name: 'Announcements',
        avatarUrl: 'https://picsum.photos/seed/jazz/200/200',
        lastMessage: 'The Berlin trio is arriving at 8 PM!',
        lastTimestamp: Date.now() - 3600000,
        memberCount: 156,
        isJoined: true,
        isAnnouncement: true
      },
      {
        id: 'g2',
        name: 'Musicians Corner',
        avatarUrl: 'https://picsum.photos/seed/musician/200/200',
        lastMessage: 'Anyone bringing a double bass tonight?',
        lastTimestamp: Date.now() - 1800000,
        memberCount: 42,
        isJoined: true
      },
      {
        id: 'g3',
        name: 'Jazz Enthusiasts',
        avatarUrl: 'https://picsum.photos/seed/jazzfan/200/200',
        lastMessage: 'That sax solo was insane!',
        lastTimestamp: Date.now() - 7200000,
        memberCount: 89,
        isJoined: true
      },
      {
        id: 'g4',
        name: 'Volunteer Team',
        avatarUrl: 'https://picsum.photos/seed/volunteer/200/200',
        memberCount: 12,
        isJoined: false,
        requiresRequest: true
      },
      {
        id: 'g5',
        name: 'After Party Planning',
        avatarUrl: 'https://picsum.photos/seed/party/200/200',
        memberCount: 25,
        isJoined: false
      }
    ]
  },
  'e20': {
    id: 'c2',
    eventId: 'e20',
    name: 'Sunset Rooftop Party',
    logoUrl: 'https://picsum.photos/seed/rooftop/200/200',
    groups: [
      {
        id: 'g20-1',
        name: 'Announcements',
        avatarUrl: 'https://picsum.photos/seed/rooftop/200/200',
        lastMessage: 'DJ set starts in 30 minutes!',
        lastTimestamp: Date.now() - 1800000,
        memberCount: 245,
        isJoined: true,
        isAnnouncement: true
      },
      {
        id: 'g20-2',
        name: 'VIP Lounge',
        avatarUrl: 'https://picsum.photos/seed/vip/200/200',
        lastMessage: 'Is there a dress code for tonight?',
        lastTimestamp: Date.now() - 3600000,
        memberCount: 32,
        isJoined: true
      },
      {
        id: 'g20-3',
        name: 'Rooftop Vibes',
        avatarUrl: 'https://picsum.photos/seed/party-vibes/200/200',
        lastMessage: 'The view is incredible!',
        lastTimestamp: Date.now() - 600000,
        memberCount: 112,
        isJoined: true
      }
    ]
  },
  'e1': {
    id: 'c3',
    eventId: 'e1',
    name: 'Techno Yoga Session',
    logoUrl: 'https://picsum.photos/seed/yoga/200/200',
    groups: [
      {
        id: 'g1-1',
        name: 'Announcements',
        avatarUrl: 'https://picsum.photos/seed/yoga/200/200',
        lastMessage: 'Please bring your own mat if possible.',
        lastTimestamp: Date.now() - 7200000,
        memberCount: 88,
        isJoined: true,
        isAnnouncement: true
      },
      {
        id: 'g1-2',
        name: 'Yoga Community',
        avatarUrl: 'https://picsum.photos/seed/zen/200/200',
        lastMessage: 'Looking forward to the techno flow!',
        lastTimestamp: Date.now() - 300000,
        memberCount: 45,
        isJoined: true
      }
    ]
  },
  'e3': {
    id: 'c4',
    eventId: 'e3',
    name: 'Rooftop Sunset Party',
    logoUrl: 'https://picsum.photos/seed/sunset/200/200',
    groups: [
      {
        id: 'g3-1',
        name: 'Announcements',
        avatarUrl: 'https://picsum.photos/seed/sunset/200/200',
        lastMessage: 'Welcome drink is served until 19:30!',
        lastTimestamp: Date.now() - 3600000,
        memberCount: 180,
        isJoined: true,
        isAnnouncement: true
      },
      {
        id: 'g3-2',
        name: 'Sunset Lovers',
        avatarUrl: 'https://picsum.photos/seed/sunset-lovers/200/200',
        lastMessage: 'Anyone want to share a taxi later?',
        lastTimestamp: Date.now() - 900000,
        memberCount: 65,
        isJoined: true
      }
    ]
  },
  'club-1': {
    id: 'c-club-1',
    eventId: 'club-1',
    name: 'Cinephile Atempo',
    logoUrl: 'https://picsum.photos/seed/cine/400/300',
    groups: [
      {
        id: 'g-c1-ann',
        name: 'Announcements',
        avatarUrl: 'https://picsum.photos/seed/cine/400/300',
        lastMessage: 'New video analysis of Parasite is out!',
        lastTimestamp: Date.now() - 7200000,
        memberCount: 420,
        isJoined: true,
        isAnnouncement: true
      },
      {
        id: 'g-c1-chat',
        name: 'Cinephile Chat',
        avatarUrl: 'https://picsum.photos/seed/cine-chat/200/200',
        lastMessage: 'Should we do a screening this weekend?',
        lastTimestamp: Date.now() - 1800000,
        memberCount: 380,
        isJoined: true
      },
      {
        id: 'g-c1-rec',
        name: 'Recommendations',
        avatarUrl: 'https://picsum.photos/seed/cine-rec/200/200',
        lastMessage: 'Check out this list of indie films.',
        lastTimestamp: Date.now() - 86400000,
        memberCount: 150,
        isJoined: false
      }
    ]
  },
  'club-2': {
    id: 'c-club-2',
    eventId: 'club-2',
    name: 'Vinyl Collectors',
    logoUrl: 'https://picsum.photos/seed/vinyl-club/400/300',
    groups: [
      {
        id: 'g-c2-ann',
        name: 'Announcements',
        avatarUrl: 'https://picsum.photos/seed/vinyl-club/400/300',
        lastMessage: 'New recommended album: After Hours',
        lastTimestamp: Date.now() - 18000000,
        memberCount: 215,
        isJoined: true,
        isAnnouncement: true
      },
      {
        id: 'g-c2-chat',
        name: 'Vinyl Chat',
        avatarUrl: 'https://picsum.photos/seed/vinyl-chat/200/200',
        lastMessage: 'I just got a first edition of Kind of Blue.',
        lastTimestamp: Date.now() - 1800000,
        memberCount: 190,
        isJoined: true
      }
    ]
  }
};
