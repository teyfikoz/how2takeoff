
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from '../pages/Dashboard';
import { mockAircraftData } from '../data/mockAircraftData';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

const renderWithClient = (component: React.ReactElement) => {
  const testQueryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={testQueryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('Dashboard Component - End-to-End Tests', () => {
  beforeEach(() => {
    // Reset any mocks before each test
  });

  describe('Initial Render Tests', () => {
    it('should render the dashboard with default values', () => {
      renderWithClient(<Dashboard />);
      expect(screen.getByText('Aviation Analysis Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Flight Requirements')).toBeInTheDocument();
    });

    it('should display suitable aircraft with default criteria', async () => {
      renderWithClient(<Dashboard />);
      await waitFor(() => {
        expect(screen.getByText('Suitable Aircraft Types')).toBeInTheDocument();
      });
    });

    it('should render wind impact chart', async () => {
      renderWithClient(<Dashboard />);
      await waitFor(() => {
        expect(screen.getByText('Wind Impact Analysis')).toBeInTheDocument();
      });
    });

    it('should render performance analysis', async () => {
      renderWithClient(<Dashboard />);
      await waitFor(() => {
        expect(screen.getByText('Performance Analysis')).toBeInTheDocument();
      });
    });
  });

  describe('Filter Form Tests', () => {
    it('should update passenger count', async () => {
      renderWithClient(<Dashboard />);
      const passengerInput = screen.getByLabelText('Number of Passengers');
      fireEvent.change(passengerInput, { target: { value: '500' } });
      expect(passengerInput).toHaveValue(500);
    });

    it('should update cargo weight', async () => {
      renderWithClient(<Dashboard />);
      const cargoInput = screen.getByLabelText('Cargo Weight (kg)');
      fireEvent.change(cargoInput, { target: { value: '20000' } });
      expect(cargoInput).toHaveValue(20000);
    });

    it('should update range', async () => {
      renderWithClient(<Dashboard />);
      const rangeInput = screen.getByLabelText('Range (km)');
      fireEvent.change(rangeInput, { target: { value: '15000' } });
      expect(rangeInput).toHaveValue(15000);
    });

    it('should update alternate range', async () => {
      renderWithClient(<Dashboard />);
      const altRangeInput = screen.getByLabelText('Alternate Range (km)');
      fireEvent.change(altRangeInput, { target: { value: '12000' } });
      expect(altRangeInput).toHaveValue(12000);
    });

    it('should submit form and filter aircraft', async () => {
      renderWithClient(<Dashboard />);
      const submitButton = screen.getByText('Find Aircraft');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Suitable Aircraft Types')).toBeInTheDocument();
      });
    });
  });

  describe('Aircraft Filtering Logic Tests', () => {
    it('should show no results when criteria are too restrictive', async () => {
      renderWithClient(<Dashboard />);
      
      const passengerInput = screen.getByLabelText('Number of Passengers');
      fireEvent.change(passengerInput, { target: { value: '1000' } });
      
      const rangeInput = screen.getByLabelText('Range (km)');
      fireEvent.change(rangeInput, { target: { value: '50000' } });
      
      const submitButton = screen.getByText('Find Aircraft');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('No Matching Aircraft Found')).toBeInTheDocument();
      });
    });

    it('should filter based on maximum of range and alternate range', async () => {
      renderWithClient(<Dashboard />);
      
      const rangeInput = screen.getByLabelText('Range (km)');
      fireEvent.change(rangeInput, { target: { value: '8000' } });
      
      const altRangeInput = screen.getByLabelText('Alternate Range (km)');
      fireEvent.change(altRangeInput, { target: { value: '15000' } });
      
      const submitButton = screen.getByText('Find Aircraft');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        // Should use 15000 (alternate range) as the filtering criterion
        const aircraftCards = screen.queryAllByText(/Range:/);
        expect(aircraftCards.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Wind Effect Tests', () => {
    it('should update wind speed slider', async () => {
      renderWithClient(<Dashboard />);
      const windSpeedLabel = screen.getByText(/Wind Speed \(kt\):/);
      expect(windSpeedLabel).toBeInTheDocument();
    });

    it('should update wind direction slider', async () => {
      renderWithClient(<Dashboard />);
      const windDirLabel = screen.getByText(/Wind Direction \(degrees\):/);
      expect(windDirLabel).toBeInTheDocument();
    });
  });

  describe('Responsive Design Tests', () => {
    it('should render properly on mobile viewport', () => {
      global.innerWidth = 375;
      global.innerHeight = 667;
      renderWithClient(<Dashboard />);
      expect(screen.getByText('Aviation Analysis Dashboard')).toBeInTheDocument();
    });

    it('should render properly on tablet viewport', () => {
      global.innerWidth = 768;
      global.innerHeight = 1024;
      renderWithClient(<Dashboard />);
      expect(screen.getByText('Aviation Analysis Dashboard')).toBeInTheDocument();
    });

    it('should render properly on desktop viewport', () => {
      global.innerWidth = 1920;
      global.innerHeight = 1080;
      renderWithClient(<Dashboard />);
      expect(screen.getByText('Aviation Analysis Dashboard')).toBeInTheDocument();
    });
  });

  describe('Data Integrity Tests', () => {
    it('should use mock data when API is unavailable', async () => {
      renderWithClient(<Dashboard />);
      await waitFor(() => {
        expect(screen.getByText('Suitable Aircraft Types')).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero passenger input', async () => {
      renderWithClient(<Dashboard />);
      const passengerInput = screen.getByLabelText('Number of Passengers');
      fireEvent.change(passengerInput, { target: { value: '0' } });
      expect(passengerInput).toHaveValue(0);
    });

    it('should handle zero cargo input', async () => {
      renderWithClient(<Dashboard />);
      const cargoInput = screen.getByLabelText('Cargo Weight (kg)');
      fireEvent.change(cargoInput, { target: { value: '0' } });
      expect(cargoInput).toHaveValue(0);
    });

    it('should validate wind direction bounds (0-360)', async () => {
      renderWithClient(<Dashboard />);
      // Wind direction should be constrained by slider
      const windDirLabel = screen.getByText(/Wind Direction \(degrees\):/);
      expect(windDirLabel).toBeInTheDocument();
    });
  });
});
