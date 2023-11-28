import { Controller } from '@nestjs/common';


import {  Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBadRequestResponse, ApiNotFoundResponse, ApiInternalServerErrorResponse } from '@nestjs/swagger';
import { FuncoesCatadorService } from './funcoes-catador.service';
import { CreateFuncoesCatadorDto } from './dto/create-funcoes-catador.dto';
import { UpdateFuncoesCatadorDto } from './dto/update-funcoes-catador.dto';

@ApiTags('funcoes-catador')
@Controller('api/v1/funcoes-catador')
export class FuncoesCatadorController {
  constructor(private readonly funcoesCatadorService: FuncoesCatadorService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Função do catador criada com sucesso' })
  @ApiBadRequestResponse({ description: 'Requisição inválida' })
  @ApiInternalServerErrorResponse({ description: 'Erro interno do servidor' })
  async create(@Body() createFuncoesCatadorDto: CreateFuncoesCatadorDto) {
    try {
      const createdFuncaoCatador = await this.funcoesCatadorService.create(createFuncoesCatadorDto);
      return createdFuncaoCatador;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Lista de funções do catador obtida com sucesso' })
  @ApiInternalServerErrorResponse({ description: 'Erro interno do servidor' })
  async findAll() {
    try {
      const funcoesCatador = await this.funcoesCatadorService.findAll();
      return funcoesCatador;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Função do catador obtida com sucesso' })
  @ApiNotFoundResponse({ description: 'Função do catador não encontrada' })
  @ApiInternalServerErrorResponse({ description: 'Erro interno do servidor' })
  async findOne(@Param('id') id: string) {
    try {
      const funcaoCatador = await this.funcoesCatadorService.findOne(+id);
      if (!funcaoCatador) {
        throw new HttpException('Função do catador não encontrada', HttpStatus.NOT_FOUND);
      }
      return funcaoCatador;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Função do catador atualizada com sucesso' })
  @ApiNotFoundResponse({ description: 'Função do catador não encontrada' })
  @ApiInternalServerErrorResponse({ description: 'Erro interno do servidor' })
  async update(@Param('id') id: string, @Body() updateFuncoesCatadorDto: UpdateFuncoesCatadorDto) {
    try {
      const updatedFuncaoCatador = await this.funcoesCatadorService.update(+id, updateFuncoesCatadorDto);
      if (!updatedFuncaoCatador) {
        throw new HttpException('Função do catador não encontrada', HttpStatus.NOT_FOUND);
      }
      return updatedFuncaoCatador;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Função do catador excluída com sucesso' })
  @ApiNotFoundResponse({ description: 'Função do catador não encontrada' })
  @ApiInternalServerErrorResponse({ description: 'Erro interno do servidor' })
  async remove(@Param('id') id: string) {
    try {
      const deleted = await this.funcoesCatadorService.remove(+id);
      if (!deleted) {
        throw new HttpException('Função do catador não encontrada', HttpStatus.NOT_FOUND);
      }
      return { message: 'Função do catador excluída com sucesso' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
