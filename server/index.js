import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createChatSession, streamChatMessage, generateQuizQuestions, translateText } from './gemini.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// --- Security Middleware ---
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://maps.googleapis.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      frameSrc: ["'self'", "https://www.google.com", "https://maps.google.com"],
      connectSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? true : 'http://localhost:5173',
}));

app.use(express.json({ limit: '1mb' }));

// Rate limiting: 30 requests per minute per IP
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again in a minute.' },
});
app.use('/api', apiLimiter);

// --- In-memory chat session store ---
const chatSessions = new Map();

// Cleanup old sessions every 30 minutes
setInterval(() => {
  const now = Date.now();
  for (const [id, session] of chatSessions) {
    if (now - session.lastUsed > 30 * 60 * 1000) {
      chatSessions.delete(id);
    }
  }
}, 30 * 60 * 1000);

// --- API Routes ---

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', service: 'CivicSage AI', timestamp: new Date().toISOString() });
});

// Chat endpoint with streaming
app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    if (message.length > 2000) {
      return res.status(400).json({ error: 'Message too long. Maximum 2000 characters.' });
    }

    // Sanitize input
    const cleanMessage = message.trim();

    // Get or create chat session
    let session;
    if (sessionId && chatSessions.has(sessionId)) {
      session = chatSessions.get(sessionId);
      session.lastUsed = Date.now();
    } else {
      const newId = sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const chat = createChatSession();
      session = { chat, id: newId, lastUsed: Date.now() };
      chatSessions.set(newId, session);
    }

    // Set up SSE streaming
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'X-Session-Id': session.id,
    });

    // Send session ID first
    res.write(`data: ${JSON.stringify({ type: 'session', sessionId: session.id })}\n\n`);

    // Stream Gemini response
    const stream = await streamChatMessage(session.chat, cleanMessage);
    for await (const chunk of stream) {
      if (chunk.text) {
        res.write(`data: ${JSON.stringify({ type: 'chunk', text: chunk.text })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
    res.end();
  } catch (error) {
    console.error('Chat error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to process chat message. Please try again.' });
    } else {
      res.write(`data: ${JSON.stringify({ type: 'error', error: 'An error occurred. Please try again.' })}\n\n`);
      res.end();
    }
  }
});

// Quiz generation endpoint
app.post('/api/quiz', async (req, res) => {
  try {
    const { topic } = req.body;
    const questions = await generateQuizQuestions(topic || 'Indian election process');
    if (questions) {
      res.json({ questions });
    } else {
      res.status(500).json({ error: 'Failed to generate quiz questions.' });
    }
  } catch (error) {
    console.error('Quiz error:', error);
    res.status(500).json({ error: 'Failed to generate quiz. Please try again.' });
  }
});

// Translation endpoint
app.post('/api/translate', async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;
    if (!text || !targetLanguage) {
      return res.status(400).json({ error: 'Text and targetLanguage are required.' });
    }
    if (text.length > 5000) {
      return res.status(400).json({ error: 'Text too long. Maximum 5000 characters.' });
    }
    const translated = await translateText(text, targetLanguage);
    res.json({ translated });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: 'Translation failed. Please try again.' });
  }
});

// --- Serve Static Files (production) ---
if (process.env.NODE_ENV === 'production') {
  const distPath = join(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(join(distPath, 'index.html'));
  });
}

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`🏛️  CivicSage AI server running on port ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Gemini API: ${process.env.GEMINI_API_KEY ? 'Configured ✓' : 'NOT SET ✗'}`);
});
