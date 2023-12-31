import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NewAssociacao } from './dto/new-associacao.dto';
import { Associacao } from './entities/associacao.entity';
import { AssociacoesService } from './associacoes.service';
import { AuthRequest } from 'src/auth/models/AuthRequest';
import { UpdateAssociacaoDto } from './dto/update-associacao.dto';
import { ReturnAssociacaoDto } from './dto/return-associacao.dto';
import { AssociacaoConversor } from './dto/associacao-conversor';
import { isPublic } from 'src/auth/decorators/is-public.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Catador } from '@prisma/client';
import { CatadorFormatadoJson } from '../catador/models/catador-sem-associacao';

@ApiTags("Associações")
@isPublic()
@Controller('api/v1/associacoes')

export class AssociacoesController {
    constructor(private readonly associacaoService: AssociacoesService) { }

    @ApiOperation({ summary: 'Adiciona uma nova associação' })
    @ApiCreatedResponse({ description: 'Associação adicionado com sucesso' })
    @ApiBody({ type: NewAssociacao })
    @Post()
    async create(@Body() newAssociacao: NewAssociacao): Promise<ReturnAssociacaoDto> {
        try {
            return AssociacaoConversor.toReturnAssociacaoDto(await this.associacaoService.create(newAssociacao));
        } catch (error) {
            throw new HttpException( `${error.message} Não foi possível adicionar associação.`, error.status);
        }
    }

    @ApiOperation({ summary: 'Obtém todas as associações.' })
    @ApiOkResponse({ description: 'Lista com todas as associações.', type: Associacao, isArray: true })
    @Get()
    async findAll(): Promise<ReturnAssociacaoDto[]> {
        try {
            return (await this.associacaoService.findAll()).map(AssociacaoConversor.toReturnAssociacaoDto);
        } catch (error) {
            throw new HttpException(`${error.message} Não foi possível buscar associações.`, error.status);
        }
    }

    @ApiOperation({ summary: "Encontra uma associação pelo seu id" })
    @ApiOkResponse({ description: "Associação encontrada", type: Associacao })
    @Get(':id')
    async findByid(@Param('id') id: number): Promise<ReturnAssociacaoDto> {
        try {
            return AssociacaoConversor.toReturnAssociacaoDto(await this.associacaoService.findById(id));
        } catch (error) {
            throw new HttpException(`${error.message} Não foi possível encontrar associação.`, error.status);
        }
    }


    @ApiOperation({ summary: "Atualiza informações de uma associação." })
    @ApiOkResponse({ description: "Dados da associação atualizadas com sucesso", type: Associacao })
    @ApiBody({ type: UpdateAssociacaoDto })
    @Put(':id')
    async update(@Param('id') id: number, @Body() associacao: UpdateAssociacaoDto): Promise<ReturnAssociacaoDto> {
        try {
            return AssociacaoConversor.toReturnAssociacaoDto(await this.associacaoService.update(id, associacao));
        } catch (error) {
            throw new HttpException(`${error.message} Não foi possível atualizar associação.`, error.status);
        }
    }

    @ApiOperation({ summary: "Apaga informações de uma associação" })
    @ApiOkResponse({ description: "Associação apagada com sucesso" })
    @Delete(":id")
    async delete(@Param("id") id: number) {
        try {
            await this.associacaoService.delete(id);
        } catch (error) {
            throw new HttpException(`${error.message} Não foi possível apagar associação.`, error.status);
        }
    }
}

