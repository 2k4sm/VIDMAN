import { createSupabaseClient, downloadVideo } from "./supaBase";
import { getVideoByVideoId } from "../db/videoDbOps";
import * as fs from 'fs';
import * as path from 'path';
import moment from "moment";
import { promises as fsPromises } from 'fs';


import ffmpegp from "@ffmpeg-installer/ffmpeg";
import ffprobep from "@ffprobe-installer/ffprobe";
import ffmpeg from "fluent-ffmpeg";

const ffmpegPath = ffmpegp.path;
const ffprobePath = ffprobep.path;

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);



export async function ffmpegTrim(inputPath : string, startTime: string, endTime: string, outputPath: string) {
    
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .setStartTime(startTime)
            .setDuration(endTime)
            .output(outputPath)
            .on('end', () => {
                console.log('Video trimming completed:', outputPath);
                resolve({ data: outputPath, err: null });
            })
            .on('error', (error) => {
                console.error('Error during video trimming:', error);
                reject({ data: null, err: error });
            })
            .run();
    });
}

async function deleteTempFiles(files: string[]): Promise<void> {
    const deletePromises = files.map(file => fsPromises.unlink(file).catch(console.error));
    await Promise.all(deletePromises);
}

export async function trimVideo(vidId: string, startTime: string, endTime: string) {
    const supaClient = createSupabaseClient();
    
    const { video, err } = await getVideoByVideoId(vidId);
    if (err) {
        return { data : null, err: err };
    }

    const vidFileName = video?.dataValues.filename;
    if (!vidFileName) {
        return { data: null, err: new Error('Video filename not found') };
    }

    const { data, err : err2 } = await downloadVideo(supaClient, vidFileName, './tmp');
    if (err2) {
        return { data , err : err2 };
    }

    const inputPath = data;
    const outputPath = path.join("./out", vidId  + ".mp4");
    console.log(outputPath)
    if (!fs.existsSync("./out")) {
        fs.mkdirSync("./out", { recursive: true });
    }

    try {
        await ffmpegTrim(inputPath,startTime, endTime,outputPath);
        await deleteTempFiles(["./tmp/" + vidFileName]);
        return { data: outputPath, err: null };
    } catch (error) {
        return { data: null, err: error };
    }
}