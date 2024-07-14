
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type{ UploadedFile } from 'express-fileupload';

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

