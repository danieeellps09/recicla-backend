import { BadRequestException, Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, Req } from '@nestjs/common';
import { VendaService } from './venda.service';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterVendaDto } from './dto/register-venda-dto';
import { AssociacoesService } from 'src/associacoes/associacoes.service';
import { AuthRequest } from 'src/auth/models/AuthRequest';
import { UpdateVendaDto } from './dto/update-venda-dto';
import { format, isDate, parse } from 'date-fns';
import { Venda } from './entities/venda.entity';
import { ReturnVendaDto } from './dto/return-venda.dto';

@ApiTags('Formulario de Vendas')
@ApiBearerAuth()
@Controller('api/v1/forms/venda')
export class VendaController {
    constructor(
        private readonly vendaService: VendaService,
        private readonly associacaoService: AssociacoesService,
    ) {}

    @ApiOperation({ summary: 'Cria um novo registro de venda.' })
    @ApiCreatedResponse({
        description: 'O usuário foi criado com sucesso.',
        type: RegisterVendaDto,
    })
    @ApiBody({ type: RegisterVendaDto })
    @Post()
    async create(@Body() registerVendaDto: RegisterVendaDto, @Req() req: AuthRequest): Promise<ReturnVendaDto> {
        try {
            let dataConvertida: Date;

            if (registerVendaDto.dataVenda && isDate(parse(registerVendaDto.dataVenda, 'dd/MM/yyyy', new Date()))) {
                dataConvertida = parse(registerVendaDto.dataVenda, 'dd/MM/yyyy', new Date());
            } else {
                dataConvertida = new Date();
            }

            const dataFormatada: string = format(dataConvertida, "yyyy-MM-dd'T'HH:mm:ss.SSS");

            return new ReturnVendaDto(await this.vendaService.create(registerVendaDto, req));
        } catch (error) {
            console.error(error);
            throw new BadRequestException(error.message);
        }
    }

    @ApiOperation({ summary: 'Obtém todas as vendas.' })
    @ApiOkResponse({ description: 'Lista com todas as vendas.', type: RegisterVendaDto, isArray: true })
    @Get()
    async findAll(): Promise<ReturnVendaDto[]> {
        try {
            return (await this.vendaService.findAll()).map((venda) => new ReturnVendaDto(venda));
        } catch (error) {
            throw new HttpException('Erro ao buscar vendas.', error.message);
        }
    }

    @ApiOperation({ summary: "Encontra uma venda pelo seu id" })
    @ApiOkResponse({ description: "Associação encontrada", type: RegisterVendaDto })
    @Get(':id')
    async findByid(@Param('id') id: number): Promise<ReturnVendaDto> {
        try {
            return new ReturnVendaDto(await this.vendaService.findById(id));
        } catch (error) {
            throw new HttpException('Venda não encontrada.', HttpStatus.NOT_FOUND);
        }
    }

    @ApiOperation({summary: "Retorna todas as vendas entre duas datas."})
    @ApiOkResponse({description: "Vendas encontradas"})
    @Get('findBetweenDates/dates')
    async findBetweenDates(
        @Query('datainicio') dataInicio:string = new Date().toString(), 
        @Query('datafim') dataFim:string = new Date().toString()):Promise<Venda[]>{
            let dataInicioConvertida = parse(dataInicio, 'dd/MM/yyyy', new Date());
            let dataFimConvertida = parse(dataFim, 'dd/MM/yyyy', new Date());

            if(isDate(dataInicioConvertida) && isDate(dataFimConvertida)){
                if(dataFimConvertida >= dataInicioConvertida){
                    return await this.vendaService.findBetweenDates(dataInicioConvertida, dataFimConvertida);
                }
                throw new BadRequestException("Data de início deve ser anterior a data de fim.");
            }
            throw new BadRequestException("Dados fornecidos não são datas válidas");
        }

        @ApiOperation({summary: "Retorna todas as vendas entre duas datas."})
        @ApiOkResponse({description: "Vendas encontradas"})
        @Get('findBetweenDates/:id')
        async findByIdBetweenDates(
            @Param('id') idCatador:number,
            @Query('datainicio') dataInicio:string = new Date().toString(), 
            @Query('datafim') dataFim:string = new Date().toString()):Promise<Venda[]>{
                let dataInicioConvertida = parse(dataInicio, 'dd/MM/yyyy', new Date());
                let dataFimConvertida = parse(dataFim, 'dd/MM/yyyy', new Date());
    
                if(isDate(dataInicioConvertida) && isDate(dataFimConvertida)){
                    if(dataFimConvertida >= dataInicioConvertida){
                        return await this.vendaService.findByAssociacaoAndBetweenDates(idCatador, dataInicioConvertida, dataFimConvertida);
                    }
                    throw new BadRequestException("Data de início deve ser anterior a data de fim.");
                }
                throw new BadRequestException("Dados fornecidos não são datas válidas");
            }

    @ApiOperation({ summary: "Atualiza informações de uma associação." })
    @ApiOkResponse({ description: "Dados da venda atualizadas com sucesso", type: UpdateVendaDto })
    @ApiBody({ type: UpdateVendaDto })
    @Put(':id')
    async update(@Param('id') id: number, @Body() venda: UpdateVendaDto): Promise<Venda> {
        try {
            return await this.vendaService.update(id, venda);
        } catch (error) {
            throw new HttpException('Erro ao atualizar venda.', error.message);
        }
    }

    @ApiOperation({ summary: "Apaga informações de uma Venda" })
    @ApiOkResponse({ description: "Venda apagada com sucesso" })
    @Delete(":id")
    async delete(@Param("id") id: number) {
        try {
            await this.vendaService.delete(id);
        } catch (error) {
            throw new HttpException('Erro ao apagar venda.', error.message);
        }
    }
}
