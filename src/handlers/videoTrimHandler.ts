import type{ Request, Response } from 'express';
import { ffmpegTrim, trimVideo } from '../utils/ffmpegTrim';
import path from 'path';
export const videoTrimHandler = async (req: Request, res: Response) => {
    const { videoId, startTime, endTime} = req.body;

    if (!videoId || !startTime || !endTime) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    try {
        const {data } = await trimVideo(videoId, startTime, endTime);


        console.log('Video trimming completed:', data);

        const outputFilePath = videoId + '.mp4';
        const filePath = path.basename(outputFilePath);
        const fileUrl = `${req.protocol}://${req.hostname}:${process.env.PORT!}/download/${filePath}`;
        return res.json({ downloadUrl: fileUrl });
    } catch (error) {
        console.error('Error during video trimming:', error);
        return res.status(500).json({ error: 'Error during video trimming', details: error });
    }
};
