// Projects Catalog - Real Robotics, AI & IoT Innovations developed at CICR JIIT-128
export const projectsCatalog = [
  {
    id: 'skully-animatronic-robo',
    title: 'Skully',
    subtitle: 'Animatronic Robo',
    category: 'Robotics',
    tags: ['Robotics', 'Computer Vision', 'Embedded AI'],
    description:
      'An expressive animatronic robotic skull engineered for natural human-robot interaction. Features 10 precision servo motors coordinating lifelike jaw, eye, and neck articulation. Driven by an NVIDIA Jetson Orin Nano with RealSense depth vision and embedded AI neural nets to track faces, mimic gaze, and respond interactively in real time.',
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
      'A charismatic interactive AI companion that welcomed guests and dignitaries by name at Converge 2026. Powered by ultra-low-latency Groq LLM inference, DeepFace facial recognition, and FAISS vector indexing, it engages in dynamic vocal conversations, campus navigation assistance, and context-aware event guidance.',
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
      'An award-winning smart library navigation and cataloging assistant that eliminates the hassle of locating physical books. Combines high-frequency RFID shelf antennas, dynamic LED shelf indicators, and an intuitive touchscreen kiosk, providing readers with instant 3D shelf directions and automated self-checkout.',
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
      'A frictionless cashier-less retail checkout terminal engineered to eradicate shopping queues. Customers walk through an automated scanning portal where multi-tag RFID arrays instantly tally items in the basket, while overhead computer vision and YOLOv5 algorithms verify contents for swift, fraud-free transactions.',
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
      'A heavy-lift autonomous cargo quadcopter designed for precision emergency and campus delivery missions. Built on a reinforced F450 frame with Pixhawk flight controller, dual-frequency GPS waypoint autopilot, fail-safe return-to-home navigation, and an electronic quick-release servo gripper for safe drop-offs.',
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
      'An immersive visual synchronization system that projects screen-matching ambient backlighting onto surrounding walls. Utilizes a dedicated Raspberry Pi, WS2812B individually addressable LED arrays, and zero-latency HDMI hardware capture to compute and render 60 FPS dynamic color fields that expand the viewing experience.',
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
      'A rigid, high-precision Cartesian 3D printer designed and fabricated entirely in-house for the CICR prototyping lab. Built with a custom laser-cut interlocking chassis, dual Z-axis NEMA 17 stepper motors, an all-metal hotend, and RAMPS 1.4 firmware for reliable rapid prototyping of robotics parts and brackets.',
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
      'A robust smart infrastructure controller bridging legacy physical electrical installations with modern wireless convenience. Features an 8-channel optocoupled relay system driven by an ESP8266, enabling independent control of home appliances via physical wall switches, MQTT cloud synchronization, and a custom mobile app.',
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
      'A high-fidelity gesture-controlled robotic arm simulation environment developed for medical and surgical training. Worn sensor gloves with MPU6050 6-axis IMUs and flex sensors transmit micro-movements with sub-millisecond latency to replicate articulate robotic arm maneuvers inside an interactive Unreal Engine physics world.',
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
      'An automated, solar-powered vertical hydroponic farm that produces fresh organic crops using closed-loop nutrient circulation. Integrates ESP32 telemetry, water EC and pH probes, ambient environmental sensors, and an interactive real-time Python dashboard for complete data-driven precision agriculture.',
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
      'A responsive acrobatic robotic rover navigated completely through natural hand gestures and wrist orientation. A transmitter glove outfitted with a 3-axis gyroscope and accelerometer broadcasts motion packets via RF links to an onboard differential motor driver, coupled with ultrasonic collision avoidance.',
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
      'An ultra-compact palm-sized micro-quadcopter where the 4-layer custom PCB serves simultaneously as the structural airframe and electrical circuit. Powered by a dual-core ESP32, high-RPM brushed coreless motors, and a fine-tuned PID stabilization loop utilizing an MPU6050 6-axis gyro for agile indoor flight.',
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
      'An integrated IoT building automation system combining distributed Wi-Fi appliance controls with automated water tank management. Ultrasonic sensors monitor live reservoir levels to prevent motor dry-runs and tank overflows, while a mobile web portal allows residents to schedule pumps and lights from anywhere.',
    image: '/projects/smart-iot-home-automation.jpg',
    highlights: ['ESP8266 Wi-Fi Core', 'Ultrasonic Tank Level Sensing', 'Mobile Web Dashboard', 'Automated Pump Protection'],
    achievement: 'Dual-Mode Home & Water Automation System',
    status: 'Completed'
  }
];
