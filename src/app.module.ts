import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import {JwtModule} from '@nestjs/jwt';
import * as dotenv from "dotenv";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { CookieModule } from 'nestjs-cookie';
dotenv.config({ path: `${__dirname}../.env` })

@Module({
  imports: [PrismaModule,UserModule,
    ConfigModule.forRoot(),
    AuthModule,
    RoleModule,
    UserModule,
    JwtModule.register({
      privateKey: process.env.JWT_SECRET_KEY,
      signOptions: {expiresIn: '30d'} 
  }),
  AppModule
    ],
  controllers: [AuthController, AppController], 
  providers: [AuthService, AppService,
  {
    provide: APP_GUARD,
    useClass: JwtAuthGuard
  }], 
  
}) 
export class AppModule {
}

