// AviationStack API service
const API_BASE_URL = 'https://api.aviationstack.com/v1';

export interface FlightData {
  flight_date: string;
  flight_status: string;
  departure: {
    airport: string;
    timezone: string;
    iata: string;
    icao: string;
    terminal?: string;
    gate?: string;
    delay?: number;
    scheduled: string;
    estimated?: string;
    actual?: string;
  };
  arrival: {
    airport: string;
    timezone: string;
    iata: string;
    icao: string;
    terminal?: string;
    gate?: string;
    baggage?: string;
    delay?: number;
    scheduled: string;
    estimated?: string;
    actual?: string;
  };
  airline: {
    name: string;
    iata: string;
    icao: string;
  };
  flight: {
    number: string;
    iata: string;
    icao: string;
    codeshared?: any;
  };
  aircraft?: {
    registration: string;
    iata: string;
    icao: string;
    icao24: string;
  };
  live?: {
    updated: string;
    latitude: number;
    longitude: number;
    altitude: number;
    direction: number;
    speed_horizontal: number;
    speed_vertical: number;
    is_ground: boolean;
  };
}

export interface AirlineData {
  airline_name: string;
  iata_code: string;
  icao_code: string;
  callsign: string;
  country_name: string;
  country_iso2: string;
}

export interface AirportData {
  airport_name: string;
  iata_code: string;
  icao_code: string;
  latitude: number;
  longitude: number;
  geoname_id: string;
  timezone: string;
  gmt: string;
  phone_number: string;
  country_name: string;
  country_iso2: string;
  city_iata_code: string;
}

export interface AircraftTypeData {
  aircraft_name: string;
  iata_type: string;
  icao_type: string;
}

class AviationApiService {
  private apiKey: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_AVIATIONSTACK_API_KEY || '';
  }

  // Real-time flights
  async getFlights(params: {
    dep_iata?: string;
    arr_iata?: string;
    airline_iata?: string;
    flight_status?: string;
    limit?: number;
    offset?: number;
  }): Promise<FlightData[]> {
    try {
      const url = new URL(`${API_BASE_URL}/flights`);
      url.searchParams.append('access_key', this.apiKey);
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, value.toString());
        }
      });

      const response = await fetch(url.toString());
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }
      
      return data.data || [];
    } catch (error) {
      console.error('Aviation API Error:', error);
      return [];
    }
  }

  // Airlines
  async getAirlines(params: {
    airline_name?: string;
    iata_code?: string;
    icao_code?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<AirlineData[]> {
    try {
      const url = new URL(`${API_BASE_URL}/airlines`);
      url.searchParams.append('access_key', this.apiKey);
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, value.toString());
        }
      });

      const response = await fetch(url.toString());
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }
      
      return data.data || [];
    } catch (error) {
      console.error('Aviation API Error:', error);
      return [];
    }
  }

  // Airports
  async getAirports(params: {
    airport_name?: string;
    iata_code?: string;
    icao_code?: string;
    country_name?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<AirportData[]> {
    try {
      const url = new URL(`${API_BASE_URL}/airports`);
      url.searchParams.append('access_key', this.apiKey);
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, value.toString());
        }
      });

      const response = await fetch(url.toString());
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }
      
      return data.data || [];
    } catch (error) {
      console.error('Aviation API Error:', error);
      return [];
    }
  }

  // Aircraft Types
  async getAircraftTypes(params: {
    aircraft_name?: string;
    iata_type?: string;
    icao_type?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<AircraftTypeData[]> {
    try {
      const url = new URL(`${API_BASE_URL}/aircraft_types`);
      url.searchParams.append('access_key', this.apiKey);
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, value.toString());
        }
      });

      const response = await fetch(url.toString());
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }
      
      return data.data || [];
    } catch (error) {
      console.error('Aviation API Error:', error);
      return [];
    }
  }

  // Routes
  async getRoutes(params: {
    dep_iata?: string;
    arr_iata?: string;
    airline_iata?: string;
    flight_number?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<any[]> {
    try {
      const url = new URL(`${API_BASE_URL}/routes`);
      url.searchParams.append('access_key', this.apiKey);
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, value.toString());
        }
      });

      const response = await fetch(url.toString());
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }
      
      return data.data || [];
    } catch (error) {
      console.error('Aviation API Error:', error);
      return [];
    }
  }

  // Check if API key is available
  isApiKeyAvailable(): boolean {
    return this.apiKey !== '';
  }
}

export const aviationApi = new AviationApiService();