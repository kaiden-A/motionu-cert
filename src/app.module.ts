import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CertificatesModule } from './certificates/certificates.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ConfigModule } from '@nestjs/config';
import { ApiKeysModule } from './api-keys/api-keys.module';
import { PrismaModule } from './prisma/prisma.module';


@Module({
  imports: [
    CertificatesModule, 
    CloudinaryModule , 
    ConfigModule.forRoot({isGlobal : true}), ApiKeysModule, PrismaModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
