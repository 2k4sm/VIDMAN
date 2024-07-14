import jwt from 'jsonwebtoken';
import User from '../models/user';
import type { NextFunction, Request, Response } from 'express';
import { context, type Data } from '../routes/vidRoutes';

interface Decoded {
    id: string
}

const authMiddleware = async (req : Request, res : Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JAAT_KEY!) as Decoded;
      console.log("decoded:",decoded.id);
      const user = await User.findOne({ where: { id: decoded.id } });

      if (!user) {
        return res.status(401).json({ error: 'Invalid token' });
      }
      context.id = decoded.id;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
}

export default authMiddleware;