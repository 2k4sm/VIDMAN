import type { Request, Response } from "express";
import type { UploadedFile } from "express-fileupload";
import { createSupabaseClient, uploadFile } from "../utils/supaBase";
export const videoUploadHandler = async(req : Request , res : Response) => {
    const client = createSupabaseClient();

    const result = []
    if (req.files === undefined || req.files === null) {
        console.error("file Upload Error. || files Error");
        res.status(400).send({ error: "No files were uploaded" });    
    }else{
        const files = req.files;
        console.log(files);
        for (const file of Object.values(files) as UploadedFile[]) {
            if (file.size > 26,214,400){
                res.status(400).send({ error: `${file.name} too large - ${(file.size / 1049000).toPrecision(3)} MB, Limit is 25 MB` });
            }
            let fileToUpload = file;
            console.log("file to upload:",fileToUpload);

            let uploadResult = await uploadFile(client, fileToUpload);
            console.log("upload result:",uploadResult);
            if (uploadResult.err){
                res.status(400).send({ error: uploadResult.err});
            }
            result.push(
                uploadResult.data
            );
        }
    }

    console.log(result)

    res.send({files : result});
}