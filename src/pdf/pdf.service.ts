import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
                color: #333;
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

      await page.setContent(this.formatarColetas(new DadosColeta(catador, resumoColetas, dataInicio, dataFim, coletas), comprovanteCompleto));

      const pdfBuffer = await page.pdf({ format: 'A4' });
      await browser.close();

      return pdfBuffer;
    }
    catch (error) {
      throw new InternalServerErrorException("Ocorreu um erro ao gerar PDF.")
    }

  }

  formatarColetas(dadosColeta: DadosColeta, comprovanteCompleto:boolean): string{
    const header = `<header><h1>Comprovante de coletas</h1> 
      <p>Catador: ${dadosColeta.catador.user.name}</p>
      <p>CPF: ${dadosColeta.catador.cpf}</p>
      <p>Datas: ${dadosColeta.dataInicio} - ${dadosColeta.dataFim}</p>
      <p>Quantidade de coletas realizadas: ${dadosColeta.resumoColetas.quantidadeColetas}</p>
      <p>Quantidade de resíduos coletados: ${dadosColeta.resumoColetas.quantidadeColetada} kg</p>
    </header>`;

    let main = "";
    if(comprovanteCompleto){
      for(let coleta of dadosColeta.coletas){
        const coletaFormatada = `<div>
          <p>Data: ${coleta.dataColeta}</p>
          <p>Quantidade de resíduos coletados: ${coleta.quantidade} kg</p>
          <p>Todos os pontos coletados: ${coleta.pergunta? 'Sim':'Não'}</p>
          <p>Motivo: ${coleta.motivo == null || coleta.motivo == "" ? '--' : coleta.motivo}</p>
        </div>`;
        main += coletaFormatada;
      }
    }
    return header + `<body>${main}</body>`
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