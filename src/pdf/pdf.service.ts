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
import { Material } from 'src/material/entities/material.entity';
import { MaterialService } from 'src/material/material.service';

@Injectable()
export class PdfService {

  constructor(
    private readonly catadorService:CatadorService, 
    private readonly coletaService:ColetaService,
    private readonly associacaoService:AssociacoesService,
    private readonly vendaService:VendaService,
    private readonly materialService:MaterialService){}

    style:string = `<style type="text/css">
    *{
        margin:0;
        padding: 0;
    }
    html {
      -webkit-print-color-adjust: exact;
    }
    body {
        font-family: sans-serif;
        padding: 0 100px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    #container-logo{
      height: 40px;
      padding: 30px;
      min-width: 10px;
      background-color: #E1621E;
      border-radius: 30px;
      margin-bottom: 30px;
    }

    #container-logo img{
      height: 100%;
    }

    h1, h2, h3 {
        text-transform: uppercase;
        color: #E1621E;
        text-align: center;
        margin-bottom: 30px;
        width: 100%;
    }

    .container {
        border:#E1621E 2px solid;
        border-radius: 30px;
        padding: 20px 30px;
        width:100%;
        margin-bottom: 50px;

        display: flex;
        flex-direction: column;
        align-items: start;
    }

    p{
        color:rgb(95, 95, 95);
        font-size: 20px;
        margin-bottom: 10px;
        width: 100%;
        font-display: inherit;
    }

    .linha{
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        width: 100%;
    }

    .linha p{
        width:50%;
        font-size: 20px;
    }

    .margin-top{
      margin-top: 30px;
    }

    ul{
      margin-left: 20px;
      color: #E1621E;
      font-size: 30px;
    }
</style>`

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
          ${this.style}
        </head>
        ${this.formatarColetas(new DadosColeta(catador, resumoColetas, dataInicio, dataFim, coletas), comprovanteCompleto)}
        </html>
      `;

      await page.setContent(html);

      const pdfBuffer = await page.pdf({ 
        format: 'A4',
        margin: {
          top: '50px',
          bottom: '50px',
        }
      });
      await browser.close();

      return pdfBuffer;
    }
    catch (error) {
      throw new InternalServerErrorException("Ocorreu um erro ao gerar PDF.")
    }

  }

  async generateComprovanteVendaAssociacao(associacaoId:number, comprovanteCompleto:boolean, dataInicio:Date, dataFim:Date):Promise<Buffer>{

    let associacao:Associacao = null;
    let vendas:Venda[];
    if(associacaoId != null){
      associacao = await this.associacaoService.findById(associacaoId);
      vendas = await this.vendaService.findByAssociacaoAndBetweenDates(associacaoId, dataInicio, dataFim);
    }
    else{
      vendas = await this.vendaService.findBetweenDates(dataInicio, dataFim);
    }
    
    const resumoVendas = new ResumoVenda(vendas, await this.materialService.findAll());

    try {
      const browser = await puppeteer.launch({ headless: "new" });
      const page = await browser.newPage();

      let html = `
        <html>
        <head>
        ${this.style}
        </head>
        ${this.formatarVendas(new DadosVenda(associacao, resumoVendas, dataInicio, dataFim, vendas), comprovanteCompleto)}
        </html>
      `;

      await page.setContent(html);

      const pdfBuffer = await page.pdf({ 
        format: 'A4',
        margin: {
          top: '50px',
          bottom: '50px',
        } });
      await browser.close();

      return pdfBuffer;
    }
    catch (error) {
      throw new InternalServerErrorException("Ocorreu um erro ao gerar PDF.")
    }

  }

  formatarColetas(dadosColeta: DadosColeta, comprovanteCompleto:boolean): string{
    const catadorInfo = dadosColeta.catador != null ? `
      <div class="container">
        <h2>Dados de catador</h2>
        <div class="linha">
          <p><b>Catador</b>: ${dadosColeta.catador.user.name}</p>
          <p><b>CPF</b>: ${dadosColeta.catador.cpf}</p>
        </div>
        <div class="linha">
          <p><b>Bairro</b>: ${dadosColeta.catador.bairro}</p>
          <p><b>Endereço</b>: ${dadosColeta.catador.endereco}</p>
        </div>
      </div>` : "";

    const resumo = `
    <div class="container"> 
      <h2>Resumo da Coleta</h2>
      <p><b>Datas</b>: ${format(dadosColeta.dataInicio, 'dd/MM/yyyy') } - ${format(dadosColeta.dataFim, 'dd/MM/yyyy')}</p>
      <p><b>Quantidade de coletas realizadas</b>: ${dadosColeta.resumoColetas.quantidadeColetas}</p>
      <p><b>Quantidade de resíduos coletados</b>: ${dadosColeta.resumoColetas.quantidadeColetada} kg</p>
    </div>`;

    let main = "";
    if(comprovanteCompleto){
      main += "<h2>Coletas realizadas:</h2>";
      for(let coleta of dadosColeta.coletas){
        const coletaFormatada = `
        <div class = "container">
          ${dadosColeta.catador != null ? "" : `
            <p><b>Nome do catador</b>: ${coleta.catador.user.name}</p>
            <p><b>Cpf do catador</b>: ${coleta.catador.cpf}</p>
          `}
          <p><b>Nome do associacao</b>: ${coleta.associacao.user.name}</p>
          <p><b>CNPJ da associacao</b>: ${coleta.associacao.cnpj}</p>
          <p><b>Data</b>: ${format(coleta.dataColeta, 'dd/MM/yyyy')}</p>
          <p><b>Veículo utilizado</b>: ${coleta.veiculo.nomeVeiculo}</p>
          <p><b>Quantidade de resíduos coletados</b>: ${coleta.quantidade} kg</p>
          <p><b>Todos os pontos coletados</b>: ${coleta.pergunta? 'Sim':'Não'}</p>
          <p><b>Motivo</b>: ${coleta.motivo == null || coleta.motivo == "" ? '--' : coleta.motivo}</p>
        </div>`;
        main += coletaFormatada;
      }
    }
    return `<body>
              <div id="container-logo">
                <img src="https://drive.google.com/uc?export=download&id=16E44t6GPW24wkxOBbLIiag1LJptWokk1" alt="">
              </div>
              <h1>Comprovante de coletas</h1>
              ${catadorInfo}
              ${resumo}
              ${main}
            </body>`
  }

  formatarVendas(dadosVenda: DadosVenda, comprovanteCompleto:boolean): string{
    const associacaoInfo = dadosVenda.associacao != null ? `
      <div class="container">
        <h2>Informações da Associação</h2>
        <div class="linha">
          <p><b>Associação</b>: ${dadosVenda.associacao.user.name}</p>
          <p><b>CNPJ</b>: ${dadosVenda.associacao.cnpj}</p>
        </div>
        <div class="linha">
          <p><b>Bairro</b>: ${dadosVenda.associacao.bairro}</p>
          <p><b>Endereço</b>: ${dadosVenda.associacao.endereco}</p>
        </div>
      </div>`:"";
    let resumoMateriais = '';
    dadosVenda.resumoVendas.vendasPorMaterial.forEach((vendaPorMaterial => 
      resumoMateriais += `<li>
        <p><b>${vendaPorMaterial.nome}</b>: ${vendaPorMaterial.quantidade} kg</p>
      </li>`)
    )

    const resumoVendas = `
    <div class="container"> 
      <h2>Resumo Vendas</h2>
      <p><b>Datas</b>: ${format(dadosVenda.dataInicio, 'dd/MM/yyyy') } - ${format(dadosVenda.dataFim, 'dd/MM/yyyy')}</p>
      <p><b>Quantidade de coletas realizadas</b>: ${dadosVenda.resumoVendas.quantidadeVendas}</p>
      <h3 class="margin-top">Total de materiais vendidos:</h3>
      <ul>
        ${resumoMateriais}
      </ul>
    </div>`;

    let main = "";
    if(comprovanteCompleto){
      main += "<h2>Vendas realizadas:</h2>";
      for(let venda of dadosVenda.vendas){
        let materiais = '';
        venda.materiais.forEach(material =>{
          materiais += `<li><p><b>${material.material.nome}</b>: ${material.quantidadeVendida} kg</p></li>`
        })
        const coletaFormatada = `<div class="container">
          ${dadosVenda.associacao != null ? "" : `
            <p><b>Nome da associação</b>: ${venda.associacao.user.name}</p>
            <p><b>Cpf da associaçao</b>: ${venda.associacao.cnpj}</p>
          `}
          <p><b>Empresa compradora</b>: ${venda.empresaCompradora}</p>
          <p><b>Nota fiscal</b>: ${venda.notaFiscal}</p>
          <p><b>Data</b>: ${format(venda.dataVenda, 'dd/MM/yyyy')}</p>
          <h3 class="margin-top">Materiais vendidos:</h3>
          <ul>
            ${materiais}
          </ul>
        </div>`;
        main += coletaFormatada;
      }
    }
    return `<body>
              <div id="container-logo">
                <img src="https://drive.google.com/uc?export=download&id=16E44t6GPW24wkxOBbLIiag1LJptWokk1" alt="">
              </div>
              <h1>Comprovante de vendas</h1>
              ${associacaoInfo}
              ${resumoVendas}
              ${main}
            </body>`
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

class ResumoVenda{
  constructor(vendas:Venda[], materiais:Material[]){
    this.quantidadeVendas = vendas.length;

    let materiaisMap = new Map<Number, VendaMaterial>();
    materiais.forEach(material => materiaisMap.set(material.id, new VendaMaterial(material)));

    vendas.forEach((venda) => {
      venda.materiais.forEach(material => {
        materiaisMap.get(material.material.id).quantidade += material.quantidadeVendida;
      });
    })

    this.vendasPorMaterial = Array.from(materiaisMap.values());

  }

  quantidadeVendas:number;
  vendasPorMaterial:VendaMaterial[];
}

class VendaMaterial{
  constructor(material:Material){
    this.id = material.id;
    this.nome = material.nome;
    this.quantidade = 0;
  }

  id:number;
  nome:String;
  quantidade:number
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

class DadosVenda{

  constructor(associacao:Associacao, resumoVendas: ResumoVenda, dataInicio:Date, dataFim:Date, vendas:Venda[]){
    this.associacao = associacao;
    this.vendas = vendas;
    this.resumoVendas = resumoVendas;
    this.dataInicio = dataInicio;
    this.dataFim = dataFim;
  }

  dataInicio:Date;
  dataFim:Date;
  associacao:Associacao;
  vendas:Venda[];
  resumoVendas:ResumoVenda;
}