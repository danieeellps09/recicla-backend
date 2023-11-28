// src/funcoesCatador/funcoes-catador.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFuncoesCatadorDto } from './dto/create-funcoes-catador.dto';
import { UpdateFuncoesCatadorDto } from './dto/update-funcoes-catador.dto';

@Injectable()
export class FuncoesCatadorService {
  constructor(private readonly  prismaService: PrismaService) {}

  async create(createFuncoesCatadorDto: CreateFuncoesCatadorDto) {
    try {
      return await this.prismaService.funcoesCatador.create({
        data: createFuncoesCatadorDto,
      });
    } catch (error) {
      throw new Error('Erro ao criar a função do catador');
    }
  }

  async findAll() {
    try {
      return await this.prismaService.funcoesCatador.findMany();
    } catch (error) {
      throw new Error('Erro ao obter as funções do catador');
    }
  }

  async findOne(id: number) {
    try {
      const funcao = await this.prismaService.funcoesCatador.findUnique({
        where: {id}
    });

    if(!funcao){
        throw new NotFoundException(`Etnia de id ${id} não encontrada!`);
    }

    return funcao;
    } catch (error) {
      throw new Error('Erro ao obter a função do catador');
    }
  }

  async update(id: number, updateFuncoesCatadorDto: UpdateFuncoesCatadorDto) {
    try {
      return await this.prismaService.funcoesCatador.update({
        where: { id },
        data: updateFuncoesCatadorDto,
      });
    } catch (error) {
      throw new Error('Erro ao atualizar a função do catador');
    }
  }

  async remove(id: number) {
    try {
      return await this.prismaService.funcoesCatador.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException('Função do catador não encontrada');
    }
  }
}
