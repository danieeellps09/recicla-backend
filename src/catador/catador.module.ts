import { Module } from '@nestjs/common';
import { CatadorController } from './catador.controller';
import { CatadorService } from './catador.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { AssociacoesService } from 'src/associacoes/associacoes.service';
import { EmailService } from 'src/email/email.service';
import { RoleService } from 'src/role/role.service';

@Module({
  controllers: [CatadorController],
  providers: [CatadorService, UserService, AssociacoesService, RoleService, PrismaService, EmailService]
})
export class CatadorModule {}
