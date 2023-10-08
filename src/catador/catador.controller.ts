import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { Catador } from './entities/catador.entity';
import { CatadorService } from './catador.service';
import { CatadorDto } from './dto/create-catador.dto';

@Controller('catadores')
export class CatadorController {
  constructor(private readonly catadorService: CatadorService) {}

  @Post()
  create(@Body() catador: CatadorDto): Promise<Catador> {
    return this.catadorService.create(catador);
  }

  @Get()
  findAll(): Promise<Catador[]> {
    return this.catadorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Catador> {
    return this.catadorService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() catador: Catador): Promise<Catador> {
    return this.catadorService.update(+id, catador);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.catadorService.remove(+id);
  }
}
