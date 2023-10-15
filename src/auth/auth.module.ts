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

dotenv.config();

@Module({
    imports: [PrismaModule, UserModule, JwtModule,EmailModule],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, EmailService,UserService,JwtStrategy ],
})
export class AuthModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoginValidationMiddleware).forRoutes('login')
    }

}
