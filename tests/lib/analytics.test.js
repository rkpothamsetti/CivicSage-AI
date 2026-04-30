import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  trackEvent,
  trackChatMessage,
  trackQuizComplete,
  trackTabChange,
  trackTimelineExpand,
  trackTopicExplored,
  trackLanguageChange,
  trackPollingSearch
} from '../../src/lib/analytics';

describe('Analytics Helpers', () => {
  let originalGtag;

  beforeEach(() => {
    originalGtag = window.gtag;
    window.gtag = vi.fn();
  });

  afterEach(() => {
    window.gtag = originalGtag;
  });

  it('trackEvent calls window.gtag with correct parameters', () => {
    trackEvent('test_event', { category: 'test_category', value: 123 });
    expect(window.gtag).toHaveBeenCalledWith('event', 'test_event', {
      category: 'test_category',
      event_category: 'test_category',
      value: 123
    });
  });

  it('trackEvent falls back to engagement category', () => {
    trackEvent('test_event');
    expect(window.gtag).toHaveBeenCalledWith('event', 'test_event', {
      event_category: 'engagement'
    });
  });

  it('trackEvent fails silently if gtag throws', () => {
    window.gtag.mockImplementation(() => { throw new Error('gtag error'); });
    // Should not throw
    expect(() => trackEvent('test')).not.toThrow();
  });

  it('trackChatMessage tracks message length', () => {
    trackChatMessage(50);
    expect(window.gtag).toHaveBeenCalledWith('event', 'chat_message_sent', {
      category: 'ai_chat',
      event_category: 'ai_chat',
      message_length: 50
    });
  });

  it('trackQuizComplete tracks score and percentage', () => {
    trackQuizComplete(4, 5);
    expect(window.gtag).toHaveBeenCalledWith('event', 'quiz_completed', {
      category: 'quiz',
      event_category: 'quiz',
      score: 4,
      total: 5,
      percentage: 80
    });
  });

  it('trackTabChange tracks tab id', () => {
    trackTabChange('timeline');
    expect(window.gtag).toHaveBeenCalledWith('event', 'tab_navigation', {
      category: 'navigation',
      event_category: 'navigation',
      tab_id: 'timeline'
    });
  });

  it('trackTimelineExpand tracks phase name', () => {
    trackTimelineExpand('Phase 1');
    expect(window.gtag).toHaveBeenCalledWith('event', 'timeline_phase_expanded', {
      category: 'timeline',
      event_category: 'timeline',
      phase_name: 'Phase 1'
    });
  });

  it('trackTopicExplored tracks topic', () => {
    trackTopicExplored('EVMs');
    expect(window.gtag).toHaveBeenCalledWith('event', 'topic_explored', {
      category: 'process_explorer',
      event_category: 'process_explorer',
      topic_name: 'EVMs'
    });
  });

  it('trackLanguageChange tracks language code and name', () => {
    trackLanguageChange('hi', 'Hindi');
    expect(window.gtag).toHaveBeenCalledWith('event', 'language_changed', {
      category: 'localization',
      event_category: 'localization',
      language_code: 'hi',
      language_name: 'Hindi'
    });
  });

  it('trackPollingSearch tracks search query', () => {
    trackPollingSearch('Delhi');
    expect(window.gtag).toHaveBeenCalledWith('event', 'polling_booth_search', {
      category: 'polling_finder',
      event_category: 'polling_finder',
      search_query: 'Delhi'
    });
  });
});
