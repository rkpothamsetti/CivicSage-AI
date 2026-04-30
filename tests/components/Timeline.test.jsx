/**
 * Tests for the Timeline component.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import Timeline from '../../src/components/Timeline';

describe('Timeline Component', () => {
  const onAskAI = vi.fn();

  it('should render section header', () => {
    render(<Timeline onAskAI={onAskAI} />);
    expect(screen.getByText(/Election Timeline/)).toBeInTheDocument();
  });

  it('should render all 8 timeline phases', () => {
    render(<Timeline onAskAI={onAskAI} />);
    expect(screen.getAllByText(/Delimitation/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Announcement/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Nomination/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Scrutiny/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Withdrawal/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Campaign/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Polling/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Counting/)[0]).toBeInTheDocument();
  });

  it('should expand card when clicked', () => {
    render(<Timeline onAskAI={onAskAI} />);
    const firstCard = screen.getByText('Constituency Boundaries');
    fireEvent.click(firstCard.closest('.timeline-card'));
    expect(screen.getByText(/Ask AI about this phase/)).toBeInTheDocument();
  });

  it('should collapse card when clicked again', () => {
    render(<Timeline onAskAI={onAskAI} />);
    const firstCard = screen.getByText('Constituency Boundaries').closest('.timeline-card');
    fireEvent.click(firstCard);
    expect(screen.getByText(/Ask AI about this phase/)).toBeInTheDocument();
    fireEvent.click(firstCard);
    expect(screen.queryByText(/Ask AI about this phase/)).not.toBeInTheDocument();
  });

  it('should call onAskAI when ask button is clicked', () => {
    const fn = vi.fn();
    render(<Timeline onAskAI={fn} />);
    const firstCard = screen.getByText('Constituency Boundaries').closest('.timeline-card');
    fireEvent.click(firstCard);
    fireEvent.click(screen.getByText(/Ask AI about this phase/));
    expect(fn).toHaveBeenCalledWith(expect.stringContaining('Delimitation'));
  });
});
