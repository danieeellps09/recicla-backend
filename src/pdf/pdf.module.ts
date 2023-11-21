import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PdfController } from './pdf.controller';
import { CatadorModule } from 'src/catador/catador.module';
import { FormsModule } from 'src/forms/forms.module';
import { ColetaService } from 'src/forms/coleta/coleta.service';
import { CatadorService } from 'src/catador/catador.service';
import { AssociacoesService } from 'src/associacoes/associacoes.service';
import { UserService } from 'src/user/user.service';
import { RoleService } from 'src/role/role.service';
import { EmailService } from 'src/email/email.service';
import { GeneroService } from 'src/genero/genero.service';
import { EtniaService } from 'src/etnia/etnia.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [CatadorModule, FormsModule],
  providers: [PdfService, PrismaService, ColetaService, CatadorService, AssociacoesService, UserService, RoleService, EmailService, GeneroService, EtniaService],
  controllers: [PdfController]
})
export class PdfModule {}
