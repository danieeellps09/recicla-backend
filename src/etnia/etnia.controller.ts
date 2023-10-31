import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { isPublic } from 'src/auth/decorators/is-public.decorator';
import { EtniaService } from './etnia.service';
import { Etnia } from './entities/etnia.entity';

@ApiTags('Etnia')
@isPublic()
@Controller('api/v1/etnia')
export class EtniaController {
    constructor(private readonly etniaService: EtniaService) { }

    @ApiOperation({ summary: 'Cadastra uma nova etnia.' })
    @ApiCreatedResponse({ description: 'Etnia cadastrada com sucesso.', type: Etnia })
    @ApiBody({ type: String })
    @Post()
    async create(@Body() nomenclatura:string): Promise<Etnia> {
        try {
            return this.etniaService.create(nomenclatura);
        } catch (error) {
            throw new BadRequestException(`${error.message} Não foi possível cadastrar etnia.`);
        }
    }

    @ApiOperation({ summary: 'Encontra uma etnia pelo identificador.' })
    @ApiOkResponse({ description: 'Etnia encontrada.', type: Etnia })
    @Get(':id')
    async findById(@Param('id') id:number): Promise<Etnia> {
        try {
            return this.etniaService.findById(id);
        } catch (error) {
            throw new BadRequestException(`${error.message} Não foi possível encontrar etnia.`);
        }
    }

    @ApiOperation({ summary: 'Encontra todas as etnias cadastradas.' })
    @ApiOkResponse({ description: 'Etnias encontradas.', type: Etnia, isArray:true })
    @Get()
    async findAll(): Promise<Etnia[]> {
        try {
            return this.etniaService.findAll();
        } catch (error) {
            throw new BadRequestException(`${error.message} Não foi possível encontrar etnias.`);
        }
    }

    @ApiOperation({ summary: 'Atualiza uma etnia.' })
    @ApiOkResponse({ description: 'Etnia atualizada com sucesso.', type: Etnia})
    @ApiBody({ type: String })
    @Put(':id')
    async update(@Param('id') id:number, @Body() nomenclatura:string): Promise<Etnia> {
        try {
            return this.etniaService.update(id, nomenclatura);
        } catch (error) {
            throw new BadRequestException(`${error.message} Não foi possível atualizar etnia.`);
        }
    }

    @ApiOperation({ summary: 'Atualiza uma etnia.' })
    @ApiOkResponse({ description: 'Etnia atualizada com sucesso.'})
    @Delete(':id')
    async delete(@Param('id') id:number){
        try {
            return this.etniaService.delete(id);
        } catch (error) {
            throw new BadRequestException(`${error.message} Não foi possível deletar etnia.`);
        }
    }
}
