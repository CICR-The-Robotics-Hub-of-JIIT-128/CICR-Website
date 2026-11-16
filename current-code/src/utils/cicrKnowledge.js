/**
 * Authoritative CICR Knowledge Base & Strict Boundary Enforcement Engine
 * Restricted strictly to CICR (Centre for Innovation, Computing and Robotics) at JIIT-128.
 */

export const CICR_REFUSAL_MESSAGE = 
`⚠️ **Restricted to CICR Topics Only**

I am the dedicated **CICR AI Assistant**, strictly limited to answering questions regarding **CICR (Centre for Innovation, Computing and Robotics)** at JIIT Sector 128, Noida.

I cannot answer general knowledge, homework, non-CICR programming, or unrelated topics.

**You can ask me about:**
- 🤖 **CICR Robotics Projects** (Autonomous Rovers, FPV Drones, Combat Bots, ROS2)
- 👨‍🏫 **Faculty Coordinators** (Dr. Harish Bishwakarma & Prof. Parul Arora)
- 🏆 **Heads & Leadership** (Yasharth Singh, Aryan Varshney, Dhruvi Gupta, Ashutosh, Aman, Vanshik, Ankit)
- 👥 **Team Members** (Core Team, Volunteers, Harshil Gupta, Dev Maheshwari, Priyanshi, etc.)
- 🔌 **Hardware Inventory** (Reserving sensors, motors, and boards at [inventory.cicr.in](https://inventory.cicr.in))
- 📅 **Events & Bootcamps** (TechTonic 3.0, Drono-o-war 1.0, Robo-Soccer, Circuit Rush)
- 🚀 **How to Join & Recruitment** (Official WhatsApp Community link)
- 📍 **CICR Robotics Lab** (Location at JIIT Sector 128, Noida)`;

