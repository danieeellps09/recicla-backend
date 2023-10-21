import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NewAssociacao } from './dto/new-associacao.dto';
import { Associacao } from './entities/associacao.entity';
import { AssociacoesService } from './associacoes.service';
import { AuthRequest } from 'src/auth/models/AuthRequest';
import { UpdateAssociacaoDto } from './dto/update-associacao.dto';

@ApiTags("Associações")
@Controller('api/v1/associacoes')
@ApiBearerAuth()
export class AssociacoesController {
    constructor(private readonly associacaoService: AssociacoesService) { }

    @ApiOperation({ summary: 'Adiciona uma nova associação' })
    @ApiCreatedResponse({ description: 'Associação adicionado com sucesso' })
    @ApiBody({ type: NewAssociacao })
    @Post()
    async create(@Body() newVeiculo: NewAssociacao, @Req() req: AuthRequest): Promise<Associacao> {
        return await this.associacaoService.create(newVeiculo, req);
    }

    @ApiOperation({ summary: 'Obtém todas as associações.' })
    @ApiOkResponse({ description: 'Lista com todas as associações.', type: Associacao, isArray: true })
    @Get()
    async findAll(): Promise<Associacao[]> {
        return await this.associacaoService.findAll();
    }

    @ApiOperation({summary: "Encontra uma associação pelo seu id"})
    @ApiOkResponse({description: "Associação encontrada", type:Associacao})
    @Get(':id')
    async findByid(@Param('id') id:number):Promise<Associacao>{
        return await this.associacaoService.findById(id);
    }

    @ApiOperation({summary: "Atualiza informações de uma associação."})
    @ApiOkResponse({description: "Dados da associação atualizadas com sucesso", type: Associacao})
    @ApiBody({type: UpdateAssociacaoDto})
    @Put(':id')
    async update(@Param('id') id:number, @Body() associacao: UpdateAssociacaoDto):Promise<Associacao>{
        return await this.associacaoService.update(id, associacao);
    }

    @ApiOperation({summary: "Apaga informações de uma associação"})
    @ApiOkResponse({description: "Associação apagada com sucesso"})
    @Delete(":id")
    async delete(@Param("id") id: number){
        await this.associacaoService.delete(id);
    }
}
