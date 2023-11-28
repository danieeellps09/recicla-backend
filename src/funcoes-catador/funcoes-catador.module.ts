import { Module } from '@nestjs/common';
import { FuncoesCatadorController } from './funcoes-catador.controller';
import { FuncoesCatadorService } from './funcoes-catador.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [FuncoesCatadorController],
  providers: [ 
    FuncoesCatadorService,
  PrismaService]
})
export class FuncoesCatadorModule {}
