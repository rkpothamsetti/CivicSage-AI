/**
 * Google Gemini API Wrapper
 *
 * Provides functions for interacting with the Google Gemini AI model.
 * Handles chat sessions, streaming responses, quiz generation, and translation.
 *
 * @module server/gemini
 * @requires @google/genai
 */

import { GoogleGenAI } from '@google/genai';
import { SYSTEM_PROMPT } from './electionData.js';

/** @type {GoogleGenAI|null} Singleton AI client instance */
let _ai = null;

/**
 * Get or create the GoogleGenAI singleton instance.
 * Uses lazy initialization to defer API key validation until first use.
 *
 * @returns {GoogleGenAI} Configured AI client
 * @throws {Error} If GEMINI_API_KEY environment variable is not set
 */
function getAI() {
  if (!_ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }
    _ai = new GoogleGenAI({ apiKey });
  }
  return _ai;
}

/** @constant {string} Model identifier for primary operations */
const PRIMARY_MODEL = 'gemini-2.0-flash';

/** @constant {string} Model identifier for translation */
const TRANSLATION_MODEL = 'gemini-2.0-flash';

/**
 * Create a new chat session with election-focused system prompt.
 * The session maintains conversation history for contextual responses.
 *
 * @returns {Object} Chat session object with sendMessageStream method
 */
export function createChatSession() {
  const chat = getAI().chats.create({
    model: PRIMARY_MODEL,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.7,
      topP: 0.9,
      maxOutputTokens: 2048,
    },
  });
  return chat;
}

/**
 * Send a message to an existing chat session and stream the response.
 * Uses generateContentStream for true token-by-token streaming.
 *
 * @param {Object} chat - Chat session created by createChatSession()
 * @param {string} message - User's message to send
 * @returns {Promise<AsyncIterable>} Async iterable of response chunks
 * @throws {Error} If chat or message is invalid
 */
export async function streamChatMessage(chat, message) {
  if (!chat) throw new Error('Chat session is required');
  if (!message || typeof message !== 'string') throw new Error('Valid message string is required');

  const response = await chat.sendMessageStream({ message });
  return response;
}

/**
 * Single-turn streaming response (no chat history needed).
 * This is more reliable for one-off questions and serves as a fallback.
 *
 * @param {string} message - User's question or prompt
 * @returns {Promise<AsyncIterable>} Async iterable of response chunks
 * @throws {Error} If message is invalid
 */
export async function streamSingleMessage(message) {
  if (!message || typeof message !== 'string') throw new Error('Valid message string is required');

  const response = await getAI().models.generateContentStream({
    model: PRIMARY_MODEL,
    contents: message,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.7,
      topP: 0.9,
      maxOutputTokens: 2048,
    },
  });
  return response;
}

/**
 * Generate quiz questions using Gemini (single-turn, not chat).
 * Returns parsed JSON array of question objects, or null on failure.
 *
 * @param {string} [topic='Indian election process'] - Quiz topic
 * @returns {Promise<Array|null>} Array of quiz question objects, or null if parsing fails
 */
export async function generateQuizQuestions(topic = 'Indian election process') {
  if (typeof topic !== 'string') topic = 'Indian election process';

  const prompt = `Generate 5 multiple-choice quiz questions about "${topic}" related to the Indian election process.

Return ONLY a valid JSON array (no markdown, no code fences) with this exact structure:
[
  {
    "question": "The question text?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": 0,
    "explanation": "Brief explanation of the correct answer."
  }
]

Rules:
- "correct" is the 0-based index of the correct option
- Questions should be factual and educational
- Cover topics like ECI, EVMs, VVPATs, voter registration, constitutional articles, election timeline
- Difficulty: mix of easy, medium, and hard
- Do NOT repeat common questions`;

  const response = await getAI().models.generateContent({
    model: PRIMARY_MODEL,
    contents: prompt,
    config: {
      temperature: 0.9,
      maxOutputTokens: 2048,
    },
  });

  try {
    let text = response.text.trim();
    // Remove markdown code fences if present
    if (text.startsWith('```')) {
      text = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }
    return JSON.parse(text);
  } catch (error) {
    console.error('Failed to parse quiz JSON:', error);
    return null;
  }
}

/**
 * Translate text using Gemini.
 * Uses low temperature for accurate translations.
 *
 * @param {string} text - Text to translate
 * @param {string} targetLanguage - Target language name (e.g., 'Hindi', 'Tamil')
 * @returns {Promise<string>} Translated text
 * @throws {Error} If text or targetLanguage is invalid
 */
export async function translateText(text, targetLanguage) {
  if (!text || typeof text !== 'string') throw new Error('Valid text string is required');
  if (!targetLanguage || typeof targetLanguage !== 'string') throw new Error('Valid targetLanguage is required');

  const prompt = `Translate the following text to ${targetLanguage}. Return ONLY the translated text, no explanations or extra content.

Text to translate:
${text}`;

  const response = await getAI().models.generateContent({
    model: TRANSLATION_MODEL,
    contents: prompt,
    config: {
      temperature: 0.1,
      maxOutputTokens: 4096,
    },
  });

  return response.text.trim();
}
