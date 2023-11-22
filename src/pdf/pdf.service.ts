import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { format } from 'date-fns';
import puppeteer from 'puppeteer';
import { AssociacoesService } from 'src/associacoes/associacoes.service';
import { Associacao } from 'src/associacoes/entities/associacao.entity';
import { CatadorService } from 'src/catador/catador.service';
import { Catador } from 'src/catador/entities/catador.entity';
import { ColetaService } from 'src/forms/coleta/coleta.service';
import { Coleta } from 'src/forms/coleta/entities/coleta.entity';
import { Venda } from 'src/forms/venda/entities/venda.entity';
import { VendaService } from 'src/forms/venda/venda.service';

@Injectable()
export class PdfService {

  constructor(
    private readonly catadorService:CatadorService, 
    private readonly coletaService:ColetaService){}

  async generateComprovanteColetasCatador(catadorId:number, comprovanteCompleto:boolean, dataInicio:Date, dataFim:Date):Promise<Buffer>{

    let catador:Catador = null;
    let coletas:Coleta[];
    if(catadorId != null){
      catador = await this.catadorService.findOne(catadorId);
      coletas = await this.coletaService.findByCatadorAndBetweenDates(catadorId, dataInicio, dataFim);
    }
    else{
      coletas = await this.coletaService.findBetweenDates(dataInicio, dataFim);
    }
    
    const resumoColetas = new ResumoColeta(coletas);

    try {
      const browser = await puppeteer.launch({ headless: "new" });
      const page = await browser.newPage();

      let html = `
        <html>
        <head>
          <style type="text/css">
            body {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            }
            header {
              border: 1px solid black;
              padding: 10px;
              margin-bottom: 10px;
            }
          </style>
        </head>
        ${this.formatarColetas(new DadosColeta(catador, resumoColetas, dataInicio, dataFim, coletas), comprovanteCompleto)}
        </html>
      `;

      await page.setContent(html);

      const pdfBuffer = await page.pdf({ format: 'A4' });
      await browser.close();

      return pdfBuffer;
    }
    catch (error) {
      throw new InternalServerErrorException("Ocorreu um erro ao gerar PDF.")
    }

  }

  formatarColetas(dadosColeta: DadosColeta, comprovanteCompleto:boolean): string{
    const catadorInfo = dadosColeta.catador == null? "" : `<p><b>Catador</b>: ${dadosColeta.catador.user.name}</p><p><b>CPF</b>: ${dadosColeta.catador.cpf}</p>`;
    const header = `<header> 
      ${catadorInfo}
      <p><b>Datas</b>: ${format(dadosColeta.dataInicio, 'dd/MM/yyyy') } - ${format(dadosColeta.dataFim, 'dd/MM/yyyy')}</p>
      <p><b>Quantidade de coletas realizadas</b>: ${dadosColeta.resumoColetas.quantidadeColetas}</p>
      <p><b>Quantidade de resíduos coletados</b>: ${dadosColeta.resumoColetas.quantidadeColetada} kg</p>
    </header>`;

    let main = "";
    if(comprovanteCompleto){
      main += "<h2>Coletas realizadas:</h2>";
      for(let coleta of dadosColeta.coletas){
        const coletaFormatada = `<div>
          ${dadosColeta.catador != null ? "" : `
            <p><b>Nome do catador</b>: ${coleta.catador.user.name}</p>
            <p><b>Cpf do catador</b>: ${coleta.catador.cpf}</p>
          `}
          <p><b>Nome do associacao</b>: ${coleta.associacao.user.name}</p>
          <p><b>CNPJ da associacao</b>: ${coleta.associacao.cnpj}</p>
          <p><b>Data</b>: ${format(coleta.dataColeta, 'dd/MM/yyyy')}</p>
          <p><b>Quantidade de resíduos coletados</b>: ${coleta.quantidade} kg</p>
          <p><b>Todos os pontos coletados</b>: ${coleta.pergunta? 'Sim':'Não'}</p>
          <p><b>Motivo</b>: ${coleta.motivo == null || coleta.motivo == "" ? '--' : coleta.motivo}</p>
        </div>`;
        main += coletaFormatada;
      }
    }
    return `<body><h1>Comprovante de coletas</h1>${header}${main}</body>`
  }
}

class ResumoColeta{
  constructor(coletas:Coleta[]){
    this.quantidadeColetas = coletas.length;
    this.quantidadeColetada = coletas.reduce((quantidade, coleta) => quantidade + coleta.quantidade,0);
  }

  quantidadeColetas: number;
  quantidadeColetada: number;
}

class DadosColeta{

  constructor(catador:Catador, resumoColetas: ResumoColeta, dataInicio:Date, dataFim:Date, coletas:Coleta[]){
    this.catador = catador;
    this.coletas = coletas;
    this.resumoColetas = resumoColetas;
    this.dataInicio = dataInicio;
    this.dataFim = dataFim;
  }

  dataInicio:Date;
  dataFim:Date;
  catador:Catador;
  coletas:Coleta[];
  resumoColetas: ResumoColeta;
}