/**
 * API client helpers for CivicSage AI
 */

/**
 * Send a chat message and handle SSE streaming response.
 * @param {string} message - User's message
 * @param {string|null} sessionId - Existing session ID (or null for new)
 * @param {function} onChunk - Callback for each text chunk
 * @param {function} onSessionId - Callback when session ID is received
 * @returns {Promise<void>}
 */
export async function sendChatMessage(message, sessionId, onChunk, onSessionId) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sessionId }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to send message');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.slice(6));
          if (data.type === 'session' && onSessionId) {
            onSessionId(data.sessionId);
          } else if (data.type === 'chunk' && onChunk) {
            onChunk(data.text);
          } else if (data.type === 'error') {
            throw new Error(data.error);
          }
        } catch (e) {
          if (e.message !== 'Unexpected end of JSON input') {
            console.error('SSE parse error:', e);
          }
        }
      }
    }
  }
}

/**
 * Generate quiz questions via the API.
 * @param {string} topic - Quiz topic
 * @returns {Promise<Array>} Array of quiz question objects
 */
export async function generateQuiz(topic) {
  const response = await fetch('/api/quiz', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate quiz');
  }

  const data = await response.json();
  return data.questions;
}

/**
 * Translate text to a target language.
 * @param {string} text - Text to translate
 * @param {string} targetLanguage - Target language name
 * @returns {Promise<string>} Translated text
 */
export async function translateTextApi(text, targetLanguage) {
  const response = await fetch('/api/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, targetLanguage }),
  });

  if (!response.ok) {
    throw new Error('Translation failed');
  }

  const data = await response.json();
  return data.translated;
}
