// AI Decision Engine - Mathematical Core
// This is where the REAL intelligence happens

import { mockAircraftData } from "../../client/src/data/mockAircraftData";
import { AIRPORTS } from "../../client/src/data/airports-db";

interface Aircraft {
  name: string;
  maxPassengers: number;
  cargoCapacity: number;
  maxRange: number;
  cruiseSpeed: number;
  fuelEfficiency: number;
  co2Factor: number;
}

interface Airport {
  iata: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
}

interface AircraftScore {
  aircraft: string;
  score: number;
  fuelEfficiency: number;
  operatingCost: number;
  revenue: number;
  profit: number;
  co2Emissions: number;
  breakEvenLoadFactor: number;
  details: {
    range: number;
    passengers: number;
    cargo: number;
    cruiseSpeed: number;
  };
  reasoning: string[];
}

export class DecisionEngine {
  private aircraftDatabase: Aircraft[];
  private airportsDatabase: Airport[];

  constructor() {
    this.aircraftDatabase = mockAircraftData as unknown as Aircraft[];
    this.airportsDatabase = AIRPORTS;
  }

  /**
   * Main recommendation algorithm
   */
  async recommend(
    origin: string,
    destination: string,
    passengers: number,
    cargo_kg: number = 0,
    preferences?: {
      prioritizeCost?: boolean;
      prioritizeEnvironment?: boolean;
      prioritizeSpeed?: boolean;
    },
    economicParams?: {
      rask?: number;     // Revenue per Available Seat Kilometer (default: 0.12)
      cask?: number;     // Cost per Available Seat Kilometer (default: 0.08)
      loadFactor?: number; // Expected load factor (default: 0.80)
      fuelPrice?: number;  // Fuel price per liter (default: 0.75)
    }
  ): Promise<AircraftScore[]> {

    // Step 1: Find airports
    const originAirport = this.airportsDatabase.find(a => a.iata.toUpperCase() === origin.toUpperCase());
    const destAirport = this.airportsDatabase.find(a => a.iata.toUpperCase() === destination.toUpperCase());

    if (!originAirport || !destAirport) {
      throw new Error(`Invalid airport code: ${!originAirport ? origin : destination}`);
    }

    // Step 2: Calculate route distance
    const distance = this.calculateDistance(
      originAirport.lat, originAirport.lon,
      destAirport.lat, destAirport.lon
    );

    // Step 3: Filter suitable aircraft
    const suitable = this.aircraftDatabase.filter(aircraft => {
      return (
        aircraft.maxRange >= distance * 1.1 && // 10% safety margin
        aircraft.maxPassengers >= passengers &&
        aircraft.cargoCapacity >= cargo_kg
      );
    });

    if (suitable.length === 0) {
      throw new Error(`No aircraft can handle this mission. Required: ${passengers} pax, ${cargo_kg}kg cargo, ${Math.round(distance)}km range`);
    }

    // Step 4: Calculate scores for each aircraft
    const scored = suitable.map(aircraft => {
      return this.calculateScore(aircraft, distance, passengers, cargo_kg, preferences, economicParams);
    });

    // Step 5: Sort by score (descending)
    scored.sort((a, b) => b.score - a.score);

    return scored;
  }

