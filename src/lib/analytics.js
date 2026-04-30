/**
 * Google Analytics Event Tracking Helper
 *
 * Provides a clean API for tracking user interactions via Google Analytics 4 (gtag.js).
 * Events are sent to the GA4 property configured in index.html.
 *
 * @see https://developers.google.com/analytics/devguides/collection/gtagjs/events
 */

/**
 * Send a custom event to Google Analytics.
 *
 * @param {string} eventName - GA4 event name (e.g., 'chat_message_sent')
 * @param {Object} [params={}] - Event parameters
 */
export function trackEvent(eventName, params = {}) {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', eventName, {
        event_category: params.category || 'engagement',
        ...params,
      });
    }
  } catch (error) {
    // Silently fail — analytics should never break the app
    console.debug('Analytics event failed:', error.message);
  }
}

/**
 * Track a chat message being sent.
 * @param {number} messageLength - Length of user message
 */
export function trackChatMessage(messageLength) {
  trackEvent('chat_message_sent', {
    category: 'ai_chat',
    message_length: messageLength,
  });
}

/**
 * Track a quiz completion.
 * @param {number} score - User's quiz score
 * @param {number} total - Total questions
 */
export function trackQuizComplete(score, total) {
  trackEvent('quiz_completed', {
    category: 'quiz',
    score,
    total,
    percentage: Math.round((score / total) * 100),
  });
}

/**
 * Track tab navigation.
 * @param {string} tabId - ID of the tab navigated to
 */
export function trackTabChange(tabId) {
  trackEvent('tab_navigation', {
    category: 'navigation',
    tab_id: tabId || 'home',
  });
}

/**
 * Track a timeline phase being explored.
 * @param {string} phaseName - Name of the timeline phase
 */
export function trackTimelineExpand(phaseName) {
  trackEvent('timeline_phase_expanded', {
    category: 'timeline',
    phase_name: phaseName,
  });
}

/**
 * Track a process explorer topic being clicked.
 * @param {string} topicName - Name of the topic
 */
export function trackTopicExplored(topicName) {
  trackEvent('topic_explored', {
    category: 'process_explorer',
    topic_name: topicName,
  });
}

/**
 * Track a language change.
 * @param {string} languageCode - ISO language code
 * @param {string} languageName - Human-readable language name
 */
export function trackLanguageChange(languageCode, languageName) {
  trackEvent('language_changed', {
    category: 'localization',
    language_code: languageCode,
    language_name: languageName,
  });
}

/**
 * Track a polling booth search.
 * @param {string} query - Search query
 */
export function trackPollingSearch(query) {
  trackEvent('polling_booth_search', {
    category: 'polling_finder',
    search_query: query,
  });
}
