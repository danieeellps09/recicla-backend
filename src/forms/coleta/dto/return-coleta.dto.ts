import { Coleta } from "../entities/coleta.entity";

export class ReturnColetaDto {

    constructor(coleta:Coleta){
        this.id = coleta.id;
        this.idCatador = coleta.idCatador;
        this.idAssociacao = coleta.idAssociacao;
        this.idVeiculo = coleta.idVeiculo;
        this.quantidade = coleta.quantidade;
        this.pergunta = coleta.pergunta;
        this.motivo = coleta.motivo;
        this.dataColeta = coleta.dataColeta;
        this.numRota = coleta.numRota;
    }

    id?: number;
    idCatador?: number;
    idAssociacao?: number;
    idVeiculo?: number;
    quantidade?: number;
    pergunta?:boolean;
    motivo?:string;
    dataColeta?: Date;
    numRota?:number;
  }