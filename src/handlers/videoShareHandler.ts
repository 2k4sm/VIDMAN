import type { Request, Response } from "express";
import { createSupabaseClient, getVideoUrl } from "../utils/supaBase";
import { getVideoByVideoId } from "../db/videoDbOps";
import { sign } from "jsonwebtoken";
export const videoShareHandler = async(req : Request, res : Response) => {
    const { videoId, expiresIn } = req.body;

    if (!videoId || !expiresIn) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    try {
        const supaClient = createSupabaseClient();

        const { video, err } = await getVideoByVideoId(videoId);

        if (err || !video) {
            return res.status(404).json({ error: 'Video not found' });
        }

        const {data ,err : err2} = await getVideoUrl(supaClient, video?.dataValues.filename, expiresIn)

        if (err2) {
            return res.status(500).json({ error: 'error signing URL', details: err2.message });
        }

        return res.status(200).json({ message: 'Signed URL created successfully', signedUrl: data });
    } catch (error) {
        console.error('Error during URL generation:', error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}
