import { BadRequestException, Controller, Get, Param, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiProduces, ApiTags } from '@nestjs/swagger';
import { PdfService } from './pdf.service';
import { Response } from 'express';
import { isDate, parse } from 'date-fns';
import { AuthRequest } from 'src/auth/models/AuthRequest';
import { Roles } from 'src/role/decorators/role.decorator';
import { UserRole } from 'src/role/enums/roles.enum';
import { RolesGuard } from 'src/role/guards/role.guard';
import { CatadorService } from 'src/catador/catador.service';
import { AssociacoesService } from 'src/associacoes/associacoes.service';

@Controller('api/v1/pdf')
@ApiTags('PDF')
@ApiBearerAuth()
export class PdfController {
    constructor(
        private readonly pdfService: PdfService,
        private readonly catadorService:CatadorService,
        private readonly associacaoService:AssociacoesService
    ) { }

    @Get('coleta/:id')
    @ApiOperation({ summary: 'Gera comprovante de coleta.' })
    @ApiProduces('application/pdf')
    async generatePdfColetasCatador(@Res() res: Response,
        @Param('id') idCatador: number,
        @Query('completo') comprovanteCompleto: boolean = false,
        @Query('datainicio') dataInicio: string = new Date().toString(),
        @Query('datafim') dataFim: string = new Date().toString()) {

        const datas = this.converterData(dataInicio, dataFim);
        const pdfBuffer = await this.pdfService.generateComprovanteColetasCatador(idCatador, comprovanteCompleto, datas.dataInicio, datas.dataFim);

        return res.contentType('application/pdf')
            .attachment('comprovante.pdf')
            .send(pdfBuffer);

    }

    @Get('coleta-catador')
    @ApiOperation({ summary: 'Gera comprovante de coleta.' })
    @ApiProduces('application/pdf')
    @Roles(UserRole.CATADOR) 
    @UseGuards(RolesGuard)
    async generatePdfColetasCatadorLogado(
        @Res() res: Response,
        @Req() req:AuthRequest,
        @Query('completo') comprovanteCompleto: boolean = false,
        @Query('datainicio') dataInicio: string = new Date().toString(),
        @Query('datafim') dataFim: string = new Date().toString()) {

        const datas = this.converterData(dataInicio, dataFim);
        const catadorId = (await this.catadorService.getCatadorByUserID(req.user.id)).id
        const pdfBuffer = await this.pdfService.generateComprovanteColetasCatador(catadorId, comprovanteCompleto, datas.dataInicio, datas.dataFim);

        return res.contentType('application/pdf')
            .attachment('comprovante.pdf')
            .send(pdfBuffer);

    }

    @Get('coleta')
    @ApiOperation({ summary: 'Gera comprovante de coleta.' })
    @ApiProduces('application/pdf')
    async generatePdfColetas(@Res() res: Response,
        @Query('completo') comprovanteCompleto: boolean = false,
        @Query('datainicio') dataInicio: string = new Date().toString(),
        @Query('datafim') dataFim: string = new Date().toString()) {
            const datas = this.converterData(dataInicio, dataFim);
            const pdfBuffer = await this.pdfService.generateComprovanteColetasCatador(null, comprovanteCompleto, datas.dataInicio, datas.dataFim);
    
            return res.contentType('application/pdf')
                .attachment('comprovante.pdf')
                .send(pdfBuffer);

    }

    @Get('venda/:id')
    @ApiOperation({ summary: 'Gera comprovante de venda.' })
    @ApiProduces('application/pdf')
    async generatePdfVendaAssociacao(@Res() res: Response,
        @Param('id') idAssociacao: number,
        @Query('completo') comprovanteCompleto: boolean = false,
        @Query('datainicio') dataInicio: string = new Date().toString(),
        @Query('datafim') dataFim: string = new Date().toString()) {
        
        const datas = this.converterData(dataInicio, dataFim);
        const pdfBuffer = await this.pdfService.generateComprovanteVendaAssociacao(idAssociacao, comprovanteCompleto, datas.dataInicio, datas.dataFim);

        return res.contentType('application/pdf')
            .attachment('comprovante.pdf')
            .send(pdfBuffer);
    }

    @Get('venda-associacao')
    @ApiOperation({ summary: 'Gera comprovante de venda.' })
    @ApiProduces('application/pdf')
    @Roles(UserRole.ASSOCIACAO) 
    @UseGuards(RolesGuard)
    async generatePdfVendaAssociacaoLogada(@Res() res: Response,
        @Req() req:AuthRequest,
        @Query('completo') comprovanteCompleto: boolean = false,
        @Query('datainicio') dataInicio: string = new Date().toString(),
        @Query('datafim') dataFim: string = new Date().toString()) {
        
        const datas = this.converterData(dataInicio, dataFim);
        const associacaoId = (await this.associacaoService.getAssociacaoByUserID(req.user.id)).id;
        const pdfBuffer = await this.pdfService.generateComprovanteVendaAssociacao(associacaoId, comprovanteCompleto, datas.dataInicio, datas.dataFim);

        return res.contentType('application/pdf')
            .attachment('comprovante.pdf')
            .send(pdfBuffer);
    }

    @Get('venda')
    @ApiOperation({ summary: 'Gera comprovante de venda.' })
    @ApiProduces('application/pdf')
    async generatePdfVenda(@Res() res: Response,
        @Query('completo') comprovanteCompleto: boolean = false,
        @Query('datainicio') dataInicio: string = new Date().toString(),
        @Query('datafim') dataFim: string = new Date().toString()) {
            const datas = this.converterData(dataInicio, dataFim);
            const pdfBuffer = await this.pdfService.generateComprovanteVendaAssociacao(null, comprovanteCompleto, datas.dataInicio, datas.dataFim);
    
            return res.contentType('application/pdf')
                .attachment('comprovante.pdf')
                .send(pdfBuffer);
    }

    converterData(dataInicio:string, dataFim:string):Datas{
        let dataInicioConvertida = parse(dataInicio, 'dd/MM/yyyy', new Date());
        let dataFimConvertida = parse(dataFim, 'dd/MM/yyyy', new Date());

        if (isDate(dataInicioConvertida) && isDate(dataFimConvertida)) {
            if (dataFimConvertida >= dataInicioConvertida) {
                return new Datas(dataInicioConvertida, dataFimConvertida);
            }
            throw new BadRequestException("Data de início deve ser anterior a data de fim.");
        }
        throw new BadRequestException("Dados fornecidos não são datas válidas");
    }
}

class Datas{
    constructor(dataInicio:Date, dataFim:Date){
        this.dataInicio = dataInicio;
        this.dataFim = dataFim;
    }
    dataInicio:Date;
    dataFim:Date;
}