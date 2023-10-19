import { Module } from '@nestjs/common';
import { AssociacoesController } from './associacoes.controller';
import { AssociacoesService } from './associacoes.service';

@Module({
  controllers: [AssociacoesController],
  providers: [AssociacoesService]
})
export class AssociacoesModule {}
