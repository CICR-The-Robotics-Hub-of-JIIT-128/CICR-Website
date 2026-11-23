import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send } from 'lucide-react';
import { getAuthoritativeAnswer } from '../utils/cicrKnowledge';

// Clean Markdown-to-HTML parser for modal
function formatAiResponse(text) {
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
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:#38bdf8;text-decoration:underline;">$1</a>')
    .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" style="color:#38bdf8;text-decoration:underline;">$1</a>')
    .replace(/^[\s]*[-*+]\s+(.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>');

  if (!html.includes('<p>') && !html.includes('<ul>') && !html.includes('<pre>')) {
    html = `<p>${html}</p>`;
  }
  return html;
}

export default function AIChatModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: formatAiResponse("Welcome to the CICR Chatbot! 👋\n\nI'm here to assist you with information about CICR (Centre for Innovation, Computing and Robotics). Feel free to ask me anything!")
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Clear memory on mount
  useEffect(() => {
    try {
      localStorage.removeItem('cicr_chat_history');
      sessionStorage.removeItem('cicr_chat_history');
      localStorage.removeItem('cicr_chatbot_messages');
      sessionStorage.removeItem('cicr_chatbot_messages');
    } catch {
      // Ignore
    }
  }, []);

  // Isolate scroll so Lenis does not block modal messages scrolling
  useEffect(() => {
    const el = messagesContainerRef.current;
    if (!el) return;
    const stopPropagation = (e) => e.stopPropagation();
    el.addEventListener('wheel', stopPropagation, { passive: true });
    el.addEventListener('touchmove', stopPropagation, { passive: true });
    return () => {
      el.removeEventListener('wheel', stopPropagation);
      el.removeEventListener('touchmove', stopPropagation);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages, isTyping]);

  const handleSend = (textToSend) => {
    const query = textToSend || inputText;
    if (!query || !query.trim() || isTyping) return;

    const userMsg = query.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: `<p>${userMsg}</p>` }]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const answer = getAuthoritativeAnswer(userMsg);
      setMessages((prev) => [...prev, { sender: 'bot', text: formatAiResponse(answer) }]);
    }, 280);
  };

  if (!isOpen) return null;

  return (
    <div className="ai-modal-backdrop" onClick={onClose}>
      <div
        className="ai-chat-window"
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent="true"
        data-lenis-prevent-wheel="true"
        data-lenis-prevent-touch="true"
      >
        {/* Header */}
        <div className="ai-chat-header">
          <div className="ai-bot-avatar-wrap">
            <Bot size={22} className="avatar-icon-cyan" />
            <span className="online-indicator"></span>
          </div>
          <div className="ai-bot-titles">
            <h4>CICR ChatBot</h4>
          </div>
          <button className="ai-chat-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Message Stream with Independent Native Scrolling */}
        <div
          ref={messagesContainerRef}
          className="ai-messages-stream"
          data-lenis-prevent="true"
          data-lenis-prevent-wheel="true"
          data-lenis-prevent-touch="true"
        >
          {messages.map((m, idx) => (
            <div key={idx} className={`ai-bubble ${m.sender === 'user' ? 'ai-bubble-user' : 'ai-bubble-bot'}`}>
              <div dangerouslySetInnerHTML={{ __html: m.text }} />
            </div>
          ))}
          {isTyping && (
            <div className="ai-bubble ai-bubble-bot ai-typing">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="ai-chat-input-bar">
          <input
            type="text"
            className="ai-input"
            placeholder="Ask about CICR rovers, heads, lab, code..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            autoFocus
          />
          <button className="ai-send-btn" onClick={() => handleSend()} aria-label="Send message">
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
