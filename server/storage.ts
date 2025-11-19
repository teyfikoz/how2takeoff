import {
  type Aircraft, type InsertAircraft,
  type User, type InsertUser,
  type Analytics, type InsertAnalytics,
  type Calculation, type InsertCalculation,
  aircraftTypes, users, userAnalytics, flightCalculations,
  type ProfileClick, type InsertProfileClick, profileClicks
} from "@shared/schema";
import { db, isDatabaseAvailable } from "./db";
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
  },
  {
    name: "Boeing 737 MAX 9",
    emptyWeight: 45600,
    maxTakeoffWeight: 88300,
    maxPayload: 21000,
    fuelCapacity: 26020,
    baseFuelFlow: 2450,
    cruiseSpeed: 453,
    maxAltitude: 41000,
    maxRange: 6515,
    fuelEfficiency: 0.029,
    capacity: { min: 178, max: 220 },
    cargoCapacity: 21000,
    speed: 842
  },
  {
    name: "Boeing 737 MAX 10",
    emptyWeight: 46900,
    maxTakeoffWeight: 88900,
    maxPayload: 22000,
    fuelCapacity: 26020,
    baseFuelFlow: 2500,
    cruiseSpeed: 453,
    maxAltitude: 41000,
    maxRange: 6110,
    fuelEfficiency: 0.030,
    capacity: { min: 188, max: 230 },
    cargoCapacity: 22000,
    speed: 839
  },
  {
    name: "Boeing 777-300ER",
    emptyWeight: 167800,
    maxTakeoffWeight: 351534,
    maxPayload: 68900,
    fuelCapacity: 181280,
    baseFuelFlow: 8900,
    cruiseSpeed: 490,
    maxAltitude: 43100,
    maxRange: 13649,
    fuelEfficiency: 0.026,
    capacity: { min: 365, max: 451 },
    cargoCapacity: 68900,
    speed: 905
  },
  {
    name: "Boeing 777-9",
    emptyWeight: 184615,
    maxTakeoffWeight: 351534,
    maxPayload: 69680,
    fuelCapacity: 197978,
    baseFuelFlow: 9200,
    cruiseSpeed: 490,
    maxAltitude: 43100,
    maxRange: 13940,
    fuelEfficiency: 0.023,
    capacity: { min: 384, max: 426 },
    cargoCapacity: 69680,
    speed: 910
  },
  {
    name: "Airbus A321neo",
    emptyWeight: 49700,
    maxTakeoffWeight: 97000,
    maxPayload: 24100,
    fuelCapacity: 32940,
    baseFuelFlow: 2300,
    cruiseSpeed: 470,
    maxAltitude: 39800,
    maxRange: 7400,
    fuelEfficiency: 0.024,
    capacity: { min: 180, max: 244 },
    cargoCapacity: 24100,
    speed: 871
  },
  {
    name: "Airbus A321XLR",
    emptyWeight: 52100,
    maxTakeoffWeight: 101000,
    maxPayload: 23800,
    fuelCapacity: 38900,
    baseFuelFlow: 2400,
    cruiseSpeed: 470,
    maxAltitude: 39800,
    maxRange: 8700,
    fuelEfficiency: 0.024,
    capacity: { min: 180, max: 244 },
    cargoCapacity: 23800,
    speed: 871
  },
  {
    name: "Airbus A330-200",
    emptyWeight: 120500,
    maxTakeoffWeight: 242000,
    maxPayload: 51900,
    fuelCapacity: 139090,
    baseFuelFlow: 6800,
    cruiseSpeed: 470,
    maxAltitude: 41450,
    maxRange: 13450,
    fuelEfficiency: 0.027,
    capacity: { min: 247, max: 406 },
    cargoCapacity: 51900,
    speed: 871
  },
  {
    name: "Airbus A330-300",
    emptyWeight: 124500,
    maxTakeoffWeight: 242000,
    maxPayload: 52400,
    fuelCapacity: 139090,
    baseFuelFlow: 7000,
    cruiseSpeed: 470,
    maxAltitude: 41450,
    maxRange: 11750,
    fuelEfficiency: 0.028,
    capacity: { min: 277, max: 440 },
    cargoCapacity: 52400,
    speed: 871
  },
  {
    name: "Airbus A330-900neo",
    emptyWeight: 131000,
    maxTakeoffWeight: 251000,
    maxPayload: 51800,
    fuelCapacity: 139090,
    baseFuelFlow: 6500,
    cruiseSpeed: 470,
    maxAltitude: 41450,
    maxRange: 13334,
    fuelEfficiency: 0.025,
    capacity: { min: 287, max: 460 },
    cargoCapacity: 51800,
    speed: 871
  },
  {
    name: "Boeing 757-200",
    emptyWeight: 57970,
    maxTakeoffWeight: 115680,
    maxPayload: 22680,
    fuelCapacity: 43490,
    baseFuelFlow: 3200,
    cruiseSpeed: 454,
    maxAltitude: 42000,
    maxRange: 7222,
    fuelEfficiency: 0.029,
    capacity: { min: 200, max: 239 },
    cargoCapacity: 22680,
    speed: 842
  },
  {
    name: "Boeing 767-200ER",
    emptyWeight: 80130,
    maxTakeoffWeight: 175540,
    maxPayload: 38620,
    fuelCapacity: 91380,
    baseFuelFlow: 5200,
    cruiseSpeed: 459,
    maxAltitude: 43100,
    maxRange: 12200,
    fuelEfficiency: 0.027,
    capacity: { min: 181, max: 255 },
    cargoCapacity: 38620,
    speed: 850
  },
  {
    name: "Airbus A340-300",
    emptyWeight: 129000,
    maxTakeoffWeight: 276500,
    maxPayload: 51900,
    fuelCapacity: 147850,
    baseFuelFlow: 8500,
    cruiseSpeed: 470,
    maxAltitude: 41450,
    maxRange: 13500,
    fuelEfficiency: 0.031,
    capacity: { min: 277, max: 440 },
    cargoCapacity: 51900,
    speed: 871
  },
  {
    name: "ATR 72-600",
    emptyWeight: 12950,
    maxTakeoffWeight: 23000,
    maxPayload: 7500,
    fuelCapacity: 5000,
    baseFuelFlow: 900,
    cruiseSpeed: 276,
    maxAltitude: 25000,
    maxRange: 1528,
    fuelEfficiency: 0.022,
    capacity: { min: 68, max: 78 },
    cargoCapacity: 7500,
    speed: 511
  },
  {
    name: "Bombardier Q400",
    emptyWeight: 17185,
    maxTakeoffWeight: 29257,
    maxPayload: 8340,
    fuelCapacity: 6526,
    baseFuelFlow: 1050,
    cruiseSpeed: 360,
    maxAltitude: 27000,
    maxRange: 2522,
    fuelEfficiency: 0.024,
    capacity: { min: 70, max: 86 },
    cargoCapacity: 8340,
    speed: 667
  },
  {
    name: "Embraer E175",
    emptyWeight: 21890,
    maxTakeoffWeight: 40370,
    maxPayload: 9800,
    fuelCapacity: 13530,
    baseFuelFlow: 1650,
    cruiseSpeed: 448,
    maxAltitude: 41000,
    maxRange: 3889,
    fuelEfficiency: 0.026,
    capacity: { min: 76, max: 88 },
    cargoCapacity: 9800,
    speed: 830
  },
  {
    name: "Embraer E190-E2",
    emptyWeight: 28900,
    maxTakeoffWeight: 56000,
    maxPayload: 13500,
    fuelCapacity: 13300,
    baseFuelFlow: 1700,
    cruiseSpeed: 470,
    maxAltitude: 41000,
    maxRange: 5278,
    fuelEfficiency: 0.024,
    capacity: { min: 97, max: 114 },
    cargoCapacity: 13500,
    speed: 870
  },
  {
    name: "Embraer E195-E2",
    emptyWeight: 30300,
    maxTakeoffWeight: 61500,
    maxPayload: 14200,
    fuelCapacity: 13800,
    baseFuelFlow: 1850,
    cruiseSpeed: 470,
    maxAltitude: 41000,
    maxRange: 4815,
    fuelEfficiency: 0.025,
    capacity: { min: 120, max: 146 },
    cargoCapacity: 14200,
    speed: 870
  },
  {
    name: "Bombardier CRJ700",
    emptyWeight: 19730,
    maxTakeoffWeight: 33000,
    maxPayload: 8880,
    fuelCapacity: 12785,
    baseFuelFlow: 1450,
    cruiseSpeed: 430,
    maxAltitude: 41000,
    maxRange: 3620,
    fuelEfficiency: 0.027,
    capacity: { min: 66, max: 78 },
    cargoCapacity: 8880,
    speed: 786
  },
  {
    name: "Boeing 777F",
    emptyWeight: 145150,
    maxTakeoffWeight: 347815,
    maxPayload: 102010,
    fuelCapacity: 181280,
    baseFuelFlow: 8500,
    cruiseSpeed: 490,
    maxAltitude: 43100,
    maxRange: 9070,
    fuelEfficiency: 0.028,
    capacity: { min: 0, max: 0 },
    cargoCapacity: 102010,
    speed: 905
  },
  {
    name: "Airbus A220-300",
    emptyWeight: 37200,
    maxTakeoffWeight: 69850,
    maxPayload: 13500,
    fuelCapacity: 21935,
    baseFuelFlow: 1900,
    cruiseSpeed: 447,
    maxAltitude: 41000,
    maxRange: 6390,
    fuelEfficiency: 0.023,
    capacity: { min: 120, max: 160 },
    cargoCapacity: 13500,
    speed: 828
  }
];

