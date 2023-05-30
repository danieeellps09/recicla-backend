import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import {JwtModule} from '@nestjs/jwt';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
    imports: [PrismaModule, UserModule, JwtModule.register({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '30d'},
    })],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy],
})
export class AuthModule {
  
}
