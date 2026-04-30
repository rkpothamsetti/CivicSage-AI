/**
 * Global test setup for Vitest
 * Configures DOM matchers and global mocks
 */
import '@testing-library/jest-dom';

// Mock IntersectionObserver for components using scroll-based features
class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.IntersectionObserver = MockIntersectionObserver;

// Mock scrollIntoView for chat auto-scroll
Element.prototype.scrollIntoView = vi.fn();

// Mock window.scrollTo
window.scrollTo = vi.fn();

// Suppress console errors in tests unless debugging
const originalError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('act(') || args[0].includes('Warning:'))
  ) {
    return;
  }
  originalError.call(console, ...args);
};
