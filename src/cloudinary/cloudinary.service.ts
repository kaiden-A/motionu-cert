import { Injectable } from '@nestjs/common';
import {v2 as cloudinary , UploadApiErrorResponse , UploadApiResponse} from 'cloudinary'
import toStream from 'buffer-to-stream';

@Injectable()
export class CloudinaryService {


    constructor(){
        cloudinary.config({
            cloud_name : process.env.CLOUDINARY_API_NAME,
            api_key : process.env.CLOUDINARY_API_KEY,
            api_secret : process.env.CLOUDINARY_API_SECRET
        })
    }

    async uploadCertificate(
        fileBuffer : Buffer,
        folder : string,
        fileName : string
    ) : Promise<UploadApiResponse |  UploadApiErrorResponse>{

        return new Promise((resolve, reject) => {

            const upload = cloudinary.uploader.upload_stream({
                resource_type : "image",
                folder : folder,
                public_id : fileName,
                format : 'png',
                flags : 'attachment'
            },
            (error , result) => {
                if(error) return reject(error);

                if (!result) {
                    return reject(new Error('Cloudinary upload failed: No result returned.'));
                }
                resolve(result);
            }
        );

        toStream(fileBuffer).pipe(upload);

        })

    }

    

}
