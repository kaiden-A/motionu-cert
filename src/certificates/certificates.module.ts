import { Module } from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { CertificatesController } from './certificates.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { ApiKeysGuard } from 'src/api-keys/api-keys.guard';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports : [CloudinaryModule , PrismaModule],
  providers: [CertificatesService, ApiKeysGuard],
  controllers: [CertificatesController],
})
export class CertificatesModule {}
