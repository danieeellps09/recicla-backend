import { Controller, Get, Post, Body, Param, Put, Delete, Req, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { ApiOkResponse, ApiCreatedResponse, ApiBody, ApiOperation, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Catador } from './entities/catador.entity';
import { CatadorService } from './catador.service';
import { CreateCatadorDto } from './dto/create-catador.dto';
import { AuthRequest } from 'src/auth/models/AuthRequest';
import { UpdateCatadorDto } from './dto/update-catador.dto';
import { CatadorConversor } from './dto/catador-conversor';
import { ReturnCatadorDto } from './dto/return-catador.dto';
import { map } from 'rxjs';
import { isPublic } from 'src/auth/decorators/is-public.decorator';

@ApiTags('Catadores')
//@ApiBearerAuth()
@isPublic()
@Controller('api/v1/catadores')
export class CatadorController {
  constructor(private readonly catadorService: CatadorService) {}

  @ApiOperation({ summary: 'Cria um novo catador.' })
  @ApiCreatedResponse({ description: 'O catador foi criado com sucesso.', type: ReturnCatadorDto })
  @ApiBody({ type: CreateCatadorDto })
  @Post()
  async create(@Body() catador: CreateCatadorDto): Promise<ReturnCatadorDto> {
    try {
      return CatadorConversor.toReturnCatadorDto(await this.catadorService.create(catador)) ;
    } catch (error) {
      throw new BadRequestException(`${error.message} Não foi possível criar usuário`);
    }
  }

  @ApiOperation({ summary: 'Obtém todos os catadores.' })
  @ApiOkResponse({ description: 'Retorna todos os catadores.', type: ReturnCatadorDto, isArray: true })
  @Get()
  async findAll(): Promise<ReturnCatadorDto[]> {
    try {
      return (await this.catadorService.findAll()).map(CatadorConversor.toReturnCatadorDto);
    } catch (error) {
      throw new InternalServerErrorException('Erro ao obter os catadores. Por favor, tente novamente mais tarde.');
    }
  }

  @ApiOperation({ summary: 'Obtém um catador pelo ID.' })
  @ApiOkResponse({ description: 'Retorna um catador pelo ID.', type: ReturnCatadorDto })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ReturnCatadorDto>{
    try {
      return CatadorConversor.toReturnCatadorDto(await this.catadorService.findOne(+id));
    } catch (error) {
      throw new NotFoundException('Catador não encontrado.');
    }
  }

  @ApiOperation({ summary: 'Atualiza um catador pelo ID.' })
  @ApiOkResponse({ description: 'O catador foi atualizado com sucesso.', type: ReturnCatadorDto })
  @ApiBody({ type: UpdateCatadorDto })
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCatadorDto: UpdateCatadorDto): Promise<ReturnCatadorDto> {
    try {
      return CatadorConversor.toReturnCatadorDto(await this.catadorService.update(+id, updateCatadorDto));
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @ApiOperation({ summary: 'Remove um catador pelo ID.' })
  @ApiOkResponse({ description: 'O catador foi removido com sucesso.' })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    try {
      await this.catadorService.remove(+id);
    } catch (error) {
      throw new NotFoundException('Catador não encontrado.');
    }
  }
  
}
