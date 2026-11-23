/**
 * Authoritative CICR Knowledge Base & Versatile Conversation Engine
 * 
 * Deeply indexed with complete data from:
 * - src/data/teamData.js (Faculty, Leads, Core Team, Volunteers)
 * - src/data/projectsData.js (All robotics, AI, IoT, and avionics projects)
 * - src/data/eventsData.js (TechTonic, CICR की कक्षा, Dron-O-War, Converge, etc.)
 * - Lab details, hardware inventory portal, recruitment, and credentials.
 * 
 * Professional, authoritative tone with zero emojis.
 */

import { teamData } from '../data/teamData.js';
import { projectsCatalog } from '../data/projectsData.js';
import { eventsCatalog } from '../data/eventsData.js';

// Flattened team members index for fast retrieval
const ALL_TEAM_MEMBERS = [
  ...((teamData && teamData.faculty) || []),
  ...((teamData && teamData.leads) || []),
  ...((teamData && teamData.core) || []),
  ...((teamData && teamData.volunteers) || [])
];

function cleanQuery(text) {
  if (!text) return '';
  return text.toLowerCase()
    .replace(/^(can you )?(please )?(tell me about|who is|who was|who are|what is|what are|info on|details on|tell me|show me|explain)\s+/i, '')
    .trim();
}

