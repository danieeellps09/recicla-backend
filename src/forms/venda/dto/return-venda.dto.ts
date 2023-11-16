import { VendaMaterial } from "../entities/venda-material.entity";
import { Venda } from "../entities/venda.entity";

export class ReturnVendaDto{

    constructor(venda:Venda){
        this.id = venda.id;
        this.idAssociacao = venda.idAssociacao;
        this.empresaCompradora = venda.empresaCompradora;
        this.notaFiscal = venda.notaFiscal;
        this.dataVenda = venda.dataVenda;
        this.materiais = venda.materiais.map((material) => new ReturnVendaMaterialDto(material));
    }

    id: number;
    idAssociacao: number;
    empresaCompradora: string;
    notaFiscal:string;
    dataVenda: Date;

    materiais: ReturnVendaMaterialDto[];
}

export class ReturnVendaMaterialDto{

    constructor(vendaMaterial: VendaMaterial){
        this.id = vendaMaterial.id;
        this.idMaterial = vendaMaterial.idMaterial;
        this.nomeMaterial = vendaMaterial.material.nome;
        this.quantidadeVendida = vendaMaterial.quantidadeVendida;
    }

    id:number;
    idMaterial:number;
    nomeMaterial:string;
    quantidadeVendida:number;
}