export const CICR_KNOWLEDGE_BASE = [
  // 1. Harshil Gupta
  {
    category: 'harshil',
    keywords: ['harshil', 'harshil gupta', 'harshil_techz'],
    response: 
`**Harshil Gupta**
- **Role**: Volunteer, Technical Wing at CICR
- **Motto**: *"Life doesn't care about your potential. Deliver or disappear 💀."*
- **Profile**: Dedicated student engineer and roboticist at JIIT-128, actively contributing to autonomous rovers, hardware assembly, and algorithmic problem-solving.
- **Profiles & Links**:
  - 💼 [LinkedIn Profile](https://www.linkedin.com/in/harshilgupta1/)
  - 💻 [GitHub Repository](https://github.com/harshilgupta926/hg)
  - ⚡ [LeetCode Profile](https://leetcode.com/u/Harshil_Techz/)`
  },

  // 2. Dev Maheshwari
  {
    category: 'dev_maheshwari',
    keywords: ['dev maheshwari', 'maheshwari'],
    response: 
`**Dev Maheshwari**
- **Role**: Core Team Member, PR & Creative Wing at CICR
- **Profile**: Leads visual branding, social campaign production, and creative storytelling for CICR at JIIT-128.
- **Profiles & Links**:
  - 💼 [LinkedIn Profile](https://www.linkedin.com/in/dev-maheshwari-/)
  - 💻 [GitHub Repository](https://github.com/dev-complies)`
  },

  // 3. Yasharth Singh
  {
    category: 'yasharth',
    keywords: ['yasharth', 'yasharth singh'],
    response: 
`**Yasharth Singh**
- **Role**: Head, Technical Wing at CICR
- **Domain**: Developer / Software Engineer & Robotics Firmware
- **Profile**: Heads technical architectures, embedded systems development, and competitive engineering initiatives at CICR.
- **Profiles & Links**:
  - 💼 [LinkedIn Profile](https://www.linkedin.com/in/yasharth-singh-b2493b284/)
  - 💻 [GitHub Profile](https://github.com/yasharth-0910)`
  },

  // 4. Aryan Varshney
  {
    category: 'aryan',
    keywords: ['aryan', 'aryan varshney'],
    response: 
`**Aryan Varshney**
- **Role**: Head, Technical Wing at CICR
- **Specialization**: Autonomous Robotics & Hardware Systems
- **Profile**: Leads hands-on robotics workshops, rover development, and technical team mentoring at JIIT-128.
- **Profiles & Links**:
  - 💼 [LinkedIn Profile](https://www.linkedin.com/in/aryan-varshney/)`
  },

  // 5. Dhruvi Gupta
  {
    category: 'dhruvi',
    keywords: ['dhruvi', 'dhruvi gupta'],
    response: 
`**Dhruvi Gupta**
- **Role**: Head, Technical Wing at CICR
- **Specialization**: Robotics Software & Systems Engineering
- **Profile**: Drives technical design, robotics project management, and inter-collegiate event execution.
- **Profiles & Links**:
  - 💼 [LinkedIn Profile](https://www.linkedin.com/in/dhruvi-gupta/)`
  },

  // 6. Ashutosh Vishwakarma
  {
    category: 'ashutosh',
    keywords: ['ashutosh', 'ashutosh vishwakarma', 'aboutashutosh'],
    response: 
`**Ashutosh Vishwakarma**
- **Role**: Head, Technical Wing at CICR
- **Specialization**: Embedded Robotics & System Architecture
- **Profiles & Links**:
  - 💼 [LinkedIn Profile](https://www.linkedin.com/in/aboutashutosh/)`
  },

  // 7. Aman Gandotra
  {
    category: 'aman',
    keywords: ['aman', 'aman gandotra', 'amangandotra'],
    response: 
`**Aman Gandotra**
- **Role**: Head, Technical Wing at CICR
- **Specialization**: Robotics Hardware & Embedded Control
- **Profiles & Links**:
  - 💼 [LinkedIn Profile](https://www.linkedin.com/in/amangandotra/)`
  },

  // 8. Vanshik Jain
  {
    category: 'vanshik',
    keywords: ['vanshik', 'vanshik jain', 'vanshik02'],
    response: 
`**Vanshik Jain**
- **Role**: Head, Technical Wing at CICR
- **Specialization**: Robotics Engineering & Control
- **Profiles & Links**:
  - 💼 [LinkedIn Profile](https://www.linkedin.com/in/vanshik-jain-8288b830a/)
  - 💻 [GitHub Profile](https://github.com/Vanshik02)`
  },

  // 9. Ankit Sharma
  {
    category: 'ankit',
    keywords: ['ankit', 'ankit sharma'],
    response: 
`**Ankit Sharma**
- **Role**: Head, Technical Wing at CICR
- **Specialization**: Hardware Integration, Electronics & Circuit Prototyping
- **Profiles & Links**:
  - 💼 [LinkedIn Profile](https://www.linkedin.com/in/ankit-sharma128/)`
  },

  // 10. Priyanshi Saini
  {
    category: 'priyanshi',
    keywords: ['priyanshi', 'priyanshi saini'],
    response: 
`**Priyanshi Saini**
- **Role**: Core Team Member at CICR
- **Profile**: Active member driving technical robotics projects, embedded circuits, and society initiatives at JIIT Sector 128.`
  },

  // 11. Dr. Harish Bishwakarma
  {
    category: 'dr_harish',
    keywords: ['harish', 'dr harish', 'harish bishwakarma', 'dr. harish'],
    response: 
`**Dr. Harish Bishwakarma**
- **Role**: Faculty Coordinator, CICR
- **Designation**: Assistant Professor (Senior Grade), Department of Mechanical Engineering, JIIT-128
- **Research & Expertise**: Nanocomposites, additive manufacturing / 3D printing, kinematics, and energy storage systems.
- **Guidance at CICR**: Mentors student roboticists in mechanical structural design, rapid prototyping, and engineering rigor for national robotics competitions.`
  },

  // 12. Prof. Parul Arora
  {
    category: 'prof_parul_arora',
    keywords: ['parul', 'parul arora', 'prof parul', 'prof. parul arora', 'dr parul', 'dr. parul'],
    response: 
`**Prof. Parul Arora**
- **Role**: Faculty Coordinator, CICR
- **Designation**: Faculty Coordinator, JIIT Sector 128
- **Guidance at CICR**: Mentors CICR on academic curriculum alignment, inter-collegiate engineering competitions, research publications, and society growth.`
  },

  // 13. All Heads Summary
  {
    category: 'heads_list',
    keywords: ['head', 'heads', 'leadership', 'leads', 'who are the heads', 'lead team'],
    response: 
`**CICR Heads (Session 2025–2026):**
In official hierarchy order:
1. ⚡ **Yasharth Singh** – Head, Technical Wing
2. 🇮🇳 **Aryan Varshney** – Head, Technical Wing
3. 🤖 **Dhruvi Gupta** – Head, Technical Wing
4. ⚙️ **Ashutosh Vishwakarma** – Head, Technical Wing
5. 🚀 **Aman Gandotra** – Head, Technical Wing
6. 🔬 **Vanshik Jain** – Head, Technical Wing
7. 💡 **Ankit Sharma** – Head, Technical Wing

Our Heads oversee all engineering projects, masterclasses, hardware inventory, and national robotics delegations.`
  },

  // 14. Faculty Summary
  {
    category: 'faculty_summary',
    keywords: ['faculty', 'coordinator', 'coordinators', 'mentor', 'prof', 'professor', 'teachers'],
    response: 
`**CICR Faculty Coordinators:**
1. **Dr. Harish Bishwakarma** – Assistant Professor (Senior Grade), Department of Mechanical Engineering, JIIT-128
2. **Prof. Parul Arora** – Faculty Coordinator, JIIT-128

Both faculty mentors guide CICR students with academic alignment, technical lab governance, and collegiate research support.`
  },

  // 15. About CICR
  {
    category: 'about',
    keywords: [
      'about', 'what is cicr', 'who are you', 'society', 'club', 'hub', 'full form', 
      'centre for innovation', 'jiit 128', 'robotics society', 'tell me about cicr', 'introduce'
    ],
    response: 
`**CICR (Centre for Innovation, Computing and Robotics)** is the premier student-run robotics society of **Jaypee Institute of Information Technology (JIIT), Sector 128, Noida**.

We specialize in designing, engineering, and deploying autonomous robotic systems, aerial combat drones, high-torque battlebots, computer vision algorithms, and embedded IoT architectures from first principles.

**Core Wings:**
- 🛠️ **Technical Wing**: Embedded hardware, firmware, autonomous navigation (ROS2/SLAM), and mechanical/CAD prototyping.
- 📊 **Management Wing**: Event orchestration, corporate sponsorships, and operations.
- 🎨 **PR & Creative Wing**: Digital identity, video documentaries, social campaigns, and brand storytelling.`
  },

  // 16. Team Structure
  {
    category: 'team_roster',
    keywords: ['team', 'members', 'core team', 'volunteers', 'roster', 'how many members', 'wings'],
    response: 
`**CICR Team Structure (Session 2025–2026):**
- 👨‍🏫 **Faculty Coordinators (2)**: Dr. Harish Bishwakarma & Prof. Parul Arora
- 🏆 **Heads (7)**: Yasharth Singh, Aryan Varshney, Dhruvi Gupta, Ashutosh Vishwakarma, Aman Gandotra, Vanshik Jain, Ankit Sharma
- 👥 **Core Team (24)**: Senior engineers driving robotics systems and creative initiatives (including Dev Maheshwari, Priyanshi Saini, Palash Mittal, Pulkit Sukhija, etc.)
- 🌟 **Volunteers (23)**: Energetic 1st and 2nd year students (including Harshil Gupta, Dev Garg, Chetan Sharma, Ishita, etc.)

Check the **Team** page to explore every member's profile, role, and social links!`
  },

  // 17. Recruitment / How to Join
  {
    category: 'join',
    keywords: [
      'join', 'recruit', 'recruitment', 'how to join', 'apply', 'eligibility', 
      'selection', 'interview', 'fresher', 'freshers', '1st year', 'first year', 'register', 'membership'
    ],
    response: 
`**How to Join CICR:**
- **Eligibility**: Open to students across **all engineering disciplines** (CSE, IT, ECE, BioTech) at **JIIT Sector 128**.
- **Prerequisites**: No prior robotics experience required! We value passion, curiosity, and consistency.
- **Induction Process**:
  1. 📝 Submit online registration form during our induction drives.
  2. 🛠️ Hands-on beginner technical workshop & problem task.
  3. 💬 Informal peer interaction & wing assignment.

👉 **Join our official WhatsApp Community**: [CICR Helpdesk WhatsApp](https://chat.whatsapp.com/JxQJozp3DRO5eipFBK9Tqd?s=cl&p=a&iam=2) to get instant updates on recruitment rounds!`
  },

  // 18. Hardware Inventory
  {
    category: 'inventory',
    keywords: [
      'inventory', 'components', 'sensors', 'parts', 'borrow', 'hardware', 
      'lipo', 'esp32', 'arduino', 'raspberry pi', 'motor driver', 'chassis', 'servo', 'battery', 'reserve'
    ],
    response: 
`**CICR Hardware Inventory Portal:**
CICR runs a centralized hardware inventory system where registered students can browse and reserve electronics components for robotics research.

🔗 **Access Portal**: [inventory.cicr.in](https://inventory.cicr.in)

**Available Components Include:**
- **Microcontrollers**: ESP32, Arduino Uno/Nano, Raspberry Pi 4
- **Motor Drivers**: L298N, TB6612FNG, Cytron Smart Drivers
- **Sensors**: 2D LiDARs, Ultrasonic, MPU6050 Gyro/Accel, Line tracking sensors, FPV camera links
- **Power**: 3S/4S LiPo batteries, buck-boost converters, XT60 harnesses
- **Actuators**: High-torque planetary DC geared motors, SG90/MG996R servos`
  },

  // 19. Projects
  {
    category: 'projects',
    keywords: [
      'project', 'projects', 'rover', 'rovers', 'drone', 'drones', 'bot', 'bots', 
      'combat', 'autonomous', 'slam', 'ros2'
    ],
    response: 
`**Flagship CICR Robotics Projects:**
- 🏎️ **Autonomous Mobile Rovers**: 4-wheel differential & Mecanum rovers equipped with 2D LiDAR SLAM, ROS2 Humble, and real-time obstacle avoidance.
- 🛸 **FPV Combat Drones**: Carbon-fiber quadcopters with Pixhawk flight controllers, 5.8GHz video telemetry, and high-G agility.
- ⚽ **Robo-Soccer 2v2 Bots**: Fast wireless Bluetooth/ESP-NOW striker bots engineered for high acceleration and precision ball dribbling.
- ⚡ **Circuit Rush PID Rovers**: High-speed line and maze navigators utilizing analog sensor arrays and closed-loop PID control.`
  },

  // 20. Events & Workshops
  {
    category: 'events',
    keywords: [
      'event', 'events', 'workshop', 'workshops', 'masterclass', 'bootcamp', 
      'techtonic', 'drono-war', 'drono-o-war', 'competition', 'hackathon'
    ],
    response: 
`**CICR Events & Masterclasses:**
- 🏆 **TechTonic Series**: Intensive 3-day robotics masterclass covering ROS2, circuit fabrication, sensor fusion, and live arena racing.
- ⚔️ **Drono-o-war 1.0**: Collegiate aerial drone slalom and precision combat championship.
- ⚽ **Robo Soccer 2v2**: High-adrenaline remote combat soccer tournament.
- ⚡ **Circuit Rush**: High-speed autonomous obstacle & line following challenge.

Click the **Events** tab on the navigation bar to see recent photo galleries and announcements!`
  },

  // 21. Specific Event: TechTonic
  {
    category: 'event_techtonic',
    keywords: ['techtonic', 'techtonic 3.0'],
    response: 
`**TechTonic 3.0: Autonomous Robotics & Embedded Bootcamp**
TechTonic is CICR's signature multi-day robotics masterclass where participants build, wire, program, and race autonomous mobile bots from scratch with mentor support.
- Topics covered: Microcontroller architecture, motor driver circuits, analog sensor arrays, and PID control algorithms.`
  },

  // 22. Specific Event: Drono-o-war
  {
    category: 'event_dronowar',
    keywords: ['drono-o-war', 'drono-war', 'drono', 'drone combat'],
    response: 
`**Drono-o-war 1.0: FPV Drone Combat & Slalom Challenge**
CICR's premier aerial competition featuring custom quadcopters navigating tight obstacle courses and engaging in dogfight challenges with low-latency FPV video links.`
  },

  // 23. Central Lab Location
  {
    category: 'location',
    keywords: [
      'lab', 'location', 'where', 'address', 'campus', 'room', 'offline', 'where is cicr', 'visit'
    ],
    response: 
`**CICR Robotics Lab Location:**
📍 **Jaypee Institute of Information Technology (JIIT)**  
Sector 128, Jaypee Wish Town, Noida, Uttar Pradesh 201304

Our physical lab features electronics workbenches, soldering stations, regulated bench power supplies, 3D printers, testing tracks, and component lockers. Visit during society hours to explore active builds!`
  },

  // 24. Contact & Socials
  {
    category: 'contact',
    keywords: [
      'contact', 'email', 'social', 'instagram', 'linkedin', 'github', 'whatsapp', 'reach', 'phone'
    ],
    response: 
`**Official CICR Channels:**
- 💬 **WhatsApp Community**: [CICR Helpdesk 2026](https://chat.whatsapp.com/JxQJozp3DRO5eipFBK9Tqd?s=cl&p=a&iam=2)
- 📸 **Instagram**: [@cicr_jiit](https://www.instagram.com/cicr_jiit/)
- 💻 **GitHub**: [github.com/CICR-The-Robotics-Hub-of-JIIT-128](https://github.com/CICR-The-Robotics-Hub-of-JIIT-128)
- 💼 **LinkedIn**: [CICR on LinkedIn](https://www.linkedin.com/school/jaypee-institute-of-information-technology/)
- 📧 **Email**: cicrjiit128noida@gmail.com
- 📦 **Inventory**: [inventory.cicr.in](https://inventory.cicr.in)`
  },

  // 25. Robotics Technical Concepts at CICR
  {
    category: 'tech_concepts',
    keywords: [
      'ros', 'ros2', 'slam', 'pid', 'lidar', 'esp-now', 'micro-ros', 'firmware', 'kinematics', 'cad', '3d printing'
    ],
    response: 
`**Robotics Technologies Used at CICR:**
- **ROS2 Humble & Nav2**: Core robotics middleware for autonomous path planning, costmaps, and node communication.
- **2D LiDAR SLAM**: Simultaneous Localization and Mapping for indoor rover autonomy.
- **PID Control**: Proportional-Integral-Derivative feedback loops for motor velocity and heading correction.
- **micro-ROS & ESP-NOW**: Ultra-low-latency wireless mesh communication between embedded microcontrollers and central rovers.`
  },

  // 26. Greetings
  {
    category: 'greetings',
    keywords: [
      'hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening', 'sup'
    ],
    response: 
`👋 Hello! I'm the **CICR AI Assistant**. 

I am strictly specialized in everything related to **CICR (Centre for Innovation, Computing and Robotics)** at JIIT-128.

How can I help you explore our robotics projects, team members, faculty coordinators, hardware inventory, or upcoming events today?`
  },

  // 27. Help & Capabilities
  {
    category: 'help',
    keywords: ['help', 'what can you do', 'guide', 'commands', 'options'],
    response: 
`**What I can help you with:**
- 🤖 **CICR Robotics Projects**: Rovers, combat drones, Robo-Soccer, PID bots
- 👨‍🏫 **Faculty Coordinators**: Dr. Harish Bishwakarma & Prof. Parul Arora
- 🏆 **Heads & Leadership**: Yasharth, Aryan, Dhruvi, Ashutosh, Aman, Vanshik, Ankit
- 👥 **Team Members**: Harshil Gupta, Dev Maheshwari, Priyanshi, and the core team
- 🔌 **Hardware Inventory**: Browse & reserve components at [inventory.cicr.in](https://inventory.cicr.in)
- 🚀 **Join CICR**: WhatsApp link & recruitment guidance
- 📍 **Robotics Lab**: Location at JIIT Sector 128, Noida

*Note: My scope is strictly restricted to CICR topics.*`
  }
];

