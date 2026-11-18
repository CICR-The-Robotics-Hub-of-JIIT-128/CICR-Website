// Events Metadata - Realtime Synchronized & Local Tactical Catalog
export const eventCategories = [
  { id: 'all', label: 'All Operations' },
  { id: 'flagship', label: 'Flagship Fests' },
  { id: 'bootcamp', label: 'Bootcamps' },
  { id: 'combat', label: 'Aerial & Combat' },
  { id: 'symposium', label: 'Conclaves & Symposiums' }
];

export const eventYears = ['2025-2026', '2024-2025', '2023-2024'];

export const eventsCatalog = [
  {
    id: 'cicr-ki-kaksha',
    slug: 'cicr-ki-kaksha',
    title: 'CICR की कक्षा',
    code: 'OP-KAKSHA // TACTICAL-01',
    category: 'bootcamp',
    categoryLabel: 'Hardware Bootcamp',
    duration: '3 Days Intensive',
    durationDays: 3,
    dates: 'Upcoming Spring Edition',
    venue: 'Embedded Systems Lab & Seminar Hall, JIIT Sector 128',
    status: 'upcoming',
    isActiveForRegistration: true,
    themeColor: '#f59e0b',
    accentGlow: 'rgba(245, 158, 11, 0.35)',
    tagline: 'From Breadboard to Autonomous Rover — Hands-On Robotics Bootcamp from Ground Zero',
    description: 'CICR की कक्षा is our signature 3-day hardware bootcamp designed to take students from absolute zero to engineering battle-ready autonomous rovers. Learn circuit prototyping, sensor fusion, motor drive circuitry, and state machine algorithms with real microcontroller kits.',
    image: '/gallery/cicr-moment-1.jpg',
    teamSize: 'Individual or Duo (1-2 Members)',
    hardwareStack: ['Arduino / ESP32', 'L298N Motor Drivers', 'HC-SR04 Ultrasonic', 'IR Sensor Array', 'Robotic Chassis & Gear Motors'],
    itinerary: [
      {
        day: 'Day 01',
        title: 'Core Electronics & Silicon Fundamentals',
        desc: 'Breadboarding protocols, microcontroller pinouts, digital/analog I/O, and PWM signal driving for DC motors.'
      },
      {
        day: 'Day 02',
        title: 'Sensors, Actuation & Control Loops',
        desc: 'Interfacing ultrasonic & IR arrays, closed-loop feedback algorithms, mechanical rover assembly, and Bluetooth telemetry.'
      },
      {
        day: 'Day 03',
        title: 'Autonomous Navigation & Grand Rover Race',
        desc: 'Autonomous obstacle avoidance state machines, time-trial obstacle course showdown, project evaluation & certifications.'
      }
    ],
    perks: [
      'Take-home Hardware Prototyping Kit provided to every team',
      'Official CICR & JIIT Certificate of Completion',
      'Direct pathway for induction into CICR Core Project Divisions',
      'Dedicated mentorship from senior national robotics champions'
    ]
  },
  {
    id: 'techtonic',
    slug: 'techtonic-2',
    title: 'TechTonic',
    code: 'OP-TECHTONIC // FLAGSHIP-02',
    category: 'flagship',
    categoryLabel: 'Flagship TechFest',
    duration: '3 Days (Dual Edition: 1.0 & 2.0)',
    durationDays: 3,
    dates: 'Annual Flagship Fest',
    venue: 'Central Arena & Main Auditorium, JIIT Sector 128',
    status: 'upcoming',
    isActiveForRegistration: true,
    themeColor: '#06b6d4',
    accentGlow: 'rgba(6, 182, 212, 0.35)',
    tagline: 'The Ultimate Collision of Silicon, Sensors & Battle-Ready Autonomous Machines',
    description: 'The premier annual multi-day robotics festival of JIIT-128. Spanning 3 electric days of hackathons, high-speed line followers, and autonomous bot warfare, TechTonic brings together top innovators from across the country to compete in elite robotic challenges.',
    image: '/gallery/cicr-moment-6.jpg',
    teamSize: 'Teams of 2 to 4 Operatives',
    hardwareStack: ['Autonomous Robocars', 'High-Torque Combat Chassis', 'Computer Vision Nodes', 'LiDAR & Ultrasonic Sensors'],
    editions: {
      '1.0': {
        name: 'TechTonic 1.0 — Inception Phase',
        duration: '3 Days',
        tagline: 'Genesis of Autonomous Tracking & Fast-Paced Arena Sprints',
        highlights: [
          'Line Follower High-Speed Arena with elevated loop bridges',
          'Autonomous Maze Solver Time Trials & Grid Navigation',
          'Robo Soccer 3v3 Tournament & Wireless Joy-Con Clashes',
          '24-Hour Hardware Hackathon Sprint'
        ],
        itinerary: [
          { day: 'Day 01', title: 'TechTonic Inception & Keynotes', desc: 'Opening Ceremony, Arena Technical Scrutiny, Line Follower Qualifiers (Heat 1), Hackathon Problem Statements.' },
          { day: 'Day 02', title: 'Arena Clashes & Maze Showdowns', desc: 'Autonomous Maze Solver Time Trials, Robo Soccer Group Stages, and overnight non-stop Hackathon coding & fabrication.' },
          { day: 'Day 03', title: 'Championship Finals & Expo', desc: 'Line Follower Grand Finals, Hackathon Hardware Demonstration before Industry Jury, and Grand Award Gala.' }
        ]
      },
      '2.0': {
        name: 'TechTonic 2.0 — Evolution Phase',
        duration: '3 Days',
        tagline: 'Autonomous AI Drones, Heavyweight RoboWars & 36h National Hackathon',
        highlights: [
          'RoboWars: Heavyweight Combat Armor & Spinning Blades Arena',
          'Autonomous Drone Obstacle Navigation with OpenCV Vision',
          'Smart Mobility & EV Automation Hackathon (36 Hours)',
          'All-India Inter-Collegiate Robotics Grand Prix'
        ],
        itinerary: [
          { day: 'Day 01', title: 'The Arena Unveiling & Battle Heats', desc: 'Safety Scrutiny, Weapon Weigh-in, Autonomous AI Rover Qualifiers, and 36-Hour National Hackathon Kickoff.' },
          { day: 'Day 02', title: 'High-Impact RoboWars Arena', desc: 'Heavyweight Combat Bot Elimination Rounds, Computer Vision Track Inspections, and Drone Swarm AI Demonstrations.' },
          { day: 'Day 03', title: 'The Grand Finals & Mega Bounty', desc: 'RoboWars Championship Battle, Hackathon Grand Jury Pitching, and Mega Bounty Distribution (₹1,00,000+ Prize Pool).' }
        ]
      }
    },
    perks: [
      'Cash Prize Bounty exceeding ₹1,00,000+',
      'National-level trophy & recognized merit certifications',
      'Direct networking with robotics industry sponsors & venture founders',
      'Official festival kits, merchandise & hospitality assistance'
    ]
  },
  {
    id: 'converge',
    slug: 'converge',
    title: 'Converge',
    code: 'OP-CONVERGE // SYMPOSIUM-03',
    category: 'symposium',
    categoryLabel: 'Annual Tech Symposium',
    duration: '2 Days Conclave',
    durationDays: 2,
    dates: 'Annual Conclave Edition',
    venue: 'Auditorium & Innovation Gallery, JIIT Sector 128',
    status: 'upcoming',
    isActiveForRegistration: true,
    themeColor: '#a855f7',
    accentGlow: 'rgba(168, 85, 247, 0.35)',
    tagline: 'Where Robotics Meets Embedded Intelligence — Research, Expo & Industry Conclave',
    description: 'Converge is a 2-day high-impact tech symposium bridging the gap between collegiate innovation and cutting-edge robotics research. Featuring keynote talks from industry luminaries, a research showcase, live hardware project expos, and round-table panel discussions on the future of autonomous systems.',
    image: '/gallery/cicr-moment-7.jpg',
    teamSize: 'Individual or Teams of up to 3',
    hardwareStack: ['Edge AI & Jetson Nano', 'IoT Microgrid Systems', 'Robotic Arms & Kinematics', 'Autonomous Vehicles & ROS'],
    itinerary: [
      {
        day: 'Day 01',
        title: 'Keynotes & Cross-Domain Research Colloquium',
        desc: 'Opening Keynote by Robotics Leaders, Research Paper Presentations & Peer Review, Industry 4.0 Panel Discussion, ROS 2.0 Workshop.'
      },
      {
        day: 'Day 02',
        title: 'Innovation Expo & Venture Hardware Pitches',
        desc: 'Hardware Prototype Exhibition Arena, Live Project Defense with Industry Mentors, Research Fellowship Pitches, and Best Innovation Awards.'
      }
    ],
    perks: [
      'Opportunity to publish research abstracts in symposium proceedings',
      'Direct interaction with robotics R&D directors & alumni from tier-1 labs',
      'Seed incubation & prototyping grants for top innovative projects',
      'Official JIIT-128 & CICR Research Fellow Certificates'
    ]
  },
  {
    id: 'dron-o-war',
    slug: 'dron-o-war',
    title: 'Dron-O-War',
    code: 'OP-DRONOWAR // COMBAT-04',
    category: 'combat',
    categoryLabel: 'Aerial Combat & Racing',
    duration: '2 Days Tournament',
    durationDays: 2,
    dates: 'Biannual Arena Combat',
    venue: 'Open-Air Steel Cage & Sports Complex, JIIT Sector 128',
    status: 'upcoming',
    isActiveForRegistration: true,
    themeColor: '#ff601c',
    accentGlow: 'rgba(255, 96, 28, 0.45)',
    tagline: 'Supersonic Agility in the Skies — High-Speed FPV Drone Racing & Aerial Dogfight Arena',
    description: 'The sky is not the limit — it is the battleground. Dron-O-War is an adrenaline-fueled 2-day aerial combat and FPV obstacle racing tournament. Pilots maneuver custom-built quadcopters through illuminated 3D neon air-gates, tight hairpin chicanes, and participate in high-stakes aerial target combat.',
    image: '/gallery/cicr-moment-3.jpg',
    teamSize: 'Pilot + Spotter (1-3 Members per Drone)',
    hardwareStack: ['FPV 5-inch Racers / Whoops', 'Betaflight Flight Controllers', '5.8GHz VTX / HD Zero / DJI O3', 'Carbon Fiber Airframes'],
    itinerary: [
      {
        day: 'Day 01',
        title: 'Flight Line Scrutiny & Time Trial Heats',
        desc: 'Frequency coordination & failsafe testing, open track inspection, Time Trial Qualifiers for top grid seeding, and Night Neon FPV Sprint.'
      },
      {
        day: 'Day 02',
        title: 'Aerial Dogfight & The Championship Knockouts',
        desc: '1-on-1 Head-to-Head Bracket Eliminations, Precision Payload Drop Maneuverability Challenge, Enclosed Mesh Dogfight, and Podium Honors.'
      }
    ],
    perks: [
      'Dedicated LiPo charging stations & field soldering workstations',
      'Cash Bounty for Fastest Lap & Champion Combat Pilot',
      'Official FPV Racing Trophy & Custom Carbon-Fiber Badges',
      'Live HD stream with pilot cockpit FPV feeds on stadium jumbotrons'
    ]
  }
];
