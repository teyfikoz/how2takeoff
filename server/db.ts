import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

export const isDatabaseAvailable = !!process.env.DATABASE_URL;

if (!isDatabaseAvailable) {
  console.warn(
    "⚠️  DATABASE_URL not set. Running in MOCK MODE with in-memory data.",
  );
}

export const pool = isDatabaseAvailable
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : null as any;

export const db = isDatabaseAvailable
  ? drizzle({ client: pool, schema })
  : null as any;
