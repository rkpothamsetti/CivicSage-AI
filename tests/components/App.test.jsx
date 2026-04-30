/**
 * Tests for the main App component.
 * Verifies tab navigation, initial render, and component switching.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// Mock all child components to isolate App logic
vi.mock('../../src/components/Header', () => ({
  default: ({ activeTab, onTabChange }) => (
    <header data-testid="header">
      <button data-testid="nav-chat" onClick={() => onTabChange('chat')}>Chat</button>
      <button data-testid="nav-home" onClick={() => onTabChange(null)}>Home</button>
    </header>
  ),
}));

vi.mock('../../src/components/HeroSection', () => ({
  default: ({ onStartChat, onExploreTimeline }) => (
    <section data-testid="hero">
      <button data-testid="hero-chat" onClick={onStartChat}>Start Chat</button>
      <button data-testid="hero-timeline" onClick={onExploreTimeline}>Timeline</button>
    </section>
  ),
}));

vi.mock('../../src/components/ChatAssistant', () => ({
  default: ({ initialMessage }) => <div data-testid="chat-assistant">Chat: {initialMessage}</div>,
}));

vi.mock('../../src/components/Timeline', () => ({
  default: () => <div data-testid="timeline">Timeline</div>,
}));

vi.mock('../../src/components/ProcessExplorer', () => ({
  default: () => <div data-testid="process-explorer">Explorer</div>,
}));

vi.mock('../../src/components/QuizSection', () => ({
  default: () => <div data-testid="quiz-section">Quiz</div>,
}));

vi.mock('../../src/components/PollingFinder', () => ({
  default: () => <div data-testid="polling-finder">Finder</div>,
}));

vi.mock('../../src/components/Footer', () => ({
  default: () => <footer data-testid="footer">Footer</footer>,
}));

// Import App after mocks
import App from '../../src/App.jsx';

describe('App Component', () => {
  it('should render hero section on initial load', () => {
    render(<App />);
    expect(screen.getByTestId('hero')).toBeInTheDocument();
  });

  it('should render header on initial load', () => {
    render(<App />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('should render footer on initial load', () => {
    render(<App />);
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('should not show tab nav on initial load', () => {
    render(<App />);
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('should switch to chat when nav button is clicked', async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('nav-chat'));
    expect(await screen.findByTestId('chat-assistant')).toBeInTheDocument();
    expect(screen.queryByTestId('hero')).not.toBeInTheDocument();
  });

  it('should return to hero when home is clicked', async () => {
    render(<App />);
    // First go to chat
    fireEvent.click(screen.getByTestId('nav-chat'));
    expect(screen.queryByTestId('hero')).not.toBeInTheDocument();

    // Then go back home
    fireEvent.click(screen.getByTestId('nav-home'));
    expect(screen.getByTestId('hero')).toBeInTheDocument();
  });

  it('should navigate from hero to chat', async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('hero-chat'));
    expect(await screen.findByTestId('chat-assistant')).toBeInTheDocument();
  });

  it('should navigate from hero to timeline', async () => {
    render(<App />);
    fireEvent.click(screen.getByTestId('hero-timeline'));
    expect(await screen.findByTestId('timeline')).toBeInTheDocument();
  });
});
