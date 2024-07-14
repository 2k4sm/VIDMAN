import express, { Router } from 'express';
import { videoMetaHandler } from '../handlers/videoMetaHandler';
import { videoUploadHandler } from '../handlers/videoUploadHandler';
import { videoDownloadHandler } from '../handlers/videoDownloadHandler';
import authMiddleware from '../middlewares/auth';

export interface Data {
    id : string
}

export let context : Data;

export function vidRoutes() : Router {
    const router = express.Router();
    router.use(authMiddleware)
    router.post('/upload', videoUploadHandler)
    router.post('/download', videoDownloadHandler)

    return router;
}