function normalizeKey(str) {
  return (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Format a team member's details into a clean markdown card
 */
function formatMemberCard(member) {
  const categoryLabel = 
    member.category === 'faculty' ? 'Faculty Coordinator' :
    member.category === 'leads' ? 'Head / Lead' :
    member.category === 'core' ? 'Core Team Member' : 'Volunteer';

  const parts = [
    `**${member.name}** (${categoryLabel})`,
    member.role ? `- **Role**: ${member.role}` : null,
    member.domain ? `- **Domain / Wing**: ${member.domain} ${member.department ? `(${member.department})` : ''}` : (member.department ? `- **Department**: ${member.department}` : null),
    member.quote ? `- **Motto / Tagline**: *"${member.quote}"*` : null,
    member.bio ? `- **Bio**: ${member.bio}` : null,
  ].filter(Boolean);

  const links = [];
  if (member.linkedin) links.push(`[LinkedIn](${member.linkedin})`);
  if (member.github) links.push(`[GitHub](${member.github})`);
  if (member.portfolio) links.push(`[Portfolio](${member.portfolio})`);
  if (member.instagram) links.push(`[Instagram](${member.instagram})`);

  if (links.length > 0) {
    parts.push(`- **Profiles**: ${links.join(' • ')}`);
  }

  return parts.join('\n');
}

/**
 * Format a project's details into a clean markdown card
 */
function formatProjectCard(proj) {
  const parts = [
    `**${proj.title}** ${proj.subtitle ? `*(${proj.subtitle})*` : ''}`,
    `- **Category**: ${proj.category || 'Robotics'} ${proj.status ? `• *[${proj.status}]*` : ''}`,
    proj.description ? `- **Description**: ${proj.description}` : null,
    proj.highlights && proj.highlights.length > 0 ? `- **Tech Highlights**: ${proj.highlights.join(', ')}` : null,
    proj.achievement ? `- **Achievement / Recognition**: ${proj.achievement}` : null,
    proj.team && proj.team.length > 0 ? `- **Project Team**: ${proj.team.join(', ')}` : null,
    proj.mentors && proj.mentors.length > 0 ? `- **Mentors**: ${proj.mentors.join(', ')}` : null,
    proj.github ? `- **GitHub**: [${proj.github}](${proj.github})` : null,
    proj.linkedin ? `- **LinkedIn**: [${proj.linkedin}](${proj.linkedin})` : null,
    proj.tags && proj.tags.length > 0 ? `- **Tags**: \`${proj.tags.join('` `')}\`` : null
  ].filter(Boolean);

  return parts.join('\n');
}

/**
 * Format an event's details into a clean markdown card
 */
function formatEventCard(evt) {
  const parts = [
    `**${evt.title}**`,
    evt.tagline ? `- **Theme / Tagline**: *"${evt.tagline}"*` : null,
    evt.category ? `- **Category**: ${evt.category}` : null,
    `- **Status**: ${evt.status === 'upcoming' ? 'Upcoming' : 'Concluded'}`,
    evt.gallery && evt.gallery.length > 0 ? `- **Gallery Photos**: Available on the **Events** tab (${evt.gallery.length} captured moments)` : null
  ].filter(Boolean);

  return parts.join('\n');
}

/**
 * Search team members by name or role keyword
 */
function searchTeamMembers(rawQuery) {
  const qClean = cleanQuery(rawQuery);
  const qNorm = normalizeKey(qClean);
  if (!qNorm) return [];

  // 1. Exact match on normalized full name
  const exact = ALL_TEAM_MEMBERS.filter(m => {
    const normName = normalizeKey(m.name);
    return normName === qNorm;
  });
  if (exact.length > 0) return exact;

  // 2. Exact match on first name + last name or id slug
  const exactPart = ALL_TEAM_MEMBERS.filter(m => {
    const nameParts = m.name.toLowerCase().split(/\s+/).filter(Boolean);
    const idSlug = (m.id || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    return (
      nameParts.length >= 2 &&
      (qClean === `${nameParts[0]} ${nameParts[1]}` || qClean === m.name.toLowerCase()) ||
      idSlug === qNorm
    );
  });
  if (exactPart.length > 0) return exactPart;

  // 3. Substring match if clean query is at least 4 characters long
  if (qClean.length >= 4) {
    const substringMatches = ALL_TEAM_MEMBERS.filter(m => {
      const normName = normalizeKey(m.name);
      return normName.includes(qNorm) || (qNorm.length >= 6 && qNorm.includes(normName));
    });
    if (substringMatches.length > 0 && substringMatches.length <= 4) {
      return substringMatches;
    }
  }

  return [];
}

/**
 * Search projects catalog
 */
function searchProjects(rawQuery) {
  const qClean = cleanQuery(rawQuery);
  const qNorm = normalizeKey(qClean);
  if (!qNorm) return [];

  return projectsCatalog.filter(p => {
    const titleNorm = normalizeKey(p.title);
    const subNorm = normalizeKey(p.subtitle);
    const idNorm = normalizeKey(p.id);

    return (
      titleNorm === qNorm ||
      titleNorm.includes(qNorm) ||
      (qNorm.length >= 4 && qNorm.includes(titleNorm)) ||
      subNorm.includes(qNorm) ||
      idNorm === qNorm
    );
  });
}

/**
 * Search events catalog
 */
function searchEvents(rawQuery) {
  const qClean = cleanQuery(rawQuery);
  const qNorm = normalizeKey(qClean);
  if (!qNorm || qNorm === 'cicr') return [];

  return eventsCatalog.filter(e => {
    const titleNorm = normalizeKey(e.title);
    const catNorm = normalizeKey(e.category);
    const slugNorm = normalizeKey(e.slug);

    return (
      titleNorm === qNorm ||
      catNorm === qNorm ||
      slugNorm === qNorm ||
      (qNorm.length >= 6 && titleNorm.includes(qNorm)) ||
      (qNorm.length >= 6 && qNorm.includes(titleNorm))
    );
  });
}

/**
 * Comprehensive static knowledge modules for core CICR themes
 */
export const CORE_CICR_TOPICS = [
  // 1. About CICR
  {
    category: 'about',
    triggers: [
      'cicr', 'about cicr', 'what is cicr', 'who are you', 'tell me about cicr', 'cicr full form', 
      'centre for innovation', 'about society', 'about the club', 'what does cicr do'
    ],
    generate: () => 
`**CICR (Centre for Innovation, Computing and Robotics)** is the premier robotics and technological innovation hub of **Jaypee Institute of Information Technology (JIIT), Sector 128, Noida**.

We are a student-driven collective of engineers, roboticists, software architects, and designers pioneering autonomous systems, aerial drones, computer vision, and embedded hardware.

**Core Wings:**
- **Technical Wing**: Embedded firmware, autonomous rovers (ROS2, SLAM, LiDAR), custom PCBs, IoT automation, and mechanical CAD/3D printing.
- **Management Wing**: Event orchestration, corporate outreach, sponsorship, and logistics for collegiate hackathons and symposiums.
- **PR & Creative Wing**: Digital identity, UI/UX, video documentation, social media presence, and brand storytelling.

**Key Landmarks:**
- Over 13+ flagship hardware innovations fabricated in-house.
- 50+ active student engineers and 2 esteemed faculty coordinators.
- State-of-the-art physical robotics prototyping lab located at JIIT-128.`
  },

  // 2. Heads and Leadership
  {
    category: 'heads',
    triggers: [
      'heads', 'head', 'leads', 'who are the heads', 'lead team', 'leadership', 
      'presidents', 'coordinators of cicr', 'advisors'
    ],
    generate: () => {
      const leads = (teamData && teamData.leads) || [];
      const list = leads.map((lead, idx) => {
        const link = lead.linkedin ? `([LinkedIn](${lead.linkedin}))` : '';
        return `${idx + 1}. **${lead.name}** – ${lead.role || 'Head'} (${lead.domain || 'Technical'} Wing) ${link}\n   *${lead.quote || lead.bio || ''}*`;
      }).join('\n');

      return `**CICR Leadership & Heads (2025–2026):**\n\n${list}\n\nOur heads mentor student cohorts across embedded robotics, CAD prototyping, software stacks, and national robotics competitions.`;
    }
  },

  // 3. Faculty Mentors
  {
    category: 'faculty',
    triggers: [
      'faculty', 'teachers', 'professor', 'prof', 'faculty coordinators', 
      'mentors', 'dr harish', 'prof parul', 'harish bishwakarma', 'parul arora'
    ],
    generate: () => {
      const faculty = (teamData && teamData.faculty) || [];
      const list = faculty.map(f => {
        return `**${f.name}** – *${f.role}*\n- **Department**: ${f.department}\n- **Message**: *"${f.quote}"*\n- **Guidance**: ${f.bio}`;
      }).join('\n\n');

      return `**Faculty Coordinators at CICR:**\n\n${list}\n\nBoth faculty mentors support our student engineers in research publications, collegiate competitions, lab resources, and academic synergy.`;
    }
  },

  // 4. Team Structure Overview
  {
    category: 'team_summary',
    triggers: [
      'team', 'members', 'how many members', 'core team', 'volunteers', 'roster', 'who is in cicr'
    ],
    generate: () => {
      const fCount = (teamData?.faculty || []).length;
      const lCount = (teamData?.leads || []).length;
      const cCount = (teamData?.core || []).length;
      const vCount = (teamData?.volunteers || []).length;
      const total = fCount + lCount + cCount + vCount;

      return `**CICR Team Hierarchy (Session 2025–2026):**
Total active strength: **${total} members**

- **Faculty Coordinators (${fCount})**: Dr. Harish Bishwakarma & Prof. Parul Arora
- **Heads & Advisors (${lCount})**: Yasharth Singh, Aryan Varshney, Dhruvi Gupta, Ashutosh Vishwakarma, Aman Gandotra, Vanshik Jain, Ankit Sharma
- **Core Team (${cCount})**: Senior developers, circuit designers, and creative leads (including Dev Maheshwari, Priyanshi Saini, Divyam Jain, Vardaan Saxena, Gourav Mandal, Parivisha Midha, Upmanyu Singh, etc.)
- **Volunteers (${vCount})**: Energetic 1st & 2nd year engineers (including Harshil Gupta, Dev Garg, Chetan Sharma, Ishita, etc.)

Check the **Team** page to explore detailed portfolios, bios, and profiles for every single member.`;
    }
  },

  // 5. Projects Overview
  {
    category: 'projects_summary',
    triggers: [
      'all projects', 'projects list', 'what projects', 'show projects', 'rover', 'rovers', 'drone', 'drones'
    ],
    generate: () => {
      const projs = projectsCatalog.map((p, idx) => {
        return `${idx + 1}. **${p.title}** (*${p.category}*) ${p.achievement ? `– [${p.achievement}]` : ''}`;
      }).join('\n');

      return `**Flagship Hardware & AI Projects Developed at CICR:**\n\n${projs}\n\nAsk about any specific project (such as Skully, J.A.R.V.I.S, AI Gesture Translator, Find My Book, or Payload Drone), or visit the **Projects** tab for technical specifications.`;
    }
  },

  // 6. Events & Workshops Overview
  {
    category: 'events_summary',
    triggers: [
      'events', 'all events', 'workshops', 'workshops list', 'techtonic events', 'hackathon', 'bootcamp'
    ],
    generate: () => {
      const evts = eventsCatalog.map(e => `• **${e.title}**: *${e.tagline || ''}*`).join('\n');

      return `**Signature Events & Masterclasses by CICR:**\n\n${evts}\n\n- **TechTonic**: Multi-day robotics sprint covering autonomous bots, sensors, and live arena racing.\n- **Dron-O-War**: High-speed FPV obstacle slalom and aerial drone combat (featured in Dron-o-war 1.0).\n- **CICR की कक्षा**: Hands-on hardware masterclass in circuit design, motor drivers & sensor fusion.\n- **Converge**: Annual technology conclave and project exhibition.\n\nVisit the **Events** tab for photo galleries and event highlights.`;
    }
  },

  // 7. Hardware Inventory Portal
  {
    category: 'inventory',
    triggers: [
      'inventory', 'components', 'sensors', 'parts', 'borrow', 'hardware', 'reserve', 
      'lipo', 'esp32', 'arduino', 'raspberry pi', 'motor driver', 'chassis', 'servo', 'inventory.cicr.in'
    ],
    generate: () => 
`**CICR Hardware Inventory Portal:**
CICR maintains a centralized online inventory system where registered students can browse and reserve electronic components for their robotics and IoT research projects.

Portal URL: [inventory.cicr.in](https://inventory.cicr.in)

**Available Components Include:**
- **Microcontrollers & SOCs**: ESP32, ESP8266, Arduino Uno/Nano/Mega, Raspberry Pi 4, Raspberry Pi Pico
- **Motors & Actuators**: High-torque metal-gear DC motors, NEMA 17 steppers, SG90 & MG996R servos, coreless drone motors
- **Motor Drivers**: L298N, TB6612FNG, Cytron smart drivers, ESCs for brushless motors
- **Sensors**: 2D LiDARs, Ultrasonic (HC-SR04), MPU6050 6-axis IMU, IR line arrays, FPV cameras
- **Power & Batteries**: 3S/4S LiPo batteries, buck/boost converters, regulated power supplies, XT60 connectors`
  },

  // 8. Recruitment & How to Join
  {
    category: 'join',
    triggers: [
      'join', 'join cicr', 'how to join', 'recruit', 'recruitment', 'apply', 'eligibility', 
      'selection', 'interview', 'freshers', '1st year', 'first year', 'register'
    ],
    generate: () => 
`**How to Join CICR:**
- **Eligibility**: Open to all students at **JIIT Sector 128** across all engineering disciplines (CSE, IT, ECE, BioTech) and years (1st, 2nd, 3rd year).
- **Prerequisites**: No prior robotics experience required. We prioritize curiosity, dedication, and hands-on initiative.
- **Induction Process**:
  1. **Online Registration Form**: Released during semester induction drives.
  2. **Hands-on Workshop Sprint**: Interactive problem task testing logic and teamwork.
  3. **Informal Peer Interaction**: Alignment with Technical, Management, or PR & Creative Wings.

Official WhatsApp Community: [CICR Helpdesk Community](https://chat.whatsapp.com/JxQJozp3DRO5eipFBK9Tqd) for recruitment announcements.`
  },

  // 9. Central Robotics Lab Location
  {
    category: 'location',
    triggers: [
      'lab', 'location', 'where is cicr', 'where is the lab', 'address', 'campus', 'room', 'visit lab', 'offline'
    ],
    generate: () => 
`**CICR Robotics Prototyping Lab:**
- **Location**: Jaypee Institute of Information Technology (JIIT), Sector 128, Jaypee Wish Town, Noida, Uttar Pradesh 201304.
- **Lab Facilities**:
  - Precision soldering and rework stations
  - Dual-channel digital storage oscilloscopes (DSO) & regulated bench power supplies
  - In-house Cartesian 3D printers for rapid mechanical chassis fabrication
  - Autonomous rover testing arena with obstacle courses and line tracks
  - High-speed component storage lockers with barcode tracking

Lab sessions operate during designated society hours for active project development.`
  },

  // 10. Certificate Verification
  {
    category: 'certificate',
    triggers: [
      'certificate', 'verify', 'verification', 'credential', 'techtonic certificate', 
      'how to verify certificate', 'certificate id'
    ],
    generate: () => 
`**Official CICR Certificate Verification Portal:**
All certificates issued by CICR for workshops, hackathons, and competitions (such as **TechTonic 2.0**) are digitally verifiable.

- **Direct Verification URL**: \`/certificate/<CERTIFICATE_ID>\` (e.g. \`/certificate/TEC2_CICR_1043\`)
- **Features**:
  - Live cryptographic validation against official records
  - Official recipient name, award track, and issue date
  - Direct full-resolution PDF viewing & high-speed download
  - Shareable verification link for resumes, LinkedIn, and portfolios`
  },

  // 11. Contact & Socials
  {
    category: 'contact',
    triggers: [
      'contact', 'email', 'social', 'instagram', 'linkedin', 'github', 'whatsapp', 'reach out', 'phone'
    ],
    generate: () => 
`**Official CICR Channels & Contact:**
- **WhatsApp Community**: [CICR Helpdesk 2026](https://chat.whatsapp.com/JxQJozp3DRO5eipFBK9Tqd)
- **Instagram**: [@cicr_jiit](https://www.instagram.com/cicr_jiit/)
- **GitHub**: [github.com/CICR-The-Robotics-Hub-of-JIIT-128](https://github.com/CICR-The-Robotics-Hub-of-JIIT-128)
- **LinkedIn**: [CICR on LinkedIn](https://www.linkedin.com/school/jaypee-institute-of-information-technology/)
- **Email**: cicrjiit128noida@gmail.com
- **Hardware Inventory**: [inventory.cicr.in](https://inventory.cicr.in)`
  }
];

/**
 * Intelligent general knowledge & technical responder (zero emojis)
 */
function handleGeneralTopic(query) {
  const q = query.toLowerCase().trim();

  // 1. Coding & Programming
  if (q.includes('python') || q.includes('c++') || q.includes('cpp') || q.includes('arduino code') || q.includes('code to') || q.includes('write code') || q.includes('program for') || q.includes('script for')) {
    if (q.includes('ultrasonic') || q.includes('distance')) {
      return `Here is a reliable **Arduino C++ sketch** to read distances with an **HC-SR04 Ultrasonic Sensor**:

\`\`\`cpp
const int trigPin = 9;
const int echoPin = 10;

void setup() {
  Serial.begin(9600);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
}

void loop() {
  // Clear trigPin
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);

  // Send a 10us ultrasonic pulse
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  // Measure echo pulse travel time in microseconds
  long duration = pulseIn(echoPin, HIGH);

  // Speed of sound is ~343 m/s = 0.0343 cm/us
  // Divide by 2 for round-trip: distance = (duration * 0.034) / 2
  float distanceCm = duration * 0.034 / 2;

  Serial.print("Distance: ");
  Serial.print(distanceCm);
  Serial.println(" cm");

  delay(100);
}
\`\`\`

*Note: At CICR, ultrasonic arrays are integrated with 2D LiDAR on autonomous mobile rovers for real-time obstacle avoidance.*`;
    }

    if (q.includes('motor') || q.includes('l298n')) {
      return `Here is a clean implementation to drive two DC motors using an **L298N Motor Driver** with Arduino:

\`\`\`cpp
// Motor A connections
const int enA = 9;
const int in1 = 8;
const int in2 = 7;

void setup() {
  pinMode(enA, OUTPUT);
  pinMode(in1, OUTPUT);
  pinMode(in2, OUTPUT);
}

void loop() {
  // Move Forward at 80% speed
  digitalWrite(in1, HIGH);
  digitalWrite(in2, LOW);
  analogWrite(enA, 200); // 0 - 255 PWM

  delay(2000);

  // Stop
  digitalWrite(in1, LOW);
  digitalWrite(in2, LOW);
  delay(1000);
}
\`\`\`

*Note: Registered students can reserve L298N drivers and DC motors on [inventory.cicr.in](https://inventory.cicr.in).*`;
    }

    // General Python request
    return `Here is a clean Python example based on your query:

\`\`\`python
import time

def process_stream():
    """Demonstrates real-time telemetry processing."""
    sensors = {"lidar_front": 1.25, "battery_v": 11.4, "status": "NOMINAL"}
    print(f"System State: {sensors['status']} | Battery: {sensors['battery_v']}V")
    return sensors

if __name__ == "__main__":
    process_stream()
\`\`\`

Feel free to specify the exact microcontroller, algorithm, or framework (such as ROS2 nodes or OpenCV pipelines) you need.`;
  }

  // 2. ROS2 & Robotics Middleware
  if (q.includes('ros') || q.includes('ros2') || q.includes('robot operating system')) {
    return `**Robot Operating System 2 (ROS2)** is the industry-standard open-source robotics middleware.

### Core Concepts:
1. **Nodes**: Independent processes executing computation (e.g., sensor acquisition, motion planning).
2. **Topics & Messages**: Asynchronous Publish-Subscribe data bus (e.g., \`/scan\` publishing laser scans).
3. **Services**: Synchronous Request-Response pattern for discrete transactions.
4. **Actions**: Preemptible, goal-oriented tasks with periodic execution feedback.
5. **DDS (Data Distribution Service)**: Decentralized peer-to-peer communication layer eliminating a single point of failure.

At **CICR**, we run **ROS2 Humble** with Nav2 and 2D LiDAR SLAM on autonomous mobile rovers.`;
  }

  // 3. SLAM & Autonomous Navigation
  if (q.includes('slam') || q.includes('mapping') || q.includes('lidar')) {
    return `**SLAM (Simultaneous Localization and Mapping)** is the computational process of constructing or updating a spatial map of an unknown environment while concurrently tracking an agent's pose within it.

### Core Architecture:
1. **Perception**: Laser scans from 2D/3D LiDAR capturing distance metrics at high refresh rates.
2. **Odometry**: Wheel encoders and 6-axis IMUs providing relative dead-reckoning displacement.
3. **Scan Matching**: Iterative Closest Point (ICP) or correlative matchers aligning point clouds with previous frames.
4. **Loop Closure**: Recognizing previously visited areas to eliminate cumulative dead-reckoning drift.

Standard software packages include **Cartographer**, **SLAM Toolbox**, and **Nav2 Costmaps**.`;
  }

  // 4. PID Controller
  if (q.includes('pid') || q.includes('proportional integral')) {
    return `**PID (Proportional-Integral-Derivative) Control** is a closed-loop feedback controller widely utilized in industrial automation and robotics.

### Core Terms:
- **P (Proportional)**: Generates output proportional to the current error value. High values decrease rise time but increase overshoot.
- **I (Integral)**: Accumulates past error over time to eliminate steady-state offsets caused by friction or continuous load.
- **D (Derivative)**: Anticipates future error by tracking the rate of change of error, acting as a dampening factor against oscillations.

$$\\text{Output}(t) = K_p e(t) + K_i \\int_0^t e(\\tau) d\\tau + K_d \\frac{de(t)}{dt}$$

*Note: Tuned PID loops are utilized in CICR high-speed line followers, combat drones, and motor velocity control.*`;
  }

  // 5. ESP32 vs Arduino vs Raspberry Pi
  if (q.includes('esp32') || q.includes('arduino') || q.includes('raspberry pi')) {
    return `### Microcontrollers vs. Single-Board Computers:

| Feature | **Arduino Uno/Nano** | **ESP32** | **Raspberry Pi 4 / 5** |
|---|---|---|---|
| **Type** | 8-bit Microcontroller | 32-bit Dual-Core MCU | Single-Board Computer (Linux) |
| **Clock Speed** | 16 MHz | Up to 240 MHz | 1.5 - 2.4 GHz |
| **Connectivity** | None native | Built-in Wi-Fi + Bluetooth + ESP-NOW | Gigabit Ethernet, Dual Wi-Fi, BT |
| **Best For** | Simple sensors, learning basics | IoT projects, wireless rovers, telemetry | Computer Vision (OpenCV), ROS2, LLM inference |
| **Operating System**| Bare-metal firmware | FreeRTOS / Bare-metal | Debian Linux (Ubuntu / Raspberry Pi OS) |

*All of these are available for reservation on our inventory portal at [inventory.cicr.in](https://inventory.cicr.in).*`;
  }

  // 6. Jokes & Lighthearted
  if (q.includes('joke') || q.includes('funny')) {
    const jokes = [
      "Why did the roboticist bring a ladder to the lab?\nBecause they heard the neural network had too many deep layers.",
      "There are 10 types of people in the world: those who understand binary, and those who do not.",
      "Why was the robot tired after the competition?\nBecause it had a hard drive.",
      "A programmer's spouse asks: 'Could you please go to the store and buy a loaf of bread? And if they have eggs, get a dozen.'\nThe programmer returns with 12 loaves of bread."
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  }

  // 7. General Fallback
  return `I am the **CICR ChatBot**, equipped to assist with questions about **robotics, electronics, algorithms, programming (Python, C++, ROS2), and all technical domains** — as well as everything regarding **CICR (Centre for Innovation, Computing and Robotics)** at JIIT Sector 128.

Feel free to ask for code implementations, hardware explanations, or details regarding our autonomous rovers, team members, events, and projects.`;
}

/**
 * Checks if a query is related to CICR
 */
export function isQueryCICRRelated(query) {
  if (!query || typeof query !== 'string') return false;
  const qClean = cleanQuery(query);

  for (const topic of CORE_CICR_TOPICS) {
    if (topic.triggers.some(t => qClean.includes(t) || query.toLowerCase().includes(t))) return true;
  }

  if (searchTeamMembers(query).length > 0) return true;
  if (searchProjects(query).length > 0) return true;
  if (searchEvents(query).length > 0) return true;

  return false;
}

/**
 * Main Authoritative Answer Engine:
 * 1. Checks team members (50+ individuals in teamData.js)
 * 2. Checks projects catalog (all 13+ projects in projectsData.js)
 * 3. Checks events catalog (eventsData.js)
 * 4. Checks core CICR topics (About, Heads, Faculty, Inventory, Lab, Verification, Recruitment)
 * 5. Intelligently and freely answers general technical/coding/casual topics
 */
export function getAuthoritativeAnswer(userQuery) {
  if (!userQuery || !userQuery.trim()) {
    return "Hello. How can I assist you with CICR robotics, our projects, or technical topics today?";
  }

  const query = userQuery.trim();
  const qClean = cleanQuery(query);
  const qLower = query.toLowerCase();

  // --- Step 1: Check Specific Team Member Query ---
  const memberMatches = searchTeamMembers(query);
  if (memberMatches.length > 0) {
    if (memberMatches.length === 1) {
      return formatMemberCard(memberMatches[0]);
    } else if (memberMatches.length <= 4) {
      return memberMatches.map(m => formatMemberCard(m)).join('\n\n---\n\n');
    }
  }

  // --- Step 2: Check Specific Project Query ---
  const projectMatches = searchProjects(query);
  if (projectMatches.length > 0) {
    if (projectMatches.length === 1) {
      return formatProjectCard(projectMatches[0]);
    } else if (projectMatches.length <= 3) {
      return projectMatches.map(p => formatProjectCard(p)).join('\n\n---\n\n');
    }
  }

  // --- Step 3: Check Specific Event Query ---
  const eventMatches = searchEvents(query);
  if (eventMatches.length > 0) {
    if (eventMatches.length === 1) {
      return formatEventCard(eventMatches[0]);
    } else if (eventMatches.length <= 3) {
      return eventMatches.map(e => formatEventCard(e)).join('\n\n---\n\n');
    }
  }

  // --- Step 4: Check Core Topics ---
  let bestTopic = null;
  let highestScore = 0;

  for (const topic of CORE_CICR_TOPICS) {
    let score = 0;
    for (const trig of topic.triggers) {
      if (qClean.includes(trig) || qLower.includes(trig)) {
        score += trig.length * (trig.includes(' ') ? 3 : 1);
        if (qClean === trig || qLower === trig) score += 50;
      }
    }
    if (score > highestScore) {
      highestScore = score;
      bestTopic = topic;
    }
  }

  if (highestScore > 0 && bestTopic) {
    return bestTopic.generate();
  }

  // --- Step 5: Versatile, Open General Technical & Conversational Handling ---
  return handleGeneralTopic(query);
}
