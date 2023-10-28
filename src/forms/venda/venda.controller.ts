import { BadRequestException, Body, Controller, Delete, Get, HttpException, HttpStatus, Logger, Param, Post, Put, Req } from '@nestjs/common';
import { VendaService } from './venda.service';
import { isPublic } from 'src/auth/decorators/is-public.decorator';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterVendaDto } from './dto/register-venda-dto';
import { CatadorService } from 'src/catador/catador.service';
import { AssociacoesService } from 'src/associacoes/associacoes.service';
import { Venda, User } from '@prisma/client';
import { AuthRequest } from 'src/auth/models/AuthRequest';
import { CurrentUserLogged } from 'src/auth/decorators/current-users-decorator';
import { UpdateVendaDto } from './dto/update-venda-dto';
import { format, isDate, parse } from 'date-fns';

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
    async create(@Body() registerVendaDto: RegisterVendaDto, @Req() req: AuthRequest): Promise<Venda> {
        try {
            let dataConvertida: Date;

            if (registerVendaDto.dataVenda && isDate(parse(registerVendaDto.dataVenda, 'dd/MM/yyyy', new Date()))) {
                dataConvertida = parse(registerVendaDto.dataVenda, 'dd/MM/yyyy', new Date());
            } else {
                dataConvertida = new Date();
            }

            const dataFormatada: string = format(dataConvertida, "yyyy-MM-dd'T'HH:mm:ss.SSS");

            return await this.vendaService.create(registerVendaDto, req);
        } catch (error) {
            console.error(error);
            throw new BadRequestException(error.message);
        }
    }

    @ApiOperation({ summary: 'Obtém todas as associações.' })
    @ApiOkResponse({ description: 'Lista com todas as associações.', type: RegisterVendaDto, isArray: true })
    @Get()
    async findAll(): Promise<Venda[]> {
        try {
            return await this.vendaService.findAll();
        } catch (error) {
            throw new HttpException('Erro ao buscar associações.', error.message);
        }
    }

    @ApiOperation({ summary: "Encontra uma venda pelo seu id" })
    @ApiOkResponse({ description: "Associação encontrada", type: RegisterVendaDto })
    @Get(':id')
    async findByid(@Param('id') id: number): Promise<Venda> {
        try {
            return await this.vendaService.findById(id);
        } catch (error) {
            throw new HttpException('Venda não encontrada.', HttpStatus.NOT_FOUND);
        }
    }

    @ApiOperation({ summary: "Atualiza informações de uma associação." })
    @ApiOkResponse({ description: "Dados da venda atualizadas com sucesso", type: UpdateVendaDto })
    @ApiBody({ type: UpdateVendaDto })
    @Put(':id')
    async update(@Param('id') id: number, @Body() venda: UpdateVendaDto): Promise<Venda> {
        try {
            return await this.vendaService.update(id, venda);
        } catch (error) {
            throw new HttpException('Erro ao atualizar associação.', error.message);
        }
    }

    @ApiOperation({ summary: "Apaga informações de uma Venda" })
    @ApiOkResponse({ description: "Venda apagada com sucesso" })
    @Delete(":id")
    async delete(@Param("id") id: number) {
        try {
            await this.vendaService.delete(id);
        } catch (error) {
            throw new HttpException('Erro ao apagar associação.', error.message);
        }
    }
}
