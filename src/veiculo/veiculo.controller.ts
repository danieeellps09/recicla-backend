import { Body, Controller, Get, NotFoundException, Param, Post, Put, Req, Delete, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { VeiculoService } from './veiculo.service';
import { Veiculo } from './entities/veiculo.entity';
import { NewVeiculo } from './dto/new-veiculo.dto';
import { isPublic } from 'src/auth/decorators/is-public.decorator';
import { UpdateVeiculo } from './dto/update-veiculo.dto';

@isPublic()
@ApiTags("Veículos")
@Controller('api/v1/veiculos')
export class VeiculoController {
    constructor(private readonly veiculoService: VeiculoService){}

    @ApiOperation({ summary: 'Adiciona um novo tipo de veículo' })
  @ApiCreatedResponse({ description: 'Veículo adicionado com sucesso' })
  @ApiBody({ type: NewVeiculo })
  @Post()
  async create(@Body() newVeiculo: NewVeiculo): Promise<Veiculo> {
    try {
      return await this.veiculoService.create(newVeiculo);
    } catch (error) {
      throw new BadRequestException(error.message); //
    }
  }

  @ApiOperation({ summary: 'Retorna todos os veículos cadastrados' })
  @ApiOkResponse({ description: 'A lista de veículos.', type: [UpdateVeiculo] })
  @Get()
  async findAll(): Promise<Veiculo[]> {
    try {
      return await this.veiculoService.findAll();
    } catch (error) {
      
      throw new InternalServerErrorException(error.message); 
    }
  }

  @ApiOperation({ summary: 'Retorna um veículo ao buscar por seu identificador' })
  @ApiOkResponse({ description: 'O veículo procurado.', type: UpdateVeiculo })
  @Get(':id')
  async findById(@Param('id') id: number): Promise<Veiculo> {
    try {
      return await this.veiculoService.findById(id);
    } catch (error) {
   
      throw new NotFoundException(error.message);
    }
  }

  @ApiOperation({ summary: 'Atualiza o nome do veículo' })
  @ApiOkResponse({ description: 'Veículo atualizado.', type: UpdateVeiculo })
  @ApiBody({ type: UpdateVeiculo })
  @Put()
  async update(@Param('id') id: number, @Body() updateVeiculo: UpdateVeiculo): Promise<Veiculo> {
    try {
      const veiculoAtualizado =  await this.veiculoService.update(id,updateVeiculo);
      if (!veiculoAtualizado) {
        throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
      }

      return veiculoAtualizado;
    } catch (error) {
      throw new NotFoundException(error.message); 
    }
  }

  @ApiOperation({ summary: 'Exclui um veículo' })
  @ApiOkResponse({ description: 'Veículo excluído.' })
  @Delete(':id')
  async delete(@Param('id') id: number) {
    try {
      const veiculoDeletado = await this.veiculoService.delete(id);
      if (!veiculoDeletado) {
        throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
      }
      return veiculoDeletado;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
