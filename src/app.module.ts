import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import {JwtModule} from '@nestjs/jwt';

@Module({
  imports: [PrismaModule,UserModule,
    ConfigModule.forRoot(),
    AuthModule,
    UserModule,
    JwtModule
    ],
  controllers: [AuthController], //AuthController
  providers: [AuthService], //AuthService
}) 
export class AppModule {}

