import { BadRequestException, Controller, Get, Param, Query, Res } from '@nestjs/common';
import { ApiOperation, ApiProduces, ApiTags } from '@nestjs/swagger';
import { PdfService } from './pdf.service';
import { isPublic } from 'src/auth/decorators/is-public.decorator';
import { Response } from 'express';
import { isDate, parse } from 'date-fns';

@Controller('pdf')
@ApiTags('PDF')
@isPublic()
export class PdfController {
    constructor(private readonly pdfService: PdfService) { }

    @Get()
    @ApiOperation({ summary: 'Gera um PDF com estilos CSS.' })
    @ApiProduces('application/pdf')
    async generatePDF(@Res() res: Response) {
        const pdfBuffer = await this.pdfService.generatePdfExemple();

        res.setHeader('Content-Disposition', 'attachment; filename=downloaded-file.pdf');
        res.setHeader('Content-Type', 'application/pdf');
        res.send(pdfBuffer);
    }

    @Get()
    @ApiOperation({ summary: 'Gera um PDF com estilos CSS.' })
    @ApiProduces('application/pdf')
    async generatePdfColetasCatador(@Res() res: Response,
        @Param('id') idCatador: number,
        @Query('completo') comprovanteCompleto: boolean = false,
        @Query('datainicio') dataInicio: string = new Date().toString(),
        @Query('datafim') dataFim: string = new Date().toString()) {
        let dataInicioConvertida = parse(dataInicio, 'dd/MM/yyyy', new Date());
        let dataFimConvertida = parse(dataFim, 'dd/MM/yyyy', new Date());

        if (isDate(dataInicioConvertida) && isDate(dataFimConvertida)) {
            if (dataFimConvertida >= dataInicioConvertida) {
                const pdfBuffer = await this.pdfService.generateComprovanteColetasCatador(idCatador, comprovanteCompleto, dataInicioConvertida, dataFimConvertida);

                res.setHeader('Content-Disposition', 'attachment; filename=downloaded-file.pdf');
                res.setHeader('Content-Type', 'application/pdf');
                res.send(pdfBuffer);
            }
            throw new BadRequestException("Data de início deve ser anterior a data de fim.");
        }
        throw new BadRequestException("Dados fornecidos não são datas válidas");

    }
}
