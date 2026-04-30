/**
 * Tests for the ProcessExplorer component.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import ProcessExplorer from '../../src/components/ProcessExplorer';

describe('ProcessExplorer Component', () => {
  const onAskAI = vi.fn();

  it('should render section header', () => {
    render(<ProcessExplorer onAskAI={onAskAI} />);
    expect(screen.getByText(/Process Explorer/)).toBeInTheDocument();
  });

  it('should render all topic cards', () => {
    render(<ProcessExplorer onAskAI={onAskAI} />);
    expect(screen.getByText('Voter Registration')).toBeInTheDocument();
    expect(screen.getByText('EVM & VVPAT')).toBeInTheDocument();
    expect(screen.getByText('Model Code of Conduct')).toBeInTheDocument();
    expect(screen.getByText('Vote Counting')).toBeInTheDocument();
    expect(screen.getByText('Election Commission')).toBeInTheDocument();
    expect(screen.getByText('Types of Elections')).toBeInTheDocument();
    expect(screen.getByText('Voter Rights')).toBeInTheDocument();
    expect(screen.getByText('SVEEP Program')).toBeInTheDocument();
  });

  it('should render learn more buttons', () => {
    render(<ProcessExplorer onAskAI={onAskAI} />);
    const learnBtns = screen.getAllByText(/Learn more/);
    expect(learnBtns.length).toBe(8);
  });

  it('should call onAskAI when card is clicked', () => {
    const fn = vi.fn();
    render(<ProcessExplorer onAskAI={fn} />);
    fireEvent.click(screen.getByText('Voter Registration').closest('.process-card'));
    expect(fn).toHaveBeenCalledWith(expect.stringContaining('Voter Registration'));
  });

  it('should render topic descriptions', () => {
    render(<ProcessExplorer onAskAI={onAskAI} />);
    expect(screen.getByText(/how to register/i)).toBeInTheDocument();
  });
});