  /**
   * Calculate comprehensive score for an aircraft
   */
  private calculateScore(
    aircraft: Aircraft,
    distance: number,
    passengers: number,
    cargo_kg: number,
    preferences?: any,
    economicParams?: {
      rask?: number;
      cask?: number;
      loadFactor?: number;
      fuelPrice?: number;
    }
  ): AircraftScore {

    const reasoning: string[] = [];

    // Economic parameters with defaults
    const RASK = economicParams?.rask ?? 0.12;      // Revenue per ASK (typical: $0.10-$0.15)
    const CASK = economicParams?.cask ?? 0.08;      // Cost per ASK (typical: $0.06-$0.12)
    const loadFactor = economicParams?.loadFactor ?? 0.80; // Load factor (typical: 0.75-0.85)
    const fuelPrice = economicParams?.fuelPrice ?? 0.75;   // Fuel price per liter

    // Calculate fuel consumption
    const fuelConsumption = aircraft.fuelEfficiency * distance;
    const fuelCost = fuelConsumption * fuelPrice;

    // Calculate operating cost (CASK model)
    const ASK = distance * aircraft.maxPassengers; // Available Seat Kilometers
    const operatingCost = CASK * ASK + fuelCost;

    // Calculate revenue (RASK model)
    const RPK = ASK * loadFactor; // Revenue Passenger Kilometers
    const revenue = RASK * RPK;

    // Calculate profit
    const profit = revenue - operatingCost;

    // Calculate CO2 emissions
    const fuelKg = fuelConsumption * 0.8; // Fuel density ~0.8 kg/L
    const co2Emissions = fuelKg * aircraft.co2Factor;

    // Calculate break-even load factor
    const breakEvenLoadFactor = Math.min(1.0, operatingCost / (RASK * ASK));

    // Weighted scoring
    let score = 0;

    // 1. Fuel efficiency (0-30 points)
    const avgEfficiency = 3.0; // Average L/km for commercial aircraft
    const efficiencyScore = Math.max(0, (avgEfficiency - aircraft.fuelEfficiency) / avgEfficiency * 30);
    score += efficiencyScore;

    if (aircraft.fuelEfficiency < 2.5) {
      reasoning.push(`Excellent fuel efficiency: ${aircraft.fuelEfficiency.toFixed(1)}L/km`);
    }

    // 2. Profitability (0-40 points)
    const profitScore = Math.max(0, Math.min(40, profit / 1000));
    score += profitScore;

    if (profit > 30000) {
      reasoning.push(`High profitability: $${Math.round(profit).toLocaleString()} per flight`);
    }

    // 3. Environmental (0-20 points)
    const co2PerPassenger = co2Emissions / (aircraft.maxPassengers * loadFactor);
    const avgCO2 = 100; // kg per passenger (typical)
    const envScore = Math.max(0, (avgCO2 - co2PerPassenger) / avgCO2 * 20);
    score += envScore;

    if (co2PerPassenger < 80) {
      reasoning.push(`Low emissions: ${Math.round(co2PerPassenger)}kg CO2 per passenger`);
    }

    // 4. Capacity utilization (0-10 points)
    const passengerUtil = passengers / aircraft.maxPassengers;
    const cargoUtil = cargo_kg / aircraft.cargoCapacity;
    const utilScore = (passengerUtil + cargoUtil) / 2 * 10;
    score += utilScore;

    if (passengerUtil > 0.85) {
      reasoning.push(`Efficient capacity usage: ${Math.round(passengerUtil * 100)}% utilization`);
    }

    // Apply user preferences
    if (preferences?.prioritizeCost) {
      score = profitScore * 1.5 + efficiencyScore * 1.2 + envScore * 0.8;
      reasoning.push('Optimized for cost efficiency');
    } else if (preferences?.prioritizeEnvironment) {
      score = envScore * 2 + profitScore * 0.8 + efficiencyScore * 1.2;
      reasoning.push('Optimized for environmental impact');
    } else if (preferences?.prioritizeSpeed) {
      const speedBonus = (aircraft.cruiseSpeed - 800) / 10;
      score += speedBonus;
      reasoning.push(`Fast cruise speed: ${aircraft.cruiseSpeed} knots`);
    }

    return {
      aircraft: aircraft.name,
      score: Math.round(score),
      fuelEfficiency: aircraft.fuelEfficiency,
      operatingCost,
      revenue,
      profit,
      co2Emissions,
      breakEvenLoadFactor: Math.round(breakEvenLoadFactor * 100),
      details: {
        range: aircraft.maxRange,
        passengers: aircraft.maxPassengers,
        cargo: aircraft.cargoCapacity,
        cruiseSpeed: aircraft.cruiseSpeed
      },
      reasoning: reasoning.slice(0, 3)
    };
  }

  /**
   * Haversine distance formula
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
      Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
