// Projects Catalog - Real Robotics, AI & IoT Innovations developed at CICR JIIT-128
export const projectsCatalog = [
  {
    id: 'skully-animatronic-robo',
    title: 'Skully',
    subtitle: 'Animatronic Robo',
    category: 'Robotics',
    tags: ['Robotics', 'Computer Vision', 'Embedded AI'],
    description:
      'An expressive animatronic robotic head designed for lifelike human interaction. Built with 10 precision servo motors for natural facial articulation and jaw movement, powered by an NVIDIA Jetson Orin Nano with depth-sensing vision to follow and respond to people in real time.',
    image: '/projects/skully.jpg',
    highlights: ['NVIDIA Jetson Orin Nano', 'Intel RealSense Depth Camera', '10x Precision Servos', 'ESP32 Control'],
    achievement: 'Selected among Top 10 in CircuitDigest Smart Home and Wearables Contest 2025',
    status: 'Flagship'
  },
  {
    id: 'jarvis-interactive-ai',
    title: 'J.A.R.V.I.S',
    subtitle: 'The Interactive AI Face',
    category: 'Artificial Intelligence',
    tags: ['AI Host', 'Face Recognition', 'Voice AI'],
    description:
      'A charming interactive AI companion that greeted visitors by name at Converge 2026. Equipped with high-speed facial recognition and real-time conversational intelligence, it engages in witty banter, answers questions, and guides guests through campus events.',
    image: '/projects/jarvis.jpg',
    highlights: ['Groq Fast LLM', 'DeepFace + FAISS Vector DB', 'Sarvam AI STT & TTS', 'Silero VAD'],
    achievement: 'Featured interactive AI Host at Converge 2026',
    status: 'Completed'
  },
  {
    id: 'find-my-book-smart-library',
    title: 'Find My Book',
    subtitle: 'AI & IoT Smart Library Navigation System',
    category: 'IoT',
    tags: ['IoT', 'RFID', 'Smart Navigation'],
    description:
      'A smart library assistant that takes the frustration out of finding books. Combines RFID shelf tracking with illuminated shelf guides and a touch kiosk, letting readers pinpoint exact book locations in seconds while providing automated checkouts.',
    image: '/projects/find-my-book.jpg',
    highlights: ['ESP32-S3 Box 3', 'Raspberry Pi Backend', 'RFID Issuing & Anti-Theft', 'Touchscreen Kiosk'],
    achievement: 'Secured 2nd Position in CircuitDigest Contest 2025 (Won ₹70,000)',
    status: 'Award Winning'
  },
  {
    id: 'deque-smart-rfid-payment',
    title: 'Deque',
    subtitle: 'Smart RFID Payment System',
    category: 'IoT',
    tags: ['Smart Retail', 'Computer Vision', 'RFID'],
    description:
      'A cashier-less smart checkout system designed to eliminate retail queues. Shoppers simply pass through the terminal where RFID readers instantly tally their basket, paired with computer vision verification to make shopping quick, seamless, and secure.',
    image: '/projects/deque.jpg',
    highlights: ['Raspberry Pi 4', 'Pi Camera V2', 'YOLOv5 Passenger Detection', 'Node.js & MongoDB'],
    achievement: 'Secured 3rd Place at HACKIN\'WINTER by DSC-JIIT62',
    status: 'Award Winning'
  },
  {
    id: 'payload-delivery-drone',
    title: 'Payload Delivery Drone',
    subtitle: 'Autonomous Aerial Delivery Quadcopter',
    category: 'Avionics',
    tags: ['Quadcopter', 'Avionics', 'Autonomous Flight'],
    description:
      'An autonomous cargo quadcopter engineered for reliable point-to-point delivery. Built on an F450 frame with GPS waypoint autopilot, fail-safe return-to-home navigation, and a servo gripper that safely carries and drops small payloads on target.',
    image: '/projects/payload-drone.jpg',
    highlights: ['Pixhawk Autopilot', 'GPS & Compass Navigation', 'DJI 920Kv Motors', 'Servo Gripper Mechanism'],
    achievement: 'Autonomous Aerial Delivery Platform',
    status: 'Active'
  },
  {
    id: 'diy-ambient-light-tv',
    title: 'DIY Ambient Light TV',
    subtitle: 'Dynamic Real-Time TV Backlight System',
    category: 'Hardware',
    tags: ['Hardware', 'LED System', 'Signal Processing'],
    description:
      'An immersive home theatre backlight system that brings movies and games to life. Uses a Raspberry Pi with addressable LED strips and real-time HDMI video capture to cast screen-matching ambient light across the room at a smooth 60 frames per second.',
    image: '/projects/ambient-tv.jpg',
    highlights: ['Raspberry Pi Controller', 'WS2812B Addressable LEDs', 'Hyperion Signal Engine', 'HDMI Capture at 60 FPS'],
    achievement: 'Custom Immersive Media System',
    status: 'Completed'
  },
  {
    id: 'cartesian-3d-printer',
    title: 'Cartesian 3D Printer',
    subtitle: 'Modular Rapid Prototyping Machine',
    category: 'Digital Fabrication',
    tags: ['3D Printing', 'CAD Design', 'Precision Control'],
    description:
      'A modular, custom-engineered Cartesian 3D printer built from the ground up for the CICR lab. Designed in CAD with a rigid interlocking structure, precision stepper motors, and open-source control electronics for dependable rapid prototyping.',
    image: '/projects/cartesian-3d-printer.jpg',
    highlights: ['Arduino Mega 2560', 'RAMPS 1.4 Controller', 'CAD Modular Chassis', 'Multi-Axis Steppers'],
    achievement: 'In-House Rapid Prototyping System',
    status: 'Operational'
  },
  {
    id: 'iot-smart-switch-system',
    title: 'IoT Smart Switch System',
    subtitle: 'Dual-Control Home Automation System',
    category: 'IoT',
    tags: ['IoT', 'Home Automation', 'Mobile App'],
    description:
      'A practical smart home switch that blends tradition with modern convenience. It allows effortless control of room lighting and appliances both from familiar physical wall switches and remotely via a custom mobile app over Wi-Fi.',
    image: '/projects/smart-switch.jpg',
    highlights: ['ESP8266 Wi-Fi Module', '8-Channel Relay Module', 'Custom Mobile Application', 'Dual Manual & Remote Mode'],
    achievement: 'Sustainable Smart Home Automation',
    status: 'Completed'
  },
  {
    id: 'chikitsaarm-vr-simulation',
    title: 'ChikitsaArm',
    subtitle: 'Gesture Driven Robotic Arm Simulation in VR',
    category: 'Virtual Reality',
    tags: ['Virtual Reality', 'Robotics', 'Motion Tracking'],
    description:
      'A gesture-controlled robotic arm simulation designed for medical and training applications. Using a smart sensor glove that mirrors natural hand movements, users can intuitively manipulate a virtual robotic arm inside Unreal Engine in real time.',
    image: '/projects/chikitsaarm.jpg',
    highlights: ['ESP32 Wi-Fi Microcontroller', 'Unreal Engine VR Simulator', 'MPU6050 6-DOF IMU', 'Flex Sensor Array'],
    achievement: 'Medical Training VR Simulation Prototype',
    status: 'Active'
  },
  {
    id: 'technogrow-hydroponic-system',
    title: 'TechnoGrow',
    subtitle: 'Solar-Powered Hydroponic Farming System',
    category: 'IoT',
    tags: ['IoT', 'Hydroponics', 'Solar Energy', 'Python Dashboard'],
    description:
      'A solar-powered hydroponic farming system that grows fresh produce in nutrient-rich water without soil. It constantly monitors climate conditions with IoT sensors and automates nutrient circulation, all visible through an interactive Python dashboard.',
    image: '/projects/technogrow.jpg',
    highlights: ['Solar-Powered Clean Energy', 'Soil-less Hydroponic Rig', 'Python Live Dashboard', 'Automated Water Circulation'],
    achievement: 'Automated Solar Smart Agriculture System',
    status: 'Completed'
  },
  {
    id: 'gesture-controlled-car',
    title: 'Gesture Controlled Car',
    subtitle: 'Hand-Motion Actuated Robotic Vehicle',
    category: 'Robotics',
    tags: ['Robotics', 'Gesture Control', 'Wireless RF', 'Embedded Systems'],
    description:
      'A responsive robotic car steered entirely with natural hand tilts using a sensor glove. Wireless signals translate hand motions into instant forward, reverse, and turning maneuvers, with ultrasonic sensing to prevent accidental collisions.',
    image: '/projects/gesture-controlled-car.jpg',
    highlights: ['Gyroscope Gesture Glove', 'Low-Latency Wireless Link', 'Ultrasonic Collision Guard', 'Real-Time Motor Response'],
    achievement: 'Intuitive Hands-Free Robotics Platform',
    status: 'Completed'
  },
  {
    id: 'esp32-minidrone',
    title: 'ESP32 Minidrone',
    subtitle: 'Custom PCB Micro-Quadcopter',
    category: 'Avionics',
    tags: ['Avionics', 'Custom PCB', 'ESP32', 'Micro-Quadcopter'],
    description:
      'A pocket-sized micro-quadcopter built directly on a custom circuit board that doubles as both the electronics hub and structural frame. Powered by an ESP32 and precision 6-axis gyro, it delivers agile and stable indoor flight.',
    image: '/projects/esp32-minidrone.jpg',
    highlights: ['Custom Integrated PCB Frame', 'ESP32 Microcontroller', 'MPU6050 6-Axis Gyro', 'High-RPM Coreless DC Motors'],
    achievement: 'Ultra-Compact Custom PCB Drone',
    status: 'Completed'
  },
  {
    id: 'smart-iot-home-water-management',
    title: 'Smart IoT Home & Water Automation',
    subtitle: 'Dual-Control Web Automation & Tank Management',
    category: 'IoT',
    tags: ['IoT', 'Home Automation', 'ESP8266', 'Water Management'],
    description:
      'An intelligent home management system combining Wi-Fi appliance control with automated water conservation. Residents can toggle lights from a mobile web dashboard while ultrasonic tank sensors prevent dry runs and overflow automatically.',
    image: '/projects/smart-iot-home-automation.jpg',
    highlights: ['ESP8266 Wi-Fi Core', 'Ultrasonic Tank Level Sensing', 'Mobile Web Dashboard', 'Automated Pump Protection'],
    achievement: 'Dual-Mode Home & Water Automation System',
    status: 'Completed'
  }
];
