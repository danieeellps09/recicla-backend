import { PrismaService } from '../prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

import * as bcrypt from 'bcryptjs';
import { LoginDTO } from 'src/auth/dto/login-user-dto';


@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const data = {
      login: createUserDto.login,
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
  }

  findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  findByLogin(login: string) {
    return this.prisma.user.findUnique({
      where: { login },
    });
  }


  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
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
