import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NewAssociacao } from './dto/new-associacao.dto';
import { Associacao } from './entities/associacao.entity';
import { AssociacoesService } from './associacoes.service';

@ApiTags("Associações")
@Controller('api/v1/associacoes')
export class AssociacoesController {
    constructor(private readonly associacaoService: AssociacoesService){}

    @ApiOperation({summary: 'Adiciona um novo tipo de veículo'})
    @ApiCreatedResponse({description:'Veículo adicionado com sucesso'} )
    @ApiBody({type: NewAssociacao})
    @Post()
    async create(@Body() newVeiculo: NewAssociacao): Promise<Associacao>{
        return this.associacaoService.create(newVeiculo);
    }
}
