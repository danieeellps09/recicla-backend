import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EtniaService } from './etnia.service';
import { EtniaController } from './etnia.controller';

@Module({
    controllers: [EtniaController],
    providers: [PrismaService, EtniaService]
  })
export class EtniaModule {}
