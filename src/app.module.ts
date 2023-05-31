import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import {JwtModule} from '@nestjs/jwt';
import { join } from 'path';
import * as dotenv from "dotenv";
dotenv.config({ path: `${__dirname}../.env` })

@Module({
  imports: [PrismaModule,UserModule,
    ConfigModule.forRoot(),
    AuthModule,
    UserModule,
    JwtModule.register({
      privateKey: process.env.JWT_SECRET_KEY,
      signOptions: {expiresIn: '30d'} 
  })
    ],
  controllers: [AuthController], 
  providers: [AuthService], 
}) 
export class AppModule {

  constructor() {}

  onModuleInit() {
    console.log('JWT_SECRET_KEY:', process.env.JWT_SECRET_KEY);
  }


}

