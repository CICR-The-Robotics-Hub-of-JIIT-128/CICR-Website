import React, { useState, useEffect, useRef } from 'react';
import { X, Send, RotateCcw } from 'lucide-react';
import { getAuthoritativeAnswer } from '../utils/cicrKnowledge';
import '../styles/chatbot.css';

// Sleek, Minimalist Futuristic Robot Face (Clean, aesthetic, zero neon)
function ModernBotFace({ size = 26, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer Shell */}
      <rect
        x="3"
        y="6"
        width="26"
        height="21"
        rx="7"
        fill="url(#botShellGrad)"
        stroke="rgba(255, 255, 255, 0.16)"
        strokeWidth="1.2"
      />
      {/* Top Antenna Node */}
      <path d="M16 2.5V6" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="16" cy="2.5" r="1.5" fill="#ff601c" />

      {/* Cyber Visor Screen */}
      <rect
        x="6.5"
        y="10.5"
        width="19"
        height="7.5"
        rx="3.5"
        fill="#08090d"
        stroke="rgba(255, 255, 255, 0.08)"
      />
      {/* Dual Optics (Clean Ice White) */}
      <rect x="9.5" y="12.5" width="4.5" height="3.5" rx="1.5" fill="#ffffff" />
      <rect x="18" y="12.5" width="4.5" height="3.5" rx="1.5" fill="#ffffff" />

      {/* Speaker Bar */}
      <path d="M11 22H21" stroke="rgba(255, 255, 255, 0.22)" strokeWidth="1.2" strokeLinecap="round" />
      {/* Ear nodes */}
      <rect x="1.5" y="13" width="1.8" height="7" rx="0.9" fill="rgba(255, 255, 255, 0.25)" />
      <rect x="28.7" y="13" width="1.8" height="7" rx="0.9" fill="rgba(255, 255, 255, 0.25)" />

      <defs>
        <linearGradient id="botShellGrad" x1="16" y1="6" x2="16" y2="27" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1e222e" />
          <stop offset="100%" stopColor="#10121a" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const INITIAL_WELCOME = {
  sender: 'bot',
  text: "Hello! I am the **CICR AI Assistant**, strictly dedicated to answering questions about **CICR (Centre for Innovation, Computing and Robotics)** at JIIT Sector 128, Noida.\n\nAsk me about our robotics rovers, drones, 7 heads, faculty coordinators, team members, events, or how to reserve components on [inventory.cicr.in](https://inventory.cicr.in)!",
  time: 'Just now'
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_WELCOME]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [windowPos, setWindowPos] = useState({ right: 24, bottom: 90 });
  const [windowSize, setWindowSize] = useState({ width: 380, height: 510 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const windowRef = useRef(null);
  const toggleRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const dragRef = useRef({ startX: 0, startY: 0, startRight: 24, startBottom: 90 });
  const resizeRef = useRef({ startX: 0, startY: 0, startWidth: 380, startHeight: 510 });

  // Delete previous chat history on mount to start fresh
  useEffect(() => {
    try {
      localStorage.removeItem('cicr_chat_history');
      sessionStorage.removeItem('cicr_chat_history');
      localStorage.removeItem('cicr_chatbot_messages');
      sessionStorage.removeItem('cicr_chatbot_messages');
      localStorage.removeItem('cicr_chat_state');
      sessionStorage.removeItem('cicr_chat_state');
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }, []);

  // Close chatbot automatically when user clicks or taps outside the window
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e) => {
      // Do not close during active drag or resize operations
      if (isDragging || isResizing) return;

      // Check if click target is inside window or toggle button
      const clickedWindow = windowRef.current && windowRef.current.contains(e.target);
      const clickedToggle = toggleRef.current && toggleRef.current.contains(e.target);

      if (!clickedWindow && !clickedToggle) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isOpen, isDragging, isResizing]);

  // Scroll to bottom when new messages arrive or when opened
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [isOpen, messages, isTyping]);

  // Clean Markdown Parser
  const parseMarkdown = (text) => {
    if (!text) return '';
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/```(\w+)?\n?([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
      .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/(?<!\*)\*(?!\*)([^\*\n]+?)\*(?!\*)/g, '<em>$1</em>')
      .replace(/`([^`\n]+)`/g, '<code>$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/^[\s]*[-*+]\s+(.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br/>');

    if (!html.includes('<p>') && !html.includes('<ul>') && !html.includes('<pre>')) {
      html = `<p>${html}</p>`;
    }
    return html;
  };

  // Dragging logic
  const handleMouseDownHeader = (e) => {
    if (e.target.closest('.header-btn')) return;
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startRight: windowPos.right,
      startBottom: windowPos.bottom
    };
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        const deltaX = dragRef.current.startX - e.clientX;
        const deltaY = dragRef.current.startY - e.clientY;
        const newRight = Math.max(10, Math.min(window.innerWidth - 300, dragRef.current.startRight + deltaX));
        const newBottom = Math.max(10, Math.min(window.innerHeight - 200, dragRef.current.startBottom + deltaY));
        setWindowPos({ right: newRight, bottom: newBottom });
      } else if (isResizing) {
        const deltaX = resizeRef.current.startX - e.clientX;
        const deltaY = resizeRef.current.startY - e.clientY;
        const newWidth = Math.max(320, Math.min(600, resizeRef.current.startWidth + deltaX));
        const newHeight = Math.max(400, Math.min(800, resizeRef.current.startHeight + deltaY));
        setWindowSize({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing]);

  const handleMouseDownResize = (e) => {
    e.stopPropagation();
    setIsResizing(true);
    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startWidth: windowSize.width,
      startHeight: windowSize.height
    };
  };

  const handleSendMessage = (textToSend) => {
    const query = typeof textToSend === 'string' ? textToSend : inputValue;
    if (!query || !query.trim() || isTyping) return;

    const userText = query.trim();
    setInputValue('');

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages((prev) => [...prev, { sender: 'user', text: userText, time: timeStr }]);
    setIsTyping(true);

    // Natural brief thinking indicator before authoritative strictly-scoped response
    setTimeout(() => {
      const reply = getAuthoritativeAnswer(userText);
      setMessages((prev) => [...prev, { sender: 'bot', text: reply, time: timeStr }]);
      setIsTyping(false);
    }, 350);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    try {
      localStorage.removeItem('cicr_chat_history');
      sessionStorage.removeItem('cicr_chat_history');
      localStorage.removeItem('cicr_chatbot_messages');
      sessionStorage.removeItem('cicr_chatbot_messages');
    } catch {
      // Ignore
    }
    setMessages([
      {
        sender: 'bot',
        text: "Conversation cleared. How can I help you with CICR robotics today?",
        time: 'Just now'
      }
    ]);
  };

  return (
    <div className="chatbot-container">
      {/* Floating Bottom-Right Launcher Button */}
      <button
        ref={toggleRef}
        type="button"
        className={`chatbot-toggle ${isOpen ? 'active' : ''}`}
        id="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle CICR AI Chatbot"
        title="Chat with CICR AI Assistant"
      >
        <div className="toggle-bot-icon-wrap">
          <ModernBotFace size={30} />
          <span className="toggle-status-dot" />
        </div>
        <div className="toggle-close-wrap">
          <X size={20} />
        </div>
      </button>

      {/* Floating Chatbot Window */}
      <div
        ref={windowRef}
        className={`chatbot-window ${isOpen ? 'active' : ''} ${isDragging ? 'dragging' : ''} ${isResizing ? 'resizing' : ''}`}
        id="chatbot-window"
        style={{
          right: `${windowPos.right}px`,
          bottom: `${windowPos.bottom}px`,
          width: `${windowSize.width}px`,
          height: `${windowSize.height}px`
        }}
      >
        {/* Resize Handle Top-Left */}
        <div
          className="resize-handle"
          id="resize-handle"
          onMouseDown={handleMouseDownResize}
          title="Drag to resize window"
        />

        {/* Chatbot Header */}
        <div className="chatbot-header" onMouseDown={handleMouseDownHeader}>
          <div className="header-content">
            <div className="bot-avatar">
              <ModernBotFace size={26} />
              <span className="bot-avatar-pulse-dot" />
            </div>
            <div className="bot-info">
              <h3>CICR AI Assistant</h3>
              <div className="status-row">
                <span className="status-dot-emerald" />
                <span className="status-label">Online • CICR Scope</span>
              </div>
            </div>
          </div>

          <div className="header-actions">
            <button
              type="button"
              className="header-btn"
              onClick={handleResetChat}
              title="Clear chat history"
              aria-label="Reset chat"
            >
              <RotateCcw size={14} />
            </button>
            <button
              type="button"
              className="header-btn"
              onClick={() => setIsOpen(false)}
              title="Close chat"
              aria-label="Close"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Chatbot Messages List */}
        <div className="chatbot-messages" id="chatbot-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.sender}-message`}>
              <div
                className="message-content"
                dangerouslySetInnerHTML={{
                  __html: msg.sender === 'bot' ? parseMarkdown(msg.text) : `<p>${msg.text}</p>`
                }}
              />
              <div className="message-time">{msg.time}</div>
            </div>
          ))}

          {isTyping && (
            <div className="typing-indicator">
              <span />
              <span />
              <span />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chatbot Input Box */}
        <div className="chatbot-input">
          <div className="input-container">
            <input
              type="text"
              id="message-input"
              ref={inputRef}
              placeholder="Ask about CICR rovers, heads, lab..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
            />
            <button
              type="button"
              className={`send-button ${inputValue.trim() ? 'has-input' : ''}`}
              id="send-button"
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isTyping}
              aria-label="Send message"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
