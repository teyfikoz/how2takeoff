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
    name: "Airbus A319",
    emptyWeight: 40800,
    maxTakeoffWeight: 75500,
    maxPayload: 17700,
    fuelCapacity: 23860,
    baseFuelFlow: 2300,
    cruiseSpeed: 450,
    maxAltitude: 39000,
    maxRange: 6950,
    fuelEfficiency: 0.028,
    capacity: { min: 140, max: 160 },
    cargoCapacity: 17700,
    speed: 840
  },
  {
    name: "Airbus A321",
    emptyWeight: 48500,
    maxTakeoffWeight: 93500,
    maxPayload: 25300,
    fuelCapacity: 26700,
    baseFuelFlow: 2600,
    cruiseSpeed: 450,
    maxAltitude: 39000,
    maxRange: 7400,
    fuelEfficiency: 0.030,
    capacity: { min: 185, max: 240 },
    cargoCapacity: 25300,
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
    name: "Airbus A350-1000",
    emptyWeight: 155000,
    maxTakeoffWeight: 319000,
    maxPayload: 56000,
    fuelCapacity: 159000,
    baseFuelFlow: 7800,
    cruiseSpeed: 490,
    maxAltitude: 43100,
    maxRange: 16100,
    fuelEfficiency: 0.023,
    capacity: { min: 410, max: 440 },
    cargoCapacity: 56000,
    speed: 910
  },
  {
    name: "Boeing 747-8",
    emptyWeight: 220128,
    maxTakeoffWeight: 447696,
    maxPayload: 76700,
    fuelCapacity: 238840,
    baseFuelFlow: 11000,
    cruiseSpeed: 490,
    maxAltitude: 43100,
    maxRange: 14320,
    fuelEfficiency: 0.026,
    capacity: { min: 410, max: 524 },
    cargoCapacity: 76700,
    speed: 910
  },
  {
    name: "Boeing 777-200ER",
    emptyWeight: 138100,
    maxTakeoffWeight: 297556,
    maxPayload: 54000,
    fuelCapacity: 171170,
    baseFuelFlow: 7900,
    cruiseSpeed: 490,
    maxAltitude: 43100,
    maxRange: 14800,
    fuelEfficiency: 0.025,
    capacity: { min: 314, max: 396 },
    cargoCapacity: 54000,
    speed: 905
  },
  {
    name: "Boeing 787-8",
    emptyWeight: 119950,
    maxTakeoffWeight: 227930,
    maxPayload: 43318,
    fuelCapacity: 126206,
    baseFuelFlow: 7000,
    cruiseSpeed: 488,
    maxAltitude: 43100,
    maxRange: 13530,
    fuelEfficiency: 0.024,
    capacity: { min: 242, max: 290 },
    cargoCapacity: 43318,
    speed: 910
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
  },
  {
    name: "Embraer E170",
    emptyWeight: 21140,
    maxTakeoffWeight: 37200,
    maxPayload: 9100,
    fuelCapacity: 12971,
    baseFuelFlow: 1500,
    cruiseSpeed: 430,
    maxAltitude: 41000,
    maxRange: 4600,
    fuelEfficiency: 0.027,
    capacity: { min: 66, max: 78 },
    cargoCapacity: 9100,
    speed: 780
  },
  {
    name: "Embraer E195",
    emptyWeight: 28970,
    maxTakeoffWeight: 50790,
    maxPayload: 13933,
    fuelCapacity: 16153,
    baseFuelFlow: 1800,
    cruiseSpeed: 450,
    maxAltitude: 41000,
    maxRange: 4800,
    fuelEfficiency: 0.026,
    capacity: { min: 100, max: 124 },
    cargoCapacity: 13933,
    speed: 830
  },
  {
    name: "Bombardier CRJ900",
    emptyWeight: 21500,
    maxTakeoffWeight: 38000,
    maxPayload: 10319,
    fuelCapacity: 14100,
    baseFuelFlow: 1600,
    cruiseSpeed: 430,
    maxAltitude: 41000,
    maxRange: 2500,
    fuelEfficiency: 0.028,
    capacity: { min: 76, max: 90 },
    cargoCapacity: 10319,
    speed: 780
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