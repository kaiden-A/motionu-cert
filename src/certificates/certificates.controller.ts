import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateCertificatesDto } from './dto/create-certifictes.dto';
import { CertificatesService } from './certificates.service';

@Controller('certificates')
export class CertificatesController {

    constructor(private readonly certificateService : CertificatesService){}


    @Get('health')
    async getHealth(){
        return 'Certificates Service is working';
    }

    @Post('generate')
    async generate(
        @Body() data : CreateCertificatesDto
    ){
        return this.certificateService.generate(data.particpantName , data.templateName , data.config);
    }
}
