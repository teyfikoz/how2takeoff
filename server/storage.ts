import { 
  type Aircraft, type InsertAircraft,
  type Calculation, type InsertCalculation 
} from "@shared/schema";

export interface IStorage {
  getAllAircraft(): Promise<Aircraft[]>;
  createAircraft(aircraft: InsertAircraft): Promise<Aircraft>;
  saveCalculation(calculation: InsertCalculation): Promise<Calculation>;
}

export class MemStorage implements IStorage {
  private aircraft: Map<number, Aircraft>;
  private calculations: Map<number, Calculation>;
  private aircraftId: number;
  private calculationId: number;

  constructor() {
    this.aircraft = new Map();
    this.calculations = new Map();
    this.aircraftId = 1;
    this.calculationId = 1;
  }

  async getAllAircraft(): Promise<Aircraft[]> {
    return Array.from(this.aircraft.values());
  }

  async createAircraft(insertAircraft: InsertAircraft): Promise<Aircraft> {
    const id = this.aircraftId++;
    const aircraft = { ...insertAircraft, id };
    this.aircraft.set(id, aircraft);
    return aircraft;
  }

  async saveCalculation(insertCalculation: InsertCalculation): Promise<Calculation> {
    const id = this.calculationId++;
    const calculation = { ...insertCalculation, id };
    this.calculations.set(id, calculation);
    return calculation;
  }
}

export const storage = new MemStorage();
