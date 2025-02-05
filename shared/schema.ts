import { pgTable, text, serial, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const aircraftTypes = pgTable("aircraft_types", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  emptyWeight: real("empty_weight").notNull(),
  maxTakeoffWeight: real("max_takeoff_weight").notNull(),
  maxPayload: real("max_payload").notNull(),
  fuelCapacity: real("fuel_capacity").notNull(),
  baseFuelFlow: real("base_fuel_flow").notNull(),
  cruiseSpeed: real("cruise_speed").notNull(),
  maxAltitude: integer("max_altitude").notNull(),
  maxRange: integer("max_range").notNull(),
  fuelEfficiency: real("fuel_efficiency").notNull()
});

export const insertAircraftSchema = createInsertSchema(aircraftTypes).pick({
  name: true,
  emptyWeight: true,
  maxTakeoffWeight: true,
  maxPayload: true,
  fuelCapacity: true,
  baseFuelFlow: true,
  cruiseSpeed: true,
  maxAltitude: true,
  maxRange: true,
  fuelEfficiency: true
});

export type InsertAircraft = z.infer<typeof insertAircraftSchema>;
export type Aircraft = typeof aircraftTypes.$inferSelect;

export const flightCalculations = pgTable("flight_calculations", {
  id: serial("id").primaryKey(),
  aircraftId: integer("aircraft_id").notNull(),
  distance: real("distance").notNull(),
  payload: real("payload").notNull(),
  fuelRequired: real("fuel_required").notNull(),
  co2Emissions: real("co2_emissions").notNull(),
  calculationType: text("calculation_type").notNull() // 'high-fidelity' or 'simplified'
});

export const insertCalculationSchema = createInsertSchema(flightCalculations).pick({
  aircraftId: true,
  distance: true,
  payload: true,
  fuelRequired: true,
  co2_emissions: true,
  calculationType: true
});

export type InsertCalculation = z.infer<typeof insertCalculationSchema>;
export type Calculation = typeof flightCalculations.$inferSelect;
