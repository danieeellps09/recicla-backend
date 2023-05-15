import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { RoleModule } from './role/role.module';

@Module({
  imports: [PrismaModule,UserModule, RoleModule,
    ConfigModule.forRoot()
    ],
  controllers: [],
  providers: [],
})
export class AppModule {}