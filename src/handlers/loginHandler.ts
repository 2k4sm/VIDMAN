import type { Request, Response } from "express";
import User from "../models/user";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt';
export const loginHandler = async (req : Request, res : Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        // console.log("user details are:",user);

        if (!user || !await bcrypt.compare(password, user.dataValues.password)) {
          return res.status(401).json({ error: 'Invalid email or password' });
        }
    
        const token = jwt.sign({ id: user.dataValues.id }, process.env.JAAT_KEY!, { expiresIn: '1h' });
        res.status(200).json({ token });
      } catch (error) {
        res.status(500).json({ error: error });
      }
} 