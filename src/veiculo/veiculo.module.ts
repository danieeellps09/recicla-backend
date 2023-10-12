import { Module } from '@nestjs/common';
import { VeiculoController } from './veiculo.controller';
import { VeiculoService } from './veiculo.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [VeiculoController],
  providers: [VeiculoService, PrismaService]
})
export class VeiculoModule {}
