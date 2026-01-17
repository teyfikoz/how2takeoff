import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertAircraftSchema, insertCalculationSchema, insertUserSchema } from "@shared/schema";
import { requireAdmin } from "./middleware/auth";
import bcrypt from "bcryptjs";

export function registerRoutes(app: Express) {
  app.get('/api/aircraft', async (_req, res) => {
    const aircraft = await storage.getAllAircraft();
    res.json(aircraft);
  });

  // Authentication routes
  app.get('/api/auth/user', (req, res) => {
    res.json(req.user || null);
  });

  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    try {
      const user = await storage.getUserByEmail(email);
      if (!user || !(await bcrypt.compare(password, user.password))) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      // Update analytics
      await storage.updateUserLoginStats(user.id, {
        lastLogin: new Date(),
        visitCount: (user.visitCount || 0) + 1
      });

      // Set user in session
      req.session.userId = user.id;
      res.json({ success: true });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy(() => {
      res.json({ success: true });
    });
  });

  // Admin routes
  app.post('/api/admin/aircraft', requireAdmin, async (req, res) => {
    const parsed = insertAircraftSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error });
      return;
    }

    const aircraft = await storage.createAircraft(parsed.data);
    res.json(aircraft);
  });

  app.post('/api/calculations', async (req, res) => {
    const parsed = insertCalculationSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error });
      return;
    }

    const calculation = await storage.saveCalculation(parsed.data);
    res.json(calculation);
  });

  // Analytics routes - fail gracefully to avoid 5xx errors
  app.post('/api/analytics/pageview', async (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { path, duration, deviceType, browser } = req.body;
    try {
      await storage.saveAnalytics({
        userId,
        path,
        duration,
        deviceType,
        browser,
        isAuthenticated: true
      });
    } catch (error) {
      // Log but don't fail - analytics is non-critical
      console.warn("Analytics save failed (non-critical):", error instanceof Error ? error.message : error);
    }
    res.json({ success: true });
  });

  app.post('/api/analytics/profile-click', async (req, res) => {
    const userId = req.session.userId;
    const { type } = req.body;

    if (!type || !['linkedin', 'email'].includes(type)) {
      res.status(400).json({ error: "Invalid click type" });
      return;
    }

    try {
      await storage.saveProfileClick({
        userId: userId || undefined,
        clickType: type,
        isAuthenticated: !!userId
      });
    } catch (error) {
      // Log but don't fail - analytics is non-critical
      console.warn("Profile click save failed (non-critical):", error instanceof Error ? error.message : error);
    }
    res.json({ success: true });
  });

  app.get('/api/admin/analytics', requireAdmin, async (_req, res) => {
    try {
      const [analytics, profileClicks] = await Promise.all([
        storage.getAnalytics(),
        storage.getProfileClicks()
      ]);

      // Process profile clicks data
      const profileClicksStats = {
        linkedin: profileClicks.filter(click => click.clickType === 'linkedin').length,
        email: profileClicks.filter(click => click.clickType === 'email').length,
        authenticatedClicks: profileClicks.filter(click => click.isAuthenticated).length,
        totalClicks: profileClicks.length
      };

      res.json({
        analytics,
        profileClicksStats
      });
    } catch (error) {
      console.error("Analytics fetch error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
