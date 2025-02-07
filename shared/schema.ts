import { pgTable, text, serial, integer, real, jsonb, boolean, timestamp } from "drizzle-orm/pg-core";
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
  fuelEfficiency: real("fuel_efficiency").notNull(),
  capacity: jsonb("capacity").$type<{ min: number; max: number }>().notNull().default({ min: 0, max: 0 }),
  cargoCapacity: real("cargo_capacity").notNull().default(0),
  speed: real("speed").notNull().default(0),
  fuelBurnPer100kmSeat: real("fuel_burn_per_100km_seat").notNull().default(0),
  co2EmissionFactor: real("co2_emission_factor").notNull().default(2.5),
  baseFuelCost: real("base_fuel_cost").notNull().default(0),
  operatingCostPerHour: real("operating_cost_per_hour").notNull().default(0),
  turnaroundTime: integer("turnaround_time").notNull().default(0)
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  lastLogin: timestamp("last_login"),
  country: text("country"),
  city: text("city"),
  userAgent: text("user_agent"),
  visitCount: integer("visit_count").default(1),
  timeSpent: real("time_spent").default(0)
});

export const userAnalytics = pgTable("user_analytics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  path: text("path").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  duration: integer("duration").default(0),
  deviceType: text("device_type"),
  browser: text("browser"),
  isAuthenticated: boolean("is_authenticated").default(false)
});

export const profileClicks = pgTable("profile_clicks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  clickType: text("click_type").notNull(), 
  timestamp: timestamp("timestamp").defaultNow(),
  isAuthenticated: boolean("is_authenticated").default(false)
});

export const insertAircraftSchema = createInsertSchema(aircraftTypes, {
  capacity: z.object({
    min: z.number(),
    max: z.number()
  })
}).pick({
  name: true,
  emptyWeight: true,
  maxTakeoffWeight: true,
  maxPayload: true,
  fuelCapacity: true,
  baseFuelFlow: true,
  cruiseSpeed: true,
  maxAltitude: true,
  maxRange: true,
  fuelEfficiency: true,
  capacity: true,
  cargoCapacity: true,
  speed: true,
  fuelBurnPer100kmSeat: true,
  co2EmissionFactor: true,
  baseFuelCost: true,
  operatingCostPerHour: true,
  turnaroundTime: true
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
  isAdmin: true,
  country: true,
  city: true,
  userAgent: true
});

export const insertAnalyticsSchema = createInsertSchema(userAnalytics).pick({
  userId: true,
  path: true,
  duration: true,
  deviceType: true,
  browser: true,
  isAuthenticated: true
});

export const insertProfileClickSchema = createInsertSchema(profileClicks).pick({
  userId: true,
  clickType: true,
  isAuthenticated: true
});

export type InsertAircraft = z.infer<typeof insertAircraftSchema>;
export type Aircraft = typeof aircraftTypes.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
export type Analytics = typeof userAnalytics.$inferSelect;

export type InsertProfileClick = z.infer<typeof insertProfileClickSchema>;
export type ProfileClick = typeof profileClicks.$inferSelect;

export const flightCalculations = pgTable("flight_calculations", {
  id: serial("id").primaryKey(),
  aircraftId: integer("aircraft_id").notNull(),
  distance: real("distance").notNull(),
  payload: real("payload").notNull(),
  fuelRequired: real("fuel_required").notNull(),
  co2Emissions: real("co2_emissions").notNull(),
  calculationType: text("calculation_type").notNull()
});

export const insertCalculationSchema = createInsertSchema(flightCalculations).pick({
  aircraftId: true,
  distance: true,
  payload: true,
  fuelRequired: true,
  co2Emissions: true,
  calculationType: true
});

export type InsertCalculation = z.infer<typeof insertCalculationSchema>;
export type Calculation = typeof flightCalculations.$inferSelect;