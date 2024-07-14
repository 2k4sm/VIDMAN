import type { Request, Response } from "express";
import User from "../models/user";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerHandler = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
  
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const user = await User.create({ email, password: hashedPassword });
  
      const token = jwt.sign({ id: user.dataValues.id }, process.env.JAAT_KEY! as string, { expiresIn: '1h' });
  
      res.status(201).json({ token : token });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }