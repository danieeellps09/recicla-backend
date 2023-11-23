import { Associacao } from "src/associacoes/entities/associacao.entity";
import { VendaMaterial } from "./venda-material.entity";

export class Venda {
    id?: number;
    idAssociacao?: number;
    empresaCompradora?: string;
    notaFiscal?:string;
    dataVenda?: Date;

    associacao?:Associacao

    materiais?: VendaMaterial[];
  }
  