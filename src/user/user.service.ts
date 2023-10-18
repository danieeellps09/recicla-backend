import { PrismaService } from '../prisma/prisma.service';
import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

import * as bcrypt from 'bcryptjs';
import { LoginDTO } from 'src/auth/dto/login-user-dto';


@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly logger = new Logger(UserService.name);


  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
  
      const data = {
        status: createUserDto.status,
        email: createUserDto.email,
        name: createUserDto.name,
        bairro: createUserDto.bairro,
        endereco: createUserDto.endereco,
        phone: createUserDto.phone,
        password: hashedPassword,
      };
  
      const createdUser = await this.prisma.user.create({ data });
      return createdUser;
    } catch (error) {
      this.logger.error(`Erro ao criar o usuário: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Erro ao criar o usuário. Por favor, tente novamente mais tarde.');
    }
  }

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
  
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }
  
    return user;
  }

  


  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
  
    if (!user) {
      throw new NotFoundException(`Usuário com o e-mail ${email} não encontrado.`);
    }
  
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario com ${id} não encontrado`);
    }
    return await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }


  async delete(id: number) {
    
  const user = await this.prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
  }
   await this.prisma.userRole.deleteMany({
      where: {
        userId: id,
      },
    });

    return await this.prisma.user.delete({
      where: { id },
    });
  }

  async getRoleIdsByName(roleNames: string[]): Promise<number[]> {
    const roles = await this.prisma.role.findMany({
      where: {
        name: {
          in: roleNames,
        },
      },
      select: {
        id: true,
      },
    });

    
    console.log(roleNames)

    if (roles.length !== roleNames.length) {
      throw new NotFoundException('Uma ou mais funções não foram encontradas.');
    }

    const roleIds = roles.map((role) => role.id);

    return roleIds;
  }


  async addRolesToUser(userId: number, roleIds: number[]): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
  
    if (!user) {
      throw new NotFoundException(`Usuario com  ${userId} não foi encontrado`);
    }
  
    const roles = await this.prisma.role.findMany({ where: { id: { in: roleIds } } });
  
    if (roles.length !== roleIds.length) {
      throw new NotFoundException('Uma ou mais roles não foram encontradas');
    }
  
    await Promise.all(
      roleIds.map(async (roleId) => {
        await this.prisma.userRole.create({
          data: {
            userId,
            roleId,
          },
        });
      }),
    );
  
    return this.prisma.user.findUnique({ where: { id: userId } });
  }
  


}
