/**
 * Tests for the API client library.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateQuiz, translateTextApi } from '../../src/lib/api';

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('API Client', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  describe('generateQuiz', () => {
    it('should send POST request with topic', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ questions: [{ question: 'Q1' }] }),
      });

      const result = await generateQuiz('EVMs');
      expect(mockFetch).toHaveBeenCalledWith('/api/quiz', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ topic: 'EVMs' }),
      }));
      expect(result).toEqual([{ question: 'Q1' }]);
    });

    it('should throw on non-ok response', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: 'Quiz generation failed' }),
      });

      await expect(generateQuiz('test')).rejects.toThrow('Quiz generation failed');
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));
      await expect(generateQuiz('test')).rejects.toThrow('Network error');
    });
  });

  describe('translateTextApi', () => {
    it('should send text and target language', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ translated: 'नमस्ते' }),
      });

      const result = await translateTextApi('Hello', 'Hindi');
      expect(mockFetch).toHaveBeenCalledWith('/api/translate', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ text: 'Hello', targetLanguage: 'Hindi' }),
      }));
      expect(result).toBe('नमस्ते');
    });

    it('should throw on error response', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: 'Translation failed' }),
      });

      await expect(translateTextApi('Hello', 'Hindi')).rejects.toThrow('Translation failed');
    });
  });
});
