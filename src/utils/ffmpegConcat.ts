import { promises as fsPromises } from 'fs';
import { join } from 'path';
import { createSupabaseClient, downloadVideo } from "./supaBase";
import { getVideoByVideoId } from "../db/videoDbOps";

import ffmpegp from "@ffmpeg-installer/ffmpeg";
import ffprobep from "@ffprobe-installer/ffprobe";
import ffmpeg from "fluent-ffmpeg";

const ffmpegPath = ffmpegp.path;
const ffprobePath = ffprobep.path;

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

async function mergeVideos(videoPaths: string[], outputPath: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const ffmpegCommand = ffmpeg();

        videoPaths.forEach(videoPath => {
            ffmpegCommand.input(videoPath);
        });

        ffmpegCommand
            .on('error', (err) => {
                console.error('Error during merging:', err);
                reject(err);
            })
            .on('start', () => {
                console.log(`Starting merge for ${videoPaths}`);
            })
            .on('end', () => {
                console.log(`Videos merged successfully into ${outputPath}`);
                resolve();
            })
            .mergeToFile(outputPath, './temp')
            .run();
    });
}

async function deleteTempFiles(files: string[]): Promise<void> {
    const deletePromises = files.map(file => fsPromises.unlink(file).catch(console.error));
    await Promise.all(deletePromises);
}

export async function ffmpegConcat(vidIds: string[], output: string) {
    const videos: string[] = [];
    const tmpDir = './tmp';
    const outDir = './out';

    await fsPromises.mkdir(tmpDir, { recursive: true });
    await fsPromises.mkdir(outDir, { recursive: true });

    for (let i = 0; i < vidIds.length; i++) {
        const { video, err } = await getVideoByVideoId(vidIds[i]);
        if (err) {
            return { data: null, err: err };
        }

        const vidFileName = video?.dataValues.filename;
        if (vidFileName) {
            const { data, err } = await downloadVideo(await createSupabaseClient(), vidFileName, tmpDir);
            if (err) {
                return { data: null, err: err };
            }

            if (data) {
                videos.push(data);
            } else {
                return { data: null, err: new Error('Downloaded video file is undefined') };
            }
        } else {
            return { data: null, err: new Error('Video filename not found') };
        }
    }

    const outputFilePath = join(outDir, output);

    try {
        await mergeVideos(videos, outputFilePath);
        await deleteTempFiles(['./tmp']);
        return { data: outputFilePath, err: null };
    } catch (error) {
        return { data: null, err: error };
    }
}
