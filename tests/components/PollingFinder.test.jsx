/**
 * Tests for the PollingFinder component.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import PollingFinder from '../../src/components/PollingFinder';

// Mock fetch for config API
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ mapsApiKey: 'test-key' }),
  })
);

describe('PollingFinder Component', () => {
  it('should render section header', () => {
    render(<PollingFinder />);
    expect(screen.getByText(/Find Your Polling Booth/)).toBeInTheDocument();
  });

  it('should render search input', () => {
    render(<PollingFinder />);
    expect(screen.getByPlaceholderText(/area, city, or pincode/i)).toBeInTheDocument();
  });

  it('should render search button', () => {
    render(<PollingFinder />);
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('should render map iframe', async () => {
    render(<PollingFinder />);
    const iframe = await screen.findByTitle('Polling Station Finder');
    expect(iframe).toBeInTheDocument();
    expect(iframe.tagName).toBe('IFRAME');
  });

  it('should render tips section', () => {
    render(<PollingFinder />);
    expect(screen.getByText(/Tips to find your booth/)).toBeInTheDocument();
  });

  it('should render ECI link', () => {
    render(<PollingFinder />);
    expect(screen.getByText('voters.eci.gov.in')).toBeInTheDocument();
  });

  it('should render Voter Helpline App link', () => {
    render(<PollingFinder />);
    expect(screen.getByText('Voter Helpline App')).toBeInTheDocument();
  });

  it('should update search input on change', () => {
    render(<PollingFinder />);
    const input = screen.getByPlaceholderText(/area, city, or pincode/i);
    fireEvent.change(input, { target: { value: 'Delhi' } });
    expect(input.value).toBe('Delhi');
  });
});
