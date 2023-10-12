import { Body, Controller, Get, NotFoundException, Param, Post, Put, Req, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { VeiculoService } from './veiculo.service';
import { Veiculo } from './entities/veiculo.entity';
import { NewVeiculo } from './dto/new-veiculo.dto';
import { isPublic } from 'src/auth/decorators/is-public.decorator';
import { UpdateVeiculo } from './dto/update-veiculo.dto';

@isPublic()
@ApiTags("Veículos")
@Controller('veiculo')
export class VeiculoController {
    constructor(private readonly veiculoService: VeiculoService){}

    @ApiOperation({summary: 'Adiciona um novo tipo de veículo'})
    @ApiCreatedResponse({description:'Veículo adicionado com sucesso'} )
    @ApiBody({type: NewVeiculo})
    @Post()
    async create(@Body() newVeiculo: NewVeiculo): Promise<Veiculo>{
        return this.veiculoService.create(newVeiculo);
    }

    @ApiOperation({summary: 'Retorna todos os veículos cadastrados'})
    @ApiOkResponse({description:'A lista de veículos.', type: [UpdateVeiculo]} )
    @Get()
    async findAll(): Promise<Veiculo[]>{
        return this.veiculoService.findAll();
    }

    @ApiOperation({summary: 'Retorna um veículo ao buscar por seu identificador'})
    @ApiOkResponse({description:'O veículo procurado.', type: UpdateVeiculo} )
    @Get(':id')
    async findById(@Param('id') id:number): Promise<Veiculo>{
        return this.veiculoService.findById(id);
    }

    @ApiOperation({summary: 'Atualiza o nome do veículo'})
    @ApiOkResponse({description:'Veículo atualizado.', type: UpdateVeiculo} )
    @ApiBody({type: UpdateVeiculo})
    @Put()
    async update(@Body() updateVeiculo: UpdateVeiculo): Promise<Veiculo>{
        return this.veiculoService.update(updateVeiculo);
    }

    @ApiOperation({summary: 'Exclui um veículo'})
    @ApiOkResponse({description:'Veículo atualizado.'})
    @Delete(':id')
    async delete(@Param('id') id:number){
        await this.veiculoService.delete(id);
    }
}
