import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// Mock freighter hook
vi.mock('./hooks/useFreighter', () => ({
  useFreighter: () => ({
    address: 'GA123...456',
    connect: vi.fn(),
    error: null,
  })
}));

describe('NovaVest App', () => {
  it('renders the header and brand name', () => {
    render(<App />);
    expect(screen.getByText(/NovaVest/i)).toBeInTheDocument();
  });

  it('renders mock campaigns in the explore tab', () => {
    render(<App />);
    expect(screen.getByText(/Orbit Protocol/i)).toBeInTheDocument();
    expect(screen.getByText(/Stellar DEX Aggregator/i)).toBeInTheDocument();
  });

  it('can click a campaign to view details', () => {
    render(<App />);
    const campaignCard = screen.getByText(/Orbit Protocol/i);
    fireEvent.click(campaignCard);
    
    expect(screen.getByText(/Back to Explore/i)).toBeInTheDocument();
    expect(screen.getByText(/Invest & Get Gov Tokens/i)).toBeInTheDocument();
    expect(screen.getByText(/Alpha Launch/i)).toBeInTheDocument();
  });
});
