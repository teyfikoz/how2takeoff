
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FilterForm from '../components/aircraft/FilterForm';

describe('FilterForm Component - Unit Tests', () => {
  const mockOnFilter = vi.fn();

  beforeEach(() => {
    mockOnFilter.mockClear();
  });

  it('should render all form fields', () => {
    render(<FilterForm onFilter={mockOnFilter} />);
    
    expect(screen.getByLabelText('Number of Passengers')).toBeInTheDocument();
    expect(screen.getByLabelText('Cargo Weight (kg)')).toBeInTheDocument();
    expect(screen.getByLabelText('Range (km)')).toBeInTheDocument();
    expect(screen.getByLabelText('Alternate Range (km)')).toBeInTheDocument();
    expect(screen.getByText(/Wind Speed \(kt\):/)).toBeInTheDocument();
    expect(screen.getByText(/Wind Direction \(degrees\):/)).toBeInTheDocument();
  });

  it('should have correct default values', () => {
    render(<FilterForm onFilter={mockOnFilter} />);
    
    expect(screen.getByLabelText('Number of Passengers')).toHaveValue(300);
    expect(screen.getByLabelText('Cargo Weight (kg)')).toHaveValue(15000);
    expect(screen.getByLabelText('Range (km)')).toHaveValue(10000);
    expect(screen.getByLabelText('Alternate Range (km)')).toHaveValue(11000);
  });

  it('should call onFilter on form submission', () => {
    render(<FilterForm onFilter={mockOnFilter} />);
    
    const submitButton = screen.getByText('Find Aircraft');
    fireEvent.click(submitButton);
    
    expect(mockOnFilter).toHaveBeenCalledWith({
      passengers: 300,
      cargo: 15000,
      range: 10000,
      alternateRange: 11000,
      windSpeed: 20,
      windDirection: 0
    });
  });

  it('should validate minimum values', async () => {
    render(<FilterForm onFilter={mockOnFilter} />);
    
    const passengerInput = screen.getByLabelText('Number of Passengers');
    fireEvent.change(passengerInput, { target: { value: '-1' } });
    
    const submitButton = screen.getByText('Find Aircraft');
    fireEvent.click(submitButton);
    
    // Form validation should prevent negative values
    expect(screen.getByText(/Number of passengers must be greater than 0/)).toBeInTheDocument();
  });
});
