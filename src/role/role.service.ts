import { PrismaService } from "src/prisma/prisma.service";
import { CreateRoleDto } from "./dto/create-role.dto";
import { Injectable, NotFoundException } from "@nestjs/common";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { Role } from '@prisma/client';


@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const data = {
      name: createRoleDto.name,
      description: createRoleDto.description,
      status: createRoleDto.status,
    };
    const createdRole = await this.prisma.role.create({ data });
    return createdRole;
  }

 async findById(id: number) {
    let role = await this.prisma.role.findUnique({
      where: { id },
    });
    if (!role) {
      throw new NotFoundException(`Role con ID ${id} não encontrado`);
    }
    return role
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.prisma.role.findUnique({ where: { id } });
    if (!role) {
      throw new NotFoundException(`Role com ID ${id} não encontrado`);
    }
    return await this.prisma.role.update({
      where: { id },
      data: updateRoleDto,
    });
  }

  async findAll(): Promise<Role[]> {
    return this.prisma.role.findMany();
  }


  async delete(id: number) {
    const role = await this.prisma.role.findUnique({ where: { id } });

    if (!role) {
      throw new NotFoundException(`Role com ID ${id} não encontrado`);
    }
    return await this.prisma.role.delete({ where: { id } });
  }
}