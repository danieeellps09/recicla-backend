import { Controller, Get, Res } from '@nestjs/common';
import { ApiOperation, ApiProduces, ApiTags } from '@nestjs/swagger';
import { PdfService } from './pdf.service';
import { isPublic } from 'src/auth/decorators/is-public.decorator';
import { Response } from 'express';

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
}
