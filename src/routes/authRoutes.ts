import express, { Router } from 'express';
import { loginHandler } from '../handlers/loginHandler';
import { registerHandler } from '../handlers/registerHandler';


export function authRoutes() : Router {
    const router = express.Router();
    router.post('/login',loginHandler);
    router.post('/register',registerHandler);
    return router;
}