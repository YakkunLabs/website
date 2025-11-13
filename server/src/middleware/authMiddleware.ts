import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret-change-me';

export interface AuthTokenPayload {
  userId: string;
  email: string;
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthTokenPayload;
  }
}

export function generateAccessToken(payload: AuthTokenPayload): string {
  // Use 7 days expiration for better user experience
  // Can be changed to shorter duration for production if needed
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d',
  });
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;

  if (!header) {
    res.status(401).json({ message: 'Missing authorization header' });
    return;
  }

  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    res.status(401).json({ message: 'Invalid authorization header' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
    req.user = decoded;
    next();
  } catch (error) {
    // Only log non-expiration errors to reduce noise
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ 
        message: 'Token expired', 
        code: 'TOKEN_EXPIRED',
        expiredAt: error.expiredAt 
      });
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ 
        message: 'Invalid token', 
        code: 'INVALID_TOKEN' 
      });
    } else {
      console.error('JWT verification failed', error);
      res.status(401).json({ message: 'Unauthorized' });
    }
  }
}


