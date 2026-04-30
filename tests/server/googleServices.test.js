import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { log, SEVERITY, requestLoggingMiddleware, logEvent, logError, getPublicConfig } from '../../server/googleServices.js';

describe('Google Services Module', () => {
  let consoleLogSpy;
  let consoleErrorSpy;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-30T10:00:00.000Z'));
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    vi.useRealTimers();
  });

  it('log() outputs structured JSON to console.log for INFO', () => {
    log(SEVERITY.INFO, 'Test message', { extra: 'data' });
    expect(consoleLogSpy).toHaveBeenCalled();
    const logOutput = JSON.parse(consoleLogSpy.mock.calls[0][0]);
    expect(logOutput.severity).toBe('INFO');
    expect(logOutput.message).toBe('Test message');
    expect(logOutput.extra).toBe('data');
    expect(logOutput.service).toBe('civicsage-ai');
  });

  it('log() outputs structured JSON to console.error for ERROR', () => {
    log(SEVERITY.ERROR, 'Test error message');
    expect(consoleErrorSpy).toHaveBeenCalled();
    const logOutput = JSON.parse(consoleErrorSpy.mock.calls[0][0]);
    expect(logOutput.severity).toBe('ERROR');
  });

  it('logEvent() logs an interaction event', () => {
    logEvent('button_click', { button: 'submit' });
    expect(consoleLogSpy).toHaveBeenCalled();
    const logOutput = JSON.parse(consoleLogSpy.mock.calls[0][0]);
    expect(logOutput.event.type).toBe('button_click');
    expect(logOutput.labels.category).toBe('user_interaction');
  });

  it('logError() logs full error context', () => {
    const err = new Error('Database failure');
    logError('db_init', err);
    expect(consoleErrorSpy).toHaveBeenCalled();
    const logOutput = JSON.parse(consoleErrorSpy.mock.calls[0][0]);
    expect(logOutput.error.message).toBe('Database failure');
    expect(logOutput.context).toBe('db_init');
  });

  it('getPublicConfig() returns expected non-secret config', () => {
    const config = getPublicConfig();
    expect(config.mapsApiKey).toBeDefined();
    expect(config.analyticsId).toBeDefined();
    expect(config.appVersion).toBe('1.0.0');
  });

  describe('requestLoggingMiddleware', () => {
    it('logs HTTP request metrics on response finish', () => {
      const middleware = requestLoggingMiddleware();
      const req = {
        method: 'GET',
        path: '/api/test',
        originalUrl: '/api/test',
        ip: '127.0.0.1',
        get: vi.fn().mockReturnValue('TestAgent'),
      };
      const res = {
        statusCode: 200,
        on: vi.fn((event, callback) => {
          if (event === 'finish') {
            callback();
          }
        }),
      };
      const next = vi.fn();

      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalled();
      
      const logOutput = JSON.parse(consoleLogSpy.mock.calls[0][0]);
      expect(logOutput.httpRequest.requestMethod).toBe('GET');
      expect(logOutput.httpRequest.status).toBe(200);
      expect(logOutput.httpRequest.userAgent).toBe('TestAgent');
    });
  });
});
