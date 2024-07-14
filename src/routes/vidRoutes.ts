import express, { Router } from 'express';
import { videoUploadHandler } from '../handlers/videoUploadHandler';
import authMiddleware from '../middlewares/auth';
import { videoMergeHandler } from '../handlers/videoMergeHandler';
import { videoShareHandler } from '../handlers/videoShareHandler';
import { videoTrimHandler } from '../handlers/videoTrimHandler';

export function vidRoutes() : Router {
    const router = express.Router();
    router.use(authMiddleware)
    
    router.post('/upload', videoUploadHandler)
    router.post('/merge', videoMergeHandler)
    router.post('/share', videoShareHandler)
    router.post('/trim', videoTrimHandler)

    return router;
}