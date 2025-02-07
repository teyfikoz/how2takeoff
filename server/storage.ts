import { 
  type Aircraft, type InsertAircraft,
  type User, type InsertUser,
  type Analytics, type InsertAnalytics,
  type Calculation, type InsertCalculation,
  aircraftTypes, users, userAnalytics, flightCalculations,
  type ProfileClick, type InsertProfileClick, profileClicks
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Aircraft methods
  getAllAircraft(): Promise<Aircraft[]>;
  createAircraft(aircraft: InsertAircraft): Promise<Aircraft>;
  saveCalculation(calculation: InsertCalculation): Promise<Calculation>;

  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  updateUserLoginStats(userId: number, stats: { lastLogin: Date; visitCount: number }): Promise<void>;

  // Analytics methods
  saveAnalytics(analytics: InsertAnalytics): Promise<void>;
  getAnalytics(): Promise<Analytics[]>;

  // Profile analytics methods
  saveProfileClick(click: InsertProfileClick): Promise<void>;
  getProfileClicks(): Promise<ProfileClick[]>;
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
    name: "Airbus A220",
    emptyWeight: 35000,
    maxTakeoffWeight: 60800,
    maxPayload: 12000,
    fuelCapacity: 21000,
    baseFuelFlow: 1800,
    cruiseSpeed: 447,
    maxAltitude: 41000,
    maxRange: 6300,
    fuelEfficiency: 0.025,
    capacity: { min: 100, max: 160 },
    cargoCapacity: 12000,
    speed: 828
  },
  {
    name: "Airbus A300",
    emptyWeight: 90000,
    maxTakeoffWeight: 171700,
    maxPayload: 38000,
    fuelCapacity: 68150,
    baseFuelFlow: 5000,
    cruiseSpeed: 432,
    maxAltitude: 41000,
    maxRange: 9600,
    fuelEfficiency: 0.028,
    capacity: { min: 250, max: 300 },
    cargoCapacity: 38000,
    speed: 800
  },
  {
    name: "Airbus A318",
    emptyWeight: 39500,
    maxTakeoffWeight: 68000,
    maxPayload: 10000,
    fuelCapacity: 23860,
    baseFuelFlow: 2200,
    cruiseSpeed: 420,
    maxAltitude: 39000,
    maxRange: 5700,
    fuelEfficiency: 0.027,
    capacity: { min: 107, max: 132 },
    cargoCapacity: 10000,
    speed: 780
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
    name: "Airbus A380",
    emptyWeight: 277000,
    maxTakeoffWeight: 575000,
    maxPayload: 84000,
    fuelCapacity: 320000,
    baseFuelFlow: 13000,
    cruiseSpeed: 490,
    maxAltitude: 43100,
    maxRange: 15200,
    fuelEfficiency: 0.022,
    capacity: { min: 500, max: 853 },
    cargoCapacity: 84000,
    speed: 903
  },
  {
    name: "Boeing 737 MAX 8",
    emptyWeight: 45070,
    maxTakeoffWeight: 82190,
    maxPayload: 20865,
    fuelCapacity: 25941,
    baseFuelFlow: 2400,
    cruiseSpeed: 453,
    maxAltitude: 41000,
    maxRange: 6570,
    fuelEfficiency: 0.029,
    capacity: { min: 178, max: 210 },
    cargoCapacity: 20865,
    speed: 839
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
    name: "Boeing 767-300ER",
    emptyWeight: 90000,
    maxTakeoffWeight: 186880,
    maxPayload: 45000,
    fuelCapacity: 90770,
    baseFuelFlow: 5500,
    cruiseSpeed: 459,
    maxAltitude: 43100,
    maxRange: 11070,
    fuelEfficiency: 0.027,
    capacity: { min: 218, max: 269 },
    cargoCapacity: 45000,
    speed: 850
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
    name: "Boeing 787-10",
    emptyWeight: 135500,
    maxTakeoffWeight: 254011,
    maxPayload: 27000,
    fuelCapacity: 126372,
    baseFuelFlow: 7400,
    cruiseSpeed: 490,
    maxAltitude: 43100,
    maxRange: 11910,
    fuelEfficiency: 0.024,
    capacity: { min: 318, max: 318 },
    cargoCapacity: 27000,
    speed: 910
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
  // Existing aircraft methods
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

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    return user;
  }

  async updateUserLoginStats(userId: number, stats: { lastLogin: Date; visitCount: number }): Promise<void> {
    await db
      .update(users)
      .set({
        lastLogin: stats.lastLogin,
        visitCount: stats.visitCount
      })
      .where(eq(users.id, userId));
  }

  // Analytics methods
  async saveAnalytics(analytics: InsertAnalytics): Promise<void> {
    await db
      .insert(userAnalytics)
      .values(analytics);
  }

  async getAnalytics(): Promise<Analytics[]> {
    return db
      .select()
      .from(userAnalytics)
      .orderBy(userAnalytics.timestamp);
  }
    // Profile analytics methods
  async saveProfileClick(click: InsertProfileClick): Promise<void> {
    await db
      .insert(profileClicks)
      .values(click);
  }

  async getProfileClicks(): Promise<ProfileClick[]> {
    return db
      .select()
      .from(profileClicks)
      .orderBy(profileClicks.timestamp);
  }
}

export const storage = new DatabaseStorage();