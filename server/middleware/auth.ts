import { Request, Response, NextFunction } from 'express';
import { storage } from '../storage';

// Add user type to Express Request
declare module 'express' {
  interface Request {
    user?: any;
  }
}

// Authentication middleware
export async function authenticate(req: Request, res: Response, next: NextFunction) {
  if (req.session.userId) {
    const user = await storage.getUser(req.session.userId);
    if (user) {
      req.user = user;
    }
  }
  next();
}

// Authorization middleware for admin users
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: 'Forbidden - Admin access required' });
  }
  next();
}

// Authorization middleware for authenticated users
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized - Login required' });
  }
  next();
}