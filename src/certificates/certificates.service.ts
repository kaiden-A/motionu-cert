import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import axios from 'axios';
import { createCanvas, loadImage , registerFont} from 'canvas';
import { Config } from './dto/config-certificates.dto';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class CertificatesService {


    constructor(private readonly cloudinaryService : CloudinaryService){
        this.registerFonts();
    }


    private getTemplateUrl(templateName : string){
        return `https://res.cloudinary.com/dsjsrazav/image/upload/${templateName}.png`
    }

    private registerFonts() {
        const fontsDir = path.join(__dirname, '..', 'fonts');

        if (!fs.existsSync(fontsDir)) {
            console.warn('Fonts directory not found:', fontsDir);
            return;
        }

        const fontFiles = fs.readdirSync(fontsDir).filter(f => f.endsWith('.ttf'));

        for (const file of fontFiles) {
            // Parse family and weight from filename
            // e.g. "Roboto-Bold.ttf" → family: "Roboto", weight: "bold"
            const [family, variantRaw] = file.replace('.ttf', '').split('-');
            const variant = variantRaw?.toLowerCase() ?? 'regular';

            const weight = variant.includes('bold') ? 'bold' : 'regular';
            const style = variant.includes('italic') ? 'italic' : 'normal';

            try {
                registerFont(path.join(fontsDir, file), { family, weight, style });
            } catch (err) {
                console.warn(`❌ Failed to register font: ${file}`);
            }
        }
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
            ctx.font = `${config.fontSize}px "${config.fontFamily}"`;
            ctx.fillStyle = config.color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            //put participants name
            ctx.fillText(participantName , config.x , config.y);

            const pdfBuffer = canvas.toBuffer('image/png');

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
