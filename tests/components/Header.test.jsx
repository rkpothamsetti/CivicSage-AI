/**
 * Tests for the Header component.
 * Verifies logo, navigation, and language selector.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import Header from '../../src/components/Header';

describe('Header Component', () => {
  const defaultProps = {
    activeTab: null,
    onTabChange: vi.fn(),
  };

  it('should render logo text', () => {
    render(<Header {...defaultProps} />);
    expect(screen.getByText('CivicSage')).toBeInTheDocument();
    expect(screen.getByText('AI')).toBeInTheDocument();
  });

  it('should render all navigation items', () => {
    render(<Header {...defaultProps} />);
    expect(screen.getByText('AI Chat')).toBeInTheDocument();
    expect(screen.getByText('Timeline')).toBeInTheDocument();
    expect(screen.getByText('Explorer')).toBeInTheDocument();
    expect(screen.getByText('Quiz')).toBeInTheDocument();
    expect(screen.getByText('Find Booth')).toBeInTheDocument();
  });

  it('should call onTabChange when nav item is clicked', () => {
    const onTabChange = vi.fn();
    render(<Header {...defaultProps} onTabChange={onTabChange} />);
    fireEvent.click(screen.getByText('AI Chat'));
    expect(onTabChange).toHaveBeenCalledWith('chat');
  });

  it('should highlight active tab', () => {
    render(<Header {...defaultProps} activeTab="quiz" />);
    expect(screen.getByText('Quiz').className).toContain('active');
  });

  it('should render Gemini badge', () => {
    render(<Header {...defaultProps} />);
    expect(screen.getByText(/Powered by Gemini/)).toBeInTheDocument();
  });

  it('should render language selector', () => {
    render(<Header {...defaultProps} />);
    expect(screen.getByText(/English/)).toBeInTheDocument();
  });

  it('should toggle language dropdown on click', () => {
    render(<Header {...defaultProps} />);
    const langBtn = screen.getByText(/English/);
    fireEvent.click(langBtn);
    expect(screen.getByText('Hindi')).toBeInTheDocument();
    expect(screen.getByText('हिन्दी')).toBeInTheDocument();
  });

  it('should navigate home when logo is clicked', () => {
    const onTabChange = vi.fn();
    render(<Header {...defaultProps} onTabChange={onTabChange} />);
    fireEvent.click(screen.getByText('CivicSage'));
    expect(onTabChange).toHaveBeenCalledWith(null);
  });
});
