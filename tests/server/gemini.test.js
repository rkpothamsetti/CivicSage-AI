/**
 * Tests for Gemini API wrapper functions.
 * Mocks the @google/genai SDK to test our wrapper logic.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the @google/genai module
vi.mock('@google/genai', () => {
  const mockChat = {
    sendMessageStream: vi.fn(),
  };
  const mockModels = {
    generateContent: vi.fn(),
    generateContentStream: vi.fn(),
  };
  const mockChats = {
    create: vi.fn(() => mockChat),
  };
  const MockGoogleGenAI = vi.fn(() => ({
    chats: mockChats,
    models: mockModels,
  }));
  return { GoogleGenAI: MockGoogleGenAI, _mockChat: mockChat, _mockModels: mockModels, _mockChats: mockChats };
});

// Set env before importing
process.env.GEMINI_API_KEY = 'test-api-key-123';

describe('Gemini API Wrapper', () => {
  let gemini;
  let mocks;

  beforeEach(async () => {
    vi.resetModules();
    process.env.GEMINI_API_KEY = 'test-api-key-123';
    gemini = await import('../../server/gemini.js');
    mocks = await import('@google/genai');
  });

  describe('createChatSession', () => {
    it('should create a chat session with correct model config', () => {
      const chat = gemini.createChatSession();
      expect(mocks._mockChats.create).toHaveBeenCalledWith(
        expect.objectContaining({
          model: expect.any(String),
          config: expect.objectContaining({
            temperature: expect.any(Number),
            topP: expect.any(Number),
            maxOutputTokens: expect.any(Number),
          }),
        })
      );
      expect(chat).toBeDefined();
    });

    it('should include a system instruction', () => {
      gemini.createChatSession();
      const callArgs = mocks._mockChats.create.mock.calls[0][0];
      expect(callArgs.config.systemInstruction).toBeDefined();
      expect(callArgs.config.systemInstruction.length).toBeGreaterThan(100);
    });
  });

  describe('streamChatMessage', () => {
    it('should call sendMessageStream on the chat object', async () => {
      const mockStream = { [Symbol.asyncIterator]: async function* () { yield { text: 'Hello' }; } };
      mocks._mockChat.sendMessageStream.mockResolvedValue(mockStream);

      const chat = gemini.createChatSession();
      const stream = await gemini.streamChatMessage(chat, 'Test message');
      expect(stream).toBeDefined();
      expect(mocks._mockChat.sendMessageStream).toHaveBeenCalledWith({ message: 'Test message' });
    });
  });

  describe('streamSingleMessage', () => {
    it('should call generateContentStream with the message', async () => {
      const mockStream = { [Symbol.asyncIterator]: async function* () { yield { text: 'Response' }; } };
      mocks._mockModels.generateContentStream.mockResolvedValue(mockStream);

      const stream = await gemini.streamSingleMessage('Test question');
      expect(stream).toBeDefined();
      expect(mocks._mockModels.generateContentStream).toHaveBeenCalledWith(
        expect.objectContaining({
          contents: 'Test question',
          config: expect.objectContaining({
            systemInstruction: expect.any(String),
          }),
        })
      );
    });
  });

  describe('generateQuizQuestions', () => {
    it('should parse valid JSON quiz response', async () => {
      const mockQuestions = [
        {
          question: 'What is the voting age?',
          options: ['16', '18', '21', '25'],
          correct: 1,
          explanation: 'Voting age is 18.',
        },
      ];
      mocks._mockModels.generateContent.mockResolvedValue({
        text: JSON.stringify(mockQuestions),
      });

      const result = await gemini.generateQuizQuestions('test topic');
      expect(result).toEqual(mockQuestions);
    });

    it('should handle markdown-wrapped JSON response', async () => {
      const mockQuestions = [{ question: 'Q1', options: ['A', 'B', 'C', 'D'], correct: 0, explanation: 'Exp' }];
      mocks._mockModels.generateContent.mockResolvedValue({
        text: '```json\n' + JSON.stringify(mockQuestions) + '\n```',
      });

      const result = await gemini.generateQuizQuestions();
      expect(result).toEqual(mockQuestions);
    });

    it('should return null for invalid JSON response', async () => {
      mocks._mockModels.generateContent.mockResolvedValue({
        text: 'This is not JSON at all',
      });

      const result = await gemini.generateQuizQuestions();
      expect(result).toBeNull();
    });

    it('should use default topic when none provided', async () => {
      mocks._mockModels.generateContent.mockResolvedValue({
        text: '[]',
      });

      await gemini.generateQuizQuestions();
      const callArgs = mocks._mockModels.generateContent.mock.calls[0][0];
      expect(callArgs.contents).toContain('Indian election process');
    });
  });

  describe('translateText', () => {
    it('should return translated text', async () => {
      mocks._mockModels.generateContent.mockResolvedValue({
        text: '  अनुवादित पाठ  ',
      });

      const result = await gemini.translateText('Hello', 'Hindi');
      expect(result).toBe('अनुवादित पाठ');
    });

    it('should pass target language in prompt', async () => {
      mocks._mockModels.generateContent.mockClear();
      mocks._mockModels.generateContent.mockResolvedValue({ text: 'Translated' });

      await gemini.translateText('Hello', 'Tamil');
      const callArgs = mocks._mockModels.generateContent.mock.calls[0][0];
      expect(callArgs.contents).toContain('Tamil');
    });
  });
});
