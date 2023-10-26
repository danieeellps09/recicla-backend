import { Controller, Get, Post, Body, Param, Put, Delete, Req, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { ApiOkResponse, ApiCreatedResponse, ApiBody, ApiOperation, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Catador } from './entities/catador.entity';
import { CatadorService } from './catador.service';
import { CreateCatadorDto } from './dto/create-catador.dto';
import { AuthRequest } from 'src/auth/models/AuthRequest';
import { UpdateCatadorDto } from './dto/update-catador.dto';

@ApiTags('Catadores')
@ApiBearerAuth()
@Controller('api/v1/catadores')
export class CatadorController {
  constructor(private readonly catadorService: CatadorService) {}

  @ApiOperation({ summary: 'Cria um novo catador.' })
  @ApiCreatedResponse({ description: 'O catador foi criado com sucesso.', type: CreateCatadorDto })
  @ApiBody({ type: CreateCatadorDto })
  @Post()
  async create(@Body() catador: CreateCatadorDto, @Req() req: AuthRequest): Promise<Catador> {
    try {
      console.log('usuario', req.user)
      return await this.catadorService.create(catador, req);
    } catch (error) {
      throw new BadRequestException('Erro ao criar o catador. Por favor, verifique os dados fornecidos.');
    }
  }

  @ApiOperation({ summary: 'Obtém todos os catadores.' })
  @ApiOkResponse({ description: 'Retorna todos os catadores.', type: Catador, isArray: true })
  @Get()
  async findAll(): Promise<Catador[]> {
    try {
      return await this.catadorService.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Erro ao obter os catadores. Por favor, tente novamente mais tarde.');
    }
  }

  @ApiOperation({ summary: 'Obtém um catador pelo ID.' })
  @ApiOkResponse({ description: 'Retorna um catador pelo ID.', type: Catador })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Catador> {
    try {
      return await this.catadorService.findOne(+id);
    } catch (error) {
      throw new NotFoundException('Catador não encontrado.');
    }
  }

  @ApiOperation({ summary: 'Atualiza um catador pelo ID.' })
  @ApiOkResponse({ description: 'O catador foi atualizado com sucesso.', type: Catador })
  @ApiBody({ type: UpdateCatadorDto })
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCatadorDto: UpdateCatadorDto): Promise<Catador> {
    try {
      return await this.catadorService.update(+id, updateCatadorDto);
    } catch (error) {
      throw new NotFoundException('Catador não encontrado.');
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
