import { pgTable, text, serial, integer, real, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const aircraftTypes = pgTable("aircraft_types", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  maxPassengers: integer("max_passengers").notNull(),
  cargoCapacity: real("cargo_capacity").notNull(),
  maxRange: integer("max_range").notNull(),
  cruiseSpeed: real("cruise_speed").notNull(),
  fuelEfficiency: real("fuel_efficiency").notNull(),
  co2Factor: real("co2_factor").notNull().default(2.5)
});

export const insertAircraftSchema = createInsertSchema(aircraftTypes);

export type InsertAircraft = z.infer<typeof insertAircraftSchema>;
export type Aircraft = typeof aircraftTypes.$inferSelect;

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

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
  country: true,
  city: true,
  userAgent: true
});

export const insertAnalyticsSchema = createInsertSchema(userAnalytics).pick({
  userId: true,
  path: true,
  duration: true,
  deviceType: true,
  browser: true
});

export const insertProfileClickSchema = createInsertSchema(profileClicks).pick({
  userId: true,
  clickType: true
});

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