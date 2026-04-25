import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { sendChatMessage } from '../lib/api';
import { SUGGESTED_PROMPTS } from '../lib/constants';

export default function ChatAssistant({ initialMessage, onMessageSent }) {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: 'Namaste! 🙏 I\'m **CivicSage AI**, your guide to the Indian election process.\n\nAsk me anything about:\n- 🗳️ How voting works with EVMs & VVPATs\n- 📋 Voter registration process\n- ⏱️ Election timeline & phases\n- ⚖️ Model Code of Conduct\n- 📊 Vote counting process\n\nWhat would you like to learn about?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (initialMessage && initialMessage.trim()) {
      handleSend(initialMessage);
      if (onMessageSent) onMessageSent();
    }
  }, [initialMessage]);

  const handleSend = async (overrideMsg) => {
    const msg = (overrideMsg || input).trim();
    if (!msg || isLoading) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: msg }]);
    setIsLoading(true);

    // Add placeholder AI message
    const aiIndex = messages.length + 1;
    setMessages((prev) => [...prev, { role: 'ai', content: '', loading: true }]);

    try {
      let fullText = '';
      await sendChatMessage(
        msg,
        sessionId,
        (chunk) => {
          fullText += chunk;
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: 'ai', content: fullText, loading: false };
            return updated;
          });
        },
        (newSessionId) => {
          setSessionId(newSessionId);
        }
      );
    } catch (error) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: 'ai',
          content: '❌ Sorry, I encountered an error. Please try again.',
          loading: false,
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div>
      <div className="section-header">
        <h2>🤖 AI Election Assistant</h2>
        <p>Ask anything about the Indian election process — powered by Google Gemini</p>
        <div className="section-divider"></div>
      </div>

      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-message ${msg.role}`}>
              <div className="chat-avatar">
                {msg.role === 'user' ? '👤' : '🏛️'}
              </div>
              <div className="chat-bubble">
                {msg.loading ? (
                  <div className="typing-indicator">
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                  </div>
                ) : msg.role === 'ai' ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {messages.length <= 1 && (
          <div className="suggested-prompts">
            {SUGGESTED_PROMPTS.map((prompt, i) => (
              <button key={i} className="suggested-btn" onClick={() => handleSend(prompt)}>
                {prompt}
              </button>
            ))}
          </div>
        )}

        <div className="chat-input-area">
          <textarea
            ref={inputRef}
            className="chat-input"
            placeholder="Ask about Indian elections..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={isLoading}
          />
          <button
            className="chat-send"
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
