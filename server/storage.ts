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
    name: "Boeing 737-800",
    emptyWeight: 41413,
    maxTakeoffWeight: 78999,
    maxPayload: 20865,
    fuelCapacity: 26020,
    baseFuelFlow: 2500,
    cruiseSpeed: 470,
    maxAltitude: 41000,
    maxRange: 5665,
    fuelEfficiency: 0.031,
    capacity: { min: 162, max: 189 },
    cargoCapacity: 20865,
    speed: 842
  },
  {
    name: "Airbus A320",
    emptyWeight: 42600,
    maxTakeoffWeight: 78000,
    maxPayload: 23000,
    fuelCapacity: 24210,
    baseFuelFlow: 2400,
    cruiseSpeed: 450,
    maxAltitude: 39000,
    maxRange: 6300,
    fuelEfficiency: 0.029,
    capacity: { min: 140, max: 240 },
    cargoCapacity: 23000,
    speed: 840
  },
  {
    name: "Airbus A350-900",
    emptyWeight: 142400,
    maxTakeoffWeight: 280000,
    maxPayload: 53300,
    fuelCapacity: 141000,
    baseFuelFlow: 7500,
    cruiseSpeed: 490,
    maxAltitude: 43100,
    maxRange: 8100,
    fuelEfficiency: 0.024,
    capacity: { min: 300, max: 350 },
    cargoCapacity: 53300,
    speed: 945
  },
  {
    name: "Boeing 787-9",
    emptyWeight: 128850,
    maxTakeoffWeight: 254011,
    maxPayload: 52587,
    fuelCapacity: 126372,
    baseFuelFlow: 7200,
    cruiseSpeed: 488,
    maxAltitude: 43100,
    maxRange: 7355,
    fuelEfficiency: 0.025,
    capacity: { min: 290, max: 335 },
    cargoCapacity: 52587,
    speed: 954
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