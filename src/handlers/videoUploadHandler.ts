import type { Request, Response } from "express";
import type { UploadedFile } from "express-fileupload";
import { createSupabaseClient, uploadFile } from "../utils/supaBase";
import Video from "../models/video";
import { createVideo } from "../db/videoDbOps";

export const videoUploadHandler = async (req: Request, res: Response) => {
    const client = createSupabaseClient();

    if (!req.files) {
        console.error("File upload error: No files were uploaded");
        return res.status(400).send({ error: "No files were uploaded" });
    }

    const files = req.files;
    const result = [];

    try {
        for (const file of Object.values(files) as UploadedFile[]) {
            if (file.size > 26210000) {
                return res.status(400).send({ error: `${file.name} is too large - ${(file.size / 1049000).toPrecision(3)} MB. Limit is 25 MB` });
            }

            const existingVideo = await Video.findOne({ where: { filename: file.name.toString() } });
            if (existingVideo) {
                result.push({ data: existingVideo.dataValues });
                continue;
            }

            const { data , error } = await client.storage.from('videos').list('',{
                limit: 1,
                offset: 0,
                sortBy: { column: 'name', order: 'asc' },
                search: file.name.toString()
            });

            if (error) {
                console.error("Supabase storage error:", error);
                return res.status(500).send({ error: 'Error accessing Supabase storage' });
            }

            if (data && data.length > 0) {
                const videoUpload = await createVideo(
                    (req as any).userId,
                    file.name,
                    file.size,
                    data[0].id as string
                );

                result.push({ data: videoUpload.dataValues });
            } else {
                const uploadResult = await uploadFile(client, file);
                if (uploadResult.err) {
                    return res.status(400).send({ error: uploadResult.err });
                }

                const videoUpload = await createVideo(
                    (req as any).userId,
                    file.name,
                    file.size,
                    uploadResult.data?.id as string
                );

                result.push({ data: videoUpload.dataValues });
            }
        }

        return res.send({ userId: (req as any).userId, files: result });
    } catch (error) {
        console.error("Error during file processing:", error);
        return res.status(500).send({ error: 'Internal server error' });
    }
};
