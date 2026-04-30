/**
 * Tests for the QuizSection component.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// Mock API
vi.mock('../../src/lib/api', () => ({
  generateQuiz: vi.fn(),
}));

import QuizSection from '../../src/components/QuizSection';

describe('QuizSection Component', () => {
  it('should render section header', () => {
    render(<QuizSection />);
    expect(screen.getByText(/Election Quiz/)).toBeInTheDocument();
  });

  it('should display the first question', () => {
    render(<QuizSection />);
    expect(screen.getByText('Question 1')).toBeInTheDocument();
  });

  it('should display 4 options', () => {
    render(<QuizSection />);
    const options = screen.getAllByRole('radio');
    expect(options.length).toBe(4);
  });

  it('should show explanation after selecting an answer', () => {
    render(<QuizSection />);
    const options = screen.getAllByRole('radio');
    fireEvent.click(options[0]);
    expect(screen.getByText(/💡/)).toBeInTheDocument();
  });

  it('should show next button after answering', () => {
    render(<QuizSection />);
    const options = screen.getAllByRole('radio');
    fireEvent.click(options[0]);
    expect(screen.getByText(/Next Question/)).toBeInTheDocument();
  });

  it('should advance to next question', () => {
    render(<QuizSection />);
    const options = screen.getAllByRole('radio');
    fireEvent.click(options[0]);
    fireEvent.click(screen.getByText(/Next Question/));
    expect(screen.getByText('Question 2')).toBeInTheDocument();
  });

  it('should show score tracker', () => {
    render(<QuizSection />);
    expect(screen.getByText((content, element) => content.includes('Score:'))).toBeInTheDocument();
  });

  it('should show progress bar', () => {
    const { container } = render(<QuizSection />);
    expect(container.querySelector('.quiz-progress-bar')).toBeInTheDocument();
  });

  it('should prevent double-selection', () => {
    render(<QuizSection />);
    const options = screen.getAllByRole('radio');
    fireEvent.click(options[0]);
    // All options should be disabled after selection
    options.forEach(opt => expect(opt).toBeDisabled());
  });
});
