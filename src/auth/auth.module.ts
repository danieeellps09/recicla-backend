import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LoginValidationMiddleware } from './middlwares/login-validation.middlware';
import { EmailModule } from 'src/email/email.module';
import { EmailService } from 'src/email/email.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

dotenv.config();

@Module({
    imports: [PrismaModule, UserModule,EmailModule, JwtModule.registerAsync({
        imports: [ConfigModule], 
        useFactory: (configService: ConfigService) => ({
          secret: configService.get<string>('jwtSecretKey'), 
          signOptions: { expiresIn: 3600 },
        }),
        inject: [ConfigService], 
      })],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, EmailService,UserService,JwtStrategy ],
})
export class AuthModule implements NestModule {

    constructor(private configService: ConfigService) {}


    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoginValidationMiddleware).forRoutes('login')
    }

}