// Explicit non-CICR forbidden topic patterns
const FORBIDDEN_PATTERNS = [
  /\bcapital of\b/i,
  /\bprime minister\b/i,
  /\bpresident of\b/i,
  /\bweather in\b/i,
  /\bwrite an essay\b/i,
  /\bwrite a poem\b/i,
  /\btell me a joke\b/i,
  /\brecipe for\b/i,
  /\bhow to cook\b/i,
  /\bmovie review\b/i,
  /\bcricket score\b/i,
  /\bwho won the\b/i,
  /\bsolve (this|\d+)\b/i,
  /\bcalculate\b/i,
  /\btranslate to\b/i,
  /\bsong lyrics\b/i,
  /\bpython code to\b/i,
  /\bwrite (code|program|script) for\b/i,
  /\bhack (a |the )?website\b/i,
  /\bwho is elon musk\b/i,
  /\bbitcoin\b/i,
  /\bcrypto\b/i,
  /\bstock market\b/i
];

/**
 * Checks if a query is strictly related to CICR
 */
export function isQueryCICRRelated(query) {
  if (!query || typeof query !== 'string') return false;
  const q = query.toLowerCase().trim();

  // If matches forbidden phrases, reject immediately
  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(q)) return false;
  }

  // Check against knowledge base keywords
  for (const entry of CICR_KNOWLEDGE_BASE) {
    if (entry.keywords.some(kw => q.includes(kw))) {
      return true;
    }
  }

  return false;
}

/**
 * Finds the most authoritative answer or strictly declines if off-topic
 */
export function getAuthoritativeAnswer(userQuery) {
  if (!userQuery || !userQuery.trim()) {
    return CICR_REFUSAL_MESSAGE;
  }

  const query = userQuery.toLowerCase().trim();

  // Immediate block if strictly forbidden pattern
  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(query)) {
      return CICR_REFUSAL_MESSAGE;
    }
  }

  // Find best match with scoring based on keyword specificity
  let bestEntry = null;
  let highestScore = 0;

  for (const entry of CICR_KNOWLEDGE_BASE) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (query.includes(kw)) {
        // Multi-word matches score significantly higher than single words
        const isMultiWord = kw.includes(' ');
        score += kw.length * (isMultiWord ? 3 : 1);
        if (query === kw) score += 100;
        else if (query.startsWith(kw) || query.endsWith(kw)) score += 20;
      }
    }
    if (score > highestScore) {
      highestScore = score;
      bestEntry = entry;
    }
  }

  // Strict boundary: Only return answer if high confidence match found
  if (highestScore > 0 && bestEntry) {
    return bestEntry.response;
  }

  // If no match found, strictly refuse and direct user to CICR topics
  return CICR_REFUSAL_MESSAGE;
}
