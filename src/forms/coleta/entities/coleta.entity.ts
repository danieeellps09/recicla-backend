import { Associacao } from "src/associacoes/entities/associacao.entity";
import { Catador } from "src/catador/entities/catador.entity";
import { Veiculo } from "src/veiculo/entities/veiculo.entity";

export class Coleta {
    id?: number;
    idCatador?: number;
    idAssociacao?: number;
    idVeiculo?: number;
    quantidade?: number;
    pergunta?:boolean;
    motivo?:string;
    dataColeta?: Date;
    numRota?:number;
    catador?:Catador;
    associacao?:Associacao;
    veiculo?:Veiculo;
  }
  