import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ColetaController } from './coleta/coleta.controller';
import { ColetaService } from './coleta/coleta.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CatadorService } from 'src/catador/catador.service';
import { VendaController } from './venda/venda.controller';
import { VendaService } from './venda/venda.service';
import { AssociacoesService } from 'src/associacoes/associacoes.service';
import { UserModule } from 'src/user/user.module';
import { CatadorModule } from 'src/catador/catador.module';
import { EmailModule } from 'src/email/email.module';
import { GeneroModule } from 'src/genero/genero.module';
import { EtniaModule } from 'src/etnia/etnia.module';
import { RoleModule } from 'src/role/role.module';
import { EtniaService } from 'src/etnia/etnia.service';
import { GeneroService } from 'src/genero/genero.service';
import { MaterialService } from 'src/material/material.service';

@Module({
  imports: [UserModule, CatadorModule, EmailModule, GeneroModule,EtniaModule, RoleModule],
  controllers: [ColetaController, VendaController],
  providers: [ColetaService, PrismaService, CatadorService,EtniaService, GeneroService, VendaService, AssociacoesService, MaterialService]
})
export class FormsModule {
 

}
