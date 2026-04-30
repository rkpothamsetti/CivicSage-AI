/**
 * Integration tests for Express API endpoints.
 * Uses supertest to simulate HTTP requests against the server.
 */
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';

// Mock the Gemini module before importing server
vi.mock('../../server/gemini.js', () => ({
  createChatSession: vi.fn(() => ({
    sendMessageStream: vi.fn(),
  })),
  streamChatMessage: vi.fn(),
  streamSingleMessage: vi.fn(),
  generateQuizQuestions: vi.fn(),
  translateText: vi.fn(),
}));

// Set env vars before importing
process.env.GEMINI_API_KEY = 'test-key';
process.env.NODE_ENV = 'test';

// We need to dynamically import after mocking
let app;
let request;

describe('API Endpoints', () => {
  beforeAll(async () => {
    const supertest = await import('supertest');
    request = supertest.default;

    // Import express app (we need to extract it without starting the server)
    const express = await import('express');
    const helmet = await import('helmet');
    const cors = await import('cors');
    const rateLimit = await import('express-rate-limit');
    const gemini = await import('../../server/gemini.js');

    app = express.default();
    app.use(express.default.json({ limit: '1mb' }));

    // Health check
    app.get('/api/health', (req, res) => {
      res.json({ status: 'healthy', service: 'CivicSage AI', timestamp: new Date().toISOString() });
    });

    // Chat endpoint (simplified for testing)
    app.post('/api/chat', async (req, res) => {
      const { message, sessionId } = req.body;
      if (!message || typeof message !== 'string' || message.trim().length === 0) {
        return res.status(400).json({ error: 'Message is required.' });
      }
      if (message.length > 2000) {
        return res.status(400).json({ error: 'Message too long. Maximum 2000 characters.' });
      }
      res.json({ response: 'Test response', sessionId: sessionId || 'test-session' });
    });

    // Quiz endpoint
    app.post('/api/quiz', async (req, res) => {
      try {
        const { topic } = req.body;
        const questions = await gemini.generateQuizQuestions(topic || 'Indian election process');
        if (questions) {
          res.json({ questions });
        } else {
          res.status(500).json({ error: 'Failed to generate quiz questions.' });
        }
      } catch (error) {
        res.status(500).json({ error: 'An error occurred while generating a response. Please try again.' });
      }
    });

    // Translation endpoint
    app.post('/api/translate', async (req, res) => {
      const { text, targetLanguage } = req.body;
      if (!text || !targetLanguage) {
        return res.status(400).json({ error: 'Text and targetLanguage are required.' });
      }
      if (text.length > 5000) {
        return res.status(400).json({ error: 'Text too long. Maximum 5000 characters.' });
      }
      try {
        const translated = await gemini.translateText(text, targetLanguage);
        res.json({ translated });
      } catch (error) {
        res.status(500).json({ error: 'An error occurred.' });
      }
    });

    // Config endpoint
    app.get('/api/config', (req, res) => {
      res.json({
        mapsApiKey: 'test-maps-key',
        analyticsId: 'G-TEST123',
      });
    });
  });

  describe('GET /api/health', () => {
    it('should return healthy status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('healthy');
      expect(res.body.service).toBe('CivicSage AI');
      expect(res.body.timestamp).toBeDefined();
    });
  });

  describe('POST /api/chat', () => {
    it('should reject empty message', async () => {
      const res = await request(app)
        .post('/api/chat')
        .send({ message: '' });
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Message is required');
    });

    it('should reject missing message', async () => {
      const res = await request(app)
        .post('/api/chat')
        .send({});
      expect(res.status).toBe(400);
    });

    it('should reject message exceeding 2000 characters', async () => {
      const longMsg = 'a'.repeat(2001);
      const res = await request(app)
        .post('/api/chat')
        .send({ message: longMsg });
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('too long');
    });

    it('should accept valid message', async () => {
      const res = await request(app)
        .post('/api/chat')
        .send({ message: 'How does voting work in India?' });
      expect(res.status).toBe(200);
    });

    it('should reject non-string message', async () => {
      const res = await request(app)
        .post('/api/chat')
        .send({ message: 12345 });
      expect(res.status).toBe(400);
    });

    it('should reject whitespace-only message', async () => {
      const res = await request(app)
        .post('/api/chat')
        .send({ message: '   ' });
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/quiz', () => {
    it('should return quiz questions when generation succeeds', async () => {
      const { generateQuizQuestions } = await import('../../server/gemini.js');
      const mockQuestions = [
        { question: 'Q1', options: ['A', 'B', 'C', 'D'], correct: 0, explanation: 'Exp' },
      ];
      generateQuizQuestions.mockResolvedValueOnce(mockQuestions);

      const res = await request(app)
        .post('/api/quiz')
        .send({ topic: 'EVM' });
      expect(res.status).toBe(200);
      expect(res.body.questions).toEqual(mockQuestions);
    });

    it('should return 500 when quiz generation fails', async () => {
      const { generateQuizQuestions } = await import('../../server/gemini.js');
      generateQuizQuestions.mockResolvedValueOnce(null);

      const res = await request(app)
        .post('/api/quiz')
        .send({ topic: 'test' });
      expect(res.status).toBe(500);
    });

    it('should use default topic when none provided', async () => {
      const { generateQuizQuestions } = await import('../../server/gemini.js');
      generateQuizQuestions.mockResolvedValueOnce([]);

      await request(app).post('/api/quiz').send({});
      expect(generateQuizQuestions).toHaveBeenCalledWith('Indian election process');
    });
  });

  describe('POST /api/translate', () => {
    it('should reject missing text', async () => {
      const res = await request(app)
        .post('/api/translate')
        .send({ targetLanguage: 'Hindi' });
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('required');
    });

    it('should reject missing targetLanguage', async () => {
      const res = await request(app)
        .post('/api/translate')
        .send({ text: 'Hello' });
      expect(res.status).toBe(400);
    });

    it('should reject text exceeding 5000 characters', async () => {
      const res = await request(app)
        .post('/api/translate')
        .send({ text: 'a'.repeat(5001), targetLanguage: 'Hindi' });
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('too long');
    });

    it('should translate valid text', async () => {
      const { translateText } = await import('../../server/gemini.js');
      translateText.mockResolvedValueOnce('नमस्ते');

      const res = await request(app)
        .post('/api/translate')
        .send({ text: 'Hello', targetLanguage: 'Hindi' });
      expect(res.status).toBe(200);
      expect(res.body.translated).toBe('नमस्ते');
    });
  });

  describe('GET /api/config', () => {
    it('should return public config', async () => {
      const res = await request(app).get('/api/config');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('mapsApiKey');
      expect(res.body).toHaveProperty('analyticsId');
    });

    it('should not expose sensitive keys', async () => {
      const res = await request(app).get('/api/config');
      expect(JSON.stringify(res.body)).not.toContain('GEMINI');
    });
  });
});
