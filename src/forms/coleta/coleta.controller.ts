import { BadRequestException, Body, Controller, Delete, Get, HttpException, HttpStatus, InternalServerErrorException, Logger, NotFoundException, Param, Post, Put, Query, Req } from '@nestjs/common';
import { ColetaService } from './coleta.service';
import { isPublic } from 'src/auth/decorators/is-public.decorator';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterColetaDto } from './dto/register-coleta-dto';
import { CatadorService } from 'src/catador/catador.service';
import { AssociacoesService } from 'src/associacoes/associacoes.service';
import {  User } from '@prisma/client';
import { AuthRequest } from 'src/auth/models/AuthRequest';
import { CurrentUserLogged } from 'src/auth/decorators/current-users-decorator';
import { UpdateColetaDto } from './dto/update-coleta-dto';
import { format, isDate, parse } from 'date-fns';
import { Coleta } from './entities/coleta.entity';
import { ReturnColetaDto } from './dto/return-coleta.dto';

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

    let dataConvertida: Date;

    if (registerColetaDto.dataColeta && isDate(parse(registerColetaDto.dataColeta, 'dd/MM/yyyy', new Date()))) {
      dataConvertida = parse(registerColetaDto.dataColeta, 'dd/MM/yyyy', new Date());
    } else {
      dataConvertida = new Date();
    }

    const dataFormatada: string = format(dataConvertida, "yyyy-MM-dd'T'HH:mm:ss.SSS");


    return await this.coletaService.create(registerColetaDto, req)

    
  } catch (error) {
    console.error(error)
    throw new BadRequestException(error.message);
  }
}


@ApiOperation({ summary: 'Obtém todas as coletas.' })
@ApiOkResponse({ description: 'Lista com todas as coletas.', type: RegisterColetaDto, isArray: true })
@Get()
async findAll(): Promise<Coleta[]> {
    try {
        return await this.coletaService.findAll();
    } catch (error) {
        throw new HttpException('Erro ao buscar coleta.', error.message);
    }
}


@ApiOperation({ summary: "Encontra uma coleta pelo seu id" })
@ApiOkResponse({ description: "Coleta  encontrada", type: RegisterColetaDto })
@Get(':id')
async findByid(@Param('id') id: number): Promise<Coleta> {
    try {
        return await this.coletaService.findById(id);
    } catch (error) {
        throw new HttpException('Coleta não encontrada.', HttpStatus.NOT_FOUND);
    }
}



