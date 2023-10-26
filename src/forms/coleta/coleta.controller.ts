import { BadRequestException, Body, Controller, Delete, Get, HttpException, HttpStatus, Logger, Param, Post, Put, Req } from '@nestjs/common';
import { ColetaService } from './coleta.service';
import { isPublic } from 'src/auth/decorators/is-public.decorator';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterColetaDto } from './dto/register-coleta-dto';
import { CatadorService } from 'src/catador/catador.service';
import { AssociacoesService } from 'src/associacoes/associacoes.service';
import { Coleta, User } from '@prisma/client';
import { AuthRequest } from 'src/auth/models/AuthRequest';
import { CurrentUserLogged } from 'src/auth/decorators/current-users-decorator';
import { UpdateColetaDto } from './dto/update-coleta-dto';

@ApiTags('Formulario de Coletas')
@ApiBearerAuth()
@Controller('api/v1/forms/coleta')
export class ColetaController {

constructor( private readonly coletaService: ColetaService,
    private readonly catadorService: CatadorService,
    ){

}
private readonly logger = new Logger(ColetaController.name);
@ApiOperation({ summary: 'Cria um novo registro de coleta.' })
@ApiCreatedResponse({
  description: 'O usuário foi criado com sucesso.',
  type: RegisterColetaDto,
})
@ApiBody({ type: RegisterColetaDto })
@Post()
async create(@Body() registerColetaDto: RegisterColetaDto, @Req() req: AuthRequest):Promise<Coleta> {
  try {

    return await this.coletaService.create(registerColetaDto, req)

    
  } catch (error) {
    console.error(error)
    throw new BadRequestException(error.message);
  }
}


@ApiOperation({ summary: 'Obtém todas as associações.' })
@ApiOkResponse({ description: 'Lista com todas as associações.', type: RegisterColetaDto, isArray: true })
@Get()
async findAll(): Promise<Coleta[]> {
    try {
        return await this.coletaService.findAll();
    } catch (error) {
        throw new HttpException('Erro ao buscar associações.', error.message);
    }
}

@ApiOperation({ summary: "Encontra uma coleta pelo seu id" })
@ApiOkResponse({ description: "Associação encontrada", type: RegisterColetaDto })
@Get(':id')
async findByid(@Param('id') id: number): Promise<Coleta> {
    try {
        return await this.coletaService.findById(id);
    } catch (error) {
        throw new HttpException('Coleta não encontrada.', HttpStatus.NOT_FOUND);
    }
}




@ApiOperation({ summary: "Atualiza informações de uma associação." })
    @ApiOkResponse({ description: "Dados da coleta atualizadas com sucesso", type: UpdateColetaDto })
    @ApiBody({ type: UpdateColetaDto })
    @Put(':id')
    async update(@Param('id') id: number, @Body() coleta: UpdateColetaDto): Promise<Coleta> {
        try {
            return await this.coletaService.update(id, coleta);
        } catch (error) {
            throw new HttpException('Erro ao atualizar associação.', error.message);
        }
    }

    @ApiOperation({ summary: "Apaga informações de uma Coleta" })
    @ApiOkResponse({ description: "Coleta apagada com sucesso" })
    @Delete(":id")
    async delete(@Param("id") id: number) {
        try {
            await this.coletaService.delete(id);
        } catch (error) {
            throw new HttpException('Erro ao apagar associação.', error.message);
        }
    }

}
