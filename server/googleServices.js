/**
 * Google Cloud Services Integration
 *
 * Provides structured logging compatible with Google Cloud Logging,
 * request timing middleware, and configuration management.
 *
 * In production (Cloud Run), logs written to stdout in JSON format
 * are automatically ingested by Google Cloud Logging.
 */

/**
 * Severity levels matching Google Cloud Logging spec.
 * @see https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#LogSeverity
 */
const SEVERITY = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
  CRITICAL: 'CRITICAL',
};

/**
 * Write a structured log entry compatible with Google Cloud Logging.
 * When running on Cloud Run, JSON logs to stdout are automatically
 * parsed and indexed by Cloud Logging.
 *
 * @param {string} severity - Log severity level
 * @param {string} message - Log message
 * @param {Object} [metadata={}] - Additional structured metadata
 */
export function log(severity, message, metadata = {}) {
  const entry = {
    severity,
    message,
    timestamp: new Date().toISOString(),
    service: 'civicsage-ai',
    ...metadata,
  };

  if (severity === SEVERITY.ERROR || severity === SEVERITY.CRITICAL) {
    console.error(JSON.stringify(entry));
  } else {
    console.log(JSON.stringify(entry));
  }
}

/**
 * Express middleware that logs each request with timing information.
 * Captures method, path, status code, response time, and user agent.
 *
 * @returns {Function} Express middleware function
 */
export function requestLoggingMiddleware() {
  return (req, res, next) => {
    const start = Date.now();
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

    // Attach request ID for correlation
    req.requestId = requestId;

    res.on('finish', () => {
      const duration = Date.now() - start;
      const severity = res.statusCode >= 500 ? SEVERITY.ERROR
        : res.statusCode >= 400 ? SEVERITY.WARNING
        : SEVERITY.INFO;

      log(severity, `${req.method} ${req.path} ${res.statusCode}`, {
        httpRequest: {
          requestMethod: req.method,
          requestUrl: req.originalUrl,
          status: res.statusCode,
          latency: `${duration}ms`,
          userAgent: req.get('user-agent') || 'unknown',
          remoteIp: req.ip,
        },
        requestId,
        labels: {
          endpoint: req.path,
          method: req.method,
        },
      });
    });

    next();
  };
}

/**
 * Log an API interaction event for analytics.
 *
 * @param {string} eventType - Type of event (chat, quiz, translate, etc.)
 * @param {Object} details - Event-specific details
 */
export function logEvent(eventType, details = {}) {
  log(SEVERITY.INFO, `Event: ${eventType}`, {
    event: {
      type: eventType,
      ...details,
    },
    labels: {
      category: 'user_interaction',
      event_type: eventType,
    },
  });
}

/**
 * Log an error with full context.
 *
 * @param {string} context - Where the error occurred
 * @param {Error} error - The error object
 * @param {Object} [metadata={}] - Additional context
 */
export function logError(context, error, metadata = {}) {
  log(SEVERITY.ERROR, `Error in ${context}: ${error.message}`, {
    error: {
      message: error.message,
      stack: error.stack,
      status: error.status || error.statusCode,
    },
    context,
    ...metadata,
  });
}

/**
 * Get public configuration that can be safely sent to the client.
 * Filters out sensitive values like API keys.
 *
 * @returns {Object} Public configuration object
 */
export function getPublicConfig() {
  return {
    mapsApiKey: process.env.GOOGLE_MAPS_API_KEY || 'AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8',
    analyticsId: process.env.GA_MEASUREMENT_ID || 'G-XXXXXXXXXX',
    appVersion: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  };
}

export { SEVERITY };
