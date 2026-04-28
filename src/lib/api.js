/**
 * API client helpers for CivicSage AI
 * Handles SSE streaming for real-time token-by-token display
 */

/**
 * Send a chat message and handle SSE streaming response.
 * Each token chunk is immediately passed to the onChunk callback
 * for real-time display with minimal latency.
 *
 * @param {string} message - User's message
 * @param {string|null} sessionId - Existing session ID (or null for new)
 * @param {function} onChunk - Callback for each text chunk (called per token)
 * @param {function} onSessionId - Callback when session ID is received
 * @returns {Promise<void>}
 */
export async function sendChatMessage(message, sessionId, onChunk, onSessionId) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sessionId }),
  });

  // Handle non-streaming error responses (400, 429, 500 etc.)
  if (!response.ok) {
    let errorMsg = 'Failed to send message';
    try {
      const err = await response.json();
      errorMsg = err.error || errorMsg;
    } catch {
      // Response wasn't JSON
    }
    throw new Error(errorMsg);
  }

  // Use ReadableStream for low-latency streaming
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // Process all complete SSE events in the buffer
    const events = buffer.split('\n\n');
    // Keep the last potentially incomplete event in the buffer
    buffer = events.pop() || '';

    for (const event of events) {
      const lines = event.split('\n');
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;

        const jsonStr = line.slice(6);
        if (!jsonStr) continue;

        try {
          const data = JSON.parse(jsonStr);

          switch (data.type) {
            case 'session':
              if (onSessionId) onSessionId(data.sessionId);
              break;
            case 'chunk':
              if (onChunk && data.text) onChunk(data.text);
              break;
            case 'done':
              // Stream complete
              break;
            case 'error':
              throw new Error(data.error || 'Server error occurred');
          }
        } catch (parseErr) {
          // Re-throw actual application errors
          if (parseErr.message && !parseErr.message.includes('JSON')) {
            throw parseErr;
          }
          // Silently skip JSON parse errors (incomplete chunks)
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
    let errorMsg = 'Failed to generate quiz';
    try {
      const err = await response.json();
      errorMsg = err.error || errorMsg;
    } catch {}
    throw new Error(errorMsg);
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
    let errorMsg = 'Translation failed';
    try {
      const err = await response.json();
      errorMsg = err.error || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }

  const data = await response.json();
  return data.translated;
}
