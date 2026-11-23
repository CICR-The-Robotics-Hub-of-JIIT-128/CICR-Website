import React, { useState, useEffect, useRef } from 'react';
import { X, Send, RotateCcw, Copy, Check } from 'lucide-react';
import { getAuthoritativeAnswer } from '../utils/cicrKnowledge';
import '../styles/chatbot.css';

// Minimalist Futuristic Robot Face
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
      <path d="M16 2.5V6" stroke="rgba(255, 255, 255, 0.45)" strokeWidth="1.5" strokeLinecap="round" />
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
      {/* Dual Optics */}
      <rect x="9.5" y="12.5" width="4.5" height="3.5" rx="1.5" fill="#ffffff" />
      <rect x="18" y="12.5" width="4.5" height="3.5" rx="1.5" fill="#ffffff" />

      {/* Speaker Bar */}
      <path d="M11 22H21" stroke="rgba(255, 255, 255, 0.22)" strokeWidth="1.2" strokeLinecap="round" />
      {/* Ear nodes */}
      <rect x="1.5" y="13" width="1.8" height="7" rx="0.9" fill="rgba(255, 255, 255, 0.3)" />
      <rect x="28.7" y="13" width="1.8" height="7" rx="0.9" fill="rgba(255, 255, 255, 0.3)" />

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
  id: 'welcome',
  sender: 'bot',
  text: "Welcome to the CICR Chatbot! 👋\n\nI'm here to assist you with information about CICR (Centre for Innovation, Computing and Robotics). Feel free to ask me anything!",
  time: 'Just now'
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_WELCOME]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const windowRef = useRef(null);
  const toggleRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Track viewport width for responsive behaviors
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
  }, [isOpen]);

  // Isolate mousewheel and touch scroll within messages container so Lenis or parent page never blocks it
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      e.stopPropagation();
    };

    const handleTouchMove = (e) => {
      e.stopPropagation();
    };

    container.addEventListener('wheel', handleWheel, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isOpen]);

  // Scroll to bottom when new messages arrive or when opened
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      if (!isMobile) {
        inputRef.current?.focus();
      }
    }
  }, [isOpen, messages, isTyping, isMobile]);

  // Clean Markdown Parser
  const parseMarkdown = (text) => {
    if (!text) return '';
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      // Code blocks ```lang ... ```
      .replace(/```(\w+)?\n?([\s\S]*?)```/g, '<div class="chat-code-block"><div class="code-lang-tag">$1</div><pre><code>$2</code></pre></div>')
      // Math formulas
      .replace(/\$\$([^$]+)\$\$/g, '<div class="math-block">$1</div>')
      // Bold + Italic
      .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/(?<!\*)\*(?!\*)([^\*\n]+?)\*(?!\*)/g, '<em>$1</em>')
      // Inline code
      .replace(/`([^`\n]+)`/g, '<code>$1</code>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/(?<!href=")(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>')
      // Headings
      .replace(/^### (.*$)/gim, '<h4>$1</h4>')
      .replace(/^## (.*$)/gim, '<h3>$1</h3>')
      // Horizontal Rule
      .replace(/^---$/gm, '<hr class="chat-hr" />')
      // List items
      .replace(/^[\s]*[-*+]\s+(.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
      // Paragraphs
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br/>');

    if (!html.includes('<p>') && !html.includes('<ul>') && !html.includes('<div class="chat-code-block">')) {
      html = `<p>${html}</p>`;
    }
    return html;
  };

  const handleSendMessage = (textToSend) => {
    const query = typeof textToSend === 'string' ? textToSend : inputValue;
    if (!query || !query.trim() || isTyping) return;

    const userText = query.trim();
    setInputValue('');

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsgId = `user-${Date.now()}`;

    setMessages((prev) => [...prev, { id: userMsgId, sender: 'user', text: userText, time: timeStr }]);
    setIsTyping(true);

    setTimeout(() => {
      const reply = getAuthoritativeAnswer(userText);
      const botMsgId = `bot-${Date.now()}`;
      setMessages((prev) => [...prev, { id: botMsgId, sender: 'bot', text: reply, time: timeStr }]);
      setIsTyping(false);
    }, 280);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyMessage = (id, text) => {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }).catch(() => {
      // Fallback ignore
    });
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'reset-welcome',
        sender: 'bot',
        text: "Conversation cleared. How can I assist you with CICR or your technical questions today?",
        time: 'Just now'
      }
    ]);
  };

  return (
    <>
      {/* Mobile Backdrop for click-outside dismissal */}
      {isOpen && isMobile && (
        <div
          className="chatbot-mobile-backdrop"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className={`chatbot-container ${isMobile ? 'is-mobile-view' : ''}`}>
        {/* Floating Bottom-Right Launcher Button */}
        <button
          ref={toggleRef}
          type="button"
          className={`chatbot-toggle ${isOpen ? 'active' : ''}`}
          id="chatbot-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle CICR ChatBot"
          title="Chat with CICR ChatBot"
        >
          <div className="toggle-bot-icon-wrap">
            <ModernBotFace size={30} />
            <span className="toggle-status-dot" />
          </div>
          <div className="toggle-close-wrap">
            <X size={20} />
          </div>
        </button>

        {/* Fixed Chatbot Window / Mobile Bottom Sheet */}
        <div
          ref={windowRef}
          className={`chatbot-window ${isOpen ? 'active' : ''}`}
          id="chatbot-window"
          data-lenis-prevent="true"
          data-lenis-prevent-wheel="true"
          data-lenis-prevent-touch="true"
        >
          {/* Mobile Sheet Pull Bar Indicator */}
          {isMobile && <div className="mobile-sheet-pull-bar" />}

          {/* Chatbot Header */}
          <div className="chatbot-header">
            <div className="header-content">
              <div className="bot-avatar">
                <ModernBotFace size={26} />
                <span className="bot-avatar-pulse-dot" />
              </div>
              <div className="bot-info">
                <h3>CICR ChatBot</h3>
              </div>
            </div>

            <div className="header-actions">
              <button
                type="button"
                className="header-btn"
                onClick={handleResetChat}
                title="Clear conversation"
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

          {/* Chatbot Messages List with Lenis prevention and independent scroll */}
          <div
            ref={messagesContainerRef}
            className="chatbot-messages"
            id="chatbot-messages"
            data-lenis-prevent="true"
            data-lenis-prevent-wheel="true"
            data-lenis-prevent-touch="true"
          >
            {messages.map((msg) => (
              <div key={msg.id || msg.time} className={`message ${msg.sender}-message`}>
                <div className="message-bubble-wrap">
                  <div
                    className="message-content"
                    dangerouslySetInnerHTML={{
                      __html: msg.sender === 'bot' ? parseMarkdown(msg.text) : `<p>${msg.text}</p>`
                    }}
                  />
                  {msg.sender === 'bot' && (
                    <button
                      type="button"
                      className={`copy-msg-btn ${copiedId === msg.id ? 'copied' : ''}`}
                      onClick={() => handleCopyMessage(msg.id, msg.text)}
                      title="Copy response"
                      aria-label="Copy message text"
                    >
                      {copiedId === msg.id ? <Check size={12} /> : <Copy size={12} />}
                      <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                    </button>
                  )}
                </div>
                <div className="message-time">{msg.time}</div>
              </div>
            ))}

            {isTyping && (
              <div className="typing-indicator-wrap">
                <div className="typing-indicator">
                  <span />
                  <span />
                  <span />
                </div>
                <span className="typing-label">CICR ChatBot is typing...</span>
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
                placeholder="Ask about CICR projects, heads, lab, code..."
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
    </>
  );
}
