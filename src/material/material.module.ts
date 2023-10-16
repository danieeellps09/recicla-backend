import { Module } from '@nestjs/common';
import { MaterialController } from './material.controller';
import { MaterialService } from './material.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [MaterialController],
  providers: [MaterialService, PrismaService]
})
export class MaterialModule {}
