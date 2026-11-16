import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles } from 'lucide-react';
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
      text: formatAiResponse("Hello! I am the **CICR AI Assistant**, strictly limited to answering questions about **CICR (Centre for Innovation, Computing and Robotics)** at JIIT Sector 128, Noida.\n\nAsk me about our robotics rovers, drones, 7 heads, faculty coordinators, team members, events, or how to reserve components on [inventory.cicr.in](https://inventory.cicr.in)!")
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
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

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = (textToSend = null) => {
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
    }, 350);
  };

  if (!isOpen) return null;

  return (
    <div className="ai-modal-backdrop" onClick={onClose}>
      <div className="ai-chat-window" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="ai-chat-header">
          <div className="ai-bot-avatar-wrap">
            <Bot size={22} className="avatar-icon-cyan" />
            <span className="online-indicator"></span>
          </div>
          <div className="ai-bot-titles">
            <h4>CICR AI Assistant</h4>
            <span>Strictly CICR Scope // Online</span>
          </div>
          <button className="ai-chat-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="ai-quick-chips">
          <button className="quick-chip" onClick={() => handleSend('How to join CICR?')}>
            <Sparkles size={12} /> Recruitment
          </button>
          <button className="quick-chip" onClick={() => handleSend('Who are the heads?')}>
            Heads of CICR
          </button>
          <button className="quick-chip" onClick={() => handleSend('Tell me about CICR projects and rovers')}>
            Robotics Projects
          </button>
          <button className="quick-chip" onClick={() => handleSend('How to reserve hardware on inventory?')}>
            Inventory Portal
          </button>
        </div>

        {/* Message Stream */}
        <div className="ai-messages-stream">
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
            placeholder="Ask about CICR rovers, heads, lab..."
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
