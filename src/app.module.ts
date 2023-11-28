import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from "dotenv";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { CookieModule } from 'nestjs-cookie';
import { CatadorModule } from './catador/catador.module';
import { VeiculoModule } from './veiculo/veiculo.module';
import { EmailModule } from './email/email.module';
import { MaterialModule } from './material/material.module';
import { AssociacoesModule } from './associacoes/associacoes.module';
import { FormsModule } from './forms/forms.module';
import { AdministradorModule } from './administrador/administrador.module';
import { EtniaModule } from './etnia/etnia.module';
import { GeneroModule } from './genero/genero.module';
import { PdfModule } from './pdf/pdf.module';
import { OperadorLogisticoModule } from './operador-logistico/operador-logistico.module';
import { FuncoesCatadorModule } from './funcoes-catador/funcoes-catador.module';
dotenv.config({ path: `${__dirname}../.env` })
import config from './config/config';


@Module({
  imports: [PrismaModule, UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config]
    }),
    AuthModule,
    RoleModule,
    UserModule,
    JwtModule,
    CatadorModule,
    VeiculoModule,
    EmailModule,
    MaterialModule,
    AssociacoesModule,
    AppModule,
    FormsModule,
    AdministradorModule,
    EtniaModule,
    GeneroModule,
    FuncoesCatadorModule,
    PdfModule,
    OperadorLogisticoModule,
  ],
  controllers: [ AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    }],

})
export class AppModule {
}

