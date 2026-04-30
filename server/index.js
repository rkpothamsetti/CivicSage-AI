import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createChatSession, streamChatMessage, streamSingleMessage, generateQuizQuestions, translateText } from './gemini.js';
import { requestLoggingMiddleware, logEvent, logError, getPublicConfig } from './googleServices.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// --- Performance Middleware ---
app.use(compression());

// --- Google Cloud Logging Middleware ---
app.use(requestLoggingMiddleware());

// --- Security Middleware ---
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://maps.googleapis.com", "https://www.googletagmanager.com", "https://www.google-analytics.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      frameSrc: ["'self'", "https://www.google.com", "https://maps.google.com"],
      connectSrc: ["'self'", "https://www.google-analytics.com", "https://analytics.google.com"],
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
  let cleaned = 0;
  for (const [id, session] of chatSessions) {
    if (now - session.lastUsed > 30 * 60 * 1000) {
      chatSessions.delete(id);
      cleaned++;
    }
  }
  if (cleaned > 0) {
    logEvent('session_cleanup', { sessionsRemoved: cleaned, remaining: chatSessions.size });
  }
}, 30 * 60 * 1000);

// --- Helper: Extract meaningful error message ---
function getErrorMessage(error) {
  if (error?.status === 429) {
    return 'API quota exceeded. The free tier limit has been reached. Please wait a minute and try again, or update to a new API key.';
  }
  if (error?.status === 403) {
    return 'API key is invalid or lacks permissions. Please check your GEMINI_API_KEY.';
  }
  if (error?.message?.includes('Could not load the default credentials')) {
    return 'API key configuration error. The server failed to authenticate with the Gemini API.';
  }
  return 'An error occurred while generating a response. Please try again.';
}

// --- API Routes ---

// Health check with cache headers
app.get('/api/health', (req, res) => {
  res.set('Cache-Control', 'public, max-age=30');
  res.json({ status: 'healthy', service: 'CivicSage AI', timestamp: new Date().toISOString() });
});

// Public config endpoint — serves non-secret configuration to the frontend
app.get('/api/config', (req, res) => {
  res.set('Cache-Control', 'public, max-age=300');
  res.json(getPublicConfig());
});

// Chat endpoint with true token-by-token streaming
app.post('/api/chat', async (req, res) => {
  const startTime = Date.now();
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

    // Set up SSE streaming with no buffering
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
      'X-Session-Id': session.id,
    });

    // Flush headers immediately
    res.flushHeaders();

    // Send session ID first
    res.write(`data: ${JSON.stringify({ type: 'session', sessionId: session.id })}\n\n`);

    // Stream Gemini response - token by token
    let usedFallback = false;
    let stream;

    try {
      stream = await streamChatMessage(session.chat, cleanMessage);
    } catch (chatError) {
      // If chat session fails, try single-turn streaming as fallback
      logError('chat_stream', chatError, { sessionId: session.id, fallback: true });
      usedFallback = true;
      stream = await streamSingleMessage(cleanMessage);
    }

    for await (const chunk of stream) {
      const text = chunk.text || chunk.candidates?.[0]?.content?.parts?.[0]?.text || '';
      if (text) {
        res.write(`data: ${JSON.stringify({ type: 'chunk', text })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
    res.end();

    // Log successful chat interaction
    logEvent('chat_message', {
      sessionId: session.id,
      messageLength: cleanMessage.length,
      responseTime: `${Date.now() - startTime}ms`,
      usedFallback,
    });
  } catch (error) {
    logError('chat_endpoint', error, { responseTime: `${Date.now() - startTime}ms` });
    const errorMsg = getErrorMessage(error);
    if (!res.headersSent) {
      res.status(error?.status === 429 ? 429 : 500).json({ error: errorMsg });
    } else {
      res.write(`data: ${JSON.stringify({ type: 'error', error: errorMsg })}\n\n`);
      res.end();
    }
  }
});

// Quiz generation endpoint
app.post('/api/quiz', async (req, res) => {
  const startTime = Date.now();
  try {
    const { topic } = req.body;
    const questions = await generateQuizQuestions(topic || 'Indian election process');
    if (questions) {
      logEvent('quiz_generated', { topic: topic || 'default', questionCount: questions.length, responseTime: `${Date.now() - startTime}ms` });
      res.json({ questions });
    } else {
      res.status(500).json({ error: 'Failed to generate quiz questions.' });
    }
  } catch (error) {
    logError('quiz_endpoint', error);
    res.status(error?.status === 429 ? 429 : 500).json({ error: getErrorMessage(error) });
  }
});

// Translation endpoint
app.post('/api/translate', async (req, res) => {
  const startTime = Date.now();
  try {
    const { text, targetLanguage } = req.body;
    if (!text || !targetLanguage) {
      return res.status(400).json({ error: 'Text and targetLanguage are required.' });
    }
    if (text.length > 5000) {
      return res.status(400).json({ error: 'Text too long. Maximum 5000 characters.' });
    }
    const translated = await translateText(text, targetLanguage);
    logEvent('translation', { targetLanguage, textLength: text.length, responseTime: `${Date.now() - startTime}ms` });
    res.json({ translated });
  } catch (error) {
    logError('translate_endpoint', error);
    res.status(error?.status === 429 ? 429 : 500).json({ error: getErrorMessage(error) });
  }
});

// --- Serve Static Files (production) ---
if (process.env.NODE_ENV === 'production') {
  const distPath = join(__dirname, '..', 'dist');
  app.use(express.static(distPath, {
    maxAge: '1d',
    etag: true,
  }));
  app.get('{*path}', (req, res) => {
    res.sendFile(join(distPath, 'index.html'));
  });
}

// --- Start Server ---
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🏛️  CivicSage AI server running on port ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Gemini API: ${process.env.GEMINI_API_KEY ? 'Configured ✓' : 'NOT SET ✗'}`);
  logEvent('server_start', { port: PORT, environment: process.env.NODE_ENV || 'development' });
});
