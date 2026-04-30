/**
 * Tests for the HeroSection component.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import HeroSection from '../../src/components/HeroSection';

describe('HeroSection Component', () => {
  const defaultProps = { onStartChat: vi.fn(), onExploreTimeline: vi.fn() };

  it('should render the main heading', () => {
    render(<HeroSection {...defaultProps} />);
    expect(screen.getByText(/Understand Democracy/)).toBeInTheDocument();
  });

  it('should render CTA buttons', () => {
    render(<HeroSection {...defaultProps} />);
    expect(screen.getByText(/Ask the AI Assistant/)).toBeInTheDocument();
    expect(screen.getByText(/Explore the Timeline/)).toBeInTheDocument();
  });

  it('should call onStartChat when chat button clicked', () => {
    const fn = vi.fn();
    render(<HeroSection {...defaultProps} onStartChat={fn} />);
    fireEvent.click(screen.getByText(/Ask the AI Assistant/));
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should call onExploreTimeline when timeline button clicked', () => {
    const fn = vi.fn();
    render(<HeroSection {...defaultProps} onExploreTimeline={fn} />);
    fireEvent.click(screen.getByText(/Explore the Timeline/));
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should render election stats', () => {
    render(<HeroSection {...defaultProps} />);
    expect(screen.getByText('543')).toBeInTheDocument();
    expect(screen.getByText('950M+')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
  });

  it('should render floating icons', () => {
    const { container } = render(<HeroSection {...defaultProps} />);
    expect(container.querySelectorAll('.floating-icon').length).toBe(8);
  });
});
