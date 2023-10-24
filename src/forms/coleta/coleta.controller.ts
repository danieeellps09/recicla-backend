import { Controller, Post } from '@nestjs/common';
import { ColetaService } from './coleta.service';
import { isPublic } from 'src/auth/decorators/is-public.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Formulario de Coletas')
@isPublic()
@Controller('api/v1/forms/coleta')
export class ColetaController {

constructor( private readonly coletaService: ColetaService){

}







}
