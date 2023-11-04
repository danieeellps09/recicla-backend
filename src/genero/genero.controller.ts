import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { isPublic } from 'src/auth/decorators/is-public.decorator';
import { Genero } from './entities/genero.entity';
import { GeneroService } from './genero.service';
import { GeneroDto } from './dto/genero.dto';

@isPublic()
@ApiTags('Genero')
@Controller('api/v1/genero')
export class GeneroController {
    constructor(private readonly generoService: GeneroService) { }

    @ApiOperation({ summary: 'Cadastra uma nova genero.' })
    @ApiCreatedResponse({ description: 'Genero cadastrada com sucesso.', type: Genero })
    @ApiBody({ type: GeneroDto })
    @Post()
    async create(@Body() generoDto:GeneroDto): Promise<Genero> {
        try {
            return this.generoService.create(generoDto.nomenclatura);
        } catch (error) {
            throw new BadRequestException(`${error.message} Não foi possível cadastrar genero.`);
        }
    }

    @ApiOperation({ summary: 'Encontra uma genero pelo identificador.' })
    @ApiOkResponse({ description: 'Genero encontrada.', type: Genero })
    @Get(':id')
    async findById(@Param('id') id:number): Promise<Genero> {
        try {
            return this.generoService.findById(id);
        } catch (error) {
            throw new BadRequestException(`${error.message} Não foi possível encontrar genero.`);
        }
    }

    @ApiOperation({ summary: 'Encontra todas as generos cadastradas.' })
    @ApiOkResponse({ description: 'Generos encontradas.', type: Genero, isArray:true })
    @Get()
    async findAll(): Promise<Genero[]> {
        try {
            return this.generoService.findAll();
        } catch (error) {
            throw new BadRequestException(`${error.message} Não foi possível encontrar generos.`);
        }
    }

    @ApiOperation({ summary: 'Atualiza uma genero.' })
    @ApiOkResponse({ description: 'Genero atualizada com sucesso.', type: Genero})
    @ApiBody({ type: GeneroDto })
    @Put(':id')
    async update(@Param('id') id:number, @Body() generoDto:GeneroDto): Promise<Genero> {
        try {
            return this.generoService.update(id, generoDto.nomenclatura);
        } catch (error) {
            throw new BadRequestException(`${error.message} Não foi possível atualizar genero.`);
        }
    }

    @ApiOperation({ summary: 'Deleta um genero.' })
    @ApiOkResponse({ description: 'Genero deletado com sucesso.'})
    @Delete(':id')
    async delete(@Param('id') id:number){
        try {
            return this.generoService.delete(id);
        } catch (error) {
            throw new BadRequestException(`${error.message} Não foi possível deletar genero.`);
        }
    }
}
