import { Module } from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { CertificatesController } from './certificates.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports : [CloudinaryModule],
  providers: [CertificatesService],
  controllers: [CertificatesController]
})
export class CertificatesModule {}