// Mock in-memory storage for development without database
export class MockStorage implements IStorage {
  private aircraft: Aircraft[] = [];
  private calculations: Calculation[] = [];
  private analyticsData: Analytics[] = [];
  private profileClicksData: ProfileClick[] = [];
  private nextAircraftId = 1;
  private nextCalculationId = 1;
  private nextAnalyticsId = 1;
  private nextProfileClickId = 1;

  constructor() {
    // Initialize with mock aircraft data
    this.aircraft = initialAircraftData.map((data, index) => ({
      id: index + 1,
      ...data,
      maxPassengers: data.capacity?.max || 0,
      maxRange: data.maxRange,
      co2Factor: 3.15
    }));
    this.nextAircraftId = this.aircraft.length + 1;
  }

  async getAllAircraft(): Promise<Aircraft[]> {
    return this.aircraft;
  }

  async createAircraft(insertAircraft: InsertAircraft): Promise<Aircraft> {
    const aircraft: Aircraft = {
      id: this.nextAircraftId++,
      ...insertAircraft,
      maxPassengers: insertAircraft.capacity?.max || 0,
      co2Factor: 3.15
    };
    this.aircraft.push(aircraft);
    return aircraft;
  }

  async saveCalculation(insertCalculation: InsertCalculation): Promise<Calculation> {
    const calculation: Calculation = {
      id: this.nextCalculationId++,
      ...insertCalculation,
      timestamp: new Date()
    };
    this.calculations.push(calculation);
    return calculation;
  }

  async getUser(_id: number): Promise<User | undefined> {
    return undefined; // No users in mock mode
  }

  async getUserByEmail(_email: string): Promise<User | undefined> {
    return undefined; // No users in mock mode
  }

  async updateUserLoginStats(_userId: number, _stats: { lastLogin: Date; visitCount: number }): Promise<void> {
    // No-op in mock mode
  }

  async saveAnalytics(analytics: InsertAnalytics): Promise<void> {
    const analyticsRecord: Analytics = {
      id: this.nextAnalyticsId++,
      ...analytics,
      timestamp: new Date()
    };
    this.analyticsData.push(analyticsRecord);
  }

  async getAnalytics(): Promise<Analytics[]> {
    return this.analyticsData;
  }

  async saveProfileClick(click: InsertProfileClick): Promise<void> {
    const profileClick: ProfileClick = {
      id: this.nextProfileClickId++,
      ...click,
      timestamp: new Date()
    };
    this.profileClicksData.push(profileClick);
  }

  async getProfileClicks(): Promise<ProfileClick[]> {
    return this.profileClicksData;
  }
}

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

// Export appropriate storage based on database availability
export const storage: IStorage = isDatabaseAvailable
  ? new DatabaseStorage()
  : new MockStorage();