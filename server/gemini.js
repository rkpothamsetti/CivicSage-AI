import { GoogleGenAI } from '@google/genai';
import { SYSTEM_PROMPT } from './electionData.js';

let _ai = null;
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

/**
 * Create a new chat session with election-focused system prompt.
 */
export function createChatSession() {
  const chat = getAI().chats.create({
    model: 'gemini-2.0-flash',
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
 */
export async function streamChatMessage(chat, message) {
  const response = await chat.sendMessageStream({ message });
  return response;
}

/**
 * Single-turn streaming response (no chat history needed).
 * This is more reliable for one-off questions.
 */
export async function streamSingleMessage(message) {
  const response = await getAI().models.generateContentStream({
    model: 'gemini-2.0-flash',
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
 */
export async function generateQuizQuestions(topic = 'Indian election process') {
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
    model: 'gemini-2.0-flash',
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
 * Translate text using Gemini (as a fallback / free translation method).
 * For production, Google Cloud Translation API would be used.
 */
export async function translateText(text, targetLanguage) {
  const prompt = `Translate the following text to ${targetLanguage}. Return ONLY the translated text, no explanations or extra content.

Text to translate:
${text}`;

  const response = await getAI().models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
    config: {
      temperature: 0.1,
      maxOutputTokens: 4096,
    },
  });

  return response.text.trim();
}
