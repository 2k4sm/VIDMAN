import express, { Router } from 'express';
import { videoMetaHandler } from '../handlers/videoMetaHandler';
import { videoUploadHandler } from '../handlers/videoUploadHandler';
import { videoDownloadHandler } from '../handlers/videoDownloadHandler';


export function vidRoutes() : Router {
    const router = express.Router();
    router.post('/meta', videoMetaHandler)
    router.post('/upload', videoUploadHandler)
    router.post('/download', videoDownloadHandler)

    return router;
}