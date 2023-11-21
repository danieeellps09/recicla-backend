import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { format } from 'date-fns';
import puppeteer from 'puppeteer';
import { CatadorService } from 'src/catador/catador.service';
import { Catador } from 'src/catador/entities/catador.entity';
import { ColetaService } from 'src/forms/coleta/coleta.service';
import { Coleta } from 'src/forms/coleta/entities/coleta.entity';

@Injectable()
export class PdfService {

  constructor(private readonly catadorService:CatadorService, private readonly coletaService:ColetaService){}

  async generatePdfExemple(): Promise<Buffer> {

    try {
      const browser = await puppeteer.launch({ headless: "new" });
      const page = await browser.newPage();

      await page.setContent(`
        <html>
          <head>
            <style>
              body {
                font-size: 18px;
                color: #ff0000;
              }
              body p{
                text-align: right;
              }
            </style>
          </head>
          <body>
            <h1>Meu PDF com Nest.js e CSS</h1>
            <p>Este é um exemplo de como aplicar estilos CSS a um PDF.</p>
          </body>
        </html>
      `);

      const pdfBuffer = await page.pdf({ format: 'A4' });
      await browser.close();

      return pdfBuffer;
    }
    catch (error) {
      throw new InternalServerErrorException("Ocorreu um erro ao gerar PDF.")
    }

  }

  async generateComprovanteColetasCatador(catadorId:number, comprovanteCompleto:boolean, dataInicio:Date, dataFim:Date):Promise<Buffer>{
    const catador = await this.catadorService.findOne(catadorId);
    const coletas = await this.coletaService.findByCatadorAndBetweenDates(catadorId, dataInicio, dataFim);

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
    const header = `<header> 
      <p><b>Catador</b>: ${dadosColeta.catador.user.name}</p>
      <p><b>CPF</b>: ${dadosColeta.catador.cpf}</p>
      <p><b>Datas</b>: ${format(dadosColeta.dataInicio, 'dd/MM/yyyy') } - ${format(dadosColeta.dataFim, 'dd/MM/yyyy')}</p>
      <p><b>Quantidade de coletas realizadas</b>: ${dadosColeta.resumoColetas.quantidadeColetas}</p>
      <p><b>Quantidade de resíduos coletados</b>: ${dadosColeta.resumoColetas.quantidadeColetada} kg</p>
    </header>`;

    let main = "<h2>Coletas realizadas:</h2>";
    if(comprovanteCompleto){
      for(let coleta of dadosColeta.coletas){
        const coletaFormatada = `<div>
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