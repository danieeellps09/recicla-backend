import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ColetaController } from './coleta/coleta.controller';
import { ColetaService } from './coleta/coleta.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CatadorService } from 'src/catador/catador.service';

@Module({
  controllers: [ColetaController],
  providers: [ColetaService, PrismaService, CatadorService]
})
export class FormsModule {
 

}
