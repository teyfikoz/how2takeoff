import { Request, Response, NextFunction } from 'express';

// Geçici olarak basit bir admin kontrolü yapıyoruz
// Gerçek uygulamada bu daha güvenli olmalı
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'admin-secret-token';

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized - No token provided' });
  }

  const token = authHeader.split(' ')[1];
  
  if (token !== ADMIN_TOKEN) {
    return res.status(403).json({ message: 'Forbidden - Not an admin' });
  }

  next();
}
