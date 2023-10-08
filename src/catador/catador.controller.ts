import { Controller, Get, Post, Body, Param, Put, Delete, Req } from '@nestjs/common';
import { ApiOkResponse, ApiCreatedResponse, ApiBody, ApiOperation, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Catador } from './entities/catador.entity';
import { CatadorService } from './catador.service';
import { CatadorDto } from './dto/create-catador.dto';
import { AuthRequest } from 'src/auth/models/AuthRequest';

@ApiTags('Catadores')
@ApiBearerAuth()
@Controller('Catadores')
export class CatadorController {
  constructor(private readonly catadorService: CatadorService) {}

  @ApiOperation({ summary: 'Cria um novo catador.' })
  @ApiCreatedResponse({ description: 'O catador foi criado com sucesso.', type: CatadorDto })
  @ApiBody({ type: CatadorDto })
  @Post()
  async create(@Body() catador: CatadorDto,  @Req() req: AuthRequest): Promise<Catador> {
    return this.catadorService.create(catador, req);
  }

  @ApiOperation({ summary: 'Obtém todos os catadores.' })
  @ApiOkResponse({ description: 'Retorna todos os catadores.', type: Catador, isArray: true })
  @Get()
  async findAll(): Promise<Catador[]> {
    return this.catadorService.findAll();
  }

  @ApiOperation({ summary: 'Obtém um catador pelo ID.' })
  @ApiOkResponse({ description: 'Retorna um catador pelo ID.', type: Catador })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Catador> {
    return this.catadorService.findOne(+id);
  }

  @ApiOperation({ summary: 'Atualiza um catador pelo ID.' })
  @ApiOkResponse({ description: 'O catador foi atualizado com sucesso.', type: Catador })
  @ApiBody({ type: Catador })
  @Put(':id')
  async update(@Param('id') id: string, @Body() catador: Catador): Promise<Catador> {
    return this.catadorService.update(+id, catador);
  }

  @ApiOperation({ summary: 'Remove um catador pelo ID.' })
  @ApiOkResponse({ description: 'O catador foi removido com sucesso.' })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.catadorService.remove(+id);
  }
}
