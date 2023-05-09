import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule,UserModule,
    ConfigModule.forRoot()
    ],
  controllers: [],
  providers: [],
})
export class AppModule {}