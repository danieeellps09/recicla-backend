import { Module } from '@nestjs/common';
import { CatadorController } from './catador.controller';
import { CatadorService } from './catador.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [CatadorController],
  providers: [CatadorService, PrismaService]
})
export class CatadorModule {}
