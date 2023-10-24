import { Module } from '@nestjs/common';
import { ColetaController } from './coleta/coleta.controller';
import { ColetaService } from './coleta/coleta.service';

@Module({
  controllers: [ColetaController],
  providers: [ColetaService]
})
export class FormsModule {}
