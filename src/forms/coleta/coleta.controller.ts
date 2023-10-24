import { BadRequestException, Body, Controller, Post, Req } from '@nestjs/common';
import { ColetaService } from './coleta.service';
import { isPublic } from 'src/auth/decorators/is-public.decorator';
import { ApiBody, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterColetaDto } from './dto/register-coleta-dto';
import { CatadorService } from 'src/catador/catador.service';
import { AssociacoesService } from 'src/associacoes/associacoes.service';
import { CatadorRequest } from './models/CatadorRequest';

@ApiTags('Formulario de Coletas')
@isPublic()
@Controller('api/v1/forms/coleta')
export class ColetaController {

constructor( private readonly coletaService: ColetaService,
    private readonly catadorService: CatadorService,
    private readonly associacaoService: AssociacoesService
    ){

}

@ApiOperation({ summary: 'Cria um novo registro de coleta.' })
@ApiCreatedResponse({
  description: 'O usuário foi criado com sucesso.',
  type: RegisterColetaDto,
})
@ApiBody({ type: RegisterColetaDto })
@Post()
async create(@Body() registerColetaDto: RegisterColetaDto, @Req() req: CatadorRequest) {
  try {


    const coleta = this.coletaService.create(registerColetaDto, req)








    return coleta;
  } catch (error) {
    throw new BadRequestException(error.message);
  }
}






}
