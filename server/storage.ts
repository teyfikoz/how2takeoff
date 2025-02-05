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

export class DatabaseStorage implements IStorage {
  async getAllAircraft(): Promise<Aircraft[]> {
    return await db.select().from(aircraftTypes);
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