import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import DOMPurify from 'dompurify';
import { sendChatMessage } from '../lib/api';
import { SUGGESTED_PROMPTS } from '../lib/constants';
import { trackChatMessage } from '../lib/analytics';

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
  const streamBufferRef = useRef('');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (initialMessage && initialMessage.trim()) {
      handleSend(initialMessage);
      if (onMessageSent) onMessageSent();
    }
  }, [initialMessage]);

  const handleSend = useCallback(async (overrideMsg) => {
    const msg = (overrideMsg || input).trim();
    if (!msg || isLoading) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: msg }]);
    setIsLoading(true);
    streamBufferRef.current = '';

    // Track the chat message event
    trackChatMessage(msg.length);

    // Add placeholder AI message with loading state
    setMessages((prev) => [...prev, { role: 'ai', content: '', loading: true }]);

    try {
      await sendChatMessage(
        msg,
        sessionId,
        // onChunk — called for each token/chunk from the stream
        (chunk) => {
          streamBufferRef.current += chunk;
          const currentText = streamBufferRef.current;
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              role: 'ai',
              content: currentText,
              loading: false,
            };
            return updated;
          });
        },
        // onSessionId
        (newSessionId) => {
          setSessionId(newSessionId);
        }
      );
    } catch (error) {
      console.error('Chat error:', error.message);
      const errorMsg = error.message.includes('quota')
        ? '⚠️ **API Quota Exceeded**\n\nThe Gemini API free tier limit has been reached. Please wait ~60 seconds and try again, or update to a new API key.'
        : error.message.includes('API key')
        ? '🔑 **API Key Error**\n\nThe Gemini API key is invalid or misconfigured. Please check the server configuration.'
        : `❌ **Error:** ${error.message}`;

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: 'ai',
          content: errorMsg,
          loading: false,
          isError: true,
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
      streamBufferRef.current = '';
    }
  }, [input, isLoading, sessionId]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  /** Memoize the markdown plugins array to prevent re-renders */
  const remarkPlugins = useMemo(() => [remarkGfm], []);

  return (
    <div>
      <div className="section-header">
        <h2 id="chat-heading">🤖 AI Election Assistant</h2>
        <p>Ask anything about the Indian election process — powered by Google Gemini</p>
        <div className="section-divider" aria-hidden="true"></div>
      </div>

      <div className="chat-container" role="region" aria-labelledby="chat-heading">
        <div
          className="chat-messages"
          role="log"
          aria-live="polite"
          aria-label="Chat conversation"
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`chat-message ${msg.role}${msg.isError ? ' error' : ''}`}
              aria-label={`${msg.role === 'user' ? 'Your message' : 'AI response'}`}
            >
              <div className="chat-avatar" aria-hidden="true">
                {msg.role === 'user' ? '👤' : '🏛️'}
              </div>
              <div className="chat-bubble">
                {msg.loading ? (
                  <div className="typing-indicator" role="status" aria-label="AI is typing">
                    <span className="typing-dot" aria-hidden="true"></span>
                    <span className="typing-dot" aria-hidden="true"></span>
                    <span className="typing-dot" aria-hidden="true"></span>
                  </div>
                ) : msg.role === 'ai' ? (
                  <ReactMarkdown remarkPlugins={remarkPlugins}>
                    {DOMPurify.sanitize(msg.content)}
                  </ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {messages.length <= 1 && (
          <div className="suggested-prompts" role="list" aria-label="Suggested questions">
            {SUGGESTED_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                id={`suggested-prompt-${i}`}
                className="suggested-btn"
                onClick={() => handleSend(prompt)}
                role="listitem"
                aria-label={`Ask: ${prompt}`}
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        <div className="chat-input-area">
          <textarea
            ref={inputRef}
            id="chat-input-field"
            className="chat-input"
            placeholder="Ask about Indian elections..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={isLoading}
            aria-label="Type your question about Indian elections"
          />
          <button
            id="chat-send-btn"
            className="chat-send"
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            aria-label={isLoading ? 'Sending message...' : 'Send message'}
          >
            {isLoading ? '⏳' : '➤'}
          </button>
        </div>
      </div>
    </div>
  );
}

ChatAssistant.propTypes = {
  /** Pre-filled message to send immediately on mount */
  initialMessage: PropTypes.string,
  /** Callback after the initial message has been sent */
  onMessageSent: PropTypes.func,
};
