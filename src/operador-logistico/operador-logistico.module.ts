import { Module } from '@nestjs/common';
import { OperadorLogisticoController } from './operador-logistico.controller';
import { OperadorLogisticoService } from './operador-logistico.service';
import { UserService } from 'src/user/user.service';
import { RoleService } from 'src/role/role.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoleDto } from 'src/role/dto/create-role.dto';
import { EmailService } from 'src/email/email.service';
import { RoleModule } from 'src/role/role.module';

@Module({
  imports: [RoleModule],
  controllers: [OperadorLogisticoController],
  providers: [OperadorLogisticoService, UserService, RoleService, EmailService, PrismaService, CreateRoleDto],
})
export class OperadorLogisticoModule {}
