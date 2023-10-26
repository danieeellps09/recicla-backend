import { Module } from '@nestjs/common';
import { AssociacoesController } from './associacoes.controller';
import { AssociacoesService } from './associacoes.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoleService } from 'src/role/role.service';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [AssociacoesController],
  providers: [AssociacoesService, PrismaService, RoleService, UserService]
})
export class AssociacoesModule {}
