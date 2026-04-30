import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../../src/components/ErrorBoundary';

// A component that always throws an error
const BuggyComponent = () => {
  throw new Error('Test rendering error');
};

describe('ErrorBoundary Component', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    // Suppress console.error during tests to keep output clean
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div data-testid="child">Safe Child</div>
      </ErrorBoundary>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('renders fallback UI when a child throws an error', () => {
    render(
      <ErrorBoundary>
        <BuggyComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText(/An unexpected error occurred/)).toBeInTheDocument();
    expect(consoleErrorSpy).toHaveBeenCalled(); // Ensure the error was caught and logged
  });
});
