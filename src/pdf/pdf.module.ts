import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PdfController } from './pdf.controller';
import { CatadorModule } from 'src/catador/catador.module';
import { FormsModule } from 'src/forms/forms.module';
import { ColetaService } from 'src/forms/coleta/coleta.service';
import { CatadorService } from 'src/catador/catador.service';

@Module({
  imports: [CatadorModule, FormsModule],
  providers: [PdfService, CatadorService, ColetaService],
  controllers: [PdfController]
})
export class PdfModule {}
