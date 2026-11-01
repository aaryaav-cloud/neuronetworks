import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from './config.js';

export interface AuthedRequest extends Request {
  userId?: number;
}

export function signToken(userId: number): string {
  return jwt.sign({ sub: String(userId) }, config.jwtSecret, { expiresIn: '7d' });
}

// Requires "Authorization: Bearer <token>" and puts the user id on req.userId.
export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) {
    res.status(401).json({ error: 'Please sign in.' });
    return;
  }
  try {
    const payload = jwt.verify(token, config.jwtSecret) as jwt.JwtPayload;
    const id = Number(payload.sub);
    if (!Number.isInteger(id)) throw new Error('bad subject');
    req.userId = id;
    next();
  } catch {
    res.status(401).json({ error: 'Your session has ended. Please sign in again.' });
  }
}
