import { Module } from '@nestjs/common';
import { CatadorController } from './catador.controller';
import { CatadorService } from './catador.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { AssociacoesService } from 'src/associacoes/associacoes.service';
import { EmailService } from 'src/email/email.service';
import { RoleService } from 'src/role/role.service';
import { GeneroService } from '../genero/genero.service';
import { EtniaService } from '../etnia/etnia.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [CatadorModule, UserModule],
  controllers: [CatadorController],
  providers: [CatadorService,  AssociacoesService,UserService, RoleService, PrismaService, EmailService, GeneroService, EtniaService]
})
export class CatadorModule {}
