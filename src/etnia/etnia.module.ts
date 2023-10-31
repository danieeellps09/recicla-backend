import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EtniaService } from './etnia.service';

@Module({
    controllers: [],
    providers: [PrismaService, EtniaService]
  })
export class EtniaModule {}
