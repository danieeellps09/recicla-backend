import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [PrismaModule,UserModule,
    ConfigModule.forRoot(),
    AuthModule,
    UserModule
    ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AppModule {}