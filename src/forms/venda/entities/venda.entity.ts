import { VendaMaterialDto } from "../dto/venda-produto.dto";

export class Venda {
    id?: number;
    idAssociacao?: number;
    empresaCompradora?: string;
    qtdVendida?: number;
    notaFiscal?:string;
    dataVenda?: Date;

    materiais?: VendaMaterialDto;
  }
  