@ApiOperation({summary: "Retorna todas as coletas entre duas datas."})
@ApiOkResponse({description: "Coletas encontradas"})
@Get('findBetweenDates/dates')
async findBetweenDates(
    @Query('datainicio') dataInicio:string = new Date().toString(), 
    @Query('datafim') dataFim:string = new Date().toString()):Promise<Coleta[]>{
        let dataInicioConvertida = parse(dataInicio, 'dd/MM/yyyy', new Date());
        let dataFimConvertida = parse(dataFim, 'dd/MM/yyyy', new Date());
        
        if(isDate(dataInicioConvertida) && isDate(dataFimConvertida)){
            if(dataFimConvertida >= dataInicioConvertida){
                return await this.coletaService.findBetweenDates(dataInicioConvertida, dataFimConvertida);
            }
            throw new BadRequestException("Data de início deve ser anterior a data de fim.");
        }
        throw new BadRequestException("Dados fornecidos não são datas válidas");
    }
    
   
    @ApiOperation({summary: "Retorna todas as coletas por catador entre duas datas."})
    @ApiOkResponse({description: "Coletas encontradas"})
    @Get('findBetweenDates/:id')
    async findByIdBetweenDates(
        @Param('id') idCatador:number,
        @Query('datainicio') dataInicio:string = new Date().toString(), 
        @Query('datafim') dataFim:string = new Date().toString()):Promise<ReturnColetaDto[]>{
            let dataInicioConvertida = parse(dataInicio, 'dd/MM/yyyy', new Date());
            let dataFimConvertida = parse(dataFim, 'dd/MM/yyyy', new Date());
            
            if(isDate(dataInicioConvertida) && isDate(dataFimConvertida)){
                if(dataFimConvertida >= dataInicioConvertida){
                  return (await this.coletaService.findByCatadorAndBetweenDates(idCatador, dataInicioConvertida, dataFimConvertida))
                  .map(coleta => new ReturnColetaDto(coleta));
                }
                throw new BadRequestException("Data de início deve ser anterior a data de fim.");
            }
            throw new BadRequestException("Dados fornecidos não são datas válidas");
        }

        @ApiOperation({ summary: 'Retorna todas as coletas por 1 catador.' })
        @ApiOkResponse({ description: 'Coletas encontradas',  })
        @Get('by-catador/:idCatador')
        async findColetasByCatador(@Param('idCatador') idCatador: number): Promise<Coleta[]> {
          try {
            return this.coletaService.findColetasByCatador(idCatador);
          } catch (error) {
            throw new HttpException('Erro ao buscar coletas do catador.', error.message);
          }
        }

        @ApiOperation({ summary: 'Obtém todas as coletas do catador logado.' })
        @ApiOkResponse({ description: 'Lista com todas as coletas do catador logado.', type: RegisterColetaDto, isArray: true })
        @Get('coletas/coletas-by-catadores')  
        async encontrarMinhasColetas(@Req() req: AuthRequest): Promise<Coleta[]> {
          const userId = req.user.id;
        
          if (!userId) {
            throw new NotFoundException('Usuário não encontrado');
          }
        
          try {
            const catador = await this.catadorService.getCatadorByUserID(userId);
        
            if (!catador) {
              throw new NotFoundException('O usuário não é um catador.');
               }
        
            return this.coletaService.findMyColetas(catador.id);
          } catch (error) {
            throw new InternalServerErrorException('Erro ao buscar as coletas.');
          }
        }

    

        @ApiOperation({ summary: 'Retorna todas as coletas entre duas datas.' })
        @ApiOkResponse({ description: 'Coletas encontradas', isArray: true })
        @Get('encontrar-entre-datas/by-catador')
        async encontrarEntreDatasporCatador(
          @Query('datainicio') dataInicio: string = new Date().toString(),
          @Query('datafim') dataFim: string = new Date().toString(),
          @Req() req: AuthRequest
        ): Promise<ReturnColetaDto[]> {
          const userId = req.user.id;
      
          if (!userId) {
            throw new BadRequestException('Usuário não encontrado');
          }
      
          try {
            const catador = await this.catadorService.getCatadorByUserID(userId);
      
            if (!catador) {
              throw new BadRequestException('O usuário não é um catador.');
            }
      
            const dataInicioConvertida = parse(dataInicio, 'dd/MM/yyyy', new Date());
            const dataFimConvertida = parse(dataFim, 'dd/MM/yyyy', new Date());
      
            if (isDate(dataInicioConvertida) && isDate(dataFimConvertida) && dataFimConvertida >= dataInicioConvertida) {
              return (await this.coletaService.findBetweenDatesByCatador(catador.id, dataInicioConvertida, dataFimConvertida))
              .map(coleta => new ReturnColetaDto(coleta));            }
      
            throw new BadRequestException('Datas fornecidas não são válidas');
          } catch (error) {
            throw new BadRequestException('Erro ao buscar as coletas: ' + error.message);
          }
        }

       
      

        
        @ApiOperation({ summary: "Atualiza informações de uma coleta." })
        @ApiOkResponse({ description: "Dados da coleta atualizadas com sucesso", type: UpdateColetaDto })
        @ApiBody({ type: UpdateColetaDto })
        @Put(':id')
        async update(@Param('id') id: number, @Body() coleta: UpdateColetaDto): Promise<Coleta> {
            try {
                return await this.coletaService.update(id, coleta);
            } catch (error) {
                throw new HttpException('Erro ao atualizar coleta.', error.message);
            }
        }
        
        @ApiOperation({ summary: "Apaga informações de uma Coleta" })
        @ApiOkResponse({ description: "Coleta apagada com sucesso" })
        @Delete(":id")
        async delete(@Param("id") id: number) {
            try {
                await this.coletaService.delete(id);
            } catch (error) { 
                throw new HttpException('Erro ao apagar coleta.', error.message);
            }
    }

}
