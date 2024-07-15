import type { Request, Response } from "express";
import { ffmpegConcat } from "../utils/ffmpegConcat";
import path from 'path';
export const videoMergeHandler = async(req : Request, res : Response) => {
    const vidIds: string[] = req.body.videoIds;

    if (vidIds.length < 2) {
        return res.status(400).json({ error: 'Please select at least two videos to merge' });
    } else {
        try {
            const { data } = await ffmpegConcat(vidIds, vidIds.join('_') + '.mp4');


            console.log('Video merging completed:', data);
            const outputFilePath = vidIds.join('_') + '.mp4';
            const filePath = path.basename(outputFilePath);
            const fileUrl = `${req.protocol}://${process.env.DEPLOYED_INSTANCE}/download/${filePath}`;
            return res.json({ downloadUrl: fileUrl });
        } catch (error) {
            return res.status(500).json({ error: error });
        }
    }
}
