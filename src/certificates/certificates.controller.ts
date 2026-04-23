import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateCertificatesDto } from './dto/create-certifictes.dto';
import { CertificatesService } from './certificates.service';
import { ApiKeysGuard } from 'src/api-keys/api-keys.guard';

@Controller('certificates')
export class CertificatesController {

    constructor(private readonly certificateService : CertificatesService){}


    @Get('health')
    async getHealth(){
        return 'Certificates Service is working';
    }

    @UseGuards(ApiKeysGuard)
    @Post('generate')
    async generate(
        @Body() data : CreateCertificatesDto
    ){

        return this.certificateService.generate(data.participantName, data.templateName , data.config);
    }
}
