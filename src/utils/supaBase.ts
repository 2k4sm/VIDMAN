
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type{ UploadedFile } from 'express-fileupload';
import { join } from 'path';
import { promises as fsPromises } from 'fs';
export function createSupabaseClient(){
    const client = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!
    )
    
    return client;
}

export async function uploadFile(supaClient : SupabaseClient, uploadFile : UploadedFile){
    const { data, error } = await supaClient
        .storage
        .from('videos')
        .upload(uploadFile.name,uploadFile.data, {
          cacheControl: '3600',
          upsert: false,
          contentType: uploadFile.mimetype
    })      

    return {
        data : data,
        err : error
    }
}

export async function downloadVideo(supaClient: SupabaseClient, fileName: string, outputPath: string) {
    const { data, error } = await supaClient.storage.from('videos').download(fileName);
    if (error) {
        return { data: null, err: error };
    }

    const filePath = join(outputPath, fileName);
    await fsPromises.writeFile(filePath, Buffer.from(await data.arrayBuffer()));
    return { data: filePath, err: null };
}


export async function deleteVideo(supaClient : SupabaseClient, filename : string[]){

    const { data, error } = await supaClient
    .storage
    .from('videos')
    .remove([...filename])

    return {
        data : data,
        err : error
    }
}

export async function getVideoUrl(supaClient : SupabaseClient, filename : string, time : number){

    const { data, error } = await supaClient
    .storage
    .from('videos')
    .createSignedUrl(filename, time)

    return {
        data : data,
        err : error
    }
}