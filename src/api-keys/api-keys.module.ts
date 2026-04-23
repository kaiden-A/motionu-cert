import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ApiKeysGuard } from './api-keys.guard';

@Module({
  imports: [PrismaModule],     // 👈 REQUIRED for PrismaService
  providers: [ApiKeysGuard],   // 👈 Guard lives here
  exports: [ApiKeysGuard],     // 👈 So other modules / APP_GUARD can use it
})
export class ApiKeysModule {}