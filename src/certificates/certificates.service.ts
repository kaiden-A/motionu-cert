import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import axios from 'axios';
import { createCanvas, loadImage } from 'canvas';
import { Config } from './dto/config-certificates.dto';

@Injectable()
export class CertificatesService {


    constructor(private readonly cloudinaryService : CloudinaryService){}


    private getTemplateUrl(templateName : string){
        return `https://res.cloudinary.com/dsjsrazav/image/upload/${templateName}.png`
    }

    async generate(
        participantName : string,
        templateName : string,
        config : Config
    ){

        try{
            
            const templateUrl = this.getTemplateUrl(templateName);
            const response = await axios.get(templateUrl, {responseType : 'arraybuffer'});
            const templateBuffer = Buffer.from(response.data);
            const image = await loadImage(templateBuffer);

            //setup canvas
            const canvas = createCanvas(image.width , image.height);
            const ctx = canvas.getContext('2d');

            //Draw image
            ctx.drawImage(image, 0, 0 , image.width , image.height);

            //configuration
            ctx.font = `${config.fontSize}px ${config.fontFamily}`;
            ctx.fillStyle = config.color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            //put participants name
            ctx.fillText(participantName , config.x , config.y);

            const pdfBuffer = canvas.toBuffer('image/png');

            console.log('Buffer result:', pdfBuffer);
            console.log('Is valid Buffer:', Buffer.isBuffer(pdfBuffer));

            if (!pdfBuffer || !Buffer.isBuffer(pdfBuffer)) {
                throw new InternalServerErrorException(
                    'Canvas failed to generate a PDF buffer. This usually means Cairo/PDF support is missing on your system.'
                );
            }

            const fileName = `cert_${participantName.replace(/\s+/g, '_')}_${Date.now()}`;
            const uploadResult = await this.cloudinaryService.uploadCertificate(
                pdfBuffer,
                'certificate_generates',
                fileName
            );

            return {
                url : uploadResult.secure_url,
                publicId : uploadResult.public_id
            }

        }catch(err){
            console.error('Certificates Generations Error: ' , err);
            throw new InternalServerErrorException('Failed to generate certificates');
        }


    }


}
