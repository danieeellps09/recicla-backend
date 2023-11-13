import { VendaMaterialDto } from "../dto/venda-produto.dto";
import { VendaMaterial } from "./venda-material.entity";

export class Venda {
    id?: number;
    idAssociacao?: number;
    empresaCompradora?: string;
    notaFiscal?:string;
    dataVenda?: Date;

    materiais?: VendaMaterial[];
  }
  