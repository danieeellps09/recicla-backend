import { Module } from '@nestjs/common';
import { AssociacoesController } from './associacoes.controller';
import { AssociacoesService } from './associacoes.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [AssociacoesController],
  providers: [AssociacoesService, PrismaService]
})
export class AssociacoesModule {}
