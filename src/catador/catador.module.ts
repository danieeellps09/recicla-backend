import { Module } from '@nestjs/common';
import { CatadorController } from './catador.controller';
import { CatadorService } from './catador.service';

@Module({
  controllers: [CatadorController],
  providers: [CatadorService]
})
export class CatadorModule {}
