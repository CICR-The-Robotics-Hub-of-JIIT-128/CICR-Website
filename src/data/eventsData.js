// Events Metadata - Production (Realtime Database Synchronized)
export const eventCategories = [
  { id: 'all', label: 'All Events' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'workshops', label: 'Workshops' },
  { id: 'competitions', label: 'Competitions' },
  { id: 'sessions', label: 'Sessions' },
];

export const eventYears = ['2025-2026', '2024-2025', '2023-2024', '2022-2023'];

export const eventsCatalog = [
  {
    id: 'cicr-ki-kaksha',
    slug: 'cicr-ki-kaksha',
    title: 'CICR की कक्षा',
    category: 'workshops',
    dates: '3 Days • Hardware Robotics Bootcamp',
    tagline: 'Learn circuit prototyping, sensor fusion, and autonomous rovers from ground zero.',
    desc: 'Learn circuit prototyping, sensor fusion, and autonomous rovers from ground zero.',
    venue: 'Embedded Systems Lab, JIIT Sector 128',
    image: '/gallery/cicr-moment-1.jpg',
    status: 'upcoming',
    isActiveForRegistration: true
  },
  {
    id: 'techtonic-1',
    slug: 'techtonic-1',
    title: 'TechTonic 1.0',
    category: 'competitions',
    dates: '3 Days • Flagship Robotics Fest',
    tagline: 'High-speed line followers, autonomous maze solvers, and 24-hr hardware hackathon sprint.',
    desc: 'High-speed line followers, autonomous maze solvers, and 24-hr hardware hackathon sprint.',
    venue: 'Central Arena & Auditorium, JIIT Sector 128',
    image: '/gallery/cicr-moment-6.jpg',
    status: 'upcoming',
    isActiveForRegistration: true
  },
  {
    id: 'techtonic-2',
    slug: 'techtonic-2',
    title: 'TechTonic 2.0',
    category: 'competitions',
    dates: '3 Days • Advanced Arena Combat & AI',
    tagline: 'Heavyweight RoboWars, computer vision drone navigation, and 36-hr smart mobility challenge.',
    desc: 'Heavyweight RoboWars, computer vision drone navigation, and 36-hr smart mobility challenge.',
    venue: 'Central Arena, JIIT Sector 128',
    image: '/gallery/cicr-moment-5.jpg',
    status: 'upcoming',
    isActiveForRegistration: true
  },
  {
    id: 'converge',
    slug: 'converge',
    title: 'Converge',
    category: 'sessions',
    dates: '2 Days • Annual Tech Symposium',
    tagline: 'Cross-domain confluence of embedded intelligence, robotics research, project expo & keynote conclave.',
    desc: 'Cross-domain confluence of embedded intelligence, robotics research, project expo & keynote conclave.',
    venue: 'Auditorium & Innovation Gallery, JIIT Sector 128',
    image: '/gallery/cicr-moment-7.jpg',
    status: 'upcoming',
    isActiveForRegistration: true
  },
  {
    id: 'dron-o-war',
    slug: 'dron-o-war',
    title: 'Dron-O-War',
    category: 'competitions',
    dates: '2 Days • Aerial Combat & Racing',
    tagline: 'High-speed FPV drone racing through 3D illuminated air-gates and enclosed aerial dogfights.',
    desc: 'High-speed FPV drone racing through 3D illuminated air-gates and enclosed aerial dogfights.',
    venue: 'Open-Air Combat Cage, JIIT Sector 128',
    image: '/gallery/cicr-moment-3.jpg',
    status: 'upcoming',
    isActiveForRegistration: true
  }
];
