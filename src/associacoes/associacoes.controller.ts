import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Req } from '@nestjs/common';
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
    async create(@Body() newAssociacao: NewAssociacao, @Req() req: AuthRequest): Promise<Associacao> {
        try {
            return await this.associacaoService.create(newAssociacao, req);
        } catch (error) {
            throw new HttpException('Erro ao adicionar associação.', error.message);
        }
    }

    @ApiOperation({ summary: 'Obtém todas as associações.' })
    @ApiOkResponse({ description: 'Lista com todas as associações.', type: Associacao, isArray: true })
    @Get()
    async findAll(): Promise<Associacao[]> {
        try {
            return await this.associacaoService.findAll();
        } catch (error) {
            throw new HttpException('Erro ao buscar associações.', error.message);
        }
    }

    @ApiOperation({ summary: "Encontra uma associação pelo seu id" })
    @ApiOkResponse({ description: "Associação encontrada", type: Associacao })
    @Get(':id')
    async findByid(@Param('id') id: number): Promise<Associacao> {
        try {
            return await this.associacaoService.findById(id);
        } catch (error) {
            throw new HttpException('Associação não encontrada.', HttpStatus.NOT_FOUND);
        }
    }

    @ApiOperation({ summary: "Atualiza informações de uma associação." })
    @ApiOkResponse({ description: "Dados da associação atualizadas com sucesso", type: Associacao })
    @ApiBody({ type: UpdateAssociacaoDto })
    @Put(':id')
    async update(@Param('id') id: number, @Body() associacao: UpdateAssociacaoDto): Promise<Associacao> {
        try {
            return await this.associacaoService.update(id, associacao);
        } catch (error) {
            throw new HttpException('Erro ao atualizar associação.', error.message);
        }
    }

    @ApiOperation({ summary: "Apaga informações de uma associação" })
    @ApiOkResponse({ description: "Associação apagada com sucesso" })
    @Delete(":id")
    async delete(@Param("id") id: number) {
        try {
            await this.associacaoService.delete(id);
        } catch (error) {
            throw new HttpException('Erro ao apagar associação.', error.message);
        }
    }
}

