import { 
  type Aircraft, type InsertAircraft,
  type Calculation, type InsertCalculation,
  aircraftTypes, flightCalculations
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getAllAircraft(): Promise<Aircraft[]>;
  createAircraft(aircraft: InsertAircraft): Promise<Aircraft>;
  saveCalculation(calculation: InsertCalculation): Promise<Calculation>;
}

const initialAircraftData: InsertAircraft[] = [
  {
    name: "Airbus A320neo",
    emptyWeight: 45000,
    maxTakeoffWeight: 79000,
    maxPayload: 20000,
    fuelCapacity: 23760,
    baseFuelFlow: 2400,
    cruiseSpeed: 450,
    maxAltitude: 39000,
    maxRange: 3500,
    fuelEfficiency: 0.85
  },
  {
    name: "Boeing 737 MAX",
    emptyWeight: 45070,
    maxTakeoffWeight: 82190,
    maxPayload: 20880,
    fuelCapacity: 25941,
    baseFuelFlow: 2500,
    cruiseSpeed: 470,
    maxAltitude: 41000,
    maxRange: 3550,
    fuelEfficiency: 0.86
  },
  {
    name: "Embraer E195-E2",
    emptyWeight: 35700,
    maxTakeoffWeight: 61500,
    maxPayload: 16150,
    fuelCapacity: 13690,
    baseFuelFlow: 1800,
    cruiseSpeed: 440,
    maxAltitude: 41000,
    maxRange: 2600,
    fuelEfficiency: 0.88
  },
  {
    name: "Airbus A220-300",
    emptyWeight: 37000,
    maxTakeoffWeight: 69900,
    maxPayload: 18000,
    fuelCapacity: 17726,
    baseFuelFlow: 1900,
    cruiseSpeed: 450,
    maxAltitude: 41000,
    maxRange: 3400,
    fuelEfficiency: 0.89
  }
];

export class DatabaseStorage implements IStorage {
  async getAllAircraft(): Promise<Aircraft[]> {
    const aircraft = await db.select().from(aircraftTypes);
    if (aircraft.length === 0) {
      // Seed initial data if no aircraft exist
      const seededAircraft = await Promise.all(
        initialAircraftData.map(data => this.createAircraft(data))
      );
      return seededAircraft;
    }
    return aircraft;
  }

  async createAircraft(insertAircraft: InsertAircraft): Promise<Aircraft> {
    const [aircraft] = await db
      .insert(aircraftTypes)
      .values(insertAircraft)
      .returning();
    return aircraft;
  }

  async saveCalculation(insertCalculation: InsertCalculation): Promise<Calculation> {
    const [calculation] = await db
      .insert(flightCalculations)
      .values(insertCalculation)
      .returning();
    return calculation;
  }
}

export const storage = new DatabaseStorage();