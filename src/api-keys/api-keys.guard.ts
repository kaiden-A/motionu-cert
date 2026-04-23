import { CanActivate, ExecutionContext, Injectable , UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ApiKeysGuard implements CanActivate {
  constructor(
    private readonly prisma : PrismaService,
    private reflector : Reflector
  ){}

  async canActivate(context: ExecutionContext,
  ): Promise<boolean>  {

    const request = context.switchToHttp().getRequest<Request>()
    const apiKeys = request.headers['x-motionu-key'] as string;

    if(!apiKeys){
      throw new UnauthorizedException('API keys is missings');
    }

    const keyRecord = await this.prisma.apiKeys.findUnique({
      where : {
        apiKey : apiKeys
      }
    })

    if(!keyRecord){
      throw new UnauthorizedException('API keys not valid')
    }


    return true;
  }
}
