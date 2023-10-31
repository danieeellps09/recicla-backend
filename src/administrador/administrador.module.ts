import { Module } from '@nestjs/common';
import { AdministradorController } from './administrador.controller';
import { AdministradorService } from './administrador.service';
import { UserService } from 'src/user/user.service';
import { RoleService } from 'src/role/role.service';
import { EmailService } from 'src/email/email.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [AdministradorController],
  providers: [AdministradorService, UserService, RoleService, EmailService, PrismaService]
})
export class AdministradorModule {}
