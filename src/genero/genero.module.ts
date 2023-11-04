import { Module } from '@nestjs/common';
import { GeneroController } from './genero.controller';
import { GeneroService } from './genero.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmailService } from 'src/email/email.service';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [GeneroController],
  providers: [GeneroService, PrismaService, EmailService, UserService]
})
export class GeneroModule {}
