/**
 * CICR Autonomous AI Assistant
 * Provides intelligent, instant responses regarding CICR projects, recruitment,
 * workshops (TechTonic), competitions, inventory, and campus lab access.
 */

(function () {
  const KNOWLEDGE_BASE = [
    {
      keywords: ['about', 'what is cicr', 'who are you', 'tell me about', 'club', 'cell'],
      response: `<strong>CICR (Creative & Innovative Cell in Robotics)</strong> is the premier robotics and automation hub of <strong>JIIT-128, Noida</strong>. We engineer autonomous systems, high-torque combat bots, computer vision algorithms, and embedded IoT architectures. 🤖⚡`
    },
    {
      keywords: ['recruit', 'join', 'how to join', 'apply', 'eligibility', 'selection', 'first year', 'interview'],
      response: `CICR recruits enthusiastic 1st and 2nd year students across all branches (CSE, IT, ECE)! Selection involves:<br><br>
1. 📝 Online Application & Domain Selection<br>
2. 🛠️ Hands-on Orientation / Mini Task<br>
3. 💬 Technical Discussion & Mentorship Induction<br><br>
Watch our Instagram <strong><a href="https://www.instagram.com/cicr_jiit/" target="_blank">@cicr_jiit</a></strong> and join our WhatsApp community for upcoming recruitment announcements!`
    },
    {
      keywords: ['techtonic', 'workshop', 'bootcamp', 'training', 'classes'],
      response: `<strong>TechTonic</strong> is CICR’s flagship 3-day robotics workshop for engineering students. You’ll get hands-on training with <strong>Arduino, ROS (Robot Operating System), PCB prototyping, and motor control</strong>, culminating in building real bots with certificates and prizes! 🏆`
    },
    {
      keywords: ['location', 'where', 'address', 'room', 'lab', 'campus', 'find us'],
      response: `CICR is stationed in <strong>Room 140, Jaypee Institute of Information Technology (JIIT), Sector 128, Noida</strong>. Feel free to drop by to check out our bot fleet or discuss robotics projects! 📍🏢`
    },
    {
      keywords: ['project', 'projects', 'bot', 'robot', 'algo-benchmaker', 'soccer', 'rover'],
      response: `Our featured engineered bots & systems include:<br><br>
• <strong>Robo-Soccer Bots</strong>: High-speed wireless combat bots for 2v2 pitch tournaments.<br>
• <strong>Algo-Benchmaker</strong>: C++ benchmarking toolbox for path planning algorithms (<a href="https://github.com/CICR-The-Robotics-Hub-of-JIIT-128/Algo-Benchmaker" target="_blank">GitHub Repo</a>).<br>
• <strong>Autonomous LiDAR Rover</strong>: 2D/3D SLAM mapping and navigation with ROS2.<br>
• <strong>Tactical Quadcopters</strong>: Autonomous waypoint aerial missions.`
    },
    {
      keywords: ['inventory', 'tools', 'sensors', 'components', 'borrow', 'equipment', 'arduino', 'motors'],
      response: `Club members and participants can reserve sensors, motor drivers, ESP32/Raspberry Pi boards, and tools via our dedicated portal: <strong><a href="https://inventory.cicr.in" target="_blank">inventory.cicr.in</a></strong>. Sign in with your CICR credentials! 🔧⚡`
    },
    {
      keywords: ['contact', 'email', 'phone', 'reach', 'social', 'instagram', 'linkedin', 'github'],
      response: `You can reach out to us through:<br><br>
• ✉️ Email: <strong><a href="mailto:cicrjiit128noida@gmail.com">cicrjiit128noida@gmail.com</a></strong> or <strong><a href="mailto:contact@cicr.in">contact@cicr.in</a></strong><br>
• 📸 Instagram: <strong><a href="https://www.instagram.com/cicr_jiit/" target="_blank">@cicr_jiit</a></strong><br>
• 💼 LinkedIn: <strong><a href="https://www.linkedin.com/company/cicrjiit128/" target="_blank">CICR JIIT 128</a></strong><br>
• 🐙 GitHub: <strong><a href="https://github.com/CICR-The-Robotics-Hub-of-JIIT-128" target="_blank">CICR GitHub</a></strong>`
    },
    {
      keywords: ['competition', 'competitions', 'techfest', 'plinth', 'participate', 'awards', 'iit'],
      response: `CICR actively fields competitive robotics teams at India's biggest tech festivals, including <strong>Techfest (IIT Bombay)</strong>, <strong>Plinth (LNMIIT)</strong>, and <strong>Techkriti (IIT Kanpur)</strong>, bringing home podiums in Robo-Soccer, Autonomous Navigation, and Maze Solving! 🥇`
    },
    {
      keywords: ['circuit rush', 'rush', 'obstacle'],
      response: `<strong>Circuit Rush</strong> is an adrenaline-fueled challenge where autonomous & manual bots race through complex obstacles testing time, precision, and PID tracking!`
    }
  ];

  const FALLBACK_RESPONSE = `I'm here to assist with all things CICR (Robotics, TechTonic workshops, recruitment, projects, and lab inquiries). You can also drop a line directly to our team at <strong><a href="mailto:cicrjiit128noida@gmail.com">cicrjiit128noida@gmail.com</a></strong> or DM us on Instagram <strong><a href="https://www.instagram.com/cicr_jiit/" target="_blank">@cicr_jiit</a></strong>! 🤖`;

  document.addEventListener('DOMContentLoaded', () => {
    const launcher = document.getElementById('cicr-bot-launcher');
    const wrapper = document.getElementById('cicr-bot-wrapper');
    const closeBtn = document.getElementById('bot-close-btn');
    const input = document.getElementById('bot-input-field');
    const sendBtn = document.getElementById('bot-send-btn');
    const messagesContainer = document.getElementById('bot-messages-container');
    const typingIndicator = document.getElementById('bot-typing-indicator');
    const quickChips = document.querySelectorAll('.quick-chip');

    if (!launcher || !wrapper) return;

    // Toggle Chat Window
    launcher.addEventListener('click', () => {
      wrapper.classList.toggle('open');
      if (wrapper.classList.contains('open') && input) {
        setTimeout(() => input.focus(), 300);
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => wrapper.classList.remove('open'));
    }

    // Quick Prompt Chips
    quickChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const query = chip.getAttribute('data-query');
        if (query) {
          sendUserMessage(query);
        }
      });
    });

    // Send Message Handler
    function sendUserMessage(text) {
      if (!text || !text.trim()) return;
      const cleanText = text.trim();

      // Append User Bubble
      appendMessage(cleanText, 'user');
      if (input) input.value = '';

      // Show Typing Indicator
      if (typingIndicator) {
        typingIndicator.classList.add('active');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }

      // Compute Response (Intelligent Keyword Matching)
      setTimeout(() => {
        if (typingIndicator) typingIndicator.classList.remove('active');
        const reply = findBestResponse(cleanText);
        appendMessage(reply, 'bot');
      }, 550);
    }

    function findBestResponse(text) {
      const lower = text.toLowerCase();
      let bestMatch = null;
      let maxScore = 0;

      for (const entry of KNOWLEDGE_BASE) {
        let score = 0;
        for (const kw of entry.keywords) {
          if (lower.includes(kw)) {
            score += kw.length; // weight longer matches higher
          }
        }
        if (score > maxScore) {
          maxScore = score;
          bestMatch = entry.response;
        }
      }

      return bestMatch || FALLBACK_RESPONSE;
    }

    function appendMessage(htmlContent, type) {
      const bubble = document.createElement('div');
      bubble.className = `chat-bubble ${type}-bubble`;
      bubble.innerHTML = htmlContent;
      messagesContainer.appendChild(bubble);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    if (sendBtn) {
      sendBtn.addEventListener('click', () => {
        if (input) sendUserMessage(input.value);
      });
    }

    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          sendUserMessage(input.value);
        }
      });
    }
  });
})();

